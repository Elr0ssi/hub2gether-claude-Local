"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { TELEPORT_EVENT, type TeleportDetail } from "@/hooks/useScrollTeleport";

interface SectionArrivalProps {
  /** Index of the section this wraps, matching the teleport event. */
  index: number;
  children: ReactNode;
}

/**
 * Plays the arrival of a section the page jumped to.
 *
 * The jump itself is instantaneous by design — nothing about it is visible.
 * So the section that lands answers for it: it comes in from the side the
 * page travelled from, slightly small and dimmed, and settles on a spring.
 * The reader sees a flight even though the scroll position never animated.
 */
export function SectionArrival({ index, children }: SectionArrivalProps) {
  const controls = useAnimationControls();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const onTeleport = (e: Event) => {
      const detail = (e as CustomEvent<TeleportDetail>).detail;
      if (detail.index !== index) return;
      controls.set({ y: detail.dir * 64, opacity: 0.25, scale: 0.965 });
      controls.start({
        y: 0,
        opacity: 1,
        scale: 1,
        transition: { type: "spring", stiffness: 210, damping: 26, mass: 0.9 },
      });
    };
    window.addEventListener(TELEPORT_EVENT, onTeleport);
    return () => window.removeEventListener(TELEPORT_EVENT, onTeleport);
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
