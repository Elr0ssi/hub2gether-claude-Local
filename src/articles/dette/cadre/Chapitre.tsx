"use client";

import { createContext, useContext } from "react";
import type { ChapitreDef } from "./types";

/* Le sommaire est déclaré une seule fois, dans <ArticleLong chapitres={…}>. Chaque
   <Chapitre> y retrouve son rang pour s'auto-numéroter : on n'écrit jamais « 03 » à la main. */
export const ChapitresContext = createContext<ChapitreDef[]>([]);

/** Un chapitre : un titre direct, la réponse en une phrase, puis le contenu.
 *
 *    <Chapitre
 *      id="deficit"                                  // doit exister dans la liste `chapitres` de l'article
 *      titre="Déficit public de l'Italie"            // un titre qui contient les mots qu'on cherche
 *      reponse={<>Le déficit atteint <b>…</b></>}    // facultatif : la réponse, en une phrase
 *    >
 *      <Figure …>…</Figure>
 *    </Chapitre>
 */
export function Chapitre({
  id,
  titre,
  reponse,
  children,
}: {
  id: string;
  titre: string;
  reponse?: React.ReactNode;
  children: React.ReactNode;
}) {
  const chapitres = useContext(ChapitresContext);
  const rang = chapitres.findIndex((c) => c.id === id) + 1;
  return (
    <section id={id} className="dos-chap" aria-labelledby={`${id}-t`}>
      <header className="dos-chap-t">
        <span className="dos-chap-n">{String(rang).padStart(2, "0")}</span>
        <h2 id={`${id}-t`}>
          {titre}
          <a className="dos-perma" href={`#${id}`} aria-label={`Lien vers « ${titre} »`}>
            #
          </a>
        </h2>
        {reponse && <p className="dos-chap-r">{reponse}</p>}
      </header>
      {children}
    </section>
  );
}
