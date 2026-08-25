"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Clock, Zap, BarChart3, ShieldCheck } from "lucide-react";
import { getArticleBySlug } from "@/data/articles";
import { useScrollTeleport } from "@/hooks/useScrollTeleport";

// Real, already-published articles — no fabricated headlines.
const CAROUSEL_SLUGS = [
  "democratie-en-recul-2025",
  "pib-par-pays-2025-classement-complet",
  "course-armements-2025",
  "hmpv-2025-nouveau-virus-chine-monde",
];

const SIDEBAR_SLUGS = ["chine-russie-regimes-autoritaires-21e-siecle", "europe-rearmement-otan", "entreprises-geants-economie-mondiale"];

const EASE = [0.16, 1, 0.3, 1] as const;

export function ArticlesShowcase() {
  // Une catégorie par geste, jusqu'aux articles.
  //
  // La course ne portait que sur la dernière catégorie et cette section. Entre
  // les autres, il fallait dérouler une pleine hauteur d'écran pour passer de
  // l'économie à la politique : le lecteur croyait la page bloquée, et la
  // catégorie changeait au milieu du geste sans qu'on voie la bascule. La
  // course couvre maintenant toutes les ancres, si bien qu'un geste vaut une
  // catégorie et que l'arrivée est portée par le roulé, en descente comme en
  // montée. La dernière catégorie mène droit aux articles.
  useScrollTeleport({ selector: ".p2-snap-target", offset: 64, startAt: "first" });

  const carousel = CAROUSEL_SLUGS.map(getArticleBySlug).filter((a): a is NonNullable<typeof a> => Boolean(a));
  const sidebar = SIDEBAR_SLUGS.map(getArticleBySlug).filter((a): a is NonNullable<typeof a> => Boolean(a));
  const [index, setIndex] = useState(0);
  const featured = carousel[index] ?? carousel[0];

  const tags = Array.from(new Set([...carousel, ...sidebar].flatMap((a) => a.tags))).slice(0, 8);

  const [subscribed, setSubscribed] = useState(false);
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubscribed(true);
  };

  if (!featured) return null;

  return (
    <section className="p2-snap-target p2-lock" style={{ background: "#fff", padding: "clamp(56px, 9vh, 100px) clamp(20px, 4vw, 64px)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 32, flexWrap: "wrap" }}
        >
          <h2
            style={{
              fontSize: "clamp(1.7rem, 3.2vw, 2.6rem)",
              fontWeight: 900,
              color: "#0A0A0A",
              letterSpacing: "-0.03em",
              lineHeight: 1.12,
              margin: 0,
            }}
          >
            Ce qui bouge
            <br />
            <em
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontStyle: "italic",
                fontWeight: 700,
                background: "linear-gradient(125deg, #39FF88 0%, #10B981 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              dans le monde aujourd&apos;hui.
            </em>
          </h2>
          <Link
            href="/articles"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.82rem", fontWeight: 700, color: "#3A3A3A", textDecoration: "none" }}
          >
            Voir tous les articles <ArrowRight size={14} />
          </Link>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1.65fr 1fr", gap: 24 }} className="p2-articles-grid">
          {/* Featured carousel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
            style={{
              position: "relative",
              borderRadius: 22,
              overflow: "hidden",
              background: "#0d0e10",
              minHeight: "clamp(360px, 46vh, 460px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
            className="p2-featured-card group"
          >
            {featured.heroImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={featured.heroImage}
                alt=""
                className="p2-featured-img"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.55, transition: "transform 0.5s ease, opacity 0.3s ease" }}
              />
            )}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.88) 10%, rgba(0,0,0,0.25) 55%, transparent 100%)" }} />

            <span
              style={{
                position: "absolute",
                top: 20,
                left: 20,
                background: "#39FF88",
                color: "#000",
                fontSize: "0.62rem",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "5px 12px",
                borderRadius: 100,
                zIndex: 2,
              }}
            >
              À la une
            </span>

            <div style={{ position: "relative", zIndex: 2, padding: "0 clamp(20px, 3vw, 36px) clamp(20px, 3vw, 32px)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#39FF88" }}>
                  {featured.theme}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.66rem", color: "rgba(255,255,255,0.6)" }}>
                  <Clock size={11} /> {featured.readingTime} min
                </span>
              </div>
              <h3
                style={{
                  fontSize: "clamp(1.2rem, 2.2vw, 1.65rem)",
                  fontWeight: 800,
                  color: "#fff",
                  lineHeight: 1.25,
                  marginBottom: 10,
                  maxWidth: 560,
                }}
              >
                {featured.title}
              </h3>
              <p
                style={{
                  fontSize: "0.82rem",
                  color: "rgba(255,255,255,0.72)",
                  lineHeight: 1.6,
                  marginBottom: 16,
                  maxWidth: 560,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {featured.excerpt}
              </p>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Link
                  href={`/articles/${featured.slug}`}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.8rem", fontWeight: 700, color: "#fff", textDecoration: "none" }}
                >
                  Lire l&apos;article <ArrowRight size={14} />
                </Link>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ display: "flex", gap: 5 }}>
                    {carousel.map((a, i) => (
                      <button
                        key={a.slug}
                        type="button"
                        aria-label={`Article ${i + 1}`}
                        onClick={() => setIndex(i)}
                        style={{
                          width: i === index ? 18 : 6,
                          height: 6,
                          borderRadius: 100,
                          background: i === index ? "#39FF88" : "rgba(255,255,255,0.35)",
                          border: "none",
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                        }}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    aria-label="Article précédent"
                    onClick={() => setIndex((i) => (i - 1 + carousel.length) % carousel.length)}
                    style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                  >
                    <ArrowLeft size={13} />
                  </button>
                  <button
                    type="button"
                    aria-label="Article suivant"
                    onClick={() => setIndex((i) => (i + 1) % carousel.length)}
                    style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                  >
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar list */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, delay: 0.16, ease: EASE }}
            style={{ display: "flex", flexDirection: "column", gap: 4 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#39FF88" }} />
              <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#3A3A3A" }}>En continu</p>
            </div>
            {sidebar.map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="p2-sidebar-row"
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "12px 6px",
                  borderRadius: 12,
                  textDecoration: "none",
                  transition: "background 0.2s ease",
                }}
              >
                {article.heroImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={article.heroImage}
                    alt=""
                    style={{ width: 64, height: 64, borderRadius: 10, objectFit: "cover", flexShrink: 0 }}
                  />
                )}
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#10B981" }}>
                      {article.theme}
                    </span>
                    <span style={{ fontSize: "0.6rem", color: "#9B9B9B" }}>· {article.readingTime} min</span>
                  </div>
                  <p
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      color: "#0A0A0A",
                      lineHeight: 1.35,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {article.title}
                  </p>
                </div>
              </Link>
            ))}

            {/* Topics */}
            <div style={{ marginTop: 14 }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#3A3A3A", marginBottom: 10 }}>
                Sujets à suivre
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="p2-tag"
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      color: "#3A3A3A",
                      background: "#F5F5F5",
                      border: "1px solid #EFEFEF",
                      borderRadius: 100,
                      padding: "5px 12px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, delay: 0.24, ease: EASE }}
          style={{
            marginTop: 32,
            borderRadius: 20,
            border: "1px solid #EFEFEF",
            background: "#FAFAFA",
            padding: "clamp(20px, 3vw, 30px) clamp(20px, 3vw, 32px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 240 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(16,185,129,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Zap size={18} color="#10B981" />
            </div>
            <div>
              <p style={{ fontSize: "0.92rem", fontWeight: 800, color: "#0A0A0A" }}>Brief quotidien</p>
              <p style={{ fontSize: "0.78rem", color: "#8A8A8A" }}>L&apos;essentiel des faits marquants chaque matin.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, flex: "1 1 320px", maxWidth: 420 }}>
            <input
              type="email"
              required
              placeholder="Votre e-mail"
              className="input"
              style={{ flex: 1 }}
              disabled={subscribed}
            />
            <button type="submit" className="btn-primary" style={{ flexShrink: 0 }} disabled={subscribed}>
              {subscribed ? "Merci !" : "S'abonner"}
              {!subscribed && <ArrowRight size={14} />}
            </button>
          </form>

          <div style={{ display: "flex", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <BarChart3 size={15} color="#10B981" />
              <div>
                <p style={{ fontSize: "0.82rem", fontWeight: 800, color: "#0A0A0A" }}>7j/7</p>
                <p style={{ fontSize: "0.62rem", color: "#9B9B9B" }}>Veille continue</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <ShieldCheck size={15} color="#10B981" />
              <div>
                <p style={{ fontSize: "0.82rem", fontWeight: 800, color: "#0A0A0A" }}>Sources citées</p>
                <p style={{ fontSize: "0.62rem", color: "#9B9B9B" }}>Chaque article</p>
              </div>
            </div>
          </div>
        </motion.div>
        {subscribed && (
          <p style={{ marginTop: 8, fontSize: "0.72rem", color: "#8A8A8A" }} aria-live="polite">
            Merci, cette fonctionnalité sera activée prochainement.
          </p>
        )}
      </div>

      <style>{`
        .p2-featured-card:hover .p2-featured-img { transform: scale(1.04); }
        .p2-sidebar-row:hover { background: #FAFAFA; }
        .p2-tag:hover { background: rgba(16,185,129,0.1); border-color: rgba(16,185,129,0.3); color: #0D7A40; }
        @media (max-width: 860px) {
          .p2-articles-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
