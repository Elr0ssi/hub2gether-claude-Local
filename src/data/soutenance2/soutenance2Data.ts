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
    tone: "dark",
    speakerNotes:
      "Poser la promesse et ne plus la lâcher : comprendre en 30 secondes, maîtriser en 5 minutes. Laisser le globe tourner deux secondes avant de parler. Ne pas annoncer le plan, la narration se tient toute seule.",
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
      "Montrer, ne pas décrire. Explorer, comparer, comprendre, approfondir, quatre gestes, un seul outil. Si le temps le permet, basculer ici sur une démo live de la carte économie. Transition : « et ce produit s'adresse à un marché déjà mesurable ».",
  },
  {
    id: "marche",
    label: "Le marché",
    act: "pitch",
    seconds: 50,
    tone: "light",
    speakerNotes:
      "Le chiffre qui compte n'est pas 590-760 M€, c'est 0,08 %. Insister : le modèle n'a pas besoin de dominer le marché pour être viable. Rappeler que ce sont des projections du plan, pas des revenus constatés.",
  },
  {
    id: "acteurs",
    label: "Les acteurs",
    act: "pitch",
    seconds: 45,
    tone: "light",
    speakerNotes:
      "Nommer les acteurs et donner leur ordre de grandeur, sans les commenter un par un. Le point à faire passer : ce sont de grosses maisons, à modèle payant, et aucune ne fait ce que nous faisons.",
  },
  {
    id: "concurrence",
    label: "La concurrence",
    act: "pitch",
    seconds: 60,
    tone: "light",
    speakerNotes:
      "Quatre familles, quatre forces réelles. Ne jamais dire « nous sommes meilleurs partout » : dire que peu d'acteurs réunissent les quatre dimensions à la fois. La différence avec Courrier International est la plus fine, l'expliciter.",
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
    id: "publications",
    label: "Nos publications",
    act: "pitch",
    seconds: 60,
    tone: "light",
    speakerNotes:
      "Montrer ce qui a été publié, pas seulement décrire le moteur. Les captures parlent d'elles-mêmes : formats courts, sujets d'actualité économique, un chiffre par publication. Les compteurs d'audience affichés sont des ordres de grandeur de travail, à recaler sur l'analytics avant le jour J : le dire si la question vient.",
  },
  {
    id: "partenariats",
    label: "Partenariats possibles",
    act: "pitch",
    seconds: 40,
    tone: "light",
    speakerNotes:
      "Trois pistes, aucune signée, et le dire d'emblée. Ce qui compte ici est la logique d'échange : ce que nous apportons contre ce que nous obtenons. Ne pas s'attarder, le jury retiendra le principe.",
    steps: 3,
  },

  {
    id: "ia",
    label: "L'IA comme canal",
    act: "pitch",
    seconds: 110,
    tone: "dark",
    steps: 6,
    speakerNotes:
      "La séquence la plus stratégique du pitch. Six états, six respirations : avancer avec →, ne jamais enchaîner deux états sans laisser le jury lire. État 2, marquer le silence sur « et si l'utilisateur ne venait plus jusqu'au média ». État 3, dire clairement ce qui est en ligne et ce qui est au plan, les nœuds en pointillé ne sont pas encore construits. État 5, ne jamais présenter l'API ni les licences comme existantes : ce sont des pistes. Phrase à ne pas rater : l'IA donne la réponse, The Essential Data permet de l'explorer.",
  },

  {
    id: "geo",
    label: "GEO · être lisible par les moteurs",
    act: "pitch",
    seconds: 70,
    tone: "light",
    speakerNotes:
      "La suite opérationnelle de la slide précédente : là c'était la stratégie, ici c'est le chantier. Insister sur le fait que le GEO n'est pas du SEO renommé, un moteur de réponse choisit ce qu'il cite, pas ce qu'il classe. Dire clairement que rien de tout cela n'est mesuré aujourd'hui : ce sont des chantiers, pas des résultats.",
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
    label: "Pivot · la vraie différence",
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
      "Le lecteur ne devrait pas avoir à faire lui-même le recoupement. Laisser l'animation converger avant de parler du panel : 10 titres français, 15 internationaux prévus au plan. Piège : ne pas dire « IA impartiale », dire diversification des sources.",
  },
  {
    id: "equipe",
    label: "L'équipe",
    act: "depth",
    seconds: 45,
    tone: "light",
    speakerNotes:
      "Se présenter sans réciter un CV : ce qui compte est que la même personne écrit le produit, la chaîne et les articles, et qu'un poste stable à la BPI permet de construire sans dépendre du projet. Enchaîner directement sur l'atelier : voilà la personne, voilà sa machine.",
  },
  {
    id: "pipeline",
    label: "L'atelier",
    act: "depth",
    seconds: 120,
    tone: "light",
    speakerNotes:
      "La slide la plus importante. Six étapes, et une seule idée : des dizaines de sources, un seul point d'entrée. Insister sur l'étape 5, traçabilité, c'est elle qui sépare le projet d'un site généré automatiquement.",
  },
  {
    id: "exigence",
    label: "Ce qu'on attend d'un article",
    act: "depth",
    seconds: 120,
    tone: "light",
    speakerNotes:
      "La slide sur laquelle s'attarder. Quatre exigences : un sujet pris là où il se cherche, un spectre pluriel de sources, l'historique qui donne l'échelle, et la transparence de bout en bout. Dire qu'on n'apporte pas la réponse mais de quoi se faire la sienne, vite.",
  },

  {
    id: "article",
    label: "Le format article",
    act: "depth",
    seconds: 120,
    tone: "light",
    speakerNotes:
      "Montrer, pas expliquer. Dérouler les trois profondeurs de lecture : 30 secondes, 2 minutes, 5 minutes. Relier un chiffre à sa carte puis à sa source, c'est la démonstration de la traçabilité. Ne pas promettre l'export de données tant qu'il n'est pas vérifié.",
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
    id: "financement",
    label: "Financement initial",
    act: "depth",
    seconds: 45,
    tone: "light",
    speakerNotes:
      "Le montant est petit et c'est le sujet : 27 500 € levés auprès de particuliers, en capital. Insister sur les trois raisons — faire parler du projet, rester indépendant, mesurer un intérêt réel — plutôt que sur le chiffre lui-même.",
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
  context: "Soutenance de business plan",
} as const;

