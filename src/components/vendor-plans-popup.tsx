"use client";

import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import { VENDOR_PLANS } from "@/lib/vendor-plans";

export default function VendorPlansPopup({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-brand-charcoal/55 backdrop-blur-[2px]"
        aria-label="Close plans"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white border border-brand-line shadow-2xl animate-popup-rise"
      >
        <div className="sticky top-0 flex items-center justify-between gap-3 bg-white/95 backdrop-blur px-6 py-4 border-b border-brand-line">
          <div>
            <p className="text-brand-gold text-[11px] font-semibold uppercase tracking-[0.16em]">
              Partner plans
            </p>
            <h2 id={titleId} className="font-heading text-xl font-bold">
              Choose your Wedyora plan
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="rounded-full p-2 border border-brand-line hover:bg-brand-cream transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6 grid sm:grid-cols-2 gap-4">
          {VENDOR_PLANS.map((plan) => (
            <div
              key={plan.key}
              className="rounded-2xl border border-brand-line p-4 hover:border-brand-orange/50 transition-colors"
            >
              <p className="font-heading font-semibold text-sm mb-1">{plan.label}</p>
              <p className="text-[11px] text-brand-gray mb-3">{plan.targetVendor}</p>
              <p className="text-sm">
                Registration{" "}
                <strong>₹{plan.registrationFee.toLocaleString("en-IN")}</strong>
              </p>
              <p className="text-sm text-brand-orange font-medium mt-1">
                ₹{plan.securityDeposit.toLocaleString("en-IN")} refundable deposit
              </p>
              <p className="text-[11px] text-brand-gray mt-2">
                Annual renewal ₹{plan.annualRenewal.toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>
        <div className="px-6 pb-6">
          <a
            href="/vendor/apply"
            className="block text-center w-full px-5 py-3 rounded-full bg-brand-button text-brand-black font-semibold hover:bg-brand-button-dark transition-colors"
          >
            Apply as a vendor
          </a>
        </div>
      </div>
    </div>
  );
}
