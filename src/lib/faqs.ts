// Shared FAQ content — used by both the /faq page and the chat widget
// (src/components/chat-widget.tsx), so there's one list to keep accurate
// rather than two copies drifting apart.

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    question: "How does booking a vendor through Wedyora work?",
    answer:
      "Tell us your service, date, city, and budget on the Plan Your Wedding page. Our team reviews the request and assigns a verified vendor with pricing confirmed before anything is charged. You pay a secure advance through Razorpay to confirm the booking.",
  },
  {
    question: "Are all vendors on Wedyora verified?",
    answer:
      "Yes — every vendor goes through an application and review process before they can accept a single booking. Approved vendors are the only ones shown when you browse or get matched.",
  },
  {
    question: "How do payments work?",
    answer:
      "Payments are collected through Razorpay, never in cash or over a private transfer. A booking is confirmed once your advance is paid, and the remaining balance follows the payment schedule your vendor's package sets out.",
  },
  {
    question: "What if I need to cancel or reschedule?",
    answer:
      "See our Refund Policy for how advance payments are handled on cancellation. If you need to reschedule, reach out through Contact Us as early as possible so we can check your vendor's availability on the new date.",
  },
  {
    question: "How do I become a vendor on Wedyora?",
    answer:
      "Apply through Become a Partner. You'll submit your business details and portfolio, choose a registration plan, and pay a one-time registration fee plus a refundable security deposit once your application is approved.",
  },
  {
    question: "Who do I contact if something goes wrong on the wedding day?",
    answer:
      "Every booking has Wedyora as a single point of contact — you're never left coordinating directly with an unfamiliar vendor alone. Use Contact Us and our team will step in.",
  },
];
