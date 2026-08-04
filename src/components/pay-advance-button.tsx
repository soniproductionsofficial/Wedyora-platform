"use client";

import { useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

export default function PayAdvanceButton({
  bookingId,
  amount,
  customerName,
  customerPhone,
}: {
  bookingId: string;
  amount: number;
  customerName?: string | null;
  customerPhone?: string | null;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      const order = await res.json();
      if (!res.ok) throw new Error(order.error ?? "Could not start payment");

      const razorpay = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "Wedyora",
        description: "Wedding service advance payment",
        prefill: { name: customerName ?? "", contact: customerPhone ?? "" },
        theme: { color: "#24006c" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          if (verifyRes.ok) {
            window.location.reload();
          } else {
            const data = await verifyRes.json();
            setError(data.error ?? "Payment verification failed");
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });
      razorpay.open();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <button
        onClick={handlePay}
        disabled={loading}
        className="px-4 py-2 rounded-full bg-brand-orange text-white text-sm font-semibold hover:bg-brand-orange-dark disabled:opacity-60"
      >
        {loading ? "Opening..." : `Pay Advance (₹${amount.toLocaleString("en-IN")})`}
      </button>
      {error && <p className="text-xs text-brand-orange-dark mt-1">{error}</p>}
    </>
  );
}
