// Trade balance (external balance on goods and services), in Mds USD, for the 7 snapshot years (2000, 2005, 2010, 2015, 2020, 2023, 2025).
// Positive = surplus (exports > imports), negative = deficit. Covers the major trading economies —
// estimates based on IMF/WTO/World Bank historical trends, not extracted live (see dataNote on ECONOMY_YEARS).
// Smaller economies not listed here show "—" in the rankings/map rather than an unreliable guess.
import { ECONOMY_YEARS_LIST } from "./populationData";

export const TRADE_BALANCE_BY_COUNTRY: Record<string, [number, number, number, number, number, number, number]> = {
  "United States of America": [-380, -722, -494, -500, -653, -773, -900],
  China: [24, 134, 181, 595, 524, 823, 900],
  Japan: [70, 76, 59, -8, 0, -20, 10],
  Germany: [59, 158, 155, 248, 183, 207, 220],
  "United Kingdom": [-31, -65, -50, -110, -30, -130, -150],
  France: [18, -5, -30, -23, -43, -70, -80],
  Italy: [10, -8, -30, 40, 60, 30, 35],
  Brazil: [-1, 44, 20, 20, 32, 80, 70],
  Canada: [33, 50, -10, -15, -20, -5, -10],
  India: [-6, -35, -100, -100, -30, -110, -120],
  "South Korea": [12, 23, 38, 90, 45, 15, 40],
  Russia: [60, 118, 147, 146, 93, 140, 150],
  Spain: [-25, -70, -50, 15, 15, 15, 25],
  Australia: [-15, -25, 10, -15, 50, 60, 50],
  Mexico: [-8, -12, -3, -15, 33, -15, -10],
  Netherlands: [15, 40, 60, 75, 95, 110, 120],
  Switzerland: [8, 15, 25, 45, 45, 60, 70],
  "Saudi Arabia": [22, 90, 120, 40, 30, 160, 150],
  Norway: [26, 45, 58, 25, 15, 100, 90],
  Indonesia: [25, 28, 30, 8, 22, 30, 25],
  Singapore: [9, 25, 40, 55, 70, 90, 95],
  "United Arab Emirates": [15, 45, 50, 65, 50, 80, 85],
  Turkey: [-9, -22, -45, -60, -35, -50, -55],
  Poland: [-8, -3, -12, 2, 10, 15, 18],
  Belgium: [10, 10, 5, 8, 10, 10, 12],
  Sweden: [13, 20, 12, 15, 20, 35, 30],
  Israel: [-5, -3, -8, -5, -10, -20, -25],
  Vietnam: [-1, -3, -12, 2, 19, 25, 28],
  Thailand: [5, -8, 15, 30, 25, 40, 35],
  Malaysia: [15, 20, 30, 20, 30, 50, 48],
  Egypt: [-8, -9, -25, -40, -30, -20, -22],
  "South Africa": [1, -3, -2, -5, 12, -10, -8],
  Argentina: [1, 12, 12, -3, 12, 20, 18],
  Colombia: [1, -1, -2, -15, -10, -15, -15],
  Qatar: [5, 18, 30, 30, 15, 60, 55],
  Iraq: [5, 10, 25, 10, 5, 50, 45],
  Kuwait: [12, 30, 30, 15, 10, 40, 35],
  Algeria: [10, 24, 15, -15, -5, 30, 25],
  Chile: [2, 10, 15, 3, 18, 20, 18],
  Peru: [0, 5, 6, -3, 8, 15, 14],
  Nigeria: [8, 25, 30, -5, -3, 20, 18],
  Pakistan: [-2, -7, -10, -20, -20, -25, -22],
  Bangladesh: [-2, -3, -5, -10, -15, -10, -10],
  Philippines: [-4, -5, -7, -12, -20, -25, -22],
  Portugal: [-10, -15, -15, -5, -15, -20, -18],
  "Czech Republic": [-2, 0, 5, 15, 15, 20, 18],
  Denmark: [5, 5, 10, 15, 25, 35, 32],
  Finland: [8, 5, 0, -2, 0, 5, 4],
  Austria: [-3, 2, 5, 5, 8, 15, 12],
  Romania: [-2, -8, -5, -5, -15, -15, -12],
  Greece: [-15, -25, -25, -10, -20, -30, -28],
};

export function getTradeBalanceBn(countryName: string, year: number): number | undefined {
  const series = TRADE_BALANCE_BY_COUNTRY[countryName];
  if (!series) return undefined;
  const idx = ECONOMY_YEARS_LIST.indexOf(year as (typeof ECONOMY_YEARS_LIST)[number]);
  if (idx === -1) return undefined;
  return series[idx];
}
