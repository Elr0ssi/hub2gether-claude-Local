import type { Bareme, Detail, Part } from "../cadre/ventilation";

/* ═══════════════════════════════════════════════════════════════════════════
   ALLEMAGNE : CE QUI S'OUVRE SOUS CHAQUE LIGNE DES RECETTES, DES DÉPENSES ET DU DÉFICIT

   Source de ce fichier : « Dossier de fond vérifié — France et Allemagne »
   (état de la recherche du 16 octobre 2026), tables Destatis GENESIS.
   Montants en milliards d'euros, à trois décimales comme Destatis les publie.

   Rappels :
     - les « dont » sont inclus dans leur parent et ne s'y ajoutent jamais ;
     - les impôts de la comptabilité nationale (SEC) et les impôts encaissés
       (statistiques de caisse) ne sont pas le même périmètre : on ne les fusionne pas ;
     - les montants écrits dans un texte s'écrivent [[valeur]] : ils sont convertis dans la monnaie du menu.
   ═══════════════════════════════════════════════════════════════════════════ */

export const SRC = {
  COMPTES: { nom: "Destatis, GENESIS 81000-0031 (comptes des administrations publiques, 2025 provisoire)", url: "https://genesis.destatis.de/datenbank/online/statistic/81000/table/81000-0031" },
  IMPOTS: { nom: "Destatis, GENESIS 71211-0001 (recettes fiscales encaissées, 2025)", url: "https://genesis.destatis.de/datenbank/online/statistic/71211/table/71211-0001" },
  COFOG: { nom: "Destatis, GENESIS 81000-0413 (dépenses par fonction, 2025)", url: "https://genesis.destatis.de/datenbank/online/statistic/81000/table/81000-0413" },
};

/* ── 1. Recettes (comptes nationaux révisés, 2025) ──────────────────────── */

export const RECETTES_TOTAL = 2137.94;
export const IMPOTS_SEC = 1031.546;
export const COTISATIONS_SEC = 823.069;

/* Les grandes familles : une couleur chacune sur la barre et sur les lignes. */
export const FAMILLES_RECETTES = [{ nom: "Impôts" }, { nom: "Cotisations sociales" }, { nom: "Autres recettes" }];

/* ── Les taux des impôts (2025) ─────────────────────────────────────────── */

/* Barème de l'impôt sur le revenu 2025 (§ 32a EStG), personne seule. Les deux tranches
   intermédiaires sont des formules : on en donne le taux marginal, de la première à la dernière euro de la tranche. */
const BAREME_IR: Bareme = {
  titre: "Barème 2025, personne seule (taux sur le dernier euro gagné)",
  lignes: [
    { libelle: "Jusqu'à 12 096 €", taux: 0, texte: "0 %" },
    { libelle: "De 12 097 à 17 443 €", taux: 24, texte: "de 14 % à 24 %" },
    { libelle: "De 17 444 à 68 480 €", taux: 42, texte: "de 24 % à 42 %" },
    { libelle: "De 68 481 à 277 825 €", taux: 42, texte: "42 %" },
    { libelle: "Au-delà de 277 825 €", taux: 45, texte: "45 %" },
  ],
};

/* Les impôts encaissés (statistiques de caisse, avant redistribution Bund / Länder / communes). */
export const IMPOTS_ENCAISSES = 989.827;
const PARTAGES = 746.339;
const FEDERAUX = 108.813;
const LANDER = 34.285;
const DOUANE = 5.86;
const arrondi3 = (v: number) => Math.round(v * 1000) / 1000;
/* Les impôts communaux : le total encaissé moins les autres familles. */
const COMMUNAUX = arrondi3(IMPOTS_ENCAISSES - PARTAGES - FEDERAUX - LANDER - DOUANE);
/* Le reste des recettes : le total moins les cotisations et les impôts encaissés. */
export const AUTRES_RECETTES = arrondi3(RECETTES_TOTAL - COTISATIONS_SEC - IMPOTS_ENCAISSES);
export const ECART_IMPOTS = arrondi3(IMPOTS_SEC - IMPOTS_ENCAISSES);

export const RECETTES_LIGNES: Part[] = [
  { nom: "Cotisations sociales", md: COTISATIONS_SEC, famille: 1 },
  { nom: "Impôts partagés Bund / Länder", md: PARTAGES, famille: 0, note: "répartis entre l'État fédéral, les Länder et les communes" },
  { nom: "Autres recettes", md: AUTRES_RECETTES, famille: 2 },
  { nom: "Impôts fédéraux", md: FEDERAUX, famille: 0 },
  { nom: "Impôts communaux", md: COMMUNAUX, famille: 0 },
  { nom: "Impôts des Länder", md: LANDER, famille: 0 },
  { nom: "Droits de douane", md: DOUANE, famille: 0, taux: "tarif de l'UE" },
];

