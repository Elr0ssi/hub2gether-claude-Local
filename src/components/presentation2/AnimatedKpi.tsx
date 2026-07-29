"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface AnimatedKpiProps {
  target: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

// Counts up from 0 to `target` once, on mount — pair with a per-category
// React `key` upstream so it re-triggers exactly on category change, not on
// every scroll tick.
export function AnimatedKpi({ target, decimals = 0, prefix = "", suffix = "", duration = 900 }: AnimatedKpiProps) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? target : 0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (reduced) {
      setDisplay(target);
      return;
    }
    let start: number | null = null;
    const animate = (ts: number) => {
      if (start === null) start = ts;
      const t = Math.min(1, (ts - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(target * eased);
      if (t < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatted = display.toLocaleString("fr-FR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span style={{ fontVariantNumeric: "tabular-nums" }}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
