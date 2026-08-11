import Link from "next/link";
import {
  ShieldCheck,
  CreditCard,
  Headset,
  CalendarCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCategoryIcon } from "@/lib/category-icons";
import WelcomePopup from "@/components/welcome-popup";
import HowItWorksFlashCards from "@/components/how-it-works-flash-cards";
import VendorCtaSection from "@/components/vendor-cta-section";

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

export default async function Home() {
  const supabase = await createClient();

  const { data: allCategories } = await supabase
    .from("service_categories")
    .select("id, name, slug")
    .order("name");

  const categories = allCategories?.filter((c) => c.slug !== "priest");

  return (
    <div>
      <WelcomePopup />

      {/* Hero — full-bleed brand composition */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden bg-brand-black text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/services/decoration.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-35 scale-105 animate-hero- ken"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-charcoal/80 via-brand-black/75 to-brand-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(244,196,0,0.12),transparent_60%)]" />

        <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28 w-full">
          <div className="max-w-2xl animate-fade-up">
            <p className="font-heading text-brand-gold-bright text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Wedyora
            </p>
            <h1 className="font-heading text-3xl md:text-5xl font-bold leading-tight mb-5">
              For every moment,{" "}
              <span className="text-brand-gold-bright">forever.</span>
            </h1>
            <p className="text-white/75 text-base md:text-lg mb-10 max-w-xl">
              Customers book events. We assign verified vendors and their tasks.
              Partners get notified the moment a booking lands.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/book"
                className="px-8 py-4 rounded-full bg-brand-button text-brand-black font-semibold hover:bg-brand-button-dark transition-all hover:scale-[1.02]"
              >
                Book your event
              </Link>
              <Link
                href="/vendors"
                className="px-8 py-4 rounded-full border border-white/35 text-white font-medium hover:bg-white/10 transition-colors"
              >
                Browse vendors
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category strip */}
      {categories && categories.length > 0 && (
        <section className="bg-white border-b border-brand-line">
          <div className="mx-auto max-w-6xl px-6 py-12">
            <h2 className="font-heading text-lg font-semibold mb-6 text-center">
              Popular Services
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((c) => {
                const Icon = getCategoryIcon(c.slug);
                return (
                  <Link
                    key={c.id}
                    href="/book"
                    className="flex flex-col items-center gap-2 w-24 group"
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-cream border border-brand-line group-hover:border-brand-orange group-hover:text-brand-orange transition-colors">
                      <Icon className="h-6 w-6" />
                    </span>
                    <p className="text-xs font-medium text-center">{c.name}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* How Wedyora Works — flash cards */}
      <section className="bg-gradient-to-b from-white via-brand-cream to-white border-t border-brand-line py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              How Wedyora Works
            </h2>
            <p className="text-brand-gray text-lg max-w-2xl mx-auto">
              Flip each card — from request to celebration in five steps.
            </p>
          </div>
          <HowItWorksFlashCards steps={HOW_IT_WORKS} />
          <div className="text-center mt-12">
            <Link
              href="/book"
              className="inline-block px-8 py-4 rounded-full bg-brand-button text-brand-black font-semibold hover:bg-brand-button-dark transition-all hover:scale-105"
            >
              Start planning →
            </Link>
          </div>
        </div>
      </section>

      {/* Why Wedyora */}
      <section className="bg-brand-cream border-t border-brand-line">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="font-heading text-2xl font-semibold text-center mb-12">
            Why Couples Choose Wedyora
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            {WHY_WEDYORA.map(({ icon: Icon, title, body }, i) => (
              <div
                key={title}
                className="animate-fade-up"
                style={{ animationDelay: `${0.1 * i}s` }}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-black/10 text-brand-black mb-4">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-heading text-sm font-semibold mb-2">{title}</h3>
                <p className="text-brand-gray text-xs leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <VendorCtaSection />
    </div>
  );
}