export const DETAIL_RECETTES: Record<string, Detail> = {
  "Cotisations sociales": {
    texte: "Les cotisations versées aux assurances sociales : retraite, maladie, chômage, dépendance et accidents du travail.",
    source: SRC.COMPTES,
  },
  "Impôts partagés Bund / Länder": {
    texte: "Les grands impôts dont le produit est partagé entre l'État fédéral, les Länder et les communes : impôt sur les salaires, TVA, impôt sur le revenu, impôt sur les sociétés. La TVA (intérieure et à l'importation) pèse [[310.206]].",
    vues: [
      {
        parts: [
          { nom: "Impôt sur les salaires (Lohnsteuer)", md: 262.688, note: "net des allocations familiales", taux: "0 à 45 %", bareme: BAREME_IR },
          { nom: "TVA intérieure", md: 236.267, taux: "7 à 19 %" },
          { nom: "Impôt sur le revenu par déclaration", md: 78.362, taux: "0 à 45 %", bareme: BAREME_IR },
          { nom: "TVA à l'importation", md: 73.939, taux: "7 ou 19 %" },
          { nom: "Impôt sur les sociétés", md: 39.164, taux: "15 %" },
          { nom: "Impôts sur revenus du capital non établis", md: 31.118, taux: "25 %" },
          { nom: "Impôt libératoire sur revenus financiers", md: 24.801, taux: "25 %" },
        ],
        total: PARTAGES,
      },
    ],
    source: SRC.IMPOTS,
  },
  "Autres recettes": {
    texte:
      "Le reste des recettes publiques : ce qui n'est ni cotisation sociale ni impôt encaissé. Il comprend l'écart de [[41.719]] entre les impôts de la comptabilité nationale ([[1031.546]]) et les impôts encaissés ([[989.827]]).",
    source: SRC.COMPTES,
  },
  "Impôts fédéraux": {
    texte: "Les impôts dont le produit revient à l'État fédéral : énergie, assurances, tabac, solidarité, véhicules…",
    vues: [
      {
        parts: [
          { nom: "Taxe sur l'énergie", md: 37.563, taux: "selon le produit" },
          { nom: "Taxe sur les assurances", md: 19.611, taux: "19 %" },
          { nom: "Taxe sur le tabac", md: 17.632, taux: "prix + quantité" },
          { nom: "Contribution de solidarité", md: 12.878, taux: "5,5 % de l'impôt" },
          { nom: "Taxe sur les véhicules", md: 9.598, taux: "selon le CO₂" },
          { nom: "Taxe sur l'électricité", md: 5.856, taux: "20,50 €/MWh" },
          { nom: "Taxe sur les billets d'avion", md: 2.063, taux: "selon la distance" },
          { nom: "Taxe sur l'alcool", md: 2.05, taux: "1 303 €/hl d'alcool pur" },
          { nom: "Taxe sur le café", md: 1.038, taux: "2,19 €/kg (torréfié)" },
          { nom: "Taxe sur les vins mousseux", md: 0.365, taux: "136 €/hl" },
        ],
        total: FEDERAUX,
      },
    ],
    source: SRC.IMPOTS,
  },
  "Impôts communaux": {
    texte: "Les impôts des communes, dont la taxe professionnelle (Gewerbesteuer) est de loin la principale. Montant : le total des impôts encaissés moins les autres familles.",
    vues: [
      {
        parts: [
          { nom: "Taxe professionnelle brute", md: 76.444, taux: "au moins 7 %" },
          { nom: "Taxe foncière B", md: 15.742, taux: "variable" },
          { nom: "Taxe sur les chiens", md: 0.43, taux: "variable" },
          { nom: "Taxe sur les résidences secondaires", md: 0.284, taux: "variable" },
        ],
        total: COMMUNAUX,
      },
    ],
    source: SRC.IMPOTS,
  },
  "Impôts des Länder": {
    texte: "Les impôts dont le produit revient aux États fédérés : successions, mutations immobilières, loteries, paris sportifs.",
    vues: [
      {
        parts: [
          { nom: "Droits de succession", md: 15.412, taux: "7 à 50 %" },
          { nom: "Droits de mutation immobilière", md: 15.097, taux: "3,5 à 6,5 %" },
          { nom: "Taxe sur les loteries", md: 1.789, taux: "20 %" },
          { nom: "Taxe sur les paris sportifs", md: 0.419, taux: "5,3 %" },
        ],
        total: LANDER,
      },
    ],
    source: SRC.IMPOTS,
  },
  "Droits de douane": {
    texte: "Les droits perçus sur les importations venant de pays hors Union européenne, selon le tarif douanier commun.",
    source: SRC.IMPOTS,
  },
};

