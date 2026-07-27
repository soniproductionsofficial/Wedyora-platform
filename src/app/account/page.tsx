import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "@/lib/actions/auth";

export default async function AccountPage() {
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

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-heading text-2xl font-semibold mb-1">
        {profile?.full_name ?? "Your account"}
      </h1>
      <p className="text-brand-gray text-sm mb-8 capitalize">
        {profile?.role ?? "customer"} account &middot; {user.email}
      </p>

      <div className="rounded-2xl border border-brand-line bg-white p-8 mb-6">
        <h2 className="font-heading text-lg font-semibold mb-4">
          Your bookings
        </h2>
        <p className="text-brand-gray text-sm">
          You don&rsquo;t have any bookings yet. Once you book a vendor,
          it&rsquo;ll show up here with live status updates.
        </p>
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
