"use client";

/* ═══════════════════════════════════════════════════════════════════════════
   SOUTENANCE 3 — LES VUES

   Vingt-six slides, sept actes, une seule direction. Ce fichier ne réécrit que
   ce que la V3 raconte autrement ; tout le reste est importé de la V2 et rendu
   tel quel. Douze slides sont neuves ou refondues, quatorze sont reprises.

   RÈGLE : rien de ce qui est importé de `soutenance2` n'est modifié ici. La V2
   doit continuer de se jouer exactement comme aujourd'hui, et c'est vérifiable
   en ouvrant les deux onglets côte à côte.
   ═══════════════════════════════════════════════════════════════════════════ */

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import {
  Eyebrow,
  Fade,
  Rise,
  Rule,
  SlideBody,
  useInk,
} from "@/components/presentation/primitives";
import {
  SourceFan,
  ProductScreenshotFrame,
  useAccent,
} from "@/components/soutenance2/visuals";
import {
  ConclusionSlide,
  CrossCheckSlide,
  EditorialSlideRef,
  FinanceSlide,
  MarketSlide,
  PipelineSlideRef,
  PivotSlide,
  RevenueSlide,
  RoadmapSlide,
  StatusSlide,
  TeamSlideRef,
  UnlockSlide,
} from "./reused";
import {
  Intersection,
  MarginalCurve,
  OperationChain,
  PendingValue,
  SeriesTimeline,
  ShiftChain,
  SplitPanel,
  VerbStack,
} from "./visuals";
import {
  S3_ANSWER,
  S3_CHANNEL,
  S3_COVER,
  S3_DEPTH,
  S3_ECONOMICS,
  S3_JOURNEY,
  S3_MISSING,
  S3_PARADOX,
  S3_POSITIONING,
  S3_READER_WORK,
  S3_SERIES,
  S3_SHIFT,
  S3_SPLIT,
  S3_TRACE,
} from "@/data/soutenance3/soutenance3Data";
import { useSlideStep } from "@/components/soutenance2/useDeck";

const PresentationGlobe = dynamic(
  () => import("@/components/presentation/visuals/PresentationGlobe"),
  { ssr: false, loading: () => null }
);

/* ═══════════════════════════════════════════════════════════════════════════
   01 — COUVERTURE

   La V2 posait le contexte et le nom. La V3 ajoute la signature, parce que
   c'est elle qui reviendra à la dernière slide et qu'une promesse énoncée deux
   fois, en ouverture et en clôture, referme le récit.
   ═══════════════════════════════════════════════════════════════════════════ */

function CoverSlide() {
  const ink = useInk();
  const accent = useAccent();

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
              color: accent,
            }}
          >
            {S3_COVER.context}
          </p>
        </Rise>

        <Rise delay={0.15} y={26}>
          <h1 className="t-display" style={{ color: ink.primary, letterSpacing: "-0.05em", marginTop: 26 }}>
            The Essential
            <br />
            <span style={{ color: accent }}>Data</span>
          </h1>
        </Rise>

        <div style={{ marginTop: 44, maxWidth: 640 }}>
          <Rule delay={0.5} accentWidth={120} />
        </div>

        <Rise delay={0.95} y={14}>
          <p
            style={{
              marginTop: 30,
              fontSize: 30,
              fontWeight: 500,
              letterSpacing: "-0.02em",
              color: ink.secondary,
            }}
          >
            {S3_COVER.tagline}
          </p>
        </Rise>
      </div>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   02 — LE PARADOXE

   Presque une affiche : trois pressions sur la flèche, trois états. La charnière
   « Et pourtant… » existe pour ménager le silence entre les deux phrases, et
   c'est ce silence qui installe la tension du deck entier.
   ═══════════════════════════════════════════════════════════════════════════ */

