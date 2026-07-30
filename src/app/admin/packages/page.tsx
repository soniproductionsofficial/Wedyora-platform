import { createClient } from "@/lib/supabase/server";
import { createPackageAction, togglePackageActiveAction } from "@/lib/actions/admin";

export default async function AdminPackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();

  const [{ data: vendors }, { data: packages }] = await Promise.all([
    supabase
      .from("vendor_profiles")
      .select("id, business_name, city, service_categories(name)")
      .eq("status", "approved")
      .order("business_name"),
    supabase
      .from("packages")
      .select("id, vendor_id, title, description, price, is_active, vendor_profiles(business_name)")
      .order("created_at", { ascending: false }),
  ]);

  const packagesByVendor = (packages ?? []).reduce<Record<string, typeof packages>>(
    (acc, p) => {
      (acc[p.vendor_id] ??= []).push(p);
      return acc;
    },
    {}
  );

  return (
    <div>
      <p className="text-brand-gray text-sm mb-8">
        Every priced package a vendor offers lives here. Bookings get
        assigned a specific package, so its price is locked in automatically
        instead of being typed in fresh each time. There&rsquo;s no vendor
        dashboard yet, so for now your team enters packages on a vendor&rsquo;s
        behalf, based on what they quote you.
      </p>

      {error && (
        <p className="mb-6 rounded-lg bg-red-50 text-brand-orange-dark text-sm px-4 py-3">
          {error}
        </p>
      )}

      <div className="rounded-2xl border border-brand-line bg-white p-6 mb-8">
        <h2 className="font-heading text-lg font-semibold mb-4">Add a Package</h2>
        {!vendors || vendors.length === 0 ? (
          <p className="text-brand-gray text-sm">
            No approved vendors yet — approve one on the Vendor Applications
            page first.
          </p>
        ) : (
          <form action={createPackageAction} className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1 text-xs font-medium">
              Vendor
              <select
                name="vendor_id"
                required
                className="rounded-lg border border-brand-line px-3 py-2 text-sm min-w-[200px]"
              >
                <option value="">Select a vendor</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.business_name} ({v.service_categories?.name}, {v.city})
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs font-medium">
              Package Title
              <input
                name="title"
                required
                placeholder="e.g. Full Day Coverage"
                className="rounded-lg border border-brand-line px-3 py-2 text-sm"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-medium">
              Price (₹)
              <input
                type="number"
                name="price"
                required
                min={1}
                className="rounded-lg border border-brand-line px-3 py-2 text-sm w-32"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-medium w-full">
              Description (optional)
              <input
                name="description"
                placeholder="What's included"
                className="rounded-lg border border-brand-line px-3 py-2 text-sm w-full"
              />
            </label>
            <button
              type="submit"
              className="px-4 py-2 rounded-full bg-brand-orange text-white text-sm font-semibold hover:bg-brand-orange-dark"
            >
              Add Package
            </button>
          </form>
        )}
      </div>

      <h2 className="font-heading text-lg font-semibold mb-4">All Packages</h2>
      {!vendors || vendors.length === 0 ? (
        <p className="text-brand-gray text-sm">Nothing to show yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {vendors.map((v) => {
            const vendorPackages = packagesByVendor[v.id] ?? [];
            return (
              <div key={v.id} className="rounded-2xl border border-brand-line bg-white p-6">
                <p className="font-heading font-semibold mb-1">{v.business_name}</p>
                <p className="text-xs text-brand-gray mb-4">
                  {v.service_categories?.name} &middot; {v.city}
                </p>
                {vendorPackages.length === 0 ? (
                  <p className="text-sm text-brand-gray">No packages yet.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {vendorPackages.map((p) => (
                      <div
                        key={p.id}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-brand-line px-4 py-2 text-sm"
                      >
                        <span>
                          <strong>{p.title}</strong> — ₹{p.price}
                          {p.description && (
                            <span className="text-brand-gray"> · {p.description}</span>
                          )}
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              p.is_active
                                ? "bg-green-50 text-green-700"
                                : "bg-brand-cream text-brand-gray border border-brand-line"
                            }`}
                          >
                            {p.is_active ? "Active" : "Inactive"}
                          </span>
                          <form action={togglePackageActiveAction}>
                            <input type="hidden" name="package_id" value={p.id} />
                            <input
                              type="hidden"
                              name="is_active"
                              value={String(p.is_active)}
                            />
                            <button
                              type="submit"
                              className="text-xs font-medium text-brand-orange hover:text-brand-orange-dark"
                            >
                              {p.is_active ? "Deactivate" : "Activate"}
                            </button>
                          </form>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
