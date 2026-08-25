"use client";

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import {
  DUR,
  EASE as DECK_EASE,
  Eyebrow,
  Fade,
  Rise,
  Rule,
  SlideBody,
  useInk,
} from "@/components/presentation/primitives";
import {
  ACQUISITION,
  AI_SHIFT,
  ARTICLE_FORMAT,
  AUDIENCE,
  COMPETITION,
  COMPETITION_AXES,
  COMPETITION_TITLE,
  CONCLUSION,
  COVER,
  CROSS_CHECK,
  FINANCE,
  FINANCE_SLIDE,
  MARKET,
  PIPELINE,
  PIVOT_LINES,
  PROBLEM,
  PRODUCT,
  REVENUE,
  ROADMAP,
  S2_SLIDES,
  STATUS,
} from "@/data/soutenance2/soutenance2Data";
import {
  AcquisitionLoop,
  ArticlePipeline,
  CoverageMatrix,
  ExperienceChain,
  MarketFunnel,
  ProductScreenshotFrame,
  ReplicationDiagram,
  RevenueCurve,
  SourceFan,
  SourceConvergence,
  StatusTimeline,
  useAccent,
} from "./visuals";
import { AiShiftScene } from "./visuals/AiShift";
import {
  AutomationSlide,
  GeoSlide,
  PartnersSlide,
  PublicationsSlide,
  PartnershipsSlide,
} from "./newSlides";
import { useSlideStep } from "./useDeck";

/** The globe is the deck's signature — cover, product, expansion, close. */
const PresentationGlobe = dynamic(
  () => import("@/components/presentation/visuals/PresentationGlobe"),
  { ssr: false, loading: () => null }
);

/**
 * The § number of a slide, read off its place in the deck.
 *
 * Written by hand, these drifted every time a section was inserted: the number
 * on screen and the number in the summary disagreed, and eight slides had to
 * be edited to add one. Derived, they cannot.
 */
const sectionNo = (id: string): string => {
  const i = S2_SLIDES.findIndex((slide) => slide.id === id);
  return i <= 0 ? "§" : `§ ${String(i).padStart(2, "0")}`;
};

/* ── Shared title blocks ──────────────────────────────────────────────── */

