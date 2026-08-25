"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ImageIcon } from "lucide-react";
import { DUR, EASE, Eyebrow, Rise, SlideBody, useDeckReducedMotion, useInk } from "@/components/presentation/primitives";
import {
  GEO,
  PARTNERS,
  PUBLICATIONS,
  WORKSHOP,
  TO_CONFIRM,
} from "@/data/soutenance2/soutenance2Data";
import { FlowCanvas, useAccent } from "./visuals";

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

      </figure>
    </Rise>
  );
}

export function PublicationsSlide({ index }: { index: string }) {
  const ink = useInk();
  const accent = useAccent();

  /* Les captures d'abord, l'audience en regard. Les pistes de partenariat
     tenaient dans la même colonne et faisaient déborder la slide : elles ont
     désormais la leur, juste après. */
  return (
    <SlideBody>
      <Eyebrow>Nos publications</Eyebrow>
      <Title lines={PUBLICATIONS.title} />

      <div
        style={{
          marginTop: 26,
          flex: 1,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 340px",
          gap: 56,
          alignItems: "start",
          minHeight: 0,
        }}
      >
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {PUBLICATIONS.items.map((item, i) => (
              <PublicationCard key={item.id} item={item} delay={0.55 + i * 0.12} />
            ))}
          </div>
        </div>

        <Rise delay={0.6} y={14}>
          <div>
            <p className="t-micro" style={{ color: accent, marginBottom: 14 }}>
              {PUBLICATIONS.audience.label}
            </p>
            <div style={{ display: "grid", gap: 12 }}>
              {PUBLICATIONS.audience.metrics.map((m) => (
                <div
                  key={m.label}
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    gap: 16,
                    paddingBottom: 10,
                    borderBottom: `1px solid ${ink.rule}`,
                  }}
                >
                  <p className="t-micro" style={{ color: ink.faint }}>{m.label}</p>
                  {m.value ? (
                    <p className="t-h3" style={{ color: ink.primary }}>{m.value}</p>
                  ) : (
                    <Slot />
                  )}
                </div>
              ))}
            </div>
            <p className="t-small" style={{ color: ink.faint, marginTop: 14, lineHeight: 1.5 }}>
              {PUBLICATIONS.audience.note}
            </p>
          </div>
        </Rise>
      </div>
    </SlideBody>
  );
}

/** Les partenariats envisagés, et les visuels qu'ils reprendraient. */
export function PartnershipsSlide({ index: _index }: { index?: string }) {
  const ink = useInk();
  const accent = useAccent();

  return (
    <SlideBody>
      <Eyebrow>Partenariats éventuels</Eyebrow>
      <Title lines={PUBLICATIONS.partnerships.title} />

      <div
        style={{
          marginTop: 30,
          flex: 1,
          minHeight: 0,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 400px",
          gap: 60,
          alignItems: "start",
        }}
      >
        <div>
          <Rise delay={0.35} y={12}>
            <p className="t-small" style={{ color: ink.faint, marginBottom: 22 }}>
              {PUBLICATIONS.partnerships.disclaimer}
            </p>
          </Rise>

          <div style={{ display: "grid", gap: 14 }}>
            {PUBLICATIONS.partnerships.items.map((pt, i) => (
              <Rise key={pt.kind} delay={0.45 + i * 0.1} y={12}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "260px minmax(0, 1fr)",
                    gap: 26,
                    alignItems: "baseline",
                    paddingBottom: 13,
                    borderBottom: `1px solid ${ink.rule}`,
                  }}
                >
                  <p className="t-h3" style={{ color: accent, letterSpacing: "-0.02em" }}>
                    {pt.kind}
                  </p>
                  <div>
                    <p className="t-small" style={{ color: ink.muted, lineHeight: 1.5 }}>
                      {pt.body}
                    </p>
                    <p className="t-micro" style={{ color: ink.faint, marginTop: 7, letterSpacing: "0.08em" }}>
                      {pt.names}
                    </p>
                  </div>
                </div>
              </Rise>
            ))}
          </div>
        </div>

        <VisualCarousel />
      </div>
    </SlideBody>
  );
}

