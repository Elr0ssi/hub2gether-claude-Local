"use client";

import { useState } from "react";
import { useSlideStep } from "./useDeck";
import { motion } from "framer-motion";
import { ImageIcon } from "lucide-react";
import { DUR, EASE, Eyebrow, Rise, SlideBody, useDeckReducedMotion, useInk } from "@/components/presentation/primitives";
import {
  GEO,
  PARTNERS,
  PUBLICATIONS,
  FUNDING,
  TEAM,
  EDITORIAL,
  LEGAL,
  STORY,
  WORKSHOP,
  TO_CONFIRM,
} from "@/data/soutenance2/soutenance2Data";
import { DrawPath, FlowCanvas, useAccent } from "./visuals";

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
  const reduced = useDeckReducedMotion();
  const STEP = 0.62;

  /* Même jeu que sur les autres slides : la ligne arrive à pleine encre et
     s'estompe quand la suivante se pose. */
  return (
    <div style={{ marginTop: 24 }}>
      {lines.map((line, i) => {
        const last = i === lines.length - 1;
        const at = delay + i * STEP;
        return (
          <motion.div
            key={line}
            className="t-h2"
            initial={reduced ? { opacity: 1, y: 0, color: ink.primary } : { opacity: 0, y: 20, color: ink.primary }}
            animate={{ opacity: 1, y: 0, color: last ? ink.primary : ink.muted }}
            transition={{
              opacity: { duration: reduced ? 0.001 : 0.5, delay: at, ease: EASE },
              y: { duration: reduced ? 0.001 : 0.5, delay: at, ease: EASE },
              color: { duration: reduced ? 0.001 : 0.45, delay: at + STEP - 0.08, ease: EASE },
            }}
            style={{ letterSpacing: "-0.032em" }}
          >
            {line}
          </motion.div>
        );
      })}
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
          marginTop: 30,
          flex: 1,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 340px",
          gap: 64,
          alignItems: "center",
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

  /* Quatre familles marquées comme telles, en colonnes : la liste en lignes
     les faisait lire comme un paragraphe. Les conditions d'acceptation, qui
     avaient une slide redondante à elles seules, referment celle-ci. */
  return (
    <SlideBody>
      <Eyebrow>Partenariats éventuels</Eyebrow>
      <Title lines={PUBLICATIONS.partnerships.title} />

      <div
        style={{
          marginTop: 36,
          flex: 1,
          minHeight: 0,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 300px",
          gap: 72,
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "38px 64px",
            }}
          >
            {PUBLICATIONS.partnerships.items.map((pt, i) => (
              <Rise key={pt.kind} delay={0.4 + i * 0.1} y={14}>
                <div style={{ paddingTop: 14, borderTop: `2px solid ${accent}` }}>
                  <p className="t-h3" style={{ color: ink.primary, letterSpacing: "-0.025em" }}>
                    {pt.kind}
                  </p>
                  <p className="t-small" style={{ color: ink.muted, marginTop: 8, lineHeight: 1.5 }}>
                    {pt.body}
                  </p>
                  <p className="t-micro" style={{ color: ink.faint, marginTop: 8, letterSpacing: "0.07em" }}>
                    {pt.names}
                  </p>
                </div>
              </Rise>
            ))}
          </div>

          <div
            style={{
              marginTop: 34,
              paddingTop: 20,
              borderTop: `1px solid ${ink.rule}`,
              display: "grid",
              gridTemplateColumns: "170px repeat(4, minmax(0, 1fr))",
              gap: 26,
              alignItems: "baseline",
            }}
          >
            <Rise delay={0.85} y={10}>
              <p className="t-micro" style={{ color: accent, letterSpacing: "0.14em" }}>
                {PUBLICATIONS.partnerships.criteriaLabel}
              </p>
            </Rise>
            {PUBLICATIONS.partnerships.criteria.map((c, i) => (
              <Rise key={c.label} delay={0.9 + i * 0.07} y={10}>
                <div>
                  <p className="t-small" style={{ color: ink.primary, fontWeight: 800 }}>{c.label}</p>
                  <p className="t-small" style={{ color: ink.faint, marginTop: 4, lineHeight: 1.45 }}>
                    {c.body}
                  </p>
                </div>
              </Rise>
            ))}
          </div>

          <Rise delay={1.2} y={10}>
            <p className="t-small" style={{ color: ink.faint, marginTop: 18 }}>
              {PUBLICATIONS.partnerships.disclaimer}
            </p>
          </Rise>
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
  /* Le carrousel avance avec la slide, pas avec la souris : la flèche fait
     défiler les trois visuels, et c'est seulement au dernier qu'elle passe à
     la slide suivante. En arrière, les trois repassent dans l'autre sens. */
  const step = useSlideStep();
  const items = PUBLICATIONS.partnerships.visuals;
  const last = items.length - 1;
  const i = Math.min(Math.max(step, 0), last);

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
              transform: `translateX(calc(${-i} * (214px + 14px)))`,
              transition: "transform .55s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {items.map((v) => (
              <figure
                key={v.id}
                style={{
                  margin: 0,
                  flex: "0 0 214px",
                  aspectRatio: "160 / 600",
                  height: 560,
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

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14 }}>
          {items.map((v, k) => (
            <span
              key={v.id}
              style={{
                width: k === i ? 24 : 8,
                height: 4,
                borderRadius: 4,
                background: k === i ? accent : ink.rule,
                transition: "width .3s cubic-bezier(0.16,1,0.3,1), background .3s",
              }}
            />
          ))}
          <span className="t-micro" style={{ color: ink.faint, marginLeft: 6 }}>
            {i + 1} / {items.length}
          </span>
        </div>
      </div>
    </Rise>
  );
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
          marginTop: 44,
          flex: 1,
          minHeight: 0,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1fr)",
          gap: 80,
          alignItems: "center",
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
              {/* Le SEO s'allume d'abord, puis s'éteint au profit du GEO :
                  la bascule se joue à l'écran au lieu d'être expliquée. */}
              {GEO.contrastHeads.map((h, i) => (
                <motion.p
                  key={h}
                  className="t-micro"
                  initial={{ color: i === 0 ? accent : ink.rule, opacity: i === 0 ? 1 : 0 }}
                  animate={{
                    color: i === 0 ? ink.faint : accent,
                    opacity: 1,
                  }}
                  transition={{
                    color: { duration: 0.6, delay: 2, ease: EASE },
                    opacity: { duration: 0.5, delay: i === 0 ? 0.35 : 2, ease: EASE },
                  }}
                  style={{ letterSpacing: "0.12em" }}
                >
                  {h}
                </motion.p>
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
                {/* Le SEO s'écrit d'abord, seul et à pleine encre. Deux
                    secondes plus tard il passe au gris pendant que la colonne
                    GEO s'écrit à son tour : la bascule se joue, elle ne
                    s'explique pas. */}
                <motion.p
                  className="t-body"
                  initial={{ color: ink.primary, opacity: 0, y: 10 }}
                  animate={{ color: ink.faint, opacity: 1, y: 0 }}
                  transition={{
                    color: { duration: 0.6, delay: 2 + i * 0.06, ease: EASE },
                    opacity: { duration: 0.45, delay: 0.45 + i * 0.09, ease: EASE },
                    y: { duration: 0.45, delay: 0.45 + i * 0.09, ease: EASE },
                  }}
                >
                  {row.seo}
                </motion.p>
                <motion.p
                  className="t-body"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 2.05 + i * 0.09, ease: EASE }}
                  style={{ color: ink.primary, fontWeight: 700 }}
                >
                  {row.geo}
                </motion.p>
              </div>
            </Rise>
          ))}

          <Rise delay={2.6} y={12}>
            <p className="t-micro" style={{ color: accent, letterSpacing: "0.14em", marginTop: 30 }}>
              {GEO.discipline.label}
            </p>
          </Rise>

          <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
            {GEO.discipline.items.map((it, i) => (
              <Rise key={it.label} delay={2.68 + i * 0.09} y={10}>
                <div style={{ display: "grid", gridTemplateColumns: "220px minmax(0, 1fr)", gap: 22, alignItems: "baseline" }}>
                  <p className="t-body" style={{ color: ink.primary, fontWeight: 800 }}>{it.label}</p>
                  <p className="t-body" style={{ color: ink.muted, lineHeight: 1.5 }}>{it.body}</p>
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
            <p className="t-body" style={{ color: ink.muted, marginTop: 26, lineHeight: 1.5 }}>
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

export function WorkshopSlide() {
  const ink = useInk();
  const accent = useAccent();

  return (
    <SlideBody>
      <Eyebrow>{WORKSHOP.eyebrow}</Eyebrow>
      <Title lines={WORKSHOP.title} />

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
          nodes={WORKSHOP.nodes}
          links={WORKSHOP.links}
          cols={WORKSHOP.cols}
          rows={WORKSHOP.rows}
          startDelay={0.3}
        />
      </div>

      {/* Les deux mains, sous la chaîne. Elles étaient posées sur une rangée
          libre, chacune avec son corps et son alignement propres ; elles
          reprennent ici la grille et l'écriture des autres blocs du deck :
          filet d'accent, intitulé, ligne. */}
      <div
        style={{
          marginTop: 20,
          paddingTop: 22,
          borderTop: `1px solid ${ink.rule}`,
          display: "grid",
          gridTemplateColumns: "230px repeat(2, minmax(0, 1fr))",
          gap: 48,
          alignItems: "start",
        }}
      >
        <Rise delay={1.05} y={12}>
          <p className="t-micro" style={{ color: accent, letterSpacing: "0.14em" }}>
            {WORKSHOP.handsLabel}
          </p>
        </Rise>
        {WORKSHOP.hands.map((h, i) => (
          <Rise key={h.label} delay={1.12 + i * 0.1} y={12}>
            <div style={{ paddingTop: 14, borderTop: `2px solid ${accent}` }}>
              <p className="t-h3" style={{ color: ink.primary, letterSpacing: "-0.025em" }}>
                {h.label}
              </p>
              <p className="t-small" style={{ color: ink.muted, marginTop: 8, lineHeight: 1.5 }}>
                {h.body}
              </p>
            </div>
          </Rise>
        ))}
      </div>

      <Rise delay={1.35} y={10}>
        <p className="t-small" style={{ color: ink.faint, marginTop: 14 }}>
          {WORKSHOP.note}
        </p>
      </Rise>
    </SlideBody>
  );
}

export function TeamSlide() {
  const ink = useInk();
  const accent = useAccent();
  const [failed, setFailed] = useState(false);

  return (
    <SlideBody>
      <Eyebrow>L&apos;équipe</Eyebrow>
      <Title lines={TEAM.title} />

      <div
        style={{
          marginTop: 34,
          flex: 1,
          minHeight: 0,
          display: "grid",
          gridTemplateColumns: "270px minmax(0, 1fr)",
          gap: 64,
          alignItems: "center",
        }}
      >
        <Rise delay={0.3} y={16}>
          <div>
            <div
              style={{
                aspectRatio: "4 / 5",
                borderRadius: 16,
                border: `1px solid ${ink.rule}`,
                background: ink.tone === "dark" ? "#0B0B0B" : "#F2F2F2",
                display: "grid",
                placeItems: "center",
                overflow: "hidden",
              }}
            >
              {failed ? (
                <div style={{ textAlign: "center", padding: 20 }}>
                  <ImageIcon size={20} style={{ color: ink.faint }} />
                  <p className="t-micro" style={{ color: ink.faint, marginTop: 10 }}>
                    Portrait à déposer
                  </p>
                </div>
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={TEAM.person.photo}
                  alt={TEAM.person.name}
                  onError={() => setFailed(true)}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              )}
            </div>
            <p className="t-h3" style={{ color: ink.primary, letterSpacing: "-0.025em", marginTop: 16 }}>
              {TEAM.person.name}
            </p>
            <p className="t-small" style={{ color: accent, marginTop: 6 }}>
              {TEAM.person.role}
            </p>

            <div style={{ marginTop: 22 }}>
              <p className="t-micro" style={{ color: ink.faint, letterSpacing: "0.12em", marginBottom: 10 }}>
                {TEAM.skillsLabel}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {TEAM.skills.map((sk) => (
                  <span
                    key={sk}
                    style={{
                      padding: "5px 11px",
                      borderRadius: 100,
                      border: `1px solid ${ink.rule}`,
                      color: ink.muted,
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Rise>

        {/* Quatre conditions, deux par deux, posées dans toute la hauteur. */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "34px 56px",
          }}
        >
          {TEAM.blocks.map((b, i) => (
            <Rise key={b.label} delay={0.42 + i * 0.11} y={14}>
              <div style={{ paddingTop: 15, borderTop: `2px solid ${i === 0 ? accent : ink.rule}` }}>
                <p className="t-h3" style={{ color: ink.primary, letterSpacing: "-0.025em" }}>
                  {b.label}
                </p>
                <div style={{ marginTop: 12, display: "grid", gap: 7 }}>
                  {b.lines.map((l) => (
                    <p key={l} className="t-small" style={{ color: ink.muted, lineHeight: 1.5 }}>
                      {l}
                    </p>
                  ))}
                </div>
              </div>
            </Rise>
          ))}
        </div>
      </div>
    </SlideBody>
  );
}

export function FundingSlide() {
  const ink = useInk();
  const accent = useAccent();

  return (
    <SlideBody>
      <Eyebrow>Financement initial</Eyebrow>
      <Title lines={FUNDING.title} />

      <div
        style={{
          marginTop: 38,
          flex: 1,
          minHeight: 0,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.25fr)",
          gap: 64,
          alignItems: "center",
        }}
      >
        <div>
          <Rise delay={0.3} y={16}>
            <div>
              <p className="t-display" style={{ color: accent, letterSpacing: "-0.05em", fontSize: 84, lineHeight: 1 }}>
                {FUNDING.need.value}
              </p>
              <p className="t-body" style={{ color: ink.secondary, marginTop: 12 }}>
                {FUNDING.need.label}
              </p>
            </div>
          </Rise>

          <Rise delay={0.44} y={14}>
            <div style={{ marginTop: 30 }}>
              <p className="t-h3" style={{ color: ink.primary, letterSpacing: "-0.025em" }}>
                {FUNDING.instrument.label}
              </p>
              <p className="t-small" style={{ color: ink.muted, marginTop: 10, lineHeight: 1.55 }}>
                {FUNDING.instrument.body}
              </p>
              <p className="t-small" style={{ color: ink.faint, marginTop: 12 }}>
                {FUNDING.ticket.label} · {FUNDING.ticket.value}
              </p>
            </div>
          </Rise>

          <Rise delay={0.6} y={14}>
            <div style={{ marginTop: 28 }}>
              <p className="t-micro" style={{ color: accent, letterSpacing: "0.14em", marginBottom: 12 }}>
                Emploi des fonds
              </p>
              <div style={{ display: "grid", gap: 8 }}>
                {FUNDING.allocation.map((a) => (
                  <div
                    key={a.label}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "minmax(0, 1fr) auto",
                      gap: 20,
                      alignItems: "baseline",
                      paddingBottom: 8,
                      borderBottom: `1px solid ${ink.rule}`,
                    }}
                  >
                    <span className="t-small" style={{ color: ink.muted }}>{a.label}</span>
                    <span className="t-small" style={{ color: ink.primary, fontWeight: 800 }}>{a.value}</span>
                  </div>
                ))}
              </div>
              <p className="t-small" style={{ color: ink.faint, marginTop: 10 }}>{FUNDING.note}</p>
            </div>
          </Rise>
        </div>

        <div style={{ display: "grid", gap: 22 }}>
          {FUNDING.reasons.map((r, i) => (
            <Rise key={r.label} delay={0.5 + i * 0.12} y={14}>
              <div style={{ paddingTop: 16, borderTop: `2px solid ${accent}` }}>
                <p className="t-h2" style={{ color: ink.primary, letterSpacing: "-0.035em" }}>
                  {r.label}
                </p>
                <p className="t-body" style={{ color: ink.muted, marginTop: 12, lineHeight: 1.55 }}>
                  {r.body}
                </p>
              </div>
            </Rise>
          ))}
        </div>
      </div>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CE QU'ON ATTEND D'UN ARTICLE
   ═══════════════════════════════════════════════════════════════════════════ */

export function EditorialSlide() {
  const ink = useInk();
  const accent = useAccent();

  return (
    <SlideBody>
      <Eyebrow>La promesse éditoriale</Eyebrow>
      <Title lines={EDITORIAL.title} />

      {/* Une progression, pas une grille. Les quatre exigences se posaient en
          deux colonnes identiques, qui les donnaient à lire comme une liste
          interchangeable ; en escalier, chacune s'appuie sur la précédente, et
          l'ordre d'arrivée le dit. */}
      <div
        style={{
          marginTop: 36,
          flex: 1,
          minHeight: 0,
          display: "grid",
          gap: 14,
          alignContent: "center",
        }}
      >
        {EDITORIAL.demands.map((d, i) => (
          <motion.div
            key={d.n}
            initial={{ opacity: 0, x: -22 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.35 + i * 0.18, ease: EASE }}
            style={{
              marginLeft: i * 74,
              paddingLeft: 26,
              borderLeft: `2px solid ${accent}`,
              display: "grid",
              gridTemplateColumns: "minmax(0, 360px) minmax(0, 1fr) auto",
              gap: 34,
              alignItems: "baseline",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
              <span className="t-micro" style={{ color: ink.faint }}>{d.n}</span>
              <span className="t-h3" style={{ color: ink.primary, letterSpacing: "-0.025em" }}>
                {d.label}
              </span>
            </div>
            <p className="t-small" style={{ color: ink.muted, lineHeight: 1.5 }}>
              {d.body}
            </p>
            <p className="t-micro" style={{ color: accent, letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
              {d.examples}
            </p>
          </motion.div>
        ))}
      </div>

      <Rise delay={0.9} y={14}>
        <div style={{ marginTop: 26, paddingLeft: 24, borderLeft: `2px solid ${accent}` }}>
          {EDITORIAL.statement.map((line, i) => (
            <p
              key={line}
              className="t-h3"
              style={{ color: i === 1 ? ink.primary : ink.muted, letterSpacing: "-0.025em" }}
            >
              {line}
            </p>
          ))}
        </div>
      </Rise>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CADRE JURIDIQUE
   ═══════════════════════════════════════════════════════════════════════════ */

export function LegalSlide() {
  const ink = useInk();
  const accent = useAccent();

  return (
    <SlideBody>
      <Eyebrow>Cadre juridique</Eyebrow>
      <Title lines={LEGAL.title} />

      <Rise delay={0.3} y={12}>
        <p className="t-body" style={{ color: ink.secondary, maxWidth: 900, marginTop: 22 }}>
          {LEGAL.intro}
        </p>
      </Rise>

      <div
        style={{
          marginTop: 40,
          flex: 1,
          minHeight: 0,
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "32px 64px",
          alignContent: "center",
        }}
      >
        {LEGAL.pillars.map((pl, i) => (
          <Rise key={pl.label} delay={0.42 + i * 0.11} y={14}>
            <div style={{ paddingTop: 15, borderTop: `2px solid ${i === 0 ? accent : ink.rule}` }}>
              <p className="t-h3" style={{ color: ink.primary, letterSpacing: "-0.025em" }}>
                {pl.label}
              </p>
              <p className="t-small" style={{ color: ink.muted, marginTop: 10, lineHeight: 1.55 }}>
                {pl.body}
              </p>
            </div>
          </Rise>
        ))}
      </div>

      <Rise delay={0.95} y={12}>
        <p
          className="t-body"
          style={{
            color: ink.secondary,
            marginTop: 24,
            paddingLeft: 22,
            borderLeft: `2px solid ${accent}`,
            maxWidth: 980,
            lineHeight: 1.55,
          }}
        >
          {LEGAL.statement}
        </p>
      </Rise>
    </SlideBody>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   OUVERTURE — trois slides avant le produit

   Mêmes composants, même écriture visuelle que le reste du deck : le filet
   d'accent en tête de bloc, la pastille, le titre qui s'estompe ligne après
   ligne. Rien de neuf n'est introduit ; seule la composition change.
   ═══════════════════════════════════════════════════════════════════════════ */

export function ContextSlide() {
  const ink = useInk();
  const accent = useAccent();
  const step = useSlideStep();
  const { context } = STORY;
  const second = step >= 1;

  /* Deux temps : ce qui a été construit, puis d'où vient le sujet. Les deux
     tiennent dans la même slide parce que c'est la même histoire, mais pas
     dans le même écran parce que ce sont deux idées. */
  return (
    <SlideBody>
      <Eyebrow>{context.eyebrow}</Eyebrow>
      <Title lines={context.title} />

      <div style={{ marginTop: 40, flex: 1, minHeight: 0, position: "relative" }}>
        {/* Premier temps */}
        <motion.div
          animate={{ opacity: second ? 0 : 1 }}
          transition={{ duration: 0.45, ease: EASE }}
          style={{ position: "absolute", inset: 0, display: "grid", alignContent: "center", gap: 40 }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) 120px minmax(0, 1fr)",
              gap: 20,
              alignItems: "center",
            }}
          >
            {/* Les deux projets, qui se rejoignent sur un même résultat. */}
            <div>
              <p className="t-micro" style={{ color: accent, letterSpacing: "0.14em", marginBottom: 16 }}>
                {context.projectsLabel}
              </p>
              <div style={{ display: "grid", gap: 12 }}>
                {context.projects.map((pr, i) => (
                  <Rise key={pr} delay={0.3 + i * 0.14} y={12}>
                    <p className="t-h2" style={{ color: ink.primary, letterSpacing: "-0.035em" }}>
                      {pr}
                    </p>
                  </Rise>
                ))}
              </div>
            </div>

            <svg width="120" height="120" aria-hidden="true" style={{ display: "block" }}>
              <DrawPath d="M 4 26 C 60 26, 62 58, 116 58" stroke={accent} width={2} opacity={0.85} delay={0.6} duration={0.6} />
              <DrawPath d="M 4 94 C 60 94, 62 62, 116 62" stroke={accent} width={2} opacity={0.85} delay={0.7} duration={0.6} />
            </svg>

            <div style={{ display: "grid", gap: 22 }}>
              {context.results.map((r, i) => (
                <Rise key={r.label} delay={0.85 + i * 0.14} y={12}>
                  <div>
                    <p className="t-h1" style={{ color: accent, letterSpacing: "-0.04em" }}>
                      {r.value}
                    </p>
                    <p className="t-body" style={{ color: ink.muted, marginTop: 4 }}>{r.label}</p>
                  </div>
                </Rise>
              ))}
            </div>
          </div>

          <div style={{ paddingTop: 26, borderTop: `1px solid ${ink.rule}` }}>
            <Rise delay={1.15} y={10}>
              <p className="t-micro" style={{ color: ink.faint, letterSpacing: "0.14em", marginBottom: 16 }}>
                {context.limitsLabel}
              </p>
            </Rise>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {context.limits.map((l, i) => (
                <Rise key={l} delay={1.22 + i * 0.1} y={10}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "10px 18px",
                      borderRadius: 100,
                      border: `1px solid ${ink.rule}`,
                      background: ink.tone === "dark" ? "rgba(255,255,255,0.03)" : "#fff",
                      color: ink.muted,
                      fontSize: 17,
                      fontWeight: 600,
                    }}
                  >
                    {l}
                  </span>
                </Rise>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Second temps : d'où vient le sujet. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: second ? 1 : 0 }}
          transition={{ duration: 0.55, delay: second ? 0.3 : 0, ease: EASE }}
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            alignContent: "center",
            gap: 26,
            pointerEvents: second ? "auto" : "none",
          }}
        >
          <p className="t-micro" style={{ color: accent, letterSpacing: "0.14em" }}>
            {context.originLabel}
          </p>
          {context.origin.map((o) => (
            <p key={o} className="t-h2" style={{ color: ink.primary, letterSpacing: "-0.035em" }}>
              {o}
            </p>
          ))}
        </motion.div>
      </div>
    </SlideBody>
  );
}

export function IdeaSlide() {
  const ink = useInk();
  const accent = useAccent();
  const step = useSlideStep();
  const { idea } = STORY;
  const open = step >= 1;

  return (
    <SlideBody>
      <Eyebrow>{idea.eyebrow}</Eyebrow>
      <Title lines={idea.title} />

      <div
        style={{
          marginTop: 34,
          flex: 1,
          minHeight: 0,
          display: "grid",
          placeItems: "center",
          position: "relative",
        }}
      >
        {/* Premier temps : une actualité, quatre lectures, une divergence. */}
        <motion.div
          animate={{ opacity: open ? 0 : 1 }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{ display: "grid", justifyItems: "center", gap: 22, width: "100%" }}
        >
          <Rise delay={0.3} y={10}>
            <span
              style={{
                padding: "12px 26px",
                borderRadius: 100,
                border: `2px solid ${accent}`,
                color: accent,
                fontSize: 21,
                fontWeight: 800,
              }}
            >
              {idea.event}
            </span>
          </Rise>

          {/* Les traits et les pastilles partagent les mêmes abscisses. */}
          <div style={{ position: "relative", width: 880, height: 132 }}>
            <svg width="880" height="76" aria-hidden="true" style={{ position: "absolute", left: 0, top: 0 }}>
              {idea.sources.map((_, i) => {
                const x = 110 + i * 220;
                return (
                  <DrawPath
                    key={i}
                    d={`M 440 2 C 440 44, ${x} 30, ${x} 72`}
                    stroke={accent}
                    width={2}
                    opacity={0.5}
                    delay={0.5 + i * 0.1}
                    duration={0.6}
                  />
                );
              })}
            </svg>

            {idea.sources.map((src, i) => (
              <Rise
                key={src}
                delay={0.6 + i * 0.12}
                y={10}
                style={{
                  position: "absolute",
                  left: 110 + i * 220 - 105,
                  top: 76,
                  width: 210,
                  height: 44,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "9px 18px",
                    borderRadius: 100,
                    border: `1px solid ${ink.rule}`,
                    background: ink.tone === "dark" ? "rgba(255,255,255,0.04)" : "#fff",
                    color: ink.muted,
                    fontSize: 16,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  {src}
                </span>
              </Rise>
            ))}
          </div>

          <Rise delay={1.15} y={10}>
            <p className="t-h3" style={{ color: ink.muted, letterSpacing: "-0.025em", marginTop: 8 }}>
              {idea.outcome}
            </p>
          </Rise>
        </motion.div>

        {/* Second temps : ce qu'il faudrait faire. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: open ? 1 : 0 }}
          transition={{ duration: 0.6, delay: open ? 0.25 : 0, ease: EASE }}
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            alignContent: "center",
            gap: 28,
            pointerEvents: open ? "auto" : "none",
          }}
        >
          <p className="t-micro" style={{ color: accent, letterSpacing: "0.14em" }}>
            {idea.intentLabel}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 56 }}>
            {idea.intents.map((it) => (
              <div key={it.n} style={{ paddingTop: 16, borderTop: `2px solid ${accent}` }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                  <span className="t-micro" style={{ color: ink.faint }}>{it.n}</span>
                  <span className="t-h2" style={{ color: ink.primary, letterSpacing: "-0.035em" }}>
                    {it.label}
                  </span>
                </div>
                <p className="t-body" style={{ color: ink.muted, marginTop: 12, lineHeight: 1.5 }}>
                  {it.body}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </SlideBody>
  );
}

export function LaterSlide() {
  const ink = useInk();
  const accent = useAccent();
  const { later } = STORY;

  return (
    <SlideBody>
      <Eyebrow>{later.eyebrow}</Eyebrow>
      <Title lines={later.title} />

      <div
        style={{
          marginTop: 44,
          flex: 1,
          minHeight: 0,
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 56,
          alignContent: "center",
        }}
      >
        {later.versions.map((v, i) => {
          const now = i === 2;
          return (
            <Rise key={v.id} delay={0.35 + i * 0.16} y={16}>
              <div style={{ paddingTop: 18, borderTop: `2px solid ${now ? accent : ink.rule}` }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
                  <span className="t-h2" style={{ color: now ? accent : ink.primary, letterSpacing: "-0.035em" }}>
                    {v.tag}
                  </span>
                  <span className="t-micro" style={{ color: ink.faint }}>{v.label}</span>
                </div>
                <div style={{ marginTop: 18, display: "grid", gap: 9 }}>
                  {v.items.map((it) => (
                    <p key={it} className="t-body" style={{ color: now ? ink.secondary : ink.muted }}>
                      {it}
                    </p>
                  ))}
                </div>
              </div>
            </Rise>
          );
        })}
      </div>

      <Rise delay={1} y={14}>
        <div style={{ marginTop: 30, paddingLeft: 24, borderLeft: `2px solid ${accent}` }}>
          {later.statement.map((line, i) => (
            <p
              key={line}
              className="t-h3"
              style={{ color: i === 1 ? ink.primary : ink.muted, letterSpacing: "-0.025em" }}
            >
              {line}
            </p>
          ))}
        </div>
      </Rise>
    </SlideBody>
  );
}
