import Stripe from "stripe";
import { env } from "../config/env";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});

export async function createPaymentIntent(params: {
  amount: number;
  currency?: string;
  metadata: Record<string, string>;
  receiptEmail?: string;
}) {
  return stripe.paymentIntents.create({
    amount: params.amount,
    currency: params.currency ?? env.STRIPE_CURRENCY,
    automatic_payment_methods: { enabled: true },
    metadata: params.metadata,
    receipt_email: params.receiptEmail,
  });
}
