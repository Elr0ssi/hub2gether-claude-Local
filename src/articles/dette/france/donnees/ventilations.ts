import type { Bareme, Detail, Part } from "../../cadre/ventilation";

/* ═══════════════════════════════════════════════════════════════════════════
   FRANCE : CE QUI S'OUVRE SOUS CHAQUE LIGNE DES RECETTES, DES DÉPENSES ET DU DÉFICIT

   Source de ce fichier : « Dossier de fond vérifié — France et Allemagne »
   (état de la recherche du 16 octobre 2026). Montants en milliards d'euros.

   Trois rappels qui évitent les erreurs :
     - un montant écrit « dont » est inclus dans son parent : il n'est jamais ajouté ;
     - on ne mélange pas deux éditions d'une même statistique (mai / août 2026) ;
     - les ventilations par fonction (2024) ne s'ajoutent pas aux dépenses par nature (2025).
   Les montants écrits dans un texte s'écrivent [[valeur]] : ils sont convertis dans la monnaie du menu.
   ═══════════════════════════════════════════════════════════════════════════ */

export const SRC = {
  APU: { nom: "Insee, comptes des administrations publiques 2025 (mai 2026), figure 4", url: "https://www.insee.fr/fr/statistiques/8997691" },
  IMPOTS: { nom: "Insee, impôts et cotisations 2025 (28 août 2026)", url: "https://www.insee.fr/fr/statistiques/2381408" },
  COFOG: { nom: "Insee, dépenses des administrations publiques par fonction 2024", url: "https://www.insee.fr/fr/statistiques/8735252" },
  DREES: {
    nom: "DREES, La protection sociale en France et en Europe en 2024 (édition 2025)",
    url: "https://drees.solidarites-sante.gouv.fr/sites/default/files/2026-03/La%20protection%20sociale%20en%20France%20et%20en%20Europe%20en%202024.pdf",
  },
  AOUT: { nom: "Insee, comptes des administrations publiques (août 2026)", url: "https://www.insee.fr/fr/statistiques/2381402" },
};

/* ── 1. Les recettes (2025) ─────────────────────────────────────────────── */

/* Les grandes familles : une couleur chacune sur la barre et sur les lignes. */
export const FAMILLES_RECETTES = [{ nom: "Impôts" }, { nom: "Cotisations sociales" }, { nom: "Autres recettes" }];

/* Les tarifs, les barèmes : un petit tableau derrière le bouton « barème ». */
const BAREME_IR: Bareme = {
  titre: "Barème 2025 (revenus 2024), par part de quotient familial",
  lignes: [
    { libelle: "Jusqu'à 11 497 €", taux: 0, texte: "0 %" },
    { libelle: "De 11 497 à 29 315 €", taux: 11, texte: "11 %" },
    { libelle: "De 29 315 à 83 823 €", taux: 30, texte: "30 %" },
    { libelle: "De 83 823 à 180 294 €", taux: 41, texte: "41 %" },
    { libelle: "Au-delà de 180 294 €", taux: 45, texte: "45 %" },
  ],
};
const BAREME_IFI: Bareme = {
  titre: "Barème de l'IFI, par tranche de patrimoine immobilier net",
  lignes: [
    { libelle: "Jusqu'à 800 000 €", taux: 0, texte: "0 %" },
    { libelle: "De 800 000 à 1,3 M€", taux: 0.5, texte: "0,5 %" },
    { libelle: "De 1,3 à 2,57 M€", taux: 0.7, texte: "0,7 %" },
    { libelle: "De 2,57 à 5 M€", taux: 1, texte: "1 %" },
    { libelle: "De 5 à 10 M€", taux: 1.25, texte: "1,25 %" },
    { libelle: "Au-delà de 10 M€", taux: 1.5, texte: "1,5 %" },
  ],
};
const TARIFS_ENERGIE: Bareme = {
  titre: "Accise hors TVA, ordre de grandeur (varie selon les régions)",
  lignes: [
    { libelle: "Essence (SP95-E5)", texte: "environ 0,68 €/litre" },
    { libelle: "Gazole", texte: "environ 0,59 €/litre" },
    { libelle: "Électricité (ménages, février à juillet)", texte: "33,70 €/MWh" },
  ],
};
const TARIFS_ALCOOLS: Bareme = {
  titre: "Droits d'accise, hors TVA",
  lignes: [
    { libelle: "Bière", texte: "4,05 ou 8,10 €/hl par degré" },
    { libelle: "Vin tranquille", texte: "4,12 €/hl" },
    { libelle: "Vin mousseux", texte: "10,20 €/hl" },
    { libelle: "Spiritueux", texte: "1 899,18 €/hl d'alcool pur" },
  ],
};
const TARIFS_VEHICULES: Bareme = {
  titre: "Malus à l'immatriculation",
  lignes: [
    { libelle: "Malus CO₂ (depuis mars 2025)", texte: "de 50 € à 70 000 €" },
    { libelle: "Malus au poids, au-delà de 1 600 kg", texte: "10 à 30 €/kg par tranche" },
  ],
};

