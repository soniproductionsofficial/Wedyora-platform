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

export default async function Home() {
  const supabase = await createClient();

  const { data: allCategories } = await supabase
    .from("service_categories")
    .select("id, name, slug")
    .order("name");

  // Priest Services is still a bookable category (booking form, vendor
  // applications, admin) — it's just left out of the homepage's
  // "Popular Services" showcase strip specifically.
  const categories = allCategories?.filter((c) => c.slug !== "priest");

  return (
    <div>
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

      {/* How Wedyora works */}
      <section className="bg-white border-t border-brand-line">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="font-heading text-2xl font-semibold text-center mb-12">
            How Wedyora Works
          </h2>
          <div className="grid md:grid-cols-5 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.title} className="text-center">
                <span className="mx-auto mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-brand-button text-brand-black text-sm font-semibold">
                  {i + 1}
                </span>
                <h3 className="font-heading text-sm font-semibold mb-2">
                  {step.title}
                </h3>
                <p className="text-brand-gray text-xs leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
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
                className="rounded-2xl bg-white border border-brand-line p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange mb-4">
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
