import NavLink from "@/components/motion/nav-link";

export default function SiteFooter() {
  return (
    <footer
      className="mt-16 border-t border-white/10 bg-brand-black text-white/60"
      style={{ viewTransitionName: "site-footer" }}
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 text-sm md:grid-cols-3">
        <div>
          <NavLink href="/" direction="back" className="mb-4 inline-flex items-center">
            <span className="flex items-center rounded-xl bg-brand-ivory/95 px-3 py-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/wedyora-logo.png"
                alt="Wedyora"
                className="h-6 w-auto"
              />
            </span>
          </NavLink>
          <p className="max-w-xs leading-relaxed">
            India&rsquo;s managed wedding-services platform — every vendor is
            verified, every booking is handled start to finish.
          </p>
        </div>

        <div>
          <p className="mb-3 font-heading text-lg font-semibold text-white">For Couples</p>
          <ul className="flex flex-col gap-2">
            <li>
              <NavLink href="/vendors" className="transition-colors hover:text-brand-gold">
                Browse Vendors
              </NavLink>
            </li>
            <li>
              <NavLink href="/book" className="transition-colors hover:text-brand-gold">
                Plan Your Wedding
              </NavLink>
            </li>
            <li>
              <NavLink href="/signup" className="transition-colors hover:text-brand-gold">
                Create an Account
              </NavLink>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-3 font-heading text-lg font-semibold text-white">For Vendors</p>
          <ul className="flex flex-col gap-2">
            <li>
              <NavLink href="/vendor/apply" className="transition-colors hover:text-brand-gold">
                Become a Partner
              </NavLink>
            </li>
            <li>
              <NavLink href="/login" className="transition-colors hover:text-brand-gold">
                Vendor Log In
              </NavLink>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs">
            <NavLink href="/about" className="transition-colors hover:text-brand-gold">
              About Us
            </NavLink>
            <NavLink href="/services" className="transition-colors hover:text-brand-gold">
              Services
            </NavLink>
            <NavLink href="/portfolio" className="transition-colors hover:text-brand-gold">
              Portfolio
            </NavLink>
            <NavLink href="/blog" className="transition-colors hover:text-brand-gold">
              Blog
            </NavLink>
            <NavLink href="/faq" className="transition-colors hover:text-brand-gold">
              FAQ
            </NavLink>
            <NavLink href="/contact" className="transition-colors hover:text-brand-gold">
              Contact Us
            </NavLink>
            <NavLink href="/privacy-policy" className="transition-colors hover:text-brand-gold">
              Privacy Policy
            </NavLink>
            <NavLink href="/terms-and-conditions" className="transition-colors hover:text-brand-gold">
              Terms and Conditions
            </NavLink>
            <NavLink href="/refund-policy" className="transition-colors hover:text-brand-gold">
              Refund Policy
            </NavLink>
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
