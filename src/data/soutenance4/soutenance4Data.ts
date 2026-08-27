/* ═══════════════════════════════════════════════════════════════════════════
   SOUTENANCE 3 — CONTENU

   La V4 ne repart pas de zéro : elle rejoue le travail de la V2 dans un ordre
   qui tient debout. Ce fichier ne porte donc que deux choses — la nouvelle
   liste de slides, et les textes que la V2 n'avait pas. Tout ce qui est repris
   tel quel est importé de `soutenance2Data`, jamais recopié : une correction
   faite là-bas vaut ici, et un chiffre n'existe qu'à un seul endroit.

   CE QUI CHANGE PAR RAPPORT À LA V2
     La V2 disait « voici tout ce que j'ai pensé pour mon projet ». La V4 dit
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

export const S4_ACTS = [
  "probleme",
  "reponse",
  "marche",
  "ia",
  "fabrication",
  "preuves",
  "business",
  "conclusion",
] as const;

export const S4_ACT_LABELS: Record<string, string> = {
  probleme: "I · Le problème",
  reponse: "II · Notre réponse",
  marche: "III · Marché et concurrence",
  ia: "IV · L'IA et la différence",
  fabrication: "V · Qui fabrique, et comment",
  preuves: "VI · Les preuves",
  business: "VII · Le modèle économique",
  conclusion: "VIII · Conclusion",
};

/* ═══════════════════════════════════════════════════════════════════════════
   LA LISTE

   Une question par slide. Elle est écrite dans les notes, en tête : si deux
   slides répondent à la même, l'une des deux n'a rien à faire là.
   ═══════════════════════════════════════════════════════════════════════════ */

