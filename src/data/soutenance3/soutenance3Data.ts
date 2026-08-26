/* ═══════════════════════════════════════════════════════════════════════════
   SOUTENANCE 3 — CONTENU

   La V3 ne repart pas de zéro : elle rejoue le travail de la V2 dans un ordre
   qui tient debout. Ce fichier ne porte donc que deux choses — la nouvelle
   liste de slides, et les textes que la V2 n'avait pas. Tout ce qui est repris
   tel quel est importé de `soutenance2Data`, jamais recopié : une correction
   faite là-bas vaut ici, et un chiffre n'existe qu'à un seul endroit.

   CE QUI CHANGE PAR RAPPORT À LA V2
     La V2 disait « voici tout ce que j'ai pensé pour mon projet ». La V3 dit
     « voici un problème, voici ma réponse, voici pourquoi elle tient ». Sept
     actes, une seule direction, jamais de retour en arrière.

   OÙ SE PLACE L'ARGENT
     Le marché, le modèle et la trajectoire financière formaient un acte au
     milieu du deck, entre le produit et la fabrication. Ils coupaient la
     démonstration en deux : le jury quittait le produit pour un tableau de
     revenus, puis y revenait. Ils forment désormais l'avant-dernier acte,
     après la preuve d'exécution — on ne parle de recette qu'une fois montré
     qu'il y a quelque chose à vendre et que c'est déjà construit.

   RÈGLE DU FICHIER — inchangée depuis la V2 : le business plan fait foi. Un
   chiffre que le plan ne porte pas n'est pas écrit ici, il est `A_COMPLETER`,
   que les slides affichent comme un emplacement visible plutôt que comme un
   nombre. Le coût d'un article, le temps de production, la facture d'API : ces
   chiffres existeront quand ils auront été mesurés, pas avant.
   ═══════════════════════════════════════════════════════════════════════════ */

import type { DeckSlide } from "@/components/soutenance2/DeckShell";

/** Rendu comme un emplacement visible, jamais comme un nombre. */
export const A_COMPLETER = "{À COMPLÉTER}";

/* ═══════════════════════════════════════════════════════════════════════════
   LES SEPT ACTES
   ═══════════════════════════════════════════════════════════════════════════ */

export const S3_ACTS = [
  "probleme",
  "produit",
  "place",
  "fabrication",
  "preuve",
  "modele",
  "echelle",
] as const;

export const S3_ACT_LABELS: Record<string, string> = {
  probleme: "I · Le problème",
  produit: "II · Le produit",
  place: "III · Pourquoi il y a une place",
  fabrication: "IV · La fabrication",
  preuve: "V · Preuve d'exécution",
  modele: "VI · Le modèle économique",
  echelle: "VII · Passage à l'échelle",
};

/* ═══════════════════════════════════════════════════════════════════════════
   LA LISTE

   Une question par slide. Elle est écrite dans les notes, en tête : si deux
   slides répondent à la même, l'une des deux n'a rien à faire là.
   ═══════════════════════════════════════════════════════════════════════════ */

