import { createClient } from "@/lib/supabase/server";
import { reviewVendorAction } from "@/lib/actions/admin";
import type { VendorStatus } from "@/types/database";

const TABS: VendorStatus[] = ["pending", "approved", "rejected"];

export default async function AdminVendorsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus: VendorStatus = TABS.includes(status as VendorStatus)
    ? (status as VendorStatus)
    : "pending";

  const supabase = await createClient();
  // `profiles(...)` is ambiguous here because vendor_profiles has TWO
  // foreign keys to profiles (id, and reviewed_by) — PostgREST can't tell
  // which relationship to embed without the `!<fk>` hint, and errors out.
  // The `!vendor_profiles_id_fkey` hint disambiguates it to the vendor's
  // own profile row (not the admin who reviewed them).
  const { data: vendors, error: vendorsError } = await supabase
    .from("vendor_profiles")
    .select(
      "id, business_name, city, bio, experience_years, status, created_at, team_size, service_areas, available_from, equipment_details, pan_number, aadhaar_number, gst_number, bank_account_holder_name, bank_account_number, bank_ifsc, portfolio_urls, service_categories(name), profiles!vendor_profiles_id_fkey(full_name, phone)"
    )
    .eq("status", activeStatus)
    .order("created_at", { ascending: true });

  if (vendorsError) {
    console.error("Failed to load vendor applications:", vendorsError);
  }

  const tabs = TABS;

  return (
    <div>
      <p className="text-brand-gray text-sm mb-6">
        Every vendor must be reviewed before they appear publicly or can be
        assigned to a booking.
      </p>

      <div className="flex gap-2 mb-8">
        {tabs.map((t) => (
          <a
            key={t}
            href={`/admin/vendors?status=${t}`}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize border transition-colors ${
              activeStatus === t
                ? "bg-brand-orange text-white border-brand-orange"
                : "border-brand-line text-brand-gray hover:border-brand-orange hover:text-brand-orange"
            }`}
          >
            {t}
          </a>
        ))}
      </div>

      {vendorsError && (
        <p className="mb-6 rounded-lg bg-red-50 text-brand-orange-dark text-sm px-4 py-3">
          Couldn&apos;t load applications: {vendorsError.message}
        </p>
      )}

      {!vendors || vendors.length === 0 ? (
        <p className="text-brand-gray text-sm">No {activeStatus} applications.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {vendors.map((v) => (
            <div
              key={v.id}
              className="rounded-2xl border border-brand-line bg-white p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-sm transition-shadow"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold mb-1">
                  {v.service_categories?.name}
                </p>
                <h3 className="font-heading text-lg font-semibold">
                  {v.business_name}
                </h3>
                <p className="text-sm text-brand-gray">
                  {v.profiles?.full_name} &middot; {v.profiles?.phone} &middot;{" "}
                  {v.city}
                </p>
                {v.bio && <p className="text-sm mt-2 max-w-xl">{v.bio}</p>}
                <p className="text-xs text-brand-gray mt-1">
                  {v.experience_years != null && `${v.experience_years} yrs experience`}
                  {v.team_size != null && ` · Team of ${v.team_size}`}
                  {v.available_from &&
                    ` · Available from ${new Date(v.available_from).toLocaleDateString("en-IN")}`}
                </p>
                {v.service_areas && v.service_areas.length > 0 && (
                  <p className="text-xs text-brand-gray mt-1">
                    Service areas: {v.service_areas.join(", ")}
                  </p>
                )}
                {v.equipment_details && (
                  <p className="text-xs text-brand-gray mt-1">
                    Equipment: {v.equipment_details}
                  </p>
                )}

                <div className="mt-3 pt-3 border-t border-brand-line grid sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-brand-gray max-w-xl">
                  <p>
                    <span className="font-medium text-brand-black">PAN:</span>{" "}
                    {v.pan_number || "—"}
                  </p>
                  <p>
                    <span className="font-medium text-brand-black">Aadhaar:</span>{" "}
                    {v.aadhaar_number || "—"}
                  </p>
                  <p>
                    <span className="font-medium text-brand-black">GST:</span>{" "}
                    {v.gst_number || "—"}
                  </p>
                  <p>
                    <span className="font-medium text-brand-black">Bank A/C:</span>{" "}
                    {v.bank_account_number
                      ? `${v.bank_account_holder_name ?? ""} · ${v.bank_account_number} · ${v.bank_ifsc ?? ""}`
                      : "—"}
                  </p>
                </div>

                {v.portfolio_urls && v.portfolio_urls.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {v.portfolio_urls.map((url) => (
                      <a
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-brand-orange underline"
                      >
                        Portfolio file
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {activeStatus === "pending" && (
                <div className="flex gap-2 shrink-0">
                  <form action={reviewVendorAction}>
                    <input type="hidden" name="vendor_id" value={v.id} />
                    <input type="hidden" name="decision" value="approved" />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-full bg-green-600 text-white text-sm font-semibold hover:bg-green-700"
                    >
                      Approve
                    </button>
                  </form>
                  <form action={reviewVendorAction}>
                    <input type="hidden" name="vendor_id" value={v.id} />
                    <input type="hidden" name="decision" value="rejected" />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-full bg-brand-orange text-white text-sm font-semibold hover:bg-brand-orange-dark"
                    >
                      Reject
                    </button>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
