"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { AgregatAnnee, RangPays } from "@/data/neo/agregats";

/* ═══════════════════════════════════════════════════════════════════════════
   LA CONSOLE

   Une seule page, une seule hauteur d'écran : rien à faire défiler. Un
   curseur d'année pilote tout ce qui est à l'écran en même temps — la
   courbe, les compteurs, le classement — et un bouton lecture le fait
   avancer seul, de 1960 à aujourd'hui.

   C'est le contraire de la version précédente, qui empilait des sections
   hautes et n'avait qu'un seul point d'entrée. Ici la page ne raconte rien :
   elle se manipule.

   Toutes les valeurs viennent du socle. Aucune n'est écrite ici.
   ═══════════════════════════════════════════════════════════════════════════ */

const VERT = "#39FF88";
const ENCRE = "#EDF2EF";
const ENCRE_2 = "#8E9793";
const ENCRE_3 = "#565E5B";
const TRAIT = "rgba(255,255,255,0.10)";

function compact(n: number): string {
  const a = Math.abs(n);
  if (a >= 1000) return `${(n / 1000).toFixed(1).replace(".", ",")} T`;
  return `${Math.round(n)} Md`;
}

/* ── Un chiffre qui se remplace sans sauter ──────────────────────────────── */

function Chiffre({ children, taille = 34 }: { children: string; taille?: number }) {
  return (
    <span
      style={{
        fontSize: taille,
        fontWeight: 800,
        letterSpacing: "-0.035em",
        fontVariantNumeric: "tabular-nums",
        lineHeight: 1,
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
}

/* ── Un panneau, avec ses équerres ───────────────────────────────────────── */

function Panneau({
  titre,
  droite,
  children,
  style,
}: {
  titre: string;
  droite?: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <section className="nc-panneau" style={style}>
      <span className="nc-eq nc-eq-tl" aria-hidden="true" />
      <span className="nc-eq nc-eq-br" aria-hidden="true" />
      <header className="nc-panneau-tete">
        <span className="nc-label">{titre}</span>
        {droite}
      </header>
      <div className="nc-panneau-corps">{children}</div>
    </section>
  );
}

/* ── La courbe ───────────────────────────────────────────────────────────── */

function Courbe({
  agregats,
  i,
  onPick,
}: {
  agregats: readonly AgregatAnnee[];
  i: number;
  onPick: (i: number) => void;
}) {
  const L = 1000;
  const H = 260;
  const px = 4;
  const py = 16;

  const { trace, aire, x, y } = useMemo(() => {
    const max = Math.max(...agregats.map((a) => a.pib));
    const x = (k: number) => px + (k * (L - px * 2)) / (agregats.length - 1);
    const y = (v: number) => H - py - (v / max) * (H - py * 2);
    const trace = agregats.map((a, k) => `${k ? "L" : "M"} ${x(k).toFixed(1)} ${y(a.pib).toFixed(1)}`).join(" ");
    const aire = `${trace} L ${x(agregats.length - 1).toFixed(1)} ${H - py} L ${px} ${H - py} Z`;
    return { trace, aire, x, y };
  }, [agregats]);

  const cx = x(i);
  const cy = y(agregats[i].pib);

  /* Le tracé jusqu'à l'année courante, en pleine lumière ; le reste en veille.
     On voit d'un coup où l'on en est dans la profondeur de la base. */
  const parcouru = agregats
    .slice(0, i + 1)
    .map((a, k) => `${k ? "L" : "M"} ${x(k).toFixed(1)} ${y(a.pib).toFixed(1)}`)
    .join(" ");

  const ref = useRef<SVGSVGElement>(null);
  const viser = useCallback(
    (e: React.PointerEvent) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const t = (e.clientX - r.left) / r.width;
      onPick(Math.max(0, Math.min(agregats.length - 1, Math.round(t * (agregats.length - 1)))));
    },
    [agregats.length, onPick]
  );

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${L} ${H}`}
      preserveAspectRatio="none"
      className="nc-courbe"
      onPointerDown={viser}
      onPointerMove={(e) => e.buttons === 1 && viser(e)}
    >
      <defs>
        <linearGradient id="nc-aire" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={VERT} stopOpacity="0.30" />
          <stop offset="100%" stopColor={VERT} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Les décennies, en repères verticaux. */}
      {agregats.map((a, k) =>
        a.annee % 10 === 0 ? (
          <line key={a.annee} x1={x(k)} x2={x(k)} y1={py - 8} y2={H - py} stroke={TRAIT} />
        ) : null
      )}
      <line x1={px} x2={L - px} y1={H - py} y2={H - py} stroke={TRAIT} />

      <path d={aire} fill="url(#nc-aire)" opacity={0.5} />
      <path d={trace} fill="none" stroke={VERT} strokeOpacity={0.22} strokeWidth={2} vectorEffect="non-scaling-stroke" />
      <motion.path
        d={parcouru}
        fill="none"
        stroke={VERT}
        strokeWidth={2.5}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={false}
      />
      <motion.line
        x1={cx}
        x2={cx}
        y1={py - 8}
        y2={H - py}
        stroke={VERT}
        strokeOpacity={0.5}
        vectorEffect="non-scaling-stroke"
        animate={{ x1: cx, x2: cx }}
        transition={{ type: "spring", stiffness: 340, damping: 34 }}
      />
      <motion.circle
        r={5}
        fill="#06070A"
        stroke={VERT}
        strokeWidth={2.5}
        vectorEffect="non-scaling-stroke"
        animate={{ cx, cy }}
        transition={{ type: "spring", stiffness: 340, damping: 34 }}
      />
    </svg>
  );
}

/* ── Le classement ───────────────────────────────────────────────────────── */

function Rangs({ rangs }: { rangs: readonly RangPays[] }) {
  const max = rangs.length ? rangs[0].pib : 1;
  return (
    <div className="nc-rangs">
      {rangs.map((r, k) => (
        <motion.div key={r.nom} layout transition={{ type: "spring", stiffness: 420, damping: 38 }} className="nc-rang">
          <span className="nc-rang-n">{String(k + 1).padStart(2, "0")}</span>
          <span className="nc-rang-nom" style={{ color: k === 0 ? VERT : ENCRE }}>
            {r.nom}
          </span>
          <span className="nc-rang-piste">
            <motion.span
              className="nc-rang-barre"
              style={{ background: k === 0 ? VERT : "rgba(57,255,136,0.38)" }}
              animate={{ width: `${(r.pib / max) * 100}%` }}
              transition={{ type: "spring", stiffness: 220, damping: 30 }}
            />
          </span>
          <span className="nc-rang-val">{compact(r.pib)}€</span>
        </motion.div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LA PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

export interface ConsoleProps {
  agregats: AgregatAnnee[];
  rangs: Record<number, RangPays[]>;
  articles: { slug: string; titre: string; theme: string }[];
  une: { slug: string; titre: string; theme: string; chapo: string; minutes: number };
  secondaires: { slug: string; titre: string; theme: string; minutes: number }[];
  fils: { id: string; titre: string; ancre: string; libelle: string; theme: string }[];
  terrains: { slug: string; label: string; ligne: string; ouverte: boolean }[];
}

export function NeoConsole({ agregats, rangs, articles, une, secondaires, fils, terrains }: ConsoleProps) {
  const [i, setI] = useState(agregats.length - 1);
  const [joue, setJoue] = useState(false);
  const a = agregats[i];

  /* La lecture. Une année toutes les 110 ms : assez lent pour lire le
     classement se réordonner, assez rapide pour parcourir 66 ans en 7 s. */
  useEffect(() => {
    if (!joue) return;
    const t = setInterval(() => {
      setI((k) => {
        if (k >= agregats.length - 1) {
          setJoue(false);
          return k;
        }
        return k + 1;
      });
    }, 110);
    return () => clearInterval(t);
  }, [joue, agregats.length]);

  const lire = useCallback(() => {
    setI((k) => (k >= agregats.length - 1 ? 0 : k));
    setJoue((j) => !j);
  }, [agregats.length]);

  /* Flèches et barre d'espace : la page se pilote au clavier. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && ["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
      if (e.key === "ArrowRight") setI((k) => Math.min(agregats.length - 1, k + 1));
      else if (e.key === "ArrowLeft") setI((k) => Math.max(0, k - 1));
      else if (e.key === " ") {
        e.preventDefault();
        lire();
      } else return;
      setJoue(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [agregats.length, lire]);

  const premier = agregats[0];
  const dernier = agregats[agregats.length - 1];
  const part = ((i / (agregats.length - 1)) * 100).toFixed(2);

  const kpis = [
    { l: "PIB cumulé", v: `${compact(a.pib)}€`, s: `${a.pays} pays couverts` },
    { l: "Inflation médiane", v: a.inflation === null ? "—" : `${a.inflation.toFixed(1).replace(".", ",")} %`, s: "des pays publiés" },
    { l: "Excédents", v: `${a.excedent}`, s: `sur ${a.paysBalance} balances` },
    {
      l: `Depuis ${premier.annee}`,
      v: `× ${(a.pib / premier.pib).toFixed(a.pib / premier.pib < 10 ? 1 : 0).replace(".", ",")}`,
      s: "PIB cumulé",
    },
  ];

  return (
    <div className="nl-page">
      <div className="nc">
      <div className="nc-scan" aria-hidden="true" />

      {/* ── La barre de tête ─────────────────────────────────────────────── */}
      <header className="nc-tete">
        <div className="nc-tete-gauche">
          <span className="nc-vivant" aria-hidden="true" />
          <h1 className="nc-titre">
            La base, <span>en direct</span>
          </h1>
          <span className="nc-sous">
            {premier.annee}–{dernier.annee} · {dernier.pays} pays · 4 indicateurs
          </span>
        </div>

        <div className="nc-annee">
          <motion.span
            key={a.annee}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="nc-annee-n"
          >
            {a.annee}
          </motion.span>
          <button type="button" onClick={lire} className="nc-play" aria-label={joue ? "Pause" : "Lecture"}>
            {joue ? (
              <svg width="13" height="14" viewBox="0 0 13 14" aria-hidden="true">
                <rect x="1" y="1" width="4" height="12" fill="currentColor" />
                <rect x="8" y="1" width="4" height="12" fill="currentColor" />
              </svg>
            ) : (
              <svg width="13" height="14" viewBox="0 0 13 14" aria-hidden="true">
                <path d="M2 1 L12 7 L2 13 Z" fill="currentColor" />
              </svg>
            )}
          </button>
        </div>

        <div className="nc-tete-droite">
          <Link href="/map/economy" className="nc-btn nc-btn-plein">
            Carte
          </Link>
          <Link href="/comparer" className="nc-btn">
            Dashboard
          </Link>
          <Link href="/community" className="nc-btn">
            Community
          </Link>
        </div>
      </header>

      {/* ── La grille ────────────────────────────────────────────────────── */}
      <div className="nc-grille">
        {/* Les compteurs */}
        <div className="nc-kpis">
          {kpis.map((k) => (
            <Panneau key={k.l} titre={k.l}>
              <Chiffre>{k.v}</Chiffre>
              <p className="nc-kpi-s">{k.s}</p>
            </Panneau>
          ))}
        </div>

        {/* La courbe */}
        <Panneau
          titre="PIB cumulé des pays couverts"
          droite={<span className="nc-mini">glissez sur la courbe · ← → · espace</span>}
          style={{ gridArea: "courbe" }}
        >
          <Courbe agregats={agregats} i={i} onPick={setI} />
          <div className="nc-piste">
            <span className="nc-piste-fond">
              <motion.span className="nc-piste-fait" animate={{ width: `${part}%` }} transition={{ duration: 0.12 }} />
            </span>
            <div className="nc-decennies">
              {agregats.map((g, k) =>
                g.annee % 10 === 0 ? (
                  <button
                    key={g.annee}
                    type="button"
                    className={`nc-dec${k === i ? " nc-dec-actif" : ""}`}
                    onClick={() => {
                      setI(k);
                      setJoue(false);
                    }}
                    style={{ left: `${(k / (agregats.length - 1)) * 100}%` }}
                  >
                    {g.annee}
                  </button>
                ) : null
              )}
            </div>
          </div>
        </Panneau>

        {/* Le classement */}
        <Panneau titre="Les huit premières économies" droite={<span className="nc-mini">{a.annee}</span>} style={{ gridArea: "rangs" }}>
          <Rangs rangs={rangs[a.annee] ?? []} />
        </Panneau>

        {/* Les publications */}
        <Panneau
          titre="À lire"
          droite={
            <Link href="/community" className="nc-mini nc-mini-lien">
              en débattre →
            </Link>
          }
          style={{ gridArea: "lire" }}
        >
          <div className="nc-lire">
            {articles.map((ar) => (
              <Link key={ar.slug} href={`/articles/${ar.slug}`} className="nc-lire-item">
                <span className="nc-lire-theme">{ar.theme}</span>
                <span className="nc-lire-titre">{ar.titre}</span>
              </Link>
            ))}
          </div>
        </Panneau>
      </div>

      <p className="nc-pied">
        Somme des pays que la Banque mondiale publie pour l&apos;année affichée, pas un PIB mondial
        officiel : la couverture s&apos;élargit avec le temps, et le nombre de pays est donné avec
        chaque valeur.
      </p>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          LA UNE

          La console dit l'état de la base ; ce qui suit dit ce qu'on en a
          fait. Un média se lit, il ne se contemple pas.
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="nl">
        <section className="nl-une">
          <div className="nl-bandeau">
            <span className="nl-bandeau-t">À la une</span>
            <span className="nl-bandeau-r" aria-hidden="true" />
            <Link href={`/lecture/${une.slug}`} className="nc-mini nc-mini-lien">
              toutes les publications →
            </Link>
          </div>

          <div className="nl-une-grille">
            <motion.article
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-70px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="nl-vedette"
            >
              <Link href={`/lecture/${une.slug}`}>
                <span className="nl-vedette-m">
                  {une.theme} · {une.minutes} min
                </span>
                <h2 className="nl-vedette-t">{une.titre}</h2>
                <p className="nl-vedette-c">{une.chapo}</p>
                <span className="nl-vedette-f">Lire l&apos;article →</span>
              </Link>
              {/* La courbe de la base en filigrane : l'article et la donnée
                  sont le même objet, autant le montrer. */}
              <svg className="nl-vedette-sig" viewBox="0 0 400 90" preserveAspectRatio="none" aria-hidden="true">
                <path
                  d={agregats
                    .map((a, k) => {
                      const mx = Math.max(...agregats.map((z) => z.pib));
                      return `${k ? "L" : "M"} ${((k / (agregats.length - 1)) * 400).toFixed(1)} ${(90 - (a.pib / mx) * 78).toFixed(1)}`;
                    })
                    .join(" ")}
                  fill="none"
                  stroke={VERT}
                  strokeOpacity={0.3}
                  strokeWidth={1.5}
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </motion.article>

            <div className="nl-secondaires">
              {secondaires.map((a, k) => (
                <motion.div
                  key={a.slug}
                  initial={{ opacity: 0, x: 22 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: k * 0.07, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link href={`/lecture/${a.slug}`} className="nl-second">
                    <span className="nl-second-m">
                      {a.theme} · {a.minutes} min
                    </span>
                    <span className="nl-second-t">{a.titre}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Le forum ─────────────────────────────────────────────────── */}
        <section className="nl-forum">
          <div className="nl-bandeau">
            <span className="nl-bandeau-t">Ce qui se discute</span>
            <span className="nl-bandeau-r" aria-hidden="true" />
            <Link href="/community" className="nc-mini nc-mini-lien">
              ouvrir le forum →
            </Link>
          </div>
          <div className="nl-fils">
            {fils.map((f, k) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: k * 0.07, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link href="/community" className="nl-fil">
                  <span className="nl-fil-chiffre">{f.ancre}</span>
                  <span className="nl-fil-libelle">{f.libelle}</span>
                  <span className="nl-fil-titre">{f.titre}</span>
                  <span className="nl-fil-theme">{f.theme}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Les terrains ─────────────────────────────────────────────── */}
        <section className="nl-terrains">
          <div className="nl-bandeau">
            <span className="nl-bandeau-t">Les terrains</span>
            <span className="nl-bandeau-r" aria-hidden="true" />
            <Link href="/decouvrir" className="nc-mini nc-mini-lien">
              tout le média →
            </Link>
          </div>
          <div className="nl-terrains-grille">
            {terrains.map((t, k) =>
              t.ouverte ? (
                <motion.div
                  key={t.slug}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.45, delay: k * 0.05, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link href={`/map/${t.slug}`} className="nl-terrain nl-terrain-on">
                    <span className="nl-terrain-t">{t.label}</span>
                    <span className="nl-terrain-c">{t.ligne}</span>
                    <span className="nl-terrain-f">Explorer →</span>
                  </Link>
                </motion.div>
              ) : (
                <div key={t.slug} className="nl-terrain">
                  <span className="nl-terrain-t">{t.label}</span>
                  <span className="nl-terrain-c">{t.ligne}</span>
                  <span className="nl-terrain-f nl-terrain-soon">Bientôt</span>
                </div>
              )
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
