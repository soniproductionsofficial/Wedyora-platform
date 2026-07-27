import { createClient } from "@/lib/supabase/server";

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
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-heading text-2xl font-semibold mb-2">
        Browse Verified Vendors
      </h1>
      <p className="text-brand-gray text-sm mb-8">
        Every vendor listed here has been reviewed and approved by the
        Wedyora team.
      </p>

      <form className="flex flex-wrap gap-3 mb-10" method="get">
        <select
          name="category"
          defaultValue={category ?? ""}
          className="rounded-lg border border-brand-line px-4 py-2.5 text-sm"
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
          className="rounded-lg border border-brand-line px-4 py-2.5 text-sm"
        />
        <button
          type="submit"
          className="rounded-lg bg-brand-black text-white px-5 py-2.5 text-sm font-semibold"
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
          {vendors.map((v) => (
            <div
              key={v.id}
              className="rounded-2xl border border-brand-line bg-white p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold mb-2">
                {v.service_categories?.name}
              </p>
              <h3 className="font-heading text-lg font-semibold mb-1">
                {v.business_name}
              </h3>
              <p className="text-brand-gray text-sm mb-3">{v.city}</p>
              {v.bio && (
                <p className="text-sm text-brand-black/80 line-clamp-3">
                  {v.bio}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
