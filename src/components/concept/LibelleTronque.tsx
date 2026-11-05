"use client";

import { useEffect, useRef, useState } from "react";

/* Un libellé sur une ligne, coupé par des points de suspension quand la place manque ; au survol (ou au focus), une petite bulle donne
   le nom complet — seulement quand il est réellement coupé. */
export function LibelleTronque({ texte, className }: { texte: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [coupe, setCoupe] = useState(false);
  /* Le survol se lit sur toute la carte (le bouton qui contient le libellé), pas seulement sur le texte. */
  useEffect(() => {
    const el = ref.current;
    const hote = (el?.closest("button") ?? el?.parentElement) as HTMLElement | null | undefined;
    if (!el || !hote) return;
    const mesure = () => setCoupe(el.scrollWidth > el.clientWidth + 1);
    const cache = () => setCoupe(false);
    hote.addEventListener("pointerenter", mesure);
    hote.addEventListener("focus", mesure);
    hote.addEventListener("pointerleave", cache);
    hote.addEventListener("blur", cache);
    return () => {
      hote.removeEventListener("pointerenter", mesure);
      hote.removeEventListener("focus", mesure);
      hote.removeEventListener("pointerleave", cache);
      hote.removeEventListener("blur", cache);
    };
  }, [texte]);
  return (
    <span className="lt">
      <span ref={ref} className={className} aria-label={texte}>{texte}</span>
      {coupe && <span className="lt-bulle" role="tooltip">{texte}</span>}
    </span>
  );
}
