import "server-only";

import { getTeableConfig, TeableClient, type SqlRow, qiTable, linkId } from "./teable/client";
import { lit, qi } from "./teable/sql";
import { DB_TABLES, TABLES } from "./teable/tables";
import { FIELDS } from "./teable/fields.generated";
import { publicEligibilityWhere } from "./eligibility";
import { TAGS, invalidate } from "./cache";
import type { CatalogProperty } from "./catalog";

export interface WatchlistFilters {
  listingType?: "Sale" | "Rental";
  propertyType?: string;
  priceMax?: number;
  currency?: string;
  bedrooms?: number;
  bathrooms?: number;
  city?: string;
  area?: string;
  development?: string;
  elevator?: boolean;
  wifi?: boolean;
  pool?: boolean;
  furnished?: string;
}

export interface WatchlistRecord {
  watchlistId: string;
  userId: string;
  active: boolean;
  filters: WatchlistFilters;
  notificationFrequency: string | null;
  lastViewedAt: string | null;
  createdAt: string;
  newMatchCount: number;
}

export interface WatchlistWithMatches extends WatchlistRecord {
  matches: CatalogProperty[];
}

const WATCHLIST_FIELD_KEYS = [
  "Watchlist", "Active", "Listing_Type", "Maximum_Price", "Currency",
  "Minimum_Bedrooms", "Minimum_Bathrooms", "Property_Type", "Furnished",
  "Elevator_Required", "WiFi_Required", "Pool", "Notification_Frequency",
  "Last_Viewed_At", "Created", "User", "City", "Area", "Development",
];

function parseRow(row: SqlRow): WatchlistRecord {
  const userId = linkId(row.User) ?? "";
  const cityId = linkId(row.City) ?? undefined;
  const areaId = linkId(row.Area) ?? undefined;
  const devId = linkId(row.Development) ?? undefined;

  const filters: WatchlistFilters = {};
  if (row.Listing_Type) filters.listingType = String(row.Listing_Type) as "Sale" | "Rental";
  if (row.Maximum_Price != null) filters.priceMax = Number(row.Maximum_Price);
  if (row.Currency) filters.currency = String(row.Currency);
  if (row.Minimum_Bedrooms != null) filters.bedrooms = Number(row.Minimum_Bedrooms);
  if (row.Minimum_Bathrooms != null) filters.bathrooms = Number(row.Minimum_Bathrooms);
  if (row.Property_Type) filters.propertyType = String(row.Property_Type);
  if (row.Furnished) filters.furnished = String(row.Furnished);
  if (row.Elevator_Required) filters.elevator = true;
  if (row.WiFi_Required) filters.wifi = true;
  if (row.Pool) filters.pool = row.Pool !== "None";
  if (cityId) filters.city = cityId;
  if (areaId) filters.area = areaId;
  if (devId) filters.development = devId;

  return {
    watchlistId: String(row.Watchlist ?? ""),
    userId,
    active: row.Active === true,
    filters,
    notificationFrequency: row.Notification_Frequency != null ? String(row.Notification_Frequency) : null,
    lastViewedAt: row.Last_Viewed_At != null ? String(row.Last_Viewed_At) : null,
    createdAt: String(row.Created ?? ""),
    newMatchCount: 0,
  };
}

export async function getCustomerWatchlists(userId: string): Promise<WatchlistRecord[]> {
  const client = new TeableClient(getTeableConfig());
  const selectCols = WATCHLIST_FIELD_KEYS.map((f) => qi(f)).join(", ");
  const sql =
    "SELECT " +
    selectCols +
    " FROM " +
    qiTable(DB_TABLES.Property_Watchlists) +
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
  return rows.map(parseRow);
}

export async function createWatchlist(
  userId: string,
  filters: WatchlistFilters,
  notificationFrequency: string = "Daily",
): Promise<string> {
  const client = new TeableClient(getTeableConfig());
  const wlFields = FIELDS.Property_Watchlists;

  const createFields: Record<string, unknown> = {
    [wlFields.User.id]: [{ id: userId }],
    [wlFields.Active.id]: true,
    [wlFields.Notification_Frequency.id]: notificationFrequency,
  };

  if (filters.listingType) createFields[wlFields.Listing_Type.id] = filters.listingType;
  if (filters.propertyType) createFields[wlFields.Property_Type.id] = filters.propertyType;
  if (filters.priceMax) createFields[wlFields.Maximum_Price.id] = filters.priceMax;
  if (filters.currency) createFields[wlFields.Currency.id] = filters.currency;
  if (filters.bedrooms) createFields[wlFields.Minimum_Bedrooms.id] = filters.bedrooms;
  if (filters.bathrooms) createFields[wlFields.Minimum_Bathrooms.id] = filters.bathrooms;
  if (filters.furnished) createFields[wlFields.Furnished.id] = filters.furnished;
  if (filters.elevator) createFields[wlFields.Elevator_Required.id] = true;
  if (filters.wifi) createFields[wlFields.WiFi_Required.id] = true;
  if (filters.pool) createFields[wlFields.Pool.id] = "Yes";
  if (filters.city) createFields[wlFields.City.id] = [{ id: filters.city }];
  if (filters.area) createFields[wlFields.Area.id] = [{ id: filters.area }];
  if (filters.development) createFields[wlFields.Development.id] = [{ id: filters.development }];

  const record = await client.createRecord(TABLES.Property_Watchlists, createFields);
  await invalidate({ tags: [TAGS.WATCHLIST] });
  return record.id;
}

export async function deactivateWatchlist(userId: string, watchlistId: string): Promise<void> {
  const client = new TeableClient(getTeableConfig());
  const wlFields = FIELDS.Property_Watchlists;
  await client.updateRecord(TABLES.Property_Watchlists, watchlistId, {
    [wlFields.Active.id]: false,
  });
  await invalidate({ tags: [TAGS.WATCHLIST] });
}

export async function markWatchlistViewed(userId: string, watchlistId: string): Promise<void> {
  const client = new TeableClient(getTeableConfig());
  const wlFields = FIELDS.Property_Watchlists;
  await client.updateRecord(TABLES.Property_Watchlists, watchlistId, {
    [wlFields.Last_Viewed_At.id]: new Date().toISOString(),
  });
  await invalidate({ tags: [TAGS.WATCHLIST] });
}

export function watchlistsCacheTags(userId: string): string[] {
  return [TAGS.WATCHLIST, TAGS.WATCHLIST + ":" + userId];
}
