"use client";

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Fragment, type ComponentType, type ReactNode } from "react";
import {
  DUR,
  EASE as DECK_EASE,
  useDeckReducedMotion,
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
  FundingSlide,
  TeamSlide,
  ContextSlide,
  EditorialSlide,
  IdeaSlide,
  LaterSlide,
  LegalSlide,
  WorkshopSlide,
  GeoSlide,
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
export const sectionNo = (id: string): string => {
  const i = S2_SLIDES.findIndex((slide) => slide.id === id);
  return i <= 0 ? "§" : `§ ${String(i).padStart(2, "0")}`;
};

/* ── Shared title blocks ──────────────────────────────────────────────── */

export function StatementTitle({
  lines,
  delay = 0,
  size = "t-h2",
}: {
  lines: readonly string[];
  delay?: number;
  size?: string;
}) {
  const ink = useInk();
  const reduced = useDeckReducedMotion();

  /* L'ordre de lecture, joué plutôt qu'indiqué.
     Chaque ligne arrive à pleine encre, puis s'estompe au moment où la
     suivante se pose : l'œil suit la ligne qui vient d'apparaître, et le
     titre se lit dans l'ordre où il a été écrit au lieu de tomber d'un bloc
     avec ses hiérarchies déjà figées. Le décalage d'une demi-seconde entre la
     pose et l'estompe laisse le temps de lire avant de rendre la main. */
  const STEP = 0.62;

  return (
    <div>
      {lines.map((line, i) => {
        const last = i === lines.length - 1;
        const at = delay + i * STEP;
        return (
          <motion.div
            key={line}
            className={size}
            initial={reduced ? { opacity: 1, y: 0, color: ink.primary } : { opacity: 0, y: 22, color: ink.primary }}
            animate={{ opacity: 1, y: 0, color: last ? ink.primary : ink.muted }}
            transition={{
              opacity: { duration: reduced ? 0.001 : 0.5, delay: at, ease: DECK_EASE },
              y: { duration: reduced ? 0.001 : 0.5, delay: at, ease: DECK_EASE },
              color: { duration: reduced ? 0.001 : 0.45, delay: at + STEP - 0.08, ease: DECK_EASE },
            }}
            style={{ letterSpacing: "-0.035em" }}
          >
            {line}
          </motion.div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   01 — COVER
   ═══════════════════════════════════════════════════════════════════════ */

export function CoverSlide() {
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

      </div>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   02 — LE PROBLÈME
   ═══════════════════════════════════════════════════════════════════════ */

export function ProblemSlide() {
  const ink = useInk();
  const accent = useAccent();

  /* Les deux pourcentages qui fermaient cette slide sont passés sur « Pour
     qui » : ils décrivent une audience, pas une friction, et ils tassaient
     une colonne déjà pleine. Ce qui reste respire. */
  return (
    <SlideBody>
      <Eyebrow>Le problème</Eyebrow>

      <div style={{ marginTop: 34, maxWidth: 1100 }}>
        <StatementTitle lines={PROBLEM.title} delay={0.1} />
      </div>

      <div
        style={{
          marginTop: 58,
          display: "grid",
          gridTemplateColumns: "1fr 620px",
          gap: 56,
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
                <span className="t-h3" style={{ color: ink.secondary, maxWidth: 560, fontWeight: 500, letterSpacing: "-0.018em" }}>
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

export function AudienceSlide() {
  const ink = useInk();
  const accent = useAccent();

  return (
    <SlideBody>
      <Eyebrow>Pour qui</Eyebrow>

      <div style={{ marginTop: 26, maxWidth: 1180 }}>
        <StatementTitle lines={AUDIENCE.title} delay={0.1} />
      </div>

      {/* Les deux chiffres au milieu de la slide, chacun dans son cadre, et la
          cible posée dans le même rang : trois cartes se comparent, trois
          paragraphes se lisent. */}
      <div
        style={{
          marginTop: "auto",
          marginBottom: "auto",
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 34,
        }}
      >
        {AUDIENCE.stats.map((st, i) => (
          <Rise key={st.value} delay={0.38 + i * 0.14} y={18}>
            <div
              style={{
                padding: "34px 34px 30px",
                borderRadius: 18,
                border: `1px solid ${ink.rule}`,
                background: ink.tone === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.015)",
                height: "100%",
              }}
            >
              <div className="t-display" style={{ color: accent, letterSpacing: "-0.05em", lineHeight: 1 }}>
                {st.value}
              </div>
              <p className="t-body" style={{ color: ink.secondary, marginTop: 18 }}>
                {st.body}
              </p>
            </div>
          </Rise>
        ))}

        <Rise delay={0.66} y={18}>
          <div
            style={{
              padding: "34px 34px 30px",
              borderRadius: 18,
              border: `1px solid ${accent}`,
              background: ink.tone === "dark" ? "rgba(57,255,136,0.06)" : "rgba(57,255,136,0.07)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <p className="t-micro" style={{ color: accent, letterSpacing: "0.14em" }}>
              Cible
            </p>
            <p className="t-h3" style={{ color: ink.primary, letterSpacing: "-0.025em", marginTop: 16 }}>
              {AUDIENCE.core}
            </p>
            <div style={{ marginTop: "auto", paddingTop: 22, display: "grid", gap: 10 }}>
              {AUDIENCE.segments.map((sg) => (
                <div key={sg.id} style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                  <span className="t-small" style={{ color: ink.muted }}>{sg.label}</span>
                  {sg.channels.map((c) => (
                    <span
                      key={c}
                      style={{
                        padding: "4px 11px",
                        borderRadius: 100,
                        border: `1px solid ${accent}`,
                        color: accent,
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Rise>
      </div>

      <Rise delay={0.9} y={10}>
        <p className="t-small" style={{ color: ink.faint }}>
          {AUDIENCE.source}
        </p>
      </Rise>

    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   04 — LE PRODUIT
   ═══════════════════════════════════════════════════════════════════════ */

export function ProductSlide() {
  const ink = useInk();

  return (
    <SlideBody>
      <Eyebrow>Le produit</Eyebrow>

      <Rise delay={0.1} y={22}>
        <h2 className="t-h2" style={{ color: ink.primary, letterSpacing: "-0.035em", marginTop: 26 }}>
          {PRODUCT.title}
        </h2>
      </Rise>

      <div
        style={{
          marginTop: 44,
          display: "grid",
          gridTemplateColumns: "430px 1fr",
          gap: 90,
          alignItems: "center",
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* La chaîne de gestes descend au milieu de la hauteur : collée sous le
            titre, elle ne répondait pas à la capture qui lui fait face. */}
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

export function MarketSlide() {
  const ink = useInk();
  const accent = useAccent();

  /* Des ronds emboîtés à gauche, chacun portant son montant, et les mesures du
     marché en regard à droite. Un rond dans un rond dit une inclusion mieux
     qu'une ligne de chiffres, et laisse la colonne de droite libre pour ce qui
     se lit, et non se voit. */
  const S = 520;
  const sizes = [1, 0.66, 0.3];

  return (
    <SlideBody>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 24 }}>
        <Eyebrow>Le marché</Eyebrow>
        <span className="t-micro" style={{ color: ink.faint, letterSpacing: "0.1em" }}>
          {MARKET.reminder}
        </span>
      </div>

      <div style={{ marginTop: 26, maxWidth: 1180 }}>
        <StatementTitle lines={MARKET.title} delay={0.1} />
      </div>

      <div
        style={{
          marginTop: 36,
          flex: 1,
          minHeight: 0,
          display: "grid",
          gridTemplateColumns: `${S}px minmax(0, 1fr)`,
          gap: 90,
          alignItems: "center",
        }}
      >
        <div style={{ position: "relative", width: S, height: S }}>
          {MARKET.circles.map((c, i) => {
            const d = S * sizes[i];
            const inner = i === 2;
            return (
              <Rise
                key={c.id}
                delay={0.35 + i * 0.18}
                y={0}
                style={{
                  position: "absolute",
                  left: (S - d) / 2,
                  top: S - d,
                  width: d,
                  height: d,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    border: `1px solid ${inner ? accent : ink.rule}`,
                    background: inner
                      ? ink.tone === "dark"
                        ? "rgba(57,255,136,0.14)"
                        : "rgba(57,255,136,0.16)"
                      : ink.tone === "dark"
                      ? "rgba(255,255,255,0.02)"
                      : "rgba(0,0,0,0.012)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    paddingTop: inner ? d * 0.3 : 20,
                    textAlign: "center",
                  }}
                >
                  <span
                    className={inner ? "t-h3" : "t-h3"}
                    style={{ color: inner ? accent : ink.primary, letterSpacing: "-0.028em" }}
                  >
                    {c.value}
                  </span>
                  <span className="t-small" style={{ color: ink.muted, marginTop: 4, maxWidth: d * 0.8 }}>
                    {c.label}
                  </span>
                </div>
              </Rise>
            );
          })}
        </div>

        <div>
          <Rise delay={0.5} y={12}>
            <p className="t-micro" style={{ color: accent, letterSpacing: "0.14em", marginBottom: 20 }}>
              {MARKET.sideLabel}
            </p>
          </Rise>
          <div style={{ display: "grid", gap: 14 }}>
            {MARKET.side.map((m, i) => (
              <Rise key={m.label} delay={0.58 + i * 0.11} y={12}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1fr) auto",
                    gap: 26,
                    alignItems: "baseline",
                    paddingBottom: 13,
                    borderBottom: `1px solid ${ink.rule}`,
                  }}
                >
                  <span className="t-body" style={{ color: ink.muted }}>{m.label}</span>
                  <span className="t-h2" style={{ color: ink.primary, letterSpacing: "-0.035em" }}>
                    {m.value}
                  </span>
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
   LES ACTEURS
   ═══════════════════════════════════════════════════════════════════════ */

export function PlayersSlide() {
  const ink = useInk();
  const accent = useAccent();

  return (
    <SlideBody>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 24 }}>
        <Eyebrow>Les acteurs</Eyebrow>
        <span className="t-micro" style={{ color: ink.faint, letterSpacing: "0.1em" }}>
          {MARKET.reminder}
        </span>
      </div>

      <div style={{ marginTop: 26, maxWidth: 1180 }}>
        <StatementTitle lines={["Qui occupe le terrain, en France."]} delay={0.1} />
      </div>

      <div style={{ marginTop: "auto", marginBottom: "auto", paddingTop: 44 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.6fr) repeat(3, minmax(0, 1fr))",
            gap: "0 32px",
          }}
        >
          {MARKET.playersColumns.map((c, i) => (
            <p
              key={c}
              className="t-micro"
              style={{
                color: ink.faint,
                paddingBottom: 12,
                borderBottom: `1px solid ${ink.rule}`,
                textAlign: i === 0 ? "left" : "right",
              }}
            >
              {c}
            </p>
          ))}

          {MARKET.players.map((pl) => (
            <Fragment key={pl.name}>
              <p className="t-h3" style={{ color: ink.primary, padding: "15px 0", borderBottom: `1px solid ${ink.rule}`, letterSpacing: "-0.024em" }}>
                {pl.name}
              </p>
              <p className="t-body" style={{ color: accent, padding: "15px 0", borderBottom: `1px solid ${ink.rule}`, textAlign: "right" }}>
                {pl.visits}
              </p>
              <p className="t-body" style={{ color: ink.muted, padding: "15px 0", borderBottom: `1px solid ${ink.rule}`, textAlign: "right" }}>
                {pl.model}
              </p>
              <p className="t-body" style={{ color: ink.secondary, padding: "15px 0", borderBottom: `1px solid ${ink.rule}`, textAlign: "right" }}>
                {pl.revenue}
              </p>
            </Fragment>
          ))}
        </div>

        <p className="t-small" style={{ color: ink.faint, marginTop: 16 }}>
          {MARKET.playersNote}
        </p>
      </div>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   06 — LA CONCURRENCE
   ═══════════════════════════════════════════════════════════════════════ */

export function CompetitionSlide({
  /* Un bandeau rendu sous la matrice. Absent par défaut, donc les V2 et V3
     s'affichent exactement comme avant ; la V4 y pose son benchmark. */
  footer,
}: { footer?: ReactNode } = {}) {
  const ink = useInk();

  return (
    <SlideBody>
      <Eyebrow>La concurrence</Eyebrow>

      <div style={{ marginTop: 30, maxWidth: 1240 }}>
        <StatementTitle lines={COMPETITION_TITLE} delay={0.1} />
      </div>

      <div style={{ marginTop: 46 }}>
        <CoverageMatrix axes={COMPETITION_AXES} rows={COMPETITION} startDelay={0.3} />
      </div>

      {footer ?? (
        <Rise delay={1.05} y={10}>
          <div className="t-small" style={{ color: ink.faint, marginTop: 26, maxWidth: 1120 }}>
            {COMPETITION.find((c) => c.id === "courrier")?.limit}
          </div>
        </Rise>
      )}
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   07 — MOTEUR D'ACQUISITION
   ═══════════════════════════════════════════════════════════════════════ */

export function AcquisitionSlide({
  /* La ligne de rémunération de chaque réseau. Rendue par défaut, donc la V2
     ne bouge pas ; la V3 la retire — elle décrit un seuil de plateforme, pas
     un canal d'acquisition, et c'est le sujet de la slide. */
  showPay = true,
}: { showPay?: boolean } = {}) {
  const ink = useInk();
  const accent = useAccent();

  /* Trois réseaux, ce qu'ils portent et ce qu'ils rendent, puis la part que
     chaque canal prendrait dans notre trafic. La boucle de l'acquisition
     tenait la moitié droite de la slide sans rien dire de mesurable ; elle
     revient à l'oral. */
  return (
    <SlideBody>
      <Eyebrow>Moteur d&apos;acquisition</Eyebrow>

      <div style={{ marginTop: 26, maxWidth: 1100 }}>
        <StatementTitle lines={ACQUISITION.title} delay={0.1} />
      </div>

      <Rise delay={0.34} y={12}>
        <p className="t-micro" style={{ color: accent, letterSpacing: "0.14em", marginTop: 52 }}>
          {ACQUISITION.channelsLabel}
        </p>
      </Rise>

      <div
        style={{
          marginTop: 24,
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 52,
        }}
      >
        {ACQUISITION.channels.map((c, i) => (
          <Rise key={c.id} delay={0.42 + i * 0.12} y={16}>
            <div style={{ paddingTop: 16, borderTop: `2px solid ${i < 2 ? accent : ink.rule}` }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                <span className="t-h2" style={{ color: ink.primary, letterSpacing: "-0.035em" }}>
                  {c.label}
                </span>
                <span className="t-micro" style={{ color: i < 2 ? accent : ink.faint }}>
                  {c.rank}
                </span>
              </div>
              <p className="t-body" style={{ color: ink.secondary, marginTop: 14 }}>
                {c.audience}
              </p>
              <p className="t-small" style={{ color: ink.muted, marginTop: 10 }}>
                {c.format}
              </p>
              {showPay && (
                <p className="t-small" style={{ color: ink.faint, marginTop: 8 }}>
                  {c.pay}
                </p>
              )}
            </div>
          </Rise>
        ))}
      </div>

      <div style={{ marginTop: 38 }}>
        <Rule delay={0.8} />
      </div>

      <Rise delay={0.88} y={14}>
        <p className="t-micro" style={{ color: accent, letterSpacing: "0.14em", marginTop: 26 }}>
          {ACQUISITION.mixLabel}
        </p>
      </Rise>

      <div style={{ marginTop: 20, display: "grid", gap: 20 }}>
        {ACQUISITION.mix.map((m, i) => (
          <Rise key={m.id} delay={0.94 + i * 0.1} y={12}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "230px 96px minmax(0, 1fr)",
                alignItems: "center",
                gap: 22,
              }}
            >
              <span className="t-small" style={{ color: ink.primary, fontWeight: 800 }}>
                {m.label}
              </span>
              <span className="t-h3" style={{ color: accent, letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>
                {m.share} %
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <span
                  style={{
                    height: 6,
                    borderRadius: 6,
                    width: `${m.share * 1.1}%`,
                    maxWidth: 300,
                    background: accent,
                    opacity: 0.75,
                    flexShrink: 0,
                  }}
                />
                <span className="t-small" style={{ color: ink.muted }}>{m.body}</span>
              </span>
            </div>
          </Rise>
        ))}
      </div>

      <Rise delay={1.3} y={10}>
        <p className="t-small" style={{ color: ink.faint, marginTop: 22 }}>
          {ACQUISITION.note}
        </p>
      </Rise>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   08 — L'IA COMME CANAL
   Six states in one scene. The header changes a line, the composition below
   it transforms; nothing here is a new slide, which is what lets the chain's
   nodes travel instead of being replaced.
   ═══════════════════════════════════════════════════════════════════════ */

export function AiShiftSlide() {
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

export function RevenueSlide({
  /* Rendu sous les moteurs de revenus. Absent par défaut ; la V4 y pose le
     nombre de partenariats nécessaires. */
  footer,
}: { footer?: ReactNode } = {}) {
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

      {/* La trajectoire, source par source : trois intitulés ne se retiennent
          pas, une courbe de montants si. */}
      <Rise delay={0.95} y={16}>
        <div style={{ marginTop: 44 }}>
          <p className="t-micro" style={{ color: accent, letterSpacing: "0.14em", marginBottom: 14 }}>
            {REVENUE.projection.label}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.8fr) repeat(4, minmax(0, 1fr))", gap: "0 30px" }}>
            <span />
            {REVENUE.projection.streams.map((st) => (
              <p
                key={st}
                className="t-micro"
                style={{ color: ink.faint, textAlign: "right", paddingBottom: 10, borderBottom: `1px solid ${ink.rule}` }}
              >
                {st}
              </p>
            ))}
            <p
              className="t-micro"
              style={{ color: accent, textAlign: "right", paddingBottom: 10, borderBottom: `1px solid ${ink.rule}` }}
            >
              Total
            </p>

            {REVENUE.projection.rows.map((r) => (
              <Fragment key={r.year}>
                <p className="t-h3" style={{ color: ink.primary, padding: "14px 0", borderBottom: `1px solid ${ink.rule}`, letterSpacing: "-0.024em" }}>
                  {r.year}
                </p>
                {r.values.map((v, k) => (
                  <p
                    key={k}
                    className="t-body"
                    style={{ color: ink.secondary, textAlign: "right", padding: "14px 0", borderBottom: `1px solid ${ink.rule}` }}
                  >
                    {v}
                  </p>
                ))}
                <p
                  className="t-h3"
                  style={{ color: accent, textAlign: "right", padding: "14px 0", borderBottom: `1px solid ${ink.rule}`, letterSpacing: "-0.024em" }}
                >
                  {r.total}
                </p>
              </Fragment>
            ))}
          </div>

          <p className="t-small" style={{ color: ink.faint, marginTop: 12 }}>
            {REVENUE.projection.note}
          </p>
        </div>
      </Rise>

      {footer}
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   PIVOT
   ═══════════════════════════════════════════════════════════════════════ */

export function PivotSlide() {
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

export function CrossCheckSlide() {
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

export function PipelineSlide() {
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

export function ArticleSlide() {
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
          alignItems: "center",
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

        </div>
      </div>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   12 — OÙ EN EST LE PROJET
   ═══════════════════════════════════════════════════════════════════════ */

export function StatusSlide() {
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

        </div>
      </div>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   13 — CHIFFRES CLÉS DU BUSINESS PLAN
   ═══════════════════════════════════════════════════════════════════════ */

export function FinanceSlide() {
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
                {FINANCE_SLIDE.year2.label}
              </div>
              <div className="t-h1" style={{ color: ink.primary, letterSpacing: "-0.04em", marginTop: 8 }}>
                {FINANCE_SLIDE.year2.value}
              </div>
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

export function RoadmapSlide() {
  const ink = useInk();
  const accent = useAccent();

  return (
    <SlideBody>
      <Eyebrow>Trajectoire</Eyebrow>

      <div style={{ marginTop: 26, maxWidth: 1180 }}>
        <StatementTitle lines={ROADMAP.title} delay={0.1} />
      </div>

      <div
        style={{
          marginTop: 40,
          flex: 1,
          minHeight: 0,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.35fr)",
          gap: 64,
          alignItems: "start",
        }}
      >
        <Rise delay={0.34} y={16}>
          <div
            style={{
              padding: "26px 28px",
              borderRadius: 16,
              border: `1px solid ${accent}`,
              background: ink.tone === "dark" ? "rgba(57,255,136,0.05)" : "rgba(57,255,136,0.06)",
            }}
          >
            <p className="t-micro" style={{ color: accent, letterSpacing: "0.14em" }}>
              {ROADMAP.proof.label}
            </p>
            <p className="t-h2" style={{ color: ink.primary, letterSpacing: "-0.035em", marginTop: 12 }}>
              {ROADMAP.proof.theme}
            </p>
            <p className="t-small" style={{ color: ink.muted, marginTop: 14, lineHeight: 1.55 }}>
              {ROADMAP.proof.body}
            </p>
            <div style={{ display: "grid", gap: 10, marginTop: 22 }}>
              {ROADMAP.proof.metrics.map((m) => (
                <div
                  key={m.label}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1fr) auto",
                    gap: 18,
                    alignItems: "baseline",
                    paddingBottom: 9,
                    borderBottom: `1px solid ${ink.rule}`,
                  }}
                >
                  <span className="t-small" style={{ color: ink.muted }}>{m.label}</span>
                  <span className="t-h3" style={{ color: accent, letterSpacing: "-0.02em" }}>{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Rise>

        <div>
          <Rise delay={0.5} y={12}>
            <p className="t-micro" style={{ color: accent, letterSpacing: "0.14em", marginBottom: 16 }}>
              {ROADMAP.replicateLabel}
            </p>
          </Rise>

          <div style={{ display: "grid", gap: 13 }}>
            {ROADMAP.replicate.map((r, i) => (
              <Rise key={r.id} delay={0.58 + i * 0.1} y={12}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1fr) auto",
                    gap: 26,
                    alignItems: "baseline",
                    paddingBottom: 12,
                    borderBottom: `1px solid ${ink.rule}`,
                  }}
                >
                  <div>
                    <p className="t-h3" style={{ color: ink.primary, letterSpacing: "-0.025em" }}>
                      {r.label}
                    </p>
                    <p className="t-small" style={{ color: ink.muted, marginTop: 5 }}>{r.body}</p>
                  </div>
                  <span className="t-micro" style={{ color: accent, whiteSpace: "nowrap" }}>
                    {r.audience}
                  </span>
                </div>
              </Rise>
            ))}
          </div>

          <Rise delay={1.05} y={10}>
            <div style={{ display: "flex", gap: 40, marginTop: 20, flexWrap: "wrap" }}>
              {ROADMAP.milestones.map((m) => (
                <span key={m.label} className="t-small" style={{ color: ink.faint }}>
                  {m.label} <strong style={{ color: ink.muted, fontWeight: 800 }}>{m.year}</strong>
                </span>
              ))}
            </div>
          </Rise>

          <Rise delay={1.15} y={10}>
            <p className="t-small" style={{ color: ink.faint, marginTop: 14 }}>
              {ROADMAP.replicateNote}
            </p>
          </Rise>
        </div>
      </div>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   15 — CONCLUSION
   ═══════════════════════════════════════════════════════════════════════ */

export function ConclusionSlide({
  /* La signature de bas de slide. Rendue par défaut ; la V4 la retire. */
  showSignature = true,
}: { showSignature?: boolean } = {}) {
  const ink = useInk();
  const accent = useAccent();

  /* Le globe de l'accueil tourne derrière, à l'échelle de la slide : c'est
     l'objet que le jury vient de voir dans le produit, pas une décoration. */
  return (
    <SlideBody center>
      <div style={{ position: "absolute", right: 84, top: "50%", transform: "translateY(-50%)", zIndex: 1 }}>
        <Fade delay={0.2} duration={1.2}>
          <div style={{ width: 700, height: 700, opacity: 0.9 }}>
            <PresentationGlobe tone={ink.tone} />
          </div>
        </Fade>
      </div>

      <div style={{ position: "relative", zIndex: 2, maxWidth: 900 }}>
        <StatementTitle lines={CONCLUSION.lines} delay={0.1} />

        <div style={{ marginTop: 56, maxWidth: 520 }}>
          <Rule delay={0.9} accentWidth={110} />
        </div>

        <Rise delay={1} y={12}>
          <p className="t-micro" style={{ color: accent, letterSpacing: "0.14em", marginTop: 30 }}>
            {CONCLUSION.needsLabel}
          </p>
        </Rise>

        <div style={{ marginTop: 18, display: "grid", gap: 20 }}>
          {CONCLUSION.needs.map((n, i) => (
            <Rise key={n.id} delay={1.08 + i * 0.14} y={14}>
              <div>
                <p className="t-h3" style={{ color: ink.primary, letterSpacing: "-0.025em" }}>
                  {n.label}
                </p>
                <p className="t-body" style={{ color: ink.muted, marginTop: 6 }}>
                  {n.body}
                </p>
              </div>
            </Rise>
          ))}
        </div>

        {showSignature && (
          <Rise delay={1.5} y={10}>
            <p className="t-small" style={{ color: ink.faint, marginTop: 44, letterSpacing: "0.1em" }}>
              {CONCLUSION.signature.wordmark} · {CONCLUSION.signature.tagline}
            </p>
          </Rise>
        )}
      </div>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   REGISTRY — keys match S2_SLIDES[].id; the order lives in the data file.
   ═══════════════════════════════════════════════════════════════════════ */

export const S2_VIEWS: Record<string, ComponentType> = {
  cover: CoverSlide,
  contexte: ContextSlide,
  idee: IdeaSlide,
  reprise: LaterSlide,
  probleme: ProblemSlide,
  cible: AudienceSlide,
  produit: ProductSlide,
  marche: MarketSlide,
  acteurs: PlayersSlide,
  concurrence: CompetitionSlide,
  acquisition: AcquisitionSlide,
  publications: () => <PublicationsSlide index={sectionNo("publications")} />,
  partenariats: () => <PartnershipsSlide index={sectionNo("partenariats")} />,
  ia: AiShiftSlide,
  geo: () => <GeoSlide index={sectionNo("geo")} />,
  modele: RevenueSlide,
  pivot: PivotSlide,
  recoupement: CrossCheckSlide,
  equipe: TeamSlide,
  pipeline: WorkshopSlide,
  juridique: LegalSlide,
  exigence: EditorialSlide,
  article: ArticleSlide,
  etat: StatusSlide,
  finance: FinanceSlide,
  financement: FundingSlide,
  roadmap: RoadmapSlide,
  conclusion: ConclusionSlide,
};
