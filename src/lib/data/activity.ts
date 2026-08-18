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

export async function recordAgentContactModalOpen(
  agentId: string,
  visitorId: string,
  language: "en" | "es",
  propertyId?: string,
): Promise<boolean> {
  const client = new TeableClient(getTeableConfig());
  const fiveSecondsAgo = new Date(Date.now() - 5000).toISOString();
  const sql =
    "SELECT " + qi("__id") + " FROM " + qiTable(DB_TABLES.Property_Activity) +
    " WHERE " + qi("Session_ID") + " = " + lit(visitorId) +
    " AND " + qi("Advertiser") + " = " + lit(agentId) +
    " AND " + qi("Event_Type") + " = " + lit("Agent Contact Modal Opened") +
    " AND " + qi("Created") + " >= " + lit(fiveSecondsAgo) +
    " LIMIT 1";
  if ((await client.runSql<SqlRow>(sql)).length > 0) return false;

  await client.createRecord(TABLES.Property_Activity, {
    Activity: "Agent contact modal opened",
    Event_Type: "Agent Contact Modal Opened",
    Source: "Directory",
    Session_ID: visitorId,
    Language: language === "es" ? "Spanish" : "English",
    Advertiser: [{ id: agentId }],
    ...(propertyId ? { Property: [{ id: propertyId }] } : {}),
  });
  return true;
}

export async function countAgentContactOpens(agentId: string): Promise<{ total: number; thisMonth: number }> {
  const client = new TeableClient(getTeableConfig());
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const totalSql =
    "SELECT COUNT(*) AS count FROM " + qiTable(DB_TABLES.Property_Activity) +
    " WHERE " + qi("Advertiser") + " = " + lit(agentId) +
    " AND " + qi("Event_Type") + " = " + lit("Agent Contact Modal Opened");
  const totalRows = await client.runSql<SqlRow>(totalSql);
  const total = Number(totalRows[0]?.count ?? 0);

  const monthSql =
    "SELECT COUNT(*) AS count FROM " + qiTable(DB_TABLES.Property_Activity) +
    " WHERE " + qi("Advertiser") + " = " + lit(agentId) +
    " AND " + qi("Event_Type") + " = " + lit("Agent Contact Modal Opened") +
    " AND " + qi("Created") + " >= " + lit(monthStart);
  const monthRows = await client.runSql<SqlRow>(monthSql);
  const thisMonth = Number(monthRows[0]?.count ?? 0);

  return { total, thisMonth };
}
