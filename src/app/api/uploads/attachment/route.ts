import { NextResponse } from "next/server";
import sharp from "sharp";
import { getCustomerAuth } from "@/lib/customer-auth";
import { getAgentByUserId } from "@/lib/data/agents";
import { getPropertyById } from "@/lib/data/property";
import { getTeableConfig, TeableClient, type SqlRow, qiTable } from "@/lib/data/teable/client";
import { lit, qi } from "@/lib/data/teable/sql";
import { DB_TABLES, TABLES } from "@/lib/data/teable/tables";

const PROPERTIES_TABLE = DB_TABLES.Properties;
const AGENTS_TABLE = DB_TABLES.Agents;

export async function POST(request: Request) {
  try {
    const session = await getCustomerAuth();
    if (!session) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

    const form = await request.formData();
    const recordId = String(form.get("recordId") ?? "");
    const fieldId = String(form.get("fieldId") ?? "");
    const file = form.get("file");
    const altText = String(form.get("altText") ?? "").trim();
    if (!(file instanceof File) || !recordId || !fieldId) {
      return NextResponse.json({ error: "File, recordId, and fieldId are required" }, { status: 400 });
    }
    if (!file.type.startsWith("image/") || file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: "Images must be under 15MB" }, { status: 400 });
    }

    const agent = await getAgentByUserId(session.userId);
    if (!agent) return NextResponse.json({ error: "Agent profile required" }, { status: 403 });

    const isAgentPhoto = recordId === agent.id && (fieldId === "fld6ugy4EQy1HQyseVg" || fieldId === "fldx4W6ZEhSV29zqJYV");
    const property = !isAgentPhoto && fieldId === "flddQnBjD5EOywUaeOe" ? await getPropertyById(recordId) : null;
    if (!isAgentPhoto && (!property || property.clientId !== agent.id)) {
      return NextResponse.json({ error: "You do not own this record" }, { status: 403 });
    }

    const client = new TeableClient(getTeableConfig());
    let currentPhotos: unknown[] = [];
    if (property) {
      const sql = "SELECT " + qi("Photos") + ", " + qi("Photo_Package") + " FROM " + qiTable(PROPERTIES_TABLE) + " WHERE " + qi("__id") + " = " + lit(recordId);
      const rows = await client.runSql<SqlRow>(sql);
      currentPhotos = Array.isArray(rows[0]?.Photos) ? rows[0].Photos as unknown[] : [];
      const packageName = rows[0]?.Photo_Package != null ? String(rows[0].Photo_Package) : "Standard";
      if (packageName !== "Paid" && currentPhotos.length >= 1) {
        return NextResponse.json({ error: "The 10-photo upgrade must be paid before adding more photos" }, { status: 402 });
      }
    }

    const webp = await sharp(Buffer.from(await file.arrayBuffer()))
      .rotate()
      .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
    const uploadForm = new FormData();
    uploadForm.append("file", new Blob([webp], { type: "image/webp" }), `${file.name.replace(/\.[^.]+$/, "")}.webp`);

    const rawBase = process.env.TEABLE_API_URL ?? "";
    const configured = new URL(rawBase);
    const baseUrl = configured.hostname === "api.teable.io" || configured.pathname.includes("/base/")
      ? "https://app.teable.ai/api"
      : rawBase.replace(/\/$/, "");
    const response = await fetch(`${baseUrl}/table/${property ? TABLES.Properties : TABLES.Agents}/record/${recordId}/${fieldId}/uploadAttachment`, {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.TEABLE_API_TOKEN ?? ""}` },
      body: uploadForm,
    });
    if (!response.ok) return NextResponse.json({ error: "Teable upload failed" }, { status: 502 });

    if (property && altText) {
      const altRows = await client.runSql<SqlRow>("SELECT " + qi("Photo_Alt_Text") + " FROM " + qiTable(PROPERTIES_TABLE) + " WHERE " + qi("__id") + " = " + lit(recordId));
      let altTexts: string[] = [];
      try { altTexts = JSON.parse(String(altRows[0]?.Photo_Alt_Text ?? "[]")); } catch { altTexts = []; }
      altTexts[currentPhotos.length] = altText;
      await client.updateRecord(TABLES.Properties, recordId, { Photo_Alt_Text: JSON.stringify(altTexts) });
    }

    return NextResponse.json({ ok: true, featured: currentPhotos.length === 0, format: "webp" });
  } catch (error) {
    console.error("attachment upload failed", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
