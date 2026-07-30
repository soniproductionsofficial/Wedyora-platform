import { UploadCloud } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  updateVendorProfileAction,
  createVendorPackageAction,
  toggleVendorPackageActiveAction,
} from "@/lib/actions/vendor-dashboard";
import { uploadPortfolioAction } from "@/lib/actions/vendor";

export default async function VendorProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: vendorProfile }, { data: packages }] = await Promise.all([
    supabase
      .from("vendor_profiles")
      .select(
        "business_name, city, bio, service_areas, team_size, available_from, equipment_details, portfolio_urls, pan_number, aadhaar_number, gst_number, bank_account_holder_name, bank_account_number, bank_ifsc, service_categories(name)"
      )
      .eq("id", user.id)
      .single(),
    supabase
      .from("packages")
      .select("id, title, description, price, is_active")
      .eq("vendor_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  if (!vendorProfile) return <p className="text-brand-gray text-sm">Profile not found.</p>;

  return (
    <div className="flex flex-col gap-8">
      {error && (
        <p className="rounded-lg bg-red-50 text-brand-orange-dark text-sm px-4 py-3">{error}</p>
      )}

      <div className="rounded-2xl border border-brand-line bg-white p-6">
        <h2 className="font-heading text-lg font-semibold mb-4">Business Info</h2>
        <form action={updateVendorProfileAction} className="flex flex-col gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              Business Name
              <input
                name="business_name"
                defaultValue={vendorProfile.business_name}
                required
                className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              City
              <input
                name="city"
                defaultValue={vendorProfile.city}
                required
                className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal"
              />
            </label>
          </div>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Service Areas (comma-separated)
            <input
              name="service_areas"
              defaultValue={(vendorProfile.service_areas ?? []).join(", ")}
              className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal"
            />
          </label>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              Team Size
              <input
                type="number"
                name="team_size"
                defaultValue={vendorProfile.team_size ?? ""}
                className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              Available From
              <input
                type="date"
                name="available_from"
                defaultValue={vendorProfile.available_from ?? ""}
                className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal"
              />
            </label>
          </div>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Equipment Details
            <input
              name="equipment_details"
              defaultValue={vendorProfile.equipment_details ?? ""}
              className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            About Your Work
            <textarea
              name="bio"
              rows={4}
              defaultValue={vendorProfile.bio ?? ""}
              className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal"
            />
          </label>
          <button
            type="submit"
            className="self-start px-5 py-2.5 rounded-full bg-brand-orange text-white text-sm font-semibold hover:bg-brand-orange-dark transition-colors"
          >
            Save Changes
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-brand-line bg-white p-6">
        <h2 className="font-heading text-lg font-semibold mb-4">Portfolio</h2>
        {vendorProfile.portfolio_urls && vendorProfile.portfolio_urls.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-5">
            {vendorProfile.portfolio_urls.map((url) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="block aspect-square rounded-lg overflow-hidden border border-brand-line bg-brand-cream"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="Portfolio item" className="h-full w-full object-cover" />
              </a>
            ))}
          </div>
        )}
        <form
          action={uploadPortfolioAction}
          encType="multipart/form-data"
          className="flex flex-col gap-3"
        >
          <label className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-brand-line px-6 py-8 text-center cursor-pointer hover:border-brand-orange transition-colors">
            <UploadCloud className="h-6 w-6 text-brand-orange" />
            <span className="text-sm text-brand-gray">Click to add more photos or files</span>
            <input
              type="file"
              name="portfolio_files"
              multiple
              accept="image/*,application/pdf"
              className="hidden"
            />
          </label>
          <button
            type="submit"
            className="self-start px-5 py-2.5 rounded-full border border-brand-line text-sm font-semibold hover:bg-brand-cream transition-colors"
          >
            Upload
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-brand-line bg-white p-6">
        <h2 className="font-heading text-lg font-semibold mb-4">Your Packages</h2>
        <form
          action={createVendorPackageAction}
          className="flex flex-wrap items-end gap-3 mb-6 pb-6 border-b border-brand-line"
        >
          <label className="flex flex-col gap-1 text-xs font-medium">
            Title
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
          <label className="flex flex-col gap-1 text-xs font-medium flex-1 min-w-[180px]">
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

        {!packages || packages.length === 0 ? (
          <p className="text-brand-gray text-sm">You haven&rsquo;t added any packages yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {packages.map((p) => (
              <div
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-brand-line px-4 py-2 text-sm"
              >
                <span>
                  <strong>{p.title}</strong> — ₹{p.price}
                  {p.description && <span className="text-brand-gray"> · {p.description}</span>}
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
                  <form action={toggleVendorPackageActiveAction}>
                    <input type="hidden" name="package_id" value={p.id} />
                    <input type="hidden" name="is_active" value={String(p.is_active)} />
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

      <div className="rounded-2xl border border-brand-line bg-white p-6">
        <h2 className="font-heading text-lg font-semibold mb-1">KYC &amp; Bank Details</h2>
        <p className="text-xs text-brand-gray mb-4">
          Submitted during your application. Contact support if any of this needs to change.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <ReadOnlyField label="Category" value={vendorProfile.service_categories?.name} />
          <ReadOnlyField label="PAN" value={vendorProfile.pan_number} />
          <ReadOnlyField label="Aadhaar" value={vendorProfile.aadhaar_number} />
          <ReadOnlyField label="GST" value={vendorProfile.gst_number} />
          <ReadOnlyField label="Bank Account Holder" value={vendorProfile.bank_account_holder_name} />
          <ReadOnlyField label="Bank Account Number" value={vendorProfile.bank_account_number} />
          <ReadOnlyField label="IFSC" value={vendorProfile.bank_ifsc} />
        </div>
      </div>
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-brand-gray text-xs mb-0.5">{label}</p>
      <p className="font-medium">{value || "—"}</p>
    </div>
  );
}
