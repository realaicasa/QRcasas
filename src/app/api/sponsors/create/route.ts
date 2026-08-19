import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCustomerAuth } from "@/lib/customer-auth";
import { createSponsorAdvert } from "@/lib/data/sponsors";

export async function POST(req: NextRequest) {
  const store = await cookies();
  const cookie = store.get("qrcasas_session")?.value;
  const session = await getCustomerAuth(cookie);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    sponsorName: string;
    businessName: string;
    businessAddress: string;
    contactInfo: string;
    advertTitle: string;
    advertDescription: string;
    linkUrl: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!body.sponsorName || !body.businessName || !body.advertTitle || !body.linkUrl) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const id = await createSponsorAdvert(body);
    return NextResponse.json({ id });
  } catch (err) {
    console.error("Sponsor creation failed:", err);
    return NextResponse.json({ error: "Failed to create advert" }, { status: 500 });
  }
}
