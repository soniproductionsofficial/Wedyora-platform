import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getRazorpayClient } from "@/lib/razorpay";

// Mirrors /api/payments/create-order, but for a vendor's own pending
// registration-fee + security-deposit rows instead of a booking's advance.
// There's no bookingId here — it's always "whatever this logged-in vendor
// currently owes", so nothing about which rows get charged depends on
// anything the browser sends.
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { data: pendingRows, error: rowsError } = await supabase
    .from("vendor_payments")
    .select("id, amount, type")
    .eq("vendor_id", user.id)
    .eq("status", "pending")
    .in("type", ["registration_fee", "security_deposit"]);

  if (rowsError || !pendingRows || pendingRows.length === 0) {
    return NextResponse.json(
      { error: "Nothing pending to pay right now." },
      { status: 400 }
    );
  }

  const totalAmount = pendingRows.reduce((sum, r) => sum + Number(r.amount), 0);
  const amountInPaise = Math.round(totalAmount * 100);

  const razorpay = getRazorpayClient();
  let order;
  try {
    order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `vendor_fees_${user.id}`.slice(0, 40),
      notes: { vendor_id: user.id },
    });
  } catch (err: unknown) {
    console.error("Razorpay order creation failed:", err);
    const message =
      err && typeof err === "object" && "error" in err
        ? ((err as { error?: { description?: string } }).error?.description ??
            "Razorpay rejected the order request.")
        : err instanceof Error
          ? err.message
          : "Razorpay rejected the order request.";
    return NextResponse.json(
      { error: `Could not start payment: ${message}` },
      { status: 502 }
    );
  }

  // Written with the service-role client: regular users have no UPDATE
  // policy on `vendor_payments` — only server code that has already
  // verified ownership, like this route, may attach an order id.
  const admin = createAdminClient();
  await admin
    .from("vendor_payments")
    .update({ razorpay_order_id: order.id })
    .in(
      "id",
      pendingRows.map((r) => r.id)
    );

  return NextResponse.json({
    orderId: order.id,
    amount: amountInPaise,
    currency: "INR",
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  });
}
