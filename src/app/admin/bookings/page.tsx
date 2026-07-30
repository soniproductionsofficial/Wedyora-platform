import Link from "next/link";
import { Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { assignVendorToBookingAction, markBookingCompletedAction } from "@/lib/actions/admin";
import { scoreVendor, MATCH_WEIGHTS, type VendorMatchScore } from "@/lib/vendor-matching";

const STATUS_LABEL: Record<string, string> = {
  pending_assignment: "Needs a vendor",
  pending_vendor_acceptance: "Awaiting vendor response",
  awaiting_payment: "Awaiting payment",
  confirmed: "Confirmed",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error: actionError } = await searchParams;
  const supabase = await createClient();

  // `profiles(...)` is ambiguous here because bookings has TWO foreign keys
  // to profiles (customer_id, and assigned_by) — PostgREST can't tell which
  // relationship to embed without the `!<fk>` hint. The
  // `!bookings_customer_id_fkey` hint disambiguates it to the customer who
  // made the booking (not the admin who assigned a vendor to it).
  const { data: bookings, error: bookingsError } = await supabase
    .from("bookings")
    .select(
      "id, event_date, city, guest_count, budget_min, budget_max, special_requirements, status, agreed_price, agreed_vendor_payout, advance_amount, service_categories(id, name), profiles!bookings_customer_id_fkey(full_name, phone), vendor_profiles(business_name)"
    )
    .order("created_at", { ascending: true });

  if (bookingsError) {
    console.error("Failed to load bookings:", bookingsError);
  }

  const bookingsByStatus = (bookings ?? []).reduce<Record<string, typeof bookings>>(
    (acc, b) => {
      (acc[b.status] ??= []).push(b);
      return acc;
    },
    {}
  );

  return (
    <div>
      <p className="text-brand-gray text-sm mb-8">
        Assign a verified vendor to each new booking request. Each eligible
        vendor now gets an AI Match Score (availability, rating, distance,
        experience, equipment, reliability) to help you decide — it&rsquo;s
        informational only, you still choose and assign the vendor yourself.
      </p>

      {actionError && (
        <p className="mb-6 rounded-lg bg-red-50 text-brand-orange-dark text-sm px-4 py-3">
          {actionError}
        </p>
      )}

      {bookingsError && (
        <p className="mb-6 rounded-lg bg-red-50 text-brand-orange-dark text-sm px-4 py-3">
          Couldn&apos;t load bookings: {bookingsError.message}
        </p>
      )}

      <section className="mb-12">
        <h2 className="font-heading text-lg font-semibold mb-4">
          Needs a Vendor ({bookingsByStatus.pending_assignment?.length ?? 0})
        </h2>
        {!bookingsByStatus.pending_assignment?.length ? (
          <p className="text-brand-gray text-sm">Nothing to assign right now.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {bookingsByStatus.pending_assignment.map((b) => (
              <BookingAssignCard key={b.id} booking={b} supabase={supabase} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-heading text-lg font-semibold mb-4">
          Everything Else
        </h2>
        <div className="flex flex-col gap-3">
          {(bookings ?? [])
            .filter((b) => b.status !== "pending_assignment")
            .map((b) => (
              <div
                key={b.id}
                className="rounded-xl border border-brand-line bg-white p-4 flex flex-wrap items-center justify-between gap-2 text-sm"
              >
                <span>
                  <strong>{b.service_categories?.name}</strong> for{" "}
                  {b.profiles?.full_name} in {b.city} on{" "}
                  {new Date(b.event_date).toLocaleDateString("en-IN")}
                </span>
                <span className="flex items-center gap-3">
                  {b.vendor_profiles?.business_name && (
                    <span className="text-brand-gray">
                      &rarr; {b.vendor_profiles.business_name}
                    </span>
                  )}
                  {b.agreed_price && (
                    <span className="text-brand-gray">
                      ₹{b.agreed_price}
                      {b.agreed_vendor_payout && ` (vendor ₹${b.agreed_vendor_payout})`}
                    </span>
                  )}
                  <span className="px-3 py-1 rounded-full bg-brand-cream border border-brand-line text-xs font-medium">
                    {STATUS_LABEL[b.status] ?? b.status}
                  </span>
                  <Link
                    href={`/admin/bookings/${b.id}`}
                    className="text-xs font-semibold text-brand-orange hover:underline whitespace-nowrap"
                  >
                    View Details
                  </Link>
                  {(b.status === "confirmed" || b.status === "in_progress") && (
                    <form action={markBookingCompletedAction}>
                      <input type="hidden" name="booking_id" value={b.id} />
                      <button
                        type="submit"
                        className="px-3 py-1 rounded-full bg-green-600 text-white text-xs font-semibold hover:bg-green-700"
                      >
                        Mark Completed
                      </button>
                    </form>
                  )}
                </span>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}

interface AssignableBooking {
  id: string;
  event_date: string;
  city: string;
  guest_count: number | null;
  budget_min: number | null;
  budget_max: number | null;
  special_requirements: string | null;
  service_categories: { id: string; name: string } | null;
  profiles: { full_name: string | null; phone: string | null } | null;
}

async function BookingAssignCard({
  booking,
  supabase,
}: {
  booking: AssignableBooking;
  supabase: Awaited<ReturnType<typeof createClient>>;
}) {
  const [{ data: eligibleVendors }, { data: addOns }] = await Promise.all([
    booking.service_categories
      ? supabase
          .from("vendor_profiles")
          .select(
            "id, business_name, city, experience_years, successful_events_count, equipment_details"
          )
          .eq("status", "approved")
          .eq("category_id", booking.service_categories.id)
      : Promise.resolve({
          data: [] as {
            id: string;
            business_name: string;
            city: string;
            experience_years: number | null;
            successful_events_count: number;
            equipment_details: string | null;
          }[],
        }),
    supabase
      .from("add_ons")
      .select("id, name, customer_price, vendor_payout")
      .eq("is_active", true)
      .order("name"),
  ]);

  const vendorIds = (eligibleVendors ?? []).map((v) => v.id);
  const [{ data: packages }, { data: reviewRows }, { data: vendorBookings }] = await Promise.all([
    vendorIds.length
      ? supabase
          .from("packages")
          .select("id, vendor_id, title, customer_price, vendor_payout")
          .in("vendor_id", vendorIds)
          .eq("is_active", true)
      : Promise.resolve({
          data: [] as {
            id: string;
            vendor_id: string;
            title: string;
            customer_price: number;
            vendor_payout: number;
          }[],
        }),
    vendorIds.length
      ? supabase.from("reviews").select("vendor_id, rating").in("vendor_id", vendorIds)
      : Promise.resolve({ data: [] as { vendor_id: string; rating: number }[] }),
    vendorIds.length
      ? supabase
          .from("bookings")
          .select("vendor_id, event_date, status")
          .in("vendor_id", vendorIds)
      : Promise.resolve({
          data: [] as { vendor_id: string; event_date: string; status: string }[],
        }),
  ]);

  const vendorsWithPackages = (eligibleVendors ?? []).map((v) => ({
    ...v,
    packages: (packages ?? []).filter((p) => p.vendor_id === v.id),
  }));
  const hasAnyPackage = vendorsWithPackages.some((v) => v.packages.length > 0);

  // AI Vendor Matching Engine score (see src/lib/vendor-matching.ts) — this
  // ranks eligible vendors to help you decide, it never assigns on its own.
  const targetDate = new Date(booking.event_date).getTime();
  const NEARBY_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;
  const NON_ACTIVE_STATUSES = ["cancelled", "pending_assignment"];

  const scoredVendors = (eligibleVendors ?? [])
    .map((v) => {
      const vReviews = (reviewRows ?? []).filter((r) => r.vendor_id === v.id);
      const averageRating = vReviews.length
        ? vReviews.reduce((sum, r) => sum + r.rating, 0) / vReviews.length
        : null;
      const vBookings = (vendorBookings ?? []).filter((b) => b.vendor_id === v.id);
      const nearbyBookingsCount = vBookings.filter(
        (b) =>
          !NON_ACTIVE_STATUSES.includes(b.status) &&
          Math.abs(new Date(b.event_date).getTime() - targetDate) <= NEARBY_WINDOW_MS
      ).length;
      const completedCount = vBookings.filter((b) => b.status === "completed").length;
      const cancelledCount = vBookings.filter((b) => b.status === "cancelled").length;

      const score = scoreVendor(v, booking.city, {
        averageRating,
        nearbyBookingsCount,
        completedCount,
        cancelledCount,
      });
      return { businessName: v.business_name, score };
    })
    .sort((a, b) => b.score.overall - a.score.overall);

  return (
    <div className="rounded-2xl border border-brand-line bg-white p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold mb-1">
        {booking.service_categories?.name}
      </p>
      <p className="font-medium mb-1">
        {booking.profiles?.full_name} &middot; {booking.profiles?.phone}
      </p>
      <p className="text-sm text-brand-gray mb-3">
        {booking.city} &middot;{" "}
        {new Date(booking.event_date).toLocaleDateString("en-IN")}
        {booking.guest_count ? ` · ${booking.guest_count} guests` : ""}
        {booking.budget_min || booking.budget_max
          ? ` · Budget ₹${booking.budget_min ?? "?"}-₹${booking.budget_max ?? "?"}`
          : ""}
      </p>
      {booking.special_requirements && (
        <p className="text-sm mb-4 italic text-brand-gray">
          &ldquo;{booking.special_requirements}&rdquo;
        </p>
      )}

      {scoredVendors.length > 0 && <MatchScorePanel vendors={scoredVendors} />}

      {!eligibleVendors || eligibleVendors.length === 0 ? (
        <p className="text-sm text-brand-orange-dark">
          No approved vendors in this category/city yet — approve one first.
        </p>
      ) : !hasAnyPackage ? (
        <p className="text-sm text-brand-orange-dark">
          Eligible vendors exist, but none have a priced package set up yet —{" "}
          <a href="/admin/packages" className="underline">
            add one on the Packages page
          </a>{" "}
          before you can assign this booking.
        </p>
      ) : (
        <form
          action={assignVendorToBookingAction}
          className="flex flex-col gap-3"
        >
          <input type="hidden" name="booking_id" value={booking.id} />
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1 text-xs font-medium">
              Vendor &amp; Package
              <select
                name="package_id"
                required
                className="rounded-lg border border-brand-line px-3 py-2 text-sm min-w-[220px]"
              >
                <option value="">Select a package</option>
                {vendorsWithPackages
                  .filter((v) => v.packages.length > 0)
                  .map((v) => (
                    <optgroup key={v.id} label={`${v.business_name} (${v.city})`}>
                      {v.packages.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} — ₹{p.customer_price} (vendor ₹{p.vendor_payout})
                        </option>
                      ))}
                    </optgroup>
                  ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs font-medium">
              Advance Due (₹)
              <input
                type="number"
                name="advance_amount"
                required
                min={1}
                className="rounded-lg border border-brand-line px-3 py-2 text-sm w-32"
              />
            </label>
          </div>

          {addOns && addOns.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-medium text-brand-gray">Add-ons (optional)</p>
              <div className="grid sm:grid-cols-2 gap-1.5">
                {addOns.map((a) => (
                  <label
                    key={a.id}
                    className="flex items-center gap-2 text-xs rounded-lg border border-brand-line px-3 py-2 cursor-pointer hover:border-brand-orange"
                  >
                    <input type="checkbox" name="add_on_ids" value={a.id} />
                    {a.name} — ₹{a.customer_price} (vendor ₹{a.vendor_payout})
                  </label>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="self-start px-4 py-2 rounded-full bg-brand-black text-white text-sm font-semibold hover:bg-brand-charcoal"
          >
            Assign
          </button>
        </form>
      )}
    </div>
  );
}

const BREAKDOWN_LABELS: { key: keyof VendorMatchScore["breakdown"]; label: string; weight: number }[] = [
  { key: "availability", label: "Availability", weight: MATCH_WEIGHTS.availability },
  { key: "rating", label: "Rating", weight: MATCH_WEIGHTS.rating },
  { key: "distance", label: "Distance", weight: MATCH_WEIGHTS.distance },
  { key: "experience", label: "Experience", weight: MATCH_WEIGHTS.experience },
  { key: "equipment", label: "Equipment", weight: MATCH_WEIGHTS.equipment },
  { key: "reliability", label: "Reliability", weight: MATCH_WEIGHTS.reliability },
];

function MatchScorePanel({
  vendors,
}: {
  vendors: { businessName: string; score: VendorMatchScore }[];
}) {
  return (
    <div className="rounded-xl border border-brand-line bg-brand-cream/60 p-4 mb-4">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand-gray mb-3">
        <Sparkles className="h-3.5 w-3.5 text-brand-orange" /> AI Match Scores (informational —
        pick any vendor below)
      </p>
      <div className="flex flex-col gap-2">
        {vendors.map(({ businessName, score }, i) => (
          <div
            key={score.vendorId}
            className={`rounded-lg border px-3 py-2 text-xs ${
              i === 0
                ? "border-brand-orange bg-white"
                : "border-brand-line bg-white/60"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium">
                {businessName}
                {i === 0 && (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-brand-orange text-white text-[10px] font-semibold">
                    Best Match
                  </span>
                )}
              </span>
              <span className="font-heading font-bold">{score.overall}/100</span>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-brand-gray">
              {BREAKDOWN_LABELS.map(({ key, label, weight }) => (
                <span key={key}>
                  {label} {score.breakdown[key]}
                  <span className="text-[10px]"> ({weight}%)</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
