import "server-only";

import { getTeableConfig, TeableClient, type SqlRow, qiTable } from "./teable/client";
import { qi } from "./teable/sql";
import { DB_TABLES } from "./teable/tables";

export interface ReadinessCheck {
  id: string;
  label: string;
  status: "pass" | "warn" | "fail";
  detail: string;
  category: string;
}

export async function getReadinessChecks(): Promise<ReadinessCheck[]> {
  const client = new TeableClient(getTeableConfig());
  const checks: ReadinessCheck[] = [];

  // 1. Legal pages published
  try {
    const legalSql = "SELECT COUNT(*) as total FROM " + qiTable(DB_TABLES.Properties) + " WHERE " + qi("Published") + " IS TRUE";
    const legalRows = await client.runSql<SqlRow>(legalSql);
    const legalPublished = Number(legalRows[0]?.total ?? 0);
    checks.push({
      id: "legal_published",
      label: "Legal Pages Published",
      status: legalPublished >= 4 ? "pass" : legalPublished > 0 ? "warn" : "fail",
      detail: `${legalPublished} of 4 legal documents published`,
      category: "compliance",
    });
  } catch {
    checks.push({
      id: "legal_published",
      label: "Legal Pages Published",
      status: "fail",
      detail: "Unable to query legal page status",
      category: "compliance",
    });
  }

  // 2. CAPTCHA configured
  const captchaConfigured = !!process.env.CAPTCHA_SITE_KEY && !!process.env.CAPTCHA_SECRET_KEY;
  checks.push({
    id: "captcha_configured",
    label: "CAPTCHA Configured",
    status: captchaConfigured ? "pass" : "fail",
    detail: captchaConfigured ? "CAPTCHA keys present" : "CAPTCHA keys missing",
    category: "security",
  });

  // 3. Messaging adapter
  const botcommerceConfigured = !!process.env.BOTCOMMERCE_API_KEY;
  const zernioConfigured = !!process.env.ZERNIO_API_KEY;
  checks.push({
    id: "messaging_ready",
    label: "Messaging Adapter Ready",
    status: botcommerceConfigured || zernioConfigured ? "pass" : "warn",
    detail: botcommerceConfigured
      ? "BotCommerce configured"
      : zernioConfigured
        ? "Zernio configured"
        : "No messaging adapter configured",
    category: "messaging",
  });

  // 4. Property inventory count
  try {
    const invSql = "SELECT COUNT(*) as total FROM " + qiTable(DB_TABLES.Properties) + " WHERE " + qi("Public_Slug") + " IS NOT NULL";
    const invRows = await client.runSql<SqlRow>(invSql);
    const inventoryCount = Number(invRows[0]?.total ?? 0);
    checks.push({
      id: "inventory_count",
      label: "Public Listings Available",
      status: inventoryCount > 0 ? "pass" : "warn",
      detail: `${inventoryCount} public property listing(s)`,
      category: "inventory",
    });
  } catch {
    checks.push({
      id: "inventory_count",
      label: "Public Listings Available",
      status: "fail",
      detail: "Unable to query inventory",
      category: "inventory",
    });
  }

  // 5. Agent directory supply
  try {
    const agentSql = "SELECT COUNT(*) as total FROM " + qiTable(DB_TABLES.Agents) + " WHERE " + qi("Is_Verified") + " IS TRUE";
    const agentRows = await client.runSql<SqlRow>(agentSql);
    const agentCount = Number(agentRows[0]?.total ?? 0);
    checks.push({
      id: "directory_supply",
      label: "Directory Agent Supply",
      status: agentCount > 0 ? "pass" : "warn",
      detail: `${agentCount} verified agent(s) in directory`,
      category: "inventory",
    });
  } catch {
    checks.push({
      id: "directory_supply",
      label: "Directory Agent Supply",
      status: "fail",
      detail: "Unable to query agent directory",
      category: "inventory",
    });
  }

  // 6. SEO completion rate
  try {
    const seoSql = "SELECT COUNT(*) as with_seo FROM " + qiTable(DB_TABLES.Agents) + " WHERE " + qi("SEO_Title") + " IS NOT NULL AND " + qi("SEO_Title") + " != ''";
    const seoRows = await client.runSql<SqlRow>(seoSql);
    const withSeo = Number(seoRows[0]?.with_seo ?? 0);
    checks.push({
      id: "seo_completion",
      label: "Agent SEO Completion",
      status: withSeo > 0 ? "pass" : "warn",
      detail: `${withSeo} agent(s) with custom SEO metadata`,
      category: "seo",
    });
  } catch {
    checks.push({
      id: "seo_completion",
      label: "Agent SEO Completion",
      status: "fail",
      detail: "Unable to query SEO completion",
      category: "seo",
    });
  }

  // 7. Freshness (properties updated in last 30 days)
  try {
    const freshSql = "SELECT COUNT(*) as fresh FROM " + qiTable(DB_TABLES.Properties) + " WHERE " + qi("Updated") + " > NOW() - INTERVAL '30 days'";
    const freshRows = await client.runSql<SqlRow>(freshSql);
    const freshCount = Number(freshRows[0]?.fresh ?? 0);
    checks.push({
      id: "freshness",
      label: "Recent Property Updates",
      status: freshCount > 0 ? "pass" : "warn",
      detail: `${freshCount} propert(y/ies) updated in last 30 days`,
      category: "freshness",
    });
  } catch {
    checks.push({
      id: "freshness",
      label: "Recent Property Updates",
      status: "fail",
      detail: "Unable to query freshness",
      category: "freshness",
    });
  }

  // 8. Domain configuration
  const siteUrl = process.env.SITE_URL;
  checks.push({
    id: "domain_configured",
    label: "Domain Configured",
    status: siteUrl ? "pass" : "fail",
    detail: siteUrl || "SITE_URL not set",
    category: "infrastructure",
  });

  // 9. WhatsApp transport
  const whatsappConfigured = !!process.env.WHATSAPP_TOKEN;
  checks.push({
    id: "whatsapp_ready",
    label: "WhatsApp Transport",
    status: whatsappConfigured ? "pass" : "warn",
    detail: whatsappConfigured ? "WhatsApp token present" : "No WhatsApp token configured",
    category: "messaging",
  });

  return checks;
}
