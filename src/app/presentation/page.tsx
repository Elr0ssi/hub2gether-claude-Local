import type { Metadata } from "next";
import { PresentationShell } from "@/components/presentation/PresentationShell";

export const metadata: Metadata = {
  title: "Présentation · The Essential Data",
  description:
    "Présentation interactive de soutenance : pitch entrepreneurial et approfondissement de la problématique éditoriale de The Essential Data.",
  // A deck is not a page anyone should land on from search.
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ slide?: string; presenter?: string }>;
}

/**
 * /presentation — the soutenance deck.
 *
 * Query parameters
 *   ?slide=14        jump straight to a slide (1-based); kept in sync while
 *                    navigating, so a reload returns to the same place
 *   ?presenter=true  presenter rail: timer, slide number, speaker notes, next
 *
 * Keyboard: → / Space next · ← previous · Home / End · F fullscreen · O summary
 */
export default async function PresentationPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const parsed = Number.parseInt(params.slide ?? "", 10);
  const initialSlide = Number.isFinite(parsed) ? parsed : undefined;
  const presenter = params.presenter === "true" || params.presenter === "1";

  return <PresentationShell initialSlide={initialSlide} presenter={presenter} />;
}
