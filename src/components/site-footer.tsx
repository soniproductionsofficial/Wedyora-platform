import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="bg-brand-chrome mt-0 border-t border-white/15 text-white/60">
      <div className="mx-auto max-w-6xl px-6 py-12 grid gap-10 md:grid-cols-3 text-sm">
        <div>
          <Link href="/" className="inline-flex items-center mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/wedyora-logo.png"
              alt="Wedyora"
              className="h-7 w-auto"
            />
          </Link>
          <p className="max-w-xs">
            Perfect planners for your special occasions — every vendor is
            verified, every booking is handled start to finish.
          </p>
        </div>

        <div>
          <p className="text-white font-medium mb-3">For Clients</p>
          <ul className="flex flex-col gap-2">
            <li>
              <Link href="/book" className="hover:text-brand-gold-bright transition-colors">
                Plan Your Occasion
              </Link>
            </li>
            <li>
              <Link href="/signup" className="hover:text-brand-gold-bright transition-colors">
                Create an Account
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-white font-medium mb-3">For Vendors</p>
          <ul className="flex flex-col gap-2">
            <li>
              <Link href="/vendor/apply" className="hover:text-brand-gold-bright transition-colors">
                Become a Partner
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-brand-gold-bright transition-colors">
                Vendor Log In
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs justify-center">
            <Link href="/about" className="hover:text-brand-gold-bright transition-colors">
              About Us
            </Link>
            <Link href="/services" className="hover:text-brand-gold-bright transition-colors">
              Services
            </Link>
            <Link href="/portfolio" className="hover:text-brand-gold-bright transition-colors">
              Portfolio
            </Link>
            <Link href="/blog" className="hover:text-brand-gold-bright transition-colors">
              Blog
            </Link>
            <Link href="/faq" className="hover:text-brand-gold-bright transition-colors">
              FAQ
            </Link>
            <Link href="/contact" className="hover:text-brand-gold-bright transition-colors">
              Contact Us
            </Link>
            <Link href="/privacy-policy" className="hover:text-brand-gold-bright transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-brand-gold-bright transition-colors">
              Terms and Conditions
            </Link>
            <Link href="/refund-policy" className="hover:text-brand-gold-bright transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-5 text-xs flex flex-col md:flex-row items-center justify-between gap-2">
          <p>&copy; {new Date().getFullYear()} Wedyora. All rights reserved.</p>
          <p>Made for India&rsquo;s event vendors and the people who book them.</p>
        </div>
      </div>
    </footer>
  );
}
