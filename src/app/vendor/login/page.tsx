import Link from "next/link";
import { Store } from "lucide-react";
import {
  requestVendorLoginOtpAction,
  verifyVendorLoginOtpAction,
} from "@/lib/actions/vendor";

export default async function VendorLoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    message?: string;
    phase?: string;
    phone?: string;
  }>;
}) {
  const { error, message, phase, phone } = await searchParams;
  const otpPhase = phase === "otp" && !!phone;

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-brand-cream px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-black">
            <Store className="h-6 w-6 text-white" strokeWidth={2} />
          </span>
        </div>

        <div className="rounded-2xl border border-brand-line bg-white p-6 shadow-sm md:p-8">
          <h1 className="mb-2 text-center font-heading text-2xl font-semibold">
            Vendor Log In
          </h1>
          <p className="mb-8 text-center text-sm text-brand-gray">
            {otpPhase
              ? `Enter the code we texted to ${phone}.`
              : "Sign in with your registered phone number."}
          </p>

          {message && (
            <p className="mb-6 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </p>
          )}
          {error && (
            <p className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-brand-orange-dark">
              {error}
            </p>
          )}

          {otpPhase ? (
            <form action={verifyVendorLoginOtpAction} className="flex flex-col gap-4">
              <input type="hidden" name="phone" value={phone} />
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
                className="mt-2 w-full rounded-full bg-brand-button py-3 font-semibold text-brand-black transition-colors hover:bg-brand-button-dark"
              >
                Verify &amp; Open Dashboard
              </button>
              <Link href="/vendor/login" className="text-center text-xs text-brand-gray">
                Wrong number? Start over
              </Link>
            </form>
          ) : (
            <form action={requestVendorLoginOtpAction} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-sm font-medium">
                Phone number
                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder="98765 43210"
                  className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                />
              </label>
              <p className="text-xs text-brand-gray">
                We&rsquo;ll text a one-time code to this number. India (+91) is
                assumed if you enter 10 digits.
              </p>
              <button
                type="submit"
                className="mt-2 w-full rounded-full bg-brand-button py-3 font-semibold text-brand-black transition-colors hover:bg-brand-button-dark"
              >
                Send Code
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-brand-gray">
            New partner?{" "}
            <Link href="/vendor/apply" className="font-medium text-brand-orange">
              Apply here
            </Link>
          </p>
          <p className="mt-2 text-center text-sm text-brand-gray">
            Looking for a customer account?{" "}
            <Link href="/login" className="font-medium text-brand-orange">
              Customer log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
