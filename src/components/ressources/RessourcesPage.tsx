"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight, ChevronDown, ExternalLink, Minus, Pause, Play, Plus } from "lucide-react";
import { EnTete, Pied, TitreSection } from "@/components/concept/pieces";
import { Jetons, Dessin } from "@/components/concept/Jetons";
import { Loupe } from "@/components/concept/Loupe";
import { Odometre } from "@/components/concept/Roulement";
import { Titre, usePret, useProgression } from "@/components/concept/ouverture";
import { useTheme } from "@/components/concept/Theme";
import { countryFr } from "@/data/countryNamesFr";
import type { Coloration, GlobeExplorerHandle, VueGlobe } from "@/components/explorer/GlobeExplorer";
import { vueDePays } from "@/components/explorer/vues";
import { chargerIndex, chargerJeu } from "@/data/ressources/charger";
import { CATALOGUE, NOMS_FR_ENTITES, ressourcesActives, type RessourceActive } from "@/data/ressources/catalogue";
import {
  CONTINENTS, NOMS_INDICATEUR, UNITES_LIBELLE, VUES_ZONE, FLAGS, classeDe, classement, complet, court, derniere, flagLibelle, indexer, manquante, obs, points,
  rangDe, seuils, totalMonde,
} from "@/data/ressources/calc";
import type { EntreeIndex, JeuRessource, Zone, ZoneFiltre } from "@/data/ressources/types";
import { Courbes, Repartition, type SerieCourbe } from "./Courbes";
import "@/components/concept/concept.css";
import "@/components/concept/v2eco.css";
import "@/components/explorer/explorer.css";
import "./ressources.css";

const GlobeExplorer = dynamic(() => import("@/components/explorer/GlobeExplorer").then((m) => m.GlobeExplorer), {
  ssr: false,
  loading: () => <div className="xp-attente" aria-hidden="true"><span /></div>,
});

/* ═══════════════════════════════════════════════════════════════════════════
   LA PAGE RESSOURCES

   Même construction que Économie et Conflits : un grand rectangle (globe à gauche, panneau à droite), des filtres au-dessus, des
   graphiques en dessous. Les données viennent de public/ressources/<id>.json (voir scripts/ressources) ; la logique de src/data/ressources.
   ═══════════════════════════════════════════════════════════════════════════ */

const RAMPE = ["#ede9fe", "#d4c6fd", "#b39afb", "#8f6bf7", "#6a3fe0", "#43198f"];
const COULEURS_PAYS = ["#6d4aff", "#e5484d", "#0891b2", "#f08a24", "#16a34a", "#d946ef"];
const ZONES: ZoneFiltre[] = ["Monde", ...CONTINENTS];
const INDICATEURS_ORDRE = ["production", "surface", "rendement"] as const;
const COMPARAISON = 10;
const TITRES_CLASSEMENT: Record<string, string> = { production: "Principaux producteurs", surface: "Plus grandes surfaces récoltées", rendement: "Rendements les plus élevés" };
/** Une évolution en %, sans « -0 % » : une variation qui s'arrondit à zéro s'écrit 0 %. */
const pct = (x: number) => { const r = Math.round(x); return r === 0 ? "0 %" : `${r > 0 ? "+" : ""}${r.toLocaleString("fr-FR")} %`; };

const nf = (v: number) => v.toLocaleString("fr-FR");

function nomZone(z: Zone) {
  if (NOMS_FR_ENTITES[z.m49]) return NOMS_FR_ENTITES[z.m49];
  if (z.m49 === "156") return "Chine continentale";
  return z.ne ? countryFr(z.ne) : z.nom;
}

