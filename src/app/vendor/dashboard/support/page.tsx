import { LifeBuoy, Mail, Phone } from "lucide-react";

export default function VendorSupportPage() {
  return (
    <div className="max-w-xl">
      <div className="rounded-2xl border border-brand-line bg-white p-8 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange mx-auto mb-4">
          <LifeBuoy className="h-6 w-6" />
        </span>
        <h2 className="font-heading text-lg font-semibold mb-2">Need help?</h2>
        <p className="text-brand-gray text-sm mb-6">
          Our vendor support team can help with bookings, payouts, your
          application, or anything else about your Wedyora account.
        </p>
        <div className="flex flex-col gap-3 text-sm">
          <a
            href="mailto:vendors@wedyora.com"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-brand-line hover:bg-brand-cream transition-colors"
          >
            <Mail className="h-4 w-4" /> vendors@wedyora.com
          </a>
          <a
            href="tel:+911234567890"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-brand-line hover:bg-brand-cream transition-colors"
          >
            <Phone className="h-4 w-4" /> +91 12345 67890
          </a>
        </div>
      </div>
    </div>
  );
}
