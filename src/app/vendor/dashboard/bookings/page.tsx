import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

const STATUS_LABEL: Record<string, string> = {
  pending_vendor_acceptance: "Awaiting your response",
  awaiting_payment: "Waiting on customer's advance",
  confirmed: "Confirmed",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_STYLE: Record<string, string> = {
  pending_vendor_acceptance: "bg-yellow-50 text-yellow-700",
  awaiting_payment: "bg-blue-50 text-blue-700",
  confirmed: "bg-green-50 text-green-700",
  in_progress: "bg-green-50 text-green-700",
  completed: "bg-brand-cream text-brand-gray border border-brand-line",
  cancelled: "bg-red-50 text-brand-orange-dark",
};

export default async function VendorBookingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: bookings } = await supabase
    .from("bookings")
    .select(
      "id, event_date, city, status, agreed_vendor_payout, service_categories(name), profiles!bookings_customer_id_fkey(full_name)"
    )
    .eq("vendor_id", user.id)
    .order("event_date", { ascending: false });

  return (
    <div>
      <h2 className="font-heading text-lg font-semibold mb-6">All Bookings</h2>

      {!bookings || bookings.length === 0 ? (
        <div className="rounded-2xl border border-brand-line bg-white p-10 text-center">
          <CalendarCheck className="h-8 w-8 text-brand-gray mx-auto mb-3" />
          <p className="text-brand-gray text-sm">No bookings yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {bookings.map((b) => (
            <Link
              key={b.id}
              href={`/vendor/dashboard/bookings/${b.id}`}
              className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-brand-line bg-white p-5 hover:border-brand-orange transition-colors"
            >
              <div>
                <p className="font-medium">
                  {b.service_categories?.name} &middot; {b.profiles?.full_name ?? "—"}
                </p>
                <p className="text-xs text-brand-gray">
                  {b.city} &middot; {new Date(b.event_date).toLocaleDateString("en-IN")}
                  {b.agreed_vendor_payout &&
                    ` · You get ₹${Number(b.agreed_vendor_payout).toLocaleString("en-IN")}`}
                </p>
              </div>
              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  STATUS_STYLE[b.status] ?? "bg-brand-cream text-brand-gray"
                }`}
              >
                {STATUS_LABEL[b.status] ?? b.status}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
