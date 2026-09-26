/* ═══════════════════════════════════════════════════════════════════════════
   LES FINANCES PUBLIQUES FRANÇAISES — LE SOCLE DE L'ARTICLE

   Une règle, et elle n'a pas d'exception : aucun chiffre n'entre ici sans son
   périmètre, sa base comptable, sa valorisation et sa période. C'est ce qui
   empêche la page de mettre côte à côte deux mesures qui ne parlent pas de la
   même chose — 1 714 Md€ de dépenses publiques et 441,2 Md€ de dépenses du
   budget général de l'État sont tous deux exacts, et les additionner ou les
   comparer sans le dire serait une faute.

   Quatre notions ne sont jamais interchangeables :
     · les finances publiques  = toutes les administrations publiques
     · le budget de l'État     = les seuls comptes de l'État
     · la Sécurité sociale     = encore un autre périmètre
     · la dette négociable     = les titres gérés par l'Agence France Trésor
   ═══════════════════════════════════════════════════════════════════════════ */

export type Perimetre =
  | "GENERAL_GOVERNMENT"
  | "STATE"
  | "CENTRAL_GOVERNMENT"
  | "LOCAL_GOVERNMENT"
  | "SOCIAL_SECURITY_ADMINISTRATIONS"
  | "BASIC_SOCIAL_SECURITY_AND_FSV"
  | "STATE_NEGOTIABLE_DEBT";

export type BaseComptable =
  | "NATIONAL_ACCOUNTS"
  | "BUDGETARY_ACCOUNTING"
  | "MAASTRICHT"
  | "NATIONAL_FINANCIAL_STATISTICS";

export type Valorisation = "NOMINAL" | "MARKET_VALUE" | "NOT_APPLICABLE";

export interface Mesure {
  valeur: number;
  unite: "MD_EUR" | "PCT" | "ANNEES";
  periode: string;
  perimetre: Perimetre;
  base: BaseComptable;
  valorisation: Valorisation;
  source: string;
  url: string;
  /** « definitif », « execution », « provisoire ». */
  statut?: string;
}

/** Le libellé lisible d'un périmètre, pour l'étiquette sous les graphiques. */
export const LIBELLE_PERIMETRE: Record<Perimetre, string> = {
  GENERAL_GOVERNMENT: "Toutes administrations publiques",
  STATE: "Budget de l'État",
  CENTRAL_GOVERNMENT: "Administrations publiques centrales",
  LOCAL_GOVERNMENT: "Administrations publiques locales",
  SOCIAL_SECURITY_ADMINISTRATIONS: "Administrations de sécurité sociale",
  BASIC_SOCIAL_SECURITY_AND_FSV: "Régimes obligatoires de base et FSV",
  STATE_NEGOTIABLE_DEBT: "Dette négociable de l'État",
};

export const LIBELLE_BASE: Record<BaseComptable, string> = {
  NATIONAL_ACCOUNTS: "comptabilité nationale",
  BUDGETARY_ACCOUNTING: "comptabilité budgétaire",
  MAASTRICHT: "dette au sens de Maastricht",
  NATIONAL_FINANCIAL_STATISTICS: "statistiques financières nationales",
};

const INSEE_APU = {
  source: "Insee · comptes des administrations publiques",
  url: "https://www.insee.fr/fr/statistiques/2830166",
};
const INSEE_COFOG = {
  source: "Insee · dépenses des administrations publiques par fonction",
  url: "https://www.insee.fr/fr/statistiques/4277596",
};
const INSEE_DETTE = {
  source: "Insee · dette trimestrielle de Maastricht",
  url: "https://www.insee.fr/fr/statistiques/serie/010565708",
};
const BUDGET = {
  source: "Projet de loi relatif aux résultats de la gestion 2025",
  url: "https://www.budget.gouv.fr/",
};
const AFT = {
  source: "Agence France Trésor · répartition par groupe de porteurs",
  url: "https://www.aft.gouv.fr/fr/detention-dette-negociable",
};
const SECU = {
  source: "Sécurité sociale · comptes 2025",
  url: "https://www.securite-sociale.fr/la-secu-en-detail/comptes-de-la-securite-sociale",
};

