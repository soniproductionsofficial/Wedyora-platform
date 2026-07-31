import Link from "next/link";
import { Clock } from "lucide-react";

// Placeholder for a separate sister project — no URL or details for it
// exist yet. Once it's live, either swap this page's content for real
// details, or point the nav link (src/components/site-nav-menu.tsx)
// straight at its own external URL instead of this in-app page.
export default function PhotographyInMinutesPage() {
  return (
    <div className="bg-brand-black text-white min-h-[60vh] flex items-center">
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
          <Clock className="h-6 w-6 text-brand-orange" />
        </span>
        <p className="text-brand-gold uppercase tracking-[0.2em] text-xs font-semibold mb-4">
          Photography in Minutes
        </p>
        <h1 className="font-heading text-3xl font-bold mb-6">Coming Soon</h1>
        <p className="text-white/70 mb-10">
          A new project from the Wedyora team, launching soon. Check back
          for the inauguration — or head back to the main site in the
          meantime.
        </p>
        <Link
          href="/"
          className="px-6 py-3 rounded-full bg-brand-orange text-white font-semibold hover:bg-brand-orange-dark transition-colors"
        >
          Back to Wedyora
        </Link>
      </div>
    </div>
  );
}