export const S3_SLIDES: readonly DeckSlide[] = [
  /* ── ACTE I — LE PROBLÈME ────────────────────────────────────────────── */
  {
    id: "cover",
    label: "Couverture",
    act: "probleme",
    seconds: 25,
    tone: "dark",
    speakerNotes:
      "QUESTION : de quoi va-t-on parler ? Ne rien expliquer. Laisser le globe finir d'arriver, dire le nom, et enchaîner. Toute la tentation est d'annoncer le plan ici : ne pas le faire, la slide suivante pose le problème mieux qu'un sommaire.",
  },
  {
    id: "paradoxe",
    label: "Le paradoxe",
    act: "probleme",
    seconds: 45,
    steps: 3,
    speakerNotes:
      "QUESTION : pourquoi ce sujet mérite-t-il qu'on s'y arrête ? Trois temps, trois pressions sur la flèche. Laisser le silence entre les deux phrases : c'est le contraste qui installe la tension, pas le débit. Ne donner aucun chiffre ici, ils viennent plus tard.",
  },
  {
    id: "travail",
    label: "Le travail du lecteur",
    act: "probleme",
    seconds: 60,
    speakerNotes:
      "QUESTION : concrètement, qu'est-ce qui coûte au lecteur ? Les sources arrivent, puis la chaîne d'opérations se déroule. Insister : l'information existe, elle est même surabondante. Ce qui manque, c'est le travail de mise en relation, et il est aujourd'hui à la charge du lecteur. Cette idée reviendra à l'acte V, retournée : c'est nous qui le prendrons en charge.",
  },
  {
    id: "manque",
    label: "Ce qui manque",
    act: "probleme",
    seconds: 45,
    steps: 3,
    speakerNotes:
      "QUESTION : personne ne fait déjà ça ? Ne pas attaquer les médias — ils font leur métier. Dire ce que chaque famille apporte, puis nommer les cinq verbes que personne ne réunit. C'est le trou dans lequel le produit va se poser à la slide suivante.",
  },
  {
    id: "reponse",
    label: "La réponse",
    act: "probleme",
    seconds: 40,
    speakerNotes:
      "QUESTION : quelle est la réponse ? Le produit apparaît comme conséquence, pas comme annonce. Ne parler ni de modèle économique, ni d'IA, ni d'automatisation : uniquement de ce que le lecteur obtient. Si le jury pose une question business ici, répondre « j'y viens » et avancer.",
  },
  /* ── ACTE II — LE PRODUIT ────────────────────────────────────────────── */
  {
    id: "parcours",
    label: "Comment ça marche",
    act: "produit",
    seconds: 60,
    speakerNotes:
      "QUESTION : à quoi ressemble l'expérience ? Montrer, ne pas décrire. Suivre le parcours du doigt : globe, pays, indicateur, historique, comparaison, source. Une démo live sur /map/economy est possible ici si la salle et le réseau le permettent — la décision se prend avant, pas devant le jury.",
  },
  {
    id: "lecture",
    label: "Trois profondeurs",
    act: "produit",
    seconds: 70,
    speakerNotes:
      "QUESTION : combien de temps me faut-il pour comprendre ? C'est la proposition de valeur centrale, et elle arrivait en slide 23 en V2. Prendre un exemple et le tenir : la dette française. Trente secondes pour le chiffre, deux minutes pour le situer, cinq pour l'instruire. Finir sur la source : c'est la traçabilité qui fait la différence.",
  },
  {
    id: "series",
    label: "Les séries",
    act: "produit",
    seconds: 50,
    speakerNotes:
      "QUESTION : est-ce que ça tient au-delà d'un article ? Ne pas réciter la liste des indicateurs. Faire comprendre la mécanique : un indicateur × plusieurs pays × plusieurs années. C'est la répétabilité du format qui fait le média, pas le nombre de séries. Appuyer sur la profondeur temporelle, 1960 à aujourd'hui.",
  },
  {
    id: "promesse",
    label: "La promesse éditoriale",
    act: "produit",
    seconds: 75,
    speakerNotes:
      "QUESTION : qu'est-ce qui distingue un article TED ? Quatre exigences, et surtout la phrase finale, à laisser tomber seule : nous n'apportons pas la réponse, nous apportons de quoi se faire la sienne, vite. C'est la fin de l'acte produit — marquer un temps avant de passer au positionnement.",
  },
  /* ── ACTE III — POURQUOI IL Y A UNE PLACE ────────────────────────────── */
  {
    id: "positionnement",
    label: "Le positionnement",
    act: "place",
    seconds: 60,
    speakerNotes:
      "QUESTION : pourquoi ce produit face aux médias, aux plateformes data et à ChatGPT ? On enchaîne directement sur la promesse éditoriale, sans passer par les chiffres de marché : ils viennent bien plus loin, une fois la preuve faite. Ne jamais dire « meilleur ». Dire « à l'intersection ». Les quatre familles font bien leur métier ; aucune ne réunit les quatre gestes. C'est cette intersection qui est la place.",
  },
  {
    id: "bascule",
    label: "L'IA déplace la distribution",
    act: "place",
    seconds: 55,
    tone: "dark",
    steps: 3,
    speakerNotes:
      "QUESTION : et si l'IA rend les médias invisibles ? Ici l'IA n'est QU'UN CANAL. Ne pas parler d'agents, de Claude, de production : cela vient à l'acte V et les mélanger est exactement le défaut de la V2. Une seule idée : si l'interface change, la bataille se déplace vers la source.",
  },
  {
    id: "canal",
    label: "Devenir une source",
    act: "place",
    seconds: 75,
    tone: "dark",
    steps: 3,
    speakerNotes:
      "QUESTION : quelle est notre stratégie face à l'IA ? Ne pas la concurrencer, devenir une source qu'elle cite. Énumérer vite les conditions du GEO — faits datés, sources primaires, méthode stable — sans en faire un cours. Finir sur la phrase, qui est la meilleure du deck : la citation nous rend visibles, l'exploration nous rend nécessaires.",
  },
  /* ── ACTE IV — LA FABRICATION ────────────────────────────────────────── */
  {
    id: "pivot",
    label: "Pivot",
    act: "fabrication",
    seconds: 20,
    tone: "dark",
    speakerNotes:
      "QUESTION : est-ce que c'est juste un média de plus ? Trois lignes, trois silences. C'est la rupture du deck : on quitte le front office pour l'atelier. Ne rien ajouter à l'oral, laisser les phrases tomber.",
  },
  {
    id: "recoupement",
    label: "Le recoupement",
    act: "fabrication",
    seconds: 70,
    tone: "dark",
    speakerNotes:
      "QUESTION : que fait TED que le lecteur faisait tout seul ? C'est la slide 3 retournée. Le dire explicitement : au début, ce travail était à la charge du lecteur ; ici, il est à la nôtre. Puis la phrase qui prépare la suite : fait à la main, article après article, ce travail serait hors de prix.",
  },
  {
    id: "pipeline",
    label: "Le pipeline",
    act: "fabrication",
    seconds: 90,
    speakerNotes:
      "QUESTION : comment le travail est-il réellement fait ? Laisser les étapes s'allumer une à une. Nommer les deux mains humaines au passage — arbitrage et contrôle — sans s'y attarder : la slide suivante leur est consacrée.",
  },
  {
    id: "partage",
    label: "Qui fait quoi",
    act: "fabrication",
    seconds: 60,
    speakerNotes:
      "QUESTION : est-ce un média généré automatiquement ? Réponse : non, et cette slide existe pour la donner. Les agents exécutent, l'humain décide. Le choix du sujet, l'arbitrage, la validation et la ligne éditoriale ne sont jamais délégués. C'est aussi la réponse juridique, deux slides plus loin.",
  },
  {
    id: "economie",
    label: "L'économie de l'automatisation",
    act: "fabrication",
    seconds: 75,
    speakerNotes:
      "QUESTION : qu'est-ce que l'automatisation change vraiment ? Ne pas se contenter de « j'utilise des agents ». Montrer le coût. Les cases marquées à compléter le sont volontairement : les mesures de production seront faites avant la soutenance, et annoncer un chiffre non mesuré serait exactement ce que le projet reproche aux autres. Le dire au jury si la question vient.",
  },
  {
    id: "tracabilite",
    label: "Automatisé, mais traçable",
    act: "fabrication",
    seconds: 45,
    speakerNotes:
      "QUESTION : et le cadre légal ? Quatre garanties, quatre coches, et on avance. Ne pas faire un cours de droit : le message est que le risque a été anticipé, pas qu'on maîtrise l'AI Act article par article. Si le jury creuse, l'annexe juridique existe (touche A).",
  },
  /* ── ACTE V — PREUVE D'EXÉCUTION ─────────────────────────────────────── */
  {
    id: "etat",
    label: "Ce qui existe déjà",
    act: "preuve",
    seconds: 70,
    speakerNotes:
      "QUESTION : est-ce construit, ou est-ce une idée ? La slide est une preuve, pas un calendrier. Assumer franchement ce qui est suspendu et pourquoi : on ralentit pour fiabiliser avant de changer d'échelle. Un jury préfère une suspension expliquée à une progression floue.",
  },
  {
    id: "derriere",
    label: "Derrière le produit",
    act: "preuve",
    seconds: 45,
    speakerNotes:
      "QUESTION : qui tient tout ça ? Ne surtout pas laisser l'impression « je fais tout seul, donc c'est fragile ». Le message est inverse : une structure légère par construction, parce que la charge courante est portée par l'automatisation. Compétences utiles d'un côté, agents de l'autre. Enchaîner : le produit existe, il est fabriqué, il est tenu — reste à dire à qui il s'adresse et comment il gagne de l'argent.",
  },
  /* ── ACTE VI — LE MODÈLE ÉCONOMIQUE ──────────────────────────────────── */
  {
    id: "marche",
    label: "Le marché",
    act: "modele",
    seconds: 45,
    speakerNotes:
      "QUESTION : y a-t-il une demande ? Le marché ouvre désormais le volet économique, après la preuve d'exécution : le jury a vu le produit et sait qu'il est construit, la question devient à qui il se vend. Deux ou trois chiffres, pas davantage, et chacun sert une conclusion.",
  },
  {
    id: "modele",
    label: "Le modèle",
    act: "modele",
    seconds: 50,
    speakerNotes:
      "QUESTION : comment ce média gagne-t-il de l'argent ? Une phrase par moteur, pas plus. Le point qui compte : pas de paywall. L'audience est la recette, donc tout ce qui augmente l'audience augmente directement le potentiel.",
  },
  {
    id: "trajectoire",
    label: "La trajectoire",
    act: "modele",
    seconds: 60,
    speakerNotes:
      "QUESTION : est-ce que ça devient viable ? Dernière slide avant la demande : c'est elle qui doit rester à l'écran dans la tête du jury quand arrive le besoin de financement. La courbe se dessine année après année. Deux chiffres à laisser à l'écran : rentabilité projetée en année 2, et le résultat net de l'année 2. Si le jury conteste, assumer que ce sont des projections du business plan et proposer l'annexe détaillée (touche A).",
  },
  /* ── ACTE VII — PASSAGE À L'ÉCHELLE ──────────────────────────────────── */
  {
    id: "financement",
    label: "Le financement",
    act: "echelle",
    seconds: 55,
    speakerNotes:
      "QUESTION : que débloquent 27 500 € ? Ne pas présenter un besoin, présenter un déblocage. La répartition d'abord, le jalon ensuite. Le financement participatif en capital est aussi un canal de notoriété : c'est un argument, pas un pis-aller.",
  },
  {
    id: "chaine",
    label: "Une chaîne, plusieurs marchés",
    act: "echelle",
    seconds: 55,
    tone: "dark",
    speakerNotes:
      "QUESTION : jusqu'où ça peut aller ? La géopolitique n'est pas la limite du projet, c'est son premier terrain de validation. Ce qui se réplique, c'est la chaîne — sources, data, recoupement, structuration, visualisation, distribution. Seuls le panel et l'audience changent.",
  },
  {
    id: "conclusion",
    label: "Conclusion",
    act: "echelle",
    seconds: 45,
    tone: "dark",
    speakerNotes:
      "QUESTION : que me demandez-vous ? Deux demandes, pas dix : mentorat et accompagnement stratégique. N'introduire aucune idée neuve ici. Laisser la signature à l'écran et se taire.",
  },
] as const;

