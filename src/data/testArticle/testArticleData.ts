/* ═══════════════════════════════════════════════════════════════════════════
   TEST ARTICLE — « Les dépenses publiques françaises »

   A format laboratory, not a published piece. Everything the reader sees on
   /test-article is written here so the layout can be judged on its structure
   rather than on its prose.

   RULE OF THE FILE — no figure is invented. Two kinds of number appear:

     · one the site already carries and sources (the French debt series lives
       in `@/data/economy/economy` and is drawn straight from it);
     · one the article would need and the repository does not hold, written as
       `TO_FILL` and rendered as a visible slot.

   A slot on screen is a question to answer before publishing. A plausible
   number would be a lie the layout helps to tell.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Rendered as an unmistakable slot wherever a figure is missing. */
export const TO_FILL = "{DONNÉE À COMPLÉTER}";

export const TEST_ARTICLE = {
  kicker: "Format en test",
  title: "Les dépenses publiques françaises",
  /** Sits under the rule, below the title. */
  section: "Économie — Dette",
  standfirst:
    "Ce que la France dépense, ce qu'elle prélève, et pourquoi les deux chiffres ne racontent pas la même histoire.",
  readingTime: 7,
  updated: "2026-08-20",

  /* ── The condensed opening ──────────────────────────────────────────── */
  summary: {
    label: "L'essentiel",
    paragraphs: [
      "La France figure parmi les pays de l'Union européenne où la dépense publique rapportée au PIB est la plus élevée. Ce niveau n'est pas un accident récent : il est installé depuis des décennies, et ce qui bouge d'une année sur l'autre tient davantage à la composition de cette dépense qu'à son montant global.",
      "L'essentiel du débat porte en réalité sur trois questions distinctes que la discussion publique confond souvent : le niveau de la dépense, l'écart entre ce qui est dépensé et ce qui est prélevé, et la trajectoire de la dette qui en résulte. Ce sont trois grandeurs différentes, et elles ne se corrigent pas avec les mêmes leviers.",
    ],
  },

  /** The box that sits to the right of the opening. */
  keyFigures: {
    label: "Chiffres clés",
    /** `source: "dataset"` reads the site's own economy series; the rest are slots. */
    items: [
      {
        id: "debt_ratio",
        label: "Dette publique",
        unit: "% du PIB",
        source: "dataset" as const,
        note: "Série portée par la carte Économie du site.",
      },
      {
        id: "gdp",
        label: "PIB",
        unit: "Mds €",
        source: "dataset" as const,
        note: "Même série, même millésime.",
      },
      {
        id: "spending_ratio",
        label: "Dépense publique",
        unit: "% du PIB",
        source: "slot" as const,
        note: "Eurostat, comptes des administrations publiques (S13).",
      },
      {
        id: "balance",
        label: "Solde public",
        unit: "% du PIB",
        source: "slot" as const,
        note: "INSEE, comptes nationaux annuels.",
      },
    ],
  },

  /* ── Five slides, five ideas ────────────────────────────────────────── */
  carousel: {
    label: "Cinq idées pour lire le sujet",
    slides: [
      {
        n: "01",
        title: "Un niveau, pas une dérive",
        body: "La part de la dépense publique dans le PIB française est haute depuis longtemps. Traiter chaque hausse conjoncturelle comme une rupture fait manquer le fait principal : c'est un régime installé, pas une pente récente.",
      },
      {
        n: "02",
        title: "L'État n'est pas le premier payeur",
        body: "La plus grande part ne relève pas du budget de l'État mais des administrations de sécurité sociale. Comparer deux pays sur le total, c'est comparer deux périmètres — et souvent conclure sur autre chose que ce qu'on croit mesurer.",
      },
      {
        n: "03",
        title: "Dépenser n'est pas être en déficit",
        body: "Le déficit est un écart entre dépense et recette, pas un niveau de dépense. Un pays peut dépenser beaucoup et rester à l'équilibre s'il prélève autant. Les deux débats sont régulièrement fondus en un seul.",
      },
      {
        n: "04",
        title: "Le périmètre décide de la conclusion",
        body: "Une retraite par répartition passe par la dépense publique ; la même retraite financée par capitalisation n'y passe pas. Le service rendu peut être identique et le classement international inversé.",
      },
      {
        n: "05",
        title: "Un stock et un flux",
        body: "La dette est un stock, la dépense un flux annuel. Rapporter l'un à l'autre sans le dire produit des raccourcis dont aucun des deux camps du débat n'a besoin.",
      },
    ],
  },

  /* ── Chart + the precise reading beside it ──────────────────────────── */
  chart: {
    label: "La dette publique française",
    caption: "Dette publique en % du PIB. Série issue du jeu de données du site.",
    /** The precise notes that sit to the right of the chart. */
    readings: [
      {
        label: "Ce que la série montre",
        body: "Un niveau qui s'installe haut après chaque choc et ne revient pas à son point de départ. Les ruptures visibles correspondent aux crises, pas aux alternances.",
      },
      {
        label: "Ce qu'elle ne montre pas",
        body: "Ni la charge d'intérêts, ni la maturité de la dette, ni sa détention. Un même ratio peut être soutenable ou non selon ces trois éléments, absents du graphique.",
      },
      {
        label: "Définition retenue",
        body: "Dette au sens de Maastricht, administrations publiques consolidées (S13), en pourcentage du produit intérieur brut.",
      },
      {
        label: "Millésime",
        body: "Le point le plus récent de la série est une projection annuelle, pas un résultat constaté.",
      },
    ],
  },

  /* ── The development, in clearly separated parts ────────────────────── */
  parts: [
    {
      n: "I",
      title: "Ce que l'on mesure, exactement",
      paragraphs: [
        "La dépense publique n'est pas le budget de l'État. La comptabilité nationale agrège sous le code S13 trois ensembles distincts : les administrations publiques centrales, les administrations publiques locales et les administrations de sécurité sociale. Le troisième pèse le plus lourd, et c'est celui dont la composition varie le plus d'un pays à l'autre.",
        "Cette précision n'est pas un détail de comptable. Elle décide de ce que l'on compare. Deux pays qui organisent différemment leurs retraites, leur assurance maladie ou leur logement social produisent des ratios écartés sans que les services rendus le soient nécessairement autant.",
      ],
      pullQuote: {
        text: "Le classement change avec le périmètre retenu, pas seulement avec la politique menée.",
        attribution: "Reformulation de la mise en garde méthodologique commune aux publications d'Eurostat sur la comparabilité des dépenses S13",
      },
    },
    {
      n: "II",
      title: "Trois lectures qui ne se contredisent pas",
      intro:
        "Le sujet est rarement présenté pour ce qu'il est : un désaccord sur le critère, plus que sur les faits. Trois lectures cohabitent, chacune adossée à des travaux identifiables.",
      perspectives: [
        {
          label: "Efficience",
          holders: "Cour des comptes, OCDE — Government at a Glance",
          body: "La question posée n'est pas le montant mais le rendement : pour un euro dépensé, quel résultat mesurable sur la santé, l'éducation, l'emploi. Cette lecture accepte un niveau élevé si la contrepartie est documentée, et conteste la dépense dont l'effet ne l'est pas.",
          quote: TO_FILL,
          quoteSource: "Citation exacte et référence à insérer avant publication.",
        },
        {
          label: "Choix de socialisation",
          holders: "Économie de la redistribution — travaux académiques sur l'État social",
          body: "Le niveau français traduirait d'abord une décision collective : faire passer par la sphère publique des dépenses que d'autres pays laissent aux ménages ou aux assureurs privés. Dans cette lecture, un ratio élevé n'est pas en soi un dysfonctionnement mais la trace d'un arbitrage.",
          quote: TO_FILL,
          quoteSource: "Citation exacte et référence à insérer avant publication.",
        },
        {
          label: "Soutenabilité",
          holders: "FMI — Fiscal Monitor, Commission européenne",
          body: "L'objet d'attention n'est ni le niveau ni sa légitimité mais la trajectoire : la dette augmente-t-elle plus vite que la capacité à la porter. Cette lecture est indifférente au périmètre et se concentre sur l'écart durable entre recettes et dépenses.",
          quote: TO_FILL,
          quoteSource: "Citation exacte et référence à insérer avant publication.",
        },
      ],
    },
    {
      n: "III",
      title: "Le désaccord réel",
      paragraphs: [
        "Une fois les trois lectures posées, le point de friction apparaît : elles ne portent pas sur le même chiffre. La première parle d'efficacité par euro, la deuxième de périmètre, la troisième d'écart entre flux. Un débat qui saute de l'une à l'autre sans le signaler donne l'impression d'un affrontement frontal là où il y a surtout un changement de critère.",
        "C'est là que le travail éditorial a une valeur : non pas trancher, mais rendre visible sur quel chiffre chacun s'appuie, avec quelle définition, et à quelle date. Le lecteur peut alors faire le reste — et vérifier lui-même dans la source.",
      ],
    },
  ],

  /* ── Sources and transparency ───────────────────────────────────────── */
  sources: {
    label: "Sources",
    intro:
      "Chaque chiffre de cet article doit pouvoir être remonté jusqu'à sa source primaire. Les sources ci-dessous sont celles à utiliser pour remplir les emplacements laissés visibles.",
    items: [
      {
        name: "INSEE — Comptes nationaux annuels",
        role: "Dépenses et recettes des administrations publiques, solde public.",
      },
      {
        name: "Eurostat — Government finance statistics (S13, COFOG)",
        role: "Comparaisons européennes et ventilation par fonction.",
      },
      {
        name: "Cour des comptes — Rapports publics annuels",
        role: "Analyse de l'efficience et des trajectoires.",
      },
      {
        name: "OCDE — Government at a Glance",
        role: "Comparaisons internationales hors Union européenne.",
      },
      {
        name: "FMI — Fiscal Monitor et World Economic Outlook",
        role: "Projections et lecture de soutenabilité.",
      },
      {
        name: "Jeu de données The Essential Data — Économie",
        role: "Série de dette publique utilisée par le graphique de cet article.",
      },
    ],
  },

  transparency: {
    label: "Transparence — assistance par IA",
    body: [
      "Cet article est produit avec une assistance par IA sur la collecte, la mise en forme et le recoupement des sources. Les choix éditoriaux, la vérification des chiffres et la validation avant publication restent humains.",
      "Aucune donnée n'est publiée sans source primaire identifiée : les emplacements encore vides sont laissés visibles plutôt que comblés par une estimation.",
    ],
    aiAct: {
      label: "Règlement européen sur l'intelligence artificielle (AI Act)",
      body: "Le règlement (UE) 2024/1689 prévoit, pour les contenus produits ou modifiés avec l'aide d'un système d'IA, une information claire du lecteur. Cette mention est notre application de ce principe de transparence : elle indique où l'IA intervient dans la chaîne de production et où elle n'intervient pas.",
    },
  },
} as const;
