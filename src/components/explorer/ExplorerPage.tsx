"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Minus, Plus, RotateCcw, Search, X } from "lucide-react";
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
   EXPLORER : LE MONDE, PAYS PAR PAYS

   À gauche, le choix du pays et des couches ; au centre, le globe ; sous le choix,
   la liste de ce qu'on a posé sur le pays. Rien n'est écrit en dur : les couches viennent
   de `src/data/explorer/couches.ts` et leurs données de `public/explorer/`.
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
  const globe = useRef<GlobeExplorerHandle>(null);
  const [etroit, setEtroit] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(max-width: 700px)");
    const lire = () => setEtroit(m.matches);
    lire();
    m.addEventListener("change", lire);
    return () => m.removeEventListener("change", lire);
  }, []);

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
  }, []);

  /* Les repères visibles : couches actives, et le pays choisi s'il y en a un. */
  const visibles = useMemo(() => {
    const choisis = reperes.filter((r) => actives.has(r.couche) && (!pays || r.pays === pays));
    if (pays) return choisis;
    /* Sur le monde entier, les plus marquants de chaque couche : sinon le globe n'est qu'un nuage de points. */
    const garde = new Set<string>();
    for (const c of COUCHES) choisis.filter((r) => r.couche === c.id).sort((a, b) => b.poids - a.poids).slice(0, 120).forEach((r) => garde.add(r.id));
    return choisis.filter((r) => garde.has(r.id));
  }, [reperes, actives, pays]);
  const rivieresVisibles = useMemo(() => (actives.has("rivieres") ? rivieres : []), [actives, rivieres]);
  const rivieresVives = useMemo(
    () => new Set(pays ? rivieresVisibles.filter((r) => r.p.includes(pays)) : []),
    [pays, rivieresVisibles],
  );

  /* Combien d'éléments par couche, dans le monde ou dans le pays. */
  const compte = useMemo(() => {
    const c: Record<string, number> = {};
    for (const r of reperes) if (!pays || r.pays === pays) c[r.couche] = (c[r.couche] ?? 0) + 1;
    c.rivieres = pays ? rivieres.filter((r) => r.p.includes(pays)).length : rivieres.length;
    return c;
  }, [reperes, rivieres, pays]);

  /* Les pays qui comptent le plus d'éléments dans les couches actives. */
  const classement = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of reperes) if (r.pays && actives.has(r.couche)) m.set(r.pays, (m.get(r.pays) ?? 0) + 1);
    if (actives.has("rivieres")) for (const r of rivieres) for (const p of r.p) m.set(p, (m.get(p) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [reperes, rivieres, actives]);

  /* Dans un pays : les repères rangés par couche, les plus marquants d'abord. */
  const parCouche = useMemo(() => {
    if (!pays) return [];
    return COUCHES.filter((c) => c.forme === "points" && actives.has(c.id)).map((c) => ({
      couche: c,
      items: visibles.filter((r) => r.couche === c.id).sort((a, b) => b.poids - a.poids),
    }));
  }, [pays, actives, visibles]);
  const fleuves = useMemo(
    () => (pays && actives.has("rivieres") ? [...new Set(rivieres.filter((r) => r.p.includes(pays) && r.n).map((r) => r.n))].sort((a, b) => a.localeCompare(b, "fr")) : []),
    [pays, actives, rivieres],
  );

  /* Les cartes toujours visibles : le repère choisi, le survolé et, dans un pays, les plus marquants de chaque couche. */
  const cartes = useMemo(() => {
    const ids = new Set<string>();
    if (pays) for (const g of parCouche) for (const r of g.items.slice(0, etroit ? 1 : 2)) ids.add(r.id);
    if (survol) ids.add(survol);
    if (choisi) ids.add(choisi);
    return [...ids];
  }, [pays, parCouche, survol, choisi, etroit]);

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
  const choisiRepere = reperes.find((r) => r.id === choisi) ?? null;

  return (
    <section className="xp" aria-labelledby="xp-h1">
      <aside className="xp-panneau">
        <header className="xp-tete">
          <p className="xp-sur">Explorer</p>
          <h1 id="xp-h1" className="xp-h1">Le monde, pays par pays</h1>
          <p className="xp-chapo">Choisissez un pays, cochez ce que vous voulez voir : le globe vient se placer dessus.</p>
        </header>

        <div className="xp-choix">
          {pays ? (
            <div className="xp-pays-on">
              <span>{countryFr(pays)}</span>
              <a href={`/pays/${slugDe(countryFr(pays))}`} className="xp-fiche">
                Fiche pays <ArrowUpRight size={13} aria-hidden="true" />
              </a>
              <button type="button" onClick={() => choisirPays(null)} aria-label="Revenir au monde entier">
                <X size={15} aria-hidden="true" />
              </button>
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
                <li key={x.n}>
                  <button type="button" onClick={() => choisirPays(x.n)}>{x.fr}</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <fieldset className="xp-couches">
          <legend>Couches</legend>
          {COUCHES.map((c) => {
            const Icone = c.icone;
            const on = actives.has(c.id);
            return (
              <label key={c.id} className={`xp-couche${on ? " xp-couche-on" : ""}`} style={{ "--c": c.couleur } as React.CSSProperties} title={c.source}>
                <input type="checkbox" checked={on} onChange={() => basculer(c.id)} />
                <span className="xp-couche-i"><Icone size={15} aria-hidden="true" /></span>
                <span className="xp-couche-n">
                  {c.nom}
                  {c.exemple && <em>exemple</em>}
                </span>
                <span className="xp-couche-v">{nf(compte[c.id] ?? 0)}</span>
              </label>
            );
          })}
        </fieldset>

        {choisiRepere && (
          <div className="xp-detail" style={{ "--c": COUCHE[choisiRepere.couche].couleur } as React.CSSProperties}>
            <p className="xp-detail-c">{COUCHE[choisiRepere.couche].nomUn}</p>
            <h2>{choisiRepere.nom}</h2>
            <p>{choisiRepere.detail}</p>
            {choisiRepere.pays && <p className="xp-detail-p">{countryFr(choisiRepere.pays)}</p>}
            {COUCHE[choisiRepere.couche].exemple && <p className="xp-exemple">Donnée d’exemple, non vérifiée.</p>}
            <button type="button" onClick={() => setChoisi(null)}>Fermer</button>
          </div>
        )}

        {!pays && (
          <div className="xp-classement">
            <h2>Où il y a le plus à voir</h2>
            <ol>
              {classement.map(([n, v]) => (
                <li key={n}>
                  <button type="button" onClick={() => choisirPays(n)}>
                    <span>{countryFr(n)}</span>
                    <b>{nf(v)}</b>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        )}

        {pays && (
          <div className="xp-resultats">
            {parCouche.map(({ couche, items }) => (
              <section key={couche.id} style={{ "--c": couche.couleur } as React.CSSProperties}>
                <h2>
                  {couche.nom} <span>{nf(items.length)}</span>
                  {couche.exemple && <em>exemple</em>}
                </h2>
                {items.length === 0 ? (
                  <p className="xp-vide">Rien dans cette couche pour ce pays.</p>
                ) : (
                  <ul>
                    {items.slice(0, 12).map((r) => (
                      <li key={r.id}>
                        <button
                          type="button"
                          className={r.id === choisi ? "on" : ""}
                          onMouseEnter={() => setSurvol(r.id)}
                          onMouseLeave={() => setSurvol(null)}
                          onClick={() => setChoisi(r.id)}
                        >
                          <span>{r.nom}</span>
                          <small>{r.detail}</small>
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
                {fleuves.length === 0 ? (
                  <p className="xp-vide">Aucun cours d’eau majeur tracé pour ce pays.</p>
                ) : (
                  <p className="xp-fleuves">{fleuves.join(" · ")}</p>
                )}
              </section>
            )}
          </div>
        )}
      </aside>

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
            onSurvol={setSurvol}
            onChoix={surChoix}
            onPays={(n) => (n ? choisirPays(n) : choisirPays(null))}
          />
        ) : (
          <div className="xp-attente" aria-hidden="true"><span /></div>
        )}
        {erreur && <p className="xp-erreur">Les données n’ont pas pu être chargées. Rechargez la page.</p>}
        <div className="xp-commandes">
          <button type="button" onClick={() => globe.current?.zoomer(0.8)} aria-label="Zoomer"><Plus size={16} /></button>
          <button type="button" onClick={() => globe.current?.zoomer(1.25)} aria-label="Dézoomer"><Minus size={16} /></button>
          <button type="button" onClick={() => { choisirPays(null); globe.current?.recentrer(); }} aria-label="Revenir au monde entier"><RotateCcw size={15} /></button>
        </div>
        <p className="xp-note">Les couches « exemple » contiennent des données fictives, en attendant des sources vérifiées.</p>
      </div>
    </section>
  );
}
