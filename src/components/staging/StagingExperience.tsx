"use client";

/**
 * Awwwards-tier staging redesign — isolated at /staging.
 *
 * Preserves Wedyora homepage copy, SEO intent, and content structure while
 * elevating motion (Lenis↔GSAP, cinematic loader, 3D hero, pinned story).
 *
 * DOES NOT modify `src/app/page.tsx`.
 *
 * ---------------------------------------------------------------------------
 * AFTER APPROVAL — swap onto the real homepage:
 * ---------------------------------------------------------------------------
 * 1. Keep the Supabase fetches in `src/app/page.tsx`.
 * 2. Replace returned JSX with:
 *      <StagingExperience categories={…} vendors={…} />
 * 3. Import this module. Optionally remove `/staging` afterward.
 * ---------------------------------------------------------------------------
 */

import { useCallback, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  CalendarCheck,
  CreditCard,
  Headset,
  MapPin,
  Search,
  ShieldCheck,
} from "lucide-react";
import LiveBadge from "@/components/motion/live-badge";
import KineticButton from "@/components/motion/kinetic-button";
import KineticText, { KineticReveal } from "@/components/motion/kinetic-text";
import NavLink from "@/components/motion/nav-link";
import MotionEventCard from "@/components/motion/motion-event-card";
import Reveal from "@/components/ui/reveal";
import { getCategoryIcon } from "@/lib/category-icons";
import GsapLenisBridge from "@/components/staging/gsap-lenis-bridge";
import StagingLoader from "@/components/staging/StagingLoader";
import StagingHero3D from "@/components/staging/StagingHero3D";
import StagingPinnedStory from "@/components/staging/StagingPinnedStory";

export type StagingCategory = { id: string; name: string; slug: string };
export type StagingVendor = {
  id: string;
  business_name: string;
  city: string;
  experience_years: number | null;
  service_categories: { name: string } | null;
};

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

