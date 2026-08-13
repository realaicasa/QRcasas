import "server-only";

import { getTeableConfig, TeableClient, type SqlRow, qiTable } from "./teable/client";
import { lit, qi } from "./teable/sql";
import { DB_TABLES, TABLES } from "./teable/tables";
import { FIELDS } from "./teable/fields.generated";
import { publicEligibilityWhere } from "./eligibility";
import { TAGS, invalidate } from "./cache";

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
  updatedAt: string;
  seoTitle: string | null;
  seoTitleEn: string | null;
  seoTitleEs: string | null;
  seoDescription: string | null;
  seoDescriptionEn: string | null;
  seoDescriptionEs: string | null;
  seoKeywords: string | null;
  ogImageOverride: string | null;
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

  const city = row.City != null ? String(row.City) : null;
  const area = row.Area != null ? String(row.Area) : null;
  const development = row.Development != null ? String(row.Development) : null;

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
    updatedAt: row.Updated != null ? String(row.Updated) : "",
    seoTitle: row.SEO_Title != null ? String(row.SEO_Title) : null,
    seoTitleEn: row.SEO_Title_En != null ? String(row.SEO_Title_En) : null,
    seoTitleEs: row.SEO_Title_Es != null ? String(row.SEO_Title_Es) : null,
    seoDescription: row.SEO_Description != null ? String(row.SEO_Description) : null,
    seoDescriptionEn: row.SEO_Description_En != null ? String(row.SEO_Description_En) : null,
    seoDescriptionEs: row.SEO_Description_Es != null ? String(row.SEO_Description_Es) : null,
    seoKeywords: row.SEO_Keywords != null ? String(row.SEO_Keywords) : null,
    ogImageOverride: row.OG_Image_Override != null ? String(row.OG_Image_Override) : null,
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

  // Fetch advertiser if present
  const advSql =
    "SELECT " +
    [qi("Display_Name"), qi("Business_Name"), qi("Tagline"), qi("Logo"), qi("Identity_Verified")].join(", ") +
    " FROM " + qiTable(DB_TABLES.Properties) +
    " WHERE " + qi("__id") + " = " + lit(property.id);
  const advRows = await client.runSql<SqlRow>(advSql);
  const advertiser = advRows.length > 0 ? parseAdvertiserRow(advRows[0]) : null;

  // Location labels for the city/area/development IDs
  const locationLabels: Record<string, string> = {};
  const locIds = [property.location.city, property.location.area, property.location.development].filter(Boolean) as string[];
  if (locIds.length > 0) {
    const locSql =
      "SELECT " + [qi("__id"), qi("Name")].join(", ") +
      " FROM " + qiTable(DB_TABLES.Properties) +
      " WHERE " + qi("__id") + " IN (" + locIds.map((id) => lit(id)).join(", ") + ")";
    const locRows = await client.runSql<SqlRow>(locSql);
    for (const r of locRows) {
      locationLabels[String(r.__id)] = String(r.Name ?? "");
    }
  }

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
      qi("Featured"), qi("Updated"),
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
      latitude: row.Latitude != null ? Number(row.Latitude) : null,
      longitude: row.Longitude != null ? Number(row.Longitude) : null,
      featured: row.Featured === true,
      updatedAt: row.Updated != null ? String(row.Updated) : "",
    };
  });

  return { properties, total };
}
