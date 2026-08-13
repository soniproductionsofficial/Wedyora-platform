import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Inbox,
  CalendarCheck,
  Calendar,
  Wallet,
  Banknote,
  Star,
  User,
  LifeBuoy,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

// Mirrors the admin layout's pattern: this is the second, real check —
// the proxy already blocks anonymous visitors, RLS is the actual data
// boundary, this just keeps a non-vendor from seeing vendor-shaped UI.
export default async function VendorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/vendor/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "vendor") {
    redirect("/");
  }

  const NAV = [
    { href: "/vendor/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/vendor/dashboard/leads", label: "Leads", icon: Inbox },
    { href: "/vendor/dashboard/bookings", label: "Bookings", icon: CalendarCheck },
    { href: "/vendor/dashboard/calendar", label: "Calendar", icon: Calendar },
    { href: "/vendor/dashboard/earnings", label: "Earnings", icon: Wallet },
    { href: "/vendor/dashboard/payouts", label: "Payouts", icon: Banknote },
    { href: "/vendor/dashboard/reviews", label: "Reviews", icon: Star },
    { href: "/vendor/dashboard/profile", label: "Profile", icon: User },
    { href: "/vendor/dashboard/support", label: "Support", icon: LifeBuoy },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-brand-cream">
      <div className="bg-brand-black text-white">
        <div className="mx-auto max-w-6xl px-6 pt-8 pb-4">
          <p className="text-brand-gold-bright uppercase tracking-[0.2em] text-xs font-semibold mb-1">
            Wedyora
          </p>
          <h1 className="font-heading text-2xl font-bold mb-6">Vendor Dashboard</h1>
          <nav className="flex flex-wrap gap-2 text-sm font-medium">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-6 py-10">{children}</div>
    </div>
  );
}
