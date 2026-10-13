"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowRight, ChevronDown, Landmark, MessageCircle, Users } from "lucide-react";
import { EnTete } from "@/components/concept/pieces";
import type { Sujet } from "@/data/concept/sujets";
import { ChapitresContext } from "./Chapitre";
import type { ChapitreDef, Suggestion } from "./types";
import "@/components/concept/concept.css";
import "./dossier.css";

/* ═══════════════════════════════════════════════════════════════════════════
   LE SQUELETTE D'UN ARTICLE LONG

   Le menu du site, le grand titre avec son chiffre, le sommaire qui suit la
   lecture, la colonne centrale (les chapitres), la colonne de droite (en voir
   plus, à lire aussi, sources) et la fin de page (« Continuer »).

   Un article ne dessine rien de cela : il remplit les propriétés et pose ses
   chapitres entre les balises.

     <ArticleLong
       fil={[{ label: "Accueil", href: "/" }, { label: "Dette publique", href: "/dette-publique" }, { label: "Italie" }]}
       surtitre="Dette publique de l'Italie"
       chiffre={<><Compteur valeur={3200} decimales={0} /><small>Md€</small></>}
       chapo={<><b>137 % du PIB</b> en 2024.</>}
       chapitres={CHAPITRES}                       // la liste du sommaire, dans l'ordre de la page
       suggestions={suggestions}                   // 3 à 4 lectures proposées en fin de page
       sujet={SUJETS["dette-publique-italie"]}     // facultatif : globe et forum liés (src/data/concept/sujets.ts)
       sources="INSEE · Banque de France"          // le texte du bloc « Sources » de la colonne de droite
     >
       <Chapitre id="essentiel" …>…</Chapitre>
       <Chapitre id="evolution" …>…</Chapitre>
     </ArticleLong>
   ═══════════════════════════════════════════════════════════════════════════ */

interface Props {
  /** Le fil d'Ariane. Le dernier élément (sans `href`) est la page courante. */
  fil: { label: string; href?: string }[];
  /** Petit titre au-dessus du grand chiffre : « Dette publique de la France ». */
  surtitre: string;
  /** Le grand chiffre du titre. Pour un montant : `<Compteur …/>` suivi de `<small>unité</small>`. */
  chiffre: React.ReactNode;
  /** La phrase sous le titre : la valeur en ratio, la date, la source. */
  chapo: React.ReactNode;
  chapitres: ChapitreDef[];
  suggestions: Suggestion[];
  sujet?: Sujet;
  /** Le contenu du bloc « Sources » (colonne de droite) : une ligne de texte. */
  sources: string;
  children: React.ReactNode;
}

/* ── Sommaire à gauche, progression en haut ──────────────────────────────── */

