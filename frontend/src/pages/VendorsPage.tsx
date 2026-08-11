import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Star } from "lucide-react";
import { api, money, type Vendor } from "../lib/api";
import { Skeleton } from "../components/ui";

export default function VendorsPage() {
  const [params, setParams] = useSearchParams();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  const category = params.get("category") ?? "";
  const city = params.get("city") ?? "";
  const q = params.get("q") ?? "";
  const minRating = params.get("minRating") ?? "";
  const budgetMax = params.get("budgetMax") ?? "";

  useEffect(() => {
    setLoading(true);
    api
      .get("/vendors", {
        params: {
          category: category || undefined,
          city: city || undefined,
          q: q || undefined,
          minRating: minRating || undefined,
          budgetMax: budgetMax || undefined,
        },
      })
      .then((r) => setVendors(r.data.vendors ?? []))
      .finally(() => setLoading(false));
  }, [category, city, q, minRating, budgetMax]);

  function update(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="font-heading text-3xl font-bold mb-2">Browse vendors</h1>
      <p className="text-brand-gray text-sm mb-8">
        Filter verified partners by category, city, budget, and rating.
      </p>

      <div className="grid md:grid-cols-[240px_1fr] gap-8">
        <aside className="rounded-2xl border border-brand-line bg-white p-4 h-fit space-y-3">
          <label className="block text-xs font-medium">
            Search
            <input
              className="mt-1 w-full rounded-lg border border-brand-line px-3 py-2 text-sm"
              defaultValue={q}
              onBlur={(e) => update("q", e.target.value)}
            />
          </label>
          <label className="block text-xs font-medium">
            Category
            <select
              className="mt-1 w-full rounded-lg border border-brand-line px-3 py-2 text-sm"
              value={category}
              onChange={(e) => update("category", e.target.value)}
            >
              <option value="">All</option>
              {["Photography", "Catering", "Decoration", "Makeup", "Entertainment"].map(
                (c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                )
              )}
            </select>
          </label>
          <label className="block text-xs font-medium">
            City
            <input
              className="mt-1 w-full rounded-lg border border-brand-line px-3 py-2 text-sm"
              defaultValue={city}
              onBlur={(e) => update("city", e.target.value)}
            />
          </label>
          <label className="block text-xs font-medium">
            Min rating
            <select
              className="mt-1 w-full rounded-lg border border-brand-line px-3 py-2 text-sm"
              value={minRating}
              onChange={(e) => update("minRating", e.target.value)}
            >
              <option value="">Any</option>
              <option value="4">4+</option>
              <option value="4.5">4.5+</option>
            </select>
          </label>
          <label className="block text-xs font-medium">
            Max budget (₹)
            <input
              type="number"
              className="mt-1 w-full rounded-lg border border-brand-line px-3 py-2 text-sm"
              defaultValue={budgetMax}
              onBlur={(e) => update("budgetMax", e.target.value)}
            />
          </label>
        </aside>

        <div>
          {loading ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          ) : vendors.length === 0 ? (
            <p className="text-sm text-brand-gray">No vendors match these filters.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {vendors.map((v, i) => (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -4 }}
                >
                  <Link
                    to={`/vendors/${v.id}`}
                    className="block rounded-2xl border border-brand-line bg-white overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="h-40 bg-brand-charcoal">
                      {v.portfolioUrls[0] && (
                        <img
                          src={v.portfolioUrls[0]}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-[11px] text-brand-gold font-semibold uppercase">
                        {v.category}
                      </p>
                      <h2 className="font-heading font-semibold">{v.businessName}</h2>
                      <p className="text-xs text-brand-gray flex items-center gap-1 mt-1">
                        <MapPin className="h-3.5 w-3.5" /> {v.city}
                      </p>
                      <p className="text-xs mt-2 flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-brand-gold-bright fill-brand-gold-bright" />
                        {v.rating} ({v.reviewCount}) · from {money(v.priceMin)}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
