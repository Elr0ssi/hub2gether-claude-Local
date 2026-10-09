"use client";

import { motion } from "framer-motion";
import {
  BRAND,
  PART_TRANSITION,
  RESEARCH_QUESTION,
  EQUATION,
  LEVERAGE,
  ARCHITECTURE_LAYERS,
  ARCHITECTURE_HEADLINE,
  LEAN_LOOP,
  AGILE,
  AUTOMATION_PARADOX,
  TARGET_MODEL,
  LEARNINGS,
  PHASES,
  PHASES_HEADLINE,
  TO_PROVE,
  JURY,
  ROADMAP,
  ROADMAP_HEADLINE,
  CONCLUSION,
} from "@/data/presentation/presentationData";
import {
  Eyebrow,
  Rise,
  Rule,
  SlideBody,
  MediaPlaceholder,
  useInk,
  useDeckReducedMotion,
  DUR,
  EASE,
} from "../primitives";
import { FlowField } from "../visuals/FlowField";
import { GlobeBackdrop } from "../visuals/GlobeBackdrop";
import { StepRail, PhaseLadder, HorizonRoadmap } from "../visuals/diagrams";
import { ArchitectureStack } from "../visuals/ArchitectureStack";
import { LeanLoop } from "../visuals/LeanLoop";
import { BalanceTension } from "../visuals/BalanceTension";
import { BoundaryMorph } from "../visuals/BoundaryMorph";

/** Theory anchors surfaced on the problématique slide. */
const THEORY_ANCHORS = [
  "Lean Startup",
  "Agilité / product management",
  "Transformation digitale",
  "IA génératrice de capacités",
  "Stratégie",
  "Gestion du risque",
];

/* ═══════════════════════════════════════════════════════════════════════════
   13 — TRANSITION
   ═══════════════════════════════════════════════════════════════════════════ */

