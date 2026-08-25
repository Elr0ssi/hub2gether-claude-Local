"use client";

import { useState } from "react";
import { ShieldCheck, BookMarked } from "lucide-react";
import { ReadingLanguageBar } from "@/components/learning/ReadingLanguageBar";
import { TranslationBubble } from "@/components/learning/TranslationBubble";
import { useSelectionTranslation } from "@/hooks/useSelectionTranslation";
import { TEST_ARTICLE } from "@/data/testArticle/testArticleData";
import {
  DebtChart,
  IdeaCarousel,
  KeyFigures,
  PartRule,
  PerspectiveCard,
  PullQuote,
} from "./pieces";

const ACCENT = "#39FF88";
const ACCENT_INK = "#0D7A40";

/* ═══════════════════════════════════════════════════════════════════════════
   The article itself. Reads top to bottom as: condensed opening beside its
   figures, five ideas, the series and how to read it, then the development in
   numbered parts — and it closes on where every figure came from.
   ═══════════════════════════════════════════════════════════════════════════ */

export function TestArticleBody() {
  const [learningEnabled, setLearningEnabled] = useState(true);
  const [targetLang, setTargetLang] = useState("en");
  const { containerRef, selection, clear } = useSelectionTranslation(learningEnabled);

  const { summary, parts, sources, transparency } = TEST_ARTICLE;

  return (
    <>
      {/* The reading mode opens the article, in its loud register. */}
      <ReadingLanguageBar
        fromLang="fr"
        toLang={targetLang}
        onToLangChange={setTargetLang}
        enabled={learningEnabled}
        emphasis
        onToggle={() => {
          setLearningEnabled((e) => !e);
          clear();
        }}
      />

      <div ref={containerRef}>
        {/* ── Condensed opening, figures alongside ── */}
        <section className="ta-open-row">
          <div>
            <p
              style={{
                fontSize: "0.6rem",
                fontWeight: 900,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: ACCENT_INK,
                marginBottom: 14,
              }}
            >
              {summary.label}
            </p>
            {summary.paragraphs.map((p, i) => (
              <p
                key={p.slice(0, 24)}
                style={{
                  fontSize: i === 0 ? "clamp(0.97rem, 1.1vw, 1.15rem)" : "clamp(0.89rem, 0.9vw, 0.95rem)",
                  lineHeight: 1.72,
                  color: i === 0 ? "var(--ink)" : "var(--ink-2)",
                  fontWeight: i === 0 ? 500 : 400,
                  marginBottom: 16,
                }}
              >
                {p}
              </p>
            ))}
          </div>

          <KeyFigures />
        </section>

        <IdeaCarousel />

        <DebtChart />

        {/* ── The development ── */}
        {parts.map((part) => (
          <section key={part.n}>
            <PartRule title={part.title} />

            {"intro" in part && part.intro && (
              <p
                style={{
                  fontSize: "clamp(0.93rem, 0.95vw, 1rem)",
                  lineHeight: 1.68,
                  color: "var(--ink-2)",
                  marginBottom: 22,
                  maxWidth: 760,
                }}
              >
                {part.intro}
              </p>
            )}

            {"paragraphs" in part &&
              part.paragraphs?.map((p) => (
                <p
                  key={p.slice(0, 24)}
                  style={{
                    fontSize: "clamp(0.89rem, 0.9vw, 0.95rem)",
                    lineHeight: 1.74,
                    color: "var(--ink-2)",
                    marginBottom: 16,
                    maxWidth: 760,
                  }}
                >
                  {p}
                </p>
              ))}

            {"pullQuote" in part && part.pullQuote && (
              <PullQuote
                text={part.pullQuote.text}
                attribution={part.pullQuote.attribution}
              />
            )}

            {"perspectives" in part && part.perspectives && (
              <div className="ta-perspective-row">
                {part.perspectives.map((p) => (
                  <PerspectiveCard
                    key={p.label}
                    label={p.label}
                    holders={p.holders}
                    body={p.body}
                  />
                ))}
              </div>
            )}
          </section>
        ))}

        {/* ── Sources ── */}
        <PartRule title={sources.label} />
        <p
          style={{
            fontSize: "0.9rem",
            lineHeight: 1.7,
            color: "var(--ink-3)",
            marginBottom: 20,
            maxWidth: 760,
          }}
        >
          {sources.intro}
        </p>
        <ul className="ta-source-row" style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {sources.items.map((s) => (
            <li
              key={s.name}
              style={{
                borderRadius: 12,
                border: "1px solid var(--border)",
                background: "var(--surface)",
                padding: "clamp(11px, 3.2vw, 14px) clamp(12px, 4vw, 16px)",
                display: "flex",
                gap: 11,
              }}
            >
              <BookMarked size={14} style={{ color: ACCENT_INK, flexShrink: 0, marginTop: 2 }} />
              <div>
                <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--ink)" }}>{s.name}</p>
                <p style={{ fontSize: "0.7rem", color: "var(--ink-4)", marginTop: 3, lineHeight: 1.5 }}>
                  {s.role}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* ── Transparency, AI Act ── */}
        <section
          style={{
            marginTop: 44,
            borderRadius: 18,
            border: `1px solid ${ACCENT}`,
            background: "rgba(57,255,136,0.06)",
            padding: "clamp(16px, 4.5vw, 24px) clamp(16px, 5vw, 26px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <ShieldCheck size={16} style={{ color: ACCENT_INK }} />
            <p
              style={{
                fontSize: "0.66rem",
                fontWeight: 900,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: ACCENT_INK,
              }}
            >
              {transparency.label}
            </p>
          </div>

          {transparency.body.map((p) => (
            <p
              key={p.slice(0, 24)}
              style={{
                fontSize: "0.88rem",
                lineHeight: 1.7,
                color: "var(--ink-2)",
                marginBottom: 12,
                maxWidth: 820,
              }}
            >
              {p}
            </p>
          ))}

          <div
            style={{
              marginTop: 16,
              paddingTop: 16,
              borderTop: "1px solid rgba(13,122,64,0.22)",
            }}
          >
            <p
              style={{
                fontSize: "0.62rem",
                fontWeight: 900,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--ink-3)",
                marginBottom: 8,
              }}
            >
              {transparency.aiAct.label}
            </p>
            <p style={{ fontSize: "0.82rem", lineHeight: 1.7, color: "var(--ink-3)", maxWidth: 820 }}>
              {transparency.aiAct.body}
            </p>
          </div>
        </section>
      </div>

      {selection && (
        <TranslationBubble
          text={selection.text}
          rect={selection.rect}
          fromLang="fr"
          toLang={targetLang}
        />
      )}
    </>
  );
}
