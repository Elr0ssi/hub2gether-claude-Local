/* ═══════════════════════════════════════════════════════════════════════════
   DETTE PUBLIQUE DE L'ESPAGNE : LES DONNÉES DE L'ARTICLE

   Source de ce fichier : « Dossier de données — dette publique de l'Espagne »
   (état de la recherche du 16 octobre 2026). Montants en MILLIARDS D'EUROS
   (l'euro est la monnaie nationale), ratios en %.

   Règles : une seule édition par tableau ; un « dont » n'est jamais ajouté à son parent ;
   ce que le dossier n'a pas vérifié (« ? ») n'est pas écrit ici, ni estimé.
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
  BDE_T2: "https://www.bde.es/wbe/es/noticias-eventos/actualidad-banco-espana/deuda-aapp-2026t2.html",
  BDE_JUILLET: "https://www.bde.es/wbe/es/noticias-eventos/actualidad-banco-espana/deuda-aapp-julio26.html",
  BDE_ANNUEL: "https://datos.bde.es/datos/en/datasets/000/003.html",
  BDE_TRIM: "https://datos.bde.es/datos/en/datasets/000/004.html",
  INE: "https://ine.es/dynt3/FMI/en/index.htm",
  INE_PIB: "https://ine.es/dyngs/Prensa/CNA2025.htm",
  EUROSTAT: "https://ec.europa.eu/eurostat/en/web/products-euro-indicators/w/2-22042026-ap",
  AEAT: "https://sede.agenciatributaria.gob.es/Sede/estadisticas/recaudacion-tributaria/informe-anual/ejercicio-2025.html",
  AEAT_RESUME: "https://sede.agenciatributaria.gob.es/Sede/estadisticas/recaudacion-tributaria/informe-anual/ejercicio-2025/resumen.html",
  AEAT_IRPF: "https://www3.agenciatributaria.gob.es/static_files/Sede/Biblioteca/Manual/Practicos/IRPF/IRPF-2025/ManualRenta2025Parte1_es_es.pdf",
  AEAT_EPARGNE: "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-ayuda-presentacion/irpf-2025/8-cumplimentacion-irpf/8_4-cuota-integra/8_4_4-gravamen-base-liquidable-ahorro.html",
  TESORO: "https://www.tesoro.es/",
  TESORO_STATS: "https://www.tesoro.es/deuda-publica/estad%C3%ADsticas-mensuales",
  TESORO_NOTES: "https://www.tesoro.es/en/deuda-publica/calificacion-crediticia",
  TESORO_STRATEGIE: "https://www.tesoro.es/sites/default/files/estrategia/Estrategia_Tesoro_Publico_2026_eng.pdf",
  TESORO_CALENDRIER: "https://www.tesoro.es/deuda-publica/subastas/calendario",
  BCE_APP: "https://www.ecb.europa.eu/mopo/implement/app/html/index.fr.html",
  BCE_PEPP: "https://www.ecb.europa.eu/mopo/implement/pepp/html/index.en.html",
  AIREF: "https://www.airef.es/en/uncategorized2/report-on-budget-execution-public-debt-and-the-spending-rule-for-public-administrations-2026/",
  CONSTITUTION: "https://www.boe.es/legislacion/documentos/ConstitucionCASTELLANO.pdf",
  LOI_ORGANIQUE: "https://www.boe.es/eli/es/lo/2012/04/27/2",
  DECRET_LOI: "https://www.boe.es/eli/es/rdl/2026/06/02/13",
};

const mes = (valeur: number, unite: Mesure["unite"], periode: string, perimetre: string, source: string, url: string): Mesure => ({ valeur, unite, periode, perimetre, source, url });

/* ── L'essentiel ────────────────────────────────────────────────────────── */

