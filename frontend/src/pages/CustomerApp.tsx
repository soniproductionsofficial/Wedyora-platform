import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { api, EVENT_TYPES, SERVICE_TYPES, formatINR, type ApiError } from "../lib/api";
import { useAuth } from "../lib/auth";
import { Alert, DashboardShell, EmptyState, Spinner } from "../components/ui";
import { PaymentPanel } from "../components/PaymentPanel";

interface VendorItem {
  _id: string;
  businessName: string;
  services: string[];
  city?: string;
  bio?: string;
  pricing: { startingPrice: number; currency: string };
  profilePhoto?: string;
  portfolioPhotos?: string[];
}

interface Assignment {
  _id: string;
  status: string;
  paymentStatus: string;
  agreedPrice?: number;
  serviceCategory?: string;
  eventDate?: string;
  matchScore?: number;
  matchReasons?: string[];
  notes?: string;
  vendorId?: VendorItem | string;
}

interface Message {
  _id: string;
  subject: string;
  body: string;
  senderLabel: string;
  read: boolean;
  createdAt: string;
}

interface CustomerDash {
  role: "customer";
  summary: {
    eventType: string;
    eventDate?: string;
    city?: string;
    activeAssignments: number;
    unreadMessages: number;
  };
  customer: {
    _id: string;
    eventType: string;
    eventDate?: string;
    location?: { city?: string };
    preferences?: {
      budgetMin?: number;
      budgetMax?: number;
      preferredServices?: string[];
    };
  };
  assignments: Assignment[];
  messages: Message[];
  mockPayments?: boolean;
}

const nav = [
  { to: "/customer", label: "Overview" },
  { to: "/customer/search", label: "Find vendors" },
  { to: "/customer/match", label: "Auto-match" },
  { to: "/customer/payments", label: "Payments" },
  { to: "/customer/messages", label: "Messages" },
];

export function CustomerApp() {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "customer") return <Navigate to="/vendor" replace />;

  return (
    <Routes>
      <Route index element={<CustomerOverview />} />
      <Route path="search" element={<CustomerSearch />} />
      <Route path="match" element={<CustomerMatch />} />
      <Route path="payments" element={<CustomerPayments />} />
      <Route path="messages" element={<MessagesPage />} />
    </Routes>
  );
}

function useCustomerDash() {
  const [data, setData] = useState<CustomerDash | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const dash = await api.request<CustomerDash>("/api/dashboard");
      setData(dash);
      setError(null);
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { data, error, loading, reload };
}

