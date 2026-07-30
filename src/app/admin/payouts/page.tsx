import { createClient } from "@/lib/supabase/server";
import { markPayoutReleasedAction } from "@/lib/actions/admin";

export default async function AdminPayoutsPage() {
  const supabase = await createClient();

  const { data: payments } = await supabase
    .from("payments")
    .select(
      "id, amount, type, payout_status, created_at, bookings(event_date, service_categories(name), vendor_profiles(business_name))"
    )
    .eq("status", "paid")
    .order("created_at", { ascending: false });

  const allPayments = payments ?? [];
  const pending = allPayments.filter((p) => p.payout_status === "pending");
  const released = allPayments.filter((p) => p.payout_status === "released");
  const pendingTotal = pending.reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div>
      <p className="text-brand-gray text-sm mb-6">
        Every payment collected from a customer. Mark one as released once
        it&rsquo;s actually been paid out to the vendor&rsquo;s bank account —
        this is a manual ledger flag for now, not an automated bank transfer.
      </p>

      <div className="rounded-2xl border border-brand-line bg-white p-6 mb-8">
        <p className="text-2xl font-heading font-bold">
          ₹{pendingTotal.toLocaleString("en-IN")}
        </p>
        <p className="text-xs text-brand-gray">Total pending payout across all vendors</p>
      </div>

      <h2 className="font-heading text-lg font-semibold mb-4">
        Pending ({pending.length})
      </h2>
      {pending.length === 0 ? (
        <p className="text-brand-gray text-sm mb-8">Nothing pending right now.</p>
      ) : (
        <div className="flex flex-col gap-2 mb-8">
          {pending.map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-brand-line bg-white p-4 text-sm"
            >
              <span>
                {p.bookings?.vendor_profiles?.business_name ?? "—"} &middot;{" "}
                {p.bookings?.service_categories?.name} &middot;{" "}
                {p.type === "advance" ? "Advance" : "Final"} &middot; ₹
                {Number(p.amount).toLocaleString("en-IN")}
              </span>
              <form action={markPayoutReleasedAction}>
                <input type="hidden" name="payment_id" value={p.id} />
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-full bg-brand-orange text-white text-xs font-semibold hover:bg-brand-orange-dark"
                >
                  Mark as Released
                </button>
              </form>
            </div>
          ))}
        </div>
      )}

      <h2 className="font-heading text-lg font-semibold mb-4">
        Released ({released.length})
      </h2>
      {released.length === 0 ? (
        <p className="text-brand-gray text-sm">No releases recorded yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {released.map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-brand-line bg-white p-4 text-sm"
            >
              <span>
                {p.bookings?.vendor_profiles?.business_name ?? "—"} &middot;{" "}
                {p.bookings?.service_categories?.name} &middot; ₹
                {Number(p.amount).toLocaleString("en-IN")}
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-green-50 text-green-700">
                Released
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
