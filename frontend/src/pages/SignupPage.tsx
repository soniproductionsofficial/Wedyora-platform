import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { Alert } from "../components/ui";
import { AuthLayout } from "./LoginPage";
import { EVENT_TYPES, SERVICE_TYPES, type ApiError } from "../lib/api";

export function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialRole = params.get("role") === "vendor" ? "vendor" : "customer";

  const [role, setRole] = useState<"customer" | "vendor">(initialRole);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Mumbai");
  const [eventType, setEventType] = useState("Wedding");
  const [businessName, setBusinessName] = useState("");
  const [services, setServices] = useState<string[]>(["Photographer"]);
  const [startingPrice, setStartingPrice] = useState(45000);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const subtitle = useMemo(
    () =>
      role === "vendor"
        ? "Create a vendor account to list services and receive matches."
        : "Create a couple account to find vendors and manage payments.",
    [role]
  );

  function toggleService(s: string) {
    setServices((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = {
        email,
        password,
        fullName,
        phone: phone || undefined,
        role,
      };
      if (role === "vendor") {
        payload.businessName = businessName;
        payload.services = services;
        payload.startingPrice = Number(startingPrice);
        payload.city = city;
      } else {
        payload.eventType = eventType;
        payload.locationCity = city;
      }
      const user = await register(payload);
      navigate(user.role === "vendor" ? "/vendor" : "/customer");
    } catch (err) {
      setError((err as ApiError).message ?? "Signup failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle={subtitle}>
      <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-brand-mist p-1">
        {(["customer", "vendor"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`rounded-lg py-2 text-sm font-medium capitalize transition ${
              role === r
                ? "bg-white text-brand-purple shadow-sm"
                : "text-brand-muted"
            }`}
          >
            {r === "customer" ? "Couple" : "Vendor"}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        {error && <Alert tone="error">{error}</Alert>}
        <label className="block text-sm">
          <span className="mb-1 block text-brand-muted">Full name</span>
          <input className="input" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-brand-muted">Email</span>
          <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-brand-muted">Password</span>
          <input className="input" type="password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-brand-muted">Phone (optional)</span>
          <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-brand-muted">City</span>
          <input className="input" required value={city} onChange={(e) => setCity(e.target.value)} />
        </label>

        {role === "customer" && (
          <label className="block text-sm">
            <span className="mb-1 block text-brand-muted">Event type</span>
            <select className="input" value={eventType} onChange={(e) => setEventType(e.target.value)}>
              {EVENT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>
        )}

        {role === "vendor" && (
          <>
            <label className="block text-sm">
              <span className="mb-1 block text-brand-muted">Business name</span>
              <input className="input" required value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-brand-muted">Starting price (INR)</span>
              <input className="input" type="number" min={0} required value={startingPrice} onChange={(e) => setStartingPrice(Number(e.target.value))} />
            </label>
            <div>
              <p className="mb-2 text-sm text-brand-muted">Services</p>
              <div className="flex flex-wrap gap-2">
                {SERVICE_TYPES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleService(s)}
                    className={`rounded-full px-3 py-1 text-xs ${
                      services.includes(s)
                        ? "bg-brand-purple text-white"
                        : "bg-brand-mist text-brand-purple"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <button type="submit" disabled={busy} className="btn-gold mt-2 w-full rounded-xl py-3 disabled:opacity-60">
          {busy ? "Creating…" : "Create account"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-brand-muted">
        Already have an account?{" "}
        <Link to="/login" className="text-brand-purple underline-offset-2 hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