export const S4_SLIDES: readonly DeckSlide[] = [
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
    id: "attention",
    label: "Ce que l'on voit vraiment",
    act: "probleme",
    seconds: 55,
    steps: 4,
    speakerNotes:
      "QUESTION : de toute cette information, qu'est-ce qui nous parvient réellement ? Poser la question au jury et LAISSER LE SILENCE — trois ou quatre secondes, le temps que chacun cherche et ne trouve pas. C'est l'inconfort qui fait la démonstration, pas la réponse.\n\nNe jamais présenter cela comme une preuve : c'est une accroche, et le dire si on vous le reproche. Le point n'est pas que le jury soit mal informé, c'est que notre exposition est sélective et que personne n'y échappe.\n\nNe pas parler du produit ici. Cette slide prépare la suivante, qui montrera ce que le lecteur doit faire lui-même.",
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
    id: "reprise",
    label: "Quatre ans d'histoire",
    act: "probleme",
    seconds: 65,
    tone: "dark",
    speakerNotes:
      "QUESTION : depuis quand ce projet existe-t-il ? Trois versions, un même projet. Ce qui a changé n'est pas l'idée mais ce qu'on peut en faire : la V1 butait sur le coût du recoupement manuel, la V4 le fait faire. Ne pas s'excuser du temps écoulé — c'est ce temps qui rend la démonstration crédible.",
  },
  /* ── ACTE II — NOTRE RÉPONSE ─────────────────────────────────────────── */
  {
    id: "reponse",
    label: "La réponse",
    act: "reponse",
    seconds: 40,
    speakerNotes:
      "QUESTION : quelle est la réponse ? Le produit apparaît comme conséquence, pas comme annonce. Ne parler ni de modèle économique, ni d'IA, ni d'automatisation : uniquement de ce que le lecteur obtient. Si le jury pose une question business ici, répondre « j'y viens » et avancer.",
  },
  {
    id: "lecture",
    label: "Trois profondeurs",
    act: "reponse",
    seconds: 70,
    speakerNotes:
      "QUESTION : combien de temps me faut-il pour comprendre ? C'est la proposition de valeur centrale, et elle arrivait en slide 23 en V2. Prendre un exemple et le tenir : la dette française. Trente secondes pour le chiffre, deux minutes pour le situer, cinq pour l'instruire. Finir sur la source : c'est la traçabilité qui fait la différence.",
  },
  {
    id: "promesse",
    label: "La promesse éditoriale",
    act: "reponse",
    seconds: 75,
    speakerNotes:
      "QUESTION : qu'est-ce qui distingue un article TED ? Quatre exigences, et surtout la phrase finale, à laisser tomber seule : nous n'apportons pas la réponse, nous apportons de quoi se faire la sienne, vite. C'est la fin de l'acte produit — marquer un temps avant de passer au positionnement.",
  },
  /* ── ACTE III — MARCHÉ ET CONCURRENCE ────────────────────────────────── */
  {
    id: "positionnement",
    label: "Le positionnement",
    act: "marche",
    seconds: 60,
    speakerNotes:
      "QUESTION : pourquoi ce produit face aux médias, aux plateformes data et à ChatGPT ? On enchaîne directement sur la promesse éditoriale, sans passer par les chiffres de marché : ils viennent bien plus loin, une fois la preuve faite. Ne jamais dire « meilleur ». Dire « à l'intersection ». Les quatre familles font bien leur métier ; aucune ne réunit les quatre gestes. C'est cette intersection qui est la place.",
  },
  {
    id: "acteurs",
    label: "Qui occupe le terrain",
    act: "marche",
    seconds: 45,
    speakerNotes:
      "QUESTION : qui est déjà sur ce terrain, en France ? Nommer les acteurs sans les opposer : la slide suivante montre ce qu'ils couvrent et ce qu'ils laissent. Rester rapide, c'est un état des lieux, pas un jugement.",
  },
  {
    id: "concurrence",
    label: "Couverture de la concurrence",
    act: "marche",
    seconds: 60,
    speakerNotes:
      "QUESTION : que couvrent-ils, et que laissent-ils ? La matrice se lit en colonnes : chaque acteur fait bien une ou deux choses. Notre ligne est la seule qui les tienne toutes — le dire une fois, sans insister, la matrice a déjà parlé.",
  },
  /* ── ACTE IV — L'IA ET LA DIFFÉRENCE ─────────────────────────────────── */
  {
    id: "bascule",
    label: "L'IA déplace la distribution",
    act: "ia",
    seconds: 55,
    tone: "dark",
    steps: 3,
    speakerNotes:
      "QUESTION : et si l'IA rend les médias invisibles ? Ici l'IA n'est QU'UN CANAL. Ne pas parler d'agents, de Claude, de production : cela vient à l'acte V et les mélanger est exactement le défaut de la V2. Une seule idée : si l'interface change, la bataille se déplace vers la source.",
  },
  {
    id: "canal",
    label: "Devenir une source",
    act: "ia",
    seconds: 75,
    tone: "dark",
    steps: 3,
    speakerNotes:
      "QUESTION : quelle est notre stratégie face à l'IA ? Ne pas la concurrencer, devenir une source qu'elle cite. Énumérer vite les conditions du GEO — faits datés, sources primaires, méthode stable — sans en faire un cours. Finir sur la phrase, qui est la meilleure du deck : la citation nous rend visibles, l'exploration nous rend nécessaires.",
  },
  {
    id: "recoupement",
    label: "Le recoupement",
    act: "ia",
    seconds: 70,
    tone: "dark",
    speakerNotes:
      "QUESTION : que fait TED que le lecteur faisait tout seul ? C'est la slide 3 retournée. Le dire explicitement : au début, ce travail était à la charge du lecteur ; ici, il est à la nôtre. Puis la phrase qui prépare la suite : fait à la main, article après article, ce travail serait hors de prix.",
  },
  {
    id: "pivot",
    label: "Pivot",
    act: "ia",
    seconds: 20,
    tone: "dark",
    speakerNotes:
      "QUESTION : est-ce que c'est juste un média de plus ? Trois lignes, trois silences. C'est la rupture du deck : on quitte le front office pour l'atelier. Ne rien ajouter à l'oral, laisser les phrases tomber.",
  },
  /* ── ACTE V — QUI FABRIQUE, ET COMMENT ───────────────────────────────── */
  {
    id: "derriere",
    label: "Derrière le produit",
    act: "fabrication",
    seconds: 45,
    speakerNotes:
      "QUESTION : qui tient tout ça ? Ne surtout pas laisser l'impression « je fais tout seul, donc c'est fragile ». Le message est inverse : une structure légère par construction, parce que la charge courante est portée par l'automatisation. Compétences utiles d'un côté, agents de l'autre. Enchaîner : le produit existe, il est fabriqué, il est tenu — reste à dire à qui il s'adresse et comment il gagne de l'argent.",
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
  /* ── ACTE VI — LES PREUVES ───────────────────────────────────────────── */
  {
    id: "audience",
    label: "Où en est l'audience",
    act: "preuves",
    seconds: 50,
    speakerNotes:
      "QUESTION : combien de monde lit déjà ce média ? Les chiffres de septembre 2024 à août 2025, relevés sur l'analytics du site. Ne pas s'excuser de leur taille : ils décrivent un socle construit sans acquisition payante et sans IA, et c'est ce socle qui rend la trajectoire crédible. Zéro partenariat : le dire franchement, c'est ce que la slide modèle vient chercher.",
  },
  {
    id: "benchmark",
    label: "Où nous nous situons",
    act: "preuves",
    seconds: 45,
    speakerNotes:
      "QUESTION : est-ce que ce chiffre est petit ? Oui, et c'est l'information. Les ordres de grandeur du secteur se comptent en millions de visites par mois : le marché existe et il est occupé par des acteurs installés. La slide sert à situer la trajectoire, pas à se comparer à armes égales.",
  },
  {
    id: "publications",
    label: "Ce que nous publions déjà",
    act: "preuves",
    seconds: 55,
    speakerNotes:
      "QUESTION : est-ce que ça tourne déjà ? Trois publications réelles, pas des maquettes. Laisser les captures parler et ne commenter que ce que le jury ne peut pas voir : la fréquence et le circuit de production.",
  },
  {
    id: "partenariats",
    label: "Partenariats éventuels",
    act: "preuves",
    seconds: 45,
    // Le carrousel de visuels avance avec la flèche : sans ces trois états,
    // il restait bloqué sur le premier et la slide passait à la suivante.
    steps: 3,
    speakerNotes:
      "QUESTION : avec qui la construction est-elle envisageable ? Des pistes, pas des accords — le dire franchement si la question vient. Ce qui compte est la cohérence avec le positionnement, pas le nom. Les trois visuels défilent à la flèche : c'est au troisième seulement qu'on passe à la slide suivante.",
  },
  {
    id: "etat",
    label: "Ce qui existe déjà",
    act: "preuves",
    seconds: 70,
    speakerNotes:
      "QUESTION : est-ce construit, ou est-ce une idée ? La slide est une preuve, pas un calendrier. Assumer franchement ce qui est suspendu et pourquoi : on ralentit pour fiabiliser avant de changer d'échelle. Un jury préfère une suspension expliquée à une progression floue.",
  },
  {
    id: "acquisition",
    label: "Nos canaux d'acquisition",
    act: "preuves",
    seconds: 50,
    tone: "dark",
    speakerNotes:
      "QUESTION : par où le lecteur arrive-t-il ? Aller là où il est déjà plutôt que d'attendre qu'il vienne. La boucle se referme : le format court amène sur le site, le site nourrit le format court. C'est aussi ce qui rend le modèle sans paywall tenable.",
  },
  /* ── ACTE VII — LE MODÈLE ÉCONOMIQUE ─────────────────────────────────── */
  {
    id: "modele",
    label: "Le modèle",
    act: "business",
    seconds: 50,
    speakerNotes:
      "QUESTION : comment ce média gagne-t-il de l'argent ? Une phrase par moteur, pas plus. Le point qui compte : pas de paywall. L'audience est la recette, donc tout ce qui augmente l'audience augmente directement le potentiel.",
  },
  {
    id: "previsionnel",
    label: "Prévision d'audience",
    act: "business",
    seconds: 50,
    speakerNotes:
      "QUESTION : jusqu'où cette audience peut-elle aller ? Trois leviers, pas une extrapolation : la reprise du pipeline, la profondeur de catalogue, la distribution sociale. Assumer que c'est une cible conditionnée à la refonte, pas une projection statistique — la note le dit, la voix doit le confirmer.",
  },
  {
    id: "trajectoire",
    label: "La trajectoire",
    act: "business",
    seconds: 60,
    speakerNotes:
      "QUESTION : est-ce que ça devient viable ? Dernière slide avant la demande : c'est elle qui doit rester à l'écran dans la tête du jury quand arrive le besoin de financement. La courbe se dessine année après année. Deux chiffres à laisser à l'écran : rentabilité projetée en année 2, et le résultat net de l'année 2. Si le jury conteste, assumer que ce sont des projections du business plan et proposer l'annexe détaillée (touche A).",
  },
  {
    id: "financement",
    label: "Le financement",
    act: "business",
    seconds: 55,
    speakerNotes:
      "QUESTION : que débloquent 27 500 € ? Ne pas présenter un besoin, présenter un déblocage. La répartition d'abord, le jalon ensuite. Le financement participatif en capital est aussi un canal de notoriété : c'est un argument, pas un pis-aller.",
  },
  {
    id: "chaine",
    label: "Une chaîne, plusieurs marchés",
    act: "business",
    seconds: 55,
    tone: "dark",
    speakerNotes:
      "QUESTION : jusqu'où ça peut aller ? La géopolitique n'est pas la limite du projet, c'est son premier terrain de validation. Ce qui se réplique, c'est la chaîne — sources, data, recoupement, structuration, visualisation, distribution. Seuls le panel et l'audience changent.",
  },
  /* ── ACTE VIII — CONCLUSION ──────────────────────────────────────────── */
  {
    id: "conclusion",
    label: "Conclusion",
    act: "conclusion",
    seconds: 45,
    tone: "dark",
    speakerNotes:
      "QUESTION : que me demandez-vous ? Deux demandes, pas dix : mentorat et accompagnement stratégique. N'introduire aucune idée neuve ici. Laisser la signature à l'écran et se taire.",
  },
] as const;