/* Les impôts, tels que la publication Insee du 28 août 2026 les range. IRPP et IS sont publiés avant crédits d'impôt. */
const IMPOTS = {
  revenu: 383.3,
  tva: 208.8,
  produits: 128.1,
  production: 72.7,
  salaires: 60.1,
  capital: 21.7,
  courants: 6.6,
  importations: 3.6,
};
const arrondi = (v: number) => Math.round(v * 10) / 10;
const DIVERS = arrondi(IMPOTS.capital + IMPOTS.courants + IMPOTS.importations);
export const IMPOTS_TOTAL = arrondi(IMPOTS.revenu + IMPOTS.tva + IMPOTS.produits + IMPOTS.production + IMPOTS.salaires + DIVERS);
/* Le prélèvement obligatoire (impôts + cotisations sociales, cotisations imputées comprises) : Insee, comptes APU 2025. */
const PRELEVEMENT_OBLIGATOIRE = 1374.1;
export const COTISATIONS = arrondi(PRELEVEMENT_OBLIGATOIRE - IMPOTS_TOTAL);

export const RECETTES_LIGNES: Part[] = [
  { nom: "Cotisations sociales", md: COTISATIONS, famille: 1, note: "cotisations imputées comprises" },
  { nom: "Impôts courants sur le revenu", md: IMPOTS.revenu, famille: 0 },
  { nom: "TVA", md: IMPOTS.tva, famille: 0, taux: "2,1 à 20 %" },
  { nom: "Recettes de production", md: 129.2, famille: 2 },
  { nom: "Autres impôts sur les produits", md: IMPOTS.produits, famille: 0 },
  { nom: "Autres impôts sur la production", md: IMPOTS.production, famille: 0 },
  { nom: "Impôts sur salaires et main-d'œuvre", md: IMPOTS.salaires, famille: 0 },
  { nom: "Autres transferts", md: 35.5, famille: 2 },
  { nom: "Divers impôts", md: DIVERS, famille: 0, note: "capital, patrimoine, importations" },
  { nom: "Revenus de la propriété", md: 23.0, famille: 2 },
];

