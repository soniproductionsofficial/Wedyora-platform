"use client";

import { useState } from "react";
import Link from "next/link";
import VendorPlansPopup from "@/components/vendor-plans-popup";

export default function VendorCtaSection() {
  const [plansOpen, setPlansOpen] = useState(false);

  return (
    <section className="bg-brand-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(244,196,0,0.18),transparent_55%)] pointer-events-none" />
      <div className="relative mx-auto max-w-6xl px-6 py-16 text-center">
        <h2 className="font-heading text-2xl md:text-3xl font-semibold mb-4">
          Are you a wedding vendor?
        </h2>
        <p className="text-white/70 mb-8 max-w-xl mx-auto">
          Pick a plan, pay a refundable security deposit, and get notified the
          moment Wedyora assigns you a customer.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => setPlansOpen(true)}
            className="px-6 py-3 rounded-full border border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
          >
            View plans &amp; deposits
          </button>
          <Link
            href="/vendor/apply"
            className="px-6 py-3 rounded-full bg-brand-button text-brand-black font-semibold hover:bg-brand-button-dark transition-colors"
          >
            Become a Partner
          </Link>
        </div>
      </div>
      <VendorPlansPopup open={plansOpen} onClose={() => setPlansOpen(false)} />
    </section>
  );
}
