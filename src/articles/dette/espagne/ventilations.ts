import type { Bareme, Detail, Part } from "../cadre/ventilation";
import { SOURCES } from "./donnees";

/* ═══════════════════════════════════════════════════════════════════════════
   ESPAGNE : CE QUI S'OUVRE SOUS CHAQUE LIGNE DES RECETTES, DES DÉPENSES ET DU DÉFICIT

   Source : « Dossier de données — dette publique de l'Espagne » (16 octobre 2026).
   Montants en milliards d'euros. Recettes et dépenses : INE, SEC 2010, édition actualisée.
   Impôts : encaissements de l'Agencia Tributaria (AEAT), un autre périmètre que les impôts
   de la comptabilité nationale : le détail porte sur les encaissements, et l'écart est dans « Autres recettes ».

   Ce que le dossier n'a pas vérifié (dépenses par fonction COFOG, déficit par sous-secteur,
   détail des impôts en comptabilité nationale) n'est pas écrit ici.
   ═══════════════════════════════════════════════════════════════════════════ */

export const SRC = {
  INE: { nom: "INE, comptes des administrations publiques 2025 (édition actualisée)", url: SOURCES.INE },
  AEAT: { nom: "Agencia Tributaria, rapport annuel de recouvrement 2025", url: SOURCES.AEAT },
  IRPF: { nom: "Agencia Tributaria, manuel IRPF 2025", url: SOURCES.AEAT_IRPF },
};

const arrondi3 = (v: number) => Math.round(v * 1000) / 1000;

/* ── 1. Recettes (INE, SEC 2010, 2025) ───────────────────────────────────── */

export const RECETTES_TOTAL = 725.655;
const IMPOTS_SEC = 418.258;
const COTISATIONS = 223.23;
const AUTRES_NON_FISCALES = 84.167;
export const FAMILLES_RECETTES = [{ nom: "Impôts" }, { nom: "Cotisations sociales" }, { nom: "Autres recettes" }];

/* Les impôts encaissés par l'AEAT. */
const IRPF = 142.466;
const IS = 42.266;
const TVA = 99.532;
const ACCISES = 23.083;
const AUTRES_AEAT = 18.009;
export const AEAT_TOTAL = arrondi3(IRPF + IS + TVA + ACCISES + AUTRES_AEAT);
/* Les impôts de la comptabilité nationale que l'AEAT n'encaisse pas (régionaux, locaux) et les écarts de convention. */
const IMPOTS_HORS_AEAT = arrondi3(IMPOTS_SEC - AEAT_TOTAL);
const AUTRES_RECETTES = arrondi3(AUTRES_NON_FISCALES + IMPOTS_HORS_AEAT);

const BAREME_IRPF: Bareme = {
  titre: "Barème de l'État 2025, base générale (les communautés autonomes ajoutent leur taux)",
  lignes: [
    { libelle: "De 0 à 12 450 €", taux: 9.5, texte: "9,5 %" },
    { libelle: "De 12 450 à 20 200 €", taux: 12, texte: "12 %" },
    { libelle: "De 20 200 à 35 200 €", taux: 15, texte: "15 %" },
    { libelle: "De 35 200 à 60 000 €", taux: 18.5, texte: "18,5 %" },
    { libelle: "De 60 000 à 300 000 €", taux: 22.5, texte: "22,5 %" },
    { libelle: "Au-delà de 300 000 €", taux: 24.5, texte: "24,5 %" },
  ],
};
const BAREME_EPARGNE: Bareme = {
  titre: "Revenus de l'épargne 2025, taux total (moitié État, moitié communauté)",
  lignes: [
    { libelle: "De 0 à 6 000 €", taux: 19, texte: "19 %" },
    { libelle: "De 6 000 à 50 000 €", taux: 21, texte: "21 %" },
    { libelle: "De 50 000 à 200 000 €", taux: 23, texte: "23 %" },
    { libelle: "De 200 000 à 300 000 €", taux: 27, texte: "27 %" },
    { libelle: "Au-delà de 300 000 €", taux: 30, texte: "30 %" },
  ],
};

