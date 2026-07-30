// Starter blog content — hardcoded rather than a database table, since
// there's no CMS yet and only a handful of posts exist. Add a new entry
// here (and it shows up on /blog and /blog/[slug] automatically) until a
// real content-management workflow is worth building.

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string; // ISO date
  body: string[]; // one string per paragraph
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-choose-a-wedding-photographer",
    title: "How to Choose the Right Wedding Photographer",
    excerpt:
      "Portfolio style, delivery timelines, and the questions worth asking before you book — a quick guide for couples.",
    publishedAt: "2026-06-01",
    body: [
      "Your wedding photos are one of the few things from your big day that last forever, which makes the photographer decision feel heavier than it needs to be. Start with style: do you want candid, documentary-style coverage, or classic posed portraits? Most photographers lean toward one, so look at full galleries (not just highlight reels) to judge consistency.",
      "Next, ask about delivery timelines. A realistic full-length wedding video usually takes several weeks to edit properly — anyone promising next-day delivery of a complete film is cutting corners somewhere.",
      "Finally, confirm what's actually included: raw files, drone coverage, a second shooter, album design. On Wedyora, every vendor's package spells out exactly what's covered before you pay a deposit, so there are no surprises later.",
    ],
  },
  {
    slug: "wedding-budget-planning-101",
    title: "Wedding Budget Planning 101",
    excerpt:
      "A simple way to think about splitting your budget across venue, catering, photography, and decor.",
    publishedAt: "2026-06-15",
    body: [
      "Most first-time wedding planners underestimate how many vendors are involved and overestimate how far a single budget number stretches. A useful starting split: venue and catering typically take the largest share, followed by photography/videography, then decor, with smaller allocations for entertainment and invitations.",
      "The biggest budget mistake isn't overspending on one category — it's not tracking the total across all of them until it's too late. Whatever tool you use, track every vendor's advance and balance in one place from day one.",
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
