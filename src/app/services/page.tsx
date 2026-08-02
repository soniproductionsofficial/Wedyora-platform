import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCategoryIcon } from "@/lib/category-icons";
import PageHero from "@/components/ui/page-hero";
import GlassContainer from "@/components/ui/glass-container";

export default async function ServicesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("service_categories")
    .select("id, name, slug")
    .order("name");

  return (
    <div>
      <PageHero
        eyebrow="What We Offer"
        title="Every Wedding Service, One Verified Platform"
        description={
          <>
            Browse by service, tell us your date and city, and we&rsquo;ll
            match you with a verified vendor who fits your budget.
          </>
        }
      />

      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-6 py-16">
          {!categories || categories.length === 0 ? (
            <p className="text-brand-gray text-sm text-center">
              We&rsquo;re setting up our service categories — check back soon.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {categories.map((c) => {
                const Icon = getCategoryIcon(c.slug);
                return (
                  <Link key={c.id} href={`/vendors?category=${c.slug}`}>
                    <GlassContainer className="flex items-center gap-4 rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(212,175,106,0.18)]">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-champagne/70 text-brand-orange">
                        <Icon className="h-6 w-6" />
                      </span>
                      <div>
                        <p className="font-heading text-lg font-semibold">{c.name}</p>
                        <p className="text-xs text-brand-gray">View verified vendors &rarr;</p>
                      </div>
                    </GlassContainer>
                  </Link>
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
            className="btn-luxury px-6 py-3 rounded-full bg-brand-orange text-white font-semibold hover:bg-brand-orange-dark transition-colors"
          >
            Plan Your Wedding
          </Link>
        </div>
      </section>
    </div>
  );
}
