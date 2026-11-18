"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export interface Selection {
  text: string;
  rect: DOMRect;
}

/**
 * Watches for a text selection inside one container and reports it, so the
 * reading-mode bubble has something to translate.
 *
 * Shared rather than reimplemented: the article body and the format under
 * test both offer the same gesture, and a selection rule that drifted between
 * them would be a bug nobody would think to look for.
 */
export function useSelectionTranslation(enabled: boolean): {
  containerRef: RefObject<HTMLDivElement | null>;
  selection: Selection | null;
  clear: () => void;
} {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selection, setSelection] = useState<Selection | null>(null);

  useEffect(() => {
    const onMouseUp = () => {
      if (!enabled) {
        setSelection(null);
        return;
      }
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
        setSelection(null);
        return;
      }
      const text = sel.toString().trim();
      // A single character is a stray click, not a request for a translation.
      if (!text || text.length < 2) {
        setSelection(null);
        return;
      }
      const range = sel.getRangeAt(0);
      if (!containerRef.current?.contains(range.commonAncestorContainer)) {
        setSelection(null);
        return;
      }
      setSelection({ text, rect: range.getBoundingClientRect() });
    };

    // The bubble is placed against a viewport rectangle, so any scroll makes
    // that rectangle wrong: it goes rather than follows.
    const onScroll = () => setSelection(null);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelection(null);
    };

    document.addEventListener("mouseup", onMouseUp);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [enabled]);

  return { containerRef, selection, clear: () => setSelection(null) };
}
