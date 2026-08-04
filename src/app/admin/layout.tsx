import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, CalendarCheck, Tag, Banknote, Sparkles, Mail } from "lucide-react";
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
    <div className="min-h-[calc(100vh-64px)] bg-brand-cream">
      <div className="bg-brand-black text-white">
        <div className="mx-auto max-w-6xl px-6 pt-8 pb-4">
          <p className="text-brand-gold-bright uppercase tracking-[0.2em] text-xs font-semibold mb-1">
            Wedyora
          </p>
          <h1 className="font-heading text-2xl font-bold mb-6">
            Admin Dashboard
          </h1>
          <nav className="flex gap-2 text-sm font-medium">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </Link>
            <Link
              href="/admin/vendors"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Users className="h-4 w-4" />
              Vendor Applications
            </Link>
            <Link
              href="/admin/bookings"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <CalendarCheck className="h-4 w-4" />
              Bookings
            </Link>
            <Link
              href="/admin/packages"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Tag className="h-4 w-4" />
              Packages
            </Link>
            <Link
              href="/admin/add-ons"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              Add-ons
            </Link>
            <Link
              href="/admin/payouts"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Banknote className="h-4 w-4" />
              Payouts
            </Link>
            <Link
              href="/admin/contact-messages"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Mail className="h-4 w-4" />
              Messages
            </Link>
          </nav>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-6 py-10">{children}</div>
    </div>
  );
}
