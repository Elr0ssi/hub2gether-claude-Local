// Central aggregator — add FAQs in the per-theme files:
//   src/data/economy/faqs.ts   → economy FAQs
//   src/data/epidemics/faqs.ts → epidemics FAQs
//   src/data/empires/faqs.ts   → empires FAQs
import type { FAQItem } from "@/types";
import { FAQS_ECONOMY } from "./economy/faqs";
import { FAQS_EPIDEMICS } from "./epidemics/faqs";
import { FAQS_EMPIRES } from "./empires/faqs";

export { FAQS_ECONOMY, FAQS_EPIDEMICS, FAQS_EMPIRES };

export function getFaqsByTheme(theme: string): FAQItem[] {
  switch (theme) {
    case "economy":
      return FAQS_ECONOMY;
    case "epidemics":
      return FAQS_EPIDEMICS;
    case "empires":
      return FAQS_EMPIRES;
    default:
      return [];
  }
}
