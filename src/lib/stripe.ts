import "server-only";
import crypto from "node:crypto";

const STRIPE_API_BASE = "https://api.stripe.com/v1";

function getSecretKey(): string {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
  return key;
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function isWebhookConfigured(): boolean {
  return Boolean(process.env.STRIPE_WEBHOOK_SECRET);
}

export const PACKAGE_PRICES = {
  single: 500,
  pack_10: 3000,
  pack_25: 6900,
} as const;

export const PHOTO_UPGRADE_PRICE = 200;

export function getPriceIdForTier(tier: "single" | "pack_10" | "pack_25"): string | null {
  const map: Record<string, string | undefined> = {
    single: process.env.STRIPE_PRICE_SINGLE_PROPERTY,
    pack_10: process.env.STRIPE_PRICE_UP_TO_10,
    pack_25: process.env.STRIPE_PRICE_UP_TO_25,
  };
  return map[tier] ?? null;
}

interface StripeLineItem {
  price?: string;
  quantity: number;
  price_data?: {
    currency: string;
    unit_amount: number;
    product_data: { name: string };
  };
}

export interface StripeCheckoutSession {
  id: string;
  url: string | null;
  payment_status: string;
  amount_total: number | null;
  currency: string | null;
  metadata: Record<string, string> | null;
}

export async function createCheckoutSession(params: {
  lineItems: StripeLineItem[];
  successUrl: string;
  cancelUrl: string;
  metadata: Record<string, string>;
}): Promise<StripeCheckoutSession> {
  const key = getSecretKey();
  const body = new URLSearchParams();
  body.set("mode", "payment");
  body.set("success_url", params.successUrl);
  body.set("cancel_url", params.cancelUrl);
  body.set("customer_creation", "always");

  params.lineItems.forEach((item, i) => {
    if (item.price) {
      body.set(`line_items[${i}][price]`, item.price);
    }
    if (item.price_data) {
      body.set(`line_items[${i}][price_data][currency]`, item.price_data.currency);
      body.set(`line_items[${i}][price_data][unit_amount]`, String(item.price_data.unit_amount));
      body.set(`line_items[${i}][price_data][product_data][name]`, item.price_data.product_data.name);
    }
    body.set(`line_items[${i}][quantity]`, String(item.quantity));
  });

  for (const [k, v] of Object.entries(params.metadata)) {
    body.set(`metadata[${k}]`, v);
  }

  const res = await fetch(`${STRIPE_API_BASE}/checkout/sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Stripe checkout creation failed: ${res.status} ${errText}`);
  }

  return res.json();
}

export async function retrieveCheckoutSession(sessionId: string): Promise<StripeCheckoutSession> {
  const key = getSecretKey();
  const res = await fetch(`${STRIPE_API_BASE}/checkout/sessions/${sessionId}`, {
    headers: { Authorization: `Bearer ${key}` },
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Stripe session retrieval failed: ${res.status} ${errText}`);
  }
  return res.json();
}

export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string,
  secret: string,
): boolean {
  const parts = signatureHeader.split(",");
  let timestamp = "";
  let signatures: string[] = [];
  for (const part of parts) {
    const [key, value] = part.split("=");
    if (key === "t") timestamp = value;
    if (key === "v1") signatures.push(value);
  }
  if (!timestamp || signatures.length === 0) return false;

  const signedPayload = `${timestamp}.${rawBody}`;
  const expected = crypto.createHmac("sha256", secret).update(signedPayload).digest("hex");

  return signatures.some((sig) => {
    if (sig.length !== expected.length) return false;
    try {
      return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
    } catch {
      return false;
    }
  });
}