export function TransitionSlide() {
  const ink = useInk();

  return (
    <>
      <FlowField act={3} seed={53} intensity={0.3} particles={4} />

      <SlideBody center>
        <div style={{ textAlign: "center" }}>
          <Rise delay={0.4} y={20} duration={DUR.slow}>
            <p className="t-h1" style={{ color: ink.muted }}>
              {PART_TRANSITION.first}
            </p>
          </Rise>

          {/* Visual pause */}
          <Rise delay={2.2} y={0} duration={DUR.slow}>
            <div
              style={{
                width: 1,
                height: 96,
                margin: "56px auto",
                background:
                  "linear-gradient(to bottom, transparent, var(--accent), transparent)",
              }}
            />
          </Rise>

          <Rise delay={2.8} y={22} duration={DUR.slow}>
            <p
              className="t-h1"
              style={{
                color: ink.primary,
                maxWidth: 1380,
                margin: "0 auto",
              }}
            >
              {PART_TRANSITION.second}
            </p>
          </Rise>
        </div>
      </SlideBody>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   14 — PROBLÉMATIQUE
   ═══════════════════════════════════════════════════════════════════════════ */

export function QuestionSlide() {
  const ink = useInk();

  // Highlight the two halves of the tension inside the question.
  const [before, rest] = RESEARCH_QUESTION.split("large, rapide et plurielle");
  const [middle, after] = rest.split("fiabilité");

  return (
    <>
      <FlowField act={3} seed={59} intensity={0.24} />

      <SlideBody padding="120px 120px 96px">
        <Eyebrow index="Partie II">Approfondissement entrepreneurial</Eyebrow>

        <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
          <Rise delay={0.35} y={26} duration={DUR.slow}>
            <h2
              className="t-h1"
              style={{ color: ink.primary, maxWidth: 1560 }}
            >
              {before}
              <span className="accent">large, rapide et plurielle</span>
              {middle}
              <span
                style={{
                  color: ink.primary,
                  borderBottom: "3px solid var(--accent)",
                  paddingBottom: 4,
                }}
              >
                fiabilité
              </span>
              {after}
            </h2>
          </Rise>
        </div>

        <div>
          <Rule delay={1.4} width="100%" accentWidth={200} />
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px 34px",
              marginTop: 30,
            }}
          >
            {THEORY_ANCHORS.map((a, i) => (
              <Rise key={a} delay={1.6 + i * 0.09} y={10}>
                <span className="t-micro" style={{ color: ink.faint }}>
                  {a}
                </span>
              </Rise>
            ))}
          </div>
        </div>
      </SlideBody>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   15 — L'ÉQUATION
   ═══════════════════════════════════════════════════════════════════════════ */

export function EquationSlide() {
  const ink = useInk();
  const reduced = useDeckReducedMotion();

  return (
    <>
      <SlideBody padding="96px 120px" center>
        <div style={{ textAlign: "center" }}>
          <Rise delay={0.15} y={10}>
            <div className="t-eyebrow accent">§ 12 · L&apos;équation</div>
          </Rise>
        </div>

        {/* Numerator — what we want */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "34px 60px",
            width: 1400,
            alignSelf: "center",
            marginTop: 70,
          }}
        >
          {EQUATION.wants.map((w, i) => (
            <Rise key={w} delay={0.4 + i * 0.13} y={20}>
              <div
                className="t-h2"
                style={{
                  color: ink.primary,
                  textTransform: "uppercase",
                  textAlign: "center",
                }}
              >
                {w}
              </div>
            </Rise>
          ))}
        </div>

        {/* Fraction bar with compressive marks */}
        <div
          style={{
            position: "relative",
            width: 1400,
            alignSelf: "center",
            marginTop: 58,
            height: 3,
          }}
        >
          <motion.div
            className="accent-rule"
            initial={reduced ? undefined : { scaleX: 0 }}
            animate={reduced ? undefined : { scaleX: 1 }}
            transition={{ duration: 1.2, delay: 1.3, ease: EASE }}
            style={{
              width: "100%",
              height: 3,
              transformOrigin: "center",
            }}
          />
          {/* Pressure arrows pointing at the constraint */}
          {[0.18, 0.5, 0.82].map((p, i) => (
            <motion.svg
              key={p}
              width="22"
              height="34"
              viewBox="0 0 22 34"
              aria-hidden="true"
              initial={reduced ? undefined : { opacity: 0, y: -8 }}
              animate={reduced ? undefined : { opacity: 0.75, y: 0 }}
              transition={{ duration: 0.6, delay: 1.9 + i * 0.12, ease: EASE }}
              style={{
                position: "absolute",
                left: `calc(${p * 100}% - 11px)`,
                top: 18,
              }}
            >
              <path
                d="M 11 0 L 11 24 M 4 17 L 11 24 L 18 17"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          ))}
        </div>

        {/* Denominator — the constraint */}
        <Rise delay={2.1} y={22} duration={DUR.slow}>
          <div
            className="t-display"
            style={{
              color: ink.primary,
              textAlign: "center",
              marginTop: 78,
              fontSize: 88,
            }}
          >
            {EQUATION.constraint}
          </div>
        </Rise>

        <Rise delay={2.9} y={16} duration={DUR.slow}>
          <p
            className="t-lead"
            style={{
              color: ink.muted,
              maxWidth: 1080,
              margin: "58px auto 0",
              textAlign: "center",
            }}
          >
            {EQUATION.closing}
          </p>
        </Rise>
      </SlideBody>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   16 — LA TECHNOLOGIE COMME LEVIER
   ═══════════════════════════════════════════════════════════════════════════ */

function EffectFan({
  effects,
  startDelay,
}: {
  effects: readonly string[];
  startDelay: number;
}) {
  const ink = useInk();
  const reduced = useDeckReducedMotion();

  const W = 1560;
  const H = 400;
  const originX = 300;
  const originY = H / 2;
  const targetX = 700;
  const rowTop = 26;
  const rowGap = (H - rowTop * 2) / (effects.length - 1);

  return (
    <div style={{ position: "relative", width: W, height: H }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        aria-hidden="true"
        style={{ position: "absolute", inset: 0 }}
      >
        {effects.map((e, i) => {
          const y = rowTop + i * rowGap;
          return (
            <motion.path
              key={e}
              d={`M ${originX} ${originY} C ${originX + 170} ${originY}, ${
                targetX - 190
              } ${y}, ${targetX} ${y}`}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={1.5}
              initial={reduced ? { opacity: 0.45 } : { pathLength: 0, opacity: 0 }}
              animate={
                reduced ? { opacity: 0.45 } : { pathLength: 1, opacity: 0.48 }
              }
              transition={{
                duration: 1,
                delay: startDelay + 0.4 + i * 0.13,
                ease: EASE,
              }}
            />
          );
        })}

        <motion.circle
          cx={originX}
          cy={originY}
          r={11}
          fill="var(--accent)"
          initial={reduced ? undefined : { opacity: 0, scale: 0.3 }}
          animate={reduced ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: startDelay, ease: EASE }}
          style={{
            transformOrigin: `${originX}px ${originY}px`,
            filter: "drop-shadow(0 0 14px rgba(57,255,136,0.75))",
          }}
        />

        {!reduced &&
          effects.map((e, i) => {
            const y = rowTop + i * rowGap;
            return (
              <motion.circle
                key={`p-${e}`}
                r={3.2}
                fill="var(--accent)"
                initial={{ cx: originX, cy: originY, opacity: 0 }}
                animate={{
                  cx: [originX, originX + 180, targetX - 170, targetX],
                  cy: [originY, originY, y, y],
                  opacity: [0, 0.9, 0.9, 0],
                }}
                transition={{
                  duration: 2.4,
                  delay: startDelay + 1.8 + i * 0.3,
                  repeat: Infinity,
                  repeatDelay: 1.5,
                  ease: "linear",
                }}
              />
            );
          })}
      </svg>

      {/* Origin label */}
      <Rise delay={startDelay} y={12}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: originY - 24,
            width: originX - 34,
            textAlign: "right",
          }}
        >
          <div
            className="t-h3"
            style={{
              color: ink.primary,
              textTransform: "uppercase",
              letterSpacing: "0.02em",
              fontSize: 30,
              whiteSpace: "nowrap",
            }}
          >
            Technologie
          </div>
        </div>
      </Rise>

      {/* Effects */}
      {effects.map((e, i) => {
        const y = rowTop + i * rowGap;
        return (
          <Rise key={`l-${e}`} delay={startDelay + 0.55 + i * 0.13} y={10}>
            <div
              style={{
                position: "absolute",
                left: targetX + 22,
                top: y,
                transform: "translateY(-50%)",
                display: "flex",
                alignItems: "center",
                gap: 14,
                whiteSpace: "nowrap",
              }}
            >
              <span className="accent t-index">→</span>
              <span className="t-lead" style={{ color: ink.secondary }}>
                {e}
              </span>
            </div>
          </Rise>
        );
      })}
    </div>
  );
}

export function LevierSlide() {
  const ink = useInk();

  return (
    <>
      <FlowField act={3} seed={61} intensity={0.22} />

      <SlideBody padding="88px 120px">
        <Eyebrow index="§ 13">Transformation digitale</Eyebrow>
        <Rise delay={0.28} y={20} duration={DUR.slow}>
          <h2 className="t-h1" style={{ color: ink.primary, marginTop: 28 }}>
            {LEVERAGE.headline}
          </h2>
        </Rise>

        <div style={{ flex: 1, display: "grid", placeItems: "center" }}>
          <EffectFan effects={LEVERAGE.effects} startDelay={0.6} />
        </div>

        {/* The counterweight — inverted band */}
        <Rise delay={2.6} y={20} duration={DUR.slow}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 56,
              padding: "42px 60px",
              borderRadius: 16,
              background: ink.tone === "dark" ? "#151515" : "#0A0A0A",
            }}
          >
            <span
              className="t-h2"
              style={{
                color: "#fff",
                textTransform: "uppercase",
                letterSpacing: "0.02em",
              }}
            >
              {LEVERAGE.contrast.left}
            </span>
            <span
              className="t-display"
              style={{ color: "var(--accent)", fontSize: 72, lineHeight: 1 }}
            >
              ≠
            </span>
            <span
              className="t-h2"
              style={{
                color: "rgba(255,255,255,0.62)",
                textTransform: "uppercase",
                letterSpacing: "0.02em",
              }}
            >
              {LEVERAGE.contrast.right}
            </span>
          </div>
        </Rise>
      </SlideBody>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   17 — ARCHITECTURE CIBLE
   ═══════════════════════════════════════════════════════════════════════════ */

export function ArchitectureSlide() {
  const ink = useInk();

  return (
    <>
      <SlideBody padding="72px 120px 56px">
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 60,
            marginBottom: 34,
          }}
        >
          <div>
            <Eyebrow index="§ 14">Architecture</Eyebrow>
            <Rise delay={0.28} y={18} duration={DUR.slow}>
              <h2
                className="t-h1"
                style={{ color: ink.primary, marginTop: 24, fontSize: 64 }}
              >
                {ARCHITECTURE_HEADLINE}
              </h2>
            </Rise>
          </div>
          <Rise delay={0.5} y={12}>
            <p
              className="t-body"
              style={{ color: ink.muted, maxWidth: 420, textAlign: "right" }}
            >
              Six couches. La validation est une couche du système, pas une
              étape optionnelle.
            </p>
          </Rise>
        </div>

        <ArchitectureStack
          layers={ARCHITECTURE_LAYERS}
          emphasise={["AI layer", "Validation"]}
          startDelay={0.5}
        />
      </SlideBody>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   18 — BUILD → MEASURE → LEARN
   ═══════════════════════════════════════════════════════════════════════════ */

export function LeanSlide() {
  const ink = useInk();

  return (
    <>
      <SlideBody padding="88px 120px">
        <Eyebrow index="§ 15">{LEAN_LOOP.theory}</Eyebrow>

        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "560px 1fr",
            gap: 100,
            alignItems: "center",
            marginTop: 20,
          }}
        >
          {/* The theory */}
          <div style={{ display: "grid", placeItems: "center" }}>
            <LeanLoop nodes={LEAN_LOOP.loop} startDelay={0.5} />
          </div>

          {/* The application */}
          <div>
            <Rise delay={0.4} y={16}>
              <div
                className="t-micro"
                style={{ color: ink.faint, marginBottom: 30 }}
              >
                Appliqué à The Essential Data
              </div>
            </Rise>

            <div style={{ display: "grid", gap: 0 }}>
              {LEAN_LOOP.applied.map((a, i) => {
                const isRebuild = a.key === "Rebuild";
                return (
                  <Rise key={a.key} delay={0.7 + i * 0.22} y={16}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "210px 1fr",
                        gap: 30,
                        alignItems: "baseline",
                        padding: "26px 0",
                        borderTop: `1px solid ${ink.rule}`,
                      }}
                    >
                      <div
                        className="t-h3"
                        style={{
                          color: isRebuild ? "var(--accent)" : ink.primary,
                          textTransform: "uppercase",
                          letterSpacing: "0.02em",
                        }}
                      >
                        {a.key}
                      </div>
                      <div
                        className="t-lead"
                        style={{ color: ink.secondary }}
                      >
                        {a.label}
                      </div>
                    </div>
                  </Rise>
                );
              })}
            </div>
          </div>
        </div>

        {/* The point */}
        <Rise delay={1.9} y={20} duration={DUR.slow}>
          <div style={{ marginTop: 30 }}>
            <Rule delay={1.8} width="100%" accentWidth={240} />
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 40,
                marginTop: 30,
              }}
            >
              <p className="t-h3" style={{ color: ink.muted, fontSize: 32 }}>
                {LEAN_LOOP.message[0]}
              </p>
              <p
                className="t-h2 t-editorial"
                style={{ color: ink.primary }}
              >
                {LEAN_LOOP.message[1]}
              </p>
            </div>
          </div>
        </Rise>
      </SlideBody>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   19 — AGILITÉ / PRODUCT MANAGEMENT
   ═══════════════════════════════════════════════════════════════════════════ */

