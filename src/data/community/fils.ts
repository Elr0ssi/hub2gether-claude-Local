import type { ThemeId } from "@/types";

/* ═══════════════════════════════════════════════════════════════════════════
   LES FILS

   Un forum, pas un questionnaire : chaque fil est ouvert par la rédaction,
   avec le chiffre qui le motive et l'article qui le documente, puis la
   discussion appartient aux lecteurs.

   Ce que ce module ne contient pas, volontairement : de faux commentaires
   et de faux pseudonymes. Les messages d'ouverture sont signés par la
   rédaction parce qu'ils sont écrits par elle. Tout le reste vient des
   lecteurs, et tant qu'il n'y a pas de comptes, cela reste dans leur
   navigateur — la page le dit.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface Fil {
  id: string;
  titre: string;
  /** Le message d'ouverture, en paragraphes. */
  corps: string[];
  /** Le chiffre qui motive le fil, et d'où il vient. */
  ancre: { valeur: string; libelle: string; source: string };
  /** Trois angles proposés pour amorcer, pas pour clore. */
  angles: string[];
  theme: ThemeId;
  themeLabel: string;
  article: { slug: string; titre: string };
  carte?: string;
  tags: string[];
  ouvertLe: string;
  epingle?: boolean;
}

export const FILS: Fil[] = [
  {
    id: "dette-france",
    titre: "La dette française à 113 % du PIB : on fait quoi, concrètement ?",
    corps: [
      "La France emprunte à un niveau que peu de pays de l'OCDE dépassent. Le chiffre circule partout, presque toujours sans son contrepoint : à qui doit-on, à quelle maturité, et à quel taux.",
      "Réduire vite coûte de la croissance. Attendre coûte des intérêts. Entre les deux, il y a une série d'arbitrages concrets — fiscalité, dépense, calendrier — dont personne ne parle en même temps.",
      "Ouvert pour ça : on cherche les arguments qui tiennent avec les chiffres sous les yeux, pas les slogans.",
    ],
    ancre: { valeur: "113 %", libelle: "dette publique / PIB · France · 2025", source: "Banque mondiale (WDI)" },
    angles: [
      "Le ratio dette/PIB est-il le bon indicateur, ou faut-il regarder la charge d'intérêts ?",
      "Quel poste de dépense passeriez-vous en premier au crible ?",
      "L'exemple d'un pays qui s'en est sorti : lequel, et à quel prix social ?",
    ],
    theme: "economy",
    themeLabel: "Économie",
    article: { slug: "dette-publique-france-2025-enjeux", titre: "La dette publique française à 113 % du PIB en 2025" },
    carte: "/map/economy",
    tags: ["Dette", "France", "Budget"],
    ouvertLe: "2026-09-02",
    epingle: true,
  },
  {
    id: "chine-usa",
    titre: "Chine / États-Unis : le PIB dit-il encore quelque chose de la puissance ?",
    corps: [
      "30,8 T$ contre 19,5 T$ en 2025. L'écart est net, et pourtant il ne dit rien des chaînes d'approvisionnement, des brevets déposés, ni de qui contrôle le raffinage des terres rares.",
      "La question n'est pas de savoir qui gagne, mais quel indicateur on regarde quand on prétend le mesurer.",
    ],
    ancre: { valeur: "30,8 / 19,5 T$", libelle: "PIB · États-Unis et Chine · 2025", source: "Banque mondiale (WDI)" },
    angles: [
      "Production industrielle, brevets, énergie : lequel remplacerait le PIB ?",
      "Le PIB par habitant change-t-il la lecture ? (× 6,5 en faveur des États-Unis)",
      "Où placez-vous l'Europe dans cette grille ?",
    ],
    theme: "economy",
    themeLabel: "Économie",
    article: { slug: "chine-usa-guerre-economique-decennie", titre: "Chine vs États-Unis : la grande rivalité économique" },
    carte: "/comparer",
    tags: ["Chine", "États-Unis", "Puissance"],
    ouvertLe: "2026-09-04",
  },
  {
    id: "democratie",
    titre: "Vingt ans de recul démocratique : tendance de fond ou creux de cycle ?",
    corps: [
      "Les indices de démocratie reculent presque partout depuis le milieu des années 2000. Le constat est solide ; son interprétation ne l'est pas.",
      "Certains y voient une érosion institutionnelle durable. D'autres rappellent que les vagues de fermeture ont toujours été suivies de vagues d'ouverture. D'autres encore contestent la mesure elle-même.",
    ],
    ancre: { valeur: "20 ans", libelle: "de régression mesurée", source: "Article · La démocratie en recul mondial" },
    angles: [
      "Les indices occidentaux mesurent-ils correctement les démocraties non occidentales ?",
      "Quel signal vous ferait dire que le cycle se retourne ?",
      "Institutions ou opinion publique : par où commence l'érosion ?",
    ],
    theme: "politics",
    themeLabel: "Politique",
    article: { slug: "democratie-en-recul-2025", titre: "La démocratie en recul mondial" },
    carte: "/map/politics",
    tags: ["Démocratie", "Institutions"],
    ouvertLe: "2026-08-28",
  },
  {
    id: "vaccins",
    titre: "80 % des doses COVID pour les pays riches : qu'est-ce qu'on change pour la prochaine ?",
    corps: [
      "La répartition des doses a suivi le pouvoir d'achat, pas l'exposition au risque. Cinq ans après, aucun mécanisme contraignant n'est en vigueur.",
      "Trois pistes reviennent : lever les brevets, pré-financer un stock mondial, ou ne rien contraindre au nom de l'incitation à chercher. Toutes ont un coût, et il n'est pas payé par les mêmes.",
    ],
    ancre: { valeur: "80 %", libelle: "des doses vers les pays riches", source: "Article · L'injustice vaccinale" },
    angles: [
      "Lever les brevets suffit-il, sans les capacités de production ?",
      "Qui paie un stock mondial pré-financé, et selon quelle clé ?",
      "Un précédent qui a fonctionné, sur une autre maladie ?",
    ],
    theme: "epidemics",
    themeLabel: "Épidémies",
    article: { slug: "inegalites-vaccinales-monde", titre: "L'injustice vaccinale" },
    carte: "/map/epidemics",
    tags: ["Santé", "Inégalités"],
    ouvertLe: "2026-08-30",
  },
  {
    id: "brics",
    titre: "BRICS+ : bloc en formation ou coalition de circonstance ?",
    corps: [
      "L'élargissement a fait passer le groupe à près de la moitié de la population mondiale. Il n'a ni monnaie commune, ni doctrine commune, et deux de ses membres ont une frontière contestée.",
      "Reste à savoir si ce qui les rassemble — contester l'ordre existant — suffit à construire quelque chose.",
    ],
    ancre: { valeur: "≈ 45 %", libelle: "de la population mondiale", source: "Article · BRICS+ et multipolarité" },
    angles: [
      "Une monnaie commune est-elle un objectif sérieux ou un signal ?",
      "Inde et Chine peuvent-elles porter le même projet ?",
      "Que perdrait l'Europe si le groupe se structurait vraiment ?",
    ],
    theme: "politics",
    themeLabel: "Politique",
    article: { slug: "brics-ordre-mondial-multipolaire-2025", titre: "BRICS+ et multipolarité" },
    tags: ["BRICS", "Ordre mondial"],
    ouvertLe: "2026-09-01",
  },
  {
    id: "presse",
    titre: "160 journalistes emprisonnés : quel levier fonctionne encore ?",
    corps: [
      "Les condamnations diplomatiques n'ont pas fait baisser le nombre de détentions. Les leviers restants — sanctions ciblées, conditionnalité commerciale, protection des rédactions en exil — ont tous un coût politique.",
    ],
    ancre: { valeur: "160", libelle: "journalistes emprisonnés · 2025", source: "Article · Liberté de la presse 2025" },
    angles: [
      "Sanctionner des individus plutôt que des États : efficace ou symbolique ?",
      "Conditionner le commerce : qui accepterait d'en payer le prix ?",
      "Protéger plutôt que punir : à quelle échelle ?",
    ],
    theme: "politics",
    themeLabel: "Politique",
    article: { slug: "liberte-presse-recul-mondial-rsf-2025", titre: "Liberté de la presse 2025" },
    tags: ["Presse", "Libertés"],
    ouvertLe: "2026-08-26",
  },
  {
    id: "chomage",
    titre: "Chômage : compétences qui manquent, ou commandes qui manquent ?",
    corps: [
      "L'amplitude entre pays va de 3 à plus de 30 %. Le diagnostic qu'on retient commande directement la politique menée — et les deux camps citent les mêmes chiffres.",
    ],
    ancre: { valeur: "de 3 à 32 %", libelle: "amplitude du chômage entre pays", source: "Article · Chômage mondial" },
    angles: [
      "Les postes non pourvus mesurent-ils vraiment un manque de compétences ?",
      "Le sous-emploi est-il comparable d'un pays à l'autre ?",
      "Un pays qui a inversé la courbe : par quel levier ?",
    ],
    theme: "economy",
    themeLabel: "Économie",
    article: { slug: "chomage-inegalites-marches-travail", titre: "Chômage mondial : les grandes fractures" },
    carte: "/map/economy",
    tags: ["Emploi", "Inégalités"],
    ouvertLe: "2026-08-24",
  },
  {
    id: "geants",
    titre: "Faut-il démanteler les géants technologiques ?",
    corps: [
      "Leur capitalisation dépasse le PIB de la plupart des pays. Le débat porte moins sur la taille que sur ce qu'elle permet d'empêcher : l'entrée de concurrents, et l'accès aux données.",
      "Démanteler, réguler, ou laisser faire au nom de la recherche qu'ils financent seuls.",
    ],
    ancre: { valeur: "> PIB national", libelle: "capitalisation des premières valeurs", source: "Article · Les géants technologiques" },
    angles: [
      "L'interopérabilité obligatoire suffirait-elle ?",
      "Qui finance la recherche fondamentale si l'échelle disparaît ?",
      "Un démantèlement européen sans les États-Unis a-t-il un sens ?",
    ],
    theme: "economy",
    themeLabel: "Économie",
    article: { slug: "entreprises-geants-economie-mondiale", titre: "Les géants technologiques et leur poids" },
    tags: ["Tech", "Concurrence"],
    ouvertLe: "2026-08-22",
  },
];

export const TAGS = Array.from(new Set(FILS.flatMap((f) => f.tags)));

export function filParId(id: string): Fil | undefined {
  return FILS.find((f) => f.id === id);
}
