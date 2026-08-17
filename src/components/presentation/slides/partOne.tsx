"use client";

import {
  BRAND,
  CONSTAT,
  PROBLEME,
  VALUE_PROP,
  PRODUCT_LEVELS,
  PRODUCT_HEADLINE,
  DEMO_ROUTE,
  DEMO_DURATION,
  TIMELINE_STEPS,
  TRACTION_KPIS,
  SLOWDOWN,
  VISION,
  EDITORIAL_AMBITION,
  ENGINE_STAGES,
  ENGINE_HEADLINE,
  AI_HUMAN,
} from "@/data/presentation/presentationData";
import {
  Eyebrow,
  Rise,
  Fade,
  Rule,
  SlideBody,
  MediaPlaceholder,
  DataPlaceholder,
  useInk,
  DUR,
  q,
} from "../primitives";
import { FlowField } from "../visuals/FlowField";
import { GlobeBackdrop } from "../visuals/GlobeBackdrop";
import { ConvergenceField } from "../visuals/ConvergenceField";
import { ValueChain, SourceNetwork, StepRail } from "../visuals/diagrams";
import { Pipeline } from "../visuals/Pipeline";

/* ═══════════════════════════════════════════════════════════════════════════
   01 — COVER
   ═══════════════════════════════════════════════════════════════════════════ */

export function CoverSlide() {
  const ink = useInk();

  return (
    <>
      <FlowField act={1} seed={3} intensity={0.55} />
      {/* Huge, decentred, cropped by the stage edge */}
      <GlobeBackdrop
        size={1460}
        left={890}
        top={-250}
        delay={0.3}
        traceDuration={7}
        dotOpacity={0.62}
      />

      <SlideBody center>
        <Rise delay={0.15} y={12}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--accent)",
                boxShadow: "0 0 12px rgba(57,255,136,0.9)",
              }}
            />
            <span className="t-eyebrow" style={{ color: ink.muted }}>
              Présentation
            </span>
          </div>
        </Rise>

        <Rise delay={0.4} y={26} duration={DUR.slow}>
          <h1
            className="t-display-xl"
            style={{ color: ink.primary, marginTop: 40, maxWidth: 1080 }}
          >
            The
            <br />
            Essential
            <br />
            Data
          </h1>
        </Rise>

        <div style={{ marginTop: 52, maxWidth: 700 }}>
          <Rule delay={1.1} width={200} accentWidth={200} />
          <Rise delay={1.35} y={16}>
            <p
              className="t-h2 t-editorial"
              style={{ color: "var(--accent)", marginTop: 30 }}
            >
              {BRAND.tagline}
            </p>
          </Rise>
          <Rise delay={1.65} y={14}>
            <p className="t-lead" style={{ color: ink.muted, marginTop: 22 }}>
              {BRAND.taglineFr}
            </p>
          </Rise>
        </div>
      </SlideBody>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   02 — LE CONSTAT
   ═══════════════════════════════════════════════════════════════════════════ */

export function ConstatSlide() {
  const ink = useInk();

  return (
    <>
      <FlowField act={1} seed={11} intensity={0.4} />

      <SlideBody>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "760px 1fr",
            gap: 80,
            height: "100%",
            alignItems: "center",
          }}
        >
          {/* Left — the statement */}
          <div>
            <Eyebrow index="§ 01">Le constat</Eyebrow>

            <Rise delay={0.3} y={22} duration={DUR.slow}>
              <h2
                className="t-h1"
                style={{ color: ink.primary, marginTop: 40 }}
              >
                {CONSTAT.headline}
              </h2>
            </Rise>

            <div style={{ marginTop: 54 }}>
              <Rule delay={2.4} width={120} accentWidth={120} />
              <Rise delay={2.7} y={18} duration={DUR.slow}>
                <p
                  className="t-h3 t-editorial"
                  style={{
                    color: ink.secondary,
                    marginTop: 28,
                    maxWidth: 620,
                    fontSize: 40,
                    lineHeight: 1.25,
                  }}
                >
                  {CONSTAT.reveal}
                </p>
              </Rise>
            </div>
          </div>

          {/* Right — sources scattered, then converging */}
          <div style={{ display: "grid", placeItems: "center" }}>
            <ConvergenceField labels={CONSTAT.nodes} startDelay={0.7} />
          </div>
        </div>
      </SlideBody>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   03 — LE PROBLÈME
   ═══════════════════════════════════════════════════════════════════════════ */

