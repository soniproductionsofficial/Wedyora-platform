import Link from "next/link";
import { Camera } from "lucide-react";
import {
  requestSignupOtpAction,
  verifySignupOtpAction,
  submitProfileStepAction,
  submitLanguageStepAction,
  submitWeddingDateStepAction,
  submitVenueStepAction,
  submitBudgetStepAction,
} from "@/lib/actions/auth";
import SignupLocationStep from "@/components/signup-location-step";

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "ta", label: "Tamil" },
  { value: "te", label: "Telugu" },
  { value: "kn", label: "Kannada" },
  { value: "ml", label: "Malayalam" },
  { value: "mr", label: "Marathi" },
  { value: "bn", label: "Bengali" },
  { value: "gu", label: "Gujarati" },
  { value: "pa", label: "Punjabi" },
];

const BUDGET_RANGES = [
  { value: "0-200000", label: "Under ₹2 Lakhs" },
  { value: "200000-500000", label: "₹2 – 5 Lakhs" },
  { value: "500000-1000000", label: "₹5 – 10 Lakhs" },
  { value: "1000000-2000000", label: "₹10 – 20 Lakhs" },
  { value: "2000000-5000000", label: "₹20 – 50 Lakhs" },
  { value: "5000000-", label: "₹50 Lakhs+" },
];

