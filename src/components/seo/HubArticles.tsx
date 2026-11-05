"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import type { FicheCatalogue } from "@/data/articles-catalogue";

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
type Groupe = "rubrique" | "pays" | "type";
const TOUS = "";

/** La page « Tous les articles » : recherche, filtres (thématique, type, pays) et trois façons de ranger.
 *  La liste complète est dans le HTML dès le rendu serveur ; les filtres s'appliquent ensuite.
 *  Les filtres se lisent dans l'adresse (?pays=france&rubrique=Dette publique&q=…). */
export function HubArticles({ articles }: { articles: FicheCatalogue[] }) {
  const [q, setQ] = useState("");
  const [rubrique, setRubrique] = useState(TOUS);
  const [type, setType] = useState(TOUS);
  const [pays, setPays] = useState(TOUS);
  const [groupe, setGroupe] = useState<Groupe>("rubrique");

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setQ(p.get("q") ?? "");
    setRubrique(p.get("rubrique") ?? TOUS);
    setType(p.get("type") ?? TOUS);
    const pa = p.get("pays") ?? TOUS;
    setPays(pa);
    if (pa) setGroupe("rubrique");
  }, []);

  const options = useMemo(() => {
    const r = new Map<string, number>();
    const t = new Map<string, number>();
    const p = new Map<string, string>();
    for (const a of articles) {
      r.set(a.rubrique, (r.get(a.rubrique) ?? 0) + 1);
      t.set(a.type, (t.get(a.type) ?? 0) + 1);
      for (const x of a.pays) p.set(x.slug, x.fr);
    }
    return {
      rubriques: [...r.entries()].sort((a, b) => b[1] - a[1]),
      types: [...t.entries()].sort((a, b) => b[1] - a[1]),
      pays: [...p.entries()].sort((a, b) => a[1].localeCompare(b[1], "fr")),
    };
  }, [articles]);

  const vus = useMemo(() => {
    const n = norm(q.trim());
    return articles.filter(
      (a) =>
        (!rubrique || a.rubrique === rubrique) &&
        (!type || a.type === type) &&
        (!pays || a.pays.some((x) => x.slug === pays)) &&
        (!n || norm(`${a.titre} ${a.chapo} ${a.rubrique} ${a.mots} ${a.pays.map((x) => x.fr).join(" ")}`).includes(n)),
    );
  }, [articles, q, rubrique, type, pays]);

  const sections = useMemo(() => {
    const m = new Map<string, FicheCatalogue[]>();
    const ajoute = (cle: string, a: FicheCatalogue) => m.set(cle, [...(m.get(cle) ?? []), a]);
    for (const a of vus) {
      if (groupe === "rubrique") ajoute(a.rubrique, a);
      else if (groupe === "type") ajoute(a.type, a);
      else if (a.pays.length === 0 || a.pays.length > 3) ajoute("Plusieurs pays ou sujet général", a);
      else for (const x of a.pays) ajoute(x.fr, a);
    }
    return [...m.entries()].sort((a, b) => {
      if (groupe === "pays") return a[0].startsWith("Plusieurs") ? -1 : b[0].startsWith("Plusieurs") ? 1 : a[0].localeCompare(b[0], "fr");
      return b[1].length - a[1].length;
    });
  }, [vus, groupe]);

  const actif = Boolean(q || rubrique || type || pays);
  const raz = () => { setQ(""); setRubrique(TOUS); setType(TOUS); setPays(TOUS); };

  return (
    <div className="sg-hub">
      <div className="sg-hub-barre">
        <label className="sg-arts-rech sg-hub-rech">
          <Search size={16} aria-hidden="true" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Chercher un article, un pays, un sujet" aria-label="Chercher un article" />
        </label>
        <select value={rubrique} onChange={(e) => setRubrique(e.target.value)} aria-label="Thématique">
          <option value={TOUS}>Toutes les thématiques</option>
          {options.rubriques.map(([r, n]) => <option key={r} value={r}>{r} ({n})</option>)}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)} aria-label="Type d'article">
          <option value={TOUS}>Tous les types</option>
          {options.types.map(([t, n]) => <option key={t} value={t}>{t} ({n})</option>)}
        </select>
        <select value={pays} onChange={(e) => setPays(e.target.value)} aria-label="Pays">
          <option value={TOUS}>Tous les pays</option>
          {options.pays.map(([s, fr]) => <option key={s} value={s}>{fr}</option>)}
        </select>
      </div>

      <div className="sg-hub-ligne">
        <span role="group" aria-label="Ranger par" className="sg-hub-groupes">
          Ranger par
          {(["rubrique", "pays", "type"] as const).map((g) => (
            <button key={g} type="button" aria-pressed={groupe === g} onClick={() => setGroupe(g)}>
              {g === "rubrique" ? "Thématique" : g === "pays" ? "Pays" : "Type"}
            </button>
          ))}
        </span>
        <span className="sg-hub-n" aria-live="polite">
          {vus.length} article{vus.length > 1 ? "s" : ""}
          {actif && <button type="button" onClick={raz}>Tout afficher</button>}
        </span>
      </div>

      {vus.length === 0 && <p className="sg-note">Aucun article ne correspond à cette recherche.</p>}

      {sections.map(([titre, liste]) => (
        <section key={titre} className="sg-hub-sec">
          <h2 className="sg-hub-h">{titre}<small>{liste.length}</small></h2>
          <ul className="sg-hub-liste">
            {liste.map((a) => (
              <li key={`${titre}-${a.id}`}>
                <Link href={a.href}>
                  <span className="sg-art-r">{a.type}</span>
                  <strong>{a.titre}</strong>
                  <span className="sg-art-c">{a.chapo}</span>
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