export function AgiliteSlide() {
  const ink = useInk();

  return (
    <>
      <SlideBody padding="80px 120px">
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 60,
          }}
        >
          <div>
            <Eyebrow index="§ 16">{AGILE.theory}</Eyebrow>
            <Rise delay={0.28} y={18} duration={DUR.slow}>
              <h2
                className="t-h1"
                style={{ color: ink.primary, marginTop: 24, fontSize: 64 }}
              >
                {AGILE.headline}
              </h2>
            </Rise>
          </div>
        </div>

        <div style={{ display: "grid", placeItems: "center", marginTop: 10 }}>
          <StepRail
            steps={AGILE.steps.map((s) => ({
              label: s,
              state: s === "V2" ? "next" : s === "Refonte" ? "current" : "done",
            }))}
            startDelay={0.5}
            width={1600}
          />
        </div>

        {/* Theory → application, with room for before/after captures */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 68,
            marginTop: 8,
          }}
        >
          {AGILE.application.map((a, i) => (
            <div key={a.concept}>
              <Rise delay={1.5 + i * 0.18} y={16} style={{ height: 148 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 16,
                    marginBottom: 14,
                  }}
                >
                  <span className="t-index accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="t-h3"
                    style={{ color: ink.primary, fontSize: 30 }}
                  >
                    {a.concept}
                  </span>
                </div>
                <p
                  className="t-body"
                  style={{ color: ink.secondary, marginBottom: 22 }}
                >
                  {a.applied}
                </p>
              </Rise>
              <MediaPlaceholder
                label={a.mediaLabel}
                height={186}
                delay={1.7 + i * 0.18}
              />
            </div>
          ))}
        </div>
      </SlideBody>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   20 — PARADOXE DE L'AUTOMATISATION
   ═══════════════════════════════════════════════════════════════════════════ */

