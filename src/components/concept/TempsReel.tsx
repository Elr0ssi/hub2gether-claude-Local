"use client";

import { useEffect, useMemo, useRef } from "react";
import { Odometre } from "./Roulement";
import { useMonnaie } from "./Monnaie";
import { convertir, fiche } from "@/data/finance/tauxChange";
import { CADENCES_EXEMPLE, POPULATION_PAR_AN } from "@/data/concept/tempsReel";
import type { FichePays } from "@/data/concept/conceptGeo";

/* ═══════════════════════════════════════════════════════════════════════════
   DONNÉES TEMPS RÉELLES

   Le bandeau défile : les compteurs passent, on n'en lit pas dix d'un coup.
   Chaque vignette porte son intitulé, son nombre, et le même montant écrit
   en toutes lettres — « 8,5 milliards d'habitants » — pour qu'il se lise
   d'un regard sans compter les chiffres.

   Aucun de ces compteurs ne mesure quoi que ce soit à la seconde : ils
   étalent une grandeur annuelle sur l'année en cours. Deux viennent du
   socle — le produit intérieur brut, qui est un flux et se cumule depuis le
   1er janvier, et la population, qui est un stock et part de la somme
   publiée. Les autres attendent leur source ; une pastille le dit.

   Le défilement est écrit dans le DOM par une boucle plutôt que par une
   animation CSS : sans cela, on ne peut pas l'attraper pour le faire
   glisser à la main.
   ═══════════════════════════════════════════════════════════════════════════ */

const AN = 365.2425 * 24 * 3600;
const COPIES = 2;

import { Lettres, MOT_MONNAIE } from "./Lettres";

interface Vignette {
  id: string;
  label: string;
  /** La valeur au 1er janvier : zéro pour un cumul, le stock pour la population. */
  base: number;
  parSeconde: number;
  dec: number;
  unite: string;
  /** Le mot au pluriel qui suit le montant écrit en toutes lettres. */
  mot: string;
  /** Multiplie `base` et `parSeconde` avant de les écrire en toutes lettres :
      le PIB s'affiche en milliards (l'odomètre), mais se dit en dollars
      bruts. Absent, le montant en lettres suit l'unité de l'odomètre. */
  echelleLettres?: number;
  exemple?: string;
}

function somme(donnees: Record<string, FichePays>, champ: "pib" | "population") {
  let total = 0;
  let pays = 0;
  for (const f of Object.values(donnees)) {
    const v = f[champ];
    if (typeof v === "number" && Number.isFinite(v)) {
      total += v;
      pays += 1;
    }
  }
  return { total, pays };
}

export function TempsReel({
  donnees,
  annee,
}: {
  donnees: Record<string, FichePays>;
  annee: number;
}) {
  const [monnaie] = useMonnaie();
  const f = fiche(monnaie);

  /* L'origine est fixée une fois : l'odomètre lit l'heure lui-même à chaque
     image, ce composant ne se rend qu'au changement de monnaie. */
  const depart = useMemo(() => {
    const t = new Date(new Date().getFullYear(), 0, 1).getTime();
    return performance.now() - (Date.now() - t);
  }, []);

  const vignettes = useMemo<Vignette[]>(() => {
    const pib = somme(donnees, "pib");
    const pop = somme(donnees, "population");
    /* Un montant de l'année N se convertit au taux de l'année N : même règle
       que sur la page économie. */
    const pibMonnaie = convertir(pib.total, annee, monnaie);

    const l: Vignette[] = [];
    if (pibMonnaie !== null) {
      l.push({
        id: "pib",
        label: "PIB mondial",
        base: 0,
        parSeconde: pibMonnaie / AN,
        dec: 3,
        unite: ` ${f.suffixe}`,
        mot: MOT_MONNAIE[monnaie] ?? "dollars",
        /* L'odomètre compte en « Md $ » ; le montant en lettres doit
           compter en dollars, mille fois... un milliard de fois plus. */
        echelleLettres: 1e9,
      });
    }
    l.push({
      id: "population",
      label: "Population",
      /* Le socle compte en millions ; le compteur compte des personnes, seule
         unité où le dernier rouleau tourne à une vitesse qui se regarde. */
      base: pop.total * 1e6,
      parSeconde: POPULATION_PAR_AN / AN,
      dec: 0,
      unite: "",
      mot: "habitants",
      exemple: "Accroissement d'exemple, en attente de la source.",
    });
    for (const c of CADENCES_EXEMPLE) {
      l.push({
        id: c.id,
        label: c.label,
        base: 0,
        parSeconde: c.parAn / AN,
        dec: c.dec,
        unite: c.unite,
        mot: c.mot,
        exemple: c.exemple,
      });
    }
    return l;
  }, [donnees, annee, monnaie, f.suffixe]);

  /* ── Le défilement ───────────────────────────────────────────────────── */

  const piste = useRef<HTMLDivElement>(null);
  const pos = useRef(0);
  const prise = useRef<{ x: number; pos: number } | null>(null);

  useEffect(() => {
    const el = piste.current;
    if (!el) return;
    const doux = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let brut = 0;
    let avant = performance.now();
    const boucle = (t: number) => {
      const dt = Math.min(64, t - avant);
      avant = t;
      /* La largeur d'un exemplaire : au-delà, le suivant a pris exactement sa
         place et l'on reboucle sans saut visible. */
      const pas = el.scrollWidth / COPIES || 1;
      if (!prise.current && !doux) pos.current += (dt / 1000) * 30;
      pos.current = ((pos.current % pas) + pas) % pas;
      el.style.transform = `translate3d(${-pos.current}px, 0, 0)`;
      brut = requestAnimationFrame(boucle);
    };
    brut = requestAnimationFrame(boucle);
    return () => cancelAnimationFrame(brut);
  }, []);

  return (
    <section className="cg-section cg-direct" id="temps-reel">
      <div className="cg-wrap">
        <h2 className="cg-h2 cg-tr-titre">Données en temps réel</h2>
      </div>

      <div
        className="cg-fil"
        onPointerDown={(e) => {
          prise.current = { x: e.clientX, pos: pos.current };
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!prise.current) return;
          pos.current = prise.current.pos - (e.clientX - prise.current.x);
        }}
        onPointerUp={() => {
          prise.current = null;
        }}
        onPointerCancel={() => {
          prise.current = null;
        }}
      >
        <div ref={piste} className="cg-tr-piste">
          {Array.from({ length: COPIES }, (_, c) =>
            vignettes.map((v) => (
              <div className="cg-tr-i" key={`${v.id}-${c}`}>
                <span className="cg-tr-lab">
                  {v.label}
                  {v.exemple ? <span className="cg-tr-ex">exemple</span> : null}
                </span>
                <Odometre
                  className="cg-tr-v"
                  valeur={v.base}
                  parSeconde={v.parSeconde}
                  depuis={depart}
                  dec={v.dec}
                  unite={v.unite}
                />
                <Lettres
                  base={v.base * (v.echelleLettres ?? 1)}
                  parSeconde={v.parSeconde * (v.echelleLettres ?? 1)}
                  depuis={depart}
                  mot={v.mot}
                />
              </div>
            )),
          )}
        </div>
      </div>
    </section>
  );
}
