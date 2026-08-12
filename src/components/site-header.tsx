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
    <header className="sticky top-0 z-40 border-b border-wedding-gold/20 bg-gradient-to-r from-wedding-deep via-wedding-purple to-wedding-red text-white backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        {/* Left: logo + Become a Partner */}
        <div className="flex shrink-0 items-center gap-4">
          <Link href="/" className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/wedyora-logo.png"
              alt="Wedyora"
              className="h-8 w-auto"
            />
          </Link>
          {!user && (
            <Link
              href="/vendor/apply"
              className="hidden whitespace-nowrap rounded-full border border-white/30 px-4 py-2 text-sm font-medium text-white transition-colors duration-300 hover:border-wedding-gold-bright hover:bg-white hover:text-wedding-deep md:inline-block"
            >
              Become a Partner
            </Link>
          )}
        </div>

        {/* Center: primary page links + Photography in Minutes */}
        <div className="hidden flex-1 items-center justify-center gap-6 md:flex">
          <Link
            href="/#services"
            className="text-sm font-medium text-white/85 transition-colors duration-300 hover:text-wedding-gold-bright"
          >
            Services
          </Link>
          <Link
            href="/#how-it-works"
            className="text-sm font-medium text-white/85 transition-colors duration-300 hover:text-wedding-gold-bright"
          >
            How It Works
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-white/85 transition-colors duration-300 hover:text-wedding-gold-bright"
          >
            About
          </Link>
          <Link
            href="/photography-in-minutes"
            className="whitespace-nowrap rounded-full border border-wedding-gold-bright/40 bg-wedding-gold-bright/10 px-4 py-1.5 text-sm font-bold text-wedding-gold-bright transition-colors duration-300 hover:bg-wedding-gold-bright/20"
          >
            Photography in Minutes
          </Link>
        </div>

        {/* Right: account links */}
        <div className="flex shrink-0 items-center gap-3">
          {role === "admin" && (
            <Link
              href="/admin"
              className="hidden text-sm font-medium text-white/80 transition-colors hover:text-wedding-gold-bright md:inline-block"
            >
              Admin
            </Link>
          )}
          {role === "vendor" && (
            <Link
              href="/vendor/dashboard"
              className="hidden text-sm font-medium text-white/80 transition-colors hover:text-wedding-gold-bright md:inline-block"
            >
              Vendor Dashboard
            </Link>
          )}

          {user ? (
            <Link
              href="/account"
              className="rounded-full border border-white/30 px-4 py-2 text-sm font-medium text-white transition-colors duration-300 hover:bg-white hover:text-wedding-deep"
            >
              My Account
            </Link>
          ) : (
            <>
              <Link
                href="/signup"
                className="whitespace-nowrap rounded-full bg-wedding-gold px-3 py-2 text-sm font-semibold text-wedding-deep transition-colors duration-300 hover:bg-wedding-gold-bright sm:px-4"
              >
                <span className="sm:hidden">Sign Up</span>
                <span className="hidden sm:inline">Customer Sign Up</span>
              </Link>
              <Link
                href="/login"
                className="text-sm font-medium text-white/80 transition-colors hover:text-white"
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
