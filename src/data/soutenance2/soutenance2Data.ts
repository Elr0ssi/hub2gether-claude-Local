/* ═══════════════════════════════════════════════════════════════════════════
   SOUTENANCE 2 — CONTENT
   ═══════════════════════════════════════════════════════════════════════════

   Every word and every figure of the V2 deck lives here. The components in
   `src/components/soutenance2/` read from this file and never hold copy of
   their own, so a number or a sentence can be changed without opening a
   graphic component.

   RULE OF THE FILE — the Business Plan is the source of truth. A figure that
   the plan does not carry is not written here: it is `TO_CONFIRM`, which the
   slides render as a visible slot rather than a number. Nothing about current
   traffic, users, article counts, growth, conversion, subscribers, revenue
   actually collected, partners, average time on page or the number of feeds
   wired today is invented anywhere in this deck.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Rendered as a visible, unmistakable slot wherever a figure is missing. */
export const TO_CONFIRM = "{DATA_TO_CONFIRM}";

/** Product capability that has to be verified before it is claimed on stage. */
export const EXPORT_TO_CONFIRM = "{DATA_EXPORT_TO_CONFIRM}";

/* ── Live metrics ─────────────────────────────────────────────────────────
   Deliberately null. A KPI whose value is null is not rendered at all — the
   deck would rather show one figure fewer than one figure too many in front
   of a jury. Fill these in only from measured analytics. */
export const currentMetrics: {
  visitors: number | null;
  articles: number | null;
  socialFollowers: number | null;
  pageViews: number | null;
} = {
  visitors: null,
  articles: null,
  socialFollowers: null,
  pageViews: null,
};

/* ═══════════════════════════════════════════════════════════════════════════
   DECK STRUCTURE
   ═══════════════════════════════════════════════════════════════════════════ */

export type Act = "pitch" | "pivot" | "depth";
export type Tone = "light" | "dark";

export interface Slide2 {
  id: string;
  /** Overview and presenter rail label. */
  label: string;
  act: Act;
  /** Indicative budget, in seconds. Never shown to the audience. */
  seconds: number;
  tone?: Tone;
  /**
   * Internal states the slide walks through before the deck moves on. One
   * scene that transforms rather than several slides that replace each other:
   * → and ← step inside it exactly as they step between slides. Absent means
   * a single state, which is every other slide in the deck.
   */
  steps?: number;
  /** Main idea, the figure to comment, the handover, the trap to avoid. */
  speakerNotes: string;
}

