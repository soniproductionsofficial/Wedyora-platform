import { createClient } from "@/lib/supabase/server";
import SiteNavMenu from "@/components/site-nav-menu";
import NavLink from "@/components/motion/nav-link";

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
    <header
      className="sticky top-0 z-40 border-b border-white/10 bg-brand-black/75 text-white backdrop-blur-xl supports-[backdrop-filter]:bg-brand-black/55"
      style={{ viewTransitionName: "site-header" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3.5">
        {/* Left: logo + Become a Partner */}
        <div className="flex shrink-0 items-center gap-4">
          <NavLink href="/" direction="back" className="flex items-center">
            <span className="flex items-center rounded-xl bg-brand-ivory/95 px-3 py-1.5 shadow-[0_0_24px_rgba(212,175,106,0.18)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/wedyora-logo.png"
                alt="Wedyora"
                className="h-7 w-auto"
              />
            </span>
          </NavLink>
          {!user && (
            <NavLink
              href="/vendor/apply"
              className="hidden whitespace-nowrap rounded-full border border-white/25 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-brand-gold/50 hover:bg-white/10 md:inline-block"
            >
              Become a Partner
            </NavLink>
          )}
        </div>

        {/* Center: Photography in Minutes */}
        <div className="hidden flex-1 justify-center md:flex">
          <NavLink
            href="/photography-in-minutes"
            className="whitespace-nowrap rounded-full border border-brand-orange/35 bg-brand-orange/15 px-4 py-1.5 text-sm font-semibold text-brand-orange transition-colors hover:bg-brand-orange/25"
          >
            Photography in Minutes
          </NavLink>
        </div>

        {/* Right: sign up / log in / more, plus account-specific links */}
        <div className="flex shrink-0 items-center gap-3">
          {role === "admin" && (
            <NavLink
              href="/admin"
              className="hidden text-sm font-medium text-white/80 transition-colors hover:text-brand-gold md:inline-block"
            >
              Admin
            </NavLink>
          )}
          {role === "vendor" && (
            <NavLink
              href="/vendor/dashboard"
              className="hidden text-sm font-medium text-white/80 transition-colors hover:text-brand-gold md:inline-block"
            >
              Vendor Dashboard
            </NavLink>
          )}

          {user ? (
            <NavLink
              href="/account"
              className="rounded-full border border-white/25 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-brand-gold/40 hover:bg-white/10"
            >
              My Account
            </NavLink>
          ) : (
            <>
              <NavLink
                href="/signup"
                className="btn-luxury whitespace-nowrap rounded-full bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:bg-brand-orange-dark"
              >
                Customer Sign Up
              </NavLink>
              <NavLink
                href="/login"
                className="text-sm font-medium text-white/80 transition-colors hover:text-white"
              >
                Log In
              </NavLink>
            </>
          )}

          <SiteNavMenu />
        </div>
      </div>
    </header>
  );
}
