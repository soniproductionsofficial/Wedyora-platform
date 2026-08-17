// Vendor Registration Fee Model — registration fee excl. GST + 18% GST.
// Keys stay stable for existing vendor_profiles.plan values in the DB.

export type VendorPlanKey =
  | "basic_verified"
  | "professional_partner"
  | "premium_partner"
  | "studio_partner";

export const GST_RATE = 0.18;

export interface VendorPlan {
  key: VendorPlanKey;
  label: string;
  /** Registration fee excluding GST (INR). */
  registrationFee: number;
  /** Kept for legacy profile display; annual renewal matches 12-month validity. */
  annualRenewal: number;
  /** Months of plan validity after payment. */
  validityMonths: number;
  /** Security deposit — 0 under the current registration fee model. */
  securityDeposit: number;
  targetVendor: string;
  recommended?: boolean;
}

export const VENDOR_PLANS: VendorPlan[] = [
  {
    key: "basic_verified",
    label: "Basic Vendor",
    registrationFee: 999,
    annualRenewal: 999,
    validityMonths: 12,
    securityDeposit: 0,
    targetVendor: "New / Small Vendors",
  },
  {
    key: "professional_partner",
    label: "Verified Vendor",
    registrationFee: 1999,
    annualRenewal: 1999,
    validityMonths: 12,
    securityDeposit: 0,
    targetVendor: "Professional Vendors",
    recommended: true,
  },
  {
    key: "premium_partner",
    label: "Premium Vendor",
    registrationFee: 4999,
    annualRenewal: 4999,
    validityMonths: 12,
    securityDeposit: 0,
    targetVendor: "Established Vendors",
  },
  {
    key: "studio_partner",
    label: "Elite Vendor",
    registrationFee: 9999,
    annualRenewal: 9999,
    validityMonths: 12,
    securityDeposit: 0,
    targetVendor: "High-Volume Vendors",
  },
];

export function planGstAmount(feeExclGst: number): number {
  return Math.round(feeExclGst * GST_RATE * 100) / 100;
}

/** Total payable rounded to nearest rupee (Razorpay-friendly whole INR). */
export function planTotalPayable(feeExclGst: number): number {
  return Math.round(feeExclGst * (1 + GST_RATE));
}

export function getVendorPlan(key: string | null | undefined): VendorPlan | null {
  return VENDOR_PLANS.find((p) => p.key === key) ?? null;
}

/** Feature matrix — “What you get in each plan”. */
export type PlanFeatureValue = true | false | string;

export const VENDOR_PLAN_FEATURES: {
  label: string;
  values: Record<VendorPlanKey, PlanFeatureValue>;
}[] = [
  {
    label: "Business Profile & Listing",
    values: {
      basic_verified: true,
      professional_partner: true,
      premium_partner: true,
      studio_partner: true,
    },
  },
  {
    label: "KYC & Document Verification",
    values: {
      basic_verified: false,
      professional_partner: true,
      premium_partner: true,
      studio_partner: true,
    },
  },
  {
    label: "Portfolio Upload",
    values: {
      basic_verified: "Up to 20 photos",
      professional_partner: "Up to 75 photos & 5 reels",
      premium_partner: "Up to 150 photos & 15 reels",
      studio_partner: "Unlimited photos & reels",
    },
  },
  {
    label: "Google Rating Verification",
    values: {
      basic_verified: false,
      professional_partner: true,
      premium_partner: true,
      studio_partner: true,
    },
  },
  {
    label: "Verified Badge",
    values: {
      basic_verified: false,
      professional_partner: true,
      premium_partner: true,
      studio_partner: true,
    },
  },
  {
    label: "Priority Enquiries",
    values: {
      basic_verified: false,
      professional_partner: true,
      premium_partner: true,
      studio_partner: true,
    },
  },
  {
    label: "Top Search Ranking",
    values: {
      basic_verified: false,
      professional_partner: true,
      premium_partner: true,
      studio_partner: true,
    },
  },
  {
    label: "Featured Placement",
    values: {
      basic_verified: false,
      professional_partner: false,
      premium_partner: true,
      studio_partner: true,
    },
  },
  {
    label: "Dedicated Account Manager",
    values: {
      basic_verified: false,
      professional_partner: false,
      premium_partner: false,
      studio_partner: true,
    },
  },
  {
    label: "Social Media Promotion",
    values: {
      basic_verified: false,
      professional_partner: false,
      premium_partner: true,
      studio_partner: true,
    },
  },
  {
    label: "Performance Analytics",
    values: {
      basic_verified: "Basic",
      professional_partner: "Basic",
      premium_partner: "Advanced",
      studio_partner: "Advanced + Business Review",
    },
  },
  {
    label: "Priority Support",
    values: {
      basic_verified: false,
      professional_partner: "Email / Chat",
      premium_partner: "Priority Support",
      studio_partner: "24/7 Dedicated Support",
    },
  },
];

export function featuresForPlan(key: VendorPlanKey) {
  return VENDOR_PLAN_FEATURES.map((row) => ({
    label: row.label,
    value: row.values[key],
  }));
}
