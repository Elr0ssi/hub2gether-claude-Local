"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Newspaper } from "lucide-react";
import type { Citation } from "@/data/concept/presse";
import { useGlisser } from "@/lib/useGlisser";
import "./presse.css";

/* Un carrousel d'articles de presse. Il défile au doigt, à la molette
   horizontale et aux flèches ; les cartes sont de vrais liens, et les
   emplacements encore vides le disent franchement. */
export function PresseCarousel({
  titre,
  intro,
  citations,
  id,
}: {
  titre: string;
  intro?: string;
  citations: Citation[];
  id?: string;
}) {
  const glisse = useGlisser<HTMLUListElement>();
  const piste = glisse.ref;
  const [debut, setDebut] = useState(true);
  const [fin, setFin] = useState(false);

  const mesure = useCallback(() => {
    const n = piste.current;
    if (!n) return;
    setDebut(n.scrollLeft < 8);
    setFin(n.scrollLeft + n.clientWidth > n.scrollWidth - 8);
  }, []);

  useEffect(() => {
    mesure();
    const n = piste.current;
    n?.addEventListener("scroll", mesure, { passive: true });
    window.addEventListener("resize", mesure);
    return () => {
      n?.removeEventListener("scroll", mesure);
      window.removeEventListener("resize", mesure);
    };
  }, [mesure]);

  const va = (sens: 1 | -1) => {
    const n = piste.current;
    if (n) n.scrollBy({ left: sens * Math.min(n.clientWidth * 0.8, 640), behavior: "smooth" });
  };

  const reels = citations.filter((c) => !c.exemple).length;

  return (
    <section className="pc" id={id} aria-labelledby={id ? `${id}-t` : undefined}>
      <header className="pc-tete">
        <div>
          <h2 id={id ? `${id}-t` : undefined} className="pc-t">
            {titre}
          </h2>
          {intro && <p className="pc-i">{intro}</p>}
        </div>
        <div className="pc-fl" role="group" aria-label="Faire défiler">
          <button type="button" onClick={() => va(-1)} disabled={debut} aria-label="Précédent">
            <ArrowLeft size={18} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => va(1)} disabled={fin} aria-label="Suivant">
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </header>

      <ul className="pc-piste" {...glisse}>
        {citations.map((c, i) => {
          const corps = (
            <>
              <span className="pc-media">
                <Newspaper size={15} aria-hidden="true" />
                {c.media}
              </span>
              <span className="pc-titre">{c.titre}</span>
              <span className="pc-pied">
                <em>{c.sujet}</em>
                {c.exemple ? (
                  <b>Exemple</b>
                ) : (
                  <ArrowUpRight size={18} aria-hidden="true" />
                )}
              </span>
            </>
          );
          return (
            <li key={`${c.sujet}-${i}`} className={`pc-carte${c.exemple ? " pc-vide" : ""}`}>
              {c.exemple ? (
                <div className="pc-lien">{corps}</div>
              ) : (
                /* Un lien sortant vers une source tierce : rel sans transmission
                   d'autorité superflue, sans référent. */
                <a className="pc-lien" href={c.url} target="_blank" rel="noopener noreferrer">
                  {corps}
                </a>
              )}
            </li>
          );
        })}
      </ul>
      {reels === 0 && (
        <p className="pc-note">
          Emplacements à renseigner : chaque carte deviendra un lien vers l&apos;article cité, avec
          son média et sa date.
        </p>
      )}
    </section>
  );
}
