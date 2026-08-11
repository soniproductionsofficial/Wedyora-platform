import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api, money } from "../lib/api";
import { useAuth } from "../lib/auth";
import { Button, Modal } from "../components/ui";

interface Match {
  vendor: {
    id: string;
    businessName: string;
    city: string;
    category: string;
    rating: number;
    priceMin: number;
  };
  score: { overall: number };
}

export default function BookPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [matches, setMatches] = useState<Match[]>([]);
  const [vendorId, setVendorId] = useState(params.get("vendorId") ?? "");
  const [error, setError] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    eventDate: "",
    location: "",
    eventType: "Wedding",
    category: params.get("category") ?? "Photography",
    budgetMin: "40000",
    budgetMax: "150000",
    serviceName: "Full Day Coverage",
    servicePrice: "95000",
    quantity: "1",
    notes: "",
  });

  useEffect(() => {
    if (!user) return;
    api
      .post("/customers/match", {
        category: form.category,
        city: form.location || undefined,
        eventDate: form.eventDate || undefined,
        budgetMin: Number(form.budgetMin) || undefined,
        budgetMax: Number(form.budgetMax) || undefined,
      })
      .then((r) => setMatches(r.data.matches ?? []))
      .catch(() => {});
  }, [user, form.category, form.location, form.eventDate, form.budgetMin, form.budgetMax]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) {
      navigate("/login?redirect=/book");
      return;
    }
    if (user.role !== "customer") {
      setError("Please sign in with a customer account to book.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/customers/bookings", {
        eventDate: form.eventDate,
        location: form.location,
        eventType: form.eventType,
        category: form.category,
        vendorId: vendorId || undefined,
        autoMatch: !vendorId,
        budgetMin: Number(form.budgetMin),
        budgetMax: Number(form.budgetMax),
        notes: form.notes,
        services: [
          {
            name: form.serviceName,
            quantity: Number(form.quantity) || 1,
            price: Number(form.servicePrice) || 0,
          },
        ],
      });
      setBookingId(data.booking.id);
      setSuccessOpen(true);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        "Booking failed";
      setError(typeof msg === "string" ? msg : "Booking failed");
    } finally {
      setLoading(false);
    }
  }

  async function payNow() {
    try {
      const intent = await api.post(`/customers/bookings/${bookingId}/pay`);
      await api.post(`/customers/bookings/${bookingId}/pay/confirm`, {
        paymentId: intent.data.payment.id,
      });
      setSuccessOpen(false);
      setPaymentOpen(true);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        "Payment failed";
      setError(typeof msg === "string" ? msg : "Payment failed");
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="font-heading text-3xl font-bold mb-2">Book your event</h1>
      <p className="text-sm text-brand-gray mb-8">
        We&apos;ll check availability and surface the best vendor matches in real time.
      </p>

      <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-brand-line bg-white p-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="text-xs font-medium">
            Event date
            <input
              required
              type="date"
              className="mt-1 w-full rounded-lg border border-brand-line px-3 py-2 text-sm"
              value={form.eventDate}
              onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
            />
          </label>
          <label className="text-xs font-medium">
            Location / city
            <input
              required
              className="mt-1 w-full rounded-lg border border-brand-line px-3 py-2 text-sm"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </label>
          <label className="text-xs font-medium">
            Event type
            <select
              className="mt-1 w-full rounded-lg border border-brand-line px-3 py-2 text-sm"
              value={form.eventType}
              onChange={(e) => setForm({ ...form, eventType: e.target.value })}
            >
              {["Wedding", "Engagement", "Reception", "Mehendi"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="text-xs font-medium">
            Service category
            <select
              className="mt-1 w-full rounded-lg border border-brand-line px-3 py-2 text-sm"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {["Photography", "Catering", "Decoration", "Makeup", "Entertainment"].map(
                (c) => (
                  <option key={c}>{c}</option>
                )
              )}
            </select>
          </label>
          <label className="text-xs font-medium">
            Budget min (₹)
            <input
              type="number"
              className="mt-1 w-full rounded-lg border border-brand-line px-3 py-2 text-sm"
              value={form.budgetMin}
              onChange={(e) => setForm({ ...form, budgetMin: e.target.value })}
            />
          </label>
          <label className="text-xs font-medium">
            Budget max (₹)
            <input
              type="number"
              className="mt-1 w-full rounded-lg border border-brand-line px-3 py-2 text-sm"
              value={form.budgetMax}
              onChange={(e) => setForm({ ...form, budgetMax: e.target.value })}
            />
          </label>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <label className="text-xs font-medium sm:col-span-1">
            Service
            <input
              className="mt-1 w-full rounded-lg border border-brand-line px-3 py-2 text-sm"
              value={form.serviceName}
              onChange={(e) => setForm({ ...form, serviceName: e.target.value })}
            />
          </label>
          <label className="text-xs font-medium">
            Qty
            <input
              type="number"
              min={1}
              className="mt-1 w-full rounded-lg border border-brand-line px-3 py-2 text-sm"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            />
          </label>
          <label className="text-xs font-medium">
            Price (₹)
            <input
              type="number"
              className="mt-1 w-full rounded-lg border border-brand-line px-3 py-2 text-sm"
              value={form.servicePrice}
              onChange={(e) => setForm({ ...form, servicePrice: e.target.value })}
            />
          </label>
        </div>

        {matches.length > 0 && (
          <div>
            <p className="text-xs font-medium mb-2">Best matches</p>
            <div className="space-y-2">
              {matches.slice(0, 5).map((m) => (
                <label
                  key={m.vendor.id}
                  className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-sm cursor-pointer ${
                    vendorId === m.vendor.id
                      ? "border-brand-orange bg-brand-cream"
                      : "border-brand-line"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="vendorId"
                      checked={vendorId === m.vendor.id}
                      onChange={() => setVendorId(m.vendor.id)}
                    />
                    <span>
                      {m.vendor.businessName} · {m.vendor.city} · from{" "}
                      {money(m.vendor.priceMin)}
                    </span>
                  </span>
                  <span className="text-xs font-semibold text-brand-orange">
                    {m.score.overall}/100
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        <label className="block text-xs font-medium">
          Notes
          <textarea
            className="mt-1 w-full rounded-lg border border-brand-line px-3 py-2 text-sm"
            rows={3}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={loading} variant="dark">
          {loading ? "Submitting…" : "Request booking"}
        </Button>
      </form>

      <Modal open={successOpen} onClose={() => setSuccessOpen(false)} title="Booking created">
        <p className="text-sm text-brand-gray mb-4">
          Your request is in. The vendor was notified in real time. Pay now to lock it in
          (mock payment in demo mode).
        </p>
        <div className="flex gap-3">
          <Button onClick={payNow}>Pay now</Button>
          <Button variant="ghost" onClick={() => navigate("/customer")}>
            Go to dashboard
          </Button>
        </div>
      </Modal>

      <Modal open={paymentOpen} onClose={() => navigate("/customer")} title="Payment successful">
        <p className="text-sm text-brand-gray mb-4">
          Payment confirmed. Track tasks and messages from your customer dashboard.
        </p>
        <Button onClick={() => navigate("/customer")}>Open dashboard</Button>
      </Modal>
    </div>
  );
}
