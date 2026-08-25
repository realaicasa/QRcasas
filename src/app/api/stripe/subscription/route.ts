import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCustomerAuth } from "@/lib/customer-auth";
import { getAgentByUserId, updateAgentProfile } from "@/lib/data/agents";
import { createCheckoutSession, isStripeConfigured, RECURRING_PRICE_IDS } from "@/lib/stripe";
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

  const agent = await getAgentByUserId(session.userId);
  if (!agent) {
    return NextResponse.json({ error: "Agent profile required" }, { status: 403 });
  }

  let body: {
    requestVerified: boolean;
    requestFeatured: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { requestVerified, requestFeatured } = body;
  if (!requestVerified && !requestFeatured) {
    return NextResponse.json({ error: "Select at least one upgrade" }, { status: 400 });
  }

  const lineItems: Array<{
    price?: string;
    quantity: number;
    price_data?: {
      currency: string;
      unit_amount: number;
      recurring: { interval: "month" };
      product_data: { name: string };
    };
  }> = [];

  if (requestVerified) {
    const priceId = RECURRING_PRICE_IDS.verified_agent_monthly;
    if (priceId) {
      lineItems.push({ price: priceId, quantity: 1 });
    } else {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: "mxn",
          unit_amount: 30000,
          recurring: { interval: "month" },
          product_data: { name: "Verified Agent — monthly" },
        },
      });
    }
  }

  if (requestFeatured) {
    const priceId = RECURRING_PRICE_IDS.featured_agent_monthly;
    if (priceId) {
      lineItems.push({ price: priceId, quantity: 1 });
    } else {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: "mxn",
          unit_amount: 30000,
          recurring: { interval: "month" },
          product_data: { name: "Featured Agent — monthly" },
        },
      });
    }
  }

  const successUrl = absoluteUrl("/account/properties?subscribed=1&session_id={CHECKOUT_SESSION_ID}");
  const cancelUrl = absoluteUrl("/account/properties?canceled=1");

  const stripeSession = await createCheckoutSession({
    lineItems: lineItems as never,
    successUrl,
    cancelUrl,
    mode: "subscription",
    metadata: {
      agentId: agent.id,
      requestVerified: String(requestVerified),
      requestFeatured: String(requestFeatured),
    },
  });

  if (requestVerified) {
    await updateAgentProfile(agent.id, {
      identityVerificationStatus: "Pending Review",
    } as never);
  }

  if (!stripeSession.url) {
    return NextResponse.json({ error: "Stripe did not return a checkout URL" }, { status: 500 });
  }

  return NextResponse.json({ url: stripeSession.url });
}
