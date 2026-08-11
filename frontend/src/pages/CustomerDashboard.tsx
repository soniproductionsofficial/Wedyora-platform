import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { api, money } from "../lib/api";
import { useAuth } from "../lib/auth";
import { Button, Skeleton } from "../components/ui";

export default function CustomerDashboard() {
  const { user, loading, notifications, markNotificationRead } = useAuth();
  const [data, setData] = useState<{
    overview?: { upcoming: number; totalSpent: number; bookingsCount: number };
    bookings?: Array<{
      id: string;
      eventDate: string;
      location: string;
      status: string;
      totalAmount: number;
      vendor?: { businessName: string };
    }>;
    payments?: Array<{ id: string; amount: number; type: string; status: string; createdAt: string }>;
  } | null>(null);

  useEffect(() => {
    if (!user || user.role !== "customer") return;
    api.get("/dashboard").then((r) => setData(r.data));
  }, [user]);

  if (loading) return <div className="p-10"><Skeleton className="h-40" /></div>;
  if (!user) return <Navigate to="/login?redirect=/customer" replace />;
  if (user.role !== "customer") return <Navigate to="/vendor" replace />;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold">Customer dashboard</h1>
          <p className="text-sm text-brand-gray">Welcome back, {user.name}</p>
        </div>
        <Link to="/book">
          <Button>New booking</Button>
        </Link>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          ["Upcoming", data?.overview?.upcoming ?? "—"],
          ["Bookings", data?.overview?.bookingsCount ?? "—"],
          ["Total spent", data?.overview ? money(data.overview.totalSpent) : "—"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-brand-line bg-white p-5">
            <p className="text-xs text-brand-gray">{label}</p>
            <p className="font-heading text-2xl font-semibold mt-1">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section>
          <h2 className="font-heading text-lg font-semibold mb-4">Bookings</h2>
          <div className="space-y-3">
            {(data?.bookings ?? []).map((b) => (
              <div key={b.id} className="rounded-2xl border border-brand-line bg-white p-4 text-sm">
                <p className="font-medium">
                  {b.vendor?.businessName ?? "Matching…"} · {b.location}
                </p>
                <p className="text-xs text-brand-gray mt-1">
                  {new Date(b.eventDate).toLocaleDateString("en-IN")} · {b.status} ·{" "}
                  {money(b.totalAmount)}
                </p>
              </div>
            ))}
            {(data?.bookings ?? []).length === 0 && (
              <p className="text-sm text-brand-gray">No bookings yet.</p>
            )}
          </div>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold mb-4">Notifications</h2>
          <div className="space-y-3 mb-8">
            {notifications.slice(0, 8).map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => markNotificationRead(n.id)}
                className={`w-full text-left rounded-2xl border p-4 text-sm ${
                  n.read ? "border-brand-line bg-white" : "border-brand-orange/40 bg-white"
                }`}
              >
                <p className="font-medium">{n.type}</p>
                <p className="text-brand-gray text-xs mt-1">{n.message}</p>
              </button>
            ))}
            {notifications.length === 0 && (
              <p className="text-sm text-brand-gray">No notifications yet.</p>
            )}
          </div>

          <h2 className="font-heading text-lg font-semibold mb-4">Payments</h2>
          <div className="space-y-2">
            {(data?.payments ?? []).map((p) => (
              <div
                key={p.id}
                className="rounded-xl border border-brand-line bg-white px-4 py-3 text-sm flex justify-between"
              >
                <span>
                  {p.type} · {p.status}
                </span>
                <span className="font-medium">{money(p.amount)}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
