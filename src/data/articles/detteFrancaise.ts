import ratioFra from "@/../data/economie/dette/dette-sur-pib/FRA.json";
import pibFra from "@/../data/economie/pib/pib-total/FRA.json";

/* ═══════════════════════════════════════════════════════════════════════════
   LES DONNÉES DE L'ARTICLE « DETTE PUBLIQUE FRANÇAISE »

   Deux origines, et elles ne se mélangent pas.

   1. La base du dépôt, pour les séries qu'elle porte déjà : le ratio
      dette/PIB de la France et son PIB. Le texte les lit, il ne les recopie
      pas — une mise à jour de la base met la page à jour.

   2. Des chiffres de conjoncture qui n'ont pas encore de série dans la base :
      la dette trimestrielle de Maastricht, la détention par les
      non-résidents, les portefeuilles de l'Eurosystème, la comparaison
      européenne. Chacun porte sa valeur, son unité, sa période, son périmètre
      et sa source, et rien n'est affiché sans ces cinq éléments.

   CE QUI N'EST PAS ICI
     Aucune valeur n'est estimée, interpolée ni arrondie « pour faire joli ».
     Ce que la base ne publie pas reste absent, et la page le dit à l'endroit
     où le lecteur s'attendrait à le lire.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface Chiffre {
  /** La valeur, telle que la source la publie. */
  valeur: number;
  unite: "MD_EUR" | "PCT" | "ANNEES";
  /** La période exacte que la valeur recouvre. */
  periode: string;
  /** Ce que la valeur mesure, et ce qu'elle ne mesure pas. */
  perimetre: string;
  source: string;
  url: string;
}

/* ── 1. La dette de Maastricht, trimestre par trimestre ─────────────────── */

/* Ces deux points sont ceux que l'INSEE publie pour les deux derniers
   trimestres connus. Ils ne sont pas dans data/ : la base est indexée par
   année, et y ranger du trimestriel demanderait d'en changer la clé. Le
   rapport de l'article le signale comme le prochain jeu à intégrer. */
export const DETTE_TRIMESTRES: { periode: string; md: number; pctPib: number }[] = [
  { periode: "2025-T4", md: 3460.5, pctPib: 115.6 },
  { periode: "2026-T1", md: 3536.1, pctPib: 117.5 },
];

const dernier = DETTE_TRIMESTRES[DETTE_TRIMESTRES.length - 1];
const avant = DETTE_TRIMESTRES[DETTE_TRIMESTRES.length - 2];

export const detteDerniere: Chiffre = {
  valeur: dernier.md,
  unite: "MD_EUR",
  periode: "fin du 1er trimestre 2026",
  perimetre:
    "dette publique au sens de Maastricht, toutes administrations publiques, après consolidation",
  source: "INSEE · Dette trimestrielle de Maastricht",
  url: "https://www.insee.fr/fr/statistiques/serie/010565708",
};

export const ratioDernier: Chiffre = {
  valeur: dernier.pctPib,
  unite: "PCT",
  periode: "fin du 1er trimestre 2026",
  perimetre: "dette publique au sens de Maastricht rapportée au PIB",
  source: "INSEE · Dette trimestrielle de Maastricht",
  url: "https://www.insee.fr/fr/statistiques/serie/010565708",
};

/* La variation n'est pas saisie : elle se déduit des deux derniers
   trimestres. Ajouter un trimestre à la liste suffit donc à la corriger, et
   le texte autour ne peut pas devenir faux. */
export const variationTrimestre: Chiffre = {
  valeur: Math.round((dernier.md - avant.md) * 10) / 10,
  unite: "MD_EUR",
  periode: `entre ${avant.periode.replace("-T", ", trimestre ")} et ${dernier.periode.replace("-T", ", trimestre ")}`,
  perimetre: "variation du stock de dette de Maastricht sur un trimestre",
  source: "INSEE · Dette trimestrielle de Maastricht",
  url: "https://www.insee.fr/fr/statistiques/serie/010565708",
};

export const deficit2025: Chiffre = {
  valeur: 5.1,
  unite: "PCT",
  periode: "année 2025",
  perimetre: "besoin de financement des administrations publiques rapporté au PIB",
  source: "INSEE · Comptes nationaux annuels",
  url: "https://www.insee.fr/fr/statistiques/2830166",
};

