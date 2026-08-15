import "server-only";

import { getTeableConfig, TeableClient, type SqlRow, qiTable } from "./teable/client";
import { lit, qi } from "./teable/sql";
import { TABLES, DB_TABLES } from "./teable/tables";

export type LocationType = "City" | "Area" | "Development";

export interface LocationOption {
  id: string;
  name: string;
  type: LocationType;
}

export async function getLocationsByType(type: LocationType): Promise<LocationOption[]> {
  const client = new TeableClient(getTeableConfig());
  try {
    const sql =
      "SELECT " + qi("__id") + ", " + qi("Location") + ", " + qi("Type") +
      " FROM " + qiTable(DB_TABLES.Locations) +
      " WHERE " + qi("Type") + " = " + lit(type) +
      " AND " + qi("Active") + " IS TRUE" +
      " ORDER BY " + qi("Location") + " ASC";
    const rows = await client.runSql<SqlRow>(sql);
    return rows
      .map((row) => ({
        id: String(row.__id ?? ""),
        name: String(row.Location ?? ""),
        type,
      }))
      .filter((location) => location.id && location.name)
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error(`locations lookup failed for ${type}`, error);
    return [];
  }
}

/** Find an existing location or create it for a logged-in advertiser. */
export async function findOrCreateLocation(
  name: string,
  type: LocationType,
  parentId?: string,
): Promise<string | null> {
  const normalized = name.trim();
  if (!normalized) return null;

  const client = new TeableClient(getTeableConfig());
  const sql =
    "SELECT " + qi("__id") + " FROM " + qiTable(DB_TABLES.Locations) +
    " WHERE " + qi("Location") + " = " + lit(normalized) +
    " AND " + qi("Type") + " = " + lit(type) +
    " LIMIT 1";
  const rows = await client.runSql<SqlRow>(sql);
  if (rows[0]?.__id) return String(rows[0].__id);

  const record = await client.createRecord(TABLES.Locations, {
    Location: normalized,
    Type: type,
    Slug: slugify(normalized),
    Public_Label: normalized,
    Active: true,
    Parent_Location: parentId ? [{ id: parentId }] : null,
  });
  return record.id || null;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
