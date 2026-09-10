"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CHAMP_META,
  COULEURS,
  WBarres,
  WChiffres,
  WCourbes,
  WEcarts,
  WNuage,
  WRangs,
  WTableau,
  type Champ,
  type Jeu,
} from "./widgets";

/* ═══════════════════════════════════════════════════════════════════════════
   LE TABLEAU DE BORD

   Sept vues sur les mêmes pays, disposées librement : on montre, on cache,
   on redimensionne, on réordonne par glisser-déposer. La disposition reste
   dans le navigateur — au retour, le tableau de bord est comme on l'a laissé.

   Un seul curseur d'année pilote toutes les vues à la fois.
   ═══════════════════════════════════════════════════════════════════════════ */

const CLE_DISPO = "ted-dashboard-v1";

type TailleId = "s" | "m" | "l";
type WidgetId = "chiffres" | "courbes" | "barres" | "rangs" | "nuage" | "ecarts" | "tableau";

interface Case_ {
  id: WidgetId;
  taille: TailleId;
  visible: boolean;
}

/* Les tailles par défaut s'assemblent en rangées pleines : 3, 3, 1+2, 2+1.
   Deux vues de taille M se suivraient sur des lignes séparées et laisseraient
   une colonne vide à chaque fois. */
const DEFAUT: Case_[] = [
  { id: "chiffres", taille: "l", visible: true },
  { id: "courbes", taille: "l", visible: true },
  { id: "barres", taille: "s", visible: true },
  { id: "rangs", taille: "m", visible: true },
  { id: "nuage", taille: "m", visible: true },
  { id: "ecarts", taille: "s", visible: true },
  { id: "tableau", taille: "l", visible: false },
];

const TITRES: Record<WidgetId, string> = {
  chiffres: "Chiffres clés",
  courbes: "Séries longues",
  barres: "Au coude à coude",
  rangs: "Qui double qui",
  nuage: "Deux indicateurs croisés",
  ecarts: "L'écart au premier",
  tableau: "Toutes les valeurs",
};

const SPAN: Record<TailleId, number> = { s: 1, m: 2, l: 3 };

interface Pays {
  cle: string;
  label: string;
}

