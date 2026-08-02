import type { ReactNode, CSSProperties } from "react";

type Variant = "light" | "dark";

interface GlassContainerProps {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  style?: CSSProperties;
}

/**
 * Frosted glass surface used across marketing sections and cards.
 * Pure presentational — no data or routing concerns.
 */
export default function GlassContainer({
  children,
  className = "",
  variant = "light",
  style,
}: GlassContainerProps) {
  const surface = variant === "dark" ? "glass-panel-dark" : "glass-panel";
  return (
    <div className={`${surface} ${className}`} style={style}>
      {children}
    </div>
  );
}
