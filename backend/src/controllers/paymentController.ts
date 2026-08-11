import { Request, Response } from "express";
import Stripe from "stripe";
import { stripe, mockPayments } from "../services/stripe";
import { env } from "../config/env";
import { Payment, Vendor, Assignment, User } from "../models";
import { asyncHandler, success } from "../utils/http";
import { AppError } from "../types";
import { mockConfirmSchema } from "../utils/validators";
import { notifyUser } from "../services/notifications";

/**
 * Stripe webhook — must be mounted with express.raw() body parser.
 */
export const stripeWebhook = asyncHandler(async (req: Request, res: Response) => {
  if (mockPayments || !stripe) {
    throw new AppError(
      "Stripe webhooks disabled in mock payment mode. Use POST /api/payments/confirm-mock",
      400
    );
  }

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
      await handlePaymentSucceeded({
        id: intent.id,
        metadata: Object.fromEntries(
          Object.entries(intent.metadata ?? {}).map(([k, v]) => [k, String(v)])
        ),
      });
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

/**
 * Confirm a mock payment intent (local/demo without Stripe).
 */
export const confirmMockPayment = asyncHandler(async (req, res) => {
  if (!mockPayments) {
    throw new AppError("Mock payments are disabled", 403);
  }

  const body = mockConfirmSchema.parse(req.body);
  if (!body.paymentIntentId.startsWith("pi_mock_")) {
    throw new AppError("Only mock payment intents can be confirmed this way", 400);
  }

  const payment = await Payment.findOne({
    stripePaymentIntentId: body.paymentIntentId,
  });
  if (!payment) throw new AppError("Payment not found", 404);
  if (payment.userId.toString() !== req.user!.id) {
    throw new AppError("Payment does not belong to this user", 403);
  }

  await handlePaymentSucceeded({
    id: body.paymentIntentId,
    metadata: {
      kind: payment.kind,
      vendorId: payment.vendorId?.toString() ?? "",
      assignmentId: payment.assignmentId?.toString() ?? "",
      userId: payment.userId.toString(),
    },
  });

  return success(res, { confirmed: true, paymentIntentId: body.paymentIntentId });
});

export const getPaymentConfig = asyncHandler(async (_req, res) => {
  return success(res, {
    publishableKey: env.STRIPE_PUBLISHABLE_KEY,
    currency: env.STRIPE_CURRENCY,
    vendorDepositAmount: env.VENDOR_DEPOSIT_AMOUNT,
    mockPayments,
  });
});

async function handlePaymentSucceeded(intent: {
  id: string;
  metadata: Record<string, string>;
}) {
  const payment = await Payment.findOneAndUpdate(
    { stripePaymentIntentId: intent.id },
    { status: "succeeded" },
    { new: true }
  );

  const kind = intent.metadata?.kind ?? payment?.kind;

  if (kind === "vendor_deposit") {
    const vendorId = intent.metadata.vendorId || payment?.vendorId?.toString();
    if (vendorId) {
      const vendor = await Vendor.findById(vendorId);
      if (vendor) {
        vendor.depositStatus = "paid";
        vendor.isListed = vendor.termsAccepted === true;
        await vendor.save();

        await notifyUser({
          recipientUserId: vendor.userId,
          senderLabel: "Wedyora Payments",
          subject: "Deposit received",
          body: "Your vendor deposit was successful. Accept terms (if pending) to appear in customer search.",
          kind: "platform",
        });
      }
    }
  }

  if (kind === "customer_assignment") {
    const assignmentId =
      intent.metadata.assignmentId || payment?.assignmentId?.toString();
    if (assignmentId) {
      const assignment = await Assignment.findByIdAndUpdate(
        assignmentId,
        {
          paymentStatus: "paid",
          status: "accepted",
        },
        { new: true }
      );

      if (assignment) {
        const [vendor, customer] = await Promise.all([
          Vendor.findById(assignment.vendorId),
          (
            await import("../models")
          ).Customer.findById(assignment.customerId),
        ]);

        if (vendor) {
          await notifyUser({
            recipientUserId: vendor.userId,
            senderLabel: "Wedyora Payments",
            subject: "Customer payment received",
            body: "A customer has paid for your assignment. You can begin coordinating the event.",
            kind: "platform",
            relatedAssignmentId: assignment._id,
          });
        }

        if (customer) {
          const user = await User.findById(customer.userId);
          if (user) {
            await notifyUser({
              recipientUserId: user._id,
              senderLabel: "Wedyora Payments",
              subject: "Payment confirmed",
              body: `Your payment to Wedyora was successful${vendor ? ` for ${vendor.businessName}` : ""}.`,
              kind: "platform",
              relatedAssignmentId: assignment._id,
            });
          }
        }
      }
    }
  }
}
