"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight, ChevronDown, Crosshair, ExternalLink, MapPin, Search, Ship, Swords, X, type LucideIcon } from "lucide-react";
import { EnTete, Pied, TitreSection } from "@/components/concept/pieces";
import { Jetons, Dessin } from "@/components/concept/Jetons";
import { Loupe } from "@/components/concept/Loupe";
import { Odometre } from "@/components/concept/Roulement";
import { Titre, usePret, useProgression } from "@/components/concept/ouverture";
import { useTheme } from "@/components/concept/Theme";
import { countryFr } from "@/data/countryNamesFr";
import { slugDe } from "@/data/seo/francais";
import {
  CATEGORIES, COULEUR, REGIONS, categorieDominante, compter, conflitsDuFichier, filtrer, indexerParPays,
  type Categorie, type Conflit,
} from "@/data/conflits";
import { ORIGINES, TYPES, evenementsDuFichier, evenementsDuPays, type Evenement, type TypeEvenement } from "@/data/conflits/evenements";
import type { Repere } from "@/data/explorer/couches";
import type { Coloration, GlobeExplorerHandle, VueGlobe } from "@/components/explorer/GlobeExplorer";
import "@/components/concept/concept.css";
import "@/components/concept/v2eco.css";
import "@/components/explorer/explorer.css";
import "./conflits.css";

const GlobeExplorer = dynamic(() => import("@/components/explorer/GlobeExplorer").then((m) => m.GlobeExplorer), {
  ssr: false,
  loading: () => <div className="xp-attente" aria-hidden="true"><span /></div>,
});

