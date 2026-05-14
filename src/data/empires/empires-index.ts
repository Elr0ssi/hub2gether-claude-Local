import type { TimelineEntry } from "@/types";
import { ROMAN_TIMELINE } from "./timelines/roman";
import { MONGOL_TIMELINE } from "./timelines/mongol";
import { OTTOMAN_TIMELINE } from "./timelines/ottoman";
import { MACEDONIAN_TIMELINE } from "./timelines/macedonian";

export { ROMAN_TIMELINE, MONGOL_TIMELINE, OTTOMAN_TIMELINE, MACEDONIAN_TIMELINE };

export interface EmpireDef {
  id: string;
  name: string;
  nameEn: string;
  period: string;
  defaultYear: number;
  mapCenter: [number, number];
  mapScale: number;
  timeline: TimelineEntry[];
}

export const EMPIRES: EmpireDef[] = [
  {
    id: "roman",
    name: "Empire romain",
    nameEn: "Roman Empire",
    period: "500 av. J.-C. – 1453 ap. J.-C.",
    defaultYear: 117,
    mapCenter: [20, 42],
    mapScale: 600,
    timeline: ROMAN_TIMELINE,
  },
  {
    id: "mongol",
    name: "Empire mongol",
    nameEn: "Mongol Empire",
    period: "1206 – 1368",
    defaultYear: 1279,
    mapCenter: [80, 45],
    mapScale: 300,
    timeline: MONGOL_TIMELINE,
  },
  {
    id: "ottoman",
    name: "Empire ottoman",
    nameEn: "Ottoman Empire",
    period: "1299 – 1914",
    defaultYear: 1566,
    mapCenter: [32, 40],
    mapScale: 500,
    timeline: OTTOMAN_TIMELINE,
  },
  {
    id: "macedonian",
    name: "Empire macédonien",
    nameEn: "Macedonian Empire",
    period: "336 – 323 av. J.-C.",
    defaultYear: -323,
    mapCenter: [50, 35],
    mapScale: 450,
    timeline: MACEDONIAN_TIMELINE,
  },
];

export function getEmpireById(id: string): EmpireDef | undefined {
  return EMPIRES.find((e) => e.id === id);
}
