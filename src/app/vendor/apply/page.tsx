import Link from "next/link";
import { Camera, UploadCloud } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  requestVendorOtpAction,
  verifyVendorOtpAction,
  uploadPortfolioAction,
} from "@/lib/actions/vendor";
import { VENDOR_PLANS } from "@/lib/vendor-plans";
import PayVendorFeesButton from "@/components/pay-vendor-fees-button";

type ApplyFields = {
  error?: string;
  phase?: string;
  phone?: string;
  full_name?: string;
  plan?: string;
  business_name?: string;
  category_id?: string;
  city?: string;
  bio?: string;
  experience_years?: string;
  equipment_details?: string;
  team_size?: string;
  service_areas?: string;
  available_from?: string;
  pan_number?: string;
  aadhaar_number?: string;
  gst_number?: string;
  bank_account_holder_name?: string;
  bank_account_number?: string;
  bank_ifsc?: string;
  agree_vendor_terms?: string;
  agree_cancellation_policy?: string;
};

export default async function VendorApplyPage({
  searchParams,
}: {
  searchParams: Promise<ApplyFields>;
}) {
  const params = await searchParams;
  const { error, phone } = params;
  const phase = params.phase === "otp" && !phone ? "form" : params.phase || "form";

  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("service_categories")
    .select("id, name")
    .order("name");

  let feesTotal = 0;
  let vendorName: string | null = null;
  let vendorPhone: string | null = null;
  if (phase === "fees") {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const [{ data: pendingFees }, { data: profile }] = await Promise.all([
        supabase
          .from("vendor_payments")
          .select("amount")
          .eq("vendor_id", user.id)
          .eq("status", "pending")
          .in("type", ["registration_fee", "security_deposit"]),
        supabase.from("profiles").select("full_name, phone").eq("id", user.id).single(),
      ]);
      feesTotal = (pendingFees ?? []).reduce((sum, r) => sum + Number(r.amount), 0);
      vendorName = profile?.full_name ?? null;
      vendorPhone = profile?.phone ?? null;
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-brand-cream flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl">
        <div className="flex justify-center mb-6">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-black">
            <Camera className="h-6 w-6 text-white" strokeWidth={2} />
          </span>
        </div>

        <div className="bg-white border border-brand-line rounded-2xl shadow-sm p-6 md:p-8">
          <h1 className="font-heading text-2xl font-semibold mb-2 text-center">
            {phase === "done" ? "Application Submitted" : "Apply as a Wedyora Vendor"}
          </h1>
          <p className="text-brand-gray text-sm mb-8 text-center">
            {phase === "form" &&
              "Join our verified vendor network. Our team reviews every application before you start receiving bookings."}
            {phase === "otp" && `Enter the code we texted to ${phone} to submit your application.`}
            {phase === "fees" &&
              "One last step — pay your plan's registration fee and refundable security deposit to submit your application for review."}
            {phase === "portfolio" &&
              "Upload a few photos or samples of your work (optional — you can add more later)."}
            {phase === "done" &&
              "Our team will review your application and you'll be notified once approved."}
          </p>

          {error && (
            <p className="mb-6 rounded-lg bg-red-50 text-brand-orange-dark text-sm px-4 py-3">
              {error}
            </p>
          )}

          {phase === "otp" && (
            <form action={verifyVendorOtpAction} className="flex flex-col gap-4">
              {(Object.keys(params) as (keyof ApplyFields)[])
                .filter((k) => k !== "error" && k !== "phase")
                .map((k) => (
                  <input key={k} type="hidden" name={k} value={params[k] ?? ""} />
                ))}
              <label className="flex flex-col gap-1.5 text-sm font-medium">
                6-digit code
                <input
                  name="token"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  required
                  className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                />
              </label>
              <button
                type="submit"
                className="mt-2 w-full rounded-full bg-brand-black text-white font-semibold py-3 hover:bg-brand-charcoal transition-colors"
              >
                Verify &amp; Submit Application
              </button>
              <a href="/vendor/apply" className="text-xs text-brand-gray text-center">
                Wrong number? Start over
              </a>
            </form>
          )}

          {phase === "form" && (
            <form action={requestVendorOtpAction} className="flex flex-col gap-4">
              <fieldset className="flex flex-col gap-4 border-b border-brand-line pb-6 mb-2">
                <legend className="text-xs font-semibold uppercase tracking-wide text-brand-gray mb-1">
                  Account (Mobile Verification)
                </legend>
                <Field label="Full Name" name="full_name" required />
                <Field label="Phone" name="phone" type="tel" required />
              </fieldset>

              <fieldset className="flex flex-col gap-3 border-b border-brand-line pb-6 mb-2">
                <legend className="text-xs font-semibold uppercase tracking-wide text-brand-gray mb-1">
                  Registration Plan <span className="text-brand-orange">*</span>
                </legend>
                {VENDOR_PLANS.map((p, i) => (
                  <label
                    key={p.key}
                    className="flex items-start gap-3 rounded-xl border border-brand-line px-4 py-3 text-sm cursor-pointer hover:border-brand-orange transition-colors has-[:checked]:border-brand-orange has-[:checked]:bg-brand-orange/5"
                  >
                    <input
                      type="radio"
                      name="plan"
                      value={p.key}
                      required
                      defaultChecked={i === 0}
                      className="mt-1"
                    />
                    <span>
                      <span className="font-medium">{p.label}</span>{" "}
                      <span className="text-brand-gray text-xs">— best for {p.targetVendor}</span>
                      <br />
                      <span className="text-xs text-brand-gray">
                        ₹{p.registrationFee.toLocaleString("en-IN")} registration &middot; ₹
                        {p.annualRenewal.toLocaleString("en-IN")}/yr renewal &middot; ₹
                        {p.securityDeposit.toLocaleString("en-IN")} refundable deposit
                      </span>
                    </span>
                  </label>
                ))}
              </fieldset>

              <fieldset className="flex flex-col gap-4 border-b border-brand-line pb-6 mb-2">
                <legend className="text-xs font-semibold uppercase tracking-wide text-brand-gray mb-1">
                  Business Details
                </legend>
                <Field label="Business Name" name="business_name" required />

                <label className="flex flex-col gap-1.5 text-sm font-medium">
                  Service Category <span className="text-brand-orange">*</span>
                  <select
                    name="category_id"
                    required
                    className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                  >
                    <option value="">Select a category</option>
                    {categories?.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>

                <Field label="City Selection" name="city" required />
                <Field
                  label="Service Areas (comma-separated, e.g. Bangalore, Mysore)"
                  name="service_areas"
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Years of Experience" name="experience_years" type="number" />
                  <Field label="Team Size" name="team_size" type="number" />
                </div>
                <Field label="Available From" name="available_from" type="date" />
                <label className="flex flex-col gap-1.5 text-sm font-medium">
                  Equipment Details <span className="text-brand-gray font-normal">(optional)</span>
                  <input
                    name="equipment_details"
                    placeholder="e.g. 2 DSLR bodies, drone, LED lighting kit"
                    className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-sm font-medium">
                  Tell us about your work
                  <textarea
                    name="bio"
                    rows={4}
                    className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                  />
                </label>
              </fieldset>

              <fieldset className="flex flex-col gap-4 border-b border-brand-line pb-6 mb-2">
                <legend className="text-xs font-semibold uppercase tracking-wide text-brand-gray mb-1">
                  KYC Documents
                </legend>
                <p className="text-xs text-brand-gray -mt-2">
                  Used to verify your identity and business — never shown
                  publicly, only visible to you and the Wedyora team.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="PAN Number" name="pan_number" />
                  <Field label="Aadhaar Number" name="aadhaar_number" />
                </div>
                <Field label="GST Number (if registered)" name="gst_number" />
              </fieldset>

              <fieldset className="flex flex-col gap-4">
                <legend className="text-xs font-semibold uppercase tracking-wide text-brand-gray mb-1">
                  Bank Details (for payouts)
                </legend>
                <Field label="Account Holder Name" name="bank_account_holder_name" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Account Number" name="bank_account_number" />
                  <Field label="IFSC Code" name="bank_ifsc" />
                </div>
              </fieldset>

              <fieldset className="flex flex-col gap-3 border-t border-brand-line pt-6">
                <legend className="text-xs font-semibold uppercase tracking-wide text-brand-gray mb-1">
                  Agreements
                </legend>
                <label className="flex items-start gap-3 text-xs text-brand-gray">
                  <input
                    type="checkbox"
                    name="agree_vendor_terms"
                    value="yes"
                    required
                    className="mt-0.5 h-4 w-4 rounded border-brand-line accent-brand-orange"
                  />
                  <span>
                    I HAVE READ, UNDERSTOOD, AND AGREE TO THE{" "}
                    <Link
                      href="/vendor-terms"
                      target="_blank"
                      className="text-brand-orange font-medium underline"
                    >
                      WEDYORA PHOTOGRAPHY VENDOR TERMS &amp; CONDITIONS
                    </Link>
                    .
                  </span>
                </label>
                <label className="flex items-start gap-3 text-xs text-brand-gray">
                  <input
                    type="checkbox"
                    name="agree_cancellation_policy"
                    value="yes"
                    required
                    className="mt-0.5 h-4 w-4 rounded border-brand-line accent-brand-orange"
                  />
                  <span>
                    By registering with WEDYORA and accepting assignments
                    through the platform, the Vendor confirms that they have
                    read, understood, and agree to comply with this{" "}
                    <Link
                      href="/vendor-cancellation-policy"
                      target="_blank"
                      className="text-brand-orange font-medium underline"
                    >
                      Vendor Cancellation Policy
                    </Link>
                    .
                  </span>
                </label>
              </fieldset>

              <button
                type="submit"
                className="mt-2 w-full rounded-full bg-brand-black text-white font-semibold py-3 hover:bg-brand-charcoal transition-colors"
              >
                Send Code
              </button>
            </form>
          )}

          {phase === "fees" && (
            <div className="flex flex-col gap-4">
              {feesTotal > 0 ? (
                <>
                  <div className="rounded-xl border border-brand-line bg-brand-cream p-5 text-center">
                    <p className="text-xs text-brand-gray mb-1">Total due now</p>
                    <p className="font-heading text-2xl font-bold">
                      ₹{feesTotal.toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-brand-gray mt-1">
                      Registration fee (one-time) + refundable security deposit
                    </p>
                  </div>
                  <PayVendorFeesButton
                    amount={feesTotal}
                    vendorName={vendorName}
                    vendorPhone={vendorPhone}
                  />
                </>
              ) : (
                <p className="text-brand-gray text-sm text-center">
                  Nothing pending — you can{" "}
                  <Link href="/vendor/apply?phase=portfolio" className="text-brand-orange underline">
                    continue to the portfolio step
                  </Link>
                  .
                </p>
              )}
            </div>
          )}

          {phase === "portfolio" && (
            <form
              action={uploadPortfolioAction}
              encType="multipart/form-data"
              className="flex flex-col gap-4"
            >
              <label className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-brand-line px-6 py-10 text-center cursor-pointer hover:border-brand-orange transition-colors">
                <UploadCloud className="h-8 w-8 text-brand-orange" />
                <span className="text-sm text-brand-gray">
                  Click to choose photos or files (you can select multiple)
                </span>
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
                className="w-full rounded-full bg-brand-orange text-white font-semibold py-3 hover:bg-brand-orange-dark transition-colors"
              >
                Upload &amp; Finish
              </button>
              <Link href="/vendor/apply?phase=done" className="text-xs text-brand-gray text-center">
                Skip for now
              </Link>
            </form>
          )}

          {phase === "done" && (
            <div className="flex flex-col items-center gap-4 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700 text-2xl">
                ✓
              </span>
              <p className="text-sm text-brand-gray">
                Your application is in — we&rsquo;ll notify you once our
                team reviews and approves it.
              </p>
              <Link
                href="/"
                className="mt-2 w-full rounded-full bg-brand-orange text-white font-semibold py-3 hover:bg-brand-orange-dark transition-colors text-center"
              >
                Go to Home
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  minLength,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium">
      {label}
      {required ? <span className="text-brand-orange"> *</span> : null}
      <input
        name={name}
        type={type}
        required={required}
        minLength={minLength}
        className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
      />
    </label>
  );
}
