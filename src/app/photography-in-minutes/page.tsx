import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  Check,
  ArrowRight,
  MapPin,
  Calendar,
  Users,
  CreditCard,
  Zap,
  BadgeCheck,
  Sparkles,
  Clock,
  Star,
} from "lucide-react";
import MinutesSearchBar from "@/components/minutes-search-bar";
import MinutesCategoryPricing from "@/components/minutes-category-pricing";
import {
  MinutesMarquee,
  MinutesReveal,
  MinutesStat,
} from "@/components/minutes-motion";
import {
  MINUTES_AUDIENCES,
  MINUTES_BLUEPRINT,
  MINUTES_CATEGORIES,
  MINUTES_COMBO_PACKAGES,
  MINUTES_CORE_PACKAGES,
  MINUTES_FLOW,
  MINUTES_GALLERY,
  MINUTES_MATCHING,
  MINUTES_NOW_PACKAGE,
  MINUTES_PHASES,
  MINUTES_PHOTOGRAPHERS,
  MINUTES_PIPELINE,
  MINUTES_REVIEWS,
  MINUTES_USPS,
  formatInr,
  formatMinutesPrice,
  minutesBookingHref,
} from "@/lib/minutes-content";

export const metadata = {
  title: "Photography in Minutes | Wedyora",
  description:
    "Whatever the occasion, book a photographer from ₹1,999. Instant photography, reels, family, religious functions, small events and business content.",
};

const FLOW_ICONS = [
  Sparkles,
  Camera,
  MapPin,
  Clock,
  Check,
  CreditCard,
  BadgeCheck,
  Users,
  Camera,
  Zap,
  BadgeCheck,
];

