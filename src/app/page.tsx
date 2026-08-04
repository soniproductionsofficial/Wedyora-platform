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
import Reveal from "@/components/reveal";

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
      <section className="relative bg-brand-black text-white overflow-hidden">
        <div className="hero-blob-field" aria-hidden="true">
          <span className="hero-blob hero-blob-1" />
          <span className="hero-blob hero-blob-2" />
          <span className="hero-blob hero-blob-3" />
        </div>
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p
              className="animate-fade-in-up text-brand-gold-bright uppercase tracking-[0.2em] text-xs font-semibold mb-4"
              style={{ animationDelay: "0ms" }}
            >
              India&rsquo;s Managed Wedding Services Platform
            </p>
            <h1
              className="animate-fade-in-up font-heading text-4xl md:text-5xl font-bold leading-tight mb-6"
              style={{ animationDelay: "120ms" }}
            >
              Find. Book.{" "}
              <span className="animate-shimmer">Celebrate.</span>
            </h1>
            <p
              className="animate-fade-in-up text-white/70 mb-10"
              style={{ animationDelay: "240ms" }}
            >
              Photography, decor, catering and more — every vendor on Wedyora
              is verified by our team, so you can book with confidence.
            </p>
          </div>

          {/* Search bar */}
          <form
            action="/vendors"
            method="get"
            className="animate-scale-in bg-white rounded-2xl p-3 flex flex-col md:flex-row gap-3 max-w-3xl mx-auto mb-12"
            style={{ animationDelay: "360ms" }}
          >
            <select
              name="category"
              defaultValue=""
              className="flex-1 rounded-xl px-4 py-3 text-sm text-brand-black bg-brand-cream md:bg-transparent focus:outline-none"
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
              className="flex-1 rounded-xl px-4 py-3 text-sm text-brand-black bg-brand-cream md:bg-transparent focus:outline-none"
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-button text-brand-black font-semibold hover:bg-brand-button-dark transition-colors"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </form>

          {/* Trust row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto text-center">
            {[
              { icon: ShieldCheck, label: "Verified Vendors" },
              { icon: CalendarCheck, label: "Easy Booking" },
              { icon: CreditCard, label: "Secure Payments" },
              { icon: Headset, label: "Real Support" },
            ].map(({ icon: Icon, label }, i) => (
              <div
                key={label}
                className="animate-fade-in-up flex flex-col items-center gap-2"
                style={{ animationDelay: `${420 + i * 100}ms` }}
              >
                <span
                  className="hover-wiggle animate-float flex h-11 w-11 items-center justify-center rounded-full border border-white/20"
                  style={{ animationDelay: `${i * 250}ms` }}
                >
                  <Icon className="h-5 w-5 text-brand-gold-bright" />
                </span>
                <p className="text-xs text-white/70 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category strip */}
      {categories && categories.length > 0 && (
        <section className="relative overflow-hidden bg-brand-cream border-b border-brand-line">
          <div className="hero-blob-field opacity-60" aria-hidden="true">
            <span className="hero-blob hero-blob-1" style={{ opacity: 0.18 }} />
            <span className="hero-blob hero-blob-2" style={{ opacity: 0.16 }} />
          </div>
          <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 md:py-20">
            <div className="text-center max-w-xl mx-auto mb-12">
              <p className="animate-fade-in-up text-brand-orange uppercase tracking-[0.2em] text-xs font-semibold mb-3">
                Everything Your Wedding Needs
              </p>
              <h2
                className="animate-fade-in-up font-heading text-2xl md:text-3xl font-bold"
                style={{ animationDelay: "100ms" }}
              >
                Popular Services
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
              {categories.map((c, i) => {
                const Icon = getCategoryIcon(c.slug);
                return (
                  <Reveal key={c.id} delay={i * 60}>
                    <Link
                      href={`/vendors?category=${c.slug}`}
                      className="hover-lift group relative flex flex-col items-center gap-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-brand-line px-4 py-6 text-center transition-colors duration-300 hover:border-brand-button hover:bg-white shadow-sm"
                    >
                      <span
                        className="animate-float flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                        style={{
                          background:
                            "linear-gradient(135deg, var(--brand-button), var(--brand-black))",
                          animationDelay: `${i * 180}ms`,
                          animationDuration: `${3.4 + (i % 3) * 0.5}s`,
                        }}
                      >
                        <Icon className="h-6 w-6" />
                      </span>
                      <p className="text-xs font-semibold text-center leading-tight">
                        {c.name}
                      </p>
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
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-2xl font-semibold">
              Verified Vendors
            </h2>
            <Link
              href="/vendors"
              className="text-sm font-semibold text-brand-orange hover:text-brand-orange-dark"
            >
              View All &rarr;
            </Link>
          </div>

          {!vendors || vendors.length === 0 ? (
            <p className="text-brand-gray text-sm">
              We&rsquo;re reviewing our first vendor applications now — check
              back soon, or{" "}
              <Link href="/vendor/apply" className="text-brand-orange font-medium">
                apply to become one of our first verified vendors
              </Link>
              .
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {vendors.map((v, i) => (
                <Reveal
                  key={v.id}
                  delay={i * 80}
                  className="hover-lift hover-zoom rounded-2xl bg-white border border-brand-line overflow-hidden"
                >
                  <div
                    className="h-40 bg-brand-charcoal bg-cover bg-center"
                    style={{
                      backgroundImage: `url(https://picsum.photos/seed/${v.id}/480/320)`,
                    }}
                  />
                  <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold mb-1">
                      {v.service_categories?.name}
                    </p>
                    <h3 className="font-heading font-semibold mb-1">
                      {v.business_name}
                    </h3>
                    <p className="text-brand-gray text-sm flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {v.city}
                      {v.experience_years
                        ? ` · ${v.experience_years} yrs experience`
                        : ""}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How Wedyora works */}
      <section className="bg-white border-t border-brand-line">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="font-heading text-2xl font-semibold text-center mb-12">
            How Wedyora Works
          </h2>
          <div className="grid md:grid-cols-5 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <Reveal key={step.title} delay={i * 100} className="text-center">
                <span className="animate-pulse-glow mx-auto mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-brand-button text-brand-black text-sm font-semibold">
                  {i + 1}
                </span>
                <h3 className="font-heading text-sm font-semibold mb-2">
                  {step.title}
                </h3>
                <p className="text-brand-gray text-xs leading-relaxed">
                  {step.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Wedyora */}
      <section className="bg-brand-cream border-t border-brand-line">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="font-heading text-2xl font-semibold text-center mb-12">
            Why Couples Choose Wedyora
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {WHY_WEDYORA.map(({ icon: Icon, title, body }, i) => (
              <Reveal
                key={title}
                delay={i * 90}
                className="hover-lift group rounded-2xl bg-white border border-brand-line p-6"
              >
                <span className="hover-wiggle flex h-11 w-11 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange mb-4 transition-transform group-hover:scale-110">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-heading text-sm font-semibold mb-2">
                  {title}
                </h3>
                <p className="text-brand-gray text-xs leading-relaxed">
                  {body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Vendor CTA */}
      <section className="bg-brand-black text-white overflow-hidden">
        <Reveal className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h2 className="font-heading text-2xl font-semibold mb-4">
            Are you a wedding vendor?
          </h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">
            Join Wedyora&rsquo;s verified vendor network and get matched with
            couples planning their wedding in your city.
          </p>
          <Link
            href="/vendor/apply"
            className="animate-pulse-glow inline-block px-6 py-3 rounded-full bg-brand-button text-brand-black font-semibold hover:bg-brand-button-dark transition-colors"
          >
            Apply as a Vendor
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
