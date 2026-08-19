import Image from "next/image";
import Link from "next/link";
import { formatBlogDate, getBlogPostsNewestFirst } from "@/lib/blog-posts";
import Reveal from "@/components/motion/reveal";
import { staggerDelay } from "@/components/motion/stagger";
import { GOLD_SWEEP_STYLE } from "@/components/motion/constants";

export default function BlogPage() {
  const posts = getBlogPostsNewestFirst();

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
            {posts.map((post, i) => (
              <Reveal key={post.slug} delayMs={staggerDelay(i, 3, 80)}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="lift group grid overflow-hidden rounded-2xl border border-brand-line bg-white hover:border-brand-orange md:grid-cols-[1fr_220px]"
                >
                  <div className="p-6">
                    <p className="text-xs text-brand-gray mb-2">
                      {formatBlogDate(post.publishedAt)}
                    </p>
                    <h2 className="font-heading text-xl font-semibold mb-2">
                      {post.title}
                    </h2>
                    <p className="text-brand-gray text-sm line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                  {post.image ? (
                    <div className="relative min-h-[180px] md:min-h-0">
                      <Image
                        src={post.image.src}
                        alt={post.image.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 220px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  ) : null}
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
