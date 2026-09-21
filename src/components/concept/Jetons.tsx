"use client";

import { useEffect, useState } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   LES JETONS DE L'OUVERTURE

   Des pièces, des chandeliers, un billet, un jeton de chaîne : les signes de
   l'économie, dessinés au trait, jamais des images rapportées.

   Leur trajet tient en un seul état. Au chargement ils sont rassemblés en bas
   au centre et se déploient ; quand le globe approche ils s'y rassemblent de
   nouveau, et ils se redéploient si l'on remonte. Entre les deux ils
   dérivent, chacun à son rythme.

   Rien de tout cela n'est calculé image par image. Chaque jeton porte sa
   position en pourcentage de l'ouverture, qui fait exactement une largeur et
   une hauteur d'écran : le vecteur qui le ramène au point de rassemblement
   s'écrit donc en vw et en vh, et c'est une transition CSS qui l'y emmène.
   ═══════════════════════════════════════════════════════════════════════════ */

type Forme = "piece" | "chandelier" | "billet" | "chaine" | "part" | "taux";

interface Jeton {
  f: Forme;
  /** Position dans l'ouverture, en pourcentage de sa largeur et de sa hauteur. */
  x: number;
  y: number;
  /** Diamètre, en pixels. */
  t: number;
  /** Durée de la dérive, en secondes. */
  d: number;
  /** Signe porté par la pièce, quand il y en a un. */
  s?: string;
}

/* Les jetons évitent le couloir central, où se lit le titre. */
const JETONS: Jeton[] = [
  { f: "piece", x: 9, y: 26, t: 54, d: 11, s: "€" },
  { f: "chandelier", x: 17, y: 58, t: 46, d: 14 },
  { f: "piece", x: 6, y: 72, t: 38, d: 9, s: "$" },
  { f: "billet", x: 22, y: 33, t: 50, d: 13 },
  { f: "chaine", x: 13, y: 45, t: 42, d: 16 },
  { f: "taux", x: 27, y: 74, t: 36, d: 10 },
  { f: "part", x: 31, y: 18, t: 40, d: 15 },
  { f: "piece", x: 90, y: 30, t: 52, d: 12, s: "¥" },
  { f: "chandelier", x: 83, y: 64, t: 44, d: 10 },
  { f: "piece", x: 94, y: 70, t: 36, d: 15, s: "£" },
  { f: "billet", x: 77, y: 24, t: 46, d: 13 },
  { f: "chaine", x: 87, y: 47, t: 40, d: 9 },
  { f: "part", x: 70, y: 76, t: 38, d: 14 },
  { f: "taux", x: 69, y: 15, t: 34, d: 11 },
];

function Dessin({ f, s }: { f: Forme; s?: string }) {
  const trait = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round" as const };
  switch (f) {
    case "piece":
      return (
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" {...trait} />
          <text
            x="12"
            y="16"
            textAnchor="middle"
            fontSize="10"
            fill="currentColor"
            stroke="none"
          >
            {s}
          </text>
        </svg>
      );
    case "chandelier":
      return (
        <svg viewBox="0 0 24 24">
          <path d="M7 4v16M17 4v16" {...trait} />
          <rect x="4" y="8" width="6" height="8" rx="1" {...trait} />
          <rect x="14" y="5" width="6" height="11" rx="1" {...trait} />
        </svg>
      );
    case "billet":
      return (
        <svg viewBox="0 0 24 24">
          <rect x="2" y="6" width="20" height="12" rx="2" {...trait} />
          <circle cx="12" cy="12" r="3" {...trait} />
          <path d="M5 9v6M19 9v6" {...trait} />
        </svg>
      );
    case "chaine":
      return (
        <svg viewBox="0 0 24 24">
          <path d="M12 2.5 20.5 7v10L12 21.5 3.5 17V7z" {...trait} />
          <path d="M12 8v8M9 10.5h6M9 13.5h6" {...trait} />
        </svg>
      );
    case "part":
      return (
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" {...trait} />
          <path d="M12 3v9h9" {...trait} />
        </svg>
      );
    case "taux":
    default:
      return (
        <svg viewBox="0 0 24 24">
          <path d="M6 18 18 6" {...trait} />
          <circle cx="7.5" cy="7.5" r="2.8" {...trait} />
          <circle cx="16.5" cy="16.5" r="2.8" {...trait} />
        </svg>
      );
  }
}

export function Jetons({ rassembles }: { rassembles: boolean }) {
  /* Au premier rendu ils sont rassemblés : le déploiement est alors une
     transition et non une animation de plus à écrire. */
  const [pose, setPose] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setPose(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <div className="cg-jetons" data-groupes={!pose || rassembles ? "1" : "0"} aria-hidden="true">
      {JETONS.map((j, i) => (
        <span
          key={`${j.f}-${i}`}
          className="cg-jeton"
          style={
            {
              "--x": j.x,
              "--y": j.y,
              "--t": `${j.t}px`,
              "--d": `${j.d}s`,
              "--i": i,
            } as React.CSSProperties
          }
        >
          <span className="cg-jeton-d">
            <span className="cg-jeton-i">
              <Dessin f={j.f} s={j.s} />
            </span>
          </span>
        </span>
      ))}
    </div>
  );
}
