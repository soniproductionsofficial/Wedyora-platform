import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Tag,
  Banknote,
  Sparkles,
  Mail,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { adminSignOutAction } from "@/lib/actions/admin-auth";

// The proxy (src/proxy.ts) already blocks anonymous visitors from /admin
// (except /admin/login). This layout is the second check: only role=admin
// gets past. RLS (is_admin()) is the third layer on every query.
export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/admin/login?error=" + encodeURIComponent("Not authorized."));
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-brand-cream">
      <div className="bg-brand-black text-white">
        <div className="mx-auto max-w-6xl px-6 pt-8 pb-4">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold-bright">
                Wedyora
              </p>
              <h1 className="font-heading text-2xl font-bold">Admin Dashboard</h1>
            </div>
            <form action={adminSignOutAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-xs font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </form>
          </div>
          <nav className="flex flex-wrap gap-2 text-sm font-medium">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 rounded-full px-4 py-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </Link>
            <Link
              href="/admin/vendors"
              className="flex items-center gap-1.5 rounded-full px-4 py-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Users className="h-4 w-4" />
              Vendor Applications
            </Link>
            <Link
              href="/admin/bookings"
              className="flex items-center gap-1.5 rounded-full px-4 py-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <CalendarCheck className="h-4 w-4" />
              Bookings
            </Link>
            <Link
              href="/admin/packages"
              className="flex items-center gap-1.5 rounded-full px-4 py-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Tag className="h-4 w-4" />
              Packages
            </Link>
            <Link
              href="/admin/add-ons"
              className="flex items-center gap-1.5 rounded-full px-4 py-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Sparkles className="h-4 w-4" />
              Add-ons
            </Link>
            <Link
              href="/admin/payouts"
              className="flex items-center gap-1.5 rounded-full px-4 py-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Banknote className="h-4 w-4" />
              Payouts
            </Link>
            <Link
              href="/admin/contact-messages"
              className="flex items-center gap-1.5 rounded-full px-4 py-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
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