export function ComparerDashboard({ catalogue, defaut }: { catalogue: Pays[]; defaut: string[] }) {
  const [choisis, setChoisis] = useState<string[]>(defaut);
  const [champ, setChamp] = useState<Champ>("gdp");
  const [champY, setChampY] = useState<Champ>("inflation");
  const [base100, setBase100] = useState(false);
  const [annees, setAnnees] = useState<number[]>([]);
  const [series, setSeries] = useState<Jeu["series"]>({});
  const [i, setI] = useState(0);
  const [q, setQ] = useState("");
  const [charge, setCharge] = useState(true);
  const [cases, setCases] = useState<Case_[]>(DEFAUT);
  const [reglages, setReglages] = useState(false);
  const [glisse, setGlisse] = useState<WidgetId | null>(null);

  /* ── La disposition, telle qu'on l'a laissée ───────────────────────────── */
  useEffect(() => {
    try {
      const brut = window.localStorage.getItem(CLE_DISPO);
      if (!brut) return;
      const lu = JSON.parse(brut) as Case_[];
      /* On repart du défaut et on applique ce qui est reconnu : un widget
         ajouté depuis la dernière visite apparaît, un widget supprimé du
         code ne fait pas planter la page. */
      const connus = new Set(DEFAUT.map((c) => c.id));
      const propres = lu.filter((c) => connus.has(c.id));
      const manquants = DEFAUT.filter((d) => !propres.some((c) => c.id === d.id));
      setCases([...propres, ...manquants]);
    } catch {
      /* Disposition illisible : on garde celle par défaut. */
    }
  }, []);

  const majCases = useCallback((f: (c: Case_[]) => Case_[]) => {
    setCases((c) => {
      const suivant = f(c);
      try {
        window.localStorage.setItem(CLE_DISPO, JSON.stringify(suivant));
      } catch {
        /* Stockage indisponible : la disposition tient pour la session. */
      }
      return suivant;
    });
  }, []);

  /* ── Les données ───────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!choisis.length) {
      setSeries({});
      setCharge(false);
      return;
    }
    let vivant = true;
    setCharge(true);
    fetch(`/api/series?pays=${encodeURIComponent(choisis.join("|"))}`)
      .then((r) => r.json())
      .then((d) => {
        if (!vivant) return;
        setAnnees(d.annees);
        setSeries(d.series);
        setI((k) => (k === 0 || k >= d.annees.length ? d.annees.length - 1 : k));
        setCharge(false);
      })
      .catch(() => vivant && setCharge(false));
    return () => {
      vivant = false;
    };
  }, [choisis]);

  const pays = useMemo(
    () =>
      choisis
        .map((c, k) => {
          const p = catalogue.find((x) => x.cle === c);
          return p ? { ...p, couleur: COULEURS[k % COULEURS.length] } : null;
        })
        .filter(Boolean) as Jeu["pays"],
    [choisis, catalogue]
  );

  const jeu: Jeu = useMemo(() => ({ annees, series, pays, i }), [annees, series, pays, i]);

  const basculer = useCallback((cle: string) => {
    setChoisis((l) => (l.includes(cle) ? l.filter((c) => c !== cle) : l.length >= 6 ? l : [...l, cle]));
  }, []);

  const resultats = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    return catalogue.filter((p) => p.label.toLowerCase().includes(t)).slice(0, 8);
  }, [q, catalogue]);

  const annee = annees[i];
  const visibles = cases.filter((c) => c.visible);

  /* ── Le glisser-déposer ────────────────────────────────────────────────── */
  const deposer = useCallback(
    (cible: WidgetId) => {
      if (!glisse || glisse === cible) return;
      majCases((c) => {
        const l = [...c];
        const de = l.findIndex((x) => x.id === glisse);
        const vers = l.findIndex((x) => x.id === cible);
        if (de < 0 || vers < 0) return c;
        const [pris] = l.splice(de, 1);
        l.splice(vers, 0, pris);
        return l;
      });
      setGlisse(null);
    },
    [glisse, majCases]
  );

  const contenu = (id: WidgetId) => {
    switch (id) {
      case "chiffres":
        return <WChiffres j={jeu} />;
      case "courbes":
        return <WCourbes j={jeu} champ={champ} base100={base100} onPick={setI} />;
      case "barres":
        return <WBarres j={jeu} champ={champ} />;
      case "rangs":
        return <WRangs j={jeu} champ={champ} />;
      case "nuage":
        return <WNuage j={jeu} x={champ} y={champY} />;
      case "ecarts":
        return <WEcarts j={jeu} champ={champ} />;
      case "tableau":
        return <WTableau j={jeu} />;
    }
  };

  const legende = (id: WidgetId) => {
    if (id === "courbes") return `${CHAMP_META[champ].label}${base100 ? " · base 100" : ` · ${CHAMP_META[champ].court}`}`;
    if (id === "nuage") return `${CHAMP_META[champ].label} × ${CHAMP_META[champY].label}`;
    if (id === "chiffres" || id === "tableau") return String(annee ?? "—");
    return `${CHAMP_META[champ].label} · ${annee ?? "—"}`;
  };

  return (
    <div className="db">
      <div className="nc-scan" aria-hidden="true" />

      {/* ── La tête ──────────────────────────────────────────────────────── */}
      <header className="db-tete">
        <div className="db-tete-g">
          <h1 className="nc-titre">
            Comparer, <span>en tableau de bord</span>
          </h1>
          <span className="nc-sous">
            {catalogue.length} pays · 1960–2025 · Banque mondiale (WDI)
          </span>
        </div>

        <div className="cp-champs" role="group" aria-label="Indicateur principal">
          {(Object.keys(CHAMP_META) as Champ[]).map((c) => (
            <button key={c} type="button" onClick={() => setChamp(c)} className={`cp-champ${champ === c ? " cp-champ-actif" : ""}`}>
              {CHAMP_META[c].label}
            </button>
          ))}
        </div>

        <div className="db-tete-d">
          <button type="button" className="nc-btn" onClick={() => setReglages((r) => !r)} aria-expanded={reglages}>
            Personnaliser
          </button>
          <Link href="/neo" className="nc-btn">
            Live
          </Link>
        </div>
      </header>

      {/* ── Le panneau de réglages ───────────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {reglages && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="db-reglages-boite"
          >
            <div className="db-reglages">
              <p className="nc-label">Vues affichées · glissez une carte pour la déplacer</p>
              <div className="db-reglages-l">
                {cases.map((c) => (
                  <div key={c.id} className="db-reglage">
                    <label>
                      <input
                        type="checkbox"
                        checked={c.visible}
                        onChange={() => majCases((l) => l.map((x) => (x.id === c.id ? { ...x, visible: !x.visible } : x)))}
                      />
                      {TITRES[c.id]}
                    </label>
                    <div className="db-tailles">
                      {(["s", "m", "l"] as TailleId[]).map((t) => (
                        <button
                          key={t}
                          type="button"
                          className={c.taille === t ? "on" : ""}
                          onClick={() => majCases((l) => l.map((x) => (x.id === c.id ? { ...x, taille: t } : x)))}
                          aria-label={`Taille ${t}`}
                        >
                          {t.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="db-reglages-pied">
                <label className="cp-bascule">
                  <input type="checkbox" checked={base100} onChange={(e) => setBase100(e.target.checked)} />
                  <span>Séries en base 100</span>
                </label>
                <label className="db-croise">
                  <span>Axe vertical du nuage</span>
                  <select value={champY} onChange={(e) => setChampY(e.target.value as Champ)}>
                    {(Object.keys(CHAMP_META) as Champ[]).map((c) => (
                      <option key={c} value={c}>
                        {CHAMP_META[c].label}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  className="nc-btn"
                  onClick={() => {
                    majCases(() => DEFAUT);
                    setBase100(false);
                  }}
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── La sélection ─────────────────────────────────────────────────── */}
      <div className="cp-selection">
        {pays.map((p) => (
          <button key={p.cle} type="button" onClick={() => basculer(p.cle)} className="cp-puce" title="Retirer">
            <span className="cp-puce-point" style={{ background: p.couleur }} />
            {p.label}
            <span className="cp-puce-x" aria-hidden="true">
              ×
            </span>
          </button>
        ))}
        <div className="cp-recherche">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={choisis.length >= 6 ? "Six pays au maximum" : "Ajouter un pays…"}
            disabled={choisis.length >= 6}
            aria-label="Ajouter un pays"
          />
          {resultats.length > 0 && (
            <ul className="cp-suggestions">
              {resultats.map((p) => (
                <li key={p.cle}>
                  <button
                    type="button"
                    onClick={() => {
                      basculer(p.cle);
                      setQ("");
                    }}
                    disabled={choisis.includes(p.cle)}
                  >
                    {p.label}
                    {choisis.includes(p.cle) && <span> · déjà là</span>}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Le curseur d'année, commun à toutes les vues. */}
        <div className="db-annee">
          <span className="db-annee-n">{annee ?? "—"}</span>
          <input
            type="range"
            className="neo-scrub db-scrub"
            min={0}
            max={Math.max(0, annees.length - 1)}
            value={i}
            onChange={(e) => setI(Number(e.target.value))}
            aria-label="Année"
          />
        </div>
      </div>

      {/* ── La grille ────────────────────────────────────────────────────── */}
      <div className="db-grille">
        <AnimatePresence initial={false}>
          {visibles.map((c) => (
            <motion.section
              layout
              key={c.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={`nc-panneau db-case${glisse === c.id ? " db-case-glisse" : ""}`}
              style={{ gridColumn: `span ${SPAN[c.taille]}` }}
              draggable
              onDragStart={() => setGlisse(c.id)}
              onDragEnd={() => setGlisse(null)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => deposer(c.id)}
            >
              <span className="nc-eq nc-eq-tl" aria-hidden="true" />
              <span className="nc-eq nc-eq-br" aria-hidden="true" />
              <header className="nc-panneau-tete db-case-tete">
                <span className="nc-label">
                  <span className="db-poignee" aria-hidden="true">
                    ⠿
                  </span>
                  {TITRES[c.id]}
                </span>
                <span className="nc-mini">{charge ? "chargement…" : legende(c.id)}</span>
              </header>
              <div className="nc-panneau-corps">{contenu(c.id)}</div>
            </motion.section>
          ))}
        </AnimatePresence>
      </div>

      <p className="db-pied">
        Les valeurs sont celles publiées par la Banque mondiale pour l&apos;année affichée. Une année
        qu&apos;une source ne publie pas reste vide : elle n&apos;est ni interpolée, ni remplacée par
        zéro. Votre disposition est enregistrée dans ce navigateur.
      </p>
    </div>
  );
}
