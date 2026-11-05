import type { ThemeId } from "@/types";

/* ═══════════════════════════════════════════════════════════════════════════
   LES DÉBATS

   Chaque débat part d'un article déjà publié et du chiffre qui s'y trouve :
   rien n'est inventé ici, ni la donnée, ni la source. Les positions sont
   rédigées comme des options d'arbitrage, pas comme des opinions attribuées
   à quelqu'un.

   Ce que ce module ne contient pas, volontairement : des compteurs de
   participation. Tant qu'il n'y a pas de comptes, les résultats affichés
   sont ceux du navigateur du lecteur, et la page le dit.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface Position {
  id: string;
  label: string;
  ligne: string;
}

export interface Debat {
  id: string;
  /** Ce qu'on demande au lecteur d'arbitrer. */
  question: string;
  /** Deux phrases de mise en situation, pas un article. */
  contexte: string;
  /** Le chiffre qui déclenche le débat, et d'où il vient. */
  ancre: { valeur: string; libelle: string; source: string };
  positions: Position[];
  theme: ThemeId;
  /** L'article du site qui documente le sujet. */
  article: { slug: string; titre: string };
  /** La carte à ouvrir pour vérifier soi-même, quand elle existe. */
  carte?: string;
  tags: string[];
  /** Ouvert en tête de liste : le sujet de la semaine. */
  epingle?: boolean;
}

