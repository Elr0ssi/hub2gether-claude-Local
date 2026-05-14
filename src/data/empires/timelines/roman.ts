import type { TimelineEntry } from "@/types";

export const ROMAN_TIMELINE: TimelineEntry[] = [
  {
    year: -500,
    label: "Latium primitif",
    slug: "500bc",
    era: "Royauté / Début de la République",
    description:
      "Rome est une cité-État de Latium, gouvernée d'abord par des rois puis par une République naissante. Son territoire s'étend à peine sur 50 kilomètres autour de la ville. Entourée d'ennemis plus puissants — les Étrusques au nord, les Samnites au sud — la survie de Rome dépend de la discipline militaire et d'alliances pragmatiques.",
    analysis:
      "L'État romain précoce se définissait par sa formule politique unique : un sénat d'aristocrates, deux consuls élus et une armée citoyenne. Cette combinaison de gouvernance républicaine et de militarisme civique se révélera plus résiliente que toute monarchie héréditaire de son époque.",
    geojsonFile: "/geojson/roman/500bc.json",
    stats: {
      areaSqKm: 15_000,
      populationEstimate: 500_000,
      capitalCity: "Rome",
      politicalSystem: "République (Début)",
      keyFacts: [
        "Fondée selon la tradition en 753 av. J.-C.",
        "Contrôle uniquement le Latium et une partie de l'Étrurie",
        "Gouvernée par deux consuls élus annuellement",
        "Armée basée sur le système du citoyen-soldat (légionnaire)",
      ],
    },
  },
  {
    year: -264,
    label: "Péninsule italienne",
    slug: "264bc",
    era: "République Médiane",
    description:
      "Après trois siècles de consolidation en Italie, Rome contrôle toute la péninsule italienne au sud du Pô. La Première Guerre Punique contre Carthage commence — projetant Rome sur la scène méditerranéenne pour la première fois. La Sicile devient l'arène du plus grand conflit naval du monde antique.",
    analysis:
      "La conquête de l'Italie par Rome était moins une campagne militaire qu'un accomplissement politique : les peuples vaincus étaient progressivement intégrés comme alliés (socii) ou citoyens. Ce modèle d'absorption des ennemis dans le système romain — plutôt que de simples les subjuguer — donna à Rome sa profondeur démographique et militaire unique.",
    geojsonFile: "/geojson/roman/264bc.json",
    stats: {
      areaSqKm: 260_000,
      populationEstimate: 4_000_000,
      capitalCity: "Rome",
      politicalSystem: "République",
      keyFacts: [
        "Contrôle toute la péninsule italienne au sud du Pô",
        "Commence la Première Guerre Punique (264–241 av. J.-C.) contre Carthage",
        "Construit sa première marine sérieuse pour défier Carthage en mer",
        "La population des alliés italiques gonfle les légions",
      ],
    },
  },
  {
    year: -44,
    label: "Fin de la République",
    slug: "44bc",
    era: "Fin de la République",
    description:
      "Jules César est assassiné aux Ides de Mars. À sa mort, la République romaine contrôle un vaste arc territorial de l'Espagne et de la Gaule à l'ouest jusqu'à la Syrie et l'Égypte à l'est. Mais les institutions républicaines s'effondrent sous le poids de l'empire — sa gouvernance conçue pour une cité-État, pas pour une superpuissance méditerranéenne.",
    analysis:
      "L'assassinat de César n'était pas qu'un meurtre politique ; c'était le moment où la constitution républicaine de Rome — déjà fragilisée par des décennies de guerres civiles — s'est finalement brisée. Ce qui s'ensuivit fut une autre génération de conflits civils avant qu'Auguste établisse le Principat et donne à Rome un dirigeant unique.",
    geojsonFile: "/geojson/roman/44bc.json",
    stats: {
      areaSqKm: 2_750_000,
      populationEstimate: 50_000_000,
      capitalCity: "Rome",
      politicalSystem: "Fin de la République (Transitoire)",
      keyFacts: [
        "César assassiné le 15 mars 44 av. J.-C.",
        "Contrôle l'Espagne, la Gaule, l'Italie, la Grèce, la Turquie, le Levant et l'Afrique du Nord",
        "L'Égypte conquise par Octave/Auguste en 30 av. J.-C.",
        "Le Sénat nominalement suprême ; les hommes forts militaires détiennent le pouvoir réel",
      ],
    },
  },
  {
    year: 117,
    label: "Extension maximale — Trajan",
    slug: "117ad",
    era: "Dynasties des Nerviens-Antonins (Haut Empire)",
    description:
      "Sous l'empereur Trajan, l'Empire romain atteint son étendue territoriale maximale. La conquête de la Dacie (Roumanie moderne) et de la Mésopotamie porte l'empire à 5 millions de kilomètres carrés — une superficie supérieure aux États-Unis continentaux. Quelque 70 millions de personnes vivent à l'intérieur de ses frontières, parlant des dizaines de langues de l'Atlantique à l'Euphrate.",
    analysis:
      "L'expansionnisme de Trajan fut le sommet du pouvoir romain — mais aussi, rétrospectivement, le moment où il s'étendit trop. Son successeur Hadrien abandonna immédiatement la Mésopotamie, la reconnaissant comme indéfendable. La frontière Rhin-Danube s'avéra être la vraie frontière naturelle de Rome ; tout ce qui était à l'est était une anomalie coûteuse.",
    geojsonFile: "/geojson/roman/117ad.json",
    stats: {
      areaSqKm: 5_000_000,
      populationEstimate: 70_000_000,
      capitalCity: "Rome",
      politicalSystem: "Principat (Empire)",
      keyFacts: [
        "Étendue territoriale maximale sous l'empereur Trajan (98–117 ap. J.-C.)",
        "Englobe la France, l'Espagne, l'Angleterre (sud), la Turquie, l'Égypte et bien plus",
        "5 millions de km² — la plus grande superficie de l'histoire romaine",
        "Relié par 400 000 km de routes sur trois continents",
      ],
    },
  },
  {
    year: 395,
    label: "Division : Est et Ouest",
    slug: "395ad",
    era: "Empire tardif — Dynastie théodosienne",
    description:
      "À la mort de l'empereur Théodose Ier, l'empire est définitivement divisé entre ses deux fils : Arcadius règne sur la moitié orientale depuis Constantinople, Honorius sur la moitié occidentale depuis Médiolanum (Milan) puis Ravenne. Bien que nominalement encore un seul empire, l'Est et l'Ouest ne seront jamais réunis.",
    analysis:
      "La division de 395 était la solution administrative à un empire trop grand pour qu'un seul dirigeant le gouverne efficacement. L'Est était plus riche, plus urbanisé, et disposait de la capitale imprenable de Constantinople. L'Ouest avait le prestige de Rome mais faisait face à des pressions constantes des peuples germaniques traversant le Rhin et le Danube.",
    geojsonFile: "/geojson/roman/395ad.json",
    stats: {
      areaSqKm: 4_400_000,
      populationEstimate: 55_000_000,
      capitalCity: "Rome (Ouest) / Constantinople (Est)",
      politicalSystem: "Empire divisé",
      keyFacts: [
        "Définitivement divisé à la mort de Théodose Ier en 395 ap. J.-C.",
        "Capitale occidentale : Médiolanum / Ravenne",
        "Capitale orientale : Constantinople (fondée en 330 ap. J.-C.)",
        "La moitié orientale économiquement bien plus robuste que l'Ouest",
      ],
    },
  },
  {
    year: 476,
    label: "Chute de Rome occidentale",
    slug: "476ad",
    era: "Antiquité tardive — Empire byzantin",
    description:
      "Romulus Augustule, le dernier empereur occidental, est déposé par le chef germanique Odoacre. L'Empire romain d'Occident cesse d'exister en tant qu'entité politique. Seul l'Empire d'Orient — l'Empire byzantin, centré sur Constantinople — survit. Les historiens marquent traditionnellement 476 ap. J.-C. comme la fin de l'Antiquité et le début du Moyen Âge.",
    analysis:
      "La 'chute' de Rome ne fut pas une catastrophe soudaine mais le point culminant d'un processus de fragmentation qui dura un siècle. Les royaumes germaniques contrôlaient effectivement la majeure partie de l'Occident depuis des décennies avant 476. Ce qui prit fin n'était pas la civilisation romaine, mais la fiction d'une autorité impériale centralisée en Occident.",
    geojsonFile: "/geojson/roman/476ad.json",
    stats: {
      areaSqKm: 2_500_000,
      populationEstimate: 30_000_000,
      capitalCity: "Constantinople",
      politicalSystem: "Empire byzantin",
      keyFacts: [
        "Empire d'Occident prend fin avec la déposition de Romulus Augustule, 476 ap. J.-C.",
        "L'Empire d'Orient (byzantin) survit encore 1 000 ans",
        "Les royaumes germaniques (Wisigoths, Vandales, Francs) divisent l'Occident",
        "L'Église latine préserve la culture et l'administration romaines en Occident",
      ],
    },
  },
  {
    year: 1453,
    label: "Chute de Constantinople",
    slug: "1453ad",
    era: "Fin de l'Empire byzantin",
    description:
      "Le sultan ottoman Mehmed II conquiert Constantinople après un siège de 53 jours. Le dernier empereur byzantin, Constantin XI, meurt au combat. La ville que Constantin le Grand avait construite comme la 'Nouvelle Rome' en 330 ap. J.-C. tombe après 1 123 ans comme capitale de l'empire. La tradition romaine orientale — un fil continu remontant à Auguste — est finalement brisée.",
    analysis:
      "La chute de Constantinople se répercuta dans le monde entier. Des savants grecs s'enfuirent vers l'Ouest, emportant des manuscrits classiques qui aidèrent à alimenter la Renaissance. Les Ottomans gagnèrent une nouvelle capitale impériale positionnée entre l'Europe et l'Asie. Pour les historiens, 1453 marque non seulement la fin de l'Empire romain mais le début de la période moderne.",
    geojsonFile: "/geojson/roman/1453ad.json",
    stats: {
      areaSqKm: 50_000,
      populationEstimate: 400_000,
      capitalCity: "Constantinople",
      politicalSystem: "État byzantin réduit",
      keyFacts: [
        "Constantinople tombe aux mains des Turcs ottomans le 29 mai 1453",
        "Le dernier empereur byzantin Constantin XI meurt au combat",
        "Fin d'une tradition impériale romaine de 1 500+ ans",
        "Les savants grecs fuient vers l'Ouest, accélérant la Renaissance",
      ],
    },
  },
];