export const RECETTES_LIGNES: Part[] = [
  { nom: "Cotisations sociales", md: COTISATIONS, famille: 1 },
  { nom: "Autres recettes", md: AUTRES_RECETTES, famille: 2 },
  { nom: "Impôt sur le revenu (IRPF)", md: IRPF, famille: 0, taux: "9,5 à 24,5 % + région" },
  { nom: "TVA", md: TVA, famille: 0, taux: "4, 10 ou 21 %" },
  { nom: "Impôt sur les sociétés", md: IS, famille: 0, taux: "25 %" },
  { nom: "Accises", md: ACCISES, famille: 0 },
  { nom: "Autres impôts", md: AUTRES_AEAT, famille: 0 },
];

export const DETAIL_RECETTES: Record<string, Detail> = {
  "Cotisations sociales": {
    texte: "Les cotisations versées par les salariés, les employeurs et les indépendants pour financer les retraites, l'assurance maladie, le chômage et les autres prestations de sécurité sociale.",
    source: SRC.INE,
  },
  "Autres recettes": {
    texte:
      "Le reste des recettes publiques : les ventes et la production des administrations, les revenus de leur patrimoine, les transferts reçus, et les impôts que l'Agencia Tributaria n'encaisse pas (impôts régionaux et locaux) avec les écarts de convention entre comptabilité nationale et encaissements.",
    vues: [
      {
        parts: [
          { nom: "Impôts hors Agencia Tributaria et écarts de comptabilité", md: IMPOTS_HORS_AEAT },
          { nom: "Ventes et production des administrations", md: 38.615 },
          { nom: "Transferts en capital et subventions d'investissement", md: 17.989 },
          { nom: "Autres transferts courants", md: 14.7 },
          { nom: "Revenus de la propriété", md: 12.863 },
        ],
        total: AUTRES_RECETTES,
      },
    ],
    source: SRC.INE,
  },
  "Impôt sur le revenu (IRPF)": {
    texte:
      "L'impôt sur le revenu des personnes physiques. Il se compose d'un barème de l'État, auquel chaque communauté autonome ajoute le sien : il n'existe pas de barème final unique en Espagne. Les revenus de l'épargne ont leur propre barème, de 19 % jusqu'à 6 000 € à 30 % au-delà de 300 000 €.",
    baremes: [BAREME_IRPF, BAREME_EPARGNE],
    source: SRC.IRPF,
  },
  TVA: {
    texte: "La taxe payée par le consommateur sur la plupart des biens et des services. Trois taux existent : 21 % (taux normal), 10 % (taux réduit) et 4 % (taux super-réduit), selon le produit ou le service.",
    source: { nom: "Agencia Tributaria, TVA 2025", url: "https://sede.agenciatributaria.gob.es/Sede/estadisticas/recaudacion-tributaria/informe-anual/ejercicio-2025/4-impuesto-sobre-valor-anadido.html" },
  },
  "Impôt sur les sociétés": {
    texte: "L'impôt sur les bénéfices des sociétés. Le taux normal est de 25 %.",
    source: { nom: "Agencia Tributaria, impôt sur les sociétés", url: "https://sede.agenciatributaria.gob.es/Sede/impuesto-sobre-sociedades/que-base-imponible-se-determina-sociedades/tipo-impositivo.html" },
  },
  Accises: {
    texte: "Les impôts spéciaux sur des produits précis : carburants, tabac, électricité, cigarette électronique.",
    vues: [
      {
        parts: [
          { nom: "Hydrocarbures", md: 12.366, taux: "selon le carburant" },
          { nom: "Tabac", md: 7.34, taux: "prix + quantité" },
          { nom: "Électricité", md: 1.587, taux: "5,11 %" },
          { nom: "Liquides de cigarette électronique", md: 0.03, taux: "selon le produit" },
        ],
        total: ACCISES,
      },
    ],
    source: { nom: "Agencia Tributaria, impôts spéciaux 2025", url: "https://sede.agenciatributaria.gob.es/Sede/estadisticas/recaudacion-tributaria/informe-anual/ejercicio-2025/5-impuestos-especiales.html" },
  },
  "Autres impôts": {
    texte: "Les autres impôts encaissés par l'Agencia Tributaria, dont l'impôt sur les non-résidents et l'impôt sur les marges des banques.",
    vues: [
      {
        parts: [
          { nom: "Impôt sur les non-résidents (IRNR)", md: 5.397, taux: "variable" },
          { nom: "Impôt sur les marges d'intérêts et commissions des banques", md: 1.423, taux: "progressif" },
        ],
        total: AUTRES_AEAT,
      },
    ],
    source: { nom: "Agencia Tributaria, autres impôts 2025", url: "https://sede.agenciatributaria.gob.es/Sede/estadisticas/recaudacion-tributaria/informe-anual/ejercicio-2025/6-otros-impuestos.html" },
  },
};

