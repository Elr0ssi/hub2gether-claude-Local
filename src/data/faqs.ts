import type { FAQItem } from "@/types";

export const FAQS_EMPIRES: FAQItem[] = [
  {
    question: "What was the largest empire in history?",
    answer:
      "By total land area, the Mongol Empire (1206–1368) was the largest contiguous land empire in history, covering approximately 24 million km² at its peak. The British Empire was technically larger in total (including overseas territories) at around 35 million km², but was not contiguous. The Roman Empire at its peak under Trajan (117 AD) covered approximately 5 million km².",
    category: "Historical Facts",
  },
  {
    question: "When did the Roman Empire reach its peak expansion?",
    answer:
      "The Roman Empire reached its greatest territorial extent in 117 AD under Emperor Trajan, who had just completed the conquest of Dacia (modern Romania) and briefly held Mesopotamia (modern Iraq). This peak covered approximately 5 million km² and included territories from Scotland to the Euphrates River. His successor Hadrian almost immediately abandoned Mesopotamia, recognising it as strategically indefensible.",
    category: "Roman Empire",
  },
  {
    question: "Why did the Roman Empire fall?",
    answer:
      "Historians debate this extensively. Major contributing factors include: military pressure from Germanic peoples and later the Huns on the Rhine-Danube frontier; economic strain from maintaining a vast army; political instability (the '3rd Century Crisis' saw 50+ emperors in 50 years); the division of the empire in 395 AD; the debasement of the currency causing inflation; and the shifting of wealth and power to the East. There was no single cause — it was a centuries-long process of fragmentation.",
    category: "Roman Empire",
  },
  {
    question: "How did empires control territories before modern communication?",
    answer:
      "Pre-modern empires relied on a combination of: military garrisons at strategic points; road networks that allowed rapid troop movements (Rome had over 400,000 km of roads); local administrative intermediaries who collected taxes and maintained order; cultural assimilation (spreading language, law, and religion); and economic integration through trade networks. The most successful empires typically ruled through local elites rather than imposing direct imperial administration everywhere.",
    category: "Empire Dynamics",
  },
  {
    question: "What distinguished the Roman Empire from other ancient empires?",
    answer:
      "Several factors made Rome unique: its remarkably inclusive citizenship policy (non-Romans could become citizens and even emperors); its sophisticated legal system, which remains the foundation of law in most of continental Europe; its infrastructure investment — aqueducts, roads, and cities built to last; and its capacity for political adaptation, shifting from kingdom to republic to principate over eight centuries. Rome absorbed and integrated conquered peoples rather than simply exploiting them.",
    category: "Roman Empire",
  },
  {
    question: "How accurate are the territorial maps on this site?",
    answer:
      "Our maps represent scholarly consensus on approximate historical boundaries. Ancient borders were rarely fixed lines in the modern sense — they were zones of control, influence, and transition. The maps show the generally accepted maximum extent of control at each period, based on historical sources and archaeological evidence. For research purposes, we recommend consulting specialist sources such as the Ancient World Mapping Center (UNC) or the Digital Atlas of Roman and Medieval Civilizations (Harvard).",
    category: "Methodology",
  },
  {
    question: "Where does the historical data come from?",
    answer:
      "Our territorial data draws on peer-reviewed historical scholarship, including works by leading ancient historians and the Ancient World Mapping Center at the University of North Carolina. Population estimates are based on modern demographic analyses of ancient sources by scholars including Walter Scheidel and Bruce Frier. We aim to represent mainstream academic consensus while acknowledging that ancient demographic figures carry inherent uncertainty.",
    category: "Methodology",
  },
  {
    question: "What happened to the Eastern Roman Empire after 476 AD?",
    answer:
      "The Eastern Roman Empire — known today as the Byzantine Empire — survived for nearly a thousand years after the fall of the Western Empire. Centred on Constantinople (modern Istanbul), it remained a major Mediterranean power through the early medieval period, reached a second peak under Justinian I in the 6th century (briefly reconquering Italy and North Africa), and gradually diminished under pressure from Arab conquests (7th century), the Seljuk Turks (11th century), and the Crusaders (who sacked Constantinople in 1204). It finally ended when the Ottoman Turks captured Constantinople on 29 May 1453.",
    category: "Byzantine Empire",
  },
];

