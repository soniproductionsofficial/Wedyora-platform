"use client";

import { useState } from "react";
import { Check, Minus, ChevronDown } from "lucide-react";
import {
  VENDOR_PLANS,
  featuresForPlan,
  planGstAmount,
  planTotalPayable,
  type VendorPlanKey,
  type PlanFeatureValue,
} from "@/lib/vendor-plans";
import { selectVendorPlanAction } from "@/lib/actions/vendor";

function FeatureCell({ value }: { value: PlanFeatureValue }) {
  if (value === true) {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center text-brand-gray/50">
        <Minus className="h-3.5 w-3.5" />
      </span>
    );
  }
  return (
    <span className="text-left text-[11px] font-medium leading-snug text-brand-black sm:text-xs">
      {value}
    </span>
  );
}

export default function VendorPlanFlowPicker() {
  const [selected, setSelected] = useState<VendorPlanKey>(
    VENDOR_PLANS.find((p) => p.recommended)?.key ?? VENDOR_PLANS[0].key
  );
  const [openKey, setOpenKey] = useState<VendorPlanKey | null>(
    VENDOR_PLANS.find((p) => p.recommended)?.key ?? VENDOR_PLANS[0].key
  );

  return (
    <form action={selectVendorPlanAction} className="flex flex-col gap-5">
      <input type="hidden" name="plan" value={selected} />

      <div className="overflow-hidden rounded-2xl border border-brand-line">
        <div className="bg-brand-magenta px-4 py-3 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white">
            What you get in each plan
          </p>
        </div>

        <ol className="relative divide-y divide-brand-line bg-white">
          {VENDOR_PLANS.map((p, index) => {
            const gst = planGstAmount(p.registrationFee);
            const total = planTotalPayable(p.registrationFee);
            const isSelected = selected === p.key;
            const isOpen = openKey === p.key;
            const features = featuresForPlan(p.key);

            return (
              <li key={p.key} className="relative">
                {index < VENDOR_PLANS.length - 1 ? (
                  <span
                    className="pointer-events-none absolute left-[1.65rem] top-14 bottom-0 z-0 w-px bg-brand-magenta/25"
                    aria-hidden
                  />
                ) : null}

                <button
                  type="button"
                  onClick={() => {
                    setSelected(p.key);
                    setOpenKey(isOpen ? null : p.key);
                  }}
                  className={`relative z-10 flex w-full items-start gap-3 px-4 py-4 text-left transition-colors ${
                    isSelected
                      ? "bg-brand-magenta/[0.06]"
                      : "hover:bg-brand-cream/60"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      isSelected
                        ? "bg-brand-magenta text-white"
                        : "border border-brand-magenta/30 bg-white text-brand-magenta"
                    }`}
                  >
                    {index + 1}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-heading text-base font-semibold text-brand-black">
                        {p.label.replace(" Vendor", "")}
                      </span>
                      {p.recommended ? (
                        <span className="rounded-full bg-brand-button px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-black">
                          Recommended
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-0.5 block text-xs text-brand-gray">
                      Best for {p.targetVendor}
                    </span>
                    <span className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-brand-magenta px-2.5 py-0.5 text-xs font-semibold text-white">
                        ₹{total.toLocaleString("en-IN")} total
                      </span>
                      <span className="text-[11px] text-brand-gray">
                        ₹{p.registrationFee.toLocaleString("en-IN")} + GST ₹
                        {gst.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        · {p.validityMonths} mo
                      </span>
                    </span>
                  </span>

                  <ChevronDown
                    className={`mt-1 h-4 w-4 shrink-0 text-brand-magenta transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen ? (
                  <div className="relative z-10 border-t border-brand-line bg-brand-cream/40 px-4 py-3 pl-14">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-brand-magenta">
                      Included in this tier
                    </p>
                    <ul className="space-y-2">
                      {features.map((f) => (
                        <li
                          key={f.label}
                          className="flex items-start gap-2.5 text-xs"
                        >
                          <FeatureCell value={f.value} />
                          <span className="min-w-0 flex-1">
                            <span className="font-medium text-brand-black">
                              {f.label}
                            </span>
                            {typeof f.value === "string" ? (
                              <span className="mt-0.5 block text-brand-gray">
                                {f.value}
                              </span>
                            ) : null}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>

      <p className="text-center text-xs text-brand-gray">
        Selected:{" "}
        <span className="font-semibold text-brand-magenta">
          {VENDOR_PLANS.find((p) => p.key === selected)?.label}
        </span>
      </p>

      <button
        type="submit"
        className="w-full rounded-full bg-brand-black py-3 font-semibold text-white transition-colors hover:bg-brand-charcoal"
      >
        Continue to Application
      </button>
    </form>
  );
}
