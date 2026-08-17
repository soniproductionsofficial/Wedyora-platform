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
