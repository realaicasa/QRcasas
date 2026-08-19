import "server-only";

import { getTeableConfig, TeableClient, type SqlRow, qiTable, linkId } from "./teable/client";
import { lit, qi } from "./teable/sql";
import { TABLES } from "./teable/tables";
import { TAGS, invalidate } from "./cache";

export interface SponsorAdvert {
  id: string;
  sponsorName: string;
  businessName: string;
  businessAddress: string;
  contactInfo: string;
  advertTitle: string;
  advertDescription: string;
  imageUrl: string | null;
  linkUrl: string;
  billingStatus: string;
  monthlyAmount: number;
  stripeCheckoutSessionId: string | null;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  currentPeriodEnd: string | null;
  cancellationAt: string | null;
}

function parseAdvertRow(row: SqlRow, id: string): SponsorAdvert {
  return {
    id,
    sponsorName: String(row.Sponsor_Name ?? ""),
    businessName: String(row.Business_Name ?? ""),
    businessAddress: String(row.Business_Address ?? ""),
    contactInfo: String(row.Contact_Info ?? ""),
    advertTitle: String(row.Advert_Title ?? ""),
    advertDescription: String(row.Advert_Description ?? ""),
    imageUrl: row.Advert_Image ? String(row.Advert_Image) : null,
    linkUrl: String(row.Link_URL ?? ""),
    billingStatus: String(row.Billing_Status ?? "Inactive"),
    monthlyAmount: Number(row.Monthly_Amount ?? 0),
    stripeCheckoutSessionId: row.Stripe_Checkout_Session_ID ? String(row.Stripe_Checkout_Session_ID) : null,
    stripeSubscriptionId: row.Stripe_Subscription_ID ? String(row.Stripe_Subscription_ID) : null,
    stripeCustomerId: row.Stripe_Customer_ID ? String(row.Stripe_Customer_ID) : null,
    currentPeriodEnd: row.Current_Period_End ? String(row.Current_Period_End) : null,
    cancellationAt: row.Cancellation_At ? String(row.Cancellation_At) : null,
  };
}

export async function createSponsorAdvert(data: {
  sponsorName: string;
  businessName: string;
  businessAddress: string;
  contactInfo: string;
  advertTitle: string;
  advertDescription: string;
  linkUrl: string;
}): Promise<string> {
  const client = new TeableClient(getTeableConfig());
  const record = await client.createRecord("Sponsor_Adverts", {
    Sponsor_Name: data.sponsorName,
    Business_Name: data.businessName,
    Business_Address: data.businessAddress,
    Contact_Info: data.contactInfo,
    Advert_Title: data.advertTitle,
    Advert_Description: data.advertDescription,
    Link_URL: data.linkUrl,
    Billing_Status: "Inactive",
    Monthly_Amount: 1200,
  });
  await invalidate({ tags: [TAGS.PROPERTIES] });
  return record.id;
}

export async function updateSponsorAdvert(id: string, updates: Partial<SponsorAdvert>): Promise<void> {
  const client = new TeableClient(getTeableConfig());
  await client.updateRecord("Sponsor_Adverts", id, updates);
  await invalidate({ tags: [TAGS.PROPERTIES] });
}

export async function getSponsorAdvertById(id: string): Promise<SponsorAdvert | null> {
  const client = new TeableClient(getTeableConfig());
  const rows = await client.runSql<SqlRow>(
    `SELECT * FROM ${qiTable("Sponsor_Adverts")} WHERE ${qi("__id")} = ${lit(id)} LIMIT 1`,
  );
  if (rows.length === 0) return null;
  return parseAdvertRow(rows[0], id);
}

export async function getActiveSponsorAdverts(): Promise<SponsorAdvert[]> {
  const client = new TeableClient(getTeableConfig());
  const rows = await client.runSql<SqlRow>(
    `SELECT * FROM ${qiTable("Sponsor_Adverts")} WHERE ${qi("Billing_Status")} = ${lit("Active")} ORDER BY ${qi("Created")} DESC`,
  );
  return rows.map((row, i) => parseAdvertRow(row, String(row.__id ?? `s-${i}`)));
}
