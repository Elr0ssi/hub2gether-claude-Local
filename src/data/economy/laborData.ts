// Static labor market data per country (retirement age, active population)
// Source: OCDE, OIT, estimations 2023

export interface LaborEntry {
  name: string; // Natural Earth name
  retirement_age: number; // official/effective retirement age
  active_population_millions: number; // working-age population (15-64) in millions
}

export const LABOR_DATA: LaborEntry[] = [
  { name: "United States of America", retirement_age: 67, active_population_millions: 167 },
  { name: "China",                    retirement_age: 58, active_population_millions: 780 },
  { name: "Japan",                    retirement_age: 65, active_population_millions: 69  },
  { name: "Germany",                  retirement_age: 67, active_population_millions: 44  },
  { name: "United Kingdom",           retirement_age: 66, active_population_millions: 34  },
  { name: "France",                   retirement_age: 64, active_population_millions: 30  },
  { name: "Italy",                    retirement_age: 67, active_population_millions: 25  },
  { name: "Brazil",                   retirement_age: 65, active_population_millions: 108 },
  { name: "Canada",                   retirement_age: 65, active_population_millions: 20  },
  { name: "India",                    retirement_age: 60, active_population_millions: 560 },
  { name: "South Korea",              retirement_age: 62, active_population_millions: 28  },
  { name: "Russia",                   retirement_age: 64, active_population_millions: 72  },
  { name: "Spain",                    retirement_age: 66, active_population_millions: 23  },
  { name: "Australia",                retirement_age: 67, active_population_millions: 14  },
  { name: "Mexico",                   retirement_age: 65, active_population_millions: 58  },
  { name: "Netherlands",              retirement_age: 67, active_population_millions: 10  },
  { name: "Switzerland",              retirement_age: 65, active_population_millions: 5   },
  { name: "Argentina",                retirement_age: 63, active_population_millions: 20  },
  { name: "Belgium",                  retirement_age: 65, active_population_millions: 5   },
  { name: "Sweden",                   retirement_age: 65, active_population_millions: 5.5 },
  { name: "Turkey",                   retirement_age: 63, active_population_millions: 33  },
  { name: "Indonesia",                retirement_age: 57, active_population_millions: 143 },
  { name: "Saudi Arabia",             retirement_age: 60, active_population_millions: 15  },
  { name: "Poland",                   retirement_age: 63, active_population_millions: 17  },
  { name: "Norway",                   retirement_age: 67, active_population_millions: 2.7 },
  { name: "Austria",                  retirement_age: 65, active_population_millions: 4.6 },
  { name: "Nigeria",                  retirement_age: 60, active_population_millions: 65  },
  { name: "South Africa",             retirement_age: 60, active_population_millions: 22  },
  { name: "Thailand",                 retirement_age: 60, active_population_millions: 38  },
  { name: "Egypt",                    retirement_age: 60, active_population_millions: 32  },
  { name: "Pakistan",                 retirement_age: 60, active_population_millions: 73  },
  { name: "Iran",                     retirement_age: 58, active_population_millions: 42  },
  { name: "Malaysia",                 retirement_age: 60, active_population_millions: 16  },
  { name: "Algeria",                  retirement_age: 60, active_population_millions: 22  },
  { name: "Colombia",                 retirement_age: 62, active_population_millions: 26  },
  { name: "Chile",                    retirement_age: 65, active_population_millions: 10  },
  { name: "Peru",                     retirement_age: 65, active_population_millions: 17  },
  { name: "Vietnam",                  retirement_age: 62, active_population_millions: 54  },
  { name: "Kazakhstan",               retirement_age: 63, active_population_millions: 10  },
  { name: "Morocco",                  retirement_age: 60, active_population_millions: 18  },
  { name: "Angola",                   retirement_age: 60, active_population_millions: 16  },
  { name: "Kenya",                    retirement_age: 60, active_population_millions: 26  },
  { name: "Ethiopia",                 retirement_age: 60, active_population_millions: 55  },
  { name: "Ghana",                    retirement_age: 60, active_population_millions: 14  },
  { name: "Tanzania",                 retirement_age: 60, active_population_millions: 28  },
  { name: "Jordan",                   retirement_age: 60, active_population_millions: 5   },
  { name: "Iraq",                     retirement_age: 63, active_population_millions: 20  },
  { name: "Qatar",                    retirement_age: 60, active_population_millions: 2   },
  { name: "United Arab Emirates",     retirement_age: 60, active_population_millions: 6   },
  { name: "Denmark",                  retirement_age: 67, active_population_millions: 3.6 },
  { name: "Finland",                  retirement_age: 65, active_population_millions: 2.8 },
  { name: "Greece",                   retirement_age: 67, active_population_millions: 5   },
  { name: "Portugal",                 retirement_age: 66, active_population_millions: 5   },
  { name: "Czech Republic",           retirement_age: 64, active_population_millions: 5.5 },
  { name: "Hungary",                  retirement_age: 65, active_population_millions: 5   },
  { name: "Romania",                  retirement_age: 65, active_population_millions: 9   },
  { name: "Venezuela",                retirement_age: 60, active_population_millions: 14  },
  { name: "Mozambique",               retirement_age: 60, active_population_millions: 13  },
  { name: "Tunisia",                  retirement_age: 62, active_population_millions: 6   },
  { name: "Libya",                    retirement_age: 65, active_population_millions: 4   },
  { name: "Zimbabwe",                 retirement_age: 65, active_population_millions: 7   },
  { name: "Zambia",                   retirement_age: 55, active_population_millions: 9   },
];

export function getLaborByCountry(name: string): LaborEntry | undefined {
  return LABOR_DATA.find((l) => l.name === name);
}
