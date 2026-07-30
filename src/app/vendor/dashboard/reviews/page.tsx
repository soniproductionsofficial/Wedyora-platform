import { Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5 text-brand-orange">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className="h-4 w-4" fill={i < rating ? "currentColor" : "none"} />
      ))}
    </span>
  );
}

export default async function VendorReviewsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, rating, comment, created_at, profiles!reviews_customer_id_fkey(full_name)")
    .eq("vendor_id", user.id)
    .order("created_at", { ascending: false });

  const allReviews = reviews ?? [];
  const average =
    allReviews.length > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      : 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-2xl border border-brand-line bg-white p-6 flex items-center gap-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange shrink-0">
          <Star className="h-5 w-5" />
        </span>
        <div>
          <p className="text-2xl font-heading font-bold">
            {allReviews.length > 0 ? average.toFixed(1) : "—"}
          </p>
          <p className="text-xs text-brand-gray">
            Average rating from {allReviews.length} review{allReviews.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      {allReviews.length === 0 ? (
        <div className="rounded-2xl border border-brand-line bg-white p-10 text-center">
          <p className="text-brand-gray text-sm">No reviews yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {allReviews.map((r) => (
            <div key={r.id} className="rounded-2xl border border-brand-line bg-white p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-sm">{r.profiles?.full_name ?? "Customer"}</p>
                <Stars rating={r.rating} />
              </div>
              {r.comment && <p className="text-sm text-brand-gray mb-2">{r.comment}</p>}
              <p className="text-xs text-brand-gray">
                {new Date(r.created_at).toLocaleDateString("en-IN")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
