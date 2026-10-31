"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * `useReducedMotion` reads the media query on the very first client render but
 * resolves to `false` during SSR, so branching on it directly makes the server
 * markup and the first client render disagree — a hydration error on exactly
 * the machines that asked for less motion.
 *
 * This waits one commit: the server and the first client render both see
 * `false`, and the real preference lands right after mount, as an ordinary
 * state update.
 *
 * Only for branching that reaches the DOM. Layout that differs under reduced
 * motion belongs in a `prefers-reduced-motion` media query instead, where the
 * question never reaches React at all.
 */
export function useSettledReducedMotion(): boolean {
  const reduced = useReducedMotion();
  const [settled, setSettled] = useState(false);
  useEffect(() => setSettled(true), []);
  return settled && !!reduced;
}