export const DETAIL_RECETTES: Record<string, Detail> = {
  "Cotisations sociales": {
    texte:
      "Ce que salariés, employeurs et indépendants versent pour financer les retraites, l'assurance maladie, la famille et le chômage, y compris les cotisations dites imputées que les employeurs publics sont réputés verser pour les prestations servies à leurs agents. Montant : le prélèvement obligatoire total ([[1374.1]]) moins les impôts de cette liste.",
    source: SRC.APU,
  },
  "Impôts courants sur le revenu": {
    texte: "Les impôts qui frappent les revenus des ménages et les bénéfices des entreprises.",
    vues: [
      {
        parts: [
          { nom: "CSG", md: 156.6, taux: "9,2 % sur l'activité" },
          { nom: "Impôt sur le revenu", md: 103.6, note: "avant crédits d'impôt", taux: "0 à 45 %", bareme: BAREME_IR },
          { nom: "Impôt sur les sociétés", md: 69.5, note: "avant crédits d'impôt", taux: "25 %" },
          { nom: "CRDS", md: 9.3, taux: "0,5 %" },
        ],
        total: IMPOTS.revenu,
      },
    ],
    source: SRC.IMPOTS,
  },
  TVA: {
    texte:
      "La taxe payée par le consommateur sur la plupart des biens et des services. Quatre taux existent en métropole : 20 % (taux normal), 10 %, 5,5 % et 2,1 %, selon le produit ou le service.",
    source: SRC.IMPOTS,
  },
  "Recettes de production": {
    texte: "Ce que les administrations vendent ou facturent pour les biens et les services qu'elles produisent : les recettes de leur activité, hors impôts.",
    source: SRC.APU,
  },
  "Autres impôts sur les produits": {
    texte: "Les taxes sur la consommation de produits particuliers : énergie, tabac, assurances, alcools, jeux, transactions financières, véhicules polluants.",
    vues: [
      {
        parts: [
          { nom: "Énergie", md: 30.5, taux: "selon le produit", bareme: TARIFS_ENERGIE },
          { nom: "Tabac", md: 13.6, taux: "prix + quantité" },
          { nom: "Assurances", md: 12.6, taux: "9 % ou 18 %" },
          { nom: "Complémentaires santé", md: 6.558, taux: "13,27 %" },
          { nom: "Jeux et paris", md: 5.9, taux: "variable" },
          { nom: "Alcools", md: 4.2, taux: "selon le volume et le degré", bareme: TARIFS_ALCOOLS },
          { nom: "Transactions financières", md: 2.5, taux: "0,3 % puis 0,4 %" },
          { nom: "Véhicules polluants", md: Math.round((1.032 + 0.967) * 1000) / 1000, taux: "selon CO₂ et poids", bareme: TARIFS_VEHICULES },
        ],
        total: IMPOTS.produits,
        precision:
          "Énergie et tabac : Insee. Autres taxes : DGFiP, Compte général de l'État et Sécurité sociale, d'autres comptabilités : ce sont des ordres de grandeur.",
      },
    ],
    source: SRC.IMPOTS,
  },
  "Autres impôts sur la production": {
    texte: "Les impôts qui pèsent sur l'activité des entreprises et sur la propriété.",
    vues: [
      {
        parts: [
          { nom: "Taxe foncière", md: 44.2, taux: "variable" },
          { nom: "Cotisation foncière des entreprises", md: 8.1, taux: "variable" },
          { nom: "Contribution sociale de solidarité (C3S)", md: 5.3, taux: "0,16 % du CA au-delà de 19 M€" },
          { nom: "CVAE", md: 3.7, taux: "0 à 0,19 % du CA" },
        ],
        total: IMPOTS.production,
      },
    ],
    source: SRC.IMPOTS,
  },
  "Impôts sur salaires et main-d'œuvre": {
    texte: "Les impôts assis sur la masse salariale, dont la taxe sur les salaires que paient les employeurs peu ou pas soumis à la TVA.",
    vues: [
      {
        parts: [{ nom: "Taxe sur les salaires", md: 17.6, taux: "4,25 à 13,6 %" }],
        total: IMPOTS.salaires,
      },
    ],
    source: SRC.IMPOTS,
  },
  "Autres transferts": {
    texte: "Les transferts que les administrations reçoivent et qui ne sont ni des impôts ni des cotisations sociales.",
    source: SRC.APU,
  },
  "Divers impôts": {
    texte: "Les impôts sur le capital et le patrimoine, et les droits perçus sur les importations.",
    vues: [
      {
        parts: [
          { nom: "Droits de succession et donations", md: 21.1, taux: "5 à 45 %" },
          { nom: "Droits sur les importations", md: 3.6, taux: "selon la marchandise" },
          { nom: "Taxe d'habitation", md: 2.9, taux: "variable" },
          { nom: "Impôt sur la fortune immobilière", md: 2.7, taux: "0 à 1,5 %", bareme: BAREME_IFI },
        ],
        total: DIVERS,
      },
    ],
    source: SRC.IMPOTS,
  },
  "Revenus de la propriété": {
    texte: "Les revenus que les administrations tirent de leur patrimoine : intérêts, dividendes et autres revenus de la propriété.",
    source: SRC.APU,
  },
};

/* ── 2. Les dépenses par nature (2025) ──────────────────────────────────── */

export const DEPENSES_NATURE_LIGNES: Part[] = [
  { nom: "Prestations sociales en espèces et en nature", md: 771.0 },
  { nom: "Fonctionnement", md: 548.8 },
  { nom: "Autres transferts et subventions", md: 192.1 },
  { nom: "Acquisitions nettes d'actifs non financiers", md: 137.7 },
  { nom: "Intérêts", md: 64.7 },
];
export const DEPENSES_NATURE_TOTAL = 1714.2;

export const DETAIL_NATURE: Record<string, Detail> = {
  "Prestations sociales en espèces et en nature": {
    texte:
      "Les pensions, les allocations et les services remboursés : retraites, assurance maladie, famille, chômage, minima sociaux. C'est de loin la première dépense publique par nature. Le détail par risque figure dans la lecture par fonction, à la ligne « Protection sociale ».",
    source: SRC.APU,
  },
  Fonctionnement: {
    texte: "Ce que coûte le fonctionnement courant des administrations : les salaires des agents publics et les achats de biens et de services.",
    vues: [
      {
        parts: [
          { nom: "Rémunérations des salariés", md: 370.0 },
          { nom: "Consommations intermédiaires", md: 164.6 },
        ],
        total: 548.8,
        resteNom: "Autres dépenses de fonctionnement",
      },
    ],
    source: SRC.APU,
  },
  "Autres transferts et subventions": {
    texte: "Les transferts versés hors prestations sociales, et les subventions.",
    source: SRC.APU,
  },
  "Acquisitions nettes d'actifs non financiers": {
    texte: "Les investissements nets et les autres acquisitions d'actifs non financiers : bâtiments, routes, équipements.",
    vues: [
      {
        parts: [{ nom: "Formation brute de capital fixe", md: 132.2 }],
        total: 137.7,
        resteNom: "Autres acquisitions",
      },
    ],
    source: SRC.APU,
  },
  Intérêts: {
    texte: "Le coût du service de la dette sur l'année. Ce n'est pas le remboursement du capital, qui n'est pas une dépense dans ce tableau.",
    source: SRC.APU,
  },
};