function CustomerOverview() {
  const { data, error, loading, reload } = useCustomerDash();

  return (
    <DashboardShell
      title="Your wedding desk"
      subtitle="Search vendors, get matched, and pay Wedyora when you’re ready."
      nav={nav}
    >
      {loading && <Spinner />}
      {error && <Alert tone="error">{error}</Alert>}
      {data && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="panel animate-fade-up p-5 lg:col-span-2">
            <h2 className="font-display text-2xl text-brand-purple">Assigned vendors</h2>
            <p className="mt-1 text-sm text-brand-muted">
              {data.summary.eventType}
              {data.summary.city ? ` · ${data.summary.city}` : ""}
              {data.summary.eventDate
                ? ` · ${new Date(data.summary.eventDate).toLocaleDateString()}`
                : ""}
            </p>
            <div className="mt-5 space-y-4">
              {data.assignments.length === 0 && (
                <EmptyState>
                  No assignments yet. Use Find vendors or Auto-match to get started.
                </EmptyState>
              )}
              {data.assignments.map((a) => {
                const vendor =
                  typeof a.vendorId === "object" && a.vendorId
                    ? a.vendorId
                    : null;
                return (
                  <div
                    key={a._id}
                    className="rounded-xl border border-brand-line p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-brand-purple">
                          {vendor?.businessName ?? "Vendor"}
                        </p>
                        <p className="text-sm text-brand-muted">
                          {a.serviceCategory} · {a.status} · payment {a.paymentStatus}
                        </p>
                        {a.matchScore !== undefined && (
                          <p className="mt-1 text-xs text-brand-gold">
                            Match score {a.matchScore}
                            {a.matchReasons?.length
                              ? ` — ${a.matchReasons.join(", ")}`
                              : ""}
                          </p>
                        )}
                      </div>
                      <p className="font-medium">
                        {a.agreedPrice != null ? formatINR(a.agreedPrice) : "—"}
                      </p>
                    </div>
                    {a.paymentStatus !== "paid" && (
                      <div className="mt-4">
                        <PaymentPanel
                          kind="customer_assignment"
                          assignmentId={a._id}
                          amountHint={
                            a.agreedPrice != null
                              ? `Amount due: ${formatINR(a.agreedPrice)}`
                              : undefined
                          }
                          onPaid={() => void reload()}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="space-y-4">
            <div className="panel animate-fade-up p-5">
              <p className="text-xs uppercase tracking-wider text-brand-muted">Active</p>
              <p className="font-display text-4xl text-brand-purple">
                {data.summary.activeAssignments}
              </p>
            </div>
            <div className="panel animate-fade-up-delay p-5">
              <p className="text-xs uppercase tracking-wider text-brand-muted">Unread</p>
              <p className="font-display text-4xl text-brand-purple">
                {data.summary.unreadMessages}
              </p>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

function CustomerSearch() {
  const [city, setCity] = useState("Mumbai");
  const [eventType, setEventType] = useState("Wedding");
  const [service, setService] = useState("Photographer");
  const [items, setItems] = useState<VendorItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function search(e?: FormEvent) {
    e?.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const data = await api.request<{ items: VendorItem[] }>(
        "/api/customer/search-vendors",
        {
          method: "POST",
          body: JSON.stringify({
            city,
            eventType,
            services: service ? [service] : undefined,
          }),
        }
      );
      setItems(data.items);
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    void search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardShell
      title="Find vendors"
      subtitle="Filter by event type, service, and city."
      nav={nav}
    >
      <form onSubmit={search} className="panel mb-6 grid gap-3 p-5 md:grid-cols-4">
        <label className="text-sm">
          <span className="mb-1 block text-brand-muted">City</span>
          <input className="input" value={city} onChange={(e) => setCity(e.target.value)} />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-brand-muted">Event type</span>
          <select className="input" value={eventType} onChange={(e) => setEventType(e.target.value)}>
            {EVENT_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-brand-muted">Service</span>
          <select className="input" value={service} onChange={(e) => setService(e.target.value)}>
            {SERVICE_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <div className="flex items-end">
          <button type="submit" disabled={busy} className="btn-gold w-full rounded-xl py-2.5">
            {busy ? "Searching…" : "Search"}
          </button>
        </div>
      </form>
      {error && <Alert tone="error">{error}</Alert>}
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((v) => (
          <article key={v._id} className="panel overflow-hidden">
            {v.profilePhoto && (
              <img
                src={v.profilePhoto}
                alt=""
                className="h-40 w-full object-cover"
              />
            )}
            <div className="p-5">
              <h3 className="font-display text-2xl text-brand-purple">{v.businessName}</h3>
              <p className="text-sm text-brand-muted">
                {v.city} · {v.services.join(", ")}
              </p>
              <p className="mt-2 text-sm">{v.bio}</p>
              <p className="mt-3 font-medium">{formatINR(v.pricing.startingPrice)}+</p>
            </div>
          </article>
        ))}
        {!busy && items.length === 0 && (
          <EmptyState>No listed vendors match these filters yet.</EmptyState>
        )}
      </div>
    </DashboardShell>
  );
}

function CustomerMatch() {
  const [city, setCity] = useState("Mumbai");
  const [eventType, setEventType] = useState("Wedding");
  const [service, setService] = useState("Photographer");
  const [result, setResult] = useState<{
    assignment: Assignment | null;
    matches: { vendor: VendorItem; score: number; reasons: string[] }[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function runMatch(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const data = await api.request<{
        assignment: Assignment | null;
        matches: { vendor: VendorItem; score: number; reasons: string[] }[];
      }>("/api/customer/match", {
        method: "POST",
        body: JSON.stringify({
          city,
          eventType,
          services: [service],
          serviceCategory: service,
          autoAssign: true,
        }),
      });
      setResult(data);
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <DashboardShell
      title="Auto-match"
      subtitle="We score vendors on location, services, availability, and budget, then assign the best fit."
      nav={nav}
    >
      <form onSubmit={runMatch} className="panel mb-6 grid gap-3 p-5 md:grid-cols-4">
        <label className="text-sm">
          <span className="mb-1 block text-brand-muted">City</span>
          <input className="input" value={city} onChange={(e) => setCity(e.target.value)} />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-brand-muted">Event</span>
          <select className="input" value={eventType} onChange={(e) => setEventType(e.target.value)}>
            {EVENT_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-brand-muted">Service</span>
          <select className="input" value={service} onChange={(e) => setService(e.target.value)}>
            {SERVICE_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <div className="flex items-end">
          <button type="submit" disabled={busy} className="btn-gold w-full rounded-xl py-2.5">
            {busy ? "Matching…" : "Match me"}
          </button>
        </div>
      </form>
      {error && <Alert tone="error">{error}</Alert>}
      {result?.assignment && (
        <Alert tone="success">
          Matched and assigned. Open Overview to review and pay.
        </Alert>
      )}
      {result && (
        <div className="mt-6 space-y-3">
          {result.matches.map((m) => (
            <div key={m.vendor._id} className="panel flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-medium text-brand-purple">{m.vendor.businessName}</p>
                <p className="text-sm text-brand-muted">{m.reasons.join(" · ")}</p>
              </div>
              <p className="font-display text-2xl text-brand-gold">Score {m.score}</p>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}

function CustomerPayments() {
  const { data, loading, error, reload } = useCustomerDash();
  const unpaid = data?.assignments.filter((a) => a.paymentStatus !== "paid") ?? [];

  return (
    <DashboardShell
      title="Payment portal"
      subtitle="Pay Wedyora for assigned vendor services."
      nav={nav}
    >
      {loading && <Spinner />}
      {error && <Alert tone="error">{error}</Alert>}
      <div className="space-y-4">
        {unpaid.map((a) => (
          <PaymentPanel
            key={a._id}
            kind="customer_assignment"
            assignmentId={a._id}
            amountHint={
              a.agreedPrice != null
                ? `${a.serviceCategory ?? "Service"} — ${formatINR(a.agreedPrice)}`
                : undefined
            }
            onPaid={() => void reload()}
          />
        ))}
        {!loading && unpaid.length === 0 && (
          <EmptyState>No outstanding payments.</EmptyState>
        )}
      </div>
    </DashboardShell>
  );
}

export function MessagesPage({ vendor = false }: { vendor?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const shellNav = vendor
    ? [
        { to: "/vendor", label: "Overview" },
        { to: "/vendor/profile", label: "Profile" },
        { to: "/vendor/onboarding", label: "Onboarding" },
        { to: "/vendor/customers", label: "Customers" },
        { to: "/vendor/messages", label: "Messages" },
      ]
    : nav;

  useEffect(() => {
    api
      .request<{ messages: Message[] }>("/api/messages")
      .then((d) => setMessages(d.messages))
      .catch((err) => setError((err as ApiError).message));
  }, []);

  async function markRead(id: string) {
    await api.request(`/api/messages/${id}/read`, { method: "POST" });
    setMessages((prev) =>
      prev.map((m) => (m._id === id ? { ...m, read: true } : m))
    );
  }

  return (
    <DashboardShell
      title="Messages"
      subtitle="Notes from customers, vendors, and the Wedyora platform."
      nav={shellNav}
    >
      {error && <Alert tone="error">{error}</Alert>}
      <div className="space-y-3">
        {messages.map((m) => (
          <button
            key={m._id}
            type="button"
            onClick={() => void markRead(m._id)}
            className={`panel w-full p-4 text-left transition hover:border-brand-purple/30 ${
              m.read ? "opacity-80" : "border-brand-gold/40"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-brand-purple">{m.subject}</p>
                <p className="text-xs text-brand-muted">
                  {m.senderLabel} · {new Date(m.createdAt).toLocaleString()}
                </p>
                <p className="mt-2 text-sm">{m.body}</p>
              </div>
              {!m.read && (
                <span className="rounded-full bg-brand-gold-bright px-2 py-0.5 text-xs font-medium text-brand-purple-deep">
                  New
                </span>
              )}
            </div>
          </button>
        ))}
        {messages.length === 0 && <EmptyState>No messages yet.</EmptyState>}
      </div>
    </DashboardShell>
  );
}
