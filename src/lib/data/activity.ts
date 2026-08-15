import "server-only";

import { getTeableConfig, TeableClient, type SqlRow, qiTable } from "./teable/client";
import { lit, qi } from "./teable/sql";
import { TABLES, DB_TABLES } from "./teable/tables";

export async function recordContactDetailsOpen(
  propertyId: string,
  visitorId: string,
  language: "en" | "es",
): Promise<boolean> {
  const client = new TeableClient(getTeableConfig());
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const sql =
    "SELECT " + qi("__id") + " FROM " + qiTable(DB_TABLES.Property_Activity) +
    " WHERE " + qi("Session_ID") + " = " + lit(visitorId) +
    " AND " + qi("Property") + " = " + lit(propertyId) +
    " AND " + qi("Event_Type") + " = " + lit("Contact Details Opened") +
    " AND " + qi("Created") + " >= " + lit(today.toISOString()) +
    " LIMIT 1";
  if ((await client.runSql<SqlRow>(sql)).length > 0) return false;

  await client.createRecord(TABLES.Property_Activity, {
    Activity: "Contact details opened",
    Event_Type: "Contact Details Opened",
    Source: "Marketplace",
    Session_ID: visitorId,
    Language: language === "es" ? "Spanish" : "English",
    Property: [{ id: propertyId }],
  });
  return true;
}

export async function countContactDetailsOpens(propertyId: string): Promise<number> {
  const client = new TeableClient(getTeableConfig());
  const sql =
    "SELECT COUNT(*) AS count FROM " + qiTable(DB_TABLES.Property_Activity) +
    " WHERE " + qi("Property") + " = " + lit(propertyId) +
    " AND " + qi("Event_Type") + " = " + lit("Contact Details Opened");
  const rows = await client.runSql<SqlRow>(sql);
  return Number(rows[0]?.count ?? 0);
}
