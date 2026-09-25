"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import type { Article, ArticleSection } from "@/types";
import { BoutonFavori } from "@/components/compte/BoutonFavori";

/* ═══════════════════════════════════════════════════════════════════════════
   LE FORMAT DE LECTURE

   Le format publié pose une colonne et déroule. Celui-ci ajoute ce qui
   manquait pour un article long : une barre de progression, un sommaire qui
   suit la lecture, des respirations entre les blocs, et des encadrés qui
   disent d'où viennent les chiffres.

   Il ne réécrit rien : il rend le corps des articles existants, tel qu'il
   est en base. Les seuls textes ajoutés ici sont des explications de
   méthode, pas des données.
   ═══════════════════════════════════════════════════════════════════════════ */

const EASE = [0.16, 1, 0.3, 1] as const;

/** « fr » → 🇫🇷. Ce qui n'est pas un code à deux lettres est rendu tel quel. */
function drapeau(v?: string): string {
  if (!v) return "";
  if (/^[a-zA-Z]{2}$/.test(v)) {
    return String.fromCodePoint(...[...v.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
  }
  return v;
}

function ancre(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

/* ── Un bloc qui apparaît quand il entre dans le champ ───────────────────── */

function Entrant({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ── Le rendu d'un bloc ──────────────────────────────────────────────────── */

function Bloc({ s, premier }: { s: ArticleSection; premier: boolean }) {
  switch (s.type) {
    case "lead":
      return (
        <p className="lx-lead">
          {s.content}
        </p>
      );

    case "text":
      return (
        <>
          {s.heading && (
            <h2 id={ancre(s.heading)} className="lx-h2">
              <span className="lx-h2-rule" aria-hidden="true" />
              {s.heading}
            </h2>
          )}
          <div className={`lx-texte${premier ? " lx-texte-capitale" : ""}`}>
            {s.content.split(/\n\n+/).map((p, k) => (
              <p key={k}>{p}</p>
            ))}
          </div>
        </>
      );

    case "stats":
      return (
        <Entrant>
          <div className="lx-stats">
            {s.items.map((it) => (
              <div key={it.label} className="lx-stat">
                <span className="lx-stat-v">{it.value}</span>
                <span className="lx-stat-l">{it.label}</span>
                {it.note && <span className="lx-stat-n">{it.note}</span>}
              </div>
            ))}
          </div>
        </Entrant>
      );

    case "highlight":
      return (
        <Entrant>
          <aside className="lx-encadre">
            <span className="lx-encadre-t">À retenir</span>
            <p>{s.content}</p>
          </aside>
        </Entrant>
      );

    case "quote":
      return (
        <Entrant>
          <blockquote className="lx-citation">
            <p>{s.text}</p>
            <cite>{s.source}</cite>
          </blockquote>
        </Entrant>
      );

    case "list":
      return (
        <Entrant>
          <div className="lx-liste-bloc">
            {s.heading && (
              <h3 id={ancre(s.heading)} className="lx-h3">
                {s.heading}
              </h3>
            )}
            <ul className={`lx-liste lx-liste-${s.style ?? "bullet"}`}>
              {s.items.map((it, k) => (
                <li key={k}>
                  <span className="lx-liste-p" aria-hidden="true">
                    {s.style === "number" ? String(k + 1).padStart(2, "0") : s.style === "check" ? "✓" : "—"}
                  </span>
                  <span>
                    <span className="lx-liste-t">{it.text}</span>
                    {it.note && <span className="lx-liste-n">{it.note}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Entrant>
      );

    case "chart": {
      const max = Math.max(...s.bars.map((b) => Math.abs(b.value)), 1);
      return (
        <Entrant>
          <figure className="lx-graph">
            <figcaption>
              <span className="lx-graph-t">{s.title}</span>
              {s.subtitle && <span className="lx-graph-s">{s.subtitle}</span>}
            </figcaption>
            <div className="lx-graph-corps">
              {s.bars.map((b) => (
                <div key={b.label} className="lx-graph-ligne">
                  <span className="lx-graph-nom">
                    {b.flag && <span aria-hidden="true">{drapeau(b.flag)} </span>}
                    {b.label}
                  </span>
                  <span className="lx-graph-piste">
                    <motion.span
                      className="lx-graph-barre"
                      style={{ background: b.color ?? "#0D7A40" }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(Math.abs(b.value) / max) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.85, ease: EASE }}
                    />
                  </span>
                  <span className="lx-graph-v">
                    {b.value.toLocaleString("fr-FR")}
                    {s.unit ? ` ${s.unit}` : ""}
                  </span>
                  {b.note && <span className="lx-graph-n">{b.note}</span>}
                </div>
              ))}
            </div>
          </figure>
        </Entrant>
      );
    }

    case "comparison-table":
      return (
        <Entrant>
          <figure className="lx-tableau">
            <figcaption>{s.title}</figcaption>
            <div className="lx-tableau-defile">
              <table>
                <thead>
                  <tr>
                    <th />
                    {s.headers.map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {s.rows.map((r) => (
                    <tr key={r.label}>
                      <th scope="row">
                        {r.flag && <span aria-hidden="true">{drapeau(r.flag)} </span>}
                        {r.label}
                      </th>
                      {r.cells.map((c, k) => (
                        <td key={k}>{c}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </figure>
        </Entrant>
      );

    case "timeline":
      return (
        <Entrant>
          <div className="lx-frise">
            <h3 className="lx-h3">{s.title}</h3>
            <ol>
              {s.items.map((it) => (
                <li key={it.date}>
                  <span className="lx-frise-d">{it.date}</span>
                  <span className="lx-frise-t">{it.title}</span>
                  <span className="lx-frise-x">{it.description}</span>
                </li>
              ))}
            </ol>
          </div>
        </Entrant>
      );

    case "image-text":
      /* Le format de lecture ne rend pas les images : les articles pointent
         vers des banques externes, et une image manquante casse le rythme
         plus sûrement qu'elle ne l'installe. Le texte, lui, reste. */
      return (
        <>
          <h2 id={ancre(s.heading)} className="lx-h2">
            <span className="lx-h2-rule" aria-hidden="true" />
            {s.heading}
          </h2>
          <div className="lx-texte">
            {s.content.split(/\n\n+/).map((p, k) => (
              <p key={k}>{p}</p>
            ))}
          </div>
        </>
      );

    case "carousel":
      return (
        <Entrant>
          <div className="lx-cartes">
            <h3 className="lx-h3">{s.title}</h3>
            <div className="lx-cartes-grille">
              {s.items.map((it) => (
                <div key={it.name} className="lx-carte">
                  {it.emoji && <span className="lx-carte-e">{it.emoji}</span>}
                  <span className="lx-carte-n">{it.name}</span>
                  <span className="lx-carte-d">{it.detail}</span>
                  {it.subdetail && <span className="lx-carte-s">{it.subdetail}</span>}
                </div>
              ))}
            </div>
          </div>
        </Entrant>
      );

    default:
      return null;
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   LA PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

export function LectureArticle({
  article,
  themeLabel,
  suite,
  connecte = false,
  enregistre = false,
}: {
  article: Article;
  themeLabel: string;
  suite: { slug: string; titre: string; minutes: number }[];
  /** Une session existe : sans elle, le bouton d'enregistrement renvoie
      simplement vers la connexion plutôt que de disparaître sans un mot. */
  connecte?: boolean;
  enregistre?: boolean;
}) {
  const corps = article.body ?? [];
  const zone = useRef<HTMLDivElement>(null);

  /* La barre de progression suit la colonne de lecture, pas la page : le
     pied et les suggestions ne comptent pas comme de la lecture. */
  const { scrollYProgress } = useScroll({ target: zone, offset: ["start start", "end end"] });
  const barre = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.001 });

  const titres = useMemo(
    () =>
      corps
        .filter((s): s is Extract<ArticleSection, { heading?: string }> => "heading" in s && Boolean(s.heading))
        .map((s) => ({ id: ancre(s.heading as string), label: s.heading as string })),
    [corps]
  );

  const [actif, setActif] = useState<string>("");

  useEffect(() => {
    if (!titres.length) return;
    const obs = new IntersectionObserver(
      (entrees) => {
        const visible = entrees.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActif(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -65% 0px", threshold: 0 }
    );
    for (const t of titres) {
      const el = document.getElementById(t.id);
      if (el) obs.observe(el);
    }
    return () => obs.disconnect();
  }, [titres]);

  const lead = corps.find((s) => s.type === "lead");
  const premiersChiffres = corps.find((s) => s.type === "stats");

  return (
    <div className="lx">
      <motion.div className="lx-progression" style={{ scaleX: barre }} aria-hidden="true" />

      {/* ── L'ouverture ──────────────────────────────────────────────────── */}
      <header className="lx-hero">
        <div className="lx-hero-fond" aria-hidden="true" />
        <div className="lx-wrap">
          <p className="lx-fil">
            <Link href="/">Accueil</Link>
            <span>/</span>
            <Link href={`/map/${article.theme}`}>{themeLabel}</Link>
          </p>
          <h1 className="lx-titre">{article.title}</h1>
          <p className="lx-chapo">{article.excerpt}</p>
          <div className="lx-meta">
            <span className="lx-badge">{themeLabel}</span>
            <span>{article.readingTime} min de lecture</span>
            <span>·</span>
            <time dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            </time>
            <span>·</span>
            <span>{corps.length} sections</span>
          </div>
        </div>
      </header>

      <div className="lx-wrap lx-corps">
        {/* ── Le sommaire ────────────────────────────────────────────────── */}
        <nav className="lx-sommaire" aria-label="Sommaire">
          <p className="lx-sommaire-t">Dans cet article</p>
          <ol>
            {titres.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`} className={actif === t.id ? "on" : ""}>
                  {t.label}
                </a>
              </li>
            ))}
          </ol>

          <div className="lx-outils">
            <BoutonFavori slug={article.slug} connecte={connecte} enregistreInitial={enregistre} />
            <Link href="/comparer" className="lx-outil">
              Comparer les pays
            </Link>
            <Link href="/community" className="lx-outil">
              En débattre
            </Link>
          </div>
        </nav>

        {/* ── La colonne de lecture ──────────────────────────────────────── */}
        <article ref={zone} className="lx-colonne">
          {/* En bref : le chapô et les premiers chiffres, remontés. Le lecteur
              qui n'a que trente secondes repart avec quelque chose. */}
          <section className="lx-bref">
            <p className="lx-bref-t">En bref</p>
            {lead && lead.type === "lead" && <p className="lx-bref-p">{lead.content}</p>}
            {premiersChiffres && premiersChiffres.type === "stats" && (
              <div className="lx-bref-chiffres">
                {premiersChiffres.items.slice(0, 3).map((it) => (
                  <span key={it.label}>
                    <strong>{it.value}</strong>
                    {it.label}
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* Le premier `lead` est déjà remonté dans « En bref » : le rendre
              une seconde fois ferait lire deux fois la même phrase. */}
          {corps.map((s, k) =>
            s === lead ? null : <Bloc key={k} s={s} premier={k === (corps[0]?.type === "lead" ? 1 : 0)} />
          )}

          {/* Ce que la donnée dit, et ce qu'elle ne dit pas. */}
          <aside className="lx-methode">
            <p className="lx-methode-t">Comment lire ces chiffres</p>
            <ul>
              <li>
                Les montants économiques viennent des <strong>Indicateurs du développement dans le
                monde</strong> de la Banque mondiale, à leur dernière date publiée.
              </li>
              <li>
                Une année qu&apos;une source ne publie pas reste <strong>absente</strong> : elle
                n&apos;est ni interpolée, ni remplacée par un zéro.
              </li>
              <li>
                Les comparaisons entre pays portent sur des valeurs nominales, sauf mention
                contraire — la parité de pouvoir d&apos;achat donne d&apos;autres classements.
              </li>
            </ul>
            <Link href="/methodology" className="lx-methode-l">
              La méthodologie complète →
            </Link>
          </aside>

          {article.sources && article.sources.length > 0 && (
            <section className="lx-sources">
              <p className="lx-sources-t">Sources</p>
              <ol>
                {article.sources.map((s, k) => (
                  <li key={k}>
                    {s.url ? (
                      <a href={s.url} target="_blank" rel="noreferrer">
                        {s.title}
                      </a>
                    ) : (
                      <span>{s.title}</span>
                    )}
                    {s.outlet && <span className="lx-sources-o"> · {s.outlet}</span>}
                    {s.year && <span className="lx-sources-o"> ({s.year})</span>}
                  </li>
                ))}
              </ol>
            </section>
          )}

          <section className="lx-relance">
            <p className="lx-relance-t">Vous n&apos;êtes pas d&apos;accord ?</p>
            <p className="lx-relance-p">
              Le forum est ouvert : une objection avec sa source vaut mieux qu&apos;un commentaire
              sous l&apos;article.
            </p>
            <Link href="/community" className="lx-relance-b">
              Ouvrir le fil →
            </Link>
          </section>
        </article>
      </div>

      {suite.length > 0 && (
        <section className="lx-wrap lx-suite">
          <p className="lx-suite-t">À lire ensuite</p>
          <div className="lx-suite-grille">
            {suite.map((a) => (
              <Link key={a.slug} href={`/lecture/${a.slug}`} className="lx-suite-c">
                <span className="lx-suite-m">{a.minutes} min</span>
                <span className="lx-suite-h">{a.titre}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
