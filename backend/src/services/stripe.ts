import Stripe from "stripe";
import { randomUUID } from "crypto";
import { env } from "../config/env";

export const mockPayments =
  env.MOCK_PAYMENTS === true ||
  env.STRIPE_SECRET_KEY.startsWith("sk_test_replace") ||
  env.STRIPE_SECRET_KEY === "sk_test_mock";

export const stripe: Stripe | null = mockPayments
  ? null
  : new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-08-27.basil",
    });

export interface PaymentIntentResult {
  id: string;
  client_secret: string | null;
  amount: number;
  currency: string;
  status: string;
  metadata: Record<string, string>;
}

export async function createPaymentIntent(params: {
  amount: number;
  currency?: string;
  metadata: Record<string, string>;
  receiptEmail?: string;
}): Promise<PaymentIntentResult> {
  const currency = params.currency ?? env.STRIPE_CURRENCY;

  if (mockPayments || !stripe) {
    const id = `pi_mock_${randomUUID().replace(/-/g, "").slice(0, 24)}`;
    return {
      id,
      client_secret: `${id}_secret_mock`,
      amount: params.amount,
      currency,
      status: "requires_payment_method",
      metadata: params.metadata,
    };
  }

  const intent = await stripe.paymentIntents.create({
    amount: params.amount,
    currency,
    automatic_payment_methods: { enabled: true },
    metadata: params.metadata,
    receipt_email: params.receiptEmail,
  });

  return {
    id: intent.id,
    client_secret: intent.client_secret,
    amount: intent.amount,
    currency: intent.currency,
    status: intent.status,
    metadata: Object.fromEntries(
      Object.entries(intent.metadata ?? {}).map(([k, v]) => [k, String(v)])
    ),
  };
}
