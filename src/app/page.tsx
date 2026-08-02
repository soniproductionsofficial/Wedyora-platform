import Link from "next/link";
import {
  ShieldCheck,
  CreditCard,
  Headset,
  CalendarCheck,
  MapPin,
  Search,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCategoryIcon } from "@/lib/category-icons";
import HeroStage from "@/components/home/hero-stage";
import GlassContainer from "@/components/ui/glass-container";
import TiltCard from "@/components/ui/tilt-card";
import Reveal from "@/components/ui/reveal";
import MagneticButton from "@/components/ui/magnetic-button";

const HOW_IT_WORKS = [
  {
    title: "You place your request",
    body: "Tell us the service, date, city, and budget for your event.",
  },
  {
    title: "Wedyora reviews it",
    body: "Our team checks the details and finds a verified vendor who fits.",
  },
  {
    title: "A vendor is assigned",
    body: "We confirm pricing with you before anything is charged.",
  },
  {
    title: "You pay a secure deposit",
    body: "Held through Razorpay, India's trusted payment system.",
  },
  {
    title: "Your vendor delivers",
    body: "On the day, and beyond — Wedyora stays the single point of contact.",
  },
];

const WHY_WEDYORA = [
  {
    icon: ShieldCheck,
    title: "Every Vendor Is Verified",
    body: "No open marketplace guessing — our team reviews every vendor before they can take a booking.",
  },
  {
    icon: CreditCard,
    title: "Secure, Trackable Payments",
    body: "Deposits are paid and tracked through Razorpay, not cash or unofficial transfers.",
  },
  {
    icon: CalendarCheck,
    title: "One Team, Start to Finish",
    body: "Wedyora manages the booking end-to-end, so you're never left coordinating with a stranger alone.",
  },
  {
    icon: Headset,
    title: "A Real Team Behind It",
    body: "Questions or issues get a person, not just an app.",
  },
];

