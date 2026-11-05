"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Droplets, ExternalLink, Flame, GitCompareArrows, Fuel } from "lucide-react";
import { EnTete, ImagePlaceholder, LENT, Pied, TitreSection } from "@/components/concept/pieces";
import { Jetons, Dessin } from "@/components/concept/Jetons";
import { Loupe } from "@/components/concept/Loupe";
import { Odometre, gelerOdometres } from "@/components/concept/Roulement";
import { Selecteur } from "@/components/concept/Selecteur";
import { SelecteurGroupes, type Groupe, type OptionGroupe } from "@/components/concept/SelecteurGroupes";
import { Titre, usePret, useProgression, useVu } from "@/components/concept/ouverture";
import { useTheme } from "@/components/concept/Theme";
import { countryFr } from "@/data/countryNamesFr";
import type { FicheArticle } from "@/data/concept/conceptGeo";
import type { FicheDebat } from "@/data/concept/conceptEconomie";
import type { Coloration, GlobeExplorerHandle, VueGlobe } from "@/components/explorer/GlobeExplorer";
import { GlobeCompact, type InfoBulle } from "@/components/explorer/GlobeCompact";
import { vueDePays } from "@/components/explorer/vues";
import { chargerIndex, chargerJeu } from "@/data/ressources/charger";
import { CATALOGUE, ressourcesActives, type RessourceActive } from "@/data/ressources/catalogue";
import {
  FLAGS, NOMS_INDICATEUR, UNITES_LIBELLE, classeDe, classement, complet, court, derniere, flagLibelle, indexer, manquante, obs, points, rangDe, seuils, totalMonde,
} from "@/data/ressources/calc";
import { nomZone } from "@/data/ressources/noms";
import type { EntreeIndex, JeuRessource, Zone } from "@/data/ressources/types";
import { Courbes, Repartition, type SerieCourbe } from "./Courbes";
import { EvolutionCourbe } from "@/components/concept/EvolutionCourbe";
import { TempsReelBloc, type CompteurTR } from "@/components/concept/TempsReelBloc";
import { CADENCES_RESSOURCES, parSeconde as debitRessource } from "@/data/ressources/tempsReel";
import "@/components/concept/concept.css";
import "@/components/concept/v2eco.css";
import "@/components/explorer/explorer.css";
import "./ressources.css";

/* ═══════════════════════════════════════════════════════════════════════════
   LA PAGE RESSOURCES

   Même construction que Économie : un grand rectangle (globe à gauche, fiche à droite), la frise des années dessous, les graphiques, le
   classement dans sa bande claire, les articles, la FAQ. Les données viennent de public/ressources/<id>.json (scripts/ressources).
   ═══════════════════════════════════════════════════════════════════════════ */

const RAMPE = ["#ede9fe", "#d4c6fd", "#b39afb", "#8f6bf7", "#6a3fe0", "#43198f"];
const COULEURS_PAYS = ["#6d4aff", "#e5484d", "#0891b2", "#f08a24", "#16a34a", "#d946ef"];
const INDICATEURS = ["production", "surface", "rendement"] as const;
const COMPARAISON = 10;
const AUCUN_CONTOUR: string[] = [];

const nf = (v: number) => v.toLocaleString("fr-FR");
/** Une évolution en %, sans « -0 % » : une variation qui s'arrondit à zéro s'écrit 0 %. */
const pct = (x: number) => {
  const r = Math.round(x);
  return r === 0 ? "0 %" : `${r > 0 ? "+" : ""}${r.toLocaleString("fr-FR")} %`;
};
const nbsp = (u: string) => ` ${u}`;

interface Props {
  articles: FicheArticle[];
  faq: { question: string; answer: string }[];
  debats: FicheDebat[];
}

type Col = "production" | "surface" | "rendement" | "part";

