"use client";

import { useEffect, useRef } from "react";
import type { Compteur } from "@/data/concept/conceptEconomie";
import { Enseigne } from "./pieces";

/* ═══════════════════════════════════════════════════════════════════════════
   LES COMPTEURS

   Ils avancent, mais ils ne mesurent rien en direct : ils étalent une
   grandeur annuelle du socle sur l'année en cours. Ce qui s'affiche, c'est
   « au rythme de l'an dernier, voilà ce qui s'est produit depuis le 1er
   janvier ». La section le dit — un compteur qui court sans le préciser
   laisse croire à un flux temps réel qui n'existe pas.
   ═══════════════════════════════════════════════════════════════════════════ */

const AN = 365.2425 * 24 * 3600 * 1000;

function debutAnnee() {
  return new Date(new Date().getFullYear(), 0, 1).getTime();
}

export function CompteursEco({ compteurs, annee }: { compteurs: Compteur[]; annee: number }) {
  const cases = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const doux = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t0 = debutAnnee();
    let brut = 0;
    const fmt = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

    const peint = () => {
      const part = (Date.now() - t0) / AN;
      compteurs.forEach((c, i) => {
        const el = cases.current[i];
        if (!el) return;
        const v = c.parAn * part;
        el.textContent =
          v >= 1000 ? `${fmt.format(Math.round(v / 1000))} T€` : `${fmt.format(Math.round(v))} Md€`;
      });
      /* Deux images par seconde : au-delà, les derniers chiffres clignotent
         sans qu'on puisse les lire, et la page paie une boucle pour rien. */
      if (!doux) brut = window.setTimeout(() => requestAnimationFrame(peint), 500);
    };
    peint();
    return () => clearTimeout(brut);
  }, [compteurs]);

  if (!compteurs.length) return null;

  return (
    <section className="cg-section cg-cpt-s">
      <div className="cg-wrap">
        <Enseigne droite={<span className="cg-demo-mini">au rythme {annee}</span>}>
          Depuis le 1<sup>er</sup> janvier
        </Enseigne>
        <div className="cg-cpt-l">
          {compteurs.map((c, i) => (
            <div key={c.id} className="cg-cpt">
              <span className="cg-cpt-l2">{c.label}</span>
              <span
                className="cg-cpt-v"
                ref={(el) => {
                  cases.current[i] = el;
                }}
              >
                —
              </span>
              <span className="cg-cpt-n">{c.note}</span>
            </div>
          ))}
        </div>
        <p className="cg-frise-n">
          Ces compteurs ne mesurent pas en direct : ils étalent sur l&apos;année une grandeur
          annuelle du millésime {annee}. Ils disent un ordre de grandeur et un rythme, pas un relevé
          à la seconde.
        </p>
      </div>
    </section>
  );
}