/* ── 2. Les détenteurs ──────────────────────────────────────────────────── */

export const nonResidents: Chiffre = {
  valeur: 55.9,
  unite: "PCT",
  periode: "au 31 mars 2026",
  perimetre:
    "part des titres de dette de long terme émis par les administrations publiques françaises, et non de l'ensemble de la dette de Maastricht",
  source: "Banque de France · Émission et détention de titres français",
  url: "https://www.banque-france.fr/fr/statistiques/titres-et-credits/emissions-de-titres",
};

export const eurosysteme = {
  actuel: {
    valeur: 488,
    unite: "MD_EUR" as const,
    periode: "au 30 juin 2026",
    perimetre:
      "portefeuilles de titres publics détenus par la Banque de France au titre des programmes APP et PEPP, en coût amorti",
    source: "Banque de France · septembre 2026",
    url: "https://www.banque-france.fr/fr/publications-et-statistiques",
  },
  precedent: { valeur: 546, periode: "fin 2025" },
};

export const DETENTEURS: { nom: string; texte: string }[] = [
  { nom: "Non-résidents", texte: "Investisseurs situés hors de France." },
  { nom: "Banques", texte: "Elles peuvent détenir des obligations publiques dans leurs portefeuilles." },
  {
    nom: "Assureurs",
    texte:
      "Les obligations souveraines peuvent notamment correspondre à des besoins de placement de long terme.",
  },
  { nom: "Fonds", texte: "Différents fonds d'investissement détiennent également des titres publics." },
  {
    nom: "Banques centrales",
    texte:
      "Dans le cadre des programmes d'achats de l'Eurosystème, la Banque de France a accumulé un important portefeuille de titres publics.",
  },
];

/* ── 3. Les administrations qui portent la dette ────────────────────────── */

export const ADMINISTRATIONS: { nom: string; court: string; texte: string }[] = [
  {
    nom: "L'État",
    court: "État",
    texte:
      "C'est de très loin le principal contributeur. Il finance notamment le budget de l'État et refinance les titres arrivant à échéance.",
  },
  {
    nom: "Les organismes d'administration centrale",
    court: "Organismes centraux",
    texte:
      "Des organismes publics distincts de l'État mais classés dans les administrations publiques centrales.",
  },
  {
    nom: "Les administrations publiques locales",
    court: "Administrations locales",
    texte:
      "Elles regroupent notamment les collectivités territoriales et différents organismes locaux.",
  },
  {
    nom: "Les administrations de sécurité sociale",
    court: "Sécurité sociale",
    texte:
      "Elles regroupent les organismes relevant des assurances sociales et certains organismes dépendants.",
  },
];

/* ── 4. La comparaison européenne ───────────────────────────────────────── */

/* Une même période pour tout le monde : mêler le premier trimestre 2026
   français aux chiffres 2025 des autres pays donnerait une comparaison
   fausse. Les agrégats — zone euro, Union européenne — ne sont pas des pays
   et n'ont pas leur place dans data/countries ; ils restent ici. */
export const COMPARAISON: { nom: string; pct: number; france?: boolean; agregat?: boolean }[] = [
  { nom: "Grèce", pct: 146.1 },
  { nom: "Italie", pct: 137.1 },
  { nom: "France", pct: 115.6, france: true },
  { nom: "Belgique", pct: 107.9 },
  { nom: "Espagne", pct: 100.7 },
  { nom: "Zone euro", pct: 87.8, agregat: true },
  { nom: "Union européenne", pct: 81.7, agregat: true },
];

export const SOURCE_COMPARAISON = {
  source: "Eurostat · dette publique, 4e trimestre 2025",
  url: "https://ec.europa.eu/eurostat/databrowser/view/gov_10q_ggdebt/default/table",
  periode: "fin 2025",
};

/* ── 5. Ce que la base porte déjà ───────────────────────────────────────── */

export interface PointSerie {
  annee: number;
  pctPib: number | null;
}

/** Le ratio dette/PIB de la France, tel que la base le publie. */
export function serieRatio(): PointSerie[] {
  return Object.entries(ratioFra.data as Record<string, number>)
    .map(([a, v]) => ({ annee: Number(a), pctPib: v }))
    .sort((x, y) => x.annee - y.annee);
}