function Sommaire({ chapitres }: { chapitres: ChapitreDef[] }) {
  const [part, setPart] = useState(0);
  const [actif, setActif] = useState<string>(chapitres[0]?.id ?? "");

  const lis = useCallback(() => {
    const h = document.documentElement;
    const total = h.scrollHeight - window.innerHeight;
    setPart(total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0);
    let courant: string = chapitres[0]?.id ?? "";
    for (const c of chapitres) {
      const n = document.getElementById(c.id);
      if (n && n.getBoundingClientRect().top < window.innerHeight * 0.36) courant = c.id;
    }
    setActif(courant);
  }, [chapitres]);

  useEffect(() => {
    lis();
    window.addEventListener("scroll", lis, { passive: true });
    window.addEventListener("resize", lis);
    return () => {
      window.removeEventListener("scroll", lis);
      window.removeEventListener("resize", lis);
    };
  }, [lis]);

  return (
    <>
      <div className="dos-barre" aria-hidden="true">
        <span style={{ transform: `scaleX(${part})` }} />
      </div>
      <nav className="dos-som" aria-label="Chapitres du dossier">
        <p className="dos-som-t">Dans ce dossier</p>
        <ol>
          {chapitres.map((c, i) => (
            <li key={c.id}>
              <a href={`#${c.id}`} className={actif === c.id ? "dos-som-on" : undefined}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {c.court}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

/* ── Un bloc repliable de la colonne de droite ───────────────────────────── */

function Rail({
  titre,
  ouvert = true,
  children,
  classe = "",
}: {
  titre: string;
  ouvert?: boolean;
  children: React.ReactNode;
  classe?: string;
}) {
  const [o, setO] = useState(ouvert);
  return (
    <div className={`dos-rail-c ${classe}`}>
      <button type="button" className="dos-rail-b" aria-expanded={o} onClick={() => setO(!o)}>
        {titre}
        <ChevronDown size={16} aria-hidden="true" className={o ? "dos-rail-ouv" : undefined} />
      </button>
      <div className="dos-rail-corps" hidden={!o}>
        {children}
      </div>
    </div>
  );
}

/* ── Le squelette ────────────────────────────────────────────────────────── */

export function ArticleLong({ fil, surtitre, chiffre, chapo, chapitres, suggestions, sujet, sources, children }: Props) {
  return (
    <ChapitresContext.Provider value={chapitres}>
      <div className="dos">
        <div className="cg dp-menu">
          <EnTete actif="Dette" />
        </div>
        <div className="dos-fond" aria-hidden="true" />

        {/* ── Ouverture ───────────────────────────────────────────────────── */}
        <header className="dos-ouv">
          <nav className="dos-fil" aria-label="Fil d'Ariane">
            {fil.map((f, i) => (
              <span key={f.label} style={{ display: "contents" }}>
                {i > 0 && <span aria-hidden="true">/</span>}
                {f.href ? <a href={f.href}>{f.label}</a> : <span>{f.label}</span>}
              </span>
            ))}
          </nav>
          <h1 className="dos-h1">
            <span className="dos-h1-s">{surtitre}</span>
            <span className="dos-h1-v">{chiffre}</span>
          </h1>
          <p className="dos-chapo">{chapo}</p>
        </header>

        <div className="dos-grille">
          <Sommaire chapitres={chapitres} />
          <main className="dos-col">
            {children}

            {/* ── La suite ──────────────────────────────────────────────────── */}
            <section className="dos-suite" aria-labelledby="dos-suite-t">
              <h2 id="dos-suite-t">Continuer</h2>
              <div className="dos-suite-g">
                {suggestions.map((s, i) => (
                  <a key={s.href} href={s.href} className={`dos-sug${i === 0 ? " dos-sug-vif" : ""}`}>
                    <span className="dos-sug-r">{s.rubrique}</span>
                    <span className="dos-sug-t">{s.titre}</span>
                    <ArrowRight size={18} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </section>
          </main>

          {/* ── Colonne de droite ───────────────────────────────────────────── */}
          <aside className="dos-rail" aria-label="Autres pages">
            {sujet && (
              <Rail titre="En voir plus sur le sujet" classe="dos-rail-explore">
                <a href={sujet.globe.href}>
                  <span className="dos-rail-i">
                    {sujet.globe.theme === "demographie" ? <Users size={16} aria-hidden="true" /> : <Landmark size={16} aria-hidden="true" />}
                  </span>
                  {sujet.globe.label}
                </a>
                {sujet.forum.map((f) => (
                  <a key={f.fil} href={`/forum#${f.fil}`}>
                    <span className="dos-rail-i"><MessageCircle size={16} aria-hidden="true" /></span>
                    <span>
                      <small className="dos-rail-pt">En débattre</small>
                      {f.titre}
                    </span>
                  </a>
                ))}
              </Rail>
            )}

            <Rail titre="À lire aussi">
              <ul>
                {suggestions.map((s) => (
                  <li key={s.href}>
                    <a href={s.href}>
                      <span>{s.rubrique}</span>
                      {s.titre}
                    </a>
                  </li>
                ))}
              </ul>
            </Rail>

            <Rail titre="Sources" ouvert={false} classe="dos-rail-src">
              <p>{sources}</p>
              <a href="/methodologie-donnees">Notre méthode →</a>
            </Rail>
          </aside>
        </div>
      </div>
    </ChapitresContext.Provider>
  );
}
