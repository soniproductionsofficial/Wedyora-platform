import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createBookingAction } from "@/lib/actions/booking";

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login?redirectTo=/book");
  }

  const { data: categories } = await supabase
    .from("service_categories")
    .select("id, name")
    .order("name");

  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <h1 className="font-heading text-2xl font-semibold mb-2">
        Plan Your Wedding
      </h1>
      <p className="text-brand-gray text-sm mb-8">
        Tell us what you need — Wedyora will match you with a verified
        vendor and confirm the details before anything is charged.
      </p>

      {error && (
        <p className="mb-6 rounded-lg bg-red-50 text-brand-orange-dark text-sm px-4 py-3">
          {error}
        </p>
      )}

      <form action={createBookingAction} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Service Needed <span className="text-brand-orange">*</span>
          <select
            name="category_id"
            required
            className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
          >
            <option value="">Select a service</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Event Date <span className="text-brand-orange">*</span>
          <input
            type="date"
            name="event_date"
            required
            className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          City <span className="text-brand-orange">*</span>
          <input
            name="city"
            required
            className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Guest Count
          <input
            type="number"
            name="guest_count"
            min={1}
            className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
          />
        </label>

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

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Special Requirements
          <textarea
            name="special_requirements"
            rows={3}
            className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
          />
        </label>

        <button
          type="submit"
          className="mt-2 w-full rounded-full bg-brand-orange text-white font-semibold py-3 hover:bg-brand-orange-dark transition-colors"
        >
          Submit Booking Request
        </button>
      </form>
    </div>
  );
}
