"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import {
  FICHE_PAYS,
  PREUVES,
  THEMES_EXPLORER,
  CITATION,
  ETAPES,
  QUESTIONS,
} from "@/data/concept/conceptData";
import { Compteur, Enseigne, ImagePlaceholder, LENT, Monte, Pied } from "./pieces";
import { GlobeMonde, type Indic } from "./GlobeMonde";
import { HorizonTerre } from "./HorizonTerre";
import type { FicheArticle, FichePays, Repere } from "@/data/concept/conceptGeo";

/* ═══════════════════════════════════════════════════════════════════════════
   LES SECTIONS QUI SUIVENT LE GLOBE

   Elles partagent le même fond que le hero : pas de rupture, seulement des
   filets d'orbite qui continuent derrière et des blocs qui émergent.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── En direct ───────────────────────────────────────────────────────────── */

export function LiveTicker({ reperes, annee }: { reperes: Repere[]; annee: number }) {
  /* Ce ne sont pas des cours : ce sont des agrégats du socle, au millésime
     publié. Le bandeau l'annonce plutôt que de mimer un flux temps réel qui
     n'existe pas — et il n'y a donc rien à rafraîchir.

     Le défilement est écrit dans le DOM par une boucle plutôt que par une
     animation CSS : sans cela, on ne peut pas l'attraper pour le faire
     glisser à la main. */
  const COPIES = 4;
  const suite = Array.from({ length: COPIES }, () => reperes).flat();
  const piste = useRef<HTMLDivElement>(null);
  const pos = useRef(0);
  const prise = useRef<{ x: number; pos: number } | null>(null);

  useEffect(() => {
    const el = piste.current;
    if (!el) return;
    const doux = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let brut = 0;
    let avant = performance.now();
    const boucle = (t: number) => {
      const dt = Math.min(64, t - avant);
      avant = t;
      /* La largeur d'un exemplaire : au-delà, le suivant a pris exactement sa
         place et l'on reboucle sans saut visible. */
      const pas = el.scrollWidth / COPIES || 1;
      if (!prise.current && !doux) pos.current += (dt / 1000) * 42;
      pos.current = ((pos.current % pas) + pas) % pas;
      el.style.transform = `translate3d(${-pos.current}px, 0, 0)`;
      brut = requestAnimationFrame(boucle);
    };
    brut = requestAnimationFrame(boucle);
    return () => cancelAnimationFrame(brut);
  }, []);

  if (!reperes.length) return null;

  return (
    <section className="cg-section cg-direct">
      <div className="cg-wrap">
        <Enseigne droite={<span className="cg-demo-mini">Banque mondiale · {annee}</span>}>
          <span className="cg-point-vif" aria-hidden="true" /> Le socle en bref
        </Enseigne>
      </div>
      <div
        className="cg-fil"
        onPointerDown={(e) => {
          prise.current = { x: e.clientX, pos: pos.current };
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!prise.current) return;
          pos.current = prise.current.pos - (e.clientX - prise.current.x);
        }}
        onPointerUp={() => {
          prise.current = null;
        }}
        onPointerCancel={() => {
          prise.current = null;
        }}
      >
        <div ref={piste} className="cg-fil-piste">
          {suite.map((m, k) => (
            <span key={`${m.nom}-${k}`} className="cg-cours">
              <span className="cg-cours-n">{m.nom}</span>
              <span className="cg-cours-v">{m.valeur}</span>
              <span className="cg-cours-note">{m.note}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── La carte ────────────────────────────────────────────────────────────── */

/* Le pays vedette de chaque pas : celui qui porte la plus forte valeur pour
   l'indicateur du moment, calculé sur le socle plutôt qu'écrit à la main —
   ce sont des exemples, mais aucun n'est inventé. */
function meilleurPays(donnees: Record<string, FichePays>, id: Indic, sens: 1 | -1): string | null {
  let meilleur: string | null = null;
  let record = -Infinity;
  for (const [nom, f] of Object.entries(donnees)) {
    const v = f[id as keyof FichePays];
    if (typeof v !== "number" || !Number.isFinite(v)) continue;
    if (v * sens > record) {
      record = v * sens;
      meilleur = nom;
    }
  }
  return meilleur;
}

const PAS_GLOBES: { indic: Indic; sens: 1 | -1; label: string }[] = [
  { indic: "pib", sens: 1, label: "Produit intérieur brut" },
  { indic: "dette", sens: 1, label: "Dette publique" },
  { indic: "chomage", sens: 1, label: "Chômage" },
  { indic: "population", sens: 1, label: "Démographie" },
];

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
  /* Le globe change d'indicateur au fil du défilement plutôt qu'au clic : la
     section est haute, et chaque tranche de sa hauteur fait avancer d'un
     pas. Une seule scène WebGL reste montée — quatre en parallèle
     referaient quatre fois le même coût pour quatre fois la même carte —
     mais la teinte, l'indicateur piloté et le pays vedette du panneau
     changent, ce qui se voit et se lit comme un défilement de globes. Ce
     sont des exemples : on ne peut pas viser un autre pays soi-même, seule
     la rotation reste libre. */
  const zone = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: zone, offset: ["start start", "end end"] });
  const [pas, setPas] = useState(0);
  useEffect(
    () =>
      scrollYProgress.on("change", (v) => {
        const i = Math.min(PAS_GLOBES.length - 1, Math.max(0, Math.floor(v * PAS_GLOBES.length)));
        setPas((p) => (p === i ? p : i));
      }),
    [scrollYProgress],
  );
  const etape = PAS_GLOBES[pas];
  const vedette = useMemo(
    () => meilleurPays(donnees, etape.indic, etape.sens),
    [donnees, etape.indic, etape.sens],
  );

  return (
    <section className="cg-section" id="nos-globes">
      <div className="cg-wrap">
        <Enseigne>Nos globes</Enseigne>
        <Monte>
          <p className="cg-chapo cg-globes-accroche">
            Le produit intérieur brut, la dette, le chômage et la démographie de chaque pays, sur
            un globe qu&apos;on fait tourner à la souris — un indicateur par pas de défilement.
          </p>
        </Monte>
        {/* Le compte que le globe ne montre plus : utile aux moteurs, pas à
            l'œil. La liste des sujets couverts se lit déjà sur le globe du
            hero et dans les repères du bandeau. */}
        <p className="sr-only">
          {FICHE_PAYS.couverture.map((c) => `${c.valeur} ${c.label}`).join(", ")}.
        </p>
      </div>

      <div ref={zone} className="cg-globes-zone" style={{ height: `${PAS_GLOBES.length * 68}vh` }}>
        <div className="cg-globes-colle">
          <div className="cg-wrap">
            <Monte>
              <div className="cg-globes-cadre">
                <GlobeMonde
                  donnees={donnees}
                  annee={annee}
                  regions={regions}
                  vues={vues}
                  montrerRegions={false}
                  montrerIndicateurs={false}
                  explorable={false}
                  indicateurs={[etape.indic]}
                  indicateurPilote={etape.indic}
                  choisi={vedette}
                  onChoisi={() => {}}
                />
              </div>
            </Monte>
            <div className="cg-globes-puces" role="tablist" aria-label="Indicateur affiché">
              {PAS_GLOBES.map((e, i) => (
                <span
                  key={e.indic}
                  className={`cg-globes-puce${i === pas ? " cg-globes-puce-on" : ""}`}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Les flux : d'où viennent les données ────────────────────────────────── */

/* Les vingt-cinq titres de presse se déplient au survol de la première
   entrée. La liste réelle n'est pas encore arrêtée : ce sont des
   emplacements, et le panneau le dit plutôt que d'avancer des noms de
   journaux que nous ne citons pas encore. Le jour où la liste arrive, on
   remplace ce tableau et la mention d'exemple s'en va. */
const PRESSE_EXEMPLE = Array.from({ length: 25 }, (_, k) => `Titre ${String(k + 1).padStart(2, "0")}`);

interface Source {
  id: string;
  label: string;
  detail: string;
  /** Déplié au survol et à la prise de focus. */
  liste?: string[];
  exemple?: string;
}

const SOURCES: Source[] = [
  {
    id: "presse",
    label: "Presse internationale",
    detail: "25 titres, 9 langues",
    liste: PRESSE_EXEMPLE,
    exemple: "Emplacements : la liste des titres n'est pas encore arrêtée.",
  },
  { id: "institutions", label: "Institutions", detail: "Banque mondiale, FMI, OMS" },
  { id: "ouvertes", label: "Données ouvertes", detail: "INSEE, Eurostat, OCDE" },
  { id: "terrain", label: "Terrain", detail: "Rapports, registres, archives" },
];

export function FluxSources() {
  return (
    <section className="cg-section cg-flux">
      <div className="cg-wrap">
        <Enseigne>Notre fonctionnement</Enseigne>
        <Monte>
          <h2 className="cg-h2">Notre fonctionnement</h2>
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
                <div className="cg-flux-entree" tabIndex={s.liste ? 0 : undefined}>
                  <span className="cg-flux-n">{String(k + 1).padStart(2, "0")}</span>
                  <span className="cg-flux-t">{s.label}</span>
                  <span className="cg-flux-d">{s.detail}</span>
                  {s.liste ? (
                    <div className="cg-flux-pop">
                      <ul className="cg-flux-pop-l">
                        {s.liste.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                      {s.exemple ? <span className="cg-tr-ex">{s.exemple}</span> : null}
                    </div>
                  ) : null}
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
              <span className="cg-flux-sortie-t">Visualize</span>
              <span className="cg-flux-sortie-d">Recoupé, daté, sourcé</span>
              <span className="cg-flux-gratuit">100 % gratuit pour nos lecteurs</span>
            </div>
          </Monte>
        </div>

      </div>
    </section>
  );
}

/* ── À la une ────────────────────────────────────────────────────────────── */

export function FeaturedStories({ articles }: { articles: FicheArticle[] }) {
  /* Les titres, les chapôs et les rubriques viennent de la base d'articles du
     site, pas d'une liste écrite pour la maquette. Les visuels restent des
     réserves : les PNG définitifs seront déposés plus tard. */
  const [une, ...autres] = articles;
  if (!une) return null;

  return (
    <section className="cg-section">
      <div className="cg-wrap">
        <Enseigne>Sujets à la une</Enseigne>

        <motion.article
          className="cg-une"
          initial={{ opacity: 0, y: 64 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-110px" }}
          transition={{ duration: 1.1, ease: LENT }}
        >
          <ImagePlaceholder nom="IMAGE_PNG_ARTICLE_01" ratio="21 / 9" className="cg-une-img" />
          <div className="cg-une-texte">
            <span className="cg-rubrique">
              {une.rubrique} · {une.duree}
            </span>
            <h3 className="cg-une-t">{une.titre}</h3>
            <p className="cg-une-c">{une.chapo}</p>
            <span className="cg-lien-fleche">
              Lire l&apos;article <span aria-hidden="true">→</span>
            </span>
          </div>
        </motion.article>

        <div className="cg-secondaires">
          {autres.map((a, k) => (
            <motion.article
              key={a.slug}
              className="cg-second"
              initial={{ opacity: 0, y: 46 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, delay: 0.12 + k * 0.12, ease: LENT }}
            >
              <ImagePlaceholder nom={`IMAGE_PNG_ARTICLE_0${k + 2}`} ratio="4 / 3" />
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
        <Enseigne>Notre couverture</Enseigne>
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
      {/* La courbe de la planète, vue de nuit : c'est sur elle que se pose
          le dernier bloc de la page. */}
      <div className="cg-horizon" aria-hidden="true">
        <HorizonTerre />
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

      <Pied />
    </section>
  );
}

/* ── Les classements vivants ──────────────────────────────────────────────
   Un carrousel de petites fiches, chacune un classement. Les valeurs sont
   réelles ; un pays sans donnée pour l'indicateur n'apparaît pas — il n'est
   pas classé dernier, ce qui serait une affirmation que la source ne fait
   pas. */

/* Quatre fiches, posées côte à côte. Il y en avait six qui défilaient
   latéralement : trop, et le défilement n'ajoutait rien qu'un geste de plus
   pour voir ce qui aurait pu tenir à l'écran. */
const FICHES = [
  { id: "pib", label: "Les plus grandes économies", court: "PIB", unite: "md", sens: 1 },
  { id: "dette", label: "La dette la plus lourde", court: "Dette / PIB", unite: "pct", sens: 1 },
  { id: "inflation", label: "L'inflation la plus forte", court: "Inflation", unite: "pct", sens: 1 },
  { id: "population", label: "Les pays les plus peuplés", court: "Démographie", unite: "hab", sens: 1 },
] as const;

function valeurFr(v: number, unite: "md" | "eur" | "pct" | "hab") {
  if (unite === "hab") return `${v.toFixed(1).replace(".", ",")} M`;
  if (unite === "pct") return `${v.toFixed(1).replace(".", ",")} %`;
  if (unite === "eur") return `${Math.round(v).toLocaleString("fr-FR")} €`;
  return Math.abs(v) >= 1000
    ? `${(v / 1000).toFixed(1).replace(".", ",")} T€`
    : `${Math.round(v).toLocaleString("fr-FR")} Md $`;
}

const FICHE_COULEUR: Record<string, string> = {
  pib: "linear-gradient(90deg, #3987e5, transparent)",
  dette: "linear-gradient(90deg, #D6A77A, transparent)",
  inflation: "linear-gradient(90deg, #41C7A5, transparent)",
  population: "linear-gradient(90deg, #9B8BE0, transparent)",
};

export function Classements({
  donnees,
  annee,
}: {
  donnees: Record<string, FichePays>;
  annee: number;
}) {

  const fiches = useMemo(
    () =>
      FICHES.map((f) => {
        const l = Object.values(donnees)
          .map((d) => ({ fr: d.fr, v: d[f.id] ?? null }))
          .filter((o): o is { fr: string; v: number } => typeof o.v === "number" && Number.isFinite(o.v))
          .sort((a, b) => (b.v - a.v) * f.sens)
          .slice(0, 5);
        const haut = l.length ? Math.max(...l.map((o) => Math.abs(o.v))) : 1;
        return { ...f, lignes: l.map((o) => ({ ...o, part: Math.abs(o.v) / haut })) };
      }),
    [donnees],
  );

  /* Les titres tiennent la colonne de gauche, fixes ; à droite, une seule
     vitrine passe de l'un à l'autre au fil du défilement — de la droite vers
     la gauche, comme le reste des rubriques qui se remplacent sur cette
     page. Cliquer un titre saute directement dessus. */
  const zone = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: zone, offset: ["start start", "end end"] });
  const [pas, setPas] = useState(0);
  useEffect(
    () =>
      scrollYProgress.on("change", (v) => {
        const i = Math.min(fiches.length - 1, Math.max(0, Math.floor(v * fiches.length)));
        setPas((p) => (p === i ? p : i));
      }),
    [scrollYProgress, fiches.length],
  );
  const actif = fiches[pas];

  return (
    <section className="cg-section cg-classements">
      <div className="cg-wrap">
        <Monte>
          <h2 className="cg-h2">Nos classements</h2>
        </Monte>
      </div>

      <div ref={zone} className="cg-cl-zone" style={{ height: `${fiches.length * 56}vh` }}>
        <div className="cg-cl-colle">
          <div className="cg-wrap cg-cl-disposition">
            <nav className="cg-cl-titres" aria-label="Classements">
              {fiches.map((f, i) => (
                <button
                  key={f.id}
                  type="button"
                  className={`cg-cl-titre${i === pas ? " cg-cl-titre-on" : ""}`}
                  onClick={() => setPas(i)}
                >
                  {f.label}
                </button>
              ))}
            </nav>

            <div className="cg-cl-vitrine">
              <AnimatePresence mode="wait">
                <motion.article
                  key={actif.id}
                  className="cg-fiche cg-fiche-vitrine"
                  style={{ "--fiche-t": FICHE_COULEUR[actif.id] } as CSSProperties}
                  initial={{ opacity: 0, x: 36 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -36 }}
                  transition={{ duration: 0.42, ease: LENT }}
                >
                  <header className="cg-fiche-h">
                    <span className="cg-fiche-i">{actif.court}</span>
                    <h3 className="cg-fiche-t">{actif.label}</h3>
                  </header>
                  <ol className="cg-fiche-l">
                    {actif.lignes.map((o, i) => (
                      <li key={o.fr}>
                        <span className="cg-fiche-r">{String(i + 1).padStart(2, "0")}</span>
                        <span className="cg-fiche-n">{o.fr}</span>
                        <span className="cg-fiche-v">{valeurFr(o.v, actif.unite)}</span>
                        <span className="cg-fiche-b" style={{ transform: `scaleX(${o.part})` }} />
                      </li>
                    ))}
                  </ol>
                </motion.article>
              </AnimatePresence>
            </div>
          </div>

          <div className="cg-wrap">
            <p className="cg-cl-source">
              Banque mondiale (WDI) · {annee} · les pays sans valeur publiée pour cet
              indicateur ne figurent pas au classement.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── D'une source à un article ────────────────────────────────────────────── */

export function Methode() {
  return (
    <section className="cg-section cg-methode">
      <div className="cg-wrap">
        <Monte>
          <h2 className="cg-h2">Notre méthode</h2>
          <p className="cg-chapo">
            Cinq étapes, toujours les mêmes. C&apos;est la répétition qui rend le
            résultat vérifiable — pas la vitesse.
          </p>
        </Monte>

        <ol className="cg-etapes">
          {ETAPES.map((e, k) => (
            <Monte key={e.n} delay={k * 0.09} y={24}>
              <li className="cg-etape">
                <span className="cg-etape-n">{e.n}</span>
                <span className="cg-etape-fil" aria-hidden="true" />
                <h3 className="cg-etape-t">{e.titre}</h3>
                <p className="cg-etape-l">{e.ligne}</p>
              </li>
            </Monte>
          ))}
        </ol>

      </div>
    </section>
  );
}

/* ── Les questions qu'on nous pose ───────────────────────────────────────── */

export function Questions() {
  const [ouvert, setOuvert] = useState<number | null>(0);
  return (
    <section className="cg-section cg-questions">
      <div className="cg-wrap">
        <Enseigne>Les questions qu&apos;on nous pose</Enseigne>
        <div className="cg-q-liste">
          {QUESTIONS.map((q, k) => {
            const on = ouvert === k;
            return (
              <Monte key={q.q} delay={k * 0.07} y={18}>
                <div className={`cg-q${on ? " cg-q-on" : ""}`}>
                  <button
                    type="button"
                    className="cg-q-t"
                    aria-expanded={on}
                    onClick={() => setOuvert(on ? null : k)}
                  >
                    {q.q}
                    <span className="cg-q-signe" aria-hidden="true" />
                  </button>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div
                        className="cg-q-r"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.38, ease: LENT }}
                      >
                        <p>{q.r}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Monte>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Les six rubriques ────────────────────────────────────────────────────
   Elles tournaient auparavant en orbite autour de la sphère abstraite. Le
   globe en points ne porte plus d'étiquettes flottantes : les rubriques
   reprennent leur place ici, lisibles d'un coup d'œil. */

