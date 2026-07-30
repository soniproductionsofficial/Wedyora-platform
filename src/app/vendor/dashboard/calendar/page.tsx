import { Calendar as CalendarIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

// A simple grouped-by-month list rather than a visual grid calendar — no
// client JS or calendar library, consistent with the rest of this app, and
// easier to scan on mobile than a grid would be anyway.
export default async function VendorCalendarPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: bookings } = await supabase
    .from("bookings")
    .select("id, event_date, city, status, service_categories(name), profiles!bookings_customer_id_fkey(full_name)")
    .eq("vendor_id", user.id)
    .in("status", ["awaiting_payment", "confirmed", "in_progress"])
    .gte("event_date", new Date().toISOString().slice(0, 10))
    .order("event_date", { ascending: true });

  const groups = (bookings ?? []).reduce<Record<string, typeof bookings>>((acc, b) => {
    const d = new Date(b.event_date);
    const key = d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
    (acc[key] ??= []).push(b);
    return acc;
  }, {});

  const monthKeys = Object.keys(groups);

  return (
    <div>
      <h2 className="font-heading text-lg font-semibold mb-6">Upcoming Events</h2>

      {monthKeys.length === 0 ? (
        <div className="rounded-2xl border border-brand-line bg-white p-10 text-center">
          <CalendarIcon className="h-8 w-8 text-brand-gray mx-auto mb-3" />
          <p className="text-brand-gray text-sm">No confirmed events scheduled yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {monthKeys.map((month) => (
            <div key={month}>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-gray mb-3">
                {month}
              </p>
              <div className="flex flex-col gap-3">
                {groups[month]!.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center gap-4 rounded-2xl border border-brand-line bg-white p-4"
                  >
                    <div className="flex flex-col items-center justify-center h-14 w-14 rounded-xl bg-brand-cream shrink-0">
                      <span className="text-lg font-heading font-bold leading-none">
                        {new Date(b.event_date).getDate()}
                      </span>
                      <span className="text-[10px] text-brand-gray uppercase">
                        {new Date(b.event_date).toLocaleDateString("en-IN", { month: "short" })}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {b.service_categories?.name} &middot; {b.profiles?.full_name ?? "—"}
                      </p>
                      <p className="text-xs text-brand-gray">{b.city}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
