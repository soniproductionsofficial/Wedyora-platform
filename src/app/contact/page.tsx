import { Mail, Phone } from "lucide-react";
import { submitContactMessageAction } from "@/lib/actions/contact";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { error, success } = await searchParams;

  return (
    <div>
      <section className="bg-brand-black text-white">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <p className="text-brand-gold uppercase tracking-[0.2em] text-xs font-semibold mb-4">
            Contact Us
          </p>
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-6">
            We&rsquo;re Here to Help
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Questions about a booking, a vendor application, or anything
            else — send us a message and our team will get back to you.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="font-heading text-xl font-semibold mb-4">Send a Message</h2>

            {success && (
              <p className="mb-6 rounded-lg bg-green-50 text-green-700 text-sm px-4 py-3">
                Thanks — we&rsquo;ve received your message and will be in touch soon.
              </p>
            )}
            {error && (
              <p className="mb-6 rounded-lg bg-red-50 text-brand-orange-dark text-sm px-4 py-3">
                {error}
              </p>
            )}

            <form action={submitContactMessageAction} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs text-brand-gray mb-1">Name</label>
                <input
                  name="name"
                  required
                  className="w-full rounded-lg border border-brand-line px-4 py-2.5 text-sm"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-brand-gray mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="w-full rounded-lg border border-brand-line px-4 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-brand-gray mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    className="w-full rounded-lg border border-brand-line px-4 py-2.5 text-sm"
                  />
                </div>
              </div>
              <p className="text-xs text-brand-gray -mt-2">
                Share at least one way to reach you (email or phone).
              </p>
              <div>
                <label className="block text-xs text-brand-gray mb-1">Message</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  className="w-full rounded-lg border border-brand-line px-4 py-2.5 text-sm"
                />
              </div>
              <button
                type="submit"
                className="self-start rounded-full bg-brand-orange text-white font-semibold px-6 py-2.5 text-sm hover:bg-brand-orange-dark transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold mb-4">Other Ways to Reach Us</h2>
            <div className="flex flex-col gap-4 text-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-cream">
                  <Mail className="h-4 w-4 text-brand-orange" />
                </span>
                <div>
                  <p className="text-brand-gray text-xs">Email</p>
                  <p className="font-medium">hello@wedyora.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-cream">
                  <Phone className="h-4 w-4 text-brand-orange" />
                </span>
                <div>
                  <p className="text-brand-gray text-xs">Phone</p>
                  <p className="font-medium">+91-00000-00000</p>
                </div>
              </div>
              <p className="text-xs text-brand-gray mt-2">
                <em>(Placeholder contact details above — swap in your real support email and phone number.)</em>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
