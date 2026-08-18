"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { TELEPORT_EVENT, type TeleportDetail } from "@/hooks/useScrollTeleport";

interface SectionRollProps {
  /** Index of the section this wraps, matching the roll event. */
  index: number;
  children: ReactNode;
}

/**
 * Gives the arriving section a little lag behind the page.
 *
 * The roll already moves the viewport; this only holds the content back by a
 * few dozen pixels and lets it catch up on a long ease. The section therefore
 * climbs into place rather than sliding in locked to the scroll — the
 * difference between the next block being dropped in front of the reader and
 * it rising to take the previous one's place.
 *
 * No fade: an opacity change here would read as a cut, which is exactly what
 * the roll exists to avoid.
 */
export function SectionRoll({ index, children }: SectionRollProps) {
  const controls = useAnimationControls();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const onRoll = (e: Event) => {
      const detail = (e as CustomEvent<TeleportDetail>).detail;
      if (detail.index !== index) return;
      controls.set({ y: detail.dir * 72 });
      controls.start({
        y: 0,
        transition: { duration: 1.25, ease: [0.22, 0.9, 0.24, 1] },
      });
    };
    window.addEventListener(TELEPORT_EVENT, onRoll);
    return () => window.removeEventListener(TELEPORT_EVENT, onRoll);
  }, [index, controls, reduced]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      style={{ width: "100%" }}
      // The transform is wiped once the section has settled: a lingering one
      // would become the containing block for `position: fixed` children, and
      // the map's fullscreen lives inside here.
      onAnimationComplete={() => {
        if (ref.current) ref.current.style.transform = "";
      }}
    >
      {children}
    </motion.div>
  );
}
