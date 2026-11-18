import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { FicheCatalogue } from "@/data/articles-catalogue";
import "./une.css";

/* ═══════════════════════════════════════════════════════════════════════════
   LA PAGE ARTICLES, MISE EN PAGE COMME UN JOURNAL

   La une (un grand article et ses titres voisins), les sujets les plus traités, les formats longs sur une bande, les analyses,
   une colonne par rubrique, les dossiers pays de A à Z ; la recherche dans toutes les archives vient en dernier.
   Tout est calculé à partir du catalogue : aucun chiffre d'audience, aucune date inventée.
   ═══════════════════════════════════════════════════════════════════════════ */

const TEINTES = [
  "linear-gradient(150deg, #3a14b8, #7c4dff 70%, #ff6fa5)",
  "linear-gradient(150deg, #0d6b6b, #2fb5a1 60%, #6bd6a8)",
  "linear-gradient(150deg, #7a2a12, #e2683c 60%, #ffb86b)",
  "linear-gradient(150deg, #13315c, #2f6fd0 60%, #7fb2ff)",
  "linear-gradient(150deg, #4b1248, #b8338e 60%, #ff8fc7)",
];
const teinte = (i: number) => TEINTES[i % TEINTES.length];
const lienRubrique = (r: string) => `/articles?rubrique=${encodeURIComponent(r)}#archives`;

