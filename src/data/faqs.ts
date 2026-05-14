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

export const FAQS_ECONOMY: FAQItem[] = [
  {
    question: "What is the most indebted country in the world?",
    answer:
      "As of 2024, Japan has the highest debt-to-GDP ratio among major economies, at approximately 260%. However, Japan's debt is largely held domestically in yen, which reduces default risk. Among countries with high external debt exposure, several emerging economies face greater vulnerability despite lower absolute debt levels.",
    category: "Economic Facts",
  },
  {
    question: "How is public debt measured?",
    answer:
      "Public debt is most commonly measured as a percentage of GDP (Gross Domestic Product). This ratio indicates how large a country's debt is relative to the size of its economy. The IMF and World Bank use this metric for cross-country comparisons. A ratio above 90% is generally considered a risk threshold, though context — interest rates, debt structure, and currency composition — matters enormously.",
    category: "Methodology",
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
