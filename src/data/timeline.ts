// Re-export from new per-empire files for backward compatibility
export { ROMAN_TIMELINE } from "./empires/timelines/roman";
export { getEmpireById, EMPIRES } from "./empires/empires-index";

import { ROMAN_TIMELINE as RT } from "./empires/timelines/roman";
import type { TimelineEntry } from "@/types";

export function getEntryBySlug(slug: string): TimelineEntry | undefined {
  return RT.find((e) => e.slug === slug);
}

export function getEntryByYear(year: number): TimelineEntry | undefined {
  return RT.find((e) => e.year === year);
}

export function getAdjacentEntries(slug: string): { prev?: TimelineEntry; next?: TimelineEntry } {
  const index = RT.findIndex((e) => e.slug === slug);
  if (index === -1) return {};
  return {
    prev: index > 0 ? RT[index - 1] : undefined,
    next: index < RT.length - 1 ? RT[index + 1] : undefined,
  };
}