/**
 * Les visuels que reprendrait un partenaire.
 *
 * Trois emplacements au format vertical du site, ceux des rails publicitaires,
 * qui défilent d'un clic : le suivant se laisse deviner sur le bord, si bien
 * qu'on voit qu'il y en a d'autres sans avoir à le dire.
 */
function VisualCarousel() {
  const ink = useInk();
  const accent = useAccent();
  const [i, setI] = useState(0);
  const items = PUBLICATIONS.partnerships.visuals;
  const last = items.length - 1;

  return (
    <Rise delay={0.5} y={16}>
      <div>
        <p className="t-micro" style={{ color: accent, letterSpacing: "0.14em", marginBottom: 14 }}>
          Visuels repris
        </p>

        <div style={{ position: "relative", overflow: "hidden", borderRadius: 14 }}>
          <div
            style={{
              display: "flex",
              gap: 14,
              transform: `translateX(calc(${-i} * (240px + 14px)))`,
              transition: "transform .55s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {items.map((v) => (
              <figure
                key={v.id}
                style={{
                  margin: 0,
                  flex: "0 0 240px",
                  aspectRatio: "160 / 600",
                  height: 320,
                  borderRadius: 14,
                  border: `1px solid ${ink.rule}`,
                  background: ink.tone === "dark" ? "#0B0B0B" : "#F4F4F4",
                  display: "grid",
                  placeItems: "center",
                  textAlign: "center",
                  padding: 18,
                }}
              >
                <div>
                  <ImageIcon size={20} style={{ color: ink.faint }} />
                  <p className="t-micro" style={{ color: ink.faint, marginTop: 10 }}>
                    {v.label}
                  </p>
                  <p style={{ fontSize: 12, color: ink.faint, marginTop: 6, opacity: 0.8 }}>
                    {v.image}
                  </p>
                </div>
              </figure>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>
          <button
            type="button"
            onClick={() => setI((n) => Math.max(0, n - 1))}
            disabled={i === 0}
            aria-label="Visuel précédent"
            style={carouselButton(ink, i === 0)}
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => setI((n) => Math.min(last, n + 1))}
            disabled={i === last}
            aria-label="Visuel suivant"
            style={carouselButton(ink, i === last)}
          >
            ›
          </button>
          <span className="t-micro" style={{ color: ink.faint, marginLeft: 4 }}>
            {i + 1} / {items.length}
          </span>
        </div>
      </div>
    </Rise>
  );
}

function carouselButton(
  ink: { rule: string; muted: string; faint: string },
  disabled: boolean
): React.CSSProperties {
  return {
    width: 30,
    height: 30,
    borderRadius: 8,
    border: `1px solid ${ink.rule}`,
    background: "transparent",
    color: disabled ? ink.faint : ink.muted,
    cursor: disabled ? "default" : "pointer",
    fontSize: 17,
    lineHeight: 1,
  };
}

export function GeoSlide({ index: _index }: { index?: string }) {
  const ink = useInk();
  const accent = useAccent();

  /* Le paragraphe de définition et les cinq chantiers sortent : le premier
     expliquait ce qu'est un moteur de réponse à un jury qui le sait, les
     seconds nommaient des travaux internes sans rapport avec la façon dont le
     site est fait. Ce qui reste tient en trois blocs : la différence de
     nature entre SEO et GEO, ce que le GEO impose à l'écriture, et ce qu'une
     réponse d'IA ne saura jamais rendre. */
  return (
    <SlideBody>
      <Eyebrow>GEO</Eyebrow>
      <Title lines={GEO.title} />

      <div
        style={{
          marginTop: 38,
          flex: 1,
          minHeight: 0,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.35fr) minmax(0, 1fr)",
          gap: 64,
          alignItems: "start",
        }}
      >
        <div>
          <Rise delay={0.35} y={12}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
                gap: 28,
                paddingBottom: 12,
                borderBottom: `1px solid ${ink.rule}`,
              }}
            >
              {GEO.contrastHeads.map((h, i) => (
                <p key={h} className="t-micro" style={{ color: i === 1 ? accent : ink.faint, letterSpacing: "0.12em" }}>
                  {h}
                </p>
              ))}
            </div>
          </Rise>

          {GEO.contrast.map((row, i) => (
            <Rise key={row.seo} delay={0.42 + i * 0.09} y={10}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
                  gap: 28,
                  padding: "13px 0",
                  borderBottom: `1px solid ${ink.rule}`,
                }}
              >
                <p className="t-small" style={{ color: ink.faint }}>{row.seo}</p>
                <p className="t-small" style={{ color: ink.primary, fontWeight: 700 }}>{row.geo}</p>
              </div>
            </Rise>
          ))}

          <Rise delay={0.85} y={12}>
            <p className="t-micro" style={{ color: accent, letterSpacing: "0.14em", marginTop: 30 }}>
              {GEO.discipline.label}
            </p>
          </Rise>

          <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
            {GEO.discipline.items.map((it, i) => (
              <Rise key={it.label} delay={0.92 + i * 0.09} y={10}>
                <div style={{ display: "grid", gridTemplateColumns: "220px minmax(0, 1fr)", gap: 22, alignItems: "baseline" }}>
                  <p className="t-small" style={{ color: ink.primary, fontWeight: 800 }}>{it.label}</p>
                  <p className="t-small" style={{ color: ink.muted, lineHeight: 1.5 }}>{it.body}</p>
                </div>
              </Rise>
            ))}
          </div>
        </div>

        <Rise delay={0.6} y={16}>
          <div
            style={{
              padding: "26px 28px",
              borderRadius: 16,
              border: `1px solid ${accent}`,
              background: ink.tone === "dark" ? "rgba(57,255,136,0.05)" : "rgba(57,255,136,0.06)",
            }}
          >
            <p className="t-micro" style={{ color: accent, letterSpacing: "0.14em", marginBottom: 20 }}>
              {GEO.moat.label}
            </p>
            <div style={{ display: "grid", gap: 13 }}>
              {GEO.moat.items.map((it) => (
                <p key={it} className="t-h3" style={{ color: ink.primary, letterSpacing: "-0.025em" }}>
                  {it}
                </p>
              ))}
            </div>
            <p className="t-small" style={{ color: ink.muted, marginTop: 24, lineHeight: 1.55 }}>
              {GEO.moat.statement}
            </p>
          </div>
        </Rise>
      </div>
    </SlideBody>
  );
}

