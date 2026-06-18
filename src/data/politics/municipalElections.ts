export type CityOrientation = "left" | "right" | "center" | "other";

export interface CityResult {
  city: string;
  winner: string;
  party: string;
  partyColor: string;
  voteShare: number;
  lat: number;
  lon: number;
  orientation: CityOrientation;
}

export interface ElectionRound {
  date: string;
  label: string;
  region?: string;
  cities: CityResult[];
}

export interface MunicipalElectionYear {
  year: number;
  rounds: ElectionRound[];
}

export interface CountryMunicipalData {
  country: string;
  flag: string;
  elections: MunicipalElectionYear[];
}

export const MUNICIPAL_ELECTIONS: CountryMunicipalData[] = [
  {
    country: "France",
    flag: "🇫🇷",
    elections: [
      {
        year: 2001,
        rounds: [
          {
            date: "2001-03-11",
            label: "11 mars 2001 — 1er tour",
            cities: [
              { city: "Paris",      winner: "Bertrand Delanoë",      party: "PS",      partyColor: "#E05A6C", voteShare: 48.1, lat: 48.8566, lon: 2.3522,  orientation: "left"  },
              { city: "Lyon",       winner: "Gérard Collomb",         party: "PS",      partyColor: "#E05A6C", voteShare: 42.6, lat: 45.7578, lon: 4.8320,  orientation: "left"  },
              { city: "Marseille",  winner: "Jean-Claude Gaudin",     party: "RPR-UDF", partyColor: "#4A90D9", voteShare: 51.2, lat: 43.2965, lon: 5.3698,  orientation: "right" },
              { city: "Bordeaux",   winner: "Alain Juppé",            party: "RPR",     partyColor: "#4A90D9", voteShare: 54.7, lat: 44.8378, lon: -0.5792, orientation: "right" },
              { city: "Toulouse",   winner: "Philippe Douste-Blazy",  party: "UDF",     partyColor: "#5BA8D4", voteShare: 48.8, lat: 43.6047, lon: 1.4442,  orientation: "center"},
              { city: "Nantes",     winner: "Jean-Marc Ayrault",      party: "PS",      partyColor: "#E05A6C", voteShare: 50.3, lat: 47.2184, lon: -1.5536, orientation: "left"  },
              { city: "Lille",      winner: "Martine Aubry",          party: "PS",      partyColor: "#E05A6C", voteShare: 49.6, lat: 50.6292, lon: 3.0573,  orientation: "left"  },
              { city: "Nice",       winner: "Jacques Peyrat",         party: "RPR",     partyColor: "#4A90D9", voteShare: 52.3, lat: 43.7102, lon: 7.2620,  orientation: "right" },
              { city: "Strasbourg", winner: "Fabienne Keller",        party: "UDF-RPR", partyColor: "#4A90D9", voteShare: 46.1, lat: 48.5734, lon: 7.7521,  orientation: "right" },
              { city: "Rennes",     winner: "Edmond Hervé",           party: "PS",      partyColor: "#E05A6C", voteShare: 53.4, lat: 48.1173, lon: -1.6778, orientation: "left"  },
            ],
          },
          {
            date: "2001-03-18",
            label: "18 mars 2001 — 2e tour",
            cities: [
              { city: "Paris",    winner: "Bertrand Delanoë",     party: "PS",  partyColor: "#E05A6C", voteShare: 48.8, lat: 48.8566, lon: 2.3522, orientation: "left"   },
              { city: "Lyon",     winner: "Gérard Collomb",       party: "PS",  partyColor: "#E05A6C", voteShare: 43.5, lat: 45.7578, lon: 4.8320, orientation: "left"   },
              { city: "Toulouse", winner: "Philippe Douste-Blazy",party: "UDF", partyColor: "#5BA8D4", voteShare: 50.2, lat: 43.6047, lon: 1.4442, orientation: "center" },
            ],
          },
        ],
      },
      {
        year: 2008,
        rounds: [
          {
            date: "2008-03-09",
            label: "9 mars 2008 — 1er tour",
            cities: [
              { city: "Paris",      winner: "Bertrand Delanoë",  party: "PS",  partyColor: "#E05A6C", voteShare: 49.2, lat: 48.8566, lon: 2.3522,  orientation: "left"  },
              { city: "Lyon",       winner: "Gérard Collomb",    party: "PS",  partyColor: "#E05A6C", voteShare: 41.8, lat: 45.7578, lon: 4.8320,  orientation: "left"  },
              { city: "Marseille",  winner: "Jean-Claude Gaudin",party: "UMP", partyColor: "#4A90D9", voteShare: 48.3, lat: 43.2965, lon: 5.3698,  orientation: "right" },
              { city: "Bordeaux",   winner: "Alain Juppé",       party: "UMP", partyColor: "#4A90D9", voteShare: 56.6, lat: 44.8378, lon: -0.5792, orientation: "right" },
              { city: "Toulouse",   winner: "Pierre Cohen",       party: "PS",  partyColor: "#E05A6C", voteShare: 38.4, lat: 43.6047, lon: 1.4442,  orientation: "left"  },
              { city: "Nantes",     winner: "Jean-Marc Ayrault",  party: "PS",  partyColor: "#E05A6C", voteShare: 52.7, lat: 47.2184, lon: -1.5536, orientation: "left"  },
              { city: "Lille",      winner: "Martine Aubry",      party: "PS",  partyColor: "#E05A6C", voteShare: 45.6, lat: 50.6292, lon: 3.0573,  orientation: "left"  },
              { city: "Nice",       winner: "Christian Estrosi",  party: "UMP", partyColor: "#4A90D9", voteShare: 53.0, lat: 43.7102, lon: 7.2620,  orientation: "right" },
              { city: "Strasbourg", winner: "Roland Ries",        party: "PS",  partyColor: "#E05A6C", voteShare: 41.2, lat: 48.5734, lon: 7.7521,  orientation: "left"  },
              { city: "Rennes",     winner: "Daniel Delaveau",    party: "PS",  partyColor: "#E05A6C", voteShare: 49.8, lat: 48.1173, lon: -1.6778, orientation: "left"  },
            ],
          },
          {
            date: "2008-03-16",
            label: "16 mars 2008 — 2e tour",
            cities: [
              { city: "Paris",      winner: "Bertrand Delanoë", party: "PS", partyColor: "#E05A6C", voteShare: 58.2, lat: 48.8566, lon: 2.3522, orientation: "left" },
              { city: "Lyon",       winner: "Gérard Collomb",   party: "PS", partyColor: "#E05A6C", voteShare: 53.6, lat: 45.7578, lon: 4.8320, orientation: "left" },
              { city: "Toulouse",   winner: "Pierre Cohen",     party: "PS", partyColor: "#E05A6C", voteShare: 51.3, lat: 43.6047, lon: 1.4442, orientation: "left" },
              { city: "Strasbourg", winner: "Roland Ries",      party: "PS", partyColor: "#E05A6C", voteShare: 52.7, lat: 48.5734, lon: 7.7521, orientation: "left" },
            ],
          },
        ],
      },
      {
        year: 2014,
        rounds: [
          {
            date: "2014-03-23",
            label: "23 mars 2014 — 1er tour",
            cities: [
              { city: "Paris",       winner: "Anne Hidalgo",        party: "PS",  partyColor: "#E05A6C", voteShare: 34.4, lat: 48.8566, lon: 2.3522,  orientation: "left"  },
              { city: "Lyon",        winner: "Gérard Collomb",      party: "PS",  partyColor: "#E05A6C", voteShare: 40.8, lat: 45.7578, lon: 4.8320,  orientation: "left"  },
              { city: "Marseille",   winner: "Jean-Claude Gaudin",  party: "UMP", partyColor: "#4A90D9", voteShare: 43.8, lat: 43.2965, lon: 5.3698,  orientation: "right" },
              { city: "Bordeaux",    winner: "Alain Juppé",         party: "UMP", partyColor: "#4A90D9", voteShare: 61.4, lat: 44.8378, lon: -0.5792, orientation: "right" },
              { city: "Toulouse",    winner: "Jean-Luc Moudenc",    party: "UMP", partyColor: "#4A90D9", voteShare: 38.2, lat: 43.6047, lon: 1.4442,  orientation: "right" },
              { city: "Nantes",      winner: "Johanna Rolland",     party: "PS",  partyColor: "#E05A6C", voteShare: 43.5, lat: 47.2184, lon: -1.5536, orientation: "left"  },
              { city: "Lille",       winner: "Martine Aubry",       party: "PS",  partyColor: "#E05A6C", voteShare: 44.7, lat: 50.6292, lon: 3.0573,  orientation: "left"  },
              { city: "Nice",        winner: "Christian Estrosi",   party: "UMP", partyColor: "#4A90D9", voteShare: 58.3, lat: 43.7102, lon: 7.2620,  orientation: "right" },
              { city: "Strasbourg",  winner: "Roland Ries",         party: "PS",  partyColor: "#E05A6C", voteShare: 36.0, lat: 48.5734, lon: 7.7521,  orientation: "left"  },
              { city: "Montpellier", winner: "Philippe Saurel",     party: "DVG", partyColor: "#E08050", voteShare: 37.8, lat: 43.6108, lon: 3.8767,  orientation: "left"  },
            ],
          },
          {
            date: "2014-03-30",
            label: "30 mars 2014 — 2e tour",
            cities: [
              { city: "Paris",       winner: "Anne Hidalgo",     party: "PS",  partyColor: "#E05A6C", voteShare: 54.0, lat: 48.8566, lon: 2.3522, orientation: "left"  },
              { city: "Lyon",        winner: "Gérard Collomb",   party: "PS",  partyColor: "#E05A6C", voteShare: 61.0, lat: 45.7578, lon: 4.8320, orientation: "left"  },
              { city: "Toulouse",    winner: "Jean-Luc Moudenc", party: "UMP", partyColor: "#4A90D9", voteShare: 50.8, lat: 43.6047, lon: 1.4442, orientation: "right" },
              { city: "Strasbourg",  winner: "Roland Ries",      party: "PS",  partyColor: "#E05A6C", voteShare: 50.2, lat: 48.5734, lon: 7.7521, orientation: "left"  },
              { city: "Montpellier", winner: "Philippe Saurel",  party: "DVG", partyColor: "#E08050", voteShare: 52.3, lat: 43.6108, lon: 3.8767, orientation: "left"  },
            ],
          },
        ],
      },
      {
        year: 2020,
        rounds: [
          {
            date: "2020-03-15",
            label: "15 mars 2020 — 1er tour",
            cities: [
              { city: "Paris",       winner: "Anne Hidalgo",          party: "PS",     partyColor: "#E05A6C", voteShare: 29.3, lat: 48.8566, lon: 2.3522,  orientation: "left"  },
              { city: "Lyon",        winner: "Grégory Doucet",        party: "EELV",   partyColor: "#52A855", voteShare: 28.5, lat: 45.7578, lon: 4.8320,  orientation: "left"  },
              { city: "Marseille",   winner: "Michèle Rubirola",      party: "Gauche", partyColor: "#E05A6C", voteShare: 25.9, lat: 43.2965, lon: 5.3698,  orientation: "left"  },
              { city: "Bordeaux",    winner: "Pierre Hurmic",         party: "EELV",   partyColor: "#52A855", voteShare: 34.5, lat: 44.8378, lon: -0.5792, orientation: "left"  },
              { city: "Toulouse",    winner: "Jean-Luc Moudenc",      party: "LR",     partyColor: "#4A90D9", voteShare: 36.3, lat: 43.6047, lon: 1.4442,  orientation: "right" },
              { city: "Nantes",      winner: "Johanna Rolland",       party: "PS",     partyColor: "#E05A6C", voteShare: 40.5, lat: 47.2184, lon: -1.5536, orientation: "left"  },
              { city: "Lille",       winner: "Martine Aubry",         party: "PS",     partyColor: "#E05A6C", voteShare: 41.7, lat: 50.6292, lon: 3.0573,  orientation: "left"  },
              { city: "Nice",        winner: "Christian Estrosi",     party: "LR",     partyColor: "#4A90D9", voteShare: 56.5, lat: 43.7102, lon: 7.2620,  orientation: "right" },
              { city: "Strasbourg",  winner: "Jeanne Barseghian",     party: "EELV",   partyColor: "#52A855", voteShare: 28.4, lat: 48.5734, lon: 7.7521,  orientation: "left"  },
              { city: "Montpellier", winner: "Michaël Delafosse",     party: "PS",     partyColor: "#E05A6C", voteShare: 33.5, lat: 43.6108, lon: 3.8767,  orientation: "left"  },
            ],
          },
          {
            date: "2020-06-28",
            label: "28 juin 2020 — 2e tour (report COVID)",
            cities: [
              { city: "Paris",       winner: "Anne Hidalgo",      party: "PS",     partyColor: "#E05A6C", voteShare: 50.2, lat: 48.8566, lon: 2.3522,  orientation: "left" },
              { city: "Lyon",        winner: "Grégory Doucet",    party: "EELV",   partyColor: "#52A855", voteShare: 51.3, lat: 45.7578, lon: 4.8320,  orientation: "left" },
              { city: "Marseille",   winner: "Michèle Rubirola",  party: "Gauche", partyColor: "#E05A6C", voteShare: 41.7, lat: 43.2965, lon: 5.3698,  orientation: "left" },
              { city: "Bordeaux",    winner: "Pierre Hurmic",     party: "EELV",   partyColor: "#52A855", voteShare: 46.1, lat: 44.8378, lon: -0.5792, orientation: "left" },
              { city: "Toulouse",    winner: "Jean-Luc Moudenc",  party: "LR",     partyColor: "#4A90D9", voteShare: 51.3, lat: 43.6047, lon: 1.4442,  orientation: "right"},
              { city: "Strasbourg",  winner: "Jeanne Barseghian", party: "EELV",   partyColor: "#52A855", voteShare: 51.4, lat: 48.5734, lon: 7.7521,  orientation: "left" },
              { city: "Montpellier", winner: "Michaël Delafosse", party: "PS",     partyColor: "#E05A6C", voteShare: 51.3, lat: 43.6108, lon: 3.8767,  orientation: "left" },
              { city: "Rennes",      winner: "Nathalie Appéré",   party: "PS",     partyColor: "#E05A6C", voteShare: 53.2, lat: 48.1173, lon: -1.6778, orientation: "left" },
            ],
          },
        ],
      },
      {
        year: 2026,
        rounds: [
          {
            date: "2026-03-22",
            label: "22 mars 2026 — 1er tour (prévu)",
            cities: [],
          },
          {
            date: "2026-03-29",
            label: "29 mars 2026 — 2e tour (prévu)",
            cities: [],
          },
        ],
      },
    ],
  },
  {
    country: "Germany",
    flag: "🇩🇪",
    elections: [
      {
        year: 2020,
        rounds: [
          {
            date: "2020-03-15",
            label: "15 mars 2020 — Bavière (Kommunalwahl)",
            region: "Bavière",
            cities: [
              { city: "Munich",      winner: "Dieter Reiter",                    party: "SPD",  partyColor: "#E05A6C", voteShare: 47.2, lat: 48.1351, lon: 11.5820, orientation: "left"  },
              { city: "Nuremberg",   winner: "Marcus König",                     party: "CSU",  partyColor: "#4A90D9", voteShare: 39.0, lat: 49.4521, lon: 11.0767, orientation: "right" },
              { city: "Augsburg",    winner: "Eva Weber",                        party: "CSU",  partyColor: "#4A90D9", voteShare: 33.5, lat: 48.3705, lon: 10.8978, orientation: "right" },
              { city: "Würzburg",    winner: "Christian Schuchardt",             party: "FDP",  partyColor: "#FFD54F", voteShare: 38.6, lat: 49.7913, lon: 9.9534,  orientation: "center"},
              { city: "Regensburg",  winner: "Gertrud Maltz-Schwarzfischer",     party: "SPD",  partyColor: "#E05A6C", voteShare: 48.3, lat: 49.0134, lon: 12.1016, orientation: "left"  },
            ],
          },
          {
            date: "2020-09-13",
            label: "13 sept. 2020 — Rhénanie-du-Nord-Westphalie",
            region: "NRW",
            cities: [
              { city: "Cologne",    winner: "Henriette Reker",    party: "Indépendant (CDU+Verts)", partyColor: "#6A9A6A", voteShare: 59.6, lat: 50.9333, lon: 6.9500, orientation: "other" },
              { city: "Düsseldorf", winner: "Stephan Keller",     party: "CDU",                     partyColor: "#4A90D9", voteShare: 52.7, lat: 51.2217, lon: 6.7762, orientation: "right" },
              { city: "Dortmund",   winner: "Thomas Westphal",    party: "SPD",                     partyColor: "#E05A6C", voteShare: 54.7, lat: 51.5136, lon: 7.4653, orientation: "left"  },
              { city: "Essen",      winner: "Thomas Kufen",       party: "CDU",                     partyColor: "#4A90D9", voteShare: 56.0, lat: 51.4556, lon: 7.0116, orientation: "right" },
              { city: "Münster",    winner: "Markus Lewe",        party: "CDU",                     partyColor: "#4A90D9", voteShare: 57.4, lat: 51.9607, lon: 7.6261, orientation: "right" },
              { city: "Bochum",     winner: "Thomas Eiskirch",    party: "SPD",                     partyColor: "#E05A6C", voteShare: 48.2, lat: 51.4818, lon: 7.2162, orientation: "left"  },
              { city: "Wuppertal",  winner: "Uwe Schneidewind",   party: "Verts",                   partyColor: "#52A855", voteShare: 42.5, lat: 51.2562, lon: 7.1508, orientation: "left"  },
            ],
          },
          {
            date: "2020-10-18",
            label: "18 oct. 2020 — Basse-Saxe",
            region: "Basse-Saxe",
            cities: [
              { city: "Hanovre",    winner: "Belit Onay",          party: "Verts", partyColor: "#52A855", voteShare: 56.3, lat: 52.3759, lon: 9.7320,  orientation: "left"  },
              { city: "Brunswick",  winner: "Thorsten Kornblum",   party: "SPD",   partyColor: "#E05A6C", voteShare: 51.4, lat: 52.2689, lon: 10.5268, orientation: "left"  },
              { city: "Osnabrück",  winner: "Wolfgang Griesert",   party: "CDU",   partyColor: "#4A90D9", voteShare: 47.8, lat: 52.2799, lon: 8.0472,  orientation: "right" },
            ],
          },
        ],
      },
      {
        year: 2021,
        rounds: [
          {
            date: "2021-03-14",
            label: "14 mars 2021 — Hesse",
            region: "Hesse",
            cities: [
              { city: "Francfort",  winner: "Mike Josef",           party: "SPD", partyColor: "#E05A6C", voteShare: 46.3, lat: 50.1109, lon: 8.6821, orientation: "left" },
              { city: "Wiesbaden",  winner: "Gert-Uwe Mende",       party: "SPD", partyColor: "#E05A6C", voteShare: 53.8, lat: 50.0783, lon: 8.2397, orientation: "left" },
              { city: "Kassel",     winner: "Christian Geselle",    party: "SPD", partyColor: "#E05A6C", voteShare: 61.0, lat: 51.3127, lon: 9.4797, orientation: "left" },
              { city: "Darmstadt",  winner: "Hanno Benz",           party: "SPD", partyColor: "#E05A6C", voteShare: 55.2, lat: 49.8728, lon: 8.6512, orientation: "left" },
            ],
          },
          {
            date: "2021-09-26",
            label: "26 sept. 2021 — Rhénanie-Palatinat",
            region: "Rhénanie-Palatinat",
            cities: [
              { city: "Mayence",       winner: "Michael Ebling",   party: "SPD", partyColor: "#E05A6C", voteShare: 60.9, lat: 49.9929, lon: 8.2473, orientation: "left" },
              { city: "Ludwigshafen",  winner: "Jutta Steinruck",  party: "SPD", partyColor: "#E05A6C", voteShare: 51.9, lat: 49.4777, lon: 8.4369, orientation: "left" },
              { city: "Coblence",      winner: "David Langner",    party: "SPD", partyColor: "#E05A6C", voteShare: 54.5, lat: 50.3564, lon: 7.5986, orientation: "left" },
            ],
          },
        ],
      },
      {
        year: 2024,
        rounds: [
          {
            date: "2024-06-09",
            label: "9 juin 2024 — Bade-Wurtemberg",
            region: "Bade-Wurtemberg",
            cities: [
              { city: "Stuttgart",             winner: "Frank Nopper",    party: "CDU",        partyColor: "#4A90D9", voteShare: 40.2, lat: 48.7758, lon: 9.1829, orientation: "right" },
              { city: "Karlsruhe",             winner: "Frank Mentrup",   party: "SPD",        partyColor: "#E05A6C", voteShare: 43.5, lat: 49.0069, lon: 8.4037, orientation: "left"  },
              { city: "Freiburg-en-Brisgau",   winner: "Martin Horn",     party: "Indépendant",partyColor: "#888888", voteShare: 51.6, lat: 47.9990, lon: 7.8421, orientation: "other" },
              { city: "Heidelberg",            winner: "Eckart Würzner",  party: "Indépendant",partyColor: "#888888", voteShare: 60.4, lat: 49.3988, lon: 8.6724, orientation: "other" },
              { city: "Mannheim",              winner: "Christian Specht",party: "CDU",        partyColor: "#4A90D9", voteShare: 36.4, lat: 49.4875, lon: 8.4660, orientation: "right" },
            ],
          },
          {
            date: "2024-06-09",
            label: "9 juin 2024 — Saxe",
            region: "Saxe",
            cities: [
              { city: "Dresde",   winner: "Dirk Hilbert",   party: "FDP/lib.", partyColor: "#FFD54F", voteShare: 60.9, lat: 51.0509, lon: 13.7383, orientation: "center" },
              { city: "Leipzig",  winner: "Burkhard Jung",  party: "SPD",      partyColor: "#E05A6C", voteShare: 62.3, lat: 51.3397, lon: 12.3731, orientation: "left"   },
              { city: "Chemnitz", winner: "Sven Schulze",  party: "SPD",      partyColor: "#E05A6C", voteShare: 52.8, lat: 50.8333, lon: 12.9167, orientation: "left"   },
            ],
          },
          {
            date: "2024-06-09",
            label: "9 juin 2024 — Thuringe",
            region: "Thuringe",
            cities: [
              { city: "Erfurt", winner: "Andreas Bausewein", party: "SPD", partyColor: "#E05A6C", voteShare: 58.4, lat: 50.9787, lon: 11.0328, orientation: "left"   },
              { city: "Gera",   winner: "Julian Vonarb",     party: "CDU", partyColor: "#4A90D9", voteShare: 43.2, lat: 50.8795, lon: 12.0795, orientation: "right"  },
              { city: "Iéna",   winner: "Thomas Nitzsche",   party: "FDP", partyColor: "#FFD54F", voteShare: 54.1, lat: 50.9272, lon: 11.5892, orientation: "center" },
            ],
          },
        ],
      },
      {
        year: 2025,
        rounds: [
          {
            date: "2025-09-14",
            label: "14 sept. 2025 — NRW (prévu)",
            region: "NRW",
            cities: [],
          },
        ],
      },
    ],
  },
];

