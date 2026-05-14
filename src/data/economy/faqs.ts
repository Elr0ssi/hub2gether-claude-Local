import type { FAQItem } from "@/types";

export const FAQS_ECONOMY: FAQItem[] = [
  {
    question: "Quel est le PIB de la France en 2025 ?",
    answer:
      "Selon les projections du FMI (WEO avril 2025), le PIB nominal de la France est estimé à 3 274 milliards de dollars en 2025. La France reste la 7e économie mondiale et la 2e de la zone euro. Son ratio dette/PIB atteint 113% et son taux de chômage est de 7,4%. Avec une croissance modérée de +1,1%, la France fait face à un environnement de consolidation budgétaire tout en maintenant sa position parmi les grandes puissances économiques.",
    category: "PIB par pays 2025",
  },
  {
    question: "Quel pays a le PIB le plus élevé en 2025 ?",
    answer:
      "En 2025, les États-Unis restent la première économie mondiale avec un PIB nominal de 30 337 milliards de dollars (projections FMI), devant la Chine (19 535 milliards), l'Allemagne (4 702 milliards), le Japon (4 389 milliards) et l'Inde (4 187 milliards). En termes de PIB en parité de pouvoir d'achat (PPA), la Chine dépasse les États-Unis depuis 2016. Le classement nominal reste pertinent pour mesurer le poids sur les marchés financiers internationaux.",
    category: "PIB par pays 2025",
  },
  {
    question: "Quelle est la dette publique de la France en 2025 ?",
    answer:
      "La dette publique française atteint 113% du PIB en 2025, selon les projections FMI. En valeur absolue, cela représente environ 3 700 milliards d'euros. Ce niveau dépasse largement le critère de Maastricht (60%), mais reste en dessous du Japon (254%), de l'Italie (137%) ou de la Grèce (157%). Les marchés financiers accordent encore leur confiance à la France grâce à la solidité de l'euro, aux mécanismes de soutien européens et à la diversification des détenteurs de dette.",
    category: "PIB par pays 2025",
  },
  {
    question: "Qu'est-ce que le PIB et comment est-il calculé ?",
    answer:
      "Le Produit Intérieur Brut (PIB) mesure la valeur totale des biens et services produits dans un pays sur une période donnée. Il se calcule selon trois approches équivalentes : par la production (somme des valeurs ajoutées), par les dépenses (consommation + investissement + dépenses publiques + exportations nettes), ou par les revenus. Le PIB nominal est exprimé en dollars courants, ce qui permet des comparaisons directes entre pays mais est sensible aux variations de change.",
    category: "Concepts",
  },
  {
    question: "Que signifie un ratio dette/PIB élevé ?",
    answer:
      "Le ratio dette/PIB exprime le montant de la dette publique en pourcentage de la production économique annuelle du pays. Un ratio élevé (au-delà de 100%) ne signifie pas forcément une crise imminente — le Japon dépasse 260% depuis des années sans perdre la confiance des marchés. Ce qui compte davantage : la capacité à refinancer cette dette, la confiance des investisseurs, la devise dans laquelle elle est libellée, et la croissance économique. La zone de vigilance généralement admise se situe autour de 60% (critère de Maastricht).",
    category: "Concepts",
  },
  {
    question: "Comment mesure-t-on le taux de chômage ?",
    answer:
      "Le taux de chômage selon l'OIT (Organisation Internationale du Travail) compte les personnes sans emploi, disponibles pour travailler et en recherche active dans les quatre semaines précédentes. Il exclut les personnes découragées (qui ont arrêté de chercher) et les sous-employés. Les méthodologies nationales varient, ce qui rend les comparaisons internationales délicates. Le taux U-6 américain, qui inclut les travailleurs marginaux, est typiquement 2 à 3 points supérieur au taux officiel.",
    category: "Concepts",
  },
  {
    question: "Pourquoi certains pays ont-ils plus d'entreprises que d'autres ?",
    answer:
      "Le nombre d'entreprises enregistrées dépend de plusieurs facteurs : la facilité administrative de création (les pays nordiques et l'Asie du Sud-Est ont simplifié ce processus), le niveau de formalisation de l'économie (l'économie informelle est massive en Afrique et en Asie du Sud), la taille de la population, et les incitations fiscales. L'Inde et la Chine ont des chiffres très élevés en partie grâce à leurs vastes marchés intérieurs et à des réformes récentes de simplification administrative.",
    category: "Concepts",
  },
  {
    question: "Quelles sont les sources des données économiques affichées ?",
    answer:
      "Les données PIB et dette sont issues des bases de données de la Banque mondiale (World Development Indicators) et du Fonds Monétaire International (World Economic Outlook). Les taux de chômage proviennent de l'Organisation Internationale du Travail (ILOSTAT). Les données sur les entreprises sont des estimations Banque mondiale complétées par des sources nationales. Toutes les valeurs sont des approximations susceptibles de révision.",
    category: "Méthodologie",
  },
  {
    question: "Comment lire la carte choroplèthe économique ?",
    answer:
      "La carte utilise un dégradé de vert allant du kaki sombre (valeur la plus faible) au vert néon (valeur la plus élevée). L'échelle est logarithmique pour le PIB et le nombre d'entreprises (pour mieux visualiser les différences entre petits et grands pays), et linéaire pour les ratios. Les pays en gris n'ont pas de données disponibles. Cliquez sur un pays pour voir ses quatre indicateurs et l'évolution sur les années disponibles.",
    category: "Utilisation",
  },
  {
    question: "Quelle est la différence entre PIB nominal et PIB en parité de pouvoir d'achat ?",
    answer:
      "Le PIB nominal convertit simplement la production nationale au taux de change courant. Le PIB en parité de pouvoir d'achat (PPA) ajuste les prix locaux pour permettre des comparaisons plus justes du niveau de vie. Exemple : avec 100 dollars, on peut acheter davantage en Inde qu'aux États-Unis. En PPA, la Chine dépasse les États-Unis depuis 2016. Cette carte utilise le PIB nominal, plus approprié pour comparer les poids économiques sur les marchés financiers internationaux.",
    category: "Concepts",
  },
  {
    question: "Quel impact ont les crises économiques sur les indicateurs mondiaux ?",
    answer:
      "Les données 2020 illustrent parfaitement l'impact des crises : la pandémie COVID-19 a provoqué la plus forte contraction du PIB mondial depuis la Seconde Guerre mondiale (-3,5% mondial). Les dettes publiques ont explosé dans tous les pays développés (+20 à +40 points de ratio dette/PIB en un an). Le chômage américain a dépassé 14% en avril 2020. La comparaison entre les années 2015, 2020 et 2025 permet de visualiser la récupération post-COVID.",
    category: "Analyse",
  },
  {
    question: "Comment comparer le PIB de deux pays avec cet outil ?",
    answer:
      "Rendez-vous sur la page Comparaison (accessible depuis la barre de navigation) pour sélectionner deux pays et les confronter directement. Vous y verrez le PIB 2025, la dette publique, le chômage, la superficie, la population et le budget militaire côte à côte avec le ratio automatique. Sur la carte interactive économique, cliquez sur un pays pour afficher dans le panneau latéral ses quatre indicateurs et leur évolution de 2000 à 2025.",
    category: "Utilisation",
  },
  {
    question: "Qu'est-ce que la vue YTD (depuis le début de l'année) sur la carte économique ?",
    answer:
      "La vue YTD (Year-To-Date, ou 'depuis le 1er janvier') est disponible pour l'année en cours sur l'indicateur PIB. Elle affiche le PIB généré depuis le 1er janvier jusqu'au jour actuel, calculé par prorata (PIB annuel × jours écoulés / 365). Cette vue est utile pour visualiser la production économique en temps réel. Le PIB est un flux (production journalière) qui se prête bien à ce calcul, contrairement à la dette ou au chômage qui sont des stocks ou des taux instantanés.",
    category: "Utilisation",
  },
];
