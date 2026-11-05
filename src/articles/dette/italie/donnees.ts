/* ═══════════════════════════════════════════════════════════════════════════
   DETTE PUBLIQUE DE L'ITALIE : LES DONNÉES DE L'ARTICLE

   Source de ce fichier : « Dossier complet de données : la dette publique de l'Italie »
   (arrêté au 17 octobre 2026). Montants en MILLIARDS D'EUROS (l'euro est la monnaie
   nationale), ratios en %.

   Règles : une seule édition par tableau ; un « dont » n'est jamais ajouté à son parent ;
   ce que le dossier n'a pas vérifié (« ? ») n'est pas écrit ici, ni estimé.
   Éditions : stocks et détenteurs = Banca d'Italia, 15/10/2026 ; comptes 2025 = ISTAT, 22/09/2026 ;
   comparaison européenne = Eurostat, 22/04/2026 (seule édition mélangée à rien d'autre).
   ═══════════════════════════════════════════════════════════════════════════ */

export interface Mesure {
  valeur: number;
  unite: "Md EUR" | "% PIB" | "%" | "ans";
  periode: string;
  perimetre: string;
  source: string;
  url: string;
}

export const SOURCES = {
  BDI: "https://www.bancaditalia.it/pubblicazioni/finanza-pubblica/2026-finanza-pubblica/statistiche_FPI_20261015.pdf",
  BDI_PAGE: "https://www.bancaditalia.it/media/notizia/finanza-pubblica-fabbisogno-e-debito-agosto-2026/",
  BDI_INFOSTAT: "https://infostat.bancaditalia.it/inquiry/home",
  ISTAT: "https://www.istat.it/wp-content/uploads/2026/09/CONTI-ECONOMICI-NAZIONALI_2010-2025-22settembre2026.pdf",
  ISTAT_PAGE: "https://www.istat.it/comunicato-stampa/conti-economici-nazionali-anni-2010-2025/",
  EUROSTAT: "https://ec.europa.eu/eurostat/en/web/products-euro-indicators/w/2-22042026-ap",
  MEF_TESORO: "https://www.dt.mef.gov.it/",
  MEF: "https://www.mef.gov.it/",
  RGS: "https://www.rgs.mef.gov.it/",
  OPENBDAP: "https://openbdap.rgs.mef.gov.it/it/News/Index/655",
  GAZZETTA: "https://www.gazzettaufficiale.it/atto/serie_generale/caricaArticoloDefault/originario?atto.codiceRedazionale=26A04302&atto.dataPubblicazioneGazzetta=2026-08-21&atto.tipoProvvedimento=DECRETO",
  SENAT: "https://www.senato.it/show-doc?id=1523683&idoggetto=0&leg=19&part=dossier_dossier1-sezione_sezione5-h2_h29&tipodoc=DOSSIER",
  FINANZE: "https://www.finanze.gov.it/",
  AGENZIA_ENTRATE: "https://www.agenziaentrate.gov.it/portale/",
  ADM: "https://www.adm.gov.it/",
  NORMATTIVA: "https://www.normattiva.it/",
  CORTE_CONTI: "https://www.corteconti.it/",
  UPB: "https://www.upbilancio.it/",
  CAMERA: "https://www.camera.it/",
  SENATO: "https://www.senato.it/",
  COMMISSION_GOUVERNANCE: "https://economy-finance.ec.europa.eu/economic-and-fiscal-governance_en",
  PNRR: "https://commission.europa.eu/strategy-and-policy/recovery-plan-europe_en",
};

const mes = (valeur: number, unite: Mesure["unite"], periode: string, perimetre: string, source: string, url: string): Mesure => ({ valeur, unite, periode, perimetre, source, url });

/* ── L'essentiel ────────────────────────────────────────────────────────── */