export function ParadoxeSlide() {
  const ink = useInk();

  return (
    <>
      <FlowField act={4} seed={67} intensity={0.14} />

      <SlideBody padding="72px 120px 60px">
        <div style={{ textAlign: "center" }}>
          <Rise delay={0.15} y={10}>
            <div className="t-eyebrow accent">§ 17 · Gestion du risque</div>
          </Rise>
          <Rise delay={0.3} y={18} duration={DUR.slow}>
            <h2
              className="t-h1"
              style={{ color: ink.primary, marginTop: 22, fontSize: 62 }}
            >
              {AUTOMATION_PARADOX.headline}
            </h2>
          </Rise>
        </div>

        <div
          style={{
            flex: 1,
            display: "grid",
            placeItems: "center",
            marginTop: 6,
          }}
        >
          <BalanceTension
            gains={AUTOMATION_PARADOX.gains}
            risks={AUTOMATION_PARADOX.risks}
            fulcrum={AUTOMATION_PARADOX.fulcrum}
            startDelay={0.5}
          />
        </div>

        <Rise delay={3.2} y={18} duration={DUR.slow}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "center",
              gap: 36,
              textAlign: "center",
            }}
          >
            <p className="t-lead" style={{ color: ink.muted }}>
              {AUTOMATION_PARADOX.message[0]}
            </p>
            <p
              className="t-h3 t-editorial"
              style={{ color: "var(--accent)", fontSize: 32, maxWidth: 760 }}
            >
              {AUTOMATION_PARADOX.message[1]}
            </p>
          </div>
        </Rise>
      </SlideBody>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   21 — LE MODÈLE CIBLE
   ═══════════════════════════════════════════════════════════════════════════ */

