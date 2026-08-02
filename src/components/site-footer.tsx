import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-brand-black text-white/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 text-sm md:grid-cols-3">
        <div>
          <Link href="/" className="mb-4 inline-flex items-center">
            <span className="flex items-center rounded-xl bg-brand-ivory/95 px-3 py-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/wedyora-logo.png"
                alt="Wedyora"
                className="h-6 w-auto"
              />
            </span>
          </Link>
          <p className="max-w-xs leading-relaxed">
            India&rsquo;s managed wedding-services platform — every vendor is
            verified, every booking is handled start to finish.
          </p>
        </div>

        <div>
          <p className="mb-3 font-heading text-lg font-semibold text-white">For Couples</p>
          <ul className="flex flex-col gap-2">
            <li>
              <Link href="/vendors" className="transition-colors hover:text-brand-gold">
                Browse Vendors
              </Link>
            </li>
            <li>
              <Link href="/book" className="transition-colors hover:text-brand-gold">
                Plan Your Wedding
              </Link>
            </li>
            <li>
              <Link href="/signup" className="transition-colors hover:text-brand-gold">
                Create an Account
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-3 font-heading text-lg font-semibold text-white">For Vendors</p>
          <ul className="flex flex-col gap-2">
            <li>
              <Link href="/vendor/apply" className="transition-colors hover:text-brand-gold">
                Become a Partner
              </Link>
            </li>
            <li>
              <Link href="/login" className="transition-colors hover:text-brand-gold">
                Vendor Log In
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs">
            <Link href="/about" className="transition-colors hover:text-brand-gold">
              About Us
            </Link>
            <Link href="/services" className="transition-colors hover:text-brand-gold">
              Services
            </Link>
            <Link href="/portfolio" className="transition-colors hover:text-brand-gold">
              Portfolio
            </Link>
            <Link href="/blog" className="transition-colors hover:text-brand-gold">
              Blog
            </Link>
            <Link href="/faq" className="transition-colors hover:text-brand-gold">
              FAQ
            </Link>
            <Link href="/contact" className="transition-colors hover:text-brand-gold">
              Contact Us
            </Link>
            <Link href="/privacy-policy" className="transition-colors hover:text-brand-gold">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="transition-colors hover:text-brand-gold">
              Terms and Conditions
            </Link>
            <Link href="/refund-policy" className="transition-colors hover:text-brand-gold">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs md:flex-row">
          <p>&copy; {new Date().getFullYear()} Wedyora. All rights reserved.</p>
          <p>Made for India&rsquo;s wedding vendors and the couples who book them.</p>
        </div>
      </div>
    </footer>
  );
}
