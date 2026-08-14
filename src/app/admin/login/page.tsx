import Link from "next/link";
import { Shield } from "lucide-react";
import {
  adminLoginAction,
  bootstrapAdminAccountAction,
} from "@/lib/actions/admin-auth";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string; setup?: string }>;
}) {
  const { error, message, setup } = await searchParams;
  const showSetup = setup === "1";

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-brand-cream px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-black">
            <Shield className="h-6 w-6 text-white" strokeWidth={2} />
          </span>
        </div>

        <div className="rounded-2xl border border-brand-line bg-white p-6 shadow-sm md:p-8">
          <h1 className="mb-2 text-center font-heading text-2xl font-semibold">
            {showSetup ? "Create admin account" : "Admin sign in"}
          </h1>
          <p className="mb-8 text-center text-sm text-brand-gray">
            {showSetup
              ? "Protected by your setup secret. Sets a strong email + password on the admin account."
              : "Email and password only — not phone OTP."}
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

          {showSetup ? (
            <form action={bootstrapAdminAccountAction} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-sm font-medium">
                Setup secret
                <input
                  name="setup_secret"
                  type="password"
                  required
                  autoComplete="off"
                  className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-medium">
                Full name
                <input
                  name="full_name"
                  defaultValue="Wedyora Admin"
                  className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-medium">
                Admin email
                <input
                  name="email"
                  type="email"
                  required
                  defaultValue="admin@wedyora.com"
                  autoComplete="username"
                  className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-medium">
                Password (min 12 characters)
                <input
                  name="password"
                  type="password"
                  required
                  minLength={12}
                  autoComplete="new-password"
                  className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                />
              </label>
              <button
                type="submit"
                className="mt-2 w-full rounded-full bg-brand-black py-3 font-semibold text-white transition-colors hover:bg-brand-charcoal"
              >
                Create admin account
              </button>
              <Link
                href="/admin/login"
                className="text-center text-xs text-brand-gray"
              >
                Back to sign in
              </Link>
            </form>
          ) : (
            <form action={adminLoginAction} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-sm font-medium">
                Email
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="username"
                  placeholder="admin@wedyora.com"
                  className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-medium">
                Password
                <input
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                />
              </label>
              <button
                type="submit"
                className="mt-2 w-full rounded-full bg-brand-black py-3 font-semibold text-white transition-colors hover:bg-brand-charcoal"
              >
                Sign in to Admin
              </button>
              <p className="text-center text-xs text-brand-gray">
                First time?{" "}
                <Link
                  href="/admin/login?setup=1"
                  className="font-medium text-brand-orange"
                >
                  Create admin account
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
