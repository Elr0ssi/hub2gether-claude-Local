"use client";

import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ECONOMY_YEARS } from "@/data/economy/economy";
import { TEST_ARTICLE, TO_FILL } from "@/data/testArticle/testArticleData";

/* ═══════════════════════════════════════════════════════════════════════════
   TEST ARTICLE — the pieces of the format under trial

   Everything here is built for one purpose: to be judged as a layout. The
   copy lives in the data file, and any figure the repository cannot source is
   drawn as a slot rather than filled — a reader should be able to see, at a
   glance, which numbers are still owed.
   ═══════════════════════════════════════════════════════════════════════════ */

const ACCENT = "#39FF88";
const ACCENT_INK = "#0D7A40";
const EASE = [0.16, 1, 0.3, 1] as const;

/** The France series the site already carries, newest point last. */
export function useFranceSeries() {
  return useMemo(
    () =>
      ECONOMY_YEARS.map((y) => ({
        year: y.year,
        debt: y.countries.France?.debt_ratio ?? null,
        gdp: y.countries.France?.gdp ?? null,
      })).filter((p) => p.debt !== null),
    []
  );
}

/** An unfilled figure, drawn so it cannot be mistaken for a measurement. */
export function Slot({ children = TO_FILL }: { children?: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 6,
        border: "1px dashed var(--ink-4)",
        color: "var(--ink-3)",
        fontSize: "0.72em",
        fontWeight: 700,
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

/** Section marker: a rule with the part's number and name sitting on it. */
export function PartRule({ title }: { n?: string; title: string }) {
  /* Sans numéro. Le « I », le « II » puis le « § » posés devant chaque titre
     comptaient des parties que personne ne compte : le titre dit déjà de quoi
     il s'agit, et le filet dit déjà qu'une partie commence. */
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "clamp(10px, 3vw, 16px)", margin: "clamp(34px, 7vw, 56px) 0 clamp(14px, 3vw, 22px)" }}>
      <h2
        className="font-black ta-part-title"
        style={{
          fontSize: "clamp(1.15rem, 4.6vw, 1.7rem)",
          letterSpacing: "-0.025em",
          color: "var(--ink)",
          minWidth: 0,
        }}
      >
        {title}
      </h2>
      <span style={{ flex: "1 1 14px", minWidth: 14, height: 1, background: "var(--border)" }} />
    </div>
  );
}

/* ── Key figures ────────────────────────────────────────────────────────── */

export function KeyFigures() {
  const series = useFranceSeries();
  const latest = series[series.length - 1];
  const { keyFigures } = TEST_ARTICLE;

  const valueOf = (id: string): string | null => {
    if (!latest) return null;
    if (id === "debt_ratio") return latest.debt === null ? null : `${latest.debt}`;
    if (id === "gdp") return latest.gdp === null ? null : latest.gdp.toLocaleString("fr-FR");
    return null;
  };

  /* Deux chiffres côte à côte plutôt qu'une pile de fiches. L'encadré
     précédent empilait quatre blocs séparés par des filets, chacun avec son
     libellé, sa valeur et sa note : la colonne devenait un second article. Ici
     le millésime est annoncé une fois en tête, les valeurs se lisent d'un
     coup d'œil, et la provenance tient sur une ligne au pied. */
  return (
    <aside
      style={{
        borderRadius: 16,
        border: "1px solid var(--border)",
        background: "var(--surface-2)",
        padding: "clamp(13px, 3.5vw, 16px) clamp(14px, 4vw, 18px)",
      }}
    >
      <p
        style={{
          fontSize: "0.58rem",
          fontWeight: 900,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: ACCENT_INK,
          marginBottom: 12,
        }}
      >
        {keyFigures.label}
        {latest && (
          <span style={{ color: "var(--ink-4)", marginLeft: 8, letterSpacing: "0.08em" }}>
            {latest.year}
          </span>
        )}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 }}>
        {keyFigures.items.map((item) => {
          const value = item.source === "dataset" ? valueOf(item.id) : null;
          return (
            <div key={item.id}>
              <p style={{ fontSize: "0.62rem", color: "var(--ink-3)", marginBottom: 3 }}>
                {item.label}
              </p>
              {value ? (
                <p
                  className="font-black"
                  style={{
                    fontSize: "clamp(1.15rem, 2.2vw, 1.45rem)",
                    letterSpacing: "-0.035em",
                    color: "var(--ink)",
                    lineHeight: 1.1,
                  }}
                >
                  {value}
                  <span
                    style={{
                      fontSize: "0.64rem",
                      fontWeight: 700,
                      color: "var(--ink-4)",
                      marginLeft: 5,
                    }}
                  >
                    {item.unit}
                  </span>
                </p>
              ) : (
                <p style={{ margin: "2px 0" }}>
                  <Slot />
                </p>
              )}
            </div>
          );
        })}
      </div>

      <p
        style={{
          marginTop: 12,
          paddingTop: 10,
          borderTop: "1px solid var(--border)",
          fontSize: "0.6rem",
          color: "var(--ink-4)",
          lineHeight: 1.45,
        }}
      >
        {keyFigures.items.map((i) => i.note).join(" · ")}
      </p>
    </aside>
  );
}

