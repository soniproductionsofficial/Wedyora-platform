import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

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
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
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

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-white/80">
          <Link href="/book" className="hover:text-brand-orange transition-colors">
            Plan Your Wedding
          </Link>
          <Link href="/vendors" className="hover:text-brand-orange transition-colors">
            Browse Vendors
          </Link>
          <Link href="/vendor/apply" className="hover:text-brand-orange transition-colors">
            Become a Vendor
          </Link>
          {role === "admin" && (
            <Link href="/admin" className="hover:text-brand-orange transition-colors">
              Admin
            </Link>
          )}
          {role === "vendor" && (
            <Link href="/vendor/dashboard" className="hover:text-brand-orange transition-colors">
              Vendor Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
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
                href="/login"
                className="text-sm font-medium px-4 py-2 text-white/80 hover:text-white transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="text-sm font-semibold px-4 py-2 rounded-full bg-brand-orange text-white hover:bg-brand-orange-dark transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
