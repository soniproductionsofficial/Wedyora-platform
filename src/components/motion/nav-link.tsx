"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type NavLinkProps = Omit<ComponentProps<typeof Link>, "transitionTypes"> & {
  children: ReactNode;
  direction?: "forward" | "back";
};

/**
 * Thin Link wrapper that tags navigations for directional View Transitions.
 * Does not change hrefs or routing behavior.
 */
export default function NavLink({
  children,
  direction = "forward",
  ...props
}: NavLinkProps) {
  return (
    <Link
      {...props}
      transitionTypes={[direction === "back" ? "nav-back" : "nav-forward"]}
    >
      {children}
    </Link>
  );
}