/* ── 2. Dépenses par nature (INE, SEC 2010, 2025) ────────────────────────── */

export const DEPENSES_TOTAL = 766.296;

/* Cinq petites opérations (autres impôts sur la production payés 0,727 ; autres revenus de la propriété 0,019 ;
   impôts courants payés 0,026 ; variation des stocks −0,020 ; actifs non produits −0,945) forment un net légèrement négatif. */
const AUTRES_OPERATIONS = arrondi3(0.727 + 0.019 + 0.026 - 0.02 - 0.945);

export const DEPENSES_NATURE_LIGNES: Part[] = [
  { nom: "Prestations sociales", md: 330.751 },
  { nom: "Rémunération des salariés", md: 181.502 },
  { nom: "Consommations intermédiaires", md: 96.321 },
  { nom: "Investissement (formation brute de capital fixe)", md: 50.628 },
  { nom: "Intérêts", md: 40.432 },
  { nom: "Autres transferts courants", md: 27.524 },
  { nom: "Subventions", md: 19.903 },
  { nom: "Transferts en capital", md: 19.428 },
  { nom: "Autres opérations (net)", md: AUTRES_OPERATIONS },
];

export const DETAIL_NATURE: Record<string, Detail> = {
  "Prestations sociales": { texte: "Les pensions, les indemnités de chômage, les allocations et les prestations de santé versées aux ménages : la première dépense publique par nature.", source: SRC.INE },
  "Rémunération des salariés": { texte: "Les salaires et les charges des agents des administrations publiques : État, communautés autonomes, collectivités locales et sécurité sociale.", source: SRC.INE },
  "Consommations intermédiaires": { texte: "Les achats de biens et de services nécessaires au fonctionnement des administrations.", source: SRC.INE },
  "Investissement (formation brute de capital fixe)": { texte: "Les dépenses d'investissement : bâtiments, infrastructures, équipements.", source: SRC.INE },
  Intérêts: { texte: "Le coût du service de la dette sur l'année. Ce n'est pas le remboursement du capital, qui n'est pas une dépense dans ce tableau.", source: SRC.INE },
  "Autres transferts courants": { texte: "Les transferts courants versés qui ne sont ni des prestations sociales ni des subventions.", source: SRC.INE },
  Subventions: { texte: "Les aides versées aux entreprises et aux secteurs soutenus par les administrations.", source: SRC.INE },
  "Transferts en capital": { texte: "Les aides à l'investissement et les autres transferts en capital versés par les administrations.", source: SRC.INE },
  "Autres opérations (net)": {
    texte:
      "Les autres impôts sur la production payés, les autres revenus de la propriété versés, les impôts courants payés, la variation des stocks et les acquisitions nettes d'actifs non produits : des montants positifs et négatifs qui se compensent presque.",
    source: SRC.INE,
  },
};