export function ModeleCibleSlide() {
  const ink = useInk();

  return (
    <>
      <SlideBody padding="96px 120px">
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 60,
          }}
        >
          <div>
            <Eyebrow index="§ 18">Le modèle cible</Eyebrow>
            <Rise delay={0.28} y={18} duration={DUR.slow}>
              <h2
                className="t-h1"
                style={{ color: ink.primary, marginTop: 26, fontSize: 66 }}
              >
                {TARGET_MODEL.headline}
              </h2>
            </Rise>
          </div>
          <Rise delay={0.5} y={12}>
            <p
              className="t-body"
              style={{ color: ink.muted, maxWidth: 380, textAlign: "right" }}
            >
              La frontière n&apos;est pas un pourcentage : elle se décide
              processus par processus.
            </p>
          </Rise>
        </div>

        <div
          style={{
            flex: 1,
            display: "grid",
            placeItems: "center",
            marginTop: 40,
          }}
        >
          <BoundaryMorph
            left={TARGET_MODEL.automated}
            right={TARGET_MODEL.human}
            startDelay={0.6}
          />
        </div>
      </SlideBody>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   22 — CE QUE J'AI APPRIS
   ═══════════════════════════════════════════════════════════════════════════ */

export function ApprentissagesSlide() {
  const ink = useInk();

  return (
    <>
      <SlideBody padding="96px 120px">
        <Eyebrow index="§ 24">Enseignements</Eyebrow>

        <Rise delay={0.28} y={18} duration={DUR.slow}>
          <h2
            className="t-h1"
            style={{ color: ink.primary, marginTop: 24, fontSize: 56 }}
          >
            {LEARNINGS.headline}
          </h2>
        </Rise>

        <div style={{ flex: 1, marginTop: 40 }}>
          {LEARNINGS.items.map((item, i) => (
            <Rise key={item.index} delay={0.6 + i * 0.85} y={22} duration={DUR.slow}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "180px 1fr",
                  gap: 44,
                  alignItems: "start",
                  padding: "32px 0",
                  borderTop: `1px solid ${ink.rule}`,
                }}
              >
                <div
                  className="t-display"
                  style={{
                    color: "transparent",
                    WebkitTextStroke: `1.5px ${
                      ink.tone === "dark" ? "rgba(255,255,255,0.24)" : "#D5D5D5"
                    }`,
                    fontSize: 92,
                    lineHeight: 0.9,
                  }}
                >
                  {item.index}
                </div>
                <div>
                  <p
                    className="t-h2"
                    style={{
                      color: ink.primary,
                      maxWidth: 1340,
                      marginBottom: 16,
                    }}
                  >
                    {item.statement}
                  </p>
                  <p
                    className="t-lead"
                    style={{ color: ink.muted, maxWidth: 1080 }}
                  >
                    {item.sub}
                  </p>
                </div>
              </div>
            </Rise>
          ))}
        </div>
      </SlideBody>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   23 — OÙ NOUS EN SOMMES
   ═══════════════════════════════════════════════════════════════════════════ */

