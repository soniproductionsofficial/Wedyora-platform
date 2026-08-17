import Link from "next/link";
import { redirect } from "next/navigation";
import { Camera } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  requestVendorOtpAction,
  verifyVendorOtpAction,
  submitVendorDetailsAction,
  selectVendorPlanAction,
  resolveVendorOnboardingPhase,
} from "@/lib/actions/vendor";
import { VENDOR_PLANS } from "@/lib/vendor-plans";
import PayVendorFeesButton from "@/components/pay-vendor-fees-button";
import VendorLocationStep from "@/components/vendor-location-step";

type ApplyFields = {
  error?: string;
  phase?: string;
  phone?: string;
  business_name?: string;
};

export default async function VendorApplyPage({
  searchParams,
}: {
  searchParams: Promise<ApplyFields>;
}) {
  const params = await searchParams;
  const { error, phone, business_name } = params;
  let phase = params.phase === "otp" && !phone ? "signup" : params.phase || "signup";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Logged-in vendors hitting /vendor/apply land on their unfinished step.
  if (user && (!phase || phase === "signup")) {
    const next = await resolveVendorOnboardingPhase(user.id);
    if (next !== "done") {
      redirect(`/vendor/apply?phase=${next}`);
    }
  }

  const authedPhases = new Set(["details", "location", "plan", "fees", "done"]);
  if (authedPhases.has(phase) && !user) {
    redirect("/vendor/login");
  }

  const { data: categories } = await supabase
    .from("service_categories")
    .select("id, name")
    .order("name");

  let feesTotal = 0;
  let vendorName: string | null = null;
  let vendorPhone: string | null = null;
  let draftBusinessName = business_name ?? "";
  let draftPhone = phone ?? "";
  let draftFullName = "";

  if (user) {
    const [{ data: profile }, { data: vendor }] = await Promise.all([
      supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", user.id)
        .single(),
      supabase
        .from("vendor_profiles")
        .select("business_name")
        .eq("id", user.id)
        .maybeSingle(),
    ]);
    vendorName = profile?.full_name ?? null;
    vendorPhone = profile?.phone ?? null;
    draftFullName = profile?.full_name ?? "";
    draftPhone = profile?.phone ?? draftPhone;
    draftBusinessName = vendor?.business_name ?? draftBusinessName;

    if (phase === "fees") {
      const { data: pendingFees } = await supabase
        .from("vendor_payments")
        .select("amount")
        .eq("vendor_id", user.id)
        .eq("status", "pending")
        .in("type", ["registration_fee", "security_deposit"]);
      feesTotal = (pendingFees ?? []).reduce((sum, r) => sum + Number(r.amount), 0);
    }
  }

  const titles: Record<string, string> = {
    signup: "Become a Wedyora Vendor",
    otp: "Verify your phone",
    details: "Complete your application",
    location: "Allow location access",
    plan: "Choose your plan",
    fees: "Complete payment",
    done: "Application submitted",
  };

  return (
    <div className="relative flex min-h-[calc(100vh-64px)] items-center justify-center bg-brand-cream px-6 py-16">
      {phase === "plan" && (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/55 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="vendor-plan-title"
        >
          <div className="max-h-[min(90vh,40rem)] w-full max-w-lg overflow-y-auto rounded-2xl border border-brand-line bg-white p-5 shadow-2xl sm:p-7">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-brand-orange">
              Next step
            </p>
            <h2
              id="vendor-plan-title"
              className="mt-2 text-center font-heading text-2xl font-semibold"
            >
              Choose your registration plan
            </h2>
            <p className="mt-2 mb-6 text-center text-sm text-brand-gray">
              Select a plan to continue to payment.
            </p>

            {error && (
              <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-brand-orange-dark">
                {error}
              </p>
            )}

            <form action={selectVendorPlanAction} className="flex flex-col gap-4">
              <fieldset className="flex flex-col gap-3">
                <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-gray">
                  Registration Plan <span className="text-brand-orange">*</span>
                </legend>
                {VENDOR_PLANS.map((p, i) => (
                  <label
                    key={p.key}
                    className="flex cursor-pointer items-start gap-3 rounded-xl border border-brand-line px-4 py-3 text-sm transition-colors hover:border-brand-orange has-[:checked]:border-brand-orange has-[:checked]:bg-brand-orange/5"
                  >
                    <input
                      type="radio"
                      name="plan"
                      value={p.key}
                      required
                      defaultChecked={i === 2}
                      className="mt-1 accent-brand-orange"
                    />
                    <span>
                      <span className="font-medium">{p.label}</span>{" "}
                      <span className="text-xs text-brand-gray">
                        — best for {p.targetVendor}
                      </span>
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
              <button
                type="submit"
                className="mt-1 w-full rounded-full bg-brand-black py-3 font-semibold text-white transition-colors hover:bg-brand-charcoal"
              >
                Continue to Payment
              </button>
            </form>
          </div>
        </div>
      )}

      {phase === "done" && (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/55 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="vendor-done-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-brand-line bg-white p-6 text-center shadow-2xl sm:p-8">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-700">
              ✓
            </span>
            <h2
              id="vendor-done-title"
              className="mt-4 font-heading text-2xl font-semibold"
            >
              Application submitted
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-gray">
              Thank you for applying to become a Wedyora vendor. Our team will
              verify your details and get back to you soon.
            </p>
            <Link
              href="/vendor/dashboard"
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-brand-button py-3 font-semibold text-brand-black transition-colors hover:bg-brand-button-dark"
            >
              Go to Vendor Dashboard
            </Link>
            <Link href="/" className="mt-3 inline-block text-xs text-brand-gray">
              Back to Home
            </Link>
          </div>
        </div>
      )}

      <div className="w-full max-w-xl">
        <div className="mb-6 flex justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-black">
            <Camera className="h-6 w-6 text-white" strokeWidth={2} />
          </span>
        </div>

        <div className="rounded-2xl border border-brand-line bg-white p-6 shadow-sm md:p-8">
          <h1 className="mb-2 text-center font-heading text-2xl font-semibold">
            {titles[phase] ?? "Become a Wedyora Vendor"}
          </h1>

          {phase === "signup" && (
            <p className="mb-4 text-center text-sm text-brand-gray">
              Already started?{" "}
              <Link href="/vendor/login" className="font-medium text-brand-orange">
                Log in with your phone
              </Link>
            </p>
          )}

          <p className="mb-8 text-center text-sm text-brand-gray">
            {phase === "signup" &&
              "Sign up with your business name and contact number. We’ll text you a code to log in."}
            {phase === "otp" && `Enter the code we texted to ${phone}.`}
            {phase === "details" &&
              "Tell us about your business, KYC, and payout details to submit your application."}
            {phase === "location" &&
              "Help us place you in the right city for nearby bookings."}
            {phase === "plan" && "Choose a registration plan to continue."}
            {phase === "fees" &&
              "Pay the registration fee and refundable security deposit to finish."}
            {phase === "done" && "You’re all set — we’ll review your application shortly."}
          </p>

          {error && phase !== "plan" && (
            <p className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-brand-orange-dark">
              {error}
            </p>
          )}

          {phase === "signup" && (
            <form action={requestVendorOtpAction} className="flex flex-col gap-4">
              <Field label="Business Name" name="business_name" required />
              <Field label="Contact Number" name="phone" type="tel" required />
              <p className="text-xs text-brand-gray">
                India (+91) is assumed for 10-digit numbers.
              </p>
              <button
                type="submit"
                className="mt-2 w-full rounded-full bg-brand-black py-3 font-semibold text-white transition-colors hover:bg-brand-charcoal"
              >
                Send OTP
              </button>
            </form>
          )}

          {phase === "otp" && (
            <form action={verifyVendorOtpAction} className="flex flex-col gap-4">
              <input type="hidden" name="phone" value={phone ?? ""} />
              <input type="hidden" name="business_name" value={business_name ?? ""} />
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
                className="mt-2 w-full rounded-full bg-brand-black py-3 font-semibold text-white transition-colors hover:bg-brand-charcoal"
              >
                Verify &amp; Log In
              </button>
              <Link href="/vendor/apply" className="text-center text-xs text-brand-gray">
                Wrong number? Start over
              </Link>
            </form>
          )}

          {phase === "details" && (
            <form
              action={submitVendorDetailsAction}
              encType="multipart/form-data"
              className="flex flex-col gap-4"
            >
              <fieldset className="mb-2 flex flex-col gap-4 border-b border-brand-line pb-6">
                <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-gray">
                  Account (Mobile Verification)
                </legend>
                <Field
                  label="Full Name"
                  name="full_name"
                  required
                  defaultValue={draftFullName}
                />
                <Field
                  label="Phone"
                  name="phone"
                  type="tel"
                  required
                  defaultValue={draftPhone}
                />
              </fieldset>

              <fieldset className="mb-2 flex flex-col gap-4 border-b border-brand-line pb-6">
                <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-gray">
                  Business Details
                </legend>
                <Field
                  label="Business Name"
                  name="business_name"
                  required
                  defaultValue={draftBusinessName}
                />

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
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Years of Experience" name="experience_years" type="number" />
                  <Field label="Team Size" name="team_size" type="number" />
                </div>
                <Field label="Available From" name="available_from" type="date" />
                <label className="flex flex-col gap-1.5 text-sm font-medium">
                  Equipment Details{" "}
                  <span className="font-normal text-brand-gray">(optional)</span>
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

              <fieldset className="mb-2 flex flex-col gap-4 border-b border-brand-line pb-6">
                <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-gray">
                  KYC Documents
                </legend>
                <p className="-mt-2 text-xs text-brand-gray">
                  Used to verify your identity and business — never shown
                  publicly, only visible to you and the Wedyora team.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FileField
                    label="Upload Aadhaar document"
                    name="aadhaar_document"
                    hint="JPG, PNG, WEBP, or PDF · max 10 MB"
                  />
                  <FileField
                    label="Upload PAN document"
                    name="pan_document"
                    hint="JPG, PNG, WEBP, or PDF · max 10 MB"
                  />
                </div>
                <Field label="GST Number (if registered)" name="gst_number" />
              </fieldset>

              <fieldset className="flex flex-col gap-4">
                <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-gray">
                  Bank Details (for payouts)
                </legend>
                <Field label="Bank Name" name="bank_name" />
                <Field label="Account Holder Name" name="bank_account_holder_name" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Account Number" name="bank_account_number" />
                  <Field label="IFSC Code" name="bank_ifsc" />
                </div>
              </fieldset>

              <fieldset className="flex flex-col gap-3 border-t border-brand-line pt-6">
                <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-gray">
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
                      className="font-medium text-brand-orange underline"
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
                    By registering with WEDYORA and accepting assignments through
                    the platform, the Vendor confirms that they have read,
                    understood, and agree to comply with this{" "}
                    <Link
                      href="/vendor-cancellation-policy"
                      target="_blank"
                      className="font-medium text-brand-orange underline"
                    >
                      Vendor Cancellation Policy
                    </Link>
                    .
                  </span>
                </label>
              </fieldset>

              <button
                type="submit"
                className="mt-2 w-full rounded-full bg-brand-black py-3 font-semibold text-white transition-colors hover:bg-brand-charcoal"
              >
                Submit Application
              </button>
            </form>
          )}

          {phase === "location" && <VendorLocationStep />}

          {phase === "fees" && (
            <div className="flex flex-col gap-4">
              {feesTotal > 0 ? (
                <>
                  <div className="rounded-xl border border-brand-line bg-brand-cream p-5 text-center">
                    <p className="mb-1 text-xs text-brand-gray">Total due now</p>
                    <p className="font-heading text-2xl font-bold">
                      ₹{feesTotal.toLocaleString("en-IN")}
                    </p>
                    <p className="mt-1 text-xs text-brand-gray">
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
                <p className="text-center text-sm text-brand-gray">
                  Nothing pending —{" "}
                  <Link
                    href="/vendor/apply?phase=done"
                    className="text-brand-orange underline"
                  >
                    view confirmation
                  </Link>
                  .
                </p>
              )}
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
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  minLength?: number;
  defaultValue?: string;
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
        defaultValue={defaultValue}
        className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
      />
    </label>
  );
}

function FileField({
  label,
  name,
  hint,
}: {
  label: string;
  name: string;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium">
      {label}
      <input
        name={name}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        className="rounded-lg border border-dashed border-brand-line bg-brand-cream/40 px-3 py-2.5 text-sm font-normal file:mr-3 file:rounded-full file:border-0 file:bg-brand-black file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:border-brand-orange/50 focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
      />
      {hint ? <span className="text-xs font-normal text-brand-gray">{hint}</span> : null}
    </label>
  );
}
