import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog-posts";
import PageHero from "@/components/ui/page-hero";
import GlassContainer from "@/components/ui/glass-container";

export default function BlogPage() {
  return (
    <div>
      <PageHero
        eyebrow="Blog"
        title={<>Wedding Planning Guides &amp; Tips</>}
        description="Practical advice for planning your wedding, from budgeting to choosing vendors."
      />

      <section className="bg-brand-ivory/60">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <div className="flex flex-col gap-6">
            {BLOG_POSTS.slice()
              .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
              .map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <GlassContainer className="block rounded-2xl p-6 transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(212,175,106,0.18)]">
                    <p className="mb-2 text-xs text-brand-gray">
                      {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <h2 className="mb-2 font-heading text-xl font-semibold">{post.title}</h2>
                    <p className="text-sm text-brand-gray">{post.excerpt}</p>
                  </GlassContainer>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
