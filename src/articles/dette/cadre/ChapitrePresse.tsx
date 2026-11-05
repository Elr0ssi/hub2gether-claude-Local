"use client";

import { PresseCarousel } from "@/components/presse/PresseCarousel";
import type { Citation } from "@/data/concept/presse";

/** Le chapitre « Dans la presse » : un carrousel de citations d'articles de médias.
 *  Les citations vivent dans `src/data/concept/presse.ts` (une liste par sujet) ; elles sont à renseigner
 *  avec de vrais articles : tant qu'elles sont des emplacements, le carrousel l'indique.
 *
 *    <ChapitrePresse id="presse" titre="La dette italienne dans la presse" intro="…" citations={PRESSE_DETTE_ITALIE} />
 */
export function ChapitrePresse({
  id = "presse",
  titre,
  intro,
  citations,
}: {
  id?: string;
  titre: string;
  intro: string;
  citations: Citation[];
}) {
  return (
    <section id={id} className="dos-chap dos-chap-presse" aria-labelledby={`${id}-carrousel-t`}>
      <PresseCarousel id={`${id}-carrousel`} titre={titre} intro={intro} citations={citations} />
    </section>
  );
}
