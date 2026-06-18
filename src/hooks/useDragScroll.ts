"use client";

import { useRef, useCallback } from "react";

export function useDragScroll<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    dragging.current = true;
    startX.current = e.pageX - el.getBoundingClientRect().left;
    scrollLeft.current = el.scrollLeft;
    el.style.cursor = "grabbing";
    el.style.userSelect = "none";
  }, []);

  const onMouseUp = useCallback(() => {
    dragging.current = false;
    const el = ref.current;
    if (!el) return;
    el.style.cursor = "grab";
    el.style.removeProperty("user-select");
  }, []);

  const onMouseLeave = useCallback(() => {
    dragging.current = false;
    const el = ref.current;
    if (!el) return;
    el.style.cursor = "grab";
    el.style.removeProperty("user-select");
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging.current || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.getBoundingClientRect().left;
    const walk = (x - startX.current) * 1.5;
    ref.current.scrollLeft = scrollLeft.current - walk;
  }, []);

  return { ref, onMouseDown, onMouseUp, onMouseLeave, onMouseMove };
}