export const S2_SLIDES: readonly Slide2[] = [
  {
    id: "cover",
    label: "Couverture",
    act: "pitch",
    seconds: 30,
    tone: "light",
    speakerNotes:
      "Poser la promesse et ne plus la lâcher : comprendre en 30 secondes, maîtriser en 5 minutes. Laisser le globe tourner deux secondes avant de parler. Ne pas annoncer le plan — la narration se tient toute seule.",
  },
  {
    id: "probleme",
    label: "Le problème",
    act: "pitch",
    seconds: 50,
    tone: "light",
    speakerNotes:
      "Une phrase, trois frictions : temps, coût, confiance. Le chiffre à commenter est 29 % de confiance ; 89 % qui refusent de payer se glisse en second. Piège : ne pas empiler d'autres statistiques, le jury retient deux chiffres au maximum.",
  },
  {
    id: "cible",
    label: "Pour qui",
    act: "pitch",
    seconds: 40,
    tone: "light",
    speakerNotes:
      "Public francophone intéressé par l'économie et la géopolitique. Deux portes d'entrée distinctes : les formats courts pour les moins de 35 ans, l'actualité continue pour un public plus expert. Piège : ne pas inventer de persona.",
  },
  {
    id: "produit",
    label: "Le produit",
    act: "pitch",
    seconds: 60,
    tone: "light",
    speakerNotes:
      "Montrer, ne pas décrire. Explorer, comparer, comprendre, approfondir — quatre gestes, un seul outil. Si le temps le permet, basculer ici sur une démo live de la carte économie. Transition : « et ce produit s'adresse à un marché déjà mesurable ».",
  },
  {
    id: "marche",
    label: "Le marché",
    act: "pitch",
    seconds: 50,
    tone: "light",
    speakerNotes:
      "Le chiffre qui compte n'est pas 590–760 M€, c'est 0,08 %. Insister : le modèle n'a pas besoin de dominer le marché pour être viable. Rappeler que ce sont des projections du plan, pas des revenus constatés.",
  },
  {
    id: "concurrence",
    label: "La concurrence",
    act: "pitch",
    seconds: 60,
    tone: "light",
    speakerNotes:
      "Quatre familles, quatre forces réelles. Ne jamais dire « nous sommes meilleurs partout » : dire que peu d'acteurs réunissent les quatre dimensions à la fois. La différence avec Courrier International est la plus fine — l'expliciter.",
  },
  {
    id: "acquisition",
    label: "Moteur d'acquisition",
    act: "pitch",
    seconds: 50,
    tone: "dark",
    speakerNotes:
      "L'actualité crée la demande, la donnée crée le trafic. Les réseaux sociaux sont le canal principal du plan : TikTok et Instagram en priorité, X pour l'actualité continue. Laisser la boucle tourner une fois avant de conclure.",
  },
  {
    id: "ia",
    label: "L'IA comme canal",
    act: "pitch",
    seconds: 110,
    tone: "dark",
    steps: 6,
    speakerNotes:
      "La séquence la plus stratégique du pitch. Six états, six respirations : avancer avec →, ne jamais enchaîner deux états sans laisser le jury lire. État 2, marquer le silence sur « et si l'utilisateur ne venait plus jusqu'au média ». État 3, dire clairement ce qui est en ligne et ce qui est au plan — les nœuds en pointillé ne sont pas encore construits. État 5, ne jamais présenter l'API ni les licences comme existantes : ce sont des pistes. Phrase à ne pas rater : l'IA donne la réponse, The Essential Data permet de l'explorer.",
  },

  {
    id: "modele",
    label: "Modèle économique",
    act: "pitch",
    seconds: 50,
    tone: "light",
    speakerNotes:
      "Trois flux, pas un de plus. Marteler les deux zéros : zéro abonnement lecteur, zéro subvention publique dans le modèle présenté. Transition vers le pivot : « tout cela décrit un média ».",
  },

  {
    id: "pivot",
    label: "Pivot — la vraie différence",
    act: "pivot",
    seconds: 15,
    tone: "dark",
    speakerNotes:
      "Ralentir. Trois phrases, trois silences. C'est le moment qui ouvre la partie la plus importante : ne pas l'enchaîner trop vite.",
  },

  {
    id: "recoupement",
    label: "Le travail de recoupement",
    act: "depth",
    seconds: 90,
    tone: "dark",
    speakerNotes:
      "Le lecteur ne devrait pas avoir à faire lui-même le recoupement. Laisser l'animation converger avant de parler du panel : 10 titres français, 15 internationaux prévus au plan. Piège : ne pas dire « IA impartiale » — dire diversification des sources.",
  },
  {
    id: "pipeline",
    label: "Comment naît un article",
    act: "depth",
    seconds: 120,
    tone: "light",
    speakerNotes:
      "La slide la plus importante. Six étapes, et une seule idée : des dizaines de sources, un seul point d'entrée. Insister sur l'étape 5, traçabilité — c'est elle qui sépare le projet d'un site généré automatiquement.",
  },
  {
    id: "article",
    label: "Le format article",
    act: "depth",
    seconds: 120,
    tone: "light",
    speakerNotes:
      "Montrer, pas expliquer. Dérouler les trois profondeurs de lecture : 30 secondes, 2 minutes, 5 minutes. Relier un chiffre à sa carte puis à sa source — c'est la démonstration de la traçabilité. Ne pas promettre l'export de données tant qu'il n'est pas vérifié.",
  },
  {
    id: "etat",
    label: "Où en est le projet",
    act: "depth",
    seconds: 90,
    tone: "light",
    speakerNotes:
      "Assumer franchement : le produit fonctionne, l'infrastructure évolue. Dire ce qui reste en ligne avant de dire ce qui est suspendu. Phrase à ne pas rater : nous ne remettons pas en cause le concept, nous renforçons l'infrastructure qui doit le porter.",
  },
  {
    id: "finance",
    label: "Chiffres clés du plan",
    act: "depth",
    seconds: 90,
    tone: "light",
    speakerNotes:
      "Une seule slide financière. Le point à commenter est la rentabilité projetée dès l'année 2, et la raison : pas de salaire fondateur au démarrage, charges largement semi-fixes. Toujours dire « projection », jamais « résultat ». Renvoyer aux annexes (touche A) si le jury creuse.",
  },
  {
    id: "roadmap",
    label: "Roadmap",
    act: "depth",
    seconds: 60,
    tone: "dark",
    speakerNotes:
      "Prouver, répliquer, étendre. L'idée forte n'est pas la liste : c'est que le même moteur se duplique dans une autre langue sans être reconstruit. Deux rendez-vous d'acquisition identifiés : 2027 en France, 2028 aux États-Unis.",
  },
  {
    id: "conclusion",
    label: "Conclusion",
    act: "depth",
    seconds: 60,
    tone: "dark",
    speakerNotes:
      "Fermer la boucle sur la promesse d'ouverture. Nous avons appris à construire le produit ; l'enjeu est l'organisation. Trois besoins : trust, distribution, business. Finir sur la phrase, pas sur un remerciement.",
  },
] as const;

