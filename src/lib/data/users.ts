import "server-only";

import { getTeableConfig, TeableClient, type SqlRow, qiTable } from "./teable/client";
import { lit, qi } from "./teable/sql";
import { DB_TABLES, TABLES } from "./teable/tables";
import { FIELDS } from "./teable/fields.generated";
import { publicEligibilityWhere } from "./eligibility";
import { TAGS, invalidate } from "./cache";

export interface UserRecord {
  userId: string;
  email: string;
  preferredLanguage: "en" | "es";
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  preferredLanguage: "en" | "es";
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

function parseUserRow(row: SqlRow): UserRecord {
  return {
    userId: String(row.__id ?? ""),
    email: String(row.Email ?? ""),
    preferredLanguage: (row.Preferred_Language as "en" | "es") ?? "en",
    isVerified: row.Is_Verified === true,
    createdAt: String(row.Created ?? ""),
    updatedAt: String(row.Updated ?? ""),
  };
}

function parseUserProfile(row: SqlRow): UserProfile {
  return {
    id: String(row.__id ?? ""),
    email: String(row.Email ?? ""),
    preferredLanguage: (row.Preferred_Language as "en" | "es") ?? "en",
    isVerified: row.Is_Verified === true,
    createdAt: String(row.Created ?? ""),
    updatedAt: String(row.Updated ?? ""),
  };
}

export async function getUserById(userId: string): Promise<UserProfile | null> {
  const client = new TeableClient(getTeableConfig());
  const sql =
    "SELECT " +
    [
      qi("__id"),
      qi("Email"),
      qi("Preferred_Language"),
      qi("Is_Verified"),
      qi("Created"),
      qi("Updated"),
    ].join(", ") +
    " FROM " +
    qiTable(DB_TABLES.Users) +
    " WHERE " +
    qi("__id") +
    " = " +
    lit(userId) +
    " AND " +
    qi("Is_Verified") +
    " IS TRUE";
  const rows = await client.runSql<SqlRow>(sql);
  return rows.length > 0 ? parseUserProfile(rows[0]) : null;
}

export interface CreateUserInput {
  email: string;
  preferredLanguage?: "en" | "es";
  isVerified?: boolean;
}

export async function createUser(input: CreateUserInput): Promise<UserRecord> {
  const client = new TeableClient(getTeableConfig());
  const record = await client.createRecord(TABLES.Users, {
    Email: input.email,
    Preferred_Language: input.preferredLanguage ?? "en",
    Is_Verified: input.isVerified ?? false,
  });
  return {
    userId: record.id,
    email: input.email,
    preferredLanguage: input.preferredLanguage ?? "en",
    isVerified: input.isVerified ?? false,
    createdAt: "",
    updatedAt: "",
  };
}

export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  const client = new TeableClient(getTeableConfig());
  const sql =
    "SELECT " +
    [
      qi("__id"),
      qi("Email"),
      qi("Preferred_Language"),
      qi("Is_Verified"),
      qi("Created"),
      qi("Updated"),
    ].join(", ") +
    " FROM " +
    qiTable(DB_TABLES.Users) +
    " WHERE " +
    qi("Email") +
    " = " +
    lit(email) +
    " AND " +
    qi("Is_Verified") +
    " IS TRUE";
  const rows = await client.runSql<SqlRow>(sql);
  return rows.length > 0 ? parseUserRow(rows[0]) : null;
}

// Placeholder for cache tags function
export function usersCacheTags(): string[] {
  return [TAGS.USERS];
}
