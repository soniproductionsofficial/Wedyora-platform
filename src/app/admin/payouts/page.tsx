import { createClient } from "@/lib/supabase/server";
import { releasePayoutMilestoneAction, markVendorPaymentResolvedAction } from "@/lib/actions/admin";
import { labelForMilestone } from "@/lib/payout-milestones";

export default async function AdminPayoutsPage() {
  const supabase = await createClient();

  const [{ data: milestones }, { data: ledgerRows }] = await Promise.all([
    supabase
      .from("payout_milestones")
      .select(
        "id, milestone, sort_order, percentage, amount, status, released_at, bookings(event_date, service_categories(name), vendor_profiles(business_name))"
      )
      .order("sort_order", { ascending: true }),
    supabase
      .from("vendor_payments")
      .select("id, type, direction, amount, status, reason, created_at, vendor_profiles(business_name)")
      .order("created_at", { ascending: false }),
  ]);

  const allMilestones = milestones ?? [];
  const pendingMilestones = allMilestones.filter((m) => m.status === "pending");
  const releasedMilestones = allMilestones.filter((m) => m.status === "released");
  const pendingTotal = pendingMilestones.reduce((sum, m) => sum + Number(m.amount), 0);

  const allLedger = ledgerRows ?? [];
  const pendingLedger = allLedger.filter((r) => r.status === "pending");
  const resolvedLedger = allLedger.filter((r) => r.status !== "pending");

  return (
    <div className="flex flex-col gap-12">
      <div>
        <p className="text-brand-gray text-sm mb-6">
          Every booking&rsquo;s vendor payout is split into 5 stages (Vendor
          Payment Timeline): 20% on booking confirmation, 30% once the
          wedding is completed, 20% on raw files uploaded, 20% on quality
          check approved, and the final 10% on customer delivery. Release
          each stage once it&rsquo;s actually been paid out — this is a
          manual ledger flag, not an automated bank transfer.
        </p>

        <div className="rounded-2xl border border-brand-line bg-white p-6 mb-6">
          <p className="text-2xl font-heading font-bold">
            ₹{pendingTotal.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-brand-gray">Total pending payout across all vendors</p>
        </div>

        <h2 className="font-heading text-lg font-semibold mb-4">
          Pending Milestones ({pendingMilestones.length})
        </h2>
        {pendingMilestones.length === 0 ? (
          <p className="text-brand-gray text-sm mb-8">Nothing pending right now.</p>
        ) : (
          <div className="flex flex-col gap-2 mb-8">
            {pendingMilestones.map((m) => (
              <div
                key={m.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-brand-line bg-white p-4 text-sm"
              >
                <span>
                  {m.bookings?.vendor_profiles?.business_name ?? "—"} &middot;{" "}
                  {m.bookings?.service_categories?.name} &middot;{" "}
                  {labelForMilestone(m.milestone)} ({m.percentage}%) &middot; ₹
                  {Number(m.amount).toLocaleString("en-IN")}
                </span>
                <form action={releasePayoutMilestoneAction}>
                  <input type="hidden" name="milestone_id" value={m.id} />
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-full bg-brand-orange text-white text-xs font-semibold hover:bg-brand-orange-dark"
                  >
                    Release
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}

        <h2 className="font-heading text-lg font-semibold mb-4">
          Released ({releasedMilestones.length})
        </h2>
        {releasedMilestones.length === 0 ? (
          <p className="text-brand-gray text-sm">No releases recorded yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {releasedMilestones.map((m) => (
              <div
                key={m.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-brand-line bg-white p-4 text-sm"
              >
                <span>
                  {m.bookings?.vendor_profiles?.business_name ?? "—"} &middot;{" "}
                  {labelForMilestone(m.milestone)} &middot; ₹
                  {Number(m.amount).toLocaleString("en-IN")}
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-green-50 text-green-700">
                  Released {m.released_at && new Date(m.released_at).toLocaleDateString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-heading text-lg font-semibold mb-1">Vendor Ledger</h2>
        <p className="text-brand-gray text-sm mb-6">
          Registration fees, security deposits, annual renewals, performance
          bonuses, and penalties — everything besides booking payouts that
          moves money between Wedyora and a vendor.
        </p>

        <h3 className="text-sm font-semibold mb-3">Pending ({pendingLedger.length})</h3>
        {pendingLedger.length === 0 ? (
          <p className="text-brand-gray text-sm mb-8">Nothing pending.</p>
        ) : (
          <div className="flex flex-col gap-2 mb-8">
            {pendingLedger.map((r) => (
              <div
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-brand-line bg-white p-4 text-sm"
              >
                <span>
                  {r.vendor_profiles?.business_name ?? "—"} &middot; {r.reason ?? r.type} &middot;{" "}
                  <span className={r.direction === "credit" ? "text-green-700" : "text-brand-orange-dark"}>
                    {r.direction === "credit" ? "+" : "−"}₹{Number(r.amount).toLocaleString("en-IN")}
                  </span>
                </span>
                <div className="flex gap-2">
                  <form action={markVendorPaymentResolvedAction}>
                    <input type="hidden" name="payment_id" value={r.id} />
                    <input type="hidden" name="status" value="paid" />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-full bg-brand-orange text-white text-xs font-semibold hover:bg-brand-orange-dark"
                    >
                      Mark Paid
                    </button>
                  </form>
                  <form action={markVendorPaymentResolvedAction}>
                    <input type="hidden" name="payment_id" value={r.id} />
                    <input type="hidden" name="status" value="waived" />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-full border border-brand-line text-xs font-semibold hover:bg-brand-cream"
                    >
                      Waive
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}

        <h3 className="text-sm font-semibold mb-3">Resolved ({resolvedLedger.length})</h3>
        {resolvedLedger.length === 0 ? (
          <p className="text-brand-gray text-sm">Nothing resolved yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {resolvedLedger.slice(0, 20).map((r) => (
              <div
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-brand-line bg-white p-4 text-sm"
              >
                <span>
                  {r.vendor_profiles?.business_name ?? "—"} &middot; {r.reason ?? r.type} &middot;{" "}
                  <span className={r.direction === "credit" ? "text-green-700" : "text-brand-orange-dark"}>
                    {r.direction === "credit" ? "+" : "−"}₹{Number(r.amount).toLocaleString("en-IN")}
                  </span>
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-brand-cream border border-brand-line capitalize">
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