export const DETTE = mes(1762.936, "Md EUR", "fin du 2e trimestre 2026", "Dette brute consolidée de toutes les administrations publiques, définition Maastricht, valeur nominale", "Banco de España, 30 septembre 2026", SOURCES.BDE_T2);
export const RATIO = mes(101.4, "% PIB", "fin du 2e trimestre 2026", "Dette Maastricht rapportée au PIB", "Banco de España, 30 septembre 2026", SOURCES.BDE_T2);
export const DETTE_T1 = 1739.641;
export const HAUSSE_TRIMESTRE = mes(23.295, "Md EUR", "du 1er au 2e trimestre 2026", "Différence des stocks trimestriels de dette Maastricht", "Banco de España", SOURCES.BDE_TRIM);
export const DETTE_JUILLET = mes(1744, "Md EUR", "juillet 2026", "Estimation mensuelle provisoire, dette Maastricht de toutes les administrations", "Banco de España, 17 septembre 2026", SOURCES.BDE_JUILLET);
export const RATIO_JUILLET = mes(99.9, "% PIB", "juillet 2026", "Estimation mensuelle provisoire", "Banco de España, 17 septembre 2026", SOURCES.BDE_JUILLET);
export const DEFICIT_2025 = mes(40.641, "Md EUR", "année 2025", "Besoin de financement des administrations publiques, SEC 2010, édition actualisée (valeur absolue)", "INE, consulté le 16 octobre 2026", SOURCES.INE);
export const RECETTES_2025 = mes(725.655, "Md EUR", "année 2025", "Recettes des administrations publiques, SEC 2010", "INE, consulté le 16 octobre 2026", SOURCES.INE);
export const DEPENSES_2025 = mes(766.296, "Md EUR", "année 2025", "Dépenses des administrations publiques, SEC 2010", "INE, consulté le 16 octobre 2026", SOURCES.INE);
export const PIB_2025 = mes(1690.012, "Md EUR", "année 2025", "PIB nominal révisé", "INE, 18 septembre 2026", SOURCES.INE_PIB);
export const DEFICIT_PCT_PIB = 2.4;
export const INTERETS_2025 = mes(40.432, "Md EUR", "année 2025", "Dépense d'intérêts de toutes les administrations publiques, SEC 2010", "INE, consulté le 16 octobre 2026", SOURCES.INE);
export const INTERETS_PCT_PIB = 2.4;
export const INTERETS_PCT_RECETTES = 5.6;
export const CREANCIERS_EXTERIEURS = mes(893.245, "Md EUR", "fin du 2e trimestre 2026", "Dette Maastricht détenue par des créanciers non résidents", "INE / Banco de España", SOURCES.INE);
export const CREANCIERS_RESIDENTS = mes(869.691, "Md EUR", "fin du 2e trimestre 2026", "Dette Maastricht détenue par des créanciers résidents en Espagne", "INE / Banco de España", SOURCES.INE);
export const PART_EXTERIEURS = 50.7;

/* ── Évolution : l'encours à la fin de chaque année ─────────────────────── */

/* Banco de España, série annuelle, mise à jour du 10 juillet 2026. Montants publiés, non interpolés.
   Les ratios ne sont donnés que pour 2022-2025 (Eurostat, notification d'avril 2026, PIB de cette édition). */
export const DETTE_ANNUELLE: { annee: number; md: number; ratio?: number }[] = [
  { annee: 2000, md: 374.557 }, { annee: 2001, md: 378.883 }, { annee: 2002, md: 384.145 }, { annee: 2003, md: 382.775 },
  { annee: 2004, md: 389.888 }, { annee: 2005, md: 393.479 }, { annee: 2006, md: 392.132 }, { annee: 2007, md: 384.662 },
  { annee: 2008, md: 440.621 }, { annee: 2009, md: 569.535 }, { annee: 2010, md: 649.153 }, { annee: 2011, md: 743.043 },
  { annee: 2012, md: 927.813 }, { annee: 2013, md: 1025.805 }, { annee: 2014, md: 1085.165 }, { annee: 2015, md: 1114.129 },
  { annee: 2016, md: 1145.655 }, { annee: 2017, md: 1184.148 }, { annee: 2018, md: 1209.742 }, { annee: 2019, md: 1224.364 },
  { annee: 2020, md: 1346.916 }, { annee: 2021, md: 1429.404 },
  { annee: 2022, md: 1504.105, ratio: 109.3 }, { annee: 2023, md: 1575.377, ratio: 105.2 },
  { annee: 2024, md: 1620.573, ratio: 101.6 }, { annee: 2025, md: 1698.225, ratio: 100.7 },
];
export const REPERES: Record<number, string> = { 2008: "crise financière", 2012: "crise bancaire", 2020: "Covid-19" };

/* ── Qui doit ───────────────────────────────────────────────────────────── */

