export interface CityResult {
  city: string;
  winner: string;
  party: string;
  partyColor: string;
  voteShare: number;
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
              { city: "Paris", winner: "Bertrand Delanoë", party: "PS", partyColor: "#E05A6C", voteShare: 48.1 },
              { city: "Lyon", winner: "Gérard Collomb", party: "PS", partyColor: "#E05A6C", voteShare: 42.6 },
              { city: "Marseille", winner: "Jean-Claude Gaudin", party: "RPR-UDF", partyColor: "#4A90D9", voteShare: 51.2 },
              { city: "Bordeaux", winner: "Alain Juppé", party: "RPR", partyColor: "#4A90D9", voteShare: 54.7 },
              { city: "Toulouse", winner: "Philippe Douste-Blazy", party: "UDF", partyColor: "#5BA8D4", voteShare: 48.8 },
              { city: "Nantes", winner: "Jean-Marc Ayrault", party: "PS", partyColor: "#E05A6C", voteShare: 50.3 },
              { city: "Lille", winner: "Martine Aubry", party: "PS", partyColor: "#E05A6C", voteShare: 49.6 },
              { city: "Nice", winner: "Jacques Peyrat", party: "RPR", partyColor: "#4A90D9", voteShare: 52.3 },
              { city: "Strasbourg", winner: "Fabienne Keller", party: "UDF-RPR", partyColor: "#4A90D9", voteShare: 46.1 },
              { city: "Rennes", winner: "Edmond Hervé", party: "PS", partyColor: "#E05A6C", voteShare: 53.4 },
            ],
          },
          {
            date: "2001-03-18",
            label: "18 mars 2001 — 2e tour",
            cities: [
              { city: "Paris", winner: "Bertrand Delanoë", party: "PS", partyColor: "#E05A6C", voteShare: 48.8 },
              { city: "Lyon", winner: "Gérard Collomb", party: "PS", partyColor: "#E05A6C", voteShare: 43.5 },
              { city: "Toulouse", winner: "Philippe Douste-Blazy", party: "UDF", partyColor: "#5BA8D4", voteShare: 50.2 },
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
              { city: "Paris", winner: "Bertrand Delanoë", party: "PS", partyColor: "#E05A6C", voteShare: 49.2 },
              { city: "Lyon", winner: "Gérard Collomb", party: "PS", partyColor: "#E05A6C", voteShare: 41.8 },
              { city: "Marseille", winner: "Jean-Claude Gaudin", party: "UMP", partyColor: "#4A90D9", voteShare: 48.3 },
              { city: "Bordeaux", winner: "Alain Juppé", party: "UMP", partyColor: "#4A90D9", voteShare: 56.6 },
              { city: "Toulouse", winner: "Pierre Cohen", party: "PS", partyColor: "#E05A6C", voteShare: 38.4 },
              { city: "Nantes", winner: "Jean-Marc Ayrault", party: "PS", partyColor: "#E05A6C", voteShare: 52.7 },
              { city: "Lille", winner: "Martine Aubry", party: "PS", partyColor: "#E05A6C", voteShare: 45.6 },
              { city: "Nice", winner: "Christian Estrosi", party: "UMP", partyColor: "#4A90D9", voteShare: 53.0 },
              { city: "Strasbourg", winner: "Roland Ries", party: "PS", partyColor: "#E05A6C", voteShare: 41.2 },
              { city: "Rennes", winner: "Daniel Delaveau", party: "PS", partyColor: "#E05A6C", voteShare: 49.8 },
            ],
          },
          {
            date: "2008-03-16",
            label: "16 mars 2008 — 2e tour",
            cities: [
              { city: "Paris", winner: "Bertrand Delanoë", party: "PS", partyColor: "#E05A6C", voteShare: 58.2 },
              { city: "Lyon", winner: "Gérard Collomb", party: "PS", partyColor: "#E05A6C", voteShare: 53.6 },
              { city: "Toulouse", winner: "Pierre Cohen", party: "PS", partyColor: "#E05A6C", voteShare: 51.3 },
              { city: "Strasbourg", winner: "Roland Ries", party: "PS", partyColor: "#E05A6C", voteShare: 52.7 },
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
              { city: "Paris", winner: "Anne Hidalgo", party: "PS", partyColor: "#E05A6C", voteShare: 34.4 },
              { city: "Lyon", winner: "Gérard Collomb", party: "PS", partyColor: "#E05A6C", voteShare: 40.8 },
              { city: "Marseille", winner: "Jean-Claude Gaudin", party: "UMP", partyColor: "#4A90D9", voteShare: 43.8 },
              { city: "Bordeaux", winner: "Alain Juppé", party: "UMP", partyColor: "#4A90D9", voteShare: 61.4 },
              { city: "Toulouse", winner: "Jean-Luc Moudenc", party: "UMP", partyColor: "#4A90D9", voteShare: 38.2 },
              { city: "Nantes", winner: "Johanna Rolland", party: "PS", partyColor: "#E05A6C", voteShare: 43.5 },
              { city: "Lille", winner: "Martine Aubry", party: "PS", partyColor: "#E05A6C", voteShare: 44.7 },
              { city: "Nice", winner: "Christian Estrosi", party: "UMP", partyColor: "#4A90D9", voteShare: 58.3 },
              { city: "Strasbourg", winner: "Roland Ries", party: "PS", partyColor: "#E05A6C", voteShare: 36.0 },
              { city: "Montpellier", winner: "Philippe Saurel", party: "DVG", partyColor: "#E08050", voteShare: 37.8 },
            ],
          },
          {
            date: "2014-03-30",
            label: "30 mars 2014 — 2e tour",
            cities: [
              { city: "Paris", winner: "Anne Hidalgo", party: "PS", partyColor: "#E05A6C", voteShare: 54.0 },
              { city: "Lyon", winner: "Gérard Collomb", party: "PS", partyColor: "#E05A6C", voteShare: 61.0 },
              { city: "Toulouse", winner: "Jean-Luc Moudenc", party: "UMP", partyColor: "#4A90D9", voteShare: 50.8 },
              { city: "Strasbourg", winner: "Roland Ries", party: "PS", partyColor: "#E05A6C", voteShare: 50.2 },
              { city: "Montpellier", winner: "Philippe Saurel", party: "DVG", partyColor: "#E08050", voteShare: 52.3 },
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
              { city: "Paris", winner: "Anne Hidalgo", party: "PS", partyColor: "#E05A6C", voteShare: 29.3 },
              { city: "Lyon", winner: "Grégory Doucet", party: "EELV", partyColor: "#52A855", voteShare: 28.5 },
              { city: "Marseille", winner: "Michèle Rubirola", party: "Gauche", partyColor: "#E05A6C", voteShare: 25.9 },
              { city: "Bordeaux", winner: "Pierre Hurmic", party: "EELV", partyColor: "#52A855", voteShare: 34.5 },
              { city: "Toulouse", winner: "Jean-Luc Moudenc", party: "LR", partyColor: "#4A90D9", voteShare: 36.3 },
              { city: "Nantes", winner: "Johanna Rolland", party: "PS", partyColor: "#E05A6C", voteShare: 40.5 },
              { city: "Lille", winner: "Martine Aubry", party: "PS", partyColor: "#E05A6C", voteShare: 41.7 },
              { city: "Nice", winner: "Christian Estrosi", party: "LR", partyColor: "#4A90D9", voteShare: 56.5 },
              { city: "Strasbourg", winner: "Jeanne Barseghian", party: "EELV", partyColor: "#52A855", voteShare: 28.4 },
              { city: "Montpellier", winner: "Michaël Delafosse", party: "PS", partyColor: "#E05A6C", voteShare: 33.5 },
            ],
          },
          {
            date: "2020-06-28",
            label: "28 juin 2020 — 2e tour (report COVID)",
            cities: [
              { city: "Paris", winner: "Anne Hidalgo", party: "PS", partyColor: "#E05A6C", voteShare: 50.2 },
              { city: "Lyon", winner: "Grégory Doucet", party: "EELV", partyColor: "#52A855", voteShare: 51.3 },
              { city: "Marseille", winner: "Michèle Rubirola", party: "Gauche", partyColor: "#E05A6C", voteShare: 41.7 },
              { city: "Bordeaux", winner: "Pierre Hurmic", party: "EELV", partyColor: "#52A855", voteShare: 46.1 },
              { city: "Toulouse", winner: "Jean-Luc Moudenc", party: "LR", partyColor: "#4A90D9", voteShare: 51.3 },
              { city: "Strasbourg", winner: "Jeanne Barseghian", party: "EELV", partyColor: "#52A855", voteShare: 51.4 },
              { city: "Montpellier", winner: "Michaël Delafosse", party: "PS", partyColor: "#E05A6C", voteShare: 51.3 },
              { city: "Rennes", winner: "Nathalie Appéré", party: "PS", partyColor: "#E05A6C", voteShare: 53.2 },
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
              { city: "Munich", winner: "Dieter Reiter", party: "SPD", partyColor: "#E05A6C", voteShare: 47.2 },
              { city: "Nuremberg", winner: "Marcus König", party: "CSU", partyColor: "#4A90D9", voteShare: 39.0 },
              { city: "Augsburg", winner: "Eva Weber", party: "CSU", partyColor: "#4A90D9", voteShare: 33.5 },
              { city: "Würzburg", winner: "Christian Schuchardt", party: "FDP", partyColor: "#FFD54F", voteShare: 38.6 },
              { city: "Regensburg", winner: "Gertrud Maltz-Schwarzfischer", party: "SPD", partyColor: "#E05A6C", voteShare: 48.3 },
            ],
          },
          {
            date: "2020-09-13",
            label: "13 sept. 2020 — Rhénanie-du-Nord-Westphalie",
            region: "NRW",
            cities: [
              { city: "Cologne", winner: "Henriette Reker", party: "Indépendant (CDU+Verts)", partyColor: "#6A9A6A", voteShare: 59.6 },
              { city: "Düsseldorf", winner: "Stephan Keller", party: "CDU", partyColor: "#4A90D9", voteShare: 52.7 },
              { city: "Dortmund", winner: "Thomas Westphal", party: "SPD", partyColor: "#E05A6C", voteShare: 54.7 },
              { city: "Essen", winner: "Thomas Kufen", party: "CDU", partyColor: "#4A90D9", voteShare: 56.0 },
              { city: "Münster", winner: "Markus Lewe", party: "CDU", partyColor: "#4A90D9", voteShare: 57.4 },
              { city: "Bochum", winner: "Thomas Eiskirch", party: "SPD", partyColor: "#E05A6C", voteShare: 48.2 },
              { city: "Wuppertal", winner: "Uwe Schneidewind", party: "Verts", partyColor: "#52A855", voteShare: 42.5 },
            ],
          },
          {
            date: "2020-10-18",
            label: "18 oct. 2020 — Basse-Saxe",
            region: "Basse-Saxe",
            cities: [
              { city: "Hanovre", winner: "Belit Onay", party: "Verts", partyColor: "#52A855", voteShare: 56.3 },
              { city: "Brunswick", winner: "Thorsten Kornblum", party: "SPD", partyColor: "#E05A6C", voteShare: 51.4 },
              { city: "Osnabrück", winner: "Wolfgang Griesert", party: "CDU", partyColor: "#4A90D9", voteShare: 47.8 },
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
              { city: "Francfort", winner: "Mike Josef", party: "SPD", partyColor: "#E05A6C", voteShare: 46.3 },
              { city: "Wiesbaden", winner: "Gert-Uwe Mende", party: "SPD", partyColor: "#E05A6C", voteShare: 53.8 },
              { city: "Kassel", winner: "Christian Geselle", party: "SPD", partyColor: "#E05A6C", voteShare: 61.0 },
              { city: "Darmstadt", winner: "Hanno Benz", party: "SPD", partyColor: "#E05A6C", voteShare: 55.2 },
            ],
          },
          {
            date: "2021-09-26",
            label: "26 sept. 2021 — Rhénanie-Palatinat",
            region: "Rhénanie-Palatinat",
            cities: [
              { city: "Mayence", winner: "Michael Ebling", party: "SPD", partyColor: "#E05A6C", voteShare: 60.9 },
              { city: "Ludwigshafen", winner: "Jutta Steinruck", party: "SPD", partyColor: "#E05A6C", voteShare: 51.9 },
              { city: "Coblence", winner: "David Langner", party: "SPD", partyColor: "#E05A6C", voteShare: 54.5 },
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
              { city: "Stuttgart", winner: "Frank Nopper", party: "CDU", partyColor: "#4A90D9", voteShare: 40.2 },
              { city: "Karlsruhe", winner: "Frank Mentrup", party: "SPD", partyColor: "#E05A6C", voteShare: 43.5 },
              { city: "Freiburg-en-Brisgau", winner: "Martin Horn", party: "Indépendant", partyColor: "#888888", voteShare: 51.6 },
              { city: "Heidelberg", winner: "Eckart Würzner", party: "Indépendant", partyColor: "#888888", voteShare: 60.4 },
              { city: "Mannheim", winner: "Christian Specht", party: "CDU", partyColor: "#4A90D9", voteShare: 36.4 },
            ],
          },
          {
            date: "2024-06-09",
            label: "9 juin 2024 — Saxe",
            region: "Saxe",
            cities: [
              { city: "Dresde", winner: "Dirk Hilbert", party: "FDP/lib.", partyColor: "#FFD54F", voteShare: 60.9 },
              { city: "Leipzig", winner: "Burkhard Jung", party: "SPD", partyColor: "#E05A6C", voteShare: 62.3 },
              { city: "Chemnitz", winner: "Sven Schulze", party: "SPD", partyColor: "#E05A6C", voteShare: 52.8 },
            ],
          },
          {
            date: "2024-06-09",
            label: "9 juin 2024 — Thuringe",
            region: "Thuringe",
            cities: [
              { city: "Erfurt", winner: "Andreas Bausewein", party: "SPD", partyColor: "#E05A6C", voteShare: 58.4 },
              { city: "Gera", winner: "Julian Vonarb", party: "CDU", partyColor: "#4A90D9", voteShare: 43.2 },
              { city: "Iéna", winner: "Thomas Nitzsche", party: "FDP", partyColor: "#FFD54F", voteShare: 54.1 },
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
  { name: "France", flag: "🇫🇷" },
  { name: "Germany", flag: "🇩🇪" },
  { name: "United Kingdom", flag: "🇬🇧" },
  { name: "United States", flag: "🇺🇸" },
  { name: "Russia", flag: "🇷🇺" },
  { name: "China", flag: "🇨🇳" },
  { name: "Italy", flag: "🇮🇹" },
  { name: "Spain", flag: "🇪🇸" },
  { name: "Japan", flag: "🇯🇵" },
  { name: "Brazil", flag: "🇧🇷" },
  { name: "India", flag: "🇮🇳" },
  { name: "Turkey", flag: "🇹🇷" },
  { name: "Argentina", flag: "🇦🇷" },
  { name: "Mexico", flag: "🇲🇽" },
  { name: "Poland", flag: "🇵🇱" },
  { name: "Hungary", flag: "🇭🇺" },
  { name: "Iran", flag: "🇮🇷" },
  { name: "South Korea", flag: "🇰🇷" },
  { name: "South Africa", flag: "🇿🇦" },
  { name: "Sweden", flag: "🇸🇪" },
  { name: "Australia", flag: "🇦🇺" },
  { name: "Canada", flag: "🇨🇦" },
];

export const COUNTRY_NAMES_FR: Record<string, string> = {
  "France": "France",
  "Germany": "Allemagne",
  "United Kingdom": "Royaume-Uni",
  "United States": "États-Unis",
  "Russia": "Russie",
  "China": "Chine",
  "Italy": "Italie",
  "Spain": "Espagne",
  "Japan": "Japon",
  "Brazil": "Brésil",
  "India": "Inde",
  "Turkey": "Turquie",
  "Argentina": "Argentine",
  "Mexico": "Mexique",
  "Poland": "Pologne",
  "Hungary": "Hongrie",
  "Iran": "Iran",
  "South Korea": "Corée du Sud",
  "South Africa": "Afrique du Sud",
  "Sweden": "Suède",
  "Australia": "Australie",
  "Canada": "Canada",
};
