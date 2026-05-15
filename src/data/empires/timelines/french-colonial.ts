import type { TimelineEntry } from "@/types";

export const FRENCH_COLONIAL_TIMELINE: TimelineEntry[] = [
  {
    year: 1700,
    label: "Premier empire colonial — Apogée",
    slug: "1700",
    era: "Premier empire colonial (1534–1803)",
    description:
      "Au tournant du XVIIIe siècle, la France possède la Nouvelle-France (Canada), la Louisiane, les Antilles (Saint-Domingue, Martinique, Guadeloupe) et des comptoirs en Inde et en Afrique de l'Ouest. Un empire de commerce et de fourrures.",
    analysis:
      "Le premier empire colonial français est avant tout un réseau commercial. La Nouvelle-France est immense mais peu peuplée — seulement 15 000 colons en 1700. Saint-Domingue (Haïti) devient la colonie la plus profitable du monde grâce au sucre et à l'esclavage.",
    geojsonFile: "/geojson/french-colonial/1700.json",
    stats: {
      areaSqKm: 8000000,
      populationEstimate: 700000,
      capitalCity: "Paris",
      politicalSystem: "Monarchie absolue — empire colonial",
      keyFacts: [
        "Nouvelle-France : du Saint-Laurent aux Grandes Plaines",
        "Saint-Domingue (Haïti) : colonie la plus riche du monde",
        "Comptoirs en Inde : Pondichéry, Chandernagor, Karikal",
        "Sénégal : Saint-Louis du Sénégal fondé en 1659",
        "Plus de 700 000 esclaves africains dans les colonies sucrières",
      ],
    },
  },
  {
    year: 1830,
    label: "Prise d'Alger — Début du 2e empire",
    slug: "1830",
    era: "Deuxième empire colonial (1815–1962)",
    description:
      "La prise d'Alger (5 juillet 1830) marque le début du deuxième empire colonial. Après avoir perdu la plupart de ses possessions lors des guerres napoléoniennes, la France se tourne vers l'Afrique du Nord. L'Algérie deviendra une colonie de peuplement.",
    analysis:
      "La conquête de l'Algérie est présentée comme une opération de police contre la piraterie barbaresque. En réalité, Charles X cherche à redorer son blason. La conquête durera quarante ans et fera des centaines de milliers de morts parmi les Algériens.",
    geojsonFile: "/geojson/french-colonial/1830.json",
    stats: {
      areaSqKm: 1500000,
      populationEstimate: 2000000,
      capitalCity: "Paris",
      politicalSystem: "Monarchie — colonisation directe",
      keyFacts: [
        "Prise d'Alger le 5 juillet 1830 par le général de Bourmont",
        "Madagascar occupée depuis 1817 (fort Dauphin)",
        "Sénégal : base pour l'expansion ouest-africaine",
        "Guyane française : ancienne colonie conservée",
        "Martinique et Guadeloupe maintenues depuis le XVIIe siècle",
      ],
    },
  },
  {
    year: 1880,
    label: "Scramble for Africa — Expansion",
    slug: "1880",
    era: "Deuxième empire colonial",
    description:
      "La conférence de Berlin (1884–1885) organise le partage de l'Afrique. La France s'étend en Afrique de l'Ouest (Sénégal, Guinée, Côte d'Ivoire), en Indochine (Tonkin, Annam, Cochinchine, Cambodge) et en Tunisie. L'empire atteint 6 millions de km².",
    analysis:
      "Jules Ferry est l'artisan de cette expansion : en cinq ans, la France double son empire. La doctrine républicaine justifie la colonisation comme une « mission civilisatrice ». L'Indochine devient la grande ambition asiatique, voisine de la Chine.",
    geojsonFile: "/geojson/french-colonial/1880.json",
    stats: {
      areaSqKm: 6000000,
      populationEstimate: 30000000,
      capitalCity: "Paris",
      politicalSystem: "République — colonisation républicaine",
      keyFacts: [
        "Tunisie sous protectorat depuis 1881",
        "Indochine française : Cochinchine (1862), Cambodge (1863), Tonkin (1883)",
        "Afrique de l'Ouest : Sénégal, Guinée, Côte d'Ivoire, Dahomey",
        "Congo français : Brazzaville fondée en 1880 par Savorgnan de Brazza",
        "Madagascar annexée définitivement en 1896",
      ],
    },
  },
  {
    year: 1920,
    label: "Empire maximum — 13,5 millions de km²",
    slug: "1920",
    era: "Deuxième empire colonial",
    description:
      "Au lendemain de la Première Guerre mondiale, la France reçoit les mandats de la Société des Nations sur la Syrie, le Liban, le Cameroun et le Togo. L'empire atteint 13,5 millions de km² — le deuxième plus grand du monde derrière l'Empire britannique.",
    analysis:
      "L'empire colonial est présenté comme la compensation des pertes humaines colossales de 1914–1918. Mais 600 000 soldats « indigènes » ont combattu pour la France. Les contradictions entre idéaux républicains et réalité coloniale alimentent les premiers mouvements nationalistes.",
    geojsonFile: "/geojson/french-colonial/1920.json",
    stats: {
      areaSqKm: 13500000,
      populationEstimate: 110000000,
      capitalCity: "Paris",
      politicalSystem: "République — 2e plus grand empire du monde",
      keyFacts: [
        "13,5 millions de km² — 2e empire mondial derrière la Grande-Bretagne",
        "Mandats SDN : Syrie, Liban, Cameroun, Togo (1920)",
        "Afrique subsaharienne : AOF (8 territoires) + AEF (4 territoires)",
        "Maroc sous protectorat depuis 1912",
        "110 millions de sujets coloniaux, dont 600 000 ont combattu en 14-18",
      ],
    },
  },
  {
    year: 1954,
    label: "Dien Bien Phu — Le début de la fin",
    slug: "1954",
    era: "Décolonisation (1945–1962)",
    description:
      "La défaite de Dien Bien Phu (7 mai 1954) met fin à la guerre d'Indochine. La France perd sa colonie asiatique. Quatre mois plus tard éclate la guerre d'Algérie. Le vaste empire africain résiste encore mais les indépendances se succèderont dans les années 1960.",
    analysis:
      "Dien Bien Phu est un tournant mondial : pour la première fois, une puissance coloniale est militairement écrasée par un mouvement de libération nationale. Le modèle inspire les mouvements indépendantistes d'Algérie, d'Afrique, d'Asie. L'empire colonial français survivra moins de dix ans.",
    geojsonFile: "/geojson/french-colonial/1954.json",
    stats: {
      areaSqKm: 12000000,
      populationEstimate: 95000000,
      capitalCity: "Paris",
      politicalSystem: "IVe République — décolonisation en cours",
      keyFacts: [
        "Défaite de Dien Bien Phu le 7 mai 1954 face au Viet-Minh",
        "Accords de Genève : indépendance du Vietnam, Laos, Cambodge",
        "1er novembre 1954 : déclenchement de la guerre d'Algérie",
        "L'Indochine perdue ; le Maroc et la Tunisie indépendants en 1956",
        "Vague d'indépendances africaines attendue en 1960",
      ],
    },
  },
];