export const S2_TOTAL_SECONDS = S2_SLIDES.reduce((n, s) => n + s.seconds, 0);

export const ACT_LABELS: Record<Act, string> = {
  pitch: "Pitch entrepreneurial",
  pivot: "Pivot",
  depth: "Approfondissement",
};

/* ═══════════════════════════════════════════════════════════════════════════
   01 — COVER
   ═══════════════════════════════════════════════════════════════════════════ */

export const COVER = {
  wordmark: "The Essential Data",
  promise: ["Comprendre en 30 secondes.", "Maîtriser en 5 minutes."],
  tagline: "Turning data into meaning.",
  context: "Soutenance de business plan",
} as const;

/** The through-line. Repeated verbatim on the cover, the article slide and the close. */
export const PROMISE = COVER.promise;

/* ═══════════════════════════════════════════════════════════════════════════
   02 — LE PROBLÈME
   ═══════════════════════════════════════════════════════════════════════════ */

export const PROBLEM = {
  title: [
    "L'information n'a jamais été aussi accessible.",
    "La comprendre n'a jamais demandé autant de travail.",
  ],
  frictions: [
    {
      id: "temps",
      label: "Temps",
      body: "Comprendre un sujet suppose de lire, comparer et recouper plusieurs sources.",
    },
    {
      id: "cout",
      label: "Coût",
      body: "Une information réellement plurielle suppose souvent plusieurs abonnements.",
    },
    {
      id: "confiance",
      label: "Confiance",
      body: "La confiance dans l'information consultée reste minoritaire.",
    },
  ],
  headline: {
    value: "29 %",
    body: "des Français déclarent faire confiance à la majorité de l'information qu'ils consultent.",
  },
  secondary: {
    value: "89 %",
    body: "refusent de payer pour s'informer en ligne.",
  },
  /** Orbiting around the reader on the right-hand composition. */
  scatter: [
    "Presse quotidienne",
    "Presse internationale",
    "Bases statistiques",
    "Rapports d'institutions",
    "Fils d'actualité",
    "Réseaux sociaux",
    "Newsletters",
    "Vidéos",
  ],
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   03 — POUR QUI
   ═══════════════════════════════════════════════════════════════════════════ */

export const AUDIENCE = {
  title: ["Une information exigeante.", "Sans exiger des heures de recherche."],
  core: {
    label: "Cible principale",
    body: "Public francophone intéressé par l'économie et la géopolitique.",
  },
  segments: [
    {
      id: "young",
      label: "Moins de 35 ans",
      channels: ["TikTok", "Instagram"],
      body: "Formats visuels courts, découverte par l'actualité.",
    },
    {
      id: "expert",
      label: "Public plus expert",
      channels: ["X", "Site", "Recherche organique"],
      body: "Actualité continue, retour direct et recherche par sujet.",
    },
  ],
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   04 — LE PRODUIT
   ═══════════════════════════════════════════════════════════════════════════ */

export const PRODUCT = {
  title: "Une interface pour comprendre le monde.",
  chain: [
    { id: "explorer", label: "Explorer", items: ["Cartes", "Globe", "Données"] },
    { id: "comparer", label: "Comparer", items: ["Pays", "Indicateurs", "Évolutions"] },
    { id: "comprendre", label: "Comprendre", items: ["Synthèses", "Contexte", "Sources"] },
    { id: "approfondir", label: "Approfondir", items: ["Articles", "Analyses", "Historique"] },
  ],
  screenshot: {
    label: "Carte interactive — Économie mondiale",
    ratio: "Capture produit · /map/economy",
  },
  demoNote: "Démo live possible ici : /map/economy",
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   05 — LE MARCHÉ
   ═══════════════════════════════════════════════════════════════════════════ */

export const MARKET = {
  title: ["Un marché immense.", "Une ambition volontairement limitée."],
  funnel: [
    {
      id: "monthly",
      value: "56 M",
      label: "visites mensuelles cumulées",
      note: "Cinq titres francophones spécialisés étudiés dans le business plan.",
    },
    {
      id: "yearly",
      value: "670 M+",
      label: "visites annuelles correspondantes",
      note: "Volume annuel du même panel.",
    },
    {
      id: "market",
      value: "590–760 M€",
      label: "marché francophone accessible",
      note: "Fourchette de référence retenue dans le business plan.",
    },
  ],
  target: {
    value: "445 K€",
    label: "revenus projetés en année 5",
    share: "≈ 0,08 %",
    shareLabel: "du marché accessible",
  },
  conclusion:
    "Le modèle n'a pas besoin de dominer le marché pour devenir viable.",
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   06 — LA CONCURRENCE
   ═══════════════════════════════════════════════════════════════════════════ */

export type Coverage = "full" | "partial" | "none";

export interface CompetitorFamily {
  id: string;
  label: string;
  examples: string;
  strength: string;
  limit: string;
  /** Multi-sources · data interactive · gratuité · transparence */
  axes: readonly [Coverage, Coverage, Coverage, Coverage];
  us?: boolean;
}

export const COMPETITION_AXES = [
  "Multi-sources",
  "Data interactive",
  "Gratuité",
  "Transparence",
] as const;

export const COMPETITION: readonly CompetitorFamily[] = [
  {
    id: "medias",
    label: "Médias traditionnels",
    examples: "Le Monde · Les Échos · Le Figaro",
    strength: "Forte capacité éditoriale, marques établies.",
    limit: "Accès majoritairement payant, données peu manipulables.",
    axes: ["partial", "partial", "none", "full"],
  },
  {
    id: "courrier",
    label: "Courrier International",
    examples: "Regard international",
    strength: "Ouverture sur la presse étrangère.",
    limit:
      "Un article reprend généralement un média étranger donné, là où nous cherchons à recouper plusieurs dizaines de sources sur un même sujet.",
    axes: ["partial", "none", "none", "full"],
  },
  {
    id: "data",
    label: "Worldometer / data pure",
    examples: "Compteurs et bases ouvertes",
    strength: "Immédiateté de la donnée.",
    limit: "Peu de contextualisation éditoriale.",
    axes: ["none", "full", "full", "partial"],
  },
  {
    id: "ai",
    label: "Sites générés par IA",
    examples: "Agrégateurs automatisés",
    strength: "Rapidité et coût de production.",
    limit:
      "Opacité, sources insuffisamment exposées, hallucinations, faible supervision.",
    axes: ["partial", "none", "full", "none"],
  },
  {
    id: "ted",
    label: "The Essential Data",
    examples: "Au croisement des quatre dimensions",
    strength:
      "Recoupement multi-sources et visualisation intégrés au même produit.",
    limit: "Audience et gouvernance éditoriale restent à prouver.",
    axes: ["full", "full", "full", "full"],
    us: true,
  },
] as const;

export const COMPETITION_TITLE = [
  "Beaucoup d'information.",
  "Peu d'acteurs réunissent ces quatre dimensions.",
] as const;

/* ═══════════════════════════════════════════════════════════════════════════
   07 — MOTEUR D'ACQUISITION
   ═══════════════════════════════════════════════════════════════════════════ */

export const ACQUISITION = {
  title: ["L'actualité crée la demande.", "La donnée crée le trafic."],
  loop: [
    "Événement mondial",
    "Données / carte",
    "Format court",
    "TikTok · Instagram · X",
    "Curiosité",
    "The Essential Data",
    "Exploration / comparaison",
    "Retour / partage",
  ],
  channels: [
    { id: "tiktok", label: "TikTok", rank: "Prioritaire", body: "Formats courts, portée organique." },
    { id: "instagram", label: "Instagram", rank: "Prioritaire", body: "Visuels de données, partenariats de marque." },
    { id: "x", label: "X", rank: "Continu", body: "Actualité continue, public engagé sur l'international." },
  ],
  note: "Le business plan retient les réseaux sociaux comme canal d'acquisition principal.",
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   08 — L'IA COMME CANAL

   One scene, six states. The honesty rule of this file applies with extra
   force here: the deck must never let a strategy be heard as a fact. Every
   item below is tagged `live` for what the site serves today or `planned`
   for what the plan intends to build, and the components render the two
   differently — solid against dashed, never the same pill.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface AiShiftState {
  id: string;
  /** Shown as the state counter, e.g. "01". */
  ordinal: string;
  /** The one line that carries the state. */
  title: string;
  /** A single sentence under the composition. Kept short on purpose. */
  caption: string;
}

export const AI_SHIFT = {
  label: "L'IA comme canal",

  states: [
    {
      id: "search",
      ordinal: "01",
      title: "Le trafic passait par le moteur.",
      caption: "L'utilisateur cherche, le moteur oriente, le média répond.",
    },
    {
      id: "rupture",
      ordinal: "02",
      title: "L'IA répond avant le clic.",
      caption: "Une part des réponses ne passe plus par une visite.",
    },
    {
      id: "source",
      ordinal: "03",
      title: "Devenir la source que l'IA cite.",
      caption: "Une base structurée, sourcée, datée — lisible par une machine.",
    },
    {
      id: "return",
      ordinal: "04",
      title: "La réponse ne remplace pas l'exploration.",
      caption: "La citation ramène le lecteur là où la donnée se manipule.",
    },
    {
      id: "flows",
      ordinal: "05",
      title: "Un canal d'acquisition, une piste de revenus.",
      caption: "Ce qui existe déjà, et ce qui reste à construire.",
    },
    {
      id: "close",
      ordinal: "06",
      title: "",
      caption: "",
    },
  ] as readonly AiShiftState[],

  /** The chain's nodes. The same pills move between states. */
  chain: {
    user: "Utilisateur",
    google: "Google",
    ted: "The Essential Data",
    info: "Information",
    ai: "IA",
    answer: "Réponse",
    data: "Data",
  },

  /** Named small and flat: the engines are context, not a logo wall. */
  engines: ["ChatGPT", "Gemini", "Perplexity"],

  tension: "Et si l'utilisateur ne venait plus jusqu'au média ?",

  /* ── The structured base ────────────────────────────────────────────────
     `live` is what /map serves today. `planned` is in the plan and nowhere
     else — it is drawn dashed and labelled as such. */
  dataset: {
    liveLabel: "En ligne",
    live: [
      "PIB",
      "Dette",
      "Chômage",
      "Commerce",
      "Défense",
      "Politique",
      "Épidémies",
      "Sources",
      "Historique",
    ],
    plannedLabel: "Au plan",
    planned: ["Dépenses publiques", "Énergie", "Démographie"],
  },

  /** Answer, proof, exploration — the three tiers of one citation. */
  answer: {
    tiers: [
      { key: "Answer", items: ["France — Dette publique — 2025"] },
      {
        key: "Proof",
        items: ["Source primaire", "Année", "Méthodologie", "Dernière mise à jour"],
      },
      { key: "Explore", items: ["Carte", "Historique", "Comparaison", "Article"] },
    ],
    citation: "Source : The Essential Data ↗",
  },

  /** What the site already does that a paragraph of text does not. */
  gestures: [
    { label: "Explorer", note: "Carte mondiale interactive" },
    { label: "Comparer", note: "Pays contre pays" },
    { label: "Visualiser", note: "Évolution dans le temps" },
    { label: "Vérifier", note: "Sources primaires et méthodologie" },
  ],
  gestureStatement: ["L'IA donne la réponse.", "The Essential Data permet de l'explorer."],

  /** Three flows, each labelled with what it actually is today. */
  flows: [
    {
      id: "trafic",
      title: "IA → Trafic",
      status: "À optimiser",
      planned: false,
      steps: ["Citation dans les réponses IA", "Visite du site", "Audience et publicité"],
    },
    {
      id: "licences",
      title: "Data → Licences",
      status: "À construire",
      planned: true,
      steps: ["Données structurées", "API et accès aux données", "Licences, revenus B2B"],
    },
    {
      id: "experience",
      title: "Expérience → Fidélisation",
      status: "Déjà en ligne",
      planned: false,
      steps: ["Exploration", "Comparaison", "Retour direct"],
    },
  ],

  flowsNote:
    "Aucun revenu d'API ni de licence n'est constaté : le plan les identifie comme des pistes.",

  close: {
    center: "The Essential Data",
    facets: ["Média", "Data", "Exploration", "AI-ready"],
    statement: ["Ne pas concurrencer l'IA.", "Devenir une source qu'elle utilise."],
    coda: "Et une expérience que l'utilisateur veut explorer.",
  },
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   09 — MODÈLE ÉCONOMIQUE
   ═══════════════════════════════════════════════════════════════════════════ */

export const REVENUE = {
  title: ["Gratuit pour le lecteur.", "Monétisé par l'audience."],
  streams: [
    {
      index: "01",
      label: "Display web",
      body: "Publicité limitée sur la plateforme, calibrée pour ne pas dégrader la lecture.",
    },
    {
      index: "02",
      label: "Réseaux sociaux",
      body: "Rémunération directe des formats courts, TikTok en premier lieu.",
    },
    {
      index: "03",
      label: "Partenariats de marque",
      body: "Instagram et partenariats directs avec des annonceurs cohérents avec le positionnement.",
    },
  ],
  absolutes: [
    { value: "0 €", label: "d'abonnement lecteur" },
    { value: "0 €", label: "de subvention publique dans le modèle présenté" },
  ],
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   PIVOT
   ═══════════════════════════════════════════════════════════════════════════ */

export const PIVOT_LINES = [
  "Tout cela décrit un média.",
  "Mais ce n'est pas là que se trouve notre principale différence.",
  "Notre différence est dans la manière de fabriquer l'information.",
] as const;

/* ═══════════════════════════════════════════════════════════════════════════
   09 — LE TRAVAIL DE RECOUPEMENT
   ═══════════════════════════════════════════════════════════════════════════ */

export const CROSS_CHECK = {
  title:
    "Le lecteur ne devrait pas avoir à faire lui-même le travail de recoupement.",
  hub: "The Essential Data",
  output: "Une synthèse structurée",
  /** Real titles from the business plan panel. */
  french: [
    "Le Monde",
    "Le Figaro",
    "Les Échos",
    "La Tribune",
    "Mediapart",
    "Courrier International",
  ],
  international: [
    "The New York Times",
    "The Washington Post",
    "The Guardian",
    "The Economist",
    "Financial Times",
    "Der Spiegel",
    "El País",
    "Al Jazeera",
    "South China Morning Post",
    "The Japan Times",
  ],
  panel: [
    { value: "10", label: "titres français" },
    { value: "15", label: "titres internationaux" },
  ],
  note: "Panel prévu au business plan.",
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   10 — COMMENT NAÎT UN ARTICLE
   ═══════════════════════════════════════════════════════════════════════════ */

export const PIPELINE = {
  title: "Comment naît un article",
  steps: [
    {
      index: "1",
      label: "Collecte",
      items: ["Articles", "Institutions", "Données"],
    },
    {
      index: "2",
      label: "Extraction des faits",
      items: ["Séparer le factuel", "de la formulation éditoriale"],
    },
    {
      index: "3",
      label: "Recoupement",
      items: ["Convergences", "Divergences", "Éléments uniques", "Contexte"],
    },
    {
      index: "4",
      label: "Synthèse assistée par IA",
      items: ["Structurer", "sans trancher à la place de la rédaction"],
    },
    {
      index: "5",
      label: "Contrôle / traçabilité",
      items: ["Conserver les sources", "Rattacher chaque fait"],
    },
    {
      index: "6",
      label: "Restitution",
      items: ["Article court", "Données", "Carte", "Comparaison", "Sources"],
    },
  ],
  statement: ["Des dizaines de sources.", "Un seul point d'entrée."],
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   11 — LE FORMAT ARTICLE
   ═══════════════════════════════════════════════════════════════════════════ */

export const ARTICLE_FORMAT = {
  title: PROMISE,
  layers: [
    {
      id: "30s",
      time: "30 secondes",
      items: ["Titre", "Résumé", "Chiffres clés"],
    },
    {
      id: "2min",
      time: "2 minutes",
      items: ["Contexte", "Comparaison", "Carte"],
    },
    {
      id: "5min",
      time: "5 minutes",
      items: ["Analyse", "Historique", "Sources", "Points de vue"],
    },
  ],
  screenshot: {
    label: "Article réel — The Essential Data",
    ratio: "Capture produit · /articles/…",
  },
  /** Only claim raw-data reuse once it is verified in the product. */
  dataExport: EXPORT_TO_CONFIRM,
  traceability: [
    "Un chiffre dans l'article",
    "La carte qui le porte",
    "La source d'origine",
  ],
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   12 — OÙ EN EST LE PROJET
   ═══════════════════════════════════════════════════════════════════════════ */

export const STATUS = {
  title: ["Le produit fonctionne.", "L'infrastructure évolue."],
  timeline: [
    { label: "Concept", state: "done" as const },
    { label: "MVP", state: "done" as const },
    { label: "Premiers articles", state: "done" as const },
    { label: "Automatisation V1", state: "done" as const },
    { label: "Refonte data / éditoriale", state: "current" as const },
    { label: "Relaunch", state: "next" as const },
    { label: "Scale", state: "next" as const },
  ],
  online: {
    label: "Ce qui reste en ligne",
    items: ["Articles existants", "Cartes et produit", "Contenus déjà réalisés"],
  },
  paused: {
    label: "Ce qui est temporairement suspendu",
    items: [
      "Publication automatique en temps réel",
      "Révision automatique continue",
      "Acquisition volontaire de trafic",
    ],
  },
  why: {
    label: "Pourquoi",
    body: "Reconstruction de la base de données et du pipeline éditorial.",
  },
  statement: [
    "Nous ne remettons pas en cause le concept.",
    "Nous renforçons l'infrastructure qui doit le porter.",
  ],
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   13 — CHIFFRES CLÉS DU BUSINESS PLAN
   ═══════════════════════════════════════════════════════════════════════════ */

export interface FinanceYear {
  year: string;
  revenue: number;
  /** Null where the plan summary presented on stage does not carry it. */
  costs: number | null;
  net: number | null;
}

export const FINANCE: readonly FinanceYear[] = [
  { year: "Année 1", revenue: 5568, costs: 11484, net: -5916 },
  { year: "Année 2", revenue: 32208, costs: 12000, net: 20208 },
  { year: "Année 3", revenue: 111360, costs: null, net: null },
  { year: "Année 4", revenue: 246360, costs: null, net: null },
  { year: "Année 5", revenue: 445440, costs: 18500, net: 426940 },
] as const;

export const FINANCE_SLIDE = {
  title: ["Une structure légère.", "Un modèle fortement scalable."],
  breakeven: { label: "Rentabilité projetée", value: "Année 2" },
  funding: { label: "Besoin de financement initial", value: "27 500 €" },
  note: "Ces résultats reposent notamment sur une structure sans salaire fondateur au démarrage et sur des coûts largement semi-fixes.",
  disclaimer:
    "Projections du business plan, scénario central — et non des revenus constatés.",
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   14 — ROADMAP
   ═══════════════════════════════════════════════════════════════════════════ */

export const ROADMAP = {
  title: ["Prouver.", "Répliquer.", "Étendre."],
  phases: [
    {
      index: "01",
      label: "Prouver",
      scope: "France / francophonie",
      items: [
        "Finalisation des rubriques",
        "Nouvelle automatisation",
        "Tests d'acquisition",
        "Audience fidèle",
        "Premiers partenaires",
      ],
      milestone: "Élections françaises 2027",
    },
    {
      index: "02",
      label: "Répliquer",
      scope: "Ouverture anglophone envisagée à partir de 2027",
      items: [
        "Duplication de l'infrastructure",
        "Panel de sources anglophone",
        "Adaptation éditoriale",
      ],
      milestone: "Élections américaines 2028",
    },
    {
      index: "03",
      label: "Étendre",
      scope: "Nouvelles langues, puis nouvelles verticales",
      items: [
        "Langues supplémentaires",
        "Nouvelles thématiques",
        "Même moteur central",
      ],
      milestone: null,
    },
  ],
  statement:
    "Prouver que l'infrastructure peut être reproduite dans une autre langue sans être reconstruite.",
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   15 — CONCLUSION
   ═══════════════════════════════════════════════════════════════════════════ */

export const CONCLUSION = {
  lines: [
    "Nous avons appris à construire le produit.",
    "L'enjeu est maintenant de construire l'organisation capable de le faire grandir.",
  ],
  needs: [
    {
      id: "trust",
      label: "Trust",
      items: ["Gouvernance", "Fiabilité", "Cadre légal", "Transparence"],
    },
    {
      id: "distribution",
      label: "Distribution",
      items: ["Acquisition", "Partenariats", "Visibilité"],
    },
    {
      id: "business",
      label: "Business",
      items: ["Priorisation", "Monétisation", "Passage à l'échelle"],
    },
  ],
  close: [
    "Nous ne voulons pas produire plus d'information.",
    "Nous voulons réduire le temps nécessaire pour la comprendre.",
  ],
  signature: {
    wordmark: "The Essential Data",
    promise: PROMISE,
    tagline: COVER.tagline,
  },
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   ANNEXES — outside the 15, reachable with "A"
   ═══════════════════════════════════════════════════════════════════════════ */

export interface Annex {
  id: string;
  index: string;
  label: string;
}

export const S2_ANNEXES: readonly Annex[] = [
  { id: "finance", index: "01", label: "Finance détaillée" },
  { id: "sensibilite", index: "02", label: "Sensibilité" },
  { id: "financement", index: "03", label: "Financement" },
  { id: "sources", index: "04", label: "Panel de sources" },
  { id: "concurrence", index: "05", label: "Concurrence détaillée" },
  { id: "juridique", index: "06", label: "Juridique" },
] as const;

/** ANNEXE 01 — the full plan, revenue split included. */
export interface AnnexFinanceRow {
  year: string;
  web: number | null;
  social: number | null;
  total: number;
  costs: number | null;
  net: number | null;
}

export const ANNEX_FINANCE: readonly AnnexFinanceRow[] = [
  { year: "Année 1", web: null, social: null, total: 5568, costs: 11484, net: -5916 },
  { year: "Année 2", web: null, social: null, total: 32208, costs: 12000, net: 20208 },
  { year: "Année 3", web: null, social: null, total: 111360, costs: null, net: null },
  { year: "Année 4", web: null, social: null, total: 246360, costs: null, net: null },
  { year: "Année 5", web: null, social: null, total: 445440, costs: 18500, net: 426940 },
] as const;

export const ANNEX_FINANCE_NOTE =
  "La répartition web / réseaux sociaux par année n'est pas reprise ici tant qu'elle n'est pas confirmée sur le plan financier définitif.";

/** ANNEXE 02 — sensitivity, −30 % / central / +30 %. */
export const ANNEX_SENSITIVITY = {
  scenarios: ["−30 %", "Scénario central", "+30 %"],
  rows: [
    { year: "Année 3", values: [77952, 111360, 144768] },
    { year: "Année 5", values: [311808, 445440, 579072] },
  ],
} as const;

/** ANNEXE 03 — financing. */
export const ANNEX_FUNDING = {
  need: { value: "27 500 €", label: "Besoin de financement initial" },
  instrument: "Financement participatif en capital",
  ticket: { value: "25 à 200 €", label: "Ticket envisagé" },
  valuation: TO_CONFIRM,
  dilution: TO_CONFIRM,
  note: "Valorisation et dilution détaillées : à reprendre du business plan définitif.",
} as const;

/** ANNEXE 04 — source panel. */
export const ANNEX_SOURCES = {
  french: [
    "Le Monde",
    "Le Figaro",
    "Les Échos",
    "La Tribune",
    "Mediapart",
    "Courrier International",
    TO_CONFIRM,
    TO_CONFIRM,
    TO_CONFIRM,
    TO_CONFIRM,
  ],
  international: [
    "The New York Times",
    "The Washington Post",
    "The Guardian",
    "The Economist",
    "Financial Times",
    "Der Spiegel",
    "El País",
    "Al Jazeera",
    "South China Morning Post",
    "The Japan Times",
    TO_CONFIRM,
    TO_CONFIRM,
    TO_CONFIRM,
    TO_CONFIRM,
    TO_CONFIRM,
  ],
  cost: { value: "≈ 452 € / mois", label: "abonnements presse du panel présenté" },
  note: "Le business plan prévoit 10 titres français et 15 titres internationaux. Les intitulés non encore arrêtés restent des emplacements.",
} as const;

/** ANNEXE 05 — detailed competition. */
export interface AnnexCompetitorRow {
  name: string;
  model: string;
  sources: string;
  data: string;
  transparency: string;
  us?: boolean;
}

export const ANNEX_COMPETITION: readonly AnnexCompetitorRow[] = [
  { name: "Le Monde", model: "Abonnement", sources: "Rédaction propre + agences", data: "Infographies éditoriales", transparency: "Signature, charte" },
  { name: "Le Figaro", model: "Abonnement", sources: "Rédaction propre + agences", data: "Infographies éditoriales", transparency: "Signature, charte" },
  { name: "Les Échos", model: "Abonnement", sources: "Rédaction propre + agences", data: "Données économiques", transparency: "Signature, charte" },
  { name: "Mediapart", model: "Abonnement sans publicité", sources: "Enquête propre", data: "Peu de data interactive", transparency: "Méthodologie publiée" },
  { name: "Courrier International", model: "Abonnement", sources: "Reprise de presse étrangère", data: "Peu de data interactive", transparency: "Média d'origine cité" },
  { name: "Worldometer", model: "Gratuit, publicité", sources: "Bases ouvertes", data: "Compteurs temps réel", transparency: "Sources listées, peu de contexte" },
  { name: "Médias générés par IA", model: "Gratuit, publicité", sources: "Agrégation automatique", data: "Variable", transparency: "Faible, supervision limitée" },
  { name: "The Essential Data", model: "Gratuit, audience", sources: "Panel multi-sources recoupé", data: "Cartes et comparateurs intégrés", transparency: "Sources rattachées aux faits", us: true },
] as const;

/** ANNEXE 06 — legal choices and identified risks, not legal advice. */
export const ANNEX_LEGAL = [
  {
    id: "ai-act",
    label: "AI Act",
    body: "Usage assistant, non décisionnel. Obligation de transparence sur le recours à l'IA dans la production éditoriale.",
  },
  {
    id: "droit-voisin",
    label: "Droit voisin",
    body: "Reprise limitée, citation courte et lien vers la source. Pas de republication d'articles entiers.",
  },
  {
    id: "copyright",
    label: "Copyright / faits bruts",
    body: "Les faits et données chiffrées ne sont pas protégeables en tant que tels ; la formulation éditoriale l'est. D'où l'étape d'extraction des faits.",
  },
  {
    id: "citation",
    label: "Citation / traçabilité",
    body: "Chaque fait reste rattaché à sa source, exposée au lecteur.",
  },
  {
    id: "sas",
    label: "Structure",
    body: "SAS. Gouvernance et répartition à arrêter avec le financement participatif.",
  },
] as const;

export const ANNEX_LEGAL_NOTE =
  "Choix et risques identifiés dans le business plan. Ce n'est pas une consultation juridique.";
