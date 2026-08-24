import { NextResponse } from "next/server";
import { recordContactDetailsOpen, recordAgentContactModalOpen } from "@/lib/data/activity";

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      propertyId?: string;
      agentId?: string;
      visitorId?: string;
      language?: "en" | "es";
      eventType?: "contact_details_opened" | "agent_contact_modal_opened";
    };

    if (!body.visitorId || body.visitorId.length > 120) {
      return NextResponse.json({ error: "Invalid activity" }, { status: 400 });
    }

    if (body.eventType === "agent_contact_modal_opened" && body.agentId) {
      const recorded = await recordAgentContactModalOpen(
        body.agentId,
        body.visitorId,
        body.language === "es" ? "es" : "en",
        body.propertyId,
      );
      return NextResponse.json({ recorded });
    }

    if (body.propertyId) {
      const recorded = await recordContactDetailsOpen(
        body.propertyId,
        body.visitorId,
        body.language === "es" ? "es" : "en",
      );
      return NextResponse.json({ recorded });
    }

    return NextResponse.json({ error: "Invalid activity" }, { status: 400 });
  } catch (error) {
    console.error("activity recording failed", error);
    return NextResponse.json({ error: "Activity unavailable" }, { status: 503 });
  }
}