export default function PhotographyInMinutesPage() {
  return (
    <div id="top" className="minutes-page bg-white font-wedding-sans text-brand-black">
      {/* Hero — white / pink, Flashoot-inspired */}
      <section className="relative overflow-hidden bg-white">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 15% 10%, rgba(240,98,146,0.22), transparent 55%), radial-gradient(ellipse 55% 45% at 90% 20%, rgba(216,27,96,0.12), transparent 50%), linear-gradient(180deg, #fff 0%, #fff 42%, #fdf5f8 100%)",
          }}
        />

        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-10 pt-20 sm:px-6 md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-12 md:pb-14 md:pt-24">
          <div className="minutes-hero-copy">
            <p className="font-wedding-display text-4xl font-semibold tracking-tight text-brand-magenta-deep sm:text-5xl md:text-6xl">
              Wedyora
            </p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
              Photography in Minutes
            </p>
            <h1 className="mt-5 font-wedding-display text-[1.7rem] font-semibold leading-[1.15] text-brand-magenta-deep sm:text-4xl md:text-[2.65rem]">
              Book a photographer in minutes — from{" "}
              <span className="text-brand-magenta">₹1,999</span>
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-brand-gray sm:text-base">
              Whatever the occasion: pooja, maternity, birthdays, reels,
              business content. Pay securely — we assign a verified
              photographer. Weddings in Phase 2.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="#availability"
                className="inline-flex items-center gap-2 rounded-full bg-brand-magenta px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_-14px_rgba(216,27,96,0.9)] transition hover:bg-brand-magenta-deep hover:scale-[1.02]"
              >
                Book Now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#photographer-now"
                className="inline-flex items-center gap-1.5 rounded-full border border-brand-magenta/30 bg-white px-5 py-3 text-sm font-semibold text-brand-magenta transition hover:border-brand-magenta hover:bg-brand-magenta/5"
              >
                <Zap className="h-4 w-4" />
                Photographer Now
              </Link>
            </div>

            <div className="mt-8 grid max-w-md grid-cols-3 gap-4 border-t border-brand-line pt-6">
              <MinutesStat value="₹1,999" label="Starting" />
              <MinutesStat value="12" label="Occasions" />
              <MinutesStat value="4.9★" label="Trust goal" />
            </div>
          </div>

          <div className="minutes-hero-visual relative">
            <div className="minutes-float relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-brand-line shadow-[0_30px_80px_-36px_rgba(216,27,96,0.55)]">
              <Image
                src="/images/minutes/photography-in-minutes-hero.jpg"
                alt="Wedyora photographer covering a family birthday celebration"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 46vw"
                className="object-cover object-center"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-brand-magenta/15 via-transparent to-white/10"
                aria-hidden
              />
            </div>
            <div className="minutes-badge absolute -bottom-4 left-4 right-4 rounded-2xl border border-brand-line bg-white/95 px-4 py-3 shadow-lg backdrop-blur sm:left-6 sm:right-auto sm:max-w-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-magenta">
                Shoot · Edit · Deliver
              </p>
              <p className="mt-1 text-sm font-semibold text-brand-magenta-deep">
                Verified photographers, transparent packages
              </p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto mt-8 max-w-6xl px-4 sm:px-6 md:mt-14">
          <MinutesSearchBar variant="hero" />
        </div>
      </section>

      {/* USP marquee — Flashoot “why choose us” motion */}
      <section className="border-y border-brand-line bg-brand-cream/80 py-4">
        <MinutesMarquee speed={32}>
          {MINUTES_USPS.map((item) => (
            <span
              key={item}
              className="mx-3 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-brand-magenta/15 bg-white px-4 py-2 text-xs font-semibold text-brand-magenta-deep sm:mx-4 sm:text-sm"
            >
              <Check className="h-3.5 w-3.5 text-brand-magenta" />
              {item}
            </span>
          ))}
        </MinutesMarquee>
      </section>

      {/* Promise */}
      <section className="bg-white py-14 md:py-16">
        <MinutesReveal>
          <div className="mx-auto max-w-3xl px-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
              World&apos;s quick photography service
            </p>
            <h2 className="mt-3 font-wedding-display text-3xl font-semibold text-brand-magenta-deep md:text-4xl">
              Not just fast booking — verified photographers at transparent
              prices
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-brand-gray">
              Phase 1 makes photography and short-form reels bookable as a
              standardized service. Entry price ₹1,999. Core packages Basic ·
              Standard · Premium.
            </p>
          </div>
        </MinutesReveal>
      </section>

      {/* Audiences */}
      <section className="bg-brand-cream/60 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <MinutesReveal>
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
                Who it&apos;s for
              </p>
              <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta-deep md:text-4xl">
                Built for every occasion
              </h2>
            </div>
          </MinutesReveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MINUTES_AUDIENCES.map((row, i) => (
              <MinutesReveal key={row.group} delayMs={i * 60}>
                <div className="minutes-lift h-full rounded-2xl border border-brand-line bg-white p-5">
                  <h3 className="font-heading text-sm font-semibold text-brand-magenta">
                    {row.group}
                  </h3>
                  <p className="mt-2 text-xs text-brand-gray">{row.need}</p>
                  <p className="mt-3 text-sm font-medium text-brand-magenta-deep">
                    {row.proposition}
                  </p>
                </div>
              </MinutesReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Occasions */}
      <section id="occasions" className="scroll-mt-24 bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <MinutesReveal>
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
                Phase 1 service scope
              </p>
              <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta-deep md:text-4xl">
                Occasions we cover now
              </h2>
              <p className="mt-3 text-sm text-brand-gray">
                Wedding photography launches in Phase 2 after the operating
                model is stable.
              </p>
            </div>
          </MinutesReveal>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MINUTES_CATEGORIES.map((item, i) => (
              <MinutesReveal key={item.id} delayMs={(i % 3) * 70}>
                <li className="minutes-lift h-full rounded-2xl border border-brand-line bg-brand-cream/40 p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-heading text-sm font-semibold text-brand-magenta-deep">
                      {item.title}
                    </h3>
                    <p className="shrink-0 text-xs font-semibold text-brand-magenta">
                      from {formatInr(item.startingPrice)}
                    </p>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-brand-gray md:text-sm">
                    {item.body}
                  </p>
                  <Link
                    href="#category-pricing"
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-magenta hover:underline"
                  >
                    See packages
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </li>
              </MinutesReveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Core packages */}
      <section
        id="core-packages"
        className="scroll-mt-24 bg-brand-cream/70 py-16 md:py-20"
      >
        <div className="mx-auto max-w-6xl px-6">
          <MinutesReveal>
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
                Bestsellers
              </p>
              <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta-deep md:text-4xl">
                Basic · Standard · Premium
              </h2>
              <p className="mt-3 text-sm text-brand-gray">
                Standard ₹2,999 is Most Popular. Basic wins customers. Premium
                adds coverage and a reel.
              </p>
            </div>
          </MinutesReveal>

          <div className="grid gap-5 md:grid-cols-3">
            {MINUTES_CORE_PACKAGES.map((pkg, i) => (
              <MinutesReveal key={pkg.id} delayMs={i * 90}>
                <article
                  className={`minutes-lift flex h-full flex-col rounded-2xl border bg-white p-6 ${
                    pkg.featured
                      ? "border-brand-magenta shadow-[0_22px_50px_-30px_rgba(216,27,96,0.65)]"
                      : "border-brand-line"
                  }`}
                >
                  {pkg.featured ? (
                    <span className="mb-3 w-fit rounded-full bg-brand-magenta px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      Most popular
                    </span>
                  ) : (
                    <span className="mb-3 h-5" aria-hidden />
                  )}
                  <h3 className="font-wedding-display text-2xl font-semibold text-brand-magenta-deep">
                    {pkg.name}
                  </h3>
                  <p className="mt-3 font-heading text-3xl font-bold text-brand-magenta">
                    {formatMinutesPrice(pkg)}
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
                    className={`mt-6 inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                      pkg.featured
                        ? "bg-brand-magenta text-white hover:bg-brand-magenta-deep"
                        : "border border-brand-magenta/30 text-brand-magenta hover:bg-brand-magenta hover:text-white"
                    }`}
                  >
                    Book {pkg.name}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              </MinutesReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Category pricing */}
      <section
        id="category-pricing"
        className="scroll-mt-24 bg-white py-16 md:py-20"
      >
        <div className="mx-auto max-w-6xl px-6">
          <MinutesReveal>
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
                Complete category pricing
              </p>
              <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta-deep md:text-4xl">
                Every occasion rate card
              </h2>
            </div>
          </MinutesReveal>
          <MinutesReveal delayMs={80}>
            <MinutesCategoryPricing />
          </MinutesReveal>
        </div>
      </section>

      {/* Combos */}
      <section
        id="combos"
        className="scroll-mt-24 bg-brand-cream/60 py-16 md:py-20"
      >
        <div className="mx-auto max-w-6xl px-6">
          <MinutesReveal>
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
                Photography + reels
              </p>
              <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta-deep md:text-4xl">
                Combo packages
              </h2>
            </div>
          </MinutesReveal>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {MINUTES_COMBO_PACKAGES.map((pkg, i) => (
              <MinutesReveal key={pkg.id} delayMs={i * 70}>
                <article
                  className={`minutes-lift flex h-full flex-col rounded-2xl border bg-white p-5 ${
                    pkg.featured
                      ? "border-brand-magenta"
                      : "border-brand-line"
                  }`}
                >
                  <h3 className="font-heading text-base font-semibold text-brand-magenta-deep">
                    {pkg.name}
                  </h3>
                  <p className="mt-2 font-heading text-xl font-bold text-brand-magenta">
                    {formatMinutesPrice(pkg)}
                  </p>
                  <ul className="mt-4 flex flex-1 flex-col gap-2">
                    {pkg.includes.map((line) => (
                      <li
                        key={line}
                        className="flex items-start gap-2 text-xs text-brand-gray"
                      >
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-magenta" />
                        {line}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={minutesBookingHref({ packageName: pkg.name })}
                    className="mt-5 inline-flex items-center justify-center gap-1 rounded-full bg-brand-magenta px-3 py-2 text-xs font-semibold text-white hover:bg-brand-magenta-deep"
                  >
                    Book combo
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </article>
              </MinutesReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Photographer Now */}
      <section
        id="photographer-now"
        className="scroll-mt-24 relative overflow-hidden bg-white py-16 md:py-20"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(240,98,146,0.18), transparent 70%)",
          }}
        />
        <MinutesReveal>
          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
              Instant booking
            </p>
            <h2 className="mt-3 font-wedding-display text-3xl font-semibold text-brand-magenta-deep md:text-4xl">
              Photographer Now
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-brand-gray">
              Starting {formatInr(MINUTES_NOW_PACKAGE.price)} — Location →
              Service → Duration → Pay → Photographer Assigned. Express pricing
              shown before payment when supply allows.
            </p>
            <ul className="mx-auto mt-6 max-w-xl space-y-2 text-left text-sm text-brand-gray">
              {MINUTES_NOW_PACKAGE.includes.map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-magenta" />
                  {line}
                </li>
              ))}
            </ul>
            <Link
              href={minutesBookingHref({
                packageName: MINUTES_NOW_PACKAGE.name,
              })}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-magenta px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_36px_-16px_rgba(216,27,96,0.85)] transition hover:bg-brand-magenta-deep hover:scale-[1.02]"
            >
              <Zap className="h-4 w-4" />
              Book Photographer Now
            </Link>
          </div>
        </MinutesReveal>
      </section>

      {/* Journey */}
      <section
        id="journey"
        className="scroll-mt-24 bg-brand-cream/70 py-16 md:py-20"
      >
        <div className="mx-auto max-w-6xl px-6">
          <MinutesReveal>
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
                Customer journey
              </p>
              <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta-deep md:text-4xl">
                From open to rate
              </h2>
            </div>
          </MinutesReveal>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MINUTES_FLOW.map((item, i) => {
              const Icon = FLOW_ICONS[i] ?? Camera;
              return (
                <MinutesReveal key={item.step} delayMs={(i % 3) * 60}>
                  <li className="minutes-lift flex h-full gap-4 rounded-2xl border border-brand-line bg-white p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-magenta/10 text-brand-magenta">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-brand-magenta">
                        Step {item.step}
                      </p>
                      <h3 className="mt-1 font-heading text-sm font-semibold text-brand-magenta-deep">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-brand-gray">
                        {item.body}
                      </p>
                    </div>
                  </li>
                </MinutesReveal>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Matching */}
      <section
        id="pipeline"
        className="scroll-mt-24 bg-white py-16 md:py-20"
      >
        <div className="mx-auto max-w-6xl px-6">
          <MinutesReveal>
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
                Assignment engine
              </p>
              <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta-deep md:text-4xl">
                How photographers are matched
              </h2>
            </div>
          </MinutesReveal>
          <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MINUTES_MATCHING.map((row, i) => (
              <MinutesReveal key={row.factor} delayMs={i * 50}>
                <div className="flex items-center justify-between rounded-xl border border-brand-line bg-brand-cream/50 px-4 py-3">
                  <span className="text-sm font-medium text-brand-magenta-deep">
                    {row.factor}
                  </span>
                  <span className="text-sm font-bold text-brand-magenta">
                    {row.weight}
                  </span>
                </div>
              </MinutesReveal>
            ))}
          </div>
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MINUTES_PIPELINE.map((item, i) => (
              <MinutesReveal key={item.title} delayMs={(i % 3) * 60}>
                <li className="flex items-start gap-3 rounded-xl border border-brand-line bg-white px-4 py-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-magenta text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-brand-magenta-deep">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-xs text-brand-gray">{item.body}</p>
                  </div>
                </li>
              </MinutesReveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Photographers */}
      <section className="bg-brand-cream/60 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <MinutesReveal>
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
                Verified network
              </p>
              <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta-deep md:text-4xl">
                Photographers for your job
              </h2>
            </div>
          </MinutesReveal>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {MINUTES_PHOTOGRAPHERS.map((p, i) => (
              <MinutesReveal key={p.id} delayMs={i * 70}>
                <li className="minutes-lift h-full rounded-2xl border border-brand-line bg-white p-5">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-magenta text-sm font-bold text-white">
                    {p.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <h3 className="font-heading text-base font-semibold text-brand-magenta-deep">
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
              </MinutesReveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="scroll-mt-24 bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <MinutesReveal>
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
                Gallery
              </p>
              <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta-deep md:text-4xl">
                Real jobs, real delivery
              </h2>
            </div>
          </MinutesReveal>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MINUTES_GALLERY.map((shot, i) => (
              <MinutesReveal key={shot.src + shot.label} delayMs={(i % 3) * 70}>
                <li className="group relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src={shot.src}
                    alt={shot.label}
                    fill
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-magenta-deep/70 to-transparent p-4">
                    <p className="text-sm font-medium text-white">{shot.label}</p>
                  </div>
                </li>
              </MinutesReveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Availability */}
      <section
        id="availability"
        className="scroll-mt-24 bg-brand-cream/70 py-16 md:py-20"
      >
        <div className="mx-auto max-w-3xl px-6">
          <MinutesReveal>
            <div className="mb-8 text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
                Instant booking
              </p>
              <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta-deep md:text-4xl">
                Occasion → location → date → package
              </h2>
            </div>
          </MinutesReveal>
          <MinutesReveal delayMs={100}>
            <MinutesSearchBar variant="panel" />
          </MinutesReveal>
        </div>
      </section>

      {/* Reviews marquee */}
      <section id="reviews" className="scroll-mt-24 bg-white py-16 md:py-20">
        <div className="mx-auto mb-10 max-w-2xl px-6 text-center">
          <MinutesReveal>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
              What customers say
            </p>
            <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta-deep md:text-4xl">
              Loved by families &amp; brands
            </h2>
          </MinutesReveal>
        </div>
        <MinutesMarquee speed={45}>
          {MINUTES_REVIEWS.map((r) => (
            <article
              key={r.name}
              className="mx-3 w-[min(22rem,80vw)] shrink-0 rounded-2xl border border-brand-line bg-brand-cream/50 p-5 sm:mx-4"
            >
              <div className="mb-3 flex gap-0.5 text-brand-magenta">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-brand-gray">
                &ldquo;{r.quote}&rdquo;
              </p>
              <p className="mt-4 text-sm font-semibold text-brand-magenta-deep">
                {r.name}
              </p>
              <p className="text-xs text-brand-gray">{r.city}</p>
            </article>
          ))}
        </MinutesMarquee>
        <div className="mt-6">
          <MinutesMarquee speed={50} reverse>
            {[...MINUTES_REVIEWS].reverse().map((r) => (
              <article
                key={`rev-${r.name}`}
                className="mx-3 w-[min(22rem,80vw)] shrink-0 rounded-2xl border border-brand-magenta/20 bg-white p-5 sm:mx-4"
              >
                <p className="text-sm leading-relaxed text-brand-gray">
                  &ldquo;{r.quote}&rdquo;
                </p>
                <p className="mt-4 text-sm font-semibold text-brand-magenta">
                  {r.name} · {r.city}
                </p>
              </article>
            ))}
          </MinutesMarquee>
        </div>
      </section>

      {/* Blueprint + roadmap */}
      <section className="bg-brand-cream/60 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <MinutesReveal>
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
                Launch blueprint
              </p>
              <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta-deep md:text-4xl">
                How a booking runs end to end
              </h2>
            </div>
          </MinutesReveal>
          <ol className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MINUTES_BLUEPRINT.map((item, i) => (
              <MinutesReveal key={`${item.role}-${i}`} delayMs={(i % 4) * 50}>
                <li className="rounded-2xl border border-brand-line bg-white p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-brand-magenta">
                    {item.role}
                  </p>
                  <p className="mt-2 text-sm text-brand-gray">{item.action}</p>
                </li>
              </MinutesReveal>
            ))}
          </ol>
          <div className="grid gap-6 md:grid-cols-2">
            {MINUTES_PHASES.map((phase, idx) => (
              <MinutesReveal key={phase.name} delayMs={idx * 80}>
                <div className="rounded-2xl border border-brand-line bg-white p-6">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-brand-magenta">
                    Phase {idx + 1}
                  </p>
                  <h3 className="mt-2 font-heading text-base font-semibold text-brand-magenta-deep">
                    {phase.name.replace(/^Phase \d+ — /, "")}
                  </h3>
                  <ul className="mt-4 space-y-2">
                    {phase.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-brand-gray"
                      >
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-magenta" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </MinutesReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-white py-16 md:py-20">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 50% 100%, rgba(216,27,96,0.16), transparent 65%)",
          }}
        />
        <MinutesReveal>
          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
              Ready when you are
            </p>
            <h2 className="mt-3 font-wedding-display text-3xl font-semibold text-brand-magenta-deep md:text-4xl">
              Whatever the occasion, Wedyora can get you a photographer from
              ₹1,999
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={minutesBookingHref({ packageName: "Standard" })}
                className="inline-flex items-center gap-2 rounded-full bg-brand-magenta px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_36px_-16px_rgba(216,27,96,0.85)] transition hover:bg-brand-magenta-deep hover:scale-[1.02]"
              >
                Book Standard · {formatInr(2999)}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#availability"
                className="inline-flex items-center gap-2 rounded-full border border-brand-magenta/30 px-6 py-3 text-sm font-semibold text-brand-magenta transition hover:bg-brand-magenta/5"
              >
                <Calendar className="h-4 w-4" />
                Check availability
              </Link>
            </div>
          </div>
        </MinutesReveal>
      </section>

      <style>{`
        .minutes-page {
          --minutes-pink: #d81b60;
        }
        .minutes-reveal {
          opacity: 0;
          transform: translateY(22px);
          transition:
            opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .minutes-reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .minutes-marquee {
          overflow: hidden;
          mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
        }
        .minutes-marquee-track {
          display: flex;
          width: max-content;
          animation: minutes-marquee var(--minutes-marquee-duration, 40s) linear infinite;
          animation-direction: var(--minutes-marquee-direction, normal);
        }
        .minutes-marquee-group {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        .minutes-marquee:hover .minutes-marquee-track {
          animation-play-state: paused;
        }
        @keyframes minutes-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .minutes-hero-copy {
          animation: minutes-fade-up 0.85s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .minutes-hero-visual {
          animation: minutes-fade-up 0.95s cubic-bezier(0.22, 1, 0.36, 1) 0.12s both;
        }
        .minutes-float {
          animation: minutes-float 5.5s ease-in-out infinite;
        }
        .minutes-badge {
          animation: minutes-fade-up 1s cubic-bezier(0.22, 1, 0.36, 1) 0.35s both;
        }
        @keyframes minutes-fade-up {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes minutes-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .minutes-lift {
          transition:
            transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.35s ease,
            border-color 0.35s ease;
        }
        .minutes-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 22px 44px -28px rgba(216, 27, 96, 0.45);
          border-color: rgba(216, 27, 96, 0.28);
        }
        @media (prefers-reduced-motion: reduce) {
          .minutes-reveal,
          .minutes-hero-copy,
          .minutes-hero-visual,
          .minutes-badge,
          .minutes-float,
          .minutes-lift,
          .minutes-marquee-track {
            animation: none !important;
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}
