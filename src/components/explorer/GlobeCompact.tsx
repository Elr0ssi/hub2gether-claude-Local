"use client";

import dynamic from "next/dynamic";
import { forwardRef, useCallback, useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { Coloration, GlobeExplorerHandle, VueGlobe } from "./GlobeExplorer";
import type { Repere } from "@/data/explorer/couches";
import "./explorer.css";
import "./globe-compact.css";

/* ═══════════════════════════════════════════════════════════════════════════
   LE GLOBE COMPACT : UNE SEULE SCÈNE POUR CONFLITS ET RESSOURCES

   Le même cadre, les mêmes boutons de zoom, la même infobulle, et jamais de rotation seule : le globe ne bouge que sous la main ou quand
   la page le cadre. L'infobulle vit ici et non dans la page : un survol ne redessine plus toute la page.
   ═══════════════════════════════════════════════════════════════════════════ */

const GlobeExplorer = dynamic(() => import("./GlobeExplorer").then((m) => m.GlobeExplorer), {
  ssr: false,
  loading: () => <div className="xp-attente" aria-hidden="true"><span /></div>,
});

const AUCUN_REPERE: Repere[] = [];
const AUCUNE_RIVIERE: never[] = [];
const AUCUN_ENSEMBLE = new Set<never>();
const AUCUN_ARC: [string, string][] = [];
const AUCUNE_CARTE: string[] = [];
const RIEN = () => {};

export interface InfoBulle {
  titre: string;
  ligne: string;
}

interface Props {
  geo: GeoJSON.FeatureCollection | null;
  nuit: boolean;
  colorations: Coloration[];
  contours: string[];
  vue: VueGlobe | null;
  onPays: (nom: string | null) => void;
  /** Le texte de l'infobulle pour un pays (nom Natural Earth), ou null pour ne rien montrer. */
  infoBulle?: (nom: string) => InfoBulle | null;
  reperes?: Repere[];
  arcsLL?: [number, number, number, number][];
  survol?: string | null;
  choisi?: string | null;
  cartes?: string[];
  onSurvol?: (id: string | null) => void;
  onChoix?: (id: string) => void;
  /** Pendant un repère survolé, l'infobulle de pays se tait. */
  repereSurvole?: boolean;
  className?: string;
  /** Attributs de la scène (data-intro, onPointerDown…). */
  sceneProps?: React.HTMLAttributes<HTMLDivElement> & { "data-intro"?: string };
  children?: React.ReactNode;
}

export const GlobeCompact = forwardRef<GlobeExplorerHandle, Props>(function GlobeCompact(p, ref) {
  const [info, setInfo] = useState<{ nom: string; x: number; y: number } | null>(null);
  const [large, setLarge] = useState(0);
  const mesure = useCallback((el: HTMLDivElement | null) => { if (el) setLarge(el.clientWidth); }, []);
  const bulle = info && !p.repereSurvole ? p.infoBulle?.(info.nom) ?? null : null;
  const zoomer = (f: number) => (ref as React.RefObject<GlobeExplorerHandle | null>)?.current?.zoomer(f);

  return (
    <div className={`ge-scene gc-scene ${p.className ?? ""}`} ref={mesure} {...p.sceneProps}>
      {p.geo ? (
        <GlobeExplorer
          ref={ref}
          compact
          rotation={false}
          geo={p.geo}
          nuit={p.nuit}
          reperes={p.reperes ?? AUCUN_REPERE}
          rivieres={AUCUNE_RIVIERE}
          rivieresVives={AUCUN_ENSEMBLE}
          pays={null}
          survol={p.survol ?? null}
          choisi={p.choisi ?? null}
          cartes={p.cartes ?? AUCUNE_CARTE}
          monde={false}
          arcs={AUCUN_ARC}
          arcsLL={p.arcsLL}
          relief3D={false}
          colorations={p.colorations}
          contours={p.contours}
          vue={p.vue}
          onSurvol={p.onSurvol ?? RIEN}
          onChoix={p.onChoix ?? RIEN}
          onPays={p.onPays}
          onPaysSurvol={setInfo}
        />
      ) : (
        <div className="xp-attente" aria-hidden="true"><span /></div>
      )}
      <div className="gc-zoom">
        <button type="button" aria-label="Zoomer" onClick={() => zoomer(0.78)}><Plus size={16} aria-hidden="true" /></button>
        <button type="button" aria-label="Dézoomer" onClick={() => zoomer(1.28)}><Minus size={16} aria-hidden="true" /></button>
      </div>
      {info && bulle && (
        <div className={`gc-tip${info.x > large - 190 ? " gc-tip-g" : ""}`} style={{ left: info.x, top: info.y }} aria-hidden="true">
          <b>{bulle.titre}</b>
          <span>{bulle.ligne}</span>
        </div>
      )}
      {p.children}
    </div>
  );
});
