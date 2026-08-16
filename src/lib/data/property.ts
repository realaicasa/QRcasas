import "server-only";

import { getTeableConfig, TeableClient, type SqlRow, qiTable, linkId, linkTitle } from "./teable/client";
import { lit, qi } from "./teable/sql";
import { DB_TABLES, TABLES } from "./teable/tables";
import { FIELDS } from "./teable/fields.generated";
import { publicEligibilityWhere } from "./eligibility";
import { TAGS, invalidate } from "./cache";
import { findOrCreateLocation } from "./locations";
import { countContactDetailsOpens } from "./activity";

export interface PropertyLocation {
  city: string | null;
  area: string | null;
  development: string | null;
}

export interface PropertyRecord {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  keyFeatures: string | null;
  price: number | null;
  currency: string | null;
  listingType: string | null;
  listingTerm: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  interiorArea: number | null;
  areaUnit: string | null;
  photos: { url?: string; signedUrl?: string }[];
  publicLocation: string | null;
  petFriendly: boolean;
  parking: boolean;
  nearShopping: boolean;
  nearJungle: boolean;
  nearBeach: boolean;
  twentyFourHourSecurity: boolean;
  latitude: number | null;
  longitude: number | null;
  featured: boolean;
  verified: boolean;
  wifi: boolean;
  elevator: boolean;
  pool: string | null;
  furnished: string | null;
  laundry: string | null;
  location: PropertyLocation;
  locationNames: PropertyLocation;
  clientId: string | null;
  updatedAt: string;
  seoTitle: string | null;
  seoTitleEn: string | null;
  seoTitleEs: string | null;
  seoDescription: string | null;
  seoDescriptionEn: string | null;
  seoDescriptionEs: string | null;
  seoKeywords: string | null;
  ogImageOverride: string | null;
  listingStartDate: string | null;
  listingExpiryDate: string | null;
  reminderSentAt: string | null;
  archiveUntilDate: string | null;
  lifecycleState: string | null;
}

