"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, useScroll, useSpring, useTransform } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════════════
   DÉCOUVRIR

   La page qui dit ce qu'est le média, en le montrant. Elle se lit en
   défilant : chaque section amène ses éléments par les côtés, les chiffres
   se remplissent quand ils entrent dans le champ, et le fond se déplace
   plus lentement que le texte.

   Tous les nombres viennent du socle, calculés côté serveur.
   ═══════════════════════════════════════════════════════════════════════════ */

const VERT = "#39FF88";
const EASE = [0.16, 1, 0.3, 1] as const;

export interface DecouvrirProps {
  chiffres: { annees: number; pays: number; indicateurs: number; valeurs: number; articles: number; fils: number };
  tete: { nom: string; pib: number }[];
  articles: { slug: string; titre: string; theme: string; minutes: number }[];
  fils: { id: string; titre: string; ancre: string; theme: string }[];
  serie: { annee: number; pib: number }[];
}

/* ── Un nombre qui se remplit ────────────────────────────────────────────── */

function Compteur({ n, suffixe = "", duree = 1.5 }: { n: number; suffixe?: string; duree?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const vu = useInView(ref, { once: true, margin: "-60px" });
  const [v, setV] = useState(0);

  useEffect(() => {
    if (!vu) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setV(n);
      return;
    }
    let f = 0;
    const t0 = performance.now();
    const pas = (t: number) => {
      const p = Math.min(1, (t - t0) / (duree * 1000));
      setV(n * (1 - Math.pow(1 - p, 3)));
      if (p < 1) f = requestAnimationFrame(pas);
    };
    f = requestAnimationFrame(pas);
    return () => cancelAnimationFrame(f);
  }, [vu, n, duree]);

  return (
    <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>
      {Math.round(v).toLocaleString("fr-FR")}
      {suffixe}
    </span>
  );
}

/* ── Une section qui amène ses éléments ──────────────────────────────────── */