export function UneArticles({ articles }: { articles: FicheCatalogue[] }) {
  const longs = articles.filter((a) => a.type === "Article long");
  const analyses = articles.filter((a) => a.type === "Analyse");
  const dossiers = articles.filter((a) => a.type === "Dossier pays").sort((a, b) => a.titre.localeCompare(b.titre, "fr"));
  const lectures = articles.filter((a) => a.type === "Lecture");

  const une = longs[0] ?? analyses[0] ?? articles[0];
  const aussi = [...longs.slice(1), ...analyses].filter((a) => a.id !== une?.id).slice(0, 4);
  const enBref = analyses.filter((a) => !aussi.includes(a)).slice(0, 4);

  /* Les sujets les plus traités : les pays et les thématiques qui reviennent le plus dans le catalogue. */
  const parPays = new Map<string, { fr: string; n: number }>();
  for (const a of articles) for (const p of a.pays) parPays.set(p.slug, { fr: p.fr, n: (parPays.get(p.slug)?.n ?? 0) + 1 });
  const paysSuivis = [...parPays.entries()].sort((a, b) => b[1].n - a[1].n || a[1].fr.localeCompare(b[1].fr, "fr")).slice(0, 12);
  const parRubrique = new Map<string, number>();
  for (const a of articles) parRubrique.set(a.rubrique, (parRubrique.get(a.rubrique) ?? 0) + 1);
  const rubriques = [...parRubrique.entries()].sort((a, b) => b[1] - a[1]);

  /* Une colonne par rubrique des lectures, comme les pages d'un quotidien. */
  const colonnes = new Map<string, FicheCatalogue[]>();
  for (const a of lectures) colonnes.set(a.rubrique, [...(colonnes.get(a.rubrique) ?? []), a]);
  const sections = [...colonnes.entries()].sort((a, b) => b[1].length - a[1].length);

  /* Les dossiers pays, rangés par initiale. */
  const lettres = new Map<string, FicheCatalogue[]>();
  for (const d of dossiers) {
    const nom = d.pays[0]?.fr ?? d.titre.replace(/^Dette publique : /, "");
    const l = nom.normalize("NFD").replace(/[̀-ͯ]/g, "").charAt(0).toUpperCase();
    lettres.set(l, [...(lettres.get(l) ?? []), d]);
  }

  const nav = [
    { id: "une", label: "À la une" },
    { id: "tendances", label: "Tendances" },
    ...(longs.length ? [{ id: "formats-longs", label: "Formats longs" }] : []),
    ...(analyses.length ? [{ id: "analyses", label: "Analyses" }] : []),
    ...(sections.length ? [{ id: "rubriques", label: "Rubriques" }] : []),
    ...(dossiers.length ? [{ id: "dossiers", label: "Dossiers pays" }] : []),
    { id: "archives", label: "Archives" },
  ];

  return (
    <div className="un">
      <nav className="un-nav" aria-label="Sections de la page">
        {nav.map((n) => <a key={n.id} href={`#${n.id}`}>{n.label}</a>)}
      </nav>

      {/* ── À la une ─────────────────────────────────────────────────────── */}
      {une && (
        <section id="une" className="un-une" aria-label="À la une">
          <Link href={une.href} className="un-lead">
            <span className="un-cover" style={{ background: teinte(0) }} aria-hidden="true">
              <span className="un-cover-k">{une.type}</span>
            </span>
            <span className="un-k">À la une · {une.rubrique}</span>
            <strong className="un-lead-t">{une.titre}</strong>
            <span className="un-lead-c">{une.chapo}</span>
            <span className="un-lire">Lire l’article <ArrowRight size={15} aria-hidden="true" /></span>
          </Link>

          <div className="un-aussi">
            <h2 className="un-h3">Aussi à la une</h2>
            <ul>
              {aussi.map((a, i) => (
                <li key={a.id}>
                  <Link href={a.href}>
                    <span className="un-mini" style={{ background: teinte(i + 1) }} aria-hidden="true" />
                    <span>
                      <span className="un-k">{a.type} · {a.rubrique}</span>
                      <strong>{a.titre}</strong>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {enBref.length > 0 && (
            <div className="un-bref">
              <h2 className="un-h3">En bref</h2>
              <ol>
                {enBref.map((a) => (
                  <li key={a.id}>
                    <Link href={a.href}>
                      <strong>{a.titre}</strong>
                      <span>{a.chapo}</span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </section>
      )}

      {/* ── Tendances : ce qui revient le plus dans le catalogue ──────────────── */}
      <section id="tendances" className="un-tend">
        <div>
          <h2 className="un-h2">Tendances <small>les pays les plus traités</small></h2>
          <div className="un-chips">
            {paysSuivis.map(([slug, p], i) => (
              <Link key={slug} href={`/articles?pays=${slug}#archives`} className="un-chip">
                <b>{String(i + 1).padStart(2, "0")}</b>{p.fr}<em>{p.n}</em>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="un-h2">Thématiques</h2>
          <ul className="un-themes">
            {rubriques.map(([r, n]) => (
              <li key={r}>
                <Link href={lienRubrique(r)}>
                  <span>{r}</span>
                  <i style={{ width: `${Math.max(8, (n / rubriques[0][1]) * 100)}%` }} aria-hidden="true" />
                  <em>{n}</em>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Formats longs ────────────────────────────────────────────────── */}
      {longs.length > 0 && (
        <section id="formats-longs" className="un-longs">
          <div className="un-longs-tete">
            <h2 className="un-h2">Formats longs <small>{longs.length} enquêtes</small></h2>
          </div>
          <div className="un-longs-l">
            {longs.map((a, i) => (
              <Link key={a.id} href={a.href} className="un-long">
                <span className="un-long-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="un-k">{a.pays.map((p) => p.fr).join(", ") || a.rubrique}</span>
                <strong>{a.titre}</strong>
                <span className="un-long-c">{a.chapo}</span>
                <span className="un-lire">Lire <ArrowUpRight size={14} aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Analyses ─────────────────────────────────────────────────────── */}
      {analyses.length > 0 && (
        <section id="analyses" className="un-sec">
          <h2 className="un-h2">Analyses <small>{analyses.length} comparaisons</small></h2>
          <div className="un-grille">
            {analyses.map((a, i) => (
              <Link key={a.id} href={a.href} className="un-carte">
                <span className="un-carte-b" style={{ background: teinte(i) }} aria-hidden="true" />
                <span className="un-k">{a.rubrique}</span>
                <strong>{a.titre}</strong>
                <span className="un-carte-c">{a.chapo}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Une colonne par rubrique ─────────────────────────────────────── */}
      {sections.length > 0 && (
        <section id="rubriques" className="un-sec">
          <h2 className="un-h2">Rubriques</h2>
          <div className="un-cols">
            {sections.map(([r, l]) => (
              <div key={r} className="un-col">
                <h3><Link href={lienRubrique(r)}>{r} <ArrowRight size={14} aria-hidden="true" /></Link></h3>
                <Link href={l[0].href} className="un-col-une">
                  <strong>{l[0].titre}</strong>
                  <span>{l[0].chapo}</span>
                </Link>
                <ul>
                  {l.slice(1, 5).map((a) => <li key={a.id}><Link href={a.href}>{a.titre}</Link></li>)}
                </ul>
                {l.length > 5 && <Link className="un-plus" href={lienRubrique(r)}>{l.length - 5 > 1 ? `${l.length - 5} autres articles` : "1 autre article"}</Link>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Dossiers pays, de A à Z ──────────────────────────────────────── */}
      {dossiers.length > 0 && (
        <section id="dossiers" className="un-sec">
          <h2 className="un-h2">Dossiers pays <small>dette publique, {dossiers.length} pays</small></h2>
          <div className="un-az">
            {[...lettres.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([l, ds]) => (
              <div key={l} className="un-az-g">
                <b>{l}</b>
                {ds.map((d) => <Link key={d.id} href={d.href}>{d.pays[0]?.fr ?? d.titre.replace(/^Dette publique : /, "")}</Link>)}
              </div>
            ))}
          </div>
        </section>
      )}

      <h2 id="archives" className="un-h2 un-archives">Toutes les archives</h2>
    </div>
  );
}
