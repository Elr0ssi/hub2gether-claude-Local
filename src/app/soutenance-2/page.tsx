import type { Metadata } from "next";
import { DeckShell } from "@/components/soutenance2/DeckShell";

export const metadata: Metadata = {
  title: "Soutenance 2 — The Essential Data",
  description:
    "Soutenance de business plan — version 2 : quinze slides, du problème au passage à l'échelle.",
  // A deck is not a page anyone should land on from search.
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ slide?: string; presenter?: string }>;
}

/**
 * /soutenance-2 — the V2 deck. Independent of /presentation, which keeps
 * running exactly as it does today.
 *
 * Query parameters
 *   ?slide=10        jump straight to a slide (1-based); kept in sync while
 *                    navigating, so a reload returns to the same place
 *   ?presenter=true  presenter rail: timer, notes, next slide, annexes
 *
 * Keyboard: → / Space next · ← previous · Home / End · F fullscreen ·
 *           O summary · A annexes · Esc close
 */
export default async function Soutenance2Page({ searchParams }: PageProps) {
  const params = await searchParams;

  const parsed = Number.parseInt(params.slide ?? "", 10);
  const initialSlide = Number.isFinite(parsed) ? parsed : undefined;
  const presenter = params.presenter === "true" || params.presenter === "1";

  return <DeckShell initialSlide={initialSlide} presenter={presenter} />;
}