export function RessourcesPage({ articles, faq, debats }: Props) {
  const [theme] = useTheme();
  const ouverture = useProgression();
  const pret = usePret();
  const bande = useVu();
  const globe = useRef<GlobeExplorerHandle>(null);
  const rectangle = useRef<HTMLDivElement>(null);
  const railDebats = useRef<HTMLDivElement>(null);
  const priseDebats = useRef<{ x: number; g: number } | null>(null);
  const railArts = useRef<HTMLDivElement>(null);
  const priseArts = useRef<{ x: number; g: number } | null>(null);

  const anneeEnCours = new Date().getFullYear();
  const compteurs = useMemo<CompteurTR[]>(
    () => CADENCES_RESSOURCES.map((c) => ({
      id: c.id, label: c.label, base: c.stock ?? 0, parSeconde: debitRessource(c), dec: c.dec, unite: c.unite, mot: c.mot, note: c.note,
      depuisMs: c.stockMs ?? Date.UTC(new Date().getFullYear(), 0, 1),
      icone: c.id === "foret" ? Flame : c.id === "eau" ? Droplets : Fuel,
    })),
    [],
  );

  const [index, setIndex] = useState<EntreeIndex[] | null>(null);
  const [resId, setResId] = useState<string | null>(null);
  const [jeu, setJeu] = useState<JeuRessource | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [geo, setGeo] = useState<GeoJSON.FeatureCollection | null>(null);

  const [ind, setInd] = useState<string>("production");
  const [annee, setAnnee] = useState<number>(2024);
  const [m49, setM49] = useState<string | null>(null);
  const [compare, setCompare] = useState<string[] | null>(null);
  const [filtre, setFiltre] = useState("");
  const [col, setCol] = useState<Col>("production");
  const [sens, setSens] = useState<1 | -1>(-1);
  const [qOuverte, setQOuverte] = useState<number | null>(0);

  /* ── Chargements : l'index, la géométrie, puis la ressource choisie ───────── */
  useEffect(() => {
    let vivant = true;
    chargerIndex()
      .then((l) => {
        if (!vivant) return;
        setIndex(l);
        setResId((c) => c ?? ressourcesActives(l)[0]?.id ?? null);
      })
      .catch(() => vivant && setErreur("Impossible de charger la liste des ressources."));
    fetch("/geo/ne_50m_countries.simplified.geojson").then((r) => r.json()).then((g) => vivant && setGeo(g)).catch(() => {});
    return () => { vivant = false; };
  }, []);

  useEffect(() => {
    if (!resId) return;
    let vivant = true;
    setJeu(null);
    setErreur(null);
    chargerJeu(resId)
      .then((j) => {
        if (!vivant) return;
        setJeu(j);
        setAnnee(j.annees[1]);
        setM49(null);
        setCol("production");
        setCompare(null);
        setInd((c) => (j.indicateurs[c] ? c : Object.keys(j.indicateurs)[0]));
      })
      .catch(() => vivant && setErreur("Impossible de charger les données de cette ressource."));
    return () => { vivant = false; };
  }, [resId]);

  const actives = useMemo(() => (index ? ressourcesActives(index) : []), [index]);
  const res: RessourceActive | undefined = actives.find((r) => r.id === resId);
  const ix = useMemo(() => (jeu ? indexer(jeu) : null), [jeu]);
  const unite = jeu?.indicateurs[ind]?.unite ?? "";
  const uniteTxt = UNITES_LIBELLE[unite] ?? unite;
  const [a0, a1] = jeu?.annees ?? [1961, 2024];
  const nomRes = res?.nomFr ?? "Ressource";

  /* ── Les calculs, une fois par changement de filtre ───────────────────────── */
  const cl = useMemo(() => (jeu ? classement(jeu, ind, annee, "Monde", COMPARAISON) : []), [jeu, ind, annee]);
  const total = jeu ? totalMonde(jeu, ind, annee) : null;
  const totalAvant = jeu ? totalMonde(jeu, ind, annee - COMPARAISON) : null;
  const seuil = useMemo(() => seuils(cl.filter((l) => l.type === "pays").map((l) => l.valeur)), [cl]);

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
      if (v === undefined) return { nom, couleur: "#8b8fa3", opacite: 0.15 };
      return { nom, couleur: RAMPE[classeDe(v, seuil)], opacite: neSel ? (nom === neSel ? 0.92 : 0.5) : 0.82 };
    });
  }, [geo, valeurParNe, seuil, neSel]);

  const contours = useMemo(() => (neSel ? [neSel] : AUCUN_CONTOUR), [neSel]);
  const vue = useMemo<VueGlobe | null>(() => (geo && neSel ? vueDePays(geo, [neSel]) : null), [geo, neSel]);

  /* ── Actions ──────────────────────────────────────────────────────────────── */
  const surPays = useCallback(
    (nom: string | null) => {
      if (!nom || !ix) { setM49(null); return; }
      const z = ix.parNe.get(nom);
      setM49(z ? z.m49 : null);
    },
    [ix],
  );
  const selectionner = (id: string, defiler = true) => {
    setM49(id);
    if (defiler) rectangle.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  const retour = () => { setM49(null); globe.current?.recentrer(); };

  const infoBulle = useCallback(
    (nom: string): InfoBulle | null => {
      if (!jeu || !ix) return null;
      const z = ix.parNe.get(nom);
      const o = z ? obs(jeu, z.m49, ind, annee) : null;
      return { titre: countryFr(nom), ligne: o ? `${complet(o.valeur)} ${unite}` : `Indisponible en ${annee}` };
    },
    [jeu, ix, ind, annee, unite],
  );

  /* Les pays comparés : par défaut les quatre premiers de l'année. */
  const idsCompare = useMemo(() => compare ?? cl.filter((l) => l.type === "pays").slice(0, 4).map((l) => l.m49), [compare, cl]);
  const comparer = (id: string) => {
    setCompare((c) => { const base = c ?? idsCompare; return base.includes(id) ? base : [...base, id].slice(-6); });
    document.getElementById("comparaison")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* ── Les séries des graphiques ────────────────────────────────────────────── */
  const serieMonde = useMemo<SerieCourbe | null>(() => {
    if (!jeu?.monde[ind]) return null;
    return { id: "monde", nom: "Somme des entités du fichier", couleur: "#6d4aff", pts: jeu.monde[ind].v.map((v, i) => ({ annee: a0 + i, valeur: v, flag: v === null ? undefined : "A" })) };
  }, [jeu, ind, a0]);
  const sId = (id: string, couleur: string): SerieCourbe | null => {
    const z = ix?.parM49.get(id);
    if (!jeu || !z) return null;
    return { id, nom: nomZone(z), couleur, pts: points(jeu, id, ind).map((p) => ({ annee: p.annee, valeur: p.valeur, flag: p.flag, nonOfficielle: p.nonOfficielle })) };
  };
  const idPays = m49 ?? cl.find((l) => l.type === "pays")?.m49 ?? null;
  const seriePays = idPays ? sId(idPays, "#6d4aff") : null;
  const seriesCompare = idsCompare.map((id, i) => sId(id, COULEURS_PAYS[i % COULEURS_PAYS.length])).filter(Boolean) as SerieCourbe[];

  const parts = useMemo(() => {
    if (!total || !jeu || !ix || ind === "rendement") return [];
    const top = cl.slice(0, 10);
    const reste = total.valeur - top.reduce((s, l) => s + l.valeur, 0);
    const ls: { id: string; nom: string; valeur: number; part: number; couleur: string; note?: string; onClick?: () => void }[] = top.map((l, i) => ({
      id: l.m49, nom: nomZone(ix.parM49.get(l.m49)!), valeur: l.valeur, part: (l.valeur / total.valeur) * 100, couleur: RAMPE[Math.max(2, 5 - Math.floor(i / 2))],
      note: l.type === "historique" ? "entité historique" : undefined, onClick: () => selectionner(l.m49),
    }));
    if (reste > 0) ls.push({ id: "autres", nom: "Autres entités du fichier", valeur: reste, part: (reste / total.valeur) * 100, couleur: "#9ca3af" });
    return ls;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, cl, ind, jeu, ix]);

  /* ── Le classement en tableau : les indicateurs du fichier côte à côte, comme sur Économie ── */
  const lignes = useMemo(() => {
    if (!jeu || !ix) return [];
    const totalProd = totalMonde(jeu, "production", annee)?.valeur ?? null;
    const rows = jeu.zones
      .filter((z) => z.type === "pays" || z.type === "historique")
      .map((z) => {
        const p = obs(jeu, z.m49, "production", annee);
        const s = obs(jeu, z.m49, "surface", annee);
        const r = obs(jeu, z.m49, "rendement", annee);
        return { z, nom: nomZone(z), production: p, surface: s, rendement: r, part: p && totalProd ? (p.valeur / totalProd) * 100 : null };
      })
      .filter((r) => r.production || r.surface || r.rendement);
    const v = (r: (typeof rows)[number]) => (col === "part" ? r.part : r[col]?.valeur ?? null);
    rows.sort((a, b) => {
      const x = v(a), y = v(b);
      if (x === null && y === null) return a.nom.localeCompare(b.nom, "fr");
      if (x === null) return 1;
      if (y === null) return -1;
      return (x - y) * sens || a.nom.localeCompare(b.nom, "fr");
    });
    return rows;
  }, [jeu, ix, annee, col, sens]);
  const trier = (c: Col) => { if (c === col) setSens((s) => (s === -1 ? 1 : -1)); else { setCol(c); setSens(-1); } };

  /* Les ressources rangées par catégorie principale (Agriculture, Élevage, Énergie…), pour le sélecteur. */
  const groupes = useMemo<Groupe[]>(() => {
    const dispo = new Set(actives.map((a) => a.id));
    const vus = new Set<string>();
    const out: Groupe[] = [];
    for (const f of CATALOGUE) {
      const options: OptionGroupe[] = [];
      const parcourir = (g: (typeof CATALOGUE)[number], detail?: string) => {
        for (const r of g.ressources ?? []) { vus.add(r.id); options.push({ id: r.id, label: r.nomFr, detail, actif: dispo.has(r.id) }); }
        for (const e of g.enfants ?? []) parcourir(e, e.nom);
        for (const n of g.aVenir ?? []) options.push({ id: `${g.id}-${n}`, label: n, actif: false });
      };
      parcourir(f);
      /* Les ressources importées d'abord, puis celles à venir. */
      options.sort((a, b) => Number(b.actif) - Number(a.actif));
      if (options.length) out.push({ titre: f.nom, options });
    }
    const autres = actives.filter((a) => !vus.has(a.id)).map((a) => ({ id: a.id, label: a.nomFr, actif: true }));
    if (autres.length) out.push({ titre: "Autres", options: autres });
    return out;
  }, [actives]);

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

      <TempsReelBloc
        id="temps-reel-ressources"
        sous={<>Depuis le 1<sup>er</sup> janvier {anneeEnCours}</>}
        compteurs={compteurs}
        sources={
          <>
            Chaque compteur étale une grandeur annuelle publiée sur l’année en cours ; rien n’est mesuré à la seconde.{" "}
            {CADENCES_RESSOURCES.map((c, i) => (
              <span key={c.id}>{i > 0 && " "}<a href={c.source.url} target="_blank" rel="noopener noreferrer">{c.source.nom}</a> : {c.source.precision}.</span>
            ))}
          </>
        }
      />

      {/* ── Le globe, sa frise ───────────────────────────────────────────────── */}
      <section id="globe" className="cg-section cg-eco-globe">
        <div className="cg-wrap">
          <header className="v2-tete">
            <h2 className="v2-h2">Notre globe</h2>
            <p className="v2-sous">{jeu ? `De ${a0} à ${a1} · ${nomRes}` : "Chargement…"}</p>
          </header>

          <div className="ge">
            {/* Les ressources : un sélecteur à catégories, le même que celui des classements. */}
            <div className="rs-res rs-choix">
              <span className="rs-choix-l">Ressource</span>
              <SelecteurGroupes valeur={resId} groupes={groupes} onChange={setResId} label="Ressource affichée" />
            </div>

            <div className="ge-corps rs-corps" ref={rectangle}>
              <div className="ge-colonne">
                <GlobeCompact
                  ref={globe}
                  className="rs-scene"
                  geo={geo && jeu ? geo : null}
                  nuit={theme === "nuit"}
                  colorations={colorations}
                  contours={contours}
                  vue={vue}
                  infoBulle={infoBulle}
                  onPays={surPays}
                >
                  <div className="rs-leg" aria-hidden="true">
                    <b>{NOMS_INDICATEUR[ind] ?? ind} · {annee}</b>
                    <div className="rs-leg-barre">{RAMPE.map((c) => <i key={c} style={{ background: c }} />)}</div>
                    <div className="rs-leg-b">
                      <span>{`< ${court(seuil[0] ?? 0)}`}</span>
                      <span>{`≥ ${court(seuil[seuil.length - 1] ?? 0)}`}</span>
                    </div>
                    <span className="rs-leg-nd"><i />Indisponible · {uniteTxt}</span>
                  </div>
                </GlobeCompact>
              </div>

              <aside className="ge-panneau rs-panneau" aria-live="polite">
                <div className="ge-fiche rs-vue" key={`${resId}|${m49 ?? "-"}`}>
                  {erreur ? (
                    <p className="rs-erreur">{erreur}</p>
                  ) : !jeu || !ix ? (
                    <p className="rs-chargement">Chargement des données FAOSTAT…</p>
                  ) : zoneSel ? (
                    <FichePays J={jeu} z={zoneSel} ind={ind} annee={annee} cl={cl} nom={nomZone(zoneSel)} total={total?.valeur ?? null} retour={retour} onInd={setInd} onComparer={comparer} />
                  ) : (
                    <Synthese J={jeu} nomRes={nomRes} ind={ind} annee={annee} total={total} totalAvant={totalAvant} cl={cl} onInd={setInd} onPays={(id) => selectionner(id, false)} nomDe={(id) => nomZone(ix.parM49.get(id)!)} />
                  )}
                </div>
              </aside>
            </div>

            {/* La frise des années, sous le rectangle : la même que celle d'Économie. */}
            {jeu && (
              <div className="ge-sous">
                <FriseAnnees annees={jeu.annees} valeur={annee} onAnnee={setAnnee} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Les graphiques ──────────────────────────────────────────────────── */}
      {jeu && ix && (
        <section id="graphiques" className="cg-section rs-graph-section">
          <div className="cg-wrap">
            <TitreSection titre="Évolution et comparaisons" sous={`${nomRes} · ${NOMS_INDICATEUR[ind]} · ${a0}–${a1}`} />
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

              <article className="rs-carte" id="comparaison">
                <h3>Comparer des pays<a className="rs-lien" href="/comparer">Comparaison complète <ArrowUpRight size={13} aria-hidden="true" /></a></h3>
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

      {/* ── Le classement : la bande claire d'Économie, le même tableau ─────── */}
      {jeu && ix && (
        <section ref={bande.ref as React.RefObject<HTMLElement>} className="cg-bande" data-vu={bande.vu ? "1" : "0"}>
          <div className="cg-bande-h">
            <h2 className="cg-bande-t">Le classement</h2>
            <p className="cg-bande-c">
              {nf(jeu.zones.filter((z) => z.type === "pays" || z.type === "historique").length)} entités, {nf(a1 - a0 + 1)} années, {INDICATEURS.filter((i) => jeu.indicateurs[i]).length > 1 ? `${INDICATEURS.filter((i) => jeu.indicateurs[i]).length} indicateurs` : "un indicateur"}. Choisissez une année, triez la colonne qui vous intéresse.
            </p>
            <div className="cg-bande-ctrl">
              <label className="cg-an-choix">
                <span className="cg-an-choix-l">Date</span>
                <Selecteur valeur={annee} options={Array.from({ length: a1 - a0 + 1 }, (_, i) => a1 - i)} onChange={setAnnee} label="Date du classement" />
              </label>
              <input className="cg-filtre cg-filtre-clair" type="search" placeholder="Trouver un pays" value={filtre} onChange={(e) => setFiltre(e.target.value)} aria-label="Trouver un pays dans le classement" />
            </div>
          </div>
          <div className="cg-bande-bloc">
            <Tableau lignes={lignes} col={col} sens={sens} choisi={m49} onTrier={trier} onChoisi={(id) => selectionner(id)} jeu={jeu} recherche={filtre} />
            <p className="cg-bande-n">
              {filtre.trim() ? `${nf(lignes.filter((r) => r.nom.toLowerCase().includes(filtre.trim().toLowerCase())).length)} correspondance(s) · ` : `${nf(lignes.length)} entités · `}« n.d. » signale une valeur que FAOSTAT ne publie pas pour cette entité cette année-là ; ces lignes passent en fin de tri, elles ne sont pas classées dernières.
              Une lettre en exposant marque une valeur non officielle (E estimée, I imputée, X source externe). La part se calcule sur le total recalculé de {annee}, pas sur un total officiel. Cliquez une ligne pour la retrouver sur le globe.
            </p>
          </div>
        </section>
      )}

      {/* ── Les articles ────────────────────────────────────────────────────── */}
      {articles.length > 0 && (
        <section className="cg-section cg-lectures">
          <div className="cg-wrap">
            <div className="cg-arts-tete">
              <h2 className="cg-arts-h">Articles</h2>
            </div>
            <div className="cg-arts-l">
              <article className="cg-art cg-art-une" onClick={articles[0].href ? () => { window.location.href = articles[0].href!; } : undefined} style={articles[0].href ? { cursor: "pointer" } : undefined}>
                <ImagePlaceholder nom="IMAGE_PNG_RES_01" ratio="16 / 10" />
                <span className="cg-rubrique">{articles[0].rubrique} · {articles[0].duree}</span>
                <h3 className="cg-art-t">{articles[0].titre}</h3>
                <p className="cg-art-c">{articles[0].chapo}</p>
                {articles[0].href && <a className="cg-art-lien" href={articles[0].href}>Lire le dossier <span aria-hidden="true">→</span></a>}
              </article>
              {debats.length > 0 && (
                <div className="cg-debats">
                  <div className="cg-debats-t">
                    <span className="cg-debats-st">Nos plus gros débats</span>
                    <span className="cg-debats-n">{debats.length} en cours</span>
                  </div>
                  <div
                    ref={railDebats}
                    className="cg-debats-l"
                    onPointerDown={(e) => { delete e.currentTarget.dataset.mv; priseDebats.current = { x: e.clientX, g: e.currentTarget.scrollLeft }; e.currentTarget.setPointerCapture(e.pointerId); }}
                    onPointerMove={(e) => { if (!priseDebats.current || !railDebats.current) return; if (Math.abs(e.clientX - priseDebats.current.x) > 5) railDebats.current.dataset.mv = "1"; railDebats.current.scrollLeft = priseDebats.current.g - (e.clientX - priseDebats.current.x); }}
                    onPointerUp={() => { priseDebats.current = null; }}
                    onPointerCancel={() => { priseDebats.current = null; }}
                    onDragStart={(e) => e.preventDefault()}
                    onClickCapture={(e) => { if (railDebats.current?.dataset.mv) { e.preventDefault(); e.stopPropagation(); } }}
                  >
                    {debats.map((d) => (
                      <a key={d.id} href="/forum" className="cg-debat">
                        <span className="cg-debat-q">{d.question}</span>
                        <span className="cg-debat-a">{d.ancre}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="cg-arts-c">
                <h3 className="cg-arts-st">Nos articles</h3>
                <div
                  ref={railArts}
                  className="cg-arts"
                  onPointerDown={(e) => { delete e.currentTarget.dataset.mv; priseArts.current = { x: e.clientX, g: e.currentTarget.scrollLeft }; e.currentTarget.setPointerCapture(e.pointerId); }}
                  onPointerMove={(e) => { if (!priseArts.current || !railArts.current) return; if (Math.abs(e.clientX - priseArts.current.x) > 5) railArts.current.dataset.mv = "1"; railArts.current.scrollLeft = priseArts.current.g - (e.clientX - priseArts.current.x); }}
                  onPointerUp={() => { priseArts.current = null; }}
                  onPointerCancel={() => { priseArts.current = null; }}
                >
                  {articles.slice(1).map((a, k) => (
                    <article key={a.slug} className="cg-art" onClick={a.href ? () => { if (!railArts.current?.dataset.mv) window.location.href = a.href!; } : undefined} style={a.href ? { cursor: "pointer" } : undefined}>
                      <ImagePlaceholder nom={`IMAGE_PNG_RES_0${((k + 1) % 9) + 1}`} ratio="16 / 9" />
                      <span className="cg-rubrique">{a.rubrique} · {a.duree}</span>
                      <h4 className="cg-art-t">{a.titre}</h4>
                      {a.href && <a className="cg-art-lien" href={a.href}>Lire le dossier <span aria-hidden="true">→</span></a>}
                    </article>
                  ))}
                </div>
                <div className="cg-arts-f" aria-hidden="true" />
              </div>
            </div>
            <p className="rs-note rs-note-arts">Aucun article ne traite encore des ressources : ces lectures sont celles de nos dossiers économiques, en attendant les premiers dossiers sur le blé, l’énergie et les minerais.</p>
          </div>
        </section>
      )}

      {/* ── La FAQ ──────────────────────────────────────────────────────────── */}
      {faq.length > 0 && (
        <section className="cg-section cg-questions">
          <div className="cg-wrap">
            <TitreSection titre={`Les questions sur ${nomRes === "Ressource" ? "les ressources" : `le ${nomRes.toLowerCase()}`}`} />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: faq.map((q) => ({ "@type": "Question", name: q.question, acceptedAnswer: { "@type": "Answer", text: q.answer } })),
                }),
              }}
            />
            <div className="cg-q-liste">
              {faq.map((q, k) => {
                const on = qOuverte === k;
                return (
                  <div key={q.question} className={`cg-q${on ? " cg-q-on" : ""}`}>
                    <button type="button" className="cg-q-t" aria-expanded={on} onClick={() => setQOuverte(on ? null : k)}>
                      {q.question}
                      <span className="cg-q-signe" aria-hidden="true" />
                    </button>
                    <AnimatePresence initial={false}>
                      {on && (
                        <motion.div className="cg-q-r" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.36, ease: LENT }}>
                          <p>{q.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Méthodologie et sources ─────────────────────────────────────────── */}
      {jeu && (
        <section id="sources" className="cg-section rs-sources-section">
          <div className="cg-wrap">
            <TitreSection titre="Méthodologie et sources" sous="D’où viennent ces données" />
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

/* ── La frise des années : celle d'Économie, sur les années du fichier ───── */

const FriseAnnees = memo(function FriseAnnees({
  annees, valeur, onAnnee,
}: {
  annees: [number, number];
  valeur: number;
  onAnnee: (a: number) => void;
}) {
  const [vue, setVue] = useState(valeur);
  const vueRef = useRef(valeur);
  const rail = useRef<HTMLDivElement>(null);
  const tire = useRef(false);
  const attente = useRef<number | null>(null);
  const liste = useMemo(() => Array.from({ length: annees[1] - annees[0] + 1 }, (_, i) => annees[0] + i), [annees]);

  useEffect(() => { setVue(valeur); vueRef.current = valeur; }, [valeur]);
  useEffect(() => () => { if (attente.current) clearTimeout(attente.current); gelerOdometres(false); }, []);

  const vise = useCallback((a: number, toutDeSuite = false) => {
    vueRef.current = a;
    setVue(a);
    if (attente.current) clearTimeout(attente.current);
    if (toutDeSuite) onAnnee(a);
    else attente.current = window.setTimeout(() => onAnnee(a), 110);
  }, [onAnnee]);

  const viseX = (x: number) => {
    const el = rail.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const t = Math.max(0, Math.min(1, (x - r.left) / (r.width || 1)));
    vise(liste[Math.round(t * (liste.length - 1))]);
  };
  const pc = (a: number) => (liste.length < 2 ? 0 : ((a - liste[0]) / (liste.length - 1)) * 100);
  const jalons = liste.filter((a) => a % 10 === 0 || (a >= 2000 && a % 5 === 0));

  return (
    <div className="cg-frise2">
      <span className="cg-frise2-an">{vue}</span>
      <div className="cg-frise2-piste">
        <div
          ref={rail}
          className="cg-frise2-rail"
          role="slider"
          tabIndex={0}
          aria-label="Année affichée"
          aria-valuemin={liste[0]}
          aria-valuemax={liste[liste.length - 1]}
          aria-valuenow={vue}
          onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); tire.current = true; gelerOdometres(true); viseX(e.clientX); }}
          onPointerMove={(e) => tire.current && viseX(e.clientX)}
          onPointerUp={() => { tire.current = false; gelerOdometres(false); vise(vueRef.current, true); }}
          onPointerCancel={() => { tire.current = false; gelerOdometres(false); }}
          onKeyDown={(e) => {
            const i = vueRef.current - liste[0];
            if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); vise(liste[Math.max(0, i - 1)], true); }
            else if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); vise(liste[Math.min(liste.length - 1, i + 1)], true); }
            else if (e.key === "Home") { e.preventDefault(); vise(liste[0], true); }
            else if (e.key === "End") { e.preventDefault(); vise(liste[liste.length - 1], true); }
          }}
        >
          <span className="cg-frise2-ligne" aria-hidden="true" />
          <span className="cg-frise2-faite" aria-hidden="true" style={{ width: `${pc(vue)}%` }} />
          {jalons.map((a) => <span key={a} className="cg-frise2-jalon" style={{ left: `${pc(a)}%` }} aria-hidden="true" />)}
          <span className="cg-frise2-point" aria-hidden="true" style={{ left: `${pc(vue)}%` }} />
        </div>
        <div className="cg-frise2-bornes">
          {liste.filter((a) => a % 10 === 0 || (a >= 2000 && a % 5 === 0) || a === vue || a === liste[liste.length - 1]).map((a) => (
            <button key={a} type="button" className={`cg-frise2-b${a === vue ? " cg-frise2-b-on" : ""}`} style={{ left: `${pc(a)}%` }} onClick={() => vise(a, true)} tabIndex={-1}>{a}</button>
          ))}
        </div>
      </div>
    </div>
  );
});

/* ── Le tableau : les classes et le comportement du tableau d'Économie ───── */

type Rangee = {
  z: Zone; nom: string; part: number | null;
  production: ReturnType<typeof obs>; surface: ReturnType<typeof obs>; rendement: ReturnType<typeof obs>;
};

const Tableau = memo(function Tableau({
  lignes, col, sens, choisi, onTrier, onChoisi, jeu, recherche,
}: {
  lignes: Rangee[]; col: Col; sens: 1 | -1; choisi: string | null; onTrier: (c: Col) => void; onChoisi: (id: string) => void; jeu: JeuRessource; recherche: string;
}) {
  const cadre = useRef<HTMLDivElement>(null);
  const allumee = useRef<HTMLElement | null>(null);
  useEffect(() => { cadre.current?.scrollTo({ top: 0 }); }, [col, sens, lignes]);

  /* La recherche ne masque rien : le rang reste celui du classement complet, et le tableau
     défile jusqu'à la première ligne trouvée, qui s'allume. */
  const q = recherche.trim().toLowerCase();
  const trouvees = useMemo(() => (q ? new Set(lignes.filter((r) => r.nom.toLowerCase().includes(q)).map((r) => r.z.m49)) : null), [lignes, q]);
  useEffect(() => {
    const el = cadre.current;
    if (!el || !trouvees || !trouvees.size) return;
    const i = lignes.findIndex((r) => trouvees.has(r.z.m49));
    const tr = el.querySelector<HTMLElement>(`tbody tr:nth-child(${i + 1})`);
    if (tr) el.scrollTo({ top: Math.max(0, tr.offsetTop - el.clientHeight / 3), behavior: "smooth" });
  }, [trouvees, lignes, col, sens]);

  /* La lueur suit le pointeur, comme sur Économie. */
  const suit = useCallback((e: React.PointerEvent<HTMLTableSectionElement>) => {
    const tr = (e.target as HTMLElement).closest("tr") as HTMLElement | null;
    if (!tr || !tr.dataset.pays) return;
    const r = tr.getBoundingClientRect();
    if (allumee.current && allumee.current !== tr) allumee.current.classList.remove("cg-tab-suivi");
    tr.classList.add("cg-tab-suivi");
    tr.style.setProperty("--x", `${e.clientX - r.left}px`);
    allumee.current = tr;
  }, []);
  const eteint = useCallback(() => { allumee.current?.classList.remove("cg-tab-suivi"); allumee.current = null; }, []);

  const colonnes: { id: Col; label: string }[] = [
    ...(jeu.indicateurs.production ? [{ id: "production" as Col, label: `Production (${jeu.indicateurs.production.unite})` }] : []),
    ...(jeu.indicateurs.surface ? [{ id: "surface" as Col, label: `Surface (${jeu.indicateurs.surface.unite})` }] : []),
    ...(jeu.indicateurs.rendement ? [{ id: "rendement" as Col, label: `Rendement (${jeu.indicateurs.rendement.unite})` }] : []),
    ...(jeu.indicateurs.production ? [{ id: "part" as Col, label: "Part" }] : []),
  ];
  const cellule = (o: ReturnType<typeof obs>) =>
    o ? (
      <>
        {complet(o.valeur)}
        {(o.flag !== "A" || o.nonOfficielle) && <sup className={`rs-fl rs-fl-${o.flag}`} title={`${FLAGS[o.flag]?.libelle ?? o.flag}${o.nonOfficielle ? " · non officielle" : ""}`}>{o.flag}</sup>}
      </>
    ) : (
      "n.d."
    );

  return (
    <div className="cg-tab-cadre" ref={cadre}>
      <table className="cg-tab">
        <thead>
          <tr>
            <th className="cg-tab-r">#</th>
            <th className="cg-tab-p">Pays</th>
            {colonnes.map((c) => (
              <th key={c.id}>
                <button type="button" className={`cg-tri${col === c.id ? " cg-tri-on" : ""}`} onClick={() => onTrier(c.id)} aria-sort={col === c.id ? (sens === -1 ? "descending" : "ascending") : "none"}>
                  {c.label}
                  <span aria-hidden="true">{col === c.id ? (sens === -1 ? " ↓" : " ↑") : ""}</span>
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody onPointerMove={suit} onPointerLeave={eteint}>
          {lignes.map((r, i) => (
            <tr key={r.z.m49} data-pays={r.z.m49} className={`${choisi === r.z.m49 ? "cg-tab-on" : ""}${trouvees?.has(r.z.m49) ? " cg-tab-trouve" : ""}` || undefined} onClick={() => onChoisi(r.z.m49)}>
              <td className="cg-tab-r">{String(i + 1).padStart(2, "0")}</td>
              <td className="cg-tab-p">{r.nom}{r.z.type === "historique" && <em className="rs-tag">{r.z.debut}–{r.z.fin}</em>}</td>
              {colonnes.map((c) => c.id === "part" ? (
                <td key="part" className={r.part === null ? "cg-tab-vide" : undefined}>{r.part === null ? "n.d." : `${r.part.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %`}</td>
              ) : (
                <td key={c.id} className={r[c.id] ? undefined : "cg-tab-vide"}>{cellule(r[c.id])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

/* ── Le panneau : la synthèse (aucun pays choisi) ────────────────────────── */

function valeurIndicateur(J: JeuRessource, ind: string, an: number): { v: number; unite: string } | null {
  const t = totalMonde(J, ind, an);
  return t ? { v: t.valeur, unite: J.indicateurs[ind]?.unite ?? "" } : null;
}

function Synthese({
  J, nomRes, ind, annee, total, totalAvant, cl, onInd, onPays, nomDe,
}: {
  J: JeuRessource; nomRes: string; ind: string; annee: number; total: { valeur: number; entites: number } | null; totalAvant: { valeur: number } | null;
  cl: ReturnType<typeof classement>; onInd: (i: string) => void; onPays: (id: string) => void; nomDe: (id: string) => string;
}) {
  const top = cl.slice(0, 5);
  const max = Math.max(1, ...top.map((l) => l.valeur));
  const evo = total && totalAvant && totalAvant.valeur > 0 ? ((total.valeur - totalAvant.valeur) / totalAvant.valeur) * 100 : null;
  const qual: Record<string, number> = {};
  for (const l of cl) qual[l.flag] = (qual[l.flag] ?? 0) + 1;
  const autres = INDICATEURS.filter((i) => i !== ind && J.indicateurs[i]);
  const unite = J.indicateurs[ind]?.unite ?? "";
  return (
    <>
      <h3 className="ge-nom">{nomRes} · Monde</h3>
      <div className="ge-vedette rs-vedette">
        <span className="ge-vedette-l">{ind === "rendement" ? "Rendement le plus élevé" : NOMS_INDICATEUR[ind]} · {annee}</span>
        {total || top[0] ? (
          <>
            <Odometre className="ge-vedette-v" valeur={total ? total.valeur : top[0].valeur} dec={0} unite={nbsp(unite)} duree={900} tours={1} couleur={1} />
            <span className="ge-vedette-r">
              Basé sur {nf(cl.length)} sources officielles ou reconstituées
              {total ? ` · somme recalculée, non officielle${evo !== null ? ` · ${pct(evo)} depuis ${annee - COMPARAISON}` : ""}` : ""}
            </span>
          </>
        ) : (
          <span className="ge-vedette-r">Aucune donnée pour {annee}</span>
        )}
      </div>

      <div className="ge-autres">
        {autres.map((i) => {
          const t = valeurIndicateur(J, i, annee);
          const premier = classement(J, i, annee)[0];
          return (
            <button key={i} type="button" className="ge-autre" onClick={() => onInd(i)}>
              <span className="ge-autre-l">{NOMS_INDICATEUR[i]}</span>
              {t ? (
                <Odometre className="ge-autre-v" valeur={t.v} dec={0} unite={nbsp(t.unite)} duree={900} tours={1} couleur={1} />
              ) : premier ? (
                <span className="ge-autre-v rs-autre-t">{complet(premier.valeur)}{nbsp(J.indicateurs[i].unite)}</span>
              ) : (
                <span className="ge-autre-v rs-nd">—</span>
              )}
            </button>
          );
        })}
      </div>

      <h4 className="cf-st">Principaux pays</h4>
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
        <span>{nf(cl.length)} entités avec une valeur</span>
        {Object.entries(qual).map(([k, n]) => <span key={k} className={`rs-flag rs-flag-${k}`} title={FLAGS[k]?.libelle}>{flagLibelle(k)} · {nf(n)}</span>)}
      </div>
    </>
  );
}

/* ── Le panneau : un pays, comme la fiche d'Économie ─────────────────────── */

function FichePays({
  J, z, ind, annee, cl, nom, total, retour, onInd, onComparer,
}: {
  J: JeuRessource; z: Zone; ind: string; annee: number; cl: ReturnType<typeof classement>; nom: string; total: number | null;
  retour: () => void; onInd: (i: string) => void; onComparer: (id: string) => void;
}) {
  const rang = rangDe(cl, z.m49);
  const o = obs(J, z.m49, ind, annee);
  const der = !o ? derniere(J, z.m49, ind, annee) : null;
  const unite = J.indicateurs[ind]?.unite ?? "";
  const sp = points(J, z.m49, ind);
  const autres = INDICATEURS.filter((i) => i !== ind && J.indicateurs[i]);
  const evo = rang?.evolution ?? null;
  return (
    <>
      <button type="button" className="cf-retour" onClick={retour}><ArrowLeft size={14} aria-hidden="true" /> Synthèse mondiale</button>
      <h3 className="ge-nom">{nom}{z.type === "historique" && <em className="rs-tag rs-tag-g">historique {z.debut}–{z.fin}</em>}</h3>
      {z.type === "historique" && z.note && <p className="rs-note">{z.note} Non rattachée à une frontière actuelle.</p>}

      <div className="ge-vedette rs-vedette">
        <span className="ge-vedette-l">{NOMS_INDICATEUR[ind]} · {annee}</span>
        {o ? (
          <>
            <Odometre className="ge-vedette-v" valeur={o.valeur} dec={0} unite={nbsp(unite)} duree={900} tours={1} couleur={1} />
            <span className="ge-vedette-r">
              {rang ? <>{rang.rang}<sup>e</sup> sur {cl.length}</> : "Hors classement"}
              {rang?.part !== null && rang?.part !== undefined && ind !== "rendement" && total ? ` · ${rang.part.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} % du total` : ""}
              {evo !== null ? ` · ${pct(evo)} depuis ${annee - COMPARAISON}` : ""}
            </span>
          </>
        ) : (
          <>
            <b className="rs-vedette-v">—</b>
            <span className="ge-vedette-r">{manquante(J, z.m49, ind, annee) ? `Valeur manquante en ${annee}` : `Indisponible en ${annee}`}</span>
          </>
        )}
      </div>
      {o ? (
        <p className="ge-note rs-statut">
          <span className={`rs-flag rs-flag-${o.flag}`} title={FLAGS[o.flag]?.libelle}>{flagLibelle(o.flag)}{o.nonOfficielle ? " · non officielle" : ""}</span>
          {unite}
        </p>
      ) : (
        <p className="ge-note rs-statut">
          {der ? <>Dernière observation : <b>{complet(der.valeur)} {unite} en {der.annee}</b> ({flagLibelle(der.flag)}).</> : "Aucune observation disponible jusqu’à cette année."}
        </p>
      )}

      <div className="ge-autres">
        {autres.map((i) => {
          const oi = obs(J, z.m49, i, annee);
          const ri = rangDe(classement(J, i, annee), z.m49);
          return (
            <button key={i} type="button" className="ge-autre" onClick={() => onInd(i)}>
              <span className="ge-autre-l">{NOMS_INDICATEUR[i]}</span>
              {oi ? (
                <>
                  <Odometre className="ge-autre-v" valeur={oi.valeur} dec={0} unite={nbsp(J.indicateurs[i].unite)} duree={900} tours={1} couleur={1} />
                  {ri && <small className="rs-autre-r">{ri.rang}<sup>e</sup> sur {classement(J, i, annee).length}</small>}
                </>
              ) : (
                <span className="ge-autre-v rs-nd">—</span>
              )}
            </button>
          );
        })}
      </div>

      <EvolutionCourbe
        titre={`${NOMS_INDICATEUR[ind]} · ${z.debut}–${z.fin}`}
        reinit={`${J.source.fichier}|${z.m49}|${ind}`}
        points={sp.map((q) => ({ annee: q.annee, valeur: q.valeur, note: q.valeur !== null && q.flag && q.flag !== "A" ? `${flagLibelle(q.flag).toLowerCase()}${q.nonOfficielle ? ", non officielle" : ""}` : undefined }))}
        format={(v) => `${complet(v)} ${UNITES_LIBELLE[unite] ?? unite}`}
        ecart={(a, b) => {
          const diff = b.valeur - a.valeur;
          const u = UNITES_LIBELLE[unite] ?? unite;
          return { texte: a.valeur > 0 ? pct(((b.valeur - a.valeur) / a.valeur) * 100) : `${diff >= 0 ? "+" : ""}${complet(diff)} ${u}`, detail: `${a.annee} → ${b.annee} · ${complet(a.valeur)} → ${complet(b.valeur)} ${u}`, sens: diff > 0 ? 1 : diff < 0 ? -1 : 0 };
        }}
      />

      <div className="rs-actions">
        {z.type === "pays" && <button type="button" className="rs-btn" onClick={() => onComparer(z.m49)}><GitCompareArrows size={14} aria-hidden="true" /> Comparer ce pays</button>}
      </div>
    </>
  );
}
