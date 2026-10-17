import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import type { ArticleDette } from '../types';
import type { Suggestion } from '../cadre';
import { ArticleItalie } from './Article';
import { entreeItalie } from './catalogue';
import { DETTE, RATIO_2025, DEFICIT_2025, FAQ, SOURCES } from './donnees';
import { variablesMesurees } from '../cadre/ventilation';
import {
  DEPENSES_NATURE_LIGNES, DETAIL_NATURE, DETAIL_RECETTES, RECETTES_LIGNES,
} from './ventilations';

const URL = entreeItalie.url;
const PUBLIE = entreeItalie.publie;
const MODIFIE = entreeItalie.modifie;
const fmt = (v: number, d = 1) => v.toLocaleString('fr-FR', { minimumFractionDigits: d, maximumFractionDigits: d });
const PAGE = `${SITE_URL}${URL}`;
const SUGGESTIONS: Suggestion[] = [
  { href: '/pays/france/dette-publique', titre: 'La dette publique de la France', rubrique: 'Pays voisin' },
  { href: '/pays/espagne/dette-publique', titre: "La dette publique de l'Espagne", rubrique: 'Pays comparable' },
  { href: '/dette-publique', titre: 'Classement mondial des dettes publiques', rubrique: 'Classement' },
  { href: '/economie', titre: 'Explorer la carte économique mondiale', rubrique: 'Globe' },
];

const metadata: Metadata = {
  title: { absolute: "Dette publique italienne : montant, déficit et détenteurs | Visualize" },
  description: "Dette publique italienne : montant et dette/PIB, déficit, administrations centrales et locales, intérêts, créanciers, BTP et refinancement du Trésor. Sources officielles.",
  keywords: ['dette Italie', 'dette publique italienne', 'dette PIB Italie', 'BTP', 'Banca d’Italia dette', 'dette Maastricht Italie', 'obligations italiennes', 'recettes publiques Italie', 'dépenses publiques Italie', 'impôts Italie montant par impôt', 'déficit public Italie'],
  alternates: { canonical: URL },
  openGraph: {
    type: 'article', url: PAGE,
    title: 'Dette publique italienne : montant, évolution et fonctionnement',
    description: "Analyse sourcée de la dette de l'Italie : Maastricht, déficit, créanciers, intérêts et refinancement des BTP.",
    publishedTime: PUBLIE, modifiedTime: MODIFIE,
  },
  twitter: { card: 'summary_large_image', title: 'Dette publique italienne | Visualize', description: "Montant, dette/PIB, déficit, créanciers, intérêts et refinancement." },
};

const FIGURES: [string, string, string, string][] = [
  ['recettes-publiques', 'Recettes publiques italiennes par catégorie, 2025', 'ISTAT', '2025'],
  ['depenses-publiques', 'Dépenses publiques italiennes par nature, 2025', 'ISTAT', '2025'],
  ['qui-cree-le-deficit', 'Dépenses, recettes et déficit des administrations italiennes, 2025', 'ISTAT', '2025'],
  ['evolution-dette-pib', 'Dette publique italienne, fin 2022 à fin août 2026', "Banca d'Italia", '2022/2026-08'],
  ['stock-flux', 'Hausse de la dette et déficit public italiens, 2025', "Banca d'Italia / ISTAT", '2025'],
  ['dette-par-administration', 'Dette italienne par administration après consolidation, fin août 2026', "Banca d'Italia", '2026-08'],
  ['dette-par-instrument', 'Composition par instrument de la dette publique italienne, fin août 2026', "Banca d'Italia", '2026-08'],
  ['dette-par-echeance', 'Dette publique italienne par durée résiduelle, fin août 2026', "Banca d'Italia", '2026-08'],
  ['detenteurs-dette', 'Créanciers de la dette publique italienne, fin juillet 2026', "Banca d'Italia", '2026-07'],
  ['non-residents', 'Dette publique italienne détenue par des non-résidents, 2024 à 2026', "Banca d'Italia", '2024/2026-07'],
  ['banca-italia', "Dette publique italienne détenue par la Banca d'Italia", "Banca d'Italia", '2024/2026-08'],
  ['interets-dette', 'Charge des intérêts de la dette publique italienne', 'ISTAT', '2025'],
  ['emissions-nettes', "Émissions nettes de titres d'État italiens en 2026", 'Gazzetta Ufficiale', '2026'],
  ['dette-europe', 'Dette publique brute en Europe, fin 2025', 'Eurostat', '2025'],
  ['dette-locale', 'Dette des régions et des communes italiennes, fin août 2026', "Banca d'Italia", '2026-08'],
];

/* Chaque ligne des figures « recettes » et « dépenses » est une mesure du jeu de données :
   « Lohnsteuer », « taxe sur l'énergie », « protection sociale »… se retrouvent par leur nom. */
const MESURES: Record<string, object[]> = {
  'recettes-publiques': variablesMesurees(RECETTES_LIGNES, DETAIL_RECETTES, '2025'),
  'depenses-publiques': [
    ...variablesMesurees(DEPENSES_NATURE_LIGNES, DETAIL_NATURE, '2025'),
  ],
};

function donneesStructurees(): object[] {
  return [
    {
      '@context': 'https://schema.org', '@type': 'Article',
      headline: `Dette publique italienne : ${fmt(DETTE.valeur, 3)} milliards d'euros à la fin d'août 2026`,
      description: metadata.description, inLanguage: 'fr-FR',
      datePublished: PUBLIE, dateModified: MODIFIE,
      author: { '@type': 'Organization', name: 'Visualize' },
      publisher: { '@type': 'Organization', name: 'Visualize', url: SITE_URL },
      mainEntityOfPage: { '@type': 'WebPage', '@id': PAGE },
      about: { '@type': 'Thing', name: "Dette publique de l'Italie" },
      citation: Object.entries(SOURCES).map(([nom, url]) => ({ '@type': 'CreativeWork', name: nom, url })),
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Pays', item: `${SITE_URL}/pays` },
        { '@type': 'ListItem', position: 3, name: 'Italie', item: `${SITE_URL}/pays/italie` },
        { '@type': 'ListItem', position: 4, name: 'Dette publique', item: PAGE },
      ],
    },
    {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: FAQ.map(({ q, r }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: r } })),
    },
    ...FIGURES.map(([id, name, createur, periode]) => ({
      '@context': 'https://schema.org', '@type': 'Dataset', '@id': `${PAGE}#${id}`,
      name, url: `${PAGE}#${id}`, inLanguage: 'fr-FR',
      creator: { '@type': 'Organization', name: createur },
      temporalCoverage: periode, spatialCoverage: 'Italie',
      isAccessibleForFree: true,
      isPartOf: { '@type': 'Article', '@id': PAGE },
      ...(MESURES[id] ? { variableMeasured: MESURES[id] } : {}),
    })),
  ];
}

export const articleItalie: ArticleDette = {
  ...entreeItalie,
  metadata,
  donneesStructurees,
  resume: () =>
    `Selon la Banca d'Italia, à la fin d'août 2026 la dette publique brute italienne au sens de Maastricht est de ${fmt(DETTE.valeur, 3)} milliards d'euros (estimation provisoire) ; elle représentait ${fmt(RATIO_2025.valeur)} % du PIB à la fin de 2025. Selon l'ISTAT, le déficit public de l'année 2025 est de ${fmt(DEFICIT_2025.valeur)} milliards d'euros. Ces chiffres portent sur toutes les administrations publiques après consolidation.`,
  Composant: () => <ArticleItalie suggestions={SUGGESTIONS} />,
};