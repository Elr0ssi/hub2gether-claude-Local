import type { TimelineEntry } from "@/types";

export const OTTOMAN_TIMELINE: TimelineEntry[] = [
  {
    year: 1299,
    label: "Principauté fondatrice",
    slug: "1299",
    era: "Fondation",
    description:
      "Osman Ier fonde la principauté ottomane dans le nord-ouest de l'Anatolie, autour de la ville de Söğüt. Petit État frontalier de l'Empire byzantin déclinant, les Ottomans bénéficient du vide de pouvoir laissé par l'effondrement du sultanat seldjoukide de Roum. Leur position stratégique près de Constantinople leur offre des opportunités d'expansion uniques.",
    analysis:
      "Les premiers Ottomans étaient des ghazis — guerriers sacrés combattant pour l'Islam aux marges du monde byzantin. Leur succès initial tenait moins à la force militaire brute qu'à leur capacité à attirer des guerriers de toute l'Anatolie avec la promesse de butin et de terres dans les territoires byzantins affaiblis.",
    geojsonFile: "/geojson/ottoman/1299.json",
    stats: {
      areaSqKm: 16_000,
      populationEstimate: 200_000,
      capitalCity: "Söğüt",
      politicalSystem: "Principauté / Beylik",
      keyFacts: [
        "Osman Ier proclame l'indépendance des Seldjoukides vers 1299",
        "Territoire limité à la région de Söğüt/Bilecik en Anatolie",
        "Position stratégique face aux frontières byzantines affaiblies",
        "Politique d'intégration des populations locales chrétiennes",
      ],
    },
  },
  {
    year: 1453,
    label: "Chute de Constantinople",
    slug: "1453",
    era: "Mehmed II le Conquérant",
    description:
      "Mehmed II conquiert Constantinople le 29 mai 1453 après un siège de 53 jours. La chute de la 'Nouvelle Rome' marque la fin de l'Empire byzantin et l'avènement des Ottomans comme puissance impériale majeure. Renommée Istanbul, la ville devient la nouvelle capitale ottomane. À ce stade, l'empire contrôle toute l'Anatolie, les Balkans jusqu'au Danube, et une grande partie de la Grèce.",
    analysis:
      "La prise de Constantinople n'était pas seulement une victoire militaire mais une transformation symbolique : les Ottomans se réclamaient désormais héritiers de la tradition romaine (et byzantine). Mehmed II se fit appeler 'Kaiser-i Rum' (César de Rome) et s'entoura de savants grecs. Istanbul devint l'une des plus grandes villes du monde en moins d'une génération.",
    geojsonFile: "/geojson/ottoman/1453.json",
    stats: {
      areaSqKm: 700_000,
      populationEstimate: 8_000_000,
      capitalCity: "Constantinople / Istanbul",
      politicalSystem: "Sultanat ottoman",
      keyFacts: [
        "Constantinople tombe le 29 mai 1453 après 53 jours de siège",
        "Fin de l'Empire byzantin — plus de 1 000 ans d'histoire",
        "L'empire contrôle les Balkans, l'Anatolie, la mer Noire",
        "Mehmed II se proclame 'César de Rome'",
      ],
    },
  },
  {
    year: 1520,
    label: "Sélim Ier — Égypte et Levant",
    slug: "1520",
    era: "Expansion sous Sélim Ier",
    description:
      "Sélim Ier ('le Redoutable') réalise en 8 ans l'expansion la plus rapide de l'histoire ottomane. Il bat les Safavides à Tchaldiran (1514), conquiert la Syrie et l'Égypte mamelouke (1516–1517), et s'empare des villes saintes de La Mecque et Médine — prenant le titre de Calife de l'Islam sunnite. L'empire s'étend désormais de l'Algérie à l'Irak.",
    analysis:
      "La conquête de l'Égypte en 1517 fut le moment où les Ottomans devinrent une puissance mondiale. Le contrôle du commerce épicier entre l'Asie et l'Europe, transitant par Alexandrie, représentait une manne économique considérable. Ironiquement, cette conquête coïncida presque exactement avec la circumnavigation de Vasco de Gama qui allait contourner cette domination.",
    geojsonFile: "/geojson/ottoman/1520.json",
    stats: {
      areaSqKm: 2_500_000,
      populationEstimate: 25_000_000,
      capitalCity: "Istanbul",
      politicalSystem: "Sultanat-Califat",
      keyFacts: [
        "Victoire de Tchaldiran (1514) contre les Safavides",
        "Conquête de l'Égypte et du Levant (1516–1517)",
        "Prise du Califat — gardien de La Mecque et Médine",
        "Contrôle des routes commerciales entre Europe et Asie",
      ],
    },
  },
  {
    year: 1566,
    label: "Apogée — Soliman le Magnifique",
    slug: "1566",
    era: "Le Siècle de Soliman",
    description:
      "Sous Soliman Ier, l'Empire ottoman atteint son étendue maximale et sa gloire culturelle. De la Hongrie (prise de Buda 1541) à l'Yémen, de l'Algérie à la Mésopotamie, l'empire couvre 5,2 millions de km². La Méditerranée orientale est un lac ottoman. Les flottes ottomanes défient les Espagnols en Méditerranée et les Portugais dans l'Océan Indien.",
    analysis:
      "Le règne de Soliman représente la synthèse unique d'expansionnisme militaire et de sophistication culturelle. Connu en Europe comme 'le Magnifique', il était surnommé 'le Législateur' dans son propre empire pour la codification de la loi ottomane. Son architecte Mimar Sinan construisit plus de 300 édifices dont la mosquée Süleymaniye d'Istanbul — sommet de l'architecture islamique.",
    geojsonFile: "/geojson/ottoman/1566.json",
    stats: {
      areaSqKm: 5_200_000,
      populationEstimate: 30_000_000,
      capitalCity: "Istanbul",
      politicalSystem: "Sultanat ottoman",
      keyFacts: [
        "Buda conquise en 1541 — Hongrie ottomane pendant 150 ans",
        "Siège de Vienne (1529) — limite nord-ouest de l'expansion",
        "Maîtrise totale de la Méditerranée orientale",
        "Soliman meurt au siège de Szigetvár (Hongrie) en 1566",
      ],
    },
  },
  {
    year: 1699,
    label: "Traité de Karlowitz",
    slug: "1699",
    era: "Début du déclin",
    description:
      "Le Traité de Karlowitz (1699) marque le premier grand repli ottoman. La défaite lors du second siège de Vienne (1683), suivie de la guerre contre la Sainte Ligue, force les Ottomans à céder la Hongrie aux Habsbourg, la Podolie à la Pologne et la Morée (Péloponnèse) à Venise. C'est la première fois depuis des siècles que l'empire perd massivement du territoire.",
    analysis:
      "Le second siège de Vienne (1683) est souvent cité comme le tournant de la puissance ottomane. La Grande Vizir Kara Mustafa paria tout sur une victoire rapide — mais l'arrivée de Jan III Sobieski avec 30 000 cavaliers polonais brisa le siège en quelques heures. Cette défaite révéla que la machine militaire ottomane ne s'était pas adaptée aux nouvelles tactiques d'artillerie européennes.",
    geojsonFile: "/geojson/ottoman/1699.json",
    stats: {
      areaSqKm: 3_800_000,
      populationEstimate: 25_000_000,
      capitalCity: "Istanbul",
      politicalSystem: "Sultanat ottoman (déclin)",
      keyFacts: [
        "Cession de la Hongrie aux Habsbourg (1699)",
        "Défaite au siège de Vienne (1683) — tournant stratégique",
        "Perte de la Morée (Péloponnèse) à Venise",
        "Début d'un siècle de pression européenne croissante",
      ],
    },
  },
  {
    year: 1914,
    label: "Veille de la Première Guerre mondiale",
    slug: "1914",
    era: "Empire ottoman tardif",
    description:
      "À la veille de la Première Guerre mondiale, l'empire a perdu la quasi-totalité de ses possessions européennes (guerres balkaniques 1912–1913), la Libye (prise par l'Italie en 1912), et les zones côtières d'Afrique du Nord. Il conserve l'Anatolie, la Mésopotamie (Irak), la Syrie, la Palestine et une partie de la péninsule arabique. Surnommé 'l'homme malade de l'Europe', l'empire rejoindra les Puissances centrales.",
    analysis:
      "En 1914, l'Empire ottoman était déjà terminé en termes de puissance européenne, mais les Jeunes-Turcs qui le gouvernaient nourrissaient l'ambition d'un renouveau turcophone pan-asiatique. Leur choix de s'allier à l'Allemagne allait sceller le sort de l'empire : le démembrement par les traités de Sèvres (1920) et de Lausanne (1923) créerait la Turquie moderne.",
    geojsonFile: "/geojson/ottoman/1914.json",
    stats: {
      areaSqKm: 1_800_000,
      populationEstimate: 20_000_000,
      capitalCity: "Istanbul",
      politicalSystem: "Sultanat constitutionnel (Jeunes-Turcs)",
      keyFacts: [
        "Guerres balkaniques (1912–1913) : perte de la quasi-totalité des Balkans",
        "Libye perdue face à l'Italie en 1912",
        "Alliance avec l'Allemagne en 1914",
        "Génocide arménien (1915–1916) dans le contexte de la guerre",
      ],
    },
  },
];
