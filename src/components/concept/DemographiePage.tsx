"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SocleDemo } from "@/data/concept/conceptDemographie";
import type { DemographyMetricId, DemographyYear } from "@/data/demographie/demographie";
import { Dessin, Jetons } from "./Jetons";
import { Enseigne, EnTete, Pied } from "./pieces";
import { Loupe } from "./Loupe";
import { Odometre, gelerOdometres } from "./Roulement";
import { Lettres } from "./Lettres";
import { GlobeDemographie, TOUTES } from "./GlobeDemographie";
import { Titre, useProgression, useVu } from "./EconomiePage";
import { cle } from "@/data/concept/cle";
import "./concept.css";

/* ═══════════════════════════════════════════════════════════════════════════
   LA PAGE DÉMOGRAPHIE DU PROTOTYPE

   Même langage que la page Économie — même en-tête, même bandeau en direct,
   même globe, même classement — mais une seule matière : le socle des
   Nations Unies (World Population Prospects 2024), 1960 à 2026. Il ne porte
   aucune saisie manuelle : une année qu'une source ne publie pas pour un
   pays reste absente, elle ne devient jamais zéro.

   Pas de monnaie ici : une population ne se convertit pas. Pas d'article
   éditorial non plus — le sujet attend la répartition par âge et la base de
   mortalité annoncées pour la suite.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface CompteurDemoProps {
  annee: number;
  population: number;
  naissancesParSeconde: number;
  decesParSeconde: number;
  nPays: number;
}

export interface DemoProps {
  socle: SocleDemo;
  compteur: CompteurDemoProps;
}

type Rang = { nom: string; fr: string } & Record<DemographyMetricId, number | null>;
type Unite = "hab" | "pour1000";

const COLONNES: { id: DemographyMetricId; label: string; unite: Unite }[] = [
  { id: "population", label: "Population", unite: "hab" },
  { id: "birth_rate", label: "Natalité", unite: "pour1000" },
  { id: "death_rate", label: "Mortalité", unite: "pour1000" },
  { id: "natural_change", label: "Accroissement naturel", unite: "hab" },
  { id: "net_migration", label: "Solde migratoire", unite: "hab" },
];

function val(v: number | null, unite: Unite): string {
  if (v === null) return "n.d.";
  if (unite === "pour1000") return `${v.toFixed(1).replace(".", ",")} ‰`;
  const a = Math.abs(v);
  if (a >= 1e6) return `${(v / 1e6).toFixed(2).replace(".", ",")} M`;
  if (a >= 1e3) return `${(v / 1e3).toFixed(1).replace(".", ",")} k`;
  return Math.round(v).toLocaleString("fr-FR");
}

/* ═══════════════════════════════════════════════════════════════════════════
   LE BANDEAU EN TEMPS RÉEL

   La population mondiale part de son dernier total publié et grandit au
   rythme des naissances et des décès de cette même année, comptés depuis le
   1er janvier — la même règle que le produit intérieur brut sur la page
   Économie : rien n'est mesuré à la seconde, une grandeur annuelle est
   étalée sur l'année en cours. ═══════════════════════════════════════════ */