export default function StagingExperience({
  categories,
  vendors,
}: {
  categories: StagingCategory[];
  vendors: StagingVendor[];
}) {
  const [ready, setReady] = useState(false);
  const reduce = useReducedMotion();
  const onLoaderDone = useCallback(() => setReady(true), []);

  return (
    <div className="staging-root relative min-h-screen bg-brand-cream text-brand-black">
      <StagingLoader onDone={onLoaderDone} />
      {ready ? <GsapLenisBridge /> : null}

      {/* Staging chrome — proves this is NOT the live homepage */}
      <div className="relative z-40 border-b border-amber-700/30 bg-amber-500 px-4 py-3 text-center text-sm font-semibold text-amber-950 md:text-base">
        STAGING REDESIGN PREVIEW (/staging) — 3D hero + GSAP pinned story live here
        <span className="mx-2 text-amber-950/40">·</span>
        <Link href="/" className="underline underline-offset-2">
          Open normal homepage
        </Link>
        <span className="mx-2 text-amber-950/40">·</span>
        <Link href="/animation-review" className="underline underline-offset-2">
          Animation review
        </Link>
      </div>

      {/* HERO — full-bleed 3D plane + brand-first composition */}
      <section className="relative isolate min-h-[100svh] overflow-hidden luxury-gradient-dark text-white">
        <div className="absolute inset-0 will-change-transform">
          <StagingHero3D />
        </div>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(15,12,10,0.35) 0%, rgba(15,12,10,0.15) 40%, rgba(15,12,10,0.72) 100%)",
          }}
        />

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-3.5rem)] max-w-6xl flex-col justify-center px-6 pb-16 pt-20 md:pb-24">
          <motion.div
            className="mx-auto mb-10 max-w-3xl text-center will-change-transform"
            initial={reduce ? false : { opacity: 0, y: 32 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-5 flex justify-center">
              <LiveBadge label="Live Platform" />
            </div>
            <KineticText className="mb-5 font-heading text-5xl font-semibold tracking-wide text-brand-champagne md:text-6xl">
              Wedyora
            </KineticText>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
              India&rsquo;s Managed Wedding Services Platform
            </p>
            <KineticReveal delay={0.15}>
              <h1 className="mb-6 font-heading text-4xl font-semibold leading-[1.1] md:text-6xl">
                Find. Book.{" "}
                <span className="text-gradient-gold italic">Celebrate.</span>
              </h1>
            </KineticReveal>
            <p className="mx-auto mb-10 max-w-xl text-base text-white/70 md:text-lg">
              Photography, decor, catering and more — every vendor on Wedyora is
              verified by our team, so you can book with confidence.
            </p>

            <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
              <KineticButton asChild pulse>
                <NavLink
                  href="/book"
                  className="btn-luxury inline-flex rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-white hover:bg-brand-orange-dark"
                >
                  Plan Your Wedding
                </NavLink>
              </KineticButton>
              <KineticButton asChild>
                <NavLink
                  href="/vendors"
                  className="inline-flex rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:border-brand-gold/40 hover:bg-white/10"
                >
                  Browse Vendors
                </NavLink>
              </KineticButton>
            </div>
          </motion.div>

          <motion.form
            action="/vendors"
            method="get"
            className="animated-border glass-panel-dark mx-auto mb-12 max-w-3xl rounded-2xl p-3 will-change-transform"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.85, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
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
          </motion.form>

          <motion.div
            className="mx-auto grid max-w-3xl grid-cols-2 gap-4 text-center md:grid-cols-4 md:gap-6"
            initial={reduce ? false : { opacity: 0 }}
            animate={ready ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.28, duration: 0.7 }}
          >
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
          </motion.div>
        </div>
      </section>

      {/* Scroll-pinned storytelling */}
      <StagingPinnedStory />

      {/* Popular services */}
      {categories.length > 0 && (
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
                    <NavLink
                      href={`/vendors?category=${c.slug}`}
                      className="group flex flex-col items-center gap-2"
                    >
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-line bg-white shadow-sm transition-all group-hover:-translate-y-1 group-hover:border-brand-gold/50 group-hover:text-brand-orange group-hover:shadow-[0_12px_30px_rgba(212,175,106,0.2)]">
                        <Icon className="h-6 w-6" />
                      </span>
                      <p className="text-center text-xs font-medium">{c.name}</p>
                    </NavLink>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Verified vendors */}
      <section className="bg-brand-cream">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Reveal>
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-heading text-3xl font-semibold">
                Verified Vendors
              </h2>
              <NavLink
                href="/vendors"
                className="text-sm font-semibold text-brand-orange transition-colors hover:text-brand-orange-dark"
              >
                View All &rarr;
              </NavLink>
            </div>
          </Reveal>

          {vendors.length === 0 ? (
            <p className="text-sm text-brand-gray">
              We&rsquo;re reviewing our first vendor applications now — check
              back soon, or{" "}
              <NavLink href="/vendor/apply" className="font-medium text-brand-orange">
                apply to become one of our first verified vendors
              </NavLink>
              .
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {vendors.map((v, i) => (
                <MotionEventCard key={v.id} index={i}>
                  <div
                    className="h-40 bg-brand-charcoal bg-cover bg-center transition-transform duration-700 will-change-transform group-hover:scale-[1.03]"
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
                </MotionEventCard>
              ))}
            </div>
          )}
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
              <MotionEventCard key={title} index={i}>
                <div className="p-6">
                  <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mb-2 font-heading text-lg font-semibold">{title}</h3>
                  <p className="text-xs leading-relaxed text-brand-gray">{body}</p>
                </div>
              </MotionEventCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-brand-line bg-brand-ivory/80">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <Reveal>
            <h2 className="mb-4 font-heading text-3xl font-semibold md:text-4xl">
              Ready to plan with confidence?
            </h2>
            <p className="mb-8 text-brand-gray">
              Start with a service and a city — Wedyora handles the rest.
            </p>
            <KineticButton asChild pulse>
              <NavLink
                href="/book"
                className="btn-luxury inline-flex rounded-full bg-brand-orange px-8 py-3.5 text-sm font-semibold text-white hover:bg-brand-orange-dark"
              >
                Plan Your Wedding
              </NavLink>
            </KineticButton>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
