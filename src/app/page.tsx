import Link from "next/link";
import {
  ShieldCheck,
  CreditCard,
  Headset,
  CalendarCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCategoryIcon } from "@/lib/category-icons";

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
      <style jsx global>{`
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(20px);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .how-works-card {
          animation: popIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          opacity: 0;
        }

        .step-item-animated {
          animation: slideInLeft 0.6s ease-out forwards;
          opacity: 0;
        }

        .step-item-animated:nth-child(odd) {
          animation: slideInLeft 0.6s ease-out forwards;
        }

        .step-item-animated:nth-child(even) {
          animation: slideInRight 0.6s ease-out forwards;
        }

        .step-item-animated:nth-child(1) { animation-delay: 0.1s; }
        .step-item-animated:nth-child(2) { animation-delay: 0.2s; }
        .step-item-animated:nth-child(3) { animation-delay: 0.3s; }
        .step-item-animated:nth-child(4) { animation-delay: 0.4s; }
        .step-item-animated:nth-child(5) { animation-delay: 0.5s; }

        .step-badge {
          animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          font-size: 32px;
          animation-delay: 0.3s;
        }
      `}</style>

      {/* Hero */}
      <section className="bg-brand-black text-white">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-brand-gold-bright uppercase tracking-[0.2em] text-xs font-semibold mb-4">
              India&rsquo;s Managed Wedding Services Platform
            </p>
            <h1 className="font-heading text-4xl md:text-5xl font-bold leading-tight mb-6">
              Find. Book.{" "}
              <span className="text-brand-gold-bright">Celebrate.</span>
            </h1>
            <p className="text-white/70 mb-10">
              Photography, decor, catering and more — every vendor on Wedyora
              is verified by our team, so you can book with confidence.
            </p>
          </div>

          {/* Primary CTA */}
          <div className="flex justify-center mb-12">
            <Link
              href="/book"
              className="px-8 py-4 rounded-full bg-brand-button text-brand-black font-semibold hover:bg-brand-button-dark transition-colors"
            >
              Start Planning Your Wedding
            </Link>
          </div>

          {/* Trust row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto text-center">
            {[
              { icon: ShieldCheck, label: "Verified Vendors" },
              { icon: CalendarCheck, label: "Easy Booking" },
              { icon: CreditCard, label: "Secure Payments" },
              { icon: Headset, label: "Real Support" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20">
                  <Icon className="h-5 w-5 text-brand-gold-bright" />
                </span>
                <p className="text-xs text-white/70 font-medium">{label}</p>
              </div>
            ))}
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

      {/* How Wedyora Works - ANIMATED CARD */}
      <section className="bg-gradient-to-b from-white via-brand-cream to-white border-t border-brand-line py-20 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              How Wedyora Works
            </h2>
            <p className="text-brand-gray text-lg max-w-2xl mx-auto">
              A seamless process from your first step to your perfect celebration
            </p>
          </div>

          {/* Animated Card Container */}
          <div className="how-works-card rounded-3xl bg-white border border-brand-line shadow-2xl p-8 md:p-12 overflow-hidden">
            {/* Card Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-gold-bright/5 via-transparent to-brand-orange/5"></div>

            <div className="relative z-10">
              <div className="grid md:grid-cols-5 gap-6 md:gap-4">
                {HOW_IT_WORKS.map((step, i) => (
                  <div
                    key={step.title}
                    className="step-item-animated text-center"
                  >
                    {/* Step Emoji */}
                    <div className="mb-6 text-5xl step-badge">
                      {step.icon}
                    </div>

                    {/* Step Number */}
                    <div className="mb-4">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-gold-bright to-brand-orange text-brand-black font-bold">
                        {i + 1}
                      </span>
                    </div>

                    {/* Step Title */}
                    <h3 className="font-heading text-sm font-bold mb-2 text-brand-black">
                      {step.title}
                    </h3>

                    {/* Step Description */}
                    <p className="text-brand-gray text-xs leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12">
            <Link
              href="/book"
              className="inline-block px-8 py-4 rounded-full bg-brand-button text-brand-black font-semibold hover:bg-brand-button-dark transition-all hover:scale-105"
            >
              Start Your Wedding Planning →
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
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {WHY_WEDYORA.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl bg-white border border-brand-line p-6 hover:shadow-lg transition-shadow"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-black/10 text-brand-black mb-4">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-heading text-sm font-semibold mb-2">
                  {title}
                </h3>
                <p className="text-brand-gray text-xs leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vendor CTA */}
      <section className="bg-brand-black text-white">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h2 className="font-heading text-2xl font-semibold mb-4">
            Are you a wedding vendor?
          </h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">
            Join Wedyora&rsquo;s verified vendor network and get matched with
            couples planning their wedding in your city.
          </p>
          <Link
            href="/vendor/apply"
            className="px-6 py-3 rounded-full bg-brand-button text-brand-black font-semibold hover:bg-brand-button-dark transition-colors"
          >
            Apply as a Vendor
          </Link>
        </div>
      </section>
    </div>
  );
}
