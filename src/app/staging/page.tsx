import type { Metadata } from "next";
import StagingExperience from "@/components/staging/StagingExperience";
import { createClient } from "@/lib/supabase/server";

/**
 * Isolated Awwwards-tier redesign staging route.
 *
 * URL: /staging
 *
 * - Fetches the SAME live site data as the homepage (categories + approved vendors).
 * - Renders through the new GSAP / Lenis / 3D visual system.
 * - Does NOT modify `src/app/page.tsx` or any other production route.
 *
 * After approval, follow the handoff comments inside
 * `src/components/staging/StagingExperience.tsx`.
 */
export const metadata: Metadata = {
  title: "Wedyora Staging Redesign — Preview Only",
  description:
    "Isolated staging preview of the Wedyora redesign. Production homepage remains unchanged at /.",
  robots: { index: false, follow: false },
};

export default async function StagingPage() {
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
    <StagingExperience
      categories={categories ?? []}
      vendors={vendors ?? []}
    />
  );
}