export const DETTE = mes(3200.848, "Md EUR", "fin août 2026", "Dette brute consolidée de toutes les administrations publiques, définition Maastricht, valeur nominale, estimation provisoire", "Banca d'Italia, 15 octobre 2026", SOURCES.BDI);
export const DETTE_JUILLET = 3206.996;
export const VARIATION_MOIS = -6.148;
export const DETTE_2025 = mes(3097.093, "Md EUR", "fin 2025", "Dette Maastricht de toutes les administrations publiques, édition d'octobre 2026", "Banca d'Italia, 15 octobre 2026", SOURCES.BDI);
export const RATIO_2025 = mes(136.7, "% PIB", "fin 2025", "Dette Maastricht de 3 097,093 Md€ rapportée au PIB nominal 2025 de 2 265,003 Md€", "Banca d'Italia ; ISTAT", SOURCES.BDI);
export const PIB_2025 = mes(2265.003, "Md EUR", "année 2025", "PIB nominal aux prix courants, comptes révisés", "ISTAT, 22 septembre 2026", SOURCES.ISTAT);
export const DEFICIT_2025 = mes(69.736, "Md EUR", "année 2025", "Besoin de financement des administrations publiques, SEC 2010, comptes révisés (valeur absolue)", "ISTAT, 22 septembre 2026", SOURCES.ISTAT);
export const DEFICIT_PCT_PIB = 3.1;
export const RECETTES_2025 = mes(1087.919, "Md EUR", "année 2025", "Recettes des administrations publiques, SEC 2010", "ISTAT, 22 septembre 2026", SOURCES.ISTAT);
export const DEPENSES_2025 = mes(1157.655, "Md EUR", "année 2025", "Dépenses des administrations publiques, SEC 2010", "ISTAT, 22 septembre 2026", SOURCES.ISTAT);
export const SOLDE_PRIMAIRE = 17.422;
export const INTERETS_2025 = mes(87.158, "Md EUR", "année 2025", "Charge d'intérêts de toutes les administrations publiques, SEC 2010", "ISTAT, 22 septembre 2026", SOURCES.ISTAT);
export const INTERETS_PCT_PIB = 3.848;
export const INTERETS_PCT_RECETTES = 8.011;
export const NON_RESIDENTS = mes(1170.913, "Md EUR", "fin juillet 2026", "Dette Maastricht détenue par des créanciers non résidents", "Banca d'Italia, 15 octobre 2026", SOURCES.BDI);
export const PART_NON_RESIDENTS = 36.511;
export const DUREE_MOYENNE = 7.8;

/* ── Évolution ──────────────────────────────────────────────────────────── */

/* Banca d'Italia, tableau 1, édition du 15 octobre 2026 : stocks au 31 décembre. Les années avant 2022 ne sont pas
   dans le dossier : pas de série, pas d'interpolation. */
export const DETTE_ANNUELLE: { annee: number; md: number; ratio: number }[] = [
  { annee: 2022, md: 2764.638, ratio: 138.4 },
  { annee: 2023, md: 2870.273, ratio: 134.0 },
  { annee: 2024, md: 2967.833, ratio: 134.3 },
  { annee: 2025, md: 3097.093, ratio: 136.7 },
];
/* Deux stocks mensuels provisoires, qui ne sont pas des fins d'année. */
export const DETTE_MENSUELLE = [
  { cle: "2026-07", etiquette: "juil. 2026", court: "juil. 26", md: 3206.996 },
  { cle: "2026-08", etiquette: "août 2026", court: "août 26", md: 3200.848 },
];
export const HAUSSE_2025 = 129.26;
export const ECART_STOCK_FLUX = 59.524;

/* ── Qui doit ───────────────────────────────────────────────────────────── */

/* Banca d'Italia, fin août 2026, tableau 6. Montants consolidés : ils s'additionnent. */
export const PAR_ADMINISTRATION = {
  centrales: 3126.407,
  locales: 74.373,
  securite: 0.068,
  centralesAvant: 3150.114,
  centralesInternes: 23.707,
  localesAvant: 105.25,
  localesInternes: 30.877,
};
export const LOCALES: { nom: string; md: number }[] = [
  { nom: "Régions et provinces autonomes", md: 29.546 },
  { nom: "Communes", md: 29.785 },
  { nom: "Autres organismes locaux", md: 10.419 },
  { nom: "Provinces et villes métropolitaines", md: 4.623 },
];
export const PAR_INSTRUMENT = {
  titresLongs: 2546.351,
  depots: 186.062,
  epargnePostale: 20.578,
  titresCourts: 140.119,
  pretsEuropeens: 128.94,
  pretsBanques: 111.968,
  autres: 87.409,
};
export const PAR_ECHEANCE = { unAn: 586.762, uneACinq: 1052.633, plusCinq: 1561.453 };
export const EN_EUROS = { euros: 3199.671, devises: 1.177, partEuros: 99.963 };
export const TRESORERIE = 59.147;

