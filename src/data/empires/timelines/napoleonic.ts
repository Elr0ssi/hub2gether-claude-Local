import type { TimelineEntry } from "@/types";

export const NAPOLEONIC_TIMELINE: TimelineEntry[] = [
  {
    year: 1804,
    label: "Proclamation de l'Empire",
    slug: "1804",
    era: "Premier Empire",
    description:
      "Napoléon Bonaparte se proclame Empereur des Français le 2 décembre 1804. La France englobe déjà la Belgique, le Piémont et la Ligurie. L'empire couvre environ 600 000 km².",
    analysis:
      "La proclamation marque la fin de la République consulaire. Le sacre par le pape Pie VII à Notre-Dame de Paris légitime le pouvoir. La France domine l'Europe occidentale mais l'Angleterre reste invaincue.",
    geojsonFile: "/geojson/napoleonic/1804.json",
    stats: {
      areaSqKm: 600000,
      populationEstimate: 38000000,
      capitalCity: "Paris",
      politicalSystem: "Empire absolu héréditaire",
      keyFacts: [
        "Sacre par Napoléon lui-même en présence du pape Pie VII",
        "Code civil napoléonien promulgué (1804)",
        "Création de la Légion d'honneur en 1802",
        "La Belgique, le Piémont et la Ligurie intégrées à l'Empire",
        "Victoire d'Austerlitz en décembre 1805",
      ],
    },
  },
  {
    year: 1807,
    label: "Apogée diplomatique — Tilsit",
    slug: "1807",
    era: "Premier Empire",
    description:
      "Après les victoires d'Iéna et d'Eylau, le traité de Tilsit (juillet 1807) fait de Napoléon l'arbitre de l'Europe. Les Pays-Bas, une grande partie de l'Allemagne du Nord et les côtes italiennes rejoignent l'Empire direct.",
    analysis:
      "Tilsit représente le moment où Napoléon est le maître incontesté du continent. La Confédération du Rhin remplace le Saint-Empire. La Russie devient alliée et l'Autriche est humiliée. Seule l'Angleterre résiste grâce à sa marine.",
    geojsonFile: "/geojson/napoleonic/1807.json",
    stats: {
      areaSqKm: 750000,
      populationEstimate: 44000000,
      capitalCity: "Paris",
      politicalSystem: "Empire avec États vassaux",
      keyFacts: [
        "Victoire d'Iéna-Auerstaedt contre la Prusse (1806)",
        "Traité de Tilsit avec la Russie et la Prusse (juillet 1807)",
        "Création du Royaume de Westphalie confié à Jérôme Bonaparte",
        "Blocus continental contre l'Angleterre",
        "Rome et les États pontificaux sous influence française",
      ],
    },
  },
  {
    year: 1812,
    label: "Extension maximale",
    slug: "1812",
    era: "Premier Empire",
    description:
      "À son apogée en 1812, l'Empire français direct couvre plus de 750 000 km² et 44 millions d'habitants : France, Benelux, nord de l'Allemagne jusqu'à Hambourg et Lübeck, Italie du Nord et Rome, Provinces illyriennes et Catalogne.",
    analysis:
      "1812 marque simultanément l'apogée et le début de la fin. La campagne de Russie débute avec 600 000 soldats — la plus grande armée jamais rassemblée. La retraite de Moscou détruira les deux tiers de cette force et déclenchera l'effondrement de l'Empire.",
    geojsonFile: "/geojson/napoleonic/1812.json",
    stats: {
      areaSqKm: 750000,
      populationEstimate: 44000000,
      capitalCity: "Paris",
      politicalSystem: "Empire — 130 départements",
      keyFacts: [
        "130 départements de Hambourg à Rome",
        "La Grande Armée dépasse 600 000 hommes pour la campagne de Russie",
        "Rome, capitale d'un département français depuis 1809",
        "Hambourg et Lübeck annexées comme nouveaux départements en 1810–1811",
        "Provinces illyriennes (Trieste-Dubrovnik) intégrées pour contrôler l'Adriatique",
      ],
    },
  },
  {
    year: 1815,
    label: "Chute après Waterloo",
    slug: "1815",
    era: "Premier Empire — Fin",
    description:
      "La défaite de Waterloo (18 juin 1815) met fin aux Cent-Jours. Napoléon abdique une seconde fois. Le Congrès de Vienne redessine l'Europe et réduit la France à ses frontières de 1792.",
    analysis:
      "Waterloo ne fut pas un échec militaire inévitable — la bataille fut très serrée. Ce qui fut décisif, c'est l'épuisement politique de l'Europe entière face à vingt ans de guerres. La Sainte-Alliance garantit désormais l'ordre conservateur pour une génération.",
    geojsonFile: "/geojson/napoleonic/1815.json",
    stats: {
      areaSqKm: 543000,
      populationEstimate: 30000000,
      capitalCity: "Paris",
      politicalSystem: "Monarchie constitutionnelle (Restauration)",
      keyFacts: [
        "Défaite de Waterloo le 18 juin 1815 face à Wellington et Blücher",
        "Seconde abdication de Napoléon le 22 juin 1815",
        "Exil définitif à Sainte-Hélène",
        "Congrès de Vienne : 1er traité de Paris (1814) et 2e traité (1815)",
        "Retour des Bourbons — Louis XVIII roi de France",
      ],
    },
  },
];