export const FAQS_EPIDEMICS: FAQItem[] = [
  {
    question: "Comment sont calculés les taux de létalité sur cette carte ?",
    answer:
      "Le taux de létalité (Case Fatality Rate — CFR) est calculé en divisant le nombre de décès confirmés par le nombre de cas confirmés. Ce ratio est une sous-estimation de la létalité réelle, car il dépend fortement des capacités de dépistage de chaque pays. Pour le COVID-19, les pays à faibles revenus ayant peu testé présentent des CFR apparemment élevés, non reflet d'une maladie plus mortelle, mais d'un sous-dénombrement des cas.",
    category: "Méthodologie",
  },
  {
    question: "Pourquoi les données de la Peste Noire sont-elles si imprécises ?",
    answer:
      "La Peste Noire (1347–1353) précède les recensements modernes de plusieurs siècles. Les estimations reposent sur des registres paroissiaux, des chroniques médiévales, des archives notariales et des fouilles archéologiques. Les fourchettes vont de 30% à 60% de mortalité en Europe occidentale selon les régions. Les données géographiques utilisent les frontières modernes comme approximation, ce qui introduit une distorsion supplémentaire.",
    category: "Méthodologie",
  },
  {
    question: "Quelle est la différence entre FHSR et SPH pour l'hantavirus ?",
    answer:
      "L'hantavirus provoque deux syndromes distincts selon le variant. La Fièvre Hémorragique avec Syndrome Rénal (FHSR) est dominante en Eurasie — notamment en Chine, Corée et Scandinavie — avec une létalité de 1 à 15%. Le Syndrome Pulmonaire à Hantavirus (SPH) sévit en Amérique du Nord et du Sud, causé par différents variants (Sin Nombre aux USA, Andes en Amérique du Sud), avec une létalité beaucoup plus élevée atteignant 35 à 40%.",
    category: "Hantavirus",
  },
  {
    question: "Pourquoi l'Afrique subsaharienne concentre-t-elle autant de cas de VIH ?",
    answer:
      "La concentration du VIH en Afrique subsaharienne tient à plusieurs facteurs : les réseaux sexuels plus denses dans certaines communautés, l'accès limité aux préservatifs et à l'éducation sexuelle, des systèmes de santé sous-financés, et un accès tardif aux traitements antirétroviraux. Des inégalités structurelles — pauvreté, mobilité des populations, inégalités de genre — amplifient la transmission. Aujourd'hui, l'accès au traitement s'est massivement amélioré, mais l'épidémie reste active.",
    category: "VIH/SIDA",
  },
  {
    question: "Le COVID-19 est-il toujours une pandémie ?",
    answer:
      "L'OMS a mis fin à l'urgence de santé publique de portée internationale (USPPI) liée au COVID-19 le 5 mai 2023. Cela ne signifie pas que le virus a disparu : le SARS-CoV-2 circule encore activement dans le monde entier. L'OMS considère désormais qu'il s'est installé dans une phase endémique, comparable à la grippe saisonnière, nécessitant une surveillance continue mais ne justifiant plus les mesures d'urgence mondiales.",
    category: "COVID-19",
  },
  {
    question: "Comment les épidémies historiques ont-elles modifié les structures sociales ?",
    answer:
      "Les grandes épidémies ont systématiquement accéléré des transformations sociales profondes. La Peste Noire a décimé la paysannerie européenne, rendant la main-d'œuvre rare et permettant aux survivants de négocier de meilleures conditions — précipitant la fin du servage. Le COVID-19 a accéléré la numérisation du travail, amplifié les inégalités économiques entre travailleurs qualifiés (télétravail possible) et non qualifiés, et a révélé la fragilité des États-providences.",
    category: "Analyse",
  },
  {
    question: "D'où proviennent les données affichées sur la carte ?",
    answer:
      "Les données COVID-19 proviennent de l'Organisation Mondiale de la Santé (OMS) et du Johns Hopkins Coronavirus Resource Center (données cumulatives début 2024). Les données VIH/SIDA sont issues des rapports ONUSIDA 2023. Les données hantavirus proviennent de l'OMS et du CDC américain. Les données Peste Noire sont des estimations académiques issues de travaux de démographie historique. Toutes ces données sont susceptibles d'être actualisées.",
    category: "Méthodologie",
  },
  {
    question: "Pourquoi certains pays n'ont-ils pas de données sur la carte ?",
    answer:
      "L'absence de données pour certains pays reflète soit un manque de surveillance épidémiologique, soit des données non disponibles publiquement, soit une exposition réellement très faible (cas de l'hantavirus dans de nombreux pays). Pour la Peste Noire, l'Asie centrale et l'Afrique subsaharienne sont sous-représentées en raison du manque de sources historiques, non d'une absence d'impact réel.",
    category: "Méthodologie",
  },
];

export const FAQS_ECONOMY: FAQItem[] = [
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
      "Les données PIB et dette sont issues des bases de données de la Banque mondiale (World Development Indicators) et du Fonds Monétaire International (World Economic Outlook). Les taux de chômage proviennent de l'Organisation Internationale du Travail (ILOSTAT). Les données sur les entreprises sont des estimations Banque mondiale complétées par des sources nationales. Les chiffres des entreprises cotées sont issus des bourses mondiales. Toutes les valeurs sont des approximations susceptibles de révision.",
    category: "Méthodologie",
  },
  {
    question: "Comment lire la carte choroplèthe économique ?",
    answer:
      "La carte utilise un dégradé de vert allant du kaki sombre (valeur la plus faible) au vert néon (valeur la plus élevée). L'échelle est logarithmique pour le PIB et le nombre d'entreprises (pour mieux visualiser les différences entre petits et grands pays), et linéaire pour les ratios. Les pays en gris n'ont pas de données disponibles. Cliquez sur un pays pour voir ses quatre indicateurs et l'évolution sur les six années disponibles.",
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
      "Les données 2020 illustrent parfaitement l'impact des crises : la pandémie COVID-19 a provoqué la plus forte contraction du PIB mondial depuis la Seconde Guerre mondiale (-3,5% mondial). Les dettes publiques ont explosé dans tous les pays développés (+20 à +40 points de ratio dette/PIB en un an). Le chômage américain a dépassé 14% en avril 2020. Les crises précédentes (2008-2009) ont eu un impact comparable mais plus ciblé sur les pays développés. La comparaison entre les années 2015, 2020 et 2023 permet de visualiser la récupération post-COVID.",
    category: "Analyse",
  },
];

export function getFaqsByTheme(theme: string): FAQItem[] {
  switch (theme) {
    case "empires":
      return FAQS_EMPIRES;
    case "economy":
      return FAQS_ECONOMY;
    case "epidemics":
      return FAQS_EPIDEMICS;
    default:
      return [];
  }
}
