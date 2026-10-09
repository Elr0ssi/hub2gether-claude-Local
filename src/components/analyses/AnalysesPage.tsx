"use client";

import dynamic from "next/dynamic";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Banknote,
  BookOpen,
  Check,
  ChevronDown,
  Globe,
  Landmark,
  MessageCircle,
  Sparkles,
  Users,
} from "lucide-react";
import { EnTete, Pied } from "@/components/concept/pieces";
import { Odometre } from "@/components/concept/Roulement";
import { PresseCarousel } from "@/components/presse/PresseCarousel";
import { PRESSE_MONDE } from "@/data/concept/presse";
import { ETAPES } from "@/data/concept/conceptData";
import type { FichePays, Repere } from "@/data/concept/conceptGeo";
import "@/components/concept/concept.css";
import "./analyses.css";

/* ═══════════════════════════════════════════════════════════════════════════
   ANALYSES — LA PAGE D'ACCUEIL DE DEMAIN, EN ESSAI

   Un langage néo-média : des cartes très arrondies, un violet qui tient la
   une, de gros chiffres posés d'emblée, des mouvements qui reviennent quand on
   change de lecture. Tout le mouvement est du CSS ; les seuls écouteurs de
   défilement sont deux lectures de position, sans rendu à chaque image.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface Props {
  reperes: Repere[];
  donnees: Record<string, FichePays>;
  annee: number;
  dette: { montant: number; ratio: number; deficit: number };
  /** Le PIB mondial du dernier millésime, pour le compteur en direct. */
  pib: { total: number; n: number; annee: number };
}

const fmtPib = (v: number) =>
  Math.abs(v) >= 1000 ? `${(v / 1000).toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} T$` : `${Math.round(v).toLocaleString("fr-FR")} Md$`;

const nf = (v: number, d = 1) =>
  v.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });

/* ── L'apparition au défilement ──────────────────────────────────────────
   Un seul écouteur pour toute la page : il passe `data-vu` à 1 sur chaque
   élément marqué `data-rev` quand il entre dans l'écran, puis l'oublie.
   Avant le premier rendu client, rien n'est masqué : sans JavaScript, la page
   se lit entière. */
function useApparitions(racine: React.RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    racine.current?.setAttribute("data-js", "1");
  }, [racine]);

  useEffect(() => {
    const r = racine.current;
    if (!r) return;
    let restants = Array.from(r.querySelectorAll<HTMLElement>("[data-rev]"));
    let rendez = false;
    const passe = () => {
      rendez = false;
      const h = window.innerHeight;
      restants = restants.filter((n) => {
        const b = n.getBoundingClientRect();
        if (b.top < h - 60 && b.bottom > -40) {
          n.setAttribute("data-vu", "1");
          return false;
        }
        return true;
      });
      if (!restants.length) {
        window.removeEventListener("scroll", plan);
        window.removeEventListener("resize", plan);
      }
    };
    const plan = () => {
      if (!rendez) {
        rendez = true;
        requestAnimationFrame(passe);
      }
    };
    window.addEventListener("scroll", plan, { passive: true });
    window.addEventListener("resize", plan);
    plan();
    return () => {
      window.removeEventListener("scroll", plan);
      window.removeEventListener("resize", plan);
    };
  }, [racine]);
}

/** Un bloc qui se lève. `d` est le retard, en millisecondes. */
function Rev({
  children,
  d = 0,
  className = "",
  as: Tag = "div",
  href,
}: {
  children: React.ReactNode;
  d?: number;
  className?: string;
  as?: "div" | "li" | "article" | "p" | "h2" | "a";
  href?: string;
}) {
  const T = Tag as React.ElementType;
  return (
    <T data-rev="" href={href} className={className} style={{ "--d": `${d}ms` } as React.CSSProperties}>
      {children}
    </T>
  );
}

/* ── Un nombre qui monte jusqu'à sa valeur ───────────────────────────────── */

