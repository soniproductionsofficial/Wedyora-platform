/** Stagger delay helper — spreads items across columns at ~100ms apart.
 *  Pure utility (no "use client") so server components can call it directly
 *  when computing props for a Reveal. */
export function staggerDelay(index: number, columns = 3, stepMs = 100) {
  return (index % columns) * stepMs;
}
