"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, List, Minus, Plus, RotateCcw, Search, X } from "lucide-react";
import { COUCHE, COUCHES, lireRepères, type CoucheId, type Repere, type Riviere } from "@/data/explorer/couches";
import { countryFr } from "@/data/countryNamesFr";
import { slugDe } from "@/data/seo/francais";
import { useTheme } from "@/components/concept/Theme";
import type { GlobeExplorerHandle } from "./GlobeExplorer";
import "./explorer.css";

const GlobeExplorer = dynamic(() => import("./GlobeExplorer").then((m) => m.GlobeExplorer), {
  ssr: false,
  loading: () => <div className="xp-attente" aria-hidden="true"><span /></div>,
});

const nf = (v: number) => v.toLocaleString("fr-FR");
const sans = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/* ═══════════════════════════════════════════════════════════════════════════
   EXPLORER : UNE SCÈNE PLEIN ÉCRAN, ET PEU DE CHOSES DESSUS

   Vue du monde : le globe net, de tout petits points rouges pour les villes, un titre,
   la recherche d'un pays, le rail des couches. Rien d'autre.
   Dans un pays : le globe vient s'y placer et affiche les couches cochées, avec la liste.
   Les couches viennent de `src/data/explorer/couches.ts`, les données de `public/explorer/`.
   ═══════════════════════════════════════════════════════════════════════════ */

