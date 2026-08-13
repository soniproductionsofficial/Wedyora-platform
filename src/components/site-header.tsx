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

  const mobileLinks = user
    ? [
        { href: "/account", label: "My Account" },
        ...(role === "vendor"
          ? [{ href: "/vendor/dashboard", label: "Vendor Dashboard" }]
          : []),
        ...(role === "admin" ? [{ href: "/admin", label: "Admin" }] : []),
        { href: "/photography-in-minutes", label: "Photography in Minutes" },
      ]
    : [
        { href: "/signup", label: "Customer Sign Up" },
        { href: "/login", label: "Log In" },
        { href: "/photography-in-minutes", label: "Photography in Minutes" },
        { href: "/vendor/apply", label: "Become a Partner" },
      ];

  return (
    <header className="sticky top-0 z-40 overflow-x-clip border-b border-white/15 bg-brand-chrome text-white backdrop-blur-md">
      <div className="mx-auto flex min-w-0 max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:gap-3 sm:px-6 sm:py-4">
        {/* Left: logo + Become a Partner */}
        <div className="flex min-w-0 shrink items-center gap-3 md:gap-4">
          <Link href="/" className="flex min-w-0 items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/wedyora-logo.png"
              alt="Wedyora"
              className="h-8 w-auto max-w-[9.5rem] object-contain object-left sm:h-9 sm:max-w-none md:h-10"
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

        {/* Center: Photography in Minutes */}
        <div className="hidden flex-1 items-center justify-center md:flex">
          <Link
            href="/photography-in-minutes"
            className="whitespace-nowrap rounded-full border border-wedding-gold-bright/40 bg-wedding-gold-bright/10 px-4 py-1.5 text-sm font-bold text-wedding-gold-bright transition-colors duration-300 hover:bg-wedding-gold-bright/20"
          >
            Photography in Minutes
          </Link>
        </div>

        {/* Right: account links (desktop) + compact mobile menu */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
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
              className="hidden rounded-full border border-white/30 px-4 py-2 text-sm font-medium text-white transition-colors duration-300 hover:bg-white hover:text-wedding-deep md:inline-block"
            >
              My Account
            </Link>
          ) : (
            <div className="hidden items-center gap-3 md:flex">
              <Link
                href="/signup"
                className="whitespace-nowrap rounded-full bg-wedding-gold px-4 py-2 text-sm font-semibold text-wedding-deep transition-colors duration-300 hover:bg-wedding-gold-bright"
              >
                Customer Sign Up
              </Link>
              <Link
                href="/login"
                className="text-sm font-medium text-white/80 transition-colors hover:text-white"
              >
                Log In
              </Link>
            </div>
          )}

          <SiteNavMenu mobileLinks={mobileLinks} />
        </div>
      </div>
    </header>
  );
}
