"use client";

import { useEffect, useState } from "react";
import type { Compteur } from "@/data/concept/conceptEconomie";
import { Enseigne } from "./pieces";
import { Roulement } from "./Roulement";

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
  /* La valeur passe par l'état plutôt que d'être écrite dans le DOM : c'est
     le roulement qui doit la recevoir, et il a besoin d'être rendu. */
  const [valeurs, setValeurs] = useState<string[]>(() => compteurs.map(() => ""));

  useEffect(() => {
    const doux = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t0 = debutAnnee();
    const fmt = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });
    let brut = 0;

    const peint = () => {
      const part = (Date.now() - t0) / AN;
      /* Le montant entier, en euros, pas un arrondi en milliards : c'est en
         voyant tourner les unités qu'on comprend la vitesse à laquelle ces
         grandeurs courent. */
      setValeurs(compteurs.map((c) => fmt.format(Math.round(c.parAn * 1e9 * part))));
      /* Une mise à jour par seconde. Plus souvent, le roulement n'a jamais le
         temps de se poser et le nombre reste illisible ; moins souvent, on ne
         voit plus qu'il court. */
      if (!doux) brut = window.setTimeout(peint, 1000);
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
              <span className="cg-cpt-t">
                <span className="cg-cpt-l2">{c.label}</span>
                <span className="cg-cpt-n">{c.note}</span>
              </span>
              <Roulement texte={valeurs[i] ?? ""} className="cg-cpt-v" />
            </div>
          ))}
        </div>
        <p className="cg-frise-n">
          En euros, depuis le 1<sup>er</sup> janvier. Ces compteurs ne mesurent pas en direct : ils
          étalent sur l&apos;année une grandeur annuelle du millésime {annee}. Ils disent un ordre de
          grandeur et un rythme, pas un relevé à la seconde.
        </p>
      </div>
    </section>
  );
}
