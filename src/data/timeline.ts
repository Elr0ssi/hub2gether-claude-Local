import type { TimelineEntry } from "@/types";

export const ROMAN_TIMELINE: TimelineEntry[] = [
  {
    year: -500,
    label: "Primitive Rome",
    slug: "500bc",
    era: "Roman Kingdom / Early Republic",
    description:
      "Rome is a small city-state in Latium, governed first by kings and then by a nascent republic. Its territory extends barely 50 kilometres around the city. Surrounded by more powerful neighbours — the Etruscans to the north and the Samnites to the south — Rome's survival depends on military discipline and pragmatic alliances.",
    analysis:
      "The early Roman state was defined by its unique political formula: a senate of aristocrats, two elected consuls, and a citizen-army. This combination of republican governance and civic militarism would prove more resilient than any hereditary monarchy of its era.",
    geojsonFile: "/geojson/roman-empire-500bc.json",
    stats: {
      areaSqKm: 15_000,
      populationEstimate: 500_000,
      capitalCity: "Rome",
      politicalSystem: "Republic (Early)",
      keyFacts: [
        "Founded according to tradition in 753 BC",
        "Controlled only Latium and parts of Etruria",
        "Governed by two annually-elected consuls",
        "Army based on the citizen-soldier (legionary) system",
      ],
    },
  },
  {
    year: -264,
    label: "Start of Mediterranean Expansion",
    slug: "264bc",
    era: "Middle Republic",
    description:
      "After three centuries of consolidation in Italy, Rome controls the entire Italian peninsula south of the Po valley. The First Punic War against Carthage begins — launching Rome onto the Mediterranean stage for the first time. Sicily becomes the arena for the greatest naval contest of the ancient world.",
    analysis:
      "Rome's conquest of Italy was less a military campaign than a political achievement: defeated peoples were progressively integrated as allies (socii) or citizens. This model of absorbing enemies into the Roman system — rather than simply subjugating them — gave Rome its unique demographic and military depth.",
    geojsonFile: "/geojson/roman-empire-264bc.json",
    stats: {
      areaSqKm: 260_000,
      populationEstimate: 4_000_000,
      capitalCity: "Rome",
      politicalSystem: "Republic",
      keyFacts: [
        "Controls the entire Italian peninsula south of the Po",
        "Begins the First Punic War (264–241 BC) against Carthage",
        "Builds its first serious navy to challenge Carthage at sea",
        "Population drawn from Italian allies swells the legions",
      ],
    },
  },
  {
    year: -44,
    label: "End of the Republic",
    slug: "44bc",
    era: "Late Republic",
    description:
      "Julius Caesar is assassinated on the Ides of March. At its death, the Roman Republic controls an enormous arc of territory from Spain and Gaul in the west to Syria and Egypt in the east. But the republic's institutions are collapsing under the weight of empire — its governance designed for a city-state, not a Mediterranean superpower.",
    analysis:
      "Caesar's assassination was not just a political murder; it was the moment when Rome's republican constitution — already strained by decades of civil war — finally broke. What followed was another generation of civil conflict before Augustus established the Principate and gave Rome a single ruler without formally abolishing the republic's forms.",
    geojsonFile: "/geojson/roman-empire-44bc.json",
    stats: {
      areaSqKm: 2_750_000,
      populationEstimate: 50_000_000,
      capitalCity: "Rome",
      politicalSystem: "Late Republic (Transitional)",
      keyFacts: [
        "Caesar assassinated on 15 March 44 BC",
        "Controls Spain, Gaul, Italy, Greece, Turkey, Levant and North Africa",
        "Egypt conquered by Octavian/Augustus in 30 BC",
        "Senate still nominally supreme; military strongmen hold real power",
      ],
    },
  },
  {
    year: 117,
    label: "Maximum Extension — Trajan",
    slug: "117ad",
    era: "Nerva-Antonine Dynasty (High Empire)",
    description:
      "Under Emperor Trajan, the Roman Empire reaches its greatest territorial extent. The conquest of Dacia (modern Romania) and Mesopotamia brings the empire to 5 million square kilometres — an area greater than the continental United States. Some 70 million people live within its borders, speaking dozens of languages from the Atlantic to the Euphrates.",
    analysis:
      "Trajan's expansionism was the high-water mark of Roman power — but also, in retrospect, the moment it overextended. His successor Hadrian immediately abandoned Mesopotamia, recognising it as indefensible. The Rhine-Danube frontier proved to be Rome's true natural boundary; everything east of it was an expensive anomaly.",
    geojsonFile: "/geojson/roman-empire-117ad.json",
    stats: {
      areaSqKm: 5_000_000,
      populationEstimate: 70_000_000,
      capitalCity: "Rome",
      politicalSystem: "Principate (Empire)",
      keyFacts: [
        "Peak territorial extent under Emperor Trajan (98–117 AD)",
        "Encompasses modern France, Spain, England (south), Turkey, Egypt and more",
        "5 million km² — largest in Roman history",
        "Connected by 400,000 km of roads across three continents",
      ],
    },
  },
  {
    year: 395,
    label: "Split: East and West",
    slug: "395ad",
    era: "Late Empire — Theodosian Dynasty",
    description:
      "Upon the death of Emperor Theodosius I, the empire is permanently divided between his two sons: Arcadius rules the Eastern half from Constantinople, Honorius rules the Western half from Mediolanum (Milan) and later Ravenna. Though nominally still one empire, the East and West will never be reunited.",
    analysis:
      "The division of 395 was the administrative solution to an empire too large for a single ruler to govern effectively. The East was richer, more urbanised, and had the defensible capital of Constantinople. The West had the prestige of Rome but faced constant pressure from Germanic peoples crossing the Rhine and Danube — pressures that would eventually prove fatal.",
    geojsonFile: "/geojson/roman-empire-395ad.json",
    stats: {
      areaSqKm: 4_400_000,
      populationEstimate: 55_000_000,
      capitalCity: "Rome (West) / Constantinople (East)",
      politicalSystem: "Divided Empire",
      keyFacts: [
        "Permanently divided on death of Theodosius I in 395 AD",
        "Western capital: Mediolanum / Ravenna",
        "Eastern capital: Constantinople (founded 330 AD)",
        "Eastern half far more economically robust than the West",
      ],
    },
  },
  {
    year: 476,
    label: "Fall of Western Rome",
    slug: "476ad",
    era: "Late Antiquity — Byzantine Empire",
    description:
      "Romulus Augustulus, the last Western emperor, is deposed by the Germanic chieftain Odoacer. The Western Roman Empire ceases to exist as a political entity. Only the Eastern Empire — the Byzantine Empire, centred on Constantinople — survives. Historians traditionally mark 476 AD as the end of antiquity and the beginning of the Middle Ages.",
    analysis:
      "The 'fall' of Rome was not a sudden catastrophe but the culmination of a century-long process of fragmentation. Germanic kingdoms had effectively controlled most of the West for decades before 476. What ended was not Roman civilisation — which continued in transformed form — but the fiction of centralised imperial authority in the West.",
    geojsonFile: "/geojson/roman-empire-476ad.json",
    stats: {
      areaSqKm: 2_500_000,
      populationEstimate: 30_000_000,
      capitalCity: "Constantinople",
      politicalSystem: "Byzantine Empire",
      keyFacts: [
        "Western Empire ends with deposition of Romulus Augustulus, 476 AD",
        "Eastern (Byzantine) Empire survives for another 1,000 years",
        "Germanic kingdoms (Visigoths, Vandals, Franks) divide the West",
        "Latin Church preserves Roman culture and administration in the West",
      ],
    },
  },
  {
    year: 1453,
    label: "Fall of Constantinople",
    slug: "1453ad",
    era: "End of the Byzantine Empire",
    description:
      "Ottoman Sultan Mehmed II conquers Constantinople after a 53-day siege. The last Byzantine emperor, Constantine XI, dies in battle. The city that Constantine the Great had built as the 'New Rome' in 330 AD falls after 1,123 years as the empire's capital. The Eastern Roman tradition — a continuous thread back to Augustus — is finally broken.",
    analysis:
      "The fall of Constantinople reverberated across the world. Greek scholars fled west, carrying classical manuscripts that helped fuel the Renaissance. The Ottomans gained a new imperial capital positioned between Europe and Asia. For historians, 1453 marks not only the end of the Roman Empire but the beginning of the early modern period.",
    geojsonFile: "/geojson/roman-empire-1453ad.json",
    stats: {
      areaSqKm: 50_000,
      populationEstimate: 400_000,
      capitalCity: "Constantinople",
      politicalSystem: "Reduced Byzantine State",
      keyFacts: [
        "Constantinople falls to Ottoman Turks on 29 May 1453",
        "Last Byzantine emperor Constantine XI dies in battle",
        "Ends 1,500+ year Roman imperial tradition",
        "Greek scholars flee west, accelerating the Renaissance",
      ],
    },
  },
];

export function getEntryBySlug(slug: string): TimelineEntry | undefined {
  return ROMAN_TIMELINE.find((e) => e.slug === slug);
}

export function getEntryByYear(year: number): TimelineEntry | undefined {
  return ROMAN_TIMELINE.find((e) => e.year === year);
}

export function getAdjacentEntries(
  slug: string
): { prev?: TimelineEntry; next?: TimelineEntry } {
  const index = ROMAN_TIMELINE.findIndex((e) => e.slug === slug);
  if (index === -1) return {};
  return {
    prev: index > 0 ? ROMAN_TIMELINE[index - 1] : undefined,
    next: index < ROMAN_TIMELINE.length - 1 ? ROMAN_TIMELINE[index + 1] : undefined,
  };
}
