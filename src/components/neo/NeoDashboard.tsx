"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import type { PointMonde, RangPays } from "@/data/neo/agregats";

/* ═══════════════════════════════════════════════════════════════════════════
   LA SALLE DES MACHINES

   Une page d'accueil sombre, dense, qui montre la base plutôt que de la
   décrire. Tout ce qui s'affiche ici vient du socle : aucune valeur n'est
   écrite dans ce fichier. Les couvertures partielles sont dites, pas lissées.
   ═══════════════════════════════════════════════════════════════════════════ */

const VERT = "#39FF88";
const ENCRE = "#F2F5F3";
const ENCRE_2 = "#9AA3A0";
const ENCRE_3 = "#5E6764";
const FOND_2 = "rgba(255,255,255,0.035)";
const TRAIT = "rgba(255,255,255,0.09)";
const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Utilitaires de format ───────────────────────────────────────────────── */

function compact(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(".", ",")} Q`;
  if (abs >= 1_000) return `${(n / 1_000).toFixed(1).replace(".", ",")} T`;
  return `${Math.round(n)} Md`;
}

function fr(n: number): string {
  return n.toLocaleString("fr-FR");
}

/* ── Un nombre qui monte quand il entre dans le champ ────────────────────── */

function Compteur({
  valeur,
  format,
  duree = 1.6,
}: {
  valeur: number;
  format: (n: number) => string;
  duree?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const vu = useInView(ref, { once: true, margin: "-80px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!vu) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(valeur);
      return;
    }
    let brut = 0;
    const debut = performance.now();
    const boucle = (t: number) => {
      const p = Math.min(1, (t - debut) / (duree * 1000));
      // Décélération : le chiffre arrive vite, puis se pose.
      const e = 1 - Math.pow(1 - p, 3);
      setN(valeur * e);
      if (p < 1) brut = requestAnimationFrame(boucle);
    };
    brut = requestAnimationFrame(boucle);
    return () => cancelAnimationFrame(brut);
  }, [vu, valeur, duree]);

  return (
    <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>
      {format(n)}
    </span>
  );
}

/* ── Le bandeau défilant ─────────────────────────────────────────────────── */

function Ticker({ items }: { items: readonly string[] }) {
  const suite = [...items, ...items];
  return (
    <div
      style={{
        borderTop: `1px solid ${TRAIT}`,
        borderBottom: `1px solid ${TRAIT}`,
        overflow: "hidden",
        position: "relative",
        background: "rgba(57,255,136,0.03)",
      }}
    >
      <div className="neo-ticker" style={{ display: "flex", gap: 0, whiteSpace: "nowrap" }}>
        {suite.map((t, i) => (
          <span
            key={i}
            style={{
              padding: "13px 28px",
              fontSize: 13,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: i % 2 ? ENCRE_2 : ENCRE,
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: 5, background: VERT, flexShrink: 0 }} />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── La courbe mondiale ──────────────────────────────────────────────────── */

function CourbeMonde({
  points,
  anneeActive,
  onScrub,
}: {
  points: readonly PointMonde[];
  anneeActive: number;
  onScrub: (annee: number) => void;
}) {
  const L = 1200;
  const H = 340;
  const padX = 8;
  const padY = 26;

  const { d, aire, xs, max } = useMemo(() => {
    const max = Math.max(...points.map((p) => p.pib));
    const x = (i: number) => padX + (i * (L - padX * 2)) / (points.length - 1);
    const y = (v: number) => H - padY - (v / max) * (H - padY * 2);
    const xs = points.map((_, i) => x(i));
    const d = points.map((p, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(p.pib).toFixed(1)}`).join(" ");
    const aire = `${d} L ${x(points.length - 1).toFixed(1)} ${H - padY} L ${padX} ${H - padY} Z`;
    return { d, aire, xs, max };
  }, [points]);

  const i = Math.max(0, points.findIndex((p) => p.annee === anneeActive));
  const pt = points[i];
  const cx = xs[i];
  const cy = H - padY - (pt.pib / max) * (H - padY * 2);

  return (
    <div style={{ position: "relative" }}>
      <svg viewBox={`0 0 ${L} ${H}`} style={{ display: "block", width: "100%", height: "auto" }}>
        <defs>
          <linearGradient id="neo-aire" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={VERT} stopOpacity="0.28" />
            <stop offset="100%" stopColor={VERT} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* La ligne de base et deux repères, discrets. */}
        {[0.5, 1].map((f) => (
          <line
            key={f}
            x1={padX}
            x2={L - padX}
            y1={H - padY - f * (H - padY * 2)}
            y2={H - padY - f * (H - padY * 2)}
            stroke={TRAIT}
            strokeDasharray="3 7"
          />
        ))}
        <line x1={padX} x2={L - padX} y1={H - padY} y2={H - padY} stroke={TRAIT} />

        <motion.path
          d={aire}
          fill="url(#neo-aire)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.7, ease: EASE }}
        />
        <motion.path
          d={d}
          fill="none"
          stroke={VERT}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: EASE }}
        />

        {/* Le curseur : une verticale et un point, qui suivent l'année. */}
        <motion.line
          x1={cx}
          x2={cx}
          y1={padY - 12}
          y2={H - padY}
          stroke={VERT}
          strokeOpacity={0.45}
          animate={{ x1: cx, x2: cx }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
        />
        <motion.circle
          r={7}
          fill="#07080A"
          stroke={VERT}
          strokeWidth={3}
          animate={{ cx, cy }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
        />
      </svg>

      {/* Le curseur d'année, au clavier comme à la souris. */}
      <input
        type="range"
        className="neo-scrub"
        min={points[0].annee}
        max={points[points.length - 1].annee}
        value={anneeActive}
        onChange={(e) => onScrub(Number(e.target.value))}
        aria-label="Année"
        style={{ width: "100%", marginTop: 18 }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
        {[points[0], points[Math.floor(points.length / 2)], points[points.length - 1]].map((p) => (
          <span key={p.annee} style={{ fontSize: 12, color: ENCRE_3, letterSpacing: "0.1em" }}>
            {p.annee}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Le classement de l'année, en barres ─────────────────────────────────── */

function Barres({ rangs }: { rangs: readonly RangPays[] }) {
  const max = rangs.length ? rangs[0].pib : 1;
  return (
    <div style={{ display: "grid", gap: 9 }}>
      {rangs.map((r, i) => (
        <div
          key={r.nom}
          style={{
            display: "grid",
            gridTemplateColumns: "22px minmax(0, 190px) 1fr auto",
            gap: 14,
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 12, color: ENCRE_3, fontVariantNumeric: "tabular-nums" }}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <span
            style={{
              fontSize: 15,
              color: i === 0 ? VERT : ENCRE,
              fontWeight: i === 0 ? 700 : 500,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {r.nom}
          </span>
          <span style={{ height: 8, borderRadius: 8, background: FOND_2, overflow: "hidden" }}>
            <motion.span
              style={{
                display: "block",
                height: "100%",
                borderRadius: 8,
                background: i === 0 ? VERT : "rgba(57,255,136,0.42)",
                transformOrigin: "left",
              }}
              initial={false}
              animate={{ width: `${(r.pib / max) * 100}%` }}
              transition={{ type: "spring", stiffness: 180, damping: 26 }}
            />
          </span>
          <span
            style={{
              fontSize: 14,
              color: ENCRE_2,
              fontVariantNumeric: "tabular-nums",
              minWidth: 74,
              textAlign: "right",
            }}
          >
            {compact(r.pib)}€
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Un bloc de section ──────────────────────────────────────────────────── */

function Bloc({
  eyebrow,
  titre,
  children,
  aside,
}: {
  eyebrow: string;
  titre: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <section style={{ padding: "clamp(64px, 8vw, 120px) 0", borderTop: `1px solid ${TRAIT}` }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 32, flexWrap: "wrap", marginBottom: 42 }}>
        <div>
          <p style={{ fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: VERT, fontWeight: 700 }}>
            {eyebrow}
          </p>
          <h2
            style={{
              fontSize: "clamp(30px, 3.6vw, 50px)",
              lineHeight: 1.06,
              letterSpacing: "-0.035em",
              color: ENCRE,
              fontWeight: 800,
              marginTop: 14,
              maxWidth: 900,
            }}
          >
            {titre}
          </h2>
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LA PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

export interface NeoProps {
  points: PointMonde[];
  compteurs: {
    annee: number;
    pib: number;
    paysPib: number;
    balancePositive: number;
    paysBalance: number;
    inflationMediane: number | null;
    paysInflation: number;
  };
  classements: Record<number, RangPays[]>;
  articles: { slug: string; titre: string; theme: string; minutes: number; extrait: string }[];
  rubriques: { slug: string; label: string; ligne: string; ouverte: boolean }[];
}

export function NeoDashboard({ points, compteurs: c, classements, articles, rubriques }: NeoProps) {
  const annees = useMemo(() => Object.keys(classements).map(Number).sort((a, b) => a - b), [classements]);
  const [annee, setAnnee] = useState(annees[annees.length - 1]);

  /* Le curseur balaie toute la profondeur de la courbe, mais le classement
     n'est pré-calculé que sur quelques paliers : on prend le plus proche. */
  const anneeRang = useMemo(
    () => annees.reduce((a, b) => (Math.abs(b - annee) < Math.abs(a - annee) ? b : a), annees[0]),
    [annee, annees]
  );

  const dernier = points[points.length - 1];
  const premier = points[0];
  const facteur = dernier.pib / premier.pib;

  const ticker = [
    `${c.paysPib} pays couverts · ${c.annee}`,
    `PIB cumulé ${compact(c.pib)}€`,
    c.inflationMediane !== null ? `Inflation médiane ${c.inflationMediane.toFixed(1).replace(".", ",")} %` : "",
    `${c.balancePositive} / ${c.paysBalance} pays en excédent commercial`,
    `${points.length} années de profondeur · depuis ${premier.annee}`,
    "Source · Banque mondiale (WDI)",
  ].filter(Boolean);

  return (
    <div className="neo" style={{ background: "#07080A", color: ENCRE }}>
      {/* ── L'ouverture ─────────────────────────────────────────────────── */}
      <header style={{ position: "relative", overflow: "hidden" }}>
        <div className="neo-grille" aria-hidden="true" />
        <div className="neo-halo" aria-hidden="true" />

        <div className="neo-wrap" style={{ position: "relative", padding: "clamp(72px, 11vh, 140px) 0 clamp(48px, 7vh, 92px)" }}>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: VERT, fontWeight: 700 }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
              <span className="neo-pulse" />
              Base ouverte · {premier.annee} → {dernier.annee}
            </span>
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            style={{
              fontSize: "clamp(46px, 7.4vw, 118px)",
              lineHeight: 0.96,
              letterSpacing: "-0.045em",
              fontWeight: 900,
              marginTop: 26,
              maxWidth: 1180,
            }}
          >
            Les chiffres qui font
            <br />
            <span style={{ color: VERT }}>le monde</span>, à hauteur d&apos;œil.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease: EASE }}
            style={{
              fontSize: "clamp(17px, 1.5vw, 23px)",
              lineHeight: 1.5,
              color: ENCRE_2,
              marginTop: 30,
              maxWidth: 720,
            }}
          >
            Une base de {fr(points.length)} années, {c.paysPib} pays et quatre indicateurs, recoupée
            source par source. Vous la parcourez, vous la comparez, vous en débattez.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.42, ease: EASE }}
            style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 40 }}
          >
            <Link href="/map/economy" className="neo-cta neo-cta-plein">
              Ouvrir la carte
            </Link>
            <Link href="/community" className="neo-cta">
              Rejoindre les débats
            </Link>
          </motion.div>
        </div>

        {/* Les quatre compteurs, gros et lisibles de loin. */}
        <div className="neo-wrap">
          <div className="neo-kpis">
            {[
              { v: c.pib, f: (n: number) => `${compact(n)}€`, l: "PIB cumulé", s: `${c.paysPib} pays · ${c.annee}` },
              { v: c.paysPib, f: (n: number) => fr(Math.round(n)), l: "Pays couverts", s: "Avec au moins un PIB publié" },
              {
                v: c.inflationMediane ?? 0,
                f: (n: number) => `${n.toFixed(1).replace(".", ",")} %`,
                l: "Inflation médiane",
                s: `${c.paysInflation} pays · ${c.annee}`,
              },
              { v: facteur, f: (n: number) => `× ${n.toFixed(0)}`, l: `Depuis ${premier.annee}`, s: "PIB cumulé des pays couverts" },
            ].map((k) => (
              <div key={k.l} className="neo-kpi">
                <p style={{ fontSize: "clamp(30px, 3.4vw, 52px)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1 }}>
                  <Compteur valeur={k.v} format={k.f} />
                </p>
                <p style={{ fontSize: 14, color: ENCRE, marginTop: 14, fontWeight: 600 }}>{k.l}</p>
                <p style={{ fontSize: 12.5, color: ENCRE_3, marginTop: 5 }}>{k.s}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <Ticker items={ticker} />

      <div className="neo-wrap">
        {/* ── La courbe ─────────────────────────────────────────────────── */}
        <Bloc
          eyebrow="La profondeur"
          titre="Soixante-six ans de PIB, dans une seule courbe."
          aside={
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 900, letterSpacing: "-0.04em", color: VERT }}>
                {compact(points[Math.max(0, points.findIndex((p) => p.annee === annee))].pib)}€
              </p>
              <p style={{ fontSize: 13, color: ENCRE_3, marginTop: 6 }}>
                {annee} · {points[Math.max(0, points.findIndex((p) => p.annee === annee))].pays} pays couverts
              </p>
            </div>
          }
        >
          <CourbeMonde points={points} anneeActive={annee} onScrub={setAnnee} />
          <p style={{ fontSize: 13, color: ENCRE_3, marginTop: 22, maxWidth: 760, lineHeight: 1.6 }}>
            Somme des pays que la source publie cette année-là, pas un PIB mondial officiel : la
            couverture s&apos;élargit avec le temps, et le nombre de pays est affiché avec chaque point.
          </p>
        </Bloc>

        {/* ── Le classement ─────────────────────────────────────────────── */}
        <Bloc
          eyebrow="Le classement"
          titre="Qui pèse, et de combien."
          aside={
            <p style={{ fontSize: 13, color: ENCRE_3, maxWidth: 300, textAlign: "right", lineHeight: 1.6 }}>
              Le curseur ci-dessus déplace aussi ce classement. Palier affiché&nbsp;: {anneeRang}.
            </p>
          }
        >
          <div className="neo-carte">
            <Barres rangs={classements[anneeRang] ?? []} />
          </div>
          <div style={{ marginTop: 26 }}>
            <Link href="/map/economy" className="neo-lien">
              Le classement complet, 181 pays →
            </Link>
          </div>
        </Bloc>

        {/* ── Les rubriques ─────────────────────────────────────────────── */}
        <Bloc eyebrow="Les terrains" titre="Six entrées dans la même base.">
          <div className="neo-rubriques">
            {rubriques.map((r, i) =>
              r.ouverte ? (
                <motion.div
                  key={r.slug}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, delay: i * 0.07, ease: EASE }}
                >
                  <Link href={`/map/${r.slug}`} className="neo-rubrique neo-rubrique-ouverte">
                    <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em" }}>{r.label}</span>
                    <span style={{ fontSize: 14, color: ENCRE_2, lineHeight: 1.5 }}>{r.ligne}</span>
                    <span style={{ fontSize: 13, color: VERT, fontWeight: 700, marginTop: "auto" }}>Explorer →</span>
                  </Link>
                </motion.div>
              ) : (
                <div key={r.slug} className="neo-rubrique">
                  <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", color: ENCRE_3 }}>{r.label}</span>
                  <span style={{ fontSize: 14, color: ENCRE_3, lineHeight: 1.5 }}>{r.ligne}</span>
                  <span style={{ fontSize: 12, color: ENCRE_3, marginTop: "auto", letterSpacing: "0.12em" }}>BIENTÔT</span>
                </div>
              )
            )}
          </div>
        </Bloc>

        {/* ── Les articles ──────────────────────────────────────────────── */}
        <Bloc
          eyebrow="Les publications"
          titre="Ce que les chiffres racontent, écrit."
          aside={
            <Link href="/community" className="neo-lien">
              En débattre →
            </Link>
          }
        >
          <div className="neo-articles">
            {articles.map((a, i) => (
              <motion.div
                key={a.slug}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.06, ease: EASE }}
              >
                <Link href={`/articles/${a.slug}`} className="neo-article">
                  <span style={{ fontSize: 11.5, letterSpacing: "0.15em", textTransform: "uppercase", color: VERT, fontWeight: 700 }}>
                    {a.theme} · {a.minutes} min
                  </span>
                  <span style={{ fontSize: 19, fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.25, marginTop: 14 }}>
                    {a.titre}
                  </span>
                  <span style={{ fontSize: 14, color: ENCRE_2, lineHeight: 1.55, marginTop: 12 }}>{a.extrait}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </Bloc>
      </div>
    </div>
  );
}
