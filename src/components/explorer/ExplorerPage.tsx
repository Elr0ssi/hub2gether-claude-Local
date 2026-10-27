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

/** Un nombre qui roule jusqu'à sa valeur quand elle change. */
function useCompteur(cible: number) {
  const [v, setV] = useState(cible);
  const de = useRef(cible);
  useEffect(() => {
    const debut = de.current;
    if (debut === cible) return;
    const t0 = performance.now();
    let id = 0;
    const pas = (t: number) => {
      const k = Math.min(1, (t - t0) / 800);
      const e = 1 - Math.pow(1 - k, 3);
      const x = Math.round(debut + (cible - debut) * e);
      setV(x);
      de.current = x;
      if (k < 1) id = requestAnimationFrame(pas);
    };
    id = requestAnimationFrame(pas);
    return () => cancelAnimationFrame(id);
  }, [cible]);
  return v;
}

/* ═══════════════════════════════════════════════════════════════════════════
   EXPLORER : UNE SCÈNE PLEIN ÉCRAN

   Le globe occupe toute la page ; tout le reste flotte dessus, en verre : un rail
   de couches à gauche, un grand chiffre et un tableau en haut à gauche, le choix
   du pays en haut à droite, des repères chiffrés sur la droite, et une carte en bas.
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
  const [etroit, setEtroit] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(max-width: 1000px)");
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
    setTiroir(false);
  }, []);

  const monde = !pays;
  const visibles = useMemo(
    () => reperes.filter((r) => actives.has(r.couche) && (!pays || r.pays === pays)),
    [reperes, actives, pays],
  );
  const rivieresVisibles = useMemo(() => (actives.has("rivieres") ? rivieres : []), [actives, rivieres]);
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
  const total = COUCHES.filter((c) => actives.has(c.id)).reduce((s, c) => s + (compte[c.id] ?? 0), 0);
  const totalAffiche = useCompteur(total);
  const maxCompte = Math.max(1, ...COUCHES.map((c) => compte[c.id] ?? 0));

  const classement = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of reperes) if (r.pays && actives.has(r.couche)) m.set(r.pays, (m.get(r.pays) ?? 0) + 1);
    if (actives.has("rivieres")) for (const r of rivieres) for (const p of r.p) m.set(p, (m.get(p) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
  }, [reperes, rivieres, actives]);

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

  /* Les cartes : dans le monde, le plus marquant de chaque couche ; dans un pays, les deux premiers (un seul sur mobile). */
  const cartes = useMemo(() => {
    const ids = new Set<string>();
    for (const g of parCouche) for (const r of g.items.slice(0, monde ? 1 : etroit ? 1 : 2)) ids.add(r.id);
    if (survol) ids.add(survol);
    if (choisi) ids.add(choisi);
    return [...ids];
  }, [parCouche, monde, etroit, survol, choisi]);

  const choisiRepere = reperes.find((r) => r.id === choisi) ?? null;

  /* Les liens : depuis le repère choisi vers ses voisins, sinon depuis la capitale du pays vers ses repères phares. */
  const arcs = useMemo<[string, string][]>(() => {
    if (monde && !choisiRepere) return [];
    const base = choisiRepere ?? visibles.find((r) => r.couche === "villes" && r.detail.startsWith("Capitale")) ?? [...visibles].sort((a, b) => b.poids - a.poids)[0];
    if (!base) return [];
    const autres = visibles.filter((r) => r.id !== base.id && (!choisiRepere || !choisiRepere.pays || r.pays === choisiRepere.pays));
    /* Les repères les plus marquants de chaque couche : des liens longs, qui parcourent le pays. */
    const choisis = parCouche
      .flatMap((g) => autres.filter((r) => r.couche === g.couche.id).sort((a, b) => b.poids - a.poids).slice(0, 2))
      .slice(0, 6);
    return choisis.map((r) => [base.id, r.id] as [string, string]);
  }, [monde, choisiRepere, visibles, parCouche]);

  /* Les repères chiffrés de droite. */
  const stats = useMemo(() => {
    if (monde) return classement.map(([n, v]) => ({ cle: n, label: "Pays", valeur: nf(v), sous: countryFr(n), action: () => choisirPays(n) }));
    const meilleur = (id: CoucheId) => reperes.filter((r) => r.couche === id && r.pays === pays).sort((a, b) => b.poids - a.poids)[0];
    const pic = meilleur("montagnes");
    const ville = meilleur("villes");
    const siege = meilleur("sieges");
    const centrales = compte.nucleaire ?? 0;
    return [
      pic && { cle: "pic", label: "Plus haut sommet", valeur: pic.detail, sous: pic.nom, action: () => setChoisi(pic.id) },
      ville && { cle: "ville", label: "Plus grande ville", valeur: ville.detail.replace("Capitale · ", ""), sous: ville.nom, action: () => setChoisi(ville.id) },
      { cle: "riv", label: "Cours d’eau tracés", valeur: nf(compte.rivieres ?? 0), sous: fleuves.slice(0, 2).join(", ") || "—", action: undefined },
      siege ? { cle: "sieges", label: "Sièges sociaux (exemple)", valeur: nf(compte.sieges ?? 0), sous: siege.nom, action: () => setChoisi(siege.id) } : { cle: "nuc", label: "Centrales (exemple)", valeur: nf(centrales), sous: "", action: undefined },
    ].filter(Boolean) as { cle: string; label: string; valeur: string; sous: string; action?: () => void }[];
  }, [monde, classement, reperes, pays, compte, fleuves, choisirPays]);

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
      <div className="xp-anneaux" aria-hidden="true"><i /><i /><i /></div>

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
              <span className="xp-bulle">{c.nom}{c.exemple ? " · exemple" : ""}</span>
            </button>
          );
        })}
      </nav>

      {/* Le grand chiffre */}
      <header className="xp-tete">
        <p className="xp-sur">Explorer</p>
        <h1 id="xp-h1" className="xp-h1">{pays ? countryFr(pays) : "Le monde, pays par pays"}</h1>
        <p className="xp-chiffre" aria-live="polite">{nf(totalAffiche)}</p>
        <p className="xp-chiffre-l">éléments sur le globe{pays ? "" : " · toutes couches cochées"}</p>
        <ul className="xp-table">
          {COUCHES.map((c) => {
            const Icone = c.icone;
            const on = actives.has(c.id);
            return (
              <li key={c.id}>
                <button type="button" className={on ? "on" : ""} style={{ "--c": c.couleur } as React.CSSProperties} onClick={() => basculer(c.id)} aria-pressed={on}>
                  <Icone size={13} aria-hidden="true" />
                  <span>{c.nom}{c.exemple && <em>exemple</em>}</span>
                  <i><b style={{ width: `${((compte[c.id] ?? 0) / maxCompte) * 100}%` }} /></i>
                  <strong>{nf(compte[c.id] ?? 0)}</strong>
                </button>
              </li>
            );
          })}
        </ul>
      </header>

      <div className="xp-colonne">
      {/* Le choix du pays */}
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

      {/* Les repères chiffrés */}
      <aside className="xp-droite" aria-label={monde ? "Pays les plus riches en éléments" : "Repères du pays"}>
        {stats.map((s) => (
          <button key={s.cle} type="button" className="xp-stat" onClick={s.action} disabled={!s.action}>
            <span className="xp-stat-g"><small>{s.label}</small>{s.sous && <span>{s.sous}</span>}</span>
            <b>{s.valeur}</b>
          </button>
        ))}
      </aside>


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

      {/* La carte du bas : le repère choisi, ou une invitation */}
      <div className="xp-bas">
        {choisiRepere ? (
          <div className="xp-detail" style={{ "--c": COUCHE[choisiRepere.couche].couleur } as React.CSSProperties}>
            <button type="button" className="xp-fermer" onClick={() => setChoisi(null)} aria-label="Fermer"><X size={14} /></button>
            <p className="xp-detail-c">{COUCHE[choisiRepere.couche].nomUn}{choisiRepere.pays ? ` · ${countryFr(choisiRepere.pays)}` : ""}</p>
            <h2>{choisiRepere.nom}</h2>
            <p className="xp-detail-v">{choisiRepere.detail}</p>
            {COUCHE[choisiRepere.couche].exemple && <p className="xp-exemple">Donnée d’exemple, non vérifiée.</p>}
          </div>
        ) : (
          <p className="xp-invite">{pays ? "Cliquez un repère pour le détailler." : "Cliquez un pays sur le globe, ou cherchez-le."}</p>
        )}
        {pays && (
          <button type="button" className="xp-liste-bouton" onClick={() => setTiroir((t) => !t)} aria-expanded={tiroir}>
            <List size={14} aria-hidden="true" /> {tiroir ? "Masquer la liste" : "Voir la liste"}
          </button>
        )}
      </div>

      <p className="xp-note">Les couches « exemple » contiennent des données fictives, en attendant des sources vérifiées.</p>
    </section>
  );
}
