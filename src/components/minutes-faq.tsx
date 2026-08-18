import Accordion from "@/components/motion/accordion";
import { MINUTES_FAQS } from "@/lib/minutes-content";

export default function MinutesFaq() {
  return (
    <Accordion
      items={MINUTES_FAQS}
      accentClassName="text-brand-magenta"
      className="mx-auto max-w-2xl"
    />
  );
}
