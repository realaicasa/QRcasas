import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCustomerAuth } from "@/lib/customer-auth";
import { getAgentByUserId } from "@/lib/data/agents";
import {
  createPendingRenewal,
  updateRenewalStripeSession,
  verifyPropertiesOwnership,
} from "@/lib/data/renewals";
import {
  createCheckoutSession,
  getPriceIdForTier,
  isStripeConfigured,
  PACKAGE_PRICES,
  PHOTO_UPGRADE_PRICE,
} from "@/lib/stripe";
import { absoluteUrl } from "@/lib/request";

const PACKAGE_NAMES: Record<string, string> = {
  single: "Single Property",
  pack_10: "Up to 10 Properties",
  pack_25: "Up to 25 Properties",
};

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
    packageTier: "single" | "pack_10" | "pack_25";
    propertyIds: string[];
    photoUpgradePropertyIds?: string[];
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { packageTier, propertyIds, photoUpgradePropertyIds = [] } = body;
  if (!packageTier || !PACKAGE_PRICES[packageTier]) {
    return NextResponse.json({ error: "Invalid package tier" }, { status: 400 });
  }
  if (!Array.isArray(propertyIds) || propertyIds.length === 0) {
    return NextResponse.json({ error: "At least one property is required" }, { status: 400 });
  }

  const maxProps =
    packageTier === "single" ? 1 : packageTier === "pack_10" ? 10 : 25;
  if (propertyIds.length > maxProps) {
    return NextResponse.json(
      { error: `This package allows up to ${maxProps} properties` },
      { status: 400 },
    );
  }

  const owned = await verifyPropertiesOwnership(agent.id, propertyIds);
  if (!owned) {
    return NextResponse.json({ error: "Property ownership check failed" }, { status: 403 });
  }

  for (const pid of photoUpgradePropertyIds) {
    if (!propertyIds.includes(pid)) {
      return NextResponse.json(
        { error: "Photo upgrade property not in checkout" },
        { status: 400 },
      );
    }
  }

  const priceId = getPriceIdForTier(packageTier);
  if (!priceId) {
    return NextResponse.json(
      { error: "Stripe Price ID not configured for this tier" },
      { status: 500 },
    );
  }

  const packagePrice = PACKAGE_PRICES[packageTier];
  const photoCount = photoUpgradePropertyIds.length;
  const photoTotal = photoCount * PHOTO_UPGRADE_PRICE;
  const packageName = PACKAGE_NAMES[packageTier];

  const renewalId = await createPendingRenewal({
    agentId: agent.id,
    packageName,
    packagePrice,
    propertyIds,
    photoUpgradePropertyIds,
  });

  const lineItems: Array<{
    price?: string;
    quantity: number;
    price_data?: {
      currency: string;
      unit_amount: number;
      product_data: { name: string };
    };
  }> = [
    { price: priceId, quantity: 1 },
  ];

  if (photoCount > 0) {
    lineItems.push({
      quantity: photoCount,
      price_data: {
        currency: "mxn",
        unit_amount: PHOTO_UPGRADE_PRICE * 100,
        product_data: { name: "Photo upgrade — up to 10 photos" },
      },
    });
  }

  const photoPropsCompact = photoUpgradePropertyIds.join(",");

  const successUrl = absoluteUrl(
    `/account/properties?paid=1&session_id={CHECKOUT_SESSION_ID}`,
  );
  const cancelUrl = absoluteUrl("/account/properties?canceled=1");

  const stripeSession = await createCheckoutSession({
    lineItems,
    successUrl,
    cancelUrl,
    metadata: {
      renewalId,
      photoProps: photoPropsCompact,
      packageTotal: String(packagePrice),
      photoTotal: String(photoTotal),
    },
  });

  await updateRenewalStripeSession(renewalId, stripeSession.id);

  if (!stripeSession.url) {
    return NextResponse.json({ error: "Stripe did not return a checkout URL" }, { status: 500 });
  }

  return NextResponse.json({ url: stripeSession.url });
}
