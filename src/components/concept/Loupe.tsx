"use client";

import { useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   LA LOUPE

   Une lumière douce qui suit le curseur, et un anneau plus net qui la suit
   avec un temps de retard. Rien d'autre : pas de flou d'arrière-plan sur un
   objet qui bouge — un backdrop-filter en mouvement fait refaire au
   navigateur la composition de toute la zone à chaque image, et c'est
   précisément ce qui ferait ramer la page.

   Ce qui est écrit à chaque image tient en deux `transform` sur deux nœuds
   fixes. Le navigateur les compose sur la carte graphique : la page, elle,
   n'est ni remise en page ni repeinte.

   La loupe ne s'affiche pas là où elle n'a pas de sens : pas de pointeur fin
   (donc pas sur un écran tactile), ou mouvement réduit demandé, et elle ne
   se monte pas du tout.
   ═══════════════════════════════════════════════════════════════════════════ */

export function Loupe() {
  const [active, setActive] = useState(false);
  const nappe = useRef<HTMLSpanElement>(null);
  const anneau = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fin = window.matchMedia("(hover: hover) and (pointer: fine)");
    const doux = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fin.matches || doux.matches) return;
    setActive(true);

    let x = innerWidth / 2;
    let y = innerHeight / 2;
    /* Le point ne colle pas tout à fait au curseur : il le rattrape. À un
       dixième par image la traîne se voyait comme un retard ; à un tiers elle
       ne se lit plus que comme de la matière. */
    let ax = x;
    let ay = y;
    let bouge = false;
    let boucle = 0;
    let vu = false;

    const suit = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      bouge = true;
      if (!vu) {
        vu = true;
        ax = x;
        ay = y;
        document.documentElement.classList.add("a-loupe");
      }
    };
    const sort = () => {
      document.documentElement.classList.remove("a-loupe");
      vu = false;
    };

    const peint = () => {
      boucle = requestAnimationFrame(peint);
      if (!bouge && Math.abs(ax - x) < 0.1 && Math.abs(ay - y) < 0.1) return;
      bouge = false;
      ax += (x - ax) * 0.34;
      ay += (y - ay) * 0.34;
      if (nappe.current) nappe.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (anneau.current) anneau.current.style.transform = `translate3d(${ax}px, ${ay}px, 0)`;
    };
    boucle = requestAnimationFrame(peint);

    window.addEventListener("pointermove", suit, { passive: true });
    document.addEventListener("pointerleave", sort);
    window.addEventListener("blur", sort);
    return () => {
      cancelAnimationFrame(boucle);
      window.removeEventListener("pointermove", suit);
      document.removeEventListener("pointerleave", sort);
      window.removeEventListener("blur", sort);
      document.documentElement.classList.remove("a-loupe");
    };
  }, []);

  if (!active) return null;

  return (
    <>
      <span ref={nappe} className="cg-loupe" aria-hidden="true" />
      <span ref={anneau} className="cg-loupe-a" aria-hidden="true" />
    </>
  );
}