function StatementTitle({
  lines,
  delay = 0,
  size = "t-h1",
}: {
  lines: readonly string[];
  delay?: number;
  size?: string;
}) {
  const ink = useInk();
  return (
    <div>
      {lines.map((line, i) => (
        <Rise key={line} delay={delay + i * 0.12} y={20}>
          <div
            className={size}
            style={{
              color: i === lines.length - 1 ? ink.primary : ink.muted,
              letterSpacing: "-0.035em",
            }}
          >
            {line}
          </div>
        </Rise>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   01 — COVER
   ═══════════════════════════════════════════════════════════════════════ */

function CoverSlide() {
  const ink = useInk();
  const accent = useAccent();

  /* Fond noir, comme la soutenance V1, et la promesse retirée : elle est dite
     à l'oral et revient plus loin dans le deck. Le contexte se lit d'une
     traite, sans le point qui le coupait de son libellé. */
  return (
    <SlideBody center>
      <div style={{ position: "absolute", right: 96, top: "50%", transform: "translateY(-50%)", zIndex: 1 }}>
        <Fade delay={0.15} duration={1.2}>
          <div style={{ width: 660, height: 660 }}>
            <PresentationGlobe tone={ink.tone} />
          </div>
        </Fade>
      </div>

      <div style={{ position: "relative", zIndex: 2, maxWidth: 940 }}>
        <Rise delay={0.05} y={12}>
          <p
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontStyle: "italic",
              fontSize: 25,
              fontWeight: 400,
              letterSpacing: "-0.01em",
              color: accent,
            }}
          >
            {COVER.context}
          </p>
        </Rise>

        <Rise delay={0.15} y={26}>
          <h1
            className="t-display"
            style={{ color: ink.primary, letterSpacing: "-0.05em", marginTop: 26 }}
          >
            The Essential
            <br />
            <span style={{ color: accent }}>Data</span>
          </h1>
        </Rise>

        <div style={{ marginTop: 44, maxWidth: 640 }}>
          <Rule delay={0.5} accentWidth={120} />
        </div>

        <Rise delay={0.7} y={12}>
          <div className="t-small" style={{ color: ink.faint, marginTop: 28, letterSpacing: "0.1em" }}>
            {COVER.tagline}
          </div>
        </Rise>
      </div>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   02 — LE PROBLÈME
   ═══════════════════════════════════════════════════════════════════════ */

function ProblemSlide() {
  const ink = useInk();
  const accent = useAccent();

  /* Les deux pourcentages qui fermaient cette slide sont passés sur « Pour
     qui » : ils décrivent une audience, pas une friction, et ils tassaient
     une colonne déjà pleine. Ce qui reste respire. */
  return (
    <SlideBody>
      <Eyebrow>Le problème</Eyebrow>

      <div style={{ marginTop: 34, maxWidth: 1100 }}>
        <StatementTitle lines={PROBLEM.title} delay={0.1} size="t-h2" />
      </div>

      <div
        style={{
          marginTop: 58,
          display: "grid",
          gridTemplateColumns: "1fr 680px",
          gap: 64,
          alignItems: "center",
          flex: 1,
          minHeight: 0,
        }}
      >
        <div style={{ display: "grid", gap: 38 }}>
          {PROBLEM.frictions.map((f, i) => (
            <Rise key={f.id} delay={0.4 + i * 0.13} y={16}>
              <div style={{ display: "flex", gap: 28, alignItems: "baseline" }}>
                <span
                  className="t-micro"
                  style={{ color: accent, minWidth: 118, letterSpacing: "0.14em" }}
                >
                  {f.label}
                </span>
                <span className="t-body" style={{ color: ink.secondary, maxWidth: 540 }}>
                  {f.body}
                </span>
              </div>
            </Rise>
          ))}
        </div>

        <div style={{ display: "grid", placeItems: "center" }}>
          <SourceFan labels={PROBLEM.scatter} startDelay={0.3} />
        </div>
      </div>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   03 — POUR QUI
   ═══════════════════════════════════════════════════════════════════════ */

function AudienceSlide() {
  const ink = useInk();
  const accent = useAccent();

  /* Les deux chiffres ouvrent la slide : ils ne décrivent pas une friction
     mais le public visé, celui qui ne croit pas ce qu'il lit et à qui l'on
     demande en plus de payer d'avance. Les segments suivent, avec leurs
     canaux. */
  return (
    <SlideBody>
      <Eyebrow>Pour qui</Eyebrow>

      <div style={{ marginTop: 30, maxWidth: 1180 }}>
        <StatementTitle lines={AUDIENCE.title} delay={0.1} />
      </div>

      <div
        style={{
          marginTop: 46,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.1fr)",
          gap: 56,
          alignItems: "start",
        }}
      >
        {AUDIENCE.stats.map((st, i) => (
          <Rise key={st.value} delay={0.38 + i * 0.14} y={18}>
            <div>
              <div
                className="t-display"
                style={{ color: accent, letterSpacing: "-0.05em", fontSize: 92, lineHeight: 1 }}
              >
                {st.value}
              </div>
              <p className="t-body" style={{ color: ink.secondary, marginTop: 16 }}>
                {st.body}
              </p>
              <p className="t-small" style={{ color: ink.faint, marginTop: 10 }}>
                {st.source}
              </p>
            </div>
          </Rise>
        ))}

        <Rise delay={0.66} y={18}>
          <div>
            <p className="t-micro" style={{ color: accent, letterSpacing: "0.14em", marginBottom: 14 }}>
              {AUDIENCE.paywall.label}
            </p>
            <p className="t-body" style={{ color: ink.muted, lineHeight: 1.55 }}>
              {AUDIENCE.paywall.body}
            </p>
          </div>
        </Rise>
      </div>

      <div style={{ marginTop: 40 }}>
        <Rule delay={0.8} />
      </div>

      <div
        style={{
          marginTop: 34,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.15fr) minmax(0, 1fr) minmax(0, 1fr)",
          gap: 56,
          alignItems: "start",
        }}
      >
        <Rise delay={0.9} y={16}>
          <div>
            <p className="t-micro" style={{ color: accent, letterSpacing: "0.14em", marginBottom: 12 }}>
              {AUDIENCE.core.label}
            </p>
            <p className="t-h3" style={{ color: ink.primary, letterSpacing: "-0.025em" }}>
              {AUDIENCE.core.body}
            </p>
          </div>
        </Rise>

        {AUDIENCE.segments.map((sg, i) => (
          <Rise key={sg.id} delay={1 + i * 0.14} y={16}>
            <div>
              <div className="t-h3" style={{ color: ink.primary, letterSpacing: "-0.03em" }}>
                {sg.label}
              </div>
              <div style={{ display: "flex", gap: 9, marginTop: 14, flexWrap: "wrap" }}>
                {sg.channels.map((c) => (
                  <span
                    key={c}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 100,
                      border: `1px solid ${accent}`,
                      color: accent,
                      fontSize: 15,
                      fontWeight: 700,
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>
              <div className="t-small" style={{ color: ink.muted, marginTop: 14 }}>
                {sg.body}
              </div>
            </div>
          </Rise>
        ))}
      </div>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   04 — LE PRODUIT
   ═══════════════════════════════════════════════════════════════════════ */

function ProductSlide() {
  const ink = useInk();

  return (
    <SlideBody>
      <Eyebrow>Le produit</Eyebrow>

      <Rise delay={0.1} y={22}>
        <h2 className="t-h1" style={{ color: ink.primary, letterSpacing: "-0.04em", marginTop: 30 }}>
          {PRODUCT.title}
        </h2>
      </Rise>

      <div
        style={{
          marginTop: 58,
          display: "grid",
          gridTemplateColumns: "430px 1fr",
          gap: 90,
          alignItems: "start",
          flex: 1,
        }}
      >
        <ExperienceChain steps={PRODUCT.chain} startDelay={0.35} />

        <div>
          <ProductScreenshotFrame
            label={PRODUCT.screenshot.label}
            caption={PRODUCT.screenshot.ratio}
            url="theessentialdata.com/map/economy"
            src="/soutenance/produit-carte.png"
            height={520}
            delay={0.45}
          />
          <Rise delay={0.9} y={10}>
            <div className="t-small" style={{ color: ink.faint, marginTop: 20 }}>
              {PRODUCT.demoNote}
            </div>
          </Rise>
        </div>
      </div>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   05 — LE MARCHÉ
   ═══════════════════════════════════════════════════════════════════════ */

function MarketSlide() {
  const ink = useInk();
  const accent = useAccent();

  return (
    <SlideBody>
      <Eyebrow>Le marché</Eyebrow>

      <div style={{ marginTop: 26, maxWidth: 1180 }}>
        <StatementTitle lines={MARKET.title} delay={0.1} size="t-h2" />
      </div>

      <div
        style={{
          marginTop: 40,
          display: "grid",
          gridTemplateColumns: "720px 1fr",
          gap: 90,
          alignItems: "center",
          flex: 1,
        }}
      >
        <MarketFunnel tiers={MARKET.funnel} startDelay={0.35} width={700} />

        <div>
          <Rise delay={0.9} y={20}>
            <div
              className="t-display"
              style={{ color: ink.primary, letterSpacing: "-0.05em", fontSize: 96, lineHeight: 1 }}
            >
              {MARKET.target.value}
            </div>
            <div className="t-body" style={{ color: ink.muted, marginTop: 14 }}>
              {MARKET.target.label}
            </div>
          </Rise>

          <div style={{ marginTop: 40, maxWidth: 430 }}>
            <Rule delay={1.05} accentWidth={80} />
          </div>

          <Rise delay={1.15} y={16}>
            <div style={{ marginTop: 32, display: "flex", alignItems: "baseline", gap: 20 }}>
              <span className="t-h1" style={{ color: accent, letterSpacing: "-0.04em" }}>
                {MARKET.target.share}
              </span>
              <span className="t-body" style={{ color: ink.secondary }}>
                {MARKET.target.shareLabel}
              </span>
            </div>
          </Rise>

          <Rise delay={1.32} y={14}>
            <p
              className="t-lead"
              style={{ color: ink.secondary, marginTop: 32, maxWidth: 460, letterSpacing: "-0.015em" }}
            >
              {MARKET.conclusion}
            </p>
          </Rise>
        </div>
      </div>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   06 — LA CONCURRENCE
   ═══════════════════════════════════════════════════════════════════════ */

function CompetitionSlide() {
  const ink = useInk();

  return (
    <SlideBody>
      <Eyebrow>La concurrence</Eyebrow>

      <div style={{ marginTop: 30, maxWidth: 1240 }}>
        <StatementTitle lines={COMPETITION_TITLE} delay={0.1} size="t-h2" />
      </div>

      <div style={{ marginTop: 46 }}>
        <CoverageMatrix axes={COMPETITION_AXES} rows={COMPETITION} startDelay={0.3} />
      </div>

      <Rise delay={1.05} y={10}>
        <div className="t-small" style={{ color: ink.faint, marginTop: 26, maxWidth: 1120 }}>
          {COMPETITION.find((c) => c.id === "courrier")?.limit}
        </div>
      </Rise>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   07 — MOTEUR D'ACQUISITION
   ═══════════════════════════════════════════════════════════════════════ */

function AcquisitionSlide() {
  const ink = useInk();
  const accent = useAccent();

  return (
    <SlideBody>
      <Eyebrow>Moteur d&apos;acquisition</Eyebrow>

      <div style={{ marginTop: 26, maxWidth: 900 }}>
        <StatementTitle lines={ACQUISITION.title} delay={0.1} size="t-h2" />
      </div>

      <div
        style={{
          marginTop: 24,
          display: "grid",
          gridTemplateColumns: "1fr 600px",
          gap: 70,
          alignItems: "center",
          flex: 1,
        }}
      >
        <div>
          <div style={{ display: "grid", gap: 22, maxWidth: 520 }}>
            {ACQUISITION.channels.map((c, i) => (
              <Rise key={c.id} delay={0.6 + i * 0.13} y={16}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 22,
                    paddingBottom: 22,
                    borderBottom: `1px solid ${ink.rule}`,
                  }}
                >
                  <span className="t-h3" style={{ color: ink.primary, minWidth: 168, letterSpacing: "-0.025em" }}>
                    {c.label}
                  </span>
                  <span>
                    <span className="t-micro" style={{ color: accent, display: "block" }}>
                      {c.rank}
                    </span>
                    <span className="t-small" style={{ color: ink.muted, display: "block", marginTop: 6 }}>
                      {c.body}
                    </span>
                  </span>
                </div>
              </Rise>
            ))}
          </div>

          <Rise delay={1.05} y={10}>
            <div className="t-small" style={{ color: ink.faint, marginTop: 28, maxWidth: 480 }}>
              {ACQUISITION.note}
            </div>
          </Rise>
        </div>

        <div style={{ display: "grid", placeItems: "center" }}>
          <AcquisitionLoop steps={ACQUISITION.loop} startDelay={0.3} size={560} />
        </div>
      </div>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   08 — L'IA COMME CANAL
   Six states in one scene. The header changes a line, the composition below
   it transforms; nothing here is a new slide, which is what lets the chain's
   nodes travel instead of being replaced.
   ═══════════════════════════════════════════════════════════════════════ */

function AiShiftSlide() {
  const ink = useInk();
  const accent = useAccent();
  const step = useSlideStep();
  const state = AI_SHIFT.states[Math.min(step, AI_SHIFT.states.length - 1)];

  return (
    <SlideBody style={{ paddingTop: 72, paddingBottom: 78 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <Eyebrow>{AI_SHIFT.label}</Eyebrow>

        {/* State counter — the presenter's place in the sequence, and the
            audience's. Deliberately quiet. */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {AI_SHIFT.states.map((s, i) => (
            <span
              key={s.id}
              style={{
                width: i === step ? 22 : 6,
                height: 2,
                borderRadius: 2,
                background: i === step ? accent : ink.rule,
                transition: "width .45s cubic-bezier(0.16,1,0.3,1), background .45s",
              }}
            />
          ))}
          <span className="t-index" style={{ color: ink.faint, marginLeft: 8 }}>
            {state.ordinal} / {AI_SHIFT.states.length.toString().padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* One line, swapped rather than stacked. */}
      <div style={{ marginTop: 22, height: 74 }}>
        <AnimatePresence mode="wait">
          {state.title && (
            <motion.div
              key={state.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: DECK_EASE }}
              className="t-h2"
              style={{ color: ink.primary, letterSpacing: "-0.032em" }}
            >
              {state.title}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{ flex: 1, display: "grid", placeItems: "center", marginTop: 8 }}>
        <AiShiftScene step={step} />
      </div>

      <div style={{ height: 34 }}>
        <AnimatePresence mode="wait">
          {state.caption && (
            <motion.div
              key={`${state.id}-caption`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: DECK_EASE }}
              className="t-small"
              style={{ color: ink.faint }}
            >
              {state.caption}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   09 — MODÈLE ÉCONOMIQUE
   ═══════════════════════════════════════════════════════════════════════ */

function RevenueSlide() {
  const ink = useInk();
  const accent = useAccent();

  return (
    <SlideBody>
      <Eyebrow>Modèle économique</Eyebrow>

      <div style={{ marginTop: 34, maxWidth: 1080 }}>
        <StatementTitle lines={REVENUE.title} delay={0.1} />
      </div>

      <div
        style={{
          marginTop: 76,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 70,
        }}
      >
        {REVENUE.streams.map((s, i) => (
          <Rise key={s.index} delay={0.4 + i * 0.15} y={20}>
            <div>
              <div className="t-index" style={{ color: accent, fontSize: 20, fontWeight: 800 }}>
                {s.index}
              </div>
              <div style={{ marginTop: 18 }}>
                <Rule delay={0.5 + i * 0.15} accentWidth={44} />
              </div>
              <div className="t-h3" style={{ color: ink.primary, marginTop: 26, letterSpacing: "-0.028em" }}>
                {s.label}
              </div>
              <div className="t-body" style={{ color: ink.muted, marginTop: 18 }}>
                {s.body}
              </div>
            </div>
          </Rise>
        ))}
      </div>

      <div style={{ marginTop: "auto", paddingTop: 60 }}>
        <div style={{ display: "flex", gap: 90 }}>
          {REVENUE.absolutes.map((a, i) => (
            <Rise key={a.label} delay={0.95 + i * 0.14} y={16}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
                <span className="t-h1" style={{ color: accent, letterSpacing: "-0.045em" }}>
                  {a.value}
                </span>
                <span className="t-body" style={{ color: ink.secondary }}>
                  {a.label}
                </span>
              </div>
            </Rise>
          ))}
        </div>
      </div>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   PIVOT
   ═══════════════════════════════════════════════════════════════════════ */

function PivotSlide() {
  const ink = useInk();
  const accent = useAccent();

  return (
    <SlideBody center>
      <div style={{ maxWidth: 1280 }}>
        {PIVOT_LINES.map((line, i) => (
          <Rise key={line} delay={0.15 + i * 0.55} y={22} duration={DUR.slow}>
            <div
              className={i === 2 ? "t-h1" : "t-h2"}
              style={{
                color: i === 2 ? accent : i === 1 ? ink.secondary : ink.muted,
                letterSpacing: "-0.035em",
                marginTop: i === 0 ? 0 : 44,
              }}
            >
              {line}
            </div>
          </Rise>
        ))}
      </div>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   09 — LE TRAVAIL DE RECOUPEMENT
   ═══════════════════════════════════════════════════════════════════════ */

function CrossCheckSlide() {
  const ink = useInk();
  const accent = useAccent();

  return (
    <SlideBody>
      <Eyebrow>Le travail de recoupement</Eyebrow>

      <Rise delay={0.1} y={22}>
        <h2
          className="t-h2"
          style={{ color: ink.primary, letterSpacing: "-0.035em", marginTop: 26, maxWidth: 1320 }}
        >
          {CROSS_CHECK.title}
        </h2>
      </Rise>

      <div style={{ marginTop: 34, flex: 1, display: "grid", placeItems: "center" }}>
        <SourceConvergence
          french={CROSS_CHECK.french}
          international={CROSS_CHECK.international}
          hub={CROSS_CHECK.hub}
          output={CROSS_CHECK.output}
          startDelay={0.3}
          width={1440}
          height={600}
        />
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 60 }}>
        {CROSS_CHECK.panel.map((p, i) => (
          <Rise key={p.label} delay={2.1 + i * 0.12} y={12}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
              <span className="t-h2" style={{ color: accent, letterSpacing: "-0.04em" }}>
                {p.value}
              </span>
              <span className="t-body" style={{ color: ink.secondary }}>
                {p.label}
              </span>
            </div>
          </Rise>
        ))}
        <Rise delay={2.36} y={10}>
          <span className="t-small" style={{ color: ink.faint }}>
            {CROSS_CHECK.note}
          </span>
        </Rise>
      </div>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   10 — COMMENT NAÎT UN ARTICLE
   ═══════════════════════════════════════════════════════════════════════ */

function PipelineSlide() {
  const ink = useInk();

  return (
    <SlideBody>
      <Eyebrow>Comment naît un article</Eyebrow>

      {/* Stages and statement travel together, centred in what the header
          leaves. Split apart — the stages pinned under the header, the
          statement pinned to the floor — the slide carried a band of nothing
          between them wide enough to read as a mistake. */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 64,
        }}
      >
        <ArticlePipeline steps={PIPELINE.steps} startDelay={0.25} />

        <div>
          <Rule delay={1.2} accentWidth={140} />
          <div style={{ marginTop: 32 }}>
            {PIPELINE.statement.map((line, i) => (
              <Rise key={line} delay={1.3 + i * 0.16} y={18}>
                <div
                  className="t-h1"
                  style={{
                    color: i === 1 ? ink.primary : ink.muted,
                    letterSpacing: "-0.04em",
                    display: "inline",
                    marginRight: 20,
                  }}
                >
                  {line}
                </div>
              </Rise>
            ))}
          </div>
        </div>
      </div>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   11 — LE FORMAT ARTICLE
   ═══════════════════════════════════════════════════════════════════════ */

function ArticleSlide() {
  const ink = useInk();
  const accent = useAccent();

  return (
    <SlideBody>
      <Eyebrow>Le format article</Eyebrow>

      <div style={{ marginTop: 28 }}>
        {ARTICLE_FORMAT.title.map((line: string, i: number) => (
          <Rise key={line} delay={0.1 + i * 0.12} y={18}>
            <div
              className="t-h2"
              style={{
                color: i === 1 ? ink.primary : ink.muted,
                letterSpacing: "-0.035em",
                display: "inline",
                marginRight: 18,
              }}
            >
              {line}
            </div>
          </Rise>
        ))}
      </div>

      <div
        style={{
          marginTop: 46,
          display: "grid",
          gridTemplateColumns: "1fr 470px",
          gap: 74,
          alignItems: "start",
          flex: 1,
        }}
      >
        <ProductScreenshotFrame
          label={ARTICLE_FORMAT.screenshot.label}
          caption={ARTICLE_FORMAT.screenshot.ratio}
          url="theessentialdata.com/articles/…"
          src="/soutenance/article-format.png"
          height={540}
          delay={0.35}
        />

        <div>
          <div style={{ display: "grid", gap: 34 }}>
            {ARTICLE_FORMAT.layers.map((l, i) => (
              <Rise key={l.id} delay={0.55 + i * 0.16} y={16}>
                <div>
                  <div
                    className="t-micro"
                    style={{ color: accent, letterSpacing: "0.14em", marginBottom: 12 }}
                  >
                    {l.time}
                  </div>
                  <Rule delay={0.6 + i * 0.16} />
                  <div className="t-body" style={{ color: ink.secondary, marginTop: 14 }}>
                    {l.items.join(" · ")}
                  </div>
                </div>
              </Rise>
            ))}
          </div>

          <Rise delay={1.15} y={14}>
            <div style={{ marginTop: 46 }}>
              <div className="t-micro" style={{ color: ink.muted, marginBottom: 14 }}>
                Traçabilité
              </div>
              <div style={{ display: "grid", gap: 10 }}>
                {ARTICLE_FORMAT.traceability.map((step, i) => (
                  <div key={step} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: accent,
                        opacity: 1 - i * 0.22,
                      }}
                    />
                    <span className="t-small" style={{ color: ink.secondary }}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Rise>

          <Rise delay={1.35} y={12}>
            <div style={{ marginTop: 32 }}>
              <span className="ted-data-slot" data-tone={ink.tone}>
                {ARTICLE_FORMAT.dataExport}
              </span>
              <div className="t-small" style={{ color: ink.faint, marginTop: 10, maxWidth: 400 }}>
                Réutilisation des données brutes, à confirmer dans le produit avant
                d&apos;être annoncée.
              </div>
            </div>
          </Rise>
        </div>
      </div>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   12 — OÙ EN EST LE PROJET
   ═══════════════════════════════════════════════════════════════════════ */

function StatusSlide() {
  const ink = useInk();
  const accent = useAccent();

  return (
    <SlideBody>
      <Eyebrow>Où en est le projet</Eyebrow>

      <div style={{ marginTop: 30, maxWidth: 1080 }}>
        <StatementTitle lines={STATUS.title} delay={0.1} />
      </div>

      <div
        style={{
          marginTop: 50,
          display: "grid",
          gridTemplateColumns: "500px 1fr",
          gap: 96,
          alignItems: "start",
          flex: 1,
        }}
      >
        <StatusTimeline steps={STATUS.timeline} startDelay={0.35} />

        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60 }}>
            {[STATUS.online, STATUS.paused].map((block, bi) => (
              <Rise key={block.label} delay={0.7 + bi * 0.16} y={18}>
                <div>
                  <div
                    className="t-micro"
                    style={{
                      color: bi === 0 ? accent : ink.muted,
                      letterSpacing: "0.13em",
                      marginBottom: 16,
                    }}
                  >
                    {block.label}
                  </div>
                  <Rule delay={0.75 + bi * 0.16} />
                  <ul style={{ listStyle: "none", margin: "20px 0 0", padding: 0, display: "grid", gap: 12 }}>
                    {block.items.map((item) => (
                      <li key={item} className="t-body" style={{ color: ink.secondary }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Rise>
            ))}
          </div>

          <Rise delay={1.05} y={16}>
            <div style={{ marginTop: 52 }}>
              <div className="t-micro" style={{ color: ink.faint, marginBottom: 10 }}>
                {STATUS.why.label}
              </div>
              <div className="t-body" style={{ color: ink.muted, maxWidth: 620 }}>
                {STATUS.why.body}
              </div>
            </div>
          </Rise>

          <Rise delay={1.25} y={18}>
            <div
              style={{
                marginTop: 46,
                paddingLeft: 26,
                borderLeft: `2px solid ${accent}`,
                maxWidth: 700,
              }}
            >
              {STATUS.statement.map((line, i) => (
                <div
                  key={line}
                  className="t-h3"
                  style={{
                    color: i === 1 ? ink.primary : ink.muted,
                    letterSpacing: "-0.028em",
                    marginTop: i === 0 ? 0 : 10,
                  }}
                >
                  {line}
                </div>
              ))}
            </div>
          </Rise>
        </div>
      </div>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   13 — CHIFFRES CLÉS DU BUSINESS PLAN
   ═══════════════════════════════════════════════════════════════════════ */

function FinanceSlide() {
  const ink = useInk();
  const accent = useAccent();

  return (
    <SlideBody>
      <Eyebrow>Chiffres clés du business plan</Eyebrow>

      <div style={{ marginTop: 30, maxWidth: 1080 }}>
        <StatementTitle lines={FINANCE_SLIDE.title} delay={0.1} />
      </div>

      <div
        style={{
          marginTop: 40,
          display: "grid",
          gridTemplateColumns: "1fr 430px",
          gap: 80,
          alignItems: "center",
          flex: 1,
        }}
      >
        <RevenueCurve years={FINANCE} startDelay={0.35} width={940} height={400} />

        <div>
          <Rise delay={1.0} y={18}>
            <div>
              <div className="t-micro" style={{ color: ink.muted, letterSpacing: "0.13em" }}>
                {FINANCE_SLIDE.breakeven.label}
              </div>
              <div
                className="t-display"
                style={{ color: accent, letterSpacing: "-0.05em", fontSize: 104, lineHeight: 1.05, marginTop: 10 }}
              >
                {FINANCE_SLIDE.breakeven.value}
              </div>
            </div>
          </Rise>

          <div style={{ marginTop: 40 }}>
            <Rule delay={1.15} accentWidth={70} />
          </div>

          <Rise delay={1.25} y={16}>
            <div style={{ marginTop: 30 }}>
              <div className="t-micro" style={{ color: ink.muted, letterSpacing: "0.13em" }}>
                {FINANCE_SLIDE.funding.label}
              </div>
              <div className="t-h1" style={{ color: ink.primary, letterSpacing: "-0.04em", marginTop: 8 }}>
                {FINANCE_SLIDE.funding.value}
              </div>
            </div>
          </Rise>

          <Rise delay={1.45} y={12}>
            <div className="t-small" style={{ color: ink.faint, marginTop: 34, lineHeight: 1.6 }}>
              {FINANCE_SLIDE.note}
            </div>
          </Rise>

          <Rise delay={1.6} y={10}>
            <div
              className="t-micro"
              style={{
                color: ink.muted,
                marginTop: 22,
                border: `1px solid ${ink.rule}`,
                borderRadius: 100,
                padding: "9px 16px",
                display: "inline-block",
              }}
            >
              {FINANCE_SLIDE.disclaimer}
            </div>
          </Rise>
        </div>
      </div>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   14 — ROADMAP
   ═══════════════════════════════════════════════════════════════════════ */

function RoadmapSlide() {
  const ink = useInk();

  return (
    <SlideBody>
      <div style={{ position: "absolute", right: -180, top: "50%", transform: "translateY(-50%)", opacity: 0.5 }}>
        <Fade delay={0.4} duration={1.4}>
          <div style={{ width: 720, height: 720 }}>
            <PresentationGlobe tone={ink.tone} dotOpacity={0.5} />
          </div>
        </Fade>
      </div>

      <div style={{ position: "relative", zIndex: 2 }}>
        <Eyebrow>Roadmap</Eyebrow>

        <div style={{ marginTop: 28, display: "flex", gap: 26 }}>
          {ROADMAP.title.map((word, i) => (
            <Rise key={word} delay={0.1 + i * 0.13} y={20}>
              <span className="t-h1" style={{ color: ink.primary, letterSpacing: "-0.04em" }}>
                {word}
              </span>
            </Rise>
          ))}
        </div>

        <div style={{ marginTop: 46 }}>
          <ReplicationDiagram phases={ROADMAP.phases} startDelay={0.4} width={1240} height={420} />
        </div>

        <Rise delay={1.7} y={14}>
          <p
            className="t-lead"
            style={{ color: ink.secondary, marginTop: 40, maxWidth: 860, letterSpacing: "-0.015em" }}
          >
            {ROADMAP.statement}
          </p>
        </Rise>
      </div>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   15 — CONCLUSION
   ═══════════════════════════════════════════════════════════════════════ */

function ConclusionSlide() {
  const ink = useInk();
  const accent = useAccent();

  return (
    <SlideBody>
      <div style={{ position: "absolute", right: -220, bottom: -220, opacity: 0.42 }}>
        <Fade delay={0.5} duration={1.6}>
          <div style={{ width: 860, height: 860 }}>
            <PresentationGlobe tone={ink.tone} dotOpacity={0.42} />
          </div>
        </Fade>
      </div>

      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", height: "100%" }}>
        <Eyebrow>Conclusion</Eyebrow>

        <div style={{ marginTop: 24, maxWidth: 1180 }}>
          <StatementTitle lines={CONCLUSION.lines} delay={0.1} size="t-h3" />
        </div>

        <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "repeat(3, 290px)", gap: 56 }}>
          {CONCLUSION.needs.map((n, i) => (
            <Rise key={n.id} delay={0.5 + i * 0.14} y={18}>
              <div>
                <div className="t-h3" style={{ color: accent, letterSpacing: "-0.03em" }}>
                  {n.label}
                </div>
                <div style={{ marginTop: 16 }}>
                  <Rule delay={0.58 + i * 0.14} />
                </div>
                <ul style={{ listStyle: "none", margin: "20px 0 0", padding: 0, display: "grid", gap: 9 }}>
                  {n.items.map((item) => (
                    <li key={item} className="t-small" style={{ color: ink.muted }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Rise>
          ))}
        </div>

        <div style={{ marginTop: "auto", paddingTop: 36 }}>
          {CONCLUSION.close.map((line, i) => (
            <Rise key={line} delay={1.05 + i * 0.3} y={18}>
              <div
                className="t-h2"
                style={{
                  color: i === 1 ? ink.primary : ink.muted,
                  letterSpacing: "-0.035em",
                  marginTop: i === 0 ? 0 : 12,
                }}
              >
                {line}
              </div>
            </Rise>
          ))}

          <Rise delay={1.75} y={14}>
            <div style={{ marginTop: 32, display: "flex", alignItems: "baseline", gap: 30, flexWrap: "wrap" }}>
              <span className="t-h3" style={{ color: accent, letterSpacing: "-0.03em" }}>
                {CONCLUSION.signature.wordmark}
              </span>
              <span className="t-small" style={{ color: ink.secondary }}>
                {CONCLUSION.signature.promise.join(" ")}
              </span>
              <span className="t-small" style={{ color: ink.faint, letterSpacing: "0.1em" }}>
                {CONCLUSION.signature.tagline}
              </span>
            </div>
          </Rise>
        </div>
      </div>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   REGISTRY — keys match S2_SLIDES[].id; the order lives in the data file.
   ═══════════════════════════════════════════════════════════════════════ */

export const S2_VIEWS: Record<string, ComponentType> = {
  cover: CoverSlide,
  probleme: ProblemSlide,
  cible: AudienceSlide,
  produit: ProductSlide,
  marche: MarketSlide,
  concurrence: CompetitionSlide,
  acquisition: AcquisitionSlide,
  publications: () => <PublicationsSlide index={sectionNo("publications")} />,
  partenariats: () => <PartnershipsSlide index={sectionNo("partenariats")} />,
  ia: AiShiftSlide,
  geo: () => <GeoSlide index={sectionNo("geo")} />,
  partenaires: () => <PartnersSlide index={sectionNo("partenaires")} />,
  modele: RevenueSlide,
  pivot: PivotSlide,
  recoupement: CrossCheckSlide,
  pipeline: PipelineSlide,
  automatisation: () => <AutomationSlide index={sectionNo("automatisation")} />,
  article: ArticleSlide,
  etat: StatusSlide,
  finance: FinanceSlide,
  roadmap: RoadmapSlide,
  conclusion: ConclusionSlide,
};
