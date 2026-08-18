import type { Transition, Variants } from "framer-motion";

/**
 * Shared animation tokens for the whole site — every section should use
 * these instead of one-off animations, so entrances feel consistent
 * everywhere (homepage, /services, /photography-in-minutes, ...).
 */

/** Standard ease-out curve used for every entrance. */
export const EASE_OUT: Transition["ease"] = [0.4, 0, 0.2, 1];

/** IntersectionObserver viewport config used by every `whileInView`. */
export const VIEWPORT_ONCE = { once: true, amount: 0.3 } as const;

const ENTER_TRANSITION: Transition = { duration: 0.5, ease: EASE_OUT };

/** Fade + slide up — the default entrance for sections and cards. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: ENTER_TRANSITION },
};

/** Smaller lift for compact elements (hero lines, list rows). */
export const fadeUpSmall: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE_OUT },
  },
};

/** Fade + scale — for phone mockups / app-preview style elements. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: ENTER_TRANSITION },
};

/** Parent wrapper — staggers its children's fadeUp/fadeUpSmall by ~0.1s. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

/** Hero sequence — badge/eyebrow, heading, subtext, CTAs, ~100ms apart. */
export const heroContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

export const heroItem: Variants = fadeUpSmall;
