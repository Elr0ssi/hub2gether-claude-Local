"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ImageIcon } from "lucide-react";
import { DUR, EASE, Eyebrow, Rise, SlideBody, useDeckReducedMotion, useInk } from "@/components/presentation/primitives";
import {
  AUTOMATION,
  GEO,
  PARTNERS,
  PUBLICATIONS,
  TO_CONFIRM,
} from "@/data/soutenance2/soutenance2Data";
import { useAccent } from "./visuals";

/* ═══════════════════════════════════════════════════════════════════════════
   The four sections added to the deck. Same vocabulary as the rest: one
   easing, a rise and a fade, no rotation and no bounce.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Shown wherever a figure is owed. Never a plausible number. */
function Slot({ children = TO_CONFIRM }: { children?: string }) {
  const ink = useInk();
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: 7,
        border: `1px dashed ${ink.faint}`,
        color: ink.muted,
        fontSize: 15,
        fontWeight: 700,
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

/** Title block shared by the four, matching the deck's existing one. */
function Title({ lines, delay = 0.1 }: { lines: readonly string[]; delay?: number }) {
  const ink = useInk();
  return (
    <div style={{ marginTop: 24 }}>
      {lines.map((line, i) => (
        <Rise key={line} delay={delay + i * 0.12} y={18}>
          <div
            className="t-h2"
            style={{
              color: i === lines.length - 1 ? ink.primary : ink.muted,
              letterSpacing: "-0.032em",
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
   NOS PUBLICATIONS
   ═══════════════════════════════════════════════════════════════════════ */

/**
 * A published post, at the aspect ratio of the capture that will fill it.
 *
 * The frame holds its size whether or not the file exists, so dropping the
 * screenshots in later moves nothing on the slide.
 */
function PublicationCard({
  item,
  delay,
}: {
  item: (typeof PUBLICATIONS.items)[number];
  delay: number;
}) {
  const ink = useInk();
  const accent = useAccent();
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <Rise delay={delay} y={18}>
      <figure style={{ margin: 0 }}>
        <div
          style={{
            position: "relative",
            aspectRatio: "4 / 5",
            borderRadius: 16,
            overflow: "hidden",
            border: `1px solid ${ink.rule}`,
            background: ink.tone === "dark" ? "#0B0B0B" : "#F2F2F2",
          }}
        >
          {!failed && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={item.image}
              alt={item.title === TO_CONFIRM ? "Publication" : item.title}
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                opacity: loaded ? 1 : 0,
                transition: "opacity .4s",
              }}
            />
          )}

          {(!loaded || failed) && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
                gap: 10,
                textAlign: "center",
                padding: 20,
              }}
            >
              <div>
                <ImageIcon size={22} style={{ color: ink.faint }} />
                <p className="t-micro" style={{ color: ink.faint, marginTop: 10 }}>
                  Capture à déposer
                </p>
                <p style={{ fontSize: 13, color: ink.faint, marginTop: 6, opacity: 0.8 }}>
                  {item.image}
                </p>
              </div>
            </div>
          )}
        </div>

        <figcaption style={{ marginTop: 14 }}>
          <p className="t-h3" style={{ color: accent, letterSpacing: "-0.025em" }}>
            {item.hook === TO_CONFIRM ? <Slot /> : item.hook}
          </p>
          <p className="t-small" style={{ color: ink.secondary, marginTop: 6, lineHeight: 1.45 }}>
            {item.title === TO_CONFIRM ? <Slot /> : item.title}
          </p>
          <p className="t-micro" style={{ color: ink.faint, marginTop: 8 }}>
            {item.format}
          </p>
        </figcaption>
      </figure>
    </Rise>
  );
}

export function PublicationsSlide({ index }: { index: string }) {
  const ink = useInk();
  const accent = useAccent();

  return (
    <SlideBody>
      <Eyebrow index={index}>Nos publications</Eyebrow>
      <Title lines={PUBLICATIONS.title} />

      <div
        style={{
          marginTop: 30,
          flex: 1,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 520px",
          gap: 64,
          alignItems: "start",
          minHeight: 0,
        }}
      >
        {/* The captures */}
        <div>
          <Rise delay={0.4} y={12}>
            <p className="t-body" style={{ color: ink.secondary, maxWidth: 720, marginBottom: 24 }}>
              {PUBLICATIONS.intro}
            </p>
          </Rise>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 26 }}>
            {PUBLICATIONS.items.map((item, i) => (
              <PublicationCard key={item.id} item={item} delay={0.55 + i * 0.12} />
            ))}
          </div>
        </div>

        {/* Audience, then what the format opens */}
        <div style={{ display: "grid", gap: 24, alignContent: "start" }}>
          <Rise delay={0.6} y={14}>
            <div>
              <p className="t-micro" style={{ color: accent, marginBottom: 14 }}>
                {PUBLICATIONS.audience.label}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {PUBLICATIONS.audience.metrics.map((m) => (
                  <div
                    key={m.label}
                    style={{
                      padding: "12px 14px",
                      borderRadius: 12,
                      border: `1px solid ${ink.rule}`,
                    }}
                  >
                    <p className="t-micro" style={{ color: ink.faint, marginBottom: 8 }}>
                      {m.label}
                    </p>
                    {m.value ? (
                      <p className="t-h3" style={{ color: ink.primary }}>
                        {m.value}
                      </p>
                    ) : (
                      <Slot />
                    )}
                  </div>
                ))}
              </div>
              <p className="t-small" style={{ color: ink.faint, marginTop: 12, lineHeight: 1.5 }}>
                {PUBLICATIONS.audience.note}
              </p>
            </div>
          </Rise>

          <Rise delay={0.85} y={14}>
            <div>
              <p className="t-micro" style={{ color: accent, marginBottom: 4 }}>
                {PUBLICATIONS.partnerships.label}
              </p>
              <p className="t-small" style={{ color: ink.faint, marginBottom: 16 }}>
                {PUBLICATIONS.partnerships.disclaimer}
              </p>
              {/* One line each. Four paragraphs here made the column run off
                  the bottom of the slide and gave the eye nowhere to rest —
                  the detail belongs in the speaker's mouth, not on the wall. */}
              <div style={{ display: "grid", gap: 12 }}>
                {PUBLICATIONS.partnerships.items.map((pt) => (
                  <div
                    key={pt.kind}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "210px minmax(0, 1fr)",
                      gap: 18,
                      alignItems: "baseline",
                      paddingBottom: 12,
                      borderBottom: `1px solid ${ink.rule}`,
                    }}
                  >
                    <p className="t-small" style={{ color: ink.primary, fontWeight: 800 }}>
                      {pt.kind}
                    </p>
                    <p className="t-small" style={{ color: ink.muted, lineHeight: 1.45 }}>
                      {pt.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Rise>
        </div>
      </div>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   GEO
   ═══════════════════════════════════════════════════════════════════════ */

export function GeoSlide({ index }: { index: string }) {
  const ink = useInk();
  const accent = useAccent();

  return (
    <SlideBody>
      <Eyebrow index={index}>GEO · être lisible par les moteurs</Eyebrow>
      <Title lines={GEO.title} />

      <div
        style={{
          marginTop: 28,
          flex: 1,
          display: "grid",
          gridTemplateColumns: "560px minmax(0, 1fr)",
          gap: 70,
          alignItems: "start",
          minHeight: 0,
        }}
      >
        {/* The distinction, stated then tabled */}
        <div>
          <Rise delay={0.4} y={12}>
            <p className="t-body" style={{ color: ink.secondary, marginBottom: 26 }}>
              {GEO.definition}
            </p>
          </Rise>

          <div style={{ display: "grid", gap: 0 }}>
            <Rise delay={0.5} y={10}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 22,
                  paddingBottom: 10,
                  borderBottom: `1px solid ${ink.rule}`,
                }}
              >
                <span className="t-micro" style={{ color: ink.faint }}>
                  SEO
                </span>
                <span className="t-micro" style={{ color: accent }}>
                  GEO
                </span>
              </div>
            </Rise>

            {GEO.contrast.map((row, i) => (
              <Rise key={row.seo} delay={0.58 + i * 0.08} y={10}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 22,
                    padding: "14px 0",
                    borderBottom: `1px solid ${ink.rule}`,
                  }}
                >
                  <span className="t-small" style={{ color: ink.muted }}>
                    {row.seo}
                  </span>
                  <span className="t-small" style={{ color: ink.primary, fontWeight: 700 }}>
                    {row.geo}
                  </span>
                </div>
              </Rise>
            ))}
          </div>

          <Rise delay={1} y={12}>
            <div style={{ marginTop: 26 }}>
              <p className="t-micro" style={{ color: ink.faint, marginBottom: 12 }}>
                {GEO.moat.label}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginBottom: 14 }}>
                {GEO.moat.items.map((item) => (
                  <span
                    key={item}
                    style={{
                      padding: "7px 14px",
                      borderRadius: 100,
                      border: `1px solid ${accent}`,
                      color: accent,
                      fontSize: 15,
                      fontWeight: 700,
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
              <p className="t-h3" style={{ color: ink.primary, letterSpacing: "-0.025em" }}>
                {GEO.moat.statement}
              </p>
            </div>
          </Rise>
        </div>

        {/* The worksites */}
        <div style={{ display: "grid", gap: 16, alignContent: "start" }}>
          {GEO.worksites.map((w, i) => (
            <Rise key={w.n} delay={0.5 + i * 0.1} y={14}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto minmax(0, 1fr) auto",
                  gap: 20,
                  alignItems: "baseline",
                  paddingBottom: 16,
                  borderBottom: `1px solid ${ink.rule}`,
                }}
              >
                <span className="t-micro" style={{ color: accent }}>
                  {w.n}
                </span>
                <div>
                  <p className="t-h3" style={{ color: ink.primary, letterSpacing: "-0.025em" }}>
                    {w.label}
                  </p>
                  <p className="t-small" style={{ color: ink.muted, marginTop: 6, lineHeight: 1.55 }}>
                    {w.body}
                  </p>
                </div>
                <span
                  className="t-micro"
                  style={{
                    color: w.state === "En cours" ? accent : ink.faint,
                    whiteSpace: "nowrap",
                  }}
                >
                  {w.state}
                </span>
              </div>
            </Rise>
          ))}

          <Rise delay={1.1} y={10}>
            <p className="t-small" style={{ color: ink.faint, lineHeight: 1.55 }}>
              {GEO.caveat}
            </p>
          </Rise>
        </div>
      </div>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SÉLECTION DES PARTENAIRES
   ═══════════════════════════════════════════════════════════════════════ */

export function PartnersSlide({ index }: { index: string }) {
  const ink = useInk();
  const accent = useAccent();

  return (
    <SlideBody>
      <Eyebrow index={index}>Sélection des partenaires</Eyebrow>
      <Title lines={PARTNERS.title} />

      <Rise delay={0.4} y={12}>
        <p className="t-body" style={{ color: ink.secondary, maxWidth: 900, marginTop: 20 }}>
          {PARTNERS.intro}
        </p>
      </Rise>

      <div
        style={{
          marginTop: 30,
          flex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 26,
          // Stretched, not top-aligned: the first card carries a badge the
          // others do not, and left to itself it stood a head taller.
          alignItems: "stretch",
          minHeight: 0,
        }}
      >
        {PARTNERS.criteria.map((c, i) => (
          <Rise key={c.n} delay={0.55 + i * 0.1} y={16} style={{ height: "100%" }}>
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                padding: "22px 22px 24px",
                borderRadius: 16,
                border: `1px solid ${c.veto ? accent : ink.rule}`,
                background: c.veto
                  ? ink.tone === "dark"
                    ? "rgba(57,255,136,0.08)"
                    : "rgba(13,122,64,0.05)"
                  : "transparent",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                <span className="t-micro" style={{ color: accent }}>
                  {c.n}
                </span>
                {c.veto && (
                  <span
                    className="t-micro"
                    style={{
                      marginLeft: "auto",
                      color: accent,
                      border: `1px solid ${accent}`,
                      borderRadius: 100,
                      padding: "3px 10px",
                    }}
                  >
                    Éliminatoire
                  </span>
                )}
              </div>
              <p className="t-h3" style={{ color: ink.primary, letterSpacing: "-0.025em" }}>
                {c.label}
              </p>
              <p className="t-small" style={{ color: accent, fontWeight: 700 }}>
                {c.question}
              </p>
              <p className="t-small" style={{ color: ink.muted, lineHeight: 1.55 }}>
                {c.body}
              </p>
            </div>
          </Rise>
        ))}
      </div>

      {/* Where a partner sits once it has passed */}
      <div
        style={{
          marginTop: 26,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 34,
          paddingTop: 22,
          borderTop: `1px solid ${ink.rule}`,
        }}
      >
        {PARTNERS.tiers.map((t, i) => (
          <Rise key={t.tier} delay={1 + i * 0.1} y={12}>
            <div>
              <p className="t-micro" style={{ color: accent, marginBottom: 8 }}>
                {t.tier}
              </p>
              <p className="t-small" style={{ color: ink.secondary, lineHeight: 1.5 }}>
                {t.body}
              </p>
              <p className="t-small" style={{ color: ink.faint, marginTop: 6 }}>
                {t.examples}
              </p>
            </div>
          </Rise>
        ))}
      </div>

      <Rise delay={1.35} y={10}>
        <p className="t-small" style={{ color: ink.faint, marginTop: 18 }}>
          {PARTNERS.note}
        </p>
      </Rise>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   L'AUTOMATISATION
   ═══════════════════════════════════════════════════════════════════════ */

const STATE_TONE: Record<string, { border: string; dim: number; dashed: boolean }> = {
  live: { border: "accent", dim: 1, dashed: false },
  rebuild: { border: "rule", dim: 0.85, dashed: false },
  planned: { border: "rule", dim: 0.6, dashed: true },
};

/**
 * The chain, drawn as the node graph it is built in — boxes on a wire, read
 * left to right, wrapping onto a second row. The two nodes a person owns are
 * marked; everything else is a task passing its result on.
 */
function FlowGraph() {
  const ink = useInk();
  const accent = useAccent();
  const reduced = useDeckReducedMotion();
  const rows = [AUTOMATION.nodes.slice(0, 4), AUTOMATION.nodes.slice(4)];

  return (
    <div style={{ display: "grid", gap: 26 }}>
      {rows.map((row, r) => (
        <div key={r} style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
          {row.map((node, i) => {
            const tone = STATE_TONE[node.state];
            const border = tone.border === "accent" ? accent : ink.rule;
            return (
              <div key={node.id} style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
                <Rise delay={0.45 + (r * 4 + i) * 0.09} y={14} style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      position: "relative",
                      padding: "16px 18px 18px",
                      borderRadius: 14,
                      border: `1px ${tone.dashed ? "dashed" : "solid"} ${border}`,
                      background:
                        node.state === "live"
                          ? ink.tone === "dark"
                            ? "rgba(57,255,136,0.07)"
                            : "rgba(13,122,64,0.04)"
                          : "transparent",
                      opacity: tone.dim,
                      minHeight: 108,
                    }}
                  >
                    {node.human && (
                      <span
                        className="t-micro"
                        style={{
                          position: "absolute",
                          top: -10,
                          left: 16,
                          padding: "2px 9px",
                          borderRadius: 100,
                          background: accent,
                          color: "#062713",
                          fontWeight: 900,
                        }}
                      >
                        Humain
                      </span>
                    )}
                    <p
                      className="t-small"
                      style={{ color: ink.primary, fontWeight: 800, marginBottom: 6 }}
                    >
                      {node.label}
                    </p>
                    <p style={{ fontSize: 15, color: ink.muted, lineHeight: 1.45 }}>
                      {node.detail}
                    </p>
                    <p
                      className="t-micro"
                      style={{
                        color: node.state === "live" ? accent : ink.faint,
                        marginTop: 10,
                      }}
                    >
                      {AUTOMATION.stateLabels[node.state]}
                    </p>
                  </div>
                </Rise>

                {/* The wire to the next node. */}
                {i < row.length - 1 && (
                  <motion.span
                    initial={reduced ? undefined : { scaleX: 0 }}
                    animate={reduced ? undefined : { scaleX: 1 }}
                    transition={{ duration: DUR.quick, delay: 0.55 + (r * 4 + i) * 0.09, ease: EASE }}
                    style={{
                      width: 26,
                      height: 1,
                      flexShrink: 0,
                      background: ink.rule,
                      transformOrigin: "left",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function AutomationSlide({ index }: { index: string }) {
  const ink = useInk();
  const accent = useAccent();

  return (
    <SlideBody>
      <Eyebrow index={index}>L&apos;automatisation</Eyebrow>
      <Title lines={AUTOMATION.title} />

      <Rise delay={0.4} y={12}>
        <p className="t-body" style={{ color: ink.secondary, maxWidth: 860, marginTop: 18 }}>
          {AUTOMATION.intro}
        </p>
      </Rise>

      <div
        style={{
          marginTop: 26,
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <FlowGraph />
      </div>

      <div
        style={{
          marginTop: 24,
          paddingTop: 22,
          borderTop: `1px solid ${ink.rule}`,
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr)) minmax(0, 1.2fr)",
          gap: 44,
          alignItems: "start",
        }}
      >
        {AUTOMATION.guardrails.items.map((g, i) => (
          <Rise key={g.label} delay={1.15 + i * 0.1} y={12}>
            <div>
              <p className="t-micro" style={{ color: accent, marginBottom: 8 }}>
                {g.label}
              </p>
              <p className="t-small" style={{ color: ink.secondary, lineHeight: 1.55 }}>
                {g.body}
              </p>
            </div>
          </Rise>
        ))}

        <Rise delay={1.35} y={12}>
          <div>
            <p className="t-small" style={{ color: ink.primary, fontWeight: 700, lineHeight: 1.55 }}>
              {AUTOMATION.guardrails.statement}
            </p>
            <p className="t-small" style={{ color: ink.faint, marginTop: 10, lineHeight: 1.5 }}>
              {AUTOMATION.note}
            </p>
          </div>
        </Rise>
      </div>
    </SlideBody>
  );
}
