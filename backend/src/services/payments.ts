import { env } from "../config/env.js";
import { db } from "../config/db.js";
import type { PaymentType } from "../types/models.js";

export async function createPaymentIntent(input: {
  userId: string;
  amount: number;
  type: PaymentType;
  bookingId?: string;
}) {
  if (env.mockPayments || (!env.razorpayKeyId && !env.stripeSecretKey)) {
    const payment = {
      id: db.id(),
      userId: input.userId,
      bookingId: input.bookingId,
      amount: input.amount,
      type: input.type,
      status: "pending" as const,
      provider: "mock" as const,
      providerId: `mock_${db.id()}`,
      createdAt: db.now(),
    };
    db.payments.push(payment);
    return {
      payment,
      clientSecret: payment.providerId,
      mock: true,
    };
  }

  // Razorpay order when keys present
  if (env.razorpayKeyId && env.razorpayKeySecret) {
    const Razorpay = (await import("razorpay")).default;
    const razorpay = new Razorpay({
      key_id: env.razorpayKeyId,
      key_secret: env.razorpayKeySecret,
    });
    const order = await razorpay.orders.create({
      amount: Math.round(input.amount * 100),
      currency: "INR",
      receipt: `wdy_${Date.now()}`,
    });
    const payment = {
      id: db.id(),
      userId: input.userId,
      bookingId: input.bookingId,
      amount: input.amount,
      type: input.type,
      status: "pending" as const,
      provider: "razorpay" as const,
      providerId: order.id,
      createdAt: db.now(),
    };
    db.payments.push(payment);
    return { payment, order, mock: false, keyId: env.razorpayKeyId };
  }

  throw new Error("No payment provider configured");
}

export function confirmMockPayment(paymentId: string) {
  const payment = db.payments.find((p) => p.id === paymentId);
  if (!payment) throw new Error("Payment not found");
  payment.status = "paid";
  return payment;
}