/* ── Qui détient ────────────────────────────────────────────────────────── */

/* Banca d'Italia, tableau 5, fin juillet 2026 : la dernière répartition complète. */
export const DETENTEURS: { nom: string; md: number; note?: string }[] = [
  { nom: "Non-résidents", md: 1170.913 },
  { nom: "Autres institutions monétaires résidentes", md: 644.17, note: "banques" },
  { nom: "Banca d'Italia", md: 531.348 },
  { nom: "Autres résidents", md: 472.033, note: "ménages et entreprises non financières" },
  { nom: "Autres institutions financières résidentes", md: 388.532 },
];
export const NON_RESIDENTS_SERIE: { cle: string; etiquette: string; court: string; md: number; ratio?: number }[] = [
  { cle: "2024-09", etiquette: "sept. 2024", court: "09/24", md: 883.271 },
  { cle: "2024-12", etiquette: "déc. 2024", court: "12/24", md: 916.014 },
  { cle: "2025-03", etiquette: "mars 2025", court: "03/25", md: 974.044 },
  { cle: "2025-06", etiquette: "juin 2025", court: "06/25", md: 1025.62 },
  { cle: "2025-09", etiquette: "sept. 2025", court: "09/25", md: 1044.034 },
  { cle: "2025-12", etiquette: "déc. 2025", court: "12/25", md: 1063.24 },
  { cle: "2026-03", etiquette: "mars 2026", court: "03/26", md: 1110.9 },
  { cle: "2026-06", etiquette: "juin 2026", court: "06/26", md: 1162.678 },
  { cle: "2026-07", etiquette: "juil. 2026", court: "07/26", md: 1170.913, ratio: 36.511 },
];
export const BANCA_ITALIA = { aout2026: 525.786, partAout: 16.426, fin2025: 574.073, fin2024: 642.13 };

export const CATEGORIES_DETENTEURS: { titre: string; texte: string }[] = [
  { titre: "Banques", texte: "Elles détiennent des titres souverains pour leur liquidité, la gestion de leur bilan et comme garantie." },
  { titre: "Assureurs et fonds de pension", texte: "Des titres de long terme, adaptés à des engagements qui s'étalent sur des décennies." },
  { titre: "Fonds d'investissement", texte: "Des achats selon leurs stratégies d'allocation, leurs indices et leurs mandats." },
  { titre: "Ménages et entreprises", texte: "L'épargne placée directement dans des titres publics, ou par un intermédiaire ; les titres pour particuliers (BTP Italia, BTP Valore) s'adressent à eux." },
  { titre: "Banca d'Italia", texte: "Des titres acquis dans le cadre de la politique monétaire de l'Eurosystème. Leur montant baisse à mesure que les titres arrivent à échéance." },
  { titre: "Non-résidents", texte: "Des créanciers économiquement domiciliés hors d'Italie, quelle que soit leur nationalité : la statistique ne donne pas leur pays." },
];

/* ── Comparaison européenne : une seule édition (Eurostat, 22 avril 2026, fin 2025) ── */

export const EUROPE: { nom: string; pct: number; italie?: boolean; agregat?: boolean; md: number; solde: number }[] = [
  { nom: "Grèce", pct: 146.1, md: 362.925, solde: 1.7 },
  { nom: "Italie", pct: 137.1, md: 3095.888, solde: -3.1, italie: true },
  { nom: "France", pct: 115.6, md: 3460.465, solde: -5.1 },
  { nom: "Belgique", pct: 107.9, md: 692.461, solde: -5.2 },
  { nom: "Espagne", pct: 100.7, md: 1698.225, solde: -2.4 },
  { nom: "Portugal", pct: 89.7, md: 275.063, solde: 0.7 },
  { nom: "Zone euro", pct: 87.8, md: 13945.708, solde: -2.9, agregat: true },
  { nom: "Union européenne", pct: 81.7, md: 15374.367, solde: -3.1, agregat: true },
  { nom: "Allemagne", pct: 63.5, md: 2838.239, solde: -2.7 },
  { nom: "Pays-Bas", pct: 44.4, md: 523.541, solde: -1.6 },
];

