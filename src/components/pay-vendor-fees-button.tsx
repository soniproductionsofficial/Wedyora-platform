"use client";

import { useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

export default function PayVendorFeesButton({
  amount,
  vendorName,
  vendorPhone,
}: {
  amount: number;
  vendorName?: string | null;
  vendorPhone?: string | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/vendor-payments/create-order", { method: "POST" });
      const order = await res.json();
      if (!res.ok) throw new Error(order.error ?? "Could not start payment");

      const razorpay = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "Wedyora",
        description: "Vendor registration fee + security deposit",
        prefill: { name: vendorName ?? "", contact: vendorPhone ?? "" },
        theme: { color: "#24006c" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetch("/api/vendor-payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          if (verifyRes.ok) {
            router.push("/vendor/apply?phase=portfolio");
          } else {
            const data = await verifyRes.json();
            setError(data.error ?? "Payment verification failed");
            setLoading(false);
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
        className="w-full rounded-full bg-brand-orange text-white font-semibold py-3 hover:bg-brand-orange-dark disabled:opacity-60 transition-colors"
      >
        {loading ? "Opening..." : `Pay ₹${amount.toLocaleString("en-IN")} & Continue`}
      </button>
      {error && <p className="text-xs text-brand-orange-dark mt-2 text-center">{error}</p>}
    </>
  );
}
