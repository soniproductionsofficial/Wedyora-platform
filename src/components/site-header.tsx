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
    <header className="border-b border-brand-line bg-white/90 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-heading text-xl font-semibold tracking-tight">
          <span className="text-brand-red">Wed</span>yora
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/book" className="hover:text-brand-red transition-colors">
            Plan Your Wedding
          </Link>
          <Link href="/vendors" className="hover:text-brand-red transition-colors">
            Browse Vendors
          </Link>
          <Link href="/vendor/apply" className="hover:text-brand-red transition-colors">
            Become a Vendor
          </Link>
          {role === "admin" && (
            <Link href="/admin" className="hover:text-brand-red transition-colors">
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href="/account"
              className="text-sm font-medium px-4 py-2 rounded-full border border-brand-black hover:bg-brand-black hover:text-white transition-colors"
            >
              My Account
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium px-4 py-2 hover:text-brand-red transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="text-sm font-semibold px-4 py-2 rounded-full bg-brand-red text-white hover:bg-brand-red-dark transition-colors"
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
