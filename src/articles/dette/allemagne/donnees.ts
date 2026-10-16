/**
 * Allemagne — dette publique : données officielles vérifiées le 16 octobre 2026.
 * Unité des stocks/flux : MILLIARDS D'EUROS ; ratios en %.
 * Chaque mesure inclut période, périmètre, source et URL consultable.
 * N'inférer aucune ventilation du stock total à partir de variations annuelles.
 */
export interface Mesure {
  valeur: number;
  unite: 'Md EUR' | '% PIB' | '%' | 'points';
  periode: string;
  perimetre: string;
  source: string;
  url: string;
}
const BB = 'https://www.bundesbank.de/en/press/press-releases/deutsche-staatsschulden-992720';
const DESTATIS = 'https://www.destatis.de/EN/Press/2026/02/PE26_060_813.html';
const DESTATIS_S1 = 'https://www.destatis.de/DE/Presse/Pressemitteilungen/2026/08/PD26_305_813.html';
const FINANZ = 'https://www.deutsche-finanzagentur.de/en/federal-funding/debt-statistics/interest-payments';
const DESTATIS_S1_2025 = 'https://www.destatis.de/EN/Press/2025/08/PE25_311_813.html';
const INVEST = 'https://www.deutsche-finanzagentur.de/en/federal-funding/government-as-issuer/investor-structure';
const EUROSTAT = 'https://ec.europa.eu/eurostat/web/products-euro-indicators/w/2-21072026-ap';
const BUNDESTAG = 'https://dip.bundestag.de/vorgang/gesetz-zur-%C3%A4nderung-des-grundgesetzes-artikel-109-115-und-143h/320784';
const EMISSIONS = 'https://www.deutsche-finanzagentur.de/en/federal-securities/types-of-federal-securities/overview-federal-securities';
export const SOURCES = { BB, DESTATIS, DESTATIS_S1, DESTATIS_S1_2025, FINANZ, INVEST, EUROSTAT, BUNDESTAG, EMISSIONS };
const mes = (valeur: number, unite: Mesure['unite'], periode: string, perimetre: string, source: string, url: string): Mesure =>
  ({ valeur, unite, periode, perimetre, source, url });