const apu2025 = (valeur: number, unite: Mesure["unite"] = "MD_EUR"): Mesure => ({
  valeur,
  unite,
  periode: "2025",
  perimetre: "GENERAL_GOVERNMENT",
  base: "NATIONAL_ACCOUNTS",
  valorisation: "NOMINAL",
  ...INSEE_APU,
});

/* ═══ 1. L'année 2025, vue d'ensemble ═══════════════════════════════════ */

export const RECETTES_2025 = apu2025(1562);
export const DEPENSES_2025 = apu2025(1714);
export const DEFICIT_2025 = apu2025(-152.5);
export const DEFICIT_PCT_2025 = apu2025(5.1, "PCT");
export const DEPENSES_PCT_PIB_2025 = apu2025(57.3, "PCT");
export const PRELEVEMENTS_OBLIGATOIRES_2025 = apu2025(1305);

/* ═══ 2. D'où vient l'argent ════════════════════════════════════════════ */

export interface Poste {
  nom: string;
  md: number;
  part?: number;
  note?: string;
  enfants?: Poste[];
}

export const RECETTES_DETAIL: Poste[] = [
  { nom: "Impôts", md: 882.0, part: 56.5 },
  { nom: "Cotisations sociales effectives", md: 446.3, part: 28.6 },
  { nom: "Ventes et autres recettes de production", md: 130.4, part: 8.4 },
  { nom: "Revenus de la propriété", md: 23.4, part: 1.5 },
  { nom: "Autres recettes", md: 86.1, part: 5.5 },
  {
    nom: "Impôts et cotisations susceptibles de ne pas être recouvrés",
    md: -6.7,
    note: "Poste négatif : il vient en déduction.",
  },
];

/* Les impôts se lisent par famille, puis par impôt. Les principaux impôts ne
   s'additionnent pas pour retrouver les 882 Md€ : certains appartiennent à
   des familles plus larges, et la liste n'est pas exhaustive. */
export const IMPOTS_FAMILLES: Poste[] = [
  {
    nom: "Impôts courants sur le revenu et le patrimoine",
    md: 389.9,
    enfants: [
      { nom: "CSG", md: 156.6 },
      { nom: "Impôt sur le revenu des personnes physiques", md: 103.6, note: "avant crédits d'impôt" },
      { nom: "Impôt sur les sociétés", md: 69.5, note: "avant crédits d'impôt" },
      { nom: "Taxe foncière", md: 44.2 },
      { nom: "CRDS", md: 9.3 },
      { nom: "Cotisation foncière des entreprises", md: 8.1 },
      { nom: "Contribution sociale de solidarité des sociétés", md: 5.3 },
      { nom: "CVAE", md: 3.7 },
      { nom: "Taxe d'habitation", md: 2.9 },
      { nom: "IFI", md: 2.7 },
    ],
  },
  {
    nom: "Impôts sur les produits et la production",
    md: 470.4,
    enfants: [
      { nom: "TVA", md: 208.8 },
      { nom: "Accises sur les produits énergétiques", md: 30.5 },
      { nom: "Taxes sur les salaires", md: 17.6 },
      { nom: "Accises sur les tabacs", md: 13.6 },
    ],
  },
  {
    nom: "Impôts en capital",
    md: 21.7,
    enfants: [{ nom: "Droits de mutation à titre gratuit", md: 21.1 }],
  },
];

/* ═══ 3. Où va l'argent — trois lectures qui ne s'additionnent pas ══════ */

export const DEPENSES_NATURE: Poste[] = [
  {
    nom: "Fonctionnement",
    md: 549,
    enfants: [
      { nom: "Rémunérations des salariés publics", md: 370.0 },
      { nom: "Consommations intermédiaires", md: 164.6 },
    ],
  },
  { nom: "Prestations sociales en espèces et en nature", md: 771.0 },
  { nom: "Autres transferts et subventions", md: 192.1 },
  {
    nom: "Acquisitions nettes d'actifs non financiers",
    md: 137.7,
    enfants: [{ nom: "dont investissement", md: 132.2 }],
  },
  { nom: "Intérêts", md: 64.7, note: "En hausse de 11,2 % en 2025." },
];

/* La dernière ventilation fonctionnelle complète porte sur 2024 : on ne
   fabrique pas une répartition 2025 qui n'existe pas. */