/** Le fil conducteur. Repris tel quel sur la slide article et à la clôture ;
    la couverture ne le porte plus, il se dit à l'oral. */
export const PROMISE = ["Comprendre en 30 secondes.", "Maîtriser en 5 minutes."] as const;

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
  /* Épurée. La slide portait un titre long, un paragraphe de cible, un bloc
     sur le payant et deux segments détaillés : trop de texte pour une idée
     simple. Deux chiffres, une ligne chacun, et les canaux. */
  title: ["Ceux qui ne croient plus.", "Et qui ne paieront pas."],
  stats: [
    { value: "29 %", body: "font confiance à l'information qu'ils consultent." },
    { value: "89 %", body: "refusent de payer pour s'informer en ligne." },
  ],
  source: "Reuters Institute · Digital News Report",
  core: "Francophones · économie et géopolitique",
  segments: [
    { id: "young", label: "Moins de 35 ans", channels: ["TikTok", "Instagram"] },
    { id: "expert", label: "Public expert", channels: ["X", "Recherche", "Site"] },
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
    label: "Carte interactive · Économie mondiale",
    ratio: "Capture produit · /map/economy",
  },
  demoNote: "Démo live possible ici : /map/economy",
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   05 — LE MARCHÉ
   ═══════════════════════════════════════════════════════════════════════════ */

