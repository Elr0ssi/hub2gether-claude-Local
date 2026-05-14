"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";
import type { ArticleSection } from "@/types";

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

          default:
            return null;
        }
      })}
    </div>
  );
}
