// Registration Plans, from the Vendor Pricing & Quote Structure poster.
// These are business constants, not admin-editable rows, the same way the
// signup wizard's BUDGET_RANGES/LANGUAGES are — they match a printed rate
// card, not something that changes per-vendor.

export type VendorPlanKey =
  | "basic_verified"
  | "professional_partner"
  | "premium_partner"
  | "studio_partner";

export interface VendorPlan {
  key: VendorPlanKey;
  label: string;
  registrationFee: number;
  annualRenewal: number;
  // The poster's Security Deposit table is keyed by vendor CATEGORY
  // (Photographer/Videographer 10,000; Drone Operator 15,000; "Premium
  // Studio Partner" 25,000), which doesn't cleanly map 1:1 onto either
  // "category" or "plan" alone — the last row names a plan tier, not a
  // category. We key the deposit off the chosen PLAN instead, since that's
  // what the vendor actually picks at signup: Studio Partner carries the
  // poster's top 25,000 deposit, Premium Partner the mid-tier 15,000 (its
  // closest fit, Drone Operator), and the two entry tiers the base 10,000.
  securityDeposit: number;
  targetVendor: string;
}

export const VENDOR_PLANS: VendorPlan[] = [
  {
    key: "basic_verified",
    label: "Basic Verified",
    registrationFee: 4999,
    annualRenewal: 2000,
    securityDeposit: 10000,
    targetVendor: "New Photographers",
  },
  {
    key: "professional_partner",
    label: "Professional Partner",
    registrationFee: 9999,
    annualRenewal: 3999,
    securityDeposit: 10000,
    targetVendor: "Established Vendors",
  },
  {
    key: "premium_partner",
    label: "Premium Partner",
    registrationFee: 14999,
    annualRenewal: 4999,
    securityDeposit: 15000,
    targetVendor: "Top Rated Vendors / Studios",
  },
  {
    key: "studio_partner",
    label: "Studio Partner",
    registrationFee: 19999,
    annualRenewal: 6999,
    securityDeposit: 25000,
    targetVendor: "Studios & Agencies",
  },
];

export function getVendorPlan(key: string | null | undefined): VendorPlan | null {
  return VENDOR_PLANS.find((p) => p.key === key) ?? null;
}