export function ProblemeSlide() {
  const ink = useInk();

  return (
    <>
      <FlowField act={1} seed={19} intensity={0.35} />

      <SlideBody>
        <Eyebrow index="§ 02">Le problème</Eyebrow>

        {/* Three columns on staggered baselines — deliberately not a card grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 72,
            marginTop: 96,
            flex: 1,
          }}
        >
          {PROBLEME.blocks.map((b, i) => (
            <Rise
              key={b.index}
              delay={0.5 + i * 0.75}
              y={30}
              duration={DUR.slow}
              style={{ paddingTop: i * 54 }}
            >
              <div>
                <div
                  className="t-display"
                  style={{
                    color: "transparent",
                    WebkitTextStroke: `1.5px ${
                      ink.tone === "dark" ? "rgba(255,255,255,0.22)" : "#DADADA"
                    }`,
                    fontSize: 118,
                    lineHeight: 1,
                    marginBottom: 30,
                  }}
                >
                  {b.index}
                </div>
                <div
                  style={{
                    width: 46,
                    height: 2,
                    marginBottom: 26,
                    background: "var(--accent)",
                    boxShadow: "0 0 12px rgba(57,255,136,0.5)",
                  }}
                />
                <h3
                  className="t-h2"
                  style={{
                    color: ink.primary,
                    textTransform: "uppercase",
                    marginBottom: 18,
                  }}
                >
                  {b.title}
                </h3>
                <p className="t-lead" style={{ color: ink.muted }}>
                  {b.body}
                </p>
              </div>
            </Rise>
          ))}
        </div>

        {/* Closing statement */}
        <Rise delay={2.9} y={18} duration={DUR.slow}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 40,
            }}
          >
            <p
              className="t-h3 t-editorial"
              style={{
                color: ink.secondary,
                fontSize: 38,
                maxWidth: 940,
                textAlign: "right",
              }}
            >
              {PROBLEME.closing}
            </p>
          </div>
        </Rise>
      </SlideBody>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   04 — PROPOSITION DE VALEUR
   ═══════════════════════════════════════════════════════════════════════════ */

