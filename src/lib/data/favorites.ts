import "server-only";

import { getTeableConfig, TeableClient, type SqlRow, qiTable } from "./teable/client";
import { lit, qi } from "./teable/sql";
import { DB_TABLES, TABLES } from "./teable/tables";
import { FIELDS } from "./teable/fields.generated";
import { publicEligibilityWhere } from "./eligibility";
import { TAGS, invalidate } from "./cache";

export interface FavoriteRecord {
  favoriteKey: string;
  userId: string;
  propertyId: string;
  active: boolean;
  createdAt: string;
}

export interface FavoriteProperty {
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
}

function parseFavoriteRow(row: SqlRow): FavoriteRecord {
  const userField = row.User;
  const propertyField = row.Property;
  const userId =
    typeof userField === "string"
      ? userField
      : Array.isArray(userField)
        ? String(userField[0]?.id ?? userField[0]?.__id ?? "")
        : "";
  const propertyId =
    typeof propertyField === "string"
      ? propertyField
      : Array.isArray(propertyField)
        ? String(propertyField[0]?.id ?? propertyField[0]?.__id ?? "")
        : "";
  return {
    favoriteKey: String(row.Favorite_Key ?? ""),
    userId,
    propertyId,
    active: row.Active === true,
    createdAt: String(row.Created ?? ""),
  };
}

function parseFavoriteProperty(row: SqlRow): FavoriteProperty {
  const photos = Array.isArray(row.Photos)
    ? (row.Photos as unknown[]).filter((a): a is Record<string, unknown> => typeof a === "object" && a != null).map((a) => ({
        url: typeof a.url === "string" ? a.url : undefined,
        signedUrl: typeof a.signedUrl === "string" ? a.signedUrl : undefined,
      }))
    : [];
  return {
    id: String(row.__id ?? ""),
    slug: row.Public_Slug != null ? String(row.Public_Slug) : "",
    title: row.Property != null ? String(row.Property) : "",
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
  };
}

export async function getCustomerFavorites(userId: string): Promise<FavoriteRecord[]> {
  const client = new TeableClient(getTeableConfig());
  const sql =
    "SELECT " +
    [qi("Favorite_Key"), qi("Active"), qi("User"), qi("Property"), qi("Created")].join(", ") +
    " FROM " +
    qiTable(DB_TABLES.Property_Favorites) +
    " WHERE " +
    qi("User") +
    " = " +
    lit(userId) +
    " AND " +
    qi("Active") +
    " IS TRUE" +
    " ORDER BY " +
    qi("Created") +
    " DESC";
  const rows = await client.runSql<SqlRow>(sql);
  return rows.map(parseFavoriteRow);
}

export async function getFavoriteProperties(userId: string): Promise<FavoriteProperty[]> {
  const client = new TeableClient(getTeableConfig());
  const sql =
    'SELECT "Property","Public_Slug","Price","Currency","Listing_Type","Bedrooms","Bathrooms","Interior_Area","Area_Unit","Photos","Public_Location","Featured" FROM ' +
    qiTable(DB_TABLES.Properties) +
    ' WHERE "__id" IN (SELECT "Property" FROM ' +
    qiTable(DB_TABLES.Property_Favorites) +
    ' WHERE "User" = ' +
    lit(userId) +
    " AND \"Active\" IS TRUE) AND " +
    publicEligibilityWhere() +
    " LIMIT 100";
  const rows = await client.runSql<SqlRow>(sql);
  return rows.map(parseFavoriteProperty);
}

export async function toggleFavorite(
  userId: string,
  propertyId: string,
): Promise<{ action: "added" | "removed"; favoriteKey: string }> {
  const client = new TeableClient(getTeableConfig());
  const favFields = FIELDS.Property_Favorites;

  const existingSql =
    "SELECT " +
    qi("Favorite_Key") +
    " FROM " +
    qiTable(DB_TABLES.Property_Favorites) +
    " WHERE " +
    qi("User") +
    " = " +
    lit(userId) +
    " AND " +
    qi("Property") +
    "::text LIKE " +
    lit("%" + propertyId + "%") +
    " AND " +
    qi("Active") +
    " IS TRUE";
  const existing = await client.runSql<SqlRow>(existingSql);

  if (existing.length > 0) {
    const favKey = String(existing[0].Favorite_Key ?? "");
    await client.updateRecord(TABLES.Property_Favorites, favKey, {
      [favFields.Active.id]: false,
    });
    await invalidate({ tags: [TAGS.WATCHLIST] });
    return { action: "removed", favoriteKey: favKey };
  }

  const record = await client.createRecord(TABLES.Property_Favorites, {
    [favFields.User.id]: [{ id: userId }],
    [favFields.Property.id]: [{ id: propertyId }],
    [favFields.Active.id]: true,
    [favFields.Source.id]: "Website",
  });
  await invalidate({ tags: [TAGS.WATCHLIST] });
  return { action: "added", favoriteKey: record.id };
}

export function favoritesCacheTags(userId: string): string[] {
  return [TAGS.WATCHLIST, TAGS.WATCHLIST + ":" + userId];
}