/* ── Budget et refinancement ────────────────────────────────────────────── */

export const REGLES = { deficitUE: 3, detteUE: 60, deficitPrevu2026: 2.9 };
export const EMISSIONS_NETTES_AOUT = 81.847;

/* ── Presse : des médias, jamais des statistiques ───────────────────────── */

export const PRESSE = [
  { media: "ANSA", titre: "Bankitalia, ad agosto debito in calo a 3.200,8 miliardi", url: "https://www.ansa.it/sito/notizie/topnews/2026/10/15/bankitalia-ad-agosto-debito-in-calo-a-3.2008-miliardi_8124d05f-b9fd-4adc-b96c-052381de9115.html", date: "2026-10-15", sujet: "Dette d'août 2026" },
  { media: "Reuters", titre: "Italy’s political risks cloud debt reduction hopes amid bond turmoil", url: "https://www.reuters.com/business/italys-political-risks-cloud-debt-reduction-hopes-amid-bond-turmoil-2026-10-15/", date: "2026-10-15", sujet: "Réduction de la dette" },
  { media: "Reuters", titre: "Italy’s debt burden rising at alarming rate, economy minister says", url: "https://www.reuters.com/business/italys-debt-burden-rising-alarming-rate-economy-minister-says-2026-09-18/", date: "2026-09-18", sujet: "Charge de la dette" },
  { media: "ANSA", titre: "Bankitalia, nuovo record del debito a giugno, supera i 3.200 miliardi", url: "https://videoembed.ansa.it/sito/notizie/economia/2026/08/14/bankitalia-nuovo-record-del-debito-a-giugno-supera-i-3.200-miliardi_2e0698e6-edfc-4c8e-9cce-c81af7428d4a.html", date: "2026-08-14", sujet: "Record de juin" },
];

/* ── FAQ : une seule fonction pour la page et pour les données structurées ── */

export type FAQMontant = (md: number, decimales: number, annee: number) => string;
const euros: FAQMontant = (md, d) => `${md.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d })} milliards d'euros`;
const pct = (v: number, d = 1) => v.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });

