import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  Clapperboard,
  Check,
  ArrowRight,
  MapPin,
  Calendar,
  Users,
  CreditCard,
  Gift,
  BadgeCheck,
  Building2,
  Sparkles,
} from "lucide-react";
import MinutesSearchBar from "@/components/minutes-search-bar";
import {
  MINUTES_BENEFITS,
  MINUTES_FLOW,
  MINUTES_GALLERY,
  MINUTES_MODULES,
  MINUTES_OFFERINGS,
  MINUTES_PACKAGES,
  MINUTES_PHASES,
  MINUTES_PHOTOGRAPHERS,
  MINUTES_PIPELINE,
  MINUTES_REVIEWS,
  formatInr,
  minutesBookingHref,
} from "@/lib/minutes-content";

export const metadata = {
  title: "Photography in Minutes | Wedyora",
  description:
    "Wedyora Minutes — book in-house photography through Wedyora. Packages, photographers, availability, booking, QC, and delivery in one flow.",
};

const FLOW_ICONS = [Camera, Gift, Calendar, Users, CreditCard, BadgeCheck];

export default function PhotographyInMinutesPage() {
  return (
    <div id="top" className="font-wedding-sans">
      {/* Hero + search */}
      <section className="relative z-0 min-h-[min(92vh,860px)] w-full overflow-hidden bg-[#1a0a12] text-white">
        <Image
          src="/images/minutes/photography-in-minutes.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/25"
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex min-h-[min(92vh,860px)] max-w-6xl flex-col justify-end gap-8 px-4 pb-10 pt-24 sm:px-6 sm:pb-14 md:justify-center md:pb-16">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold-bright">
              Wedyora Minutes
            </p>
            <h1 className="mt-3 font-wedding-display text-[1.85rem] font-semibold leading-[1.15] text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.65)] sm:text-4xl md:text-5xl">
              Plan your dream wedding photography — all in one place
            </h1>
            <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-white/90 [text-shadow:0_1px_16px_rgba(0,0,0,0.7)] sm:text-base md:text-lg">
              Find packages, match a Minutes photographer, book with confidence,
              and get quality delivery from our in-house execution team.
            </p>
          </div>

          <div className="w-full max-w-4xl">
            <MinutesSearchBar variant="hero" />
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { label: "Venues", href: "/services" },
              { label: "Photography", href: "#top", active: true },
              { label: "Makeup", href: "/services" },
              { label: "Catering", href: "/services" },
              { label: "Decor", href: "/services" },
              { label: "More", href: "/services" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  item.active
                    ? "bg-brand-button text-brand-black"
                    : "border border-white/30 bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Formula */}
      <section className="border-b border-brand-line bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8 text-center md:py-10">
          <p className="font-wedding-display text-lg font-semibold text-brand-magenta md:text-2xl">
            Wedyora (marketplace) + Wedyora Minutes (execution team) = complete
            wedding photography solution
          </p>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-brand-gray">
            Customer books through Wedyora → Minutes executes → quality delivery.
          </p>
        </div>
      </section>

      {/* Booking flow */}
      <section className="border-b border-brand-line bg-brand-cream py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
              Customer booking flow
            </p>
            <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta md:text-4xl">
              From select photography to confirmed
            </h2>
          </div>
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {MINUTES_FLOW.map((item, i) => {
              const Icon = FLOW_ICONS[i] ?? Camera;
              return (
                <li
                  key={item.step}
                  className="flex gap-4 rounded-2xl border border-brand-line bg-white p-5"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-button text-brand-black">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-brand-magenta">
                      Step {item.step}
                    </p>
                    <h3 className="mt-1 font-heading text-base font-semibold text-brand-black">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-brand-gray">
                      {item.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Minutes team offerings */}
      <section className="border-b border-brand-line bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
              Wedyora Minutes
            </p>
            <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta md:text-4xl">
              Our in-house photography &amp; content team
            </h2>
            <p className="mt-3 text-sm text-brand-gray md:text-base">
              Not an open marketplace freelist — Minutes is Wedyora&rsquo;s
              execution team for photography and film.
            </p>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {MINUTES_OFFERINGS.map((item) => (
              <li key={item.id} className="border-t border-brand-magenta/25 pt-4">
                <h3 className="font-heading text-sm font-semibold text-brand-black">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-brand-gray md:text-sm">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* System connection */}
      <section
        id="pipeline"
        className="scroll-mt-24 border-b border-brand-line bg-brand-cream py-16 md:py-20"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
              System connection
            </p>
            <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta md:text-4xl">
              How booking reaches Minutes
            </h2>
          </div>

          <div className="mb-10 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Users,
                title: "Customer",
                body: "Places booking on the Wedyora website.",
              },
              {
                icon: Building2,
                title: "Wedyora website",
                body: "Handles booking, payment, and confirmation.",
              },
              {
                icon: Sparkles,
                title: "Routing",
                body: "Verified vendors or in-house Minutes team.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-brand-line bg-white p-5 text-center"
              >
                <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand-magenta/10 text-brand-magenta">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-heading text-sm font-semibold text-brand-black">
                  {title}
                </h3>
                <p className="mt-2 text-xs text-brand-gray md:text-sm">{body}</p>
              </div>
            ))}
          </div>

          <div className="mb-6 rounded-2xl border border-brand-gold-bright/40 bg-white p-5 text-center">
            <p className="text-sm font-semibold text-brand-magenta">
              For Photography in Minutes bookings → Wedyora Minutes executes
            </p>
            <p className="mt-1 text-xs text-brand-gray">
              External verified vendors remain available for other marketplace
              photography needs on /services.
            </p>
          </div>

          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MINUTES_PIPELINE.map((item, i) => (
              <li
                key={item.title}
                className="flex items-start gap-3 rounded-xl border border-brand-line bg-white px-4 py-3"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-magenta text-xs font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-brand-black">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-xs text-brand-gray">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Website modules */}
      <section className="border-b border-brand-line bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
              Website modules
            </p>
            <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta md:text-4xl">
              Everything connected for Minutes
            </h2>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {MINUTES_MODULES.map((mod) => (
              <li key={mod.id}>
                <Link
                  href={mod.href}
                  className="flex h-full flex-col rounded-2xl border border-brand-line bg-brand-cream/50 p-4 transition-colors hover:border-brand-magenta/40 hover:bg-brand-cream"
                >
                  <span className="font-heading text-sm font-semibold text-brand-black">
                    {mod.title}
                  </span>
                  <span className="mt-1 text-xs text-brand-gray">{mod.body}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Photographers */}
      <section
        id="photographers"
        className="scroll-mt-24 border-b border-brand-line bg-brand-cream py-16 md:py-20"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
              Photographer profiles
            </p>
            <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta md:text-4xl">
              Meet the Minutes roster
            </h2>
            <p className="mt-3 text-sm text-brand-gray">
              After you book, we match you with the right in-house shooter for
              your city and package.
            </p>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {MINUTES_PHOTOGRAPHERS.map((p) => (
              <li
                key={p.id}
                className="rounded-2xl border border-brand-line bg-white p-5"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-magenta text-sm font-bold text-white">
                  {p.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <h3 className="font-heading text-base font-semibold text-brand-black">
                  {p.name}
                </h3>
                <p className="mt-1 text-xs font-semibold text-brand-magenta">
                  {p.role}
                </p>
                <p className="mt-2 text-xs text-brand-gray">{p.focus}</p>
                <p className="mt-3 flex items-start gap-1.5 text-[11px] text-brand-gray">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-magenta" />
                  {p.cities}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Gallery */}
      <section
        id="gallery"
        className="scroll-mt-24 border-b border-brand-line bg-white py-16 md:py-20"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
              Gallery
            </p>
            <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta md:text-4xl">
              Portfolio from Minutes shoots
            </h2>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MINUTES_GALLERY.map((shot) => (
              <li
                key={shot.src + shot.label}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl"
              >
                <Image
                  src={shot.src}
                  alt={shot.label}
                  fill
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <p className="text-sm font-medium text-white">{shot.label}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Packages */}
      <section
        id="packages"
        className="scroll-mt-24 border-b border-brand-line bg-brand-cream py-16 md:py-20"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
              Packages &amp; pricing
            </p>
            <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta md:text-4xl">
              Choose your Minutes package
            </h2>
            <p className="mt-3 text-sm text-brand-gray md:text-base">
              Transparent starting prices. Final quote confirmed before you pay
              an advance.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {MINUTES_PACKAGES.map((pkg) => (
              <article
                key={pkg.id}
                className={`flex flex-col rounded-2xl border bg-white p-6 shadow-sm ${
                  "featured" in pkg && pkg.featured
                    ? "border-brand-gold-bright ring-1 ring-brand-gold-bright/40"
                    : "border-brand-line"
                }`}
              >
                {"featured" in pkg && pkg.featured ? (
                  <span className="mb-3 w-fit rounded-full bg-brand-button/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-orange-dark">
                    Popular
                  </span>
                ) : (
                  <span className="mb-3 h-5" aria-hidden />
                )}
                <h3 className="font-wedding-display text-xl font-semibold text-brand-magenta">
                  {pkg.name}
                </h3>
                <p className="mt-1 text-xs text-brand-gray">{pkg.tagline}</p>
                <p className="mt-4 font-heading text-2xl font-bold text-brand-black">
                  {formatInr(pkg.price)}
                  <span className="ml-1 text-xs font-normal text-brand-gray">
                    starting
                  </span>
                </p>
                <ul className="mt-5 flex flex-1 flex-col gap-2">
                  {pkg.includes.map((line) => (
                    <li
                      key={line}
                      className="flex items-start gap-2 text-sm text-brand-gray"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-magenta" />
                      {line}
                    </li>
                  ))}
                </ul>
                <Link
                  href={minutesBookingHref({ packageName: pkg.name })}
                  className="mt-6 inline-flex items-center justify-center gap-1.5 rounded-full bg-brand-black px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-charcoal"
                >
                  Book this package
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Availability */}
      <section
        id="availability"
        className="scroll-mt-24 border-b border-brand-line bg-white py-16 md:py-20"
      >
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-8 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
              Check availability
            </p>
            <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta md:text-4xl">
              Date, city, package — then book
            </h2>
          </div>
          <MinutesSearchBar variant="panel" />
        </div>
      </section>

      {/* Revenue model — Minutes focus */}
      <section className="border-b border-brand-line bg-brand-cream py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
              Revenue model
            </p>
            <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta md:text-4xl">
              Clear value for Minutes bookings
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-brand-line bg-white p-6">
              <h3 className="font-heading text-sm font-semibold text-brand-black">
                Customer booking
              </h3>
              <p className="mt-3 text-2xl font-bold text-brand-magenta">
                {formatInr(25000)}
              </p>
              <p className="mt-1 text-xs text-brand-gray">Example package total</p>
              <ul className="mt-4 space-y-2 text-sm text-brand-gray">
                <li>₹18,000 → photographer ops</li>
                <li>₹5,000 → Wedyora margin</li>
                <li>₹2,000 → operations</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-brand-line bg-white p-6">
              <h3 className="font-heading text-sm font-semibold text-brand-black">
                Marketplace vendors
              </h3>
              <p className="mt-3 text-sm text-brand-gray">
                External verified photographers stay available via Wedyora
                services for marketplace bookings.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-brand-gray">
                <li>Free listing</li>
                <li>Premium listing</li>
                <li>Featured vendor</li>
                <li>Lead packages</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-brand-gold-bright/50 bg-white p-6 ring-1 ring-brand-gold-bright/30">
              <div className="mb-2 flex items-center gap-2 text-brand-magenta">
                <Clapperboard className="h-4 w-4" />
                <h3 className="font-heading text-sm font-semibold">
                  Wedyora Minutes
                </h3>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-brand-gray">
                <li>Photography packages</li>
                <li>Premium cinematic</li>
                <li>Album &amp; reels</li>
                <li>Same-day edit</li>
                <li>Drone &amp; more</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Phase plan */}
      <section className="border-b border-brand-line bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
              Phase-wise integration
            </p>
            <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta md:text-4xl">
              Built to the Minutes roadmap
            </h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {MINUTES_PHASES.map((phase, idx) => (
              <div
                key={phase.name}
                className="rounded-2xl border border-brand-line bg-brand-cream/40 p-6"
              >
                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-magenta">
                  Phase {idx + 1}
                </p>
                <h3 className="mt-2 font-heading text-base font-semibold text-brand-black">
                  {phase.name.replace(/^Phase \d+ — /, "")}
                </h3>
                <ul className="mt-4 space-y-2">
                  {phase.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-brand-gray"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-magenta" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-brand-gray">
            Phase 1 is live on this page and booking flow. Phase 2–3 ops and
            automation deepen assignment, status, QC, and matching over time.
          </p>
        </div>
      </section>

      {/* Reviews */}
      <section
        id="reviews"
        className="scroll-mt-24 border-b border-brand-line bg-brand-cream py-16 md:py-20"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta md:text-4xl">
              Reviews &amp; ratings
            </h2>
          </div>
          <ul className="grid gap-5 md:grid-cols-3">
            {MINUTES_REVIEWS.map((r) => (
              <li
                key={r.name}
                className="rounded-2xl border border-brand-line bg-white p-6"
              >
                <p className="text-sm leading-relaxed text-brand-gray">
                  &ldquo;{r.quote}&rdquo;
                </p>
                <p className="mt-4 text-sm font-semibold text-brand-black">
                  {r.name}
                </p>
                <p className="text-xs text-brand-gray">{r.city}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-b border-brand-line bg-white py-12">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-3 px-6">
          {MINUTES_BENEFITS.map((b) => (
            <span
              key={b}
              className="rounded-full border border-brand-line bg-brand-cream px-4 py-2 text-xs font-semibold text-brand-black"
            >
              {b}
            </span>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-brand-chrome text-white">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center md:py-20">
          <h2 className="font-wedding-display text-3xl font-semibold md:text-4xl">
            Ready to book Minutes?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/75 md:text-base">
            Tell us your date and city — we&rsquo;ll match a Minutes photographer
            and confirm pricing before any advance is charged.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={minutesBookingHref()}
              className="inline-flex w-full items-center justify-center rounded-full bg-brand-button px-8 py-3.5 text-sm font-semibold text-brand-black hover:bg-brand-button-dark sm:w-auto"
            >
              Book now
            </Link>
            <Link
              href="#availability"
              className="inline-flex w-full items-center justify-center rounded-full border border-white/35 px-8 py-3.5 text-sm font-medium text-white hover:bg-white/10 sm:w-auto"
            >
              Check availability
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