export function getMunicipalData(country: string): CountryMunicipalData | undefined {
  return MUNICIPAL_ELECTIONS.find((d) => d.country === country);
}

export const ALL_POLITICS_COUNTRIES = [
  { name: "France",       flag: "🇫🇷" },
  { name: "Germany",      flag: "🇩🇪" },
  { name: "United Kingdom", flag: "🇬🇧" },
  { name: "United States", flag: "🇺🇸" },
  { name: "Russia",       flag: "🇷🇺" },
  { name: "China",        flag: "🇨🇳" },
  { name: "Italy",        flag: "🇮🇹" },
  { name: "Spain",        flag: "🇪🇸" },
  { name: "Japan",        flag: "🇯🇵" },
  { name: "Brazil",       flag: "🇧🇷" },
  { name: "India",        flag: "🇮🇳" },
  { name: "Turkey",       flag: "🇹🇷" },
  { name: "Argentina",    flag: "🇦🇷" },
  { name: "Mexico",       flag: "🇲🇽" },
  { name: "Poland",       flag: "🇵🇱" },
  { name: "Hungary",      flag: "🇭🇺" },
  { name: "Iran",         flag: "🇮🇷" },
  { name: "South Korea",  flag: "🇰🇷" },
  { name: "South Africa", flag: "🇿🇦" },
  { name: "Sweden",       flag: "🇸🇪" },
  { name: "Australia",    flag: "🇦🇺" },
  { name: "Canada",       flag: "🇨🇦" },
];

export const COUNTRY_NAMES_FR: Record<string, string> = {
  "France":        "France",
  "Germany":       "Allemagne",
  "United Kingdom":"Royaume-Uni",
  "United States": "États-Unis",
  "Russia":        "Russie",
  "China":         "Chine",
  "Italy":         "Italie",
  "Spain":         "Espagne",
  "Japan":         "Japon",
  "Brazil":        "Brésil",
  "India":         "Inde",
  "Turkey":        "Turquie",
  "Argentina":     "Argentine",
  "Mexico":        "Mexique",
  "Poland":        "Pologne",
  "Hungary":       "Hongrie",
  "Iran":          "Iran",
  "South Korea":   "Corée du Sud",
  "South Africa":  "Afrique du Sud",
  "Sweden":        "Suède",
  "Australia":     "Australie",
  "Canada":        "Canada",
};

export const ORIENTATION_COLORS_MUNICIPAL: Record<string, string> = {
  left:   "#E05A6C",
  right:  "#4A90D9",
  center: "#FFD54F",
  other:  "#888888",
};

export const ORIENTATION_LABELS_MUNICIPAL: Record<string, string> = {
  left:   "Gauche",
  right:  "Droite",
  center: "Centre",
  other:  "Autre / Indépendant",
};
