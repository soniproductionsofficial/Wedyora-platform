import { db } from "../config/db.js";
import type { Vendor, Booking } from "../types/models.js";

export interface MatchScore {
  vendorId: string;
  overall: number;
  breakdown: {
    category: number;
    city: number;
    budget: number;
    availability: number;
    rating: number;
  };
}

export function scoreVendor(
  vendor: Vendor,
  input: {
    category?: string;
    city?: string;
    eventDate?: string;
    budgetMin?: number;
    budgetMax?: number;
  }
): MatchScore {
  const category =
    !input.category || vendor.category.toLowerCase() === input.category.toLowerCase()
      ? 100
      : vendor.services.some((s) => s.toLowerCase().includes((input.category ?? "").toLowerCase()))
        ? 60
        : 0;

  const city =
    !input.city || vendor.city.toLowerCase().includes(input.city.toLowerCase()) ? 100 : 20;

  let budget = 70;
  if (input.budgetMax != null && vendor.priceMin != null) {
    if (vendor.priceMin <= input.budgetMax) budget = 100;
    else if (vendor.priceMin <= input.budgetMax * 1.15) budget = 60;
    else budget = 10;
  }

  const availability =
    !input.eventDate ||
    vendor.availableDates.length === 0 ||
    vendor.availableDates.includes(input.eventDate)
      ? 100
      : 0;

  const rating = Math.min(100, Math.round((vendor.rating / 5) * 100));

  const overall = Math.round(
    category * 0.3 + city * 0.2 + budget * 0.2 + availability * 0.2 + rating * 0.1
  );

  return {
    vendorId: vendor.id,
    overall,
    breakdown: { category, city, budget, availability, rating },
  };
}

export function matchVendors(input: {
  category?: string;
  city?: string;
  eventDate?: string;
  budgetMin?: number;
  budgetMax?: number;
  limit?: number;
}) {
  const vendors = db.vendors.filter((v) => v.isVerified && v.depositPaid);
  return vendors
    .map((v) => ({ vendor: v, score: scoreVendor(v, input) }))
    .sort((a, b) => b.score.overall - a.score.overall)
    .slice(0, input.limit ?? 10);
}

export function defaultTasksForBooking(_booking: Booking): string[] {
  return [
    "Confirm availability and equipment",
    "Review event brief and venue details",
    "Check in on event day",
    "Upload deliverables after the event",
  ];
}
