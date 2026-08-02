import Link from "next/link";
import { ShieldCheck, Heart, Users } from "lucide-react";
import PageHero from "@/components/ui/page-hero";
import GlassContainer from "@/components/ui/glass-container";

// Starter copy — replace with your own founding story, team details, and
// milestones whenever you're ready. Structure and headings are built to
// hold real content; nothing here is final.
export default function AboutPage() {
  return (
    <div>
      <PageHero
        eyebrow="About Wedyora"
        title="For Every Moment, Forever"
        description={
          <>
            Wedyora is India&rsquo;s managed wedding-services platform — we
            connect couples with verified photographers, decorators,
            caterers and more, and stay involved from the first booking to
            the final delivered album.
          </>
        }
      />

      <section className="bg-white border-b border-brand-line">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="font-heading text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-brand-gray leading-relaxed mb-4">
            Wedding planning in India usually means juggling dozens of
            vendors across WhatsApp threads, cash advances, and no real way
            to know if a photographer will actually show up on the day. We
            built Wedyora to fix that — a single, managed platform where
            every vendor is verified, every payment is tracked, and every
            booking has one team accountable for it, start to finish.
          </p>
          <p className="text-brand-gray leading-relaxed">
            <em>
              (This section is a placeholder — swap in your real founding
              story here.)
            </em>
          </p>
        </div>
      </section>

      <section className="bg-brand-cream">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="font-heading text-2xl font-semibold text-center mb-10">
            What We Stand For
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "Verified, Always",
                body: "Every vendor on Wedyora is reviewed by our team before they can take a booking.",
              },
              {
                icon: Heart,
                title: "Care Over Volume",
                body: "We'd rather do fewer weddings well than chase every booking that comes our way.",
              },
              {
                icon: Users,
                title: "One Team, One Number",
                body: "You're never left coordinating with a stranger — Wedyora stays your single point of contact.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <GlassContainer key={title} className="rounded-2xl p-6 text-center">
                <span className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-heading text-lg font-semibold mb-2">{title}</h3>
                <p className="text-brand-gray text-xs leading-relaxed">{body}</p>
              </GlassContainer>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white border-t border-brand-line">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="font-heading text-2xl font-semibold mb-4">
            Planning a wedding, or want to join as a vendor?
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/book"
              className="btn-luxury px-6 py-3 rounded-full bg-brand-orange text-white font-semibold hover:bg-brand-orange-dark transition-colors"
            >
              Plan Your Wedding
            </Link>
            <Link
              href="/vendor/apply"
              className="px-6 py-3 rounded-full border border-brand-line font-semibold hover:bg-brand-cream transition-colors"
            >
              Become a Partner
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