export const DEPENSES_FONCTION_TOTAL = 1672;
export const DEPENSES_FONCTION: (Poste & { pct?: number; detail?: string; sous?: Poste[] })[] = [
  {
    nom: "Protection sociale",
    md: 693,
    pct: 41,
    detail:
      "C'est de loin la première fonction de dépense publique. Elle comprend notamment les retraites, les prestations familiales, l'indemnisation du chômage, certaines prestations liées au handicap, à la dépendance ou à l'exclusion sociale. Les retraites en constituent le principal ensemble, et leur dépense a encore augmenté de 23 Md€ en 2024.",
    sous: [
      { nom: "Chômage et formation des demandeurs d'emploi", md: 49 },
      { nom: "Prestations d'aide aux familles", md: 67 },
    ],
  },
  {
    nom: "Santé",
    md: 261,
    pct: 16,
    detail:
      "Les dépenses de santé sont presque entièrement portées par les administrations de sécurité sociale. Les autres dépenses comprennent notamment les soins de ville, les cliniques, les médicaments et d'autres biens et services médicaux.",
    sous: [{ nom: "Services hospitaliers publics", md: 109 }],
  },
  { nom: "Services publics généraux", md: 181, pct: 11 },
  { nom: "Affaires économiques", md: 166, pct: 10 },
  {
    nom: "Enseignement",
    md: 149,
    pct: 9,
    detail:
      "Les administrations centrales financent notamment une grande partie des rémunérations, tandis que les collectivités locales interviennent fortement sur les bâtiments et équipements scolaires.",
    sous: [
      { nom: "Administrations centrales", md: 104 },
      { nom: "Administrations locales", md: 45 },
    ],
  },
  {
    nom: "Défense",
    md: 54,
    detail:
      "Cette mesure fonctionnelle ne se compare pas directement à la mission budgétaire « Défense » de l'État : ni la période ni la comptabilité ne sont les mêmes.",
    sous: [
      { nom: "Rémunérations", md: 22 },
      { nom: "Achats", md: 20 },
      { nom: "Investissements", md: 11 },
    ],
  },
  { nom: "Ordre et sécurité publics", md: 52 },
  { nom: "Loisirs, culture et culte", md: 43 },
  { nom: "Logement et équipements collectifs", md: 42 },
  { nom: "Protection de l'environnement", md: 30 },
];

export const SOURCE_FONCTION = { ...INSEE_COFOG, periode: "2024" };

export interface Acteur {
  nom: string;
  depenses: number;
  recettes: number;
  solde: number;
  detail?: string;
  lignes?: { nom: string; md: number }[];
}

export const ACTEURS_2025: Acteur[] = [
  {
    nom: "Administrations centrales",
    depenses: 681.1,
    recettes: 550.8,
    solde: -130.3,
    lignes: [
      { nom: "État", md: -128.1 },
      { nom: "Organismes d'administration centrale", md: -2.2 },
    ],
  },
  {
    nom: "Administrations publiques locales",
    depenses: 335.5,
    recettes: 319.9,
    solde: -15.6,
    lignes: [{ nom: "Investissement public local", md: 70.7 }],
  },
  {
    nom: "Administrations de sécurité sociale",
    depenses: 803.3,
    recettes: 796.6,
    solde: -6.7,
    detail:
      "Les « administrations de sécurité sociale » de la comptabilité nationale englobent un ensemble plus large d'organismes que les seuls régimes obligatoires de base et le Fonds de solidarité vieillesse.",
  },
];

export const DEFICIT_PAR_ACTEUR: { nom: string; md: number }[] = [
  { nom: "État", md: -128.1 },
  { nom: "Organismes d'administration centrale", md: -2.2 },
  { nom: "Administrations publiques locales", md: -15.6 },
  { nom: "Administrations de sécurité sociale", md: -6.7 },
];

/* ═══ 4. Le zoom Sécurité sociale ═══════════════════════════════════════ */

export const SECU_COMPTA_NATIONALE: Mesure = {
  valeur: -6.7,
  unite: "MD_EUR",
  periode: "2025",
  perimetre: "SOCIAL_SECURITY_ADMINISTRATIONS",
  base: "NATIONAL_ACCOUNTS",
  valorisation: "NOMINAL",
  ...INSEE_APU,
};
export const SECU_REGIMES_BASE: Mesure = {
  valeur: -21.6,
  unite: "MD_EUR",
  periode: "2025",
  perimetre: "BASIC_SOCIAL_SECURITY_AND_FSV",
  base: "NATIONAL_ACCOUNTS",
  valorisation: "NOMINAL",
  ...SECU,
};
export const ONDAM_2025: Mesure = {
  valeur: 265.4,
  unite: "MD_EUR",
  periode: "2025",
  perimetre: "BASIC_SOCIAL_SECURITY_AND_FSV",
  base: "NATIONAL_ACCOUNTS",
  valorisation: "NOMINAL",
  ...SECU,
};