export const DEBATS: Debat[] = [
  {
    id: "dette-france",
    question: "La dette française à 113 % du PIB : faut-il la réduire maintenant ?",
    contexte:
      "La France emprunte à un niveau que seuls quelques pays de l'OCDE dépassent. Réduire vite coûte de la croissance ; attendre coûte des intérêts.",
    ancre: { valeur: "113 %", libelle: "dette publique / PIB · France · 2025", source: "Banque mondiale (WDI)" },
    positions: [
      { id: "reduire", label: "Réduire dès maintenant", ligne: "Chaque année d'attente renchérit le service de la dette." },
      { id: "investir", label: "Investir d'abord", ligne: "La croissance réduit le ratio plus sûrement que l'austérité." },
      { id: "ratio", label: "Le ratio n'est pas le sujet", ligne: "Ce qui compte est à qui l'on doit, et à quelle maturité." },
    ],
    theme: "economy",
    article: { slug: "dette-publique-france-2025-enjeux", titre: "La dette publique française à 113 % du PIB en 2025 : faut-il s'inquiéter ?" },
    carte: "/map/economy",
    tags: ["Dette", "France", "Budget"],
    epingle: true,
  },
  {
    id: "chine-usa",
    question: "Chine et États-Unis : la rivalité se joue-t-elle encore sur le PIB ?",
    contexte:
      "L'écart de PIB nominal reste large, mais il ne dit rien des chaînes d'approvisionnement, des brevets ni de l'énergie. Le bon indicateur fait débat.",
    ancre: { valeur: "30,8 T$ / 19,5 T$", libelle: "PIB · États-Unis et Chine · 2025", source: "Banque mondiale (WDI)" },
    positions: [
      { id: "pib", label: "Le PIB reste l'indicateur", ligne: "Il agrège tout le reste, et il finance la puissance." },
      { id: "industrie", label: "La production industrielle", ligne: "Ce qu'un pays sait fabriquer pèse plus que ce qu'il facture." },
      { id: "techno", label: "La maîtrise technologique", ligne: "Semi-conducteurs, énergie, données : les goulots décident." },
    ],
    theme: "economy",
    article: { slug: "chine-usa-guerre-economique-decennie", titre: "Chine vs États-Unis : la grande rivalité économique de notre siècle" },
    carte: "/map/economy",
    tags: ["Chine", "États-Unis", "Puissance"],
  },
  {
    id: "democratie",
    question: "Vingt ans de recul démocratique : rupture durable ou cycle ?",
    contexte:
      "Les indices de démocratie reculent presque partout depuis le milieu des années 2000. Reste à savoir si l'on regarde une tendance de fond ou un creux.",
    ancre: { valeur: "20 ans", libelle: "de régression mesurée", source: "Article · La démocratie en recul mondial" },
    positions: [
      { id: "rupture", label: "Une rupture durable", ligne: "Les institutions abîmées ne se reconstruisent pas d'un scrutin." },
      { id: "cycle", label: "Un cycle", ligne: "Les reculs passés ont été suivis de vagues d'ouverture." },
      { id: "mesure", label: "Un problème de mesure", ligne: "Les indices captent mal les démocraties non occidentales." },
    ],
    theme: "politics",
    article: { slug: "democratie-en-recul-2025", titre: "La démocratie en recul mondial : 20 ans de régression politique" },
    carte: "/map/politics",
    tags: ["Démocratie", "Institutions"],
  },
  {
    id: "vaccins",
    question: "80 % des doses COVID accaparées : que change-t-on pour la prochaine ?",
    contexte:
      "La répartition des doses a suivi le pouvoir d'achat, pas la vulnérabilité. Plusieurs mécanismes sont sur la table, aucun n'est en vigueur.",
    ancre: { valeur: "80 %", libelle: "des doses vers les pays riches", source: "Article · L'injustice vaccinale" },
    positions: [
      { id: "licences", label: "Lever les brevets", ligne: "La production locale supprime la file d'attente." },
      { id: "stock", label: "Un stock mondial pré-financé", ligne: "Acheter avant la crise, répartir selon l'exposition." },
      { id: "marche", label: "Rien de contraignant", ligne: "La vitesse de mise au point tient à l'incitation privée." },
    ],
    theme: "epidemics",
    article: { slug: "inegalites-vaccinales-monde", titre: "L'injustice vaccinale : comment les pays riches ont accaparé 80% des doses COVID" },
    carte: "/map/epidemics",
    tags: ["Santé", "Inégalités"],
  },
  {
    id: "brics",
    question: "BRICS+ : un vrai bloc, ou une coalition de circonstance ?",
    contexte:
      "L'élargissement a doublé le poids démographique du groupe. Ses membres n'ont ni monnaie commune, ni doctrine commune, ni intérêts alignés.",
    ancre: { valeur: "≈ 45 %", libelle: "de la population mondiale", source: "Article · BRICS+ et multipolarité" },
    positions: [
      { id: "bloc", label: "Un bloc en formation", ligne: "Les institutions communes viennent après les intérêts." },
      { id: "circonstance", label: "Une coalition de circonstance", ligne: "Inde et Chine ne peuvent pas porter le même projet." },
      { id: "signal", label: "Un signal, pas une structure", ligne: "L'important est ce que le groupe conteste, pas ce qu'il construit." },
    ],
    theme: "politics",
    article: { slug: "brics-ordre-mondial-multipolaire-2025", titre: "BRICS+ et multipolarité : le monde d'après l'hégémonie américaine" },
    carte: "/map/politics",
    tags: ["BRICS", "Ordre mondial"],
  },
  {
    id: "presse",
    question: "160 journalistes emprisonnés : quel levier fonctionne encore ?",
    contexte:
      "Les condamnations diplomatiques n'ont pas fait baisser le nombre de détentions. D'autres leviers existent, tous avec un coût.",
    ancre: { valeur: "160", libelle: "journalistes emprisonnés · 2025", source: "Article · Liberté de la presse 2025" },
    positions: [
      { id: "sanctions", label: "Des sanctions ciblées", ligne: "Viser les responsables nommément, pas les États." },
      { id: "commerce", label: "Conditionner le commerce", ligne: "Le seul levier que les régimes concernés lisent vraiment." },
      { id: "protection", label: "Protéger plutôt que punir", ligne: "Visas d'urgence, financement des rédactions en exil." },
    ],
    theme: "politics",
    article: { slug: "liberte-presse-recul-mondial-rsf-2025", titre: "Liberté de la presse 2025 : 160 journalistes emprisonnés, 45 tués" },
    tags: ["Presse", "Libertés"],
  },
  {
    id: "chomage",
    question: "Les fractures du marché du travail : formation ou demande ?",
    contexte:
      "Les écarts de chômage entre pays ne s'expliquent pas par un seul facteur. Le diagnostic choisi commande la politique menée.",
    ancre: { valeur: "de 3 à 32 %", libelle: "amplitude du chômage entre pays", source: "Article · Chômage mondial" },
    positions: [
      { id: "formation", label: "Un problème de compétences", ligne: "Les postes existent, les qualifications manquent." },
      { id: "demande", label: "Un problème de demande", ligne: "Sans commandes, aucune formation ne crée d'emploi." },
      { id: "mesure", label: "Un problème de définition", ligne: "Le sous-emploi n'est pas compté de la même façon partout." },
    ],
    theme: "economy",
    article: { slug: "chomage-inegalites-marches-travail", titre: "Chômage mondial : les grandes fractures du marché du travail en 2025" },
    carte: "/map/economy",
    tags: ["Emploi", "Inégalités"],
  },
  {
    id: "geants",
    question: "Faut-il démanteler les géants technologiques ?",
    contexte:
      "Leur capitalisation dépasse le PIB de la plupart des pays. Le débat porte moins sur la taille que sur ce qu'elle permet d'empêcher.",
    ancre: { valeur: "> PIB national", libelle: "capitalisation des premières capitalisations", source: "Article · Les géants technologiques" },
    positions: [
      { id: "demanteler", label: "Démanteler", ligne: "La concentration ferme le marché aux entrants." },
      { id: "reguler", label: "Réguler sans démanteler", ligne: "Interopérabilité et accès aux données suffisent." },
      { id: "laisser", label: "Laisser faire", ligne: "L'échelle finance la recherche que personne d'autre ne finance." },
    ],
    theme: "economy",
    article: { slug: "entreprises-geants-economie-mondiale", titre: "Les géants technologiques et leur poids sur l'économie mondiale" },
    tags: ["Tech", "Concurrence"],
  },
];

/** Les étiquettes qui reviennent, pour la barre de filtres. */
export const TAGS_EN_VOGUE = Array.from(new Set(DEBATS.flatMap((d) => d.tags)));