/* Banco de España, fin T2 2026, montants arrondis au milliard. Avant consolidation : ces lignes ne sont pas des parts d'un camembert. */
export const PAR_ADMINISTRATION: { nom: string; md: number; total?: boolean; consolidation?: boolean }[] = [
  { nom: "État", md: 1602 },
  { nom: "Autres organismes centraux", md: 31 },
  { nom: "Dettes croisées entre eux", md: -20, consolidation: true },
  { nom: "Administration centrale consolidée", md: 1613, total: true },
  { nom: "Communautés autonomes", md: 355 },
  { nom: "Collectivités locales", md: 21 },
  { nom: "Sécurité sociale", md: 136 },
  { nom: "Dettes croisées entre sous-secteurs", md: -363, consolidation: true },
  { nom: "Dette Maastricht consolidée", md: 1762.936, total: true },
];

export const PAR_INSTRUMENT = { depots: 5.602, titres: 1572.212, prets: 185.122 };
export const TITRES_PAR_ECHEANCE = { unAnOuMoins: 234.272, plusUnAn: 1337.94 };
export const EN_EUROS = { euros: 1762.706, devises: 0.23, partEuros: 99.987 };

/* ── Qui détient ────────────────────────────────────────────────────────── */

export const BCE = {
  pspp: mes(225.454, "Md EUR", "fin septembre 2026", "Achats nets cumulés du programme PSPP attribués à l'Espagne (ce n'est pas la valeur nominale de la dette Maastricht)", "BCE", SOURCES.BCE_APP),
  pepp: mes(157.191, "Md EUR", "fin septembre 2026", "Achats nets cumulés du programme PEPP attribués à l'Espagne", "BCE", SOURCES.BCE_PEPP),
  dureePspp: 6.95,
  dureePepp: 6.59,
};

export const CATEGORIES_DETENTEURS: { titre: string; texte: string }[] = [
  { titre: "Banques", texte: "Elles détiennent des titres souverains pour leur liquidité, la gestion de leur bilan, leurs placements et comme garantie." },
  { titre: "Assureurs", texte: "Titres de placement de long terme, adaptés aux engagements d'assurance." },
  { titre: "Fonds de pension", texte: "Des obligations pour diversifier et pour payer les engagements futurs." },
  { titre: "Fonds d'investissement", texte: "Des achats selon leurs stratégies d'allocation, leurs indices et leurs mandats." },
  { titre: "Ménages", texte: "L'épargne investie directement dans les titres du Tesoro, notamment les Letras." },
  { titre: "Eurosystème", texte: "Des titres acquis notamment au titre des programmes monétaires APP et PEPP." },
  { titre: "Non-résidents", texte: "Des créanciers économiquement domiciliés hors d'Espagne, quelle que soit leur nationalité." },
  { titre: "Administrations publiques", texte: "Des détentions à l'intérieur du secteur public, éliminées dans la dette consolidée." },
];

/* ── Notations ──────────────────────────────────────────────────────────── */

export const NOTATIONS: { agence: string; note: string; perspective: string; date: string }[] = [
  { agence: "Moody's", note: "A3", perspective: "stable", date: "26/09/2025" },
  { agence: "S&P", note: "A+", perspective: "stable", date: "12/09/2025" },
  { agence: "Fitch", note: "A", perspective: "stable", date: "26/09/2025" },
  { agence: "DBRS Morningstar", note: "A (high)", perspective: "stable", date: "29/11/2024" },
  { agence: "Scope", note: "A+", perspective: "stable", date: "11/09/2026" },
];

/* ── Budget ─────────────────────────────────────────────────────────────── */

export const REGLES = {
  deficitUE: 3,
  detteUE: 60,
  repartition: "44 / 13 / 3 %",
  depensesNettes2026: 3.5,
  depensesNettesAirefPrevision2026: 6.4,
};

/* ── Refinancement : programme du Tesoro, 2026 ──────────────────────────── */

export const PROGRAMME_2026 = {
  brutes: 285.677,
  brutesMlt: 176.935,
  brutesLetras: 108.742,
  remboursements: 230.677,
  nettes: 55,
};

/* ── Comparaison européenne : une seule édition (Eurostat, 22 avril 2026, fin 2025) ── */

export const EUROPE: { nom: string; pct: number; espagne?: boolean; agregat?: boolean; md: number; solde: number }[] = [
  { nom: "Grèce", pct: 146.1, md: 362.925, solde: 1.7 },
  { nom: "Italie", pct: 137.1, md: 3095.888, solde: -3.1 },
  { nom: "France", pct: 115.6, md: 3460.465, solde: -5.1 },
  { nom: "Belgique", pct: 107.9, md: 692.461, solde: -5.2 },
  { nom: "Espagne", pct: 100.7, md: 1698.225, solde: -2.4, espagne: true },
  { nom: "Portugal", pct: 89.7, md: 275.063, solde: 0.7 },
  { nom: "Zone euro", pct: 87.8, md: 13945.708, solde: -2.9, agregat: true },
  { nom: "Union européenne", pct: 81.7, md: 15374.367, solde: -3.1, agregat: true },
  { nom: "Allemagne", pct: 63.5, md: 2838.239, solde: -2.7 },
  { nom: "Pays-Bas", pct: 44.4, md: 523.541, solde: -1.6 },
];

