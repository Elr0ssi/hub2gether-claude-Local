"use client";

import { useEffect, useState } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   LE JOUR ET LA NUIT

   Un attribut sur la racine du document, et toute la feuille du concept
   bascule : les jetons de couleur changent, rien n'est redessiné.

   La racine plutôt que le conteneur, pour deux raisons. Le fond de la page
   déborde du conteneur — rebond de défilement, bande sous le pied — et il
   faut pouvoir le peindre aussi. Et l'attribut peut alors être posé avant le
   premier rendu, par le petit script du gabarit : sans lui, une page ouverte
   en clair apparaîtrait noire le temps d'une image.
   ═══════════════════════════════════════════════════════════════════════════ */

export type Theme = "nuit" | "clair";

const CLE = "visualize-theme";

/* Les abonnés au thème.

   Deux composants appelaient ce crochet — le bouton et le globe — et chacun
   tenait son propre état. Le bouton changeait le sien, le globe ne
   l'apprenait jamais : il gardait sa palette de nuit sur une page devenue
   claire. Le thème est donc tenu une seule fois, ici, et tout le monde y est
   abonné. */
let COURANT: Theme = "nuit";
const ABONNES = new Set<(t: Theme) => void>();

function diffuse(t: Theme) {
  COURANT = t;
  for (const f of ABONNES) f(t);
}

/** Le thème courant, et de quoi en changer. */
export function useTheme(): [Theme, (t: Theme) => void] {
  const [theme, poser] = useState<Theme>(COURANT);

  useEffect(() => {
    /* Le premier crochet monté relit la racine : c'est le script du gabarit
       qui y a posé le choix, avant tout rendu. */
    const lu: Theme = document.documentElement.dataset.concept === "clair" ? "clair" : "nuit";
    if (lu !== COURANT) diffuse(lu);
    poser(COURANT);

    ABONNES.add(poser);
    /* Deux onglets ouverts restent d'accord entre eux. */
    const sync = (e: StorageEvent) => {
      if (e.key !== CLE) return;
      const t: Theme = e.newValue === "clair" ? "clair" : "nuit";
      appliquer(t);
      diffuse(t);
    };
    window.addEventListener("storage", sync);
    return () => {
      ABONNES.delete(poser);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const change = (t: Theme) => {
    appliquer(t);
    diffuse(t);
    try {
      window.localStorage.setItem(CLE, t);
    } catch {
      /* Navigation privée : le choix ne survit pas à la page, tant pis. */
    }
  };

  return [theme, change];
}

function appliquer(t: Theme) {
  const r = document.documentElement;
  if (t === "clair") r.dataset.concept = "clair";
  else delete r.dataset.concept;
}

/** Le bouton : un soleil, une lune, et l'état annoncé pour qui n'y voit pas. */
export function BoutonTheme({ className }: { className?: string }) {
  const [theme, change] = useTheme();
  const clair = theme === "clair";

  return (
    <button
      type="button"
      className={className}
      onClick={() => change(clair ? "nuit" : "clair")}
      aria-pressed={clair}
      title={clair ? "Passer en thème sombre" : "Passer en thème clair"}
    >
      <span className="sr-only">{clair ? "Passer en thème sombre" : "Passer en thème clair"}</span>
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        {clair ? (
          /* La lune : ce vers quoi le clic emmène. */
          <path
            d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        ) : (
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4 17 7M7 17l-1.6 1.6" />
          </g>
        )}
      </svg>
    </button>
  );
}