export const S3_TOTAL_SECONDS = S3_SLIDES.reduce((n, s) => n + s.seconds, 0);

/* ═══════════════════════════════════════════════════════════════════════════
   ACTE I — LE PROBLÈME
   ═══════════════════════════════════════════════════════════════════════════ */

/** 01 — Couverture. La V2 n'affichait pas la signature ; la V3 la pose ici. */
export const S3_COVER = {
  context: "Soutenance de business plan",
} as const;

/* 02 — LE PARADOXE
   Presque une affiche. Trois temps : la première phrase, la charnière, la
   seconde. C'est le contraste qui installe la tension — pas le volume de
   texte, qui est ici volontairement dérisoire. */
export const S3_PARADOX = {
  eyebrow: "Le paradoxe",
  first: "Nous n'avons jamais eu autant d'informations.",
  hinge: "Et pourtant…",
  second: "Comprendre demande toujours autant de travail.",
} as const;

/* 03 — LE TRAVAIL INVISIBLE DU LECTEUR
   L'idée arrivait en slide 18 en V2, alors qu'elle est le point de départ.
   Le centre de la composition est LE LECTEUR : c'est lui qui reçoit tout et
   qui doit tout relier. À l'acte V, la même image reviendra avec The Essential
   Data au centre — c'est le même dessin, retourné, et c'est voulu. */