/* ── Spécificités : les communautés autonomes ───────────────────────────── */

export const REGIONS: { nom: string; pct: number }[] = [
  { nom: "Communauté valencienne", pct: 40.0 },
  { nom: "Murcie", pct: 30.8 },
  { nom: "Catalogne", pct: 28.1 },
  { nom: "Castille-La Manche", pct: 28.1 },
  { nom: "Asturies", pct: 12.5 },
  { nom: "Communauté de Madrid", pct: 12.3 },
  { nom: "Pays basque", pct: 11.7 },
  { nom: "Canaries", pct: 10.9 },
  { nom: "Navarre", pct: 8.4 },
];

/* ── Presse : des médias, jamais des statistiques ───────────────────────── */

export const PRESSE = [
  { media: "El País", titre: "España sitúa su deuda pública por debajo del 100% del PIB por primera vez desde la pandemia", url: "https://elpais.com/economia/2026-09-17/espana-situa-su-deuda-publica-por-debajo-del-100-del-pib-por-primera-vez-desde-la-pandemia.html", date: "2026-09-17", sujet: "Dette sous 100 % du PIB" },
  { media: "El País", titre: "Scope Rating mejora la calificación de la deuda de España, que queda muy cerca de la de Francia", url: "https://elpais.com/economia/2026-09-11/scope-rating-mejora-la-calificacion-de-la-deuda-de-espana-que-queda-muy-cerca-de-la-de-francia.html", date: "2026-09-11", sujet: "Notation souveraine" },
  { media: "El País", titre: "La deuda pública alcanza un nuevo máximo de 1,76 billones en junio y su peso sobre el PIB repunta hasta el 101,5%", url: "https://elpais.com/economia/2026-08-18/la-deuda-publica-alcanza-un-nuevo-maximo-de-176-billones-en-junio-aunque-su-peso-sobre-el-pib-sigue-cayendo.html", date: "2026-08-18", sujet: "Nouveau maximum nominal" },
  { media: "El País", titre: "El debate presupuestario: prioridades y trampas", url: "https://elpais.com/economia/negocios/2026-07-19/el-debate-presupuestario-prioridades-y-trampas.html", date: "2026-07-19", sujet: "Budget et prorogations" },
  { media: "El País", titre: "España propone a la UE emitir eurobonos para crear un activo seguro global que compita con Estados Unidos", url: "https://elpais.com/economia/2026-07-08/espana-propone-a-la-ue-emitir-eurobonos-para-crear-un-activo-seguro-global-que-compita-con-ee-uu.html", date: "2026-07-08", sujet: "Eurobonds" },
  { media: "El País", titre: "La deuda española retrocede al 100,8% del PIB, su nivel más bajo desde antes de la pandemia", url: "https://elpais.com/economia/2026-02-17/la-deuda-espanola-retrocede-al-1008-del-pib-su-nivel-mas-bajo-desde-antes-de-la-pandemia.html", date: "2026-02-17", sujet: "Dette fin 2025" },
];

/* ── FAQ : une seule fonction pour la page et pour les données structurées ── */

export type FAQMontant = (md: number, decimales: number, annee: number) => string;
const euros: FAQMontant = (md, d) => `${md.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d })} milliards d'euros`;

