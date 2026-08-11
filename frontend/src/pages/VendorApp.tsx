import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { api, EVENT_TYPES, SERVICE_TYPES, formatMoney, type ApiError } from "../lib/api";
import { useAuth } from "../lib/auth";
import { Alert, DashboardShell, EmptyState, Spinner } from "../components/ui";
import { PaymentPanel } from "../components/PaymentPanel";
import { MessagesPage } from "./CustomerApp";

interface VendorProfile {
  _id: string;
  businessName: string;
  services: string[];
  eventTypes?: string[];
  city?: string;
  bio?: string;
  profilePhoto?: string;
  portfolioPhotos?: string[];
  pricing: {
    startingPrice: number;
    currency: string;
    packages?: { title: string; description?: string; price: number }[];
  };
  availabilityDates?: string[];
  depositStatus: string;
  termsAccepted: boolean;
  isListed: boolean;
}

interface Assignment {
  _id: string;
  status: string;
  paymentStatus: string;
  serviceCategory?: string;
  agreedPrice?: number;
  eventDate?: string;
  customerId?: {
    eventType?: string;
    location?: { city?: string };
    userId?: { fullName?: string; email?: string; phone?: string };
  };
}

interface VendorDash {
  role: "vendor";
  summary: {
    depositStatus: string;
    depositRequired: number;
    currency: string;
    termsAccepted: boolean;
    isListed: boolean;
    openAssignments: number;
    unreadMessages: number;
  };
  vendor: VendorProfile;
  assignments: Assignment[];
}

const nav = [
  { to: "/vendor", label: "Overview" },
  { to: "/vendor/profile", label: "Profile" },
  { to: "/vendor/onboarding", label: "Onboarding" },
  { to: "/vendor/customers", label: "Customers" },
  { to: "/vendor/messages", label: "Messages" },
];

export function VendorApp() {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "vendor") return <Navigate to="/customer" replace />;

  return (
    <Routes>
      <Route index element={<VendorOverview />} />
      <Route path="profile" element={<VendorProfilePage />} />
      <Route path="onboarding" element={<VendorOnboarding />} />
      <Route path="customers" element={<VendorCustomers />} />
      <Route path="messages" element={<MessagesPage vendor />} />
    </Routes>
  );
}

