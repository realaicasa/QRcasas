import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature, isWebhookConfigured } from "@/lib/stripe";
import {
  getRenewalById,
  markRenewalPaid,
  setPropertiesPhotoPackagePaid,
} from "@/lib/data/renewals";
import { updateAgentProfile } from "@/lib/data/agents";
import { getSponsorAdvertById, updateSponsorAdvert } from "@/lib/data/sponsors";

interface StripeEvent {
  type: string;
  data: {
    object: {
      id: string;
      payment_status: string;
      amount_total: number | null;
      currency: string | null;
      metadata: Record<string, string> | null;
      customer?: string;
      status?: string;
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

  if (event.type === "checkout.session.completed" && event.data.object.metadata?.agentId) {
    try {
      const metadata = event.data.object.metadata;
      const agentId = metadata.agentId;
      if (metadata.requestVerified === "true") {
        await updateAgentProfile(agentId, { verificationFeeActive: true } as never);
      }
      if (metadata.requestFeatured === "true") {
        await updateAgentProfile(agentId, { featuredAgent: true } as never);
      }
    } catch (err) {
      console.error("Subscription activation error:", err);
    }
  }

  if (event.type === "customer.subscription.deleted" && event.data.object.metadata?.agentId) {
    try {
      const metadata = event.data.object.metadata;
      const agentId = metadata.agentId;
      if (metadata.requestVerified === "true") {
        await updateAgentProfile(agentId, { verificationFeeActive: false, identityVerificationStatus: "Unverified" } as never);
      }
      if (metadata.requestFeatured === "true") {
        await updateAgentProfile(agentId, { featuredAgent: false } as never);
      }
    } catch (err) {
      console.error("Subscription deletion error:", err);
    }
  }

  if (event.type === "customer.subscription.updated" && event.data.object.metadata?.agentId) {
    try {
      const metadata = event.data.object.metadata;
      const agentId = metadata.agentId;
      const status = event.data.object.status;
      if (status === "active") {
        if (metadata.requestVerified === "true") {
          await updateAgentProfile(agentId, { verificationFeeActive: true } as never);
        }
        if (metadata.requestFeatured === "true") {
          await updateAgentProfile(agentId, { featuredAgent: true } as never);
        }
      } else if (status === "canceled" || status === "unpaid" || status === "past_due") {
        if (metadata.requestVerified === "true") {
          await updateAgentProfile(agentId, { verificationFeeActive: false } as never);
        }
        if (metadata.requestFeatured === "true") {
          await updateAgentProfile(agentId, { featuredAgent: false } as never);
        }
      }
    } catch (err) {
      console.error("Subscription update error:", err);
    }
  }

  if (event.type === "checkout.session.completed" && event.data.object.metadata?.advertId) {
    try {
      const metadata = event.data.object.metadata;
      const advertId = metadata.advertId;
      const advert = await getSponsorAdvertById(advertId);
      if (advert) {
        await updateSponsorAdvert(advertId, {
          Stripe_Checkout_Session_ID: event.data.object.id,
          Stripe_Customer_ID: event.data.object.customer ?? "",
        });
      }
    } catch (err) {
      console.error("Sponsor checkout error:", err);
    }
  }

  if ((event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") && event.data.object.metadata?.advertId) {
    try {
      const metadata = event.data.object.metadata;
      const advertId = metadata.advertId;
      const status = event.data.object.status;
      const advert = await getSponsorAdvertById(advertId);
      if (!advert) {
        if (status === "active" || status === "trialing") {
          await updateSponsorAdvert(advertId, {
            Billing_Status: "Active",
            Approved: true,
            Status: "Active",
            Stripe_Subscription_ID: event.data.object.id,
          });
        } else {
          await updateSponsorAdvert(advertId, {
            Billing_Status: status === "canceled" ? "Cancelled" : "Past Due",
            Approved: false,
            Status: "Paused",
          });
        }
      }
    } catch (err) {
      console.error("Sponsor subscription error:", err);
    }
  }

  return NextResponse.json({ received: true });
}
