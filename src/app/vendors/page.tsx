import Link from "next/link";
import { MapPin, Filter } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCategoryIcon } from "@/lib/category-icons";

export default async function VendorsBrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; city?: string }>;
}) {
  const { category, city } = await searchParams;
  const supabase = await createClient();

  const [{ data: categories }, { data: vendors }] = await Promise.all([
    supabase.from("service_categories").select("id, name, slug").order("name"),
    supabase
      .from("vendor_profiles")
      .select(
        "id, business_name, city, bio, portfolio_urls, partner_tier, service_categories(id, name, slug)"
      )
      .eq("status", "approved")
      .order("created_at", { ascending: false }),
  ]);

  const cityFilter = city?.trim().toLowerCase() ?? "";
  const categoryFilter = category?.trim() ?? "";

  const filtered = (vendors ?? []).filter((v) => {
    const cityOk =
      !cityFilter ||
      v.city?.toLowerCase().includes(cityFilter) ||
      false;
    const categoryOk =
      !categoryFilter ||
      v.service_categories?.slug === categoryFilter ||
      v.service_categories?.id === categoryFilter;
    return cityOk && categoryOk;
  });

  const cities = Array.from(
    new Set((vendors ?? []).map((v) => v.city).filter(Boolean) as string[])
  ).sort((a, b) => a.localeCompare(b));

  return (
    <div>
      <section className="bg-brand-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(244,196,0,0.2),transparent_50%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-16">
          <p className="text-brand-gold-bright uppercase tracking-[0.2em] text-xs font-semibold mb-4">
            Verified network
          </p>
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Browse Wedyora vendors
          </h1>
          <p className="text-white/70 max-w-2xl">
            Explore approved partners by category and city. When you book,
            Wedyora assigns the right vendor and their tasks for you.
          </p>
        </div>
      </section>

      <section className="bg-white border-b border-brand-line">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <form className="flex flex-wrap items-end gap-3" method="get">
            <label className="flex flex-col gap-1 text-xs font-medium">
              <span className="flex items-center gap-1 text-brand-gray">
                <Filter className="h-3.5 w-3.5" /> Category
              </span>
              <select
                name="category"
                defaultValue={categoryFilter}
                className="rounded-lg border border-brand-line px-3 py-2 text-sm min-w-[180px]"
              >
                <option value="">All categories</option>
                {(categories ?? []).map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs font-medium">
              <span className="flex items-center gap-1 text-brand-gray">
                <MapPin className="h-3.5 w-3.5" /> City
              </span>
              <select
                name="city"
                defaultValue={city ?? ""}
                className="rounded-lg border border-brand-line px-3 py-2 text-sm min-w-[160px]"
              >
                <option value="">All cities</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-brand-black text-white text-sm font-semibold hover:bg-brand-charcoal"
            >
              Apply filters
            </button>
          </form>
        </div>
      </section>

      <section className="bg-brand-cream">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <p className="text-sm text-brand-gray mb-6">
            Showing {filtered.length} verified vendor
            {filtered.length === 1 ? "" : "s"}
          </p>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-brand-line bg-white p-10 text-center">
              <p className="text-brand-gray text-sm mb-4">
                No approved vendors match these filters yet.
              </p>
              <Link
                href="/book"
                className="inline-block px-5 py-2.5 rounded-full bg-brand-button text-brand-black font-semibold"
              >
                Request a booking anyway
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((v) => {
                const cover = v.portfolio_urls?.[0];
                const Icon = getCategoryIcon(v.service_categories?.slug ?? "");
                return (
                  <article
                    key={v.id}
                    className="rounded-2xl border border-brand-line bg-white overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="h-40 bg-brand-charcoal relative">
                      {cover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={cover}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-brand-gold-bright">
                          <Icon className="h-10 w-10" />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <p className="text-[11px] uppercase tracking-wide text-brand-gold font-semibold mb-1">
                        {v.service_categories?.name ?? "Vendor"}
                        {v.partner_tier && v.partner_tier !== "standard"
                          ? ` · ${v.partner_tier}`
                          : ""}
                      </p>
                      <h2 className="font-heading font-semibold mb-1">
                        {v.business_name}
                      </h2>
                      <p className="text-xs text-brand-gray flex items-center gap-1 mb-3">
                        <MapPin className="h-3.5 w-3.5" />
                        {v.city}
                      </p>
                      {v.bio && (
                        <p className="text-xs text-brand-gray line-clamp-3 mb-4">
                          {v.bio}
                        </p>
                      )}
                      <Link
                        href="/book"
                        className="text-sm font-semibold text-brand-orange hover:underline"
                      >
                        Book this category →
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