/* ── 2. Dépenses (comptes nationaux révisés, 2025) ──────────────────────── */

export const DEPENSES_TOTAL = 2274.412;
const NATURE = {
  prestMon: 746.948,
  prestNat: 418.583,
  remun: 383.77,
  achats: 288.463,
  invest: 156.09,
};
const SOMME_NATURE = Object.values(NATURE).reduce((s, v) => s + v, 0);
export const AUTRES_DEPENSES = Math.round((DEPENSES_TOTAL - SOMME_NATURE) * 1000) / 1000;

export const DEPENSES_NATURE_LIGNES: Part[] = [
  { nom: "Prestations monétaires", md: NATURE.prestMon },
  { nom: "Prestations en nature", md: NATURE.prestNat },
  { nom: "Rémunération des agents", md: NATURE.remun },
  { nom: "Achats intermédiaires", md: NATURE.achats },
  { nom: "Autres dépenses", md: AUTRES_DEPENSES },
  { nom: "Investissement brut", md: NATURE.invest },
];

export const DETAIL_NATURE: Record<string, Detail> = {
  "Prestations monétaires": { texte: "Les sommes versées directement aux ménages : pensions, indemnités, allocations.", source: SRC.COMPTES },
  "Prestations en nature": { texte: "Les biens et services fournis ou pris en charge pour les ménages, notamment les soins remboursés.", source: SRC.COMPTES },
  "Rémunération des agents": { texte: "Les salaires et charges des agents des administrations publiques.", source: SRC.COMPTES },
  "Achats intermédiaires": { texte: "Les achats de biens et de services nécessaires au fonctionnement des administrations.", source: SRC.COMPTES },
  "Investissement brut": { texte: "Les dépenses d'investissement : bâtiments, infrastructures, équipements.", source: SRC.COMPTES },
  "Autres dépenses": {
    texte:
      "Le reste des dépenses : notamment les intérêts de la dette, les subventions et d'autres transferts.",
    source: SRC.COMPTES,
  },
};

/* ── 3. Dépenses par fonction (COFOG, 2025) ─────────────────────────────── */

interface FonctionDE {
  nom: string;
  total: number;
  texte: string;
  sous: [string, number][];
  notes?: string[];
}

