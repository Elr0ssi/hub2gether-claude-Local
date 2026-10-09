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
  section: "Économie · Dette",
  standfirst:
    "Ce que la France dépense, ce qu'elle prélève, et pourquoi les deux chiffres ne racontent pas la même histoire.",
  readingTime: 7,
  updated: "2026-08-20",

  /* ── The condensed opening ──────────────────────────────────────────── */
  /* ── L'essentiel ─────────────────────────────────────────────────────
     Une conclusion d'abord, puis les points qui la portent. Deux paragraphes
     pleins, réglés plus gros que le corps de l'article, se lisaient comme un
     deuxième chapeau : le lecteur les sautait pour aller au texte. Au même
     corps que l'article et découpés, ils se parcourent. */
  summary: {
    label: "L'essentiel",
    lead: "Le débat français sur la dépense publique confond trois grandeurs différentes, qui ne se corrigent pas avec les mêmes leviers.",
    points: [
      {
        strong: "Un niveau installé.",
        body: "La France figure parmi les pays de l'Union européenne où la dépense publique rapportée au PIB est la plus élevée, et ce depuis des décennies. Ce qui bouge d'une année sur l'autre tient à la composition de cette dépense, pas à son montant global.",
      },
      {
        strong: "Trois questions, pas une.",
        body: "Le niveau de la dépense, l'écart entre ce qui est dépensé et ce qui est prélevé, et la trajectoire de la dette qui en résulte sont trois mesures distinctes.",
      },
      {
        strong: "Le périmètre décide.",
        body: "Deux pays qui organisent différemment leurs retraites ou leur assurance maladie produisent des ratios écartés sans que les services rendus le soient autant.",
      },
    ],
  },

  /** The box that sits to the right of the opening. */
  keyFigures: {
    label: "Chiffres clés",
    /* Deux, pas quatre. Un encadré de chiffres se lit d'un coup d'œil ou ne
       se lit pas : au-delà de deux lignes il devient un tableau, et le
       lecteur le saute. Les deux retenus sont ceux que le site porte et
       source lui-même, si bien que l'encadré ne contient aucun emplacement
       vide. Les autres reviendront quand leur source sera branchée. */
    items: [
      {
        id: "debt_ratio",
        label: "Dette publique",
        unit: "% du PIB",
        source: "dataset" as const,
        note: "Série Économie du site",
      },
      {
        id: "gdp",
        label: "PIB",
        unit: "Mds €",
        source: "dataset" as const,
        note: "Même série, même millésime",
      },
    ],
  },

  /* ── Five slides, five ideas ────────────────────────────────────────── */
  carousel: {
    label: "Les idées à retenir",
    /* Un carrousel énonce, il ne démontre pas. Une idée par écran, une
       phrase pour l'asseoir : le développement a ses propres parties plus
       bas, et le lecteur qui fait défiler cherche la liste, pas l'argument. */
    slides: [
      {
        n: "01",
        title: "Un niveau installé, pas une dérive",
        body: "La part de la dépense publique dans le PIB est haute depuis des décennies. C'est un régime, pas une pente récente.",
      },
      {
        n: "02",
        title: "L'État n'est pas le premier payeur",
        body: "La plus grande part relève des administrations de sécurité sociale, pas du budget de l'État.",
      },
      {
        n: "03",
        title: "Dépenser n'est pas être en déficit",
        body: "Le déficit est un écart entre dépense et recette. Un pays peut dépenser beaucoup et rester à l'équilibre.",
      },
      {
        n: "04",
        title: "Le périmètre décide du classement",
        body: "Une retraite par répartition passe par la dépense publique ; la même par capitalisation n'y passe pas.",
      },
      {
        n: "05",
        title: "Un stock et un flux",
        body: "La dette est un stock, la dépense un flux annuel. Les deux ne se comparent pas directement.",
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

  /* ── Décomposition par poste ──────────────────────────────────────────
     La charpente d'abord, le contenu ensuite. Chaque poste porte sa part, son
     montant et deux exemples concrets : ce que la ligne finance, et ce qu'elle
     ne finance pas — la confusion la plus commune du débat. Les valeurs sont
     des emplacements tant que la source primaire n'est pas branchée : la
     ventilation COFOG d'Eurostat et les comptes de l'INSEE la portent, et
     c'est de là qu'elles viendront. */
  breakdown: {
    label: "Où va l'argent",
    intro:
      "La dépense publique n'est pas un bloc. Elle se répartit entre des postes dont les logiques, les payeurs et les marges de manoeuvre n'ont rien de commun.",
    yearNote: "Exercice à préciser lors du remplissage.",
    items: [
      {
        id: "protection-sociale",
        label: "Protection sociale",
        share: TO_FILL,
        amount: TO_FILL,
        funds: TO_FILL,
        excludes: TO_FILL,
        source: "INSEE, comptes des administrations publiques · Eurostat COFOG 10",
      },
      {
        id: "sante",
        label: "Santé",
        share: TO_FILL,
        amount: TO_FILL,
        funds: TO_FILL,
        excludes: TO_FILL,
        source: "DREES, comptes de la santé · Eurostat COFOG 07",
      },
      {
        id: "education",
        label: "Éducation",
        share: TO_FILL,
        amount: TO_FILL,
        funds: TO_FILL,
        excludes: TO_FILL,
        source: "DEPP, compte de l'éducation · Eurostat COFOG 09",
      },
      {
        id: "defense",
        label: "Défense",
        share: TO_FILL,
        amount: TO_FILL,
        funds: TO_FILL,
        excludes: TO_FILL,
        source: "Loi de programmation militaire · Eurostat COFOG 02",
      },
      {
        id: "charge-dette",
        label: "Charge de la dette",
        share: TO_FILL,
        amount: TO_FILL,
        funds: TO_FILL,
        excludes: TO_FILL,
        source: "Agence France Trésor · INSEE",
      },
      {
        id: "autres",
        label: "Autres postes",
        share: TO_FILL,
        amount: TO_FILL,
        funds: TO_FILL,
        excludes: TO_FILL,
        source: "Eurostat COFOG, postes restants",
      },
    ],
    /** Deux questions que le lecteur pose et que la ventilation seule n'éclaire pas. */
    questions: [
      { q: "Qu'a-t-on financé en 2025 ?", a: TO_FILL },
      { q: "Qu'a-t-on renoncé à financer ?", a: TO_FILL },
      { q: "Qu'est-ce qui relève d'un transfert et non d'un service rendu ?", a: TO_FILL },
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
      title: "Trois manières de lire le chiffre",
      intro:
        "Trois lectures cohabitent, chacune adossée à des travaux identifiables. Elles ne portent pas sur le même chiffre.",
      perspectives: [
        {
          label: "Efficience",
          holders: "Cour des comptes, OCDE · Government at a Glance",
          body: "La question posée n'est pas le montant mais le rendement : pour un euro dépensé, quel résultat mesurable sur la santé, l'éducation, l'emploi. Cette lecture accepte un niveau élevé si la contrepartie est documentée, et conteste la dépense dont l'effet ne l'est pas.",
        },
        {
          label: "Choix de socialisation",
          holders: "Économie de la redistribution · travaux académiques sur l'État social",
          body: "Le niveau français traduirait d'abord une décision collective : faire passer par la sphère publique des dépenses que d'autres pays laissent aux ménages ou aux assureurs privés. Dans cette lecture, un ratio élevé n'est pas en soi un dysfonctionnement mais la trace d'un arbitrage.",
        },
        {
          label: "Soutenabilité",
          holders: "FMI · Fiscal Monitor, Commission européenne",
          body: "L'objet d'attention n'est ni le niveau ni sa légitimité mais la trajectoire : la dette augmente-t-elle plus vite que la capacité à la porter. Cette lecture est indifférente au périmètre et se concentre sur l'écart durable entre recettes et dépenses.",
        },
      ],
    },
    {
      n: "III",
      title: "Ce que cela change pour le lecteur",
      paragraphs: [
        "La première lecture parle d'efficacité par euro, la deuxième de périmètre, la troisième d'écart entre flux. Un commentaire qui saute de l'une à l'autre sans le dire donne l'impression d'un affrontement là où il y a surtout un changement de critère.",
        "Le travail éditorial tient là : rendre visible sur quel chiffre chacun s'appuie, avec quelle définition et à quelle date. Le lecteur fait le reste, et vérifie dans la source.",
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
        name: "INSEE · Comptes nationaux annuels",
        role: "Dépenses et recettes des administrations publiques, solde public.",
      },
      {
        name: "Eurostat · Government finance statistics (S13, COFOG)",
        role: "Comparaisons européennes et ventilation par fonction.",
      },
      {
        name: "Cour des comptes · Rapports publics annuels",
        role: "Analyse de l'efficience et des trajectoires.",
      },
      {
        name: "OCDE · Government at a Glance",
        role: "Comparaisons internationales hors Union européenne.",
      },
      {
        name: "FMI · Fiscal Monitor et World Economic Outlook",
        role: "Projections et lecture de soutenabilité.",
      },
      {
        name: "Jeu de données The Essential Data · Économie",
        role: "Série de dette publique utilisée par le graphique de cet article.",
      },
    ],
  },

  transparency: {
    label: "Transparence · assistance par IA",
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
