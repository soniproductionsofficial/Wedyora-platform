import { MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCategoryIcon } from "@/lib/category-icons";

export default async function VendorsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; city?: string }>;
}) {
  const { category, city } = await searchParams;
  const supabase = await createClient();

  const [{ data: categories }, vendorsQuery] = await Promise.all([
    supabase.from("service_categories").select("id, name, slug").order("name"),
    (async () => {
      let query = supabase
        .from("vendor_profiles")
        .select(
          "id, business_name, city, bio, experience_years, service_categories(name, slug)"
        )
        .eq("status", "approved");
      if (category) query = query.eq("service_categories.slug", category);
      if (city) query = query.ilike("city", `%${city}%`);
      return query;
    })(),
  ]);

  const vendors = vendorsQuery.data ?? [];

  return (
    <div>
      {/* Page header */}
      <section className="relative overflow-hidden luxury-gradient-dark text-white">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -left-16 top-0 h-56 w-56 rounded-full bg-brand-gold/20 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-brand-rose/15 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 py-14">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
            Verified Network
          </p>
          <h1 className="mb-2 font-heading text-4xl font-semibold md:text-5xl">
            Browse Verified Vendors
          </h1>
          <p className="max-w-xl text-sm text-white/70 md:text-base">
            Every vendor listed here has been reviewed and approved by the
            Wedyora team — search by service and city to find your match.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <form
          className="bg-white rounded-2xl border border-brand-line p-3 flex flex-col md:flex-row gap-3 mb-10 -mt-20 relative shadow-sm"
          method="get"
        >
          <select
            name="category"
            defaultValue={category ?? ""}
            className="flex-1 rounded-xl px-4 py-3 text-sm bg-brand-cream focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            name="city"
            defaultValue={city ?? ""}
            placeholder="City"
            className="flex-1 rounded-xl px-4 py-3 text-sm bg-brand-cream focus:outline-none"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-brand-orange text-white text-sm font-semibold hover:bg-brand-orange-dark transition-colors"
          >
            Filter
          </button>
        </form>

        {vendors.length === 0 ? (
          <p className="text-brand-gray text-sm">
            No approved vendors yet
            {category || city ? " matching those filters" : ""}. Once vendor
            applications are approved, they&rsquo;ll appear here.
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {vendors.map((v) => {
              const Icon = getCategoryIcon(v.service_categories?.slug ?? "");
              return (
                <div
                  key={v.id}
                  className="rounded-2xl border border-brand-line bg-white overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div
                    className="h-36 bg-brand-charcoal bg-cover bg-center relative"
                    style={{
                      backgroundImage: `url(https://picsum.photos/seed/${v.id}/480/320)`,
                    }}
                  >
                    <span className="absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-brand-orange">
                      <Icon className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold mb-2">
                      {v.service_categories?.name}
                    </p>
                    <h3 className="font-heading text-lg font-semibold mb-1">
                      {v.business_name}
                    </h3>
                    <p className="text-brand-gray text-sm mb-3 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {v.city}
                      {v.experience_years
                        ? ` · ${v.experience_years} yrs experience`
                        : ""}
                    </p>
                    {v.bio && (
                      <p className="text-sm text-brand-black/80 line-clamp-3">
                        {v.bio}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
