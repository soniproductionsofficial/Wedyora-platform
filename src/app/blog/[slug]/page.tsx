import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatBlogDate, getBlogPost } from "@/lib/blog-posts";
import Reveal from "@/components/motion/reveal";

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
      <section className="bg-brand-chrome text-white">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <Link href="/blog" className="hero-in hero-in-1 text-xs text-white/60 hover:text-white">
            &larr; Back to Blog
          </Link>
          <p className="hero-in hero-in-2 text-brand-gold-bright uppercase tracking-[0.2em] text-xs font-semibold mt-6 mb-3">
            {formatBlogDate(post.publishedAt)}
          </p>
          <h1 className="hero-in hero-in-3 font-heading text-3xl font-bold">{post.title}</h1>
        </div>
      </section>

      <section className="bg-white">
        <Reveal className="mx-auto max-w-3xl px-6 py-16">
          {post.image ? (
            <div className="relative mb-10 aspect-[4/5] overflow-hidden rounded-2xl sm:aspect-[16/10]">
              <Image
                src={post.image.src}
                alt={post.image.alt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
          ) : null}

          <div className="flex flex-col gap-5 text-brand-gray leading-relaxed">
            <p className="rounded-2xl bg-brand-cream px-5 py-4 text-brand-black">
              {post.excerpt}
            </p>

            {post.heading ? (
              <h2 className="font-heading text-xl font-semibold text-brand-black pt-2">
                {post.heading}
              </h2>
            ) : null}

            {post.list?.length ? (
              <ul className="flex flex-col gap-4">
                {post.list.map((item) => (
                  <li key={item.label}>
                    <span className="font-semibold text-brand-black">
                      {item.label}:{" "}
                    </span>
                    {item.text}
                  </li>
                ))}
              </ul>
            ) : null}

            {post.closing ? (
              <p className="text-brand-magenta font-medium">{post.closing}</p>
            ) : null}

            {post.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </Reveal>
      </section>
    </div>
  );
}