export function creerFAQ(formater: FAQMontant = euros) {
  const m = (v: number, d = 1, a = 2025) => formater(v, d, a);
  return [
    { q: "Quel est le montant de la dette publique de l'Espagne en 2026 ?", r: `Le Banco de España chiffre la dette publique à ${m(DETTE_JUILLET.valeur, 0, 2026)} en juillet 2026, soit ${RATIO_JUILLET.valeur.toLocaleString("fr-FR")} % du PIB, dans une publication mensuelle provisoire. Le dernier stock trimestriel détaillé est de ${m(DETTE.valeur, 3, 2026)} à la fin du deuxième trimestre 2026 (définition Maastricht, toutes administrations) : c'est celui à privilégier pour les décompositions.` },
    { q: "Quelle est la dette espagnole en pourcentage du PIB ?", r: `Le ratio est de ${RATIO.valeur.toLocaleString("fr-FR")} % à la fin de juin 2026, selon le Banco de España. Une avance mensuelle indique ${RATIO_JUILLET.valeur.toLocaleString("fr-FR")} % en juillet 2026, avec une date et un caractère provisoire différents.` },
    { q: "Pourquoi l'Espagne est-elle endettée ?", r: `La dette résulte de l'accumulation de déficits et d'autres opérations de financement sur plusieurs décennies. Le stock est passé de ${m(440.621, 3, 2008)} fin 2008 à ${m(1346.916, 3, 2020)} fin 2020, une période marquée par les crises financière, bancaire et sanitaire ; cela ne suffit pas à établir une cause unique.` },
    { q: "Qui détient la dette publique espagnole ?", r: `À la fin du deuxième trimestre 2026, les créanciers extérieurs détiennent ${m(CREANCIERS_EXTERIEURS.valeur, 3, 2026)} et les résidents ${m(CREANCIERS_RESIDENTS.valeur, 3, 2026)} de la dette Maastricht des administrations publiques. Cette statistique n'est pas un tableau des seuls détenteurs d'obligations de l'État.` },
    { q: "Combien l'Espagne paie-t-elle d'intérêts ?", r: `La dépense d'intérêts de toutes les administrations publiques atteint ${m(INTERETS_2025.valeur, 3)} en 2025 en comptabilité nationale (SEC 2010). Cela représente ${INTERETS_PCT_RECETTES.toLocaleString("fr-FR")} % de leurs recettes annuelles, mais ce n'est pas le montant du principal arrivant à échéance.` },
    { q: "Quel est le déficit public espagnol ?", r: `Le solde des administrations publiques pour 2025 est de −${m(DEFICIT_2025.valeur, 3)} dans l'édition actualisée de l'INE, soit ${DEFICIT_PCT_PIB.toLocaleString("fr-FR")} % du PIB. La première notification d'Eurostat d'avril 2026 affichait −${m(40.33, 3)} : les éditions ne sont pas interchangeables.` },
    { q: "Quelle est la différence entre la dette et le déficit ?", r: `La dette est un stock mesuré à une date, le déficit un flux sur une année. Le déficit de ${m(DEFICIT_2025.valeur, 3)} en 2025 ne se compare pas directement à un stock Maastricht d'environ ${m(1698.225, 0)} fin 2025.` },
    { q: "Comment l'Espagne rembourse-t-elle sa dette ?", r: `Le Tesoro rembourse les titres qui arrivent à échéance grâce aux ressources publiques et à de nouvelles émissions. Son programme 2026 prévoit ${m(PROGRAMME_2026.brutes, 3, 2026)} d'émissions brutes et ${m(PROGRAMME_2026.nettes, 3, 2026)} d'émissions nettes ; le reste sert surtout à renouveler le principal ancien.` },
    { q: "L'Espagne peut-elle faire faillite ?", r: "Une dette souveraine peut connaître des difficultés de financement ou une restructuration, mais un État ne suit pas la procédure de faillite d'une entreprise. L'Espagne est membre de la zone euro et dispose de notations souveraines, ce qui n'implique aucune garantie absolue." },
    { q: "La BCE détient-elle de la dette espagnole ?", r: `Oui, des titres publics espagnols figurent dans ses portefeuilles de politique monétaire. À la fin de septembre 2026, les achats nets cumulés publiés sont de ${m(BCE.pspp.valeur, 3, 2026)} dans le programme PSPP et de ${m(BCE.pepp.valeur, 3, 2026)} dans le programme PEPP : une mesure à ne pas confondre avec la valeur nominale de la dette Maastricht.` },
    { q: "Les régions espagnoles ont-elles une dette ?", r: `Oui : les communautés autonomes affichent ${m(355, 0, 2026)} à la fin de juin 2026, selon le Banco de España. Une partie des dettes entre administrations est éliminée pour obtenir la dette Maastricht consolidée : ce montant ne s'y ajoute pas directement.` },
    { q: "L'Espagne est-elle moins endettée que la France ?", r: "Oui en pourcentage du PIB, dans la notification commune d'Eurostat du 22 avril 2026 : 100,7 % pour l'Espagne et 115,6 % pour la France à la fin de 2025. La comparaison suppose la même date, la même définition de dette et la même édition." },
  ];
}
export const FAQ = creerFAQ();