function ParadoxSlide() {
  const ink = useInk();
  const accent = useAccent();
  const step = useSlideStep();

  return (
    <SlideBody center>
      <div style={{ maxWidth: 1500 }}>
        <Eyebrow>{S3_PARADOX.eyebrow}</Eyebrow>

        <div style={{ marginTop: 60 }}>
          <Rise delay={0.1} y={26}>
            <p
              className="t-h1"
              style={{
                color: step >= 1 ? ink.muted : ink.primary,
                letterSpacing: "-0.04em",
                transition: "color 0.5s ease",
              }}
            >
              {S3_PARADOX.first}
            </p>
          </Rise>

          <div style={{ height: 92, display: "flex", alignItems: "center" }}>
            {step >= 1 && (
              <Fade delay={0.05}>
                <p
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontStyle: "italic",
                    fontSize: 44,
                    color: accent,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {S3_PARADOX.hinge}
                </p>
              </Fade>
            )}
          </div>

          {step >= 2 && (
            <Rise delay={0.05} y={26}>
              <p className="t-h1" style={{ color: ink.primary, letterSpacing: "-0.04em" }}>
                {S3_PARADOX.second}
              </p>
            </Rise>
          )}
        </div>
      </div>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   03 — LE TRAVAIL INVISIBLE DU LECTEUR

   L'idée arrivait en slide 18 de la V2, alors qu'elle est le point de départ du
   raisonnement. Le lecteur est au centre, les sources l'encerclent, et la
   colonne de droite énumère ce qu'il doit faire lui-même.

   La même composition revient à l'acte V avec The Essential Data au centre :
   c'est délibérément le même dessin, retourné.
   ═══════════════════════════════════════════════════════════════════════════ */

function ReaderWorkSlide() {
  const ink = useInk();
  const accent = useAccent();

  return (
    <SlideBody>
      <Eyebrow>{S3_READER_WORK.eyebrow}</Eyebrow>

      <div style={{ marginTop: 26, maxWidth: 1240 }}>
        {S3_READER_WORK.title.map((line, i) => (
          <Rise key={line} delay={0.1 + i * 0.14} y={20}>
            <p className="t-h2" style={{ color: ink.primary, letterSpacing: "-0.035em" }}>
              {line}
            </p>
          </Rise>
        ))}
      </div>

      <div
        style={{
          marginTop: 34,
          display: "grid",
          gridTemplateColumns: "1fr 620px 340px",
          gap: 48,
          alignItems: "center",
          flex: 1,
          minHeight: 0,
        }}
      >
        <div>
          <Rise delay={1.5} y={16}>
            <div style={{ borderLeft: `3px solid ${accent}`, paddingLeft: 26 }}>
              {S3_READER_WORK.statement.map((line, i) => (
                <p
                  key={line}
                  style={{
                    fontSize: 31,
                    fontWeight: i === 1 ? 800 : 500,
                    letterSpacing: "-0.025em",
                    color: i === 1 ? ink.primary : ink.secondary,
                    lineHeight: 1.28,
                  }}
                >
                  {line}
                </p>
              ))}
            </div>
          </Rise>
        </div>

        <div style={{ display: "grid", placeItems: "center" }}>
          <SourceFan
            labels={S3_READER_WORK.sources}
            center={S3_READER_WORK.center}
            centerSize={26}
            labelSize={19}
            maxWidth={620}
            startDelay={0.35}
          />
        </div>

        <div>
          <Rise delay={0.9} y={12}>
            <div className="t-micro" style={{ color: accent, letterSpacing: "0.16em", marginBottom: 20 }}>
              Ce qu&apos;il doit faire
            </div>
          </Rise>
          <OperationChain steps={S3_READER_WORK.operations} startDelay={1.0} />
        </div>
      </div>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   04 — CE QUI MANQUE

   Ne pas attaquer les médias : chacun fait son métier. Le trou est nommé à
   droite, en très gros, parce que c'est là que le produit viendra se poser.
   ═══════════════════════════════════════════════════════════════════════════ */

function MissingSlide() {
  const ink = useInk();
  const accent = useAccent();

  return (
    <SlideBody>
      <Eyebrow>{S3_MISSING.eyebrow}</Eyebrow>

      <div
        style={{
          marginTop: 46,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 96,
          alignItems: "center",
          flex: 1,
          minHeight: 0,
        }}
      >
        <div>
          <div style={{ display: "grid", gap: 34 }}>
            {S3_MISSING.families.map((f, i) => (
              <Rise key={f.label} delay={0.12 + i * 0.16} y={16}>
                <div>
                  <div
                    style={{
                      fontSize: 34,
                      fontWeight: 800,
                      letterSpacing: "-0.03em",
                      color: ink.primary,
                    }}
                  >
                    {f.label}
                  </div>
                  <div
                    style={{
                      fontSize: 27,
                      fontWeight: 500,
                      letterSpacing: "-0.018em",
                      color: ink.secondary,
                      marginTop: 2,
                    }}
                  >
                    {f.body}
                  </div>
                </div>
              </Rise>
            ))}
          </div>

          <Rise delay={0.8} y={14}>
            <div style={{ marginTop: 46, maxWidth: 560 }}>
              <Rule accentWidth={100} />
              <p
                style={{
                  marginTop: 24,
                  fontSize: 27,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: ink.primary,
                }}
              >
                {S3_MISSING.bridge}
              </p>
            </div>
          </Rise>
        </div>

        <div>
          <VerbStack verbs={S3_MISSING.verbs} startDelay={1.05} />
        </div>
      </div>

      <Rise delay={1.9} y={0}>
        <div style={{ height: 3, background: accent, width: 132, marginTop: 4 }} />
      </Rise>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   05 — LA RÉPONSE

   Le produit apparaît comme conséquence des quatre slides précédentes. Rien sur
   le modèle, rien sur l'IA, rien sur la fabrication : uniquement ce que le
   lecteur obtient. C'est la slide la plus dépouillée de l'acte.
   ═══════════════════════════════════════════════════════════════════════════ */

function AnswerSlide() {
  const ink = useInk();
  const accent = useAccent();

  return (
    <SlideBody>
      <div style={{ position: "absolute", right: 60, top: "50%", transform: "translateY(-50%)", zIndex: 1, opacity: 0.9 }}>
        <Fade delay={0.6} duration={1.4}>
          <div style={{ width: 620, height: 620 }}>
            <PresentationGlobe tone={ink.tone} />
          </div>
        </Fade>
      </div>

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1080 }}>
        <Eyebrow>{S3_ANSWER.eyebrow}</Eyebrow>

        <Rise delay={0.1} y={18}>
          <div
            style={{
              marginTop: 30,
              fontSize: 44,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: accent,
            }}
          >
            {S3_ANSWER.wordmark}
          </div>
        </Rise>

        <div style={{ marginTop: 26, maxWidth: 940 }}>
          {S3_ANSWER.title.map((line, i) => (
            <Rise key={line} delay={0.35 + i * 0.18} y={24}>
              <p className="t-h1" style={{ color: ink.primary, letterSpacing: "-0.042em" }}>
                {line}
              </p>
            </Rise>
          ))}
        </div>

        <div style={{ marginTop: 58, display: "flex", gap: 20, flexWrap: "wrap" }}>
          {S3_ANSWER.pillars.map((p, i) => (
            <Rise key={p} delay={0.95 + i * 0.13} y={14}>
              <span
                style={{
                  display: "inline-block",
                  padding: "15px 30px",
                  borderRadius: 100,
                  border: `2px solid ${ink.rule}`,
                  color: ink.primary,
                  fontSize: 25,
                  fontWeight: 700,
                  letterSpacing: "-0.018em",
                }}
              >
                {p}
              </span>
            </Rise>
          ))}
        </div>
      </div>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   06 — LE PARCOURS

   Six gestes qui s'enchaînent, dans l'ordre où on les fait réellement. La
   numérotation est là pour que l'œil suive la progression sans que la voix ait
   à dire « ensuite » six fois.
   ═══════════════════════════════════════════════════════════════════════════ */

function JourneySlide() {
  const ink = useInk();
  const accent = useAccent();

  return (
    <SlideBody>
      <Eyebrow>{S3_JOURNEY.eyebrow}</Eyebrow>

      <div style={{ marginTop: 22 }}>
        <Rise delay={0.08} y={20}>
          <p className="t-h2" style={{ color: ink.primary, letterSpacing: "-0.035em" }}>
            {S3_JOURNEY.title[0]}
          </p>
        </Rise>
      </div>

      <div
        style={{
          marginTop: 44,
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: 0,
          flex: 1,
          minHeight: 0,
          alignItems: "start",
        }}
      >
        {S3_JOURNEY.steps.map((s, i) => (
          <Rise key={s.id} delay={0.3 + i * 0.17} y={18}>
            <div
              style={{
                paddingRight: 26,
                borderLeft: i === 0 ? "none" : `1px solid ${ink.rule}`,
                paddingLeft: i === 0 ? 0 : 26,
                height: "100%",
              }}
            >
              <div
                className="t-micro"
                style={{ color: accent, letterSpacing: "0.16em", marginBottom: 14 }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <div
                style={{
                  fontSize: 33,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: ink.primary,
                  lineHeight: 1.08,
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontSize: 21,
                  fontWeight: 500,
                  letterSpacing: "-0.012em",
                  color: ink.secondary,
                  marginTop: 12,
                  lineHeight: 1.34,
                }}
              >
                {s.body}
              </div>
            </div>
          </Rise>
        ))}
      </div>

      <div style={{ marginTop: 28 }}>
        <Rise delay={1.5} y={10}>
          <ProductScreenshotFrame
            label="Carte interactive · Économie mondiale"
            caption={S3_JOURNEY.demoNote}
            height={228}
          />
        </Rise>
      </div>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   07 — TROIS PROFONDEURS

   La proposition de valeur centrale, remontée de la slide 23 de la V2. Un
   exemple tenu de bout en bout — la dette française — vaut mieux qu'une
   explication abstraite du format.
   ═══════════════════════════════════════════════════════════════════════════ */

function DepthSlide() {
  const ink = useInk();
  const accent = useAccent();

  return (
    <SlideBody>
      <Eyebrow>{S3_DEPTH.eyebrow}</Eyebrow>

      <div style={{ marginTop: 22, display: "flex", alignItems: "baseline", gap: 42, flexWrap: "wrap" }}>
        <div>
          {S3_DEPTH.title.map((line, i) => (
            <Rise key={line} delay={0.08 + i * 0.16} y={20}>
              <p
                className="t-h2"
                style={{ color: i === 1 ? ink.primary : ink.secondary, letterSpacing: "-0.035em" }}
              >
                {line}
              </p>
            </Rise>
          ))}
        </div>
        <Rise delay={0.5} y={12}>
          <p
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontStyle: "italic",
              fontSize: 29,
              color: accent,
            }}
          >
            {S3_DEPTH.example}
          </p>
        </Rise>
      </div>

      <div
        style={{
          marginTop: 40,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 700px",
          gap: 40,
          alignItems: "start",
          flex: 1,
          minHeight: 0,
        }}
      >
        {S3_DEPTH.layers.map((l, i) => (
          <Rise key={l.id} delay={0.75 + i * 0.22} y={18}>
            <div style={{ borderTop: `3px solid ${accent}`, paddingTop: 22 }}>
              <div
                style={{
                  fontSize: 34,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: accent,
                }}
              >
                {l.time}
              </div>
              <div
                style={{
                  fontSize: 25,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: ink.primary,
                  marginTop: 4,
                }}
              >
                {l.role}
              </div>
              <div style={{ marginTop: 20, display: "grid", gap: 10 }}>
                {l.items.map((it) => (
                  <div
                    key={it}
                    style={{ fontSize: 22, fontWeight: 500, color: ink.secondary, letterSpacing: "-0.012em" }}
                  >
                    {it}
                  </div>
                ))}
              </div>
            </div>
          </Rise>
        ))}

        <Rise delay={1.5} y={16}>
          <ProductScreenshotFrame
            label={S3_DEPTH.screenshot.label}
            caption={S3_DEPTH.screenshot.ratio}
            height={392}
          />
        </Rise>
      </div>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   08 — LES SÉRIES

   Ne pas cataloguer les indicateurs : montrer la mécanique. C'est la
   répétabilité du format qui fait le média, et la profondeur temporelle qui le
   distingue d'un tableau de bord.
   ═══════════════════════════════════════════════════════════════════════════ */

function SeriesSlide() {
  const ink = useInk();
  const accent = useAccent();

  return (
    <SlideBody>
      <Eyebrow>{S3_SERIES.eyebrow}</Eyebrow>

      <div style={{ marginTop: 22, maxWidth: 1200 }}>
        {S3_SERIES.title.map((line, i) => (
          <Rise key={line} delay={0.08 + i * 0.16} y={20}>
            <p
              className="t-h2"
              style={{ color: i === 1 ? ink.primary : ink.secondary, letterSpacing: "-0.035em" }}
            >
              {line}
            </p>
          </Rise>
        ))}
      </div>

      <div
        style={{
          marginTop: 44,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 220px",
          gap: 34,
          alignItems: "center",
        }}
      >
        {S3_SERIES.formula.map((f, i) => (
          <Rise key={f.label} delay={0.45 + i * 0.2} y={18}>
            <div>
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 800,
                  letterSpacing: "-0.032em",
                  color: ink.primary,
                }}
              >
                {f.label}
              </div>
              <div
                style={{
                  fontSize: 21,
                  fontWeight: 500,
                  color: ink.secondary,
                  marginTop: 8,
                  letterSpacing: "-0.012em",
                }}
              >
                {f.detail}
              </div>
            </div>
          </Rise>
        ))}

        <Rise delay={1.1} y={0}>
          <div
            style={{
              borderLeft: `3px solid ${accent}`,
              paddingLeft: 26,
              fontSize: 36,
              fontWeight: 800,
              letterSpacing: "-0.032em",
              color: accent,
              lineHeight: 1.06,
            }}
          >
            {S3_SERIES.result}
          </div>
        </Rise>
      </div>

      <div style={{ marginTop: 52 }}>
        <SeriesTimeline
          from={S3_SERIES.timeline.from}
          to={S3_SERIES.timeline.to}
          live={S3_SERIES.timeline.live}
          startDelay={1.3}
        />
      </div>

      <div style={{ marginTop: 44, display: "flex", gap: 14, flexWrap: "wrap" }}>
        {S3_SERIES.indicators.map((ind, i) => (
          <Rise key={ind} delay={2.0 + i * 0.06} y={10}>
            <span
              style={{
                display: "inline-block",
                padding: "11px 22px",
                borderRadius: 100,
                border: `1px solid ${ink.rule}`,
                color: ink.secondary,
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              {ind}
            </span>
          </Rise>
        ))}
      </div>

      <Rise delay={2.6} y={8}>
        <p style={{ marginTop: 22, fontSize: 18, color: ink.faint, fontStyle: "italic" }}>
          {S3_SERIES.note}
        </p>
      </Rise>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   11 — LE POSITIONNEMENT

   Quatre familles, chacune bonne dans son métier. La place n'est pas « mieux
   que » : elle est à l'intersection, et l'intersection se dessine.
   ═══════════════════════════════════════════════════════════════════════════ */

function PositioningSlide() {
  const ink = useInk();
  const accent = useAccent();

  return (
    <SlideBody>
      <Eyebrow>{S3_POSITIONING.eyebrow}</Eyebrow>

      <div style={{ marginTop: 22, maxWidth: 1180 }}>
        {S3_POSITIONING.title.map((line, i) => (
          <Rise key={line} delay={0.08 + i * 0.16} y={20}>
            <p
              className="t-h2"
              style={{ color: i === 1 ? ink.primary : ink.secondary, letterSpacing: "-0.035em" }}
            >
              {line}
            </p>
          </Rise>
        ))}
      </div>

      <div
        style={{
          marginTop: 30,
          display: "grid",
          gridTemplateColumns: "1fr 620px",
          gap: 70,
          alignItems: "center",
          flex: 1,
          minHeight: 0,
        }}
      >
        <div style={{ display: "grid", gap: 26 }}>
          {S3_POSITIONING.families.map((f, i) => (
            <Rise key={f.id} delay={0.45 + i * 0.15} y={16}>
              <div style={{ display: "flex", gap: 24, alignItems: "baseline" }}>
                <span
                  style={{
                    fontSize: 27,
                    fontWeight: 800,
                    letterSpacing: "-0.025em",
                    color: ink.primary,
                    minWidth: 372,
                  }}
                >
                  {f.label}
                </span>
                <span
                  style={{
                    fontSize: 22,
                    fontWeight: 500,
                    letterSpacing: "-0.012em",
                    color: ink.secondary,
                  }}
                >
                  {f.body}
                </span>
              </div>
            </Rise>
          ))}

          <Rise delay={1.5} y={14}>
            <div style={{ marginTop: 22, borderLeft: `3px solid ${accent}`, paddingLeft: 26, maxWidth: 700 }}>
              <p
                style={{
                  fontSize: 27,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: ink.primary,
                  lineHeight: 1.3,
                }}
              >
                {S3_POSITIONING.statement}
              </p>
            </div>
          </Rise>
        </div>

        <div style={{ display: "grid", placeItems: "center" }}>
          <Intersection axes={S3_POSITIONING.axes} center="TED" startDelay={0.9} />
        </div>
      </div>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   12 — LA BASCULE

   L'IA, ici, n'est qu'un canal de distribution. Ni agents, ni production : cela
   vient à l'acte V, et les mélanger était le principal défaut narratif de la V2.
   ═══════════════════════════════════════════════════════════════════════════ */

function ShiftSlide() {
  const ink = useInk();
  const accent = useAccent();

  return (
    <SlideBody center>
      <div style={{ width: "100%", maxWidth: 1400 }}>
        <Eyebrow>{S3_SHIFT.eyebrow}</Eyebrow>

        <div style={{ marginTop: 66, display: "grid", gap: 74 }}>
          <ShiftChain label={S3_SHIFT.before.label} chain={S3_SHIFT.before.chain} startDelay={0.25} />
          <ShiftChain
            label={S3_SHIFT.after.label}
            chain={S3_SHIFT.after.chain}
            startDelay={1.15}
            highlightLast
          />
        </div>

        <Rise delay={2.3} y={20}>
          <div style={{ marginTop: 78, borderLeft: `3px solid ${accent}`, paddingLeft: 30 }}>
            {S3_SHIFT.statement.map((line, i) => (
              <p
                key={line}
                className="t-h2"
                style={{
                  color: i === 1 ? ink.primary : ink.secondary,
                  letterSpacing: "-0.035em",
                }}
              >
                {line}
              </p>
            ))}
          </div>
        </Rise>
      </div>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   13 — DEVENIR UNE SOURCE

   Trois temps : la stratégie, ses conditions, sa limite. Le sujet « IA comme
   canal » s'arrête ici — deux slides au total, contre six en V2.
   ═══════════════════════════════════════════════════════════════════════════ */

function ChannelSlide() {
  const ink = useInk();
  const accent = useAccent();
  const step = useSlideStep();

  return (
    <SlideBody>
      <Eyebrow>{S3_CHANNEL.eyebrow}</Eyebrow>

      <div style={{ marginTop: 26, maxWidth: 1300 }}>
        {S3_CHANNEL.title.map((line, i) => (
          <Rise key={line} delay={0.08 + i * 0.18} y={22}>
            <p
              className="t-h1"
              style={{
                color: i === 1 ? ink.primary : ink.muted,
                letterSpacing: "-0.042em",
              }}
            >
              {line}
            </p>
          </Rise>
        ))}
      </div>

      <div
        style={{
          marginTop: 62,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 88,
          flex: 1,
          minHeight: 0,
          alignItems: "start",
        }}
      >
        <div style={{ opacity: step >= 1 ? 1 : 0, transition: "opacity 0.45s ease" }}>
          <div className="t-micro" style={{ color: accent, letterSpacing: "0.16em", marginBottom: 24 }}>
            {S3_CHANNEL.conditionsLabel}
          </div>
          <div style={{ display: "grid", gap: 13 }}>
            {S3_CHANNEL.conditions.map((c) => (
              <div
                key={c}
                style={{
                  fontSize: 26,
                  fontWeight: 600,
                  letterSpacing: "-0.018em",
                  color: ink.secondary,
                }}
              >
                {c}
              </div>
            ))}
          </div>
        </div>

        <div style={{ opacity: step >= 2 ? 1 : 0, transition: "opacity 0.45s ease" }}>
          <div className="t-micro" style={{ color: accent, letterSpacing: "0.16em", marginBottom: 24 }}>
            {S3_CHANNEL.moatLabel}
          </div>
          <div style={{ display: "grid", gap: 13 }}>
            {S3_CHANNEL.moat.map((m) => (
              <div
                key={m}
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  letterSpacing: "-0.018em",
                  color: ink.primary,
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ opacity: step >= 2 ? 1 : 0, transition: "opacity 0.6s ease 0.3s" }}>
        <div style={{ borderTop: `1px solid ${ink.rule}`, paddingTop: 34, marginTop: 20 }}>
          {S3_CHANNEL.statement.map((line, i) => (
            <p
              key={line}
              className="t-h2"
              style={{
                color: i === 1 ? accent : ink.secondary,
                letterSpacing: "-0.035em",
              }}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   19 — QUI FAIT QUOI

   La slide qui répond à l'objection « est-ce un média généré par IA ? ». Elle
   n'existait pas en V2, où la réponse était dispersée sur trois slides.
   ═══════════════════════════════════════════════════════════════════════════ */

function SplitSlide() {
  const ink = useInk();
  const accent = useAccent();

  return (
    <SlideBody>
      <Eyebrow>{S3_SPLIT.eyebrow}</Eyebrow>

      <div
        style={{
          marginTop: 34,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 46,
          flex: 1,
          minHeight: 0,
        }}
      >
        <SplitPanel
          label={S3_SPLIT.agents.label}
          role={S3_SPLIT.agents.role}
          items={S3_SPLIT.agents.items}
          startDelay={0.15}
        />
        <SplitPanel
          label={S3_SPLIT.human.label}
          role={S3_SPLIT.human.role}
          items={S3_SPLIT.human.items}
          startDelay={0.55}
          strong
        />
      </div>

      <Rise delay={1.5} y={16}>
        <div
          style={{
            marginTop: 38,
            display: "flex",
            alignItems: "baseline",
            gap: 44,
            flexWrap: "wrap",
          }}
        >
          <div style={{ borderLeft: `3px solid ${accent}`, paddingLeft: 26 }}>
            {S3_SPLIT.statement.map((line, i) => (
              <span
                key={line}
                className="t-h3"
                style={{
                  color: i === 1 ? ink.primary : ink.secondary,
                  letterSpacing: "-0.028em",
                  marginRight: 16,
                  fontWeight: i === 1 ? 800 : 600,
                }}
              >
                {line}
              </span>
            ))}
          </div>
          <p style={{ fontSize: 19, color: ink.faint, maxWidth: 720, lineHeight: 1.4 }}>
            {S3_SPLIT.note}
          </p>
        </div>
      </Rise>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   20 — L'ÉCONOMIE DE L'AUTOMATISATION

   La démonstration qui manquait. Aucun chiffre n'est écrit ici : ils n'ont pas
   été mesurés, et un projet dont la promesse est la traçabilité ne peut pas
   afficher des coûts qu'il n'a pas relevés. Les emplacements sont donc visibles
   — c'est défendable devant un jury, un chiffre inventé ne l'est pas.
   ═══════════════════════════════════════════════════════════════════════════ */

function EconomicsSlide() {
  const ink = useInk();
  const accent = useAccent();

  const Column = ({
    block,
    delay,
    strong,
  }: {
    block: typeof S3_ECONOMICS.classic | typeof S3_ECONOMICS.pipeline;
    delay: number;
    strong?: boolean;
  }) => (
    <div
      style={{
        border: `1px solid ${strong ? accent : ink.rule}`,
        borderRadius: 4,
        padding: "30px 32px 34px",
        height: "100%",
      }}
    >
      <Rise delay={delay} y={12}>
        <div
          style={{
            fontSize: 29,
            fontWeight: 800,
            letterSpacing: "-0.026em",
            color: strong ? accent : ink.primary,
          }}
        >
          {block.label}
        </div>
      </Rise>
      <div style={{ marginTop: 20, display: "grid", gap: 9 }}>
        {block.steps.map((s, i) => (
          <Rise key={s} delay={delay + 0.15 + i * 0.08} y={8}>
            <div style={{ fontSize: 21, fontWeight: 500, color: ink.secondary, letterSpacing: "-0.012em" }}>
              {s}
            </div>
          </Rise>
        ))}
      </div>
      <div style={{ marginTop: 28, display: "flex", gap: 42 }}>
        <Rise delay={delay + 0.5} y={10}>
          <PendingValue label={block.time.label} unit={block.time.unit} />
        </Rise>
        <Rise delay={delay + 0.6} y={10}>
          <PendingValue label={block.cost.label} unit={block.cost.unit} />
        </Rise>
      </div>
    </div>
  );

  return (
    <SlideBody>
      <Eyebrow>{S3_ECONOMICS.eyebrow}</Eyebrow>

      <div style={{ marginTop: 20, maxWidth: 1240 }}>
        {S3_ECONOMICS.title.map((line, i) => (
          <Rise key={line} delay={0.08 + i * 0.16} y={20}>
            <p
              className="t-h2"
              style={{ color: i === 1 ? ink.primary : ink.secondary, letterSpacing: "-0.035em" }}
            >
              {line}
            </p>
          </Rise>
        ))}
      </div>

      <div
        style={{
          marginTop: 36,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 760px",
          gap: 34,
          flex: 1,
          minHeight: 0,
          alignItems: "start",
        }}
      >
        <Column block={S3_ECONOMICS.classic} delay={0.4} />
        <Column block={S3_ECONOMICS.pipeline} delay={0.7} strong />

        <div>
          <div className="t-micro" style={{ color: accent, letterSpacing: "0.16em", marginBottom: 14 }}>
            {S3_ECONOMICS.curve.label}
          </div>
          <MarginalCurve
            classicLabel={S3_ECONOMICS.curve.classicLabel}
            pipelineLabel={S3_ECONOMICS.curve.pipelineLabel}
            xLabel={S3_ECONOMICS.curve.x}
            yLabel={S3_ECONOMICS.curve.y}
            axisNote={S3_ECONOMICS.curve.axisNote}
            startDelay={1.1}
          />
        </div>
      </div>

      <Rise delay={2.2} y={14}>
        <div
          style={{
            marginTop: 26,
            display: "flex",
            alignItems: "baseline",
            gap: 42,
            flexWrap: "wrap",
            borderTop: `1px solid ${ink.rule}`,
            paddingTop: 26,
          }}
        >
          <p
            className="t-h3"
            style={{ color: ink.primary, letterSpacing: "-0.028em", maxWidth: 900, fontWeight: 700 }}
          >
            {S3_ECONOMICS.statement}
          </p>
          <p style={{ fontSize: 18, color: ink.faint, maxWidth: 680, lineHeight: 1.4, fontStyle: "italic" }}>
            {S3_ECONOMICS.measureNote}
          </p>
        </div>
      </Rise>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   21 — AUTOMATISÉ, MAIS TRAÇABLE

   La slide juridique de la V2 faisait un cours de droit sur une colonne pleine.
   Quatre garanties, quatre coches, le cadre en petit, et on avance. Le détail
   reste accessible en annexe.
   ═══════════════════════════════════════════════════════════════════════════ */

function TraceSlide() {
  const ink = useInk();
  const accent = useAccent();

  return (
    <SlideBody>
      <Eyebrow>{S3_TRACE.eyebrow}</Eyebrow>

      <div style={{ marginTop: 24 }}>
        {S3_TRACE.title.map((line, i) => (
          <Rise key={line} delay={0.08 + i * 0.18} y={22}>
            <p
              className="t-h1"
              style={{
                color: i === 1 ? ink.primary : ink.muted,
                letterSpacing: "-0.042em",
              }}
            >
              {line}
            </p>
          </Rise>
        ))}
      </div>

      <div
        style={{
          marginTop: 62,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 40,
          flex: 1,
          minHeight: 0,
          alignItems: "start",
        }}
      >
        {S3_TRACE.guarantees.map((g, i) => (
          <Rise key={g.label} delay={0.5 + i * 0.16} y={18}>
            <div>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  border: `2px solid ${accent}`,
                  display: "grid",
                  placeItems: "center",
                  color: accent,
                  fontSize: 22,
                  fontWeight: 800,
                  marginBottom: 22,
                }}
              >
                ✓
              </div>
              <div
                style={{
                  fontSize: 29,
                  fontWeight: 800,
                  letterSpacing: "-0.028em",
                  color: ink.primary,
                  lineHeight: 1.1,
                }}
              >
                {g.label}
              </div>
              <div
                style={{
                  fontSize: 21,
                  fontWeight: 500,
                  letterSpacing: "-0.012em",
                  color: ink.secondary,
                  marginTop: 12,
                  lineHeight: 1.34,
                }}
              >
                {g.body}
              </div>
            </div>
          </Rise>
        ))}
      </div>

      <Rise delay={1.35} y={14}>
        <div
          style={{
            borderTop: `1px solid ${ink.rule}`,
            paddingTop: 26,
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 44,
            flexWrap: "wrap",
          }}
        >
          <p
            className="t-h3"
            style={{ color: ink.primary, letterSpacing: "-0.028em", fontWeight: 700 }}
          >
            {S3_TRACE.statement}
          </p>
          <div style={{ display: "flex", gap: 30, flexWrap: "wrap" }}>
            {S3_TRACE.frame.map((f) => (
              <span key={f} style={{ fontSize: 19, fontWeight: 600, color: ink.faint }}>
                {f}
              </span>
            ))}
          </div>
        </div>
      </Rise>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LE REGISTRE
   ═══════════════════════════════════════════════════════════════════════════ */

export const S3_VIEWS: Record<string, ComponentType> = {
  /* Acte I — le problème */
  cover: CoverSlide,
  paradoxe: ParadoxSlide,
  travail: ReaderWorkSlide,
  manque: MissingSlide,
  reponse: AnswerSlide,

  /* Acte II — le produit */
  parcours: JourneySlide,
  lecture: DepthSlide,
  series: SeriesSlide,
  promesse: EditorialSlideRef,

  /* Acte III — pourquoi il y a une place */
  marche: MarketSlide,
  positionnement: PositioningSlide,
  bascule: ShiftSlide,
  canal: ChannelSlide,

  /* Acte IV — le modèle économique */
  modele: RevenueSlide,
  trajectoire: FinanceSlide,

  /* Acte V — la fabrication */
  pivot: PivotSlide,
  recoupement: CrossCheckSlide,
  pipeline: PipelineSlideRef,
  partage: SplitSlide,
  economie: EconomicsSlide,
  tracabilite: TraceSlide,

  /* Acte VI — preuve d'exécution */
  etat: StatusSlide,
  derriere: TeamSlideRef,

  /* Acte VII — passage à l'échelle */
  financement: UnlockSlide,
  chaine: RoadmapSlide,
  conclusion: ConclusionSlide,
};