/** Resolve SEO title by locale with fallback chain: locale-specific > generic > title */
export function resolveSeoTitle(property: PropertyRecord, locale: "en" | "es"): string {
  return property[`seoTitle${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof PropertyRecord] as string
    || property.seoTitle
    || property.title;
}

/** Resolve SEO description by locale with fallback chain: locale-specific > generic > description snippet */
export function resolveSeoDescription(property: PropertyRecord, locale: "en" | "es"): string | null {
  const localeDesc = property[`seoDescription${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof PropertyRecord] as string | null;
  return localeDesc || property.seoDescription || property.description?.slice(0, 160) || null;
}

export interface AdvertiserInfo {
  displayName: string;
  tagline: string | null;
  contactChannel: string | null;
  contactValue: string | null;
  logo: { url?: string; signedUrl?: string }[];
  identityVerified: boolean;
}

export interface PropertyPageResult {
  property: PropertyRecord;
  advertiser: AdvertiserInfo | null;
  locationLabels: Record<string, string>;
}

function parsePropertyRow(row: SqlRow): PropertyRecord {
  const photos = Array.isArray(row.Photos)
    ? (row.Photos as unknown[])
        .filter((a): a is Record<string, unknown> => typeof a === "object" && a != null)
        .map((a) => ({
          url: typeof a.url === "string" ? a.url : undefined,
          signedUrl: typeof a.signedUrl === "string" ? a.signedUrl : undefined,
        }))
    : [];

  const city = linkId(row.City);
  const area = linkId(row.Area);
  const development = linkId(row.Development);
  const cityName = linkTitle(row.City);
  const areaName = linkTitle(row.Area);
  const developmentName = linkTitle(row.Development);

  return {
    id: String(row.__id ?? ""),
    slug: row.Public_Slug != null ? String(row.Public_Slug) : "",
    title: row.Title != null ? String(row.Title) : (row.Property != null ? String(row.Property) : ""),
    description: row.Description != null ? String(row.Description) : null,
    keyFeatures: row.Key_Features != null ? String(row.Key_Features) : null,
    price: row.Price != null ? Number(row.Price) : null,
    currency: row.Currency != null ? String(row.Currency) : null,
    listingType: row.Listing_Type != null ? String(row.Listing_Type) : null,
    listingTerm: row.Listing_Term != null ? String(row.Listing_Term) : null,
    bedrooms: row.Bedrooms != null ? Number(row.Bedrooms) : null,
    bathrooms: row.Bathrooms != null ? Number(row.Bathrooms) : null,
    interiorArea: row.Interior_Area != null ? Number(row.Interior_Area) : null,
    areaUnit: row.Area_Unit != null ? String(row.Area_Unit) : null,
    photos,
    publicLocation: row.Public_Location != null ? String(row.Public_Location) : null,
    petFriendly: row.Pet_Friendly === true,
    parking: row.Parking === true,
    nearShopping: row.Near_Shopping === true,
    nearJungle: row.Near_Jungle === true,
    nearBeach: row.Near_Beach === true,
    twentyFourHourSecurity: row.TwentyFour_Hour_Security === true,
    latitude: row.Latitude != null ? Number(row.Latitude) : null,
    longitude: row.Longitude != null ? Number(row.Longitude) : null,
    featured: row.Featured === true,
    verified: row.Verified === true,
    wifi: row.Wi_Fi === true,
    elevator: row.Elevator === true,
    pool: row.Pool != null ? String(row.Pool) : null,
    furnished: row.Furnished != null ? String(row.Furnished) : null,
    laundry: row.Laundry != null ? String(row.Laundry) : null,
    location: { city, area, development },
    locationNames: { city: cityName, area: areaName, development: developmentName },
    clientId: linkId(row.Client),
    updatedAt: row.Updated != null ? String(row.Updated) : "",
    seoTitle: row.SEO_Title != null ? String(row.SEO_Title) : null,
    seoTitleEn: row.SEO_Title_En != null ? String(row.SEO_Title_En) : null,
    seoTitleEs: row.SEO_Title_Es != null ? String(row.SEO_Title_Es) : null,
    seoDescription: row.SEO_Description != null ? String(row.SEO_Description) : null,
    seoDescriptionEn: row.SEO_Description_En != null ? String(row.SEO_Description_En) : null,
    seoDescriptionEs: row.SEO_Description_Es != null ? String(row.SEO_Description_Es) : null,
    seoKeywords: row.SEO_Keywords != null ? String(row.SEO_Keywords) : null,
    ogImageOverride: row.OG_Image_Override != null ? String(row.OG_Image_Override) : null,
    listingStartDate: row.Listing_Starts_At != null ? String(row.Listing_Starts_At) : null,
    listingExpiryDate: row.Paid_Through != null ? String(row.Paid_Through) : null,
    reminderSentAt: row.Renewal_Reminder_Sent_At != null ? String(row.Renewal_Reminder_Sent_At) : null,
    archiveUntilDate: row.Purge_Eligible_At != null ? String(row.Purge_Eligible_At) : null,
    lifecycleState: row.Lifecycle_Status != null ? String(row.Lifecycle_Status) : null,
  };
}

function parseAdvertiserRow(row: SqlRow): AdvertiserInfo {
  const logo = Array.isArray(row.Logo)
    ? (row.Logo as unknown[])
        .filter((a): a is Record<string, unknown> => typeof a === "object" && a != null)
        .map((a) => ({
          url: typeof a.url === "string" ? a.url : undefined,
          signedUrl: typeof a.signedUrl === "string" ? a.signedUrl : undefined,
        }))
    : [];
  return {
    displayName: row.Display_Name != null ? String(row.Display_Name) : (row.Business_Name != null ? String(row.Business_Name) : "Advertiser"),
    tagline: row.Tagline != null ? String(row.Tagline) : null,
    contactChannel: row.Primary_Contact_Channel != null ? String(row.Primary_Contact_Channel) : null,
    contactValue: row.Primary_Contact_Value != null ? String(row.Primary_Contact_Value) : null,
    logo,
    identityVerified: row.Identity_Verified === true,
  };
}

export async function getPublicPropertyBySlug(slug: string): Promise<PropertyPageResult | null> {
  const client = new TeableClient(getTeableConfig());
  const propSql =
    "SELECT " +
    [
      qi("__id"), qi("Public_Slug"), qi("Title"), qi("Property"),
      qi("Description"), qi("Key_Features"), qi("Price"), qi("Currency"),
      qi("Listing_Type"), qi("Listing_Term"), qi("Bedrooms"), qi("Bathrooms"),
      qi("Interior_Area"), qi("Area_Unit"), qi("Photos"), qi("Public_Location"),
      qi("Latitude"), qi("Longitude"), qi("Featured"), qi("Verified"),
      qi("Wi_Fi"), qi("Elevator"), qi("Pool"), qi("Furnished"), qi("Laundry"),
      qi("City"), qi("Area"), qi("Development"),
      qi("Client"),
      qi("SEO_Title"), qi("SEO_Title_En"), qi("SEO_Title_Es"),
      qi("SEO_Description"), qi("SEO_Description_En"), qi("SEO_Description_Es"),
      qi("SEO_Keywords"), qi("OG_Image_Override"),
      qi("Updated"),
    ].join(", ") +
    " FROM " + qiTable(DB_TABLES.Properties) +
    " WHERE " + qi("Public_Slug") + " = " + lit(slug) +
    " AND " + publicEligibilityWhere();

  const rows = await client.runSql<SqlRow>(propSql);
  if (rows.length === 0) return null;

  const property = parsePropertyRow(rows[0]);

  // Fetch advertiser (the linked Client record) if present.
  let advertiser: AdvertiserInfo | null = null;
  if (property.clientId) {
    const advSql =
      "SELECT " +
      [qi("Display_Name"), qi("Business_Name"), qi("Tagline"), qi("Logo"), qi("Identity_Verified"), qi("Primary_Contact_Channel"), qi("Primary_Contact_Value")].join(", ") +
      " FROM " + qiTable(DB_TABLES.Agents) +
      " WHERE " + qi("__id") + " = " + lit(property.clientId);
    const advRows = await client.runSql<SqlRow>(advSql);
    advertiser = advRows.length > 0 ? parseAdvertiserRow(advRows[0]) : null;
  }

  // Location labels come from the linked location records returned on the property.
  const locationLabels: Record<string, string> = {};
  if (property.location.city && property.locationNames.city) locationLabels[property.location.city] = property.locationNames.city;
  if (property.location.area && property.locationNames.area) locationLabels[property.location.area] = property.locationNames.area;
  if (property.location.development && property.locationNames.development) locationLabels[property.location.development] = property.locationNames.development;

  return { property, advertiser, locationLabels };
}

export async function getPropertyById(propertyId: string): Promise<PropertyRecord | null> {
  const client = new TeableClient(getTeableConfig());
  const sql =
    "SELECT " +
    [
      qi("__id"), qi("Public_Slug"), qi("Title"), qi("Property"),
      qi("Description"), qi("Key_Features"), qi("Price"), qi("Currency"),
      qi("Listing_Type"), qi("Listing_Term"), qi("Bedrooms"), qi("Bathrooms"),
      qi("Interior_Area"), qi("Area_Unit"), qi("Photos"), qi("Public_Location"),
      qi("Latitude"), qi("Longitude"), qi("Featured"), qi("Verified"),
      qi("Wi_Fi"), qi("Elevator"), qi("Pool"), qi("Furnished"), qi("Laundry"),
      qi("City"), qi("Area"), qi("Development"),
      qi("Client"),
      qi("SEO_Title"), qi("SEO_Title_En"), qi("SEO_Title_Es"),
      qi("SEO_Description"), qi("SEO_Description_En"), qi("SEO_Description_Es"),
      qi("SEO_Keywords"), qi("OG_Image_Override"),
      qi("Updated"),
    ].join(", ") +
    " FROM " + qiTable(DB_TABLES.Properties) +
    " WHERE " + qi("__id") + " = " + lit(propertyId);
  const rows = await client.runSql<SqlRow>(sql);
  return rows.length > 0 ? parsePropertyRow(rows[0]) : null;
}

export async function updateProperty(
  propertyId: string,
  updates: Partial<PropertyRecord>,
): Promise<void> {
  const client = new TeableClient(getTeableConfig());
  await client.updateRecord(TABLES.Properties, propertyId, updates);
  await invalidate({ tags: [TAGS.PROPERTIES] });
}

export function propertyCacheTags(slug: string): string[] {
  return [TAGS.PROPERTIES, TAGS.PROPERTIES + ":" + slug];
}

export type PropertyStatus = "active" | "expiring_soon" | "archived";

export interface AgentPropertyListItem {
  id: string;
  slug: string;
  title: string;
  price: number | null;
  currency: string | null;
  listingType: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  interiorArea: number | null;
  areaUnit: string | null;
  photos: { url?: string; signedUrl?: string }[];
  publicLocation: string | null;
  featured: boolean;
  published: boolean;
  status: PropertyStatus;
  createdAt: string;
  expiryDate: string;
  daysUntilExpiry: number;
  enquiryCount: number;
  listingStartDate: string;
  listingExpiryDate: string;
  archiveUntilDate: string | null;
  lifecycleState: string;
}

/** Derive property status from created date (13-week lifecycle). */
function derivePropertyStatus(createdAt: string, explicitExpiry?: string | null, lifecycleState?: string | null): {
  status: PropertyStatus;
  expiryDate: string;
  daysUntilExpiry: number;
} {
  const created = new Date(createdAt);
  const expiry = explicitExpiry ? new Date(explicitExpiry) : new Date(created);
  if (!explicitExpiry) expiry.setDate(expiry.getDate() + 13 * 7); // 13 weeks

  const now = new Date();
  const msUntilExpiry = expiry.getTime() - now.getTime();
  const daysUntilExpiry = Math.ceil(msUntilExpiry / (1000 * 60 * 60 * 24));

  let status: PropertyStatus;
  if (lifecycleState === "Archived" || lifecycleState === "Purged") {
    status = "archived";
  } else if (daysUntilExpiry > 14) {
    status = "active";
  } else if (daysUntilExpiry > 0) {
    status = "expiring_soon";
  } else {
    status = "archived";
  }

  return { status, expiryDate: expiry.toISOString(), daysUntilExpiry };
}

/** Get all properties for an agent, with status and enquiry counts. */
export async function getPropertiesByAgent(agentId: string): Promise<AgentPropertyListItem[]> {
  const client = new TeableClient(getTeableConfig());

  const sql =
    "SELECT " +
    [
      qi("__id"), qi("Public_Slug"), qi("Title"), qi("Price"), qi("Currency"),
      qi("Listing_Type"), qi("Bedrooms"), qi("Bathrooms"),
      qi("Interior_Area"), qi("Area_Unit"), qi("Photos"),
      qi("Public_Location"), qi("Featured"), qi("Published"),
      qi("Created"), qi("Listing_Starts_At"), qi("Paid_Through"), qi("Purge_Eligible_At"), qi("Lifecycle_Status"),
    ].join(", ") +
    " FROM " + qiTable(DB_TABLES.Properties) +
    " WHERE " + qi("Client") + " = " + lit(agentId) +
    " ORDER BY " + qi("Created") + " DESC";

  const rows = await client.runSql<SqlRow>(sql);

  return Promise.all(rows.map(async (row) => {
    const photos = Array.isArray(row.Photos)
      ? (row.Photos as unknown[])
          .filter((a): a is Record<string, unknown> => typeof a === "object" && a != null)
          .map((a) => ({
            url: typeof a.url === "string" ? a.url : undefined,
            signedUrl: typeof a.signedUrl === "string" ? a.signedUrl : undefined,
          }))
      : [];

    const createdAt = row.Created != null ? String(row.Created) : new Date().toISOString();
    const listingStartDate = row.Listing_Starts_At != null ? String(row.Listing_Starts_At) : createdAt;
    const listingExpiryDate = row.Paid_Through != null ? String(row.Paid_Through) : null;
    const archiveUntilDate = row.Purge_Eligible_At != null ? String(row.Purge_Eligible_At) : null;
    const lifecycleState = row.Lifecycle_Status != null ? String(row.Lifecycle_Status) : "Active";
    const { status, expiryDate, daysUntilExpiry } = derivePropertyStatus(listingStartDate, listingExpiryDate, lifecycleState);

    return {
      id: String(row.__id ?? ""),
      slug: row.Public_Slug != null ? String(row.Public_Slug) : "",
      title: row.Title != null ? String(row.Title) : (row.Property != null ? String(row.Property) : ""),
      price: row.Price != null ? Number(row.Price) : null,
      currency: row.Currency != null ? String(row.Currency) : null,
      listingType: row.Listing_Type != null ? String(row.Listing_Type) : null,
      bedrooms: row.Bedrooms != null ? Number(row.Bedrooms) : null,
      bathrooms: row.Bathrooms != null ? Number(row.Bathrooms) : null,
      interiorArea: row.Interior_Area != null ? Number(row.Interior_Area) : null,
      areaUnit: row.Area_Unit != null ? String(row.Area_Unit) : null,
      photos,
      publicLocation: row.Public_Location != null ? String(row.Public_Location) : null,
      featured: row.Featured === true,
      published: row.Published === true,
      status,
      createdAt,
      expiryDate,
      daysUntilExpiry,
      enquiryCount: await countContactDetailsOpens(String(row.__id ?? "")),
      listingStartDate,
      listingExpiryDate: expiryDate,
      archiveUntilDate,
      lifecycleState,
    };
  }));
}

/** Create a new property record in Teable. Returns the new record id. */
export async function createProperty(
  agentId: string,
  data: {
    title: string;
    description?: string;
    keyFeatures?: string;
    price?: number;
    currency?: string;
    listingType?: string;
    listingTerm?: string;
    bedrooms?: number;
    bathrooms?: number;
    interiorArea?: number;
    areaUnit?: string;
    publicLocation?: string;
    city?: string;
    area?: string;
    development?: string;
    wifi?: boolean;
    elevator?: boolean;
    pool?: string;
    furnished?: string;
    laundry?: string;
    petFriendly?: boolean;
    parking?: boolean;
    nearShopping?: boolean;
    nearJungle?: boolean;
    nearBeach?: boolean;
    twentyFourHourSecurity?: boolean;
    seoTitleEn?: string;
    seoTitleEs?: string;
    seoDescriptionEn?: string;
    seoDescriptionEs?: string;
    seoKeywords?: string;
  },
): Promise<string> {
  const client = new TeableClient(getTeableConfig());
  const cityId = await findOrCreateLocation(data.city ?? "", "City");
  const areaId = await findOrCreateLocation(data.area ?? "", "Area", cityId ?? undefined);
  const developmentId = await findOrCreateLocation(data.development ?? "", "Development", areaId ?? undefined);
  const now = new Date();
  const expiry = new Date(now);
  expiry.setDate(expiry.getDate() + 13 * 7); // 13 weeks

  const record = await client.createRecord(TABLES.Properties, {
    Title: data.title || null,
    Description: data.description || null,
    Key_Features: data.keyFeatures || null,
    Price: data.price ?? null,
    Currency: data.currency || null,
    Listing_Type: data.listingType || null,
    Listing_Term: data.listingTerm || null,
    Bedrooms: data.bedrooms ?? null,
    Bathrooms: data.bathrooms ?? null,
    Interior_Area: data.interiorArea ?? null,
    Area_Unit: data.areaUnit || null,
    Public_Location: data.publicLocation || null,
    City: cityId ? [{ id: cityId }] : null,
    Area: areaId ? [{ id: areaId }] : null,
    Development: developmentId ? [{ id: developmentId }] : null,
    Pet_Friendly: data.petFriendly ?? false,
    Parking: data.parking ?? false,
    Near_Shopping: data.nearShopping ?? false,
    Near_Jungle: data.nearJungle ?? false,
    Near_Beach: data.nearBeach ?? false,
    TwentyFour_Hour_Security: data.twentyFourHourSecurity ?? false,
    Wi_Fi: data.wifi ?? false,
    Elevator: data.elevator ?? false,
    Pool: data.pool || "None",
    Furnished: data.furnished || "Unfurnished",
    Laundry: data.laundry || "None",
    Public_Slug: slugify(data.title),
    Listing_Starts_At: now.toISOString(),
    Paid_Through: expiry.toISOString(),
    Lifecycle_Status: "Draft",
    Client: agentId,
    Published: false,
    SEO_Title_En: data.seoTitleEn || null,
    SEO_Title_Es: data.seoTitleEs || null,
    SEO_Description_En: data.seoDescriptionEn || null,
    SEO_Description_Es: data.seoDescriptionEs || null,
    SEO_Keywords: data.seoKeywords || null,
  });

  await invalidate({ tags: [TAGS.PROPERTIES] });
  return record.id;
}

/** Generate a URL-safe slug from a title. */
function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export interface PropertyListItem {
  id: string;
  slug: string;
  title: string;
  price: number | null;
  currency: string | null;
  listingType: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  interiorArea: number | null;
  areaUnit: string | null;
  photos: { url?: string; signedUrl?: string }[];
  publicLocation: string | null;
  petFriendly: boolean;
  parking: boolean;
  nearShopping: boolean;
  nearJungle: boolean;
  nearBeach: boolean;
  twentyFourHourSecurity: boolean;
  latitude: number | null;
  longitude: number | null;
  featured: boolean;
  updatedAt: string;
}

export interface PropertyListFilters {
  listingType?: "Sale" | "Rental";
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  location?: string;
  areaId?: string;
  developmentId?: string;
  petFriendly?: boolean;
  parking?: boolean;
  nearShopping?: boolean;
  nearJungle?: boolean;
  nearBeach?: boolean;
  twentyFourHourSecurity?: boolean;
  wifi?: boolean;
  elevator?: boolean;
  pool?: boolean;
  furnished?: boolean;
  laundry?: boolean;
}

export type PropertySortOption = "newest" | "price_asc" | "price_desc";

export async function getPublicProperties(
  filters: PropertyListFilters = {},
  sort: PropertySortOption = "newest",
  limit: number = 24,
  offset: number = 0,
): Promise<{ properties: PropertyListItem[]; total: number }> {
  const client = new TeableClient(getTeableConfig());

  const whereClauses = [publicEligibilityWhere()];

  if (filters.listingType) {
    whereClauses.push(qi("Listing_Type") + " = " + lit(filters.listingType));
  }
  if (filters.minPrice != null) {
    whereClauses.push(qi("Price") + " >= " + lit(filters.minPrice));
  }
  if (filters.maxPrice != null) {
    whereClauses.push(qi("Price") + " <= " + lit(filters.maxPrice));
  }
  if (filters.bedrooms != null) {
    whereClauses.push(qi("Bedrooms") + " >= " + lit(filters.bedrooms));
  }
  if (filters.location) {
    whereClauses.push(
      qi("Public_Location") + " ILIKE " + lit("%" + filters.location + "%")
    );
  }
  if (filters.areaId) whereClauses.push(qi("Area") + " = " + lit(filters.areaId));
  if (filters.developmentId) whereClauses.push(qi("Development") + " = " + lit(filters.developmentId));
  const featureFilters: Array<[keyof PropertyListFilters, string]> = [
    ["wifi", "Wi_Fi"],
    ["elevator", "Elevator"],
    ["petFriendly", "Pet_Friendly"],
    ["parking", "Parking"],
    ["nearShopping", "Near_Shopping"],
    ["nearJungle", "Near_Jungle"],
    ["nearBeach", "Near_Beach"],
    ["twentyFourHourSecurity", "TwentyFour_Hour_Security"],
  ];
  for (const [filter, field] of featureFilters) {
    if (filters[filter] === true) whereClauses.push(qi(field) + " IS TRUE");
  }
  const selectableFeatures: Array<[keyof PropertyListFilters, string]> = [
    ["pool", "Pool"],
    ["furnished", "Furnished"],
    ["laundry", "Laundry"],
  ];
  for (const [filter, field] of selectableFeatures) {
    if (filters[filter] === true) whereClauses.push(qi(field) + " IS NOT NULL");
  }

  const where = whereClauses.join(" AND ");

  const orderMap: Record<PropertySortOption, string> = {
    newest: qi("Updated") + " DESC",
    price_asc: qi("Price") + " ASC NULLS LAST",
    price_desc: qi("Price") + " DESC NULLS LAST",
  };

  // Count total
  const countSql = "SELECT COUNT(*) as cnt FROM " + qiTable(DB_TABLES.Properties) + " WHERE " + where;
  const countRows = await client.runSql<SqlRow>(countSql);
  const total = Number(countRows[0]?.cnt ?? 0);

  // Fetch listing cards
  const listSql =
    "SELECT " +
    [
      qi("__id"), qi("Public_Slug"), qi("Title"), qi("Price"), qi("Currency"),
      qi("Listing_Type"), qi("Bedrooms"), qi("Bathrooms"),
      qi("Interior_Area"), qi("Area_Unit"), qi("Photos"),
      qi("Public_Location"), qi("Latitude"), qi("Longitude"),
      qi("Featured"), qi("Pet_Friendly"), qi("Parking"), qi("Near_Shopping"),
      qi("Near_Jungle"), qi("Near_Beach"), qi("TwentyFour_Hour_Security"), qi("Updated"),
    ].join(", ") +
    " FROM " + qiTable(DB_TABLES.Properties) +
    " WHERE " + where +
    " ORDER BY " + qi("Featured") + " DESC, " + orderMap[sort] +
    " LIMIT " + lit(limit) +
    " OFFSET " + lit(offset);

  const rows = await client.runSql<SqlRow>(listSql);

  const properties: PropertyListItem[] = rows.map((row) => {
    const photos = Array.isArray(row.Photos)
      ? (row.Photos as unknown[])
          .filter((a): a is Record<string, unknown> => typeof a === "object" && a != null)
          .map((a) => ({
            url: typeof a.url === "string" ? a.url : undefined,
            signedUrl: typeof a.signedUrl === "string" ? a.signedUrl : undefined,
          }))
      : [];

    return {
      id: String(row.__id ?? ""),
      slug: row.Public_Slug != null ? String(row.Public_Slug) : "",
      title: row.Title != null ? String(row.Title) : (row.Property != null ? String(row.Property) : ""),
      price: row.Price != null ? Number(row.Price) : null,
      currency: row.Currency != null ? String(row.Currency) : null,
      listingType: row.Listing_Type != null ? String(row.Listing_Type) : null,
      bedrooms: row.Bedrooms != null ? Number(row.Bedrooms) : null,
      bathrooms: row.Bathrooms != null ? Number(row.Bathrooms) : null,
      interiorArea: row.Interior_Area != null ? Number(row.Interior_Area) : null,
      areaUnit: row.Area_Unit != null ? String(row.Area_Unit) : null,
      photos,
      publicLocation: row.Public_Location != null ? String(row.Public_Location) : null,
      petFriendly: row.Pet_Friendly === true,
      parking: row.Parking === true,
      nearShopping: row.Near_Shopping === true,
      nearJungle: row.Near_Jungle === true,
      nearBeach: row.Near_Beach === true,
      twentyFourHourSecurity: row.TwentyFour_Hour_Security === true,
      latitude: row.Latitude != null ? Number(row.Latitude) : null,
      longitude: row.Longitude != null ? Number(row.Longitude) : null,
      featured: row.Featured === true,
      updatedAt: row.Updated != null ? String(row.Updated) : "",
    };
  });

  return { properties, total };
}