export const DETTE = mes(2902.035, 'Md EUR', '31 mars 2026', 'Dette brute consolidée des administrations publiques, définition Maastricht (S.13), chiffres trimestriels provisoires, calculée en millions puis exprimée en milliards', 'Eurostat, 21 juillet 2026, données 2026-T1', EUROSTAT);
export const RATIO = mes(64.4, '% PIB', '31 mars 2026', 'Dette brute consolidée des administrations publiques / somme du PIB nominal des quatre derniers trimestres, valeurs provisoires', 'Eurostat, 21 juillet 2026, données 2026-T1', EUROSTAT);
export const HAUSSE_DETTE = mes(144, 'Md EUR', 'année 2025', 'Variation annuelle du stock de dette Maastricht (2025 moins 2024)', 'Deutsche Bundesbank, 31 mars 2026', BB);
export const DEFICIT_2025 = mes(119.1, 'Md EUR', 'année 2025', 'Besoin de financement des administrations publiques, SEC 2010, données provisoires, valeur absolue', 'Destatis, 25 février 2026', DESTATIS);
export const DEFICIT_RATIO_2025 = mes(2.7, '% PIB', 'année 2025', 'Déficit des administrations publiques SEC 2010 / PIB nominal, données provisoires', 'Destatis, 25 février 2026', DESTATIS);
export const RECETTES_2025 = mes(2140.2, 'Md EUR', 'année 2025', 'Recettes toutes administrations publiques, comptabilité nationale SEC 2010, données provisoires', 'Destatis, 25 février 2026', DESTATIS);
export const DEPENSES_2025 = mes(2259.3, 'Md EUR', 'année 2025', 'Dépenses toutes administrations publiques, comptabilité nationale SEC 2010, données provisoires', 'Destatis, 25 février 2026', DESTATIS);
export const IMPOTS_COURANTS_2025 = mes(1031.5, 'Md EUR', 'année 2025', 'Impôts courants enregistrés en comptabilité nationale (non toutes les taxes et recettes)', 'Destatis, 25 février 2026', DESTATIS);
export const DEFICIT_BUND = mes(79.6, 'Md EUR', 'année 2025', 'Déficit de l’administration centrale (Bund), SEC 2010, arrondi au dixième', 'Destatis, 25 février 2026', DESTATIS);
export const DEFICIT_LANDER = mes(9.8, 'Md EUR', 'année 2025', 'Déficit des Länder, SEC 2010, arrondi au dixième', 'Destatis, 25 février 2026', DESTATIS);
export const DEFICIT_COMMUNES = mes(28.1, 'Md EUR', 'année 2025', 'Déficit des communes, SEC 2010, arrondi au dixième', 'Destatis, 25 février 2026', DESTATIS);
export const DEFICIT_SECU = mes(1.7, 'Md EUR', 'année 2025', 'Déficit des assurances sociales, SEC 2010, arrondi au dixième', 'Destatis, 25 février 2026', DESTATIS);
export const DEFICIT_S1_2026 = mes(71.3, 'Md EUR', '1er janvier au 30 juin 2026', 'Déficit de toutes les administrations publiques, SEC 2010, semestre uniquement', 'Destatis, 25 août 2026', DESTATIS_S1);
export const RATIO_DEFICIT_S1_2026 = mes(3.1, '% PIB', '1er janvier au 30 juin 2026', 'Déficit du semestre / PIB du même semestre, non extrapolable à l’année', 'Destatis, 25 août 2026', DESTATIS_S1);
export const INTERETS_APU_S1_2026 = mes(27.3, 'Md EUR', '1er janvier au 30 juin 2026', 'Intérêts des administrations publiques, comptabilité nationale, semestre uniquement', 'Destatis, 25 août 2026', DESTATIS_S1);
export const INTERETS_APU_S1_2025 = mes(24.3, 'Md EUR', '1er janvier au 30 juin 2025', 'Intérêts de toutes les administrations publiques, comptabilité nationale SEC 2010, période de six mois', 'Destatis, août 2025', DESTATIS_S1_2025);
export const VARIATION_INTERETS_S1_2026 = mes(11.6, '%', 'premier semestre 2026 contre premier semestre 2025', 'Variation en pourcentage des intérêts des administrations publiques entre deux semestres homologues', 'Destatis, 25 août 2026', DESTATIS_S1);
export const PART_TITRES_2026_T1 = mes(51.1, '% PIB', '31 mars 2026', 'Titres de dette de toutes les administrations publiques après consolidation, en % du PIB, non en part du stock', 'Eurostat, 21 juillet 2026', EUROSTAT);
export const PART_PRETS_2026_T1 = mes(12.9, '% PIB', '31 mars 2026', 'Prêts de toutes les administrations publiques après consolidation, en % du PIB, non en part du stock', 'Eurostat, 21 juillet 2026', EUROSTAT);
export const PART_DEPOTS_2026_T1 = mes(0.4, '% PIB', '31 mars 2026', 'Numéraire et dépôts de toutes les administrations publiques après consolidation, en % du PIB, non en part du stock', 'Eurostat, 21 juillet 2026', EUROSTAT);
export const FONDS_INFRASTRUCTURE = mes(500, 'Md EUR', 'réforme constitutionnelle de mars 2025', 'Enveloppe maximale autorisée pour un fonds spécial ; ce n’est pas un emprunt déjà intégralement effectué', 'Deutscher Bundestag, 18 mars 2025', BUNDESTAG);
export const DETTE_SECU_2025 = mes(7, 'Md EUR', '31 décembre 2025', 'Dette brute des assurances sociales, majoritairement envers le Bund et éliminée du total consolidé', 'Deutsche Bundesbank, 31 mars 2026', BB);
export const MARGE_LANDER = mes(0.35, '% PIB', 'réforme constitutionnelle de mars 2025', 'Marge autorisée de déficit structurel des Länder, non un taux de dette effective', 'Deutscher Bundestag, réforme de mars 2025', BUNDESTAG);
export const VARIATION_BUND = mes(107, 'Md EUR', 'année 2025', 'Hausse du stock de dette de l’administration centrale, avec budgets annexes ; non montant total', 'Deutsche Bundesbank, 31 mars 2026', BB);
export const VARIATION_LANDER = mes(19, 'Md EUR', 'année 2025', 'Hausse du stock de dette des Länder ; non montant total', 'Deutsche Bundesbank, 31 mars 2026', BB);
export const VARIATION_COMMUNES = mes(25, 'Md EUR', 'année 2025', 'Hausse du stock de dette des communes ; non montant total', 'Deutsche Bundesbank, 31 mars 2026', BB);

export const DETTE_PAR_ANNEE = [
  { annee: 2019, valeur: 58.7, md: 2076 },
  { annee: 2020, valeur: 68.0, md: 2348, repere: 'Covid-19' },
  { annee: 2021, valeur: 67.9, md: 2502 },
  { annee: 2022, valeur: 64.4, md: 2569 },
  { annee: 2023, valeur: 62.3, md: 2631 },
  { annee: 2024, valeur: 62.2, md: 2694 },
  { annee: 2025, valeur: 63.5, md: 2838 },
  { annee: '2026-T1', valeur: 64.4, md: 2902.035 },
] as const; // Chacun des points figure au tableau de la Bundesbank du 31/03/2026 (BB).

export const EUROPE_2026_T1 = [
  { pays: 'Grèce', pct: 143.5 },
  { pays: 'Italie', pct: 138.9 },
  { pays: 'France', pct: 117.6 },
  { pays: 'Belgique', pct: 109.1 },
  { pays: 'Espagne', pct: 101.6 },
  { pays: 'UE', pct: 82.9 },
  { pays: 'Allemagne', pct: 64.4 },
] as const; // Toutes les données sont celles de la publication Eurostat du 21 juillet 2026, 2026-T1.

