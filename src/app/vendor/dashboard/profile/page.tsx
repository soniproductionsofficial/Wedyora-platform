import { UploadCloud, Award } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  updateVendorProfileAction,
  createVendorPackageAction,
  toggleVendorPackageActiveAction,
} from "@/lib/actions/vendor-dashboard";
import { uploadPortfolioAction } from "@/lib/actions/vendor";
import { getVendorPlan } from "@/lib/vendor-plans";
import { nextIncentiveTier } from "@/lib/vendor-incentives";

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

  const [{ data: vendorProfile }, { data: packages }, { data: ledgerRows }] = await Promise.all([
    supabase
      .from("vendor_profiles")
      .select(
        "business_name, city, bio, service_areas, team_size, available_from, equipment_details, portfolio_urls, pan_number, aadhaar_number, gst_number, bank_name, bank_account_holder_name, bank_account_number, bank_ifsc, pan_document_path, aadhaar_document_path, plan, security_deposit_amount, plan_paid_at, plan_expires_at, successful_events_count, partner_tier, service_categories(name)"
      )
      .eq("id", user.id)
      .single(),
    supabase
      .from("packages")
      .select("id, title, description, tier, customer_price, vendor_payout, is_active")
      .eq("vendor_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("vendor_payments")
      .select("id, type, direction, amount, status, reason, created_at")
      .eq("vendor_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  if (!vendorProfile) return <p className="text-brand-gray text-sm">Profile not found.</p>;

  const plan = getVendorPlan(vendorProfile.plan);
  const nextTier = nextIncentiveTier(vendorProfile.successful_events_count);

  let panDocUrl: string | undefined;
  let aadhaarDocUrl: string | undefined;
  if (vendorProfile.pan_document_path) {
    const { data } = await supabase.storage
      .from("vendor-kyc")
      .createSignedUrl(vendorProfile.pan_document_path, 60 * 30);
    panDocUrl = data?.signedUrl;
  }
  if (vendorProfile.aadhaar_document_path) {
    const { data } = await supabase.storage
      .from("vendor-kyc")
      .createSignedUrl(vendorProfile.aadhaar_document_path, 60 * 30);
    aadhaarDocUrl = data?.signedUrl;
  }

  return (
    <div className="flex flex-col gap-8">
      {error && (
        <p className="rounded-lg bg-red-50 text-brand-orange-dark text-sm px-4 py-3">{error}</p>
      )}

      <div className="rounded-2xl border border-brand-line bg-white p-6">
        <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-brand-orange" /> Membership &amp; Performance
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <p className="text-brand-gray text-xs mb-0.5">Plan</p>
            <p className="font-medium">{plan?.label ?? "—"}</p>
          </div>
          <div>
            <p className="text-brand-gray text-xs mb-0.5">Security Deposit</p>
            <p className="font-medium">
              {vendorProfile.security_deposit_amount != null
                ? `₹${Number(vendorProfile.security_deposit_amount).toLocaleString("en-IN")} (refundable)`
                : "—"}
            </p>
          </div>
          <div>
            <p className="text-brand-gray text-xs mb-0.5">Renewal Due</p>
            <p className="font-medium">
              {vendorProfile.plan_expires_at
                ? new Date(vendorProfile.plan_expires_at).toLocaleDateString("en-IN")
                : "—"}
            </p>
          </div>
          <div>
            <p className="text-brand-gray text-xs mb-0.5">Performance</p>
            <p className="font-medium capitalize">
              {vendorProfile.successful_events_count} events &middot; {vendorProfile.partner_tier} tier
            </p>
            {nextTier && (
              <p className="text-xs text-brand-gray mt-0.5">
                Next bonus: ₹{nextTier.bonus.toLocaleString("en-IN")} at {nextTier.events} events
              </p>
            )}
          </div>
        </div>
        {ledgerRows && ledgerRows.length > 0 && (
          <div className="pt-4 border-t border-brand-line">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-gray mb-2">
              Recent Ledger Activity
            </p>
            <div className="flex flex-col gap-1">
              {ledgerRows.map((r) => (
                <div key={r.id} className="flex items-center justify-between text-xs gap-2">
                  <span className="text-brand-gray">
                    {r.reason ?? r.type} &middot; {new Date(r.created_at).toLocaleDateString("en-IN")}
                  </span>
                  <span className="flex items-center gap-2 shrink-0">
                    <span className={r.direction === "credit" ? "text-green-700" : "text-brand-orange-dark"}>
                      {r.direction === "credit" ? "+" : "−"}₹{Number(r.amount).toLocaleString("en-IN")}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-brand-cream border border-brand-line capitalize">
                      {r.status}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

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
                defaultValue={vendorProfile.city ?? ""}
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
            className="self-start px-5 py-2.5 rounded-full bg-brand-button text-brand-black text-sm font-semibold hover:bg-brand-button-dark transition-colors"
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
            Tier
            <select name="tier" className="rounded-lg border border-brand-line px-3 py-2 text-sm">
              <option value="">No tier</option>
              <option value="basic">Basic</option>
              <option value="premium">Premium</option>
              <option value="luxury">Luxury</option>
            </select>
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
            Your Payout (₹)
            <input
              type="number"
              name="vendor_payout"
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
            className="px-4 py-2 rounded-full bg-brand-button text-brand-black text-sm font-semibold hover:bg-brand-button-dark"
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
                  <strong>{p.title}</strong>
                  {p.tier && <span className="capitalize text-brand-gray"> ({p.tier})</span>} —
                  Customer pays ₹{p.customer_price}, you get ₹{p.vendor_payout}
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
          <ReadOnlyField
            label="PAN Document"
            value={panDocUrl ? "Uploaded" : null}
            href={panDocUrl}
          />
          <ReadOnlyField label="Aadhaar" value={vendorProfile.aadhaar_number} />
          <ReadOnlyField
            label="Aadhaar Document"
            value={aadhaarDocUrl ? "Uploaded" : null}
            href={aadhaarDocUrl}
          />
          <ReadOnlyField label="GST" value={vendorProfile.gst_number} />
          <ReadOnlyField label="Bank Name" value={vendorProfile.bank_name} />
          <ReadOnlyField label="Bank Account Holder" value={vendorProfile.bank_account_holder_name} />
          <ReadOnlyField label="Bank Account Number" value={vendorProfile.bank_account_number} />
          <ReadOnlyField label="IFSC" value={vendorProfile.bank_ifsc} />
        </div>
      </div>
    </div>
  );
}

function ReadOnlyField({
  label,
  value,
  href,
}: {
  label: string;
  value: string | null | undefined;
  href?: string;
}) {
  return (
    <div>
      <p className="text-brand-gray text-xs mb-0.5">{label}</p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-brand-orange underline"
        >
          {value || "View"}
        </a>
      ) : (
        <p className="font-medium">{value || "—"}</p>
      )}
    </div>
  );
}
