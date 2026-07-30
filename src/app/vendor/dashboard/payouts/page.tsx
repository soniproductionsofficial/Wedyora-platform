import { Banknote } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { labelForMilestone } from "@/lib/payout-milestones";

export default async function VendorPayoutsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: milestones } = await supabase
    .from("payout_milestones")
    .select(
      "id, milestone, percentage, amount, status, released_at, bookings!inner(vendor_id, event_date, service_categories(name))"
    )
    .eq("bookings.vendor_id", user.id)
    .order("released_at", { ascending: false });

  const allMilestones = milestones ?? [];
  const pending = allMilestones.filter((m) => m.status === "pending");
  const released = allMilestones.filter((m) => m.status === "released");
  const pendingTotal = pending.reduce((sum, m) => sum + Number(m.amount), 0);

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-2xl border border-brand-line bg-white p-6 flex items-center gap-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange shrink-0">
          <Banknote className="h-5 w-5" />
        </span>
        <div>
          <p className="text-2xl font-heading font-bold">₹{pendingTotal.toLocaleString("en-IN")}</p>
          <p className="text-xs text-brand-gray">
            Pending payout — released in 5 stages as each booking&rsquo;s
            milestones (confirmation, wedding day, files, quality check,
            delivery) are reached.
          </p>
        </div>
      </div>

      <PayoutTable title="Pending" rows={pending} />
      <PayoutTable title="Released" rows={released} />
    </div>
  );
}

function PayoutTable({
  title,
  rows,
}: {
  title: string;
  rows: {
    id: string;
    milestone: string;
    percentage: number;
    amount: number;
    released_at: string | null;
    bookings?: { event_date: string; service_categories?: { name: string } | null } | null;
  }[];
}) {
  return (
    <div className="rounded-2xl border border-brand-line bg-white p-6">
      <h2 className="font-heading text-lg font-semibold mb-4">{title}</h2>
      {rows.length === 0 ? (
        <p className="text-brand-gray text-sm">Nothing here yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {rows.map((m) => (
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
                {m.released_at && (
                  <span className="text-xs text-brand-gray">
                    {new Date(m.released_at).toLocaleDateString("en-IN")}
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