export function RessourcesPage() {
  const [theme] = useTheme();
  const ouverture = useProgression();
  const pret = usePret();
  const globe = useRef<GlobeExplorerHandle>(null);
  const rectangle = useRef<HTMLDivElement>(null);

  const [index, setIndex] = useState<EntreeIndex[] | null>(null);
  const [resId, setResId] = useState<string | null>(null);
  const [jeu, setJeu] = useState<JeuRessource | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [geo, setGeo] = useState<GeoJSON.FeatureCollection | null>(null);

  const [ind, setInd] = useState<string>("production");
  const [annee, setAnnee] = useState<number>(2024);
  const [zone, setZone] = useState<ZoneFiltre>("Monde");
  const [m49, setM49] = useState<string | null>(null);
  const [compare, setCompare] = useState<string[] | null>(null);
  const [lecture, setLecture] = useState(false);
  const [survol, setSurvol] = useState<{ nom: string; x: number; y: number } | null>(null);
  const [toutVoir, setToutVoir] = useState(false);

  /* ── Chargements : l'index, la géométrie, puis la ressource choisie ───────── */
  useEffect(() => {
    let vivant = true;
    chargerIndex().then((l) => {
      if (!vivant) return;
      setIndex(l);
      setResId((c) => c ?? ressourcesActives(l)[0]?.id ?? null);
    }).catch(() => vivant && setErreur("Impossible de charger la liste des ressources."));
    fetch("/geo/ne_50m_countries.simplified.geojson").then((r) => r.json()).then((g) => vivant && setGeo(g)).catch(() => {});
    return () => { vivant = false; };
  }, []);

  useEffect(() => {
    if (!resId) return;
    let vivant = true;
    setJeu(null);
    setErreur(null);
    chargerJeu(resId).then((j) => {
      if (!vivant) return;
      setJeu(j);
      setAnnee(j.annees[1]);
      setM49(null);
      setCompare(null);
      setInd((c) => (j.indicateurs[c] ? c : Object.keys(j.indicateurs)[0]));
    }).catch(() => vivant && setErreur("Impossible de charger les données de cette ressource."));
    return () => { vivant = false; };
  }, [resId]);

  const actives = useMemo(() => (index ? ressourcesActives(index) : []), [index]);
  const res: RessourceActive | undefined = actives.find((r) => r.id === resId);
  const ix = useMemo(() => (jeu ? indexer(jeu) : null), [jeu]);
  const unite = jeu?.indicateurs[ind]?.unite ?? "";
  const uniteTxt = UNITES_LIBELLE[unite] ?? unite;
  const [a0, a1] = jeu?.annees ?? [1961, 2024];

  /* La lecture automatique des années. */
  useEffect(() => {
    if (!lecture) return;
    const t = window.setInterval(() => setAnnee((a) => (a >= a1 ? (setLecture(false), a) : a + 1)), 420);
    return () => clearInterval(t);
  }, [lecture, a1]);

  /* ── Les calculs, une fois par changement de filtre ───────────────────────── */
  const clMonde = useMemo(() => (jeu ? classement(jeu, ind, annee, "Monde", COMPARAISON) : []), [jeu, ind, annee]);
  const cl = useMemo(() => (zone === "Monde" ? clMonde : clMonde.filter((l) => l.continent === zone).map((l, i) => ({ ...l, rang: i + 1 }))), [clMonde, zone]);
  const total = jeu ? totalMonde(jeu, ind, annee) : null;
  const totalAvant = jeu ? totalMonde(jeu, ind, annee - COMPARAISON) : null;
  const seuil = useMemo(() => seuils(clMonde.filter((l) => l.type === "pays").map((l) => l.valeur)), [clMonde]);

  const valeurParNe = useMemo(() => {
    const m = new Map<string, number>();
    if (!jeu || !ix) return m;
    for (const [ne, z] of ix.parNe) {
      const o = obs(jeu, z.m49, ind, annee);
      if (o) m.set(ne, o.valeur);
    }
    return m;
  }, [jeu, ix, ind, annee]);

  const zoneSel = m49 && ix ? ix.parM49.get(m49) ?? null : null;
  const neSel = zoneSel?.ne ?? null;

  const colorations = useMemo<Coloration[]>(() => {
    if (!geo) return [];
    return geo.features.map((f) => {
      const nom = (f.properties as { name: string }).name;
      const v = valeurParNe.get(nom);
      const z = ix?.parNe.get(nom);
      const horsZone = zone !== "Monde" && z?.continent !== zone;
      if (v === undefined) return { nom, couleur: "#8b8fa3", opacite: horsZone ? 0.05 : 0.15 };
      const base = neSel ? (nom === neSel ? 0.9 : 0.5) : 0.8;
      return { nom, couleur: RAMPE[classeDe(v, seuil)], opacite: horsZone ? 0.22 : base };
    });
  }, [geo, valeurParNe, ix, zone, seuil, neSel]);

  const vue = useMemo<VueGlobe | null>(() => {
    if (!geo) return null;
    if (neSel) return vueDePays(geo, [neSel]);
    return VUES_ZONE[zone];
  }, [geo, neSel, zone]);

  /* ── Actions ──────────────────────────────────────────────────────────────── */
  const choisirZone = (z: ZoneFiltre) => { setZone(z); setM49(null); };
  const surPays = useCallback((nom: string | null) => {
    if (!nom || !ix) { setM49(null); return; }
    const z = ix.parNe.get(nom);
    setM49(z ? z.m49 : null);
  }, [ix]);
  const selectionner = (id: string, defiler = true) => {
    setM49(id);
    if (defiler) rectangle.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  const retour = () => { setM49(null); globe.current?.recentrer(); };

  /* Les pays comparés : par défaut les quatre premiers de l'année. */
  const idsCompare = useMemo(() => compare ?? cl.filter((l) => l.type === "pays").slice(0, 4).map((l) => l.m49), [compare, cl]);

  /* ── Les séries des graphiques ────────────────────────────────────────────── */
  const serieMonde = useMemo<SerieCourbe | null>(() => {
    if (!jeu?.monde[ind]) return null;
    const m = jeu.monde[ind];
    return { id: "monde", nom: "Somme des entités du fichier", couleur: "#6d4aff", pts: m.v.map((v, i) => ({ annee: a0 + i, valeur: v, flag: v === null ? undefined : "A" })) };
  }, [jeu, ind, a0]);

  const sId = (id: string, couleur: string): SerieCourbe | null => {
    const z = ix?.parM49.get(id);
    if (!jeu || !z) return null;
    return { id, nom: nomZone(z), couleur, pts: points(jeu, id, ind).map((p) => ({ annee: p.annee, valeur: p.valeur, flag: p.flag, nonOfficielle: p.nonOfficielle })) };
  };
  const idPays = m49 ?? cl.find((l) => l.type === "pays")?.m49 ?? null;
  const seriePays = idPays ? sId(idPays, "#6d4aff") : null;
  const seriesCompare = idsCompare.map((id, i) => sId(id, COULEURS_PAYS[i % COULEURS_PAYS.length])).filter(Boolean) as SerieCourbe[];

  /* ── Rendu ────────────────────────────────────────────────────────────────── */
  const surfaceIndisponible = !jeu || !ix;
  const nomRes = res?.nomFr ?? "Ressource";
  const zoneTxt = zone === "Monde" ? "Monde" : zone;
  const parts = useMemo(() => {
    if (!total || !jeu || ind === "rendement") return [];
    const top = clMonde.filter((l) => l.type !== "agregat").slice(0, 10);
    const reste = total.valeur - top.reduce((s, l) => s + l.valeur, 0);
    const ls = top.map((l, i) => ({
      id: l.m49, nom: nomZone(ix!.parM49.get(l.m49)!), valeur: l.valeur, part: (l.valeur / total.valeur) * 100, couleur: RAMPE[Math.max(2, 5 - Math.floor(i / 2))],
      note: l.type === "historique" ? "entité historique" : undefined, onClick: () => selectionner(l.m49),
    }));
    if (reste > 0) ls.push({ id: "autres", nom: "Autres entités du fichier", valeur: reste, part: (reste / total.valeur) * 100, couleur: "#9ca3af", note: undefined, onClick: undefined as unknown as () => void });
    return ls;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, clMonde, ind, jeu, ix]);

  const affiche = toutVoir ? cl : cl.slice(0, 15);

  return (
    <div className="cg cg-eco cg-v2 cg-ressources">
      <EnTete actif="Ressources" />
      <Loupe />

      <section ref={ouverture as React.RefObject<HTMLElement>} className="cg-section cg-eco-haut" data-vu="1" data-pret={pret ? "1" : "0"}>
        <div className="cg-eco-lueur" aria-hidden="true" />
        <Jetons />
        <div className="cg-wrap">
          <div className="cg-eco-ouv">
            <span className="cg-sceau" aria-hidden="true"><span className="cg-sceau-i"><Dessin f="courbe" /></span></span>
            <h1 className="cg-eco-titre"><Titre texte="Ressources" /></h1>
          </div>
        </div>
        <div className="cg-arc" aria-hidden="true">
          <span className="cg-arc-corps" /><span className="cg-arc-trait" /><span className="cg-arc-nappe" /><span className="cg-arc-point" />
        </div>
      </section>

      <section id="globe" className="cg-section cg-eco-globe">
        <div className="cg-wrap">
          <header className="v2-tete">
            <h2 className="v2-h2">D’où viennent les ressources</h2>
            <p className="v2-sous">
              {res ? `${res.chemin} · ${jeu ? `FAOSTAT ${a0}–${a1}` : "chargement…"}` : "Observatoire des ressources agricoles et naturelles"}
            </p>
          </header>

          <div className="ge">
            {/* ── Les filtres ─────────────────────────────────────────────── */}
            <div className="rs-filtres">
              <label className="rs-champ">
                <span>Ressource</span>
                <select value={resId ?? ""} onChange={(e) => setResId(e.target.value)} aria-label="Ressource">
                  {CATALOGUE.map((f) => (
                    <optgroup key={f.id} label={f.nom}>
                      {(f.enfants ?? []).flatMap((e) => e.ressources ?? []).map((r) => {
                        const dispo = actives.some((a) => a.id === r.id);
                        return <option key={r.id} value={r.id} disabled={!dispo}>{r.nomFr}{dispo ? "" : " — fichier FAOSTAT à importer"}</option>;
                      })}
                      {(f.aVenir ?? []).map((n) => <option key={n} disabled>{n} — à venir</option>)}
                    </optgroup>
                  ))}
                  {actives.filter((a) => a.chemin.endsWith("Autres cultures")).map((a) => <option key={a.id} value={a.id}>{a.nomFr}</option>)}
                </select>
              </label>
              <div className="ge-metriques rs-ind" role="tablist" aria-label="Indicateur">
                {INDICATEURS_ORDRE.filter((i) => !jeu || jeu.indicateurs[i]).map((i) => (
                  <button key={i} type="button" role="tab" aria-selected={ind === i} className={`ge-metrique${ind === i ? " ge-metrique-on" : ""}`} onClick={() => setInd(i)}>
                    {NOMS_INDICATEUR[i]}
                  </button>
                ))}
              </div>
              <div className="ge-metriques rs-zones" role="tablist" aria-label="Zone géographique">
                {ZONES.map((z) => (
                  <button key={z} type="button" role="tab" aria-selected={zone === z} className={`ge-metrique${zone === z ? " ge-metrique-on" : ""}`} onClick={() => choisirZone(z)}>{z}</button>
                ))}
              </div>
              <label className="rs-champ rs-champ-pays">
                <span>Pays</span>
                <select value={m49 ?? ""} onChange={(e) => (e.target.value ? selectionner(e.target.value, false) : retour())} aria-label="Pays">
                  <option value="">Tous les pays</option>
                  {CONTINENTS.map((c) => (
                    <optgroup key={c} label={c}>
                      {(jeu?.zones ?? []).filter((z) => z.continent === c && z.type !== "agregat").sort((x, y) => nomZone(x).localeCompare(nomZone(y), "fr")).map((z) => (
                        <option key={z.m49} value={z.m49}>{nomZone(z)}{z.type === "historique" ? ` (${z.debut}–${z.fin})` : ""}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </label>
            </div>
            <div className="rs-annee">
              <button type="button" className="rs-play" onClick={() => { if (annee >= a1) setAnnee(a0); setLecture((l) => !l); }} aria-label={lecture ? "Pause" : "Lire les années"}>
                {lecture ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
              </button>
              <span className="rs-annee-l">Année</span>
              <input type="range" min={a0} max={a1} step={1} value={annee} onChange={(e) => { setLecture(false); setAnnee(Number(e.target.value)); }} aria-label="Année" />
              <output className="rs-annee-v">{annee}</output>
              {annee === a1 && <span className="rs-annee-n">dernière année du fichier</span>}
            </div>

            {/* ── Le rectangle ────────────────────────────────────────────── */}
            <div className="ge-corps rs-corps" ref={rectangle}>
              <div className="ge-colonne">
                <div className="ge-scene rs-scene">
                  {geo && jeu ? (
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
                      contours={neSel ? [neSel] : []}
                      vue={vue}
                      onSurvol={() => {}}
                      onChoix={() => {}}
                      onPays={surPays}
                      onPaysSurvol={setSurvol}
                    />
                  ) : (
                    <div className="xp-attente" aria-hidden="true"><span /></div>
                  )}
                  <div className="rs-zoom">
                    <button type="button" aria-label="Zoomer" onClick={() => globe.current?.zoomer(0.78)}><Plus size={16} aria-hidden="true" /></button>
                    <button type="button" aria-label="Dézoomer" onClick={() => globe.current?.zoomer(1.28)}><Minus size={16} aria-hidden="true" /></button>
                  </div>
                  {survol && jeu && ix && (() => {
                    const z = ix.parNe.get(survol.nom);
                    const o = z ? obs(jeu, z.m49, ind, annee) : null;
                    return (
                      <div className={`cf-tip${survol.x > 330 ? " cf-tip-g" : ""} rs-tip`} style={{ left: survol.x, top: survol.y }} aria-hidden="true">
                        <b>{countryFr(survol.nom)}</b>
                        <span>{o ? `${complet(o.valeur)} ${unite} · ${annee}` : `Indisponible en ${annee}`}</span>
                      </div>
                    );
                  })()}
                  <div className="ge-echelle rs-legende" aria-hidden="true">
                    <b>{NOMS_INDICATEUR[ind] ?? ind} · {annee}</b>
                    <div className="rs-rampe">
                      {RAMPE.map((c, i) => (
                        <span key={c}><i style={{ background: c }} />{i === 0 ? `< ${court(seuil[0] ?? 0)}` : i === RAMPE.length - 1 ? `≥ ${court(seuil[seuil.length - 1] ?? 0)}` : `${court(seuil[i - 1] ?? 0)} – ${court(seuil[i] ?? 0)}`}</span>
                      ))}
                      <span><i style={{ background: "#8b8fa3", opacity: 0.4 }} />Indisponible</span>
                    </div>
                    <em>{uniteTxt} · classes par quantiles</em>
                  </div>
                </div>
              </div>

              <aside className="ge-panneau rs-panneau" aria-live="polite">
                <div className="ge-fiche rs-vue" key={`${resId}|${m49 ?? "-"}`}>
                  {erreur ? (
                    <p className="rs-erreur">{erreur}</p>
                  ) : surfaceIndisponible ? (
                    <p className="rs-chargement">Chargement des données FAOSTAT…</p>
                  ) : zoneSel ? (
                    <FichePays
                      J={jeu!} z={zoneSel} ind={ind} annee={annee} cl={clMonde} clZone={cl} zone={zone} retour={retour}
                      nom={nomZone(zoneSel)} total={total?.valeur ?? null}
                    />
                  ) : (
                    <Synthese
                      J={jeu!} nomRes={nomRes} ind={ind} annee={annee} zone={zone} unite={unite} uniteTxt={uniteTxt} total={total} totalAvant={totalAvant}
                      cl={cl} nZones={cl.length} onPays={(id) => selectionner(id, false)} nomDe={(id) => nomZone(ix!.parM49.get(id)!)}
                    />
                  )}
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* ── Les graphiques ──────────────────────────────────────────────────── */}
      {jeu && ix && (
        <section id="graphiques" className="cg-section rs-graph-section">
          <div className="cg-wrap">
            <TitreSection titre="Évolution et comparaisons" sous={`${nomRes} · ${NOMS_INDICATEUR[ind] ?? ind} · ${a0}–${a1}`} />
            <div className="rs-graphs">
              <article className="rs-carte rs-carte-l">
                <h3>{ind === "rendement" ? "Rendement : pas de total mondial" : `${NOMS_INDICATEUR[ind]} mondiale`}</h3>
                {serieMonde ? (
                  <>
                    <p className="rs-note">Somme des entités du fichier, <b>recalculée</b> : pas un total officiel FAOSTAT. L’agrégat « China » en est exclu, les entités historiques n’y comptent que sur leurs années.</p>
                    <Courbes series={[serieMonde]} unite={uniteTxt} annee={annee} titre={`${NOMS_INDICATEUR[ind]} mondiale`} />
                  </>
                ) : (
                  <p className="rs-note">Un rendement mondial n’est pas la somme des rendements des pays : aucun total n’est calculé. Compare plutôt les pays ci-contre.</p>
                )}
              </article>

              <article className="rs-carte">
                <h3>{seriePays ? seriePays.nom : "Un pays"}<small>{m49 ? "pays sélectionné" : "premier de l’année"}</small></h3>
                {seriePays && <Courbes series={[seriePays]} unite={uniteTxt} annee={annee} titre={`${seriePays.nom} : ${NOMS_INDICATEUR[ind]}`} hauteur={210} />}
                <p className="rs-note">Cercle creux : valeur estimée, imputée ou externe. Une lacune de la courbe = valeur absente ou manquante.</p>
              </article>

              <article className="rs-carte">
                <h3>Comparer des pays</h3>
                <div className="rs-chips">
                  {seriesCompare.map((s) => (
                    <button key={s.id} type="button" className="rs-chip" onClick={() => setCompare(idsCompare.filter((x) => x !== s.id))} aria-label={`Retirer ${s.nom}`}>
                      <i style={{ background: s.couleur }} />{s.nom}<span aria-hidden="true">×</span>
                    </button>
                  ))}
                  {idsCompare.length < 6 && (
                    <select aria-label="Ajouter un pays à la comparaison" value="" onChange={(e) => e.target.value && setCompare([...idsCompare, e.target.value])}>
                      <option value="">+ Ajouter</option>
                      {jeu.zones.filter((z) => z.type === "pays" && !idsCompare.includes(z.m49)).sort((x, y) => nomZone(x).localeCompare(nomZone(y), "fr")).map((z) => <option key={z.m49} value={z.m49}>{nomZone(z)}</option>)}
                    </select>
                  )}
                </div>
                <Courbes series={seriesCompare} unite={uniteTxt} annee={annee} titre="Comparaison entre pays" hauteur={230} />
              </article>

              <article className="rs-carte">
                <h3>{ind === "surface" ? "Répartition des surfaces" : "Répartition de la production"}<small>{annee}</small></h3>
                {parts.length ? (
                  <>
                    <p className="rs-note">Part de chaque entité dans le total recalculé de {nf(total!.entites)} entités. Les entités historiques (URSS…) ne sont comparables qu’à leur époque.</p>
                    <Repartition lignes={parts} unite={uniteTxt} />
                  </>
                ) : (
                  <p className="rs-note">{ind === "rendement" ? "Un rendement n’a pas de part dans un total." : `Pas de total fiable pour ${annee}.`}</p>
                )}
              </article>
            </div>
          </div>
        </section>
      )}

      {/* ── Le classement ───────────────────────────────────────────────────── */}
      {jeu && ix && (
        <section id="classement" className="cg-section rs-classement-section">
          <div className="cg-wrap">
            <TitreSection titre={`${TITRES_CLASSEMENT[ind] ?? "Classement"} — ${annee}`} sous={`${nomRes} · ${NOMS_INDICATEUR[ind]} · ${zoneTxt} · ${nf(cl.length)} entités avec une valeur`} />
            <div className="rs-table-cadre">
              <table className="rs-table">
                <thead>
                  <tr>
                    <th>Rang</th><th>Pays</th><th className="rs-d">{NOMS_INDICATEUR[ind]} ({unite})</th>
                    <th className="rs-d">{ind === "rendement" ? "—" : "Part du total*"}</th>
                    <th className="rs-d">vs {annee - COMPARAISON}</th><th>Qualité</th>
                  </tr>
                </thead>
                <tbody>
                  {affiche.map((l) => (
                    <tr key={l.m49} className={m49 === l.m49 ? "rs-on" : ""} onClick={() => selectionner(l.m49)} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && selectionner(l.m49)}>
                      <td>{l.rang}</td>
                      <td><b>{nomZone(ix.parM49.get(l.m49)!)}</b>{l.type === "historique" && <em className="rs-tag">historique</em>}</td>
                      <td className="rs-d">{complet(l.valeur)}</td>
                      <td className="rs-d">{l.part !== null && ind !== "rendement" ? `${l.part.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %` : "—"}</td>
                      <td className={`rs-d ${l.evolution === null ? "" : l.evolution >= 0 ? "rs-haut" : "rs-bas"}`}>{l.evolution === null ? "—" : pct(l.evolution)}</td>
                      <td><span className={`rs-flag rs-flag-${l.flag}`} title={FLAGS[l.flag]?.libelle}>{flagLibelle(l.flag)}</span>{l.nonOfficielle && <em className="rs-tag">non officielle</em>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {cl.length > 15 && (
              <button type="button" className="rs-plus" onClick={() => setToutVoir((v) => !v)}>
                {toutVoir ? "Réduire" : `Voir les ${nf(cl.length)} entités`} <ChevronDown size={14} aria-hidden="true" style={{ transform: toutVoir ? "rotate(180deg)" : undefined }} />
              </button>
            )}
            <p className="rs-note">* Part du total recalculé (somme des entités du fichier), pas d’un total officiel. « vs {annee - COMPARAISON} » : évolution depuis cette année quand elle existe pour l’entité. Le classement exclut l’agrégat « China », qui recouvre « Chine continentale » et « Taïwan ».</p>
          </div>
        </section>
      )}

      {/* ── Sources et qualité ──────────────────────────────────────────────── */}
      {jeu && (
        <section id="sources" className="cg-section rs-sources-section">
          <div className="cg-wrap">
            <TitreSection titre="Sources et qualité des données" />
            <div className="rs-src">
              <div>
                <h4>Provenance</h4>
                <p><a href={jeu.source.url} target="_blank" rel="noopener noreferrer">{jeu.source.nom} <ExternalLink size={12} aria-hidden="true" /></a></p>
                <p>Fichier <code>{jeu.source.fichier}</code>, exporté le {jeu.source.date_export ? new Date(jeu.source.date_export + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "(date non indiquée)"}. La date d’export n’est pas l’année des valeurs : la dernière année observée est <b>{a1}</b>.</p>
                <p><a href={jeu.source.metadonnees} target="_blank" rel="noopener noreferrer">Métadonnées FAOSTAT <ExternalLink size={12} aria-hidden="true" /></a></p>
              </div>
              <div>
                <h4>Fiabilité des valeurs</h4>
                <ul className="rs-flags">
                  {Object.entries(FLAGS).map(([k, v]) => <li key={k}><span className={`rs-flag rs-flag-${k}`}>{v.court}</span>{v.libelle}</li>)}
                </ul>
                <p>Une valeur manquante (M) ou absente n’est jamais affichée comme zéro. Aucune interpolation.</p>
              </div>
              <div>
                <h4>Entités et recouvrements</h4>
                <p>{nf(jeu.zones.filter((z) => z.type === "pays").length)} pays actuels, {nf(jeu.zones.filter((z) => z.type === "historique").length)} entités historiques (URSS, Yougoslavie, Tchécoslovaquie…), {nf(jeu.zones.filter((z) => z.type === "agregat").length)} agrégat (« China »).</p>
                <p>Les entités historiques ne sont pas rattachées aux frontières actuelles : elles apparaissent dans les classements et les graphiques, pas sur le globe. Les totaux « monde » sont recalculés, jamais présentés comme officiels.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <Pied />
    </div>
  );
}

/* ── Le panneau : la synthèse ────────────────────────────────────────────── */

function Synthese({
  J, nomRes, ind, annee, zone, unite, uniteTxt, total, totalAvant, cl, nZones, onPays, nomDe,
}: {
  J: JeuRessource; nomRes: string; ind: string; annee: number; zone: ZoneFiltre; unite: string; uniteTxt: string;
  total: { valeur: number; entites: number } | null; totalAvant: { valeur: number } | null; cl: ReturnType<typeof classement>; nZones: number;
  onPays: (id: string) => void; nomDe: (id: string) => string;
}) {
  const top = cl.slice(0, 5);
  const max = Math.max(1, ...top.map((l) => l.valeur));
  const evo = total && totalAvant && totalAvant.valeur > 0 ? ((total.valeur - totalAvant.valeur) / totalAvant.valeur) * 100 : null;
  const qual: Record<string, number> = {};
  for (const l of cl) qual[l.flag] = (qual[l.flag] ?? 0) + 1;
  const [, a1] = J.annees;
  return (
    <>
      <h3 className="ge-nom">{nomRes} · {zone}</h3>
      <div className="ge-vedette rs-vedette">
        {total && zone === "Monde" ? (
          <>
            <span className="ge-vedette-l">{NOMS_INDICATEUR[ind]} cumulée · {annee}</span>
            <Odometre className="ge-vedette-v" valeur={total.valeur} dec={0} unite={`\u00a0${unite}`} duree={900} tours={1} couleur={1} />
            <span className="ge-vedette-r">Somme recalculée de {nf(total.entites)} entités du fichier, non officielle{evo !== null ? ` · ${evo >= 0 ? "+" : ""}${evo.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} % depuis ${annee - COMPARAISON}` : ""}</span>
          </>
        ) : top[0] ? (
          <>
            <span className="ge-vedette-l">{ind === "rendement" ? "Rendement le plus élevé" : "Premier producteur"} · {annee}</span>
            <b className="rs-vedette-v">{nomDe(top[0].m49)}</b>
            <span className="ge-vedette-r">{complet(top[0].valeur)} {uniteTxt}{ind === "rendement" ? " : un rendement moyen, jamais une production" : ""}</span>
          </>
        ) : (
          <span className="ge-vedette-l">Aucune donnée pour {annee}</span>
        )}
      </div>

      <h4 className="cf-st">Principaux pays{zone !== "Monde" ? ` · ${zone}` : ""}</h4>
      <ul className="rs-top">
        {top.map((l) => (
          <li key={l.m49}>
            <button type="button" onClick={() => onPays(l.m49)}>
              <span className="rs-top-r">{l.rang}</span>
              <span className="rs-top-n">{nomDe(l.m49)}{l.type === "historique" && <em className="rs-tag">historique</em>}</span>
              <i><b style={{ width: `${(l.valeur / max) * 100}%` }} /></i>
              <strong>{court(l.valeur)}</strong>
            </button>
          </li>
        ))}
      </ul>

      <div className="rs-qual">
        <span>{nf(nZones)} entités avec une valeur en {annee}</span>
        {Object.entries(qual).map(([k, n]) => <span key={k} className={`rs-flag rs-flag-${k}`} title={FLAGS[k]?.libelle}>{flagLibelle(k)} · {nf(n)}</span>)}
      </div>
      {annee === a1 && <p className="ge-note rs-aide">{a1} est la dernière année de ce fichier FAOSTAT.</p>}
      <p className="ge-note rs-aide">Clique un pays sur le globe ou dans la liste pour voir ses trois indicateurs et son évolution.</p>
    </>
  );
}

/* ── Le panneau : un pays ────────────────────────────────────────────────── */

function FichePays({
  J, z, ind, annee, cl, clZone, zone, retour, nom, total,
}: {
  J: JeuRessource; z: Zone; ind: string; annee: number; cl: ReturnType<typeof classement>; clZone: ReturnType<typeof classement>; zone: ZoneFiltre;
  retour: () => void; nom: string; total: number | null;
}) {
  const rang = rangDe(cl, z.m49);
  const rangZ = zone !== "Monde" ? rangDe(clZone, z.m49) : null;
  const o = obs(J, z.m49, ind, annee);
  const der = !o ? derniere(J, z.m49, ind, annee) : null;
  const sp = points(J, z.m49, ind);
  const serie = { id: z.m49, nom, couleur: "#6d4aff", pts: sp.map((p) => ({ annee: p.annee, valeur: p.valeur, flag: p.flag, nonOfficielle: p.nonOfficielle })) };
  const unite = J.indicateurs[ind]?.unite ?? "";
  const evo = rang?.evolution ?? null;
  return (
    <>
      <button type="button" className="cf-retour" onClick={retour}><ArrowLeft size={14} aria-hidden="true" /> Synthèse mondiale</button>
      <h3 className="ge-nom">{nom}{z.type === "historique" && <em className="rs-tag rs-tag-g">historique</em>}</h3>
      {z.note && z.type === "historique" && <p className="rs-note">{z.note} Série {z.debut}–{z.fin}, non rattachée à une géométrie actuelle.</p>}

      <div className="rs-inds">
        {INDICATEURS_ORDRE.filter((i) => J.indicateurs[i]).map((i) => {
          const oi = obs(J, z.m49, i, annee);
          const man = manquante(J, z.m49, i, annee);
          return (
            <div key={i} className={`rs-ind-c${i === ind ? " rs-ind-on" : ""}`}>
              <small>{NOMS_INDICATEUR[i]}</small>
              {oi ? (
                <>
                  <b>{complet(oi.valeur)}</b>
                  <span>{J.indicateurs[i].unite} · {annee}</span>
                  <em className={`rs-flag rs-flag-${oi.flag}`} title={FLAGS[oi.flag]?.libelle}>{flagLibelle(oi.flag)}{oi.nonOfficielle ? " · non officielle" : ""}</em>
                </>
              ) : (
                <>
                  <b className="rs-nd">—</b>
                  <span>{man ? `Manquante en ${annee}` : `Indisponible en ${annee}`}</span>
                </>
              )}
            </div>
          );
        })}
      </div>

      {!o && (
        <p className="rs-note">
          {der ? <>Pas de valeur en {annee} pour cet indicateur. Dernière observation : <b>{complet(der.valeur)} {unite} en {der.annee}</b> ({flagLibelle(der.flag)}).</> : "Aucune observation disponible jusqu’à cette année."}
        </p>
      )}

      {o && rang && (
        <ul className="rs-faits">
          <li><span>Rang mondial</span><b>{rang.rang}<small> sur {cl.length}</small></b></li>
          {rangZ && <li><span>Rang · {zone}</span><b>{rangZ.rang}<small> sur {clZone.length}</small></b></li>}
          {rang.part !== null && ind !== "rendement" && total && <li><span>Part du total recalculé</span><b>{rang.part.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %</b></li>}
          <li><span>vs {annee - COMPARAISON}</span><b className={evo === null ? "" : evo >= 0 ? "rs-haut" : "rs-bas"}>{evo === null ? "—" : pct(evo)}<small>{rang.avant ? ` (${complet(rang.avant.valeur)} en ${rang.avant.annee})` : ""}</small></b></li>
        </ul>
      )}

      <h4 className="cf-st">{NOMS_INDICATEUR[ind]} · {z.debut}–{z.fin}</h4>
      <Courbes series={[serie]} unite={UNITES_LIBELLE[unite] ?? unite} annee={annee} titre={`${nom} : ${NOMS_INDICATEUR[ind]}`} hauteur={170} />

      <details className="rs-trace">
        <summary>Ligne source {o ? `· ${annee}` : ""}</summary>
        <p>
          {o ? (
            <>FAOSTAT {J.ressource.domaine} · zone M49 {z.m49} ({z.nom}) · élément {J.indicateurs[ind].code_element} ({J.indicateurs[ind].nom_fao}) · produit CPC {J.ressource.code_item} ({J.ressource.nom_fao}) · année {annee} · valeur {complet(o.valeur)} {unite} · flag {o.flag}{o.nonOfficielle ? " · note « Unofficial figure »" : ""}</>
          ) : (
            <>Aucune ligne utilisable pour {annee} : zone M49 {z.m49}, élément {J.indicateurs[ind].code_element}.</>
          )}
        </p>
        <a href={J.source.url} target="_blank" rel="noopener noreferrer">FAOSTAT <ArrowUpRight size={12} aria-hidden="true" /></a>
      </details>
    </>
  );
}
