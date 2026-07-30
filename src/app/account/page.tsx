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

const LANGUAGE_LABEL: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  ta: "Tamil",
  te: "Telugu",
  kn: "Kannada",
  ml: "Malayalam",
  mr: "Marathi",
  bn: "Bengali",
  gu: "Gujarati",
  pa: "Punjabi",
};

function formatBudget(min: number | null, max: number | null): string | null {
  if (min == null && max == null) return null;
  const fmt = (n: number) => `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`;
  if (min != null && max != null) return `${fmt(min)} – ${fmt(max)}`;
  if (min != null) return `${fmt(min)}+`;
  return max != null ? `Under ${fmt(max)}` : null;
}

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
    .select(
      "full_name, role, phone, city, email, preferred_language, wedding_date, wedding_venue_name, budget_min, budget_max"
    )
    .eq("id", user.id)
    .single();

  const budgetLabel = profile
    ? formatBudget(profile.budget_min, profile.budget_max)
    : null;
  const hasWeddingDetails =
    !!profile &&
    (profile.wedding_date || profile.wedding_venue_name || profile.city || budgetLabel);

  const { data: bookings } = await supabase
    .from("bookings")
    .select(
      "id, event_date, city, status, advance_amount, service_categories(name), vendor_profiles(business_name)"
    )
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <section className="bg-brand-black text-white">
        <div className="mx-auto max-w-2xl px-6 py-14">
          <h1 className="font-heading text-3xl font-bold mb-1">
            {profile?.full_name ?? "Your account"}
          </h1>
          <p className="text-white/70 text-sm capitalize">
            {profile?.role ?? "customer"} account &middot; {profile?.phone ?? user.phone}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-2xl px-6 py-12 -mt-6">
      {message && (
        <p className="mb-6 rounded-lg bg-green-50 text-green-700 text-sm px-4 py-3">
          {message}
        </p>
      )}

      {hasWeddingDetails && (
        <div className="rounded-2xl border border-brand-line bg-white p-8 mb-6">
          <h2 className="font-heading text-lg font-semibold mb-4">
            Your Wedding Details
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            {profile?.wedding_date && (
              <div>
                <p className="text-brand-gray text-xs mb-0.5">Wedding Date</p>
                <p className="font-medium">
                  {new Date(profile.wedding_date).toLocaleDateString("en-IN")}
                </p>
              </div>
            )}
            {profile?.wedding_venue_name && (
              <div>
                <p className="text-brand-gray text-xs mb-0.5">Venue</p>
                <p className="font-medium">{profile.wedding_venue_name}</p>
              </div>
            )}
            {profile?.city && (
              <div>
                <p className="text-brand-gray text-xs mb-0.5">City</p>
                <p className="font-medium">{profile.city}</p>
              </div>
            )}
            {budgetLabel && (
              <div>
                <p className="text-brand-gray text-xs mb-0.5">Budget</p>
                <p className="font-medium">{budgetLabel}</p>
              </div>
            )}
            {profile?.preferred_language && (
              <div>
                <p className="text-brand-gray text-xs mb-0.5">Preferred Language</p>
                <p className="font-medium">
                  {LANGUAGE_LABEL[profile.preferred_language] ?? profile.preferred_language}
                </p>
              </div>
            )}
            {profile?.email && (
              <div>
                <p className="text-brand-gray text-xs mb-0.5">Email</p>
                <p className="font-medium">{profile.email}</p>
              </div>
            )}
          </div>
        </div>
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
    </div>
  );
}
