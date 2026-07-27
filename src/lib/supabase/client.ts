// Supabase client for use in the BROWSER (Client Components).
// Uses the public anon key — safe to expose, since Row Level Security
// policies in the database control what each logged-in user can actually see/do.
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
