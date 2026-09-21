"use client";

import { useMemo } from "react";
import type { Compteur } from "@/data/concept/conceptEconomie";
import { Odometre } from "./Roulement";

/* ═══════════════════════════════════════════════════════════════════════════
   LES COMPTEURS

   Ils avancent en continu, mais ils ne mesurent rien en direct : ils étalent
   une grandeur annuelle du socle sur l'année en cours. Ce qui défile, c'est
   « au rythme de l'an dernier, voilà ce qui s'est produit depuis le 1er
   janvier ». La section le dit — un compteur qui court sans le préciser
   laisse croire à un flux temps réel qui n'existe pas.

   Une rangée, une colonne par compteur : cinq grandeurs empilées se lisaient
   comme une liste, alors que ce qu'on veut, c'est les voir courir ensemble.
   ═══════════════════════════════════════════════════════════════════════════ */

const AN = 365.2425 * 24 * 3600;

export function CompteursEco({ compteurs, annee }: { compteurs: Compteur[]; annee: number }) {
  /* L'origine et les vitesses sont fixées une fois : l'odomètre lit l'heure
     lui-même à chaque image, ce composant ne se rend qu'une fois. */
  const depart = useMemo(() => {
    const t = new Date(new Date().getFullYear(), 0, 1).getTime();
    /* L'odomètre compte en millisecondes de performance.now(), pas en heure
       murale : on ramène le 1er janvier dans ce repère. */
    return performance.now() - (Date.now() - t);
  }, []);

  if (!compteurs.length) return null;

  return (
    <div className="cg-cpt-l">
      {compteurs.map((c) => {
        const parSeconde = (c.parAn * 1e9) / AN;
        return (
          <div key={c.id} className="cg-cpt">
            <span className="cg-cpt-l2">{c.label}</span>
            <Odometre
              className="cg-cpt-v"
              valeur={0}
              parSeconde={parSeconde}
              depuis={depart}
              unite="&nbsp;€"
            />
            <span className="cg-cpt-n">{c.note}</span>
          </div>
        );
      })}
      <p className="cg-cpt-p">
        En euros, depuis le 1<sup>er</sup> janvier. Ces compteurs ne mesurent pas en direct : ils
        étalent sur l&apos;année une grandeur annuelle du millésime {annee}. Ils disent un ordre de
        grandeur et un rythme, pas un relevé à la seconde.
      </p>
    </div>
  );
}
