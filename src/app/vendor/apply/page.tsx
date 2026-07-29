import { createClient } from "@/lib/supabase/server";
import { requestVendorOtpAction, verifyVendorOtpAction } from "@/lib/actions/vendor";

export default async function VendorApplyPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    phase?: string;
    phone?: string;
    full_name?: string;
    business_name?: string;
    category_id?: string;
    city?: string;
    bio?: string;
    experience_years?: string;
  }>;
}) {
  const {
    error,
    phase,
    phone,
    full_name,
    business_name,
    category_id,
    city,
    bio,
    experience_years,
  } = await searchParams;
  const otpPhase = phase === "otp" && !!phone;

  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("service_categories")
    .select("id, name")
    .order("name");

  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <h1 className="font-heading text-2xl font-semibold mb-2">
        Apply as a Wedyora Vendor
      </h1>
      <p className="text-brand-gray text-sm mb-8">
        {otpPhase
          ? `Enter the code we texted to ${phone} to submit your application.`
          : "Join our verified vendor network. Our team reviews every application before you start receiving bookings."}
      </p>

      {error && (
        <p className="mb-6 rounded-lg bg-red-50 text-brand-red-dark text-sm px-4 py-3">
          {error}
        </p>
      )}

      {otpPhase ? (
        <form action={verifyVendorOtpAction} className="flex flex-col gap-4">
          <input type="hidden" name="phone" value={phone} />
          <input type="hidden" name="full_name" value={full_name ?? ""} />
          <input type="hidden" name="business_name" value={business_name ?? ""} />
          <input type="hidden" name="category_id" value={category_id ?? ""} />
          <input type="hidden" name="city" value={city ?? ""} />
          <input type="hidden" name="bio" value={bio ?? ""} />
          <input type="hidden" name="experience_years" value={experience_years ?? ""} />
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            6-digit code
            <input
              name="token"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              required
              className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-red/40"
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
      ) : (
        <form action={requestVendorOtpAction} className="flex flex-col gap-4">
          <fieldset className="flex flex-col gap-4 border-b border-brand-line pb-6 mb-2">
            <legend className="text-xs font-semibold uppercase tracking-wide text-brand-gray mb-1">
              Account
            </legend>
            <Field label="Full Name" name="full_name" required />
            <Field label="Phone" name="phone" type="tel" required />
          </fieldset>

          <fieldset className="flex flex-col gap-4">
            <legend className="text-xs font-semibold uppercase tracking-wide text-brand-gray mb-1">
              Business Details
            </legend>
            <Field label="Business Name" name="business_name" required />

            <label className="flex flex-col gap-1.5 text-sm font-medium">
              Service Category <span className="text-brand-red">*</span>
              <select
                name="category_id"
                required
                className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-red/40"
              >
                <option value="">Select a category</option>
                {categories?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <Field label="City" name="city" required />
            <Field
              label="Years of Experience"
              name="experience_years"
              type="number"
            />
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              Tell us about your work
              <textarea
                name="bio"
                rows={4}
                className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-red/40"
              />
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
      {required ? <span className="text-brand-red"> *</span> : null}
      <input
        name={name}
        type={type}
        required={required}
        minLength={minLength}
        className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-red/40"
      />
    </label>
  );
}
