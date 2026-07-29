import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "@/lib/actions/auth";
import PayAdvanceButton from "@/components/pay-advance-button";

const STATUS_LABEL: Record<string, string> = {
  pending_assignment: "Matching you with a vendor",
  awaiting_payment: "Vendor assigned — advance payment due",
  confirmed: "Confirmed",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/account");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, phone, city")
    .eq("id", user.id)
    .single();

  const { data: bookings } = await supabase
    .from("bookings")
    .select(
      "id, event_date, city, status, advance_amount, service_categories(name), vendor_profiles(business_name)"
    )
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-heading text-2xl font-semibold mb-1">
        {profile?.full_name ?? "Your account"}
      </h1>
      <p className="text-brand-gray text-sm mb-8 capitalize">
        {profile?.role ?? "customer"} account &middot; {profile?.phone ?? user.phone}
      </p>

      {message && (
        <p className="mb-6 rounded-lg bg-green-50 text-green-700 text-sm px-4 py-3">
          {message}
        </p>
      )}

      <div className="rounded-2xl border border-brand-line bg-white p-8 mb-6">
        <h2 className="font-heading text-lg font-semibold mb-4">
          Your bookings
        </h2>

        {!bookings || bookings.length === 0 ? (
          <p className="text-brand-gray text-sm">
            You don&rsquo;t have any bookings yet.{" "}
            <a href="/book" className="text-brand-orange font-medium">
              Start planning
            </a>
            .
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="rounded-xl border border-brand-line p-4 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium">{b.service_categories?.name}</p>
                  <span className="text-xs px-3 py-1 rounded-full bg-brand-cream border border-brand-line">
                    {STATUS_LABEL[b.status] ?? b.status}
                  </span>
                </div>
                <p className="text-sm text-brand-gray">
                  {b.city} &middot;{" "}
                  {new Date(b.event_date).toLocaleDateString("en-IN")}
                  {b.vendor_profiles?.business_name &&
                    ` · ${b.vendor_profiles.business_name}`}
                </p>
                {b.status === "awaiting_payment" && b.advance_amount && (
                  <div className="pt-2">
                    <PayAdvanceButton
                      bookingId={b.id}
                      amount={b.advance_amount}
                      customerName={profile?.full_name}
                      customerPhone={profile?.phone ?? user.phone}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <form action={signOutAction}>
        <button
          type="submit"
          className="text-sm font-medium px-5 py-2.5 rounded-full border border-brand-line hover:bg-brand-black hover:text-white transition-colors"
        >
          Log Out
        </button>
      </form>
    </div>
  );
}
