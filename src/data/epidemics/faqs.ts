import type { FAQItem } from "@/types";

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
      "L'absence de données pour certains pays reflète soit un manque de surveillance épidémiologique, soit des données non disponibles publiquement, soit une exposition réellement très faible. Pour la Peste Noire, l'Asie centrale et l'Afrique subsaharienne sont sous-représentées en raison du manque de sources historiques, non d'une absence d'impact réel.",
    category: "Méthodologie",
  },
  {
    question: "Qu'est-ce que le HMPV (Métapneumovirus humain) et pourquoi est-il sur la carte en 2025 ?",
    answer:
      "Le Métapneumovirus humain (hMPV) est un virus respiratoire connu depuis 2001, responsable d'infections des voies respiratoires inférieures similaires à la grippe. Il a connu une forte résurgence en Chine début 2025, avec une hausse significative des hospitalisations pédiatriques. Cette vague s'est propagée dans d'autres régions d'Asie et d'Europe. Le hMPV ne représente pas une menace pandémique comparable au COVID-19, mais son émergence médiatisée et la surveillance renforcée post-COVID en font un indicateur important de la circulation des virus respiratoires en 2025.",
    category: "HMPV 2025",
  },
  {
    question: "Combien de personnes meurent de maladies infectieuses chaque année dans le monde ?",
    answer:
      "Les maladies infectieuses restent l'une des principales causes de décès dans le monde. Le VIH/SIDA tue environ 630 000 personnes par an (ONUSIDA 2023). La tuberculose (non représentée ici) cause ~1,3 million de décès. L'hantavirus tue entre 20 000 et 50 000 personnes annuellement selon les estimations. Le COVID-19, en phase endémique, cause encore 100 000 à 300 000 décès par an selon l'OMS. La carte permet de visualiser ces disparités géographiques.",
    category: "Analyse",
  },
];
