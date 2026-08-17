import "server-only";

import { getTeableConfig, TeableClient, type SqlRow, qiTable } from "./teable/client";
import { lit, qi } from "./teable/sql";
import { DB_TABLES, TABLES } from "./teable/tables";
import { FIELDS } from "./teable/fields.generated";
import { publicEligibilityWhere } from "./eligibility";
import { TAGS, invalidate } from "./cache";

export interface AgentRecord {
  agentId: string;
  businessName: string;
  tierLevel: "Free" | "Pro" | "Pro_Plus";
  primaryContactChannel: "WhatsApp" | "Phone" | "Email" | "Instagram" | "Facebook";
  primaryContactValue: string;
  defaultLanguage: "en" | "es";
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AgentProfile {
  id: string;
  businessName: string;
  tierLevel: "Free" | "Pro" | "Pro_Plus";
  primaryContactChannel: "WhatsApp" | "Phone" | "Email" | "Instagram" | "Facebook";
  primaryContactValue: string;
  defaultLanguage: "en" | "es";
  logoImage: { url?: string; signedUrl?: string } | null;
  profilePhoto: { url?: string; signedUrl?: string } | null;
  bioDescription: string | null;
  socialInstagram: string | null;
  socialFacebook: string | null;
  socialLinkedIn: string | null;
  websiteUrl: string | null;
  customSlug: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Whether the agent tier allows custom SEO fields */
export function agentHasSeoAccess(tierLevel: string): boolean {
  return tierLevel === "Pro" || tierLevel === "Pro_Plus";
}

/** Resolve SEO title with fallback chain: custom > businessName default */
export function resolveAgentSeoTitle(agent: AgentProfile): string {
  return agent.seoTitle || `${agent.businessName} - Real Estate Agent`;
}

/** Resolve SEO description with fallback chain: custom > bio snippet default */
export function resolveAgentSeoDescription(agent: AgentProfile): string | null {
  return agent.seoDescription || agent.bioDescription?.slice(0, 160) || null;
}

function parseAgentRow(row: SqlRow): AgentRecord {
  return {
    agentId: String(row.__id ?? ""),
    businessName: String(row.Business_Name ?? ""),
    tierLevel: (row.Tier_Level as "Free" | "Pro" | "Pro_Plus") ?? "Free",
    primaryContactChannel: (row.Primary_Contact_Channel as "WhatsApp" | "Phone" | "Email" | "Instagram" | "Facebook") ?? "WhatsApp",
    primaryContactValue: String(row.Primary_Contact_Value ?? ""),
    defaultLanguage: (row.Default_Language as "en" | "es") ?? "es",
    isVerified: row.Is_Verified === true,
    createdAt: String(row.Created ?? ""),
    updatedAt: String(row.Updated ?? ""),
  };
}

function parseAgentProfile(row: SqlRow): AgentProfile {
  const logoRaw = row.Logo_Image;
  const logoImage = logoRaw && typeof logoRaw === "object"
    ? {
        url: typeof (logoRaw as Record<string, unknown>).url === "string" ? String((logoRaw as Record<string, unknown>).url) : undefined,
        signedUrl: typeof (logoRaw as Record<string, unknown>).signedUrl === "string" ? String((logoRaw as Record<string, unknown>).signedUrl) : undefined,
      }
    : null;

  return {
    id: String(row.__id ?? ""),
    businessName: String(row.Business_Name ?? ""),
    tierLevel: (row.Tier_Level as "Free" | "Pro" | "Pro_Plus") ?? "Free",
    primaryContactChannel: (row.Primary_Contact_Channel as "WhatsApp" | "Phone" | "Email" | "Instagram" | "Facebook") ?? "WhatsApp",
    primaryContactValue: String(row.Primary_Contact_Value ?? ""),
    defaultLanguage: (row.Default_Language as "en" | "es") ?? "es",
    logoImage,
    profilePhoto: row.Profile_Photo && typeof row.Profile_Photo === "object"
      ? {
          url: typeof (row.Profile_Photo as Record<string, unknown>).url === "string" ? String((row.Profile_Photo as Record<string, unknown>).url) : undefined,
          signedUrl: typeof (row.Profile_Photo as Record<string, unknown>).signedUrl === "string" ? String((row.Profile_Photo as Record<string, unknown>).signedUrl) : undefined,
        }
      : null,
    bioDescription: row.Bio_Description != null ? String(row.Bio_Description) : null,
    socialInstagram: row.Social_Instagram != null ? String(row.Social_Instagram) : null,
    socialFacebook: row.Social_Facebook != null ? String(row.Social_Facebook) : null,
    socialLinkedIn: row.Social_LinkedIn != null ? String(row.Social_LinkedIn) : null,
    websiteUrl: row.Website_URL != null ? String(row.Website_URL) : null,
    customSlug: row.Custom_Slug != null ? String(row.Custom_Slug) : null,
    seoTitle: row.SEO_Title != null ? String(row.SEO_Title) : null,
    seoDescription: row.SEO_Description != null ? String(row.SEO_Description) : null,
    seoKeywords: row.SEO_Keywords != null ? String(row.SEO_Keywords) : null,
    isVerified: row.Is_Verified === true,
    createdAt: String(row.Created ?? ""),
    updatedAt: String(row.Updated ?? ""),
  };
}

export async function getAllAgents(): Promise<AgentRecord[]> {
  const client = new TeableClient(getTeableConfig());
  const sql =
    "SELECT " +
    [
      qi("__id"),
      qi("Business_Name"),
      qi("Tier_Level"),
      qi("Primary_Contact_Channel"),
      qi("Primary_Contact_Value"),
      qi("Default_Language"),
      qi("Is_Verified"),
      qi("Created"),
      qi("Updated"),
    ].join(", ") +
    " FROM " +
    qiTable(DB_TABLES.Agents) +
    " WHERE " +
    qi("Is_Verified") +
    " IS TRUE" +
    " ORDER BY " +
    qi("Created") +
    " DESC";
  const rows = await client.runSql<SqlRow>(sql);
  return rows.map(parseAgentRow);
}

export async function getAgentById(agentId: string): Promise<AgentProfile | null> {
  const client = new TeableClient(getTeableConfig());
  const sql =
    "SELECT " +
    [
      qi("__id"),
      qi("Business_Name"),
      qi("Tier_Level"),
      qi("Primary_Contact_Channel"),
      qi("Primary_Contact_Value"),
      qi("Default_Language"),
      qi("Logo_Image"),
      qi("Profile_Photo"),
      qi("Bio_Description"),
      qi("Social_Instagram"),
      qi("Social_Facebook"),
      qi("Social_LinkedIn"),
      qi("Website_URL"),
      qi("Custom_Slug"),
      qi("SEO_Title"),
      qi("SEO_Description"),
      qi("SEO_Keywords"),
      qi("Is_Verified"),
      qi("Created"),
      qi("Updated"),
    ].join(", ") +
    " FROM " +
    qiTable(DB_TABLES.Agents) +
    " WHERE " +
    qi("__id") +
    " = " +
    lit(agentId) +
    " AND " +
    qi("Is_Verified") +
    " IS TRUE";
  const rows = await client.runSql<SqlRow>(sql);
  return rows.length > 0 ? parseAgentProfile(rows[0]) : null;
}

export async function updateAgentProfile(
  agentId: string,
  updates: Partial<AgentProfile>
): Promise<void> {
  const client = new TeableClient(getTeableConfig());
  await client.updateRecord(TABLES.Agents, agentId, updates);
  await invalidate({ tags: [TAGS.AGENTS] });
}

export interface CreateAgentInput {
  businessName: string;
  primaryContactChannel: string;
  primaryContactValue: string;
  defaultLanguage: "en" | "es";
}

export async function createAgent(
  userId: string,
  input: CreateAgentInput,
): Promise<string> {
  const client = new TeableClient(getTeableConfig());
  const record = await client.createRecord(TABLES.Agents, {
    [FIELDS.Agents.Business_Name.id]: input.businessName,
    [FIELDS.Agents.Primary_Contact_Channel.id]: input.primaryContactChannel,
    [FIELDS.Agents.Primary_Contact_Value.id]: input.primaryContactValue,
    [FIELDS.Agents.Default_Language.id]: input.defaultLanguage,
    [FIELDS.Agents.Tier_Level.id]: "Free",
    [FIELDS.Agents.Is_Verified.id]: false,
    [FIELDS.Agents.User.id]: [{ id: userId }],
  });
  await invalidate({ tags: [TAGS.AGENTS] });
  return record.id;
}

export async function getAgentByUserId(userId: string): Promise<AgentProfile | null> {
  const client = new TeableClient(getTeableConfig());
  const sql =
    "SELECT " +
    [
      qi("__id"),
      qi("Business_Name"),
      qi("Tier_Level"),
      qi("Primary_Contact_Channel"),
      qi("Primary_Contact_Value"),
      qi("Default_Language"),
      qi("Logo_Image"),
      qi("Profile_Photo"),
      qi("Bio_Description"),
      qi("Social_Instagram"),
      qi("Social_Facebook"),
      qi("Social_LinkedIn"),
      qi("Website_URL"),
      qi("Custom_Slug"),
      qi("SEO_Title"),
      qi("SEO_Description"),
      qi("SEO_Keywords"),
      qi("Is_Verified"),
      qi("Created"),
      qi("Updated"),
    ].join(", ") +
    " FROM " +
    qiTable(DB_TABLES.Agents) +
    " WHERE " +
    qi("User") +
    " = " +
    lit(userId) +
    " LIMIT 1";
  const rows = await client.runSql<SqlRow>(sql);
  return rows.length > 0 ? parseAgentProfile(rows[0]) : null;
}

// Placeholder for cache tags function
export function agentsCacheTags(): string[] {
  return [TAGS.AGENTS];
}
