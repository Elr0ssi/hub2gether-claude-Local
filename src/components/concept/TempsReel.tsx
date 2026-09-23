"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Enseigne } from "./pieces";
import { Odometre } from "./Roulement";
import { useMonnaie } from "./Monnaie";
import { convertir, fiche } from "@/data/finance/tauxChange";
import { CADENCES_EXEMPLE, POPULATION_PAR_AN } from "@/data/concept/tempsReel";
import type { FichePays } from "@/data/concept/conceptGeo";

/* ═══════════════════════════════════════════════════════════════════════════
   DONNÉES TEMPS RÉELLES

   Le bandeau défile : les compteurs passent, on n'en lit pas dix d'un coup.
   Chaque vignette ne montre que son intitulé et son nombre — le détail, la
   provenance et la mention d'exemple n'apparaissent qu'au clic, dans le
   bandeau de dessous. Une rangée qui porterait tout en même temps se lirait
   comme un tableau, et ce n'est pas ce qu'on veut voir courir.

   Aucun de ces compteurs ne mesure quoi que ce soit à la seconde : ils
   étalent une grandeur annuelle sur l'année en cours.

   Deux d'entre eux viennent du socle : le produit intérieur brut, qui est un
   flux et se cumule depuis le 1er janvier, et la population, qui est un stock
   et part de la somme publiée. Les autres attendent leur source ; ils le
   disent dès qu'on les ouvre.

   Le défilement est écrit dans le DOM par une boucle plutôt que par une
   animation CSS : sans cela, on ne peut ni l'attraper pour le faire glisser,
   ni l'arrêter net quand on vise une vignette.
   ═══════════════════════════════════════════════════════════════════════════ */

const AN = 365.2425 * 24 * 3600;
const COPIES = 2;

interface Vignette {
  id: string;
  label: string;
  /** La valeur au 1er janvier : zéro pour un cumul, le stock pour la population. */
  base: number;
  parSeconde: number;
  dec: number;
  unite: string;
  note: string;
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
  const [ouvert, setOuvert] = useState<string | null>(null);

  /* L'origine est fixée une fois : l'odomètre lit l'heure lui-même à chaque
     image, ce composant ne se rend qu'au clic ou au changement de monnaie. */
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
        unite: ` ${f.suffixe}`,
        note: `Produit depuis le 1er janvier, au rythme de ${annee}. Somme des ${pib.pays} pays du socle, convertie au taux de ${annee}.`,
      });
    }
    l.push({
      id: "population",
      label: "Population couverte",
      /* Le socle compte en millions ; le compteur compte des personnes, seule
         unité où le dernier rouleau tourne à une vitesse qui se regarde. */
      base: pop.total * 1e6,
      parSeconde: POPULATION_PAR_AN / AN,
      dec: 0,
      unite: "",
      note: `Départ : les ${pop.pays} pays dont le socle publie la population en ${annee}. Ce n'est pas la population mondiale.`,
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
        note: c.note,
        exemple: c.exemple,
      });
    }
    return l;
  }, [donnees, annee, monnaie, f.suffixe]);

  /* ── Le défilement ───────────────────────────────────────────────────── */

  const piste = useRef<HTMLDivElement>(null);
  const pos = useRef(0);
  const prise = useRef<{ x: number; pos: number; bouge: boolean } | null>(null);
  const arret = useRef(false);
  arret.current = ouvert !== null;

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
      if (!prise.current && !arret.current && !doux) pos.current += (dt / 1000) * 34;
      pos.current = ((pos.current % pas) + pas) % pas;
      el.style.transform = `translate3d(${-pos.current}px, 0, 0)`;
      brut = requestAnimationFrame(boucle);
    };
    brut = requestAnimationFrame(boucle);
    return () => cancelAnimationFrame(brut);
  }, []);

  const detail = ouvert ? vignettes.find((v) => v.id === ouvert) : null;

  return (
    <section className="cg-section cg-direct" id="temps-reel">
      <div className="cg-wrap">
        <Enseigne droite={<span className="cg-demo-mini">Depuis le 1<sup>er</sup> janvier</span>}>
          <span className="cg-point-vif" aria-hidden="true" /> Données temps réelles
        </Enseigne>
      </div>

      <div
        className="cg-fil"
        onPointerDown={(e) => {
          prise.current = { x: e.clientX, pos: pos.current, bouge: false };
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!prise.current) return;
          const d = e.clientX - prise.current.x;
          /* Au-delà de quatre pixels, c'est un glissement : le clic qui suit
             ne doit pas ouvrir la vignette qu'on vient de traîner. */
          if (Math.abs(d) > 4) prise.current.bouge = true;
          pos.current = prise.current.pos - d;
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
              <button
                type="button"
                key={`${v.id}-${c}`}
                className={`cg-tr-i${ouvert === v.id ? " cg-tr-i-on" : ""}`}
                aria-expanded={ouvert === v.id}
                onClick={() => {
                  if (prise.current?.bouge) return;
                  setOuvert((o) => (o === v.id ? null : v.id));
                }}
              >
                <span className="cg-tr-lab">{v.label}</span>
                <Odometre
                  className="cg-tr-v"
                  valeur={v.base}
                  parSeconde={v.parSeconde}
                  depuis={depart}
                  dec={v.dec}
                  unite={v.unite}
                />
              </button>
            )),
          )}
        </div>
      </div>

      <div className="cg-wrap">
        <div className={`cg-tr-d${detail ? " cg-tr-d-on" : ""}`} aria-live="polite">
          {detail ? (
            <>
              <strong>{detail.label}</strong>
              <span>{detail.note}</span>
              {detail.exemple ? <span className="cg-tr-ex">{detail.exemple}</span> : null}
            </>
          ) : (
            <span className="cg-tr-d-v">
              Touchez un compteur pour savoir d&apos;où il vient. Aucun ne relève à la seconde :
              ils étalent sur l&apos;année une grandeur annuelle, et certains attendent encore leur
              source.
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