export const S4_TOTAL_SECONDS = S4_SLIDES.reduce((n, s) => n + s.seconds, 0);

/* ═══════════════════════════════════════════════════════════════════════════
   ACTE I — LE PROBLÈME
   ═══════════════════════════════════════════════════════════════════════════ */

/** 01 — Couverture. La V2 n'affichait pas la signature ; la V4 la pose ici. */
export const S4_COVER = {
  context: "Soutenance de business plan",
} as const;

/* 02 — LE PARADOXE
   Presque une affiche. Trois temps : la première phrase, la charnière, la
   seconde. C'est le contraste qui installe la tension — pas le volume de
   texte, qui est ici volontairement dérisoire. */
export const S4_PARADOX = {
  eyebrow: "Le paradoxe",
  first: "Nous n'avons jamais eu autant d'informations.",
  hinge: "Et pourtant…",
  second: "Comprendre demande toujours autant de travail.",
} as const;

/* 02 bis — CE QUE L'ON VOIT VRAIMENT

   Une prise de recul, avant d'entrer dans le problème de recoupement. Elle ne
   présente rien : elle installe l'idée que l'information disponible et
   l'information qui nous parvient ne sont pas la même chose.

   La question sur la Chine est une accroche, pas une preuve, et les notes du
   présentateur le disent explicitement — un jury qui la prendrait pour une
   statistique aurait raison de la contester. */
