import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCategoryIcon } from "@/lib/category-icons";
import Reveal from "@/components/reveal";

export default async function ServicesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("service_categories")
    .select("id, name, slug")
    .order("name");

  return (
    <div>
      <section className="bg-brand-black text-white">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <p className="animate-fade-in-up text-brand-gold-bright uppercase tracking-[0.2em] text-xs font-semibold mb-4">
            What We Offer
          </p>
          <h1
            className="animate-fade-in-up font-heading text-3xl md:text-4xl font-bold mb-6"
            style={{ animationDelay: "120ms" }}
          >
            Every Wedding Service, One Verified Platform
          </h1>
          <p
            className="animate-fade-in-up text-white/70 max-w-2xl mx-auto"
            style={{ animationDelay: "240ms" }}
          >
            Browse by service, tell us your date and city, and we&rsquo;ll
            match you with a verified vendor who fits your budget.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-6 py-16">
          {!categories || categories.length === 0 ? (
            <p className="text-brand-gray text-sm text-center">
              We&rsquo;re setting up our service categories — check back soon.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {categories.map((c, i) => {
                const Icon = getCategoryIcon(c.slug);
                return (
                  <Reveal key={c.id} delay={i * 60}>
                    <Link
                      href={`/vendors?category=${c.slug}`}
                      className="hover-lift group flex items-center gap-4 rounded-2xl border border-brand-line bg-white p-5 hover:border-brand-button transition-all"
                    >
                      <span
                        className="animate-float flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                        style={{
                          background:
                            "linear-gradient(135deg, var(--brand-button), var(--brand-black))",
                          animationDelay: `${i * 180}ms`,
                          animationDuration: `${3.4 + (i % 3) * 0.5}s`,
                        }}
                      >
                        <Icon className="h-6 w-6" />
                      </span>
                      <div>
                        <p className="font-heading font-semibold">{c.name}</p>
                        <p className="text-xs text-brand-gray">View verified vendors &rarr;</p>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="bg-brand-cream border-t border-brand-line">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="font-heading text-2xl font-semibold mb-4">
            Not sure where to start?
          </h2>
          <p className="text-brand-gray mb-8 max-w-xl mx-auto">
            Tell us your date, city, and budget, and we&rsquo;ll take it from
            there — matching, pricing, and payments handled by one team.
          </p>
          <Link
            href="/book"
            className="px-6 py-3 rounded-full bg-brand-button text-brand-black font-semibold hover:bg-brand-button-dark transition-colors"
          >
            Plan Your Wedding
          </Link>
        </div>
      </section>
    </div>
  );
}