export const S3_READER_WORK = {
  eyebrow: "Le travail invisible",
  title: [
    "Le lecteur ne devrait pas avoir à faire",
    "lui-même le travail de recoupement.",
  ],
  center: "Le lecteur",
  sources: [
    "Presse française",
    "Presse internationale",
    "Institutions",
    "Bases statistiques",
    "Rapports",
    "Jeux de données",
    "Fils d'actualité",
    "Réseaux sociaux",
  ],
  /** Ce qu'il doit faire lui-même, dans l'ordre où il doit le faire. */
  operations: ["Chercher", "Croiser", "Vérifier", "Comparer", "Contextualiser", "Comprendre"],
  statement: ["L'information existe.", "Le travail de recoupement reste à sa charge."],
} as const;

/* 04 — CE QUI MANQUE
   Ne pas attaquer les médias : dire ce que chaque famille fait bien, puis
   nommer ce que personne ne réunit. C'est ce trou que le produit vient
   occuper à la slide suivante. */
export const S3_MISSING = {
  eyebrow: "Ce qui manque",
  families: [
    { label: "Les médias", body: "racontent l'actualité." },
    { label: "Les bases de données", body: "donnent les chiffres." },
    { label: "Les moteurs et les IA", body: "répondent aux questions." },
  ],
  bridge: "Mais il manque un espace où l'on puisse, en même temps :",
  verbs: ["Voir", "Comparer", "Remonter dans le temps", "Explorer", "Comprendre"],
} as const;

