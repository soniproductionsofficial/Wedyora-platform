import { Vendor, IVendor } from "../models/Vendor";
import { ICustomer } from "../models/Customer";
import { Assignment } from "../models/Assignment";

export interface MatchInput {
  city?: string;
  services?: string[];
  eventType?: string;
  eventDate?: Date;
  budgetMin?: number;
  budgetMax?: number;
  limit?: number;
}

export interface ScoredVendor {
  vendor: IVendor;
  score: number;
  reasons: string[];
}

/**
 * Score listed vendors by location, service overlap, event-type fit,
 * availability on the event date, and budget alignment.
 */
export async function rankVendors(
  input: MatchInput
): Promise<ScoredVendor[]> {
  const filter: Record<string, unknown> = {
    isListed: true,
    depositStatus: "paid",
    termsAccepted: true,
  };

  if (input.city) {
    filter.city = new RegExp(`^${escapeRegex(input.city)}$`, "i");
  }
  if (input.services?.length) {
    filter.services = { $in: input.services };
  }
  if (input.eventType) {
    filter.$or = [
      { eventTypes: { $size: 0 } },
      { eventTypes: input.eventType },
      { eventTypes: new RegExp(escapeRegex(input.eventType), "i") },
    ];
  }

  const candidates = await Vendor.find(filter).limit(100);
  const scored: ScoredVendor[] = [];

  for (const vendor of candidates) {
    const { score, reasons } = scoreVendor(vendor, input);
    if (score > 0) {
      scored.push({ vendor, score, reasons });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, input.limit ?? 10);
}

export function scoreVendor(vendor: IVendor, input: MatchInput) {
  let score = 0;
  const reasons: string[] = [];

  // Location match (highest weight)
  if (input.city && vendor.city) {
    if (vendor.city.toLowerCase() === input.city.toLowerCase()) {
      score += 40;
      reasons.push("Same city");
    } else if (
      vendor.city.toLowerCase().includes(input.city.toLowerCase()) ||
      input.city.toLowerCase().includes(vendor.city.toLowerCase())
    ) {
      score += 20;
      reasons.push("Nearby city");
    }
  } else if (!input.city) {
    score += 10;
  }

  // Service overlap
  if (input.services?.length) {
    const vendorServices = vendor.services.map((s) => s.toLowerCase());
    const overlap = input.services.filter((s) =>
      vendorServices.includes(s.toLowerCase())
    );
    if (overlap.length) {
      const serviceScore = Math.min(30, overlap.length * 15);
      score += serviceScore;
      reasons.push(`Services: ${overlap.join(", ")}`);
    }
  } else {
    score += 5;
  }

  // Event type
  if (input.eventType) {
    const types = (vendor.eventTypes ?? []).map((t) => t.toLowerCase());
    if (
      types.length === 0 ||
      types.includes(input.eventType.toLowerCase())
    ) {
      score += 15;
      reasons.push("Event type supported");
    }
  }

  // Availability on event date
  if (input.eventDate && vendor.availabilityDates?.length) {
    const day = startOfDay(input.eventDate).getTime();
    const available = vendor.availabilityDates.some(
      (d) => startOfDay(d).getTime() === day
    );
    if (available) {
      score += 20;
      reasons.push("Available on event date");
    } else {
      score -= 15;
      reasons.push("Not marked available on event date");
    }
  } else if (input.eventDate) {
    // No availability calendar → mild positive (open calendar)
    score += 5;
    reasons.push("Open availability");
  }

  // Budget fit
  const price = vendor.pricing?.startingPrice ?? 0;
  if (input.budgetMax !== undefined && price <= input.budgetMax) {
    score += 10;
    reasons.push("Within budget");
  } else if (input.budgetMax !== undefined && price > input.budgetMax) {
    score -= 10;
    reasons.push("Above budget");
  }
  if (input.budgetMin !== undefined && price >= input.budgetMin) {
    score += 5;
  }

  // Baseline for any listed vendor
  score += 5;

  return { score: Math.max(0, score), reasons };
}

/**
 * Create an assignment between customer and best-matching vendor(s).
 * Returns the created assignment for the top match (or null if none).
 */
export async function assignBestVendor(
  customer: ICustomer,
  input: MatchInput & { serviceCategory?: string; notes?: string }
) {
  const ranked = await rankVendors({
    city: input.city ?? customer.location?.city,
    services:
      input.services ?? customer.preferences?.preferredServices ?? undefined,
    eventType: input.eventType ?? customer.eventType,
    eventDate: input.eventDate ?? customer.eventDate,
    budgetMin: input.budgetMin ?? customer.preferences?.budgetMin,
    budgetMax: input.budgetMax ?? customer.preferences?.budgetMax,
    limit: 5,
  });

  if (!ranked.length) {
    return { assignment: null, matches: [] as ScoredVendor[] };
  }

  const best = ranked[0];
  const agreedPrice = best.vendor.pricing?.startingPrice;

  const assignment = await Assignment.create({
    vendorId: best.vendor._id,
    customerId: customer._id,
    status: "pending",
    eventDate: input.eventDate ?? customer.eventDate,
    serviceCategory:
      input.serviceCategory ??
      input.services?.[0] ??
      best.vendor.services[0],
    agreedPrice,
    notes:
      input.notes ??
      `Auto-matched (score ${best.score}): ${best.reasons.join("; ")}`,
    paymentStatus: "unpaid",
    matchScore: best.score,
    matchReasons: best.reasons,
  });

  return { assignment, matches: ranked };
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
