// Trade balance data — approximate 2024/2025, Mds USD
// Positive = surplus (exports > imports), Negative = deficit
// Sources: WTO, IMF WEO, World Bank BOP

export interface TradeEntry {
  name: string;
  balance_bn: number;   // trade balance, Mds USD
  exports_bn: number;   // total exports, Mds USD
  imports_bn: number;   // total imports, Mds USD
}

const TRADE_DATA: TradeEntry[] = [
  { name: "United States of America", balance_bn: -1100, exports_bn: 3_100, imports_bn: 4_200 },
  { name: "China",                    balance_bn:  820,  exports_bn: 3_600, imports_bn: 2_780 },
  { name: "Germany",                  balance_bn:  270,  exports_bn: 1_700, imports_bn: 1_430 },
  { name: "Japan",                    balance_bn:   30,  exports_bn:   930, imports_bn:   900 },
  { name: "India",                    balance_bn: -110,  exports_bn:   540, imports_bn:   650 },
  { name: "United Kingdom",          balance_bn: -190,  exports_bn:   570, imports_bn:   760 },
  { name: "France",                   balance_bn:  -95,  exports_bn:   680, imports_bn:   775 },
  { name: "Italy",                    balance_bn:   50,  exports_bn:   680, imports_bn:   630 },
  { name: "Brazil",                   balance_bn:   80,  exports_bn:   370, imports_bn:   290 },
  { name: "Canada",                   balance_bn:  -30,  exports_bn:   680, imports_bn:   710 },
  { name: "South Korea",              balance_bn:   80,  exports_bn:   640, imports_bn:   560 },
  { name: "Russia",                   balance_bn:  160,  exports_bn:   480, imports_bn:   320 },
  { name: "Spain",                    balance_bn:   30,  exports_bn:   460, imports_bn:   430 },
  { name: "Australia",                balance_bn:   60,  exports_bn:   400, imports_bn:   340 },
  { name: "Mexico",                   balance_bn:  -15,  exports_bn:   610, imports_bn:   625 },
  { name: "Netherlands",              balance_bn:  110,  exports_bn:   880, imports_bn:   770 },
  { name: "Switzerland",              balance_bn:   90,  exports_bn:   390, imports_bn:   300 },
  { name: "Argentina",                balance_bn:   20,  exports_bn:    75, imports_bn:    55 },
  { name: "Belgium",                  balance_bn:   10,  exports_bn:   540, imports_bn:   530 },
  { name: "Sweden",                   balance_bn:   35,  exports_bn:   250, imports_bn:   215 },
  { name: "Turkey",                   balance_bn:  -50,  exports_bn:   260, imports_bn:   310 },
  { name: "Indonesia",                balance_bn:   30,  exports_bn:   250, imports_bn:   220 },
  { name: "Saudi Arabia",             balance_bn:  160,  exports_bn:   360, imports_bn:   200 },
  { name: "Poland",                   balance_bn:   15,  exports_bn:   380, imports_bn:   365 },
  { name: "Norway",                   balance_bn:  100,  exports_bn:   220, imports_bn:   120 },
  { name: "Austria",                  balance_bn:   20,  exports_bn:   200, imports_bn:   180 },
  { name: "Nigeria",                  balance_bn:   20,  exports_bn:    60, imports_bn:    40 },
  { name: "South Africa",             balance_bn:  -10,  exports_bn:   110, imports_bn:   120 },
  { name: "Thailand",                 balance_bn:   40,  exports_bn:   290, imports_bn:   250 },
  { name: "Egypt",                    balance_bn:  -20,  exports_bn:    45, imports_bn:    65 },
  { name: "Iran",                     balance_bn:   30,  exports_bn:    70, imports_bn:    40 },
  { name: "Malaysia",                 balance_bn:   50,  exports_bn:   310, imports_bn:   260 },
  { name: "Czech Republic",           balance_bn:   20,  exports_bn:   200, imports_bn:   180 },
  { name: "Denmark",                  balance_bn:   35,  exports_bn:   140, imports_bn:   105 },
  { name: "Finland",                  balance_bn:    5,  exports_bn:    90, imports_bn:    85 },
  { name: "Hungary",                  balance_bn:    8,  exports_bn:   145, imports_bn:   137 },
  { name: "Romania",                  balance_bn:  -15,  exports_bn:   100, imports_bn:   115 },
  { name: "Israel",                   balance_bn:  -20,  exports_bn:   110, imports_bn:   130 },
  { name: "Colombia",                 balance_bn:  -15,  exports_bn:    60, imports_bn:    75 },
  { name: "Vietnam",                  balance_bn:   25,  exports_bn:   370, imports_bn:   345 },
  { name: "Bangladesh",               balance_bn:  -10,  exports_bn:    52, imports_bn:    62 },
  { name: "Philippines",              balance_bn:  -25,  exports_bn:    75, imports_bn:   100 },
  { name: "Singapore",                balance_bn:   90,  exports_bn:   560, imports_bn:   470 },
  { name: "UAE",                      balance_bn:   80,  exports_bn:   340, imports_bn:   260 },
  { name: "Chile",                    balance_bn:   20,  exports_bn:    98, imports_bn:    78 },
  { name: "Iraq",                     balance_bn:   50,  exports_bn:   100, imports_bn:    50 },
  { name: "Portugal",                 balance_bn:  -20,  exports_bn:   110, imports_bn:   130 },
  { name: "Kazakhstan",               balance_bn:   30,  exports_bn:    80, imports_bn:    50 },
  { name: "Algeria",                  balance_bn:   30,  exports_bn:    55, imports_bn:    25 },
  { name: "Qatar",                    balance_bn:   60,  exports_bn:    95, imports_bn:    35 },
  { name: "Greece",                   balance_bn:  -30,  exports_bn:    85, imports_bn:   115 },
  { name: "Peru",                     balance_bn:   15,  exports_bn:    70, imports_bn:    55 },
  { name: "Morocco",                  balance_bn:  -20,  exports_bn:    45, imports_bn:    65 },
  { name: "Pakistan",                 balance_bn:  -25,  exports_bn:    30, imports_bn:    55 },
  { name: "Kuwait",                   balance_bn:   40,  exports_bn:    70, imports_bn:    30 },
  { name: "Oman",                     balance_bn:   15,  exports_bn:    45, imports_bn:    30 },
  { name: "Libya",                    balance_bn:   20,  exports_bn:    35, imports_bn:    15 },
  { name: "Tunisia",                  balance_bn:  -10,  exports_bn:    19, imports_bn:    29 },
  { name: "Senegal",                  balance_bn:   -5,  exports_bn:     8, imports_bn:    13 },
  { name: "Cameroon",                 balance_bn:    3,  exports_bn:    10, imports_bn:     7 },
];

const _index = new Map(TRADE_DATA.map(e => [e.name, e]));

export function getTradeByCountry(name: string): TradeEntry | null {
  return _index.get(name) ?? null;
}

export function fmtTradeBalance(bn: number): string {
  const abs = Math.abs(bn);
  const sign = bn >= 0 ? "+" : "−";
  if (abs >= 1000) return `${sign}${(abs / 1000).toFixed(1)} T$`;
  return `${sign}${abs.toLocaleString("fr-FR")} Mds$`;
}
