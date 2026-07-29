import Link from "next/link";
import { requestSignupOtpAction, verifySignupOtpAction } from "@/lib/actions/auth";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    phase?: string;
    phone?: string;
    full_name?: string;
    city?: string;
  }>;
}) {
  const { error, phase, phone, full_name, city } = await searchParams;
  const otpPhase = phase === "otp" && !!phone;

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-heading text-2xl font-semibold mb-2">
        Create your Wedyora account
      </h1>
      <p className="text-brand-gray text-sm mb-8">
        {otpPhase
          ? `Enter the code we texted to ${phone}.`
          : "Sign up as a customer to start planning your wedding."}
      </p>

      {error && (
        <p className="mb-6 rounded-lg bg-red-50 text-brand-red-dark text-sm px-4 py-3">
          {error}
        </p>
      )}

      {otpPhase ? (
        <form action={verifySignupOtpAction} className="flex flex-col gap-4">
          <input type="hidden" name="phone" value={phone} />
          <input type="hidden" name="full_name" value={full_name ?? ""} />
          <input type="hidden" name="city" value={city ?? ""} />
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
            className="mt-2 w-full rounded-full bg-brand-red text-white font-semibold py-3 hover:bg-brand-red-dark transition-colors"
          >
            Verify &amp; Create Account
          </button>
          <Link href="/signup" className="text-xs text-brand-gray text-center">
            Wrong number? Start over
          </Link>
        </form>
      ) : (
        <form action={requestSignupOtpAction} className="flex flex-col gap-4">
          <Field label="Full Name" name="full_name" required />
          <Field label="Phone" name="phone" type="tel" required />
          <Field label="City" name="city" />

          <button
            type="submit"
            className="mt-2 w-full rounded-full bg-brand-red text-white font-semibold py-3 hover:bg-brand-red-dark transition-colors"
          >
            Send Code
          </button>
        </form>
      )}

      <p className="text-sm text-brand-gray mt-6 text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-brand-red font-medium">
          Log in
        </Link>
      </p>

      <p className="text-xs text-brand-gray mt-4 text-center">
        Are you a wedding vendor?{" "}
        <Link href="/vendor/apply" className="text-brand-red font-medium">
          Apply here instead
        </Link>
      </p>
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