function Monte({ texte }: { texte: string }) {
  const m = texte.match(/^([^\d-]*)(-?\d[\d\s  ]*(?:,\d+)?)(.*)$/);
  const cible = m ? parseFloat(m[2].replace(/[\s  ]/g, "").replace(",", ".")) : NaN;
  const dec = m && m[2].includes(",") ? m[2].split(",")[1].length : 0;
  const [v, setV] = useState<number | null>(null);

  useEffect(() => {
    if (!Number.isFinite(cible)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let f = 0;
    const t0 = performance.now();
    const pas = (t: number) => {
      const u = Math.min(1, (t - t0) / 1100);
      setV(cible * (1 - Math.pow(1 - u, 4)));
      if (u < 1) f = requestAnimationFrame(pas);
      else setV(null);
    };
    setV(0);
    f = requestAnimationFrame(pas);
    return () => cancelAnimationFrame(f);
  }, [cible]);

  if (!m || !Number.isFinite(cible)) return <>{texte}</>;
  return (
    <>
      {m[1]}
      {v === null ? m[2] : nf(v, dec)}
      {m[3]}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   1 · L'OUVERTURE — le nom, un slogan, un globe qui porte les chiffres
   ═══════════════════════════════════════════════════════════════════════════ */

/* Le globe en points du site : une scène WebGL, montée seulement côté client
   et une fois le titre posé, pour ne pas disputer le fil principal. */
const GlobePoints = dynamic(() => import("@/components/globe/InteractiveGlobeIcons"), {
  ssr: false,
  loading: () => null,
});

function Mots({ texte, depart = 0 }: { texte: string; depart?: number }) {
  return (
    <>
      {texte.split(" ").map((m, i) => (
        <span key={`${m}-${i}`} className="ax-mot">
          <span style={{ "--i": i + depart } as React.CSSProperties}>{m}&nbsp;</span>
        </span>
      ))}
    </>
  );
}

function Ouverture({ reperes, donnees, annee, dette }: Props) {
  const top = useMemo(
    () =>
      Object.values(donnees)
        .filter((d): d is FichePays & { pib: number } => typeof d.pib === "number")
        .sort((a, b) => b.pib - a.pib),
    [donnees],
  );
  const pibMonde = reperes.find((r) => r.nom === "PIB mondial");
  const pop = reperes.find((r) => r.nom === "Population");

  /* Le globe arrive après le titre ; sa teinte suit le thème du site. */
  const [globe, setGlobe] = useState(false);
  const [sombre, setSombre] = useState(true);
  useEffect(() => {
    const t = window.setTimeout(() => setGlobe(true), 600);
    const lit = () => setSombre(document.documentElement.dataset.concept !== "clair");
    lit();
    const o = new MutationObserver(lit);
    o.observe(document.documentElement, { attributes: true, attributeFilter: ["data-concept"] });
    return () => {
      window.clearTimeout(t);
      o.disconnect();
    };
  }, []);

  /* Les chiffres sont posés sur la sphère, à de vraies coordonnées : ils
     tournent avec elle, et il faut la faire tourner pour tous les voir. */
  const marqueurs = useMemo(
    () => [
      { id: "pib", lat: 42, lon: -96, icon: Landmark, texte: { chiffre: pibMonde?.valeur ?? "—", label: `PIB mondial ${annee}` } },
      { id: "top", lat: 34, lon: 108, icon: Landmark, texte: { chiffre: top[0] ? fmtPib(top[0].pib) : "—", label: top[0]?.fr ?? "1re économie" } },
      { id: "pop", lat: 8, lon: 22, icon: Users, texte: { chiffre: pop?.valeur ?? "—", label: "Population" } },
      { id: "fr", lat: 47, lon: 3, icon: Banknote, texte: { chiffre: `${nf(dette.ratio)} %`, label: "Dette France / PIB" } },
      { id: "pays", lat: -18, lon: -58, icon: Globe, texte: { chiffre: "200+", label: "pays suivis" } },
    ],
    [pibMonde, pop, top, annee, dette.ratio],
  );

  return (
    <header className="ax-ouv">
      <div className="ax-ouv-g">
        <div className="ax-ouv-t">
          <h1 className="ax-h1">
            <Mots texte="Visualize" />
          </h1>
          <p className="ax-ouv-s ax-in" style={{ "--d": "500ms" } as React.CSSProperties}>
            Chaque chiffre du monde, enfin lisible.
          </p>
          <div className="ax-ouv-c ax-in" style={{ "--d": "650ms" } as React.CSSProperties}>
            <a className="ax-bouton ax-bouton-vif" href="#presentation">
              Explorer notre site <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="ax-globe-zone">
          <div className="ax-globe-halo" aria-hidden="true" />
          <div className="ax-globe-c">
            {globe && (
              <GlobePoints
                markers={marqueurs}
                accent="#8b5cff"
                sphereColor={sombre ? "#15102c" : "#e9e3fb"}
                badgeBackground={sombre ? "rgba(22,17,44,0.82)" : "rgba(255,255,255,0.9)"}
                badgeShadow={
                  sombre
                    ? "0 12px 30px rgba(0,0,0,0.5), 0 0 0 1px rgba(165,131,255,0.35)"
                    : "0 12px 28px rgba(60,30,140,0.22), 0 0 0 1px rgba(91,45,224,0.18)"
                }
                iconColor={sombre ? "#cdbcff" : "#5b2de0"}
                markerSize="clamp(30px, 3.4vw, 40px)"
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   1 bis · CE QUE NOUS FAISONS — un tableau de bord de quatre blocs
   ═══════════════════════════════════════════════════════════════════════════ */

function Presentation() {
  return (
    <section className="ax-sec" id="presentation" aria-labelledby="ax-pr-t">
      <Rev as="h2" className="ax-h2">
        <span id="ax-pr-t">Des données, des globes, des articles</span>
      </Rev>
      <Rev as="p" className="ax-sous" d={80}>
        On rassemble les chiffres, on les met sur des globes à manipuler, puis on vous laisse les
        décortiquer dans nos articles ou en discuter sur le forum.
      </Rev>
      <div className="ax-dash">
        <Rev as="a" href="#direct" className="ax-bloc ax-bloc-a" d={0}>
          <span className="ax-bloc-i"><Activity size={18} aria-hidden="true" /></span>
          <h3>Des données en temps réel</h3>
          <p>PIB, dépenses, naissances, décès : des compteurs qui avancent à la seconde.</p>
          <span className="ax-bloc-l">Voir les compteurs <ArrowUpRight size={14} aria-hidden="true" /></span>
        </Rev>
        <Rev as="a" href="/economie" className="ax-bloc ax-bloc-b" d={90}>
          <span className="ax-bloc-i"><Globe size={18} aria-hidden="true" /></span>
          <h3>Des globes interactifs</h3>
          <p>Plus de 200 pays, de 1960 à aujourd&apos;hui, à tourner, comparer, zoomer.</p>
          <span className="ax-bloc-l">Ouvrir les globes <ArrowUpRight size={14} aria-hidden="true" /></span>
        </Rev>
        <Rev as="a" href="/france/economie/dette-publique-v2" className="ax-bloc ax-bloc-c" d={180}>
          <span className="ax-bloc-i"><BookOpen size={18} aria-hidden="true" /></span>
          <h3>Des articles décortiqués</h3>
          <p>Le montant d&apos;abord, l&apos;explication ensuite, la source toujours.</p>
          <span className="ax-bloc-l">Lire un dossier <ArrowUpRight size={14} aria-hidden="true" /></span>
        </Rev>
        <Rev as="a" href="/forum" className="ax-bloc ax-bloc-d" d={270}>
          <span className="ax-bloc-i"><MessageCircle size={18} aria-hidden="true" /></span>
          <h3>Un forum pour en débattre</h3>
          <p>Posez vos questions, contestez un chiffre, comparez vos lectures.</p>
          <span className="ax-bloc-l">Rejoindre le forum <ArrowUpRight size={14} aria-hidden="true" /></span>
        </Rev>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   2 · EN DIRECT — la page s'arrête, les chiffres tournent, puis ce que l'on fait
   ═══════════════════════════════════════════════════════════════════════════ */

const AN_SECONDES = 365.2425 * 24 * 3600;
const EPOQUE_DEPENSES = Date.UTC(2026, 0, 1);
const DIRECT = [
  { nom: "PIB mondial", unite: " Md $", dec: 3, note: "Produit intérieur brut du monde, ramené à la seconde" },
  { nom: "Dépenses militaires", parSeconde: 55_160, unite: " $", dec: 0, note: "Dans le monde, depuis le 1er janvier 2026" },
  { nom: "Dépenses médicales", parSeconde: 200_130, unite: " $", dec: 0, note: "Dans le monde, depuis le 1er janvier 2026" },
  { nom: "Dépenses éducatives", parSeconde: 132_610, unite: " $", dec: 0, note: "Dans le monde, depuis le 1er janvier 2026" },
] as const;

function EnDirect({ pib }: { pib: Props["pib"] }) {
  const zone = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);
  const [p, setP] = useState(0);
  const total = DIRECT.length + 1;

  const departAnnee = useMemo(() => {
    const t = new Date(new Date().getFullYear(), 0, 1).getTime();
    return performance.now() - (Date.now() - t);
  }, []);
  const departDepenses = useMemo(() => performance.now() - (Date.now() - EPOQUE_DEPENSES), []);

  useEffect(() => {
    let rendez = false;
    const lis = () => {
      rendez = false;
      const z = zone.current;
      if (!z) return;
      const b = z.getBoundingClientRect();
      const course = b.height - window.innerHeight;
      const u = course > 0 ? Math.min(1, Math.max(0, -b.top / course)) : 0;
      setP(u);
      setN(Math.min(total - 1, Math.floor(u * total)));
    };
    const plan = () => {
      if (!rendez) {
        rendez = true;
        requestAnimationFrame(lis);
      }
    };
    window.addEventListener("scroll", plan, { passive: true });
    window.addEventListener("resize", plan);
    lis();
    return () => {
      window.removeEventListener("scroll", plan);
      window.removeEventListener("resize", plan);
    };
  }, [total]);

  const saute = (i: number) => {
    const z = zone.current;
    if (!z) return;
    const course = z.offsetHeight - window.innerHeight;
    window.scrollTo({ top: z.offsetTop + ((i + 0.5) / total) * course, behavior: "smooth" });
  };

  const d = n < DIRECT.length ? DIRECT[n] : null;

  return (
    <section
      ref={zone}
      className="ax-cles" id="direct"
      style={{ height: `${total * 58 + 40}vh`, "--p": p, "--t": n } as React.CSSProperties}
      aria-label="Données en temps réel"
    >
      <div className="ax-cles-col">
        <div className="ax-cles-lueur" aria-hidden="true" />
        <div className="ax-cles-g">
          <div className="ax-cles-gauche">
            <p className="ax-etiq">{d ? "En temps réel" : "Ce que nous faisons"}</p>
            <div key={n} className="ax-cles-bloc">
              {d ? (
                <>
                  <p className="ax-cles-v ax-cles-v-d">
                    <Odometre
                      valeur={0}
                      parSeconde={"parSeconde" in d ? d.parSeconde : pib.total / AN_SECONDES}
                      depuis={"parSeconde" in d ? departDepenses : departAnnee}
                      dec={d.dec}
                      unite={d.unite}
                    />
                  </p>
                  <p className="ax-cles-n">{d.nom}</p>
                  <p className="ax-cles-note">{d.note}</p>
                </>
              ) : (
                <>
                  <p className="ax-cles-v ax-cles-v-t">Recoupé, daté, sourcé.</p>
                  <p className="ax-cles-n">Un chiffre n&apos;est publié que s&apos;il a été vu par plusieurs sources.</p>
                  <p className="ax-cles-note">
                    Banque mondiale, FMI, Nations Unies, INSEE : chaque donnée garde sa source et sa date,
                    et une valeur absente reste absente.
                  </p>
                </>
              )}
            </div>
          </div>
          <ol className="ax-cles-liste" aria-label="Choisir un chiffre">
            {[...DIRECT.map((x) => x.nom), "Ce que nous faisons"].map((nom, i) => (
              <li key={nom}>
                <button type="button" className={i === n ? "ax-cles-on" : undefined} onClick={() => saute(i)}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {nom}
                </button>
              </li>
            ))}
          </ol>
        </div>
        <div className="ax-cles-rail" aria-hidden="true">
          <span style={{ transform: `scaleX(${p})` }} />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   3 · LES CLASSEMENTS — le podium en haut, la suite en dessous, le tout défile
   ═══════════════════════════════════════════════════════════════════════════ */

const INDICS = [
  { id: "pib", label: "PIB", titre: "Les plus grandes économies", unite: "md" },
  { id: "pibHab", label: "PIB par habitant", titre: "Les pays les plus riches par habitant", unite: "usd" },
  { id: "dette", label: "Dette publique", titre: "Les pays les plus endettés", unite: "pct" },
  { id: "population", label: "Population", titre: "Les pays les plus peuplés", unite: "hab" },
] as const;

function fmt(v: number, u: (typeof INDICS)[number]["unite"]) {
  if (u === "hab") return `${nf(v, v >= 100 ? 0 : 1)} M`;
  if (u === "pct") return `${nf(v)} %`;
  if (u === "usd") return `${Math.round(v).toLocaleString("fr-FR")} $`;
  return fmtPib(v);
}

function Classements({ donnees, annee }: { donnees: Record<string, FichePays>; annee: number }) {
  const fiches = useMemo(
    () =>
      INDICS.map((ind) => {
        const l = Object.values(donnees)
          .map((d) => ({ fr: d.fr, v: d[ind.id] ?? null }))
          .filter((o): o is { fr: string; v: number } => typeof o.v === "number" && Number.isFinite(o.v))
          .sort((a, b) => b.v - a.v)
          .slice(0, 10);
        return { ...ind, lignes: l };
      }),
    [donnees],
  );

  const zone = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);
  const [p, setP] = useState(0);
  const [plus, setPlus] = useState(false);
  useEffect(() => {
    let rendez = false;
    const lis = () => {
      rendez = false;
      const z = zone.current;
      if (!z) return;
      const b = z.getBoundingClientRect();
      const course = b.height - window.innerHeight;
      const u = course > 0 ? Math.min(1, Math.max(0, -b.top / course)) : 0;
      setP(u);
      setN(Math.min(fiches.length - 1, Math.floor(u * fiches.length)));
    };
    const plan = () => {
      if (!rendez) {
        rendez = true;
        requestAnimationFrame(lis);
      }
    };
    window.addEventListener("scroll", plan, { passive: true });
    window.addEventListener("resize", plan);
    lis();
    return () => {
      window.removeEventListener("scroll", plan);
      window.removeEventListener("resize", plan);
    };
  }, [fiches.length]);

  const f = fiches[n];
  const haut = f.lignes.slice(0, 3);
  /* Le podium se lit 2 · 1 · 3 : le premier au milieu, plus haut. */
  const ordre = [haut[1], haut[0], haut[2]].filter(Boolean);
  const suite = f.lignes.slice(3, plus ? 10 : 6);

  return (
    <section
      ref={zone}
      className="ax-cl2"
      id="classements"
      style={{ height: `${fiches.length * 50 + 40}vh` }}
      aria-labelledby="ax-cl-t"
    >
      <div className="ax-cl2-colle">
        <div className="ax-cl2-g">
          <div className="ax-cl2-gauche">
            <h2 id="ax-cl-t" className="ax-h2">Nos classements</h2>
            {/* Les titres ne se cliquent pas : ils suivent le défilement. */}
            <ol className="ax-cl2-liste">
              {fiches.map((x, i) => (
                <li key={x.id} className={i === n ? "ax-cl2-on" : i < n ? "ax-cl2-fait" : undefined}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {x.label}
                </li>
              ))}
            </ol>
            <div className="ax-cl2-rail" aria-hidden="true"><span style={{ transform: `scaleY(${p})` }} /></div>
          </div>

          <div key={f.id} className="ax-cl2-carte">
            <p className="ax-cl2-t">{f.titre}</p>
            <div className="ax-pod2">
              {ordre.map((o) => {
                const rang = haut.indexOf(o) + 1;
                return (
                  <div key={o.fr} className={`ax-pod2-c ax-pod2-${rang}`}>
                    <span className="ax-pod2-r">{rang}</span>
                    <span className="ax-pod2-n">{o.fr}</span>
                    <span className="ax-pod2-v">{fmt(o.v, f.unite)}</span>
                  </div>
                );
              })}
            </div>
            <ol className="ax-suite" start={4}>
              {suite.map((o, i) => (
                <li key={o.fr} style={{ "--i": i } as React.CSSProperties}>
                  <span className="ax-suite-r">{i + 4}</span>
                  <span className="ax-suite-n">{o.fr}</span>
                  <span className="ax-suite-v">{fmt(o.v, f.unite)}</span>
                </li>
              ))}
            </ol>
            <div className="ax-cl2-pied">
              <p className="ax-source">Banque mondiale (WDI), FMI · {annee}</p>
              <button type="button" className="ax-voir" onClick={() => setPlus(!plus)} aria-expanded={plus}>
                {plus ? "Réduire" : "En voir plus"}
                <ChevronDown size={14} aria-hidden="true" className={plus ? "ax-voir-ouv" : undefined} />
              </button>
              <a className="ax-voir ax-voir-l" href="/economie">
                Classement complet <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   4 · NOS GLOBES INTERACTIFS
   ═══════════════════════════════════════════════════════════════════════════ */

function Cartes() {
  const items = [
    { href: "/economie", classe: "eco", titre: "Économie", ligne: "PIB, dette, chômage, inflation, balance. 200 pays, de 1960 à aujourd'hui.", icone: Landmark },
    { href: "/demographie", classe: "dem", titre: "Démographie", ligne: "Population, naissances, décès et causes de mortalité, en temps réel.", icone: Users },
  ];
  return (
    <section className="ax-sec ax-sec-large" id="cartes" aria-labelledby="ax-ca-t">
      <Rev as="h2" className="ax-h2">
        <span id="ax-ca-t">Nos globes interactifs</span>
      </Rev>
      <div className="ax-cartes">
        {items.map((g, i) => {
          const Ic = g.icone;
          return (
            <Rev key={g.href} as="a" href={g.href} className={`ax-globe ax-globe-${g.classe}`} d={i * 120}>
              <span className="ax-sph" aria-hidden="true"><i /><b /></span>
              <span className="ax-globe-i"><Ic size={18} aria-hidden="true" /></span>
              <h3>{g.titre}</h3>
              <p>{g.ligne}</p>
              <span className="ax-globe-cta">
                Ouvrir le globe <ArrowUpRight size={15} aria-hidden="true" />
              </span>
            </Rev>
          );
        })}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   5 · NOS CHIFFRES ANALYSÉS
   ═══════════════════════════════════════════════════════════════════════════ */

function Dossiers({ dette }: { dette: Props["dette"] }) {
  return (
    <section className="ax-sec" id="dossiers" aria-labelledby="ax-do-t">
      <Rev as="h2" className="ax-h2">
        <span id="ax-do-t">Nos chiffres analysés</span>
      </Rev>
      <div className="ax-dossiers">
        <Rev as="a" href="/france/economie/dette-publique-v2" className="ax-dos ax-dos-une" d={0}>
          <span className="ax-dos-e">Dette publique · France</span>
          <p className="ax-dos-v">
            {nf(dette.montant)}
            <small>Md€</small>
          </p>
          <p className="ax-dos-s">{nf(dette.ratio)} % du PIB · déficit de {nf(dette.deficit)} Md€ en 2025</p>
          <span className="ax-dos-c">
            Lire l&apos;analyse <ArrowRight size={15} aria-hidden="true" />
          </span>
        </Rev>
        {["PIB mondial", "Emploi dans le monde", "Natalité mondiale"].map((t, i) => (
          <Rev key={t} className="ax-dos ax-dos-bientot" d={120 + i * 80}>
            <span className="ax-dos-e">Bientôt</span>
            <h3>{t}</h3>
          </Rev>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   5 bis · NOS ARTICLES, PAR CATÉGORIE
   ═══════════════════════════════════════════════════════════════════════════ */

const CATEGORIES = [
  {
    nom: "Économie",
    articles: [
      { titre: "Dette publique de la France : les montants et qui la détient", href: "/france/economie/dette-publique-v2" },
      { titre: "La dette publique pas à pas, en lecture longue", href: "/france/economie/dette-publique" },
      { titre: "PIB mondial : qui produit quoi" },
    ],
  },
  {
    nom: "Démographie",
    articles: [
      { titre: "Naissances et décès dans le monde, depuis le 1er janvier" },
      { titre: "Les causes de mortalité, pays par pays" },
      { titre: "Population : qui grandit, qui recule" },
    ],
  },
] as const;

function Articles() {
  const [c, setC] = useState(0);
  const cat = CATEGORIES[c];
  return (
    <section className="ax-sec" id="articles" aria-labelledby="ax-ar-t">
      <Rev as="h2" className="ax-h2">
        <span id="ax-ar-t">Nos articles</span>
      </Rev>
      <Rev className="ax-tabs" d={80}>
        <div role="tablist" aria-label="Catégorie">
          {CATEGORIES.map((x, i) => (
            <button key={x.nom} type="button" role="tab" aria-selected={i === c} className={i === c ? "ax-tab-on" : undefined} onClick={() => setC(i)}>
              {x.nom}
            </button>
          ))}
        </div>
      </Rev>
      <ul key={cat.nom} className="ax-arts">
        {cat.articles.map((a, i) => {
          const lien = "href" in a ? a.href : undefined;
          const corps = (
            <>
              <span className="ax-art-n">{String(i + 1).padStart(2, "0")}</span>
              <span className="ax-art-t">{a.titre}</span>
              {lien ? <ArrowUpRight size={18} aria-hidden="true" /> : <em>Bientôt</em>}
            </>
          );
          return (
            <li key={a.titre} style={{ "--i": i } as React.CSSProperties}>
              {lien ? <a href={lien}>{corps}</a> : <div className="ax-art-bientot">{corps}</div>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   6 · NOTRE FONCTIONNEMENT — une ligne qui se remplit, des sources qui défilent
   ═══════════════════════════════════════════════════════════════════════════ */

const SOURCES_DEFILE = [
  "Banque mondiale",
  "FMI",
  "Nations Unies",
  "INSEE",
  "Eurostat",
  "OCDE",
  "Banque de France",
  "Agence France Trésor",
  "OMS",
  "OIT",
];

function Fonctionnement() {
  const zone = useRef<HTMLOListElement>(null);

  useEffect(() => {
    let rendez = false;
    const lis = () => {
      rendez = false;
      const z = zone.current;
      if (!z) return;
      const b = z.getBoundingClientRect();
      const u = Math.min(1, Math.max(0, (window.innerHeight * 0.62 - b.top) / b.height));
      z.style.setProperty("--ligne", u.toFixed(3));
      z.querySelectorAll<HTMLElement>("li").forEach((li, i, tous) => {
        const seuil = (i + 0.4) / tous.length;
        li.toggleAttribute("data-atteint", u >= seuil);
      });
    };
    const plan = () => {
      if (!rendez) {
        rendez = true;
        requestAnimationFrame(lis);
      }
    };
    window.addEventListener("scroll", plan, { passive: true });
    window.addEventListener("resize", plan);
    lis();
    return () => {
      window.removeEventListener("scroll", plan);
      window.removeEventListener("resize", plan);
    };
  }, []);

  return (
    <section className="ax-sec" id="fonctionnement" aria-labelledby="ax-fo-t">
      <Rev as="h2" className="ax-h2">
        <span id="ax-fo-t">Notre fonctionnement</span>
      </Rev>
      <Rev as="p" className="ax-sous" d={80}>
        Rien ne sort qui n&apos;ait été vu par plusieurs sources. Les convergences font la donnée, les
        divergences font l&apos;article.
      </Rev>

      <div className="ax-defile" aria-label="Nos sources">
        <div className="ax-defile-p">
          {[...SOURCES_DEFILE, ...SOURCES_DEFILE].map((s, i) => (
            <span key={`${s}-${i}`} aria-hidden={i >= SOURCES_DEFILE.length ? "true" : undefined}>
              {s}
            </span>
          ))}
        </div>
      </div>

      <ol ref={zone} className="ax-etapes">
        <span className="ax-etapes-fil" aria-hidden="true" />
        {ETAPES.map((e) => (
          <li key={e.n}>
            <span className="ax-etape-p">
              <Check size={14} aria-hidden="true" />
            </span>
            <div className="ax-etape-c">
              <span className="ax-etape-n">{e.n}</span>
              <h3>{e.titre}</h3>
              <p>{e.ligne}</p>
            </div>
          </li>
        ))}
      </ol>

      <Rev className="ax-sortie">
        <Sparkles size={22} aria-hidden="true" />
        <p>
          <b>Visualize</b> : recoupé, daté, sourcé.
        </p>
        <span>100 % gratuit pour nos lecteurs</span>
      </Rev>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LA PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

export function AnalysesPage(props: Props) {
  const racine = useRef<HTMLDivElement>(null);
  useApparitions(racine);

  return (
    <div className="cg ax" ref={racine}>
      <EnTete actif="Analyses" />
      <div className="ax-fond" aria-hidden="true" />

      <Ouverture {...props} />
      <div className="ax-col ax-col-haut">
        <Presentation />
      </div>
      <EnDirect pib={props.pib} />

      <div className="ax-col">
        <Classements donnees={props.donnees} annee={props.annee} />
        <Cartes />
        <Dossiers dette={props.dette} />
        <Articles />
        <Rev className="ax-presse">
          <PresseCarousel
            id="presse"
            titre="Ils en parlent"
            intro="Les grands médias qui traitent de ces sujets : nos sources, et de quoi aller plus loin."
            citations={PRESSE_MONDE}
          />
        </Rev>
        <Fonctionnement />

        <Rev className="ax-fin">
          <h2>Prêt à explorer ?</h2>
          <div>
            <a className="ax-bouton ax-bouton-blanc" href="/economie">
              <Globe size={17} aria-hidden="true" /> Globe économie
            </a>
            <a className="ax-bouton ax-bouton-clair" href="/demographie">
              <Users size={17} aria-hidden="true" /> Globe démographie
            </a>
          </div>
        </Rev>
      </div>

      <Pied />
    </div>
  );
}
