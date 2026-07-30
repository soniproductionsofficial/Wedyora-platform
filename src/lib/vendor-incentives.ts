// Vendor Incentive Program, from the Vendor Pricing & Quote Structure
// poster's Performance Bonus table.

export const INCENTIVE_TIERS = [
  { events: 10, bonus: 5000 },
  { events: 25, bonus: 15000 },
  { events: 50, bonus: 40000 },
  { events: 100, bonus: 100000 },
] as const;

export type PartnerTier = "standard" | "gold" | "platinum";

// The poster mentions "Gold Partner" / "Platinum Partner" status as
// additional benefits without pinning exact thresholds — we tie them to
// the 50 and 100-event bonus tiers, the two milestones the poster already
// calls "priority allocation" / "premium wedding assignments" worthy.
export function partnerTierForEvents(events: number): PartnerTier {
  if (events >= 100) return "platinum";
  if (events >= 50) return "gold";
  return "standard";
}

export function nextIncentiveTier(events: number) {
  return INCENTIVE_TIERS.find((t) => t.events > events) ?? null;
}
