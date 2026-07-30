// AI Vendor Matching Engine (Chapter 7 poster: "Wedyora AI Vendor
// Matching Engine"). This is a deterministic weighted-scoring formula, not
// a trained ML model — there's no data pipeline or retraining loop behind
// it (the poster's "Continuous Learning" section), just the same six
// parameters the poster lists, with the same weights, computed fresh every
// time an admin opens a booking to assign. It informs the existing manual
// assignment — nothing here auto-assigns a vendor.
//
// Two of the six parameters use disclosed stand-ins for data we don't
// collect yet (see distanceScore/equipmentScore below); the other four
// (availability, rating, experience, reliability) are computed from real
// bookings/reviews.

export const MATCH_WEIGHTS = {
  availability: 30,
  rating: 25,
  distance: 15,
  experience: 10,
  equipment: 10,
  reliability: 10,
} as const;

export interface VendorMatchInput {
  id: string;
  city: string;
  experience_years: number | null;
  successful_events_count: number;
  equipment_details: string | null;
}

export interface VendorMatchContext {
  averageRating: number | null; // null = no reviews yet
  nearbyBookingsCount: number; // this vendor's other active bookings within +/-14 days of the target date
  completedCount: number;
  cancelledCount: number;
}

export interface VendorMatchScore {
  vendorId: string;
  overall: number;
  breakdown: {
    availability: number;
    rating: number;
    distance: number;
    experience: number;
    equipment: number;
    reliability: number;
  };
}

function availabilityScore(nearbyBookingsCount: number): number {
  if (nearbyBookingsCount <= 0) return 100;
  if (nearbyBookingsCount === 1) return 80;
  if (nearbyBookingsCount === 2) return 60;
  return 40;
}

function ratingScore(averageRating: number | null): number {
  // No reviews yet isn't the same as a bad rating — a neutral score keeps
  // a brand-new vendor from being punished for lacking a track record.
  if (averageRating == null) return 70;
  return Math.round((averageRating / 5) * 100);
}

// Stand-in for real GPS distance (the poster scores vendor-to-venue
// distance in km bands). We don't collect vendor/venue coordinates or run
// geocoding, so this is a same-city match instead.
function distanceScore(vendorCity: string, bookingCity: string): number {
  return vendorCity.trim().toLowerCase() === bookingCity.trim().toLowerCase() ? 100 : 50;
}

// Scaled down from the poster's example thresholds (100/500/1000+
// weddings), which assume a mature marketplace — a new platform's best
// vendors won't have hit those numbers for a long while.
function experienceScore(experienceYears: number | null, successfulEvents: number): number {
  let score = 60;
  if (successfulEvents >= 20) score = 100;
  else if (successfulEvents >= 10) score = 90;
  else if (successfulEvents >= 5) score = 80;
  else if (successfulEvents >= 1) score = 70;
  // A vendor with real-world experience but no Wedyora booking history yet
  // gets a small boost instead of being scored as a total unknown.
  if (successfulEvents === 0 && experienceYears) {
    score = Math.min(75, 60 + experienceYears * 3);
  }
  return score;
}

// Stand-in for the poster's structured equipment checklist (full-frame
// cameras, drone, lighting, backup gear, etc.) — we only collect a
// free-text description at signup, so this scores how much detail a
// vendor gave, not verified equipment quality.
function equipmentScore(equipmentDetails: string | null): number {
  if (!equipmentDetails || !equipmentDetails.trim()) return 50;
  return equipmentDetails.trim().length >= 30 ? 90 : 70;
}

// Based on this vendor's own booking history: completed vs. cancelled.
// We don't record who caused a cancellation (customer or vendor), so this
// is a rough signal, not a fault determination.
function reliabilityScore(completedCount: number, cancelledCount: number): number {
  const total = completedCount + cancelledCount;
  if (total === 0) return 85; // not enough history yet — neutral, not punitive
  return Math.round((completedCount / total) * 100);
}

export function scoreVendor(
  vendor: VendorMatchInput,
  bookingCity: string,
  context: VendorMatchContext
): VendorMatchScore {
  const breakdown = {
    availability: availabilityScore(context.nearbyBookingsCount),
    rating: ratingScore(context.averageRating),
    distance: distanceScore(vendor.city, bookingCity),
    experience: experienceScore(vendor.experience_years, vendor.successful_events_count),
    equipment: equipmentScore(vendor.equipment_details),
    reliability: reliabilityScore(context.completedCount, context.cancelledCount),
  };

  const overall =
    (breakdown.availability * MATCH_WEIGHTS.availability +
      breakdown.rating * MATCH_WEIGHTS.rating +
      breakdown.distance * MATCH_WEIGHTS.distance +
      breakdown.experience * MATCH_WEIGHTS.experience +
      breakdown.equipment * MATCH_WEIGHTS.equipment +
      breakdown.reliability * MATCH_WEIGHTS.reliability) /
    100;

  return { vendorId: vendor.id, overall: Math.round(overall * 10) / 10, breakdown };
}
