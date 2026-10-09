"use client";

import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface ScrollRevealProps {
  children: ReactNode;
  /** Travel distance in px before settling. */
  offset?: number;
  duration?: number;
  className?: string;
}

/**
 * Reveals a section once when it enters the viewport — opacity plus a short
 * rise, on a decelerating curve.
 *
 * The wrapper drops back to a plain `div` as soon as the reveal is done, so it
 * never leaves a transform behind: children that rely on `position: fixed`
 * (map fullscreen, modals) keep working against the viewport.
 */
export function ScrollReveal({ children, offset = 26, duration = 0.7, className }: ScrollRevealProps) {
  const reduced = useReducedMotion();
  const [settled, setSettled] = useState(false);

  if (reduced || settled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: offset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.04 }}
      transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
      onAnimationComplete={() => setSettled(true)}
    >
      {children}
    </motion.div>
  );
}