export function creerFAQ(formater: FAQMontant = euros) {
  const m = (v: number, d = 1, a = 2025) => formater(v, d, a);
  return [
    { q: "Quel est le montant de la dette publique de l'Italie aujourd'hui ?", r: `À la fin d'août 2026, la dette brute consolidée des administrations publiques italiennes atteint ${m(DETTE.valeur, 3, 2026)}, selon la Banca d'Italia (publication du 15 octobre 2026). C'est un stock nominal provisoire de dette Maastricht, et non le portefeuille de titres du seul Trésor.` },
    { q: "Quelle est la dette de l'Italie par rapport à son PIB ?", r: `Le dernier ratio annuel vérifié est ${pct(RATIO_2025.valeur)} % du PIB à la fin de 2025 : ${m(DETTE_2025.valeur, 3, 2025)} de dette pour un PIB nominal de ${m(PIB_2025.valeur, 3, 2025)}. Ce n'est pas le ratio d'août 2026, qui exigerait un PIB sur douze mois correspondant.` },
    { q: "Pourquoi l'Italie a-t-elle une dette publique aussi élevée ?", r: `Le stock résulte de déficits passés, d'intérêts et d'opérations financières accumulés, avec des chocs comme la crise financière et la pandémie. Entre fin 2024 et fin 2025, il est passé de ${m(2967.833, 3, 2024)} à ${m(3097.093, 3, 2025)}, soit +${m(HAUSSE_2025, 3, 2025)}, ce qui ne se confond pas avec le déficit de l'année.` },
    { q: "Qui détient la dette italienne ?", r: `À la fin de juillet 2026, les non-résidents détiennent ${m(NON_RESIDENTS.valeur, 3, 2026)}, soit ${pct(PART_NON_RESIDENTS, 3)} % de la dette Maastricht de ${m(DETTE_JUILLET, 3, 2026)}. Le reste revient à la Banca d'Italia, aux banques, aux autres institutions financières, aux ménages et aux entreprises résidents. Ces catégories ne donnent pas la nationalité des créanciers.` },
    { q: "Combien la dette publique coûte-t-elle en intérêts ?", r: `Les administrations publiques ont enregistré ${m(INTERETS_2025.valeur, 3)} d'intérêts en 2025, soit ${pct(INTERETS_PCT_PIB, 3)} % du PIB et ${pct(INTERETS_PCT_RECETTES, 3)} % des recettes publiques (ISTAT, 22 septembre 2026). C'est un flux annuel, sans les remboursements de principal.` },
    { q: "Quel est le déficit public de l'Italie en 2025 ?", r: `Les recettes s'élèvent à ${m(RECETTES_2025.valeur, 3)} et les dépenses à ${m(DEPENSES_2025.valeur, 3)} : le solde est de −${m(DEFICIT_2025.valeur, 3)}, soit environ −${pct(DEFICIT_PCT_PIB)} % du PIB, dans l'édition révisée de septembre 2026. Une édition de mars indiquait −69,381 milliards d'euros : les deux ne se combinent pas.` },
    { q: "Comment l'Italie rembourse-t-elle ses BTP et ses BOT ?", r: `Le ministère de l'Économie et des Finances émet de nouveaux titres, rouvre des lignes existantes et fait des échanges : une partie des nouvelles ressources rembourse le principal arrivé à échéance. La durée résiduelle moyenne de la dette publique est de ${pct(DUREE_MOYENNE)} ans à la fin d'août 2026, ce qui ne veut pas dire que tout arrive à échéance à ce terme.` },
    { q: "Pourquoi la dette italienne a-t-elle baissé en août 2026 ?", r: `Le stock est passé de ${m(DETTE_JUILLET, 3, 2026)} fin juillet à ${m(DETTE.valeur, 3, 2026)} fin août, soit −${m(-VARIATION_MOIS, 3, 2026)} en un mois. Cette baisse ne prouve pas à elle seule un excédent : la trésorerie et d'autres ajustements de financement interviennent aussi.` },
    { q: "Quelle part de la dette italienne la Banque centrale détient-elle ?", r: `La Banca d'Italia détient ${m(BANCA_ITALIA.aout2026, 3, 2026)} de dette Maastricht à la fin d'août 2026, soit ${pct(BANCA_ITALIA.partAout, 3)} % du total. Ce montant n'est pas la somme des portefeuilles des programmes APP et PEPP publiée par la BCE : les périmètres et les valorisations diffèrent.` },
    { q: "L'Italie peut-elle faire défaut sur sa dette ?", r: "Un État souverain peut connaître des difficultés de refinancement ou restructurer ses engagements : la dette publique n'est donc pas sans risque. L'Italie emprunte presque entièrement en euros et appartient à l'Eurosystème, mais ni la monnaie commune ni la BCE ne valent garantie universelle de remboursement." },
    { q: "Quelle part de la dette italienne est en monnaie étrangère ?", r: `À la fin d'août 2026, ${m(EN_EUROS.euros, 3, 2026)} du stock sont libellés en euros et ${m(EN_EUROS.devises, 3, 2026)} en autres devises, soit ${pct(EN_EUROS.partEuros, 3)} % et ${pct(100 - EN_EUROS.partEuros, 3)} %. Cette répartition couvre toutes les administrations.` },
    { q: "L'Italie est-elle plus endettée que la France et l'Espagne ?", r: "Dans la même notification d'Eurostat du 22 avril 2026, les ratios de fin 2025 sont de 137,1 % du PIB pour l'Italie, 115,6 % pour la France et 100,7 % pour l'Espagne. La comparaison suppose la même date, la même définition de dette et la même édition." },
  ];
}
export const FAQ = creerFAQ();
