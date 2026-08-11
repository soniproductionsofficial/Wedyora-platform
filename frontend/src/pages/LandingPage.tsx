import { Link } from "react-router-dom";
import { SiteHeader } from "../components/ui";
import { useAuth } from "../lib/auth";

export function LandingPage() {
  const { user } = useAuth();
  const dash = user?.role === "vendor" ? "/vendor" : user ? "/customer" : "/signup";

  return (
    <div className="min-h-screen">
      <section className="hero-glow relative min-h-[100svh] overflow-hidden text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <SiteHeader />
        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-5 pb-16 pt-28 md:px-8">
          <p className="animate-fade-up text-sm font-medium uppercase tracking-[0.28em] text-brand-gold-bright/90">
            Wedding vendor platform
          </p>
          <h1 className="animate-fade-up-delay font-display mt-4 max-w-3xl text-5xl font-semibold leading-[1.05] md:text-7xl">
            Wedyora
          </h1>
          <p className="animate-fade-up-delay-2 mt-5 max-w-xl text-lg text-white/80 md:text-xl">
            Match with trusted wedding vendors, manage assignments, and pay
            securely — all in one place for couples and vendors.
          </p>
          <div className="animate-fade-up-delay-2 mt-9 flex flex-wrap gap-3">
            <Link to={dash} className="btn-gold rounded-full px-6 py-3">
              {user ? "Open dashboard" : "Start as a couple"}
            </Link>
            <Link to="/signup?role=vendor" className="btn-outline rounded-full px-6 py-3">
              Join as a vendor
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8">
        <h2 className="font-display text-4xl text-brand-purple md:text-5xl">
          Built for the full wedding workflow
        </h2>
        <p className="mt-3 max-w-2xl text-brand-muted">
          Couples discover and pay. Vendors onboard, accept terms, pay a
          deposit, and receive matched customers.
        </p>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {[
            {
              title: "Smart matching",
              body: "Vendors are ranked by city, service type, availability, and budget before assignment.",
            },
            {
              title: "Role-based dashboards",
              body: "Customers search and pay. Vendors manage profiles, deposits, clients, and messages.",
            },
            {
              title: "Stripe payments",
              body: "Customer service payments and vendor onboarding deposits run through Stripe.",
            },
          ].map((item, i) => (
            <div
              key={item.title}
              className="animate-fade-up border-t border-brand-purple/15 pt-5"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <h3 className="font-display text-2xl text-brand-purple">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
