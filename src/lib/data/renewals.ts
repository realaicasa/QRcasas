import "server-only";

import { getTeableConfig, TeableClient, type SqlRow, qiTable, linkId } from "./teable/client";
import { lit, qi } from "./teable/sql";
import { TABLES } from "./teable/tables";
import { TAGS, invalidate } from "./cache";

export interface RenewalRecord {
  id: string;
  status: string;
  packageName: string;
  propertyCount: number;
  amount: number;
  currency: string;
  photoAddOn: string;
  photoAddOnAmount: number;
  stripeCheckoutSessionId: string | null;
  properties: string[];
  advertiser: string | null;
  paidAt: string | null;
}

function parseRenewalRow(row: SqlRow, id: string): RenewalRecord {
  const propertiesRaw = row.Properties as unknown;
  let properties: string[] = [];
  if (Array.isArray(propertiesRaw)) {
    properties = propertiesRaw
      .map((p: unknown) => linkId(p))
      .filter((v): v is string => v != null);
  } else {
    const singleId = linkId(propertiesRaw);
    if (singleId) properties = [singleId];
  }
  return {
    id,
    status: String(row.Status ?? ""),
    packageName: String(row.Package ?? ""),
    propertyCount: Number(row.Property_Count ?? 0),
    amount: Number(row.Amount ?? 0),
    currency: String(row.Currency ?? ""),
    photoAddOn: String(row.Photo_Add_on ?? "None"),
    photoAddOnAmount: Number(row.Photo_Add_on_Amount ?? 0),
    stripeCheckoutSessionId: row.Stripe_Checkout_Session_ID
      ? String(row.Stripe_Checkout_Session_ID)
      : null,
    properties,
    advertiser: row.Advertiser ? String(row.Advertiser) : null,
    paidAt: row.Paid_At ? String(row.Paid_At) : null,
  };
}

export async function createPendingRenewal(params: {
  agentId: string;
  packageName: string;
  packagePrice: number;
  propertyIds: string[];
  photoUpgradePropertyIds: string[];
}): Promise<string> {
  const client = new TeableClient(getTeableConfig());
  const now = new Date();
  const ends = new Date(now);
  ends.setDate(ends.getDate() + 91);

  const record = await client.createRecord(TABLES.ListingRenewals, {
    Renewal: `R-${now.getTime()}`,
    Status: "Pending",
    Package: params.packageName,
    Property_Count: params.propertyIds.length,
    Properties: params.propertyIds.map((id) => ({ id })),
    Amount: params.packagePrice,
    Currency: "MXN",
    Term: "13 Weeks",
    Photo_Add_on: params.photoUpgradePropertyIds.length > 0 ? "Up to 10 Photos" : "None",
    Photo_Add_on_Amount: 200 * params.photoUpgradePropertyIds.length,
    Advertiser: [{ id: params.agentId }],
    Starts_At: now.toISOString(),
    Ends_At: ends.toISOString(),
  });

  await invalidate({ tags: [TAGS.PROPERTIES] });
  return record.id;
}

export async function updateRenewalStripeSession(
  renewalId: string,
  sessionId: string,
): Promise<void> {
  const client = new TeableClient(getTeableConfig());
  await client.updateRecord(TABLES.ListingRenewals, renewalId, {
    Stripe_Checkout_Session_ID: sessionId,
  });
}

export async function getRenewalById(renewalId: string): Promise<RenewalRecord | null> {
  const client = new TeableClient(getTeableConfig());
  const rows = await client.runSql<SqlRow>(
    `SELECT ${qi("Status")}, ${qi("Package")}, ${qi("Property_Count")}, ${qi("Amount")}, ${qi("Currency")}, ${qi("Photo_Add_on")}, ${qi("Photo_Add_on_Amount")}, ${qi("Stripe_Checkout_Session_ID")}, ${qi("Properties")}, ${qi("Advertiser")}, ${qi("Paid_At")} FROM ${qiTable(TABLES.ListingRenewals)} WHERE ${qi("__id")} = ${lit(renewalId)} LIMIT 1`,
  );
  if (rows.length === 0) return null;
  return parseRenewalRow(rows[0], renewalId);
}

export async function getRenewalByStripeSessionId(
  sessionId: string,
): Promise<RenewalRecord | null> {
  const client = new TeableClient(getTeableConfig());
  const rows = await client.runSql<SqlRow>(
    `SELECT ${qi("__id")}, ${qi("Status")}, ${qi("Package")}, ${qi("Property_Count")}, ${qi("Amount")}, ${qi("Currency")}, ${qi("Photo_Add_on")}, ${qi("Photo_Add_on_Amount")}, ${qi("Stripe_Checkout_Session_ID")}, ${qi("Properties")}, ${qi("Advertiser")}, ${qi("Paid_At")} FROM ${qiTable(TABLES.ListingRenewals)} WHERE ${qi("Stripe_Checkout_Session_ID")} = ${lit(sessionId)} LIMIT 1`,
  );
  if (rows.length === 0) return null;
  const row = rows[0];
  const id = String(row.__id ?? "");
  return parseRenewalRow(row, id);
}

export async function markRenewalPaid(renewalId: string): Promise<void> {
  const client = new TeableClient(getTeableConfig());
  await client.updateRecord(TABLES.ListingRenewals, renewalId, {
    Status: "Paid",
    Paid_At: new Date().toISOString(),
  });
  await invalidate({ tags: [TAGS.PROPERTIES] });
}

export async function setPropertiesPhotoPackagePaid(propertyIds: string[]): Promise<void> {
  if (propertyIds.length === 0) return;
  const client = new TeableClient(getTeableConfig());
  for (const id of propertyIds) {
    await client.updateRecord(TABLES.Properties, id, {
      Photo_Package: "Paid",
    });
  }
  await invalidate({ tags: [TAGS.PROPERTIES] });
}

export async function verifyPropertiesOwnership(
  agentId: string,
  propertyIds: string[],
): Promise<boolean> {
  if (propertyIds.length === 0) return false;
  const client = new TeableClient(getTeableConfig());
  const idList = propertyIds.map((id) => lit(id)).join(", ");
  const rows = await client.runSql<{ __id: string }>(
    `SELECT ${qi("__id")} FROM ${qiTable(TABLES.Properties)} WHERE ${qi("__id")} IN (${idList}) AND ${qi("Client")} = ${lit(agentId)}`,
  );
  return rows.length === propertyIds.length;
}
