import Link from "next/link";
import { Inbox, CalendarCheck, Wallet, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function VendorDashboardHome() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: vendorProfile } = await supabase
    .from("vendor_profiles")
    .select("status, business_name")
    .eq("id", user.id)
    .single();

  if (!vendorProfile) {
    return <p className="text-brand-gray text-sm">Vendor profile not found.</p>;
  }

  if (vendorProfile.status !== "approved") {
    return (
      <div className="rounded-2xl border border-brand-line bg-white p-8 text-center">
        <p className="font-heading text-lg font-semibold mb-2">
          {vendorProfile.status === "pending"
            ? "Your application is under review"
            : vendorProfile.status === "rejected"
              ? "Your application wasn't approved"
              : "Your account is suspended"}
        </p>
        <p className="text-brand-gray text-sm">
          {vendorProfile.status === "pending" &&
            "Once our team verifies your documents and approves your application, your full dashboard — leads, bookings, earnings — unlocks here."}
          {vendorProfile.status === "rejected" &&
            "Contact Wedyora support if you think this was a mistake."}
          {vendorProfile.status === "suspended" &&
            "Contact Wedyora support for details."}
        </p>
      </div>
    );
  }

  const [{ data: bookings }, { data: payments }] = await Promise.all([
    supabase
      .from("bookings")
      .select(
        "id, event_date, city, status, agreed_price, created_at, assigned_at, service_categories(name), profiles!bookings_customer_id_fkey(full_name)"
      )
      .eq("vendor_id", user.id)
      .order("event_date", { ascending: true }),
    supabase
      .from("payments")
      .select("id, amount, status, payout_status, created_at, bookings!inner(vendor_id)")
      .eq("bookings.vendor_id", user.id)
      .eq("status", "paid"),
  ]);

  const allBookings = bookings ?? [];
  const allPayments = payments ?? [];

  const newLeads = allBookings.filter((b) => b.status === "pending_vendor_acceptance").length;
  const upcomingEvents = allBookings.filter(
    (b) =>
      new Date(b.event_date) >= new Date(new Date().toDateString()) &&
      ["awaiting_payment", "confirmed", "in_progress"].includes(b.status)
  ).length;
  const confirmedBookings = allBookings.filter((b) =>
    ["confirmed", "in_progress", "completed"].includes(b.status)
  ).length;
  const totalEarnings = allPayments.reduce((sum, p) => sum + Number(p.amount), 0);
  const pendingPayout = allPayments
    .filter((p) => p.payout_status === "pending")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const today = new Date();
  const in7Days = new Date();
  in7Days.setDate(today.getDate() + 7);
  const next7Days = allBookings.filter((b) => {
    const d = new Date(b.event_date);
    return d >= today && d <= in7Days;
  });

  // Earnings this month vs last month (for a tiny inline bar chart — no
  // client JS or charting library needed, just server-computed SVG).
  const now = new Date();
  const thisMonthKey = `${now.getFullYear()}-${now.getMonth()}`;
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthKey = `${lastMonthDate.getFullYear()}-${lastMonthDate.getMonth()}`;
  let thisMonthTotal = 0;
  let lastMonthTotal = 0;
  for (const p of allPayments) {
    const d = new Date(p.created_at);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (key === thisMonthKey) thisMonthTotal += Number(p.amount);
    else if (key === lastMonthKey) lastMonthTotal += Number(p.amount);
  }
  const maxBar = Math.max(thisMonthTotal, lastMonthTotal, 1);

  const recentActivity = [
    ...allBookings
      .filter((b) => b.assigned_at)
      .map((b) => ({
        label: `Lead received — ${b.service_categories?.name ?? "booking"}`,
        date: b.assigned_at as string,
      })),
    ...allPayments.map((p) => ({
      label: `Payment received — ₹${p.amount}`,
      date: p.created_at,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile icon={Inbox} label="New Leads" value={newLeads} href="/vendor/dashboard/leads" />
        <StatTile icon={CalendarCheck} label="Upcoming Events" value={upcomingEvents} />
        <StatTile icon={CalendarCheck} label="Confirmed Bookings" value={confirmedBookings} />
        <StatTile
          icon={Wallet}
          label="Total Earnings"
          value={`₹${totalEarnings.toLocaleString("en-IN")}`}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-brand-line bg-white p-6">
          <h2 className="font-heading text-lg font-semibold mb-4">Calendar (Next 7 Days)</h2>
          {next7Days.length === 0 ? (
            <p className="text-brand-gray text-sm">Nothing scheduled in the next 7 days.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {next7Days.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between text-sm border-b border-brand-line pb-2 last:border-0"
                >
                  <span>
                    {b.service_categories?.name} &middot; {b.profiles?.full_name}
                  </span>
                  <span className="text-brand-gray text-xs">
                    {new Date(b.event_date).toLocaleDateString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          )}
          <Link
            href="/vendor/dashboard/calendar"
            className="text-xs font-semibold text-brand-orange mt-4 inline-block"
          >
            View Full Calendar &rarr;
          </Link>
        </div>

        <div className="rounded-2xl border border-brand-line bg-white p-6">
          <h2 className="font-heading text-lg font-semibold mb-4">Earnings Overview</h2>
          <div className="flex items-end gap-6 h-32 mb-3">
            <Bar label="Last Month" value={lastMonthTotal} max={maxBar} />
            <Bar label="This Month" value={thisMonthTotal} max={maxBar} />
          </div>
          <Link
            href="/vendor/dashboard/earnings"
            className="text-xs font-semibold text-brand-orange"
          >
            View Earnings Report &rarr;
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-brand-line bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg font-semibold">Recent Activity</h2>
          <span className="text-xs text-brand-gray">
            Pending Payout: <strong>₹{pendingPayout.toLocaleString("en-IN")}</strong>
          </span>
        </div>
        {recentActivity.length === 0 ? (
          <p className="text-brand-gray text-sm">No activity yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <Clock className="h-4 w-4 text-brand-gray shrink-0" />
                <span>{a.label}</span>
                <span className="text-xs text-brand-gray ml-auto">
                  {new Date(a.date).toLocaleDateString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  href?: string;
}) {
  const content = (
    <div className="rounded-2xl border border-brand-line bg-white p-5 hover:border-brand-orange hover:shadow-sm transition-all">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange mb-3">
        <Icon className="h-4 w-4" />
      </span>
      <p className="text-2xl font-heading font-bold">{value}</p>
      <p className="text-xs text-brand-gray">{label}</p>
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

function Bar({ label, value, max }: { label: string; value: number; max: number }) {
  const heightPct = Math.max((value / max) * 100, 2);
  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      <div className="w-full h-24 flex items-end bg-brand-cream rounded-lg overflow-hidden">
        <div
          className="w-full bg-brand-orange rounded-t-lg transition-all"
          style={{ height: `${heightPct}%` }}
        />
      </div>
      <p className="text-xs text-brand-gray">{label}</p>
      <p className="text-xs font-semibold">₹{value.toLocaleString("en-IN")}</p>
    </div>
  );
}
