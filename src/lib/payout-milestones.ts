// Vendor Payment Timeline, from the Vendor Pricing & Quote Structure
// poster: a booking's vendor payout is released in 5 stages instead of one
// lump sum, tied to real milestones in the booking's life.

export type PayoutMilestoneKey =
  | "booking_confirmation"
  | "wedding_completed"
  | "raw_files_uploaded"
  | "quality_check_approved"
  | "customer_delivery_completed";

export const PAYOUT_MILESTONES: {
  key: PayoutMilestoneKey;
  label: string;
  percentage: number;
  sortOrder: number;
}[] = [
  { key: "booking_confirmation", label: "Booking Confirmation", percentage: 20, sortOrder: 1 },
  { key: "wedding_completed", label: "Wedding Successfully Completed", percentage: 30, sortOrder: 2 },
  { key: "raw_files_uploaded", label: "Raw Files Uploaded", percentage: 20, sortOrder: 3 },
  { key: "quality_check_approved", label: "Quality Check Approved", percentage: 20, sortOrder: 4 },
  { key: "customer_delivery_completed", label: "Customer Delivery Completed", percentage: 10, sortOrder: 5 },
];

export function labelForMilestone(key: string): string {
  return PAYOUT_MILESTONES.find((m) => m.key === key)?.label ?? key;
}
