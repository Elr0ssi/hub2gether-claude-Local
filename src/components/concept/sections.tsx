"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FICHE_PAYS,
  MARCHES,
  PREUVES,
  SECONDAIRES,
  THEMES_EXPLORER,
  UNE,
  CITATION,
} from "@/data/concept/conceptData";
import { Compteur, Enseigne, ImagePlaceholder, LENT, Monte } from "./pieces";
import { GlobeMonde } from "./GlobeMonde";
import type { FichePays } from "@/data/concept/conceptGeo";

/* ═══════════════════════════════════════════════════════════════════════════
   LES SECTIONS QUI SUIVENT LE GLOBE

   Elles partagent le même fond que le hero : pas de rupture, seulement des
   filets d'orbite qui continuent derrière et des blocs qui émergent.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── En direct ───────────────────────────────────────────────────────────── */

function Micro({ forme, sens }: { forme: number[]; sens: number }) {
  const max = Math.max(...forme);
  const min = Math.min(...forme);
  const d = forme
    .map((v, k) => `${k ? "L" : "M"} ${(k / (forme.length - 1)) * 54} ${18 - ((v - min) / (max - min || 1)) * 15}`)
    .join(" ");
  return (
    <svg width="54" height="20" viewBox="0 0 54 20" aria-hidden="true" className="cg-micro">
      <path d={d} fill="none" stroke={sens > 0 ? "#41C7A5" : "#FF6474"} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function LiveTicker() {
  /* Le flux est doublé et défile en continu : on veut la sensation d'un fil
     qui tourne, pas cinq cartes posées côte à côte. */
  const suite = [...MARCHES, ...MARCHES];
  return (
    <section className="cg-section cg-direct">
      <div className="cg-wrap">
        <Enseigne droite={<span className="cg-demo-mini">valeurs de démonstration</span>}>
          <span className="cg-point-vif" aria-hidden="true" /> En direct
        </Enseigne>
      </div>
      <div className="cg-fil">
        <div className="cg-fil-piste">
          {suite.map((m, k) => (
            <span key={`${m.nom}-${k}`} className="cg-cours">
              <span className="cg-cours-n">{m.nom}</span>
              <span className="cg-cours-v">{m.valeur}</span>
              <Micro forme={m.forme} sens={m.sens} />
              <span className={`cg-cours-d ${m.sens > 0 ? "up" : "down"}`}>
                {m.sens > 0 ? "▲" : "▼"} {m.delta.replace(/^[+−]/, "")}
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── La carte ────────────────────────────────────────────────────────────── */

export function InteractiveMapPreview({
  donnees,
  annee,
  regions,
  vues,
}: {
  donnees: Record<string, FichePays>;
  annee: number;
  regions: readonly { id: string; label: string; pays: readonly string[] }[];
  vues: Record<string, { lat: number; lon: number }>;
}) {
  return (
    <section className="cg-section">
      <div className="cg-wrap">
        <Monte>
          <h2 className="cg-h2">
            Explorez le monde<span className="cg-pt">.</span>
            <br />
            <span className="cg-h2-doux">Autrement.</span>
          </h2>
          <p className="cg-chapo">
            Un globe interactif, des indicateurs clés et des analyses pour chaque pays. Faites-le
            tourner, choisissez un territoire.
          </p>
        </Monte>

        <Monte delay={0.08}>
          <GlobeMonde donnees={donnees} annee={annee} regions={regions} vues={vues} />
        </Monte>

        <Monte delay={0.14}>
          <div className="cg-couverture">
            {FICHE_PAYS.couverture.map((c) => (
              <span key={c.label}>
                <strong>{c.valeur}</strong> {c.label}
              </span>
            ))}
          </div>
        </Monte>
      </div>
    </section>
  );
}

/* ── Les flux : d'où viennent les données ────────────────────────────────── */

const SOURCES = [
  { id: "presse", label: "Presse internationale", detail: "25 titres, 9 langues" },
  { id: "institutions", label: "Institutions", detail: "Banque mondiale, FMI, OMS" },
  { id: "ouvertes", label: "Données ouvertes", detail: "INSEE, Eurostat, OCDE" },
  { id: "terrain", label: "Terrain", detail: "Rapports, registres, archives" },
];

export function FluxSources() {
  return (
    <section className="cg-section cg-flux">
      <div className="cg-wrap">
        <Enseigne>La fabrique</Enseigne>
        <Monte>
          <h2 className="cg-h2">
            Quatre flux<span className="cg-pt">.</span>
            <br />
            <span className="cg-h2-doux">Une seule sortie.</span>
          </h2>
          <p className="cg-chapo">
            Rien ne sort qui n&apos;ait été vu par plusieurs sources. Les convergences font la
            donnée, les divergences font l&apos;article.
          </p>
        </Monte>

        <div className="cg-flux-scene">
          {/* Les quatre entrées, à gauche */}
          <div className="cg-flux-entrees">
            {SOURCES.map((s, k) => (
              <Monte key={s.id} delay={k * 0.1} y={18}>
                <div className="cg-flux-entree">
                  <span className="cg-flux-n">{String(k + 1).padStart(2, "0")}</span>
                  <span className="cg-flux-t">{s.label}</span>
                  <span className="cg-flux-d">{s.detail}</span>
                </div>
              </Monte>
            ))}
          </div>

          {/* Les courbes qui se rejoignent */}
          <svg className="cg-flux-toile" viewBox="0 0 420 340" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="cg-flux-g" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#d6a77a" stopOpacity="0.08" />
                <stop offset="65%" stopColor="#d6a77a" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#9ec7d8" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            {[42, 128, 214, 300].map((y, k) => (
              <g key={y}>
                <path
                  d={`M 0 ${y} C 150 ${y}, 220 170, 420 170`}
                  fill="none"
                  stroke="url(#cg-flux-g)"
                  strokeWidth="1.2"
                />
                {/* Une impulsion parcourt chaque flux : on voit que ça circule. */}
                <circle r="2.6" fill="#d6a77a" className="cg-flux-bille">
                  <animateMotion
                    dur={`${5.2 + k * 0.9}s`}
                    repeatCount="indefinite"
                    path={`M 0 ${y} C 150 ${y}, 220 170, 420 170`}
                  />
                </circle>
              </g>
            ))}
          </svg>

          {/* La sortie */}
          <Monte delay={0.28}>
            <div className="cg-flux-sortie">
              <span className="cg-flux-sortie-m" aria-hidden="true" />
              <span className="cg-flux-sortie-t">The Essential Data</span>
              <span className="cg-flux-sortie-d">Recoupé, daté, sourcé</span>
            </div>
          </Monte>
        </div>

        {/* Le prix pour le lecteur */}
        <Monte delay={0.2}>
          <div className="cg-gratuit">
            <span className="cg-gratuit-v">
              <Compteur valeur={0} suffixe=" €" duree={1.2} />
            </span>
            <span className="cg-gratuit-l">
              <strong>Le prix pour le lecteur.</strong>
              Pas de mur payant, pas de compte obligatoire. Le média est financé par son audience,
              pas par ses lecteurs.
            </span>
          </div>
        </Monte>
      </div>
    </section>
  );
}

/* ── À la une ────────────────────────────────────────────────────────────── */

export function FeaturedStories() {
  return (
    <section className="cg-section">
      <div className="cg-wrap">
        <Enseigne>À la une</Enseigne>

        <motion.article
          className="cg-une"
          initial={{ opacity: 0, y: 64 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-110px" }}
          transition={{ duration: 1.1, ease: LENT }}
        >
          <ImagePlaceholder nom={UNE.image} ratio="21 / 9" className="cg-une-img" />
          <div className="cg-une-texte">
            <span className="cg-rubrique">
              {UNE.rubrique} · {UNE.duree}
            </span>
            <h3 className="cg-une-t">
              {UNE.titre[0]}
              <br />
              {UNE.titre[1]}
            </h3>
            <p className="cg-une-c">{UNE.chapo}</p>
            <span className="cg-lien-fleche">
              Lire l&apos;article <span aria-hidden="true">→</span>
            </span>
          </div>
        </motion.article>

        <div className="cg-secondaires">
          {SECONDAIRES.map((a, k) => (
            <motion.article
              key={a.titre}
              className="cg-second"
              initial={{ opacity: 0, y: 46 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, delay: 0.12 + k * 0.12, ease: LENT }}
            >
              <ImagePlaceholder nom={a.image} ratio="4 / 3" />
              <span className="cg-rubrique">
                {a.rubrique} · {a.duree}
              </span>
              <h4 className="cg-second-t">{a.titre}</h4>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── L'exploration par thématique ────────────────────────────────────────── */

export function TopicExplorer() {
  const [ouvert, setOuvert] = useState<string | null>(null);

  return (
    <section className="cg-section">
      <div className="cg-wrap">
        <Monte>
          <h2 className="cg-h2">
            Des sujets clés<span className="cg-pt">.</span>
            <br />
            <span className="cg-h2-doux">Une vue d&apos;ensemble.</span>
          </h2>
        </Monte>
      </div>

      {/* Des panneaux verticaux qui respirent : celui qu'on survole prend la
          place, les autres se resserrent. Pas de grille de cartes. */}
      <div className="cg-panneaux" onMouseLeave={() => setOuvert(null)}>
        {THEMES_EXPLORER.map((t, k) => (
          <motion.button
            type="button"
            key={t.id}
            className={`cg-panneau${ouvert === t.id ? " cg-panneau-on" : ""}`}
            onMouseEnter={() => setOuvert(t.id)}
            onFocus={() => setOuvert(t.id)}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: k * 0.08, ease: LENT }}
            style={{ flexGrow: ouvert === null ? 1 : ouvert === t.id ? 2.1 : 0.72 }}
          >
            <ImagePlaceholder nom={t.image} ratio="3 / 4" className="cg-panneau-img" />
            <span className="cg-panneau-corps">
              <span className="cg-panneau-n">{String(k + 1).padStart(2, "0")}</span>
              <span className="cg-panneau-t">{t.label}</span>
              <span className="cg-panneau-l">{t.ligne}</span>
            </span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}

/* ── Les chiffres ────────────────────────────────────────────────────────── */

export function NumbersSection() {
  return (
    <section className="cg-section cg-preuves">
      <div className="cg-wrap">
        <Monte>
          <p className="cg-preuves-t">
            Le monde change<span className="cg-pt">.</span>
            <br />
            <span className="cg-h2-doux">Les données aussi.</span>
          </p>
        </Monte>
        <div className="cg-preuves-l">
          {PREUVES.map((p, k) => (
            <Monte key={p.label} delay={k * 0.12} y={26}>
              <div className="cg-preuve">
                <span className="cg-preuve-v">
                  <Compteur
                    valeur={p.valeur}
                    prefixe={p.prefixe}
                    suffixe={p.suffixe}
                    decimales={p.decimales ?? 0}
                  />
                </span>
                <span className="cg-preuve-l">{p.label}</span>
              </div>
            </Monte>
          ))}
        </div>
        <Monte delay={0.4}>
          <p className="cg-demo-mini cg-demo-bloc">
            Prototype · audience et satisfaction sont des valeurs de démonstration, non mesurées.
          </p>
        </Monte>
      </div>
    </section>
  );
}

/* ── La sortie ───────────────────────────────────────────────────────────── */

export function NewsletterSection() {
  return (
    <section className="cg-section cg-sortie">
      {/* L'horizon : la sphère du début qui repasse, à peine. */}
      <div className="cg-horizon" aria-hidden="true">
        <svg viewBox="0 0 1400 320" preserveAspectRatio="none">
          <defs>
            <linearGradient id="cg-horizon-g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9EC7D8" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#9EC7D8" stopOpacity="0" />
            </linearGradient>
          </defs>
          <ellipse cx="700" cy="560" rx="900" ry="470" fill="none" stroke="url(#cg-horizon-g)" strokeWidth="1" />
          <ellipse cx="700" cy="600" rx="1120" ry="540" fill="none" stroke="rgba(214,167,122,0.16)" strokeWidth="1" />
          <ellipse cx="700" cy="640" rx="1340" ry="610" fill="none" stroke="rgba(244,242,238,0.07)" strokeWidth="1" />
        </svg>
      </div>

      <div className="cg-wrap cg-sortie-corps">
        <Monte>
          <h2 className="cg-h2 cg-h2-centre">
            Restez en avance
            <br />
            <span className="cg-h2-doux">sur le monde.</span>
          </h2>
          <p className="cg-chapo cg-chapo-centre">
            Recevez nos analyses directement dans votre boîte mail.
          </p>
        </Monte>

        <Monte delay={0.14}>
          <form className="cg-inscription" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="adresse@exemple.fr" aria-label="Votre adresse email" required />
            <button type="submit">S&apos;inscrire</button>
          </form>
        </Monte>

        <Monte delay={0.26}>
          <blockquote className="cg-citation">
            <p>{CITATION[0]}</p>
            <p>{CITATION[1]}</p>
          </blockquote>
        </Monte>
      </div>

      <footer className="cg-pied">
        <div className="cg-wrap cg-pied-l">
          <span>The Essential Data</span>
          <nav>
            <a href="#monde">Monde</a>
            <a href="#economie">Économie</a>
            <a href="#geopolitique">Géopolitique</a>
            <a href="#analyses">Analyses</a>
          </nav>
          <span className="cg-pied-note">Prototype de direction artistique · non indexé</span>
        </div>
      </footer>
    </section>
  );
}
