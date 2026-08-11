import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { api, money } from "../lib/api";
import { useAuth } from "../lib/auth";
import { Button, Modal, Skeleton } from "../components/ui";

export default function VendorDashboard() {
  const { user, vendor, loading, refreshMe, notifications, markNotificationRead } = useAuth();
  const [data, setData] = useState<{
    overview?: {
      activeBookings: number;
      earnings: number;
      rating: number;
      walletBalance: number;
      pendingTasks: number;
    };
    bookings?: Array<{
      id: string;
      eventDate: string;
      location: string;
      status: string;
      totalAmount: number;
      customerUser?: { name: string };
      tasks?: Array<{ id: string; description: string; status: string }>;
    }>;
    vendor?: {
      bio: string;
      depositPaid: boolean;
      termsAcceptedAt?: string;
      walletBalance: number;
      planTier: string;
    };
    checklist?: Record<string, boolean>;
  } | null>(null);
  const [profile, setProfile] = useState({ bio: "", city: "", businessName: "" });
  const [refundOpen, setRefundOpen] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() {
    const [dash, me] = await Promise.all([
      api.get("/dashboard"),
      api.get("/vendors/me/profile"),
    ]);
    setData({ ...dash.data, checklist: me.data.checklist, vendor: me.data.vendor });
    setProfile({
      bio: me.data.vendor.bio ?? "",
      city: me.data.vendor.city ?? "",
      businessName: me.data.vendor.businessName ?? "",
    });
  }

  useEffect(() => {
    if (!user || user.role !== "vendor") return;
    load().catch(() => {});
  }, [user]);

  if (loading) return <div className="p-10"><Skeleton className="h-40" /></div>;
  if (!user) return <Navigate to="/login?redirect=/vendor" replace />;
  if (user.role !== "vendor") return <Navigate to="/customer" replace />;

  async function acceptTerms() {
    await api.post("/vendors/me/accept-terms");
    await load();
    await refreshMe();
  }

  async function payDeposit() {
    const intent = await api.post("/vendors/me/deposit");
    if (intent.data.alreadyPaid) {
      setMsg("Deposit already paid");
      return;
    }
    await api.post("/vendors/me/deposit/confirm", {
      paymentId: intent.data.payment.id,
    });
    setMsg("Deposit paid and held in your refundable wallet");
    await load();
    await refreshMe();
  }

  async function saveProfile() {
    await api.put("/vendors/me/profile", profile);
    setMsg("Profile saved");
    await load();
  }

  async function respond(id: string, decision: "accept" | "reject") {
    await api.post(`/vendors/me/bookings/${id}/respond`, { decision });
    await load();
  }

  async function setTask(id: string, status: string) {
    await api.patch(`/vendors/me/tasks/${id}`, { status });
    await load();
  }

  const checklist = data?.checklist;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="font-heading text-3xl font-bold mb-2">Vendor hub</h1>
      <p className="text-sm text-brand-gray mb-8">
        {vendor?.businessName ?? user.name} · Plan: {vendor?.planTier ?? "—"}
      </p>

      {msg && (
        <p className="mb-4 rounded-xl bg-green-50 text-green-800 text-sm px-4 py-3">{msg}</p>
      )}

      <div className="grid sm:grid-cols-4 gap-4 mb-8">
        {[
          ["Active jobs", data?.overview?.activeBookings ?? 0],
          ["Earnings", money(data?.overview?.earnings ?? 0)],
          ["Rating", data?.overview?.rating ?? 0],
          ["Wallet", money(data?.overview?.walletBalance ?? 0)],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-2xl border border-brand-line bg-white p-4">
            <p className="text-xs text-brand-gray">{label}</p>
            <p className="font-heading text-xl font-semibold mt-1">{value}</p>
          </div>
        ))}
      </div>

      {checklist && (
        <section className="rounded-3xl border border-brand-line bg-white p-6 mb-8">
          <h2 className="font-heading text-lg font-semibold mb-3">Onboarding checklist</h2>
          <ul className="grid sm:grid-cols-3 gap-2 text-sm mb-4">
            {Object.entries(checklist).map(([k, ok]) => (
              <li key={k} className={ok ? "text-green-700" : "text-brand-gray"}>
                {ok ? "✓" : "○"} {k}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            {!checklist.terms && (
              <Button onClick={acceptTerms}>Accept terms</Button>
            )}
            {checklist.terms && !checklist.deposit && (
              <Button onClick={payDeposit} variant="dark">
                Pay refundable deposit
              </Button>
            )}
            {checklist.deposit && (
              <Button variant="ghost" onClick={() => setRefundOpen(true)}>
                Wallet / refund info
              </Button>
            )}
          </div>
        </section>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        <section>
          <h2 className="font-heading text-lg font-semibold mb-4">Bookings & tasks</h2>
          <div className="space-y-4">
            {(data?.bookings ?? []).map((b) => (
              <div key={b.id} className="rounded-2xl border border-brand-line bg-white p-4">
                <div className="flex flex-wrap justify-between gap-2 mb-2">
                  <div>
                    <p className="font-medium text-sm">
                      {b.customerUser?.name ?? "Customer"} · {b.location}
                    </p>
                    <p className="text-xs text-brand-gray">
                      {new Date(b.eventDate).toLocaleDateString("en-IN")} · {b.status} ·{" "}
                      {money(b.totalAmount)}
                    </p>
                  </div>
                  {b.status === "awaiting_vendor" && (
                    <div className="flex gap-2">
                      <Button onClick={() => respond(b.id, "accept")}>Accept</Button>
                      <Button variant="ghost" onClick={() => respond(b.id, "reject")}>
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
                <ul className="space-y-2 mt-3">
                  {(b.tasks ?? []).map((t) => (
                    <li
                      key={t.id}
                      className="flex items-center justify-between gap-2 text-xs rounded-lg border border-brand-line px-3 py-2"
                    >
                      <span className={t.status === "completed" ? "line-through text-brand-gray" : ""}>
                        {t.description}
                      </span>
                      <select
                        className="rounded border border-brand-line px-2 py-1"
                        value={t.status}
                        onChange={(e) => setTask(t.id, e.target.value)}
                      >
                        <option value="pending">pending</option>
                        <option value="in_progress">in progress</option>
                        <option value="completed">completed</option>
                      </select>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {(data?.bookings ?? []).length === 0 && (
              <p className="text-sm text-brand-gray">No assigned bookings yet.</p>
            )}
          </div>
        </section>

        <section className="space-y-8">
          <div>
            <h2 className="font-heading text-lg font-semibold mb-4">Profile</h2>
            <div className="rounded-2xl border border-brand-line bg-white p-4 space-y-3">
              <label className="block text-xs font-medium">
                Business name
                <input
                  className="mt-1 w-full rounded-lg border border-brand-line px-3 py-2 text-sm"
                  value={profile.businessName}
                  onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                />
              </label>
              <label className="block text-xs font-medium">
                City
                <input
                  className="mt-1 w-full rounded-lg border border-brand-line px-3 py-2 text-sm"
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                />
              </label>
              <label className="block text-xs font-medium">
                Bio
                <textarea
                  className="mt-1 w-full rounded-lg border border-brand-line px-3 py-2 text-sm"
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                />
              </label>
              <Button onClick={saveProfile}>Save profile</Button>
            </div>
          </div>

          <div>
            <h2 className="font-heading text-lg font-semibold mb-4">Live notifications</h2>
            <div className="space-y-2">
              {notifications.slice(0, 8).map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => markNotificationRead(n.id)}
                  className={`w-full text-left rounded-xl border p-3 text-sm ${
                    n.read ? "border-brand-line bg-white" : "border-brand-orange/40 bg-white"
                  }`}
                >
                  <p className="font-medium text-xs uppercase tracking-wide text-brand-gold">
                    {n.type}
                  </p>
                  <p className="text-brand-gray text-xs mt-1">{n.message}</p>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Modal open={refundOpen} onClose={() => setRefundOpen(false)} title="Wallet & refunds">
        <p className="text-sm text-brand-gray mb-3">
          Your refundable security deposit stays in your Wedyora wallet while you remain an
          active partner. Request a refund from support when you leave the platform (demo
          confirmation only).
        </p>
        <p className="font-semibold mb-4">
          Current wallet: {money(data?.overview?.walletBalance ?? 0)}
        </p>
        <Button
          onClick={() => {
            setRefundOpen(false);
            setMsg("Refund request noted (demo). Ops will review.");
          }}
        >
          Confirm refund request
        </Button>
      </Modal>
    </div>
  );
}
