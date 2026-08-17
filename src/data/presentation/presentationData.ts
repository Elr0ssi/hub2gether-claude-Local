/**
 * THE ESSENTIAL DATA — PRESENTATION SYSTEM
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for every word spoken or shown in the soutenance deck.
 * Layout lives in src/components/presentation/** — edit copy here, never there.
 *
 * Conventions
 *   · `value: null` on a Kpi renders a visible {DATA_TO_FILL} placeholder.
 *   · `speakerNotes` are shown only in presenter mode (`?presenter=true`).
 *   · `minutes` is the indicative budget used by the presenter timer.
 *   · No figure in this file is invented. Anything not verifiable from the
 *     repository is left as a placeholder for manual completion.
 */

export type SlidePart = "I" | "II" | "III" | "transition";

/** Visual act — drives the density of the recurring data-flow motif. */
export type Act = 1 | 2 | 3 | 4;

export interface Kpi {
  id: string;
  label: string;
  /** null → renders as a {DATA_TO_FILL} placeholder */
  value: string | null;
  hint?: string;
}

export interface SlideMeta {
  /** Stable id — also used by `?slide=<n>` deep links (1-based index). */
  id: string;
  part: SlidePart;
  act: Act;
  /** Section label shown in the overview / presenter rail. */
  label: string;
  /** Indicative speaking time, in minutes. */
  minutes: number;
  speakerNotes: string;
  /** Dark slides invert the chrome (progress bar, slide number). */
  tone?: "light" | "dark";
}

/* ═══════════════════════════════════════════════════════════════════════════
   GLOBAL STRINGS
   ═══════════════════════════════════════════════════════════════════════════ */

export const BRAND = {
  name: "The Essential Data",
  tagline: "Turning data into meaning.",
  taglineFr: "Comprendre le monde par la donnée.",
} as const;

/** Route opened by the live-demo slide. */
export const DEMO_ROUTE = "/map/economy";
export const DEMO_DURATION = "60–90 sec demo";

/** The problématique of Part II. Displayed in full on its own slide. */
export const RESEARCH_QUESTION =
  "Comment une petite structure peut-elle produire une information large, rapide et plurielle sans sacrifier sa fiabilité ?";

/* ═══════════════════════════════════════════════════════════════════════════
   PART I — PITCH ENTREPRENEURIAL (≈10 min)
   ═══════════════════════════════════════════════════════════════════════════ */

/* 02 — LE CONSTAT ───────────────────────────────────────────────────────── */

export const CONSTAT = {
  headline: "Nous n’avons jamais eu accès à autant d’informations.",
  reveal: "Et pourtant, comprendre le monde reste complexe.",
  /** Scattered nodes that converge as the slide plays. */
  nodes: [
    "FMI",
    "Banque mondiale",
    "Eurostat",
    "Presse",
    "Études",
    "Institutions",
    "Bases statistiques",
    "Rapports",
    "Think tanks",
  ],
} as const;

/* 03 — LE PROBLÈME ──────────────────────────────────────────────────────── */

export const PROBLEME = {
  blocks: [
    {
      index: "01",
      title: "Trop d’information",
      body: "Volume massif.",
    },
    {
      index: "02",
      title: "Trop fragmentée",
      body: "Sources dispersées.",
    },
    {
      index: "03",
      title: "Pas assez contextualisée",
      body: "Une donnée seule n’explique pas un phénomène.",
    },
  ],
  closing: "Une information existe rarement sous un seul angle.",
} as const;

/* 04 — PROPOSITION DE VALEUR ────────────────────────────────────────────── */

export const VALUE_PROP = {
  headline: "Et si l’information mondiale devenait explorable ?",
  chain: ["Data", "Contexte", "Analyse", "Compréhension"],
  body: "The Essential Data rassemble données, visualisations et analyses pour offrir plusieurs angles de compréhension d’un même phénomène.",
} as const;

/* 05 — LE PRODUIT ───────────────────────────────────────────────────────── */

export const PRODUCT_LEVELS = [
  {
    index: "01",
    key: "explore",
    title: "Explore",
    items: ["Cartes", "Globe", "Pays", "Indicateurs"],
    mediaLabel: "Screenshot — carte interactive",
  },
  {
    index: "02",
    key: "understand",
    title: "Understand",
    items: ["Comparaisons", "Évolutions", "Relations", "Chiffres clés"],
    mediaLabel: "Screenshot — comparaison pays",
  },
  {
    index: "03",
    key: "deepdive",
    title: "Deep dive",
    items: ["Articles", "Analyses", "Sources", "Perspectives"],
    mediaLabel: "Screenshot — article + sources",
  },
] as const;

