import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PageHero from "@/components/ui/page-hero";
import GlassContainer from "@/components/ui/glass-container";

export default async function PortfolioPage() {
  const supabase = await createClient();
  const { data: vendors } = await supabase
    .from("vendor_profiles")
    .select("id, business_name, city, portfolio_urls, service_categories(name)")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  const photos = (vendors ?? []).flatMap((v) =>
    (v.portfolio_urls ?? []).map((url) => ({
      url,
      vendorName: v.business_name,
      city: v.city,
      category: v.service_categories?.name,
    }))
  );

  return (
    <div>
      <PageHero
        eyebrow="Portfolio"
        title="Real Work From Our Verified Vendors"
        description={
          <>
            A look at the photography, decor, and coverage our vendors have
            delivered for real weddings.
          </>
        }
      />

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          {photos.length === 0 ? (
            <p className="text-brand-gray text-sm text-center">
              Our vendors are still uploading their portfolios — check back
              soon, or{" "}
              <Link href="/vendors" className="text-brand-orange font-medium">
                browse verified vendors
              </Link>{" "}
              directly.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {photos.map((p, i) => (
                <GlassContainer
                  key={`${p.url}-${i}`}
                  className="overflow-hidden rounded-2xl transition-shadow hover:shadow-[0_16px_40px_rgba(212,175,106,0.18)]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- vendor-uploaded portfolio images from Supabase Storage, not a local/known-size asset next/image can optimize confidently */}
                  <img
                    src={p.url}
                    alt={`${p.vendorName} portfolio work`}
                    className="h-52 w-full object-cover bg-brand-charcoal"
                  />
                  <div className="p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold mb-1">
                      {p.category}
                    </p>
                    <p className="font-heading font-semibold text-sm">{p.vendorName}</p>
                    <p className="text-brand-gray text-xs">{p.city}</p>
                  </div>
                </GlassContainer>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
