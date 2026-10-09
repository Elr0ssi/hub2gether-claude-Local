"use client";

import dynamic from "next/dynamic";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Banknote,
  Check,
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
}: {
  children: React.ReactNode;
  d?: number;
  className?: string;
  as?: "div" | "li" | "article" | "p" | "h2" | "a";
}) {
  const T = Tag as React.ElementType;
  return (
    <T data-rev="" className={className} style={{ "--d": `${d}ms` } as React.CSSProperties}>
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
   1 · L'OUVERTURE — un titre, une phrase, et un globe entouré de petits chiffres
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
        .sort((a, b) => b.pib - a.pib)
        .slice(0, 5),
    [donnees],
  );
  const hauteur = top.length ? top[0].pib : 1;
  const pibMonde = reperes.find((r) => r.nom === "PIB mondial");
  const pop = reperes.find((r) => r.nom === "Population");

  /* Le globe arrive après le titre ; sa teinte suit le thème du site. */
  const [globe, setGlobe] = useState(false);
  const [sombre, setSombre] = useState(true);
  useEffect(() => {
    const t = window.setTimeout(() => setGlobe(true), 700);
    const lit = () => setSombre(document.documentElement.dataset.concept !== "clair");
    lit();
    const o = new MutationObserver(lit);
    o.observe(document.documentElement, { attributes: true, attributeFilter: ["data-concept"] });
    return () => {
      window.clearTimeout(t);
      o.disconnect();
    };
  }, []);

  return (
    <header className="ax-ouv">
      <div className="ax-ouv-g">
        <div className="ax-ouv-t">
          <h1 className="ax-h1">
            <Mots texte="Le monde en chiffres," />
            <br />
            <span className="ax-h1-v">
              <Mots texte="sans le bruit." depart={4} />
            </span>
          </h1>
          <p className="ax-ouv-s ax-in" style={{ "--d": "600ms" } as React.CSSProperties}>
            PIB, dette, chômage, population : plus de 200 pays à lire d&apos;un coup d&apos;œil.
          </p>
          <div className="ax-ouv-c ax-in" style={{ "--d": "750ms" } as React.CSSProperties}>
            <a className="ax-bouton ax-bouton-vif" href="/economie">
              Explorer le globe <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="ax-globe-zone">
          <div className="ax-globe-c" aria-hidden="true">
            {globe && (
              <GlobePoints
                markers={[]}
                sphereColor={sombre ? "#0b1210" : undefined}
                badgeBackground={sombre ? "rgba(10,16,14,0.88)" : undefined}
              />
            )}
          </div>

          {/* De petites cartes qui gravitent autour du globe. */}
          <div className="ax-mini ax-mini-a ax-in" style={{ "--d": "1000ms" } as React.CSSProperties}>
            <span>Cinq premières économies</span>
            <ul>
              {top.map((p, i) => (
                <li key={p.fr}>
                  <em>{p.fr}</em>
                  <i style={{ "--w": `${(p.pib / hauteur) * 100}%`, "--i": i } as React.CSSProperties} />
                </li>
              ))}
            </ul>
          </div>
          <div className="ax-mini ax-mini-b ax-in" style={{ "--d": "1150ms" } as React.CSSProperties}>
            <span>PIB mondial · {annee}</span>
            <b>{pibMonde?.valeur ?? "—"}</b>
          </div>
          <div className="ax-mini ax-mini-c ax-in" style={{ "--d": "1300ms" } as React.CSSProperties}>
            <span>Population</span>
            <b>{pop?.valeur ?? "—"}</b>
          </div>
          <span className="ax-puce ax-puce-1 ax-in" style={{ "--d": "1450ms" } as React.CSSProperties}>
            <Activity size={13} /> 200+ pays
          </span>
          <span className="ax-puce ax-puce-2 ax-in" style={{ "--d": "1600ms" } as React.CSSProperties}>
            <Banknote size={13} /> France · {nf(dette.ratio)} % du PIB
          </span>
        </div>
      </div>
    </header>
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
      className="ax-cles"
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
   3 · LES CLASSEMENTS — la page s'arrête, on défile, le classement change
   ═══════════════════════════════════════════════════════════════════════════ */

const INDICS = [
  { id: "pib", label: "PIB", titre: "Les plus grandes économies", unite: "md" },
  { id: "pibHab", label: "PIB par habitant", titre: "Les pays les plus riches par habitant", unite: "usd" },
  { id: "dette", label: "Dette publique", titre: "Les pays les plus endettés", unite: "pct" },
  { id: "chomage", label: "Chômage", titre: "Le chômage le plus élevé", unite: "pct" },
  { id: "inflation", label: "Inflation", titre: "L'inflation la plus forte", unite: "pct" },
  { id: "population", label: "Population", titre: "Les pays les plus peuplés", unite: "hab" },
] as const;

function fmt(v: number, u: (typeof INDICS)[number]["unite"]) {
  if (u === "hab") return `${nf(v, v >= 100 ? 0 : 1)} M`;
  if (u === "pct") return `${nf(v)} %`;
  if (u === "usd") return `${Math.round(v).toLocaleString("fr-FR")} $`;
  return Math.abs(v) >= 1000 ? `${nf(v / 1000)} T$` : `${Math.round(v).toLocaleString("fr-FR")} Md$`;
}

function Classements({ donnees, annee }: { donnees: Record<string, FichePays>; annee: number }) {
  const fiches = useMemo(
    () =>
      INDICS.map((ind) => {
        const l = Object.values(donnees)
          .map((d) => ({ fr: d.fr, v: d[ind.id] ?? null }))
          .filter((o): o is { fr: string; v: number } => typeof o.v === "number" && Number.isFinite(o.v))
          .sort((a, b) => b.v - a.v)
          .slice(0, 5);
        const haut = l.length ? Math.max(...l.map((o) => Math.abs(o.v))) : 1;
        return { ...ind, lignes: l.map((o) => ({ ...o, part: Math.abs(o.v) / haut })) };
      }),
    [donnees],
  );

  const zone = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);
  const [p, setP] = useState(0);
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

  return (
    <section
      ref={zone}
      className="ax-cl2"
      id="classements"
      style={{ height: `${fiches.length * 46 + 40}vh` }}
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
            <ol>
              {f.lignes.map((o, i) => (
                <li key={o.fr} style={{ "--i": i } as React.CSSProperties}>
                  <span className="ax-cl2-r">{i + 1}</span>
                  <span className="ax-cl2-n">{o.fr}</span>
                  <span className="ax-cl2-b"><i style={{ "--w": `${o.part * 100}%` } as React.CSSProperties} /></span>
                  <span className="ax-cl2-v">{fmt(o.v, f.unite)}</span>
                </li>
              ))}
            </ol>
            <p className="ax-source">Banque mondiale (WDI), FMI · {annee}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   4 · LES CARTES
   ═══════════════════════════════════════════════════════════════════════════ */

function Cartes() {
  return (
    <section className="ax-sec" id="cartes" aria-labelledby="ax-ca-t">
      <Rev as="h2" className="ax-h2">
        <span id="ax-ca-t">Nos globes interactifs</span>
      </Rev>
      <div className="ax-cartes">
        <Rev as="a" className="ax-globe ax-globe-eco" d={0}>
          <span className="ax-orbites" aria-hidden="true">
            <i /> <i /> <i />
            <b />
          </span>
          <Landmark size={22} className="ax-ico" aria-hidden="true" />
          <h3>Économie</h3>
          <p>PIB, dette, chômage, inflation et balance de 200 pays, de 1960 à aujourd&apos;hui.</p>
          <ul>
            <li>PIB</li>
            <li>Dette</li>
            <li>Chômage</li>
            <li>Inflation</li>
          </ul>
          <span className="ax-globe-c">
            Ouvrir le globe <ArrowUpRight size={16} aria-hidden="true" />
          </span>
        </Rev>
        <Rev as="a" className="ax-globe ax-globe-dem" d={120}>
          <span className="ax-orbites" aria-hidden="true">
            <i /> <i /> <i />
            <b />
          </span>
          <Users size={22} className="ax-ico" aria-hidden="true" />
          <h3>Démographie</h3>
          <p>Population, naissances, décès et causes de mortalité, en temps réel depuis le 1er janvier.</p>
          <ul>
            <li>Population</li>
            <li>Natalité</li>
            <li>Mortalité</li>
            <li>Causes</li>
          </ul>
          <span className="ax-globe-c">
            Ouvrir le globe <ArrowUpRight size={16} aria-hidden="true" />
          </span>
        </Rev>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   5 · LES DOSSIERS
   ═══════════════════════════════════════════════════════════════════════════ */

function Dossiers({ dette }: { dette: Props["dette"] }) {
  return (
    <section className="ax-sec" id="dossiers" aria-labelledby="ax-do-t">
      <Rev as="h2" className="ax-h2">
        <span id="ax-do-t">Nos chiffres décortiqués</span>
      </Rev>
      <div className="ax-dossiers">
        <Rev as="a" className="ax-dos ax-dos-une" d={0}>
          <span className="ax-dos-e">France · Économie</span>
          <h3>Dette publique</h3>
          <p className="ax-dos-v">
            {nf(dette.montant)}
            <small>Md€</small>
          </p>
          <p className="ax-dos-s">{nf(dette.ratio)} % du PIB · déficit de {nf(dette.deficit)} Md€ en 2025</p>
          <span className="ax-dos-c">
            Lire le dossier <ArrowRight size={16} aria-hidden="true" />
          </span>
        </Rev>

        <Rev as="a" className="ax-dos ax-dos-forum" d={100} >
          <MessageCircle size={22} className="ax-ico" aria-hidden="true" />
          <h3>Le forum</h3>
          <p>Posez vos questions, débattez des chiffres du jour.</p>
          <ArrowUpRight className="ax-dos-fl" size={20} aria-hidden="true" />
        </Rev>

        {["PIB mondial", "Emploi", "Natalité"].map((t, i) => (
          <Rev key={t} className="ax-dos ax-dos-bientot" d={160 + i * 80}>
            <span className="ax-dos-e">Bientôt</span>
            <h3>{t}</h3>
          </Rev>
        ))}
      </div>
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
      <EnDirect pib={props.pib} />

      <div className="ax-col">
        <Classements donnees={props.donnees} annee={props.annee} />
        <Cartes />
        <Dossiers dette={props.dette} />
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
