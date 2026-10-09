"use client";

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
   1 · L'OUVERTURE
   ═══════════════════════════════════════════════════════════════════════════ */

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
          <p className="ax-ouv-s ax-in" style={{ "--d": "700ms" } as React.CSSProperties}>
            PIB, dette, chômage et population de plus de 200 pays. Des cartes qui se lisent d&apos;un
            coup d&apos;œil, des dossiers qui vont droit au montant.
          </p>
          <div className="ax-ouv-c ax-in" style={{ "--d": "850ms" } as React.CSSProperties}>
            <a className="ax-bouton ax-bouton-vif" href="/economie">
              Explorer le globe <ArrowRight size={17} aria-hidden="true" />
            </a>
            <a className="ax-bouton" href="/france/economie/dette-publique-v2">
              Lire le dossier dette
            </a>
          </div>
        </div>

        {/* La scène : des cartes qui se posent l'une après l'autre, puis
            flottent. */}
        <div className="ax-scene" aria-hidden="true">
          <div className="ax-sc ax-sc-a ax-in" style={{ "--d": "500ms" } as React.CSSProperties}>
            <span className="ax-sc-l">PIB mondial · {annee}</span>
            <p className="ax-sc-v">{pibMonde?.valeur ?? "—"}</p>
            <span className="ax-sc-n">{pibMonde?.note}</span>
          </div>

          <div className="ax-sc ax-sc-b ax-in" style={{ "--d": "700ms" } as React.CSSProperties}>
            <span className="ax-sc-l">Les cinq premières économies</span>
            <ul>
              {top.map((p, i) => (
                <li key={p.fr}>
                  <span>{p.fr}</span>
                  <i style={{ "--w": `${(p.pib / hauteur) * 100}%`, "--i": i } as React.CSSProperties} />
                </li>
              ))}
            </ul>
          </div>

          <div className="ax-sc ax-sc-c ax-in" style={{ "--d": "900ms" } as React.CSSProperties}>
            <span className="ax-sc-l">Population</span>
            <p className="ax-sc-v ax-sc-v-s">{pop?.valeur ?? "—"}</p>
          </div>

          <span className="ax-puce ax-puce-1 ax-in" style={{ "--d": "1100ms" } as React.CSSProperties}>
            <Banknote size={14} /> France · {nf(dette.ratio)} % du PIB
          </span>
          <span className="ax-puce ax-puce-2 ax-in" style={{ "--d": "1250ms" } as React.CSSProperties}>
            <Activity size={14} /> 200+ pays
          </span>
        </div>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   2 · LES CHIFFRES CLÉS — la page s'arrête, les chiffres défilent
   ═══════════════════════════════════════════════════════════════════════════ */

function ChiffresCles({ reperes }: { reperes: Repere[] }) {
  const etapes = reperes.slice(0, 6);
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
      setN(Math.min(etapes.length - 1, Math.floor(u * etapes.length)));
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
  }, [etapes.length]);

  const saute = (i: number) => {
    const z = zone.current;
    if (!z) return;
    const course = z.offsetHeight - window.innerHeight;
    window.scrollTo({ top: z.offsetTop + ((i + 0.5) / etapes.length) * course, behavior: "smooth" });
  };

  if (!etapes.length) return null;
  const e = etapes[n];

  return (
    <section
      ref={zone}
      className="ax-cles"
      style={{ height: `${etapes.length * 62 + 38}vh`, "--p": p, "--t": n } as React.CSSProperties}
      aria-label="Les chiffres du monde"
    >
      <div className="ax-cles-col">
        <div className="ax-cles-lueur" aria-hidden="true" />
        <div className="ax-cles-g">
          <div className="ax-cles-gauche">
            <p className="ax-etiq">Le monde, en ce moment</p>
            <div key={n} className="ax-cles-bloc">
              <p className="ax-cles-v">
                <Monte texte={e.valeur} />
              </p>
              <p className="ax-cles-n">{e.nom}</p>
              <p className="ax-cles-note">{e.note}</p>
            </div>
          </div>
          <ol className="ax-cles-liste" aria-label="Choisir un chiffre">
            {etapes.map((r, i) => (
              <li key={r.nom}>
                <button type="button" className={i === n ? "ax-cles-on" : undefined} onClick={() => saute(i)}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {r.nom}
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
   3 · LES CLASSEMENTS
   ═══════════════════════════════════════════════════════════════════════════ */

const INDICS = [
  { id: "pib", label: "PIB", titre: "Les plus grandes économies", unite: "md" },
  { id: "pibHab", label: "PIB par habitant", titre: "Les pays les plus riches par habitant", unite: "usd" },
  { id: "dette", label: "Dette", titre: "Les pays les plus endettés", unite: "pct" },
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
  const [id, setId] = useState<(typeof INDICS)[number]["id"]>("pib");
  const ind = INDICS.find((i) => i.id === id)!;

  const lignes = useMemo(() => {
    const l = Object.values(donnees)
      .map((d) => ({ fr: d.fr, v: d[id] ?? null }))
      .filter((o): o is { fr: string; v: number } => typeof o.v === "number" && Number.isFinite(o.v))
      .sort((a, b) => b.v - a.v)
      .slice(0, 8);
    const haut = l.length ? Math.max(...l.map((o) => Math.abs(o.v))) : 1;
    return l.map((o) => ({ ...o, part: Math.abs(o.v) / haut }));
  }, [donnees, id]);

  const [podium, reste] = [lignes.slice(0, 3), lignes.slice(3)];
  /* Le podium se lit dans l'ordre 2, 1, 3 : le premier au milieu, plus haut. */
  const ordre = [podium[1], podium[0], podium[2]].filter(Boolean);

  return (
    <section className="ax-sec" id="classements" aria-labelledby="ax-cl-t">
      <Rev as="h2" className="ax-h2">
        <span id="ax-cl-t">Classements</span>
      </Rev>
      <Rev className="ax-tabs" d={80}>
        <div role="tablist" aria-label="Indicateur">
          {INDICS.map((i) => (
            <button
              key={i.id}
              type="button"
              role="tab"
              aria-selected={i.id === id}
              className={i.id === id ? "ax-tab-on" : undefined}
              onClick={() => setId(i.id)}
            >
              {i.label}
            </button>
          ))}
        </div>
      </Rev>

      <div key={id} className="ax-cl">
        <h3 className="ax-cl-t">{ind.titre}</h3>
        <div className="ax-podium">
          {ordre.map((o) => {
            const rang = podium.indexOf(o) + 1;
            return (
              <div key={o.fr} className={`ax-pod ax-pod-${rang}`}>
                <span className="ax-pod-r">{rang}</span>
                <span className="ax-pod-n">{o.fr}</span>
                <span className="ax-pod-v">{fmt(o.v, ind.unite)}</span>
              </div>
            );
          })}
        </div>
        <ol className="ax-liste" start={4}>
          {reste.map((o, i) => (
            <li key={o.fr} style={{ "--i": i } as React.CSSProperties}>
              <span className="ax-liste-r">{i + 4}</span>
              <span className="ax-liste-n">{o.fr}</span>
              <span className="ax-liste-b">
                <i style={{ "--w": `${o.part * 100}%` } as React.CSSProperties} />
              </span>
              <span className="ax-liste-v">{fmt(o.v, ind.unite)}</span>
            </li>
          ))}
        </ol>
        <p className="ax-source">Banque mondiale (WDI), FMI · {annee}</p>
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
        <span id="ax-ca-t">Deux globes, deux lectures</span>
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
        <span id="ax-do-t">Dossiers</span>
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
      <ChiffresCles reperes={props.reperes} />

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
