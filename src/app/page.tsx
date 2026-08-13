import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  CreditCard,
  Headset,
  CalendarCheck,
} from "lucide-react";

const SERVICES = [
  {
    title: "Decoration",
    slug: "decoration",
    description:
      "Mandap, stage, and floral artistry that sets the tone before guests arrive — tailored to your palette and budget.",
    image: "/images/services/decoration.jpg",
    accent: "from-wedding-coral/90 to-wedding-red/90",
  },
  {
    title: "Photography",
    slug: "photography",
    description:
      "Candid glances, pheras, and baraat energy captured by photographers who know how an Indian wedding unfolds.",
    image: "/images/services/photography.jpg",
    accent: "from-wedding-purple/90 to-wedding-deep/90",
  },
  {
    title: "Catering",
    slug: "catering",
    description:
      "Multi-course spreads and intimate family lunches, timed and coordinated so every guest eats well.",
    image: "/images/services/catering.jpg",
    accent: "from-wedding-green/90 to-wedding-deep/90",
  },
  {
    title: "Music",
    slug: "music",
    description:
      "Live bands, DJs, and classical sets that read the room — from ceremony stillness to reception energy.",
    image: "/images/services/music.jpg",
    accent: "from-wedding-gold/90 to-wedding-coral/90",
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

        @keyframes cardRise {
          from {
            opacity: 0;
            transform: translateY(36px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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

        .wedding-home .hero-copy > * {
          animation: heroFadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .wedding-home .hero-copy > *:nth-child(1) { animation-delay: 0.15s; }
        .wedding-home .hero-copy > *:nth-child(2) { animation-delay: 0.32s; }
        .wedding-home .hero-copy > *:nth-child(3) { animation-delay: 0.48s; }
        .wedding-home .hero-copy > *:nth-child(4) { animation-delay: 0.64s; }

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

        .wedding-home .service-card {
          animation: cardRise 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .wedding-home .service-card:nth-child(1) { animation-delay: 0.08s; }
        .wedding-home .service-card:nth-child(2) { animation-delay: 0.18s; }
        .wedding-home .service-card:nth-child(3) { animation-delay: 0.28s; }
        .wedding-home .service-card:nth-child(4) { animation-delay: 0.38s; }

        .wedding-home .cta-shimmer {
          background-size: 200% 200%;
          animation: goldShimmer 4s ease infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .wedding-home .hero-copy > *,
          .wedding-home .hero-media,
          .wedding-home .petal,
          .wedding-home .service-card,
          .wedding-home .cta-shimmer {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Full-bleed hero */}
      <section className="relative isolate min-h-[88vh] overflow-hidden text-white md:min-h-[92vh]">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/wedding-celebration.png"
            alt="Indian wedding couple in white celebrating as guests throw yellow flower petals"
            fill
            priority
            sizes="100vw"
            className="hero-media object-cover object-[center_40%]"
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

        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-6 pb-16 pt-24 md:min-h-[92vh] md:justify-center md:pb-24 md:pt-20">
          <div className="hero-copy max-w-3xl">
            <h1 className="font-wedding-display text-3xl font-semibold leading-[1.15] text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.65)] md:text-5xl lg:text-[3.35rem]">
              Perfect Planners for Your Special Occasions
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white [text-shadow:0_1px_16px_rgba(0,0,0,0.7)] md:text-lg">
              Weddings, engagements, birthdays, and more — verified vendors for
              decoration, photography, catering, and music, coordinated end to
              end so every celebration feels effortless.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/book"
                className="cta-shimmer inline-flex items-center rounded-full bg-gradient-to-r from-wedding-gold via-wedding-gold-bright to-wedding-gold px-8 py-3.5 text-sm font-semibold text-wedding-deep shadow-[0_10px_40px_rgba(212,175,55,0.35)] transition-transform duration-300 hover:scale-[1.03] md:text-base"
              >
                Start Planning Your Occasion
              </Link>
              <Link
                href="#services"
                className="inline-flex items-center rounded-full border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 hover:border-wedding-gold-bright hover:bg-white/20 md:text-base"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section
        id="services"
        className="relative scroll-mt-24 overflow-hidden bg-gradient-to-b from-[#fff8f5] via-[#f7f0fa] to-[#f3faf6] py-20 md:py-28"
      >
        <div
          className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-wedding-coral/15 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-16 bottom-8 h-80 w-80 rounded-full bg-wedding-green/15 blur-3xl"
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
            {SERVICES.map((service) => (
              <Link
                key={service.slug}
                href="/book"
                className="service-card group relative overflow-hidden rounded-2xl border border-wedding-gold/20 bg-white shadow-[0_18px_50px_rgba(74,28,107,0.08)] transition-all duration-500 hover:-translate-y-2 hover:border-wedding-gold/50 hover:shadow-[0_24px_60px_rgba(196,25,42,0.16)]"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${service.accent} opacity-70 transition-opacity duration-500 group-hover:opacity-55`}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <h3 className="font-wedding-display text-2xl font-semibold tracking-wide">
                      {service.title}
                    </h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm leading-relaxed text-brand-gray">
                    {service.description}
                  </p>
                  <span className="mt-4 inline-flex items-center text-sm font-semibold text-brand-magenta transition-colors duration-300 group-hover:text-brand-magenta-deep">
                    Book this service
                    <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            ))}
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
              <div key={step.title} className="text-center">
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
              </div>
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
            {WHY_WEDYORA.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-wedding-gold/20 bg-white p-6 transition-shadow duration-300 hover:shadow-lg"
              >
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
            ))}
          </div>
        </div>
      </section>

      {/* Vendor CTA */}
      <section className="bg-brand-chrome text-white">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
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
        </div>
      </section>
    </div>
  );
}