export function ValeurSlide() {
  const ink = useInk();

  return (
    <>
      <FlowField act={2} seed={23} intensity={0.4} particles={3} />

      <SlideBody center>
        {/* Centred composition — a break from the left-aligned slides */}
        <div style={{ textAlign: "center" }}>
          <Rise delay={0.15} y={10}>
            <div className="t-eyebrow accent">§ 03 — Proposition de valeur</div>
          </Rise>

          <Rise delay={0.35} y={24} duration={DUR.slow}>
            <h2
              className="t-h1"
              style={{
                color: ink.primary,
                marginTop: 34,
                maxWidth: 1300,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              {VALUE_PROP.headline}
            </h2>
          </Rise>
        </div>

        <div style={{ display: "grid", placeItems: "center", marginTop: 76 }}>
          <ValueChain steps={VALUE_PROP.chain} startDelay={0.9} />
        </div>

        <Rise delay={4.2} y={16} duration={DUR.slow}>
          <p
            className="t-lead"
            style={{
              color: ink.secondary,
              maxWidth: 940,
              margin: "70px auto 0",
              textAlign: "center",
            }}
          >
            {VALUE_PROP.body}
          </p>
        </Rise>
      </SlideBody>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   05 — LE PRODUIT
   ═══════════════════════════════════════════════════════════════════════════ */

export function ProduitSlide() {
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
            <Eyebrow index="§ 04">Le produit</Eyebrow>
            <Rise delay={0.28} y={20} duration={DUR.slow}>
              <h2 className="t-h1" style={{ color: ink.primary, marginTop: 32 }}>
                {PRODUCT_HEADLINE}
              </h2>
            </Rise>
          </div>
          <Rise delay={0.5} y={12}>
            <div
              className="t-micro"
              style={{ color: ink.faint, textAlign: "right", lineHeight: 1.7 }}
            >
              Trois niveaux
              <br />
              de lecture
            </div>
          </Rise>
        </div>

        {/* Staggered baselines keep the three levels from reading as a grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 44,
            marginTop: 62,
            flex: 1,
          }}
        >
          {PRODUCT_LEVELS.map((level, i) => (
            <div key={level.key} style={{ paddingTop: i * 44 }}>
              <MediaPlaceholder
                label={level.mediaLabel}
                height={300}
                ratio="16 : 9"
                delay={0.7 + i * 0.16}
              />

              <Rise delay={0.85 + i * 0.16} y={16}>
                <div style={{ marginTop: 30 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 14,
                      marginBottom: 16,
                    }}
                  >
                    <span className="t-index accent">{level.index}</span>
                    <h3
                      className="t-h2"
                      style={{
                        color: ink.primary,
                        textTransform: "uppercase",
                        fontSize: 44,
                      }}
                    >
                      {level.title}
                    </h3>
                  </div>
                  <ul style={{ listStyle: "none", display: "grid", gap: 11 }}>
                    {level.items.map((item) => (
                      <li
                        key={item}
                        className="t-body"
                        style={{
                          color: ink.secondary,
                          display: "flex",
                          alignItems: "baseline",
                          gap: 12,
                        }}
                      >
                        <span
                          style={{
                            width: 12,
                            height: 2,
                            background: "var(--accent)",
                            flexShrink: 0,
                            transform: "translateY(-7px)",
                          }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Rise>
            </div>
          ))}
        </div>
      </SlideBody>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   06 — DÉMO LIVE
   ═══════════════════════════════════════════════════════════════════════════ */

export function DemoSlide() {
  const ink = useInk();

  return (
    <>
      <FlowField act={2} seed={31} intensity={0.5} particles={4} />

      <SlideBody center>
        <div style={{ textAlign: "center" }}>
          <Rise delay={0.15} y={10}>
            <div className="t-eyebrow accent">§ 05 — Démonstration</div>
          </Rise>

          <Rise delay={0.35} y={26} duration={DUR.slow}>
            <h2
              className="t-display"
              style={{ color: ink.primary, marginTop: 38 }}
            >
              Live product
            </h2>
          </Rise>

          <Rise delay={0.6} y={16}>
            <p
              className="t-lead"
              style={{ color: ink.muted, marginTop: 26 }}
            >
              The Essential Data, en pratique.
            </p>
          </Rise>

          {/* The button is a real link — the deck ignores clicks on it. */}
          <Rise delay={0.9} y={18}>
            <div
              style={{
                marginTop: 66,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 26,
              }}
            >
              <a
                href={DEMO_ROUTE}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "24px 44px",
                  borderRadius: 14,
                  background: "var(--accent)",
                  color: "#000",
                  fontSize: 26,
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  textDecoration: "none",
                  boxShadow: "0 0 36px rgba(57,255,136,0.32)",
                }}
              >
                Ouvrir la plateforme
                <span aria-hidden="true">→</span>
              </a>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <span className="t-micro" style={{ color: ink.faint }}>
                  {DEMO_DURATION}
                </span>
                <span
                  style={{ width: 1, height: 12, background: ink.rule }}
                />
                <span
                  className="t-micro"
                  style={{ color: ink.faint, letterSpacing: "0.08em" }}
                >
                  {DEMO_ROUTE}
                </span>
              </div>
            </div>
          </Rise>
        </div>
      </SlideBody>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   07 — DU CONCEPT AU PRODUIT
   ═══════════════════════════════════════════════════════════════════════════ */

export function ConceptProduitSlide() {
  const ink = useInk();

  return (
    <>
      <FlowField act={2} seed={37} intensity={0.3} />

      <SlideBody padding="104px 120px">
        <Eyebrow index="§ 06">Traction</Eyebrow>
        <Rise delay={0.28} y={20} duration={DUR.slow}>
          <h2 className="t-h1" style={{ color: ink.primary, marginTop: 32 }}>
            Du concept au produit.
          </h2>
        </Rise>

        <div
          style={{
            flex: 1,
            display: "grid",
            placeItems: "center",
            marginTop: 20,
          }}
        >
          <StepRail
            steps={TIMELINE_STEPS}
            startDelay={0.6}
            currentCaption="Aujourd'hui"
          />
        </div>

        {/* Figures that must not be invented */}
        <Rise delay={2.6} y={18}>
          <div>
            <Rule delay={2.5} width="100%" accentWidth={180} />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 40,
                marginTop: 34,
              }}
            >
              {TRACTION_KPIS.map((kpi) => (
                <DataPlaceholder
                  key={kpi.id}
                  label={kpi.label}
                  value={kpi.value}
                  hint={kpi.hint}
                />
              ))}
            </div>
          </div>
        </Rise>
      </SlideBody>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   08 — POURQUOI AVOIR RALENTI
   ═══════════════════════════════════════════════════════════════════════════ */

export function RalentirSlide() {
  const ink = useInk();

  const column = (
    side: { label: string; items: readonly string[] },
    active: boolean,
    baseDelay: number
  ) => (
    <div>
      <Rise delay={baseDelay} y={16}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 34,
          }}
        >
          {active && (
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--accent)",
                boxShadow: "0 0 10px rgba(57,255,136,0.9)",
              }}
            />
          )}
          <span
            className="t-h3"
            style={{
              color: active ? ink.primary : ink.muted,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {side.label}
          </span>
        </div>
      </Rise>

      <ul style={{ listStyle: "none", display: "grid", gap: 17 }}>
        {side.items.map((item, j) => (
          <Rise key={item} delay={baseDelay + 0.16 + j * 0.09} y={12}>
            <li
              className="t-lead"
              style={{
                color: active ? ink.secondary : ink.muted,
                display: "flex",
                alignItems: "baseline",
                gap: 14,
                opacity: active ? 1 : 0.72,
              }}
            >
              <span
                style={{
                  width: 14,
                  height: 2,
                  background: active ? "var(--accent)" : ink.faint,
                  flexShrink: 0,
                  transform: "translateY(-9px)",
                }}
              />
              {item}
            </li>
          </Rise>
        ))}
      </ul>
    </div>
  );

  return (
    <>
      <SlideBody padding="88px 120px">
        <Eyebrow index="§ 07">Changement d&apos;échelle technique</Eyebrow>

        <Rise delay={0.3} y={24} duration={DUR.slow}>
          <h2
            className="t-display"
            style={{
              color: ink.primary,
              marginTop: 28,
              fontSize: 92,
              textTransform: "uppercase",
            }}
          >
            {SLOWDOWN.headline}
          </h2>
        </Rise>

        {/* Before → transformation → now */}
        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 150px 1fr",
            gap: 0,
            marginTop: 62,
            alignItems: "start",
          }}
        >
          {column(SLOWDOWN.before, false, 0.7)}

          {/* Transformation marker */}
          <div
            style={{
              position: "relative",
              height: "100%",
              display: "grid",
              placeItems: "center",
            }}
          >
            <svg
              width="150"
              height="360"
              viewBox="0 0 150 360"
              aria-hidden="true"
            >
              <line
                x1="75"
                y1="0"
                x2="75"
                y2="140"
                stroke={ink.rule}
                strokeWidth="1"
              />
              <line
                x1="75"
                y1="220"
                x2="75"
                y2="360"
                stroke={ink.rule}
                strokeWidth="1"
              />
              <circle
                cx="75"
                cy="180"
                r="26"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="1.5"
                opacity="0.6"
              />
              <path
                d="M 62 180 L 88 180 M 80 172 L 88 180 L 80 188"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {column(SLOWDOWN.now, true, 1.1)}
        </div>

        {/* Closing */}
        <Rise delay={2.4} y={18} duration={DUR.slow}>
          <div style={{ marginTop: 46 }}>
            <Rule delay={2.3} width="100%" accentWidth={240} />
            <p
              className="t-h2 t-editorial"
              style={{
                color: ink.primary,
                marginTop: 30,
                maxWidth: 1680,
              }}
            >
              {SLOWDOWN.closing}
            </p>
          </div>
        </Rise>
      </SlideBody>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   09 — LA VISION
   ═══════════════════════════════════════════════════════════════════════════ */

const RING_CENTER = { x: 1300, y: 552 };
const RING_RADIUS = 462;

export function VisionSlide() {
  const ink = useInk();

  return (
    <>
      <GlobeBackdrop
        size={780}
        left={RING_CENTER.x - 390}
        top={RING_CENTER.y - 390}
        delay={0.4}
        traceDuration={4.5}
        dotOpacity={0.5}
      />

      {/* Domains in orbit */}
      {VISION.domains.map((d, i) => {
        const angle = (i / VISION.domains.length) * Math.PI * 2 - Math.PI / 2;
        const x = q(RING_CENTER.x + Math.cos(angle) * RING_RADIUS);
        const y = q(RING_CENTER.y + Math.sin(angle) * RING_RADIUS);

        return (
          <Fade key={d} delay={1 + i * 0.11} duration={DUR.base}>
            <div
              style={{
                position: "absolute",
                left: x,
                top: y,
                transform: "translate(-50%, -50%)",
                zIndex: 3,
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  boxShadow: "0 0 9px rgba(57,255,136,0.8)",
                  flexShrink: 0,
                }}
              />
              <span
                className="t-h3"
                style={{ color: ink.secondary, fontSize: 30, fontWeight: 700 }}
              >
                {d}
              </span>
            </div>
          </Fade>
        );
      })}

      <SlideBody>
        <Eyebrow index="§ 08">La vision</Eyebrow>

        <Rise delay={0.32} y={24} duration={DUR.slow}>
          <h2
            className="t-h1"
            style={{ color: ink.primary, marginTop: 36, maxWidth: 620 }}
          >
            {VISION.headline[0]}
            <br />
            <span className="accent">{VISION.headline[1]}</span>
          </h2>
        </Rise>

        <div style={{ flex: 1 }} />

        <Rise delay={2.3} y={18} duration={DUR.slow}>
          <div style={{ maxWidth: 620 }}>
            <Rule delay={2.2} width={120} accentWidth={120} />
            <p
              className="t-lead"
              style={{ color: ink.secondary, marginTop: 28 }}
            >
              {VISION.message}
            </p>
          </div>
        </Rise>
      </SlideBody>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   10 — AMBITION ÉDITORIALE
   ═══════════════════════════════════════════════════════════════════════════ */

export function AmbitionSlide() {
  const ink = useInk();

  return (
    <>
      <FlowField act={3} seed={41} intensity={0.28} />

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
            <Eyebrow index="§ 09">Ambition éditoriale</Eyebrow>
            <Rise delay={0.28} y={20} duration={DUR.slow}>
              <h2 className="t-h1" style={{ color: ink.primary, marginTop: 30 }}>
                {EDITORIAL_AMBITION.headline}
              </h2>
            </Rise>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "grid",
            placeItems: "center",
            marginTop: 24,
          }}
        >
          <SourceNetwork
            sources={EDITORIAL_AMBITION.sources}
            hub={BRAND.name}
            output={EDITORIAL_AMBITION.output}
            startDelay={0.6}
          />
        </div>

        <Rise delay={2.9} y={18} duration={DUR.slow}>
          <div
            style={{
              display: "flex",
              gap: 60,
              alignItems: "baseline",
              justifyContent: "flex-end",
            }}
          >
            <p
              className="t-h3"
              style={{
                color: ink.muted,
                fontSize: 32,
                fontWeight: 600,
                textAlign: "right",
              }}
            >
              {EDITORIAL_AMBITION.message[0]}
            </p>
            <p
              className="t-h3 t-editorial"
              style={{
                color: ink.primary,
                fontSize: 38,
                maxWidth: 640,
              }}
            >
              {EDITORIAL_AMBITION.message[1]}
            </p>
          </div>
        </Rise>
      </SlideBody>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   11 — COMMENT ÇA FONCTIONNE
   ═══════════════════════════════════════════════════════════════════════════ */

export function MoteurSlide() {
  const ink = useInk();

  return (
    <>
      <FlowField act={3} seed={43} intensity={0.3} />

      <SlideBody padding="104px 120px">
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 60,
          }}
        >
          <div>
            <Eyebrow index="§ 10">Comment ça fonctionne</Eyebrow>
            <Rise delay={0.28} y={20} duration={DUR.slow}>
              <h2 className="t-h1" style={{ color: ink.primary, marginTop: 30 }}>
                {ENGINE_HEADLINE}
              </h2>
            </Rise>
          </div>
          <Rise delay={0.5} y={12}>
            <p
              className="t-body"
              style={{
                color: ink.muted,
                maxWidth: 400,
                textAlign: "right",
              }}
            >
              Chaque étape est traçable, de la source publiée à la mise à jour.
            </p>
          </Rise>
        </div>

        <div
          style={{
            flex: 1,
            display: "grid",
            placeItems: "center",
          }}
        >
          <Pipeline
            stages={ENGINE_STAGES}
            emphasise={["Analyse assistée par IA", "Validation"]}
            startDelay={0.6}
          />
        </div>
      </SlideBody>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   12 — IA ≠ JOURNALISTE AUTONOME
   ═══════════════════════════════════════════════════════════════════════════ */

export function IaHumainSlide() {
  const ink = useInk();

  const side = (
    data: { label: string; items: readonly string[] },
    accent: boolean,
    baseDelay: number,
    align: "left" | "right"
  ) => (
    <div style={{ textAlign: align }}>
      <Rise delay={baseDelay} y={16}>
        <div
          className="t-h2"
          style={{
            color: accent ? "var(--accent)" : ink.primary,
            textTransform: "uppercase",
            marginBottom: 32,
            letterSpacing: "0.02em",
          }}
        >
          {data.label}
        </div>
      </Rise>
      <ul style={{ listStyle: "none", display: "grid", gap: 11 }}>
        {data.items.map((item, j) => (
          <Rise key={item} delay={baseDelay + 0.14 + j * 0.08} y={12}>
            <li
              className="t-lead"
              style={{
                color: ink.secondary,
                display: "flex",
                alignItems: "baseline",
                gap: 14,
                justifyContent: align === "right" ? "flex-end" : "flex-start",
              }}
            >
              {align === "left" && (
                <span
                  style={{
                    width: 14,
                    height: 2,
                    background: accent ? "var(--accent)" : ink.faint,
                    flexShrink: 0,
                    transform: "translateY(-9px)",
                  }}
                />
              )}
              {item}
              {align === "right" && (
                <span
                  style={{
                    width: 14,
                    height: 2,
                    background: accent ? "var(--accent)" : ink.faint,
                    flexShrink: 0,
                    transform: "translateY(-9px)",
                  }}
                />
              )}
            </li>
          </Rise>
        ))}
      </ul>
    </div>
  );

  return (
    <>
      <SlideBody padding="64px 120px">
        <div style={{ textAlign: "center" }}>
          <Rise delay={0.15} y={10}>
            <div className="t-eyebrow accent">§ 11 — Positionnement</div>
          </Rise>
          <Rise delay={0.32} y={22} duration={DUR.slow}>
            <h2
              className="t-h1"
              style={{ color: ink.primary, marginTop: 26, fontSize: 62 }}
            >
              {AI_HUMAN.headline[0]}
              <br />
              <span style={{ color: ink.muted }}>{AI_HUMAN.headline[1]}</span>
            </h2>
          </Rise>
        </div>

        {/* IA · human in the loop · humain */}
        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 420px 1fr",
            marginTop: 46,
            alignItems: "start",
          }}
        >
          {side(AI_HUMAN.ai, true, 0.7, "right")}

          <div
            style={{
              position: "relative",
              display: "grid",
              placeItems: "center",
              height: "100%",
            }}
          >
            <svg
              width="420"
              height="400"
              viewBox="0 0 420 400"
              aria-hidden="true"
              style={{ position: "absolute", inset: 0 }}
            >
              <line
                x1="210"
                y1="0"
                x2="210"
                y2="150"
                stroke={ink.rule}
                strokeWidth="1"
              />
              <line
                x1="210"
                y1="250"
                x2="210"
                y2="400"
                stroke={ink.rule}
                strokeWidth="1"
              />
            </svg>

            <Rise delay={1.4} y={14}>
              <div
                style={{
                  padding: "22px 34px",
                  borderRadius: 100,
                  border: "1px solid rgba(57,255,136,0.45)",
                  background:
                    ink.tone === "dark" ? "rgba(57,255,136,0.07)" : "#fff",
                  boxShadow: "0 0 30px rgba(57,255,136,0.16)",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}
              >
                <div
                  className="t-h3"
                  style={{
                    color: ink.primary,
                    textTransform: "uppercase",
                    fontSize: 26,
                    letterSpacing: "0.06em",
                  }}
                >
                  {AI_HUMAN.center}
                </div>
              </div>
            </Rise>
          </div>

          {side(AI_HUMAN.human, false, 1, "left")}
        </div>

        {/* The line that has to land */}
        <Rise delay={2.5} y={20} duration={DUR.slow}>
          <div
            style={{
              marginTop: 34,
              padding: "32px 50px",
              borderRadius: 16,
              background:
                ink.tone === "dark"
                  ? "rgba(57,255,136,0.055)"
                  : "rgba(57,255,136,0.045)",
              borderLeft: "3px solid var(--accent)",
            }}
          >
            <p
              className="t-h2"
              style={{ color: ink.primary, fontSize: 42, maxWidth: 1560 }}
            >
              {AI_HUMAN.closing}
            </p>
          </div>
        </Rise>
      </SlideBody>
    </>
  );
}
