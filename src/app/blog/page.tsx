import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog-posts";
import Reveal from "@/components/reveal";

export default function BlogPage() {
  return (
    <div>
      <section className="bg-brand-black text-white">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <p className="animate-fade-in-up text-brand-gold-bright uppercase tracking-[0.2em] text-xs font-semibold mb-4">
            Blog
          </p>
          <h1
            className="animate-fade-in-up font-heading text-3xl md:text-4xl font-bold mb-6"
            style={{ animationDelay: "120ms" }}
          >
            Wedding Planning Guides &amp; Tips
          </h1>
          <p
            className="animate-fade-in-up text-white/70 max-w-2xl mx-auto"
            style={{ animationDelay: "240ms" }}
          >
            Practical advice for planning your wedding, from budgeting to
            choosing vendors.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <div className="flex flex-col gap-6">
            {BLOG_POSTS.slice()
              .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
              .map((post, i) => (
                <Reveal key={post.slug} delay={i * 80}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover-lift block rounded-2xl border border-brand-line bg-white p-6 hover:border-brand-orange transition-all"
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