export function PhasesSlide() {
  const ink = useInk();

  return (
    <>
      <FlowField act={4} seed={71} intensity={0.2} />

      <SlideBody padding="104px 120px" center>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 60,
            marginBottom: 76,
          }}
        >
          <div>
            <Eyebrow index="§ 25">État d&apos;avancement</Eyebrow>
            <Rise delay={0.28} y={18} duration={DUR.slow}>
              <h2
                className="t-h1"
                style={{ color: ink.primary, marginTop: 26, fontSize: 66 }}
              >
                {PHASES_HEADLINE}
              </h2>
            </Rise>
          </div>
          <Rise delay={0.5} y={12}>
            <p
              className="t-micro"
              style={{ color: ink.faint, textAlign: "right" }}
            >
              Aucune date engagée à ce stade
            </p>
          </Rise>
        </div>

        <PhaseLadder phases={PHASES} startDelay={0.6} />
      </SlideBody>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   24 — CE QU'IL RESTE À PROUVER
   ═══════════════════════════════════════════════════════════════════════════ */

export function AProuverSlide() {
  const ink = useInk();

  return (
    <>
      <SlideBody padding="96px 120px">
        <Eyebrow index="§ 26">Risques assumés</Eyebrow>

        <Rise delay={0.28} y={18} duration={DUR.slow}>
          <h2
            className="t-h1"
            style={{ color: ink.primary, marginTop: 26, fontSize: 64 }}
          >
            {TO_PROVE.headline}
          </h2>
        </Rise>

        {/* Three columns divided by hairlines — no cards */}
        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            marginTop: 72,
          }}
        >
          {TO_PROVE.columns.map((c, i) => (
            <Rise key={c.index} delay={0.6 + i * 0.22} y={22}>
              <div
                style={{
                  height: "100%",
                  padding: i === 0 ? "0 56px 0 0" : "0 56px",
                  borderLeft: i === 0 ? "none" : `1px solid ${ink.rule}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 16,
                    marginBottom: 26,
                  }}
                >
                  <span className="t-index accent">{c.index}</span>
                  <h3
                    className="t-h2"
                    style={{
                      color: ink.primary,
                      textTransform: "uppercase",
                      fontSize: 46,
                    }}
                  >
                    {c.title}
                  </h3>
                </div>
                <p className="t-lead" style={{ color: ink.secondary }}>
                  {c.body}
                </p>
              </div>
            </Rise>
          ))}
        </div>

        {/* Statement, then its reveal */}
        <div style={{ marginTop: 44 }}>
          <Rule delay={1.5} width="100%" accentWidth={220} />
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 44,
              marginTop: 32,
            }}
          >
            <Rise delay={1.7} y={16} duration={DUR.slow}>
              <p
                className="t-h3"
                style={{ color: ink.muted, fontSize: 30, maxWidth: 700 }}
              >
                {TO_PROVE.first}
              </p>
            </Rise>
            <Rise delay={3} y={16} duration={DUR.slow}>
              <p
                className="t-h2 t-editorial"
                style={{ color: ink.primary, maxWidth: 900 }}
              >
                {TO_PROVE.reveal}
              </p>
            </Rise>
          </div>
        </div>
      </SlideBody>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   25 — POURQUOI CE JURY
   ═══════════════════════════════════════════════════════════════════════════ */

export function JurySlide() {
  const ink = useInk();

  return (
    <>
      <FlowField act={4} seed={79} intensity={0.18} />

      <SlideBody padding="104px 120px">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "620px 1fr",
            gap: 110,
            height: "100%",
            alignItems: "center",
          }}
        >
          {/* Left — the ask */}
          <div>
            <Eyebrow index="§ 27">Regards extérieurs</Eyebrow>

            <Rise delay={0.28} y={20} duration={DUR.slow}>
              <h2
                className="t-h1"
                style={{ color: ink.primary, marginTop: 28, fontSize: 58 }}
              >
                {JURY.headline}
              </h2>
            </Rise>

            <Rise delay={0.55} y={16}>
              <p
                className="t-lead"
                style={{ color: ink.secondary, marginTop: 30 }}
              >
                {JURY.intro}
              </p>
            </Rise>

            <div style={{ marginTop: 46 }}>
              <Rule delay={2.4} width={120} accentWidth={120} />
              <Rise delay={2.6} y={16} duration={DUR.slow}>
                <p
                  className="t-h3 t-editorial"
                  style={{ color: ink.primary, marginTop: 26, fontSize: 32 }}
                >
                  {JURY.closing}
                </p>
              </Rise>
            </div>
          </div>

          {/* Right — the three axes */}
          <div style={{ display: "grid", gap: 0 }}>
            {JURY.axes.map((axis, i) => (
              <Rise key={axis.index} delay={0.8 + i * 0.24} y={20}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "72px 1fr",
                    gap: 30,
                    alignItems: "start",
                    padding: "38px 0",
                    borderTop: `1px solid ${ink.rule}`,
                  }}
                >
                  <span
                    className="t-index accent"
                    style={{ fontSize: 17, paddingTop: 12 }}
                  >
                    {axis.index}
                  </span>
                  <div>
                    <h3
                      className="t-h2"
                      style={{
                        color: ink.primary,
                        textTransform: "uppercase",
                        fontSize: 42,
                        marginBottom: 14,
                      }}
                    >
                      {axis.title}
                    </h3>
                    <p className="t-lead" style={{ color: ink.secondary }}>
                      {axis.body}
                    </p>
                  </div>
                </div>
              </Rise>
            ))}
          </div>
        </div>
      </SlideBody>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   26 — ROADMAP
   ═══════════════════════════════════════════════════════════════════════════ */

export function RoadmapSlide() {
  const ink = useInk();

  return (
    <>
      <SlideBody padding="104px 120px" center>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 60,
            marginBottom: 92,
          }}
        >
          <div>
            <Eyebrow index="§ 28">Roadmap</Eyebrow>
            <Rise delay={0.28} y={18} duration={DUR.slow}>
              <h2
                className="t-h1"
                style={{ color: ink.primary, marginTop: 26, fontSize: 66 }}
              >
                {ROADMAP_HEADLINE}
              </h2>
            </Rise>
          </div>
          <Rise delay={0.5} y={12}>
            <p
              className="t-micro"
              style={{ color: ink.faint, textAlign: "right" }}
            >
              Horizons, pas de dates
            </p>
          </Rise>
        </div>

        <HorizonRoadmap horizons={ROADMAP} startDelay={0.5} />
      </SlideBody>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   27 — CONCLUSION
   ═══════════════════════════════════════════════════════════════════════════ */

export function ConclusionSlide() {
  const ink = useInk();

  return (
    <>
      <GlobeBackdrop
        size={1180}
        left={370}
        top={-60}
        delay={0.3}
        opacity={0.9}
        traceDuration={5}
        dotOpacity={0.34}
      />

      <SlideBody center>
        <div style={{ textAlign: "center", position: "relative", zIndex: 3 }}>
          <Rise delay={0.5} y={18} duration={DUR.slow}>
            <p className="t-h2" style={{ color: ink.secondary }}>
              {CONCLUSION.first}
            </p>
          </Rise>

          <Rise delay={2.4} y={22} duration={DUR.slow}>
            <p
              className="t-h1"
              style={{
                color: ink.primary,
                maxWidth: 1300,
                margin: "44px auto 0",
              }}
            >
              {CONCLUSION.second}
            </p>
          </Rise>

          <Rise delay={4.4} y={0} duration={DUR.slow}>
            <div
              style={{
                width: 200,
                height: 1,
                margin: "76px auto 0",
                background: "var(--accent)",
                boxShadow: "0 0 18px rgba(57,255,136,0.5)",
              }}
            />
          </Rise>

          <Rise delay={4.7} y={16} duration={DUR.slow}>
            <div style={{ marginTop: 46 }}>
              <div
                className="t-h2"
                style={{
                  color: ink.primary,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  fontSize: 44,
                }}
              >
                {BRAND.name}
              </div>
              <p
                className="t-h3 t-editorial"
                style={{
                  color: "var(--accent)",
                  marginTop: 22,
                  fontSize: 32,
                }}
              >
                {BRAND.tagline}
              </p>
            </div>
          </Rise>
        </div>
      </SlideBody>
    </>
  );
}
