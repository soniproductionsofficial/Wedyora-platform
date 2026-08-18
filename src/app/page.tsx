import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import {
  ShieldCheck,
  CreditCard,
  Headset,
  CalendarCheck,
  Check,
} from "lucide-react";
import Reveal from "@/components/motion/reveal";
import { staggerDelay } from "@/components/motion/stagger";
import Marquee from "@/components/motion/marquee";

const SERVICES = [
  {
    title: "Decoration",
    slug: "decoration",
    description:
      "Mandap, stage, and floral artistry that sets the tone before guests arrive — tailored to your palette and budget.",
    image: "/images/services/decoration.jpg",
  },
  {
    title: "Photography",
    slug: "photography",
    description:
      "Candid glances, pheras, and baraat energy captured by photographers who know how an Indian wedding unfolds.",
    image: "/images/services/photography.jpg",
  },
  {
    title: "Catering",
    slug: "catering",
    description:
      "Multi-course spreads and intimate family lunches, timed and coordinated so every guest eats well.",
    image: "/images/services/catering.jpg",
  },
  {
    title: "Music",
    slug: "music",
    description:
      "Live bands, DJs, and classical sets that read the room — from ceremony stillness to reception energy.",
    image: "/images/services/music.jpg",
  },
] as const;

const HOW_IT_WORKS = [
  {
    title: "You place your request",
    body: "Tell us the service, date, city, and budget for your event.",
    icon: "📋",
  },
  {
    title: "Wedyora reviews it",
    body: "Our team checks the details and finds a verified vendor who fits.",
    icon: "🔍",
  },
  {
    title: "A vendor is assigned",
    body: "We confirm pricing with you before anything is charged.",
    icon: "👥",
  },
  {
    title: "You pay a secure deposit",
    body: "Held through Razorpay, India's trusted payment system.",
    icon: "💳",
  },
  {
    title: "Your vendor delivers",
    body: "On the day, and beyond — Wedyora stays the single point of contact.",
    icon: "✨",
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

const TRUST_TICKER = [
  "Verified vendors only",
  "Secure Razorpay payments",
  "One team, start to finish",
  "Real support, not just an app",
  "Decoration · Photography · Catering · Music",
  "Transparent pricing before you pay",
];

export default function Home() {
  return (
    <div className="wedding-home font-wedding-sans">
      <style>{`
        @keyframes heroFadeUp {
          from {
            opacity: 0;
            transform: translateY(28px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes heroKenBurns {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.08);
          }
        }

        @keyframes petalDrift {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0;
          }
          12% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(110vh) translateX(40px) rotate(280deg);
            opacity: 0;
          }
        }

        @keyframes goldShimmer {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .wedding-home .hero-media {
          animation: heroKenBurns 18s ease-out forwards;
        }

        .wedding-home .petal {
          position: absolute;
          width: 10px;
          height: 14px;
          border-radius: 50% 0 50% 50%;
          background: linear-gradient(135deg, #ff8a7a, #c4192a);
          opacity: 0;
          animation: petalDrift linear infinite;
          pointer-events: none;
        }

        .wedding-home .cta-shimmer {
          background-size: 200% 200%;
          animation: goldShimmer 4s ease infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .wedding-home .hero-media,
          .wedding-home .petal,
          .wedding-home .cta-shimmer {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Full-bleed hero — static celebration still */}
      <section className="relative z-0 min-h-[min(88vh,820px)] overflow-hidden text-white md:min-h-[92vh]">
        <div className="absolute inset-0 bg-wedding-deep">
          <Image
            src="/images/hero/wedding-celebration.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="hero-media object-cover object-[center_40%]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-black/25"
            aria-hidden
          />
        </div>

        {/* Soft petal motion */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {[12, 28, 44, 61, 77, 88].map((left, i) => (
            <span
              key={left}
              className="petal"
              style={{
                left: `${left}%`,
                top: `-${8 + i * 3}%`,
                animationDuration: `${9 + i * 1.4}s`,
                animationDelay: `${i * 1.1}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 mx-auto flex min-h-[min(88vh,820px)] max-w-6xl flex-col justify-end px-4 pb-12 pt-20 sm:px-6 sm:pb-16 sm:pt-24 md:min-h-[92vh] md:justify-center md:pb-24 md:pt-20">
          <div className="max-w-3xl">
            <h1 className="hero-in hero-in-1 font-wedding-display text-[1.85rem] font-semibold leading-[1.15] text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.65)] sm:text-3xl md:text-5xl lg:text-[3.35rem]">
              Perfect Planners for Your Special Occasions
            </h1>
            <p className="hero-in hero-in-2 mt-4 max-w-xl text-[0.95rem] leading-relaxed text-white [text-shadow:0_1px_16px_rgba(0,0,0,0.7)] sm:mt-5 sm:text-base md:text-lg">
              Weddings, engagements, birthdays, and more — verified vendors for
              decoration, photography, catering, and music, coordinated end to
              end so every celebration feels effortless.
            </p>
            <div className="hero-in hero-in-3 mt-7 flex w-full flex-col gap-3 sm:mt-9 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <Link
                href="/book"
                className="cta-shimmer inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-wedding-gold via-wedding-gold-bright to-wedding-gold px-6 py-3.5 text-sm font-semibold text-wedding-deep shadow-[0_10px_40px_rgba(212,175,55,0.35)] transition-transform duration-300 hover:scale-[1.03] sm:w-auto sm:px-8 md:text-base"
              >
                Start Planning Your Occasion
              </Link>
              <Link
                href="#services"
                className="inline-flex w-full items-center justify-center rounded-full border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 hover:border-wedding-gold-bright hover:bg-white/20 sm:w-auto md:text-base"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust ticker — Flashoot-style marquee right under the hero */}
      <section className="border-b border-wedding-gold/20 bg-white py-3.5">
        <Marquee speed={30}>
          {TRUST_TICKER.map((item) => (
            <span
              key={item}
              className="mx-3 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-brand-magenta/15 bg-brand-cream px-4 py-2 text-xs font-semibold text-brand-magenta-deep sm:mx-4 sm:text-sm"
            >
              <Check className="h-3.5 w-3.5 text-brand-magenta" />
              {item}
            </span>
          ))}
        </Marquee>
      </section>

      {/* Services grid */}
      <section
        id="services"
        className="relative scroll-mt-24 overflow-hidden bg-gradient-to-b from-[#fff8f5] via-[#f7f0fa] to-[#f3faf6] py-20 md:py-28"
      >
        <div
          className="glow pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full"
          style={{ "--glow-color": "rgba(232, 90, 79, 0.32)" } as CSSProperties}
          aria-hidden
        />
        <div
          className="glow pointer-events-none absolute -right-16 bottom-8 h-80 w-80 rounded-full"
          style={
            {
              "--glow-color": "rgba(26, 122, 92, 0.28)",
              animationDelay: "0.6s",
            } as CSSProperties
          }
          aria-hidden
        />

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-magenta">
              Our Services
            </p>
            <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta md:text-5xl">
              Everything for a joyful celebration
            </h2>
            <p className="mt-4 text-brand-gray md:text-lg">
              Four pillars of every special occasion, each matched with a
              verified specialist by the Wedyora team.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((service, i) => (
              <Reveal key={service.slug} delayMs={staggerDelay(i, 4)}>
                <article className="group h-full overflow-hidden rounded-2xl border border-wedding-gold/20 bg-white shadow-[0_18px_50px_rgba(74,28,107,0.08)] transition-all duration-500 hover:-translate-y-2 hover:border-wedding-gold/50 hover:shadow-[0_24px_60px_rgba(196,25,42,0.16)]">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-wedding-display text-xl font-semibold text-brand-magenta">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-brand-gray">
                      {service.description}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 text-center md:mt-12">
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-brand-magenta-deep via-brand-magenta to-brand-magenta-bright px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl md:text-base"
            >
              Explore more
            </Link>
          </div>
        </div>
      </section>

      {/* How Wedyora Works */}
      <section
        id="how-it-works"
        className="scroll-mt-24 border-t border-wedding-gold/20 bg-white py-20 md:py-28"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center">
            <h2 className="font-wedding-display text-3xl font-semibold text-brand-magenta md:text-4xl">
              How Wedyora Works
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-brand-gray md:text-lg">
              A seamless process from your first step to your perfect celebration
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-5 md:gap-4">
            {HOW_IT_WORKS.map((step, i) => (
              <Reveal key={step.title} delayMs={staggerDelay(i, 5)} className="text-center">
                <div className="mb-4 text-4xl" aria-hidden>
                  {step.icon}
                </div>
                <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-button text-sm font-bold text-brand-magenta">
                  {i + 1}
                </span>
                <h3 className="mt-3 font-wedding-display text-lg font-semibold text-brand-magenta">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-brand-gray md:text-sm">
                  {step.body}
                </p>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/book"
              className="inline-block rounded-full bg-gradient-to-r from-brand-magenta-deep via-brand-magenta to-brand-magenta-bright px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              Start Planning Your Occasion →
            </Link>
          </div>
        </div>
      </section>

      {/* Why Wedyora */}
      <section className="border-t border-wedding-gold/20 bg-gradient-to-b from-[#faf6ff] to-[#fff8f5] py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-12 text-center font-wedding-display text-3xl font-semibold text-brand-magenta md:text-4xl">
            Why People Choose Wedyora
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {WHY_WEDYORA.map(({ icon: Icon, title, body }, i) => (
              <Reveal key={title} delayMs={staggerDelay(i, 4)}>
                <div className="lift h-full rounded-2xl border border-wedding-gold/20 bg-white p-6">
                  <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-brand-magenta/10 text-brand-magenta">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mb-2 font-wedding-display text-lg font-semibold text-brand-magenta">
                    {title}
                  </h3>
                  <p className="text-xs leading-relaxed text-brand-gray md:text-sm">
                    {body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Vendor CTA */}
      <section className="bg-brand-chrome text-white">
        <Reveal className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h2 className="font-wedding-display text-3xl font-semibold md:text-4xl">
            Are you an event vendor?
          </h2>
          <p className="mx-auto mb-8 mt-4 max-w-xl text-white/80">
            Join Wedyora&rsquo;s verified vendor network and get matched with
            clients planning special occasions in your city.
          </p>
          <Link
            href="/vendor/apply"
            className="inline-block rounded-full bg-wedding-gold px-6 py-3 font-semibold text-wedding-deep transition-colors duration-300 hover:bg-wedding-gold-bright"
          >
            Apply as a Vendor
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
