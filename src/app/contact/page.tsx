import { Mail, Phone } from "lucide-react";
import { submitContactMessageAction } from "@/lib/actions/contact";
import Reveal from "@/components/motion/reveal";
import { GOLD_SWEEP_STYLE } from "@/components/motion/constants";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { error, success } = await searchParams;

  return (
    <div>
      <section className="bg-brand-chrome text-white">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <p className="hero-in hero-in-1 text-brand-gold-bright uppercase tracking-[0.2em] text-xs font-semibold mb-4">
            Contact Us
          </p>
          <h1 className="hero-in hero-in-2 font-heading text-3xl md:text-4xl font-bold mb-6">
            We&rsquo;re Here to Help
          </h1>
          <p className="hero-in hero-in-3 text-white/70 max-w-2xl mx-auto">
            Questions about a booking, a vendor application, or anything
            else — send us a message and our team will get back to you.
          </p>
          <div className="hero-in hero-in-4 mx-auto mt-8 max-w-xs">
            <div className="sweep-line rounded-full" style={GOLD_SWEEP_STYLE} />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 grid md:grid-cols-2 gap-10">
          <Reveal>
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
                className="self-start rounded-full bg-brand-button text-brand-black font-semibold px-6 py-2.5 text-sm hover:bg-brand-button-dark transition-colors"
              >
                Send Message
              </button>
            </form>
          </Reveal>

          <Reveal delayMs={100}>
            <h2 className="font-heading text-xl font-semibold mb-4">Other Ways to Reach Us</h2>
            <div className="flex flex-col gap-4 text-sm">
              <div className="lift flex items-center gap-3 rounded-xl p-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-cream">
                  <Mail className="h-4 w-4 text-brand-orange" />
                </span>
                <div>
                  <p className="text-brand-gray text-xs">Email</p>
                  <a
                    href="mailto:admin@wedyora.com"
                    className="font-medium text-brand-black hover:text-brand-orange transition-colors"
                  >
                    admin@wedyora.com
                  </a>
                </div>
              </div>
              <div className="lift flex items-center gap-3 rounded-xl p-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-cream">
                  <Phone className="h-4 w-4 text-brand-orange" />
                </span>
                <div>
                  <p className="text-brand-gray text-xs">Phone</p>
                  <a
                    href="tel:+919187951975"
                    className="font-medium text-brand-black hover:text-brand-orange transition-colors"
                  >
                    +91 91879 51975
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