/* ── 3. Les dépenses par fonction (2024) ────────────────────────────────── */

interface FonctionFR {
  nom: string;
  total: number;
  texte: string;
  /** Salaires, achats, transferts, intérêts, prestations en espèces, prestations en nature, investissement. */
  nature: [number, number, number, number, number, number, number];
  /** Administrations centrales, locales, sécurité sociale. */
  admin: [number, number, number];
  notes?: string[];
}

const NATURE_NOMS = [
  "Rémunérations des salariés",
  "Achats de biens et de services",
  "Transferts et subventions",
  "Intérêts",
  "Prestations sociales en espèces",
  "Prestations sociales en nature",
  "Investissement",
];
const ADMIN_NOMS = ["Administrations centrales", "Administrations locales", "Sécurité sociale"];

export const FONCTIONS: FonctionFR[] = [
  {
    nom: "Protection sociale",
    total: 693,
    texte: "Les retraites et pensions de réversion, la famille, le chômage, le logement et les minima sociaux. La santé est une fonction à part.",
    nature: [32, 11, 45, 0, 556, 45, 4],
    admin: [133, 59, 501],
    notes: [
      "Autres montants de la même publication, lus par objet et non additionnables : dépenses liées au chômage et à la formation des demandeurs d'emploi [[49|0]] ; aides aux familles [[67|0]].",
      "La CAF est un organisme payeur, pas une catégorie de dépense : ses versements sont répartis entre famille, logement et pauvreté.",
    ],
  },
  {
    nom: "Santé",
    total: 261,
    texte: "Les produits et appareils médicaux, les soins de ville, les soins hospitaliers et la santé publique, presque entièrement portés par la sécurité sociale.",
    nature: [70, 34, 11, 0, 0, 136, 10],
    admin: [9, 2, 250],
    notes: [
      "Une autre lecture, par type de service : les services hospitaliers publics représentent [[109|0]]. Elle ne s'ajoute pas aux salaires ci-dessous.",
      "Évolutions 2023 → 2024 : hospitalier public +[[6|0]] ; soins ambulatoires +[[4|0]] ; biens médicaux remboursés +[[2|0]]. Ce sont des variations, pas des niveaux.",
    ],
  },
  {
    nom: "Services publics généraux",
    total: 181,
    texte: "Le fonctionnement des pouvoirs publics, l'administration générale, la recherche fondamentale et les opérations sur la dette publique : les intérêts de la dette sont rangés ici.",
    nature: [48, 16, 35, 60, 0, 0, 22],
    admin: [114, 59, 8],
  },
  {
    nom: "Affaires économiques",
    total: 166,
    texte: "L'action publique sur l'économie : emploi, agriculture, énergie, industrie, transports, communications et recherche appliquée.",
    nature: [20, 27, 84, 0, 0, 0, 34],
    admin: [111, 55, 1],
  },
  {
    nom: "Enseignement",
    total: 149,
    texte: "Du préscolaire à l'enseignement supérieur et ses services annexes. Les pensions des anciens enseignants sont comptées dans la protection sociale.",
    nature: [104, 14, 9, 0, 6, 5, 12],
    admin: [104, 45, 0],
  },
  {
    nom: "Défense",
    total: 54,
    texte: "Les armées, l'aide militaire et la recherche de défense. Cette mesure fonctionnelle ne se compare pas directement à la mission budgétaire « Défense » de l'État : ni la période ni la comptabilité ne sont les mêmes.",
    nature: [22, 20, 2, 0, 0, 0, 11],
    admin: [54, 0, 0],
  },
  {
    nom: "Ordre et sécurité publics",
    total: 52,
    texte: "La police, les pompiers, les tribunaux et l'administration pénitentiaire.",
    nature: [36, 9, 2, 0, 0, 0, 4],
    admin: [42, 10, 0],
  },
  {
    nom: "Loisirs, culture et culte",
    total: 43,
    texte: "Le sport et les loisirs, la culture, l'audiovisuel et l'édition, et les cultes.",
    nature: [15, 11, 7, 0, 0, 0, 10],
    admin: [13, 30, 0],
  },
  {
    nom: "Logement et équipements collectifs",
    total: 42,
    texte: "Le logement, l'aménagement urbain, l'approvisionnement en eau et l'éclairage public.",
    nature: [9, 8, 8, 0, 0, 0, 18],
    admin: [6, 36, 0],
  },
  {
    nom: "Protection de l'environnement",
    total: 30,
    texte: "Les déchets, les eaux usées, la lutte contre la pollution, la biodiversité et les paysages.",
    nature: [6, 12, 5, 0, 0, 0, 7],
    admin: [5, 26, 0],
  },
];
export const FONCTIONS_TOTAL = 1672;