export default async function Home() {
  const supabase = await createClient();

  const [{ data: categories }, { data: vendors }] = await Promise.all([
    supabase.from("service_categories").select("id, name, slug").order("name"),
    supabase
      .from("vendor_profiles")
      .select("id, business_name, city, experience_years, service_categories(name)")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  return (
    <div>
      {/* Hero */}
      <HeroStage>
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="mb-5 font-heading text-5xl font-semibold tracking-wide text-brand-champagne md:text-6xl">
            Wedyora
          </p>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
            India&rsquo;s Managed Wedding Services Platform
          </p>
          <h1 className="mb-6 font-heading text-4xl font-semibold leading-[1.1] md:text-6xl">
            Find. Book.{" "}
            <span className="text-gradient-gold italic">Celebrate.</span>
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-base text-white/70 md:text-lg">
            Photography, decor, catering and more — every vendor on Wedyora
            is verified by our team, so you can book with confidence.
          </p>

          <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
            <MagneticButton>
              <Link
                href="/book"
                className="btn-luxury inline-flex rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-white hover:bg-brand-orange-dark"
              >
                Plan Your Wedding
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link
                href="/vendors"
                className="inline-flex rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:border-brand-gold/40 hover:bg-white/10"
              >
                Browse Vendors
              </Link>
            </MagneticButton>
          </div>
        </div>

        {/* Search bar */}
        <form
          action="/vendors"
          method="get"
          className="animated-border glass-panel-dark mx-auto mb-12 max-w-3xl rounded-2xl p-3"
        >
          <div className="flex flex-col gap-3 md:flex-row">
            <select
              name="category"
              defaultValue=""
              className="flex-1 rounded-xl bg-white/95 px-4 py-3 text-sm text-brand-black focus:outline-none md:bg-white/90"
            >
              <option value="">Any Service</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            <input
              name="city"
              placeholder="City"
              className="flex-1 rounded-xl bg-white/95 px-4 py-3 text-sm text-brand-black placeholder:text-brand-gray focus:outline-none md:bg-white/90"
            />
            <button
              type="submit"
              className="btn-luxury flex items-center justify-center gap-2 rounded-xl bg-brand-orange px-6 py-3 font-semibold text-white hover:bg-brand-orange-dark"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </div>
        </form>

        {/* Trust row */}
        <div className="mx-auto grid max-w-3xl grid-cols-2 gap-4 text-center md:grid-cols-4 md:gap-6">
          {[
            { icon: ShieldCheck, label: "Verified Vendors" },
            { icon: CalendarCheck, label: "Easy Booking" },
            { icon: CreditCard, label: "Secure Payments" },
            { icon: Headset, label: "Real Support" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="glass-panel-dark flex flex-col items-center gap-2 rounded-2xl px-3 py-4"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-gold/30 bg-brand-gold/10">
                <Icon className="h-5 w-5 text-brand-gold" />
              </span>
              <p className="text-xs font-medium text-white/75">{label}</p>
            </div>
          ))}
        </div>
      </HeroStage>

      {/* Category strip */}
      {categories && categories.length > 0 && (
        <section className="border-b border-brand-line bg-brand-ivory/80">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <Reveal>
              <h2 className="mb-8 text-center font-heading text-3xl font-semibold">
                Popular Services
              </h2>
            </Reveal>
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((c, i) => {
                const Icon = getCategoryIcon(c.slug);
                return (
                  <Reveal key={c.id} delay={i * 0.03} className="w-24">
                    <Link
                      href={`/vendors?category=${c.slug}`}
                      className="group flex flex-col items-center gap-2"
                    >
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-line bg-white shadow-sm transition-all group-hover:-translate-y-1 group-hover:border-brand-gold/50 group-hover:text-brand-orange group-hover:shadow-[0_12px_30px_rgba(212,175,106,0.2)]">
                        <Icon className="h-6 w-6" />
                      </span>
                      <p className="text-center text-xs font-medium">{c.name}</p>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Top verified vendors */}
      <section className="bg-brand-cream">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Reveal>
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-heading text-3xl font-semibold">
                Verified Vendors
              </h2>
              <Link
                href="/vendors"
                className="text-sm font-semibold text-brand-orange transition-colors hover:text-brand-orange-dark"
              >
                View All &rarr;
              </Link>
            </div>
          </Reveal>

          {!vendors || vendors.length === 0 ? (
            <p className="text-sm text-brand-gray">
              We&rsquo;re reviewing our first vendor applications now — check
              back soon, or{" "}
              <Link href="/vendor/apply" className="font-medium text-brand-orange">
                apply to become one of our first verified vendors
              </Link>
              .
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {vendors.map((v, i) => (
                <Reveal key={v.id} delay={i * 0.05}>
                  <TiltCard>
                    <GlassContainer className="overflow-hidden rounded-2xl">
                      <div
                        className="h-40 bg-brand-charcoal bg-cover bg-center"
                        style={{
                          backgroundImage: `url(https://picsum.photos/seed/${v.id}/480/320)`,
                        }}
                      />
                      <div className="p-5">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-gold">
                          {v.service_categories?.name}
                        </p>
                        <h3 className="mb-1 font-heading text-xl font-semibold">
                          {v.business_name}
                        </h3>
                        <p className="flex items-center gap-1 text-sm text-brand-gray">
                          <MapPin className="h-3.5 w-3.5" />
                          {v.city}
                          {v.experience_years
                            ? ` · ${v.experience_years} yrs experience`
                            : ""}
                        </p>
                      </div>
                    </GlassContainer>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How Wedyora works */}
      <section className="border-t border-brand-line bg-brand-ivory/70">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Reveal>
            <h2 className="mb-12 text-center font-heading text-3xl font-semibold">
              How Wedyora Works
            </h2>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-5">
            {HOW_IT_WORKS.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.06}>
                <div className="text-center">
                  <span className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-orange to-brand-rose text-sm font-semibold text-white shadow-[0_8px_24px_rgba(226,113,29,0.35)]">
                    {i + 1}
                  </span>
                  <h3 className="mb-2 font-heading text-lg font-semibold">
                    {step.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-brand-gray">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Wedyora */}
      <section className="border-t border-brand-line bg-brand-cream">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Reveal>
            <h2 className="mb-12 text-center font-heading text-3xl font-semibold">
              Why Couples Choose Wedyora
            </h2>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {WHY_WEDYORA.map(({ icon: Icon, title, body }, i) => (
              <Reveal key={title} delay={i * 0.05}>
                <TiltCard>
                  <GlassContainer className="rounded-2xl p-6">
                    <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mb-2 font-heading text-lg font-semibold">
                      {title}
                    </h3>
                    <p className="text-xs leading-relaxed text-brand-gray">
                      {body}
                    </p>
                  </GlassContainer>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Vendor CTA */}
      <section className="relative overflow-hidden luxury-gradient-dark text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-0 h-48 w-48 rounded-full bg-brand-gold/20 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-56 w-56 rounded-full bg-brand-rose/15 blur-3xl" />
        </div>
        <Reveal>
          <div className="relative mx-auto max-w-6xl px-6 py-20 text-center">
            <h2 className="mb-4 font-heading text-3xl font-semibold md:text-4xl">
              Are you a wedding vendor?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-white/70">
              Join Wedyora&rsquo;s verified vendor network and get matched with
              couples planning their wedding in your city.
            </p>
            <MagneticButton>
              <Link
                href="/vendor/apply"
                className="btn-luxury inline-flex rounded-full bg-brand-orange px-6 py-3 font-semibold text-white hover:bg-brand-orange-dark"
              >
                Apply as a Vendor
              </Link>
            </MagneticButton>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
