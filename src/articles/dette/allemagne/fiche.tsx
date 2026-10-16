import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import type { ArticleDette } from '../types';
import type { Suggestion } from '../cadre';
import { ArticleAllemagne } from './Article';
import { entreeAllemagne } from './catalogue';
import { DETTE, RATIO, DEFICIT_2025, FAQ, SOURCES } from './donnees';

const URL = entreeAllemagne.url;
const PUBLIE = entreeAllemagne.publie;
const MODIFIE = entreeAllemagne.modifie;
const fmt = (v: number, d = 1) => v.toLocaleString('fr-FR', { minimumFractionDigits: d, maximumFractionDigits: d });
const PAGE = `${SITE_URL}${URL}`;
const SUGGESTIONS: Suggestion[] = [
  { href: '/pays/france/dette-publique', titre: 'La dette publique de la France', rubrique: 'Pays voisin' },
  { href: '/dette-publique', titre: 'Classement mondial des dettes publiques', rubrique: 'Classement' },
  { href: '/economie', titre: 'Explorer la carte économique mondiale', rubrique: 'Globe' },
];

const metadata: Metadata = {
  title: { absolute: "Dette publique allemande : montant, déficit et détenteurs | Visualize" },
  description: "Dette publique allemande : montant et dette/PIB, déficit, Bund et Länder, intérêts, investisseurs, refinancement et frein à l'endettement. Sources officielles.",
  keywords: ['dette Allemagne', 'dette publique allemande', 'dette PIB Allemagne', 'Bund dette', 'Länder dette', 'frein à l’endettement', 'obligations allemandes'],
  alternates: { canonical: URL },
  openGraph: {
    type: 'article', url: PAGE,
    title: 'Dette publique allemande : montant, évolution et fonctionnement',
    description: "Analyse sourcée de la dette de l'Allemagne : Maastricht, déficit, détenteurs, intérêts et règle d'endettement.",
    publishedTime: PUBLIE, modifiedTime: MODIFIE,
  },
  twitter: { card: 'summary_large_image', title: 'Dette publique allemande | Visualize', description: "Montant, dette/PIB, déficit, détenteurs, intérêts et fonds spéciaux." },
};

const FIGURES: [string, string, string, string][] = [
  ['recettes-publiques', 'Recettes publiques allemandes par catégorie et par impôt, 2025', 'Destatis', '2025'],
  ['depenses-publiques', 'Dépenses publiques allemandes par fonction et sous-fonction, 2025', 'Destatis', '2025'],
  ['qui-cree-le-deficit', 'Dépenses, recettes et déficit des administrations allemandes, 2025', 'Destatis', '2025'],
  ['evolution-dette-pib', 'Dette Maastricht allemande, 2019 à mars 2026', 'Deutsche Bundesbank / Eurostat', '2019/2026-Q1'],
  ['dette-par-emetteur', 'Variation de dette des administrations allemandes en 2025', 'Deutsche Bundesbank', '2025'],
  ['dette-par-instrument', 'Composition par instrument de la dette publique allemande, T1 2026', 'Eurostat', '2026-Q1'],
  ['detenteurs-dette', 'Catégories de détenteurs des titres fédéraux allemands', 'Deutsche Finanzagentur', '2026-06'],
  ['interets-dette', 'Intérêts publics semestriels et fédéraux annuels', 'Destatis / Deutsche Finanzagentur', '2025/2026'],
  ['dette-europe', 'Dette publique brute en Europe, premier trimestre 2026', 'Eurostat', '2026-Q1'],
  ['frein-endettement', "Réforme du frein à l'endettement allemand", 'Deutscher Bundestag', '2025'],
];

function donneesStructurees(): object[] {
  return [
    {
      '@context': 'https://schema.org', '@type': 'Article',
      headline: `Dette publique allemande : ${fmt(DETTE.valeur, 3)} milliards d'euros au premier trimestre 2026`,
      description: metadata.description, inLanguage: 'fr-FR',
      datePublished: PUBLIE, dateModified: MODIFIE,
      author: { '@type': 'Organization', name: 'Visualize' },
      publisher: { '@type': 'Organization', name: 'Visualize', url: SITE_URL },
      mainEntityOfPage: { '@type': 'WebPage', '@id': PAGE },
      about: { '@type': 'Thing', name: "Dette publique de l'Allemagne" },
      citation: Object.entries(SOURCES).map(([nom, url]) => ({ '@type': 'CreativeWork', name: nom, url })),
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Pays', item: `${SITE_URL}/pays` },
        { '@type': 'ListItem', position: 3, name: 'Allemagne', item: `${SITE_URL}/pays/allemagne` },
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
      temporalCoverage: periode, spatialCoverage: 'Allemagne',
      isAccessibleForFree: true,
      isPartOf: { '@type': 'Article', '@id': PAGE },
    })),
  ];
}

export const articleAllemagne: ArticleDette = {
  ...entreeAllemagne,
  metadata,
  donneesStructurees,
  resume: () =>
    `Selon Eurostat, au 31 mars 2026 la dette publique brute allemande au sens de Maastricht est de ${fmt(DETTE.valeur, 3)} milliards d'euros, soit ${fmt(RATIO.valeur)} % du PIB (données provisoires). Selon Destatis, le déficit public de l'année 2025 est de ${fmt(DEFICIT_2025.valeur)} milliards d'euros. Ces chiffres portent sur toutes les administrations publiques après consolidation.`,
  Composant: () => <ArticleAllemagne suggestions={SUGGESTIONS} />,
};