function TempsReelDemo({ compteur }: { compteur: CompteurDemoProps }) {
  const departAnnee = useMemo(() => {
    const t = new Date(new Date().getFullYear(), 0, 1).getTime();
    return performance.now() - (Date.now() - t);
  }, []);
  const accroissement = compteur.naissancesParSeconde - compteur.decesParSeconde;

  return (
    <section className="cg-section" id="temps-reel-demo">
      <div className="cg-wrap">
        <Enseigne
          droite={
            <span className="cg-demo-mini">
              Depuis le 1<sup>er</sup> janvier {new Date().getFullYear()}
            </span>
          }
        >
          <span className="cg-point-vif" aria-hidden="true" /> Données en temps réel
        </Enseigne>
        <div className="cg-cpt-l" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
          <div className="cg-cpt">
            <span className="cg-cpt-l2">Population mondiale</span>
            <Odometre
              className="cg-cpt-v"
              valeur={compteur.population}
              parSeconde={accroissement}
              depuis={departAnnee}
              dec={0}
              unite=""
            />
            <Lettres base={compteur.population} parSeconde={accroissement} depuis={departAnnee} mot="habitants" />
          </div>
          <div className="cg-cpt">
            <span className="cg-cpt-l2">Naissances dans le monde</span>
            <Odometre
              className="cg-cpt-v"
              valeur={0}
              parSeconde={compteur.naissancesParSeconde}
              depuis={departAnnee}
              dec={0}
              unite=""
            />
            <Lettres base={0} parSeconde={compteur.naissancesParSeconde} depuis={departAnnee} mot="naissances" />
          </div>
          <div className="cg-cpt">
            <span className="cg-cpt-l2">Décès dans le monde</span>
            <Odometre
              className="cg-cpt-v"
              valeur={0}
              parSeconde={compteur.decesParSeconde}
              depuis={departAnnee}
              dec={0}
              unite=""
            />
            <Lettres base={0} parSeconde={compteur.decesParSeconde} depuis={departAnnee} mot="décès" />
          </div>
        </div>
        <p className="sr-only">
          Population mondiale en temps réel, données récentes {compteur.annee} : {compteur.nPays} pays et
          territoires, Nations Unies (World Population Prospects 2024). Naissances dans le monde en temps réel et
          décès dans le monde en temps réel : deux compteurs à débit constant depuis le 1<sup>er</sup> janvier{" "}
          {new Date().getFullYear()}, au rythme publié pour {compteur.annee}.
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LA FRISE

   Plus simple que celle d'Économie : pas de monnaie, donc pas de mise en
   garde sur un taux de change absent, et 2026 est une année publiée comme
   les autres — pas un pas synthétique qui prolongerait la base. ═══════════ */
const FriseDemo = ({
  annees,
  valeur,
  onAnnee,
}: {
  annees: number[];
  valeur: number;
  onAnnee: (a: number) => void;
}) => {
  const [vue, setVue] = useState(valeur);
  const vueRef = useRef(valeur);
  const rail = useRef<HTMLDivElement>(null);
  const tire = useRef(false);
  const attente = useRef<number | null>(null);

  useEffect(() => {
    setVue(valeur);
    vueRef.current = valeur;
  }, [valeur]);
  useEffect(
    () => () => {
      if (attente.current) clearTimeout(attente.current);
      gelerOdometres(false);
    },
    [],
  );

  const vise = useCallback(
    (a: number, tout_de_suite = false) => {
      vueRef.current = a;
      setVue(a);
      if (attente.current) clearTimeout(attente.current);
      if (tout_de_suite) onAnnee(a);
      else attente.current = window.setTimeout(() => onAnnee(a), 110);
    },
    [onAnnee],
  );

  const viseX = (x: number) => {
    const el = rail.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const t = Math.max(0, Math.min(1, (x - r.left) / (r.width || 1)));
    vise(annees[Math.round(t * (annees.length - 1))]);
  };

  const pct = (a: number) => {
    const i = annees.indexOf(a);
    return annees.length < 2 ? 0 : (i / (annees.length - 1)) * 100;
  };

  const jalons = annees.filter((a) => a % 10 === 0 || (a >= 2000 && a % 5 === 0));

  return (
    <div className="cg-frise2">
      <span className="cg-frise2-an">{vue}</span>

      <div className="cg-frise2-piste">
        <div
          ref={rail}
          className="cg-frise2-rail"
          role="slider"
          tabIndex={0}
          aria-label="Date affichée"
          aria-valuemin={annees[0]}
          aria-valuemax={annees[annees.length - 1]}
          aria-valuenow={vue}
          aria-valuetext={String(vue)}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            tire.current = true;
            gelerOdometres(true);
            viseX(e.clientX);
          }}
          onPointerMove={(e) => tire.current && viseX(e.clientX)}
          onPointerUp={() => {
            tire.current = false;
            gelerOdometres(false);
            vise(vueRef.current, true);
          }}
          onPointerCancel={() => {
            tire.current = false;
            gelerOdometres(false);
          }}
          onKeyDown={(e) => {
            const i = annees.indexOf(vueRef.current);
            if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
              e.preventDefault();
              vise(annees[Math.max(0, i - 1)], true);
            } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
              e.preventDefault();
              vise(annees[Math.min(annees.length - 1, i + 1)], true);
            } else if (e.key === "Home") {
              e.preventDefault();
              vise(annees[0], true);
            } else if (e.key === "End") {
              e.preventDefault();
              vise(annees[annees.length - 1], true);
            }
          }}
        >
          <span className="cg-frise2-ligne" aria-hidden="true" />
          <span className="cg-frise2-faite" aria-hidden="true" style={{ width: `${pct(vue)}%` }} />
          {jalons.map((a) => (
            <span key={a} className="cg-frise2-jalon" style={{ left: `${pct(a)}%` }} aria-hidden="true" />
          ))}
          <span className="cg-frise2-point" aria-hidden="true" style={{ left: `${pct(vue)}%` }} />
        </div>

        <div className="cg-frise2-bornes">
          {annees
            .filter((a) => {
              const derniere = annees[annees.length - 1];
              if (a === derniere || a === vue) return true;
              /* Un repère à moins de trois ans du dernier se lirait collé à
                 lui : 2025 et 2026, publiés tous les deux, ne tiennent pas
                 côte à côte sur soixante-six ans de piste. */
              if (Math.abs(a - derniere) <= 3) return false;
              return a % 10 === 0 || (a >= 2000 && a % 5 === 0);
            })
            .map((a) => (
              <button
                key={a}
                type="button"
                className={`cg-frise2-b${a === vue ? " cg-frise2-b-on" : ""}`}
                style={{ left: `${pct(a)}%` }}
                onClick={() => vise(a, true)}
                tabIndex={-1}
              >
                {a}
              </button>
            ))}
        </div>
      </div>

      <p className="cg-frise-n">
        Les dates affichées sont celles publiées par la source. Rien n&apos;est interpolé entre deux repères : une
        année absente reste absente.
      </p>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   LE CLASSEMENT

   Deux cents lignes, cinq colonnes : le cadre ne dessine que ce qui est à
   l'écran, comme sur la page Économie — la même fenêtre glissante, adaptée
   aux cinq indicateurs démographiques plutôt qu'aux dix économiques.
   ═══════════════════════════════════════════════════════════════════════════ */
