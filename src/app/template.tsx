import PageTransition from "@/components/motion/page-transition";

/**
 * Remounts on segment navigation so entrance motion re-triggers, while
 * View Transitions inside PageTransition handle the continuous exit/enter.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
