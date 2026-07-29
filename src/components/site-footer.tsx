import Link from "next/link";
import { Camera } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-brand-black text-white/60 mt-16">
      <div className="mx-auto max-w-6xl px-6 py-12 grid gap-10 md:grid-cols-3 text-sm">
        <div>
          <Link
            href="/"
            className="flex items-center gap-2 font-heading text-lg font-semibold text-white mb-3"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-orange">
              <Camera className="h-4 w-4 text-white" strokeWidth={2} />
            </span>
            Wedyora
          </Link>
          <p className="max-w-xs">
            India&rsquo;s managed wedding-services platform — every vendor is
            verified, every booking is handled start to finish.
          </p>
        </div>

        <div>
          <p className="text-white font-medium mb-3">For Couples</p>
          <ul className="flex flex-col gap-2">
            <li>
              <Link href="/vendors" className="hover:text-brand-orange transition-colors">
                Browse Vendors
              </Link>
            </li>
            <li>
              <Link href="/book" className="hover:text-brand-orange transition-colors">
                Plan Your Wedding
              </Link>
            </li>
            <li>
              <Link href="/signup" className="hover:text-brand-orange transition-colors">
                Create an Account
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-white font-medium mb-3">For Vendors</p>
          <ul className="flex flex-col gap-2">
            <li>
              <Link href="/vendor/apply" className="hover:text-brand-orange transition-colors">
                Become a Vendor
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-brand-orange transition-colors">
                Vendor Log In
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-5 text-xs flex flex-col md:flex-row items-center justify-between gap-2">
          <p>&copy; {new Date().getFullYear()} Wedyora. All rights reserved.</p>
          <p>Made for India&rsquo;s wedding vendors and the couples who book them.</p>
        </div>
      </div>
    </footer>
  );
}
