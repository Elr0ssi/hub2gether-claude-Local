"use client";

/* ═══════════════════════════════════════════════════════════════════════════
   SOUTENANCE 3 — LES VUES

   Vingt-six slides, sept actes, une seule direction. Ce fichier ne réécrit que
   ce que la V4 raconte autrement ; tout le reste est importé de la V2 et rendu
   tel quel. Douze slides sont neuves ou refondues, quatorze sont reprises.

   RÈGLE : rien de ce qui est importé de `soutenance2` n'est modifié ici. La V2
   doit continuer de se jouer exactement comme aujourd'hui, et c'est vérifiable
   en ouvrant les deux onglets côte à côte.
   ═══════════════════════════════════════════════════════════════════════════ */

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useMemo, useState, type ComponentType } from "react";
import { countryFr } from "@/data/countryNamesFr";
import { getYearData } from "@/data/economy/economy";
import {
  EASE as DECK_EASE,
  Eyebrow,
  Fade,
  Rise,
  Rule,
  SlideBody,
  useInk,
} from "@/components/presentation/primitives";
import {
  BenchmarkBars,
  Sparkline,
  TrajectoryChart,
} from "@/components/presentation/visuals/charts";
import {
  DrawPath,
  SourceFan,
  ProductScreenshotFrame,
  useAccent,
} from "@/components/soutenance2/visuals";
import {
  AcquisitionSlide,
  CompetitionSlide,
  ConclusionSlide,
  CrossCheckSlide,
  EditorialSlideRef,
  FinanceSlide,
  HistorySlideRef,
  PartnershipsSlide,
  PipelineSlideRef,
  PivotSlide,
  PlayersSlide,
  PublicationsSlide,
  RevenueSlide,
  RoadmapSlide,
  StatusSlide,
  TeamSlideRef,
  UnlockSlide,
} from "./reused";
import {
  AttentionCloud,
  Intersection,
  MarginalCurve,
  ShiftChain,
  useEmphasis,
} from "./visuals";
import { GEO } from "@/data/soutenance2/soutenance2Data";
import {
  S4_SLIDES,
  S4_ANSWER,
  S4_AUDIENCE,
  S4_BENCHMARK,
  S4_PARTNER_TARGET,
  S4_TRAJECTORY,
  S4_ATTENTION,
  S4_CHANNEL,
  S4_COVER,
  S4_DEPTH,
  S4_ECONOMICS,
  S4_PARADOX,
  S4_PLAYERS,
  S4_POSITIONING,
  S4_READER_WORK,
  S4_SHIFT,
  S4_SPLIT,
  S4_TRACE,
} from "@/data/soutenance4/soutenance4Data";
import { useSlideStep } from "@/components/soutenance2/useDeck";

/**
 * Le § d'une slide, lu sur sa place dans le deck. Trois slides reprises de la
 * V2 l'affichent ; écrit à la main, il se décalait au premier déplacement.
 */
const sectionNo = (id: string): string => {
  const i = S4_SLIDES.findIndex((slide) => slide.id === id);
  return i <= 0 ? "§" : `§ ${String(i).padStart(2, "0")}`;
};

const PresentationGlobe = dynamic(
  () => import("@/components/presentation/visuals/PresentationGlobe"),
  { ssr: false, loading: () => null }
);

/* Le globe de la page économie, celui qui porte réellement la base. WebGL et
   le fond de carte ne sont chargés que lorsque la slide arrive. */
const EconomyGlobe = dynamic(
  () => import("@/components/map/EconomyGlobe").then((m) => m.EconomyGlobe),
  { ssr: false, loading: () => null }
);

/** Milliards, à l'arrondi de lecture : trois chiffres significatifs suffisent. */
function fmtMds(v: number): string {
  const abs = Math.abs(v);
  const d = abs >= 100 ? 0 : abs >= 10 ? 1 : 2;
  return v.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });
}

/* ═══════════════════════════════════════════════════════════════════════════
   01 — COUVERTURE

   La V2 posait le contexte et le nom. La V4 ajoute la signature, parce que
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
            {S4_COVER.context}
          </p>
        </Rise>

        <Rise delay={0.15} y={26}>
          <h1 className="t-display" style={{ color: ink.primary, letterSpacing: "-0.05em", marginTop: 26 }}>
            The Essential
            <br />
            <span style={{ color: accent }}>Data</span>
          </h1>
        </Rise>

        {/* La signature ne figure plus ici : elle se dit à l'oral et revient
            à la dernière slide, où elle referme le récit. Annoncée deux fois
            en trente minutes, elle n'en refermait aucun. */}
        <div style={{ marginTop: 44, maxWidth: 640 }}>
          <Rule delay={0.5} accentWidth={120} />
        </div>
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
        <Eyebrow>{S4_PARADOX.eyebrow}</Eyebrow>

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
              {S4_PARADOX.first}
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
                  {S4_PARADOX.hinge}
                </p>
              </Fade>
            )}
          </div>

          {step >= 2 && (
            <Rise delay={0.05} y={26}>
              <p className="t-h1" style={{ color: ink.primary, letterSpacing: "-0.04em" }}>
                {S4_PARADOX.second}
              </p>
            </Rise>
          )}
        </div>
      </div>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   03 — CE QUE L'ON VOIT VRAIMENT

   Une prise de recul avant le problème de recoupement. Quatre temps :
     0 · la question, seule, et le silence qu'elle doit produire
     1 · les trois constats sur la Chine
     2 · ce qui occupe la place, mot après mot
     3 · la phrase qui referme

   Rien du produit ici. La slide installe une idée — l'information disponible
   et l'information qui nous parvient ne sont pas la même chose — et laisse la
   suivante montrer ce que le lecteur doit faire lui-même.
   ═══════════════════════════════════════════════════════════════════════════ */