/* ═══ 5. Le zoom budget de l'État ═══════════════════════════════════════ */

const etat = (valeur: number): Mesure => ({
  valeur,
  unite: "MD_EUR",
  periode: "2025",
  perimetre: "STATE",
  base: "BUDGETARY_ACCOUNTING",
  valorisation: "NOMINAL",
  statut: "exécution",
  ...BUDGET,
});

export const ETAT_RECETTES_FISCALES = etat(356.4);
export const ETAT_RECETTES_DETAIL: Poste[] = [
  { nom: "Impôt sur le revenu", md: 94.9 },
  { nom: "TVA revenant au budget de l'État", md: 98.1 },
  { nom: "Impôt sur les sociétés", md: 59.9 },
  { nom: "Part État sur les produits énergétiques", md: 16.3 },
  { nom: "Autres recettes fiscales", md: 87.2 },
];
export const ETAT_CHAINE: { nom: string; md: number; signe: 1 | -1 | 0 }[] = [
  { nom: "Recettes fiscales nettes", md: 356.4, signe: 1 },
  { nom: "Recettes non fiscales", md: 24.0, signe: 1 },
  { nom: "Prélèvement au profit des collectivités territoriales", md: -46.1, signe: -1 },
  { nom: "Prélèvement au profit de l'Union européenne", md: -23.0, signe: -1 },
  { nom: "Recettes nettes du budget général", md: 311.4, signe: 0 },
  { nom: "Fonds de concours et attributions de produits", md: 7.35, signe: 1 },
  { nom: "Recettes nettes, fonds de concours compris", md: 318.7, signe: 0 },
];
export const ETAT_DEPENSES = etat(441.2);
export const ETAT_SOLDE = etat(-124.2);

export const MISSIONS_2025: Poste[] = [
  { nom: "Enseignement scolaire", md: 87.7 },
  { nom: "Défense", md: 62.1 },
  {
    nom: "Engagements financiers de l'État",
    md: 53.2,
    enfants: [{ nom: "Charge de la dette et trésorerie de l'État", md: 50.9 }],
  },
  { nom: "Solidarité, insertion et égalité des chances", md: 30.9 },
  { nom: "Recherche et enseignement supérieur", md: 30.6 },
  { nom: "Écologie, développement et mobilités durables", md: 26.1 },
  { nom: "Sécurités", md: 25.8 },
  { nom: "Cohésion des territoires", md: 23.7 },
  { nom: "Travail, emploi et administration des ministères sociaux", md: 20.5 },
  { nom: "Justice", md: 12.4 },
];

/* ═══ 6. La dette : qui la porte, et sous quelle forme ══════════════════ */

const dette = (valeur: number): Mesure => ({
  valeur,
  unite: "MD_EUR",
  periode: "T1 2026",
  perimetre: "GENERAL_GOVERNMENT",
  base: "MAASTRICHT",
  valorisation: "NOMINAL",
  ...INSEE_DETTE,
});

export const DETTE_PAR_EMETTEUR: { nom: string; md: number; pct: number }[] = [
  { nom: "État", md: 2889.0, pct: 81.7 },
  { nom: "Administrations de sécurité sociale", md: 301.2, pct: 8.5 },
  { nom: "Administrations publiques locales", md: 276.5, pct: 7.8 },
  { nom: "Organismes d'administration centrale", md: 69.3, pct: 2.0 },
];

export const DETTE_PAR_INSTRUMENT: Poste[] = [
  {
    nom: "Titres négociables",
    md: 3170.8,
    part: 89.7,
    enfants: [
      { nom: "Court terme", md: 282.7 },
      { nom: "Long terme", md: 2888.1 },
    ],
  },
  { nom: "Crédits", md: 322.3, part: 9.1 },
  { nom: "Dépôts", md: 42.9, part: 1.2 },
];

