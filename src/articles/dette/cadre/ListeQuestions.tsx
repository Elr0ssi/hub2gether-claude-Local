"use client";

import { ChevronDown } from "lucide-react";

/** La FAQ : des questions qui se déplient. Les mêmes questions doivent figurer dans les données
 *  structurées (`jsonLd` de l'article, voir `registre.ts`) — le balisage ne doit promettre que ce que la page montre.
 *
 *    <Chapitre id="questions" titre="Questions fréquentes sur la dette de l'Italie">
 *      <ListeQuestions questions={FAQ} />
 *    </Chapitre>
 */
export function ListeQuestions({ questions }: { questions: { q: string; r: string }[] }) {
  return (
    <div className="dos-faq">
      {questions.map((f) => (
        <details key={f.q}>
          <summary>
            <span>{f.q}</span>
            <ChevronDown size={18} aria-hidden="true" />
          </summary>
          <p>{f.r}</p>
        </details>
      ))}
    </div>
  );
}
