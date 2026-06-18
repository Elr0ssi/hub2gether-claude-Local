import type { Article } from "@/types";

export const EPIDEMICS_ARTICLES: Article[] = [
  {
    slug: "hmpv-2025-nouveau-virus-chine-monde",
    title: "HMPV 2025 : le Métapneumovirus humain, le nouveau virus à surveiller",
    excerpt:
      "Début 2025, la Chine enregistrait une forte hausse des hospitalisations liées au hMPV. Ce virus respiratoire, cousin du VRS, circule mondialement. Faut-il craindre une nouvelle pandémie ?",
    theme: "epidemics",
    publishedAt: "2025-03-15",
    readingTime: 8,
    tags: ["HMPV 2025", "Métapneumovirus", "Chine", "Virus respiratoire", "OMS"],
    featured: true,
    heroImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/2019-nCoV-CDC-23312.png/1280px-2019-nCoV-CDC-23312.png",
    heroCaption: "Illustration d'un virus à enveloppe ARN (CDC). Le hMPV appartient à la même famille que le VRS.",
    body: [
      {
        type: "lead",
        content:
          "En janvier 2025, les hôpitaux pédiatriques de plusieurs grandes villes chinoises — Pékin, Shanghai, Guangzhou — signalaient une hausse inhabituelle des hospitalisations pour infections respiratoires aiguës. Le coupable identifié : le Métapneumovirus humain (hMPV), un virus connu depuis 2001, mais jamais aussi médiatisé. Cousin du Virus Respiratoire Syncytial (VRS), le hMPV provoque des bronchiolites, pneumonies et syndromes pseudo-grippaux. Il ne représente pas une menace pandémique comparable au SARS-CoV-2, mais son émergence dans un contexte de surveillance renforcée post-COVID a justifié une attention mondiale.",
      },
      {
        type: "stats",
        items: [
          { value: "2001", label: "Découverte du hMPV", note: "Par des chercheurs néerlandais" },
          { value: "15–20%", label: "Infections respiratoires", note: "Causées par hMPV chez enfants" },
          { value: "200M+", label: "Cas estimés/an", note: "Toutes formes, monde entier" },
          { value: "~160 000", label: "Décès annuels", note: "Enfants <5 ans (OMS estimation)" },
        ],
      },
      {
        type: "text",
        heading: "Pourquoi ce regain d'activité en 2025 ?",
        content:
          "Plusieurs facteurs expliquent la résurgence du hMPV début 2025. D'abord, la dette immunitaire accumulée pendant les années COVID : le port du masque et les confinements de 2020–2022 ont réduit la circulation de tous les virus respiratoires, créant des cohortes d'enfants en bas âge sans immunité préalable. Ensuite, le relâchement des mesures barrières et la reprise des déplacements internationaux ont permis une circulation accélérée. Enfin, les systèmes de surveillance renforcés post-COVID ont simplement mieux détecté un virus qui circulait probablement sans bruit depuis des années.",
      },
      {
        type: "carousel",
        title: "Pays les plus touchés par le hMPV en 2025",
        items: [
          { name: "Chine", emoji: "🇨🇳", detail: "Épicentre jan.-fév. 2025", subdetail: "Hausse marquée hospitalisations pédiatriques. Enfants <5 ans et plus de 65 ans principalement affectés." },
          { name: "Inde", emoji: "🇮🇳", detail: "Forte circulation", subdetail: "Densité de population et système de santé sous tension amplifient l'impact. Saison froide dans le nord." },
          { name: "États-Unis", emoji: "🇺🇸", detail: "Surveillance CDC active", subdetail: "Pics hivernaux en jan.-mars 2025. Hospitalisations en hausse chez nourrissons et immunodéprimés." },
          { name: "Japon", emoji: "🇯🇵", detail: "Surveillance nationale", subdetail: "Réseau Sentinelle japonais enregistre une hausse significative vs saisons précédentes." },
          { name: "France", emoji: "🇫🇷", detail: "Surveillance Santé Publique France", subdetail: "Co-circulation avec grippe et VRS, mais hMPV identifié comme contributeur aux pics pédiatriques." },
          { name: "Royaume-Uni", emoji: "🇬🇧", detail: "Alerte UKHSA", subdetail: "UK Health Security Agency a publié une alerte début 2025 suite à augmentation des détections." },
          { name: "Australie", emoji: "🇦🇺", detail: "Saison hiver austral", subdetail: "Pics attendus juin-août 2025 dans l'hémisphère Sud. Préparation des services pédiatriques en cours." },
          { name: "Brésil", emoji: "🇧🇷", detail: "Circulation en hausse", subdetail: "Amazon et régions tropicales sous surveillance OPS (Organisation Panaméricaine de la Santé)." },
        ],
      },
      {
        type: "image-text",
        heading: "Quels groupes sont les plus à risque ?",
        content:
          "Le hMPV est particulièrement dangereux pour les nourrissons de moins de 2 ans (système immunitaire immature), les personnes âgées de plus de 65 ans, et les immunodéprimés (greffés, chimiothérapie, HIV non contrôlé). Chez les personnes en bonne santé, l'infection cause généralement un rhume banal résolutif en 5–7 jours. La mortalité mondiale est estimée à environ 160 000 décès par an chez les enfants de moins de 5 ans, principalement dans les pays à revenus faibles où l'accès aux soins intensifs est limité. Aucun vaccin n'est encore disponible en 2025, bien que plusieurs candidats soient en phase 2–3 d'essais cliniques.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Pneumonia_x-ray.jpg/800px-Pneumonia_x-ray.jpg",
        imageAlt: "Radiographie pulmonaire montrant une pneumonie",
        flip: true,
      },
      {
        type: "timeline",
        title: "Chronologie du hMPV : de la découverte à 2025",
        items: [
          { date: "2001", title: "Découverte aux Pays-Bas", description: "Le Dr Bernadette van den Hoogen identifie un nouveau paramyxovirus chez des enfants hospitalisés pour infections respiratoires." },
          { date: "2002–2019", title: "Circulation silencieuse mondiale", description: "Le hMPV est reconnu comme cause majeure d'infections respiratoires basses, responsable de 5 à 10% des hospitalisations pédiatriques hivernales. Peu médiatisé." },
          { date: "2020–2022", title: "Disparition temporaire pendant COVID", description: "Les mesures barrières réduisent drastiquement la circulation de tous les virus respiratoires. Fenêtre épidémiologique artificielle." },
          { date: "2023", title: "Rebond post-COVID", description: "Première résurgence notable, notamment en Europe et aux États-Unis, attribuée à la dette immunitaire accumulée." },
          { date: "Jan. 2025", title: "Épidémie en Chine", description: "Hausse marquée des hospitalisations pédiatriques dans les grandes villes chinoises. L'OMS surveille mais ne classe pas en urgence internationale." },
          { date: "Fév.–mars 2025", title: "Propagation mondiale documentée", description: "Détections en hausse sur tous les continents. Alertes émises par CDC (USA), UKHSA (UK), Santé Publique France." },
        ],
      },
      {
        type: "highlight",
        content:
          "Le hMPV n'est pas un nouveau virus — il circule depuis au moins les années 1960. Ce qui est nouveau en 2025, c'est notre capacité à le détecter et à en parler, héritée de la surveillance épidémiologique renforcée post-COVID-19.",
      },
      {
        type: "quote",
        text: "Le hMPV est une préoccupation de santé publique, pas une urgence pandémique. Notre système de détection a progressé, ce qui explique en partie pourquoi nous le voyons mieux.",
        source: "Dr. Maria Van Kerkhove, OMS, conférence de presse, février 2025",
      },
    ],
  },
  {
    slug: "carte-epidemies-monde-comparaison-historique",
    title: "Des épidémies à travers l'histoire : ce que les cartes révèlent",
    excerpt:
      "Comparer la Peste Noire de 1347 et le COVID-19 de 2020 sur une carte, c'est mesurer 700 ans de progrès médical — et pointer les inégalités persistantes dans la réponse aux crises sanitaires.",
    theme: "epidemics",
    publishedAt: "2025-03-05",
    readingTime: 10,
    tags: ["Histoire épidémies", "COVID-19", "Peste Noire", "Cartographie", "Santé mondiale"],
    featured: false,
    body: [
      { type: "lead", content: "Chaque épidémie laisse une empreinte géographique. La Peste Noire a suivi les routes commerciales médiévales — le long des côtes méditerranéennes d'abord, remontant vers le nord par les fleuves et les axes de caravanes. Le COVID-19 a suivi les routes aériennes mondiales : Wuhan → Milan → New York → São Paulo en moins de 90 jours. Ces géographies de la maladie en disent autant sur les sociétés qui les ont vécues que sur les agents pathogènes eux-mêmes." },
      { type: "stats", items: [
        { value: "75M", label: "Morts Peste Noire", note: "1347–1353 estimé" },
        { value: "7M+", label: "Morts COVID-19", note: "Chiffre officiel OMS 2024" },
        { value: "700 ans", label: "Écart temporel", note: "Entre les deux épidémies" },
        { value: "33%", label: "Mortalité Europe Peste Noire", note: "Part de la population" },
      ]},
    ],
  },
  {
    slug: "covid-mondialisation-90-jours",
    title: "COVID-19 et mondialisation : comment le virus a fait le tour du monde en 90 jours",
    excerpt:
      "Identifié à Wuhan en décembre 2019, le SARS-CoV-2 atteignait 114 pays le 11 mars 2020 — date de la déclaration de pandémie par l'OMS. Une propagation sans précédent dans l'histoire humaine.",
    theme: "epidemics",
    publishedAt: "2025-02-10",
    readingTime: 9,
    tags: ["COVID-19", "SARS-CoV-2", "Pandémie", "Mondialisation"],
    featured: true,
    heroImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/SARS-CoV-2_without_background.png/800px-SARS-CoV-2_without_background.png",
    heroCaption: "Représentation 3D du SARS-CoV-2 (CDC / Alissa Eckert).",
    body: [
      { type: "lead", content: "Le 31 décembre 2019, les autorités chinoises informaient l'OMS d'une série de cas de pneumonies d'origine inconnue à Wuhan, Hubei. Soixante-douze jours plus tard, le 11 mars 2020, l'OMS déclarait l'état de pandémie mondiale — 114 pays touchés, plus de 118 000 cas confirmés, 4 291 décès. Jamais dans l'histoire de l'humanité moderne, un agent pathogène n'avait traversé la planète aussi vite." },
      { type: "stats", items: [
        { value: "90 jours", label: "De Wuhan au monde entier", note: "Décembre 2019 — mars 2020" },
        { value: "7M+", label: "Décès officiels OMS", note: "Cumul jusqu'en 2024" },
        { value: "774M", label: "Cas confirmés cumulés", note: "Chiffre OMS début 2024" },
        { value: "12 500 Md€", label: "Coût économique mondial", note: "FMI estimation 2020–2023" },
      ]},
      { type: "carousel", title: "Les pays les plus touchés par COVID-19", items: [
        { name: "États-Unis", emoji: "🇺🇸", detail: "103M cas · 1,1M décès", subdetail: "Première vague dévastatrice à New York (mars-avril 2020). Gestion politique fragmentée entre États." },
        { name: "Chine", emoji: "🇨🇳", detail: "99M cas · 120k décès", subdetail: "Épicentre initial. Confinement strict de Wuhan. Chiffres officiels très contestés par les épidémiologistes." },
        { name: "Inde", emoji: "🇮🇳", detail: "44M cas · 530k décès", subdetail: "Vague Delta dévastatrice (mai 2021). Pénurie d'oxygène dans les hôpitaux. Sous-comptage massif." },
        { name: "France", emoji: "🇫🇷", detail: "40M cas · 167k décès", subdetail: "Quatre vagues principales. Polémiques sur masques, confinements et pass vaccinal. 79% de vaccinés." },
        { name: "Brésil", emoji: "🇧🇷", detail: "37M cas · 702k décès", subdetail: "2e bilan mondial en décès. Gestion controversée de Bolsonaro. Variant Gamma apparu localement." },
        { name: "Allemagne", emoji: "🇩🇪", detail: "38M cas · 174k décès", subdetail: "Réponse initiale saluée (tests massifs, Robert Koch Institut). Vague Delta plus meurtrière." },
        { name: "Russie", emoji: "🇷🇺", detail: "23M cas · 385k décès", subdetail: "Excès de mortalité réel estimé à 3 fois les chiffres officiels selon les démographes." },
        { name: "Mexique", emoji: "🇲🇽", detail: "7M cas · 333k décès", subdetail: "Taux de létalité officiel parmi les plus élevés (sous-dépistage massif). Population jeune mais obèse." },
      ]},
      { type: "text", heading: "Comment la mondialisation a amplifié la vitesse de propagation", content: "En 2019, 4,5 milliards de passagers aériens ont voyagé dans le monde — contre 310 millions en 1970. Cette densité de connectivité globale est la raison pour laquelle le SARS-CoV-2 a touché tous les continents en trois mois. Les modèles épidémiologiques ont montré que même une réduction de 50% du trafic aérien n'aurait fait que ralentir la propagation de 2 à 3 semaines, sans l'empêcher. La pandémie de COVID-19 n'est pas un accident de la mondialisation — c'en est la conséquence structurelle." },
    ],
  },
  {
    slug: "peste-noire-europe-medievale",
    title: "La Peste Noire : comment une pandémie a reconfiguré l'Europe médiévale",
    excerpt:
      "Entre 1347 et 1353, la Yersinia pestis tua entre un tiers et la moitié de la population européenne. Au-delà du choc démographique, elle déclencha une révolution sociale, économique et religieuse sans précédent.",
    theme: "epidemics",
    publishedAt: "2025-02-03",
    readingTime: 12,
    tags: ["Peste Noire", "Moyen Âge", "Démographie", "Europe"],
    featured: true,
    body: [
      { type: "lead", content: "En octobre 1347, douze navires génois amarrés au port de Messine (Sicile) introduisirent en Europe occidentale la mort noire. Les marins encore vivants étaient couverts de bubons purulents. En six ans, la Yersinia pestis devait tuer entre 75 et 200 millions de personnes dans le monde connu — réduisant la population européenne d'un tiers à la moitié." },
      { type: "stats", items: [
        { value: "75–200M", label: "Morts mondiaux estimés", note: "1347–1353" },
        { value: "30–60%", label: "Population européenne tuée", note: "Selon les régions" },
        { value: "5 ans", label: "Durée de la première vague", note: "Propagation ouest-est" },
        { value: "150 ans", label: "Temps de reconstitution démo.", note: "Europe revient au niveau 1347" },
      ]},
      { type: "carousel", title: "Pays les plus touchés par la Peste Noire", items: [
        { name: "Italie", emoji: "🇮🇹", detail: "50–60% de mortalité", subdetail: "Florence perdit 60% de sa population. Les marchands italiens ont aussi involontairement facilité l'entrée du bacille par leurs réseaux commerciaux." },
        { name: "France", emoji: "🇫🇷", detail: "~40% de mortalité", subdetail: "Paris et les grandes villes particulièrement touchées. Avignon, siège papal, subit une mortalité extrême." },
        { name: "Angleterre", emoji: "🇬🇧", detail: "30–40% de mortalité", subdetail: "Arrivée en 1348. Villages entiers abandonnés. Raccourcissement dramatique de la main-d'œuvre rurale." },
        { name: "Espagne", emoji: "🇪🇸", detail: "~30% de mortalité", subdetail: "Arrivée par la côte méditerranéenne. La Reconquête ralentie temporairement par le manque d'hommes." },
        { name: "Allemagne", emoji: "🇩🇪", detail: "25–30% de mortalité", subdetail: "Pogroms contre les communautés juives accusées d'avoir empoisonné les puits — l'une des conséquences les plus tragiques." },
        { name: "Russie", emoji: "🇷🇺", detail: "Arrivée plus tardive (~1351)", subdetail: "Propagation via les routes commerciales de la Horde d'Or. Impact important mais moins documenté que pour l'Europe occidentale." },
      ]},
    ],
  },
  {
    slug: "vih-sida-afrique-subsaharienne",
    title: "VIH/SIDA : 40 ans d'épidémie et l'Afrique subsaharienne toujours en première ligne",
    excerpt:
      "L'Afrique subsaharienne concentre 67% des personnes vivant avec le VIH dans le monde. Pourquoi la géographie de cette épidémie est-elle si inégalement distribuée ?",
    theme: "epidemics",
    publishedAt: "2025-01-27",
    readingTime: 11,
    tags: ["VIH", "SIDA", "Afrique", "Santé mondiale", "ONUSIDA"],
    featured: false,
    body: [
      { type: "lead", content: "En 1981, les CDC américains décrivaient pour la première fois un mystérieux déficit immunitaire chez de jeunes homosexuels californiens. Quarante ans plus tard, le VIH a tué plus de 42 millions de personnes et 39 millions vivent encore avec le virus. L'Afrique subsaharienne, avec 67% des personnes infectées, reste l'épicentre d'une épidémie que les progrès thérapeutiques ont rendue chronique mais pas vaincue." },
      { type: "stats", items: [
        { value: "39M", label: "Personnes vivant avec le VIH", note: "ONUSIDA 2023" },
        { value: "630k", label: "Décès SIDA/an", note: "Chiffre 2023" },
        { value: "67%", label: "Cas en Afrique subsaharienne", note: "Pour 14% de la pop. mondiale" },
        { value: "29,8M", label: "Sous traitement ARV", note: "Couverture en progrès" },
      ]},
    ],
  },
  {
    slug: "hantavirus-rongeurs-vecteurs-silencieux",
    title: "Hantavirus : les rongeurs, vecteurs silencieux d'une maladie méconnue",
    excerpt:
      "Contrairement aux autres grandes épidémies, l'hantavirus ne se transmet pas d'homme à homme. Une spécificité qui explique sa géographie morcelée et les défis de sa surveillance.",
    theme: "epidemics",
    publishedAt: "2025-01-20",
    readingTime: 7,
    tags: ["Hantavirus", "Zoonose", "Rongeurs", "SPH", "FHSR"],
    featured: false,
    body: [
      { type: "lead", content: "L'hantavirus est l'une des maladies infectieuses les plus méconnues du grand public — et pourtant l'une des plus mortelles dans les régions où elle sévit. Contrairement à la grippe, au COVID-19 ou à la rougeole, il ne se transmet pas d'humain à humain. Il exige un intermédiaire : les rongeurs (mulots, campagnols, rats des champs) qui l'excrètent dans leurs urine, fèces et salive." },
      { type: "stats", items: [
        { value: "~35%", label: "Létalité SPH Amériques", note: "Syndrome pulmonaire" },
        { value: "1–15%", label: "Létalité FHSR Eurasie", note: "Selon le variant" },
        { value: "20 000+", label: "Cas annuels mondiaux", note: "Estimation OMS / CDC" },
        { value: "1993", label: "Première identification SPH", note: "Sin Nombre, Four Corners (USA)" },
      ]},
    ],
  },
  {
    slug: "epidemies-geopolitique-frontieres",
    title: "Épidémies et géopolitique : quand les pandémies reconfigurent les alliances",
    excerpt:
      "COVID-19 a révélé les fractures du système international de santé : compétition vaccinale, effondrement des chaînes d'approvisionnement, nationalisme sanitaire.",
    theme: "epidemics",
    publishedAt: "2025-01-13",
    readingTime: 10,
    tags: ["Géopolitique", "COVID-19", "Diplomatie", "OMS", "Vaccins"],
    featured: false,
    body: [
      { type: "lead", content: "La pandémie de COVID-19 a mis à nu la fragilité de la gouvernance sanitaire mondiale. Derrière les discours de solidarité internationale, la réalité a été celle de la compétition : pour les masques, les respirateurs, les vaccins. Le \"nationalisme vaccinal\" des pays riches — qui ont pré-acheté plusieurs fois leur dotation — a retardé la protection des populations vulnérables et facilité l'émergence de variants." },
      { type: "stats", items: [
        { value: "80%", label: "Doses COVID aux pays riches", note: "2021, 16% de la pop. mondiale" },
        { value: "2 Md€", label: "Budget annuel OMS", note: "Moitié du budget d'un grand hôpital US" },
        { value: "194", label: "États membres OMS", note: "Mais aucun pouvoir coercitif" },
        { value: "15%", label: "Couverture vaccinale", note: "Afrique subsaharienne fin 2021" },
      ]},
    ],
  },
  {
    slug: "inegalites-vaccinales-monde",
    title: "L'injustice vaccinale : comment les pays riches ont accaparé 80% des doses COVID",
    excerpt:
      "En 2021, les pays à hauts revenus représentant 16% de la population mondiale avaient reçu 60% des doses. Une asymétrie qui a prolongé la pandémie et alimenté l'émergence de nouveaux variants.",
    theme: "epidemics",
    publishedAt: "2025-01-06",
    readingTime: 8,
    tags: ["Vaccins", "COVID-19", "Inégalités", "COVAX", "Santé mondiale"],
    featured: false,
    body: [
      { type: "lead", content: "En décembre 2021, tandis que les pays du G7 administraient des doses de rappel à leur population, 90% des habitants des pays à faibles revenus n'avaient pas encore reçu leur première injection. Cette inégalité vaccinale sans précédent n'est pas qu'une question d'éthique : elle a des conséquences épidémiologiques directes. Les variants Delta et Omicron sont apparus dans des populations peu vaccinées, et se sont ensuite propagés mondialement." },
      { type: "stats", items: [
        { value: "60%", label: "Doses reçues par pays riches", note: "Représentant 16% de la pop." },
        { value: "15%", label: "Couverture Afrique fin 2021", note: "Vs 70%+ en Europe occidentale" },
        { value: "2 Md", label: "Doses promises via COVAX", note: "Objectif initial 2021, non atteint" },
        { value: "+1 500 Md€", label: "Coût économique des variants", note: "FMI : retards dus aux variants" },
      ]},
    ],
  },
];
