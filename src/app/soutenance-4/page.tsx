import type { Metadata } from "next";
import { DeckShell, type DeckConfig } from "@/components/soutenance2/DeckShell";
import { ANNEX_VIEWS } from "@/components/soutenance2/annexes";
import { S2_ANNEXES } from "@/data/soutenance2/soutenance2Data";
import { S4_VIEWS } from "@/components/soutenance4/slides";
import "@/components/soutenance4/soutenance4.css";
import {
  S4_ACTS,
  S4_ACT_LABELS,
  S4_SLIDES,
  S4_TOTAL_SECONDS,
} from "@/data/soutenance4/soutenance4Data";

export const metadata: Metadata = {
  title: "Soutenance 4 · The Essential Data",
  description:
    "Soutenance de business plan · version 4 : huit actes, du problème au passage à l'échelle.",
  // Un deck n'est pas une page sur laquelle on doit arriver depuis une recherche.
  robots: { index: false, follow: false },
};

/**
 * La V4 reprend la V3 dans un ordre qui tient debout : sept actes,
 * une seule direction, jamais de retour en arrière. Elle partage la coquille,
 * les primitives et la moitié de ses slides avec la V2 — qui continue de se
 * jouer exactement comme avant, sur `/soutenance-2`.
 *
 * Les annexes sont celles de la V2 : elles n'appartiennent pas au récit, elles
 * répondent aux questions du jury, et ces questions n'ont pas changé.
 */
const DECK_S3: DeckConfig = {
  name: "Soutenance 4",
  slides: S4_SLIDES,
  views: S4_VIEWS,
  acts: [...S4_ACTS],
  actLabels: S4_ACT_LABELS,
  annexes: S2_ANNEXES,
  annexViews: ANNEX_VIEWS,
  totalSeconds: S4_TOTAL_SECONDS,
  className: "ted-deck-v4",
  // Le globe de la slide 5 se manipule au curseur : le clic ne doit pas
  // faire défiler. Flèches et barre d'espace restent la navigation.
  advanceOnClick: false,
};

interface PageProps {
  searchParams: Promise<{ slide?: string; presenter?: string }>;
}

/**
 * /soutenance-4
 *
 * Paramètres d'URL
 *   ?slide=10        aller directement à une slide (numérotée à partir de 1) ;
 *                    tenu à jour pendant la navigation, donc un rechargement
 *                    revient au même endroit
 *   ?presenter=true  rail présentateur : minuteur, notes, slide suivante, annexes
 *
 * Clavier : → / Espace suivant · ← précédent · Début / Fin · F plein écran ·
 *           O sommaire · A annexes · Échap fermer
 */
export default async function Soutenance3Page({ searchParams }: PageProps) {
  const params = await searchParams;

  const parsed = Number.parseInt(params.slide ?? "", 10);
  const initialSlide = Number.isFinite(parsed) ? parsed : undefined;
  const presenter = params.presenter === "true" || params.presenter === "1";

  return <DeckShell initialSlide={initialSlide} presenter={presenter} config={DECK_S3} />;
}
