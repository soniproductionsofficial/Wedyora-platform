import type { ReactNode } from "react";
import Carousel from "@/components/motion/carousel";

export default function MinutesCarousel({ children }: { children: ReactNode[] }) {
  return <Carousel>{children}</Carousel>;
}