function Section({
  id,
  eyebrow,
  titre,
  chapo,
  children,
  cote,
}: {
  id?: string;
  eyebrow: string;
  titre: React.ReactNode;
  chapo?: string;
  children?: React.ReactNode;
  cote?: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  /* Le fond descend moins vite que le texte : c'est ce décalage qui donne la
     profondeur, sans qu'aucun élément ne bouge assez pour gêner la lecture. */
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section id={id} ref={ref} className="dc-section">
      <motion.div className="dc-halo" style={{ y }} aria-hidden="true" />
      <div className="dc-wrap dc-section-grille">
        <div className="dc-texte">
          <motion.p
            className="dc-eyebrow"
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {eyebrow}
          </motion.p>
          <motion.h2
            className="dc-h2"
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.06, ease: EASE }}
          >
            {titre}
          </motion.h2>
          {chapo && (
            <motion.p
              className="dc-chapo"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.16, ease: EASE }}
            >
              {chapo}
            </motion.p>
          )}
          {children}
        </div>
        {cote && (
          <motion.div
            className="dc-cote"
            initial={{ opacity: 0, x: 44 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-90px" }}
            transition={{ duration: 0.75, delay: 0.1, ease: EASE }}
          >
            {cote}
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LA PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

export function Decouvrir({ chiffres, tete, articles, fils, serie }: DecouvrirProps) {
  const { scrollYProgress } = useScroll();
  const barre = useSpring(scrollYProgress, { stiffness: 110, damping: 26, restDelta: 0.001 });

  const heros = useRef<HTMLElement>(null);
  const { scrollYProgress: hp } = useScroll({ target: heros, offset: ["start start", "end start"] });
  const heroY = useTransform(hp, [0, 1], [0, 140]);
  const heroO = useTransform(hp, [0, 0.8], [1, 0]);

  const maxPib = Math.max(...serie.map((p) => p.pib));

  return (
    <div className="dc">
      <motion.div className="dc-progression" style={{ scaleX: barre }} aria-hidden="true" />

      {/* ── L'ouverture ──────────────────────────────────────────────────── */}
      <header ref={heros} className="dc-hero">
        <div className="dc-grille-fond" aria-hidden="true" />
        <motion.div className="dc-hero-corps dc-wrap" style={{ y: heroY, opacity: heroO }}>
          <motion.p
            className="dc-eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <span className="nc-vivant" aria-hidden="true" /> The Essential Data
          </motion.p>

          <h1 className="dc-h1">
            {["Le monde", "se mesure.", "Encore faut-il", "le regarder."].map((l, k) => (
              <motion.span
                key={l}
                initial={{ opacity: 0, y: 34 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.12 + k * 0.09, ease: EASE }}
                style={{ display: "block", color: k === 3 ? VERT : undefined }}
              >
                {l}
              </motion.span>
            ))}
          </h1>

          <motion.p
            className="dc-hero-chapo"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
          >
            Une base ouverte, des cartes qui répondent, des articles qui citent leurs sources, et
            un forum pour en découdre. Voilà tout le média.
          </motion.p>

          <motion.div
            className="dc-hero-cta"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.62, ease: EASE }}
          >
            <Link href="/neo" className="dc-btn dc-btn-plein">
              Ouvrir le direct
            </Link>
            <Link href="/comparer" className="dc-btn">
              Le tableau de bord
            </Link>
          </motion.div>
        </motion.div>

        {/* La courbe de fond : la base elle-même, en filigrane. */}
        <svg className="dc-hero-courbe" viewBox="0 0 1000 220" preserveAspectRatio="none" aria-hidden="true">
          <motion.path
            d={serie
              .map((p, k) => `${k ? "L" : "M"} ${((k / (serie.length - 1)) * 1000).toFixed(1)} ${(220 - (p.pib / maxPib) * 200).toFixed(1)}`)
              .join(" ")}
            fill="none"
            stroke={VERT}
            strokeWidth={2}
            strokeOpacity={0.34}
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.4, delay: 0.4, ease: EASE }}
          />
        </svg>

        <motion.span
          className="dc-defiler"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          aria-hidden="true"
        >
          défiler
        </motion.span>
      </header>

      {/* ── Le spectre ───────────────────────────────────────────────────── */}
      <Section
        eyebrow="Le spectre"
        titre={
          <>
            Ce que la base <span>couvre déjà</span>.
          </>
        }
        chapo="Pas une sélection de pays qui arrange le propos : tout ce que la source publie, avec ses trous quand elle n'a rien publié."
        cote={
          <div className="dc-classement">
            <p className="dc-classement-t">Les dix premières économies · 2025</p>
            {tete.map((p, k) => (
              <motion.div
                key={p.nom}
                className="dc-rang"
                initial={{ opacity: 0, x: 26 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: k * 0.055, ease: EASE }}
              >
                <span className="dc-rang-n">{String(k + 1).padStart(2, "0")}</span>
                <span className="dc-rang-nom">{p.nom}</span>
                <span className="dc-rang-piste">
                  <motion.span
                    className="dc-rang-barre"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(p.pib / tete[0].pib) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.15 + k * 0.055, ease: EASE }}
                  />
                </span>
                <span className="dc-rang-v">{(p.pib / 1000).toFixed(1).replace(".", ",")} T€</span>
              </motion.div>
            ))}
          </div>
        }
      >
        <div className="dc-compteurs">
          {[
            { n: chiffres.annees, s: "", l: "années de profondeur" },
            { n: chiffres.pays, s: "", l: "pays suivis" },
            { n: chiffres.valeurs, s: "", l: "valeurs en base" },
            { n: chiffres.indicateurs, s: "", l: "indicateurs recoupés" },
          ].map((c) => (
            <div key={c.l}>
              <span className="dc-compteur-n">
                <Compteur n={c.n} suffixe={c.s} />
              </span>
              <span className="dc-compteur-l">{c.l}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Les publications ─────────────────────────────────────────────── */}
      <Section
        eyebrow="Ce qu'on publie"
        titre={
          <>
            Des articles qui <span>montrent leurs chiffres</span>.
          </>
        }
        chapo="Chaque affirmation renvoie à une donnée, chaque donnée à sa source. Ce qui manque est laissé visible plutôt que comblé."
      >
        <div className="dc-articles">
          {articles.map((a, k) => (
            <motion.div
              key={a.slug}
              initial={{ opacity: 0, y: 34, rotate: k % 2 ? 0.6 : -0.6 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-70px" }}
              transition={{ duration: 0.6, delay: k * 0.07, ease: EASE }}
            >
              <Link href={`/lecture/${a.slug}`} className="dc-article">
                <span className="dc-article-m">
                  {a.theme} · {a.minutes} min
                </span>
                <span className="dc-article-t">{a.titre}</span>
                <span className="dc-article-f">Lire →</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── Le forum ─────────────────────────────────────────────────────── */}
      <Section
        eyebrow="La communauté"
        titre={
          <>
            Et un endroit pour <span>ne pas être d&apos;accord</span>.
          </>
        }
        chapo="Le forum ouvre des fils sur des chiffres publiés. Une objection avec sa source vaut mieux qu'un commentaire sous l'article."
        cote={
          <div className="dc-fils">
            {fils.map((f, k) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, x: 32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: k * 0.08, ease: EASE }}
              >
                <Link href="/community" className="dc-fil">
                  <span className="dc-fil-tete">
                    <span className="dc-fil-theme">{f.theme}</span>
                    <span className="dc-fil-ancre">{f.ancre}</span>
                  </span>
                  <span className="dc-fil-titre">{f.titre}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        }
      >
        <div className="dc-compteurs dc-compteurs-2">
          <div>
            <span className="dc-compteur-n">
              <Compteur n={chiffres.fils} />
            </span>
            <span className="dc-compteur-l">fils ouverts</span>
          </div>
          <div>
            <span className="dc-compteur-n">
              <Compteur n={chiffres.articles} />
            </span>
            <span className="dc-compteur-l">articles publiés</span>
          </div>
        </div>
      </Section>

      {/* ── La méthode ───────────────────────────────────────────────────── */}
      <Section
        eyebrow="La méthode"
        titre={
          <>
            Trois règles, <span>tenues</span>.
          </>
        }
      >
        <div className="dc-regles">
          {[
            {
              n: "01",
              t: "Diversification des sources",
              c: "Un même fait vu par plusieurs pays et plusieurs titres. Les convergences comme les divergences sont nommées.",
            },
            {
              n: "02",
              t: "Recoupement systématique",
              c: "Un chiffre qui n'est pas remonté à sa publication d'origine ne sort pas. Une année non publiée reste absente.",
            },
            {
              n: "03",
              t: "Traçabilité",
              c: "Source, date, méthode de calcul. Le lecteur peut refaire le chemin, et le contester.",
            },
          ].map((r, k) => (
            <motion.div
              key={r.n}
              className="dc-regle"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-70px" }}
              transition={{ duration: 0.6, delay: k * 0.1, ease: EASE }}
            >
              <span className="dc-regle-n">{r.n}</span>
              <span className="dc-regle-t">{r.t}</span>
              <span className="dc-regle-c">{r.c}</span>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── La sortie ────────────────────────────────────────────────────── */}
      <section className="dc-sortie">
        <div className="dc-wrap">
          <motion.h2
            className="dc-h2 dc-h2-centre"
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            Par où voulez-vous commencer ?
          </motion.h2>
          <div className="dc-portes">
            {[
              { h: "/neo", t: "Le direct", c: "Soixante-six ans de PIB, pilotés au curseur." },
              { h: "/comparer", t: "Le tableau de bord", c: "Six pays, quatre indicateurs, sept vues." },
              { h: "/map/economy", t: "La carte", c: "Le monde en couleurs, année par année." },
              { h: "/community", t: "Le forum", c: "Les fils ouverts, et vos objections." },
            ].map((p, k) => (
              <motion.div
                key={p.h}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: k * 0.07, ease: EASE }}
              >
                <Link href={p.h} className="dc-porte">
                  <span className="dc-porte-t">{p.t}</span>
                  <span className="dc-porte-c">{p.c}</span>
                  <span className="dc-porte-f">→</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