export const MARKET = {
  title: ["La taille du marché."],
  /* Rappel à l'écran, en coin : la liste des acteurs n'est pas close. */
  reminder: "À compléter : l'intégralité des acteurs",
  size: [
    {
      id: "monthly",
      value: "56 M",
      label: "visites mensuelles cumulées",
      note: "Panel de titres francophones du business plan.",
    },
    {
      id: "yearly",
      value: "670 M+",
      label: "visites annuelles correspondantes",
      note: "Même panel, sur douze mois.",
    },
    {
      id: "market",
      value: "590 à 760 M€",
      label: "marché francophone accessible",
      note: "Fourchette de référence du business plan.",
    },
  ],
  /* Trois cercles emboîtés : le marché, ce qui nous est accessible, ce que
     nous visons. Une taille se lit mieux en surface qu'en ligne de chiffres. */
  circles: [
    { id: "total", value: "670 M+", label: "visites annuelles du panel", r: 1 },
    { id: "access", value: "590 à 760 M€", label: "marché francophone accessible", r: 0.62 },
    { id: "aim", value: "0,08 %", label: "part visée à l'horizon du plan", r: 0.2 },
  ],
  playersLabel: "Les acteurs en place",
  playersColumns: ["Titre", "Visites / mois", "Modèle d'accès", "Chiffre d'affaires"],
  players: [
    { name: "Le Figaro", visits: "88 M", model: "Mixte", revenue: "512 M€" },
    { name: "Le Monde", visits: "72 M", model: "Abonnement", revenue: "268 M€" },
    { name: "Les Échos", visits: "26 M", model: "Abonnement", revenue: "214 M€" },
    { name: "Mediapart", visits: "11 M", model: "Abonnement intégral", revenue: "26 M€" },
    { name: "Courrier International", visits: "5 M", model: "Mixte", revenue: "18 M€" },
    { name: "La Tribune", visits: "4 M", model: "Mixte", revenue: "12 M€" },
  ],
  playersNote:
    "Ordres de grandeur de travail, à recaler sur les derniers comptes publiés avant la soutenance.",
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

export const COMPETITION_TITLE = ["Couverture de la concurrence."] as const;

/* ═══════════════════════════════════════════════════════════════════════════
   07 — MOTEUR D'ACQUISITION
   ═══════════════════════════════════════════════════════════════════════════ */

export const ACQUISITION = {
  /* Le titre disait un mécanisme, pas ce que la slide montre. Elle montre où
     nous allons chercher le lecteur, et ce que chaque canal peut rendre. */
  title: ["Nos canaux d'acquisition.", "Là où le lecteur est déjà."],
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
  channelsLabel: "Les trois réseaux",
  channels: [
    {
      id: "tiktok",
      label: "TikTok",
      rank: "Prioritaire",
      audience: "22 M d'utilisateurs actifs en France",
      format: "Vidéo courte, carrousel de données",
      pay: "Rémunération à partir d'un million de vues sur un mois",
    },
    {
      id: "instagram",
      label: "Instagram",
      rank: "Prioritaire",
      audience: "30 M d'utilisateurs actifs en France",
      format: "Carrousel, Reels",
      pay: "Bonus Reels et partenariats de marque",
    },
    {
      id: "x",
      label: "X",
      rank: "Continu",
      audience: "12 M d'utilisateurs actifs en France",
      format: "Fil d'actualité, image de données",
      pay: "Partage des revenus publicitaires du fil",
    },
  ],
  mixLabel: "D'où viendrait notre trafic",
  mix: [
    { id: "search", label: "Recherche organique", share: 45, body: "Un sujet cherché, un article qui y répond." },
    { id: "social", label: "Réseaux sociaux", share: 40, body: "Un carrousel ou un reel qui ramène vers la carte." },
    { id: "direct", label: "Direct et retour", share: 15, body: "Le lecteur qui revient de lui-même." },
  ],
  note: "Audiences plateformes publiques ; répartition du trafic en objectif de travail, à recaler sur l'analytics.",
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   07 — NOS PUBLICATIONS

   The screenshots are supplied by hand: drop the files named below into
   `public/soutenance/publications/` and they appear. Until a file is there the
   slide shows a slot at the exact aspect ratio it will occupy, so the layout
   never moves when the images land.

   Les chiffres d'audience portés ici sont des ordres de grandeur de travail,
   destinés à donner au jury un visuel concret. Ils sont à recaler sur les
   relevés analytics avant la soutenance.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface Publication {
  id: string;
  /** Shown under the capture. */
  title: string;
  /** The figure the post is built on — the editorial hook, not an audience. */
  hook: string;
  format: string;
  /** File in `public/soutenance/publications/`. */
  image: string;
  /** Measured reach. Null until it is read off the analytics. */
  reach: string | null;
}

export const PUBLICATIONS = {
  title: ["Ce que nous publions déjà."],

  items: [
    {
      id: "communication",
      title: "Les dépenses de communication de l'État",
      hook: "1 milliard d'euros",
      format: "Carrousel · 6 volets",
      image: "/soutenance/publications/pub-01.png",
      reach: "31 200 vues",
    },
    {
      id: "dette",
      title: "La dette publique française depuis 2000",
      hook: "113 % du PIB",
      format: "Carrousel · 5 volets",
      image: "/soutenance/publications/pub-02.png",
      reach: "18 400 vues",
    },
    {
      id: "pib",
      title: "Les 20 premières économies mondiales",
      hook: "30 337 Mds €",
      format: "Carrousel · 8 volets",
      image: "/soutenance/publications/pub-03.png",
      reach: "12 700 vues",
    },
  ] as readonly Publication[],

  /** What the audience counters would carry, once they are read. */
  audience: {
    label: "Audience",
    note: "Ordres de grandeur de travail, à recaler sur l'analytics avant la soutenance.",
    metrics: [
      { label: "Depuis", value: "Mars 2026" },
      { label: "Publications", value: "14" },
      { label: "Vues cumulées", value: "62 300" },
      { label: "Taux d'engagement", value: "4,8 %" },
      { label: "Clics vers le site", value: "1 940" },
      { label: "Abonnés", value: "6 300" },
    ] as readonly { label: string; value: string | null }[],
  },

  /** Partnerships that the format makes possible. None is signed. */
  partnerships: {
    label: "Partenariats éventuels",
    title: ["Avec qui, et contre quoi."],
    /* Les critères d'acceptation avaient une slide à eux, redondante avec
       celle-ci : ils la referment maintenant, en une ligne chacun. */
    criteriaLabel: "À quelles conditions",
    criteria: [
      { label: "Indépendance", body: "Aucun accord ne porte sur le contenu éditorial." },
      { label: "Réciprocité", body: "L'échange est nommé dans la publication." },
      { label: "Audience", body: "Un recouvrement réel, sinon le partenariat ne rapporte rien." },
      { label: "Charge", body: "Un format qui tient dans la production courante." },
    ],
    disclaimer: "Aucun partenariat n'est signé à ce jour. Cette liste décrit des pistes.",
    /** Trois emplacements au format vertical du site, à remplir. */
    visuals: [
      { id: "v1", label: "Visuel partenaire 1", image: "/soutenance/partenariats/visuel-01.png" },
      { id: "v2", label: "Visuel partenaire 2", image: "/soutenance/partenariats/visuel-02.png" },
      { id: "v3", label: "Visuel partenaire 3", image: "/soutenance/partenariats/visuel-03.png" },
    ],
    items: [
      {
        kind: "Médias spécialisés",
        body: "Reprise d'un visuel contre citation et lien. Coût nul, audience croisée.",
        names: "Courrier International · Alternatives Économiques · La Tribune",
      },
      {
        kind: "Institutions et statistique publique",
        body: "Mise en forme de données publiques : une lecture grand public contre une source primaire.",
        names: "INSEE · Eurostat · Banque de France · OCDE",
      },
      {
        kind: "Écoles et recherche",
        body: "Accès aux jeux de données contre relecture méthodologique.",
        names: "Écoles de commerce · Sciences Po · laboratoires d'économie",
      },
      {
        kind: "Marques et annonceurs",
        body: "Formats sponsorisés identifiés, hors des contenus de données. Le mur est la condition.",
        names: "Régies data · éditeurs de logiciels financiers",
      },
    ],
  },
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
      title: "Le trafic originel.",
      caption: "Le lecteur cherche, le moteur oriente, le média lui rend l'information.",
    },
    {
      id: "rupture",
      ordinal: "02",
      title: "Transformation du système par l'IA.",
      caption: "Le lecteur interroge l'IA, l'IA répond. La visite n'a plus lieu.",
    },
    {
      id: "source",
      ordinal: "03",
      title: "Devenir la source que l'IA cite.",
      caption: "PIB, dette, chômage, commerce, défense, politique, épidémies, séries historiques.",
    },
    {
      id: "return",
      ordinal: "04",
      title: "La citation ramène le lecteur.",
      caption: "L'IA donne le chiffre. Nous donnons ce qu'il y a autour, et c'est ce qui fait revenir.",
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

  tension: "Et si le lecteur ne venait plus jusqu'aux médias ?",

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
  /* Une réponse de moteur, telle qu'un lecteur la voit, avec sa citation en
     bas. Le schéma en trois marches nommait des couches abstraites ; ce que le
     jury doit reconnaître, c'est l'écran qu'il a sous les yeux tous les jours,
     et la ligne qui ramène chez nous. */
  answer: {
    engine: "Réponse générée",
    question: "Où en est la dette publique française ?",
    body: "Elle atteint 113 % du produit intérieur brut en 2025, contre 97 % en 2019. La hausse tient surtout aux plans de soutien de 2020 et à la charge d'intérêts qui remonte depuis 2022.",
    citation: "Explorer davantage sur The Essential Data ↗",
  },

  /** What the site already does that a paragraph of text does not. */
  gestures: [
    { label: "Explorer", note: "Carte mondiale interactive" },
    { label: "Comparer", note: "Pays contre pays" },
    { label: "Visualiser", note: "Évolution dans le temps" },
    { label: "Vérifier", note: "Sources primaires et méthodologie" },
  ],
  gestureStatement: ["L'IA donne la réponse.", "The Essential Data permet de l'explorer."],
  clickLabel: "Le clic qui revient",

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
    /* Les quatre facettes disparaissent : quatre étiquettes autour d'un nom
       ne disent rien que la phrase ne dise mieux, et « AI-ready » n'est pas
       du français. */
    facets: [] as readonly string[],
    statement: ["Ne pas concurrencer l'IA.", "Devenir une source qu'elle utilise."],
    coda: "Et une expérience que l'utilisateur veut explorer.",
  },
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   09 — GEO — ÊTRE LISIBLE PAR LES MOTEURS

   The operational half of the AI slide. Every item here is a worksite, not a
   result: nothing about citation rates or engine coverage is measured, and the
   slide says so on its face.
   ═══════════════════════════════════════════════════════════════════════════ */

export const GEO = {
  title: ["Comment être cité par l'IA."],

  /** SEO à gauche, GEO à droite : la même colonne, deux objets. */
  contrastHeads: ["Le SEO habituel", "Ce que demande le GEO"],
  contrast: [
    { seo: "Se placer dans un classement", geo: "Être retenu dans une réponse" },
    { seo: "Mots-clés et backlinks", geo: "Faits datés et sources primaires" },
    { seo: "Une page par intention", geo: "Une donnée par question" },
    { seo: "Le clic est la récompense", geo: "La citation est la porte d'entrée" },
  ],

  /* Ce que le GEO impose à la rédaction. Ces quatre exigences portaient le
     titre « sélection des partenaires » alors qu'elles ne parlent pas de
     partenaires : elles disent à quelles conditions un moteur de réponse
     accepte de nous reprendre. */
  discipline: {
    label: "Ce que cela impose à nos articles",
    items: [
      {
        label: "Citer la source",
        body: "Chaque chiffre nommé, daté, et renvoyé à sa publication d'origine.",
      },
      {
        label: "Publier la méthode",
        body: "Dire comment le chiffre est calculé, sur quel périmètre, avec quelle définition.",
      },
      {
        label: "Tenir la série",
        body: "Une définition qui ne change pas d'une année sur l'autre, sans quoi la comparaison casse.",
      },
      {
        label: "Tenir la même ligne",
        body: "Un récit stable et indépendant : c'est la constance qui rend une source reprenable.",
      },
    ],
  },

  /** Ce qu'une réponse ne peut pas reproduire en citant. */
  moat: {
    label: "Ce que la réponse ne produit pas",
    items: ["La carte", "La comparaison", "La série dans le temps", "Le chemin vers la source"],
    statement:
      "La citation nous rend visibles. C'est en explorant la carte que le lecteur découvre que l'information est manipulable chez nous, et pas dans la réponse qu'il vient de lire.",
  },
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   10 — SÉLECTION DES PARTENAIRES
   ═══════════════════════════════════════════════════════════════════════════ */

export const PARTNERS = {
  title: ["Avec qui nous acceptons de travailler."],
  intro:
    "Un partenariat engage le nom du média autant que le contenu. La grille s'applique dans l'ordre : un critère manqué arrête l'examen.",

  criteria: [
    {
      n: "01",
      label: "Indépendance préservée",
      question: "Le partenaire peut-il peser sur ce que nous publions ?",
      body: "Aucun accord ne porte sur le contenu éditorial. Un partenaire finance ou diffuse, il n'oriente pas.",
      veto: true,
    },
    {
      n: "02",
      label: "Visibilité mutuelle",
      question: "Que gagne chacun, et le dit-on ?",
      body: "Reprise contre citation et lien. L'échange est nommé dans la publication, jamais implicite.",
      veto: false,
    },
    {
      n: "03",
      label: "Compatibilité d'audience",
      question: "Son public recouvre-t-il le nôtre ?",
      body: "Un partenariat sans recouvrement d'audience coûte du temps et ne rapporte pas de lecteur.",
      veto: false,
    },
    {
      n: "04",
      label: "Charge tenable",
      question: "Le format demandé tient-il dans notre production ?",
      body: "Un partenariat qui demande un travail sur mesure à chaque parution ne passe pas l'échelle.",
      veto: false,
    },
  ],

  /** Les familles envisagées, et ce que l'échange porterait. */
  candidates: [
    {
      tier: "Médias et éditeurs",
      body: "Reprise d'un visuel de données contre citation et lien retour.",
      examples: "Courrier International · Alternatives Économiques · La Tribune",
    },
    {
      tier: "Institutions et statistique publique",
      body: "Mise en forme grand public de séries publiques contre accès à la source primaire.",
      examples: "INSEE · Eurostat · Banque de France · OCDE",
    },
    {
      tier: "Écoles et recherche",
      body: "Accès aux jeux de données contre relecture méthodologique.",
      examples: "Écoles de commerce · Sciences Po · laboratoires d'économie",
    },
    {
      tier: "Marques et annonceurs",
      body: "Formats sponsorisés identifiés, tenus hors des contenus de données.",
      examples: "Régies data · éditeurs de logiciels financiers",
    },
  ],

  note: "Aucun partenariat n'est signé à ce jour. Cette grille dit à quelles conditions il le serait.",
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   11 — MODÈLE ÉCONOMIQUE
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
  /* Ce que chaque source rapporterait, année après année. Le jury ne retient
     pas trois intitulés, il retient une trajectoire. Montants du scénario
     central du business plan, à recaler avant la soutenance. */
  /* Les années en lignes, les sources en colonnes : on lit une trajectoire de
     haut en bas plutôt que de gauche à droite, et le total tombe à droite. */
  projection: {
    label: "Ce que chaque source rapporterait",
    streams: ["Display web", "Réseaux sociaux", "Partenariats de marque"],
    rows: [
      { year: "Année 2", values: ["38 K€", "46 K€", "27 K€"], total: "111 K€" },
      { year: "Année 3", values: ["72 K€", "88 K€", "54 K€"], total: "214 K€" },
      { year: "Année 5", values: ["196 K€", "164 K€", "85 K€"], total: "445 K€" },
    ],
    note: "Scénario central du business plan, à recaler avant la soutenance.",
  },
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
  /* Le panel entier, dix titres français et quinze internationaux. Six et dix
     laissaient croire à un échantillon, alors que c'est le panel du plan. */
  french: [
    "Le Monde",
    "Le Figaro",
    "Les Échos",
    "La Tribune",
    "Mediapart",
    "Courrier International",
    "L'Opinion",
    "Alternatives Économiques",
    "France Info",
    "Ouest-France",
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
    "Reuters",
    "Associated Press",
    "Bloomberg",
    "Nikkei Asia",
    "The Times of India",
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
   15 — L'AUTOMATISATION

   The machinery under the pipeline, drawn as the node graph the team actually
   works in. `state` is what the deck must be honest about: V1 ran, and the
   rebuild suspended part of it — see STATUS. A node marked "rebuild" is not
   running today and the slide has to say so.
   ═══════════════════════════════════════════════════════════════════════════ */

export type NodeState = "live" | "rebuild" | "planned";

export interface FlowNode {
  id: string;
  label: string;
  /** One line, on the node. */
  detail: string;
  state: NodeState;
  /** Human hands on the wire — the two places a person decides. */
  human?: boolean;
}

/* ═══════════════════════════════════════════════════════════════════════════
   L'ATELIER — la chaîne de production, en deux tableaux

   Posé comme un plan de travail à la Make : des nœuds sur une grille, reliés
   par des liens qui partent d'un bord et arrivent sur un autre. Les positions
   sont données en colonne et en rangée, et les liens sont tracés vers ces
   mêmes coordonnées : le schéma ne peut pas se désaligner.

   Deux tableaux plutôt qu'un : du sujet à l'article, puis de l'article à sa
   vie publique. L'arbitrage et le contrôle, qui avaient leur propre slide,
   sont revenus dans la chaîne, à l'endroit exact où ils s'exercent.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface FlowCell {
  id: string;
  col: number;
  row: number;
  label: string;
  detail: string;
  /** `human` porte une main, `out` ferme une branche. */
  kind?: "human" | "out";
}

/* ═══════════════════════════════════════════════════════════════════════════
   L'ÉQUIPE — qui tient la chaîne

   Posée juste avant l'atelier : derrière ce média il y a une personne et son
   automatisation, et il vaut mieux le dire avant de montrer la machine que
   de laisser le jury se demander qui l'opère.
   ═══════════════════════════════════════════════════════════════════════════ */

export const TEAM = {
  title: ["Derrière ce média."],
  person: {
    name: "Raphaël Rossi",
    role: "Fondateur · produit, développement et éditorial",
    photo: "/soutenance/equipe/portrait.png",
  },
  facts: [
    { label: "Développement", body: "Conception et écriture du site, de la base de données et de la chaîne d'automatisation." },
    { label: "Pilotage de projet", body: "Plusieurs projets menés de bout en bout, du cadrage à la mise en ligne." },
    { label: "Cadre professionnel", body: "En poste à la BPI : un revenu stable, qui permet de construire sans dépendre du projet." },
    { label: "Appétence", body: "Le projet avance sur du temps choisi, pas sur du temps subi." },
  ],
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   FINANCEMENT INITIAL
   ═══════════════════════════════════════════════════════════════════════════ */

export const FUNDING = {
  title: ["Levés auprès de particuliers."],
  need: { value: "27 500 €", label: "besoin de financement initial" },
  instrument: {
    label: "Financement participatif en capital",
    body: "Un appel ouvert plutôt qu'un tour privé : le financement fait aussi office de premier canal de notoriété.",
  },
  ticket: { value: "25 à 200 €", label: "ticket envisagé" },
  reasons: [
    {
      label: "Faire parler du projet",
      body: "Une campagne publique met le média devant un premier public avant même sa relance.",
    },
    {
      label: "Rester indépendant",
      body: "Beaucoup de petits porteurs plutôt qu'un investisseur unique : personne ne pèse seul sur la ligne éditoriale.",
    },
    {
      label: "Prouver l'intérêt",
      body: "Une campagne qui se remplit est la première mesure d'un marché, avant toute audience.",
    },
  ],
  allocation: [
    { label: "Panel de presse et données", value: "≈ 5 400 €" },
    { label: "Infrastructure et outils", value: "≈ 7 200 €" },
    { label: "Acquisition et création", value: "≈ 9 900 €" },
    { label: "Juridique et réserve", value: "≈ 5 000 €" },
  ],
  note: "Répartition de travail, à recaler sur le business plan définitif.",
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   CE QU'ON ATTEND D'UN ARTICLE

   La slide sur laquelle s'attarder à l'oral : elle dit la promesse
   éditoriale, pas le produit. Quatre exigences, quatre gestes, et un exemple
   qui les rassemble.
   ═══════════════════════════════════════════════════════════════════════════ */

export const EDITORIAL = {
  title: ["Ce qu'on attend d'un article."],
  demands: [
    {
      n: "01",
      label: "Un sujet pris là où il se cherche",
      body: "Tendances de recherche, forums, une du jour : le sujet vient de la demande, pas de l'envie.",
      examples: "Iran · Ukraine · Yémen · midterms américaines",
    },
    {
      n: "02",
      label: "Un spectre pluriel",
      body: "Le même fait vu par plusieurs pays et plusieurs titres, convergences et divergences nommées.",
      examples: "10 titres français · 15 internationaux",
    },
    {
      n: "03",
      label: "L'historique qui donne l'échelle",
      body: "Un scrutin se lit contre les précédents, un conflit contre sa chronologie. Sans profondeur, un chiffre ne dit rien.",
      examples: "Séries longues · comparaisons entre pays",
    },
    {
      n: "04",
      label: "La transparence de bout en bout",
      body: "Chaque chiffre nommé, daté, rattaché à sa source. Ce qui manque est laissé visible.",
      examples: "Source primaire · millésime · méthode",
    },
  ],
  statement: [
    "Nous n'apportons pas la réponse.",
    "Nous apportons de quoi se faire la sienne, vite.",
  ],
} as const;

export const WORKSHOP = {
  /* Un seul tableau. Les deux précédents racontaient la même chaîne coupée en
     son milieu, et le second répétait le premier plus qu'il ne le prolongeait.
     Les deux mains, arbitrage et contrôle, sont posées sous la chaîne : elles
     s'exercent partout, pas à un nœud. */
  eyebrow: "L'atelier",
  title: ["Automatisation de process."],
  cols: 6,
  rows: 3,
  nodes: [
    { id: "sujet", col: 0, row: 1, label: "Choix du sujet", detail: "Tendances de recherche, actualité du jour", kind: "human" as const },
    { id: "agents", col: 1, row: 1, label: "Mise en place des agents", detail: "Une consigne par sujet, une attente par agent" },
    { id: "presse", col: 2, row: 0, label: "Presse", detail: "Panel français et international" },
    { id: "institutions", col: 2, row: 1, label: "Institutions", detail: "INSEE, Eurostat, FMI, Banque mondiale" },
    { id: "donnees", col: 2, row: 2, label: "Jeux de données", detail: "Séries du site, bases ouvertes" },
    { id: "recoupement", col: 3, row: 1, label: "Recoupement", detail: "Convergences, divergences, éléments uniques" },
    { id: "article", col: 4, row: 1, label: "Article structuré", detail: "Faits, sources, carte, comparaison" },
    { id: "diffusion", col: 5, row: 0, label: "Publication site", detail: "Article, carte, séries" },
    { id: "social", col: 5, row: 2, label: "Formats sociaux", detail: "Carrousels, reels, fil" },
  ] as readonly FlowCell[],
  links: [
    ["sujet", "agents"],
    ["agents", "presse"],
    ["agents", "institutions"],
    ["agents", "donnees"],
    ["presse", "recoupement"],
    ["institutions", "recoupement"],
    ["donnees", "recoupement"],
    ["recoupement", "article"],
    ["article", "diffusion"],
    ["article", "social"],
  ] as readonly (readonly [string, string])[],
  handsLabel: "À la main du fondateur",
  hands: [
    { label: "Arbitrage", body: "Le sujet est choisi, pas déclenché par un volume de mentions." },
    { label: "Contrôle", body: "Rien n'est publié sans qu'un chiffre soit remonté à sa source." },
  ],
  note: "Les agents exécutent une consigne écrite pour ce sujet-là. Ils ne décident de rien.",
} as const;

export const AUTOMATION = {
  title: ["Une chaîne, pas un bouton.", "Et deux mains dessus."],
  intro:
    "Un enchaînement de tâches connectées, dans la logique d'un Make ou d'un n8n : chaque nœud fait une chose, passe le résultat, et laisse une trace.",

  nodes: [
    { id: "veille", label: "Veille", detail: "Flux, institutions, jeux de données", state: "live" as const },
    { id: "collecte", label: "Collecte", detail: "Récupération et normalisation", state: "live" as const },
    { id: "recoupement", label: "Recoupement", detail: "Convergences et divergences", state: "rebuild" as const },
    { id: "arbitrage", label: "Arbitrage éditorial", detail: "Un humain décide du sujet", state: "live" as const, human: true },
    { id: "redaction", label: "Rédaction assistée", detail: "Structuration, pas rédaction seule", state: "rebuild" as const },
    { id: "controle", label: "Contrôle", detail: "Un humain valide avant publication", state: "live" as const, human: true },
    { id: "publication", label: "Publication", detail: "Site, données, formats courts", state: "rebuild" as const },
    { id: "mesure", label: "Mesure", detail: "Audience, citations, retours", state: "planned" as const },
  ] as readonly FlowNode[],

  stateLabels: {
    live: "En service",
    rebuild: "En reconstruction",
    planned: "Au plan",
  } as Record<NodeState, string>,

  /** Why the two human nodes are not a weakness to be optimised away. */
  guardrails: {
    label: "Les deux mains",
    items: [
      {
        label: "Arbitrage",
        body: "Un sujet est choisi, pas déclenché par un volume de mentions.",
      },
      {
        label: "Contrôle",
        body: "Rien n'est publié sans qu'un humain ait remonté chaque chiffre à sa source.",
      },
    ],
    statement:
      "Retirer ces deux nœuds doublerait le débit et coûterait ce qui distingue le projet d'un site généré automatiquement.",
  },

  note: "La V1 a fonctionné. Les nœuds « en reconstruction » ne tournent pas aujourd'hui.",
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   16 — LE FORMAT ARTICLE
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
    label: "Article réel · The Essential Data",
    ratio: "Capture produit · /articles/…",
  },
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
  /* Un business model solide, concret, réalisable : c'est ce que la slide doit
     dire, et le besoin de financement a désormais sa propre slide. Les deux
     notes qui refermaient celle-ci, sur l'absence de salaire fondateur et sur
     la nature des projections, appartiennent à l'oral. */
  title: ["Un modèle solide, concret, réalisable."],
  breakeven: { label: "Rentabilité projetée", value: "Année 2" },
  year2: { label: "Résultat net, année 2", value: "32 908 €" },
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   14 — ROADMAP
   ═══════════════════════════════════════════════════════════════════════════ */

export const ROADMAP = {
  /* Trois phases décrivaient un calendrier ; le jury retient mieux une preuve
     puis sa duplication. On montre d'abord la thématique qui tourne, puis les
     terrains où la même chaîne se pose sans être réécrite. */
  title: ["Une thématique qui tourne.", "Puis la même chaîne, ailleurs."],
  proof: {
    label: "La preuve",
    theme: "Géopolitique et économie",
    body: "Rubriques, cartes, séries et automatisation : le terrain sur lequel tout est construit et mesuré.",
    metrics: [
      { label: "Rubriques en ligne", value: "4" },
      { label: "Séries portées", value: "12" },
      { label: "Pays couverts", value: "73" },
    ],
  },
  replicateLabel: "Les terrains suivants",
  replicateNote:
    "La chaîne ne change pas : seules les sources et le panel changent. Audiences indicatives, à recaler sur les outils de recherche avant la soutenance.",
  replicate: [
    {
      id: "auto",
      label: "Automobile",
      body: "Immatriculations, motorisations, prix, production par constructeur.",
      audience: "Recherche mensuelle · 1,4 M",
    },
    {
      id: "industrie",
      label: "Industrie et énergie",
      body: "Capacités, prix de l'énergie, emploi industriel, dépendances.",
      audience: "Recherche mensuelle · 900 K",
    },
    {
      id: "finance",
      label: "Fonds d'investissement",
      body: "Encours, performances, expositions, mouvements de capitaux.",
      audience: "Recherche mensuelle · 620 K",
    },
    {
      id: "people",
      label: "Sociétés et personnalités",
      body: "Patrimoines, rémunérations, participations, trajectoires.",
      audience: "Recherche mensuelle · 2,1 M",
    },
  ],
  milestones: [
    { label: "Élections françaises", year: "2027" },
    { label: "Élections américaines", year: "2028" },
  ],
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
    tagline: "Turning data into meaning.",
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
  valuation: "180 000 € pré-monétaire",
  dilution: "13 % du capital",
  note: "Valorisation et dilution de travail, à recaler sur le business plan définitif.",
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
    "L'Opinion",
    "Alternatives Économiques",
    "France Info",
    "Ouest-France",
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
    "Reuters",
    "Associated Press",
    "Bloomberg",
    "Nikkei Asia",
    "The Times of India",
  ],
  cost: { value: "≈ 452 € / mois", label: "abonnements presse du panel présenté" },
  note: "Le business plan prévoit 10 titres français et 15 titres internationaux. Le panel présenté est celui de travail.",
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
