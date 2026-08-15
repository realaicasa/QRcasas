import { NextResponse } from "next/server";
import { recordContactDetailsOpen } from "@/lib/data/activity";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { propertyId?: string; visitorId?: string; language?: "en" | "es" };
    if (!body.propertyId || !body.visitorId || body.visitorId.length > 120) {
      return NextResponse.json({ error: "Invalid activity" }, { status: 400 });
    }
    const recorded = await recordContactDetailsOpen(
      body.propertyId,
      body.visitorId,
      body.language === "es" ? "es" : "en",
    );
    return NextResponse.json({ recorded });
  } catch (error) {
    console.error("activity recording failed", error);
    return NextResponse.json({ error: "Activity unavailable" }, { status: 503 });
  }
}