export const S4_ATTENTION = {
  eyebrow: "Ce que l'on voit vraiment",
  question: "Pouvez-vous citer trois personnalités chinoises vivantes ?",
  /* Trois constats, pas un argument : la disproportion parle d'elle-même. */
  facts: [
    "Deuxième économie mondiale.",
    "Une puissance technologique majeure.",
    "Et pourtant, une connaissance très partielle de ce qui s'y passe.",
  ],
  cloudLabel: "Ce qui occupe l'attention",
  /* Ce qui prend la place. L'ordre est celui de l'apparition, du plus banal au
     plus invisible : on commence par ce que chacun reconnaît, on finit par ce
     que personne ne voit agir. */
  cloud: [
    "Réseaux sociaux",
    "Fil d'actualité",
    "Notifications",
    "Vidéos courtes",
    "Alertes",
    "Recommandations",
    "Chaînes d'information",
    "Algorithmes",
  ],
  /* La seconde ligne disait deux fois la première. Celle-ci nomme le
     responsable — le tri — et amène la slide suivante, où c'est au lecteur de
     le faire lui-même. */
  statement: [
    "Le problème n'est pas le manque d'information.",
    "C'est le tri que d'autres font à notre place.",
  ],
} as const;

/* 03 — LE TRAVAIL INVISIBLE DU LECTEUR
   L'idée arrivait en slide 18 en V2, alors qu'elle est le point de départ.
   Le centre de la composition est LE LECTEUR : c'est lui qui reçoit tout et
   qui doit tout relier. À l'acte V, la même image reviendra avec The Essential
   Data au centre — c'est le même dessin, retourné, et c'est voulu. */
