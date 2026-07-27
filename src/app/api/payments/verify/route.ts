import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();
  const {
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
    razorpay_signature: signature,
  } = body ?? {};

  if (!orderId || !paymentId || !signature) {
    return NextResponse.json({ error: "Missing payment fields" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Only trust a payment as "paid" once we've independently recomputed
  // Razorpay's signature ourselves using our secret key — never trust the
  // browser's word that a payment succeeded.
  const expectedSignature = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const signatureValid =
    expectedSignature.length === signature.length &&
    timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature));

  if (!signatureValid) {
    await admin
      .from("payments")
      .update({ status: "failed" })
      .eq("razorpay_order_id", orderId);
    return NextResponse.json({ error: "Signature verification failed" }, { status: 400 });
  }

  const { data: payment } = await admin
    .from("payments")
    .select("id, booking_id")
    .eq("razorpay_order_id", orderId)
    .single();

  if (!payment) {
    return NextResponse.json({ error: "Payment record not found" }, { status: 404 });
  }

  // Confirm the authenticated user actually owns the booking this payment
  // belongs to, so one logged-in user can't confirm someone else's payment.
  const { data: booking } = await admin
    .from("bookings")
    .select("id, customer_id")
    .eq("id", payment.booking_id)
    .single();

  if (!booking || booking.customer_id !== user.id) {
    return NextResponse.json({ error: "Not your booking" }, { status: 403 });
  }

  await admin
    .from("payments")
    .update({ status: "paid", razorpay_payment_id: paymentId })
    .eq("id", payment.id);

  await admin
    .from("bookings")
    .update({ status: "confirmed" })
    .eq("id", booking.id);

  return NextResponse.json({ success: true });
}
