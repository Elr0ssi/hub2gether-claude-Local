"use client";

import { useState } from "react";
import { useMotionValueEvent, type MotionValue } from "framer-motion";

// Workaround: in this project's Next/React/framer-motion combination, a
// useTransform-derived MotionValue bound directly to `opacity` in a
// motion.div's style never gets written to the DOM (transform-family props
// and other CSS properties like `left` update fine — opacity specifically
// does not). Mirroring the value into React state and applying it as a
// plain number sidesteps the bug reliably.
export function useMotionNumber(value: MotionValue<number>): number {
  const [state, setState] = useState(value.get());
  useMotionValueEvent(value, "change", (v) => setState(v));
  return state;
}
