// Starter blog content — hardcoded rather than a database table, since
// there's no CMS yet and only a handful of posts exist. Add a new entry
// here (and it shows up on /blog and /blog/[slug] automatically) until a
// real content-management workflow is worth building.

export interface BlogListItem {
  label: string;
  text: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string; // YYYY-MM-DD (calendar date, Asia/Kolkata)
  image?: { src: string; alt: string };
  heading?: string;
  list?: BlogListItem[];
  closing?: string;
  body?: string[];
}

const VENUE_SELECTION_CHECKLIST: BlogListItem[] = [
  {
    label: "Location & Accessibility",
    text: "Choose a venue that is easy for local and out-of-town guests to reach, taking into account airport connectivity, transit options, and parking.",
  },
  {
    label: "Space & Guest Capacity",
    text: "Ensure banquet halls, dining spaces, and outdoor lawns comfortably handle your expected guest count.",
  },
  {
    label: "Aesthetic & Theme Alignment",
    text: "Match the property to your desired vision, whether royal, traditional, modern, or garden-style.",
  },
  {
    label: "Food & Catering Options",
    text: "Review menu flexibility, schedule food tastings, and check for special dietary accommodations.",
  },
  {
    label: "Guest Accommodations",
    text: "Ensure the property offers comfortable rooms and quality facilities for guests traveling from outside the city.",
  },
  {
    label: "Vendor Policies",
    text: "Confirm if the hotel allows external decorators, event setup, lighting, and specialized photography teams or drones.",
  },
  {
    label: "Weather Backup Plans",
    text: "For outdoor ceremonies, verify that the hotel has a seamless indoor backup venue available in case of rain.",
  },
  {
    label: "Transparent Pricing",
    text: "Evaluate the full expense—including food, rooms, taxes, service fees, and additional charges—rather than comparing venue rental costs alone.",
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-choose-the-right-wedding-hotel-in-bangalore",
    title: "How to Choose the Right Wedding Hotel in Bangalore: An Essential Checklist",
    excerpt:
      "Choosing the right wedding hotel is one of the most important decisions for your big day. The perfect venue should not only look beautiful but also provide comfort, convenience, great service, and a memorable experience for you and your guests.",
    publishedAt: "2026-08-17",
    image: {
      src: "/images/blog/wedding-hotel-bangalore-checklist.jpg",
      alt: "Couple in traditional attire dancing at a palace-style wedding venue",
    },
    heading: "The Ultimate Venue Selection Checklist",
    list: VENUE_SELECTION_CHECKLIST,
    closing:
      "The right wedding hotel is the foundation where your celebrations, emotions, and memories come together. Select a property that aligns with your overall vision, budget, and guest experience goals.",
  },
  {
    slug: "the-future-of-wedding-planning-with-wedyora",
    title: "The Future of Wedding Planning with Wedyora",
    excerpt:
      "Planning a wedding should be about celebrating love, not drowning in endless vendor calls and spreadsheets. With hundreds of photographers, decorators, and caterers available, finding the right match can feel overwhelming. That’s where Wedyora changes the game.",
    publishedAt: "2026-08-18",
    image: {
      src: "/images/blog/future-of-wedding-planning.jpg",
      alt: "Joyful couple in festive wedding attire wearing sunglasses",
    },
    list: [
      {
        label: "Custom-Assigned Pros",
        text: "No more searching through generic directories. Wedyora handpicks vendors tailored to your exact aesthetic and preferences.",
      },
      {
        label: "Verified Quality",
        text: "Every vendor assigned through Wedyora is vetted for high service standards, professionalism, and reliability.",
      },
      {
        label: "Zero-Hassle Booking",
        text: "Skip the endless price negotiations. Get transparent, matched options instantly so you can focus on enjoying your engagement.",
      },
      {
        label: "Pan-India Network",
        text: "Whether you are planning a local celebration or a destination wedding across India, Wedyora connects you with the right team seamlessly.",
      },
      {
        label: "Single-Point Coordination",
        text: "Simplifies multi-vendor communication into one smooth workflow, saving you time and reducing planning fatigue.",
      },
      {
        label: "Tailored Style Alignment",
        text: "Matches your exact aesthetic—whether regal, contemporary, traditional, or candid—with the right expert lensmen.",
      },
      {
        label: "Instant Availability Verification",
        text: "Prevents wasted time inquiring with booked-out vendors by only assigning pros who are ready on your dates.",
      },
      {
        label: "Pan-India Coverage",
        text: "Connects you with top-tier wedding pros across every state and union territory, making regional and destination planning effortless.",
      },
    ],
    closing:
      "Love knows no borders, and neither should your wedding memories. Let expert lensmen capture your story, anywhere in India. By using intelligent matching technology, Wedyora assigns top-rated wedding professionals directly to you based on your unique style, date, and budget.",
  },
  {
    slug: "top-luxury-wedding-hotels-in-bangalore",
    title: "Top Luxury Wedding Hotels in Bangalore",
    excerpt:
      "Bangalore features several iconic luxury properties that can transform a wedding into a grand celebration. From heritage gardens and palace-inspired interiors to contemporary ballrooms, there is a venue for every wedding style.",
    publishedAt: "2026-08-19",
    image: {
      src: "/images/blog/luxury-wedding-hotels-bangalore.jpg",
      alt: "Luxury outdoor wedding lounge with pink seating, florals, and chandeliers",
    },
    heading: "The Ultimate Venue Selection Checklist",
    list: VENUE_SELECTION_CHECKLIST,
    closing:
      "The right wedding hotel is the foundation where your celebrations, emotions, and memories come together. Select a property that aligns with your overall vision, budget, and guest experience goals.",
  },
];

/** Format YYYY-MM-DD as an India-facing calendar date without UTC off-by-one. */
export function formatBlogDate(publishedAt: string) {
  const [year, month, day] = publishedAt.slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getBlogPostsNewestFirst() {
  return BLOG_POSTS.slice().sort((a, b) =>
    a.publishedAt < b.publishedAt ? 1 : -1
  );
}
