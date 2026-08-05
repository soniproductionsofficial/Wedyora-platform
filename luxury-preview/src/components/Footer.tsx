import { LIVE } from "../data/vendors";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-brand-black text-white/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-3">
        <div>
          <a href={LIVE.home} className="mb-3 inline-flex">
            <span className="flex items-center rounded-lg bg-brand-cream px-3 py-1.5">
              <img src="/wedyora-logo.png" alt="Wedyora" className="h-6 w-auto" />
            </span>
          </a>
          <p className="mt-3 max-w-xs text-sm">
            India&apos;s managed wedding-services platform — every vendor is
            verified, every booking is handled start to finish.
          </p>
          <p className="mt-3 text-xs text-brand-gold/80">
            This is a UI preview only. Bookings run on{" "}
            <a
              href={LIVE.home}
              className="underline underline-offset-2 hover:text-brand-gold"
            >
              www.wedyora.com
            </a>
            .
          </p>
        </div>
        <div>
          <p className="mb-3 font-medium text-white">For Couples</p>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <a href={LIVE.vendors} className="hover:text-brand-orange">
                Browse Vendors
              </a>
            </li>
            <li>
              <a href={LIVE.book} className="hover:text-brand-orange">
                Plan Your Wedding
              </a>
            </li>
            <li>
              <a href={LIVE.signup} className="hover:text-brand-orange">
                Create an Account
              </a>
            </li>
            <li>
              <a href={LIVE.contact} className="hover:text-brand-orange">
                Contact · {LIVE.email}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-3 font-medium text-white">For Vendors</p>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <a href={LIVE.vendorApply} className="hover:text-brand-orange">
                Become a Partner
              </a>
            </li>
            <li>
              <a href={LIVE.login} className="hover:text-brand-orange">
                Vendor Log In
              </a>
            </li>
            <li>
              <a
                href={LIVE.photographyInMinutes}
                className="hover:text-brand-orange"
              >
                Photography in Minutes
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs md:flex-row">
          <p>&copy; {new Date().getFullYear()} Wedyora. All rights reserved.</p>
          <p>Made for India&apos;s wedding vendors and the couples who book them.</p>
        </div>
      </div>
    </footer>
  );
}
