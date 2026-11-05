import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import type { ArticleDette } from '../types';
import type { Suggestion } from '../cadre';
import { ArticleEspagne } from './Article';
import { entreeEspagne } from './catalogue';
import { DETTE, RATIO, DEFICIT_2025, FAQ, SOURCES } from './donnees';
import { variablesMesurees } from '../cadre/ventilation';
import {
  DEPENSES_NATURE_LIGNES, DETAIL_NATURE, DETAIL_RECETTES, RECETTES_LIGNES,
} from './ventilations';

const URL = entreeEspagne.url;
const PUBLIE = entreeEspagne.publie;
const MODIFIE = entreeEspagne.modifie;
const fmt = (v: number, d = 1) => v.toLocaleString('fr-FR', { minimumFractionDigits: d, maximumFractionDigits: d });
const PAGE = `${SITE_URL}${URL}`;
const SUGGESTIONS: Suggestion[] = [
  { href: '/pays/france/dette-publique', titre: 'La dette publique de la France', rubrique: 'Pays voisin' },
  { href: '/dette-publique', titre: 'Classement mondial des dettes publiques', rubrique: 'Classement' },
  { href: '/economie', titre: 'Explorer la carte économique mondiale', rubrique: 'Globe' },
];

const metadata: Metadata = {
  title: { absolute: "Dette publique espagnole : montant, déficit et détenteurs | Visualize" },
  description: "Dette publique espagnole : montant et dette/PIB, déficit, État et communautés autonomes, intérêts, créanciers, BCE, refinancement du Tesoro et notations. Sources officielles.",
  keywords: ['dette Espagne', 'dette publique espagnole', 'dette PIB Espagne', 'dette communautés autonomes', 'Tesoro Público', 'notation Espagne', 'obligations espagnoles', 'recettes publiques Espagne', 'dépenses publiques Espagne', 'impôts Espagne montant par impôt', 'déficit public Espagne'],
  alternates: { canonical: URL },
  openGraph: {
    type: 'article', url: PAGE,
    title: 'Dette publique espagnole : montant, évolution et fonctionnement',
    description: "Analyse sourcée de la dette de l'Espagne : Maastricht, déficit, créanciers, intérêts, notations et refinancement.",
    publishedTime: PUBLIE, modifiedTime: MODIFIE,
  },
  twitter: { card: 'summary_large_image', title: 'Dette publique espagnole | Visualize', description: "Montant, dette/PIB, déficit, créanciers, intérêts et refinancement." },
};

const FIGURES: [string, string, string, string][] = [
  ['recettes-publiques', 'Recettes publiques espagnoles par catégorie et par impôt, 2025', 'INE / Agencia Tributaria', '2025'],
  ['depenses-publiques', 'Dépenses publiques espagnoles par nature, 2025', 'INE', '2025'],
  ['qui-cree-le-deficit', 'Dépenses, recettes et déficit des administrations espagnoles, 2025', 'INE', '2025'],
  ['evolution-dette-pib', 'Dette publique espagnole, 2000 à fin juin 2026', 'Banco de España', '2000/2026-Q2'],
  ['dette-par-administration', 'Dette espagnole par administration avant consolidation, fin du 2e trimestre 2026', 'Banco de España', '2026-Q2'],
  ['dette-par-instrument', 'Composition par instrument de la dette publique espagnole, 2e trimestre 2026', 'Banco de España', '2026-Q2'],
  ['detenteurs-dette', 'Créanciers de la dette publique espagnole, résidents et non-résidents', 'Banco de España / INE', '2026-Q2'],
  ['bce-dette', 'Titres espagnols achetés par la BCE (PSPP et PEPP)', 'Banco de España', '2026'],
  ['interets-dette', 'Charge des intérêts de la dette publique espagnole', 'INE', '2025'],
  ['programme-emission', "Programme d'émission du Tesoro Público pour 2026", 'Tesoro Público', '2026'],
  ['dette-europe', 'Dette publique brute en Europe, fin 2025', 'Eurostat', '2025'],
  ['dette-regions', 'Dette des communautés autonomes rapportée au PIB régional', 'Banco de España', '2026'],
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
      headline: `Dette publique espagnole : ${fmt(DETTE.valeur, 3)} milliards d'euros à la fin du deuxième trimestre 2026`,
      description: metadata.description, inLanguage: 'fr-FR',
      datePublished: PUBLIE, dateModified: MODIFIE,
      author: { '@type': 'Organization', name: 'Visualize' },
      publisher: { '@type': 'Organization', name: 'Visualize', url: SITE_URL },
      mainEntityOfPage: { '@type': 'WebPage', '@id': PAGE },
      about: { '@type': 'Thing', name: "Dette publique de l'Espagne" },
      citation: Object.entries(SOURCES).map(([nom, url]) => ({ '@type': 'CreativeWork', name: nom, url })),
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Pays', item: `${SITE_URL}/pays` },
        { '@type': 'ListItem', position: 3, name: 'Espagne', item: `${SITE_URL}/pays/espagne` },
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
      temporalCoverage: periode, spatialCoverage: 'Espagne',
      isAccessibleForFree: true,
      isPartOf: { '@type': 'Article', '@id': PAGE },
      ...(MESURES[id] ? { variableMeasured: MESURES[id] } : {}),
    })),
  ];
}

export const articleEspagne: ArticleDette = {
  ...entreeEspagne,
  metadata,
  donneesStructurees,
  resume: () =>
    `Selon la Banco de España, à la fin du deuxième trimestre 2026 la dette publique brute espagnole au sens de Maastricht est de ${fmt(DETTE.valeur, 3)} milliards d'euros, soit ${fmt(RATIO.valeur)} % du PIB. Selon l'INE, le déficit public de l'année 2025 est de ${fmt(DEFICIT_2025.valeur)} milliards d'euros. Ces chiffres portent sur toutes les administrations publiques après consolidation.`,
  Composant: () => <ArticleEspagne suggestions={SUGGESTIONS} />,
};