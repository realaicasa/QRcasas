import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCustomerAuth } from "@/lib/customer-auth";
import { getSponsorAdvertById, updateSponsorAdvert } from "@/lib/data/sponsors";
import { createCheckoutSession, isStripeConfigured } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/request";

export async function POST(req: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
  }

  const store = await cookies();
  const cookie = store.get("qrcasas_session")?.value;
  const session = await getCustomerAuth(cookie);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { advertId: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const advert = await getSponsorAdvertById(body.advertId);
  if (!advert) {
    return NextResponse.json({ error: "Advert not found" }, { status: 404 });
  }

  const lineItems = [
    {
      quantity: 1,
      price_data: {
        currency: "mxn",
        unit_amount: 120000,
        recurring: { interval: "month" as const },
        product_data: { name: "Sponsor Advertisement — monthly" },
      },
    },
  ];

  const successUrl = absoluteUrl(`/sponsors/dashboard?subscribed=1&session_id={CHECKOUT_SESSION_ID}`);
  const cancelUrl = absoluteUrl("/sponsors/dashboard?canceled=1");

  const stripeSession = await createCheckoutSession({
    lineItems: lineItems as never,
    successUrl,
    cancelUrl,
    mode: "subscription",
    metadata: {
      advertId: advert.id,
      sponsorType: "sponsor",
    },
  });

  await updateSponsorAdvert(advert.id, {
    stripeCheckoutSessionId: stripeSession.id,
  });

  if (!stripeSession.url) {
    return NextResponse.json({ error: "Stripe did not return a URL" }, { status: 500 });
  }

  return NextResponse.json({ url: stripeSession.url });
}
