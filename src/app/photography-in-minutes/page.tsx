import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  Clapperboard,
  Check,
  ArrowRight,
} from "lucide-react";
import {
  MINUTES_FLOW,
  MINUTES_OFFERINGS,
  MINUTES_PACKAGES,
  MINUTES_PIPELINE,
  formatInr,
  minutesBookingHref,
} from "@/lib/minutes-content";

export const metadata = {
  title: "Photography in Minutes | Wedyora",
  description:
    "Wedyora Minutes — our in-house photography and content team. Book candid coverage, cinematic films, reels, and albums through Wedyora.",
};

export default function PhotographyInMinutesPage() {
  return (
    <div className="font-wedding-sans">
      <style>{`
        @keyframes minutesFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes minutesKenBurns {
          from { transform: scale(1); }
          to { transform: scale(1.06); }
        }
        .minutes-hero-copy > * {
          animation: minutesFadeUp 0.85s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .minutes-hero-copy > *:nth-child(1) { animation-delay: 0.12s; }
        .minutes-hero-copy > *:nth-child(2) { animation-delay: 0.28s; }
        .minutes-hero-copy > *:nth-child(3) { animation-delay: 0.42s; }
        .minutes-hero-copy > *:nth-child(4) { animation-delay: 0.56s; }
        .minutes-hero-media {
          animation: minutesKenBurns 16s ease-out forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .minutes-hero-copy > *,
          .minutes-hero-media {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Hero */}
      <section className="relative z-0 min-h-[min(78vh,720px)] overflow-hidden text-white md:min-h-[82vh]">
        <div className="absolute inset-0 bg-brand-black">
          <Image
            src="/images/minutes/photography-in-minutes.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="minutes-hero-media object-cover object-center"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20"
            aria-hidden
          />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[min(78vh,720px)] max-w-6xl flex-col justify-end px-4 pb-12 pt-20 sm:px-6 sm:pb-16 md:min-h-[82vh] md:justify-center md:pb-24">
          <div className="minutes-hero-copy max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold-bright">
              Wedyora Minutes
            </p>
            <h1 className="mt-3 font-wedding-display text-[1.85rem] font-semibold leading-[1.15] text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.65)] sm:text-4xl md:text-5xl">
              Photography in Minutes
            </h1>
            <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-white/90 [text-shadow:0_1px_16px_rgba(0,0,0,0.7)] sm:text-base md:text-lg">
              Our in-house photography and content team — book through Wedyora,
              shoot with Minutes, and get quality delivery from one platform.
            </p>
            <div className="mt-7 flex w-full flex-col gap-3 sm:mt-9 sm:w-auto sm:flex-row sm:items-center">
              <Link
                href="#packages"
                className="inline-flex w-full items-center justify-center rounded-full bg-brand-button px-7 py-3.5 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-button-dark sm:w-auto md:text-base"
              >
                View packages
              </Link>
              <Link
                href={minutesBookingHref()}
                className="inline-flex w-full items-center justify-center rounded-full border border-white/45 bg-white/10 px-7 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:w-auto md:text-base"
              >
                Book Photography
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Formula strip */}
      <section className="border-b border-brand-line bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8 text-center md:py-10">
          <p className="font-wedding-display text-lg font-semibold text-brand-magenta md:text-2xl">
            Wedyora marketplace + Wedyora Minutes execution = complete wedding
            photography
          </p>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-brand-gray">
            Customers book on Wedyora. Minutes executes the shoot, edit, QC, and
            delivery — so quality stays consistent end to end.
          </p>
        </div>
      </section>

      {/* Offerings */}
      <section className="bg-brand-cream py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
              What we shoot
            </p>
            <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta md:text-4xl">
              Coverage for every moment
            </h2>
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

      {/* Booking flow */}
      <section className="border-t border-brand-line bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
              Customer booking flow
            </p>
            <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta md:text-4xl">
              From select to confirmed
            </h2>
          </div>
          <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {MINUTES_FLOW.map((item) => (
              <li key={item.step} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-button text-sm font-bold text-brand-black">
                  {item.step}
                </span>
                <div>
                  <h3 className="font-heading text-base font-semibold text-brand-black">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-brand-gray">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Packages */}
      <section
        id="packages"
        className="scroll-mt-24 border-t border-brand-line bg-brand-cream py-16 md:py-20"
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
                  href={minutesBookingHref(pkg.name)}
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

      {/* Execution pipeline */}
      <section className="border-t border-brand-line bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
                How Minutes delivers
              </p>
              <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta md:text-4xl">
                Booked on Wedyora. Executed by Minutes.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-brand-gray md:text-base">
                After you book, the Minutes ops team assigns shooters, captures
                the day, edits, runs a quality check, and delivers your gallery
                — while Wedyora remains your single point of contact.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-line bg-brand-cream px-3 py-1.5 text-xs font-medium text-brand-black">
                  <Camera className="h-3.5 w-3.5 text-brand-magenta" />
                  In-house team
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-line bg-brand-cream px-3 py-1.5 text-xs font-medium text-brand-black">
                  <Clapperboard className="h-3.5 w-3.5 text-brand-magenta" />
                  Photo + film
                </span>
              </div>
            </div>

            <ol className="grid gap-3 sm:grid-cols-2">
              {MINUTES_PIPELINE.map((label, i) => (
                <li
                  key={label}
                  className="flex items-center gap-3 rounded-xl border border-brand-line bg-brand-cream/60 px-4 py-3"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-magenta text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-brand-black">
                    {label}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-brand-chrome text-white">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center md:py-20">
          <h2 className="font-wedding-display text-3xl font-semibold md:text-4xl">
            Ready to book Minutes?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/75 md:text-base">
            Tell us your date and city — we&rsquo;ll match a Minutes
            photographer and confirm pricing before any advance is charged.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={minutesBookingHref()}
              className="inline-flex w-full items-center justify-center rounded-full bg-brand-button px-8 py-3.5 text-sm font-semibold text-brand-black hover:bg-brand-button-dark sm:w-auto"
            >
              Start booking
            </Link>
            <Link
              href="/services"
              className="inline-flex w-full items-center justify-center rounded-full border border-white/35 px-8 py-3.5 text-sm font-medium text-white hover:bg-white/10 sm:w-auto"
            >
              Browse all services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