/* ── The five-slide carousel ────────────────────────────────────────────── */

export function IdeaCarousel() {
  const { carousel } = TEST_ARTICLE;
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const last = carousel.slides.length - 1;

  const go = useCallback(
    (next: number) => {
      setDir(next > index ? 1 : -1);
      setIndex(Math.max(0, Math.min(last, next)));
    },
    [index, last]
  );

  const slide = carousel.slides[index];

  return (
    <section style={{ marginTop: 44 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
        <span
          style={{
            fontSize: "0.6rem",
            fontWeight: 900,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: ACCENT_INK,
          }}
        >
          {carousel.label}
        </span>
        <span style={{ flex: 1, height: 1, background: "var(--border)" }} />
        <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--ink-4)" }}>
          {slide.n} / {String(carousel.slides.length).padStart(2, "0")}
        </span>
      </div>

      <div
        style={{
          position: "relative",
          borderRadius: 20,
          border: "1px solid var(--border)",
          background: "var(--surface)",
          overflow: "hidden",
          minHeight: "clamp(128px, 20vw, 172px)",
          display: "flex",
        }}
      >
        {/* The number, set large and quiet on the left. */}
        <div
          style={{
            flex: "0 0 clamp(54px, 8vw, 96px)",
            background: "linear-gradient(160deg, rgba(57,255,136,0.10), rgba(57,255,136,0.02))",
            borderRight: "1px solid var(--border)",
            display: "grid",
            placeItems: "center",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={slide.n}
              initial={{ opacity: 0, y: 10 * dir }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 * dir }}
              transition={{ duration: 0.32, ease: EASE }}
              className="font-black"
              style={{
                fontSize: "clamp(1.5rem, 2.4vw, 2.1rem)",
                letterSpacing: "-0.04em",
                color: ACCENT_INK,
              }}
            >
              {slide.n}
            </motion.span>
          </AnimatePresence>
        </div>

        <div style={{ flex: 1, minWidth: 0, padding: "clamp(16px, 4.5vw, 26px) clamp(14px, 4vw, 34px)" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.title}
              initial={{ opacity: 0, x: 22 * dir }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -22 * dir }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <h3
                className="font-black"
                style={{
                  fontSize: "clamp(1.05rem, 1.7vw, 1.4rem)",
                  letterSpacing: "-0.025em",
                  color: "var(--ink)",
                  marginBottom: 10,
                }}
              >
                {slide.title}
              </h3>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.65, color: "var(--ink-2)" }}>
                {slide.body}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14 }}>
        <button
          type="button"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          aria-label="Idée précédente"
          style={navButton(index === 0)}
        >
          <ChevronLeft size={15} />
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          disabled={index === last}
          aria-label="Idée suivante"
          style={navButton(index === last)}
        >
          <ChevronRight size={15} />
        </button>

        <div style={{ display: "flex", gap: 6, marginLeft: 6 }}>
          {carousel.slides.map((s, i) => (
            <button
              key={s.n}
              type="button"
              onClick={() => go(i)}
              aria-label={`Idée ${s.n}`}
              aria-current={i === index}
              style={{
                width: i === index ? 26 : 8,
                height: 4,
                borderRadius: 4,
                border: "none",
                padding: 0,
                cursor: "pointer",
                background: i === index ? ACCENT_INK : "var(--border)",
                transition: "width .3s cubic-bezier(0.16,1,0.3,1), background .3s",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function navButton(disabled: boolean): React.CSSProperties {
  return {
    width: 34,
    height: 34,
    borderRadius: 10,
    display: "grid",
    placeItems: "center",
    border: "1px solid var(--border)",
    background: "var(--surface)",
    color: disabled ? "var(--ink-5)" : "var(--ink-2)",
    cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.45 : 1,
  };
}

/* ── Chart + the reading beside it ──────────────────────────────────────── */

export function DebtChart() {
  const series = useFranceSeries();
  const { chart } = TEST_ARTICLE;
  /* Le graphique se lit au doigt : le point le plus proche du curseur est
     désigné, sa valeur affichée. Un graphique qu'on ne peut pas interroger
     n'est qu'une image du chiffre, et le lecteur qui veut 2015 doit le
     deviner entre deux étiquettes. */
  const [hover, setHover] = useState<number | null>(null);

  const W = 640;
  const H = 300;
  const PAD = { top: 18, right: 16, bottom: 30, left: 44 };

  const values = series.map((p) => p.debt as number);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const lo = Math.floor((min - 8) / 10) * 10;
  const hi = Math.ceil((max + 8) / 10) * 10;

  const x = (i: number) =>
    PAD.left + (i / Math.max(1, series.length - 1)) * (W - PAD.left - PAD.right);
  const y = (v: number) =>
    PAD.top + (1 - (v - lo) / (hi - lo)) * (H - PAD.top - PAD.bottom);

  const line = series.map((p, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(p.debt as number).toFixed(1)}`).join(" ");
  const area = `${line} L ${x(series.length - 1).toFixed(1)} ${H - PAD.bottom} L ${x(0).toFixed(1)} ${H - PAD.bottom} Z`;

  const ticks = [lo, Math.round((lo + hi) / 2), hi];

  return (
    <section style={{ marginTop: 56 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
        <span
          style={{
            fontSize: "0.6rem",
            fontWeight: 900,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: ACCENT_INK,
          }}
        >
          {chart.label}
        </span>
        <span style={{ flex: 1, height: 1, background: "var(--border)" }} />
      </div>

      <div className="ta-chart-row">
        <figure
          style={{
            margin: 0,
            borderRadius: 18,
            border: "1px solid var(--border)",
            background: "var(--surface)",
            padding: "clamp(12px, 3.5vw, 16px) clamp(12px, 4vw, 18px) 12px",
          }}
        >
          <svg
            viewBox={`0 0 ${W} ${H}`}
            width="100%"
            role="img"
            aria-label={chart.caption}
            style={{ display: "block", touchAction: "none" }}
            onPointerMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              const local = ((e.clientX - r.left) / r.width) * W;
              let best = 0;
              for (let i = 1; i < series.length; i++) {
                if (Math.abs(x(i) - local) < Math.abs(x(best) - local)) best = i;
              }
              setHover(best);
            }}
            onPointerLeave={() => setHover(null)}
          >
            <defs>
              <linearGradient id="ta-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ACCENT} stopOpacity="0.28" />
                <stop offset="100%" stopColor={ACCENT} stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {ticks.map((t) => (
              <g key={t}>
                <line
                  x1={PAD.left}
                  x2={W - PAD.right}
                  y1={y(t)}
                  y2={y(t)}
                  stroke="var(--border)"
                  strokeWidth="1"
                />
                <text
                  x={PAD.left - 10}
                  y={y(t) + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="var(--ink-4)"
                >
                  {t}
                </text>
              </g>
            ))}

            <path d={area} fill="url(#ta-area)" />
            <motion.path
              d={line}
              fill="none"
              stroke={ACCENT_INK}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 1.2, ease: EASE }}
            />

            {hover !== null && series[hover] && (
              <g>
                <line
                  x1={x(hover)}
                  x2={x(hover)}
                  y1={PAD.top}
                  y2={H - PAD.bottom}
                  stroke={ACCENT_INK}
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  opacity="0.5"
                />
                <circle
                  cx={x(hover)}
                  cy={y(series[hover].debt as number)}
                  r="5.5"
                  fill="#fff"
                  stroke={ACCENT_INK}
                  strokeWidth="2.4"
                />
                <text
                  x={Math.min(Math.max(x(hover), PAD.left + 34), W - PAD.right - 34)}
                  y={Math.max(y(series[hover].debt as number) - 14, PAD.top + 12)}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="800"
                  fill={ACCENT_INK}
                >
                  {series[hover].year} · {series[hover].debt} %
                </text>
              </g>
            )}

            {series.map((p, i) =>
              i === 0 || i === series.length - 1 || p.year % 10 === 0 ? (
                <g key={p.year}>
                  <circle cx={x(i)} cy={y(p.debt as number)} r="3.2" fill={ACCENT_INK} />
                  <text
                    x={x(i)}
                    y={H - PAD.bottom + 18}
                    textAnchor="middle"
                    fontSize="11"
                    fill="var(--ink-4)"
                  >
                    {p.year}
                  </text>
                </g>
              ) : null
            )}
          </svg>
          <figcaption
            style={{ fontSize: "0.66rem", color: "var(--ink-4)", marginTop: 6, lineHeight: 1.5 }}
          >
            {chart.caption}
          </figcaption>
        </figure>

        <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
          {chart.readings.map((r) => (
            <div key={r.label}>
              <p
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 900,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--ink-4)",
                  marginBottom: 5,
                }}
              >
                {r.label}
              </p>
              <p style={{ fontSize: "0.85rem", lineHeight: 1.6, color: "var(--ink-2)" }}>{r.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Perspectives ───────────────────────────────────────────────────────── */

export function PullQuote({ text, attribution }: { text: string; attribution: string }) {
  return (
    <blockquote
      style={{
        margin: "26px 0",
        paddingLeft: "clamp(14px, 4.5vw, 22px)",
        borderLeft: `3px solid ${ACCENT}`,
      }}
    >
      <p
        style={{
          fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
          lineHeight: 1.55,
          color: "var(--ink)",
          fontWeight: 600,
          letterSpacing: "-0.012em",
        }}
      >
        {text}
      </p>
      <cite
        style={{
          display: "block",
          marginTop: 9,
          fontSize: "0.68rem",
          fontStyle: "normal",
          color: "var(--ink-4)",
          lineHeight: 1.5,
        }}
      >
        {attribution}
      </cite>
    </blockquote>
  );
}

export function PerspectiveCard({
  label,
  holders,
  body,
}: {
  label: string;
  holders: string;
  body: string;
}) {
  return (
    <article
      style={{
        borderRadius: 16,
        border: "1px solid var(--border)",
        background: "var(--surface)",
        padding: "clamp(14px, 4vw, 20px) clamp(14px, 4.5vw, 22px)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div>
        <p
          style={{
            fontSize: "0.6rem",
            fontWeight: 900,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: ACCENT_INK,
          }}
        >
          {label}
        </p>
        <p style={{ fontSize: "0.68rem", color: "var(--ink-4)", marginTop: 4 }}>{holders}</p>
      </div>

      <p style={{ fontSize: "0.86rem", lineHeight: 1.62, color: "var(--ink-2)" }}>{body}</p>
    </article>
  );
}

/* ── Décomposition par poste ─────────────────────────────────────────────
   La charpente est posée, les valeurs sont des emplacements : chaque case
   vide est une question à laquelle il faut répondre avec une source, et non
   un trou à combler par une estimation. Un poste s'ouvre pour montrer ce
   qu'il finance et ce qu'il ne finance pas. */

export function SpendingBreakdown() {
  const { breakdown } = TEST_ARTICLE;
  const [open, setOpen] = useState<string | null>(breakdown.items[0]?.id ?? null);

  return (
    <section style={{ marginTop: "clamp(34px, 7vw, 56px)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
        <span
          style={{
            fontSize: "0.6rem",
            fontWeight: 900,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: ACCENT_INK,
          }}
        >
          {breakdown.label}
        </span>
        <span style={{ flex: 1, height: 1, background: "var(--border)" }} />
        <span style={{ fontSize: "0.62rem", color: "var(--ink-4)" }}>{breakdown.yearNote}</span>
      </div>

      <p
        style={{
          fontSize: "clamp(0.89rem, 0.9vw, 0.95rem)",
          lineHeight: 1.7,
          color: "var(--ink-2)",
          marginBottom: 20,
          maxWidth: 760,
        }}
      >
        {breakdown.intro}
      </p>

      <div style={{ display: "grid", gap: 8 }}>
        {breakdown.items.map((item) => {
          const isOpen = open === item.id;
          return (
            <div
              key={item.id}
              style={{
                borderRadius: 14,
                border: `1px solid ${isOpen ? ACCENT : "var(--border)"}`,
                background: isOpen ? "rgba(57,255,136,0.05)" : "var(--surface)",
                overflow: "hidden",
                transition: "border-color .2s, background .2s",
              }}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : item.id)}
                aria-expanded={isOpen}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "clamp(11px, 3vw, 14px) clamp(12px, 3.5vw, 16px)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    flex: 1,
                    minWidth: 0,
                    fontSize: "0.92rem",
                    fontWeight: 800,
                    color: "var(--ink)",
                  }}
                >
                  {item.label}
                </span>
                <Slot>{item.share}</Slot>
                <ChevronRight
                  size={14}
                  style={{
                    color: "var(--ink-4)",
                    flexShrink: 0,
                    transform: isOpen ? "rotate(90deg)" : "none",
                    transition: "transform .2s",
                  }}
                />
              </button>

              {isOpen && (
                <div
                  style={{
                    padding: "0 clamp(12px, 3.5vw, 16px) clamp(12px, 3.5vw, 16px)",
                    display: "grid",
                    gap: 10,
                  }}
                >
                  <Row label="Montant">{item.amount}</Row>
                  <Row label="Ce que la ligne finance">{item.funds}</Row>
                  <Row label="Ce qu'elle ne finance pas">{item.excludes}</Row>
                  <p style={{ fontSize: "0.62rem", color: "var(--ink-4)", lineHeight: 1.5 }}>
                    {item.source}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 18, display: "grid", gap: 10 }}>
        {breakdown.questions.map((q) => (
          <div
            key={q.q}
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) auto",
              alignItems: "baseline",
              gap: 14,
              paddingBottom: 10,
              borderBottom: "1px solid var(--border)",
            }}
          >
            <p style={{ fontSize: "0.86rem", fontWeight: 700, color: "var(--ink-2)" }}>{q.q}</p>
            <Slot>{q.a}</Slot>
          </div>
        ))}
      </div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 200px) minmax(0, 1fr)", gap: 12, alignItems: "baseline" }}>
      <p style={{ fontSize: "0.66rem", color: "var(--ink-3)", fontWeight: 700 }}>{label}</p>
      <Slot>{children}</Slot>
    </div>
  );
}