const DATE = (iso: string) => new Date(iso + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
const nf = (v: number) => v.toLocaleString("fr-FR");

/* ═══════════════════════════════════════════════════════════════════════════
   LA PAGE CONFLITS

   Construite sur la page Économie : même ouverture, même rectangle (`.ge`, `.ge-corps`, `.ge-scene`, `.ge-panneau`),
   mêmes onglets de filtre (`.ge-metriques`). Le globe est celui d'Explorer, en mode compact. À droite, un panneau qui
   passe de la synthèse mondiale à la liste d'un pays, puis à la fiche d'un conflit, sans recharger la page.
   Les données et leur logique sont dans src/data/conflits ; ici, seulement la présentation.
   ═══════════════════════════════════════════════════════════════════════════ */

type Cat = Categorie | "Tous";

const ICONE: Record<TypeEvenement, LucideIcon> = { frappe: Crosshair, navire: Ship, front: Swords };

/** Le tour du monde de l'ouverture : quatre escales, puis le globe entier. Des cadrages, pas des données. */
const ESCALES: VueGlobe[] = [
  { lat: 30, lon: 46, largeur: 64, hauteur: 40 },
  { lat: 4, lon: 20, largeur: 66, hauteur: 58 },
  { lat: 24, lon: 100, largeur: 78, hauteur: 48 },
  { lat: 50, lon: 30, largeur: 46, hauteur: 30 },
];
const PAS_ESCALE = 1250;
const PAR_PAS = 3;

/** La boîte d'un pays (sa plus grande masse), pour cadrer le globe sans rien inventer. */
function boiteDe(geo: GeoJSON.FeatureCollection, nom: string) {
  const f = geo.features.find((x) => (x.properties as { name: string }).name === nom);
  if (!f) return null;
  const g = f.geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon;
  const polys = (g.type === "MultiPolygon" ? g.coordinates : [g.coordinates]) as number[][][][];
  let best: number[] | null = null;
  let max = -1;
  for (const p of polys) {
    const xs = p[0].map((c) => c[0]);
    const ys = p[0].map((c) => c[1]);
    const b = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
    const a = (b[2] - b[0]) * (b[3] - b[1]);
    if (a > max) {
      max = a;
      best = b;
    }
  }
  return best;
}

/** Le cadrage qui contient plusieurs pays ; si l'ensemble est trop étendu (la Russie et l'Ukraine), on garde le premier. */
function vueDePays(geo: GeoJSON.FeatureCollection, pays: string[]): VueGlobe | null {
  const boites = pays.map((p) => boiteDe(geo, p)).filter(Boolean) as number[][];
  if (!boites.length) return null;
  const un = (b: number[]): VueGlobe => ({ lon: (b[0] + b[2]) / 2, lat: (b[1] + b[3]) / 2, largeur: b[2] - b[0], hauteur: (b[3] - b[1]) * 1.2 });
  if (boites.length === 1) return un(boites[0]);
  const u = [Math.min(...boites.map((b) => b[0])), Math.min(...boites.map((b) => b[1])), Math.max(...boites.map((b) => b[2])), Math.max(...boites.map((b) => b[3]))];
  if (u[2] - u[0] > 45 || u[3] - u[1] > 40) return un(boites[0]);
  return un(u);
}

/** Le cadrage qui contient des points : un peu d'air autour, et jamais plus serré que 9 degrés. */
function vueDePoints(pts: { lat: number; lon: number }[]): VueGlobe | null {
  if (!pts.length) return null;
  const lats = pts.map((p) => p.lat);
  const lons = pts.map((p) => p.lon);
  const [a, b, c, d] = [Math.min(...lons), Math.min(...lats), Math.max(...lons), Math.max(...lats)];
  return { lon: (a + c) / 2, lat: (b + d) / 2, largeur: Math.max(9, (c - a) * 1.5), hauteur: Math.max(7, (d - b) * 1.7) };
}

export function ConflitsPage() {
  const [theme] = useTheme();
  const { inventaire, conflits } = useMemo(() => conflitsDuFichier(), []);
  const parId = useMemo(() => new Map(conflits.map((c) => [c.id, c])), [conflits]);
  const ensemble = useMemo(() => evenementsDuFichier(), []);

  const [categorie, setCategorie] = useState<Cat>("Tous");
  const [recherche, setRecherche] = useState("");
  const [pays, setPays] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [evt, setEvt] = useState<string | null>(null);
  const [survolEvt, setSurvolEvt] = useState<string | null>(null);
  const [survol, setSurvol] = useState<{ nom: string; x: number; y: number } | null>(null);
  const [geo, setGeo] = useState<GeoJSON.FeatureCollection | null>(null);
  const [ouvert, setOuvert] = useState<string | null>(null);
  const globe = useRef<GlobeExplorerHandle>(null);
  const rectangle = useRef<HTMLDivElement>(null);

  /* L'ouverture du globe : un tour du monde, les pays s'allument en vague depuis le Moyen-Orient. */
  const [intro, setIntro] = useState<"attente" | "joue" | "fini">("attente");
  const [introVue, setIntroVue] = useState<VueGlobe | null>(null);
  const [pas, setPas] = useState(0);

  const ouverture = useProgression();
  const pret = usePret();

  useEffect(() => {
    let vivant = true;
    fetch("/geo/ne_50m_countries.simplified.geojson")
      .then((r) => r.json())
      .then((g) => vivant && setGeo(g))
      .catch(() => {});
    return () => {
      vivant = false;
    };
  }, []);

  /* Ce que les filtres laissent voir : le globe, les listes et le panneau lisent tous la même liste. */
  const visibles = useMemo(() => filtrer(conflits, { region: "Monde", categorie, recherche }, countryFr), [conflits, categorie, recherche]);
  const idsVisibles = useMemo(() => new Set(visibles.map((c) => c.id)), [visibles]);
  const parPays = useMemo(() => indexerParPays(visibles), [visibles]);
  const stats = useMemo(() => compter(visibles), [visibles]);
  const choisi = id ? parId.get(id) ?? null : null;
  const evtsVisibles = useMemo(() => ensemble.evenements.filter((e) => idsVisibles.has(e.conflit)), [ensemble, idsVisibles]);
  const parConflit = useMemo(() => {
    const m = new Map<string, Evenement[]>();
    for (const e of ensemble.evenements) m.set(e.conflit, [...(m.get(e.conflit) ?? []), e]);
    return m;
  }, [ensemble]);
  const evtChoisi = evt ? ensemble.evenements.find((e) => e.id === evt) ?? null : null;

  /* Une sélection qui sort des filtres est lâchée plutôt que montrée à côté d'une carte qui ne la contient plus. */
  useEffect(() => {
    if (id && !idsVisibles.has(id)) {
      setId(null);
      setEvt(null);
    }
    if (pays && !parPays.has(pays) && !id) setPays(null);
  }, [idsVisibles, parPays, id, pays]);

  const nomPays = countryFr;

  /* Les points affichés sur le globe : ceux de la fiche choisie, sinon ceux du pays choisi. Rien sur la vue du monde. */
  const points = useMemo<Evenement[]>(() => {
    if (choisi) return evtsVisibles.filter((e) => e.conflit === choisi.id);
    if (pays) {
      const g = evenementsDuPays(evtsVisibles, pays, new Set((parPays.get(pays) ?? []).map((c) => c.id)));
      return [...g.sur, ...g.menes, ...g.autres];
    }
    return [];
  }, [choisi, pays, evtsVisibles, parPays]);

  const reperes = useMemo<Repere[]>(
    () =>
      points.map((e) => ({
        id: e.id,
        couche: "villes",
        nom: e.lieu,
        lat: e.lat,
        lon: e.lon,
        pays: e.pays,
        detail: `${TYPES[e.type].libelle} · ${e.date}`,
        poids: 0,
        couleur: TYPES[e.type].couleur,
        icone: ICONE[e.type],
      })),
    [points],
  );
  const arcsLL = useMemo<[number, number, number, number][]>(
    () =>
      points
        .filter((e) => e.auteurPays && e.auteurPays !== e.pays && ORIGINES[e.auteurPays])
        .map((e) => {
          const o = ORIGINES[e.auteurPays as string];
          return [o.lat, o.lon, e.lat, e.lon];
        }),
    [points],
  );
  const cartes = useMemo(() => [evt ?? survolEvt].filter((x): x is string => !!x && points.some((e) => e.id === x)), [evt, survolEvt, points]);

  /* La vague de l'ouverture : les pays par distance au Moyen-Orient, trois par trois. */
  const ordre = useMemo(() => {
    if (!geo) return [] as string[];
    const noms = new Set<string>();
    for (const c of conflits) for (const p of c.pays) noms.add(p);
    return [...noms]
      .map((n) => {
        const b = boiteDe(geo, n);
        const d = b ? Math.hypot(((b[0] + b[2]) / 2 - 45) * 0.8, (b[1] + b[3]) / 2 - 30) : 999;
        return { n, d };
      })
      .sort((a, b) => a.d - b.d)
      .map((x) => x.n);
  }, [geo, conflits]);

  const colorations = useMemo<Coloration[]>(() => {
    const direct = new Map<string, Conflit[]>();
    for (const c of visibles) for (const p of c.pays) direct.set(p, [...(direct.get(p) ?? []), c]);
    const cibles = choisi ? new Set(choisi.pays) : pays ? new Set([pays]) : null;
    const lumiere = intro === "joue" ? pas * PAR_PAS : Infinity;
    return [...direct.entries()]
      .filter(([nom]) => {
        if (intro === "fini") return true;
        if (intro === "attente") return false;
        return ordre.indexOf(nom) < lumiere;
      })
      .map(([nom, l]) => {
        const rang = ordre.indexOf(nom);
        const neuf = intro === "joue" && rang >= lumiere - PAR_PAS;
        return {
          nom,
          couleur: COULEUR[categorieDominante(l)],
          opacite: neuf ? 0.86 : cibles ? (cibles.has(nom) ? 0.62 : 0.14) : 0.42,
        };
      });
  }, [visibles, choisi, pays, intro, pas, ordre]);

  const contours = useMemo(() => (choisi ? choisi.pays : pays ? [pays] : []), [choisi, pays]);

  const vue = useMemo<VueGlobe | null>(() => {
    if (introVue) return introVue;
    if (!geo) return null;
    if (evtChoisi) return { lat: evtChoisi.lat, lon: evtChoisi.lon, largeur: evtChoisi.precision === "site" ? 6 : 12, hauteur: evtChoisi.precision === "site" ? 5 : 9 };
    if ((choisi || pays) && points.length) return vueDePoints(points);
    if (choisi) {
      const p = choisi.pays.length ? choisi.pays : choisi.paysRattaches;
      return p.length ? vueDePays(geo, p) : null;
    }
    if (pays) return vueDePays(geo, [pays]);
    return null;
  }, [geo, introVue, evtChoisi, choisi, pays, points]);

  /* ── L'ouverture : elle se joue une fois, quand le rectangle apparaît ─────── */
  const arreterIntro = useCallback(() => {
    setIntroVue(null);
    setIntro("fini");
  }, []);

  useEffect(() => {
    if (!geo || intro !== "attente") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIntro("fini");
      return;
    }
    const el = rectangle.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([en]) => {
        if (en.isIntersecting) {
          io.disconnect();
          setIntro("joue");
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [geo, intro]);

  useEffect(() => {
    if (intro !== "joue") return;
    const t: number[] = [];
    ESCALES.forEach((v, i) => t.push(window.setTimeout(() => setIntroVue(v), 200 + i * PAS_ESCALE)));
    const nb = Math.ceil(ordre.length / PAR_PAS) + 1;
    for (let k = 1; k <= nb; k++) t.push(window.setTimeout(() => setPas(k), 450 + k * 105));
    t.push(
      window.setTimeout(() => {
        setIntroVue(null);
        setIntro("fini");
        globe.current?.recentrer();
      }, 200 + ESCALES.length * PAS_ESCALE + 300),
    );
    return () => t.forEach(clearTimeout);
  }, [intro, ordre.length]);

  const revenir = useCallback(() => {
    if (evt) setEvt(null);
    else if (id && pays) setId(null);
    else {
      setId(null);
      setPays(null);
      globe.current?.recentrer();
    }
  }, [evt, id, pays]);

  const choisirFiche = useCallback((c: Conflit) => {
    setEvt(null);
    setId(c.id);
    const p = c.pays.length ? c.pays : c.paysRattaches;
    setPays(p.length === 1 ? p[0] : null);
  }, []);

  const choisirEvt = useCallback(
    (e: Evenement) => {
      setId(e.conflit);
      setEvt(e.id);
      setPays((p) => p ?? e.pays ?? e.liens[0] ?? null);
    },
    [],
  );

  const surPays = useCallback((nom: string | null) => {
    setEvt(null);
    setId(null);
    setPays(nom);
  }, []);

  const surRepere = useCallback(
    (rid: string) => {
      const e = ensemble.evenements.find((x) => x.id === rid);
      if (e) choisirEvt(e);
    },
    [ensemble, choisirEvt],
  );

  const versGlobe = useCallback(() => rectangle.current?.scrollIntoView({ behavior: "smooth", block: "center" }), []);

  const tip = survol && !survolEvt && parPays.get(survol.nom);
  const typesPresents = useMemo(() => [...new Set(points.map((e) => e.type))], [points]);

  return (
    <div className="cg cg-eco cg-v2 cg-conflits">
      <EnTete actif="Conflits" />
      <Loupe />

      {/* ── L'ouverture : celle de l'Économie ─────────────────────────────── */}
      <section ref={ouverture as React.RefObject<HTMLElement>} className="cg-section cg-eco-haut" data-vu="1" data-pret={pret ? "1" : "0"}>
        <div className="cg-eco-lueur" aria-hidden="true" />
        <Jetons />
        <div className="cg-wrap">
          <div className="cg-eco-ouv">
            <span className="cg-sceau" aria-hidden="true">
              <span className="cg-sceau-i">
                <Dessin f="courbe" />
              </span>
            </span>
            <h1 className="cg-eco-titre">
              <Titre texte="Conflits" />
            </h1>
          </div>
        </div>
        <div className="cg-arc" aria-hidden="true">
          <span className="cg-arc-corps" />
          <span className="cg-arc-trait" />
          <span className="cg-arc-nappe" />
          <span className="cg-arc-point" />
        </div>
      </section>

      {/* ── Le rectangle ──────────────────────────────────────────────────── */}
      <section id="globe" className="cg-section cg-eco-globe">
        <div className="cg-wrap">
          <header className="v2-tete">
            <h2 className="v2-h2">Où sont les foyers de tension</h2>
            <p className="v2-sous">{`Inventaire éditorial du ${DATE(inventaire.date_inventaire)} · ${inventaire.nombre_entrees} fiches · pas un flux en temps réel`}</p>
          </header>

          <div className="ge">
            <div className="cf-barre">
              <div className="ge-metriques cf-cats" role="tablist" aria-label="Catégorie">
                {([{ id: "Tous", court: "Tous", couleur: "" }, ...CATEGORIES.map((c) => ({ id: c.id, court: c.pluriel, couleur: c.couleur }))] as { id: Cat; court: string; couleur: string }[]).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    aria-selected={categorie === c.id}
                    className={`ge-metrique${categorie === c.id ? " ge-metrique-on" : ""}`}
                    onClick={() => setCategorie(c.id)}
                  >
                    {c.couleur && <i className="cf-pt" style={{ background: c.couleur }} aria-hidden="true" />}
                    {c.court}
                  </button>
                ))}
              </div>
              <label className="cf-recherche">
                <Search size={14} aria-hidden="true" />
                <input
                  type="search"
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  placeholder="Pays ou conflit"
                  aria-label="Rechercher un pays ou un conflit"
                />
                {recherche && (
                  <button type="button" onClick={() => setRecherche("")} aria-label="Effacer la recherche"><X size={13} /></button>
                )}
              </label>
            </div>

            <div className="ge-corps cf-corps" ref={rectangle}>
              <div className="ge-colonne">
                <div className="ge-scene cf-scene" data-intro={intro} onPointerDown={() => intro === "joue" && arreterIntro()}>
                  {geo ? (
                    <GlobeExplorer
                      ref={globe}
                      compact
                      geo={geo}
                      nuit={theme === "nuit"}
                      reperes={reperes}
                      rivieres={[]}
                      rivieresVives={new Set()}
                      pays={null}
                      survol={survolEvt}
                      choisi={evt}
                      cartes={cartes}
                      monde={false}
                      arcs={[]}
                      arcsLL={arcsLL}
                      relief3D={false}
                      colorations={colorations}
                      contours={contours}
                      vue={vue}
                      onSurvol={setSurvolEvt}
                      onChoix={surRepere}
                      onPays={surPays}
                      onPaysSurvol={setSurvol}
                    />
                  ) : (
                    <div className="xp-attente" aria-hidden="true"><span /></div>
                  )}
                  {intro === "joue" && (
                    <div className="cf-onde" aria-hidden="true">
                      <i /><i /><i />
                      <span className="cf-balai" />
                    </div>
                  )}
                  {survol && tip && tip.length > 0 && (
                    <div className={`cf-tip${survol.x > (rectangle.current?.querySelector(".cf-scene")?.clientWidth ?? 9999) - 230 ? " cf-tip-g" : ""}`} style={{ left: survol.x, top: survol.y }} aria-hidden="true">
                      <b>{nomPays(survol.nom)}</b>
                      <span>
                        {tip.length === 1 ? tip[0].nom : `${tip.length} fiches`} · {tip.length === 1 ? tip[0].categorie : categorieDominante(tip)}
                      </span>
                    </div>
                  )}
                  <div className="ge-echelle cf-legende" aria-hidden="true">
                    {CATEGORIES.map((c) => (
                      <span key={c.id}><i style={{ background: c.couleur }} />{c.pluriel}</span>
                    ))}
                    <em>des catégories, pas un score de gravité</em>
                    {typesPresents.length > 0 && (
                      <>
                        <hr />
                        {typesPresents.map((t) => (
                          <span key={t}><i className="cf-lg-p" style={{ background: TYPES[t].couleur }} />{TYPES[t].pluriel}</span>
                        ))}
                        {arcsLL.length > 0 && <em>un trait relie la capitale de l’acteur au point, sans être une trajectoire</em>}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <aside className="ge-panneau cf-panneau" aria-live="polite">
                <div className="ge-fiche cf-vue" key={`${pays ?? "-"}|${id ?? "-"}|${evt ?? "-"}`}>
                  {evtChoisi ? (
                    <FichePoint
                      e={evtChoisi}
                      fiche={parId.get(evtChoisi.conflit) ?? null}
                      retour={choisi ? `Retour · ${choisi.nom}` : "Retour"}
                      nomPays={nomPays}
                      onRetour={revenir}
                      onFiche={choisirFiche}
                      onPays={surPays}
                    />
                  ) : choisi ? (
                    <FicheConflit
                      c={choisi}
                      parId={parId}
                      retour={pays ? `Retour · ${nomPays(pays)}` : "Retour à la synthèse"}
                      onRetour={revenir}
                      onFiche={(c) => choisirFiche(c)}
                      onPays={surPays}
                      nomPays={nomPays}
                      evts={parConflit.get(choisi.id) ?? []}
                      onEvt={choisirEvt}
                    />
                  ) : pays ? (
                    <PanneauPays
                      pays={pays}
                      fiches={parPays.get(pays) ?? []}
                      nomPays={nomPays}
                      onRetour={revenir}
                      onFiche={choisirFiche}
                      evts={evtsVisibles}
                      onEvt={choisirEvt}
                    />
                  ) : (
                    <Synthese
                      total={stats.total}
                      parCategorie={stats.parCategorie}
                      parRegion={stats.parRegion}
                      toutes={conflits.length}
                      onCategorie={(c) => setCategorie(c)}
                      nbPoints={evtsVisibles.length}
                      nbFichesPoints={new Set(evtsVisibles.map((e) => e.conflit)).size}
                    />
                  )}
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* ── La liste des fiches ───────────────────────────────────────────── */}
      <section id="liste" className="cg-section cf-liste-section">
        <div className="cg-wrap">
          <TitreSection
            titre="Toutes les fiches"
            sous={`${nf(visibles.length)} sur ${nf(conflits.length)} · ${categorie === "Tous" ? "toutes catégories" : categorie}`}
          />
          <ul className="cf-liste">
            {visibles.map((c) => {
              const est = ouvert === c.id;
              const n = parConflit.get(c.id)?.length ?? 0;
              return (
                <li key={c.id} className={est ? "cf-item cf-item-on" : "cf-item"}>
                  <button
                    type="button"
                    className="cf-item-t"
                    aria-expanded={est}
                    onClick={() => {
                      setOuvert(est ? null : c.id);
                      if (!est) choisirFiche(c);
                    }}
                  >
                    <i className="cf-pt" style={{ background: COULEUR[c.categorie] }} aria-hidden="true" />
                    <span className="cf-item-n">
                      <b>{c.nom}{n > 0 && <em className="cf-item-pts"><MapPin size={11} aria-hidden="true" />{n} {n > 1 ? "points" : "point"}</em>}</b>
                      <small>{c.zone.split(";").map((z) => z.trim()).join(" · ")}</small>
                    </span>
                    <span className="cf-item-c">{c.categorie}</span>
                    <span className="cf-item-r">{c.region}</span>
                    <ChevronDown size={16} aria-hidden="true" className="cf-item-f" />
                  </button>
                  {est && (
                    <div className="cf-item-corps">
                      <FicheCorps
                        c={c}
                        parId={parId}
                        nomPays={nomPays}
                        onFiche={(x) => { setOuvert(x.id); choisirFiche(x); }}
                        onPays={(p) => surPays(p)}
                        evts={parConflit.get(c.id) ?? []}
                        onEvt={(e) => { choisirEvt(e); versGlobe(); }}
                      />
                      <button type="button" className="cf-lien-globe" onClick={versGlobe}>
                        Voir sur le globe <ArrowUpRight size={13} aria-hidden="true" />
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
            {visibles.length === 0 && <li className="cf-vide">Aucune fiche ne correspond à ces filtres.</li>}
          </ul>

          <div className="cf-notes">
            <h3>Lire ces données</h3>
            <ul>
              {inventaire.avertissements.map((a) => (
                <li key={a}>{a}</li>
              ))}
              <li>
                {nf(inventaire.nombre_entrees)} fiches ne sont pas {nf(inventaire.nombre_entrees)} guerres : elles regroupent des conflits armés, des violences armées et des tensions
                géopolitiques, et certaines se rattachent à une autre (les fiches liées ne se somment pas).
              </li>
              <li>
                L’inventaire ne contient pas de coordonnées : un pays est coloré quand il est nommé dans la fiche ; les mers, provinces et régions restent écrites dans la fiche,
                sans être placées sur le globe. Données statistiques à croiser avec{" "}
                <a href="https://ucdp.uu.se/downloads/" target="_blank" rel="noopener noreferrer">UCDP</a> et{" "}
                <a href="https://acleddata.com/" target="_blank" rel="noopener noreferrer">ACLED</a>.
              </li>
              {ensemble.avertissements.map((a) => (
                <li key={a}>{a}</li>
              ))}
              <li>
                {nf(ensemble.evenements.length)} points précis sur {nf(parConflit.size)} fiches, compilés le {DATE(ensemble.date_compilation)} à partir de sources de presse et de référence ; chaque point renvoie à la sienne.
              </li>
              <li>{inventaire.origine} · inventaire du {DATE(inventaire.date_inventaire)}.</li>
            </ul>
          </div>
        </div>
      </section>

      <Pied />
    </div>
  );
}

/* ── Le panneau : la synthèse ────────────────────────────────────────────── */

function Synthese({
  total, toutes, parCategorie, parRegion, onCategorie, nbPoints, nbFichesPoints,
}: {
  total: number;
  toutes: number;
  parCategorie: Record<Categorie, number>;
  parRegion: Record<string, number>;
  onCategorie: (c: Cat) => void;
  nbPoints: number;
  nbFichesPoints: number;
}) {
  const max = Math.max(1, ...Object.values(parRegion));
  return (
    <>
      <h3 className="ge-nom">Synthèse mondiale</h3>
      <div className="ge-vedette">
        <span className="ge-vedette-l">Foyers recensés{total !== toutes ? ` · sur ${nf(toutes)}` : ""}</span>
        <Odometre className="ge-vedette-v" valeur={total} dec={0} unite="" duree={950} tours={1} couleur={1} />
        <span className="ge-vedette-r">fiches de l’inventaire, pas un nombre officiel de guerres</span>
      </div>
      <div className="cf-cats-liste">
        {CATEGORIES.map((c) => (
          <button key={c.id} type="button" className="ge-autre cf-cat" onClick={() => onCategorie(c.id)}>
            <span className="ge-autre-l"><i className="cf-pt" style={{ background: c.couleur }} aria-hidden="true" />{c.pluriel}</span>
            <b>{nf(parCategorie[c.id])}</b>
          </button>
        ))}
      </div>
      <h4 className="cf-st">Régions les plus concernées</h4>
      <ul className="cf-regions">
        {REGIONS.filter((r) => r.id !== "Monde")
          .map((r) => ({ r, n: parRegion[r.id] ?? 0 }))
          .sort((a, b) => b.n - a.n)
          .map(({ r, n }) => (
            <li key={r.id}>
              <div>
                <span>{r.court}</span>
                <i><b style={{ width: `${(n / max) * 100}%` }} /></i>
                <strong>{nf(n)}</strong>
              </div>
            </li>
          ))}
      </ul>
      <p className="ge-note cf-aide">
        Cliquez un pays coloré pour voir ses fiches{nbPoints > 0 ? ` et ${nf(nbPoints)} points précis (frappes, navires attaqués, fronts) sur ${nf(nbFichesPoints)} fiches` : ""}.
      </p>
    </>
  );
}

/* ── Un point : date, lieu, acteur, source ───────────────────────────────── */

function PointLigne({ e, onEvt }: { e: Evenement; onEvt: (e: Evenement) => void }) {
  const Icone = ICONE[e.type];
  return (
    <li>
      <button type="button" onClick={() => onEvt(e)}>
        <i className="cf-pin" style={{ background: TYPES[e.type].couleur }}><Icone size={11} aria-hidden="true" /></i>
        <span>
          <b>{e.titre}</b>
          <small>{e.lieu} · {e.date}</small>
        </span>
        <ArrowUpRight size={15} aria-hidden="true" />
      </button>
    </li>
  );
}

/** Les points d'une fiche, groupés par pays où ils se trouvent : la distinction entre les pays d'un même conflit. */
function PointsParPays({ evts, nomPays, onEvt }: { evts: Evenement[]; nomPays: (n: string) => string; onEvt: (e: Evenement) => void }) {
  if (!evts.length) return null;
  const groupes = new Map<string, Evenement[]>();
  for (const e of evts) {
    const k = e.pays ?? "mer";
    groupes.set(k, [...(groupes.get(k) ?? []), e]);
  }
  return (
    <div className="cf-points">
      <h4 className="cf-st">{evts.length > 1 ? `${evts.length} points documentés` : "1 point documenté"}</h4>
      {[...groupes.entries()].map(([k, l]) => (
        <div key={k} className="cf-groupe">
          <h5>{k === "mer" ? "En mer" : nomPays(k)}<span>{l.length}</span></h5>
          <ul className="cf-fiches cf-fiches-p">
            {l.map((e) => <PointLigne key={e.id} e={e} onEvt={onEvt} />)}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ── Le panneau : un pays ────────────────────────────────────────────────── */

function PanneauPays({
  pays, fiches, nomPays, onRetour, onFiche, evts, onEvt,
}: {
  pays: string;
  fiches: Conflit[];
  nomPays: (n: string) => string;
  onRetour: () => void;
  onFiche: (c: Conflit) => void;
  evts: Evenement[];
  onEvt: (e: Evenement) => void;
}) {
  const g = evenementsDuPays(evts, pays, new Set(fiches.map((c) => c.id)));
  const bloc = (titre: string, note: string, l: Evenement[]) =>
    l.length > 0 && (
      <div className="cf-groupe">
        <h5>{titre}<span>{l.length}</span></h5>
        <p className="cf-sous cf-sous-p">{note}</p>
        <ul className="cf-fiches cf-fiches-p">
          {l.map((e) => <PointLigne key={e.id} e={e} onEvt={onEvt} />)}
        </ul>
      </div>
    );
  return (
    <>
      <button type="button" className="cf-retour" onClick={onRetour}><ArrowLeft size={14} aria-hidden="true" /> Synthèse</button>
      <h3 className="ge-nom">
        <a className="ge-nom-lien" href={`/pays/${slugDe(nomPays(pays))}`} target="_blank" rel="noopener noreferrer" aria-label={`Page du pays : ${nomPays(pays)} (nouvel onglet)`}>
          {nomPays(pays)}
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </h3>
      {fiches.length ? (
        <>
          <p className="cf-sous">{fiches.length === 1 ? "1 fiche" : `${fiches.length} fiches distinctes`} dans l’inventaire. Elles ne sont ni fusionnées ni additionnées.</p>
          <ul className="cf-fiches">
            {fiches.map((c) => (
              <li key={c.id}>
                <button type="button" onClick={() => onFiche(c)}>
                  <i className="cf-pt" style={{ background: COULEUR[c.categorie] }} aria-hidden="true" />
                  <span>
                    <b>{c.nom}</b>
                    <small>{c.categorie} · {c.situation}{c.pays.length === 0 ? " · rattachée à une autre fiche" : ""}</small>
                  </span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
          {(g.sur.length > 0 || g.menes.length > 0 || g.autres.length > 0) && (
            <div className="cf-points">
              <h4 className="cf-st">Points sur le globe</h4>
              {bloc(`Sur le territoire : ${nomPays(pays)}`, "Lieux situés dans ce pays.", g.sur)}
              {bloc(`Menés depuis ${nomPays(pays)}`, "Lieux frappés ou attaqués par un acteur de ce pays, dans un autre pays ou en mer.", g.menes)}
              {bloc("Autres points des mêmes conflits", "Lieux des fiches de ce pays situés ailleurs.", g.autres)}
            </div>
          )}
        </>
      ) : (
        <p className="cf-sous">Aucune fiche pour ce pays dans cette sélection de l’inventaire. Ce n’est pas une affirmation sur la situation du pays : l’inventaire n’est pas exhaustif.</p>
      )}
    </>
  );
}

/* ── Le panneau : une fiche ──────────────────────────────────────────────── */

function FicheConflit(props: {
  c: Conflit;
  parId: Map<string, Conflit>;
  retour: string;
  onRetour: () => void;
  onFiche: (c: Conflit) => void;
  onPays: (p: string) => void;
  nomPays: (n: string) => string;
  evts: Evenement[];
  onEvt: (e: Evenement) => void;
}) {
  return (
    <>
      <button type="button" className="cf-retour" onClick={props.onRetour}><ArrowLeft size={14} aria-hidden="true" /> {props.retour}</button>
      <FicheCorps c={props.c} parId={props.parId} nomPays={props.nomPays} onFiche={props.onFiche} onPays={props.onPays} evts={props.evts} onEvt={props.onEvt} titre />
    </>
  );
}

/** Un point : ce qui s'y est passé, qui, où, d'où ça vient. */
function FichePoint({
  e, fiche, retour, nomPays, onRetour, onFiche, onPays,
}: {
  e: Evenement;
  fiche: Conflit | null;
  retour: string;
  nomPays: (n: string) => string;
  onRetour: () => void;
  onFiche: (c: Conflit) => void;
  onPays: (p: string) => void;
}) {
  const Icone = ICONE[e.type];
  return (
    <>
      <button type="button" className="cf-retour" onClick={onRetour}><ArrowLeft size={14} aria-hidden="true" /> {retour}</button>
      <div className="cf-fiche">
        <div className="cf-badges">
          <span className="cf-badge"><i className="cf-pin" style={{ background: TYPES[e.type].couleur }}><Icone size={11} aria-hidden="true" /></i>{TYPES[e.type].libelle}</span>
          <span className="cf-badge cf-badge-n">{e.date}</span>
        </div>
        <h3 className="ge-nom cf-titre">{e.titre}</h3>
        <p className="cf-situation">
          <span>Lieu</span>
          {e.lieu}{e.pays ? ` · ${nomPays(e.pays)}` : " · en mer"}
          {e.precision === "zone" && <small className="cf-approx">Position approximative : le point marque le centre de la zone nommée, pas un site exact.</small>}
        </p>
        <p className="cf-desc">{e.detail}</p>
        <dl className="cf-champs">
          {e.auteur && (
            <div>
              <dt>Auteur indiqué par la source</dt>
              <dd>
                {e.auteur}
                {e.auteurPays && e.pays && e.auteurPays !== e.pays && (
                  <span className="cf-puces">
                    <button type="button" onClick={() => onPays(e.auteurPays as string)}>{nomPays(e.auteurPays)}</button>
                    <span className="cf-fleche">→</span>
                    <button type="button" onClick={() => onPays(e.pays as string)}>{nomPays(e.pays)}</button>
                  </span>
                )}
              </dd>
            </div>
          )}
          {fiche && (
            <div>
              <dt>Fiche de l’inventaire</dt>
              <dd>
                <span className="cf-puces cf-puces-l">
                  <button type="button" onClick={() => onFiche(fiche)}>{fiche.nom}</button>
                </span>
              </dd>
            </div>
          )}
        </dl>
        <div className="cf-source">
          <a href={e.source_url} target="_blank" rel="noopener noreferrer">
            Source : {e.source} <ExternalLink size={12} aria-hidden="true" />
          </a>
          <small>Les chiffres et attributions sont ceux de la source ; les revendications d’un camp ne sont pas confirmées de façon indépendante.</small>
        </div>
      </div>
    </>
  );
}

/** Le contenu d'une fiche : le même dans le panneau et dans la liste. */
function FicheCorps({
  c, parId, nomPays, onFiche, onPays, titre, evts, onEvt,
}: {
  c: Conflit;
  parId: Map<string, Conflit>;
  nomPays: (n: string) => string;
  onFiche: (c: Conflit) => void;
  onPays: (p: string) => void;
  titre?: boolean;
  evts: Evenement[];
  onEvt: (e: Evenement) => void;
}) {
  const parent = c.parent ? parId.get(c.parent) : null;
  const enfants = c.enfants.map((e) => parId.get(e)).filter(Boolean) as Conflit[];
  const Titre = titre ? "h3" : "h4";
  /* Ce que chaque pays de la fiche a, dans les points documentés : des sites touchés chez lui, des actions menées depuis lui. */
  const bilan = (p: string) => {
    const sur = evts.filter((e) => e.pays === p).length;
    const menes = evts.filter((e) => e.auteurPays === p && e.pays !== p).length;
    return [sur ? `${sur} ${sur > 1 ? "sites" : "site"} sur son sol` : "", menes ? `${menes} ${menes > 1 ? "actions menées" : "action menée"} hors de ses frontières` : ""].filter(Boolean).join(" · ");
  };
  const paysDeLaFiche = [...new Set([...c.pays, ...evts.flatMap((e) => (e.auteurPays && !c.pays.includes(e.auteurPays) ? [e.auteurPays] : []))])];
  return (
    <div className="cf-fiche">
      <div className="cf-badges">
        <span className="cf-badge"><i className="cf-pt" style={{ background: COULEUR[c.categorie] }} aria-hidden="true" />{c.categorie}</span>
        <span className="cf-badge cf-badge-n">{c.region}</span>
      </div>
      <Titre className={titre ? "ge-nom cf-titre" : "cf-titre cf-titre-p"}>{c.nom}</Titre>
      <p className="cf-situation"><span>Situation documentée</span>{c.situation}</p>
      <p className="cf-desc">{c.description}</p>

      <dl className="cf-champs">
        <div>
          <dt>Pays et zones concernés</dt>
          <dd>
            {paysDeLaFiche.length > 0 && (
              <span className="cf-pays-l">
                {paysDeLaFiche.map((p) => (
                  <button key={p} type="button" onClick={() => onPays(p)}>
                    <b>{nomPays(p)}</b>
                    {bilan(p) && <small>{bilan(p)}</small>}
                  </button>
                ))}
              </span>
            )}
            {c.zonesNonPositionnees.length > 0 && (
              <span className="cf-zones">
                {c.zonesNonPositionnees.join(" · ")}
                <small>zones citées dans la fiche, non colorées : l’inventaire ne donne pas de coordonnées</small>
              </span>
            )}
            {c.pays.length === 0 && c.paysRattaches.length > 0 && (
              <small className="cf-zones">Se rattache à {c.paysRattaches.map(nomPays).join(", ")}</small>
            )}
          </dd>
        </div>
        <div>
          <dt>Principaux acteurs</dt>
          <dd>{c.acteurs}</dd>
        </div>
        {(parent || enfants.length > 0) && (
          <div>
            <dt>Fiches liées</dt>
            <dd>
              <span className="cf-puces cf-puces-l">
                {parent && <button type="button" onClick={() => onFiche(parent)}>↑ {parent.nom}</button>}
                {enfants.map((e) => (
                  <button key={e.id} type="button" onClick={() => onFiche(e)}>↳ {e.nom}</button>
                ))}
              </span>
              <small className="cf-zones">Fiches reliées : elles ne s’additionnent pas.</small>
            </dd>
          </div>
        )}
      </dl>

      <PointsParPays evts={evts} nomPays={nomPays} onEvt={onEvt} />

      <div className="cf-source">
        <a href={c.source_url} target="_blank" rel="noopener noreferrer">
          Source : {c.source} <ExternalLink size={12} aria-hidden="true" />
        </a>
        <small>{c.verification}</small>
        <small>Inventaire compilé le {DATE(c.date_inventaire)} · {c.id}</small>
      </div>
    </div>
  );
}
