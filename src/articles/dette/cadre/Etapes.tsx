"use client";

import { useState } from "react";

/** Des étapes cliquables : choisir une étape change le panneau. Pour un mécanisme qui se déroule
 *  (« qui vote le budget », « comment la dette se refinance »).
 *
 *    <Etapes
 *      nom="budget"                                   // unique dans l'article : sert aux identifiants d'accessibilité
 *      etapes={[
 *        { titre: "Le gouvernement propose", texte: "Chaque automne…" },
 *        { titre: "Le Parlement vote", texte: "…", chiffre: "577 députés" },   // `chiffre` : facultatif
 *      ]}
 *    />
 */
export function Etapes({
  nom,
  etapes,
}: {
  nom: string;
  etapes: { titre: string; texte: string; chiffre?: string }[];
}) {
  const [n, setN] = useState(0);
  return (
    <div className="dos-etapes">
      <div className="dos-etapes-l" role="tablist" aria-label={nom}>
        {etapes.map((e, i) => (
          <button
            key={e.titre}
            type="button"
            role="tab"
            aria-selected={n === i}
            aria-controls={`${nom}-p${i}`}
            id={`${nom}-b${i}`}
            className={n === i ? "dos-etape-on" : undefined}
            onClick={() => setN(i)}
          >
            <span>{i + 1}</span>
            {e.titre}
          </button>
        ))}
      </div>
      <div className="dos-etapes-p">
        {etapes.map((e, i) => (
          <div
            key={e.titre}
            id={`${nom}-p${i}`}
            role="tabpanel"
            aria-labelledby={`${nom}-b${i}`}
            hidden={n !== i}
            className="dos-etape-p"
          >
            {e.chiffre && <p className="dos-etape-c">{e.chiffre}</p>}
            <h3>{e.titre}</h3>
            <p>{e.texte}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
