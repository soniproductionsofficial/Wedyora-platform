"use client";

/**
 * Animation review — SAME Wedyora homepage layout & content, with amplified
 * motion + visible 3D. Preview only at /animation-review.
 *
 * DOES NOT modify `src/app/page.tsx`.
 *
 * ---------------------------------------------------------------------------
 * AFTER APPROVAL — swap onto the real homepage:
 * ---------------------------------------------------------------------------
 * 1. In `src/app/page.tsx`, keep the existing Supabase fetches.
 * 2. Replace the returned JSX with:
 *      <AnimationReviewExperience categories={…} vendors={…} />
 * 3. Import this module. Then delete `/animation-review` if you want.
 * ---------------------------------------------------------------------------
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ShieldCheck,
  CreditCard,
  Headset,
  CalendarCheck,
  MapPin,
  Search,
} from "lucide-react";
import { getCategoryIcon } from "@/lib/category-icons";
import ParticleBackground from "@/components/ui/particle-background";
import TiltCard from "@/components/ui/tilt-card";
import GlassContainer from "@/components/ui/glass-container";
import PageLoader from "@/components/animation-review/page-loader";
import Hero3DCanvas from "@/components/animation-review/hero-3d-canvas";
import AmbientMidground from "@/components/animation-review/ambient-midground";

export type ReviewCategory = { id: string; name: string; slug: string };
export type ReviewVendor = {
  id: string;
  business_name: string;
  city: string;
  experience_years: number | null;
  service_categories: { name: string } | null;
};

type AccentMode = "wedding" | "maternity";

const ACCENTS = {
  wedding: {
    label: "Wedding",
    accent: "#d4af6a",
    particle: "rgba(212, 175, 106, 0.65)",
    mid: "petals" as const,
    loaderLabel: "Wedding experiences",
    canvas: "#0f0c0a",
  },
  maternity: {
    label: "Maternity",
    accent: "#c4a484",
    particle: "rgba(196, 164, 132, 0.6)",
    mid: "leaks" as const,
    loaderLabel: "Maternity keepsakes",
    canvas: "#0f0c0a",
  },
};

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

function MotionIn({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={
        reduce ? false : { opacity: 0, y: 40, scale: 0.96, filter: "blur(8px)" }
      }
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ willChange: "transform, opacity, filter" }}
    >
      {children}
    </motion.div>
  );
}

export default function AnimationReviewExperience({
  categories,
  vendors,
}: {
  categories: ReviewCategory[];
  vendors: ReviewVendor[];
}) {
  const [mode, setMode] = useState<AccentMode>("wedding");
  const accent = ACCENTS[mode];
  const reduce = useReducedMotion();

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(6);

  const { scrollYProgress } = useScroll();
  const heroParallax = useTransform(scrollYProgress, [0, 0.35], reduce ? [0, 0] : [0, 80]);
  const heroScale = useTransform(scrollYProgress, [0, 0.35], reduce ? [1, 1] : [1, 1.08]);
  const midParallax = useTransform(scrollYProgress, [0, 0.35], reduce ? [0, 0] : [0, 140]);

  useEffect(() => {
    if (reduce) {
      setProgress(100);
      setLoading(false);
      return;
    }
    // Longer, more obvious loader so the motion intro is unmistakable.
    let p = 4;
    const id = window.setInterval(() => {
      p += 4 + Math.random() * 6;
      if (p >= 100) {
        setProgress(100);
        window.clearInterval(id);
        window.setTimeout(() => setLoading(false), 600);
      } else setProgress(p);
    }, 120);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <div className="relative min-h-screen bg-brand-cream text-brand-black">
      <PageLoader
        visible={loading}
        progress={progress}
        accent={accent.accent}
        canvas="#FAF9F6"
        label={accent.loaderLabel}
      />

      {/* Review chrome — proves you are on the animated preview route */}
      <div className="relative z-40 border-b border-brand-orange/40 bg-brand-orange px-4 py-3 text-center text-sm font-semibold text-white md:text-base">
        YOU ARE ON THE ANIMATED PREVIEW (/animation-review) — 3D rings + motion live here
        <span className="mx-2 text-white/50">·</span>
        <Link href="/" className="underline underline-offset-2">
          Open normal homepage
        </Link>
        <span className="mx-2 text-white/50">·</span>
        <span className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-black/20 p-0.5 align-middle text-xs font-semibold">
          {(Object.keys(ACCENTS) as AccentMode[]).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setMode(id)}
              className={`rounded-full px-3 py-1 transition-colors ${
                mode === id ? "bg-white text-brand-orange" : "text-white/80 hover:text-white"
              }`}
            >
              {ACCENTS[id].label}
            </button>
          ))}
        </span>
      </div>

      {/* ===== HERO (same structure as homepage) ===== */}
      <section className="relative min-h-[92vh] overflow-hidden luxury-gradient-dark text-white">
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{ y: heroParallax, scale: heroScale }}
        >
          <ParticleBackground density={70} color={accent.particle} />
        </motion.div>

        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{ y: midParallax }}
        >
          <AmbientMidground mode={accent.mid} accent={accent.accent} />
        </motion.div>

        {/* Visible 3D layer — right side of hero */}
        <Hero3DCanvas
          className="z-[1] opacity-95 md:translate-x-[8%] md:scale-110"
          accent={accent.accent}
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[2] opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 50% 120%, rgba(226,113,29,0.28), transparent 55%), linear-gradient(180deg, transparent 35%, rgba(15,12,10,0.65) 100%)",
          }}
        />

        <motion.div
          className="relative z-10 mx-auto max-w-6xl px-6 py-20 md:py-28"
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={loading ? { opacity: 0, y: 28 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        >
          <div className="mx-auto mb-10 max-w-3xl text-center md:mx-0 md:max-w-xl md:text-left">
            <motion.div
              className="mb-5 flex justify-center md:justify-start"
              animate={reduce ? undefined : { y: [0, -4, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-gold/35 bg-brand-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-gold">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-brand-orange opacity-60" />
                  <span className="relative h-2 w-2 rounded-full bg-brand-orange" />
                </span>
                Live Platform
              </span>
            </motion.div>

            <motion.p
              className="mb-5 font-heading text-5xl font-semibold tracking-wide text-brand-champagne md:text-6xl"
              initial={reduce ? false : { opacity: 0, letterSpacing: "0.2em" }}
              animate={loading ? undefined : { opacity: 1, letterSpacing: "0.02em" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              Wedyora
            </motion.p>

            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
              India&rsquo;s Managed Wedding Services Platform
            </p>

            <h1 className="mb-6 font-heading text-4xl font-semibold leading-[1.1] md:text-6xl">
              Find. Book.{" "}
              <motion.span
                className="text-gradient-gold italic inline-block"
                animate={reduce ? undefined : { rotate: [-1.5, 1.5, -1.5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                Celebrate.
              </motion.span>
            </h1>

            <p className="mb-10 text-base text-white/70 md:text-lg">
              Photography, decor, catering and more — every vendor on Wedyora
              is verified by our team, so you can book with confidence.
            </p>

            <div className="mb-10 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/book"
                  className="btn-luxury inline-flex rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-white hover:bg-brand-orange-dark"
                >
                  Plan Your Wedding
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/vendors"
                  className="inline-flex rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:border-brand-gold/40 hover:bg-white/10"
                >
                  Browse Vendors
                </Link>
              </motion.div>
            </div>
          </div>

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
                {categories.map((c) => (
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

          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-4 text-center md:grid-cols-4 md:gap-6">
            {[
              { icon: ShieldCheck, label: "Verified Vendors" },
              { icon: CalendarCheck, label: "Easy Booking" },
              { icon: CreditCard, label: "Secure Payments" },
              { icon: Headset, label: "Real Support" },
            ].map(({ icon: Icon, label }, i) => (
              <MotionIn key={label} delay={0.08 * i}>
                <motion.div
                  className="glass-panel-dark flex flex-col items-center gap-2 rounded-2xl px-3 py-4"
                  whileHover={{ y: -6, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-gold/30 bg-brand-gold/10">
                    <Icon className="h-5 w-5 text-brand-gold" />
                  </span>
                  <p className="text-xs font-medium text-white/75">{label}</p>
                </motion.div>
              </MotionIn>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Popular Services */}
      {categories.length > 0 && (
        <section className="border-b border-brand-line bg-brand-ivory/80">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <MotionIn>
              <h2 className="mb-8 text-center font-heading text-3xl font-semibold">
                Popular Services
              </h2>
            </MotionIn>
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((c, i) => {
                const Icon = getCategoryIcon(c.slug);
                return (
                  <MotionIn key={c.id} delay={Math.min(i * 0.04, 0.35)} className="w-24">
                    <Link
                      href={`/vendors?category=${c.slug}`}
                      className="group flex flex-col items-center gap-2"
                    >
                      <motion.span
                        className="flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-line bg-white shadow-sm"
                        whileHover={{
                          y: -8,
                          rotateY: 12,
                          boxShadow: "0 16px 30px rgba(212,175,106,0.28)",
                        }}
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        <Icon className="h-6 w-6 text-brand-orange" />
                      </motion.span>
                      <p className="text-center text-xs font-medium">{c.name}</p>
                    </Link>
                  </MotionIn>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Verified Vendors */}
      <section className="bg-brand-cream">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <MotionIn>
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-heading text-3xl font-semibold">Verified Vendors</h2>
              <Link
                href="/vendors"
                className="text-sm font-semibold text-brand-orange hover:text-brand-orange-dark"
              >
                View All →
              </Link>
            </div>
          </MotionIn>

          {vendors.length === 0 ? (
            <MotionIn>
              <p className="text-sm text-brand-gray">
                We&rsquo;re reviewing our first vendor applications now — check
                back soon, or{" "}
                <Link href="/vendor/apply" className="font-medium text-brand-orange">
                  apply to become one of our first verified vendors
                </Link>
                .
              </p>
            </MotionIn>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {vendors.map((v, i) => (
                <MotionIn key={v.id} delay={Math.min(i * 0.08, 0.32)}>
                  <TiltCard maxTilt={12}>
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
                </MotionIn>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-brand-line bg-brand-ivory/70">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <MotionIn>
            <h2 className="mb-12 text-center font-heading text-3xl font-semibold">
              How Wedyora Works
            </h2>
          </MotionIn>
          <div className="grid gap-6 md:grid-cols-5">
            {HOW_IT_WORKS.map((step, i) => (
              <MotionIn key={step.title} delay={i * 0.08}>
                <motion.div
                  className="text-center"
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 280, damping: 18 }}
                >
                  <motion.span
                    className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-orange to-brand-rose text-sm font-semibold text-white shadow-[0_8px_24px_rgba(226,113,29,0.35)]"
                    animate={reduce ? undefined : { scale: [1, 1.08, 1] }}
                    transition={{ duration: 2.4, delay: i * 0.2, repeat: Infinity }}
                  >
                    {i + 1}
                  </motion.span>
                  <h3 className="mb-2 font-heading text-lg font-semibold">{step.title}</h3>
                  <p className="text-xs leading-relaxed text-brand-gray">{step.body}</p>
                </motion.div>
              </MotionIn>
            ))}
          </div>
        </div>
      </section>

      {/* Why Wedyora */}
      <section className="border-t border-brand-line bg-brand-cream">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <MotionIn>
            <h2 className="mb-12 text-center font-heading text-3xl font-semibold">
              Why Couples Choose Wedyora
            </h2>
          </MotionIn>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {WHY_WEDYORA.map(({ icon: Icon, title, body }, i) => (
              <MotionIn key={title} delay={i * 0.08}>
                <TiltCard maxTilt={10}>
                  <GlassContainer className="rounded-2xl p-6">
                    <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mb-2 font-heading text-lg font-semibold">{title}</h3>
                    <p className="text-xs leading-relaxed text-brand-gray">{body}</p>
                  </GlassContainer>
                </TiltCard>
              </MotionIn>
            ))}
          </div>
        </div>
      </section>

      {/* Vendor CTA */}
      <section className="relative overflow-hidden luxury-gradient-dark text-white">
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute left-1/4 top-0 h-48 w-48 rounded-full bg-brand-gold/25 blur-3xl"
            animate={reduce ? undefined : { x: [0, 30, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 right-1/4 h-56 w-56 rounded-full bg-brand-rose/20 blur-3xl"
            animate={reduce ? undefined : { x: [0, -24, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 9, repeat: Infinity }}
          />
        </div>
        <MotionIn>
          <div className="relative mx-auto max-w-6xl px-6 py-20 text-center">
            <h2 className="mb-4 font-heading text-3xl font-semibold md:text-4xl">
              Are you a wedding vendor?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-white/70">
              Join Wedyora&rsquo;s verified vendor network and get matched with
              couples planning their wedding in your city.
            </p>
            <motion.div className="inline-block" whileHover={{ scale: 1.06, y: -3 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/vendor/apply"
                className="btn-luxury inline-flex rounded-full bg-brand-orange px-6 py-3 font-semibold text-white hover:bg-brand-orange-dark"
              >
                Apply as a Vendor
              </Link>
            </motion.div>
          </div>
        </MotionIn>
      </section>
    </div>
  );
}
