import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { completeProfileAction } from "@/lib/actions/auth";

// Safety net for the /login form: since that form only ever asks for a
// phone number (no name), a brand-new phone number that's never signed up
// before still gets an account created for it the moment the code is
// verified — just with no name yet. This page catches that one case and
// asks for a name before sending the person on to wherever they were headed.
export default async function CompleteProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string; error?: string }>;
}) {
  const { redirectTo, error } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-brand-cream flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="bg-white border border-brand-line rounded-2xl shadow-sm p-6 md:p-8">
          <h1 className="font-heading text-2xl font-semibold mb-2 text-center">
            Just one more thing
          </h1>
          <p className="text-brand-gray text-sm mb-8 text-center">
            Tell us your name so we know who&rsquo;s booking.
          </p>

          {error && (
            <p className="mb-6 rounded-lg bg-red-50 text-brand-orange-dark text-sm px-4 py-3">
              {error}
            </p>
          )}

          <form action={completeProfileAction} className="flex flex-col gap-4">
            <input type="hidden" name="redirectTo" value={redirectTo ?? "/account"} />
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              Full Name
              <input
                name="full_name"
                required
                className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              City
              <input
                name="city"
                className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
              />
            </label>
            <button
              type="submit"
              className="mt-2 w-full rounded-full bg-brand-orange text-white font-semibold py-3 hover:bg-brand-orange-dark transition-colors"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
