"use client";

import { useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   LE ROULEMENT

   Un nombre qui change ne saute pas d'une valeur à l'autre : chaque chiffre
   roule jusqu'au sien. C'est la seule façon de voir *qu'il* a changé, et
   lesquels — un remplacement instantané ne dit que « ce n'est plus pareil ».

   Le texte est déjà formaté quand il arrive ici : on ne reformate pas, on
   anime. Ce qui n'est pas un chiffre (espace, virgule, signe, unité) reste
   posé et ne bouge pas.
   ═══════════════════════════════════════════════════════════════════════════ */

const CHIFFRES = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

export function Roulement({ texte, className }: { texte: string; className?: string }) {
  const [doux, setDoux] = useState(false);
  /* Le premier rendu se fait sans mouvement : faire rouler tous les chiffres
     depuis zéro à l'arrivée sur la page transforme la lecture en feu
     d'artifice. */
  const pose = useRef(false);
  useEffect(() => {
    setDoux(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const t = requestAnimationFrame(() => {
      pose.current = true;
    });
    return () => cancelAnimationFrame(t);
  }, []);

  if (doux) return <span className={className}>{texte}</span>;

  return (
    <span className={`rl ${className ?? ""}`} aria-label={texte} role="text">
      {[...texte].map((c, i) => {
        const n = CHIFFRES.indexOf(c);
        if (n < 0) {
          return (
            <span key={`${i}-${c}`} className="rl-fixe" aria-hidden="true">
              {c}
            </span>
          );
        }
        return (
          <span key={`${i}-p`} className="rl-fente" aria-hidden="true">
            <span
              className="rl-colonne"
              style={{
                transform: `translateY(${-n * 10}%)`,
                /* Aucun décalage entre les colonnes : sur un compteur qui se
                   remet à jour chaque seconde, un départ échelonné laisse les
                   chiffres en transit en permanence, et le nombre n'est
                   jamais lisible. Elles partent ensemble et se posent vite. */
                transitionDelay: pose.current ? "0ms" : "0ms",
              }}
            >
              {CHIFFRES.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}