/** Le PIB de la France, en milliards d'euros, pour les mêmes dates. */
export function seriePib(): { annee: number; md: number }[] {
  return Object.entries(pibFra.data as Record<string, number>)
    .map(([a, v]) => ({ annee: Number(a), md: v / 1e9 }))
    .sort((x, y) => x.annee - y.annee);
}

/** Le montant, reconstitué depuis le ratio et le PIB de la même année. */
export function serieMontant(): { annee: number; md: number }[] {
  const pib = new Map(seriePib().map((p) => [p.annee, p.md]));
  return serieRatio()
    .filter((r) => r.pctPib !== null && pib.has(r.annee))
    .map((r) => ({ annee: r.annee, md: ((pib.get(r.annee) as number) * (r.pctPib as number)) / 100 }));
}

export const SOURCE_SERIE = {
  ratio: ratioFra.source as string,
  pib: pibFra.source as string,
};

/* ── 6. Les repères historiques ─────────────────────────────────────────── */

/* Trois repères, pas davantage, et sans leur attribuer la trajectoire : une
   crise se voit sur une courbe, elle ne l'explique pas à elle seule. */
export const REPERES: { annee: number; nom: string }[] = [
  { annee: 2008, nom: "Crise financière" },
  { annee: 2020, nom: "Covid-19" },
  { annee: 2022, nom: "Choc énergétique et inflation" },
];

/* ── 7. Ce que la page ne peut pas encore afficher ──────────────────────── */

/* La durée de vie moyenne de la dette négociable est annoncée comme un ordre
   de grandeur, parce que c'est ce qu'on sait : la valeur exacte et sa date se
   lisent chez l'Agence France Trésor, et tant qu'elles ne sont pas dans la
   base on ne les invente pas. */
export const dureeVieMoyenne = {
  ordre: "environ 8 ans",
  periode: "2026",
  perimetre: "durée de vie moyenne de la dette négociable de l'État",
  source: "Agence France Trésor",
  url: "https://www.aft.gouv.fr/fr/dette-chiffres-cles",
  reserve:
    "Ordre de grandeur. La valeur exacte et sa date de publication doivent être reprises du bulletin mensuel de l'Agence France Trésor.",
};

export const FAQ: { q: string; r: string }[] = [
  {
    q: "Quel est le montant de la dette publique française ?",
    r: `À la fin du premier trimestre 2026, la dette publique française au sens de Maastricht s'élève à ${detteDerniere.valeur.toLocaleString("fr-FR", { minimumFractionDigits: 1 })} milliards d'euros, soit ${ratioDernier.valeur.toLocaleString("fr-FR", { minimumFractionDigits: 1 })} % du PIB, selon l'INSEE.`,
  },
  {
    q: "Qui détient la dette française ?",
    r: `La dette française est détenue par de nombreux investisseurs français et étrangers. Au 31 mars 2026, les non-résidents détenaient ${nonResidents.valeur.toLocaleString("fr-FR", { minimumFractionDigits: 1 })} % des titres de dette de long terme émis par les administrations publiques françaises, selon la Banque de France. Ce périmètre ne correspond pas exactement à l'ensemble de la dette publique de Maastricht.`,
  },
  {
    q: "Pourquoi la France est-elle endettée ?",
    r: "La dette publique résulte notamment de l'accumulation des besoins de financement des administrations publiques au fil du temps. Lorsque les dépenses dépassent les recettes, le déficit contribue à créer un besoin de financement supplémentaire.",
  },
  {
    q: "Comment la France rembourse-t-elle sa dette ?",
    r: "Les titres de dette arrivent à échéance progressivement. L'État rembourse les titres arrivant à maturité et émet régulièrement de nouveaux titres pour financer ses besoins, notamment le déficit et le refinancement de dettes arrivant à échéance.",
  },
  {
    q: "Quelle est la différence entre la dette et le déficit ?",
    r: "Le déficit mesure, sur une période donnée, l'écart entre les recettes et les dépenses publiques. La dette correspond au stock d'engagements financiers restant à rembourser.",
  },
];
