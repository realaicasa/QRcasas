import "server-only";

import { getTeableConfig, TeableClient, type SqlRow, qiTable, linkId } from "./teable/client";
import { lit, qi } from "./teable/sql";
import { TABLES } from "./teable/tables";
import { TAGS, invalidate } from "./cache";
import { getFirstSafeImage } from "@/lib/media";

export interface SponsorAdvert {
  id: string;
  advertTitle: string;
  businessName: string;
  offer: string;
  imageUrl: string;
  destinationUrl: string;
  billingStatus: string;
  monthlyAmount: number;
  approved: boolean;
  status: string;
  stripeCheckoutSessionId: string | null;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  currentPeriodEnd: string | null;
  cancellationAt: string | null;
}

function parseAdvertRow(row: SqlRow, id: string): SponsorAdvert {
  return {
    id,
    advertTitle: String(row.Advert ?? ""),
    businessName: String(row.Business_Name ?? ""),
    offer: String(row.Offer ?? ""),
    imageUrl: getFirstSafeImage(row.Creative),
    destinationUrl: String(row.Destination_URL ?? ""),
    billingStatus: String(row.Billing_Status ?? "Inactive"),
    monthlyAmount: Number(row.Monthly_Amount_MXN ?? 0),
    approved: row.Approved === true,
    status: String(row.Status ?? ""),
    stripeCheckoutSessionId: row.Stripe_Checkout_Session_ID ? String(row.Stripe_Checkout_Session_ID) : null,
    stripeSubscriptionId: row.Stripe_Subscription_ID ? String(row.Stripe_Subscription_ID) : null,
    stripeCustomerId: row.Stripe_Customer_ID ? String(row.Stripe_Customer_ID) : null,
    currentPeriodEnd: row.Current_Period_End ? String(row.Current_Period_End) : null,
    cancellationAt: row.Cancellation_At ? String(row.Cancellation_At) : null,
  };
}

export async function createSponsorAdvert(data: {
  contactName: string;
  businessName: string;
  businessAddress: string;
  contactInfo: string;
  advertTitle: string;
  advertDescription: string;
  linkUrl: string;
  userId?: string;
  email?: string;
}): Promise<string> {
  const client = new TeableClient(getTeableConfig());

  const sponsorAccount = await client.createRecord(TABLES.SponsorAccounts, {
    Contact_Name: data.contactName,
    Business_Name: data.businessName,
    Business_Address: data.businessAddress,
    Email: data.email ?? data.contactInfo,
    Contact_Phone: data.contactInfo,
    Website: data.linkUrl,
    User_ID: data.userId ?? "",
    Status: "Active",
  });

  const record = await client.createRecord(TABLES.BusinessAdverts, {
    Advert: data.advertTitle,
    Business_Name: data.businessName,
    Destination_URL: data.linkUrl,
    Offer: data.advertDescription,
    Billing_Status: "Inactive",
    Monthly_Amount_MXN: 1200,
    Approved: false,
    Status: "Draft",
    Sponsor_Account: [{ id: sponsorAccount.id }],
  });

  await invalidate({ tags: [TAGS.PROPERTIES] });
  return record.id;
}

export async function updateSponsorAdvert(id: string, updates: Record<string, unknown>): Promise<void> {
  const client = new TeableClient(getTeableConfig());
  await client.updateRecord(TABLES.BusinessAdverts, id, updates);
  await invalidate({ tags: [TAGS.PROPERTIES] });
}

export async function getSponsorAdvertById(id: string): Promise<SponsorAdvert | null> {
  const client = new TeableClient(getTeableConfig());
  const rows = await client.runSql<SqlRow>(
    `SELECT ${qi("__id")}, ${qi("Advert")}, ${qi("Business_Name")}, ${qi("Offer")}, ${qi("Creative")}, ${qi("Destination_URL")}, ${qi("Billing_Status")}, ${qi("Monthly_Amount_MXN")}, ${qi("Approved")}, ${qi("Status")}, ${qi("Stripe_Checkout_Session_ID")}, ${qi("Stripe_Subscription_ID")}, ${qi("Stripe_Customer_ID")}, ${qi("Current_Period_End")}, ${qi("Cancellation_At")} FROM ${qiTable(TABLES.BusinessAdverts)} WHERE ${qi("__id")} = ${lit(id)} LIMIT 1`,
  );
  if (rows.length === 0) return null;
  return parseAdvertRow(rows[0], id);
}

export async function getActiveSponsorAdverts(): Promise<SponsorAdvert[]> {
  const client = new TeableClient(getTeableConfig());
  const rows = await client.runSql<SqlRow>(
    `SELECT ${qi("__id")}, ${qi("Advert")}, ${qi("Business_Name")}, ${qi("Offer")}, ${qi("Creative")}, ${qi("Destination_URL")}, ${qi("Billing_Status")}, ${qi("Monthly_Amount_MXN")}, ${qi("Approved")}, ${qi("Status")} FROM ${qiTable(TABLES.BusinessAdverts)} WHERE ${qi("Billing_Status")} = ${lit("Active")} AND ${qi("Approved")} IS TRUE ORDER BY ${qi("Priority")} ASC, ${qi("Created")} DESC`,
  );
  return rows.map((row) => parseAdvertRow(row, String(row.__id ?? "")));
}
