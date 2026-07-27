import Link from "next/link";
import { signInAction } from "@/lib/actions/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string; redirectTo?: string }>;
}) {
  const { error, message, redirectTo } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-heading text-2xl font-semibold mb-2">Log in</h1>
      <p className="text-brand-gray text-sm mb-8">
        Welcome back to Wedyora.
      </p>

      {message && (
        <p className="mb-6 rounded-lg bg-green-50 text-green-700 text-sm px-4 py-3">
          {message}
        </p>
      )}
      {error && (
        <p className="mb-6 rounded-lg bg-red-50 text-brand-red-dark text-sm px-4 py-3">
          {error}
        </p>
      )}

      <form action={signInAction} className="flex flex-col gap-4">
        <input type="hidden" name="redirectTo" value={redirectTo ?? "/account"} />
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Email
          <input
            name="email"
            type="email"
            required
            className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-red/40"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Password
          <input
            name="password"
            type="password"
            required
            className="rounded-lg border border-brand-line px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-red/40"
          />
        </label>
        <button
          type="submit"
          className="mt-2 w-full rounded-full bg-brand-red text-white font-semibold py-3 hover:bg-brand-red-dark transition-colors"
        >
          Log In
        </button>
      </form>

      <p className="text-sm text-brand-gray mt-6 text-center">
        Don&rsquo;t have an account?{" "}
        <Link href="/signup" className="text-brand-red font-medium">
          Sign up
        </Link>
      </p>
    </div>
  );
}
