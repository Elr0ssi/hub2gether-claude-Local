"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight, ChevronDown, ExternalLink, Search, X } from "lucide-react";
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
  type Categorie, type Conflit, type Region,
} from "@/data/conflits";
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
type Reg = Region | "Monde";

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

export function ConflitsPage() {
  const [theme] = useTheme();
  const { inventaire, conflits } = useMemo(() => conflitsDuFichier(), []);
  const parId = useMemo(() => new Map(conflits.map((c) => [c.id, c])), [conflits]);

  const [region, setRegion] = useState<Reg>("Monde");
  const [categorie, setCategorie] = useState<Cat>("Tous");
  const [recherche, setRecherche] = useState("");
  const [pays, setPays] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [survol, setSurvol] = useState<{ nom: string; x: number; y: number } | null>(null);
  const [geo, setGeo] = useState<GeoJSON.FeatureCollection | null>(null);
  const [ouvert, setOuvert] = useState<string | null>(null);
  const globe = useRef<GlobeExplorerHandle>(null);
  const rectangle = useRef<HTMLDivElement>(null);

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
  const visibles = useMemo(() => filtrer(conflits, { region, categorie, recherche }, countryFr), [conflits, region, categorie, recherche]);
  const parPays = useMemo(() => indexerParPays(visibles), [visibles]);
  const stats = useMemo(() => compter(visibles), [visibles]);
  const choisi = id ? parId.get(id) ?? null : null;

  /* Une sélection qui sort des filtres est lâchée plutôt que montrée à côté d'une carte qui ne la contient plus. */
  useEffect(() => {
    if (id && !visibles.some((c) => c.id === id)) setId(null);
    if (pays && !parPays.has(pays) && !id) setPays(null);
  }, [visibles, parPays, id, pays]);

  const nomPays = countryFr;

  const colorations = useMemo<Coloration[]>(() => {
    const direct = new Map<string, Conflit[]>();
    for (const c of visibles) for (const p of c.pays) direct.set(p, [...(direct.get(p) ?? []), c]);
    const cibles = choisi ? new Set(choisi.pays) : pays ? new Set([pays]) : null;
    return [...direct.entries()].map(([nom, l]) => ({
      nom,
      couleur: COULEUR[categorieDominante(l)],
      opacite: cibles ? (cibles.has(nom) ? 0.62 : 0.14) : 0.42,
    }));
  }, [visibles, choisi, pays]);

  const contours = useMemo(() => (choisi ? choisi.pays : pays ? [pays] : []), [choisi, pays]);

  const vue = useMemo<VueGlobe | null>(() => {
    if (!geo) return null;
    if (choisi) {
      const p = choisi.pays.length ? choisi.pays : choisi.paysRattaches;
      return p.length ? vueDePays(geo, p) : null;
    }
    if (pays) return vueDePays(geo, [pays]);
    return REGIONS.find((r) => r.id === region)?.vue ?? null;
  }, [geo, choisi, pays, region]);

  const revenir = useCallback(() => {
    if (id && pays) setId(null);
    else {
      setId(null);
      setPays(null);
      globe.current?.recentrer();
    }
  }, [id, pays]);

  const choisirFiche = useCallback((c: Conflit) => {
    setId(c.id);
    const p = c.pays.length ? c.pays : c.paysRattaches;
    setPays(p.length === 1 ? p[0] : null);
  }, []);

  const surPays = useCallback(
    (nom: string | null) => {
      if (!nom) {
        setId(null);
        setPays(null);
        return;
      }
      setId(null);
      setPays(nom);
    },
    [],
  );

  const tip = survol && parPays.get(survol.nom);

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
            {/* Les filtres : les onglets de l'Économie, deux rangées et une recherche. */}
            <div className="ge-metriques" role="tablist" aria-label="Région">
              {REGIONS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  role="tab"
                  aria-selected={region === r.id}
                  className={`ge-metrique${region === r.id ? " ge-metrique-on" : ""}`}
                  onClick={() => {
                    setRegion(r.id);
                    setId(null);
                    setPays(null);
                  }}
                >
                  {r.court}
                </button>
              ))}
            </div>
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
                <div className="ge-scene cf-scene">
                  {geo ? (
                    <GlobeExplorer
                      ref={globe}
                      compact
                      geo={geo}
                      nuit={theme === "nuit"}
                      reperes={[]}
                      rivieres={[]}
                      rivieresVives={new Set()}
                      pays={null}
                      survol={null}
                      choisi={null}
                      cartes={[]}
                      monde={false}
                      arcs={[]}
                      relief3D={false}
                      colorations={colorations}
                      contours={contours}
                      vue={vue}
                      onSurvol={() => {}}
                      onChoix={() => {}}
                      onPays={surPays}
                      onPaysSurvol={setSurvol}
                    />
                  ) : (
                    <div className="xp-attente" aria-hidden="true"><span /></div>
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
                  </div>
                </div>
              </div>

              <aside className="ge-panneau cf-panneau" aria-live="polite">
                <div className="ge-fiche cf-vue" key={`${pays ?? "-"}|${id ?? "-"}`}>
                  {choisi ? (
                    <FicheConflit
                      c={choisi}
                      parId={parId}
                      retour={pays ? `Retour · ${nomPays(pays)}` : "Retour à la synthèse"}
                      onRetour={revenir}
                      onFiche={(c) => choisirFiche(c)}
                      onPays={(p) => {
                        setId(null);
                        setPays(p);
                      }}
                      nomPays={nomPays}
                    />
                  ) : pays ? (
                    <PanneauPays
                      pays={pays}
                      fiches={parPays.get(pays) ?? []}
                      nomPays={nomPays}
                      onRetour={revenir}
                      onFiche={choisirFiche}
                    />
                  ) : (
                    <Synthese
                      total={stats.total}
                      parCategorie={stats.parCategorie}
                      parRegion={stats.parRegion}
                      toutes={conflits.length}
                      region={region}
                      onCategorie={(c) => setCategorie(c)}
                      onRegion={(r) => setRegion(r)}
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
            sous={`${nf(visibles.length)} sur ${nf(conflits.length)} · ${region === "Monde" ? "toutes régions" : region} · ${categorie === "Tous" ? "toutes catégories" : categorie}`}
          />
          <ul className="cf-liste">
            {visibles.map((c) => {
              const est = ouvert === c.id;
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
                      <b>{c.nom}</b>
                      <small>{c.zone.split(";").map((z) => z.trim()).join(" · ")}</small>
                    </span>
                    <span className="cf-item-c">{c.categorie}</span>
                    <span className="cf-item-r">{c.region}</span>
                    <ChevronDown size={16} aria-hidden="true" className="cf-item-f" />
                  </button>
                  {est && (
                    <div className="cf-item-corps">
                      <FicheCorps c={c} parId={parId} nomPays={nomPays} onFiche={(x) => { setOuvert(x.id); choisirFiche(x); }} onPays={(p) => { setId(null); setPays(p); }} />
                      <button
                        type="button"
                        className="cf-lien-globe"
                        onClick={() => rectangle.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
                      >
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
                La base ne contient pas de coordonnées : un pays est coloré quand il est nommé dans la fiche ; les mers, provinces et régions restent écrites dans la fiche,
                sans être placées sur le globe. Données statistiques à croiser avec{" "}
                <a href="https://ucdp.uu.se/downloads/" target="_blank" rel="noopener noreferrer">UCDP</a> et{" "}
                <a href="https://acleddata.com/" target="_blank" rel="noopener noreferrer">ACLED</a>.
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
  total, toutes, parCategorie, parRegion, region, onCategorie, onRegion,
}: {
  total: number;
  toutes: number;
  parCategorie: Record<Categorie, number>;
  parRegion: Record<string, number>;
  region: Reg;
  onCategorie: (c: Cat) => void;
  onRegion: (r: Reg) => void;
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
              <button type="button" className={region === r.id ? "on" : ""} onClick={() => onRegion(region === r.id ? "Monde" : r.id)}>
                <span>{r.court}</span>
                <i><b style={{ width: `${(n / max) * 100}%` }} /></i>
                <strong>{nf(n)}</strong>
              </button>
            </li>
          ))}
      </ul>
      <p className="ge-note cf-aide">Cliquez un pays coloré sur le globe, ou une région, pour voir ses fiches.</p>
    </>
  );
}

/* ── Le panneau : un pays ────────────────────────────────────────────────── */

function PanneauPays({
  pays, fiches, nomPays, onRetour, onFiche,
}: {
  pays: string;
  fiches: Conflit[];
  nomPays: (n: string) => string;
  onRetour: () => void;
  onFiche: (c: Conflit) => void;
}) {
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
}) {
  return (
    <>
      <button type="button" className="cf-retour" onClick={props.onRetour}><ArrowLeft size={14} aria-hidden="true" /> {props.retour}</button>
      <FicheCorps c={props.c} parId={props.parId} nomPays={props.nomPays} onFiche={props.onFiche} onPays={props.onPays} titre />
    </>
  );
}

/** Le contenu d'une fiche : le même dans le panneau et dans la liste. */
function FicheCorps({
  c, parId, nomPays, onFiche, onPays, titre,
}: {
  c: Conflit;
  parId: Map<string, Conflit>;
  nomPays: (n: string) => string;
  onFiche: (c: Conflit) => void;
  onPays: (p: string) => void;
  titre?: boolean;
}) {
  const parent = c.parent ? parId.get(c.parent) : null;
  const enfants = c.enfants.map((e) => parId.get(e)).filter(Boolean) as Conflit[];
  const Titre = titre ? "h3" : "h4";
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
            {c.pays.length > 0 && (
              <span className="cf-puces">
                {c.pays.map((p) => (
                  <button key={p} type="button" onClick={() => onPays(p)}>{nomPays(p)}</button>
                ))}
              </span>
            )}
            {c.zonesNonPositionnees.length > 0 && (
              <span className="cf-zones">
                {c.zonesNonPositionnees.join(" · ")}
                <small>non positionné sur le globe : l’inventaire ne donne pas de coordonnées</small>
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
