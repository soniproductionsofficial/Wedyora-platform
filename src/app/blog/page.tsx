import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog-posts";
import Reveal from "@/components/motion/reveal";
import { staggerDelay } from "@/components/motion/stagger";
import { GOLD_SWEEP_STYLE } from "@/components/motion/constants";

export default function BlogPage() {
  return (
    <div>
      <section className="bg-brand-chrome text-white">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <p className="hero-in hero-in-1 text-brand-gold-bright uppercase tracking-[0.2em] text-xs font-semibold mb-4">
            Blog
          </p>
          <h1 className="hero-in hero-in-2 font-heading text-3xl md:text-4xl font-bold mb-6">
            Wedding Planning Guides &amp; Tips
          </h1>
          <p className="hero-in hero-in-3 text-white/70 max-w-2xl mx-auto">
            Practical advice for planning your wedding, from budgeting to
            choosing vendors.
          </p>
          <div className="hero-in hero-in-4 mx-auto mt-8 max-w-xs">
            <div className="sweep-line rounded-full" style={GOLD_SWEEP_STYLE} />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <div className="flex flex-col gap-6">
            {BLOG_POSTS.slice()
              .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
              .map((post, i) => (
                <Reveal key={post.slug} delayMs={staggerDelay(i, 3, 80)}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="lift block rounded-2xl border border-brand-line bg-white p-6 hover:border-brand-orange"
                  >
                    <p className="text-xs text-brand-gray mb-2">
                      {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <h2 className="font-heading text-xl font-semibold mb-2">{post.title}</h2>
                    <p className="text-brand-gray text-sm">{post.excerpt}</p>
                  </Link>
                </Reveal>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
