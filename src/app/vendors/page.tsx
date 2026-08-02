import { MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCategoryIcon } from "@/lib/category-icons";
import MotionEventCard from "@/components/motion/motion-event-card";
import AnimatedTabSwitch from "@/components/motion/animated-tab-switch";
import KineticButton from "@/components/motion/kinetic-button";
import LiveBadge from "@/components/motion/live-badge";

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

  const categoryTabs = [
    { id: "all", label: "All", href: city ? `/vendors?city=${encodeURIComponent(city)}` : "/vendors" },
    ...(categories ?? []).slice(0, 8).map((c) => ({
      id: c.slug,
      label: c.name,
      href: city
        ? `/vendors?category=${c.slug}&city=${encodeURIComponent(city)}`
        : `/vendors?category=${c.slug}`,
    })),
  ];

  return (
    <div>
      {/* Page header */}
      <section className="relative overflow-hidden luxury-gradient-dark text-white">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -left-16 top-0 h-56 w-56 rounded-full bg-brand-gold/20 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-brand-rose/15 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 py-14">
          <div className="mb-4">
            <LiveBadge label="Curated Network" />
          </div>
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
          className="glass-panel relative z-10 -mt-20 mb-8 flex flex-col gap-3 rounded-2xl p-3 md:flex-row"
          method="get"
        >
          <select
            name="category"
            defaultValue={category ?? ""}
            className="flex-1 rounded-xl bg-brand-cream/80 px-4 py-3 text-sm focus:outline-none"
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
            className="flex-1 rounded-xl bg-brand-cream/80 px-4 py-3 text-sm focus:outline-none"
          />
          <KineticButton
            type="submit"
            className="btn-luxury rounded-xl bg-brand-orange px-6 py-3 text-sm font-semibold text-white hover:bg-brand-orange-dark"
          >
            Filter
          </KineticButton>
        </form>

        {categories && categories.length > 0 && (
          <div className="mb-10 overflow-x-auto pb-1">
            <AnimatedTabSwitch
              tabs={categoryTabs}
              activeId={category ?? "all"}
              className="inline-flex min-w-full md:min-w-0"
            />
          </div>
        )}

        {vendors.length === 0 ? (
          <p className="text-sm text-brand-gray">
            No approved vendors yet
            {category || city ? " matching those filters" : ""}. Once vendor
            applications are approved, they&rsquo;ll appear here.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {vendors.map((v, i) => {
              const Icon = getCategoryIcon(v.service_categories?.slug ?? "");
              return (
                <MotionEventCard key={v.id} index={i}>
                  <div
                    className="relative h-36 bg-brand-charcoal bg-cover bg-center"
                    style={{
                      backgroundImage: `url(https://picsum.photos/seed/${v.id}/480/320)`,
                    }}
                  >
                    <span className="absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-brand-orange">
                      <Icon className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="p-6">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-gold">
                      {v.service_categories?.name}
                    </p>
                    <h3 className="mb-1 font-heading text-lg font-semibold">
                      {v.business_name}
                    </h3>
                    <p className="mb-3 flex items-center gap-1 text-sm text-brand-gray">
                      <MapPin className="h-3.5 w-3.5" />
                      {v.city}
                      {v.experience_years
                        ? ` · ${v.experience_years} yrs experience`
                        : ""}
                    </p>
                    {v.bio && (
                      <p className="line-clamp-3 text-sm text-brand-black/80">
                        {v.bio}
                      </p>
                    )}
                  </div>
                </MotionEventCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
