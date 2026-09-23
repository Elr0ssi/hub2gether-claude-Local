"use client";

import { useMemo } from "react";
import { Enseigne } from "./pieces";
import { Odometre } from "./Roulement";
import { useMonnaie } from "./Monnaie";
import { convertir, fiche } from "@/data/finance/tauxChange";
import { CADENCES_EXEMPLE, POPULATION_PAR_AN } from "@/data/concept/tempsReel";
import type { FichePays } from "@/data/concept/conceptGeo";

/* ═══════════════════════════════════════════════════════════════════════════
   DONNÉES TEMPS RÉELLES

   Aucun de ces compteurs ne mesure quoi que ce soit à la seconde : ils
   étalent une grandeur annuelle sur l'année en cours. Le bandeau le dit en
   toutes lettres, une fois, sous la rangée — et chaque compteur porte sa
   provenance.

   Deux d'entre eux viennent du socle : le produit intérieur brut, qui est un
   flux et se cumule donc depuis le 1er janvier, et la population, qui est un
   stock et part de la somme publiée. Les deux autres attendent leur source ;
   ils portent une pastille qui le dit.
   ═══════════════════════════════════════════════════════════════════════════ */

const AN = 365.2425 * 24 * 3600;

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

  const pib = useMemo(() => somme(donnees, "pib"), [donnees]);
  const pop = useMemo(() => somme(donnees, "population"), [donnees]);

  /* Un montant de l'année N se convertit au taux de l'année N : c'est la même
     règle que sur la page économie, et c'est pour cela que la conversion
     passe par le millésime du socle. */
  const pibMonnaie = convertir(pib.total, annee, monnaie);

  /* La population du socle est en millions ; le compteur, lui, compte des
     personnes — c'est la seule unité où le dernier rouleau tourne à une
     vitesse qui se regarde. */
  const popPersonnes = pop.total * 1e6;

  return (
    <section className="cg-section" id="temps-reel">
      <div className="cg-wrap">
        <Enseigne>Données temps réelles</Enseigne>
        <h2 className="cg-h2">
          Ce qui a bougé depuis le 1<sup>er</sup> janvier
        </h2>

        <div className="cg-tr-l">
          <article className="cg-tr-c">
            <span className="cg-tr-lab">Produit intérieur brut mondial</span>
            {pibMonnaie === null ? (
              <span className="cg-tr-v cg-tr-vide">non convertible avant {f.depuis}</span>
            ) : (
              <Odometre
                className="cg-tr-v"
                valeur={0}
                parSeconde={pibMonnaie / AN}
                depuis={depart}
                dec={3}
                unite={` ${f.suffixe}`}
              />
            )}
            <span className="cg-tr-n">
              Au rythme de {annee}, somme des {pib.pays} pays du socle.
            </span>
          </article>

          {CADENCES_EXEMPLE.map((c) => (
            <article className="cg-tr-c" key={c.id}>
              <span className="cg-tr-lab">{c.label}</span>
              <Odometre
                className="cg-tr-v"
                valeur={0}
                parSeconde={c.parAn / AN}
                depuis={depart}
                dec={c.dec}
                unite={c.unite}
              />
              <span className="cg-tr-n">{c.note}</span>
              <span className="cg-tr-ex">{c.exemple}</span>
            </article>
          ))}

          <article className="cg-tr-c">
            <span className="cg-tr-lab">Population couverte</span>
            <Odometre
              className="cg-tr-v"
              valeur={popPersonnes}
              parSeconde={POPULATION_PAR_AN / AN}
              depuis={depart}
              dec={0}
              unite=""
            />
            <span className="cg-tr-n">
              Départ : les {pop.pays} pays dont le socle publie la population en {annee}. Ce
              n&apos;est pas la population mondiale.
            </span>
            <span className="cg-tr-ex">Accroissement d&apos;exemple, en attente de la source.</span>
          </article>
        </div>

        <p className="cg-tr-p">
          Ces compteurs ne relèvent rien à la seconde : ils étalent sur l&apos;année une
          grandeur annuelle. Ils disent un ordre de grandeur et un rythme, pas une mesure.
          Les lignes marquées « exemple » portent des cadences posées pour la mise en page,
          le temps que la source soit branchée.
        </p>
      </div>
    </section>
  );
}
