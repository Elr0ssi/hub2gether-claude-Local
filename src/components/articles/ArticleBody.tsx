"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Check } from "lucide-react";
import type { ArticleSection } from "@/types";
import { ArticleRankingTable } from "./ArticleRankingTable";

const ArticleWorldMap = dynamic(
  () => import("./ArticleWorldMap").then(m => m.ArticleWorldMap),
  { ssr: false, loading: () => <div className="my-8 h-48 rounded-2xl animate-pulse" style={{ background: "var(--surface-2)" }} /> }
);

// ── Stat block ────────────────────────────────────────────────────────────────
function StatsSection({ items }: { items: { value: string; label: string; note?: string }[] }) {
  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-8 p-5 rounded-2xl"
      style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
    >
      {items.map((item) => (
        <div key={item.label} className="flex flex-col items-center text-center gap-1 py-2">
          <span
            className="text-2xl sm:text-3xl font-black tabular-nums leading-none"
            style={{ color: "var(--accent)", fontVariantNumeric: "tabular-nums" }}
          >
            {item.value}
          </span>
          <span className="text-xs font-semibold mt-1" style={{ color: "var(--ink)" }}>
            {item.label}
          </span>
          {item.note && (
            <span className="text-xs leading-snug" style={{ color: "var(--ink-4)", fontSize: "0.65rem" }}>
              {item.note}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Flip-card carousel ────────────────────────────────────────────────────────
function CarouselSection({
  title,
  items,
}: {
  title: string;
  items: { name: string; emoji?: string; detail: string; subdetail?: string }[];
}) {
  const [flipped, setFlipped] = useState<number | null>(null);

  return (
    <div
      className="my-8 p-5 rounded-2xl"
      style={{ background: "var(--ink)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold" style={{ color: "var(--accent)" }}>
          {title}
        </h3>
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.6rem" }}>
          cliquez pour détails
        </span>
      </div>

      <div
        className="flex gap-3 overflow-x-auto pb-2"
        style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
      >
        {items.map((item, i) => (
          <button
            key={item.name}
            onClick={() => setFlipped(flipped === i ? null : i)}
            className="flex-shrink-0 rounded-xl overflow-hidden transition-all duration-200"
            style={{
              width: "130px",
              height: "160px",
              scrollSnapAlign: "start",
              perspective: "1000px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
            aria-label={`${item.name} — cliquez pour détails`}
          >
            <motion.div
              className="w-full h-full relative"
              animate={{ rotateY: flipped === i ? 180 : 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Front */}
              <div
                className="absolute inset-0 rounded-xl flex flex-col items-center justify-center gap-2 p-3"
                style={{
                  backfaceVisibility: "hidden",
                  background: "var(--surface)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              >
                {item.emoji && (
                  <span style={{ fontSize: "2rem", lineHeight: 1 }}>{item.emoji}</span>
                )}
                <span
                  className="text-xs font-bold text-center leading-tight"
                  style={{ color: "var(--ink)" }}
                >
                  {item.name}
                </span>
                <span
                  className="text-xs text-center"
                  style={{ color: "var(--accent)", fontSize: "0.65rem", fontWeight: 700 }}
                >
                  {item.detail}
                </span>
                <div
                  className="w-5 h-px mt-1"
                  style={{ background: "var(--accent)", opacity: 0.4 }}
                />
                <RotateCcw
                  size={10}
                  style={{ color: "var(--ink-4)", opacity: 0.5 }}
                />
              </div>

              {/* Back */}
              <div
                className="absolute inset-0 rounded-xl flex flex-col items-start justify-center p-3 gap-1"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  background: "#1a1a1a",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  overflow: "hidden",
                }}
              >
                <span
                  className="text-xs font-bold leading-tight mb-1"
                  style={{ color: "var(--accent)" }}
                >
                  {item.name}
                </span>
                <span
                  className="text-xs leading-relaxed text-left"
                  style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.62rem" }}
                >
                  {item.subdetail ?? item.detail}
                </span>
              </div>
            </motion.div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Timeline ──────────────────────────────────────────────────────────────────
function TimelineSection({
  title,
  items,
}: {
  title: string;
  items: { date: string; title: string; description: string }[];
}) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="my-8">
      <h3
        className="text-sm font-bold uppercase tracking-widest mb-5"
        style={{ color: "var(--ink-3)", fontSize: "0.65rem" }}
      >
        {title}
      </h3>
      <div className="relative">
        <div
          className="absolute left-[52px] top-0 bottom-0 w-px"
          style={{ background: "var(--border)" }}
        />
        <div className="flex flex-col gap-3">
          {items.map((item, i) => (
            <button
              key={item.date}
              onClick={() => setOpen(open === i ? null : i)}
              className="flex items-start gap-4 text-left w-full group"
            >
              <span
                className="text-xs font-black tabular-nums shrink-0 text-right"
                style={{
                  width: "44px",
                  color: open === i ? "var(--accent)" : "var(--ink-3)",
                  paddingTop: "2px",
                  transition: "color 0.2s",
                }}
              >
                {item.date}
              </span>
              <div
                className="w-2.5 h-2.5 rounded-full mt-1 shrink-0 z-10 transition-colors duration-200"
                style={{
                  background: open === i ? "var(--accent)" : "var(--border)",
                  border: "2px solid var(--surface)",
                  boxShadow: open === i ? "0 0 0 3px rgba(57,255,136,0.25)" : "none",
                }}
              />
              <div className="flex-1 pb-3">
                <p
                  className="text-sm font-semibold leading-tight"
                  style={{ color: open === i ? "var(--ink)" : "var(--ink-2)", transition: "color 0.2s" }}
                >
                  {item.title}
                </p>
                <AnimatePresence>
                  {open === i && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm leading-relaxed mt-1 overflow-hidden"
                      style={{ color: "var(--ink-3)" }}
                    >
                      {item.description}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Image + text ──────────────────────────────────────────────────────────────
function ImageTextSection({
  heading,
  content,
  imageUrl,
  imageAlt,
  flip,
}: {
  heading: string;
  content: string;
  imageUrl: string;
  imageAlt: string;
  flip?: boolean;
}) {
  return (
    <div
      className={`my-8 flex flex-col ${flip ? "md:flex-row-reverse" : "md:flex-row"} gap-6 items-start p-6 rounded-2xl`}
      style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
    >
      <div className="w-full md:w-2/5 shrink-0">
        <div className="relative w-full rounded-xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <p className="text-xs mt-2 italic" style={{ color: "var(--ink-4)", fontSize: "0.62rem" }}>
          {imageAlt}
        </p>
      </div>
      <div className="flex-1">
        <h3 className="text-base font-bold mb-3" style={{ color: "var(--ink)" }}>
          {heading}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "var(--ink-2)" }}>
          {content}
        </p>
      </div>
    </div>
  );
}

// ── Highlight ─────────────────────────────────────────────────────────────────
function HighlightSection({ content }: { content: string }) {
  return (
    <div
      className="my-8 px-6 py-5 rounded-2xl border-l-4"
      style={{
        background: "var(--accent-dim)",
        borderLeftColor: "var(--accent)",
        border: "1px solid rgba(57,255,136,0.25)",
        borderLeftWidth: "4px",
      }}
    >
      <p className="text-sm leading-relaxed font-medium" style={{ color: "#0D7A40" }}>
        {content}
      </p>
    </div>
  );
}

// ── Quote ─────────────────────────────────────────────────────────────────────
function QuoteSection({ text, source }: { text: string; source: string }) {
  return (
    <blockquote
      className="my-8 px-6 py-5 rounded-2xl"
      style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
    >
      <p
        className="text-base leading-relaxed italic mb-3"
        style={{ color: "var(--ink)", fontSize: "1.05rem" }}
      >
        &ldquo;{text}&rdquo;
      </p>
      <cite
        className="text-xs not-italic font-semibold"
        style={{ color: "var(--ink-3)" }}
      >
        — {source}
      </cite>
    </blockquote>
  );
}

// ── Horizontal bar chart ──────────────────────────────────────────────────────
function ChartSection({ title, subtitle, unit, bars }: {
  title: string; subtitle?: string; unit?: string;
  bars: { label: string; flag?: string; value: number; color?: string; note?: string }[];
}) {
  const max = Math.max(...bars.map(b => b.value));
  return (
    <div className="my-8">
      <ArticleRankingTable
        title={title}
        subtitle={subtitle}
        unit={unit}
        maxValue={max}
        rows={bars.map((b, i) => ({
          rank: i + 1,
          label: b.label,
          flag: b.flag,
          value: b.value,
          color: b.color,
          note: b.note,
        }))}
      />
    </div>
  );
}

// ── Image gallery ─────────────────────────────────────────────────────────────
function GallerySection({ title, images }: { title?: string; images: { url: string; caption: string; credit?: string }[] }) {
  const [active, setActive] = useState(0);
  return (
    <div className="my-8 rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
      {title && (
        <div className="px-5 py-3 border-b" style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}>
          <p className="text-xs font-bold" style={{ color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{title}</p>
        </div>
      )}
      {/* Main image */}
      <div className="relative" style={{ aspectRatio: "16/9", background: "var(--surface-2)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={active}
          src={images[active].url}
          alt={images[active].caption}
          className="w-full h-full object-cover"
          loading="lazy"
          style={{ display: "block" }}
        />
        <div className="absolute bottom-0 left-0 right-0 px-4 py-3" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)" }}>
          <p className="text-xs text-white leading-snug">{images[active].caption}</p>
          {images[active].credit && <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.58rem" }}>© {images[active].credit}</p>}
        </div>
      </div>
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 p-3 overflow-x-auto" style={{ background: "var(--surface-2)" }}>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="shrink-0 rounded-lg overflow-hidden transition-all"
              style={{
                width: "72px", height: "48px",
                outline: i === active ? "2px solid var(--accent)" : "2px solid transparent",
                opacity: i === active ? 1 : 0.55,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" className="w-full h-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Comparison table ──────────────────────────────────────────────────────────
function ComparisonTableSection({
  title, headers, rows,
}: {
  title: string; headers: string[]; rows: { label: string; flag?: string; cells: string[] }[];
}) {
  return (
    <div className="my-8 rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}>
        <p className="text-xs font-bold" style={{ color: "var(--ink)" }}>{title}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full" style={{ borderCollapse: "collapse" }}>
          <thead style={{ background: "var(--surface-2)" }}>
            <tr>
              <th className="px-4 py-2 text-left" style={{ color: "var(--ink-4)", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>Pays</th>
              {headers.map(h => (
                <th key={h} className="px-4 py-2 text-right" style={{ color: "var(--ink-4)", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.label} style={{ borderTop: "1px solid var(--border)", background: i % 2 === 1 ? "var(--surface-2)" : "var(--surface)" }}>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    {row.flag && <img src={`https://flagcdn.com/20x15/${row.flag}.png`} alt="" width={16} height={12} style={{ borderRadius: "2px", objectFit: "cover" }} />}
                    <span className="text-xs font-medium" style={{ color: "var(--ink)" }}>{row.label}</span>
                  </div>
                </td>
                {row.cells.map((cell, j) => (
                  <td key={j} className="px-4 py-2.5 text-right">
                    <span className="text-xs tabular-nums font-semibold" style={{ color: "var(--ink-2)" }}>{cell}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Structured list ───────────────────────────────────────────────────────────
function ListSection({
  heading, style = "bullet", items,
}: {
  heading?: string; style?: "bullet" | "number" | "check"; items: { text: string; note?: string }[];
}) {
  return (
    <div className="my-6">
      {heading && (
        <h2 className="text-lg font-bold mb-3" style={{ color: "var(--ink)", fontSize: "1.15rem" }}>
          {heading}
        </h2>
      )}
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5" style={{ width: "20px" }}>
              {style === "check" ? (
                <span className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "var(--accent-dim)", border: "1px solid rgba(57,255,136,0.3)" }}>
                  <Check size={10} style={{ color: "#0D7A40" }} />
                </span>
              ) : style === "number" ? (
                <span className="text-xs font-bold tabular-nums" style={{ color: "var(--accent)" }}>{i + 1}.</span>
              ) : (
                <span className="w-1.5 h-1.5 rounded-full mt-1.5 block" style={{ background: "var(--accent)" }} />
              )}
            </div>
            <div className="flex-1">
              <span className="text-sm leading-relaxed" style={{ color: "var(--ink-2)" }}>{item.text}</span>
              {item.note && <span className="block text-xs mt-0.5" style={{ color: "var(--ink-4)" }}>{item.note}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main renderer ─────────────────────────────────────────────────────────────
export function ArticleBody({ sections }: { sections: ArticleSection[] }) {
  return (
    <div className="article-body">
      {sections.map((section, i) => {
        switch (section.type) {
          case "lead":
            return (
              <p
                key={i}
                className="text-base leading-relaxed mb-6 font-medium"
                style={{ color: "var(--ink-2)", fontSize: "1.05rem", lineHeight: "1.75" }}
              >
                {section.content}
              </p>
            );

          case "text":
            return (
              <div key={i} className="mb-6">
                {section.heading && (
                  <h2
                    className="text-lg font-bold mb-3"
                    style={{ color: "var(--ink)", fontSize: "1.15rem" }}
                  >
                    {section.heading}
                  </h2>
                )}
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--ink-2)", lineHeight: "1.8" }}
                >
                  {section.content}
                </p>
              </div>
            );

          case "stats":
            return <StatsSection key={i} items={section.items} />;

          case "carousel":
            return <CarouselSection key={i} title={section.title} items={section.items} />;

          case "image-text":
            return (
              <ImageTextSection
                key={i}
                heading={section.heading}
                content={section.content}
                imageUrl={section.imageUrl}
                imageAlt={section.imageAlt}
                flip={section.flip}
              />
            );

          case "timeline":
            return <TimelineSection key={i} title={section.title} items={section.items} />;

          case "highlight":
            return <HighlightSection key={i} content={section.content} />;

          case "quote":
            return <QuoteSection key={i} text={section.text} source={section.source} />;

          case "chart":
            return <ChartSection key={i} title={section.title} subtitle={section.subtitle} unit={section.unit} bars={section.bars} />;

          case "gallery":
            return <GallerySection key={i} title={section.title} images={section.images} />;

          case "map-highlight":
            return <ArticleWorldMap key={i} title={section.title} subtitle={section.subtitle} countries={section.countries} legend={section.legend} />;

          case "comparison-table":
            return <ComparisonTableSection key={i} title={section.title} headers={section.headers} rows={section.rows} />;

          case "list":
            return <ListSection key={i} heading={section.heading} style={section.style} items={section.items} />;

          default:
            return null;
        }
      })}
    </div>
  );
}
