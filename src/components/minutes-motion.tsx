import Reveal from "@/components/motion/reveal";
import Marquee from "@/components/motion/marquee";

export const MinutesReveal = Reveal;
export const MinutesMarquee = Marquee;

export function MinutesStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="text-center">
      <p className="font-heading text-2xl font-bold text-brand-magenta sm:text-3xl">
        {value}
      </p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-brand-gray">
        {label}
      </p>
    </div>
  );
}
