import { createClient } from "@/lib/supabase/server";
import { assignVendorToBookingAction } from "@/lib/actions/admin";

const STATUS_LABEL: Record<string, string> = {
  pending_assignment: "Needs a vendor",
  awaiting_payment: "Awaiting payment",
  confirmed: "Confirmed",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default async function AdminBookingsPage() {
  const supabase = await createClient();

  // `profiles(...)` is ambiguous here because bookings has TWO foreign keys
  // to profiles (customer_id, and assigned_by) — PostgREST can't tell which
  // relationship to embed without the `!<fk>` hint. The
  // `!bookings_customer_id_fkey` hint disambiguates it to the customer who
  // made the booking (not the admin who assigned a vendor to it).
  const { data: bookings, error: bookingsError } = await supabase
    .from("bookings")
    .select(
      "id, event_date, city, guest_count, budget_min, budget_max, special_requirements, status, agreed_price, advance_amount, service_categories(id, name), profiles!bookings_customer_id_fkey(full_name, phone), vendor_profiles(business_name)"
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
      <h1 className="font-heading text-2xl font-semibold mb-2">Bookings</h1>
      <p className="text-brand-gray text-sm mb-8">
        Assign a verified vendor to each new booking request. (This manual
        step is a stand-in for the AI vendor-matching engine, which comes in
        a later phase.)
      </p>

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
                  <span className="px-3 py-1 rounded-full bg-brand-cream border border-brand-line text-xs font-medium">
                    {STATUS_LABEL[b.status] ?? b.status}
                  </span>
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
  const { data: eligibleVendors } = booking.service_categories
    ? await supabase
        .from("vendor_profiles")
        .select("id, business_name, city")
        .eq("status", "approved")
        .eq("category_id", booking.service_categories.id)
    : { data: [] as { id: string; business_name: string; city: string }[] };

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

      {eligibleVendors && eligibleVendors.length > 0 ? (
        <form
          action={assignVendorToBookingAction}
          className="flex flex-wrap items-end gap-3"
        >
          <input type="hidden" name="booking_id" value={booking.id} />
          <label className="flex flex-col gap-1 text-xs font-medium">
            Vendor
            <select
              name="vendor_id"
              required
              className="rounded-lg border border-brand-line px-3 py-2 text-sm"
            >
              {eligibleVendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.business_name} ({v.city})
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium">
            Agreed Price (₹)
            <input
              type="number"
              name="agreed_price"
              required
              min={1}
              className="rounded-lg border border-brand-line px-3 py-2 text-sm w-32"
            />
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
          <button
            type="submit"
            className="px-4 py-2 rounded-full bg-brand-black text-white text-sm font-semibold hover:bg-brand-charcoal"
          >
            Assign
          </button>
        </form>
      ) : (
        <p className="text-sm text-brand-orange-dark">
          No approved vendors in this category/city yet — approve one first.
        </p>
      )}
    </div>
  );
}
