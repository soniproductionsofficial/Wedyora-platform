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
  Zap,
  BadgeCheck,
  Sparkles,
} from "lucide-react";
import MinutesSearchBar from "@/components/minutes-search-bar";
import {
  MINUTES_BENEFITS,
  MINUTES_CATEGORIES,
  MINUTES_FLOW,
  MINUTES_GALLERY,
  MINUTES_MODULES,
  MINUTES_PACKAGES,
  MINUTES_PHASES,
  MINUTES_PHOTOGRAPHERS,
  MINUTES_PIPELINE,
  MINUTES_REVIEWS,
  MINUTES_USPS,
  formatInr,
  minutesBookingHref,
} from "@/lib/minutes-content";

export const metadata = {
  title: "Photography in Minutes | Wedyora",
  description:
    "Book a verified photographer in minutes — from ₹1,999. Pooja, maternity, baby, birthdays, reels, product shoots and more. Weddings coming in Phase 2.",
};

const FLOW_ICONS = [Sparkles, MapPin, Camera, CreditCard, Users, BadgeCheck];

export default function PhotographyInMinutesPage() {
  return (
    <div id="top" className="font-wedding-sans">
      {/* Hero */}
      <section className="relative z-0 min-h-[min(92vh,860px)] w-full overflow-hidden bg-[#1a0a12] text-white">
        <Image
          src="/images/minutes/photography-in-minutes.jpg"
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
              Photography in Minutes
            </p>
            <h1 className="mt-4 font-wedding-display text-[1.65rem] font-semibold leading-[1.15] text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.65)] sm:text-3xl md:text-4xl">
              Whatever the occasion, book a photographer from{" "}
              <span className="text-brand-gold-bright">₹1,999</span>
            </h1>
            <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-white/90 [text-shadow:0_1px_16px_rgba(0,0,0,0.7)] sm:text-base">
              Choose an occasion, pick a package, pay securely — we assign a
              verified photographer. Weddings launch in Phase 2.
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
              Browse occasions
            </Link>
            <Link
              href={minutesBookingHref({ packageName: "Photographer Now" })}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/20"
            >
              <Zap className="h-3.5 w-3.5" />
              Photographer Now · from ₹2,499
            </Link>
          </div>
        </div>
      </section>

      {/* Promise strip */}
      <section className="border-b border-brand-line bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8 text-center md:py-10">
          <p className="font-wedding-display text-lg font-semibold text-brand-magenta md:text-2xl">
            Book by occasion — transparent price — verified photographer
          </p>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-brand-gray">
            Phase 1 focuses on fast, standardized photography and reels. Wedding
            categories come after the operating model is stable.
          </p>
        </div>
      </section>

      {/* USPs */}
      <section className="border-b border-brand-line bg-brand-cream py-14 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 sm:grid-cols-2 lg:grid-cols-4">
          {MINUTES_USPS.map((item) => (
            <div key={item.title} className="border-t border-brand-magenta/30 pt-4">
              <h2 className="font-heading text-sm font-semibold text-brand-black">
                {item.title}
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-brand-gray md:text-sm">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Customer journey */}
      <section className="border-b border-brand-line bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
              Customer journey
            </p>
            <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta md:text-4xl">
              Occasion → package → photographer
            </h2>
          </div>
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {MINUTES_FLOW.map((item, i) => {
              const Icon = FLOW_ICONS[i] ?? Camera;
              return (
                <li
                  key={item.step}
                  className="flex gap-4 border-t border-brand-line pt-5"
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

      {/* Occasions */}
      <section
        id="occasions"
        className="scroll-mt-24 border-b border-brand-line bg-brand-cream py-16 md:py-20"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
              Phase 1 scope
            </p>
            <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta md:text-4xl">
              Occasions we cover now
            </h2>
            <p className="mt-3 text-sm text-brand-gray md:text-base">
              Instant photography and reels for families, parents, parties,
              vehicle delivery and business content.
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
                  href={minutesBookingHref({
                    categoryId: item.id,
                    packageName: "Standard",
                  })}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-magenta hover:underline"
                >
                  Book this
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Packages */}
      <section
        id="packages"
        className="scroll-mt-24 border-b border-brand-line bg-white py-16 md:py-20"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
              Core packages
            </p>
            <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta md:text-4xl">
              Transparent pricing from ₹1,999
            </h2>
            <p className="mt-3 text-sm text-brand-gray md:text-base">
              Standard ₹2,999 is our most popular. Category-specific inclusions
              may vary — final quote is locked before payment.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {MINUTES_PACKAGES.map((pkg) => (
              <article
                key={pkg.id}
                className={`flex flex-col border-t-2 bg-brand-cream/30 p-6 ${
                  "featured" in pkg && pkg.featured
                    ? "border-brand-gold-bright"
                    : "border-brand-magenta/40"
                }`}
              >
                {"featured" in pkg && pkg.featured ? (
                  <span className="mb-3 w-fit text-[10px] font-bold uppercase tracking-wider text-brand-orange-dark">
                    Most popular
                  </span>
                ) : (
                  <span className="mb-3 h-4" aria-hidden />
                )}
                <h3 className="font-wedding-display text-xl font-semibold text-brand-magenta">
                  {pkg.name}
                </h3>
                <p className="mt-1 text-xs text-brand-gray">{pkg.tagline}</p>
                <p className="mt-4 font-heading text-2xl font-bold text-brand-black">
                  {formatInr(pkg.price)}
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
                  Book {pkg.name}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Ops pipeline */}
      <section
        id="pipeline"
        className="scroll-mt-24 border-b border-brand-line bg-brand-cream py-16 md:py-20"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
              Operating system
            </p>
            <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta md:text-4xl">
              From payment to delivery
            </h2>
            <p className="mt-3 text-sm text-brand-gray">
              Rule-based matching now; AI optimization after enough booking
              history.
            </p>
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
              Everything you need to book fast
            </h2>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {MINUTES_MODULES.map((mod) => (
              <li key={mod.id}>
                <Link
                  href={mod.href}
                  className="flex h-full flex-col border-t border-brand-magenta/30 pt-3 transition-colors hover:border-brand-magenta"
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
              Photographers matched to your job
            </h2>
            <p className="mt-3 text-sm text-brand-gray">
              Screened on portfolio, documents, service radius and reliability —
              then scored on availability, rating and distance.
            </p>
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
              Real jobs, real delivery
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
              Check availability
            </p>
            <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta md:text-4xl">
              Occasion, city, date, package
            </h2>
          </div>
          <MinutesSearchBar variant="panel" />
        </div>
      </section>

      {/* Economics + roadmap */}
      <section className="border-b border-brand-line bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
              Launch blueprint
            </p>
            <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta md:text-4xl">
              Simple Phase 1 economics
            </h2>
          </div>
          <div className="mb-12 grid gap-6 md:grid-cols-3">
            <div className="border-t border-brand-line pt-5">
              <h3 className="font-heading text-sm font-semibold text-brand-black">
                Example booking
              </h3>
              <p className="mt-3 text-2xl font-bold text-brand-magenta">
                {formatInr(2999)}
              </p>
              <p className="mt-1 text-xs text-brand-gray">Standard package</p>
              <ul className="mt-4 space-y-2 text-sm text-brand-gray">
                <li>Illustrative 20% platform share · ₹600</li>
                <li>Vendor share · ₹2,399</li>
                <li>Final commission set after pilot</li>
              </ul>
            </div>
            <div className="border-t border-brand-line pt-5">
              <h3 className="font-heading text-sm font-semibold text-brand-black">
                Revenue streams
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-brand-gray">
                <li>Booking commission</li>
                <li>Reels &amp; business content</li>
                <li>Add-ons (hours, photographer, express)</li>
                <li>Featured vendor (later)</li>
              </ul>
            </div>
            <div className="border-t border-brand-gold-bright pt-5">
              <div className="mb-2 flex items-center gap-2 text-brand-magenta">
                <Clapperboard className="h-4 w-4" />
                <h3 className="font-heading text-sm font-semibold">
                  Why this works
                </h3>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-brand-gray">
                {MINUTES_BENEFITS.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {MINUTES_PHASES.map((phase, idx) => (
              <div key={phase.name} className="border-t border-brand-line pt-5">
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
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-magenta" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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

      {/* CTA */}
      <section className="bg-brand-magenta py-16 text-white md:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold-bright">
            Ready when you are
          </p>
          <h2 className="mt-3 font-wedding-display text-3xl font-semibold md:text-4xl">
            Book a photographer in minutes
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/85">
            Whatever the occasion, Wedyora can get you a photographer from
            ₹1,999.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={minutesBookingHref({ packageName: "Standard" })}
              className="inline-flex items-center gap-2 rounded-full bg-brand-button px-6 py-3 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-button-dark"
            >
              Book Standard · {formatInr(2999)}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#availability"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
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
