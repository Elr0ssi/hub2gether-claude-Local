"use client";

import { useRef } from "react";

/** Faire glisser une file à la souris, sans bloquer le clic sur ses liens.
    Au doigt, le défilement natif suffit : seule la souris est prise en charge. */
export function useGlisser<T extends HTMLElement>(surGlisse?: (actif: boolean) => void) {
  const ref = useRef<T>(null);
  const prise = useRef<{ x: number; g: number; bouge: boolean } | null>(null);

  const fin = () => {
    const el = ref.current;
    if (el) delete el.dataset.glisse;
    const bouge = prise.current?.bouge;
    prise.current = null;
    surGlisse?.(false);
    if (bouge && el) {
      /* Le clic qui suit un glissé est avalé ; un simple clic passe. */
      const bloque = (ev: Event) => ev.stopPropagation();
      el.addEventListener("click", bloque, { capture: true, once: true });
      window.setTimeout(() => el.removeEventListener("click", bloque, { capture: true }), 0);
    }
  };

  return {
    ref,
    onPointerDown: (e: React.PointerEvent<T>) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      prise.current = { x: e.clientX, g: e.currentTarget.scrollLeft, bouge: false };
    },
    onPointerMove: (e: React.PointerEvent<T>) => {
      const p = prise.current;
      const el = ref.current;
      if (!p || !el) return;
      const dx = e.clientX - p.x;
      if (!p.bouge && Math.abs(dx) > 5) {
        p.bouge = true;
        el.setPointerCapture(e.pointerId);
        el.dataset.glisse = "1";
        surGlisse?.(true);
      }
      if (p.bouge) el.scrollLeft = p.g - dx;
    },
    onPointerUp: fin,
    onPointerCancel: fin,
    onDragStart: (e: React.DragEvent) => e.preventDefault(),
  };
}
