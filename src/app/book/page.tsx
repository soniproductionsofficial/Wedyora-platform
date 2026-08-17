import { redirect } from "next/navigation";
import { CalendarCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createBookingAction } from "@/lib/actions/booking";
import BookingCartSummary from "@/components/booking-cart-summary";
import MinutesBookingSummary from "@/components/minutes-booking-summary";
import { MINUTES_CATEGORIES } from "@/lib/minutes-content";

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    source?: string;
    package?: string;
    category?: string;
    city?: string;
    date?: string;
  }>;
}) {
  const {
    error,
    source,
    package: packageName,
    category: categoryId,
    city,
    date,
  } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    const qs = new URLSearchParams();
    if (source) qs.set("source", source);
    if (packageName) qs.set("package", packageName);
    if (categoryId) qs.set("category", categoryId);
    if (city) qs.set("city", city);
    if (date) qs.set("date", date);
    const bookPath = qs.size > 0 ? `/book?${qs.toString()}` : "/book";
    redirect(`/login?redirectTo=${encodeURIComponent(bookPath)}`);
  }

  const fromMinutes = source === "minutes";
  const categoryLabel =
    MINUTES_CATEGORIES.find((c) => c.id === categoryId)?.title ?? categoryId;
  const specialDefault = fromMinutes
    ? [
        "Photography in Minutes booking request.",
        categoryLabel ? `Occasion: ${categoryLabel}.` : null,
        packageName ? `Preferred package: ${packageName}.` : null,
        city ? `Preferred city: ${city}.` : null,
        date ? `Preferred event date: ${date}.` : null,
        "Please assign a verified Minutes photographer for this occasion.",
        "Do not attach items from the Wedyora services cart to this request.",
      ]
        .filter(Boolean)
        .join(" ")
    : "";

  const { data: categories } = await supabase
    .from("service_categories")
    .select("id, name")
    .order("name");

  const photographyCategoryId =
    categories?.find((c) => c.name.toLowerCase().includes("photo"))?.id ?? "";

  return (
    <div>
      <section className="bg-brand-chrome text-white">
        <div className="mx-auto max-w-6xl px-6 py-14 text-center">
          <span className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-brand-gold-bright/15 text-brand-gold-bright">
            <CalendarCheck className="h-5 w-5" />
          </span>
          <h1 className="font-heading mb-2 text-3xl font-bold">
            {fromMinutes ? "Book Photography in Minutes" : "Plan Your Occasion"}
          </h1>
          <p className="mx-auto max-w-xl text-sm text-white/70">
            {fromMinutes
              ? "Occasion photography from ₹1,999 — verified photographer assignment. Separate from your Wedyora services cart."
              : "Tell us what you need — Wedyora will match you with a verified vendor and confirm the details before anything is charged."}
          </p>
        </div>
      </section>

      <div className="mx-auto -mt-10 max-w-xl px-6 py-12">
        <div className="rounded-2xl border border-brand-line bg-white p-6 shadow-sm md:p-8">
          {error && (
            <p className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-brand-orange-dark">
              {error}
            </p>
          )}

          <form action={createBookingAction} className="flex flex-col gap-4">
            {fromMinutes ? (
              <MinutesBookingSummary packageName={packageName} />
            ) : (
              <BookingCartSummary />
            )}

            <label className="flex flex-col gap-1.5 text-sm font-medium">
              Primary service needed <span className="text-brand-orange">*</span>
              {fromMinutes ? (
                <>
                  <input
                    type="hidden"
                    name="category_id"
                    value={photographyCategoryId}
                  />
                  <input
                    type="text"
                    readOnly
                    value="Photography (Wedyora Minutes)"
                    className="rounded-lg border border-brand-line bg-brand-cream/60 px-4 py-2.5 text-sm font-normal text-brand-black"
                  />
                </>
              ) : (
                <select
                  name="category_id"
                  required
                  defaultValue=""
                  className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                >
                  <option value="">Select a service</option>
                  {categories?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium">
              Event Date <span className="text-brand-orange">*</span>
              <input
                type="date"
                name="event_date"
                required
                defaultValue={date ?? ""}
                className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium">
              City <span className="text-brand-orange">*</span>
              <input
                name="city"
                required
                defaultValue={city ?? ""}
                className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
              />
            </label>

            {!fromMinutes ? (
              <label className="flex flex-col gap-1.5 text-sm font-medium">
                Guest Count
                <input
                  type="number"
                  name="guest_count"
                  min={1}
                  className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                />
              </label>
            ) : null}

            {!fromMinutes ? (
              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5 text-sm font-medium">
                  Budget Min (₹)
                  <input
                    type="number"
                    name="budget_min"
                    min={0}
                    className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-sm font-medium">
                  Budget Max (₹)
                  <input
                    type="number"
                    name="budget_max"
                    min={0}
                    className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                  />
                </label>
              </div>
            ) : null}

            <label className="flex flex-col gap-1.5 text-sm font-medium">
              Special Requirements
              <textarea
                name="special_requirements"
                rows={3}
                defaultValue={specialDefault}
                className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
              />
            </label>

            <button
              type="submit"
              className="mt-2 w-full rounded-full bg-brand-button py-3 font-semibold text-brand-black transition-colors hover:bg-brand-button-dark"
            >
              {fromMinutes
                ? "Submit Minutes Booking Request"
                : "Submit Booking Request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
