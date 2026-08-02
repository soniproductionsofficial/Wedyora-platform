import AnimationReviewExperience from "@/components/animation-review/AnimationReviewExperience";
import { createClient } from "@/lib/supabase/server";

/**
 * Isolated animation review route.
 *
 * URL: /animation-review
 *
 * - Fetches the SAME live site data as the homepage (categories + approved vendors).
 * - Renders that data through the new interactive visual system.
 * - Does NOT modify `src/app/page.tsx` or any other production route.
 *
 * After approval, follow the handoff comments inside
 * `src/components/animation-review/AnimationReviewExperience.tsx`.
 */
export default async function AnimationReviewPage() {
  const supabase = await createClient();

  const [{ data: categories }, { data: vendors }] = await Promise.all([
    supabase.from("service_categories").select("id, name, slug").order("name"),
    supabase
      .from("vendor_profiles")
      .select("id, business_name, city, experience_years, service_categories(name)")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  return (
    <AnimationReviewExperience
      categories={categories ?? []}
      vendors={vendors ?? []}
    />
  );
}