function useVendorDash() {
  const [data, setData] = useState<VendorDash | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const dash = await api.request<VendorDash>("/api/dashboard");
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

function VendorOverview() {
  const { data, error, loading } = useVendorDash();

  return (
    <DashboardShell
      title="Vendor home"
      subtitle="Track onboarding, listings, and assigned couples."
      nav={nav}
    >
      {loading && <Spinner />}
      {error && <Alert tone="error">{error}</Alert>}
      {data && (
        <div className="grid gap-5 md:grid-cols-3">
          <Stat
            label="Listing"
            value={data.summary.isListed ? "Live" : "Hidden"}
            hint={
              data.summary.isListed
                ? "Visible in customer search"
                : "Complete deposit + terms to go live"
            }
          />
          <Stat
            label="Deposit"
            value={data.summary.depositStatus}
            hint={formatMoney(data.summary.depositRequired, data.summary.currency)}
          />
          <Stat
            label="Open jobs"
            value={String(data.summary.openAssignments)}
            hint={`${data.summary.unreadMessages} unread messages`}
          />
          {(!data.summary.termsAccepted || data.summary.depositStatus !== "paid") && (
            <div className="md:col-span-3">
              <Alert tone="warn">
                Finish onboarding: accept Terms & Conditions and pay your vendor
                deposit to appear in customer matching.
              </Alert>
            </div>
          )}
          <div className="panel p-5 md:col-span-3">
            <h2 className="font-display text-2xl text-brand-purple">Recent assignments</h2>
            <div className="mt-4 space-y-3">
              {data.assignments.slice(0, 5).map((a) => (
                <div key={a._id} className="rounded-xl border border-brand-line px-4 py-3">
                  <p className="font-medium text-brand-purple">
                    {a.customerId?.userId?.fullName ?? "Customer"}
                  </p>
                  <p className="text-sm text-brand-muted">
                    {a.serviceCategory} · {a.status} · {a.paymentStatus}
                    {a.eventDate
                      ? ` · ${new Date(a.eventDate).toLocaleDateString()}`
                      : ""}
                  </p>
                </div>
              ))}
              {data.assignments.length === 0 && (
                <EmptyState>No assigned customers yet.</EmptyState>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="panel animate-fade-up p-5">
      <p className="text-xs uppercase tracking-wider text-brand-muted">{label}</p>
      <p className="font-display mt-1 text-3xl capitalize text-brand-purple">{value}</p>
      <p className="mt-1 text-sm text-brand-muted">{hint}</p>
    </div>
  );
}

function VendorProfilePage() {
  const { data, loading, error, reload } = useVendorDash();
  const [businessName, setBusinessName] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [startingPrice, setStartingPrice] = useState(0);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [availability, setAvailability] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!data?.vendor) return;
    const v = data.vendor;
    setBusinessName(v.businessName);
    setCity(v.city ?? "");
    setBio(v.bio ?? "");
    setStartingPrice(v.pricing.startingPrice);
    setProfilePhoto(v.profilePhoto ?? "");
    setPortfolio((v.portfolioPhotos ?? []).join("\n"));
    setServices(v.services ?? []);
    setEventTypes(v.eventTypes ?? []);
    setAvailability(
      (v.availabilityDates ?? [])
        .map((d) => new Date(d).toISOString().slice(0, 10))
        .join(", ")
    );
  }, [data]);

  function toggle(list: string[], value: string, setter: (v: string[]) => void) {
    setter(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      await api.request("/api/vendor/profile", {
        method: "PUT",
        body: JSON.stringify({
          businessName,
          city,
          bio,
          profilePhoto,
          portfolioPhotos: portfolio
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
          services,
          eventTypes,
          pricing: {
            startingPrice: Number(startingPrice),
            currency: "INR",
          },
          availabilityDates: availability
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      });
      setMsg("Profile saved.");
      await reload();
    } catch (error) {
      setErr((error as ApiError).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <DashboardShell
      title="Profile"
      subtitle="Photos, services, pricing, and availability."
      nav={nav}
    >
      {loading && <Spinner />}
      {error && <Alert tone="error">{error}</Alert>}
      {data && (
        <form onSubmit={save} className="panel max-w-3xl space-y-4 p-6">
          {msg && <Alert tone="success">{msg}</Alert>}
          {err && <Alert tone="error">{err}</Alert>}
          <label className="block text-sm">
            <span className="mb-1 block text-brand-muted">Business name</span>
            <input className="input" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-brand-muted">City</span>
            <input className="input" value={city} onChange={(e) => setCity(e.target.value)} />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-brand-muted">Bio</span>
            <textarea className="input min-h-24" value={bio} onChange={(e) => setBio(e.target.value)} />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-brand-muted">Starting price (INR)</span>
            <input className="input" type="number" value={startingPrice} onChange={(e) => setStartingPrice(Number(e.target.value))} />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-brand-muted">Profile photo URL</span>
            <input className="input" value={profilePhoto} onChange={(e) => setProfilePhoto(e.target.value)} />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-brand-muted">Portfolio photo URLs (one per line)</span>
            <textarea className="input min-h-24" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-brand-muted">Availability dates (YYYY-MM-DD, comma-separated)</span>
            <input className="input" value={availability} onChange={(e) => setAvailability(e.target.value)} />
          </label>
          <div>
            <p className="mb-2 text-sm text-brand-muted">Services</p>
            <div className="flex flex-wrap gap-2">
              {SERVICE_TYPES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggle(services, s, setServices)}
                  className={`rounded-full px-3 py-1 text-xs ${
                    services.includes(s) ? "bg-brand-purple text-white" : "bg-brand-mist"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm text-brand-muted">Event types</p>
            <div className="flex flex-wrap gap-2">
              {EVENT_TYPES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggle(eventTypes, s, setEventTypes)}
                  className={`rounded-full px-3 py-1 text-xs ${
                    eventTypes.includes(s) ? "bg-brand-purple text-white" : "bg-brand-mist"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" disabled={busy} className="btn-gold rounded-xl px-5 py-2.5">
            {busy ? "Saving…" : "Save profile"}
          </button>
        </form>
      )}
    </DashboardShell>
  );
}

function VendorOnboarding() {
  const { data, loading, error, reload } = useVendorDash();
  const [termsMsg, setTermsMsg] = useState<string | null>(null);
  const [termsErr, setTermsErr] = useState<string | null>(null);

  async function acceptTerms() {
    setTermsErr(null);
    try {
      await api.request("/api/vendor/accept-terms", {
        method: "POST",
        body: JSON.stringify({ accepted: true }),
      });
      setTermsMsg("Terms accepted.");
      await reload();
    } catch (err) {
      setTermsErr((err as ApiError).message);
    }
  }

  return (
    <DashboardShell
      title="Onboarding"
      subtitle="Accept platform terms and pay the vendor deposit."
      nav={nav}
    >
      {loading && <Spinner />}
      {error && <Alert tone="error">{error}</Alert>}
      {data && (
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="panel space-y-4 p-5">
            <h3 className="font-display text-2xl text-brand-purple">
              Terms & Conditions
            </h3>
            <p className="text-sm leading-relaxed text-brand-muted">
              By accepting, you agree to Wedyora’s vendor code of conduct,
              cancellation policy, payout schedule, and quality standards for
              matched bookings. You remain responsible for delivering contracted
              services to customers.
            </p>
            {data.summary.termsAccepted ? (
              <Alert tone="success">Terms already accepted.</Alert>
            ) : (
              <button
                type="button"
                onClick={() => void acceptTerms()}
                className="btn-gold rounded-xl px-5 py-2.5"
              >
                I accept the Terms & Conditions
              </button>
            )}
            {termsMsg && <Alert tone="success">{termsMsg}</Alert>}
            {termsErr && <Alert tone="error">{termsErr}</Alert>}
          </div>
          <div>
            {data.summary.depositStatus === "paid" ? (
              <Alert tone="success">
                Deposit paid (
                {formatMoney(data.summary.depositRequired, data.summary.currency)}
                ).
              </Alert>
            ) : (
              <PaymentPanel
                kind="vendor_deposit"
                onPaid={() => void reload()}
              />
            )}
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

function VendorCustomers() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .request<{ assignments: Assignment[] }>("/api/vendor/assignments")
      .then((d) => setAssignments(d.assignments))
      .catch((err) => setError((err as ApiError).message));
  }, []);

  return (
    <DashboardShell
      title="Assigned customers"
      subtitle="Couples matched to your services."
      nav={nav}
    >
      {error && <Alert tone="error">{error}</Alert>}
      <div className="space-y-3">
        {assignments.map((a) => (
          <div key={a._id} className="panel p-5">
            <p className="font-medium text-brand-purple">
              {a.customerId?.userId?.fullName ?? "Customer"}
            </p>
            <p className="text-sm text-brand-muted">
              {a.customerId?.userId?.email}
              {a.customerId?.userId?.phone ? ` · ${a.customerId.userId.phone}` : ""}
            </p>
            <p className="mt-2 text-sm">
              {a.serviceCategory} · {a.status} · payment {a.paymentStatus}
              {a.customerId?.location?.city
                ? ` · ${a.customerId.location.city}`
                : ""}
            </p>
          </div>
        ))}
        {assignments.length === 0 && (
          <EmptyState>No customers assigned yet.</EmptyState>
        )}
      </div>
    </DashboardShell>
  );
}
