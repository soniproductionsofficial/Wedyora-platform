import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

// The proxy (src/proxy.ts) already blocks anonymous visitors from /admin.
// This layout is the second, real check: only a profile with role='admin'
// gets past this point. Every admin page/query is additionally protected
// by the database's own Row Level Security (is_admin() policies), so even
// a bug here can't leak data — this is defense in depth, not the only gate.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/admin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <nav className="flex gap-6 text-sm font-medium border-b border-brand-line mb-8 pb-4">
        <Link href="/admin" className="hover:text-brand-orange">
          Overview
        </Link>
        <Link href="/admin/vendors" className="hover:text-brand-orange">
          Vendor Applications
        </Link>
        <Link href="/admin/bookings" className="hover:text-brand-orange">
          Bookings
        </Link>
      </nav>
      {children}
    </div>
  );
}