/* 05 — LA RÉPONSE
   Le produit apparaît comme conséquence des quatre slides précédentes, pas
   comme une annonce. Rien sur le modèle, rien sur l'IA, rien sur la
   fabrication : uniquement ce que le lecteur obtient. */
export const S3_ANSWER = {
  eyebrow: "La réponse",
  wordmark: "The Essential Data",
  title: ["Transformer des données dispersées", "en une expérience de compréhension."],
  pillars: ["Une donnée", "Une carte", "Une série", "Une source"],
  /* Le globe de la slide n'est pas une illustration : c'est celui de
     /map/economy, avec ses vraies données. Survoler un pays affiche sa fiche,
     et c'est la démonstration la plus courte du deck — on ne dit pas que le
     produit existe, on le fait tourner. */
  globe: {
    hint: "Survolez un pays",
    empty: "Passez le curseur sur le globe.",
    year: 2025,
    metricLabel: "PIB",
  },
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   ACTE II — LE PRODUIT
   ═══════════════════════════════════════════════════════════════════════════ */

/* 06 — LE PARCOURS
   Six gestes qui s'enchaînent, comme on les fait réellement dans le produit.
   La slide doit donner l'impression de naviguer, pas de lire une liste. */
export const S3_JOURNEY = {
  eyebrow: "Comment ça marche",
  title: ["Six gestes, un seul outil."],
  steps: [
    { id: "globe", label: "Globe", body: "Le monde entier, d'un coup d'œil." },
    { id: "pays", label: "Pays", body: "Un clic, et la fiche s'ouvre." },
    { id: "indicateur", label: "Indicateur", body: "PIB, dette, chômage, échanges." },
    { id: "historique", label: "Historique", body: "Soixante-six années, pas un instantané." },
    { id: "comparaison", label: "Comparaison", body: "Le même chiffre, ailleurs." },
    { id: "source", label: "Source", body: "D'où il vient, et quand." },
  ],
  demoNote: "Démo possible en direct : /map/economy",
} as const;

/* 07 — TROIS PROFONDEURS DE LECTURE
   La proposition de valeur centrale, remontée de la slide 23 de la V2. Un
   exemple tenu de bout en bout vaut mieux qu'une explication du format. */
export const S3_DEPTH = {
  eyebrow: "Trois profondeurs",
  title: ["Comprendre en 30 secondes.", "Maîtriser en 5 minutes."],
  example: "« Je veux comprendre la dette française. »",
  layers: [
    { id: "30s", time: "30 secondes", role: "Le chiffre", items: ["Titre", "Résumé", "Chiffres clés"] },
    { id: "2min", time: "2 minutes", role: "La situation", items: ["Contexte", "Comparaison", "Carte"] },
    { id: "5min", time: "5 minutes", role: "Le dossier", items: ["Analyse", "Historique", "Sources", "Points de vue"] },
  ],
  screenshot: {
    label: "Article réel · The Essential Data",
    ratio: "Capture produit · /articles/…",
  },
} as const;

/* 08 — LES SÉRIES
   Ne pas cataloguer. Faire comprendre la mécanique : c'est la répétabilité du
   format qui fait le média, pas la longueur de la liste. */
export const S3_SERIES = {
  eyebrow: "Les séries",
  title: ["Un format qui se répète.", "C'est ce qui en fait un média."],
  formula: [
    { label: "Un indicateur", detail: "PIB, dette, chômage, démographie…" },
    { label: "Plusieurs pays", detail: "Deux cents et quelques, quand la source les publie." },
    { label: "Plusieurs années", detail: "Chaque année, jamais une moyenne." },
  ],
  result: "Une comparaison",
  timeline: { from: "1960", to: "2025", live: "En direct" },
  indicators: [
    "PIB",
    "PIB par habitant",
    "Balance extérieure",
    "Inflation",
    "Dette publique",
    "Dépenses publiques",
    "Chômage",
    "Démographie",
  ],
  note: "Les quatre premières séries sont en base et servent la carte. Les suivantes suivent le même import.",
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   ACTE III — POURQUOI IL Y A UNE PLACE
   ═══════════════════════════════════════════════════════════════════════════ */

/* 11 — LE POSITIONNEMENT
   Quatre familles, chacune bonne dans son métier. Aucune ne réunit les quatre
   gestes. La place n'est pas « mieux que » : elle est à l'intersection. */
export const S3_POSITIONING = {
  eyebrow: "Le positionnement",
  title: ["Nous ne remplaçons personne.", "Nous assemblons ce qui existe séparément."],
  families: [
    { id: "medias", label: "Médias", body: "Le récit, l'actualité, la mise en perspective." },
    { id: "data", label: "Data et statistiques", body: "Le chiffre brut, l'autorité de la source." },
    { id: "moteurs", label: "Moteurs et IA", body: "La réponse immédiate à une question posée." },
    { id: "pure", label: "Pure players data-éditorial", body: "Le format long, l'enquête chiffrée." },
  ],
  /** Les quatre gestes qui définissent l'intersection. */
  axes: ["Data", "Éditorial", "Comparaison", "Exploration"],
  statement: "The Essential Data ne remplace pas ces acteurs. Il assemble ce qu'ils proposent séparément.",
} as const;

/* 12 — LA BASCULE
   L'IA est ici, et seulement ici, un canal de distribution. Ni agents, ni
   production, ni automatisation : cela vient à l'acte V. Les mélanger était
   le principal défaut narratif de la V2. */
export const S3_SHIFT = {
  eyebrow: "L'IA déplace la distribution",
  /* Trois temps, et le troisième est celui qui compte : la citation renvoie le
     lecteur vers nous. Une chaîne qui s'arrête à « sources » décrit une perte ;
     la boucle refermée décrit un canal. */
  beats: [
    {
      id: "hier",
      label: "Hier",
      chain: ["Utilisateur", "Google", "Média"],
      caption: "Le lecteur cherche, le moteur oriente, le média rend l'information.",
    },
    {
      id: "demain",
      label: "Demain",
      chain: ["Utilisateur", "IA", "Sources"],
      caption: "Le lecteur interroge l'IA, l'IA répond. La visite n'a plus lieu.",
    },
    {
      id: "retour",
      label: "Ce que cela ouvre",
      chain: ["Sources", "Réponse citée", "Utilisateur"],
      caption: "L'IA donne le chiffre et nomme sa source. C'est par là que le lecteur revient.",
    },
  ],
  statement: ["Si l'interface change,", "la bataille se déplace vers la source."],
} as const;

/* 13 — DEVENIR UNE SOURCE
   Trois temps : la stratégie, ses conditions, sa limite. Le sujet IA-canal
   s'arrête ici — deux slides au total, pas six comme en V2. */
export const S3_CHANNEL = {
  eyebrow: "L'IA comme canal",
  title: ["Ne pas concurrencer l'IA.", "Devenir une source qu'elle utilise."],
  conditionsLabel: "Ce qu'une IA retient",
  conditions: [
    "Des faits datés",
    "Des sources primaires",
    "Une donnée précise",
    "Une méthode stable",
    "Un historique cohérent",
    "Des citations",
  ],
  moatLabel: "Ce qu'une réponse ne reproduit pas",
  moat: ["La carte", "La comparaison", "La série dans le temps", "Le chemin vers la source"],
  statement: ["La citation nous rend visibles.", "L'exploration nous rend nécessaires."],
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   ACTE IV — LA FABRICATION
   ═══════════════════════════════════════════════════════════════════════════ */

/* 19 — QUI FAIT QUOI
   La slide qui répond à l'objection « est-ce un média généré par IA ? ».
   Elle n'existait pas en V2, où la réponse était disséminée. */
export const S3_SPLIT = {
  eyebrow: "Qui fait quoi",
  /* Deux cartes posées côte à côte disaient « voici deux listes ». Ce qu'il
     faut montrer, c'est une chaîne unique dont chaque maillon revient à l'un
     ou à l'autre : le partage se lit sur la ligne, pas dans deux boîtes. */
  agents: { label: "Les agents", role: "exécutent" },
  human: { label: "L'humain", role: "décide" },
  chain: [
    { label: "Choix du sujet", who: "human" as const },
    { label: "Recherche", who: "agents" as const },
    { label: "Collecte", who: "agents" as const },
    { label: "Recoupement", who: "agents" as const },
    { label: "Arbitrage", who: "human" as const },
    { label: "Structuration", who: "agents" as const },
    { label: "Mise en forme", who: "agents" as const },
    { label: "Validation", who: "human" as const },
    { label: "Déclinaisons", who: "agents" as const },
    { label: "Publication", who: "human" as const },
  ],
  statement: ["Les agents exécutent.", "L'humain décide."],
  note: "Retirer les quatre mains humaines doublerait le débit et coûterait ce qui sépare le projet d'un site généré automatiquement.",
} as const;

/* 20 — L'ÉCONOMIE DE L'AUTOMATISATION

   Première version : deux cartes détaillées, quatre emplacements de mesure et
   une courbe, le tout sur une slide. Trop lourde, illisible, et le message se
   perdait dans le dispositif.

   Ce qui reste : une seule idée, une seule courbe. Le coût d'un article
   classique ne baisse pas avec le volume ; le nôtre, si. Les deux valeurs à
   mesurer sont posées de part et d'autre, en gros, et rien d'autre.

   AUCUN CHIFFRE N'EST INVENTÉ. À MESURER AVANT LA SOUTENANCE : chronométrer
   trois articles de bout en bout, relever les factures d'API du mois. */
export const S3_ECONOMICS = {
  eyebrow: "L'économie de l'automatisation",
  title: ["Le coût d'un article ne baisse pas", "quand on en écrit plus. Le nôtre, si."],
  sides: [
    { id: "classique", label: "Production classique", detail: "Chaque article est refait de bout en bout." },
    { id: "pipeline", label: "Pipeline TED", detail: "La chaîne est écrite une fois, puis rejouée." },
  ],
  measure: { label: "Coût par article", value: A_COMPLETER },
  curve: {
    x: "Nombre d'articles produits",
    y: "Coût par article",
    caption: "Graduations à renseigner une fois les coûts relevés.",
  },
  statement: "Ce n'est pas produire plus vite. C'est produire à un coût qui ne croît pas avec le volume.",
  measureNote: "À mesurer avant la soutenance : trois articles chronométrés, et les factures d'API du mois.",
} as const;

/* 21 — AUTOMATISÉ, MAIS TRAÇABLE
   La slide juridique de la V2 faisait un cours de droit. Quatre garanties,
   quatre coches, et on avance. Le détail est en annexe. */
export const S3_TRACE = {
  eyebrow: "Le cadre",
  title: ["Automatisé.", "Mais traçable."],
  guarantees: [
    { label: "Source citée", body: "Chaque chiffre renvoyé à sa publication d'origine." },
    { label: "Donnée traçable", body: "Nommée, datée, rattachée à sa méthode de calcul." },
    { label: "Contrôle humain", body: "Un humain arbitre le sujet et valide avant publication." },
    { label: "Contenu IA signalé", body: "La mention figure sur l'article, quand elle s'impose." },
  ],
  frame: ["AI Act européen", "Droit d'auteur", "Traçabilité", "Contrôle humain"],
  statement: "Ce qui protège le lecteur nous protège aussi.",
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   ACTE VII — PASSAGE À L'ÉCHELLE
   ═══════════════════════════════════════════════════════════════════════════ */

/* 24 — CE QUE LE FINANCEMENT DÉBLOQUE
   La V2 présentait un besoin. La V3 présente un résultat. Le jalon exact
   n'est pas encore arrêté : il reste un emplacement, pas une invention. */
export const S3_UNLOCK = {
  milestoneLabel: "Ce que cela permet d'atteindre",
  milestone: A_COMPLETER,
  milestoneNote: "Jalon à arrêter : volume de publication visé, ou date de relance.",
} as const;
