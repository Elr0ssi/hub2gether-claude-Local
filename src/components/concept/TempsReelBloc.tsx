"use client";

import { useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import { Odometre } from "./Roulement";
import { Lettres } from "./Lettres";
import { useVu } from "./ouverture";
import "./concept.css";
import "./v2eco.css";

/* ═══════════════════════════════════════════════════════════════════════════
   « DONNÉES EN TEMPS RÉEL » : le même bloc que sur Économie et Démographie

   Chaque compteur étale une grandeur annuelle publiée sur l'année en cours :
   il ne mesure rien à la seconde. La source et la nature du chiffre sont
   dites sous les cartes, pas laissées à deviner.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface CompteurTR {
  id: string;
  label: string;
  /** La valeur au point de départ (zéro pour un cumul, le stock restant pour une réserve). */
  base: number;
  /** Ce qui s'ajoute (ou se retranche, si négatif) chaque seconde. */
  parSeconde: number;
  /** L'instant d'origine du cumul, en millisecondes (UTC). */
  depuisMs: number;
  dec: number;
  unite: string;
  mot: string;
  icone: LucideIcon;
  /** Ce que mesure le compteur, en une ligne. */
  note?: string;
}

export function TempsReelBloc({
  id, titre = "Données en temps réel", sous, compteurs, sources,
}: {
  id: string;
  titre?: string;
  sous: React.ReactNode;
  compteurs: CompteurTR[];
  sources: React.ReactNode;
}) {
  const vue = useVu(140);
  const departs = useMemo(() => compteurs.map((c) => performance.now() - (Date.now() - c.depuisMs)), [compteurs]);

  return (
    <section ref={vue.ref as React.RefObject<HTMLElement>} className="cg-section cg-tr" id={id} data-vu={vue.vu ? "1" : "0"}>
      <div className="cg-wrap">
        <header className="v2-tete">
          <h2 className="v2-h2">{titre}</h2>
          <p className="v2-sous">{sous}</p>
        </header>

        <div className="cg-cpt-l" style={{ gridTemplateColumns: `repeat(${compteurs.length}, minmax(0, 1fr))`, maxWidth: compteurs.length === 1 ? 460 : undefined }}>
          {compteurs.map((c, k) => {
            const Icone = c.icone;
            return (
              <div key={c.id} className={`cg-cpt v2-cpt v2-cpt-${c.id}`} style={{ "--i": k } as React.CSSProperties}>
                <span className="v2-cpt-i" aria-hidden="true"><Icone size={18} /></span>
                <span className="cg-cpt-l2">{c.label}</span>
                <Odometre className="cg-cpt-v" valeur={c.base} parSeconde={c.parSeconde} depuis={departs[k]} dec={c.dec} unite={c.unite} />
                <Lettres className="cg-cpt-n" base={c.base} parSeconde={c.parSeconde} depuis={departs[k]} mot={c.mot} />
                {c.note && <span className="cg-cpt-note">{c.note}</span>}
              </div>
            );
          })}
        </div>
        <p className="cg-tr-src">{sources}</p>
      </div>
    </section>
  );
}
