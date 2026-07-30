import { Wallet } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { labelForMilestone } from "@/lib/payout-milestones";

export default async function VendorEarningsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: milestones } = await supabase
    .from("payout_milestones")
    .select(
      "id, milestone, percentage, amount, status, created_at, released_at, bookings!inner(vendor_id, event_date, service_categories(name))"
    )
    .eq("bookings.vendor_id", user.id)
    .order("created_at", { ascending: false });

  const allMilestones = milestones ?? [];
  const totalEarnings = allMilestones.reduce((sum, m) => sum + Number(m.amount), 0);
  const totalReleased = allMilestones
    .filter((m) => m.status === "released")
    .reduce((sum, m) => sum + Number(m.amount), 0);
  const totalPending = totalEarnings - totalReleased;

  // Last 6 months, oldest to newest, computed without Date.now() tricks
  // that would break — just plain new Date() (fine here, this is a
  // request-time render, not a workflow script).
  const now = new Date();
  const months: { key: string; label: string; total: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleDateString("en-IN", { month: "short" }),
      total: 0,
    });
  }
  for (const m of allMilestones) {
    const d = new Date(m.created_at);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const bucket = months.find((b) => b.key === key);
    if (bucket) bucket.total += Number(m.amount);
  }
  const maxBar = Math.max(...months.map((m) => m.total), 1);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid sm:grid-cols-3 gap-4">
        <SummaryTile label="Total Earnings" value={totalEarnings} />
        <SummaryTile label="Released to You" value={totalReleased} />
        <SummaryTile label="Pending Payout" value={totalPending} />
      </div>

      <div className="rounded-2xl border border-brand-line bg-white p-6">
        <h2 className="font-heading text-lg font-semibold mb-6">Last 6 Months</h2>
        <div className="flex items-end gap-4 h-40">
          {months.map((m) => (
            <div key={m.key} className="flex flex-col items-center gap-2 flex-1">
              <div className="w-full h-28 flex items-end bg-brand-cream rounded-lg overflow-hidden">
                <div
                  className="w-full bg-brand-orange rounded-t-lg transition-all"
                  style={{ height: `${Math.max((m.total / maxBar) * 100, m.total > 0 ? 4 : 0)}%` }}
                />
              </div>
              <p className="text-xs text-brand-gray">{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-brand-line bg-white p-6">
        <h2 className="font-heading text-lg font-semibold mb-4">Payout History</h2>
        {allMilestones.length === 0 ? (
          <p className="text-brand-gray text-sm">No earnings recorded yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {allMilestones.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between text-sm border-b border-brand-line pb-2 last:border-0"
              >
                <span>
                  {m.bookings?.service_categories?.name ?? "Booking"} &middot;{" "}
                  {labelForMilestone(m.milestone)} ({m.percentage}%)
                </span>
                <span className="flex items-center gap-3">
                  <span className="font-semibold">₹{Number(m.amount).toLocaleString("en-IN")}</span>
                  <span className="text-xs text-brand-gray capitalize">{m.status}</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-brand-line bg-white p-5">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange mb-3">
        <Wallet className="h-4 w-4" />
      </span>
      <p className="text-2xl font-heading font-bold">₹{value.toLocaleString("en-IN")}</p>
      <p className="text-xs text-brand-gray">{label}</p>
    </div>
  );
}
