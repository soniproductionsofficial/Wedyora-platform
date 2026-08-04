import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPost } from "@/lib/blog-posts";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) notFound();

  return (
    <div>
      <section className="bg-brand-black text-white">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <Link href="/blog" className="text-xs text-white/60 hover:text-white">
            &larr; Back to Blog
          </Link>
          <p className="text-brand-gold-bright uppercase tracking-[0.2em] text-xs font-semibold mt-6 mb-3">
            {new Date(post.publishedAt).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 className="font-heading text-3xl font-bold">{post.title}</h1>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <div className="flex flex-col gap-5 text-brand-gray leading-relaxed">
            {post.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
