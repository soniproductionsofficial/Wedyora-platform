import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api, money, type Plan } from "../lib/api";
import { useAuth } from "../lib/auth";
import { Button, Modal } from "../components/ui";
import { FlashCard } from "../components/FlashCard";

export default function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [role, setRole] = useState<"customer" | "vendor">(
    params.get("role") === "vendor" ? "vendor" : "customer"
  );
  const [plans, setPlans] = useState<Plan[]>([]);
  const [plansOpen, setPlansOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    businessName: "",
    category: "Photography",
    planTier: "basic" as Plan["key"],
  });

  useEffect(() => {
    api.get("/vendors/plans").then((r) => setPlans(r.data.plans ?? []));
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register({
        ...form,
        role,
        planTier: role === "vendor" ? form.planTier : undefined,
        businessName: role === "vendor" ? form.businessName || form.name : undefined,
        category: role === "vendor" ? form.category : undefined,
      });
      navigate(role === "vendor" ? "/vendor" : "/customer");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        "Signup failed";
      setError(typeof msg === "string" ? msg : "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-12">
      <h1 className="font-heading text-3xl font-bold mb-2">Create your account</h1>
      <p className="text-sm text-brand-gray mb-6">
        Email + password JWT auth · customers book events · vendors join with a plan & deposit
      </p>

      <div className="flex gap-2 mb-6">
        {(["customer", "vendor"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${
              role === r ? "bg-brand-black text-white" : "border border-brand-line bg-white"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-brand-line bg-white p-6">
        <label className="block text-xs font-medium">
          Full name
          <input
            required
            className="mt-1 w-full rounded-lg border border-brand-line px-3 py-2 text-sm"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>
        <label className="block text-xs font-medium">
          Email
          <input
            required
            type="email"
            className="mt-1 w-full rounded-lg border border-brand-line px-3 py-2 text-sm"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>
        <label className="block text-xs font-medium">
          Password (min 8)
          <input
            required
            minLength={8}
            type="password"
            className="mt-1 w-full rounded-lg border border-brand-line px-3 py-2 text-sm"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </label>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block text-xs font-medium">
            Phone
            <input
              className="mt-1 w-full rounded-lg border border-brand-line px-3 py-2 text-sm"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </label>
          <label className="block text-xs font-medium">
            City
            <input
              className="mt-1 w-full rounded-lg border border-brand-line px-3 py-2 text-sm"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </label>
        </div>

        {role === "vendor" && (
          <>
            <label className="block text-xs font-medium">
              Business name
              <input
                className="mt-1 w-full rounded-lg border border-brand-line px-3 py-2 text-sm"
                value={form.businessName}
                onChange={(e) => setForm({ ...form, businessName: e.target.value })}
              />
            </label>
            <label className="block text-xs font-medium">
              Category
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

            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium">Choose a plan</p>
                <button
                  type="button"
                  className="text-xs text-brand-orange font-semibold"
                  onClick={() => setPlansOpen(true)}
                >
                  Compare plans
                </button>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                {plans.map((p) => (
                  <FlashCard
                    key={p.key}
                    accent={form.planTier === p.key ? "dark" : "cream"}
                    front={
                      <div
                        onClick={() => setForm({ ...form, planTier: p.key })}
                        className="h-full flex flex-col justify-center"
                      >
                        <p className="font-heading font-semibold">{p.label}</p>
                        <p className="text-xs mt-2 opacity-80">
                          {money(p.deposit)} refundable deposit
                        </p>
                        <p className="text-[11px] mt-3 opacity-70">Tap for details</p>
                      </div>
                    }
                    back={
                      <div onClick={() => setForm({ ...form, planTier: p.key })}>
                        <p className="text-sm font-semibold mb-2">{p.label}</p>
                        <ul className="text-xs space-y-1 text-white/80">
                          {p.features.map((f) => (
                            <li key={f}>· {f}</li>
                          ))}
                        </ul>
                        <p className="text-xs mt-3">
                          Fee {money(p.registrationFee)}
                        </p>
                      </div>
                    }
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={loading} variant="dark" className="w-full">
          {loading ? "Creating…" : "Create account"}
        </Button>
      </form>

      <p className="text-sm text-brand-gray mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-brand-orange font-medium">
          Log in
        </Link>
      </p>

      <Modal open={plansOpen} onClose={() => setPlansOpen(false)} title="Vendor plan comparison">
        <div className="space-y-3">
          {plans.map((p) => (
            <div key={p.key} className="rounded-2xl border border-brand-line p-4">
              <p className="font-heading font-semibold">{p.label}</p>
              <p className="text-xs text-brand-gray mt-1">
                Registration {money(p.registrationFee)} · Deposit {money(p.deposit)} (refundable)
              </p>
              <ul className="text-xs mt-2 space-y-1">
                {p.features.map((f) => (
                  <li key={f}>· {f}</li>
                ))}
              </ul>
              <Button
                className="mt-3"
                onClick={() => {
                  setForm({ ...form, planTier: p.key });
                  setPlansOpen(false);
                }}
              >
                Select {p.label}
              </Button>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
