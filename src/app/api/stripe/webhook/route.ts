import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature, isWebhookConfigured } from "@/lib/stripe";
import {
  getRenewalById,
  markRenewalPaid,
  setPropertiesPhotoPackagePaid,
} from "@/lib/data/renewals";

interface StripeEvent {
  type: string;
  data: {
    object: {
      id: string;
      payment_status: string;
      amount_total: number | null;
      currency: string | null;
      metadata: Record<string, string> | null;
    };
  };
}

async function fulfillSession(session: StripeEvent["data"]["object"]): Promise<void> {
  if (session.payment_status !== "paid") return;

  const metadata = session.metadata ?? {};
  const renewalId = metadata.renewalId;
  if (!renewalId) return;

  const renewal = await getRenewalById(renewalId);
  if (!renewal) return;

  if (renewal.stripeCheckoutSessionId !== session.id) return;

  const packageTotal = Number(metadata.packageTotal ?? 0);
  const photoTotal = Number(metadata.photoTotal ?? 0);

  if (renewal.amount !== packageTotal) return;
  if (renewal.photoAddOnAmount !== photoTotal) return;

  if (session.currency !== "mxn") return;

  const expectedTotal = packageTotal + photoTotal;
  if (session.amount_total !== expectedTotal * 100) return;

  if (renewal.status === "Paid") return;

  const photoPropsRaw = metadata.photoProps ?? "";
  const photoProps = photoPropsRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const verifiedPhotoProps = photoProps.filter((pid) => renewal.properties.includes(pid));

  await markRenewalPaid(renewalId);
  await setPropertiesPhotoPackagePaid(verifiedPhotoProps);
}

export async function POST(req: NextRequest) {
  if (!isWebhookConfigured()) {
    return NextResponse.json(
      { error: "Stripe webhook secret is not configured" },
      { status: 503 },
    );
  }

  const rawBody = await req.text();
  const signatureHeader = req.headers.get("stripe-signature") ?? "";

  if (!signatureHeader) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const valid = verifyWebhookSignature(
    rawBody,
    signatureHeader,
    process.env.STRIPE_WEBHOOK_SECRET!,
  );

  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: StripeEvent;
  try {
    event = JSON.parse(rawBody) as StripeEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    try {
      await fulfillSession(event.data.object);
    } catch (err) {
      console.error("Stripe webhook fulfillment error:", err);
      return NextResponse.json({ error: "Fulfillment failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