export const PRODUCT_HEADLINE = "Une interface pour explorer le monde.";

/* 07 — DU CONCEPT AU PRODUIT ────────────────────────────────────────────── */

export const TIMELINE_STEPS = [
  { index: "01", label: "Idée", state: "done" },
  { index: "02", label: "Business plan", state: "done" },
  { index: "03", label: "MVP", state: "done" },
  { index: "04", label: "Mise en ligne", state: "done" },
  { index: "05", label: "Automatisation éditoriale", state: "done" },
  { index: "06", label: "Premières utilisations / trafic", state: "done" },
  { index: "07", label: "Refonte architecturale", state: "current" },
] as const;

/** Traffic & usage figures are deliberately empty — fill in before the jury. */
export const TRACTION_KPIS: Kpi[] = [
  { id: "articles", label: "Articles publiés", value: null, hint: "compté depuis src/data" },
  { id: "visitors", label: "Visiteurs", value: null, hint: "analytics" },
  { id: "pageviews", label: "Pages vues", value: null, hint: "analytics" },
  { id: "avgtime", label: "Temps moyen / session", value: null, hint: "analytics" },
];

/* 08 — RALENTIR POUR ACCÉLÉRER ──────────────────────────────────────────── */

export const SLOWDOWN = {
  headline: "Ralentir pour pouvoir accélérer.",
  before: {
    label: "Avant",
    items: [
      "Articles déjà publiés",
      "Automatisation de publication",
      "Révision automatisée",
      "Architecture initiale",
      "Acquisition de trafic active",
    ],
  },
  now: {
    label: "Aujourd’hui",
    items: [
      "Articles existants toujours accessibles",
      "Trafic volontairement mis en retrait",
      "Publication automatisée temps réel suspendue",
      "Révision automatique suspendue",
      "Refonte de la base de données",
      "Reconstruction du pipeline éditorial",
    ],
  },
  closing:
    "The Essential Data n’est pas à l’arrêt. Il change d’échelle technique.",
} as const;

/* 09 — LA VISION ────────────────────────────────────────────────────────── */

export const VISION = {
  headline: ["Une petite structure.", "Une couverture mondiale."],
  domains: [
    "Économie",
    "Diplomatie",
    "Géopolitique",
    "Énergie",
    "Finance",
    "Industrie",
    "Défense",
    "Démographie",
    "Ressources",
    "Climat",
    "Commerce mondial",
  ],
  message:
    "Comprendre un événement nécessite de croiser plusieurs disciplines et plusieurs points de vue.",
} as const;

/* 10 — AMBITION ÉDITORIALE ──────────────────────────────────────────────── */

export const EDITORIAL_AMBITION = {
  headline: "Plus de perspectives. Pas plus de bruit.",
  sources: [
    "Presse internationale",
    "Institutions",
    "Bases statistiques",
    "Recherches académiques",
    "Publications spécialisées",
  ],
  output: "Analyse structurée",
  message: [
    "L’objectif n’est pas de remplacer les sources.",
    "L’objectif est de les faire dialoguer.",
  ],
} as const;

/* 11 — COMMENT ÇA FONCTIONNE ────────────────────────────────────────────── */

export const ENGINE_STAGES = [
  "Sources",
  "Ingestion",
  "Structuration",
  "Analyse assistée par IA",
  "Croisement",
  "Validation",
  "Publication",
  "Actualisation",
] as const;

export const ENGINE_HEADLINE = "Le moteur éditorial.";

/* 12 — IA ≠ JOURNALISTE AUTONOME ────────────────────────────────────────── */

export const AI_HUMAN = {
  headline: ["L’IA est un levier.", "Pas une autorité éditoriale."],
  ai: {
    label: "IA",
    items: [
      "Recherche",
      "Extraction",
      "Classification",
      "Comparaison",
      "Synthèse",
      "Détection de mises à jour",
      "Assistance à la rédaction",
    ],
  },
  human: {
    label: "Humain",
    items: [
      "Angle",
      "Contradiction",
      "Interprétation",
      "Validation",
      "Nuance",
      "Responsabilité",
    ],
  },
  center: "Human in the loop",
  closing:
    "Automatiser la production ne signifie pas automatiser la responsabilité.",
} as const;

