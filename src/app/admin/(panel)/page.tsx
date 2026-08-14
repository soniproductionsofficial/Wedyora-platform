import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const [{ count: pendingVendors }, { count: unassignedBookings }, { count: awaitingPayment }] =
    await Promise.all([
      supabase
        .from("vendor_profiles")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending_assignment"),
      supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("status", "awaiting_payment"),
    ]);

  const stats = [
    {
      label: "Vendor applications awaiting review",
      value: pendingVendors ?? 0,
      href: "/admin/vendors",
    },
    {
      label: "Bookings needing a vendor assigned",
      value: unassignedBookings ?? 0,
      href: "/admin/bookings",
    },
    {
      label: "Bookings awaiting customer payment",
      value: awaitingPayment ?? 0,
      href: "/admin/bookings",
    },
  ];

  return (
    <div>
      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl border border-brand-line bg-white p-6 hover:border-brand-orange hover:shadow-md transition-all"
          >
            <p className="text-4xl font-heading font-bold mb-2 text-brand-orange">
              {s.value}
            </p>
            <p className="text-brand-gray text-sm">{s.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
