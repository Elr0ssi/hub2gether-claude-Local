"use client";

import { useRef } from "react";

/** Faire glisser une file à la souris, sans bloquer le clic sur ses liens.
    Au doigt, le défilement natif suffit : seule la souris est prise en charge. */
export function useGlisser<T extends HTMLElement>(surGlisse?: (actif: boolean) => void) {
  const ref = useRef<T>(null);
  const prise = useRef<{ x: number; g: number; bouge: boolean } | null>(null);
  /* L'élan : la vitesse au moment où on lâche, puis une glissade qui ralentit d'elle-même, sans jamais s'accrocher à une vignette. */
  const suivi = useRef<{ t: number; x: number; v: number }>({ t: 0, x: 0, v: 0 });
  const elan = useRef(0);

  const fin = () => {
    const el = ref.current;
    if (el) delete el.dataset.glisse;
    const bouge = prise.current?.bouge;
    prise.current = null;
    surGlisse?.(false);
    if (bouge && el && Math.abs(suivi.current.v) > 0.05 && performance.now() - suivi.current.t < 90) {
      let v = -suivi.current.v * 16; // px par image
      cancelAnimationFrame(elan.current);
      const pas = () => {
        el.scrollLeft += v;
        v *= 0.94;
        if (Math.abs(v) > 0.3) elan.current = requestAnimationFrame(pas);
      };
      elan.current = requestAnimationFrame(pas);
    }
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
      cancelAnimationFrame(elan.current);
      suivi.current = { t: performance.now(), x: e.clientX, v: 0 };
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
      if (p.bouge) {
        el.scrollLeft = p.g - dx;
        const t = performance.now();
        const dt = Math.max(1, t - suivi.current.t);
        /* La vitesse est lissée : un seul mouvement brusque ne la fausse pas. */
        suivi.current = { t, x: e.clientX, v: suivi.current.v * 0.6 + ((e.clientX - suivi.current.x) / dt) * 0.4 };
      }
    },
    onPointerUp: fin,
    onPointerCancel: fin,
    onDragStart: (e: React.DragEvent) => e.preventDefault(),
  };
}