/* TRANSITION — PITCH → APPROFONDISSEMENT ────────────────────────────────── */

export const PART_TRANSITION = {
  first: "Nous avons construit le produit.",
  second:
    "Comment le faire changer d’échelle sans perdre ce qui crée sa valeur ?",
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   PART II — APPROFONDISSEMENT ENTREPRENEURIAL (≈15 min)
   ═══════════════════════════════════════════════════════════════════════════ */

/* 13 — L'ÉQUATION ───────────────────────────────────────────────────────── */

export const EQUATION = {
  wants: [
    "Sujets",
    "Sources",
    "Profondeur",
    "Rapidité",
    "Actualisation",
    "Perspectives",
  ],
  constraint: "Une structure limitée.",
  closing:
    "Le modèle éditorial traditionnel rend cette équation difficilement soutenable pour une petite structure.",
} as const;

/* 14 — LA TECHNOLOGIE COMME LEVIER ──────────────────────────────────────── */

export const LEVERAGE = {
  headline: "La technologie comme levier.",
  effects: [
    "Réduction du coût marginal de traitement",
    "Augmentation de la couverture",
    "Augmentation de la fréquence",
    "Capacité de comparaison",
    "Actualisation continue",
  ],
  contrast: {
    left: "Technologie",
    right: "Fiabilité automatique",
  },
} as const;

/* 15 — ARCHITECTURE CIBLE ───────────────────────────────────────────────── */

export const ARCHITECTURE_LAYERS = [
  {
    index: "01",
    title: "Sources",
    items: ["Médias", "Institutions", "APIs", "Bases statistiques", "Études"],
  },
  {
    index: "02",
    title: "Data ingestion",
    items: ["API", "Feeds", "Connecteurs", "Collecte"],
  },
  {
    index: "03",
    title: "Knowledge layer",
    items: ["Normalisation", "Déduplication", "Classification", "Historisation"],
  },
  {
    index: "04",
    title: "AI layer",
    items: ["Extraction", "Comparaison", "Synthèse", "Détection de divergence"],
  },
  {
    index: "05",
    title: "Validation",
    items: ["Contrôles automatiques", "Validation humaine", "Traçabilité"],
  },
  {
    index: "06",
    title: "Experience",
    items: ["Articles", "Cartes", "Globe", "Comparaisons", "Data visualisations"],
  },
] as const;

export const ARCHITECTURE_HEADLINE = "Notre architecture cible.";

/* 16 — BUILD → MEASURE → LEARN ──────────────────────────────────────────── */

export const LEAN_LOOP = {
  theory: "Lean Startup",
  loop: ["Build", "Measure", "Learn"],
  applied: [
    { key: "Build", label: "Première plateforme." },
    { key: "Measure", label: "Utilisation réelle + fonctionnement du pipeline." },
    { key: "Learn", label: "Limites de l’architecture initiale." },
    { key: "Rebuild", label: "Nouvelle architecture." },
  ],
  message: [
    "La refonte actuelle n’est pas un échec du MVP.",
    "Elle est un résultat du MVP.",
  ],
} as const;

/* 17 — AGILITÉ / PRODUCT MANAGEMENT ─────────────────────────────────────── */

export const AGILE = {
  theory: "Agilité · Product management",
  headline: "Itérer plutôt que planifier.",
  steps: ["Vision", "MVP", "Test", "Feedback", "Itération", "Refonte", "V2"],
  application: [
    {
      concept: "Boucle de feedback courte",
      applied:
        "Les limites du pipeline éditorial ont été identifiées en production, pas en conception.",
      mediaLabel: "Avant / après — pipeline",
    },
    {
      concept: "Périmètre réduit, livré",
      applied:
        "Un MVP publié plutôt qu’une architecture complète non livrée.",
      mediaLabel: "Avant / après — architecture data",
    },
  ],
} as const;

/* 18 — PARADOXE DE L'AUTOMATISATION ─────────────────────────────────────── */

export const AUTOMATION_PARADOX = {
  headline: "Le paradoxe de l’automatisation.",
  gains: {
    label: "Automatisation",
    items: ["Vitesse", "Volume", "Couverture", "Actualisation"],
  },
  risks: {
    label: "Risques",
    items: [
      "Erreur",
      "Hallucination",
      "Uniformisation",
      "Perte de nuance",
      "Biais",
      "Opacité",
    ],
  },
  fulcrum: "Trust",
  message: [
    "La valeur ne vient pas de l’automatisation elle-même.",
    "Elle vient de la confiance que l’on peut maintenir malgré l’automatisation.",
  ],
} as const;

/* 19 — LE MODÈLE CIBLE ──────────────────────────────────────────────────── */

export const TARGET_MODEL = {
  headline: "Le modèle cible.",
  automated: {
    label: "Automatiser ce qui peut l’être",
    items: [
      "Collecte",
      "Structuration",
      "Classification",
      "Comparaison",
      "Monitoring",
      "Mise à jour",
      "Préparation",
    ],
  },
  human: {
    label: "Conserver l’humain là où il crée le plus de valeur",
    items: [
      "Angle",
      "Interprétation",
      "Contradiction",
      "Décision éditoriale",
      "Validation",
      "Responsabilité",
    ],
  },
} as const;

/* 20 — CE QUE J'AI APPRIS ───────────────────────────────────────────────── */

export const LEARNINGS = {
  headline: "Trois enseignements.",
  items: [
    {
      index: "01",
      statement: "Une bonne idée n’est pas encore une proposition de valeur.",
      sub: "Elle se construit au contact du produit et de ses utilisateurs.",
    },
    {
      index: "02",
      statement:
        "Automatiser un mauvais processus ne crée pas un bon processus.",
      sub: "La technologie amplifie également les faiblesses d’une architecture.",
    },
    {
      index: "03",
      statement:
        "La technologie réduit les barrières à l’entrée. Pas les exigences de qualité.",
      sub: "La confiance reste l’actif central d’un média.",
    },
  ],
} as const;

/* 21 — OÙ NOUS EN SOMMES ────────────────────────────────────────────────── */

export const PHASES = [
  { index: "Phase 1", label: "Concept", state: "done" },
  { index: "Phase 2", label: "MVP", state: "done" },
  { index: "Phase 3", label: "Validation technique", state: "done" },
  { index: "Phase 4", label: "Refonte data & éditoriale", state: "current" },
  { index: "Phase 5", label: "Relaunch", state: "next" },
  { index: "Phase 6", label: "Scale", state: "next" },
] as const;

export const PHASES_HEADLINE = "Où nous en sommes.";

/* 22 — CE QU'IL RESTE À PROUVER ─────────────────────────────────────────── */

export const TO_PROVE = {
  headline: "Ce qu’il reste à prouver.",
  columns: [
    {
      index: "01",
      title: "Trust",
      body: "Prouver que le système peut produire de la profondeur à grande échelle sans perdre sa fiabilité.",
    },
    {
      index: "02",
      title: "Distribution",
      body: "Construire une audience récurrente et identifiable.",
    },
    {
      index: "03",
      title: "Business",
      body: "Transformer cette audience et cette technologie en modèle économique durable.",
    },
  ],
  first:
    "Le risque principal n’est plus de savoir si le produit peut être construit.",
  reveal: "C’est de savoir s’il peut devenir une organisation durable.",
} as const;

/* 23 — POURQUOI CE JURY ─────────────────────────────────────────────────── */

export const JURY = {
  headline: "Pourquoi vous solliciter maintenant ?",
  intro:
    "The Essential Data arrive à une étape où les décisions à prendre ne sont plus uniquement techniques.",
  axes: [
    {
      index: "01",
      title: "Prioriser",
      body: "Quelles fonctionnalités créent réellement de la valeur ?",
    },
    {
      index: "02",
      title: "Structurer",
      body: "Quel niveau de contrôle et de gouvernance faut-il maintenir ?",
    },
    {
      index: "03",
      title: "Monétiser",
      body: "Quel modèle permet de financer la qualité sans dégrader l’accessibilité ?",
    },
  ],
  closing:
    "Nous avons besoin de confronter nos choix à des regards extérieurs avant la prochaine phase de développement.",
} as const;

/* 24 — ROADMAP ──────────────────────────────────────────────────────────── */

export const ROADMAP = [
  {
    horizon: "Now",
    items: ["Architecture data", "Pipeline éditorial", "UX / produit"],
  },
  {
    horizon: "Next",
    items: ["Tests", "Fiabilisation", "Réactivation des automatisations"],
  },
  {
    horizon: "Then",
    items: ["Acquisition", "SEO", "Distribution", "Partenariats"],
  },
  {
    horizon: "Later",
    items: ["Monétisation", "Expansion", "Nouveaux produits data"],
  },
] as const;

export const ROADMAP_HEADLINE = "Roadmap.";

/* 25 — CONCLUSION ───────────────────────────────────────────────────────── */

export const CONCLUSION = {
  first: "Nous ne voulons pas produire davantage d’information.",
  second: "Nous voulons permettre de mieux comprendre celle qui existe.",
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   SLIDE REGISTRY — order, timing, speaker notes
   ═══════════════════════════════════════════════════════════════════════════ */

export const SLIDES: SlideMeta[] = [
  {
    id: "cover",
    part: "I",
    act: 1,
    label: "Cover",
    minutes: 0.5,
    tone: "dark",
    speakerNotes:
      "Se présenter. Nommer le projet et la promesse en une phrase : donner du sens à la donnée. Ne pas commenter le globe, le laisser agir.",
  },
  {
    id: "constat",
    part: "I",
    act: 1,
    label: "Le constat",
    minutes: 0.75,
    speakerNotes:
      "Poser le paradoxe : abondance d’information, difficulté de compréhension. Citer deux ou trois sources à l’écran, puis laisser la convergence se faire.",
  },
  {
    id: "probleme",
    part: "I",
    act: 1,
    label: "Le problème",
    minutes: 0.5,
    speakerNotes:
      "Trois problèmes, un par bloc. Marquer un temps avant la phrase de clôture : une information existe rarement sous un seul angle.",
  },
  {
    id: "valeur",
    part: "I",
    act: 2,
    label: "Proposition de valeur",
    minutes: 0.5,
    speakerNotes:
      "Formuler la proposition de valeur comme une question ouverte, puis dérouler la chaîne data → contexte → analyse → compréhension.",
  },
  {
    id: "produit",
    part: "I",
    act: 2,
    label: "Le produit",
    minutes: 1,
    speakerNotes:
      "Trois niveaux de lecture du produit. Rester descriptif : ce que l’utilisateur peut faire, pas ce que la technologie fait.",
  },
  {
    id: "demo",
    part: "I",
    act: 2,
    label: "Démo live",
    minutes: 1.5,
    tone: "dark",
    speakerNotes:
      "Ouvrir la plateforme dans un nouvel onglet. 60 à 90 secondes maximum : une carte, un pays, un article. Revenir au deck avec Alt+Tab.",
  },
  {
    id: "concept-produit",
    part: "I",
    act: 2,
    label: "Du concept au produit",
    minutes: 0.75,
    speakerNotes:
      "Dérouler les sept étapes. Insister sur l’étape 07 : la refonte est l’étape actuelle, pas un accident de parcours.",
  },
  {
    id: "ralentir",
    part: "I",
    act: 2,
    label: "Pourquoi avoir ralenti",
    minutes: 1.25,
    speakerNotes:
      "Slide décisive. Assumer le ralentissement : publication automatisée et révision automatique suspendues, trafic mis en retrait, base de données et pipeline en refonte. Le projet n’est pas à l’arrêt, il change d’échelle technique.",
  },
  {
    id: "vision",
    part: "I",
    act: 2,
    label: "La vision",
    minutes: 0.75,
    tone: "dark",
    speakerNotes:
      "Petite structure, couverture mondiale. Insister sur la pluralité disciplinaire plutôt que sur le nombre de sujets.",
  },
  {
    id: "ambition",
    part: "I",
    act: 3,
    label: "Ambition éditoriale",
    minutes: 0.75,
    speakerNotes:
      "Plus de perspectives, pas plus de bruit. Le rôle n’est pas de remplacer les sources mais de les faire dialoguer.",
  },
  {
    id: "moteur",
    part: "I",
    act: 3,
    label: "Comment ça fonctionne",
    minutes: 1,
    speakerNotes:
      "Dérouler le pipeline sans jargon. Nommer explicitement l’étape de validation : c’est elle qui rend le reste défendable.",
  },
  {
    id: "ia-humain",
    part: "I",
    act: 3,
    label: "IA ≠ journaliste autonome",
    minutes: 1,
    speakerNotes:
      "Positionnement à ne pas rater : l’IA est un levier de traitement, pas une autorité éditoriale. Terminer sur la phrase : automatiser la production ne signifie pas automatiser la responsabilité.",
  },
  {
    id: "transition",
    part: "transition",
    act: 3,
    label: "Transition",
    minutes: 0.25,
    tone: "dark",
    speakerNotes:
      "Silence. Laisser la première phrase respirer avant la seconde. C’est le pivot vers la partie académique.",
  },
  {
    id: "question",
    part: "II",
    act: 3,
    label: "Problématique",
    minutes: 0.5,
    speakerNotes:
      "Énoncer la problématique telle qu’affichée, sans la reformuler. Annoncer qu’elle structure toute la seconde partie.",
  },
  {
    id: "equation",
    part: "II",
    act: 3,
    label: "L’équation",
    minutes: 1,
    speakerNotes:
      "Montrer la tension : six exigences contre une structure limitée. Conclure que le modèle éditorial traditionnel ne tient pas cette équation.",
  },
  {
    id: "levier",
    part: "II",
    act: 3,
    label: "La technologie comme levier",
    minutes: 1,
    speakerNotes:
      "Transformation digitale : la technologie change le modèle opératoire, pas seulement l’outil. Mais elle ne produit aucune fiabilité par elle-même.",
  },
  {
    id: "architecture",
    part: "II",
    act: 3,
    label: "Architecture cible",
    minutes: 1.5,
    speakerNotes:
      "Slide la plus technique. Six couches. Marquer que la couche 05 (validation) est ce qui distingue l’architecture d’un simple générateur de contenu.",
  },
  {
    id: "lean",
    part: "II",
    act: 4,
    label: "Build → Measure → Learn",
    minutes: 1.75,
    speakerNotes:
      "Lean Startup appliqué : la refonte n’est pas un échec du MVP, elle est un résultat du MVP. C’est le cœur de l’argumentation académique.",
  },
  {
    id: "agilite",
    part: "II",
    act: 4,
    label: "Agilité / product management",
    minutes: 1,
    speakerNotes:
      "Relier aux méthodes du cursus sans faire un cours : chaque concept est suivi de son application concrète.",
  },
  {
    id: "paradoxe",
    part: "II",
    act: 4,
    label: "Paradoxe de l’automatisation",
    minutes: 1.25,
    tone: "dark",
    speakerNotes:
      "Gestion du risque : les gains et les risques sont produits par la même cause. Le point d’équilibre est la confiance.",
  },
  {
    id: "modele-cible",
    part: "II",
    act: 4,
    label: "Le modèle cible",
    minutes: 1,
    speakerNotes:
      "Répartition automatisation / humain. Ne pas donner de pourcentage : la frontière est mouvante et se décide processus par processus.",
  },
  {
    id: "part-three",
    part: "III",
    act: 4,
    label: "Audience & modèle économique",
    minutes: 0.25,
    tone: "dark",
    speakerNotes:
      "Ouverture de la troisième partie. Annoncer les trois questions : où en est l’audience, où elle peut aller, ce qu’elle rapporte.",
  },
  {
    id: "audience",
    part: "III",
    act: 4,
    label: "Où en est l’audience",
    minutes: 1,
    speakerNotes:
      "Donner les chiffres mesurés, sans les habiller. Rappeler qu’ils sont relevés pendant une phase d’acquisition volontairement mise en retrait : c’est un socle, pas un plafond.",
  },
  {
    id: "benchmark",
    part: "III",
    act: 4,
    label: "Benchmark concurrence",
    minutes: 1.5,
    speakerNotes:
      "Situer l’ordre de grandeur du marché. Ne pas se comparer en valeur absolue : montrer que la niche data existe et qu’elle est occupée par des structures parfois très petites. Citer la source et sa date.",
  },
  {
    id: "trajectory",
    part: "III",
    act: 4,
    label: "Prévisionnel d’audience",
    minutes: 1.5,
    speakerNotes:
      "Trois jalons, trois leviers. Assumer que la courbe est une cible conditionnée à la livraison de la refonte, et non une projection statistique.",
  },
  {
    id: "revenue-channels",
    part: "III",
    act: 4,
    label: "Trois canaux de revenus",
    minutes: 1.5,
    speakerNotes:
      "Site, réseaux sociaux, partenariats. Insister sur le fait que les trois reposent sur le même actif : la confiance dans la donnée publiée. Sans elle, aucun des trois ne tient.",
  },
  {
    id: "revenue-model",
    part: "III",
    act: 4,
    label: "Ce que cela rapporte",
    minutes: 1.5,
    speakerNotes:
      "Présenter des formules avant des montants. Si le jury demande un chiffre, donner l’hypothèse unitaire et la variable qui la fait bouger plutôt qu’un total inventé.",
  },
  {
    id: "apprentissages",
    part: "II",
    act: 4,
    label: "Ce que j’ai appris",
    minutes: 1.25,
    speakerNotes:
      "Trois enseignements, un par temps. Parler en première personne, rester factuel.",
  },
  {
    id: "phases",
    part: "II",
    act: 4,
    label: "Où nous en sommes",
    minutes: 0.75,
    speakerNotes:
      "Situer précisément le projet : phase 4 en cours. Ne pas annoncer de date non tenable.",
  },
  {
    id: "a-prouver",
    part: "II",
    act: 4,
    label: "Ce qu’il reste à prouver",
    minutes: 1.25,
    speakerNotes:
      "Trois risques assumés. Terminer sur le déplacement du risque : de la faisabilité technique vers la durabilité organisationnelle.",
  },
  {
    id: "jury",
    part: "II",
    act: 4,
    label: "Pourquoi ce jury",
    minutes: 1,
    speakerNotes:
      "Ton humble et précis. Nommer les trois axes sur lesquels un regard extérieur est réellement attendu : prioriser, structurer, monétiser.",
  },
  {
    id: "roadmap",
    part: "II",
    act: 4,
    label: "Roadmap",
    minutes: 0.75,
    speakerNotes:
      "Quatre horizons, pas de dates. Now et Next sont engagés, Then et Later sont conditionnés aux résultats.",
  },
  {
    id: "conclusion",
    part: "II",
    act: 4,
    label: "Conclusion",
    minutes: 0.75,
    tone: "dark",
    speakerNotes:
      "Deux phrases, un silence entre les deux. Terminer sur le nom et la signature, puis se taire et ouvrir les questions.",
  },
];

export const TOTAL_MINUTES = SLIDES.reduce((sum, s) => sum + s.minutes, 0);

/* ═══════════════════════════════════════════════════════════════════════════
   PART III — AUDIENCE & MODÈLE ÉCONOMIQUE
   ───────────────────────────────────────────────────────────────────────────
   Every figure below is deliberately null. Fill a `value` and the slide stops
   rendering a {DATA_TO_FILL} slot and starts rendering the number; fill the
   chart series and the bars and the trajectory draw themselves.

   Nothing here is estimated on your behalf: audience, competitor traffic and
   revenue are exactly the numbers a jury will press on, and an invented one is
   worse than an empty one.
   ═══════════════════════════════════════════════════════════════════════════ */

export const PART_THREE_OPENER = {
  part: "Partie III",
  title: "Audience & modèle économique",
  lead: "Ce que nous mesurons aujourd’hui, ce que nous visons, et ce que cela peut rapporter.",
} as const;

/* A — OÙ EN EST L’AUDIENCE ──────────────────────────────────────────────── */

export const AUDIENCE_NOW = {
  headline: "Où en est l’audience.",
  kpis: [
    { id: "visitors", label: "Visiteurs / mois", value: null, hint: "analytics" },
    { id: "pageviews", label: "Pages vues / mois", value: null, hint: "analytics" },
    { id: "sessions", label: "Sessions / mois", value: null, hint: "analytics" },
    { id: "duration", label: "Durée moyenne", value: null, hint: "analytics" },
    { id: "articles", label: "Articles publiés", value: null, hint: "src/data" },
    { id: "indexed", label: "Pages indexées", value: null, hint: "Search Console" },
  ] as Kpi[],
  note: "Chiffres mesurés pendant une phase où l’acquisition est volontairement mise en retrait : ils décrivent un socle, pas un plafond.",
} as const;

/* B — BENCHMARK CONCURRENTIEL ───────────────────────────────────────────── */

export interface BenchmarkRow {
  /** Rename freely — these are proposed comparables, not a fixed list. */
  name: string;
  /** Monthly visits. null → the bar renders as a slot to fill. */
  monthlyVisits: number | null;
  /** Marks the row as us: highlighted, always last. */
  isUs?: boolean;
}

export const BENCHMARK = {
  headline: "Où nous nous situons.",
  unit: "visites / mois",
  /** e.g. "SimilarWeb, janvier 2026" — cite the tool and the date. */
  source: null as string | null,
  rows: [
    { name: "Our World in Data", monthlyVisits: null },
    { name: "Statista", monthlyVisits: null },
    { name: "Visual Capitalist", monthlyVisits: null },
    { name: "Les Décodeurs — Le Monde", monthlyVisits: null },
    { name: "The Essential Data", monthlyVisits: null, isUs: true },
  ] as BenchmarkRow[],
  caption:
    "L’écart d’audience n’est pas l’objectif : il donne l’ordre de grandeur du marché sur lequel une petite structure peut prendre une place.",
} as const;

/* C — PRÉVISIONNEL D’AUDIENCE ───────────────────────────────────────────── */

export interface TrajectoryPoint {
  label: string;
  /** Visitors per month. null → renders as a milestone slot. */
  value: number | null;
  state: "actual" | "target";
}

export const TRAJECTORY = {
  headline: "Prévisionnel d’audience.",
  unit: "visiteurs / mois",
  points: [
    { label: "Aujourd’hui", value: null, state: "actual" },
    { label: "Fin d’année", value: null, state: "target" },
    { label: "Année + 1", value: null, state: "target" },
    { label: "Année + 2", value: null, state: "target" },
  ] as TrajectoryPoint[],
  /** The levers behind the curve — stated as mechanisms, not as multipliers. */
  levers: [
    {
      index: "01",
      title: "Réactivation du pipeline",
      body: "Reprise de la publication et de l’actualisation automatisées une fois la nouvelle architecture fiabilisée.",
    },
    {
      index: "02",
      title: "SEO & profondeur de catalogue",
      body: "Chaque sujet couvert reste indexé et continue d’attirer du trafic bien après sa publication.",
    },
    {
      index: "03",
      title: "Distribution sociale",
      body: "Les visualisations sont nativement partageables : elles circulent sans dépendre uniquement du référencement.",
    },
  ],
  note: "Trajectoire cible, à valider par les hypothèses ci-dessus. Aucune date n’est engagée tant que la refonte n’est pas livrée.",
} as const;

/* D — LES TROIS CANAUX DE REVENUS ───────────────────────────────────────── */

export const REVENUE_CHANNELS = [
  {
    index: "01",
    name: "Site",
    role: "Le socle",
    mechanics: [
      "Display & programmatique",
      "Contenus sponsorisés identifiés",
      "Accès premium aux données",
    ],
    driver: "Pages vues",
    status: "En attente de la refonte",
  },
  {
    index: "02",
    name: "Réseaux sociaux",
    role: "L’accélérateur",
    mechanics: [
      "Formats data natifs",
      "Programmes de monétisation des plateformes",
      "Marques & campagnes",
    ],
    driver: "Portée & engagement",
    status: "À structurer",
  },
  {
    index: "03",
    name: "Partenariats",
    role: "Le levier de marge",
    mechanics: [
      "Institutions & médias",
      "Études et data sur mesure",
      "Syndication de contenus",
    ],
    driver: "Contrats",
    status: "À amorcer",
  },
] as const;

export const REVENUE_CHANNELS_HEADLINE = "Trois canaux de revenus.";
export const REVENUE_CHANNELS_NOTE =
  "Trois canaux qui reposent sur le même actif : une audience qui fait confiance à la donnée publiée.";

/* E — CE QUE CELA PEUT RAPPORTER ────────────────────────────────────────── */

export interface RevenueRow {
  channel: string;
  /** What the revenue is a function of. */
  driver: string;
  /** Unit economics, e.g. an RPM or an average contract value. */
  unit: string | null;
  /** Resulting revenue for the horizon below. */
  revenue: string | null;
}

export const REVENUE_MODEL = {
  headline: "Ce que cela peut rapporter.",
  /** e.g. "Horizon 12 mois" */
  horizon: "Horizon à définir",
  rows: [
    { channel: "Site", driver: "Pages vues × RPM", unit: null, revenue: null },
    { channel: "Réseaux sociaux", driver: "Portée × rémunération plateforme", unit: null, revenue: null },
    { channel: "Partenariats", driver: "Nombre de contrats × panier moyen", unit: null, revenue: null },
  ] as RevenueRow[],
  total: null as string | null,
  note: "Le modèle est volontairement présenté en formules plutôt qu’en montants : les hypothèses unitaires ne seront crédibles qu’une fois l’audience remesurée après la refonte.",
} as const;
