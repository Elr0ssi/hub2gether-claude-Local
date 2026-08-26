"use client";

/* ═══════════════════════════════════════════════════════════════════════════
   SOUTENANCE 3 — CE QUI EST REPRIS DE LA V2

   Quatorze slides de la V2 sont bonnes ; elles étaient mal placées, pas mal
   faites. Elles sont donc rejouées telles quelles, sans une ligne recopiée :
   ce fichier ne fait que les re-exporter sous les noms de la V3, pour que le
   registre se lise comme un plan et non comme une liste d'imports.

   Une seule exception, la slide de financement : la V2 présentait un besoin,
   la V3 présente ce que ce besoin débloque. Elle est donc réécrite ici, en
   réutilisant les mêmes données.
   ═══════════════════════════════════════════════════════════════════════════ */

import {
  Eyebrow,
  Rise,
  SlideBody,
  useInk,
} from "@/components/presentation/primitives";
import { useAccent } from "@/components/soutenance2/visuals";
import { FUNDING } from "@/data/soutenance2/soutenance2Data";
import { S3_UNLOCK } from "@/data/soutenance3/soutenance3Data";

export {
  ConclusionSlide,
  CrossCheckSlide,
  FinanceSlide,
  MarketSlide,
  PivotSlide,
  RevenueSlide,
  RoadmapSlide,
  StatusSlide,
} from "@/components/soutenance2/slides";

export {
  EditorialSlide as EditorialSlideRef,
  TeamSlide as TeamSlideRef,
  WorkshopSlide as PipelineSlideRef,
} from "@/components/soutenance2/newSlides";

/* ═══════════════════════════════════════════════════════════════════════════
   24 — CE QUE LE FINANCEMENT DÉBLOQUE

   Même montant, même répartition, même instrument que la V2. Ce qui change est
   la direction de la phrase : on ne demande pas 27 500 €, on montre ce que
   27 500 € permettent d'atteindre. Le jalon lui-même n'est pas encore arrêté —
   il reste un emplacement visible, pas une invention.
   ═══════════════════════════════════════════════════════════════════════════ */

export function UnlockSlide() {
  const ink = useInk();
  const accent = useAccent();

  return (
    <SlideBody>
      <Eyebrow>Financement initial</Eyebrow>

      <div style={{ marginTop: 22, maxWidth: 1200 }}>
        <Rise delay={0.06} y={20}>
          <p className="t-h2" style={{ color: ink.primary, letterSpacing: "-0.035em" }}>
            Ce que 27 500 € permettent de débloquer.
          </p>
        </Rise>
      </div>

      {/* Le corps se centre dans ce que le titre lui laisse, au lieu de se
          coller dessous : le montant et sa répartition étaient tassés en haut
          de la scène avec deux cents pixels de vide en dessous. */}
      <div
        style={{
          marginTop: 64,
          flex: 1,
          minHeight: 0,
          display: "grid",
          gridTemplateColumns: "minmax(0, 0.85fr) minmax(0, 1fr) minmax(0, 1fr)",
          gap: 56,
          alignItems: "center",
          alignContent: "center",
        }}
      >
        {/* Le montant, et à quoi il sert */}
        <div>
          <Rise delay={0.25} y={16}>
            <p
              style={{
                color: accent,
                letterSpacing: "-0.05em",
                fontSize: 92,
                lineHeight: 1,
                fontWeight: 800,
              }}
            >
              {FUNDING.need.value}
            </p>
            <p style={{ color: ink.secondary, marginTop: 12, fontSize: 23, fontWeight: 500 }}>
              {FUNDING.need.label}
            </p>
          </Rise>

          <Rise delay={0.4} y={14}>
            <div style={{ marginTop: 34 }}>
              <p style={{ fontSize: 27, fontWeight: 800, color: ink.primary, letterSpacing: "-0.025em" }}>
                {FUNDING.instrument.label}
              </p>
              <p style={{ fontSize: 20, color: ink.muted, marginTop: 12, lineHeight: 1.5 }}>
                {FUNDING.instrument.body}
              </p>
              <p style={{ fontSize: 19, color: ink.faint, marginTop: 14 }}>
                {FUNDING.ticket.label} · {FUNDING.ticket.value}
              </p>
            </div>
          </Rise>
        </div>

        {/* L'emploi des fonds */}
        <div>
          <Rise delay={0.5} y={14}>
            <p className="t-micro" style={{ color: accent, letterSpacing: "0.15em", marginBottom: 20 }}>
              Emploi des fonds
            </p>
          </Rise>
          <div style={{ display: "grid", gap: 14 }}>
            {FUNDING.allocation.map((a, i) => (
              <Rise key={a.label} delay={0.6 + i * 0.11} y={12}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1fr) auto",
                    gap: 20,
                    alignItems: "baseline",
                    paddingBottom: 12,
                    borderBottom: `1px solid ${ink.rule}`,
                  }}
                >
                  <span style={{ fontSize: 22, color: ink.secondary, fontWeight: 500 }}>{a.label}</span>
                  <span style={{ fontSize: 23, color: ink.primary, fontWeight: 800 }}>{a.value}</span>
                </div>
              </Rise>
            ))}
          </div>
          <Rise delay={1.1} y={8}>
            <p style={{ fontSize: 18, color: ink.faint, marginTop: 16, fontStyle: "italic" }}>
              {FUNDING.note}
            </p>
          </Rise>
        </div>

        {/* Les trois raisons, puis le jalon */}
        <div style={{ display: "grid", gap: 22 }}>
          {FUNDING.reasons.map((r, i) => (
            <Rise key={r.label} delay={0.7 + i * 0.13} y={14}>
              <div style={{ paddingTop: 16, borderTop: `2px solid ${accent}` }}>
                <p style={{ fontSize: 28, fontWeight: 800, color: ink.primary, letterSpacing: "-0.028em" }}>
                  {r.label}
                </p>
                <p style={{ fontSize: 20, color: ink.muted, marginTop: 10, lineHeight: 1.45 }}>
                  {r.body}
                </p>
              </div>
            </Rise>
          ))}
        </div>
      </div>

      {/* Le déblocage : ce que la V2 ne disait pas. */}
      <Rise delay={1.4} y={16}>
        <div
          style={{
            marginTop: 30,
            borderTop: `1px solid ${ink.rule}`,
            paddingTop: 28,
            display: "flex",
            alignItems: "center",
            gap: 34,
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: 26, fontWeight: 700, color: ink.secondary, letterSpacing: "-0.02em" }}>
            {S3_UNLOCK.milestoneLabel}
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              border: `2px dashed ${accent}`,
              borderRadius: 4,
              padding: "12px 26px",
              color: accent,
              fontSize: 24,
              fontWeight: 800,
            }}
          >
            à arrêter
          </span>
          <span style={{ fontSize: 18, color: ink.faint, fontStyle: "italic" }}>
            {S3_UNLOCK.milestoneNote}
          </span>
        </div>
      </Rise>
    </SlideBody>
  );
}
