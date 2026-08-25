import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCustomerAuth } from "@/lib/customer-auth";
import { absoluteUrl } from "@/lib/request";

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });

  const store = await cookies();
  const cookie = store.get("qrcasas_session")?.value;
  const session = await getCustomerAuth(cookie);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { customerId?: string } = {};
  try { body = await req.json(); } catch { /* no body */ }

  let customerId = body.customerId;

  if (!customerId) {
    const searchRes = await fetch(
      `https://api.stripe.com/v1/customers/search?query=email:'${encodeURIComponent(session.email)}'`,
      { headers: { Authorization: `Bearer ${secretKey}` } },
    );
    if (searchRes.ok) {
      const data = await searchRes.json();
      customerId = data.data?.[0]?.id;
    }
  }

  if (!customerId) return NextResponse.json({ error: "No Stripe customer found" }, { status: 404 });

  const returnUrl = absoluteUrl("/account/properties");

  const portalRes = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ customer: customerId, return_url: returnUrl }).toString(),
  });

  if (!portalRes.ok) {
    const err = await portalRes.text();
    return NextResponse.json({ error: `Portal creation failed: ${err}` }, { status: 500 });
  }

  const portal = await portalRes.json();
  return NextResponse.json({ url: portal.url });
}