const versParts = (noms: string[], valeurs: number[]): Part[] => noms.map((nom, i) => ({ nom, md: valeurs[i] }));

/* L'Insee ne représente que les flux supérieurs à 10 Md€ : une case vide n'est pas un zéro exact, et les
   parts ne se lisent pas au dixième de pourcentage. */
const PRECISION_FONCTION = "Montants arrondis à l'unité.";

const DREES_RISQUES: Part[] = [
  { nom: "Vieillesse et survie", md: 426.7, note: "Pensions de retraite et pensions de réversion" },
  { nom: "Santé", md: 338.9, note: "Maladie, invalidité, accidents du travail" },
  { nom: "Famille", md: 65.8, note: "Allocations familiales, aides à l'enfance" },
  { nom: "Emploi", md: 51.1, note: "Indemnisation du chômage" },
  { nom: "Pauvreté et exclusion sociale", md: 34.0, note: "Minima sociaux, aide à l'insertion" },
  { nom: "Logement", md: 16.1, note: "Aides au logement" },
];

export const DEPENSES_FONCTION_LIGNES: Part[] = FONCTIONS.map((f) => ({ nom: f.nom, md: f.total }));

export const DETAIL_FONCTION: Record<string, Detail> = Object.fromEntries(
  FONCTIONS.map((f) => {
    const vues = [
      { titre: "Par nature de dépense", parts: versParts(NATURE_NOMS, f.nature), total: f.total, pctDecimales: 0, resteNom: "Autres", precision: PRECISION_FONCTION },
      { titre: "Par administration", parts: versParts(ADMIN_NOMS, f.admin), total: f.total, pctDecimales: 0, resteNom: "Autres" },
    ];
    if (f.nom === "Protection sociale") {
      vues.push({
        titre: "Par risque (DREES, autre périmètre)",
        parts: DREES_RISQUES,
        total: 932.5,
        pctDecimales: 1,
        resteNom: "Autres",
        precision: "Mesure plus large que la fonction ci-dessus : l'ensemble des prestations de protection sociale (2024), santé incluse.",
      });
    }
    const detail: Detail = {
      texte: f.texte,
      notes: f.notes,
      vues,
      source: SRC.COFOG,
    };
    return [f.nom, detail];
  }),
);

/* ── 4. Le déficit par administration (2025, Insee, mai 2026) ───────────── */

export const DEFICIT_LIGNES: Part[] = [
  { nom: "État", md: 128.1 },
  { nom: "Administrations locales", md: 15.6 },
  { nom: "Administrations de sécurité sociale", md: 6.7 },
  { nom: "Organismes divers d'administration centrale", md: 2.2 },
];
export const DEFICIT_TOTAL = 152.5;

export const DETAIL_DEFICIT: Record<string, Detail> = {
  État: {
    texte: "Le solde du budget de l'État, en comptabilité nationale : c'est de loin la plus grande part du déficit. Il ne se confond pas avec le solde du budget voté, qui obéit à une autre comptabilité.",
    source: SRC.APU,
  },
  "Administrations locales": {
    texte: "Les collectivités territoriales (communes, départements, régions) et les organismes divers d'administration locale.",
    vues: [
      {
        parts: [
          { nom: "Collectivités territoriales", md: 9.3 },
          { nom: "Organismes divers d'administration locale", md: 6.2 },
        ],
        total: 15.6,
        resteNom: "Autres",
      },
    ],
    source: SRC.APU,
  },
  "Administrations de sécurité sociale": {
    texte: "Les régimes de sécurité sociale et organismes associés : retraites, assurance maladie, famille, chômage.",
    source: SRC.AOUT,
  },
  "Organismes divers d'administration centrale": {
    texte: "Des organismes nationaux distincts de l'État, financés par lui ou par des recettes propres.",
    source: SRC.APU,
  },
};
