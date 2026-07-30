import { Banknote } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function VendorPayoutsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: payments } = await supabase
    .from("payments")
    .select("id, amount, type, payout_status, created_at, bookings!inner(vendor_id, event_date, service_categories(name))")
    .eq("bookings.vendor_id", user.id)
    .eq("status", "paid")
    .order("created_at", { ascending: false });

  const allPayments = payments ?? [];
  const pending = allPayments.filter((p) => p.payout_status === "pending");
  const released = allPayments.filter((p) => p.payout_status === "released");
  const pendingTotal = pending.reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-2xl border border-brand-line bg-white p-6 flex items-center gap-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange shrink-0">
          <Banknote className="h-5 w-5" />
        </span>
        <div>
          <p className="text-2xl font-heading font-bold">₹{pendingTotal.toLocaleString("en-IN")}</p>
          <p className="text-xs text-brand-gray">
            Pending payout — released to your bank account by our finance team on
            the usual settlement cycle.
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
    amount: number;
    type: string;
    created_at: string;
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
          {rows.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between text-sm border-b border-brand-line pb-2 last:border-0"
            >
              <span>
                {p.bookings?.service_categories?.name ?? "Booking"} &middot;{" "}
                {p.type === "advance" ? "Advance" : "Final"}
              </span>
              <span className="flex items-center gap-3">
                <span className="font-semibold">₹{Number(p.amount).toLocaleString("en-IN")}</span>
                <span className="text-xs text-brand-gray">
                  {new Date(p.created_at).toLocaleDateString("en-IN")}
                </span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
