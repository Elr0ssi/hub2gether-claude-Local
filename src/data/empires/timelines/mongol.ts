import type { TimelineEntry } from "@/types";

export const MONGOL_TIMELINE: TimelineEntry[] = [
  {
    year: 1206,
    label: "Fondation",
    slug: "1206",
    era: "Règne de Gengis Khan",
    description:
      "Temüjin unifie les tribus nomades de la steppe mongole et est proclamé Gengis Khan — 'Souverain universel' — lors d'un grand kurultai. Partant d'un territoire restreint sur le plateau mongol, il forge une machine militaire sans précédent fondée sur la mobilité à cheval, la discipline absolue et une tactique de terreur psychologique.",
    analysis:
      "L'unification mongole de 1206 ne fut pas simplement une victoire militaire — ce fut une révolution organisationnelle. Gengis Khan abolit les loyautés tribales au profit d'une hiérarchie méritocratique, créant la première armée véritablement professionnelle de l'Asie centrale. Sa force de frappe : des cavaliers capables de parcourir 150 km par jour.",
    geojsonFile: "/geojson/mongol/1206.json",
    stats: {
      areaSqKm: 1_500_000,
      populationEstimate: 2_000_000,
      capitalCity: "Karakorum",
      politicalSystem: "Khanat mongol",
      keyFacts: [
        "Gengis Khan proclamé souverain universel en 1206",
        "Unification des tribus : Merkits, Naimans, Tatars, Kéraïts",
        "Création d'un code de lois (Yassa) unique",
        "Armée de 100 000 cavaliers d'élite",
      ],
    },
  },
  {
    year: 1227,
    label: "Mort de Gengis Khan",
    slug: "1227",
    era: "Apogée de Gengis Khan",
    description:
      "À sa mort, Gengis Khan a conquis la Chine du Nord (Dynasties Jurchen Jin), l'Asie centrale (Empire khwarezmien), la Perse du Nord et pénétré jusqu'en Russie et en Pologne. En deux décennies de campagnes, il a détruit Samarkand, Bagdad (non encore), et remodelé l'Eurasie. Son empire s'étend de la mer de Chine orientale aux rives de la Caspienne.",
    analysis:
      "La conquête de l'Empire khwarezmien (1219–1221) illustre le génie militaire mongol : une campagne sur plusieurs fronts avec des forces convergeant sur des milliers de kilomètres. La destruction de Samarkand, centre culturel de l'Islam, et de Merv — jadis la plus grande ville du monde — annonça une brutalité calculée destinée à paralyser la résistance future.",
    geojsonFile: "/geojson/mongol/1227.json",
    stats: {
      areaSqKm: 12_000_000,
      populationEstimate: 100_000_000,
      capitalCity: "Karakorum",
      politicalSystem: "Khanat mongol",
      keyFacts: [
        "Chine du Nord conquise (Dynasties Liao, Xi Xia, Jin)",
        "Empire khwarezmien anéanti en 1221",
        "Raids jusqu'en Pologne et Hongrie",
        "12 millions de km² à la mort de Gengis Khan en 1227",
      ],
    },
  },
  {
    year: 1260,
    label: "Kublai Khan — Division",
    slug: "1260",
    era: "Fragmentation en Khanats",
    description:
      "L'empire est à son maximum théorique mais commence à se fragmenter en quatre grands khanats : la Horde d'Or (Russie/Ukraine), le Khanat de Chagatai (Asie centrale), l'Ilkhanat (Perse/Irak) et la Chine sous Kublai Khan. La défaite à Aïn Djalout (1260) contre les Mamelouks d'Égypte marque la première grande victoire contre les Mongols — et la limite de leur expansion vers l'Ouest.",
    analysis:
      "La bataille d'Aïn Djalout en 1260 est l'un des tournants de l'histoire mondiale. Les Mamelouks brisèrent l'aura d'invincibilité mongole et sauvèrent l'Égypte, l'Afrique du Nord et peut-être l'ensemble de l'Europe islamique d'une conquête mongole. Simultanément, les guerres civiles entre prétendants au trône divisèrent irrémédiablement l'empire unifié.",
    geojsonFile: "/geojson/mongol/1260.json",
    stats: {
      areaSqKm: 21_000_000,
      populationEstimate: 200_000_000,
      capitalCity: "Karakorum / Khanbaliq (Pékin)",
      politicalSystem: "Khanats divisés",
      keyFacts: [
        "Division en quatre grands khanats semi-autonomes",
        "Défaite d'Aïn Djalout (1260) — fin de l'expansion vers l'Ouest",
        "Kublai Khan fonde la Dynastie Yuan en Chine",
        "Routes commerciales ('Route de la Soie') contrôlées par les Mongols",
      ],
    },
  },
  {
    year: 1279,
    label: "Extension maximale",
    slug: "1279",
    era: "Dynsatie Yuan — Kublai Khan",
    description:
      "Kublai Khan achève la conquête de la Chine du Sud (Dynastie Song) en 1279, portant l'Empire mongol à son étendue maximale : 24 millions de kilomètres carrés, soit environ 22% des terres émergées — le plus grand empire contigu de l'histoire humaine. De la Corée à la Pologne, de la Sibérie au Vietnam, un quart de la population mondiale vit sous domination mongole.",
    analysis:
      "L'empire de 1279 représente l'apogée de ce que des cavaliers nomades pouvaient accomplir contre des civilisations sédentaires. Mais sa taille même était sa faiblesse : impossible à gouverner efficacement depuis Karakoum ou Pékin. Les khanats devinrent rapidement culturellement assimilés par leurs sujets — les Ilkhans se convertirent à l'Islam, les Yuan adoptèrent la culture chinoise.",
    geojsonFile: "/geojson/mongol/1279.json",
    stats: {
      areaSqKm: 24_000_000,
      populationEstimate: 200_000_000,
      capitalCity: "Khanbaliq (Pékin)",
      politicalSystem: "Quatre Khanats",
      keyFacts: [
        "24 millions de km² — le plus grand empire contigu de l'histoire",
        "Conquête de la Chine du Sud (Dynastie Song) achevée en 1279",
        "Commerce prospère sur la Route de la Soie : Marco Polo visite en 1275",
        "Tentatives infructueuses de conquête du Japon (1274, 1281) et du Vietnam",
      ],
    },
  },
  {
    year: 1335,
    label: "Fragmentation des Khanats",
    slug: "1335",
    era: "Déclin progressif",
    description:
      "L'Ilkhanat (Perse) s'effondre en 1335 sans successeur. La Horde d'Or est secouée par des guerres civiles. Seuls le Khanat de Chagatai et la Chine Yuan maintiennent une certaine cohérence. La Peste Noire (1347–1353), transmise le long des routes mongoles, ravagera simultanément les empires et leurs sujets — ultime legs des routes commerciales mongoles.",
    analysis:
      "L'effondrement de l'empire mongol illustre un paradoxe historique : les Mongols créèrent les conditions de leur propre déclin en favorisant le commerce intercontinental. Les routes qui transportaient la soie et les épices transportèrent aussi la Yersinia pestis. La Peste Noire tua entre 30 et 60% de la population eurasienne — dont de nombreux soldats mongols.",
    geojsonFile: "/geojson/mongol/1335.json",
    stats: {
      areaSqKm: 18_000_000,
      populationEstimate: 150_000_000,
      capitalCity: "Khanbaliq / Sarai / Samarkand",
      politicalSystem: "Khanats fragmentés",
      keyFacts: [
        "Ilkhanat de Perse dissout en 1335",
        "La Horde d'Or affaiblie par guerres civiles et épidémies",
        "Routes commerciales encore actives — Marco Polo rentre en 1295",
        "Émergence de Tamerlan (Timur) comme successeur potentiel",
      ],
    },
  },
  {
    year: 1368,
    label: "Chute de la Chine (Ming)",
    slug: "1368",
    era: "Fin de la Dynastie Yuan",
    description:
      "La Dynastie Ming chasse les Mongols de Chine en 1368 — la pièce maîtresse de l'empire. Zhu Yuanzhang fonde la Chine des Ming depuis Nankin. Les Mongols se replient dans leurs steppes ancestrales. La Horde d'Or contrôle encore les steppes russes, et le Khanat de Chagatai maintient l'Asie centrale, mais l'empire unifié n'existe plus.",
    analysis:
      "La chute de la Chine Yuan en 1368 est moins une défaite militaire qu'un effondrement de légitimité. Les Mongols n'avaient jamais cessé d'être perçus comme des étrangers en Chine malgré un siècle de règne. La Chine des Ming construisit immédiatement la Grande Muraille dans sa version définitive — symbole durable de la menace que les steppes représentaient pour l'Asie sédentaire.",
    geojsonFile: "/geojson/mongol/1368.json",
    stats: {
      areaSqKm: 8_000_000,
      populationEstimate: 50_000_000,
      capitalCity: "Karakoum (retraite) / Sarai",
      politicalSystem: "Khanats résiduels",
      keyFacts: [
        "Chine reprise par la Dynastie Ming en 1368",
        "Les Mongols retournent dans les steppes de Mongolie",
        "Horde d'Or détruite par Tamerlan en 1395–1396",
        "Khanat de Crimée survit jusqu'en 1783 sous suzeraineté ottomane",
      ],
    },
  },
];
