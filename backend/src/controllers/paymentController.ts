import { Request, Response } from "express";
import Stripe from "stripe";
import { stripe } from "../services/stripe";
import { env } from "../config/env";
import { Payment, Vendor, Assignment } from "../models";
import { asyncHandler, success } from "../utils/http";
import { AppError } from "../types";

/**
 * Stripe webhook — must be mounted with express.raw() body parser.
 */
export const stripeWebhook = asyncHandler(async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"];
  if (!signature || typeof signature !== "string") {
    throw new AppError("Missing Stripe-Signature header", 400);
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body as Buffer,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook Error";
    throw new AppError(`Webhook signature verification failed: ${message}`, 400);
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const intent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentSucceeded(intent);
      break;
    }
    case "payment_intent.payment_failed": {
      const intent = event.data.object as Stripe.PaymentIntent;
      await Payment.findOneAndUpdate(
        { stripePaymentIntentId: intent.id },
        { status: "failed" }
      );
      break;
    }
    case "payment_intent.canceled": {
      const intent = event.data.object as Stripe.PaymentIntent;
      await Payment.findOneAndUpdate(
        { stripePaymentIntentId: intent.id },
        { status: "canceled" }
      );
      break;
    }
    default:
      break;
  }

  return success(res, { received: true });
});

async function handlePaymentSucceeded(intent: Stripe.PaymentIntent) {
  const payment = await Payment.findOneAndUpdate(
    { stripePaymentIntentId: intent.id },
    { status: "succeeded" },
    { new: true }
  );

  const kind = intent.metadata?.kind;

  if (kind === "vendor_deposit") {
    const vendorId = intent.metadata.vendorId;
    if (vendorId) {
      const vendor = await Vendor.findById(vendorId);
      if (vendor) {
        vendor.depositStatus = "paid";
        vendor.isListed = vendor.termsAccepted === true;
        await vendor.save();
      }
    }
  }

  if (kind === "customer_assignment") {
    const assignmentId = intent.metadata.assignmentId;
    if (assignmentId) {
      await Assignment.findByIdAndUpdate(assignmentId, {
        paymentStatus: "paid",
        status: "accepted",
      });
    }
  }

  // If payment record missing (edge case), still attempt metadata updates
  if (!payment && kind === "vendor_deposit" && intent.metadata?.vendorId) {
    await Vendor.findByIdAndUpdate(intent.metadata.vendorId, {
      depositStatus: "paid",
    });
  }
}
