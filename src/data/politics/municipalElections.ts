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
  {
    country: "United States",
    flag: "🇺🇸",
    elections: [
      {
        year: 2021,
        rounds: [
          {
            date: "2021-11-02",
            label: "2 nov. 2021 — Élections municipales",
            cities: [
              { city: "New York",        winner: "Eric Adams",         party: "Democrat",    partyColor: "#4A90D9", voteShare: 51.1, lat: 40.7128, lon: -74.0060,  orientation: "center" },
              { city: "Boston",          winner: "Michelle Wu",         party: "Democrat",    partyColor: "#E05A6C", voteShare: 64.0, lat: 42.3601, lon: -71.0589,  orientation: "left"   },
              { city: "Philadelphia",    winner: "Jim Kenney",          party: "Democrat",    partyColor: "#E05A6C", voteShare: 67.7, lat: 39.9526, lon: -75.1652,  orientation: "left"   },
              { city: "Buffalo",         winner: "Byron Brown",         party: "Democrat",    partyColor: "#E05A6C", voteShare: 59.0, lat: 42.8864, lon: -78.8784,  orientation: "left"   },
              { city: "Minneapolis",     winner: "Jacob Frey",          party: "Democrat",    partyColor: "#E05A6C", voteShare: 55.8, lat: 44.9778, lon: -93.2650,  orientation: "left"   },
              { city: "Pittsburgh",      winner: "Ed Gainey",           party: "Democrat",    partyColor: "#E05A6C", voteShare: 69.5, lat: 40.4406, lon: -79.9959,  orientation: "left"   },
              { city: "Atlanta",         winner: "Andre Dickens",       party: "Democrat",    partyColor: "#E05A6C", voteShare: 66.3, lat: 33.7490, lon: -84.3880,  orientation: "left"   },
              { city: "Detroit",         winner: "Mike Duggan",         party: "Democrat",    partyColor: "#4A90D9", voteShare: 72.3, lat: 42.3314, lon: -83.0458,  orientation: "center" },
              { city: "Cleveland",       winner: "Justin Bibb",         party: "Democrat",    partyColor: "#E05A6C", voteShare: 62.4, lat: 41.4993, lon: -81.6944,  orientation: "left"   },
              { city: "Seattle",         winner: "Bruce Harrell",       party: "Democrat",    partyColor: "#4A90D9", voteShare: 68.3, lat: 47.6062, lon: -122.3321, orientation: "center" },
              { city: "Denver",          winner: "Michael Hancock",     party: "Democrat",    partyColor: "#E05A6C", voteShare: 71.7, lat: 39.7392, lon: -104.9903, orientation: "left"   },
              { city: "Miami",           winner: "Francis Suarez",      party: "Republican",  partyColor: "#C0392B", voteShare: 78.9, lat: 25.7617, lon: -80.1918,  orientation: "right"  },
              { city: "Fort Worth",      winner: "Mattie Parker",       party: "Republican",  partyColor: "#C0392B", voteShare: 53.2, lat: 32.7555, lon: -97.3308,  orientation: "right"  },
              { city: "Oklahoma City",   winner: "David Holt",          party: "Republican",  partyColor: "#C0392B", voteShare: 73.5, lat: 35.4676, lon: -97.5164,  orientation: "right"  },
            ],
          },
        ],
      },
      {
        year: 2023,
        rounds: [
          {
            date: "2023-11-07",
            label: "7 nov. 2023 — Élections municipales",
            cities: [
              { city: "Los Angeles",     winner: "Karen Bass",          party: "Democrat",    partyColor: "#E05A6C", voteShare: 55.9, lat: 34.0522, lon: -118.2437, orientation: "left"   },
              { city: "Chicago",         winner: "Brandon Johnson",     party: "Democrat",    partyColor: "#E05A6C", voteShare: 51.4, lat: 41.8781, lon: -87.6298,  orientation: "left"   },
              { city: "Houston",         winner: "John Whitmire",       party: "Democrat",    partyColor: "#4A90D9", voteShare: 64.8, lat: 29.7604, lon: -95.3698,  orientation: "center" },
              { city: "Phoenix",         winner: "Kate Gallego",        party: "Democrat",    partyColor: "#4A90D9", voteShare: 71.4, lat: 33.4484, lon: -112.0740, orientation: "center" },
              { city: "San Antonio",     winner: "Ron Nirenberg",       party: "Independent", partyColor: "#888888", voteShare: 53.4, lat: 29.4241, lon: -98.4936,  orientation: "other"  },
              { city: "San Diego",       winner: "Todd Gloria",         party: "Democrat",    partyColor: "#E05A6C", voteShare: 54.6, lat: 32.7157, lon: -117.1611, orientation: "left"   },
              { city: "Dallas",          winner: "Eric Johnson",        party: "Republican",  partyColor: "#C0392B", voteShare: 71.1, lat: 32.7767, lon: -96.7970,  orientation: "right"  },
              { city: "Jacksonville",    winner: "Donna Deegan",        party: "Democrat",    partyColor: "#E05A6C", voteShare: 52.4, lat: 30.3322, lon: -81.6557,  orientation: "left"   },
              { city: "Austin",          winner: "Kirk Watson",         party: "Democrat",    partyColor: "#4A90D9", voteShare: 61.2, lat: 30.2672, lon: -97.7431,  orientation: "center" },
              { city: "San Francisco",   winner: "London Breed",        party: "Democrat",    partyColor: "#4A90D9", voteShare: 51.2, lat: 37.7749, lon: -122.4194, orientation: "center" },
              { city: "Columbus",        winner: "Andrew Ginther",      party: "Democrat",    partyColor: "#4A90D9", voteShare: 71.5, lat: 39.9612, lon: -82.9988,  orientation: "center" },
              { city: "Charlotte",       winner: "Vi Lyles",            party: "Democrat",    partyColor: "#E05A6C", voteShare: 64.2, lat: 35.2271, lon: -80.8431,  orientation: "left"   },
              { city: "Indianapolis",    winner: "Joe Hogsett",         party: "Democrat",    partyColor: "#E05A6C", voteShare: 62.0, lat: 39.7684, lon: -86.1581,  orientation: "left"   },
              { city: "Nashville",       winner: "Freddie O'Connell",   party: "Democrat",    partyColor: "#E05A6C", voteShare: 53.2, lat: 36.1627, lon: -86.7816,  orientation: "left"   },
              { city: "Washington DC",   winner: "Muriel Bowser",       party: "Democrat",    partyColor: "#E05A6C", voteShare: 72.4, lat: 38.9072, lon: -77.0369,  orientation: "left"   },
              { city: "El Paso",         winner: "Oscar Leeser",        party: "Independent", partyColor: "#888888", voteShare: 66.7, lat: 31.7619, lon: -106.4850, orientation: "other"  },
              { city: "Memphis",         winner: "Paul Young",          party: "Democrat",    partyColor: "#E05A6C", voteShare: 56.5, lat: 35.1495, lon: -90.0490,  orientation: "left"   },
              { city: "Baltimore",       winner: "Brandon Scott",       party: "Democrat",    partyColor: "#E05A6C", voteShare: 78.2, lat: 39.2904, lon: -76.6122,  orientation: "left"   },
              { city: "Milwaukee",       winner: "Cavalier Johnson",    party: "Democrat",    partyColor: "#E05A6C", voteShare: 68.6, lat: 43.0389, lon: -87.9065,  orientation: "left"   },
              { city: "Albuquerque",     winner: "Tim Keller",          party: "Democrat",    partyColor: "#4A90D9", voteShare: 65.8, lat: 35.0844, lon: -106.6504, orientation: "center" },
              { city: "Tampa",           winner: "Jane Castor",         party: "Democrat",    partyColor: "#E05A6C", voteShare: 73.2, lat: 27.9506, lon: -82.4572,  orientation: "left"   },
              { city: "New Orleans",     winner: "LaToya Cantrell",     party: "Democrat",    partyColor: "#E05A6C", voteShare: 80.1, lat: 29.9511, lon: -90.0715,  orientation: "left"   },
              { city: "Kansas City",     winner: "Quinton Lucas",       party: "Democrat",    partyColor: "#E05A6C", voteShare: 71.0, lat: 39.0997, lon: -94.5786,  orientation: "left"   },
              { city: "Raleigh",         winner: "Mary-Ann Baldwin",    party: "Democrat",    partyColor: "#E05A6C", voteShare: 61.5, lat: 35.7796, lon: -78.6382,  orientation: "left"   },
              { city: "Portland",        winner: "Ted Wheeler",         party: "Democrat",    partyColor: "#4A90D9", voteShare: 56.0, lat: 45.5051, lon: -122.6750, orientation: "center" },
              { city: "Sacramento",      winner: "Darrell Steinberg",   party: "Democrat",    partyColor: "#E05A6C", voteShare: 63.3, lat: 38.5816, lon: -121.4944, orientation: "left"   },
              { city: "St. Louis",       winner: "Tishaura Jones",      party: "Democrat",    partyColor: "#E05A6C", voteShare: 66.4, lat: 38.6270, lon: -90.1994,  orientation: "left"   },
              { city: "Mesa",            winner: "John Giles",          party: "Republican",  partyColor: "#C0392B", voteShare: 57.4, lat: 33.4152, lon: -111.8315, orientation: "right"  },
              { city: "Omaha",           winner: "Jean Stothert",       party: "Republican",  partyColor: "#C0392B", voteShare: 59.7, lat: 41.2565, lon: -95.9345,  orientation: "right"  },
              { city: "Colorado Springs",winner: "Yemi Mobolade",       party: "Republican",  partyColor: "#C0392B", voteShare: 54.4, lat: 38.8339, lon: -104.8214, orientation: "right"  },
              { city: "Virginia Beach",  winner: "Bobby Dyer",          party: "Republican",  partyColor: "#C0392B", voteShare: 57.7, lat: 36.8529, lon: -75.9780,  orientation: "right"  },
              { city: "Fresno",          winner: "Jerry Dyer",          party: "Republican",  partyColor: "#C0392B", voteShare: 65.3, lat: 36.7378, lon: -119.7871, orientation: "right"  },
              { city: "Louisville",      winner: "Craig Greenberg",     party: "Democrat",    partyColor: "#4A90D9", voteShare: 53.0, lat: 38.2527, lon: -85.7585,  orientation: "center" },
              { city: "Tucson",          winner: "Regina Romero",       party: "Democrat",    partyColor: "#E05A6C", voteShare: 73.4, lat: 32.2226, lon: -110.9747, orientation: "left"   },
              { city: "Cincinnati",      winner: "Aftab Pureval",       party: "Democrat",    partyColor: "#4A90D9", voteShare: 66.1, lat: 39.1031, lon: -84.5120,  orientation: "center" },
              { city: "Las Vegas",       winner: "Carolyn Goodman",     party: "Independent", partyColor: "#888888", voteShare: 52.8, lat: 36.1699, lon: -115.1398, orientation: "other"  },
            ],
          },
        ],
      },
    ],
  },
  {
    country: "United Kingdom",
    flag: "🇬🇧",
    elections: [
      {
        year: 2021,
        rounds: [
          {
            date: "2021-05-06",
            label: "6 mai 2021 — Élections locales",
            cities: [
              { city: "London",       winner: "Sadiq Khan",        party: "Labour",    partyColor: "#E05A6C", voteShare: 55.2, lat: 51.5074, lon: -0.1278, orientation: "left"   },
              { city: "Bristol",      winner: "Marvin Rees",       party: "Labour",    partyColor: "#E05A6C", voteShare: 51.3, lat: 51.4545, lon: -2.5879, orientation: "left"   },
              { city: "Salford",      winner: "Paul Dennett",      party: "Labour",    partyColor: "#E05A6C", voteShare: 58.1, lat: 53.4875, lon: -2.2901, orientation: "left"   },
              { city: "Liverpool",    winner: "Steve Rotherham",   party: "Labour",    partyColor: "#E05A6C", voteShare: 68.4, lat: 53.4084, lon: -2.9916, orientation: "left"   },
            ],
          },
        ],
      },
      {
        year: 2024,
        rounds: [
          {
            date: "2024-05-02",
            label: "2 mai 2024 — Élections locales",
            cities: [
              { city: "London",        winner: "Sadiq Khan",         party: "Labour",      partyColor: "#E05A6C", voteShare: 43.8, lat: 51.5074, lon: -0.1278,  orientation: "left"   },
              { city: "Manchester",    winner: "Bev Craig",           party: "Labour",      partyColor: "#E05A6C", voteShare: 61.2, lat: 53.4808, lon: -2.2426,  orientation: "left"   },
              { city: "Birmingham",    winner: "John Cotton",         party: "Labour",      partyColor: "#E05A6C", voteShare: 52.7, lat: 52.4862, lon: -1.8904,  orientation: "left"   },
              { city: "Leeds",         winner: "James Lewis",         party: "Labour",      partyColor: "#E05A6C", voteShare: 57.3, lat: 53.8008, lon: -1.5491,  orientation: "left"   },
              { city: "Glasgow",       winner: "Susan Aitken",        party: "SNP",         partyColor: "#FFD54F", voteShare: 44.1, lat: 55.8642, lon: -4.2518,  orientation: "center" },
              { city: "Sheffield",     winner: "Tom Hunt",            party: "Labour",      partyColor: "#E05A6C", voteShare: 53.6, lat: 53.3811, lon: -1.4701,  orientation: "left"   },
              { city: "Bristol",       winner: "Josie Platt",         party: "Labour",      partyColor: "#E05A6C", voteShare: 48.9, lat: 51.4545, lon: -2.5879,  orientation: "left"   },
              { city: "Edinburgh",     winner: "Cammy Day",           party: "Labour",      partyColor: "#E05A6C", voteShare: 38.6, lat: 55.9533, lon: -3.1883,  orientation: "left"   },
              { city: "Cardiff",       winner: "Huw Thomas",          party: "Labour",      partyColor: "#E05A6C", voteShare: 51.4, lat: 51.4816, lon: -3.1791,  orientation: "left"   },
              { city: "Coventry",      winner: "George Duggins",      party: "Labour",      partyColor: "#E05A6C", voteShare: 59.7, lat: 52.4068, lon: -1.5197,  orientation: "left"   },
              { city: "Leicester",     winner: "Peter Soulsby",       party: "Labour",      partyColor: "#E05A6C", voteShare: 61.3, lat: 52.6369, lon: -1.1398,  orientation: "left"   },
              { city: "Nottingham",    winner: "David Mellen",        party: "Labour",      partyColor: "#E05A6C", voteShare: 57.8, lat: 52.9548, lon: -1.1581,  orientation: "left"   },
              { city: "Newcastle",     winner: "Nick Forbes",         party: "Labour",      partyColor: "#E05A6C", voteShare: 63.5, lat: 54.9783, lon: -1.6174,  orientation: "left"   },
              { city: "Liverpool",     winner: "Steve Rotherham",     party: "Labour",      partyColor: "#E05A6C", voteShare: 72.1, lat: 53.4084, lon: -2.9916,  orientation: "left"   },
              { city: "Bradford",      winner: "Susan Hinchcliffe",   party: "Labour",      partyColor: "#E05A6C", voteShare: 54.3, lat: 53.7960, lon: -1.7594,  orientation: "left"   },
            ],
          },
        ],
      },
    ],
  },
  {
    country: "Spain",
    flag: "🇪🇸",
    elections: [
      {
        year: 2023,
        rounds: [
          {
            date: "2023-05-28",
            label: "28 mai 2023 — Élections municipales",
            cities: [
              { city: "Madrid",        winner: "José Luis Almeida",    party: "PP",  partyColor: "#4A90D9", voteShare: 47.4, lat: 40.4168, lon: -3.7038, orientation: "right"  },
              { city: "Barcelona",     winner: "Jaume Collboni",        party: "PSC", partyColor: "#E05A6C", voteShare: 22.5, lat: 41.3851, lon: 2.1734,  orientation: "left"   },
              { city: "Valencia",      winner: "María José Catalá",     party: "PP",  partyColor: "#4A90D9", voteShare: 37.4, lat: 39.4699, lon: -0.3763, orientation: "right"  },
              { city: "Séville",       winner: "José Luis Sanz",        party: "PP",  partyColor: "#4A90D9", voteShare: 39.8, lat: 37.3886, lon: -5.9823, orientation: "right"  },
              { city: "Saragosse",     winner: "Natalia Chueca",        party: "PP",  partyColor: "#4A90D9", voteShare: 36.2, lat: 41.6488, lon: -0.8891, orientation: "right"  },
              { city: "Málaga",        winner: "Francisco de la Torre", party: "PP",  partyColor: "#4A90D9", voteShare: 59.4, lat: 36.7213, lon: -4.4213, orientation: "right"  },
              { city: "Bilbao",        winner: "Juan Mari Aburto",      party: "PNV", partyColor: "#FFD54F", voteShare: 36.4, lat: 43.2627, lon: -2.9253, orientation: "center" },
              { city: "Alicante",      winner: "Luis Barcala",          party: "PP",  partyColor: "#4A90D9", voteShare: 45.1, lat: 38.3452, lon: -0.4810, orientation: "right"  },
              { city: "Cordoue",       winner: "José María Bellido",    party: "PP",  partyColor: "#4A90D9", voteShare: 40.5, lat: 37.8882, lon: -4.7794, orientation: "right"  },
              { city: "Valladolid",    winner: "Jesús Julio Carnero",   party: "PP",  partyColor: "#4A90D9", voteShare: 50.3, lat: 41.6523, lon: -4.7245, orientation: "right"  },
              { city: "Murcie",        winner: "José Ballesta",         party: "PP",  partyColor: "#4A90D9", voteShare: 52.0, lat: 37.9922, lon: -1.1307, orientation: "right"  },
              { city: "Donostia",      winner: "Eneko Goia",            party: "EAJ-PNV", partyColor: "#FFD54F", voteShare: 33.7, lat: 43.3183, lon: -1.9812, orientation: "center" },
              { city: "Grenade",       winner: "Marifrán Carazo",       party: "PP",  partyColor: "#4A90D9", voteShare: 43.2, lat: 37.1773, lon: -3.5986, orientation: "right"  },
              { city: "Pampelune",     winner: "Cristina Ibarrola",     party: "UPN", partyColor: "#4A90D9", voteShare: 30.1, lat: 42.8125, lon: -1.6458, orientation: "right"  },
              { city: "Santander",     winner: "Gema Igual",            party: "PP",  partyColor: "#4A90D9", voteShare: 50.0, lat: 43.4623, lon: -3.8099, orientation: "right"  },
            ],
          },
        ],
      },
    ],
  },
  {
    country: "Italy",
    flag: "🇮🇹",
    elections: [
      {
        year: 2021,
        rounds: [
          {
            date: "2021-10-03",
            label: "3 oct. 2021 — 1er tour",
            cities: [
              { city: "Rome",      winner: "Roberto Gualtieri",  party: "PD",       partyColor: "#E05A6C", voteShare: 42.9, lat: 41.9028, lon: 12.4964, orientation: "left"   },
              { city: "Milan",     winner: "Beppe Sala",         party: "Centre-G.", partyColor: "#E05A6C", voteShare: 57.0, lat: 45.4654, lon: 9.1859,  orientation: "left"   },
              { city: "Naples",    winner: "Gaetano Manfredi",   party: "Centre-G.", partyColor: "#E05A6C", voteShare: 63.3, lat: 40.8518, lon: 14.2681, orientation: "left"   },
              { city: "Bologne",   winner: "Matteo Lepore",      party: "PD",        partyColor: "#E05A6C", voteShare: 63.1, lat: 44.4949, lon: 11.3426, orientation: "left"   },
              { city: "Turin",     winner: "Stefano Lo Russo",   party: "PD",        partyColor: "#E05A6C", voteShare: 46.0, lat: 45.0703, lon: 7.6869,  orientation: "left"   },
              { city: "Trieste",   winner: "Roberto Dipiazza",   party: "FI",        partyColor: "#4A90D9", voteShare: 45.0, lat: 45.6495, lon: 13.7768, orientation: "right"  },
            ],
          },
          {
            date: "2021-10-17",
            label: "17 oct. 2021 — 2e tour",
            cities: [
              { city: "Rome",    winner: "Roberto Gualtieri", party: "PD",        partyColor: "#E05A6C", voteShare: 60.1, lat: 41.9028, lon: 12.4964, orientation: "left"  },
              { city: "Turin",   winner: "Stefano Lo Russo",  party: "PD",        partyColor: "#E05A6C", voteShare: 59.6, lat: 45.0703, lon: 7.6869,  orientation: "left"  },
              { city: "Trieste", winner: "Roberto Dipiazza",  party: "FI",        partyColor: "#4A90D9", voteShare: 59.8, lat: 45.6495, lon: 13.7768, orientation: "right" },
            ],
          },
        ],
      },
      {
        year: 2022,
        rounds: [
          {
            date: "2022-06-12",
            label: "12 juin 2022 — 1er tour",
            cities: [
              { city: "Gênes",     winner: "Marco Bucci",        party: "FdI/FI",   partyColor: "#4A90D9", voteShare: 47.2, lat: 44.4056, lon: 8.9463,  orientation: "right"  },
              { city: "Palerme",   winner: "Roberto Lagalla",    party: "Centre-D.", partyColor: "#4A90D9", voteShare: 48.4, lat: 38.1157, lon: 13.3615, orientation: "right"  },
              { city: "Vérone",    winner: "Damiano Tommasi",    party: "Centre-G.", partyColor: "#E05A6C", voteShare: 40.1, lat: 45.4384, lon: 10.9916, orientation: "left"   },
              { city: "Catane",    winner: "Enrico Trantino",    party: "FdI",       partyColor: "#4A90D9", voteShare: 42.7, lat: 37.5079, lon: 15.0830, orientation: "right"  },
              { city: "Messine",   winner: "Federico Basile",    party: "Ind./Centre.", partyColor: "#888888", voteShare: 49.7, lat: 38.1938, lon: 15.5540, orientation: "other" },
              { city: "Tarente",   winner: "Rinaldo Melucci",    party: "Centre-G.", partyColor: "#E05A6C", voteShare: 44.8, lat: 40.4668, lon: 17.2470, orientation: "left"   },
            ],
          },
          {
            date: "2022-06-26",
            label: "26 juin 2022 — 2e tour",
            cities: [
              { city: "Gênes",   winner: "Marco Bucci",      party: "FdI/FI",    partyColor: "#4A90D9", voteShare: 56.4, lat: 44.4056, lon: 8.9463,  orientation: "right" },
              { city: "Vérone",  winner: "Damiano Tommasi",  party: "Centre-G.", partyColor: "#E05A6C", voteShare: 53.0, lat: 45.4384, lon: 10.9916, orientation: "left"  },
            ],
          },
        ],
      },
      {
        year: 2024,
        rounds: [
          {
            date: "2024-06-08",
            label: "8 juin 2024 — 1er tour",
            cities: [
              { city: "Florence",  winner: "Sara Funaro",      party: "PD",        partyColor: "#E05A6C", voteShare: 43.7, lat: 43.7696, lon: 11.2558, orientation: "left"   },
              { city: "Bari",      winner: "Vito Leccese",     party: "PD/Centre-G.", partyColor: "#E05A6C", voteShare: 46.8, lat: 41.1177, lon: 16.8719, orientation: "left" },
              { city: "Pérouse",   winner: "Vittoria Ferdinandi", party: "Centre-G.", partyColor: "#E05A6C", voteShare: 51.0, lat: 43.1107, lon: 12.3908, orientation: "left" },
              { city: "Cagliari",  winner: "Massimo Zedda",    party: "Centre-G.", partyColor: "#E05A6C", voteShare: 49.7, lat: 39.2238, lon: 9.1217,  orientation: "left"   },
              { city: "Reggio C.", winner: "Giuseppe Falcomatà", party: "PD",     partyColor: "#E05A6C", voteShare: 49.9, lat: 38.1111, lon: 15.6470, orientation: "left"   },
            ],
          },
          {
            date: "2024-06-23",
            label: "23 juin 2024 — 2e tour",
            cities: [
              { city: "Florence",  winner: "Sara Funaro",   party: "PD",        partyColor: "#E05A6C", voteShare: 59.7, lat: 43.7696, lon: 11.2558, orientation: "left" },
              { city: "Bari",      winner: "Vito Leccese",  party: "PD",        partyColor: "#E05A6C", voteShare: 57.2, lat: 41.1177, lon: 16.8719, orientation: "left" },
            ],
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
