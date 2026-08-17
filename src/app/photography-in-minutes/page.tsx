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
} from "lucide-react";
import MinutesSearchBar from "@/components/minutes-search-bar";
import MinutesCategoryPricing from "@/components/minutes-category-pricing";
import {
  MINUTES_AUDIENCES,
  MINUTES_BLUEPRINT,
  MINUTES_CATEGORIES,
  MINUTES_COMBO_PACKAGES,
  MINUTES_CORE_PACKAGES,
  MINUTES_FLOW,
  MINUTES_GALLERY,
  MINUTES_MATCHING,
  MINUTES_MODULES,
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
    "Whatever the occasion, book a photographer from ₹1,999. Instant photography, reels, family, religious functions, small events and business content. Weddings in Phase 2.",
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
    <div id="top" className="font-wedding-sans">
      {/* Hero — report cover message */}
      <section className="relative z-0 min-h-[min(92vh,860px)] w-full overflow-hidden bg-[#1a0a12] text-white">
        <Image
          src="/images/minutes/photography-in-minutes-hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center animate-[minutes-hero-zoom_18s_ease-out_forwards]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30"
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex min-h-[min(92vh,860px)] max-w-6xl flex-col justify-end gap-8 px-4 pb-10 pt-24 sm:px-6 sm:pb-14 md:justify-center md:pb-16">
          <div className="max-w-3xl animate-[minutes-fade-up_0.8s_ease-out_both]">
            <p className="font-wedding-display text-3xl font-semibold tracking-tight text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.65)] sm:text-4xl md:text-5xl">
              Wedyora
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold-bright">
              Photography in Minutes · Phase 1
            </p>
            <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.14em] text-white/75 sm:text-xs">
              Instant Photography · Reels · Family · Religious Functions · Small
              Events · Business Content
            </p>
            <h1 className="mt-4 font-wedding-display text-[1.55rem] font-semibold leading-[1.15] text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.65)] sm:text-3xl md:text-4xl">
              Whatever the occasion, book a photographer from{" "}
              <span className="text-brand-gold-bright">₹1,999</span>
            </h1>
            <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-white/90 [text-shadow:0_1px_16px_rgba(0,0,0,0.7)] sm:text-base">
              Choose an occasion, location, date/time and package. Wedyora
              confirms availability, collects payment and assigns a verified
              photographer. Wedding services launch in Phase 2.
            </p>
          </div>

          <div className="w-full max-w-4xl animate-[minutes-fade-up_0.9s_ease-out_0.12s_both]">
            <MinutesSearchBar variant="hero" />
          </div>

          <div className="flex flex-wrap gap-2 animate-[minutes-fade-up_1s_ease-out_0.2s_both]">
            <Link
              href="#occasions"
              className="rounded-full bg-brand-button px-3.5 py-1.5 text-xs font-semibold text-brand-black"
            >
              Book Now
            </Link>
            <Link
              href="#photographer-now"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/20"
            >
              <Zap className="h-3.5 w-3.5" />
              Photographer Now · from ₹2,499
            </Link>
          </div>
        </div>
      </section>

      {/* Executive summary strip */}
      <section className="border-b border-brand-line bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8 md:py-10">
          <p className="text-center font-wedding-display text-lg font-semibold text-brand-magenta md:text-2xl">
            Book a photographer in minutes — photography + instant reels
          </p>
          <p className="mx-auto mt-3 max-w-3xl text-center text-sm leading-relaxed text-brand-gray">
            Phase 1 makes photography and short-form reels bookable as a
            standardized service, not a traditional freelancer marketplace.
            Entry price ₹1,999. Core packages Basic ₹1,999 · Standard ₹2,999 ·
            Premium ₹4,999.
          </p>
        </div>
      </section>

      {/* USPs — report §5 */}
      <section className="border-b border-brand-line bg-brand-cream py-14 md:py-16">
        <div className="mx-auto max-w-6xl px-6">
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
            Why Wedyora Minutes
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MINUTES_USPS.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 border-t border-brand-magenta/25 pt-3 text-sm text-brand-gray"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-magenta" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Target customers — report §4 */}
      <section className="border-b border-brand-line bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
              Who it&apos;s for
            </p>
            <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta md:text-4xl">
              Target customers
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead>
                <tr className="border-b border-brand-line text-xs uppercase tracking-wide text-brand-gray">
                  <th className="py-3 pr-4 font-semibold">Customer</th>
                  <th className="py-3 pr-4 font-semibold">Primary need</th>
                  <th className="py-3 font-semibold">Wedyora proposition</th>
                </tr>
              </thead>
              <tbody>
                {MINUTES_AUDIENCES.map((row) => (
                  <tr key={row.group} className="border-b border-brand-line/70">
                    <td className="py-3 pr-4 font-semibold text-brand-black">
                      {row.group}
                    </td>
                    <td className="py-3 pr-4 text-brand-gray">{row.need}</td>
                    <td className="py-3 text-brand-gray">{row.proposition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Occasions overview — report §3 */}
      <section
        id="occasions"
        className="scroll-mt-24 border-b border-brand-line bg-brand-cream py-16 md:py-20"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
              Phase 1 service scope
            </p>
            <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta md:text-4xl">
              Occasions we cover now
            </h2>
            <p className="mt-3 text-sm text-brand-gray">
              Wedding photography is intentionally excluded from Phase 1 and
              will launch after the operating model is stable.
            </p>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {MINUTES_CATEGORIES.map((item) => (
              <li key={item.id} className="border-t border-brand-magenta/25 pt-4">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-heading text-sm font-semibold text-brand-black">
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
            ))}
          </ul>
        </div>
      </section>

      {/* Core packages — report §6 */}
      <section
        id="core-packages"
        className="scroll-mt-24 border-b border-brand-line bg-white py-16 md:py-20"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
              Standard photography packages
            </p>
            <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta md:text-4xl">
              Basic · Standard · Premium
            </h2>
            <p className="mt-3 text-sm text-brand-gray">
              Basic is the acquisition offer. Standard ₹2,999 is Most Popular.
              Premium upgrades coverage and adds a reel.
            </p>
          </div>

          <div className="mb-8 overflow-x-auto">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead>
                <tr className="border-b border-brand-line text-xs uppercase tracking-wide text-brand-gray">
                  <th className="py-3 pr-3 font-semibold">Package</th>
                  <th className="py-3 pr-3 font-semibold">Price</th>
                  <th className="py-3 pr-3 font-semibold">Coverage</th>
                  <th className="py-3 pr-3 font-semibold">Edited</th>
                  <th className="py-3 pr-3 font-semibold">Raw</th>
                  <th className="py-3 font-semibold">Reel</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-brand-line/70">
                  <td className="py-3 pr-3 font-semibold">Basic</td>
                  <td className="py-3 pr-3">{formatInr(1999)}</td>
                  <td className="py-3 pr-3 text-brand-gray">
                    1 photographer · 1.5 hours
                  </td>
                  <td className="py-3 pr-3">20</td>
                  <td className="py-3 pr-3">Up to 100</td>
                  <td className="py-3">—</td>
                </tr>
                <tr className="border-b border-brand-line/70 bg-brand-cream/40">
                  <td className="py-3 pr-3 font-semibold">
                    Standard{" "}
                    <span className="text-[10px] font-bold uppercase text-brand-orange-dark">
                      Most popular
                    </span>
                  </td>
                  <td className="py-3 pr-3 font-semibold">{formatInr(2999)}</td>
                  <td className="py-3 pr-3 text-brand-gray">
                    1 photographer · 2.5 hours
                  </td>
                  <td className="py-3 pr-3">40</td>
                  <td className="py-3 pr-3">Unlimited</td>
                  <td className="py-3">—</td>
                </tr>
                <tr className="border-b border-brand-line/70">
                  <td className="py-3 pr-3 font-semibold">Premium</td>
                  <td className="py-3 pr-3">{formatInr(4999)}</td>
                  <td className="py-3 pr-3 text-brand-gray">
                    1 photographer · 4 hours
                  </td>
                  <td className="py-3 pr-3">100</td>
                  <td className="py-3 pr-3">Unlimited</td>
                  <td className="py-3">1 Reel</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {MINUTES_CORE_PACKAGES.map((pkg) => (
              <article
                key={pkg.id}
                className={`flex flex-col border-t-2 p-5 ${
                  pkg.featured
                    ? "border-brand-gold-bright bg-brand-cream/40"
                    : "border-brand-magenta/35"
                }`}
              >
                <h3 className="font-wedding-display text-xl font-semibold text-brand-magenta">
                  {pkg.name}
                </h3>
                <p className="mt-2 font-heading text-2xl font-bold text-brand-black">
                  {formatMinutesPrice(pkg)}
                </p>
                <ul className="mt-4 flex flex-1 flex-col gap-2">
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
                  className="mt-5 inline-flex items-center justify-center gap-1.5 rounded-full bg-brand-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-charcoal"
                >
                  Book {pkg.name}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Complete category pricing — report §7 */}
      <section
        id="category-pricing"
        className="scroll-mt-24 border-b border-brand-line bg-brand-cream py-16 md:py-20"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
              Complete category pricing
            </p>
            <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta md:text-4xl">
              Every occasion rate card
            </h2>
            <p className="mt-3 text-sm text-brand-gray">
              Select a category to see the exact packages and inclusions from
              the Phase 1 project report.
            </p>
          </div>
          <MinutesCategoryPricing />
        </div>
      </section>

      {/* Combos — report §8 */}
      <section
        id="combos"
        className="scroll-mt-24 border-b border-brand-line bg-white py-16 md:py-20"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
              Photography + reels
            </p>
            <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta md:text-4xl">
              Combo packages
            </h2>
            <p className="mt-3 text-sm text-brand-gray">
              Designed to increase average order value by combining photography
              and short-form video.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {MINUTES_COMBO_PACKAGES.map((pkg) => (
              <article
                key={pkg.id}
                className={`flex flex-col border-t-2 p-5 ${
                  pkg.featured
                    ? "border-brand-gold-bright"
                    : "border-brand-magenta/35"
                }`}
              >
                <h3 className="font-heading text-base font-semibold text-brand-black">
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
                  className="mt-5 inline-flex items-center justify-center gap-1 rounded-full bg-brand-black px-3 py-2 text-xs font-semibold text-white hover:bg-brand-charcoal"
                >
                  Book combo
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Photographer Now — report §8.1 */}
      <section
        id="photographer-now"
        className="scroll-mt-24 border-b border-brand-line bg-brand-magenta py-16 text-white md:py-20"
      >
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold-bright">
            Instant booking
          </p>
          <h2 className="mt-3 font-wedding-display text-3xl font-semibold md:text-4xl">
            Photographer Now
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/85">
            Starting {formatInr(MINUTES_NOW_PACKAGE.price)} — Location → Service
            → Duration → Pay → Photographer Assigned. Used only when a verified
            photographer is available within the required service radius.
            Express pricing is shown and accepted before payment.
          </p>
          <ul className="mx-auto mt-6 max-w-xl space-y-2 text-left text-sm text-white/85">
            {MINUTES_NOW_PACKAGE.includes.map((line) => (
              <li key={line} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold-bright" />
                {line}
              </li>
            ))}
          </ul>
          <Link
            href={minutesBookingHref({
              packageName: MINUTES_NOW_PACKAGE.name,
            })}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-button px-6 py-3 text-sm font-semibold text-brand-black hover:bg-brand-button-dark"
          >
            <Zap className="h-4 w-4" />
            Book Photographer Now
          </Link>
        </div>
      </section>

      {/* Customer journey — report §9 */}
      <section
        id="journey"
        className="scroll-mt-24 border-b border-brand-line bg-white py-16 md:py-20"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
              Customer journey
            </p>
            <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta md:text-4xl">
              From open to rate
            </h2>
          </div>
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {MINUTES_FLOW.map((item, i) => {
              const Icon = FLOW_ICONS[i] ?? Camera;
              return (
                <li
                  key={item.step}
                  className="flex gap-4 border-t border-brand-line pt-4"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-button text-brand-black">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-brand-magenta">
                      Step {item.step}
                    </p>
                    <h3 className="mt-1 font-heading text-sm font-semibold text-brand-black">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-brand-gray">
                      {item.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Matching + ops */}
      <section
        id="pipeline"
        className="scroll-mt-24 border-b border-brand-line bg-brand-cream py-16 md:py-20"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
              Assignment engine
            </p>
            <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta md:text-4xl">
              How photographers are matched
            </h2>
            <p className="mt-3 text-sm text-brand-gray">
              Rule-based matching for launch. Eligibility checked first:
              category, date/time, service radius, package capability and vendor
              status.
            </p>
          </div>
          <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MINUTES_MATCHING.map((row) => (
              <div
                key={row.factor}
                className="flex items-center justify-between border-t border-brand-line bg-white/70 px-4 py-3"
              >
                <span className="text-sm font-medium text-brand-black">
                  {row.factor}
                </span>
                <span className="text-sm font-bold text-brand-magenta">
                  {row.weight}
                </span>
              </div>
            ))}
          </div>
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MINUTES_PIPELINE.map((item, i) => (
              <li
                key={item.title}
                className="flex items-start gap-3 border-t border-brand-line bg-white/70 px-4 py-4"
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

      {/* Modules */}
      <section className="border-b border-brand-line bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
              Product modules
            </p>
            <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta md:text-4xl">
              Everything connected
            </h2>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {MINUTES_MODULES.map((mod) => (
              <li key={mod.id}>
                <Link
                  href={mod.href}
                  className="flex h-full flex-col border-t border-brand-magenta/30 pt-3 hover:border-brand-magenta"
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
      <section className="border-b border-brand-line bg-brand-cream py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
              Verified network
            </p>
            <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta md:text-4xl">
              Photographers for your job
            </h2>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {MINUTES_PHOTOGRAPHERS.map((p) => (
              <li key={p.id} className="border-t border-brand-line bg-white p-5">
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
              Sample Moments work
            </h2>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MINUTES_GALLERY.map((shot) => (
              <li
                key={shot.src + shot.label}
                className="group relative aspect-[4/3] overflow-hidden"
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

      {/* Availability */}
      <section
        id="availability"
        className="scroll-mt-24 border-b border-brand-line bg-brand-cream py-16 md:py-20"
      >
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-8 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
              Search / availability
            </p>
            <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta md:text-4xl">
              Occasion → location → date → package
            </h2>
          </div>
          <MinutesSearchBar variant="panel" />
        </div>
      </section>

      {/* Launch blueprint — report §33 */}
      <section className="border-b border-brand-line bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
              Launch blueprint
            </p>
            <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta md:text-4xl">
              How a booking runs end to end
            </h2>
          </div>
          <ol className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MINUTES_BLUEPRINT.map((item, i) => (
              <li key={`${item.role}-${i}`} className="border-t border-brand-line pt-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-magenta">
                  {item.role}
                </p>
                <p className="mt-2 text-sm text-brand-gray">{item.action}</p>
              </li>
            ))}
          </ol>

          <div className="mb-10 grid gap-6 md:grid-cols-3">
            <div className="border-t border-brand-line pt-5">
              <h3 className="font-heading text-sm font-semibold text-brand-black">
                Unit economics (illustrative)
              </h3>
              <p className="mt-3 text-2xl font-bold text-brand-magenta">
                {formatInr(2999)}
              </p>
              <p className="mt-1 text-xs text-brand-gray">Example Standard booking</p>
              <ul className="mt-4 space-y-2 text-sm text-brand-gray">
                <li>Illustrative 20% share · {formatInr(600)}</li>
                <li>Vendor share · {formatInr(2399)}</li>
                <li>Final commission set after pilot jobs</li>
              </ul>
            </div>
            <div className="border-t border-brand-line pt-5 md:col-span-2">
              <h3 className="font-heading text-sm font-semibold text-brand-black">
                Roadmap
              </h3>
              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                {MINUTES_PHASES.map((phase, idx) => (
                  <div key={phase.name}>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-brand-magenta">
                      Phase {idx + 1}
                    </p>
                    <p className="mt-1 font-heading text-sm font-semibold text-brand-black">
                      {phase.name.replace(/^Phase \d+ — /, "")}
                    </p>
                    <ul className="mt-3 space-y-1.5">
                      {phase.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-xs text-brand-gray"
                        >
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-magenta" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section
        id="reviews"
        className="scroll-mt-24 border-b border-brand-line bg-brand-cream py-16 md:py-20"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
              Reviews
            </p>
            <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta md:text-4xl">
              What customers say
            </h2>
          </div>
          <ul className="grid gap-6 md:grid-cols-3">
            {MINUTES_REVIEWS.map((r) => (
              <li key={r.name} className="border-t border-brand-magenta/30 pt-5">
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

      {/* Final CTA — report recommended message */}
      <section className="bg-brand-magenta py-16 text-white md:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold-bright">
            Recommended customer message
          </p>
          <h2 className="mt-3 font-wedding-display text-3xl font-semibold md:text-4xl">
            Whatever the occasion, Wedyora can get you a photographer from
            ₹1,999
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/85">
            Standardize the job. Control the vendor. Make the price transparent.
            Make booking fast.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={minutesBookingHref({ packageName: "Standard" })}
              className="inline-flex items-center gap-2 rounded-full bg-brand-button px-6 py-3 text-sm font-semibold text-brand-black hover:bg-brand-button-dark"
            >
              Book Standard · {formatInr(2999)}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#availability"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              <Calendar className="h-4 w-4" />
              Check availability
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes minutes-fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes minutes-hero-zoom {
          from { transform: scale(1.06); }
          to { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