export const FONCTIONS: FonctionDE[] = [
  {
    nom: "Protection sociale",
    total: 932.744,
    texte: "Les retraites, la maladie et l'incapacité de travail, la famille, le chômage, le logement et l'aide sociale. Les soins de santé sont une fonction à part.",
    sous: [
      ["Vieillesse", 453.932],
      ["Maladie et incapacité de travail", 153.346],
      ["Survivants", 85.513],
      ["Famille et enfants", 85.344],
      ["Chômage", 77.063],
      ["Exclusion et aide sociale", 24.861],
      ["Logement", 21.261],
      ["R&D protection sociale", 0.241],
      ["Autres", 31.183],
    ],
  },
  {
    nom: "Santé",
    total: 353.305,
    texte: "Les produits et dispositifs médicaux, les soins ambulatoires, les soins hospitaliers et la santé publique.",
    sous: [
      ["Soins hospitaliers", 134.979],
      ["Soins ambulatoires", 105.623],
      ["Produits et dispositifs médicaux", 81.171],
      ["Santé publique", 3.836],
      ["R&D santé", 3.852],
      ["Autres", 23.844],
    ],
  },
  {
    nom: "Services publics généraux",
    total: 283.151,
    texte: "Le fonctionnement des pouvoirs publics, l'administration générale, la recherche fondamentale et les charges de la dette : les opérations sur la dette publique sont rangées ici.",
    sous: [
      ["Exécutif, législatif, finances, fiscalité, affaires étrangères", 86.898],
      ["Services administratifs généraux", 70.159],
      ["Opérations sur la dette publique", 51.879],
      ["Recherche fondamentale", 45.794],
      ["Aide économique extérieure", 20.346],
      ["Autres services généraux", 7.328],
      ["R&D des services généraux", 0.747],
      ["Transferts généraux entre niveaux d'administration", 0],
    ],
  },
  {
    nom: "Affaires économiques",
    total: 252.065,
    texte: "L'action publique sur l'économie : emploi, agriculture, énergie, industrie, transports, télécommunications et recherche.",
    sous: [
      ["Transports", 136.084],
      ["Énergie et combustibles", 32.804],
      ["Affaires économiques et emploi", 31.084],
      ["R&D économique", 12.868],
      ["Autres", 11.113],
      ["Autres secteurs économiques", 9.527],
      ["Agriculture, forêts, pêche", 8.854],
      ["Industrie, mines, construction", 7.441],
      ["Télécommunications", 2.29],
    ],
  },
  {
    nom: "Enseignement",
    total: 206.743,
    texte: "Du préscolaire à l'enseignement supérieur et ses services auxiliaires.",
    sous: [
      ["Secondaire", 71.597],
      ["Préscolaire et primaire", 69.59],
      ["Supérieur", 35.331],
      ["Services auxiliaires", 20.015],
      ["Enseignement non classable", 3.867],
      ["Postsecondaire non supérieur", 3.104],
      ["Autres", 2.571],
      ["R&D", 0.668],
    ],
  },
  {
    nom: "Ordre et sécurité publics",
    total: 74.511,
    texte: "La police, les pompiers, les tribunaux et l'administration pénitentiaire.",
    sous: [
      ["Police", 34.566],
      ["Tribunaux", 17.059],
      ["Pompiers", 14.307],
      ["Administration pénitentiaire", 4.384],
      ["Autres services de sécurité", 4.133],
      ["R&D sécurité", 0.062],
    ],
  },
  {
    nom: "Défense",
    total: 68.554,
    texte: "Les armées, l'aide militaire extérieure, la défense civile et la recherche de défense.",
    sous: [
      ["Défense militaire", 50.835],
      ["Aide militaire extérieure", 15.852],
      ["R&D défense", 1.237],
      ["Autres dépenses de défense", 0.327],
      ["Défense civile", 0.303],
    ],
  },
  {
    nom: "Culture, sport, loisirs, culte",
    total: 46.537,
    texte: "La culture, le sport et les loisirs, l'audiovisuel et l'édition, et les affaires religieuses.",
    sous: [
      ["Culture", 18.331],
      ["Sports et loisirs", 12.33],
      ["Audiovisuel et édition", 11.393],
      ["R&D", 2.465],
      ["Autres", 1.062],
      ["Affaires religieuses", 0.956],
    ],
  },
  {
    nom: "Environnement",
    total: 24.411,
    texte: "Les déchets, les eaux usées, la lutte contre la pollution, la biodiversité et les paysages.",
    sous: [
      ["Gestion des déchets", 7.493],
      ["Traitement des eaux usées", 5.475],
      ["Lutte contre la pollution", 4.85],
      ["Biodiversité et paysages", 2.576],
      ["Autres", 2.121],
      ["R&D environnement", 1.896],
    ],
  },
  {
    nom: "Logement et équipements collectifs",
    total: 20.566,
    texte: "Le logement, l'urbanisme et l'aménagement, l'approvisionnement en eau et l'éclairage public.",
    sous: [
      ["Urbanisme et aménagement", 9.472],
      ["Logement", 5.466],
      ["Autres", 3.176],
      ["Approvisionnement en eau", 1.708],
      ["Éclairage public", 0.488],
      ["R&D logement", 0.256],
    ],
  },
];

export const SOMME_FONCTIONS = Math.round(FONCTIONS.reduce((s, f) => s + f.total, 0) * 1000) / 1000;
export const ECART_FONCTIONS = Math.round((DEPENSES_TOTAL - SOMME_FONCTIONS) * 1000) / 1000;

export const DEPENSES_FONCTION_LIGNES: Part[] = FONCTIONS.map((f) => ({ nom: f.nom, md: f.total }));

export const DETAIL_FONCTION: Record<string, Detail> = Object.fromEntries(
  FONCTIONS.map((f) => [
    f.nom,
    {
      texte: f.texte,
      notes: f.notes,
      vues: [
        {
          parts: f.sous.map(([nom, md]) => ({ nom, md })),
          total: f.total,
          resteNom: "Autres",
        },
      ],
      source: SRC.COFOG,
    } satisfies Detail,
  ]),
);