/** Une seule fonction pour la FAQ affichée et le JSON-LD : les devises de la page
 * sont converties avec enLettres(), et la version EUR par défaut reste le SEO. */
export type FAQMontant = (md: number, decimales: number, annee: number) => string;
const euros: FAQMontant = (md, d) => `${md.toLocaleString('fr-FR', {minimumFractionDigits:d,maximumFractionDigits:d})} milliards d'euros`;
export function creerFAQ(formater: FAQMontant = euros) {
  const m = (v: number, d = 1, a = 2025) => formater(v, d, a);
  const fr = EUROPE_2026_T1.find(e => e.pays === 'France')!;
  return [
    { q: 'Quel est le montant de la dette publique allemande ?', r: `Au 31 mars 2026, la dette brute consolidée des administrations publiques allemandes atteint ${m(DETTE.valeur,3,2026)} selon Eurostat (définition Maastricht, données trimestrielles provisoires). Elle comprend le Bund, les Länder, les communes et la sécurité sociale, après consolidation.` },
    { q: 'Quel est le ratio dette publique/PIB de l’Allemagne ?', r: `La dette publique allemande atteint ${RATIO.valeur.toLocaleString('fr-FR')} % du PIB au premier trimestre 2026, selon Eurostat. Il s'agit de la dette brute consolidée des administrations publiques, pas des seules obligations du Bund.` },
    { q: 'Quelle est la différence entre la dette allemande et son déficit ?', r: `La dette correspond à un stock mesuré à une date ; le déficit correspond à un flux mesuré pendant une période. Le déficit public 2025 s'élève à ${m(DEFICIT_2025.valeur,1)} selon Destatis, en comptabilité nationale SEC 2010.` },
    { q: 'Pourquoi la dette allemande augmente-t-elle ?', r: `En 2025, la dette Maastricht a augmenté de ${m(HAUSSE_DETTE.valeur,0)} d'après la Bundesbank. La variation de dette peut dépasser le déficit annuel lorsque des emprunts financent également des acquisitions d'actifs financiers.` },
    { q: 'Qui doit la dette publique allemande ?', r: 'Elle est contractée par l’administration centrale fédérale, les Länder, les communes et les administrations de sécurité sociale. Les dettes entre administrations publiques sont éliminées lors de la consolidation Maastricht.' },
    { q: 'Qui détient les obligations de l’État allemand ?', r: 'Les titres fédéraux circulent entre banques, banques centrales, fonds, assureurs et autres investisseurs allemands et internationaux. Selon la Finanzagentur, les détenteurs individuels ne sont pas enregistrés ; sa structure par catégorie reste reconstituée à partir des transactions.' },
    { q: 'Combien l’Allemagne paie-t-elle d’intérêts sur sa dette ?', r: `Les administrations publiques allemandes ont payé ${m(INTERETS_APU_S1_2026.valeur,1,2026)} d'intérêts pendant les six premiers mois de 2026 selon Destatis. Ce montant semestriel ne doit pas être comparé directement aux paiements annuels du seul Bund.` },
    { q: 'Qui vote le budget fédéral allemand ?', r: 'Le Bundestag vote le budget du Bund sous forme de loi. Le Bundesrat intervient dans la procédure législative et la Cour fédérale des comptes contrôle la gestion des fonds.' },
    { q: 'Comment l’Allemagne rembourse-t-elle sa dette ?', r: 'Chaque titre fédéral possède sa propre échéance. Le Bund émet notamment des Bubills, Schatz, Bobl et Bunds pour financer son budget et refinancer les titres arrivant à échéance.' },
    { q: 'Qu’est-ce que le frein à l’endettement allemand ?', r: 'Le frein à l’endettement inscrit dans la Loi fondamentale encadre le déficit structurel. La réforme de mars 2025 a prévu des aménagements pour certaines dépenses de défense et de sécurité, un fonds d’infrastructures et une marge d’emprunt pour les Länder.' },
    { q: 'L’Allemagne est-elle moins endettée que la France ?', r: `Selon Eurostat, au premier trimestre 2026, le ratio de dette publique Maastricht est de ${RATIO.valeur.toLocaleString('fr-FR')} % du PIB en Allemagne et de ${fr.pct.toLocaleString('fr-FR')} % en France. Il s'agit du même périmètre européen et de la même période.` },
    { q: 'Le fonds spécial allemand est-il déjà intégralement emprunté ?', r: `Non. Les ${m(FONDS_INFRASTRUCTURE.valeur,0)} correspondent à une enveloppe maximale autorisée en 2025 pour un fonds spécial. Ce plafond n'est pas un montant intégralement emprunté ou dépensé.` },
  ];
}
export const FAQ = creerFAQ();