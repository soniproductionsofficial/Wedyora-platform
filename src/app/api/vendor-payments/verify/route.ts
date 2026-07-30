import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

// Mirrors /api/payments/verify, but resolves to a vendor's registration
// fee + security deposit rows (keyed by razorpay_order_id, several rows
// can share one order since they're paid together) instead of a single
// booking payment, and activates the vendor's plan once paid.
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

  const expectedSignature = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const signatureValid =
    expectedSignature.length === signature.length &&
    timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature));

  if (!signatureValid) {
    await admin
      .from("vendor_payments")
      .update({ status: "pending" })
      .eq("razorpay_order_id", orderId);
    return NextResponse.json({ error: "Signature verification failed" }, { status: 400 });
  }

  const { data: rows } = await admin
    .from("vendor_payments")
    .select("id, vendor_id")
    .eq("razorpay_order_id", orderId);

  if (!rows || rows.length === 0) {
    return NextResponse.json({ error: "Payment record not found" }, { status: 404 });
  }

  if (rows.some((r) => r.vendor_id !== user.id)) {
    return NextResponse.json({ error: "Not your payment" }, { status: 403 });
  }

  await admin
    .from("vendor_payments")
    .update({ status: "paid", razorpay_payment_id: paymentId })
    .eq("razorpay_order_id", orderId);

  // Activate the vendor's plan — moves them from "pending_payment" (not
  // yet reviewable) to "pending" (now waiting on admin review), same as a
  // free application always has been from here on.
  const now = new Date();
  const expires = new Date(now);
  expires.setFullYear(expires.getFullYear() + 1);

  await admin
    .from("vendor_profiles")
    .update({
      status: "pending",
      plan_paid_at: now.toISOString(),
      plan_expires_at: expires.toISOString(),
    })
    .eq("id", user.id)
    .eq("status", "pending_payment");

  return NextResponse.json({ success: true });
}
