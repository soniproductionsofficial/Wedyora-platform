import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getRazorpayClient } from "@/lib/razorpay";

export async function POST(request: Request) {
  const { bookingId } = await request.json();

  if (!bookingId || typeof bookingId !== "string") {
    return NextResponse.json({ error: "bookingId is required" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  // RLS already restricts this select to the booking's own customer/vendor/admin,
  // but we double-check customer_id and status explicitly below anyway —
  // never trust the client to only ask for its own bookings.
  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select("id, customer_id, status, advance_amount")
    .eq("id", bookingId)
    .single();

  if (bookingError || !booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }
  if (booking.customer_id !== user.id) {
    return NextResponse.json({ error: "Not your booking" }, { status: 403 });
  }
  if (booking.status !== "awaiting_payment" || !booking.advance_amount) {
    return NextResponse.json(
      { error: "This booking isn't ready for payment yet." },
      { status: 400 }
    );
  }

  const amountInPaise = Math.round(booking.advance_amount * 100);

  const razorpay = getRazorpayClient();
  let order;
  try {
    order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `booking_${booking.id}`.slice(0, 40),
      notes: { booking_id: booking.id },
    });
  } catch (err: unknown) {
    // Without this, an uncaught error here (e.g. bad Razorpay credentials)
    // crashes the route with no JSON body, and the browser just sees
    // "Unexpected end of JSON input" with no clue what actually broke.
    console.error("Razorpay order creation failed:", err);
    const message =
      err && typeof err === "object" && "error" in err
        ? // Razorpay's SDK throws objects shaped like { error: { description } }
          ((err as { error?: { description?: string } }).error?.description ??
            "Razorpay rejected the order request.")
        : err instanceof Error
          ? err.message
          : "Razorpay rejected the order request.";
    return NextResponse.json(
      { error: `Could not start payment: ${message}` },
      { status: 502 }
    );
  }

  // Written with the service-role client: regular users have no INSERT
  // policy on `payments` (see migration) — only server code that has
  // already verified ownership, like this route, may create payment rows.
  const admin = createAdminClient();
  const { error: insertError } = await admin.from("payments").insert({
    booking_id: booking.id,
    type: "advance",
    razorpay_order_id: order.id,
    amount: booking.advance_amount,
    status: "created",
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({
    orderId: order.id,
    amount: amountInPaise,
    currency: "INR",
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    bookingId: booking.id,
  });
}