export function PartnersSlide({ index: _index }: { index?: string }) {
  const ink = useInk();
  const accent = useAccent();

  /* Cette slide portait en réalité la discipline de nos sources, qui est
     partie sur la slide GEO où elle a sa place. Elle dit maintenant ce que son
     titre annonce : à quelles conditions nous acceptons un partenariat, et
     avec quelles familles d'interlocuteurs. */
  return (
    <SlideBody>
      <Eyebrow>Sélection des partenaires</Eyebrow>
      <Title lines={PARTNERS.title} />

      <Rise delay={0.3} y={12}>
        <p className="t-body" style={{ color: ink.secondary, maxWidth: 900, marginTop: 20 }}>
          {PARTNERS.intro}
        </p>
      </Rise>

      <div
        style={{
          marginTop: 34,
          flex: 1,
          minHeight: 0,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 1fr)",
          gap: 60,
          alignItems: "start",
        }}
      >
        <div style={{ display: "grid", gap: 14 }}>
          {PARTNERS.criteria.map((c, i) => (
            <Rise key={c.n} delay={0.4 + i * 0.1} y={12}>
              <div style={{ paddingBottom: 13, borderBottom: `1px solid ${ink.rule}` }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                  <span className="t-micro" style={{ color: ink.faint }}>{c.n}</span>
                  <span className="t-h3" style={{ color: ink.primary, letterSpacing: "-0.025em" }}>
                    {c.label}
                  </span>
                  {c.veto && (
                    <span
                      className="t-micro"
                      style={{
                        color: accent,
                        border: `1px solid ${accent}`,
                        borderRadius: 100,
                        padding: "2px 9px",
                      }}
                    >
                      Rédhibitoire
                    </span>
                  )}
                </div>
                <p className="t-small" style={{ color: ink.secondary, marginTop: 8 }}>{c.question}</p>
                <p className="t-small" style={{ color: ink.muted, marginTop: 5, lineHeight: 1.5 }}>{c.body}</p>
              </div>
            </Rise>
          ))}
        </div>

        <div>
          <Rise delay={0.5} y={12}>
            <p className="t-micro" style={{ color: accent, letterSpacing: "0.14em", marginBottom: 16 }}>
              Familles envisagées
            </p>
          </Rise>
          <div style={{ display: "grid", gap: 16 }}>
            {PARTNERS.candidates.map((t, i) => (
              <Rise key={t.tier} delay={0.58 + i * 0.1} y={12}>
                <div>
                  <p className="t-h3" style={{ color: ink.primary, letterSpacing: "-0.025em" }}>{t.tier}</p>
                  <p className="t-small" style={{ color: ink.muted, marginTop: 6, lineHeight: 1.5 }}>{t.body}</p>
                  <p className="t-micro" style={{ color: ink.faint, marginTop: 6, letterSpacing: "0.07em" }}>
                    {t.examples}
                  </p>
                </div>
              </Rise>
            ))}
          </div>
          <Rise delay={1} y={10}>
            <p className="t-small" style={{ color: ink.faint, marginTop: 20 }}>{PARTNERS.note}</p>
          </Rise>
        </div>
      </div>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   L'ATELIER — deux tableaux, une seule chaîne

   La slide « automatisation » disait séparément ce que la chaîne montrait
   déjà, et la répéter en faisait une redite. Ses deux garde-fous, l'arbitrage
   et le contrôle, sont revenus dans la chaîne à l'endroit où ils s'exercent,
   et le commentaire les accompagne au pied du second tableau.
   ═══════════════════════════════════════════════════════════════════════════ */

export function WorkshopOneSlide() {
  const ink = useInk();

  return (
    <SlideBody>
      <Eyebrow>{WORKSHOP.one.eyebrow}</Eyebrow>
      <Title lines={WORKSHOP.one.title} />

      <div
        style={{
          marginTop: 30,
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <FlowCanvas
          nodes={WORKSHOP.one.nodes}
          links={WORKSHOP.one.links}
          cols={WORKSHOP.one.cols}
          rows={WORKSHOP.one.rows}
          startDelay={0.3}
        />
      </div>

      <Rise delay={1.1} y={10}>
        <p className="t-small" style={{ color: ink.faint, marginTop: 20 }}>
          {WORKSHOP.one.note}
        </p>
      </Rise>
    </SlideBody>
  );
}

export function WorkshopTwoSlide() {
  const ink = useInk();
  const accent = useAccent();

  return (
    <SlideBody>
      <Eyebrow>{WORKSHOP.two.eyebrow}</Eyebrow>
      <Title lines={WORKSHOP.two.title} />

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
        <FlowCanvas
          nodes={WORKSHOP.two.nodes}
          links={WORKSHOP.two.links}
          cols={WORKSHOP.two.cols}
          rows={WORKSHOP.two.rows}
          startDelay={0.3}
        />
      </div>

      <div
        style={{
          marginTop: 20,
          paddingTop: 20,
          borderTop: `1px solid ${ink.rule}`,
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr)) minmax(0, 1.3fr)",
          gap: 44,
          alignItems: "start",
        }}
      >
        {WORKSHOP.two.hands.map((h, i) => (
          <Rise key={h.label} delay={1.1 + i * 0.1} y={12}>
            <div>
              <p className="t-micro" style={{ color: accent, marginBottom: 8 }}>
                {h.label}
              </p>
              <p className="t-small" style={{ color: ink.muted, lineHeight: 1.5 }}>
                {h.body}
              </p>
            </div>
          </Rise>
        ))}
        <Rise delay={1.3} y={12}>
          <p className="t-small" style={{ color: ink.faint, lineHeight: 1.5 }}>
            {WORKSHOP.two.note}
          </p>
        </Rise>
      </div>
    </SlideBody>
  );
}