const MARGE = 8;

function TableauDemo({
  lignes,
  col,
  sens,
  choisi,
  onChoisi,
  onTrier,
}: {
  lignes: Rang[];
  col: DemographyMetricId;
  sens: 1 | -1;
  choisi: string | null;
  onChoisi: (n: string) => void;
  onTrier: (c: DemographyMetricId) => void;
}) {
  const cadre = useRef<HTMLDivElement>(null);
  const [haut, setHaut] = useState(44);
  const [fen, setFen] = useState({ a: 0, b: 30 });

  const mesure = useCallback(() => {
    const el = cadre.current;
    if (!el) return;
    const tr = el.querySelector("tbody tr[data-pays]") as HTMLElement | null;
    const h = tr?.offsetHeight || haut;
    if (h && Math.abs(h - haut) > 0.5) setHaut(h);
    const a = Math.max(0, Math.floor(el.scrollTop / h) - MARGE);
    const b = Math.min(lignes.length, Math.ceil((el.scrollTop + el.clientHeight) / h) + MARGE);
    setFen((p) => (p.a === a && p.b === b ? p : { a, b }));
  }, [haut, lignes.length]);

  useEffect(() => {
    mesure();
    const el = cadre.current;
    if (!el) return;
    const suit = () => mesure();
    el.addEventListener("scroll", suit, { passive: true });
    window.addEventListener("resize", suit);
    return () => {
      el.removeEventListener("scroll", suit);
      window.removeEventListener("resize", suit);
    };
  }, [mesure]);

  useEffect(() => {
    cadre.current?.scrollTo({ top: 0 });
  }, [col, sens, lignes]);

  const a = Math.min(fen.a, Math.max(0, lignes.length - 1));
  const b = Math.min(fen.b, lignes.length);
  const nCol = COLONNES.length + 2;

  return (
    <div className="cg-tab-cadre" ref={cadre} style={{ "--cg-tab-h": `${haut}px` } as React.CSSProperties}>
      <table className="cg-tab">
        <thead>
          <tr>
            <th className="cg-tab-r">#</th>
            <th className="cg-tab-p">Pays</th>
            {COLONNES.map((c) => (
              <th key={c.id}>
                <button
                  type="button"
                  className={`cg-tri${col === c.id ? " cg-tri-on" : ""}`}
                  onClick={() => onTrier(c.id)}
                  aria-sort={col === c.id ? (sens === -1 ? "descending" : "ascending") : "none"}
                >
                  {c.label}
                  <span aria-hidden="true">{col === c.id ? (sens === -1 ? " ↓" : " ↑") : ""}</span>
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {a > 0 && (
            <tr className="cg-tab-cale" aria-hidden="true">
              <td colSpan={nCol} style={{ height: a * haut }} />
            </tr>
          )}
          {lignes.slice(a, b).map((r, i) => (
            <tr key={r.nom} data-pays={r.nom} className={choisi === r.nom ? "cg-tab-on" : undefined} onClick={() => onChoisi(r.nom)}>
              <td className="cg-tab-r">{String(a + i + 1).padStart(2, "0")}</td>
              <td className="cg-tab-p">{r.fr}</td>
              {COLONNES.map((c) => (
                <td key={c.id} className={r[c.id] === null ? "cg-tab-vide" : undefined}>
                  {val(r[c.id], c.unite)}
                </td>
              ))}
            </tr>
          ))}
          {b < lignes.length && (
            <tr className="cg-tab-cale" aria-hidden="true">
              <td colSpan={nCol} style={{ height: (lignes.length - b) * haut }} />
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function DemographiePage({ socle, compteur }: DemoProps) {
  const [annee, setAnnee] = useState(socle.annees[socle.annees.length - 1]);
  const [metrique, setMetrique] = useState<DemographyMetricId>("population");
  const [sens, setSens] = useState<1 | -1>(-1);
  const [filtre, setFiltre] = useState("");
  const [choisi, setChoisi] = useState<string | null>("France");

  const bande = useVu(20);
  const haut = useVu(260);
  const ouverture = useProgression();
  const [pret, setPret] = useState(false);
  const arrivee = useRef(false);
  useEffect(() => {
    const lance = () => requestAnimationFrame(() => setPret(true));
    if (document.readyState === "complete") {
      lance();
      return;
    }
    window.addEventListener("load", lance);
    return () => window.removeEventListener("load", lance);
  }, []);

  useEffect(() => {
    if (arrivee.current) return;
    arrivee.current = true;
    const q = new URLSearchParams(window.location.search);
    const p = q.get("pays");
    if (p) {
      const k = cle(p);
      const t = socle.pays.find((x) => cle(x.nom) === k || cle(x.fr) === k);
      if (t) setChoisi(t.nom);
    }
    const i = q.get("indicateur");
    if (i && TOUTES.some((m) => m.id === i)) setMetrique(i as DemographyMetricId);
    const a = Number(q.get("annee"));
    if (Number.isFinite(a) && socle.annees.includes(a)) setAnnee(a);
    if (p || i || q.get("annee")) {
      window.requestAnimationFrame(() => document.getElementById("globe")?.scrollIntoView({ block: "start" }));
    }
  }, [socle]);

  const rangs = useMemo<Rang[]>(() => {
    const l = socle.lignes[annee] ?? [];
    const place = socle.cols[annee] ?? {};
    return l.map((ligne) => {
      const p = socle.pays[ligne[0] as number];
      const v = (c: string) => {
        const i = place[c];
        const x = i === undefined ? null : ligne[i];
        return typeof x === "number" && Number.isFinite(x) ? x : null;
      };
      return {
        nom: p.nom,
        fr: p.fr,
        population: v("population"),
        birth_rate: v("birth_rate"),
        death_rate: v("death_rate"),
        natural_change: v("natural_change"),
        net_migration: v("net_migration"),
      };
    });
  }, [socle, annee]);

  const tries = useMemo(() => {
    const q = filtre.trim().toLowerCase();
    const base = q ? rangs.filter((r) => r.fr.toLowerCase().includes(q)) : rangs;
    return [...base].sort((a, b) => {
      const x = a[metrique];
      const y = b[metrique];
      if (x === null && y === null) return a.fr.localeCompare(b.fr);
      if (x === null) return 1;
      if (y === null) return -1;
      return (x - y) * sens;
    });
  }, [rangs, metrique, sens, filtre]);

  /* Cliquer une colonne du classement trie dessus et affiche cette grandeur
     sur le globe ; cliquer une famille ou une grandeur voisine sur le globe
     trie le classement dessus. Les deux widgets parlent de la même chose, ce
     qui évite qu'ils racontent chacun une histoire différente. */
  const trier = useCallback(
    (c: DemographyMetricId) => {
      if (c === metrique) setSens((s) => (s === 1 ? -1 : 1));
      else {
        setMetrique(c);
        setSens(-1);
      }
    },
    [metrique],
  );
  const changeMetrique = useCallback((id: DemographyMetricId) => {
    setMetrique(id);
    setSens(-1);
  }, []);

  /* L'année remise au format complet, pour le globe : le socle compact ne
     transporte que ce qu'une date publie, le globe veut un objet par pays. */
  const anneeDemo = useMemo<DemographyYear>(() => {
    const countries: DemographyYear["countries"] = {};
    for (const r of rangs) {
      countries[r.nom] = {
        population: r.population ?? undefined,
        birth_rate: r.birth_rate ?? undefined,
        death_rate: r.death_rate ?? undefined,
        natural_change: r.natural_change ?? undefined,
        net_migration: r.net_migration ?? undefined,
      };
    }
    return { year: annee, countries };
  }, [rangs, annee]);

  /* La série du pays choisi, date par date, pour la courbe d'évolution du
     globe. Une année sans valeur coupe le trait, elle ne le ramène pas à
     zéro. */
  const serie = useMemo(() => {
    const idx = choisi ? socle.pays.findIndex((p) => p.nom === choisi) : -1;
    return socle.annees.map((a) => {
      if (idx < 0) return { annee: a, v: null };
      const i = (socle.cols[a] ?? {})[metrique];
      const l = i === undefined ? undefined : (socle.lignes[a] ?? []).find((x) => x[0] === idx);
      const v = l ? l[i] : null;
      return { annee: a, v: typeof v === "number" && Number.isFinite(v) ? v : null };
    });
  }, [socle, choisi, metrique]);

  return (
    <div className="cg cg-eco">
      <EnTete actif="Démographie" />
      <Loupe />

      <section
        ref={ouverture as React.RefObject<HTMLElement>}
        className="cg-section cg-eco-haut"
        data-vu={haut.vu ? "1" : "0"}
        data-pret={pret ? "1" : "0"}
      >
        <div className="cg-eco-lueur" aria-hidden="true" />
        <Jetons theme="demographie" />
        <div className="cg-wrap">
          <div className="cg-eco-ouv">
            <span className="cg-sceau" aria-hidden="true">
              <span className="cg-sceau-i">
                <Dessin f="courbe" />
              </span>
            </span>
            <h1 className="cg-eco-titre">
              <Titre texte="Démographie" />
            </h1>
            <p className="cg-chapo cg-eco-ouv-c">
              {socle.pays.length} pays et territoires, {socle.annees[0]}&ndash;{socle.annees[socle.annees.length - 1]},
              population, natalité, mortalité.
            </p>
          </div>
        </div>
        <div className="cg-arc" aria-hidden="true">
          <span className="cg-arc-corps" />
          <span className="cg-arc-trait" />
          <span className="cg-arc-nappe" />
          <span className="cg-arc-point" />
        </div>
      </section>

      <TempsReelDemo compteur={compteur} />

      <div ref={haut.ref as React.RefObject<HTMLDivElement>} className="cg-temoin" aria-hidden="true" />

      <section id="globe" className="cg-section cg-eco-globe">
        <div className="cg-wrap">
          <Enseigne droite={<span className="cg-demo-mini">Nations Unies · WPP 2024</span>}>Le globe, {annee}</Enseigne>

          <GlobeDemographie
            annee={anneeDemo}
            metrique={TOUTES.find((m) => m.id === metrique) ?? TOUTES[0]}
            onMetrique={changeMetrique}
            choisi={choisi}
            onChoisi={setChoisi}
            nomFr={(n) => socle.pays.find((p) => p.nom === n)?.fr ?? n}
            serie={serie}
            sousLeGlobe={<FriseDemo annees={socle.annees} valeur={annee} onAnnee={setAnnee} />}
          />
        </div>
      </section>

      <section ref={bande.ref as React.RefObject<HTMLElement>} className="cg-bande" data-vu={bande.vu ? "1" : "0"}>
        <div className="cg-bande-h">
          <h2 className="cg-bande-t">Le classement</h2>
          <p className="cg-bande-c">
            {socle.pays.length} pays, {socle.annees.length} dates, cinq indicateurs. Choisissez une année, triez la
            colonne qui vous intéresse.
          </p>

          <div className="cg-bande-ctrl">
            <label className="cg-an-choix">
              <span className="cg-an-choix-l">Date</span>
              <select value={annee} onChange={(e) => setAnnee(Number(e.target.value))} aria-label="Date du classement">
                {[...socle.annees].reverse().map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </label>
            <input
              className="cg-filtre cg-filtre-clair"
              type="search"
              placeholder="Filtrer un pays"
              value={filtre}
              onChange={(e) => setFiltre(e.target.value)}
              aria-label="Filtrer un pays"
            />
          </div>
        </div>

        <div className="cg-bande-bloc">
          <TableauDemo lignes={tries} col={metrique} sens={sens} choisi={choisi} onChoisi={setChoisi} onTrier={trier} />
          <p className="cg-bande-n">
            {tries.length} pays affichés · « n.d. » signale une valeur que la source ne publie pas pour ce pays cette
            année-là ; ces pays passent en fin de tri, ils ne sont pas classés derniers. Cliquez une ligne pour la
            retrouver sur le globe.
          </p>
        </div>
      </section>

      <Pied />
    </div>
  );
}
