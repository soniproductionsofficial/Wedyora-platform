import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Reveal from "@/components/reveal";

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
      <section className="bg-brand-black text-white">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <p className="animate-fade-in-up text-brand-gold-bright uppercase tracking-[0.2em] text-xs font-semibold mb-4">
            Portfolio
          </p>
          <h1
            className="animate-fade-in-up font-heading text-3xl md:text-4xl font-bold mb-6"
            style={{ animationDelay: "120ms" }}
          >
            Real Work From Our Verified Vendors
          </h1>
          <p
            className="animate-fade-in-up text-white/70 max-w-2xl mx-auto"
            style={{ animationDelay: "240ms" }}
          >
            A look at the photography, decor, and coverage our vendors have
            delivered for real weddings.
          </p>
        </div>
      </section>

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
                <Reveal
                  key={`${p.url}-${i}`}
                  delay={(i % 6) * 70}
                  className="hover-lift hover-zoom rounded-2xl bg-white border border-brand-line overflow-hidden"
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
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