export const DETTE_BRUTE = dette(3536.1);
export const DETTE_NETTE: Mesure = { ...dette(3301.1), statut: "même champ d'instruments" };
export const DETTE_NETTE_PCT: Mesure = { ...dette(109.7), unite: "PCT" };

/* ═══ 7. Les détenteurs de la dette négociable de l'État ════════════════ */

const porteurs = (valeur: number): Mesure => ({
  valeur,
  unite: "PCT",
  periode: "T1 2026",
  perimetre: "STATE_NEGOTIABLE_DEBT",
  base: "NATIONAL_FINANCIAL_STATISTICS",
  valorisation: "MARKET_VALUE",
  ...AFT,
});

export const PORTEURS: { nom: string; pct: number; info?: string }[] = [
  {
    nom: "Non-résidents",
    pct: 57.5,
    info: "« Non-résident » ne désigne pas une nationalité : c'est un détenteur dont la résidence économique est située hors de France. Les statistiques publiques identifient des catégories institutionnelles, pas une liste de propriétaires finaux pays par pays.",
  },
  { nom: "Autres détenteurs français", pct: 20.6 },
  { nom: "Établissements de crédit français", pct: 10.5 },
  { nom: "Compagnies d'assurance françaises", pct: 9.6 },
  { nom: "OPCVM français", pct: 1.8 },
];
export const PORTEURS_MESURE = porteurs(57.5);

export const NON_RESIDENTS_SERIE: { periode: string; pct: number }[] = [
  { periode: "Déc. 2022", pct: 49.82 },
  { periode: "Mars 2023", pct: 50.89 },
  { periode: "Juin 2023", pct: 52.36 },
  { periode: "Sept. 2023", pct: 52.91 },
  { periode: "Déc. 2023", pct: 53.61 },
  { periode: "Mars 2024", pct: 53.69 },
  { periode: "Juin 2024", pct: 54.27 },
  { periode: "Sept. 2024", pct: 54.06 },
  { periode: "Déc. 2024", pct: 54.62 },
  { periode: "Mars 2025", pct: 54.33 },
  { periode: "Juin 2025", pct: 55.02 },
  { periode: "Sept. 2025", pct: 55.15 },
  { periode: "Déc. 2025", pct: 56.07 },
  { periode: "Mars 2026", pct: 57.50 },
];

export const PORTEURS_PAR_TITRE: { titre: string; residents: number; nonResidents: number; note?: string }[] = [
  { titre: "OAT classiques", residents: 44.7, nonResidents: 55.3 },
  { titre: "OAT€i", residents: 66.1, nonResidents: 33.9, note: "indexées sur l'inflation européenne" },
  { titre: "OATi", residents: 83.4, nonResidents: 16.6, note: "indexées sur l'inflation française" },
  { titre: "BTF", residents: 16.0, nonResidents: 84.1, note: "titres de court terme" },
];

/* ═══ 8. Le coût, et le financement ═════════════════════════════════════ */

export const INTERETS_APU_2025 = apu2025(64.7);
export const INTERETS_ETAT_2025: Mesure = {
  valeur: 52.4,
  unite: "MD_EUR",
  periode: "2025",
  perimetre: "STATE",
  base: "NATIONAL_ACCOUNTS",
  valorisation: "NOMINAL",
  ...INSEE_APU,
};
export const CHARGE_DETTE_PROGRAMME = etat(50.9);
export const ENGAGEMENTS_FINANCIERS = etat(53.2);

const aft = (valeur: number, unite: Mesure["unite"]): Mesure => ({
  valeur,
  unite,
  periode: "au 31 août 2026",
  perimetre: "STATE_NEGOTIABLE_DEBT",
  base: "NATIONAL_FINANCIAL_STATISTICS",
  valorisation: "NOMINAL",
  source: "Agence France Trésor · bulletin mensuel",
  url: "https://www.aft.gouv.fr/fr/publications-chiffres-cles",
});

export const ENCOURS_NEGOCIABLE = aft(2903.8, "MD_EUR");
export const DUREE_VIE = { texte: "8 ans et 142 jours", ...aft(8.39, "ANNEES") };
export const TAUX_MOYEN_2026 = aft(3.5, "PCT");

/* ═══ 9. La TVA, exemple de deux mesures qui ne se soustraient pas ══════ */

export const TVA_COMPTA_NATIONALE = apu2025(208.8);
export const TVA_BUDGET_ETAT = etat(98.1);
