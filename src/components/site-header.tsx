import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SiteNavMenu from "@/components/site-nav-menu";

export default async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    role = profile?.role ?? null;
  }

  return (
    <header className="bg-brand-black text-white sticky top-0 z-40 border-b border-white/10">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between gap-4">
        {/* Left: logo + Become a Partner */}
        <div className="flex items-center gap-4 shrink-0">
          <Link href="/" className="flex items-center">
            <span className="flex items-center rounded-lg bg-brand-cream px-3 py-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/wedyora-logo.png"
                alt="Wedyora"
                className="h-7 w-auto"
              />
            </span>
          </Link>
          {!user && (
            <Link
              href="/vendor/apply"
              className="hidden md:inline-block text-sm font-medium px-4 py-2 rounded-full border border-white/30 text-white hover:bg-white hover:text-brand-black transition-colors whitespace-nowrap"
            >
              Become a Partner
            </Link>
          )}
        </div>

        {/* Center: Photography in Minutes */}
        <div className="hidden md:flex flex-1 justify-center">
          <Link
            href="/photography-in-minutes"
            className="text-sm font-bold text-brand-orange bg-brand-orange/10 border border-brand-orange/30 rounded-full px-4 py-1.5 hover:bg-brand-orange/20 transition-colors whitespace-nowrap"
          >
            Photography in Minutes
          </Link>
        </div>

        {/* Right: sign up / log in / more, plus account-specific links */}
        <div className="flex items-center gap-3 shrink-0">
          {role === "admin" && (
            <Link
              href="/admin"
              className="hidden md:inline-block text-sm font-medium text-white/80 hover:text-brand-orange transition-colors"
            >
              Admin
            </Link>
          )}
          {role === "vendor" && (
            <Link
              href="/vendor/dashboard"
              className="hidden md:inline-block text-sm font-medium text-white/80 hover:text-brand-orange transition-colors"
            >
              Vendor Dashboard
            </Link>
          )}

          {user ? (
            <Link
              href="/account"
              className="text-sm font-medium px-4 py-2 rounded-full border border-white/30 text-white hover:bg-white hover:text-brand-black transition-colors"
            >
              My Account
            </Link>
          ) : (
            <>
              <Link
                href="/signup"
                className="text-sm font-semibold px-4 py-2 rounded-full bg-brand-orange text-white hover:bg-brand-orange-dark transition-colors whitespace-nowrap"
              >
                Customer Sign Up
              </Link>
              <Link
                href="/login"
                className="text-sm font-medium px-4 py-2 text-white/80 hover:text-white transition-colors"
              >
                Log In
              </Link>
            </>
          )}

          <SiteNavMenu />
        </div>
      </div>
    </header>
  );
}
