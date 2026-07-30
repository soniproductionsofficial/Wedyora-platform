import { createClient } from "@/lib/supabase/server";
import { createAddOnAction, toggleAddOnActiveAction } from "@/lib/actions/admin";

export default async function AdminAddOnsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();

  const { data: addOns } = await supabase
    .from("add_ons")
    .select("id, name, customer_price, vendor_payout, is_active")
    .order("name");

  return (
    <div>
      <p className="text-brand-gray text-sm mb-8">
        Platform-wide extras a customer can add onto any booking (Pre-Wedding
        Shoot, Haldi Coverage, etc.) — same customer-price / vendor-payout
        split as packages, attached at assignment time on the Bookings page.
      </p>

      {error && (
        <p className="mb-6 rounded-lg bg-red-50 text-brand-orange-dark text-sm px-4 py-3">
          {error}
        </p>
      )}

      <div className="rounded-2xl border border-brand-line bg-white p-6 mb-8">
        <h2 className="font-heading text-lg font-semibold mb-4">Add a New Add-on</h2>
        <form action={createAddOnAction} className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-xs font-medium">
            Name
            <input
              name="name"
              required
              placeholder="e.g. Drone Highlights Reel"
              className="rounded-lg border border-brand-line px-3 py-2 text-sm min-w-[200px]"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium">
            Customer Price (₹)
            <input
              type="number"
              name="customer_price"
              required
              min={1}
              className="rounded-lg border border-brand-line px-3 py-2 text-sm w-32"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium">
            Vendor Payout (₹)
            <input
              type="number"
              name="vendor_payout"
              required
              min={1}
              className="rounded-lg border border-brand-line px-3 py-2 text-sm w-32"
            />
          </label>
          <button
            type="submit"
            className="px-4 py-2 rounded-full bg-brand-orange text-white text-sm font-semibold hover:bg-brand-orange-dark"
          >
            Add
          </button>
        </form>
      </div>

      <h2 className="font-heading text-lg font-semibold mb-4">All Add-ons</h2>
      {!addOns || addOns.length === 0 ? (
        <p className="text-brand-gray text-sm">No add-ons yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {addOns.map((a) => (
            <div
              key={a.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-brand-line bg-white px-4 py-3 text-sm"
            >
              <span>
                <strong>{a.name}</strong> — Customer ₹{a.customer_price} · Vendor gets ₹
                {a.vendor_payout}{" "}
                <span className="text-brand-gray">
                  (margin ₹{a.customer_price - a.vendor_payout})
                </span>
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    a.is_active
                      ? "bg-green-50 text-green-700"
                      : "bg-brand-cream text-brand-gray border border-brand-line"
                  }`}
                >
                  {a.is_active ? "Active" : "Inactive"}
                </span>
                <form action={toggleAddOnActiveAction}>
                  <input type="hidden" name="add_on_id" value={a.id} />
                  <input type="hidden" name="is_active" value={String(a.is_active)} />
                  <button
                    type="submit"
                    className="text-xs font-medium text-brand-orange hover:text-brand-orange-dark"
                  >
                    {a.is_active ? "Deactivate" : "Activate"}
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