function AttentionSlide() {
  const ink = useInk();
  const accent = useAccent();
  const step = useSlideStep();

  return (
    <SlideBody>
      <Eyebrow>{S4_ATTENTION.eyebrow}</Eyebrow>

      {/* Au dernier temps, tout ce qui précède s'efface presque entièrement :
          la question a été posée, le nuage a fait son effet, et les laisser à
          pleine encre sous la conclusion rendait la slide illisible. */}
      <div
        style={{
          marginTop: 34,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: 72,
          flex: 1,
          minHeight: 0,
          alignItems: "center",
          opacity: step >= 3 ? 0.14 : 1,
          transition: "opacity 0.7s ease",
        }}
      >
        {/* La colonne qui parle */}
        <div>
          <Rise delay={0.1} y={24}>
            <p
              className="t-h1"
              style={{
                color: step >= 1 ? ink.muted : ink.primary,
                letterSpacing: "-0.042em",
                transition: "color 0.5s ease",
              }}
            >
              {S4_ATTENTION.question}
            </p>
          </Rise>

          <div
            style={{
              marginTop: 44,
              opacity: step >= 1 ? 1 : 0,
              transform: step >= 1 ? "none" : "translateY(16px)",
              transition: "opacity 0.55s ease, transform 0.55s ease",
            }}
          >
            <div style={{ height: 3, background: accent, width: 108 }} />
            <div style={{ marginTop: 26, display: "grid", gap: 14 }}>
              {S4_ATTENTION.facts.map((f, i) => (
                <p
                  key={f}
                  style={{
                    fontSize: 31,
                    fontWeight: i === 2 ? 800 : 500,
                    letterSpacing: "-0.025em",
                    color: i === 2 ? ink.primary : ink.secondary,
                    lineHeight: 1.24,
                  }}
                >
                  {f}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* La colonne qui se remplit */}
        <div style={{ position: "relative", height: "100%", minHeight: 0 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: step >= 2 ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          >
            <AttentionCloud words={S4_ATTENTION.cloud} visible={step >= 2} startDelay={0.1} />
          </div>
          <div
            className="t-micro"
            style={{
              position: "absolute",
              right: 0,
              bottom: -10,
              color: ink.faint,
              letterSpacing: "0.16em",
              opacity: step >= 2 ? 1 : 0,
              transition: "opacity 0.5s ease 0.9s",
            }}
          >
            {S4_ATTENTION.cloudLabel}
          </div>
        </div>
      </div>

      {/* Ce que tout cela voulait dire */}
      <div
        style={{
          borderTop: `1px solid ${ink.rule}`,
          paddingTop: 30,
          marginTop: 12,
          opacity: step >= 3 ? 1 : 0,
          transform: step >= 3 ? "none" : "translateY(14px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        {S4_ATTENTION.statement.map((line, i) => (
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
      <Eyebrow>{S4_READER_WORK.eyebrow}</Eyebrow>

      <div style={{ marginTop: 26, maxWidth: 1240 }}>
        {S4_READER_WORK.title.map((line, i) => (
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
              {S4_READER_WORK.statement.map((line, i) => (
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
            labels={S4_READER_WORK.sources}
            center={S4_READER_WORK.center}
            centerSize={26}
            labelSize={19}
            maxWidth={620}
            startDelay={0.35}
          />
        </div>

        <div>
          <Rise delay={0.9} y={12}>
            <div className="t-micro" style={{ color: accent, letterSpacing: "0.16em", marginBottom: 24 }}>
              Ce que cela lui coûte
            </div>
          </Rise>
          {/* Deux mots, très grands. La chaîne de six gestes décrivait une
              méthode ; ces deux-là nomment le prix, et c'est le prix qui fait
              le problème. */}
          <div style={{ display: "grid", gap: 18 }}>
            {S4_READER_WORK.operations.map((mot, i) => (
              <Rise key={mot} delay={1.0 + i * 0.2} y={16}>
                <div
                  style={{
                    fontSize: 46,
                    fontWeight: 800,
                    letterSpacing: "-0.038em",
                    color: ink.primary,
                    lineHeight: 1.05,
                  }}
                >
                  {mot}
                </div>
              </Rise>
            ))}
          </div>
        </div>
      </div>
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
  const [survole, setSurvole] = useState<string | null>(null);

  /* Le globe n'est pas une illustration : c'est celui de /map/economy, avec la
     base derrière lui. Survoler un pays ouvre sa fiche en bas à gauche, et
     c'est la démonstration la plus courte du deck — on ne dit pas que le
     produit existe, on le fait tourner devant le jury.

     Le titre est descendu d'un cran : en t-h1 il mangeait la moitié de la
     scène et laissait le globe à l'étroit. */
  const annee = useMemo(() => getYearData(S4_ANSWER.globe.year), []);
  const fiche = survole && annee ? annee.countries[survole] : undefined;

  return (
    <SlideBody>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 880px) minmax(0, 1fr)",
          gap: 48,
          alignItems: "center",
          flex: 1,
          minHeight: 0,
        }}
      >
        <div>
          <Eyebrow>{S4_ANSWER.eyebrow}</Eyebrow>

          {/* Un seul titre, dans la typographie et l'encre des autres slides.
              Le nom en vert au-dessus d'une phrase en noir faisait deux titres
              là où il n'en faut qu'un, et le vert n'est pas la couleur des
              titres du deck. La phrase se dit à l'oral. */}
          <Rise delay={0.12} y={22}>
            <p className="t-h1" style={{ color: ink.primary, letterSpacing: "-0.042em", marginTop: 24 }}>
              {S4_ANSWER.wordmark}
            </p>
          </Rise>

          <div style={{ marginTop: 46, display: "flex", gap: 16, flexWrap: "wrap" }}>
            {S4_ANSWER.pillars.map((p, i) => (
              <Rise key={p} delay={0.85 + i * 0.13} y={14}>
                <span
                  style={{
                    display: "inline-block",
                    padding: "13px 26px",
                    borderRadius: 100,
                    border: `2px solid ${ink.rule}`,
                    color: ink.primary,
                    fontSize: 23,
                    fontWeight: 700,
                    letterSpacing: "-0.018em",
                  }}
                >
                  {p}
                </span>
              </Rise>
            ))}
          </div>

          {/* La fiche du pays survolé.

              Elle rend TOUJOURS la même structure — un titre, quatre mesures,
              une ligne de source — et remplit avec des tirets quand il n'y a
              rien à montrer. Une version précédente n'affichait qu'une phrase
              d'invite, plus courte que la fiche pleine : la boîte changeait de
              hauteur à chaque entrée et sortie du curseur, et toute la colonne
              sautait avec elle. Une hauteur fixe en dur aurait tenu jusqu'au
              premier changement de texte ; la même structure tient toujours. */}
          <Rise delay={1.4} y={16}>
            <div
              style={{
                marginTop: 46,
                border: `1px solid ${fiche ? accent : ink.rule}`,
                borderRadius: 4,
                padding: "24px 28px",
                transition: "border-color 0.25s ease",
              }}
            >
              <div
                style={{
                  fontSize: 30,
                  fontWeight: fiche ? 800 : 500,
                  letterSpacing: "-0.028em",
                  color: fiche ? ink.primary : ink.faint,
                  lineHeight: 1.2,
                }}
              >
                {fiche ? countryFr(survole ?? "") : S4_ANSWER.globe.empty}
              </div>
              <div
                style={{
                  marginTop: 18,
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: "14px 34px",
                }}
              >
                {[
                  ["PIB", fiche?.gdp === undefined ? "—" : `${fmtMds(fiche.gdp)} Mds €`],
                  ["PIB / hab.", fiche?.gdp_per_capita === undefined ? "—" : `${Math.round(fiche.gdp_per_capita).toLocaleString("fr-FR")} €`],
                  ["Balance", fiche?.trade_balance === undefined ? "—" : `${fiche.trade_balance > 0 ? "+" : ""}${fmtMds(fiche.trade_balance)} Mds €`],
                  ["Inflation", fiche?.inflation === undefined ? "—" : `${fiche.inflation.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %`],
                ].map(([label, valeur]) => (
                  <div key={label} style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                    <span style={{ fontSize: 18, color: ink.muted, minWidth: 108 }}>{label}</span>
                    <span
                      style={{
                        fontSize: 24,
                        fontWeight: 800,
                        color: fiche ? ink.primary : ink.faint,
                        transition: "color 0.25s ease",
                      }}
                    >
                      {valeur}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 17, color: ink.faint, marginTop: 16 }}>
                {S4_ANSWER.globe.year} · Banque mondiale (WDI)
              </div>
            </div>
          </Rise>
        </div>

        <div style={{ position: "relative", height: "100%", minHeight: 0 }}>
          <Fade delay={0.5} duration={1.2}>
            <div style={{ position: "absolute", inset: 0 }}>
              {annee && (
                <EconomyGlobe
                  economyYear={annee}
                  metric="gdp"
                  selectedCountry={survole}
                  onCountryClick={() => {}}
                  onCountryHover={setSurvole}
                />
              )}
            </div>
          </Fade>
          <Rise delay={1.6} y={10}>
            <div
              style={{
                position: "absolute",
                left: 0,
                bottom: 0,
                padding: "10px 20px",
                borderRadius: 100,
                border: `1px solid ${ink.rule}`,
                background: ink.tone === "dark" ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.86)",
                color: ink.secondary,
                fontSize: 19,
                fontWeight: 600,
                pointerEvents: "none",
              }}
            >
              {S4_ANSWER.globe.hint}
            </div>
          </Rise>
        </div>
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

  /* La mise en page de la V2 est reprise telle quelle : la capture d'article à
     gauche, les trois profondeurs à droite, chacune sous son filet. Elle
     expliquait mieux le format que la version en quatre colonnes qui l'avait
     remplacée — et elle change franchement de registre par rapport à la slide
     précédente, ce qui casse la monotonie de l'acte produit.

     Ce que la V4 ajoute : l'exemple tenu de bout en bout, et le rôle de chaque
     profondeur nommé à côté de sa durée. */
  return (
    <SlideBody>
      <Eyebrow>{S4_DEPTH.eyebrow}</Eyebrow>

      <div style={{ marginTop: 24, display: "flex", alignItems: "baseline", gap: 38, flexWrap: "wrap" }}>
        {S4_DEPTH.title.map((line, i) => (
          <Rise key={line} delay={0.1 + i * 0.14} y={18}>
            <div
              className="t-h2"
              style={{
                color: i === 1 ? ink.primary : ink.muted,
                letterSpacing: "-0.035em",
                display: "inline",
              }}
            >
              {line}
            </div>
          </Rise>
        ))}
        <Rise delay={0.42} y={12}>
          <p
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontStyle: "italic",
              fontSize: 28,
              color: accent,
            }}
          >
            {S4_DEPTH.example}
          </p>
        </Rise>
      </div>

      <div
        style={{
          marginTop: 40,
          display: "grid",
          gridTemplateColumns: "1fr 520px",
          gap: 74,
          alignItems: "center",
          flex: 1,
          minHeight: 0,
        }}
      >
        <ProductScreenshotFrame
          label={S4_DEPTH.screenshot.label}
          caption={S4_DEPTH.screenshot.ratio}
          url="theessentialdata.com/articles/…"
          src="/soutenance/article-format.png"
          height={540}
          delay={0.35}
        />

        <div style={{ display: "grid", gap: 34 }}>
          {S4_DEPTH.layers.map((l, i) => (
            <Rise key={l.id} delay={0.6 + i * 0.18} y={16}>
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 12 }}>
                  <span
                    className="t-micro"
                    style={{ color: accent, letterSpacing: "0.14em" }}
                  >
                    {l.time}
                  </span>
                  <span style={{ fontSize: 24, fontWeight: 800, color: ink.primary, letterSpacing: "-0.02em" }}>
                    {l.role}
                  </span>
                </div>
                <Rule delay={0.65 + i * 0.18} />
                <div style={{ fontSize: 24, color: ink.secondary, marginTop: 14, letterSpacing: "-0.014em" }}>
                  {l.items.join(" · ")}
                </div>
              </div>
            </Rise>
          ))}
        </div>
      </div>
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
      <Eyebrow>{S4_POSITIONING.eyebrow}</Eyebrow>

      <div style={{ marginTop: 22, maxWidth: 1180 }}>
        {S4_POSITIONING.title.map((line, i) => (
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
          {S4_POSITIONING.families.map((f, i) => (
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
                {S4_POSITIONING.statement}
              </p>
            </div>
          </Rise>
        </div>

        <div style={{ display: "grid", placeItems: "center" }}>
          <Intersection axes={S4_POSITIONING.axes} center="TED" startDelay={0.9} />
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
  const step = useSlideStep();

  /* Trois temps, et le troisième est celui qui compte. Deux chaînes posées
     côte à côte décrivaient une perte : le média disparaissait du bout de la
     ligne et la slide s'arrêtait là. La boucle refermée — la réponse cite sa
     source, et c'est par là que le lecteur revient — décrit un canal. */
  return (
    <SlideBody>
      <Eyebrow>{S4_SHIFT.eyebrow}</Eyebrow>

      <div
        style={{
          marginTop: 46,
          display: "grid",
          gap: 52,
          flex: 1,
          minHeight: 0,
          alignContent: "center",
        }}
      >
        {S4_SHIFT.beats.map((beat, i) => (
          <div
            key={beat.id}
            style={{
              opacity: step >= i ? 1 : 0,
              transform: step >= i ? "none" : "translateY(18px)",
              transition: "opacity 0.55s ease, transform 0.55s ease",
            }}
          >
            {step >= i && (
              <ShiftChain
                label={beat.label}
                chain={beat.chain}
                caption={beat.caption}
                startDelay={0.1}
                highlightLast={i > 0}
              />
            )}
          </div>
        ))}
      </div>

      <div
        style={{
          opacity: step >= 2 ? 1 : 0,
          transition: "opacity 0.6s ease 0.5s",
          borderTop: `1px solid ${ink.rule}`,
          paddingTop: 32,
        }}
      >
        {S4_SHIFT.statement.map((line, i) => (
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
      <Eyebrow>{S4_CHANNEL.eyebrow}</Eyebrow>

      <div style={{ marginTop: 26, maxWidth: 1300 }}>
        {S4_CHANNEL.title.map((line, i) => (
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
            {S4_CHANNEL.conditionsLabel}
          </div>
          <div style={{ display: "grid", gap: 13 }}>
            {S4_CHANNEL.conditions.map((c) => (
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

        {/* Le tableau SEO / GEO, repris de la slide séparée « Comment être cité
            par l'IA » qui est supprimée : elle disait la même chose, une slide
            plus loin, et le cadre vert qu'elle portait répétait ce qui est déjà
            dit sur le positionnement. */}
        <div style={{ opacity: step >= 2 ? 1 : 0, transition: "opacity 0.45s ease" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
              gap: 26,
              paddingBottom: 12,
              borderBottom: `1px solid ${ink.rule}`,
            }}
          >
            {GEO.contrastHeads.map((h, i) => (
              <p
                key={h}
                className="t-micro"
                style={{ color: i === 0 ? ink.faint : accent, letterSpacing: "0.12em" }}
              >
                {h}
              </p>
            ))}
          </div>
          {GEO.contrast.map((row) => (
            <div
              key={row.seo}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
                gap: 26,
                padding: "15px 0",
                borderBottom: `1px solid ${ink.rule}`,
              }}
            >
              <p className="t-body" style={{ color: ink.faint }}>{row.seo}</p>
              <p className="t-body" style={{ color: ink.primary, fontWeight: 700 }}>{row.geo}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ opacity: step >= 2 ? 1 : 0, transition: "opacity 0.6s ease 0.3s" }}>
        <div style={{ borderTop: `1px solid ${ink.rule}`, paddingTop: 34, marginTop: 20 }}>
          {S4_CHANNEL.statement.map((line, i) => (
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
  const emphase = useEmphasis();

  /* Deux gros rectangles côte à côte disaient « voici deux listes », ce qui
     est vrai et sans intérêt. Ce qu'il faut montrer, c'est une chaîne unique
     dont chaque maillon revient à l'un ou à l'autre : la main humaine n'est
     pas dans une autre boîte, elle est sur la ligne, à quatre endroits précis.

     Les maillons humains sont posés au-dessus de l'axe, les maillons agents en
     dessous. Le partage se lit d'un coup d'œil, sans lire un seul mot. */
  const AXE = 150;
  const PAS = 160;
  const largeur = S4_SPLIT.chain.length * PAS;

  return (
    <SlideBody>
      <Eyebrow>{S4_SPLIT.eyebrow}</Eyebrow>

      <div
        style={{
          marginTop: 30,
          display: "flex",
          alignItems: "baseline",
          gap: 76,
          flexWrap: "wrap",
        }}
      >
        {[S4_SPLIT.human, S4_SPLIT.agents].map((c, i) => (
          <Rise key={c.label} delay={0.08 + i * 0.16} y={16}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 3,
                  border: `2px solid ${i === 0 ? emphase.border : ink.rule}`,
                  background: i === 0 ? emphase.background : "transparent",
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 27, fontWeight: 600, color: ink.muted }}>{c.label}</span>
              <span
                style={{
                  fontSize: 54,
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  color: i === 0 ? accent : ink.primary,
                  lineHeight: 1,
                }}
              >
                {c.role}
              </span>
            </div>
          </Rise>
        ))}
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "grid",
          placeItems: "center",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative", width: largeur, height: AXE * 2 }}>
          {/* L'axe : la chaîne de production, d'un bout à l'autre. */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: AXE,
              height: 2,
              background: ink.rule,
            }}
          />

          {S4_SPLIT.chain.map((maillon, i) => {
            const humain = maillon.who === "human";
            const x = i * PAS + PAS / 2;
            const y = humain ? AXE - 74 : AXE + 74;
            return (
              <Rise
                key={maillon.label}
                delay={0.4 + i * 0.11}
                y={humain ? 14 : -14}
                style={{
                  position: "absolute",
                  left: x - PAS / 2,
                  top: y - 30,
                  width: PAS,
                  height: 60,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Toutes les pastilles ont la même boîte, qu'elles tiennent
                    sur une ligne ou deux : sans hauteur commune, celles qui se
                    coupaient en deux décalaient leur voisine. */}
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    width: PAS - 18,
                    minHeight: 58,
                    padding: "8px 10px",
                    borderRadius: 4,
                    border: `2px solid ${humain ? emphase.border : ink.rule}`,
                    background: humain ? emphase.background : "transparent",
                    color: humain ? emphase.color : ink.secondary,
                    fontSize: 18,
                    fontWeight: humain ? 800 : 600,
                    letterSpacing: "-0.014em",
                    lineHeight: 1.14,
                  }}
                >
                  {maillon.label}
                </span>
              </Rise>
            );
          })}

          {/* Chaque maillon rejoint l'axe par une tige : c'est ce trait qui
              dit à quel camp il appartient. */}
          <svg
            width={largeur}
            height={AXE * 2}
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
            aria-hidden="true"
          >
            {S4_SPLIT.chain.map((maillon, i) => {
              const humain = maillon.who === "human";
              const x = i * PAS + PAS / 2;
              const y1 = humain ? AXE - 44 : AXE + 44;
              return (
                <DrawPath
                  key={maillon.label}
                  d={`M ${x} ${y1} L ${x} ${AXE}`}
                  stroke={humain ? accent : ink.rule}
                  width={2}
                  opacity={1}
                  delay={0.4 + i * 0.11 + 0.1}
                  duration={0.24}
                />
              );
            })}
          </svg>
        </div>
      </div>

      <Rise delay={1.9} y={16}>
        <div
          style={{
            borderTop: `1px solid ${ink.rule}`,
            paddingTop: 28,
            display: "flex",
            alignItems: "baseline",
            gap: 48,
            flexWrap: "wrap",
          }}
        >
          <div style={{ borderLeft: `3px solid ${accent}`, paddingLeft: 24 }}>
            {S4_SPLIT.statement.map((line, i) => (
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
          <p style={{ fontSize: 19, color: ink.faint, maxWidth: 760, lineHeight: 1.4 }}>
            {S4_SPLIT.note}
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

  /* Première version : deux cartes détaillées, quatre emplacements de mesure et
     une courbe, sur une seule slide. Illisible, et le message se perdait dans
     le dispositif.

     Ce qui reste : une idée, une courbe. Le coût d'un article classique ne
     baisse pas quand on en produit plus ; le nôtre, si. Les deux légendes sont
     posées au bout de leur courbe, et il n'y a rien d'autre à lire. */
  return (
    <SlideBody>
      <Eyebrow>{S4_ECONOMICS.eyebrow}</Eyebrow>

      <div style={{ marginTop: 22, maxWidth: 1300 }}>
        {S4_ECONOMICS.title.map((line, i) => (
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
          flex: 1,
          minHeight: 0,
          display: "grid",
          placeItems: "center",
          marginTop: 8,
        }}
      >
        <MarginalCurve
          classicLabel={S4_ECONOMICS.sides[0].label}
          classicDetail={S4_ECONOMICS.sides[0].detail}
          pipelineLabel={S4_ECONOMICS.sides[1].label}
          pipelineDetail={S4_ECONOMICS.sides[1].detail}
          xLabel={S4_ECONOMICS.curve.x}
          yLabel={S4_ECONOMICS.curve.y}
          axisNote={S4_ECONOMICS.curve.caption}
          startDelay={0.5}
          width={1380}
          height={470}
        />
      </div>

      <Rise delay={2.1} y={14}>
        <div
          style={{
            borderTop: `1px solid ${ink.rule}`,
            paddingTop: 26,
            display: "flex",
            alignItems: "baseline",
            gap: 48,
            flexWrap: "wrap",
          }}
        >
          <p
            className="t-h3"
            style={{ color: ink.primary, letterSpacing: "-0.028em", maxWidth: 940, fontWeight: 700 }}
          >
            {S4_ECONOMICS.statement}
          </p>
          <p style={{ fontSize: 18, color: ink.faint, maxWidth: 620, lineHeight: 1.4, fontStyle: "italic" }}>
            {S4_ECONOMICS.measureNote}
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
      <Eyebrow>{S4_TRACE.eyebrow}</Eyebrow>

      <div style={{ marginTop: 24 }}>
        {S4_TRACE.title.map((line, i) => (
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
        {S4_TRACE.guarantees.map((g, i) => (
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
            {S4_TRACE.statement}
          </p>
          <div style={{ display: "flex", gap: 30, flexWrap: "wrap" }}>
            {S4_TRACE.frame.map((f) => (
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
   OÙ EN EST L'AUDIENCE · mise en page reprise telle quelle de la V1

   Le chiffre héros, sa courbe sur douze mois, et les quatre mesures qui
   l'entourent sous un filet. Ni pastille « données de démonstration », ni
   note sur l'acquisition mise en retrait : ce sont les chiffres du site.
   ═══════════════════════════════════════════════════════════════════════════ */

function AudienceSlide4() {
  const ink = useInk();

  return (
    <SlideBody padding="88px 120px">
      <Eyebrow>{S4_AUDIENCE.eyebrow}</Eyebrow>

      <Rise delay={0.28} y={18}>
        <h2 className="t-h1" style={{ color: ink.primary, marginTop: 24, fontSize: 60 }}>
          {S4_AUDIENCE.title[0]}
        </h2>
      </Rise>

      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "760px 1fr",
          gap: 90,
          alignItems: "center",
          marginTop: 30,
        }}
      >
        {/* Le chiffre héros */}
        <div>
          <Rise delay={0.5} y={20}>
            <div>
              <div className="t-micro" style={{ color: ink.faint }}>
                {S4_AUDIENCE.hero.label}
              </div>
              <div
                style={{
                  fontSize: 148,
                  fontWeight: 900,
                  letterSpacing: "-0.05em",
                  lineHeight: 1,
                  color: ink.primary,
                  marginTop: 16,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {S4_AUDIENCE.hero.value}
              </div>
            </div>
          </Rise>

          <div style={{ marginTop: 26 }}>
            <Sparkline series={S4_AUDIENCE.heroSeries} width={520} height={92} delay={0.9} />
            <Rise delay={1.6} y={8}>
              <div className="t-micro" style={{ color: ink.faint, marginTop: 12 }}>
                {S4_AUDIENCE.heroTrend} · {S4_AUDIENCE.periode}
              </div>
            </Rise>
          </div>
        </div>

        {/* Les mesures qui l'entourent */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "36px 56px" }}>
          {S4_AUDIENCE.stats.map((st, i) => (
            <Rise key={st.label} delay={0.8 + i * 0.09} y={16}>
              <div style={{ borderTop: `1px solid ${ink.rule}`, paddingTop: 22 }}>
                <div
                  className="t-h2"
                  style={{ color: ink.primary, fontSize: 46, fontVariantNumeric: "tabular-nums" }}
                >
                  {st.value}
                </div>
                <div className="t-micro" style={{ color: ink.muted, marginTop: 12 }}>
                  {st.label}
                </div>
              </div>
            </Rise>
          ))}
        </div>
      </div>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   OÙ NOUS NOUS SITUONS · les barres de la V1, sans changement

   Elle suit immédiatement l'audience : le chiffre vient d'être annoncé, la
   slide le met à l'échelle du secteur.
   ═══════════════════════════════════════════════════════════════════════════ */

function BenchmarkSlide4() {
  const ink = useInk();

  const rows = S4_BENCHMARK.rows.map((r) => ({
    name: r.name,
    value: r.visits,
    isUs: r.us,
  }));

  return (
    <SlideBody padding="80px 120px 64px">
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 60 }}>
        <div>
          <Eyebrow>{S4_BENCHMARK.eyebrow}</Eyebrow>
          <Rise delay={0.28} y={18}>
            <h2 className="t-h1" style={{ color: ink.primary, marginTop: 24, fontSize: 60 }}>
              {S4_BENCHMARK.headline}
            </h2>
          </Rise>
        </div>
        <Rise delay={0.6} y={10}>
          <p className="t-micro" style={{ color: ink.faint, textAlign: "right" }}>
            {S4_BENCHMARK.source}
          </p>
        </Rise>
      </div>

      <div style={{ flex: 1, display: "grid", placeItems: "center" }}>
        <BenchmarkBars rows={rows} unit={S4_BENCHMARK.unit} startDelay={0.55} />
      </div>

      <Rise delay={1.8} y={16}>
        <div>
          <Rule delay={1.7} width="100%" accentWidth={200} />
          <p
            className="t-h3 t-editorial"
            style={{ color: ink.primary, fontSize: 34, marginTop: 24, maxWidth: 1500 }}
          >
            {S4_BENCHMARK.caption}
          </p>
        </div>
      </Rise>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PRÉVISION D'AUDIENCE · la courbe de la V1, sans changement

   Quatre points, les multiplicateurs entre eux, trois leviers dessous.
   ═══════════════════════════════════════════════════════════════════════════ */

function TrajectorySlide4() {
  const ink = useInk();
  const accent = useAccent();

  const points = S4_TRAJECTORY.points.map((p) => ({
    label: p.label,
    value: p.value,
    state: p.state,
  }));

  return (
    <SlideBody padding="72px 120px 56px">
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 60 }}>
        <div>
          <Eyebrow>{S4_TRAJECTORY.eyebrow}</Eyebrow>
          <Rise delay={0.28} y={18}>
            <h2 className="t-h1" style={{ color: ink.primary, marginTop: 22, fontSize: 58 }}>
              {S4_TRAJECTORY.title[0]}
            </h2>
          </Rise>
        </div>
        <Rise delay={0.6} y={10}>
          <p className="t-micro" style={{ color: ink.faint, textAlign: "right", maxWidth: 460 }}>
            {S4_TRAJECTORY.note}
          </p>
        </Rise>
      </div>

      <div style={{ display: "grid", placeItems: "center", marginTop: 34 }}>
        <TrajectoryChart points={points} unit={S4_TRAJECTORY.unit} startDelay={0.55} height={460} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 56,
          marginTop: 10,
        }}
      >
        {S4_TRAJECTORY.levers.map((l, i) => (
          <Rise key={l.index} delay={1.6 + i * 0.16} y={18}>
            <div style={{ borderTop: `1px solid ${ink.rule}`, paddingTop: 22 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 10 }}>
                <span className="t-micro" style={{ color: accent, letterSpacing: "0.14em" }}>
                  {l.index}
                </span>
                <span className="t-h3" style={{ color: ink.primary, fontSize: 26 }}>
                  {l.title}
                </span>
              </div>
              <p className="t-body" style={{ color: ink.muted }}>
                {l.body}
              </p>
            </div>
          </Rise>
        ))}
      </div>
    </SlideBody>
  );
}

/* Qui occupe le terrain, en France : meme tableau, chiffres de la V4. */
function PlayersSlide4() {
  return (
    <PlayersSlide columns={S4_PLAYERS.columns} players={S4_PLAYERS.rows} note={S4_PLAYERS.note} />
  );
}

/* Le bandeau de mise en perspective, posé sous la matrice de couverture. */
function BenchmarkFooter() {
  const ink = useInk();
  const accent = useAccent();
  const nous = S4_BENCHMARK.rows.find((r) => r.us);

  /* Notre chiffre d'abord, puis les autres en multiples de celui-ci. Répéter
     les cinq volumes en toutes lettres faisait deux lignes, et la matrice de
     couverture ne laisse la place que pour une. Le multiple dit la même chose
     en trois caractères, et c'est lui le propos. */
  return (
    <Rise delay={1.05} y={10}>
      <div
        style={{
          marginTop: 14,
          paddingTop: 12,
          borderTop: `1px solid ${ink.rule}`,
          display: "flex",
          alignItems: "baseline",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <span className="t-micro" style={{ color: accent, letterSpacing: "0.13em" }}>
          {S4_BENCHMARK.label}
        </span>
        {nous && (
          <span style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: accent, letterSpacing: "-0.024em" }}>
              {nous.visits.toLocaleString("fr-FR")}
            </span>
            <span style={{ fontSize: 16, color: ink.primary, fontWeight: 700 }}>{nous.name}</span>
          </span>
        )}
        {S4_BENCHMARK.rows
          .filter((r) => !r.us)
          .map((r) => (
            <span key={r.name} style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
              <span style={{ fontSize: 16, color: ink.faint }}>{r.name}</span>
              {nous && (
                <span style={{ fontSize: 20, fontWeight: 800, color: ink.secondary, letterSpacing: "-0.02em" }}>
                  ×{Math.round(r.visits / nous.visits).toLocaleString("fr-FR")}
                </span>
              )}
            </span>
          ))}
      </div>
    </Rise>
  );
}

/* Ce qu'il faut vendre pour que la ligne « partenariats » du plan tienne. */
function PartnerTargetFooter() {
  const ink = useInk();
  const accent = useAccent();

  return (
    <Rise delay={1.2} y={12}>
      <div
        style={{
          marginTop: 14,
          paddingTop: 14,
          borderTop: `1px solid ${ink.rule}`,
          display: "flex",
          alignItems: "baseline",
          gap: 34,
          flexWrap: "wrap",
        }}
      >
        <span className="t-micro" style={{ color: accent, letterSpacing: "0.13em" }}>
          {S4_PARTNER_TARGET.label}
        </span>
        {[
          [S4_PARTNER_TARGET.count, S4_PARTNER_TARGET.countLabel],
          [S4_PARTNER_TARGET.price, S4_PARTNER_TARGET.priceLabel],
        ].map(([v, l]) => (
          <span key={l} style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <span style={{ fontSize: 30, fontWeight: 800, color: ink.primary, letterSpacing: "-0.03em" }}>{v}</span>
            <span style={{ fontSize: 19, color: ink.secondary }}>{l}</span>
          </span>
        ))}
        <span style={{ fontSize: 16, color: ink.faint, fontStyle: "italic" }}>{S4_PARTNER_TARGET.note}</span>
      </div>
    </Rise>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LE REGISTRE
   ═══════════════════════════════════════════════════════════════════════════ */

export const S4_VIEWS: Record<string, ComponentType> = {
  /* Acte I — le problème */
  cover: CoverSlide,
  paradoxe: ParadoxSlide,
  attention: AttentionSlide,
  travail: ReaderWorkSlide,
  reprise: HistorySlideRef,
  reponse: AnswerSlide,

  /* Acte II — le produit */
  lecture: DepthSlide,
  promesse: EditorialSlideRef,

  /* Acte III — pourquoi il y a une place */
  positionnement: PositioningSlide,
  bascule: ShiftSlide,
  canal: ChannelSlide,

  /* Acte IV — la fabrication */
  pivot: PivotSlide,
  recoupement: CrossCheckSlide,
  pipeline: PipelineSlideRef,
  partage: SplitSlide,
  economie: EconomicsSlide,
  tracabilite: TraceSlide,

  /* Acte V — preuve d'exécution */
  audience: AudienceSlide4,
  benchmark: BenchmarkSlide4,
  etat: StatusSlide,
  derriere: () => <TeamSlideRef showSkills={false} maxLines={2} />,

  /* Acte VI — le modèle économique */
  acteurs: PlayersSlide4,
  concurrence: () => <CompetitionSlide footer={<BenchmarkFooter />} />,
  acquisition: () => <AcquisitionSlide showPay={false} />,
  publications: () => <PublicationsSlide index={sectionNo("publications")} />,
  partenariats: () => (
    <PartnershipsSlide index={sectionNo("partenariats")} showCriteria={false} airy />
  ),
  modele: () => <RevenueSlide footer={<PartnerTargetFooter />} />,
  previsionnel: TrajectorySlide4,
  trajectoire: FinanceSlide,

  /* Acte VII — passage à l'échelle */
  financement: UnlockSlide,
  chaine: RoadmapSlide,
  conclusion: () => <ConclusionSlide showSignature={false} />,
};