export function ExplorerPage() {
  const [theme] = useTheme();
  const [geo, setGeo] = useState<GeoJSON.FeatureCollection | null>(null);
  const [reperes, setReperes] = useState<Repere[]>([]);
  const [rivieres, setRivieres] = useState<Riviere[]>([]);
  const [erreur, setErreur] = useState(false);
  const [actives, setActives] = useState<Set<CoucheId>>(new Set(["nucleaire", "sieges", "montagnes", "rivieres"]));
  const [pays, setPays] = useState<string | null>(null);
  const [requete, setRequete] = useState("");
  const [liste, setListe] = useState(false);
  const [survol, setSurvol] = useState<string | null>(null);
  const [choisi, setChoisi] = useState<string | null>(null);
  const [tiroir, setTiroir] = useState(false);
  const globe = useRef<GlobeExplorerHandle>(null);

  useEffect(() => {
    let vivant = true;
    Promise.all([
      fetch("/geo/ne_50m_countries.simplified.geojson").then((r) => r.json()),
      fetch("/explorer/points.json").then((r) => r.json()),
      fetch("/explorer/rivieres.json").then((r) => r.json()),
    ])
      .then(([g, p, r]) => {
        if (!vivant) return;
        setGeo(g);
        setReperes(lireRepères(p));
        setRivieres(r);
      })
      .catch(() => vivant && setErreur(true));
    return () => {
      vivant = false;
    };
  }, []);

  const nomsPays = useMemo(
    () => (geo ? geo.features.map((f) => (f.properties as { name: string }).name).filter((n) => n !== "Antarctica") : []),
    [geo],
  );

  const basculer = (id: CoucheId) =>
    setActives((a) => {
      const n = new Set(a);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const choisirPays = useCallback((nom: string | null) => {
    setPays(nom);
    setChoisi(null);
    setRequete("");
    setListe(false);
    setTiroir(false);
  }, []);

  const monde = !pays;

  /* Le monde : les villes seules, en petits points. Un pays : les couches cochées. */
  const visibles = useMemo(
    () => (monde ? reperes.filter((r) => r.couche === "villes") : reperes.filter((r) => actives.has(r.couche) && r.pays === pays)),
    [reperes, actives, pays, monde],
  );
  const rivieresVisibles = useMemo(() => (!monde && actives.has("rivieres") ? rivieres : []), [monde, actives, rivieres]);
  const rivieresVives = useMemo(
    () => new Set(pays ? rivieresVisibles.filter((r) => r.p.includes(pays)) : []),
    [pays, rivieresVisibles],
  );

  const compte = useMemo(() => {
    const c: Record<string, number> = {};
    for (const r of reperes) if (!pays || r.pays === pays) c[r.couche] = (c[r.couche] ?? 0) + 1;
    c.rivieres = pays ? rivieres.filter((r) => r.p.includes(pays)).length : rivieres.length;
    return c;
  }, [reperes, rivieres, pays]);

  const parCouche = useMemo(
    () =>
      COUCHES.filter((c) => c.forme === "points" && actives.has(c.id)).map((c) => ({
        couche: c,
        items: visibles.filter((r) => r.couche === c.id).sort((a, b) => b.poids - a.poids),
      })),
    [actives, visibles],
  );
  const fleuves = useMemo(
    () => (pays && actives.has("rivieres") ? [...new Set(rivieres.filter((r) => r.p.includes(pays) && r.n).map((r) => r.n))].sort((a, b) => a.localeCompare(b, "fr")) : []),
    [pays, actives, rivieres],
  );
  const total = pays ? parCouche.reduce((s, g) => s + g.items.length, 0) + (actives.has("rivieres") ? fleuves.length : 0) : 0;

  /* Les cartes : seulement dans un pays, le plus marquant de chaque couche, le survolé et le choisi. */
  const cartes = useMemo(() => {
    if (monde) return [];
    const ids = new Set<string>();
    for (const g of parCouche) for (const r of g.items.slice(0, 1)) ids.add(r.id);
    if (survol) ids.add(survol);
    if (choisi) ids.add(choisi);
    return [...ids];
  }, [monde, parCouche, survol, choisi]);

  const choisiRepere = reperes.find((r) => r.id === choisi) ?? null;

  /* Un lien depuis le repère choisi vers les plus marquants de chaque couche. */
  const arcs = useMemo<[string, string][]>(() => {
    if (monde || !choisiRepere) return [];
    return parCouche
      .flatMap((g) => g.items.filter((r) => r.id !== choisiRepere.id).slice(0, 2))
      .slice(0, 5)
      .map((r) => [choisiRepere.id, r.id] as [string, string]);
  }, [monde, choisiRepere, parCouche]);

  const trouves = useMemo(() => {
    const q = sans(requete.trim());
    return nomsPays
      .map((n) => ({ n, fr: countryFr(n) }))
      .filter((x) => !q || sans(x.fr).includes(q))
      .sort((a, b) => a.fr.localeCompare(b.fr, "fr"))
      .slice(0, 40);
  }, [nomsPays, requete]);

  const surChoix = useCallback(
    (id: string) => {
      const r = reperes.find((x) => x.id === id);
      setChoisi(id);
      if (r?.pays) setPays((p) => p ?? r.pays);
    },
    [reperes],
  );

  return (
    <section className={`xp${monde ? "" : " xp-pays"}`} aria-labelledby="xp-h1">
      <div className="xp-scene">
        {geo ? (
          <GlobeExplorer
            ref={globe}
            geo={geo}
            nuit={theme === "nuit"}
            reperes={visibles}
            rivieres={rivieresVisibles}
            rivieresVives={rivieresVives}
            pays={pays}
            survol={survol}
            choisi={choisi}
            cartes={cartes}
            monde={monde}
            arcs={arcs}
            onSurvol={setSurvol}
            onChoix={surChoix}
            onPays={(n) => choisirPays(n)}
          />
        ) : (
          <div className="xp-attente" aria-hidden="true"><span /></div>
        )}
        {erreur && <p className="xp-erreur">Les données n’ont pas pu être chargées. Rechargez la page.</p>}
      </div>

      {/* Le rail des couches */}
      <nav className="xp-rail" aria-label="Couches">
        {COUCHES.map((c) => {
          const Icone = c.icone;
          const on = actives.has(c.id);
          return (
            <button key={c.id} type="button" className={on ? "on" : ""} style={{ "--c": c.couleur } as React.CSSProperties} onClick={() => basculer(c.id)} aria-pressed={on} aria-label={c.nom}>
              <Icone size={18} aria-hidden="true" />
              <span className="xp-bulle">{c.nom} · {nf(compte[c.id] ?? 0)}{c.exemple ? " · exemple" : ""}</span>
            </button>
          );
        })}
      </nav>

      <header className="xp-tete">
        <p className="xp-sur">Explorer</p>
        <h1 id="xp-h1" className="xp-h1">{pays ? countryFr(pays) : "Le monde, pays par pays"}</h1>
        {pays && <p className="xp-chiffre" aria-live="polite">{nf(total)}<small> éléments</small></p>}
        {monde && <p className="xp-chapo">Choisissez un pays, ou cliquez-le sur le globe.</p>}
      </header>

      <div className="xp-colonne">
        <div className="xp-choix">
          {pays ? (
            <div className="xp-pays-on">
              <span>{countryFr(pays)}</span>
              <a href={`/pays/${slugDe(countryFr(pays))}`} className="xp-fiche">Fiche pays <ArrowUpRight size={13} aria-hidden="true" /></a>
              <button type="button" onClick={() => { choisirPays(null); globe.current?.recentrer(); }} aria-label="Revenir au monde entier"><X size={15} aria-hidden="true" /></button>
            </div>
          ) : (
            <div className="xp-recherche">
              <Search size={15} aria-hidden="true" />
              <input
                type="search"
                value={requete}
                placeholder="Rechercher un pays"
                aria-label="Rechercher un pays"
                onFocus={() => setListe(true)}
                onChange={(e) => {
                  setRequete(e.target.value);
                  setListe(true);
                }}
              />
            </div>
          )}
          {!pays && liste && (
            <ul className="xp-liste-pays" role="listbox">
              {trouves.length === 0 && <li className="xp-vide">Aucun pays ne correspond.</li>}
              {trouves.map((x) => (
                <li key={x.n}><button type="button" onClick={() => choisirPays(x.n)}>{x.fr}</button></li>
              ))}
            </ul>
          )}
        </div>

        {pays && (
          <div className={`xp-tiroir${tiroir ? " xp-tiroir-on" : ""}`}>
            {parCouche.map(({ couche, items }) => (
              <section key={couche.id} style={{ "--c": couche.couleur } as React.CSSProperties}>
                <h2>{couche.nom} <span>{nf(items.length)}</span>{couche.exemple && <em>exemple</em>}</h2>
                {items.length === 0 ? (
                  <p className="xp-vide">Rien dans cette couche pour ce pays.</p>
                ) : (
                  <ul>
                    {items.slice(0, 10).map((r) => (
                      <li key={r.id}>
                        <button type="button" className={r.id === choisi ? "on" : ""} onMouseEnter={() => setSurvol(r.id)} onMouseLeave={() => setSurvol(null)} onClick={() => setChoisi(r.id)}>
                          <span>{r.nom}</span><small>{r.detail}</small>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
            {actives.has("rivieres") && (
              <section style={{ "--c": COUCHE.rivieres.couleur } as React.CSSProperties}>
                <h2>Rivières et fleuves <span>{nf(fleuves.length)}</span></h2>
                {fleuves.length === 0 ? <p className="xp-vide">Aucun cours d’eau majeur tracé pour ce pays.</p> : <p className="xp-fleuves">{fleuves.join(" · ")}</p>}
              </section>
            )}
          </div>
        )}
      </div>

      <div className="xp-zoom">
        <button type="button" onClick={() => globe.current?.zoomer(0.8)} aria-label="Zoomer"><Plus size={16} /></button>
        <button type="button" onClick={() => globe.current?.zoomer(1.25)} aria-label="Dézoomer"><Minus size={16} /></button>
        <button type="button" onClick={() => { choisirPays(null); globe.current?.recentrer(); }} aria-label="Revenir au monde entier"><RotateCcw size={15} /></button>
      </div>

      {pays && (
        <div className="xp-bas">
          {choisiRepere && (
            <div className="xp-detail" style={{ "--c": COUCHE[choisiRepere.couche].couleur } as React.CSSProperties}>
              <button type="button" className="xp-fermer" onClick={() => setChoisi(null)} aria-label="Fermer"><X size={14} /></button>
              <p className="xp-detail-c">{COUCHE[choisiRepere.couche].nomUn}</p>
              <h2>{choisiRepere.nom}</h2>
              <p className="xp-detail-v">{choisiRepere.detail}</p>
              {COUCHE[choisiRepere.couche].exemple && <p className="xp-exemple">Donnée d’exemple, non vérifiée.</p>}
            </div>
          )}
          <button type="button" className="xp-liste-bouton" onClick={() => setTiroir((t) => !t)} aria-expanded={tiroir}>
            <List size={14} aria-hidden="true" /> {tiroir ? "Masquer la liste" : "Voir la liste"}
          </button>
        </div>
      )}

      {!monde && <p className="xp-note">Les couches « exemple » contiennent des données fictives, en attendant des sources vérifiées. Relief : SRTM, GMTED et autres, via AWS Terrain Tiles.</p>}
    </section>
  );
}