export const S4_READER_WORK = {
  eyebrow: "Le travail invisible",
  title: [
    "Un travail long et fastidieux",
    "pour le lecteur.",
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
  /* Ce que ce travail lui coûte, en deux mots plutôt qu'en six verbes. La
     liste des gestes décrivait une méthode ; ces deux-là nomment le prix, et
     c'est le prix qui fait le problème. */
  operations: ["Transparence", "Temps"],
  statement: ["L'information existe.", "Le travail de recoupement reste à sa charge."],
} as const;

/* 05 — LA RÉPONSE
   Le produit apparaît comme conséquence des quatre slides précédentes, pas
   comme une annonce. Rien sur le modèle, rien sur l'IA, rien sur la
   fabrication : uniquement ce que le lecteur obtient. */
export const S4_ANSWER = {
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

/* 07 — TROIS PROFONDEURS DE LECTURE
   La proposition de valeur centrale, remontée de la slide 23 de la V2. Un
   exemple tenu de bout en bout vaut mieux qu'une explication du format. */
export const S4_DEPTH = {
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

/* ═══════════════════════════════════════════════════════════════════════════
   ACTE III — POURQUOI IL Y A UNE PLACE
   ═══════════════════════════════════════════════════════════════════════════ */

/* 11 — LE POSITIONNEMENT
   Quatre familles, chacune bonne dans son métier. Aucune ne réunit les quatre
   gestes. La place n'est pas « mieux que » : elle est à l'intersection. */
export const S4_POSITIONING = {
  eyebrow: "Le positionnement",
  title: ["Nous ne remplaçons personne.", "Nous assemblons ce qui existe séparément."],
  families: [
    { id: "medias", label: "Médias", body: "Le récit, l'actualité, la mise en perspective." },
    { id: "data", label: "Data et statistiques", body: "Le chiffre brut, l'autorité de la source." },
    { id: "moteurs", label: "Moteurs et IA", body: "La réponse immédiate à une question posée." },
    { id: "pure", label: "Format long, enquête chiffrée", body: "Le dossier fouillé, publié loin de l'actualité." },
  ],
  /** Les quatre gestes qui définissent l'intersection. */
  axes: ["Data", "Éditorial", "Comparaison", "Exploration"],
  statement: "The Essential Data ne remplace pas ces acteurs. Il assemble ce qu'ils proposent séparément.",
} as const;

/* 12 — LA BASCULE
   L'IA est ici, et seulement ici, un canal de distribution. Ni agents, ni
   production, ni automatisation : cela vient à l'acte V. Les mélanger était
   le principal défaut narratif de la V2. */
export const S4_SHIFT = {
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
export const S4_CHANNEL = {
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
export const S4_SPLIT = {
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
export const S4_ECONOMICS = {
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
export const S4_TRACE = {
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
   La V2 présentait un besoin. La V4 présente un résultat. Le jalon exact
   n'est pas encore arrêté : il reste un emplacement, pas une invention. */
export const S4_UNLOCK = {
  milestoneLabel: "Ce que cela permet d'atteindre",
  milestone: A_COMPLETER,
  milestoneNote: "Jalon à arrêter : volume de publication visé, ou date de relance.",
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   AUDIENCE, BENCHMARK ET PRÉVISIONNEL

   Repris de la soutenance V1, avec les montants relevés sur la période
   septembre 2024 → août 2025. La pastille « données de démonstration » et la
   note sur l'acquisition mise en retrait sont retirées : les chiffres sont
   ceux du site, ils n'ont pas à s'excuser.
   ═══════════════════════════════════════════════════════════════════════════ */

/* Qui occupe le terrain, en France. Les deux dernieres lignes se comptent en
   abonnes et non en visites : la colonne est nommee en consequence, sinon on
   compare deux choses differentes. Les sites generes par IA sont une categorie
   d'acteurs, pas un titre : ils restent hors tableau, en note. */
export const S4_PLAYERS = {
  columns: ["Titre", "Audience / abonnés", "Modèle d'accès", "Chiffre d'affaires"],
  rows: [
    { name: "Le Figaro", visits: "240 M", model: "Mixte", revenue: "579 M€" },
    { name: "Le Monde", visits: "181 M", model: "Mixte / abonnement", revenue: "309,5 M€" },
    { name: "Les Échos", visits: "33 M", model: "Abonnement", revenue: "96 M€" },
    { name: "Mediapart", visits: "260 000 abonnés", model: "Abonnement intégral", revenue: "28 M€" },
    { name: "Courrier International", visits: "≈ 5 M", model: "Abonnement / payant", revenue: "21 M€" },
    { name: "Basta!", visits: "100 000 abonnés dont 30 000 payants", model: "Indépendant / dons‑abonnements", revenue: "N/D" },
  ],
  note: "Concurrence émergente : les sites générés par IA touchent au total 14 à 16 M d'internautes français par mois (2026).",
} as const;

export const S4_AUDIENCE = {
  eyebrow: "L'audience",
  title: ["Où en est l'audience."],
  periode: "Septembre 2024 → août 2025",
  hero: { value: "8 400", label: "Visiteurs / mois" },
  /* Courbe des douze derniers mois sous le chiffre héros. À recaler sur
     l'export analytics : seul le point d'arrivée (8 400) est relevé. */
  heroSeries: [5200, 5900, 6400, 7100, 7800, 9200, 10400, 9800, 8900, 8200, 8100, 8400],
  heroTrend: "12 derniers mois",
  stats: [
    { label: "Pages vues / mois", value: "15 000" },
    { label: "Articles publiés", value: "40" },
    { label: "Durée moyenne", value: "2 min 40 s" },
    { label: "Partenariats", value: "0" },
  ],
} as const;

/* Où nous nous situons, sous la matrice de couverture. L'ordre de grandeur
   est le propos : une petite structure sur un marché qui se compte en
   millions de visites. Le multiplicateur est calculé, pas écrit. */
export const S4_BENCHMARK = {
  /* Libellé, unité et source tiennent ensemble : la matrice de couverture
     occupe déjà la scène, et le bandeau doit tenir sur une seule ligne. */
  label: "Où nous nous situons · visites / mois · SimilarWeb",
  eyebrow: "Benchmark",
  headline: "Où nous nous situons.",
  unit: "visites / mois",
  source: "SimilarWeb · estimation",
  caption: "Un marché qui se compte en millions de visites par mois : c'est la place qu'une petite structure peut venir prendre.",
  rows: [
    { name: "Statista", visits: 9_100_000, us: false },
    { name: "Our World in Data", visits: 4_200_000, us: false },
    { name: "Visual Capitalist", visits: 1_800_000, us: false },
    { name: "Les Décodeurs", visits: 950_000, us: false },
    { name: "The Essential Data", visits: 8_400, us: true },
  ],
} as const;

export const S4_TRAJECTORY = {
  eyebrow: "Prévisionnel",
  title: ["Prévision d'audience."],
  unit: "visiteurs par mois",
  points: [
    { label: "Aujourd'hui", value: 8_400, state: "actual" as const },
    { label: "Fin d'année", value: 45_000, state: "target" as const },
    { label: "Année + 1", value: 140_000, state: "target" as const },
    { label: "Année + 2", value: 320_000, state: "target" as const },
  ],
  levers: [
    { index: "01", title: "Réactivation du pipeline", body: "Reprise de la publication et de l'actualisation automatisées une fois la nouvelle architecture fiabilisée." },
    { index: "02", title: "SEO et profondeur de catalogue", body: "Chaque sujet couvert reste indexé et continue d'attirer du trafic bien après sa publication." },
    { index: "03", title: "Distribution sociale", body: "Les visualisations sont nativement partageables : elles circulent sans dépendre du seul référencement." },
  ],
  note: "Trajectoire cible conditionnée à la livraison de la refonte, et non projection statistique.",
} as const;

/* Ce qu'il faut vendre pour que la ligne « partenariats » du plan tienne.
   Sept mille cinq cents euros le partenariat n'est pas un montant qu'un
   annonceur signe à ce stade ; à cinq cents, il faut en faire vingt. */
export const S4_PARTNER_TARGET = {
  label: "Ce que cela suppose",
  count: "20",
  countLabel: "partenariats par an",
  price: "500 €",
  priceLabel: "par partenariat",
  note: "Montants à recaler sur le business plan définitif.",
} as const;
