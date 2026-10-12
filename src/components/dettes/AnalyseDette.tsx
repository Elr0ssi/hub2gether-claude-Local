"use client";

import Link from "next/link";
import { ArrowUpRight, BarChart3 } from "lucide-react";
import { useMonnaieArticle } from "@/components/concept/Monnaie";
import { Faq } from "@/components/seo/Elements";
import { fmtMontant, fmtUnitaire } from "@/lib/montant";
import { ANALYSES, analyseParSlug } from "@/data/dettes/analyses";
import type { Dossier } from "@/data/dettes/dossiers";
import "@/components/seo/seo.css";
import "./dette-dossier.css";

const lien = (slug: string) => (slug === "france" ? "/france/economie/dette-publique" : `/dette-publique/${slug}`);

/** Une analyse comparative : les phrases et les tableaux sont recalculés dans la monnaie du lecteur. */
export function AnalyseDette({ slug, dossiers }: { slug: string; dossiers: Dossier[] }) {
  const analyse = analyseParSlug(slug)!;
  const [mon] = useMonnaieArticle();
  const f = {
    m: (v: number, an: number) => fmtMontant(v, "eur", an, mon, v >= 100 ? 0 : 1),
    u: (v: number, an: number) => fmtUnitaire(v, "eur", an, mon),
  };
  const c = analyse.contenu(dossiers, f);
  const autres = ANALYSES.filter((a) => a.slug !== analyse.slug);

  return (
    <>
      <header className="dd-hero">
        <p className="dd-sur"><BarChart3 size={14} aria-hidden="true" /> Analyse · Dette publique</p>
        <h1 className="dd-h1">{analyse.h1[0]} <span>{analyse.h1[1]}</span></h1>
        <p className="dd-intro">{c.intro}</p>
      </header>

      <section className="dd-sec" aria-label="Chiffres clés">
        <div className="dd-cartes">
          {c.chiffres.map((x, i) => (
            <article key={x.label} className={`dd-carte${i === 0 ? " dd-carte-vif" : ""}`}>
              <h3>{x.label}</h3>
              <strong>{x.valeur}</strong>
              <p>{x.note}</p>
            </article>
          ))}
        </div>
      </section>

      {c.tableaux.map((t, k) => (
        <section key={t.titre} className="dd-sec" aria-labelledby={`an-t${k}`}>
          <h2 id={`an-t${k}`} className="sg-h2">{t.titre}</h2>
          <div className="dd-tab-c">
            <table className="sg-tab">
              <thead>
                <tr>{t.entetes.map((e) => <th key={e} scope="col">{e}</th>)}</tr>
              </thead>
              <tbody>
                {t.lignes.map((l) => (
                  <tr key={l.slug}>
                    <th scope="row"><Link href={lien(l.slug)}>{l.flag} {l.fr}</Link></th>
                    {l.cellules.map((x, i) => <td key={i}>{x}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {t.note && <p className="dd-note">{t.note}</p>}
        </section>
      ))}

      {c.lecture.map((s) => (
        <section key={s.titre} className="dd-sec" aria-label={s.titre}>
          <h2 className="sg-h2">{s.titre}</h2>
          {s.texte.map((p, i) => <p key={i} className="dd-texte">{p}</p>)}
        </section>
      ))}

      <Faq titre="Questions fréquentes" questions={c.faq} />

      <section className="dd-sec" aria-labelledby="an-suite">
        <h2 id="an-suite" className="sg-h2">Continuer la lecture</h2>
        <ul className="sg-liens">
          <li><Link href="/dette-publique">Classement complet : {dossiers.length} pays <ArrowUpRight size={14} aria-hidden="true" style={{ verticalAlign: "-2px" }} /></Link></li>
          {autres.slice(0, 5).map((a) => <li key={a.slug}><Link href={`/dette-publique/analyses/${a.slug}`}>{a.h1[0]} {a.h1[1]}</Link></li>)}
          <li><Link href="/france/economie/dette-publique">Le dossier complet sur la dette de la France</Link></li>
        </ul>
      </section>
    </>
  );
}