const STEP_ORDER = [
  "phone",
  "otp",
  "profile",
  "location",
  "language",
  "date",
  "venue",
  "budget",
] as const;

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; phase?: string; phone?: string }>;
}) {
  const { error, phase: rawPhase, phone } = await searchParams;
  // "otp" is only a real phase if we actually have a phone number to verify
  // (e.g. someone bookmarked /signup?phase=otp) — anything else falls back
  // to the very first step.
  const phase = rawPhase === "otp" ? (phone ? "otp" : "phone") : rawPhase || "phone";
  const stepIndex = STEP_ORDER.indexOf(phase as (typeof STEP_ORDER)[number]);
  const showProgress = phase !== "done" && stepIndex >= 0;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-brand-cream flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <span className="animate-float hover-wiggle flex h-12 w-12 items-center justify-center rounded-xl bg-brand-black">
            <Camera className="h-6 w-6 text-white" strokeWidth={2} />
          </span>
        </div>

        <div className="animate-scale-in bg-white border border-brand-line rounded-2xl shadow-sm p-6 md:p-8">
          {showProgress && (
            <p className="text-center text-xs font-semibold uppercase tracking-wide text-brand-gold mb-3">
              Step {stepIndex + 1} of {STEP_ORDER.length}
            </p>
          )}

          <h1 className="font-heading text-2xl font-semibold mb-2 text-center">
            {phase === "done" ? "You're all set!" : "Create your Wedyora account"}
          </h1>
          <p className="text-brand-gray text-sm mb-8 text-center">
            {phase === "phone" && "Sign up as a customer to start planning your wedding."}
            {phase === "otp" && `Enter the code we texted to ${phone}.`}
            {phase === "profile" && "A little about you."}
            {phase === "location" && "Help us find vendors near you."}
            {phase === "language" && "What language do you prefer?"}
            {phase === "date" && "When's the big day? (You can update this later.)"}
            {phase === "venue" && "Where's it happening? (You can update this later.)"}
            {phase === "budget" && "What's your rough budget? (You can update this later.)"}
            {phase === "done" && "Your account has been created successfully."}
          </p>

          {error && (
            <p className="mb-6 rounded-lg bg-red-50 text-brand-orange-dark text-sm px-4 py-3">
              {error}
            </p>
          )}

          {phase === "otp" && (
            <form action={verifySignupOtpAction} className="flex flex-col gap-4">
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
                className="mt-2 w-full rounded-full bg-brand-button text-brand-black font-semibold py-3 hover:bg-brand-button-dark transition-colors"
              >
                Verify &amp; Continue
              </button>
              <Link href="/signup" className="text-xs text-brand-gray text-center">
                Wrong number? Start over
              </Link>
            </form>
          )}

          {phase === "phone" && (
            <form action={requestSignupOtpAction} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-sm font-medium">
                Phone Number <span className="text-brand-orange">*</span>
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

          {phase === "profile" && (
            <form action={submitProfileStepAction} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-sm font-medium">
                Full Name <span className="text-brand-orange">*</span>
                <input
                  name="full_name"
                  required
                  className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-medium">
                Email Address <span className="text-brand-gray font-normal">(optional)</span>
                <input
                  name="email"
                  type="email"
                  placeholder="For booking receipts — never used to log in"
                  className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                />
              </label>
              <button
                type="submit"
                className="mt-2 w-full rounded-full bg-brand-button text-brand-black font-semibold py-3 hover:bg-brand-button-dark transition-colors"
              >
                Continue
              </button>
            </form>
          )}

          {phase === "location" && <SignupLocationStep />}

          {phase === "language" && (
            <form action={submitLanguageStepAction} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-sm font-medium">
                Preferred Language
                <select
                  name="preferred_language"
                  defaultValue="en"
                  className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="submit"
                className="mt-2 w-full rounded-full bg-brand-button text-brand-black font-semibold py-3 hover:bg-brand-button-dark transition-colors"
              >
                Continue
              </button>
            </form>
          )}

          {phase === "date" && (
            <form action={submitWeddingDateStepAction} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-sm font-medium">
                Wedding Date
                <input
                  type="date"
                  name="wedding_date"
                  className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                />
              </label>
              <button
                type="submit"
                className="mt-2 w-full rounded-full bg-brand-button text-brand-black font-semibold py-3 hover:bg-brand-button-dark transition-colors"
              >
                Continue
              </button>
              <SkipLink href="/signup?phase=venue" />
            </form>
          )}

          {phase === "venue" && (
            <form action={submitVenueStepAction} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-sm font-medium">
                Venue Name
                <input
                  name="wedding_venue_name"
                  placeholder="e.g. Taj Palace Banquet Hall"
                  className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-medium">
                City / Area
                <input
                  name="city"
                  className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                />
              </label>
              <button
                type="submit"
                className="mt-2 w-full rounded-full bg-brand-button text-brand-black font-semibold py-3 hover:bg-brand-button-dark transition-colors"
              >
                Continue
              </button>
              <SkipLink href="/signup?phase=budget" />
            </form>
          )}

          {phase === "budget" && (
            <form action={submitBudgetStepAction} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-sm font-medium">
                Budget Range
                <select
                  name="budget_range"
                  defaultValue=""
                  className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                >
                  <option value="">Select your budget range</option>
                  {BUDGET_RANGES.map((b) => (
                    <option key={b.value} value={b.value}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="submit"
                className="mt-2 w-full rounded-full bg-brand-button text-brand-black font-semibold py-3 hover:bg-brand-button-dark transition-colors"
              >
                Continue
              </button>
              <SkipLink href="/signup?phase=done" />
            </form>
          )}

          {phase === "done" && (
            <div className="flex flex-col items-center gap-4 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700 text-2xl">
                ✓
              </span>
              <p className="text-sm text-brand-gray">
                Your account has been created successfully! You&rsquo;re
                ready to start browsing verified vendors for your wedding.
              </p>
              <Link
                href="/"
                className="mt-2 w-full rounded-full bg-brand-button text-brand-black font-semibold py-3 hover:bg-brand-button-dark transition-colors text-center"
              >
                Go to Home
              </Link>
            </div>
          )}

          {(phase === "phone" || phase === "otp") && (
            <>
              <p className="text-sm text-brand-gray mt-6 text-center">
                Already have an account?{" "}
                <Link href="/login" className="text-brand-orange font-medium">
                  Log in
                </Link>
              </p>
              <p className="text-xs text-brand-gray mt-4 text-center">
                Are you a wedding vendor?{" "}
                <Link href="/vendor/apply" className="text-brand-orange font-medium">
                  Apply here instead
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SkipLink({ href }: { href: string }) {
  return (
    <Link href={href} className="text-xs text-brand-gray text-center">
      Skip for now
    </Link>
  );
}
