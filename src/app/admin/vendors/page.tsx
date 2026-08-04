import { createClient } from "@/lib/supabase/server";
import { reviewVendorAction, logVendorPenaltyAction } from "@/lib/actions/admin";
import { getVendorPlan } from "@/lib/vendor-plans";
import { PENALTY_ISSUES } from "@/lib/vendor-penalties";
import { nextIncentiveTier } from "@/lib/vendor-incentives";
import type { VendorStatus } from "@/types/database";

const TABS: VendorStatus[] = ["pending_payment", "pending", "approved", "rejected", "suspended"];
const TAB_LABEL: Record<VendorStatus, string> = {
  pending_payment: "Awaiting Fee Payment",
  pending: "Pending Review",
  approved: "Approved",
  rejected: "Rejected",
  suspended: "Suspended",
};

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
      "id, business_name, city, bio, experience_years, status, created_at, team_size, service_areas, available_from, equipment_details, pan_number, aadhaar_number, gst_number, bank_account_holder_name, bank_account_number, bank_ifsc, portfolio_urls, plan, security_deposit_amount, plan_paid_at, plan_expires_at, successful_events_count, partner_tier, service_categories(name), profiles!vendor_profiles_id_fkey(full_name, phone)"
    )
    .eq("status", activeStatus)
    .order("created_at", { ascending: true });

  if (vendorsError) {
    console.error("Failed to load vendor applications:", vendorsError);
  }

  const vendorIds = (vendors ?? []).map((v) => v.id);
  const { data: ledgerRows } = vendorIds.length
    ? await supabase
        .from("vendor_payments")
        .select("id, vendor_id, type, direction, amount, status, reason, created_at")
        .in("vendor_id", vendorIds)
        .order("created_at", { ascending: false })
    : { data: [] as never[] };

  const ledgerByVendor = (ledgerRows ?? []).reduce<Record<string, typeof ledgerRows>>(
    (acc, r) => {
      (acc[r.vendor_id] ??= []).push(r);
      return acc;
    },
    {}
  );

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
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              activeStatus === t
                ? "bg-brand-button text-brand-black border-brand-button"
                : "border-brand-line text-brand-gray hover:border-brand-orange hover:text-brand-orange"
            }`}
          >
            {TAB_LABEL[t]}
          </a>
        ))}
      </div>

      {vendorsError && (
        <p className="mb-6 rounded-lg bg-red-50 text-brand-orange-dark text-sm px-4 py-3">
          Couldn&apos;t load applications: {vendorsError.message}
        </p>
      )}

      {!vendors || vendors.length === 0 ? (
        <p className="text-brand-gray text-sm">No {TAB_LABEL[activeStatus].toLowerCase()} vendors.</p>
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

                <div className="mt-3 pt-3 border-t border-brand-line text-xs text-brand-gray max-w-xl">
                  <p>
                    <span className="font-medium text-brand-black">Plan:</span>{" "}
                    {getVendorPlan(v.plan)?.label ?? "—"}
                    {v.security_deposit_amount != null &&
                      ` · Deposit ₹${Number(v.security_deposit_amount).toLocaleString("en-IN")}`}
                    {v.plan_paid_at
                      ? ` · Paid ${new Date(v.plan_paid_at).toLocaleDateString("en-IN")}`
                      : " · Not yet paid"}
                    {v.plan_expires_at &&
                      ` · Renews ${new Date(v.plan_expires_at).toLocaleDateString("en-IN")}`}
                  </p>
                  <p className="mt-1">
                    <span className="font-medium text-brand-black">Performance:</span>{" "}
                    {v.successful_events_count} completed event
                    {v.successful_events_count === 1 ? "" : "s"} &middot;{" "}
                    <span className="capitalize">{v.partner_tier}</span> tier
                    {nextIncentiveTier(v.successful_events_count) &&
                      ` · next bonus at ${nextIncentiveTier(v.successful_events_count)!.events} events (₹${nextIncentiveTier(v.successful_events_count)!.bonus.toLocaleString("en-IN")})`}
                  </p>
                </div>

                {ledgerByVendor[v.id] && ledgerByVendor[v.id]!.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-brand-line max-w-xl">
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-gray mb-2">
                      Ledger
                    </p>
                    <div className="flex flex-col gap-1">
                      {ledgerByVendor[v.id]!.slice(0, 5).map((r) => (
                        <div
                          key={r.id}
                          className="flex items-center justify-between text-xs gap-2"
                        >
                          <span className="text-brand-gray">
                            {r.reason ?? r.type} &middot;{" "}
                            {new Date(r.created_at).toLocaleDateString("en-IN")}
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

                {(activeStatus === "approved" || activeStatus === "suspended") && (
                  <form
                    action={logVendorPenaltyAction}
                    className="mt-3 pt-3 border-t border-brand-line flex flex-wrap items-end gap-2 max-w-xl"
                  >
                    <input type="hidden" name="vendor_id" value={v.id} />
                    <label className="flex flex-col gap-1 text-xs font-medium">
                      Log Penalty
                      <select
                        name="issue"
                        required
                        className="rounded-lg border border-brand-line px-3 py-1.5 text-xs min-w-[180px]"
                      >
                        <option value="">Select an issue</option>
                        {PENALTY_ISSUES.map((i) => (
                          <option key={i.key} value={i.key}>
                            {i.label} (₹{i.amount.toLocaleString("en-IN")}
                            {i.perDay ? "/day" : ""})
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="flex flex-col gap-1 text-xs font-medium">
                      Days late (if applicable)
                      <input
                        type="number"
                        name="days_late"
                        min={1}
                        defaultValue={1}
                        className="rounded-lg border border-brand-line px-3 py-1.5 text-xs w-24"
                      />
                    </label>
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-full border border-brand-line text-xs font-semibold hover:bg-brand-cream"
                    >
                      Log
                    </button>
                  </form>
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
                      className="px-4 py-2 rounded-full bg-brand-button text-brand-black text-sm font-semibold hover:bg-brand-button-dark"
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
