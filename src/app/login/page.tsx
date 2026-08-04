import Link from "next/link";
import { Camera } from "lucide-react";
import { requestLoginOtpAction, verifyLoginOtpAction } from "@/lib/actions/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    message?: string;
    redirectTo?: string;
    phase?: string;
    phone?: string;
  }>;
}) {
  const { error, message, redirectTo, phase, phone } = await searchParams;
  const otpPhase = phase === "otp" && !!phone;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-brand-cream flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <span className="animate-float hover-wiggle flex h-12 w-12 items-center justify-center rounded-xl bg-brand-black">
            <Camera className="h-6 w-6 text-white" strokeWidth={2} />
          </span>
        </div>

        <div className="animate-scale-in bg-white border border-brand-line rounded-2xl shadow-sm p-6 md:p-8">
          <h1 className="font-heading text-2xl font-semibold mb-2 text-center">
            Log in
          </h1>
          <p className="text-brand-gray text-sm mb-8 text-center">
            {otpPhase ? `Enter the code we texted to ${phone}.` : "Welcome back to Wedyora."}
          </p>

          {message && (
            <p className="mb-6 rounded-lg bg-green-50 text-green-700 text-sm px-4 py-3">
              {message}
            </p>
          )}
          {error && (
            <p className="mb-6 rounded-lg bg-red-50 text-brand-orange-dark text-sm px-4 py-3">
              {error}
            </p>
          )}

          {otpPhase ? (
            <form action={verifyLoginOtpAction} className="flex flex-col gap-4">
              <input type="hidden" name="phone" value={phone} />
              <input type="hidden" name="redirectTo" value={redirectTo ?? "/account"} />
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
                className="mt-2 w-full rounded-full bg-brand-button text-brand-black font-semibold py-3 hover:bg-brand-button-dark transition-colors"
              >
                Verify &amp; Log In
              </button>
              <Link href="/login" className="text-xs text-brand-gray text-center">
                Wrong number? Start over
              </Link>
            </form>
          ) : (
            <form action={requestLoginOtpAction} className="flex flex-col gap-4">
              <input type="hidden" name="redirectTo" value={redirectTo ?? "/account"} />
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
              <button
                type="submit"
                className="mt-2 w-full rounded-full bg-brand-button text-brand-black font-semibold py-3 hover:bg-brand-button-dark transition-colors"
              >
                Send Code
              </button>
            </form>
          )}

          <p className="text-sm text-brand-gray mt-6 text-center">
            Don&rsquo;t have an account?{" "}
            <Link href="/signup" className="text-brand-orange font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
