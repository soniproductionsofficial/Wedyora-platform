import Link from "next/link";
import { Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from "@/lib/actions/vendor-dashboard";

export default async function VendorNotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: notifications } = await supabase
    .from("notifications")
    .select("id, title, body, link, kind, read_at, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const unread = (notifications ?? []).filter((n) => !n.read_at).length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div>
          <h2 className="font-heading text-xl font-semibold flex items-center gap-2">
            <Bell className="h-5 w-5 text-brand-orange" />
            Notifications
          </h2>
          <p className="text-sm text-brand-gray mt-1">
            {unread > 0
              ? `${unread} unread — including new customer assignments.`
              : "You're all caught up."}
          </p>
        </div>
        {unread > 0 && (
          <form action={markAllNotificationsReadAction}>
            <button
              type="submit"
              className="text-sm font-medium px-4 py-2 rounded-full border border-brand-line hover:border-brand-orange transition-colors"
            >
              Mark all read
            </button>
          </form>
        )}
      </div>

      {(notifications ?? []).length === 0 ? (
        <div className="rounded-2xl border border-brand-line bg-white p-8 text-center text-sm text-brand-gray">
          No notifications yet. When Wedyora assigns you a customer, you&apos;ll
          see it here and under{" "}
          <Link href="/vendor/dashboard/leads" className="text-brand-orange underline">
            Leads
          </Link>
          .
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {(notifications ?? []).map((n) => (
            <li
              key={n.id}
              className={`rounded-2xl border bg-white p-5 ${
                n.read_at ? "border-brand-line" : "border-brand-orange/40"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-brand-gold font-semibold mb-1">
                    {n.kind}
                    {!n.read_at && (
                      <span className="ml-2 text-brand-orange">New</span>
                    )}
                  </p>
                  <h3 className="font-heading font-semibold text-sm mb-1">
                    {n.title}
                  </h3>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    {n.body}
                  </p>
                  <p className="text-[11px] text-brand-gray mt-2">
                    {new Date(n.created_at).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  {n.link && (
                    <Link
                      href={n.link}
                      className="text-sm font-semibold text-brand-orange hover:underline"
                    >
                      Open
                    </Link>
                  )}
                  {!n.read_at && (
                    <form action={markNotificationReadAction}>
                      <input type="hidden" name="notification_id" value={n.id} />
                      <button
                        type="submit"
                        className="text-xs text-brand-gray hover:text-brand-black"
                      >
                        Mark read
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
