"use client";

import Link from "next/link";
import { ArrowUpRight, Landmark, Percent, TrendingUp, Users } from "lucide-react";
import { useMonnaieArticle } from "@/components/concept/Monnaie";
import { DeviseArticle } from "@/components/concept/DeviseArticle";
import { Faq } from "@/components/seo/Elements";
import { fmtMontant, fmtUnitaire } from "@/lib/montant";
import { avec, deNom, nf } from "@/data/seo/francais";
import { faqDossier, inflationTexte, introDossier } from "@/data/dettes/textes";
import type { Dossier } from "@/data/dettes/dossiers";
import "@/components/seo/seo.css";
import "./dette-dossier.css";

const COULEURS = ["#8b5cff", "#ff6fa5", "#2cc8e6", "#ffb86b", "#7be0a5", "#c06bff"];

/** Le dossier d'un pays : tous les montants s'écrivent dans la monnaie du lecteur. */
export function DossierDette({ d }: { d: Dossier }) {
  const [mon] = useMonnaieArticle();
  const f = {
    m: (v: number, an: number) => fmtMontant(v, "eur", an, mon, v >= 100 ? 0 : 1),
    u: (v: number, an: number) => fmtUnitaire(v, "eur", an, mon),
  };
  const faq = faqDossier(d, f);
  const maxMontant = Math.max(d.d2000, d.d2014, d.d2024);
  const maxRatio = Math.max(d.p2000, d.p2014, d.p2024, 100);
  const points = [
    { an: 2000, m: d.d2000, p: d.p2000 },
    { an: 2014, m: d.d2014, p: d.p2014 },
    { an: 2024, m: d.d2024, p: d.p2024 },
  ];
  const parHab = d.pop2024 ? (d.d2024 * 1e9) / d.pop2024 : null;
  const evo = d.p2024 - d.p2000;

  return (
    <>
      <header className="dd-hero">
        <p className="dd-sur"><Landmark size={14} aria-hidden="true" /> Dossier · Dette publique</p>
        <h1 className="dd-h1">
          <span className="dd-drap" aria-hidden="true">{d.flag}</span>
          Dette publique <span>{deNom(d.fr)}</span>
        </h1>
        <p className="dd-grand">
          {f.m(d.d2024, 2024)}
          <small>en 2024 · {nf(d.p2024, 1)} % du PIB</small>
        </p>
        <p className="dd-intro">{introDossier(d, f)}</p>
        <DeviseArticle className="dd-devise" />
      </header>

      <section className="dd-sec" aria-labelledby="dd-ess">
        <h2 id="dd-ess" className="sg-h2">L&apos;essentiel</h2>
        <div className="dd-cartes">
          <article className="dd-carte dd-carte-vif">
            <span className="dd-i"><Landmark size={18} aria-hidden="true" /></span>
            <h3>Dette en 2024</h3>
            <strong>{f.m(d.d2024, 2024)}</strong>
            <p>{d.rangMontant}{d.rangMontant === 1 ? "er" : "e"} montant sur {d.total} pays</p>
          </article>
          <article className="dd-carte">
            <span className="dd-i"><Percent size={18} aria-hidden="true" /></span>
            <h3>Poids dans le PIB</h3>
            <strong>{nf(d.p2024, 1)} %</strong>
            <p>{d.rangRatio}{d.rangRatio === 1 ? "er" : "e"} rang sur {d.total} pays</p>
          </article>
          {parHab !== null && (
            <article className="dd-carte">
              <span className="dd-i"><Users size={18} aria-hidden="true" /></span>
              <h3>Par habitant</h3>
              <strong>{f.u(parHab, 2024)}</strong>
              <p>pour {nf(d.pop2024! / 1e6, 1)} millions d&apos;habitants</p>
            </article>
          )}
          <article className="dd-carte">
            <span className="dd-i"><TrendingUp size={18} aria-hidden="true" /></span>
            <h3>Depuis 2000</h3>
            <strong>×{nf(d.d2024 / d.d2000, d.d2024 / d.d2000 >= 10 ? 0 : 1)}</strong>
            <p>{Math.abs(evo) < 3 ? "ratio stable" : evo > 0 ? `+${nf(evo, 1)} points de PIB` : `${nf(evo, 1)} points de PIB`}</p>
          </article>
        </div>
      </section>

      <section className="dd-sec" aria-labelledby="dd-evo">
        <h2 id="dd-evo" className="sg-h2">Évolution de 2000 à 2024</h2>
        <div className="dd-graphes">
          <figure className="dd-graphe">
            <figcaption>Montant de la dette</figcaption>
            <div className="dd-barres">
              {points.map((p) => (
                <div key={p.an} className="dd-b">
                  <span className="dd-b-v">{f.m(p.m, p.an)}</span>
                  <span className="dd-b-colonne"><i style={{ height: `${Math.max(6, (p.m / maxMontant) * 100)}%` }} /></span>
                  <span className="dd-b-an">{p.an}</span>
                </div>
              ))}
            </div>
          </figure>
          <figure className="dd-graphe">
            <figcaption>Dette rapportée au PIB</figcaption>
            <div className="dd-barres">
              {points.map((p) => (
                <div key={p.an} className="dd-b dd-b-rose">
                  <span className="dd-b-v">{nf(p.p, 1)} %</span>
                  <span className="dd-b-colonne"><i style={{ height: `${Math.max(6, (p.p / maxRatio) * 100)}%` }} /></span>
                  <span className="dd-b-an">{p.an}</span>
                </div>
              ))}
            </div>
          </figure>
        </div>
        <p className="dd-texte">
          De {f.m(d.d2000, 2000)} en 2000 à {f.m(d.d2024, 2024)} en 2024, la dette {deNom(d.fr)} a progressé de {nf(d.croissance)} % en montant. Mais le montant seul trompe : ce qui compte est son poids dans la richesse produite,
          qui est passé de {nf(d.p2000, 1)} % à {nf(d.p2024, 1)} % du PIB{d.p2014 > Math.max(d.p2000, d.p2024) ? `, après un point haut de ${nf(d.p2014, 1)} % en 2014` : ""}.
        </p>
      </section>

      {d.creanciers.length > 0 && (
        <section className="dd-sec" aria-labelledby="dd-qui">
          <h2 id="dd-qui" className="sg-h2">Qui détient la dette ?</h2>
          <div className="dd-segments" role="img" aria-label={`Répartition indicative des créanciers : ${d.creancierTexte}`}>
            {d.creanciers.map((s, i) => (
              <span key={s.label} style={{ flex: s.pct, background: COULEURS[i % COULEURS.length] }} title={`${s.label} : ${s.pct} %`} />
            ))}
          </div>
          <ul className="dd-legende">
            {d.creanciers.map((s, i) => (
              <li key={s.label}><i style={{ background: COULEURS[i % COULEURS.length] }} />{s.label} <b>{nf(s.pct, s.pct % 1 ? 1 : 0)} %</b></li>
            ))}
          </ul>
          <p className="dd-note">Répartition indicative issue de notre base : les proportions sont approximatives et varient d&apos;une année à l&apos;autre.</p>
        </section>
      )}

      <section className="dd-sec" aria-labelledby="dd-infl">
        <h2 id="dd-infl" className="sg-h2">Dette et inflation</h2>
        <div className="dd-cartes dd-cartes-2">
          <article className="dd-carte">
            <h3>Inflation en 2024</h3>
            <strong>{nf(d.inflation2024, 1)} %</strong>
            <p>Hausse des prix sur un an</p>
          </article>
          <article className="dd-carte">
            <h3>Plus haut historique</h3>
            <strong>{inflationTexte(d.inflationPic)}</strong>
            <p>{d.inflationPicDate}</p>
          </article>
        </div>
        <p className="dd-texte">Une inflation élevée allège la valeur réelle d&apos;une dette libellée dans la monnaie du pays, mais elle renchérit le coût des nouveaux emprunts.</p>
      </section>

      <section className="dd-sec" aria-labelledby="dd-vs">
        <h2 id="dd-vs" className="sg-h2">Les pays au niveau d&apos;endettement le plus proche</h2>
        <div className="dd-tab-c">
          <table className="sg-tab">
            <caption className="sr-only">Pays dont la dette rapportée au PIB est proche de celle {deNom(d.fr)}</caption>
            <thead>
              <tr><th scope="col">Pays</th><th scope="col">Dette / PIB 2024</th><th scope="col">Écart</th></tr>
            </thead>
            <tbody>
              <tr className="dd-moi"><th scope="row">{d.flag} {d.fr}</th><td>{nf(d.p2024, 1)} %</td><td>—</td></tr>
              {d.voisins.map((v) => (
                <tr key={v.slug}>
                  <th scope="row"><Link href={v.slug === "france" ? "/france/economie/dette-publique" : `/dette-publique/${v.slug}`}>{v.flag} {v.fr}</Link></th>
                  <td>{nf(v.p2024, 1)} %</td>
                  <td>{v.p2024 >= d.p2024 ? "+" : "−"}{nf(Math.abs(v.p2024 - d.p2024), 1)} pts</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Faq titre={`Questions sur la dette ${deNom(d.fr)}`} questions={faq} />

      <section className="dd-sec" aria-labelledby="dd-suite">
        <h2 id="dd-suite" className="sg-h2">Aller plus loin</h2>
        <ul className="sg-liens">
          {d.fichePays && <li><Link href={`/pays/${d.fichePays.slug}`}>Fiche {avec(d.fr)} : tous les indicateurs</Link></li>}
          <li><Link href={`/comparer?pays=${encodeURIComponent(d.nom)},France`}>Comparer {avec(d.fr)} et la France</Link></li>
          <li><Link href="/dette-publique">Classement mondial de la dette publique</Link></li>
          <li><Link href="/france/economie/dette-publique">Le dossier complet sur la dette de la France <ArrowUpRight size={14} aria-hidden="true" style={{ verticalAlign: "-2px" }} /></Link></li>
        </ul>
      </section>
    </>
  );
}
