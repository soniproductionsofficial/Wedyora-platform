// Vendor Penalty Policy, from the Vendor Pricing & Quote Structure poster.

export type PenaltyIssueKey =
  | "late_arrival"
  | "no_show"
  | "poor_quality_delivery"
  | "late_file_upload"
  | "brand_guideline_violation"
  | "direct_customer_solicitation";

export interface PenaltyIssue {
  key: PenaltyIssueKey;
  label: string;
  amount: number; // for late_file_upload this is PER DAY, multiplied by days late
  perDay?: boolean;
  suspends?: boolean;
  note?: string;
}

export const PENALTY_ISSUES: PenaltyIssue[] = [
  { key: "late_arrival", label: "Late Arrival", amount: 2000 },
  {
    key: "no_show",
    label: "No Show",
    amount: 25000,
    suspends: true,
    note: "Vendor account is suspended.",
  },
  { key: "poor_quality_delivery", label: "Poor Quality Delivery", amount: 5000 },
  { key: "late_file_upload", label: "Late File Upload", amount: 1000, perDay: true },
  { key: "brand_guideline_violation", label: "Brand Guideline Violation", amount: 5000 },
  {
    key: "direct_customer_solicitation",
    label: "Direct Customer Solicitation",
    amount: 50000,
    suspends: true,
    note: "Vendor account is suspended (permanent termination per policy).",
  },
];

export function getPenaltyIssue(key: string | null | undefined): PenaltyIssue | null {
  return PENALTY_ISSUES.find((i) => i.key === key) ?? null;
}
