"use client";

/* ═══════════════════════════════════════════════════════════════════════════
   LES EMPLACEMENTS D'ANNONCE

   Trois formats, pour qu'on voie ce qu'ils feraient à la page avant d'y
   mettre quoi que ce soit : un rail collant à gauche, une bande entre deux
   sections, un encart dans une colonne.

   Rien n'est une vraie annonce, et rien n'imite une marque : la réserve
   porte son format, sa mention « Publicité » et une trame géométrique. Un
   faux visuel crédible finirait par circuler comme un vrai.
   ═══════════════════════════════════════════════════════════════════════════ */

export type Format = "rail" | "bande" | "encart";

const TAILLES: Record<Format, string> = {
  rail: "160 × 600",
  bande: "970 × 120",
  encart: "300 × 250",
};

export function Annonce({ format, className }: { format: Format; className?: string }) {
  return (
    <aside className={`an an-${format} ${className ?? ""}`} aria-label="Emplacement publicitaire">
      <span className="an-l">Publicité</span>
      <span className="an-trame" aria-hidden="true">
        <svg viewBox="0 0 120 120" preserveAspectRatio="none">
          <defs>
            <pattern id={`an-${format}`} width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 0 10 L 10 0" stroke="currentColor" strokeWidth="0.6" fill="none" />
            </pattern>
          </defs>
          <rect width="120" height="120" fill={`url(#an-${format})`} />
        </svg>
      </span>
      <span className="an-c">
        <span className="an-f">{TAILLES[format]}</span>
        <span className="an-n">emplacement réservé</span>
      </span>
    </aside>
  );
}
