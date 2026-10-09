"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Banknote,
  ChevronDown,
  Clock,
  Globe,
  Landmark,
  Link2,
  MessageCircle,
  Percent,
  Scale,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  DETTE_TRIMESTRES,
  FAQ,
  REPERES,
  detteDerniere,
  deficit2025,
  nonResidents,
  ratioDernier,
  serieRatio,
  variationTrimestre,
  SOURCE_COMPARAISON,
} from "@/data/articles/detteFrancaise";
import {
  ACTEURS_2025,
  CHARGE_DETTE_PROGRAMME,
  DEFICIT_2025,
  DEFICIT_PAR_ACTEUR,
  DEPENSES_2025,
  DEPENSES_FONCTION,
  DEPENSES_NATURE,
  DEPENSES_PCT_PIB_2025,
  DETTE_BRUTE,
  DETTE_NETTE,
  DETTE_PAR_EMETTEUR,
  DUREE_VIE,
  ENCOURS_NEGOCIABLE,
  ENGAGEMENTS_FINANCIERS,
  INTERETS_APU_2025,
  INTERETS_ETAT_2025,
  PORTEURS_MESURE,
  RECETTES_2025,
  RECETTES_DETAIL,
  TAUX_MOYEN_2026,
} from "@/data/articles/financesPubliques";
import { PRESSE_DETTE } from "@/data/concept/presse";
import { EnTete } from "@/components/concept/pieces";
import { PresseCarousel } from "@/components/presse/PresseCarousel";
import { Compteur, Leve } from "@/components/dette/pieces";
import { BruteNette, CompositionDette, Porteurs } from "@/components/dette/finances";
import { Comparaison, Detenteurs } from "@/components/dette/scenes";
import "@/components/concept/concept.css";
import "@/components/dette/dette.css";
import "./dette2.css";

/* ═══════════════════════════════════════════════════════════════════════════
   DETTE PUBLIQUE FRANÇAISE — VERSION DOSSIER

   Le montant d'abord, une idée par chapitre, aucun retour en arrière. Chaque
   graphique est une figure : une légende qui dit ce qu'on y voit avec les mots
   qu'on cherche, la source exacte, une adresse qu'on peut copier et des
   renvois vers les chapitres voisins. C'est ce qui permet de retrouver — et
   de citer — un graphique précis depuis un moteur de recherche.
   ═══════════════════════════════════════════════════════════════════════════ */

const nf = (v: number, d = 1) =>
  v.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });
const md = (v: number, d = 1) => `${nf(Math.abs(v), d)} Md€`;

export interface Suggestion {
  href: string;
  titre: string;
  rubrique: string;
}

const CHAPITRES = [
  { id: "essentiel", court: "L'essentiel" },
  { id: "deficit", court: "Déficit public" },
  { id: "evolution", court: "Évolution" },
  { id: "qui-doit", court: "Qui doit" },
  { id: "qui-detient", court: "Qui détient" },
  { id: "interets", court: "Intérêts" },
  { id: "budget", court: "Qui vote le budget" },
  { id: "refinancement", court: "Refinancement" },
  { id: "europe", court: "En Europe" },
  { id: "presse", court: "Dans la presse" },
  { id: "questions", court: "Questions" },
] as const;

type Source = { source: string; url: string };

/* ── Sommaire à gauche, progression en haut ──────────────────────────────── */

function Sommaire() {
  const [part, setPart] = useState(0);
  const [actif, setActif] = useState<string>(CHAPITRES[0].id);

  const lis = useCallback(() => {
    const h = document.documentElement;
    const total = h.scrollHeight - window.innerHeight;
    setPart(total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0);
    let courant: string = CHAPITRES[0].id;
    for (const c of CHAPITRES) {
      const n = document.getElementById(c.id);
      if (n && n.getBoundingClientRect().top < window.innerHeight * 0.36) courant = c.id;
    }
    setActif(courant);
  }, []);

  useEffect(() => {
    lis();
    window.addEventListener("scroll", lis, { passive: true });
    window.addEventListener("resize", lis);
    return () => {
      window.removeEventListener("scroll", lis);
      window.removeEventListener("resize", lis);
    };
  }, [lis]);

  return (
    <>
      <div className="d2-barre" aria-hidden="true">
        <span style={{ transform: `scaleX(${part})` }} />
      </div>
      <nav className="d2-som" aria-label="Chapitres du dossier">
        <p className="d2-som-t">Dans ce dossier</p>
        <ol>
          {CHAPITRES.map((c, i) => (
            <li key={c.id}>
              <a href={`#${c.id}`} className={actif === c.id ? "d2-som-on" : undefined}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {c.court}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

/* ── Un chapitre : titre direct, réponse en une phrase, ancre ────────────── */

function Chapitre({
  id,
  titre,
  reponse,
  children,
}: {
  id: string;
  titre: string;
  reponse?: React.ReactNode;
  children: React.ReactNode;
}) {
  const rang = CHAPITRES.findIndex((c) => c.id === id) + 1;
  return (
    <section id={id} className="d2-chap" aria-labelledby={`${id}-t`}>
      <header className="d2-chap-t">
        <span className="d2-chap-n">{String(rang).padStart(2, "0")}</span>
        <h2 id={`${id}-t`}>
          {titre}
          <a className="d2-perma" href={`#${id}`} aria-label={`Lien vers « ${titre} »`}>
            #
          </a>
        </h2>
        {reponse && <p className="d2-chap-r">{reponse}</p>}
      </header>
      {children}
    </section>
  );
}

/* ── Une figure : le graphique, sa légende, sa source, son ancre ─────────── */

function Figure({
  id,
  titre,
  legende,
  source,
  voir,
  children,
  reuse = false,
}: {
  id: string;
  titre: string;
  legende: string;
  source: Source;
  /** Des renvois vers d'autres figures ou chapitres de la page. */
  voir?: { href: string; label: string }[];
  children: React.ReactNode;
  /** Vrai pour un visuel repris de l'article d'origine (jetons à remapper). */
  reuse?: boolean;
}) {
  const [copie, setCopie] = useState(false);
  const copier = () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard?.writeText(url).then(
      () => {
        setCopie(true);
        window.setTimeout(() => setCopie(false), 1800);
      },
      () => {},
    );
  };
  return (
    <figure id={id} className="d2-fig">
      <div className={reuse ? "d2-reuse dp d2-reuse-dp" : "d2-fig-corps"}>{children}</div>
      <figcaption className="d2-fig-l">
        <p>
          <b>{titre}.</b> {legende}
        </p>
        <div className="d2-fig-pied">
          <a className="d2-source" href={source.url} target="_blank" rel="noopener noreferrer">
            Source : {source.source}
            <ArrowUpRight size={13} aria-hidden="true" />
          </a>
          <button type="button" className="d2-ancre" onClick={copier} aria-label={`Copier le lien vers « ${titre} »`}>
            <Link2 size={13} aria-hidden="true" />
            {copie ? "Lien copié" : "Copier le lien"}
          </button>
          {voir?.map((v) => (
            <a key={v.href} className="d2-voir" href={v.href}>
              {v.label}
            </a>
          ))}
        </div>
      </figcaption>
    </figure>
  );
}

/* ── Des étapes cliquables : choisir une étape change le panneau ─────────── */

function Etapes({
  nom,
  etapes,
}: {
  nom: string;
  etapes: { titre: string; texte: string; chiffre?: string }[];
}) {
  const [n, setN] = useState(0);
  return (
    <div className="d2-etapes">
      <div className="d2-etapes-l" role="tablist" aria-label={nom}>
        {etapes.map((e, i) => (
          <button
            key={e.titre}
            type="button"
            role="tab"
            aria-selected={n === i}
            aria-controls={`${nom}-p${i}`}
            id={`${nom}-b${i}`}
            className={n === i ? "d2-etape-on" : undefined}
            onClick={() => setN(i)}
          >
            <span>{i + 1}</span>
            {e.titre}
          </button>
        ))}
      </div>
      <div className="d2-etapes-p">
        {etapes.map((e, i) => (
          <div
            key={e.titre}
            id={`${nom}-p${i}`}
            role="tabpanel"
            aria-labelledby={`${nom}-b${i}`}
            hidden={n !== i}
            className="d2-etape-p"
          >
            {e.chiffre && <p className="d2-etape-c">{e.chiffre}</p>}
            <h3>{e.titre}</h3>
            <p>{e.texte}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Le ratio dette/PIB, date après date ─────────────────────────────────── */

/* La base du dépôt ne porte que sept dates repères pour le ratio : on les
   montre telles quelles, sans tracer de courbe entre elles qui ferait croire
   à une série annuelle. Pour fin 2025 et le premier trimestre 2026, c'est la
   valeur INSEE qui remplace le relevé manuel de 2025 (113 %), qui la
   contredisait. */
function GrapheRatio() {
  const base = serieRatio()
    .filter((p) => p.pctPib !== null && p.annee <= 2023)
    .map((p) => ({ cle: String(p.annee), etiq: String(p.annee), pct: p.pctPib as number, md: null as number | null }));
  const insee = DETTE_TRIMESTRES.map((t) => ({
    cle: t.periode,
    etiq: t.periode.replace("-T", " T"),
    pct: t.pctPib,
    md: t.md as number | null,
  }));
  const points = [...base, ...insee];
  const [sel, setSel] = useState(points.length - 1);
  const max = Math.max(...points.map((p) => p.pct));
  const p = points[sel];
  const repere = REPERES.find((r) => String(r.annee) === p.cle);

  return (
    <div className="d2-graphe">
      <div className="d2-graphe-tete">
        <p className="d2-graphe-v">
          {nf(p.pct)} <small>% du PIB</small>
        </p>
        <p className="d2-graphe-d">
          {p.etiq}
          {p.md !== null ? ` · ${nf(p.md)} Md€` : ""}
          {repere ? ` · ${repere.nom}` : ""}
        </p>
      </div>
      <div className="d2-barres" role="list">
        {points.map((pt, i) => (
          <button
            key={pt.cle}
            type="button"
            role="listitem"
            className={`d2-barre-c${i === sel ? " d2-barre-on" : ""}`}
            onClick={() => setSel(i)}
            onMouseEnter={() => setSel(i)}
            onFocus={() => setSel(i)}
            aria-label={`${pt.etiq} : ${nf(pt.pct)} % du PIB`}
          >
            <span className="d2-barre-v">{nf(pt.pct, Number.isInteger(pt.pct) ? 0 : 1)}</span>
            <span className="d2-barre-z">
              <span className="d2-barre-b" style={{ height: `${(pt.pct / max) * 100}%`, "--i": i } as React.CSSProperties} />
            </span>
            <span className="d2-barre-a">{pt.etiq}</span>
          </button>
        ))}
      </div>
      <details className="d2-donnees">
        <summary>Voir les données</summary>
        <table>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Dette / PIB</th>
              <th scope="col">Montant</th>
            </tr>
          </thead>
          <tbody>
            {points.map((pt) => (
              <tr key={pt.cle}>
                <th scope="row">{pt.etiq}</th>
                <td>{nf(pt.pct)} %</td>
                <td>{pt.md !== null ? `${nf(pt.md)} Md€` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}

/* ── Une répartition : le même visuel pour les recettes, les dépenses et le
   déficit — une barre segmentée, puis la liste des montants et des parts. ── */

const COULEURS = ["var(--d2-s0)", "var(--d2-s1)", "var(--d2-s2)", "var(--d2-s3)", "var(--d2-s4)", "var(--d2-s5)"];

function Repart({
  lignes,
  nom,
  negatif = false,
}: {
  lignes: { nom: string; md: number }[];
  nom: string;
  negatif?: boolean;
}) {
  const positives = lignes.filter((l) => l.md > 0);
  const somme = positives.reduce((t, l) => t + l.md, 0);
  const [actif, setActif] = useState<number | null>(null);
  return (
    <div className="d2-rep">
      <div className="d2-pile-b" role="img" aria-label={nom}>
        {positives.map((l, i) => (
          <span
            key={l.nom}
            className={actif !== null && actif !== i ? "d2-seg-sombre" : undefined}
            style={{ flexGrow: l.md, background: COULEURS[i % COULEURS.length] }}
            title={`${l.nom} · ${md(l.md)}`}
            onPointerEnter={() => setActif(i)}
            onPointerLeave={() => setActif(null)}
          />
        ))}
      </div>
      <ul className="d2-pile-l">
        {lignes.map((l, i) => (
          <li
            key={l.nom}
            className={`${l.md < 0 ? "d2-pile-neg" : ""}${actif === i && l.md > 0 ? " d2-pile-on" : ""}`}
            onPointerEnter={() => l.md > 0 && setActif(i)}
            onPointerLeave={() => setActif(null)}
          >
            <i style={{ background: l.md > 0 ? COULEURS[i % COULEURS.length] : "var(--d2-s5)" }} aria-hidden="true" />
            <span>{l.nom}</span>
            <b className={negatif ? "d2-neg" : undefined}>
              {negatif || l.md < 0 ? "−" : ""}
              {nf(Math.abs(l.md))} Md€
            </b>
            <em>{l.md > 0 ? `${nf((l.md / somme) * 100)} %` : "en déduction"}</em>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Recettes, dépenses, déficit : trois onglets, un seul visuel ─────────── */

function Deficit() {
  const [onglet, setOnglet] = useState<"recettes" | "depenses" | "deficit">("recettes");
  const [lecture, setLecture] = useState<"nature" | "fonction">("nature");
  const rec = RECETTES_2025.valeur;
  const dep = DEPENSES_2025.valeur;
  const solde = Math.abs(DEFICIT_2025.valeur);
  const etat = Math.abs(ACTEURS_2025[0].lignes?.[0].md ?? 0);

  return (
    <>
      <div className="d2-onglets" role="tablist" aria-label="Recettes, dépenses ou déficit">
        <button
          type="button"
          role="tab"
          aria-selected={onglet === "recettes"}
          aria-controls="d2-p-recettes"
          className="d2-onglet d2-onglet-rec"
          onClick={() => setOnglet("recettes")}
        >
          <span>Recettes</span>
          <b>{nf(rec, 0)} Md€</b>
          <i style={{ "--p": `${(rec / dep) * 100}%` } as React.CSSProperties} />
        </button>
        <span className="d2-onglets-s" aria-hidden="true">−</span>
        <button
          type="button"
          role="tab"
          aria-selected={onglet === "depenses"}
          aria-controls="d2-p-depenses"
          className="d2-onglet d2-onglet-dep"
          onClick={() => setOnglet("depenses")}
        >
          <span>Dépenses</span>
          <b>{nf(dep, 0)} Md€</b>
          <i style={{ "--p": "100%" } as React.CSSProperties} />
        </button>
        <span className="d2-onglets-s" aria-hidden="true">=</span>
        <button
          type="button"
          role="tab"
          aria-selected={onglet === "deficit"}
          aria-controls="d2-p-deficit"
          className="d2-onglet d2-onglet-def"
          onClick={() => setOnglet("deficit")}
        >
          <span>Déficit</span>
          <b>−{nf(solde)} Md€</b>
          <i style={{ "--p": `${(solde / dep) * 400}%` } as React.CSSProperties} />
        </button>
      </div>

      <div id="d2-p-recettes" role="tabpanel" hidden={onglet !== "recettes"} className="d2-panneau">
        <Figure
          id="recettes-publiques"
          titre="D'où viennent les recettes publiques"
          legende={`Répartition des ${nf(rec, 0)} milliards d'euros de recettes des administrations publiques françaises en 2025 : impôts, cotisations sociales, ventes et autres produits.`}
          source={RECETTES_2025}
          voir={[{ href: "#depenses-publiques", label: "Voir les dépenses" }]}
        >
          <Repart lignes={RECETTES_DETAIL} nom="Répartition des recettes publiques 2025" />
        </Figure>
      </div>

      <div id="d2-p-depenses" role="tabpanel" hidden={onglet !== "depenses"} className="d2-panneau">
        <Figure
          id="depenses-publiques"
          titre="Où va l'argent public"
          legende={`Les ${nf(dep, 0)} milliards d'euros de dépenses publiques 2025 lus par nature (salaires, prestations sociales, investissement, intérêts) ou par fonction (protection sociale, santé, éducation, défense).`}
          source={DEPENSES_2025}
          voir={[{ href: "#recettes-publiques", label: "Voir les recettes" }]}
        >
          <div className="d2-lectures" role="group" aria-label="Lecture des dépenses">
            <button type="button" className={lecture === "nature" ? "d2-lec-on" : undefined} onClick={() => setLecture("nature")}>
              Par nature
            </button>
            <button type="button" className={lecture === "fonction" ? "d2-lec-on" : undefined} onClick={() => setLecture("fonction")}>
              Par fonction
            </button>
          </div>
          {lecture === "nature" ? (
            <Repart lignes={DEPENSES_NATURE} nom="Dépenses publiques 2025 par nature" />
          ) : (
            <>
              <Repart lignes={DEPENSES_FONCTION} nom="Dépenses publiques par fonction" />
              <p className="d2-notule">Dernière ventilation par fonction publiée : 2024.</p>
            </>
          )}
        </Figure>
      </div>

      <div id="d2-p-deficit" role="tabpanel" hidden={onglet !== "deficit"} className="d2-panneau">
        <Figure
          id="qui-cree-le-deficit"
          titre="Qui crée le déficit"
          legende={`${nf(etat)} des ${nf(solde)} milliards d'euros de déficit public 2025 viennent de l'État ; les collectivités locales et la Sécurité sociale pèsent bien moins.`}
          source={DEFICIT_2025}
          voir={[{ href: "#evolution", label: "Voir l'évolution de la dette" }]}
        >
          <Repart
            lignes={DEFICIT_PAR_ACTEUR.map((d) => ({ nom: d.nom, md: Math.abs(d.md) }))}
            nom="Déficit public 2025 par administration"
            negatif
          />
        </Figure>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LA PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

function Rail({
  titre,
  ouvert = true,
  children,
  classe = "",
}: {
  titre: string;
  ouvert?: boolean;
  children: React.ReactNode;
  classe?: string;
}) {
  const [o, setO] = useState(ouvert);
  return (
    <div className={`d2-rail-c ${classe}`}>
      <button type="button" className="d2-rail-b" aria-expanded={o} onClick={() => setO(!o)}>
        {titre}
        <ChevronDown size={16} aria-hidden="true" className={o ? "d2-rail-ouv" : undefined} />
      </button>
      <div className="d2-rail-corps" hidden={!o}>
        {children}
      </div>
    </div>
  );
}

export function Dette2Page({ suggestions }: { suggestions: Suggestion[] }) {
  const solde = Math.abs(DEFICIT_2025.valeur);
  const etat = Math.abs(ACTEURS_2025[0].lignes?.[0].md ?? 0);
  const [autres, setAutres] = useState(false);

  return (
    <div className="d2">
      <div className="cg dp-menu">
        <EnTete actif="Dette" />
      </div>
      <div className="d2-fond" aria-hidden="true" />

      {/* ── Ouverture ───────────────────────────────────────────────────── */}
      <header className="d2-ouv">
        <nav className="d2-fil" aria-label="Fil d'Ariane">
          <a href="/">Accueil</a>
          <span aria-hidden="true">/</span>
          <a href="/france/economie">France · Économie</a>
          <span aria-hidden="true">/</span>
          <span>Dette publique</span>
        </nav>
        <h1 className="d2-h1">
          <span className="d2-h1-s">Dette publique de la France</span>
          <span className="d2-h1-v">
            <Compteur valeur={detteDerniere.valeur} decimales={1} duree={1500} />
            <small>Md€</small>
          </span>
        </h1>
        <p className="d2-chapo">
          <b>{nf(ratioDernier.valeur)} % du PIB</b> à la fin du premier trimestre 2026.{" "}
          <a href={detteDerniere.url} target="_blank" rel="noopener noreferrer">
            INSEE ↗
          </a>
        </p>
      </header>

      <div className="d2-grille">
        <Sommaire />
        <main className="d2-col">
          {/* ── 01 · L'essentiel ──────────────────────────────────────────── */}
          <Chapitre
            id="essentiel"
            titre="Dette de la France : les chiffres clés"
            reponse={
              <>
                La dette est un <b>stock</b>, le déficit est ce qui l&apos;alimente, les intérêts sont
                ce qu&apos;elle coûte chaque année.
              </>
            }
          >
            <div className="d2-bento">
              <Leve tag="figure" className="d2-carte d2-carte-vif d2-c-a">
                <Percent size={20} className="d2-ico" aria-hidden="true" />
                <p className="d2-carte-v">{nf(ratioDernier.valeur)} %</p>
                <p className="d2-carte-l">de dette rapportée au PIB</p>
                <p className="d2-carte-t">{`Environ ${nf(ratioDernier.valeur / 100, 2)} année de richesse produite. Ce n'est pas une facture à régler d'un coup.`}</p>
              </Leve>
              <Leve tag="figure" className="d2-carte d2-c-b" delai={70}>
                <TrendingUp size={20} className="d2-ico" aria-hidden="true" />
                <p className="d2-carte-v">+{nf(variationTrimestre.valeur)} Md€</p>
                <p className="d2-carte-l">en un trimestre</p>
                <p className="d2-carte-t">Entre fin 2025 et fin mars 2026.</p>
              </Leve>
              <Leve tag="figure" className="d2-carte d2-c-c" delai={140}>
                <Scale size={20} className="d2-ico" aria-hidden="true" />
                <p className="d2-carte-v d2-neg">−{nf(solde)} Md€</p>
                <p className="d2-carte-l">de déficit public en 2025</p>
                <p className="d2-carte-t">{`${nf(deficit2025.valeur)} % du PIB, dont ${nf(etat)} Md€ pour l'État.`}</p>
              </Leve>
              <Leve tag="figure" className="d2-carte d2-c-d" delai={70}>
                <Banknote size={20} className="d2-ico" aria-hidden="true" />
                <p className="d2-carte-v">{nf(INTERETS_APU_2025.valeur)} Md€</p>
                <p className="d2-carte-l">d&apos;intérêts en 2025</p>
                <p className="d2-carte-t">Toutes administrations publiques.</p>
              </Leve>
              <Leve tag="figure" className="d2-carte d2-c-e" delai={140}>
                <Globe size={20} className="d2-ico" aria-hidden="true" />
                <p className="d2-carte-v">{nf(PORTEURS_MESURE.valeur)} %</p>
                <p className="d2-carte-l">détenus hors de France</p>
                <p className="d2-carte-t">Dette négociable de l&apos;État, T1 2026.</p>
              </Leve>
              <Leve tag="figure" className="d2-carte d2-c-f" delai={210}>
                <Clock size={20} className="d2-ico" aria-hidden="true" />
                <p className="d2-carte-v">{nf(DUREE_VIE.valeur)} ans</p>
                <p className="d2-carte-l">de durée de vie moyenne</p>
                <p className="d2-carte-t">{`Soit ${DUREE_VIE.texte}.`}</p>
              </Leve>
            </div>
            <p className="d2-notule">
              Sources :{" "}
              <a href={detteDerniere.url} target="_blank" rel="noopener noreferrer">
                INSEE · dette trimestrielle de Maastricht ↗
              </a>
              ,{" "}
              <a href={DEFICIT_2025.url} target="_blank" rel="noopener noreferrer">
                INSEE · comptes nationaux ↗
              </a>
              ,{" "}
              <a href={DUREE_VIE.url} target="_blank" rel="noopener noreferrer">
                Agence France Trésor ↗
              </a>
              .
            </p>
          </Chapitre>

          {/* ── 02 · Déficit ──────────────────────────────────────────────── */}
          <Chapitre
            id="deficit"
            titre="Déficit public de la France"
            reponse={
              <>
                {`En 2025, les administrations publiques ont dépensé ${nf(DEPENSES_2025.valeur, 0)} Md€ pour ${nf(RECETTES_2025.valeur, 0)} Md€ de recettes : `}
                <b>{`${nf(solde)} Md€ de déficit, soit ${nf(deficit2025.valeur)} % du PIB`}</b>
                {`. Les dépenses pèsent ${nf(DEPENSES_PCT_PIB_2025.valeur)} % du PIB.`}
              </>
            }
          >
            <Deficit />
          </Chapitre>

          {/* ── 03 · Évolution ────────────────────────────────────────────── */}
          <Chapitre
            id="evolution"
            titre="Évolution de la dette publique"
            reponse={
              <>
                {`Le ratio dette/PIB est passé de 57 % en 2000 à `}
                <b>{`${nf(ratioDernier.valeur)} % début 2026`}</b>
                {`, avec des paliers à la crise de 2008, au Covid-19 puis au choc énergétique.`}
              </>
            }
          >
            <Figure
              id="evolution-dette-pib"
              titre="Dette publique française rapportée au PIB depuis 2000"
              legende="Le ratio dette/PIB de la France à sept dates repères entre 2000 et 2023, puis les valeurs INSEE de fin 2025 et du premier trimestre 2026. Chaque barre se lit en cliquant dessus."
              source={{ source: "INSEE · dette trimestrielle de Maastricht ; Banque mondiale, FMI", url: detteDerniere.url }}
              voir={[{ href: "#qui-doit", label: "Qui doit cette dette" }]}
            >
              <GrapheRatio />
            </Figure>
          </Chapitre>

          {/* ── 04 · Qui doit ─────────────────────────────────────────────── */}
          <Chapitre
            id="qui-doit"
            titre="Qui doit la dette publique ?"
            reponse={
              <>
                {`L'État porte `}
                <b>{`${nf(DETTE_PAR_EMETTEUR[0].md, 0)} Md€`}</b>
                {` (${nf(DETTE_PAR_EMETTEUR[0].pct)} %), la Sécurité sociale ${nf(DETTE_PAR_EMETTEUR[1].md, 0)} Md€, les collectivités ${nf(DETTE_PAR_EMETTEUR[2].md, 0)} Md€ et les organismes centraux ${nf(DETTE_PAR_EMETTEUR[3].md, 0)} Md€.`}
              </>
            }
          >
            <p className="d2-total">
              <span>Total</span>
              {`${md(DETTE_PAR_EMETTEUR.reduce((s, e) => s + e.md, 0))} ≈ ${md(DETTE_BRUTE.valeur)} : la dette brute de Maastricht, celle du chiffre en tête de page. La dette nette est plus basse (${md(DETTE_NETTE.valeur)}) car on en retire la trésorerie et certains actifs financiers.`}
            </p>
            <Figure
              id="dette-par-emetteur"
              titre="Dette publique par émetteur et par instrument"
              legende="Qui doit l'argent : l'État, la Sécurité sociale, les collectivités locales et les organismes centraux ; et sous quelle forme : titres négociables, crédits, dépôts."
              source={DETTE_BRUTE}
              voir={[{ href: "#qui-detient", label: "Qui détient ces titres" }]}
              reuse
            >
              <CompositionDette />
              <BruteNette />
            </Figure>
          </Chapitre>

          {/* ── 05 · Qui détient ──────────────────────────────────────────── */}
          <Chapitre
            id="qui-detient"
            titre="Qui détient la dette française ?"
            reponse={
              <>
                <b>{`${nf(PORTEURS_MESURE.valeur)} %`}</b>
                {` de la dette négociable de l'État est détenue par des non-résidents (T1 2026, valeur de marché). Ce taux ne s'applique pas tel quel aux ${nf(detteDerniere.valeur, 0)} Md€ de Maastricht ; sur les titres de long terme de l'ensemble des administrations, la Banque de France compte ${nf(nonResidents.valeur)} %.`}
              </>
            }
          >
            <Figure
              id="detenteurs-dette"
              titre="Détenteurs de la dette de l'État"
              legende="Répartition de la dette négociable de l'État entre non-résidents, banques, assureurs, fonds et autres détenteurs français, et son évolution depuis 2022."
              source={PORTEURS_MESURE}
              voir={[{ href: "#interets", label: "Ce que ça coûte" }]}
              reuse
            >
              <Porteurs />
              <h3 className="d2-h3">Qui sont ces investisseurs</h3>
              <Detenteurs />
            </Figure>
          </Chapitre>

          {/* ── 06 · Intérêts ─────────────────────────────────────────────── */}
          <Chapitre
            id="interets"
            titre="Intérêts de la dette publique"
            reponse={
              <>
                {`La France a payé `}
                <b>{`${nf(INTERETS_APU_2025.valeur)} Md€ d'intérêts en 2025`}</b>
                {`, en hausse de 11,2 %. C'est le coût annuel de la dette, à ne pas confondre avec son montant.`}
              </>
            }
          >
            <Figure
              id="interets-dette"
              titre="Charge des intérêts de la dette"
              legende="Intérêts payés en 2025 par l'ensemble des administrations publiques, part de l'État, encours de dette négociable, taux moyen des OAT 2026 et durée de vie moyenne."
              source={INTERETS_APU_2025}
              voir={[{ href: "#refinancement", label: "Comment la dette se refinance" }]}
            >
              <div className="d2-couts">
                <Leve className="d2-cout d2-cout-g">
                  <b>{nf(INTERETS_APU_2025.valeur)} Md€</b>
                  <span>d&apos;intérêts par an, toutes administrations publiques</span>
                </Leve>
                <Leve className="d2-cout" delai={60}>
                  <b>{nf(INTERETS_ETAT_2025.valeur)} Md€</b>
                  <span>dont l&apos;État</span>
                </Leve>
                <Leve className="d2-cout" delai={120}>
                  <b>{nf(TAUX_MOYEN_2026.valeur, 2)} %</b>
                  <span>taux moyen des OAT émises en 2026</span>
                </Leve>
                <Leve className="d2-cout" delai={180}>
                  <b>{nf(ENCOURS_NEGOCIABLE.valeur)} Md€</b>
                  <span>de dette négociable de l&apos;État en circulation</span>
                </Leve>
              </div>

              <button type="button" className="d2-plus" aria-expanded={autres} onClick={() => setAutres(!autres)}>
                D&apos;autres montants circulent : pourquoi ?
                <ChevronDown size={16} aria-hidden="true" className={autres ? "d2-rail-ouv" : undefined} />
              </button>
              <div hidden={!autres} className="d2-plus-c">
                <p>
                  Le budget de l&apos;État est présenté de deux façons. En comptabilité budgétaire, la
                  ligne « Charge de la dette et trésorerie de l&apos;État » vaut{" "}
                  <b>{nf(CHARGE_DETTE_PROGRAMME.valeur)} Md€</b>, et la mission « Engagements
                  financiers de l&apos;État », plus large, <b>{nf(ENGAGEMENTS_FINANCIERS.valeur)} Md€</b>. En
                  comptabilité nationale, les intérêts de l&apos;État sont de{" "}
                  <b>{nf(INTERETS_ETAT_2025.valeur)} Md€</b>. Ces montants sont tous exacts : ils ne
                  comptent ni les mêmes opérations, ni le même périmètre.
                </p>
              </div>
            </Figure>
          </Chapitre>

          {/* ── 07 · Qui vote le budget ───────────────────────────────────── */}
          <Chapitre
            id="budget"
            titre="Qui vote le budget de l'État ?"
            reponse="Le Parlement. Le gouvernement propose, l'Assemblée nationale et le Sénat votent, puis l'État exécute et la Cour des comptes contrôle."
          >
            <Etapes
              nom="budget"
              etapes={[
                {
                  titre: "Le gouvernement propose",
                  texte:
                    "Chaque automne, il dépose le projet de loi de finances pour l'État et le projet de loi de financement de la Sécurité sociale. Ces textes fixent les recettes attendues, les dépenses prévues et le déficit visé.",
                },
                {
                  titre: "Le Parlement vote",
                  texte:
                    "L'Assemblée nationale et le Sénat examinent, amendent puis votent. La loi de finances autorise les dépenses de l'État et fixe le besoin de financement, c'est-à-dire ce que l'État aura à emprunter dans l'année.",
                },
                {
                  titre: "L'État exécute",
                  texte:
                    "Les ministères dépensent dans le cadre voté. Si les recettes sont plus faibles que prévu, le déficit se creuse et l'État emprunte davantage.",
                },
                {
                  titre: "La Cour des comptes contrôle",
                  texte:
                    "L'exécution du budget est contrôlée, et le Parlement approuve les comptes de l'année écoulée dans une loi dédiée.",
                },
              ]}
            />
            <p className="d2-notule">
              Sources :{" "}
              <a href="https://www.budget.gouv.fr/" target="_blank" rel="noopener noreferrer">
                budget.gouv.fr ↗
              </a>
              ,{" "}
              <a href="https://www.assemblee-nationale.fr/" target="_blank" rel="noopener noreferrer">
                Assemblée nationale ↗
              </a>
              .
            </p>
          </Chapitre>

          {/* ── 08 · Refinancement ────────────────────────────────────────── */}
          <Chapitre
            id="refinancement"
            titre="Comment l'État refinance la dette"
            reponse="Il n'y a pas de jour où tout serait dû : chaque titre a son échéance, et l'État en émet de nouveaux pour rembourser les anciens et financer le déficit."
          >
            <Etapes
              nom="refi"
              etapes={[
                {
                  titre: "Le besoin de financement",
                  chiffre: `${nf(solde)} Md€ de déficit en 2025`,
                  texte:
                    "Il se compose du déficit de l'année, du remboursement des titres qui arrivent à échéance et d'autres besoins de trésorerie. Les émissions brutes sont donc bien plus élevées que la dette nouvelle.",
                },
                {
                  titre: "L'État émet des titres",
                  chiffre: "OAT et BTF",
                  texte:
                    "L'Agence France Trésor vend des obligations assimilables du Trésor (OAT) pour le moyen et le long terme, et des bons du Trésor à taux fixe (BTF) pour le court terme, aux enchères, sur un calendrier annoncé à l'avance.",
                },
                {
                  titre: "Des investisseurs les achètent",
                  chiffre: `${nf(PORTEURS_MESURE.valeur)} % hors de France`,
                  texte:
                    "Banques, assureurs, fonds, banques centrales et épargnants prêtent à l'État en achetant ces titres, et reçoivent des intérêts.",
                },
                {
                  titre: "Les titres arrivent à échéance",
                  chiffre: DUREE_VIE.texte,
                  texte:
                    "C'est la durée de vie moyenne de la dette négociable de l'État. À l'échéance, le capital est remboursé et un nouveau titre prend la place : une hausse des taux ne se voit donc que peu à peu.",
                },
              ]}
            />
            <p className="d2-notule">
              Source :{" "}
              <a href={DUREE_VIE.url} target="_blank" rel="noopener noreferrer">
                Agence France Trésor · bulletin mensuel ↗
              </a>
              .
            </p>
          </Chapitre>

          {/* ── 09 · Europe ───────────────────────────────────────────────── */}
          <Chapitre
            id="europe"
            titre="Dette publique en Europe : la France face à ses voisins"
            reponse="Fin 2025, la France fait partie des cinq pays de l'Union européenne dont la dette dépasse 100 % du PIB, avec la Grèce, l'Italie, la Belgique et l'Espagne."
          >
            <Figure
              id="dette-europe"
              titre="Dette publique en pourcentage du PIB, fin 2025"
              legende="Comparaison de la dette publique de la Grèce, de l'Italie, de la France, de la Belgique et de l'Espagne avec la moyenne de la zone euro et de l'Union européenne, sur une même période."
              source={{ source: SOURCE_COMPARAISON.source, url: SOURCE_COMPARAISON.url }}
              voir={[
                { href: "/economie", label: "Dette de 200 pays sur le globe" },
                { href: "#evolution", label: "Évolution en France" },
              ]}
              reuse
            >
              <Comparaison />
            </Figure>
          </Chapitre>

          {/* ── 10 · Presse ───────────────────────────────────────────────── */}
          <section id="presse" className="d2-chap d2-chap-presse" aria-labelledby="presse-carrousel-t">
            <PresseCarousel
              id="presse-carrousel"
              titre="La dette française dans la presse"
              intro="Les articles des grands médias qui traitent du sujet, pour aller plus loin et vérifier les sources."
              citations={PRESSE_DETTE}
            />
          </section>

          {/* ── 11 · Questions ────────────────────────────────────────────── */}
          <Chapitre id="questions" titre="Questions fréquentes sur la dette publique">
            <div className="d2-faq">
              {FAQ.map((f) => (
                <details key={f.q}>
                  <summary>
                    <span>{f.q}</span>
                    <ChevronDown size={18} aria-hidden="true" />
                  </summary>
                  <p>{f.r}</p>
                </details>
              ))}
            </div>
            <p className="d2-notule">
              Sources : INSEE, Banque de France, Agence France Trésor, Eurostat.{" "}
              <a href="/methodologie-donnees">Notre méthode</a>
            </p>
          </Chapitre>

          {/* ── La suite ──────────────────────────────────────────────────── */}
          <section className="d2-suite" aria-labelledby="d2-suite-t">
            <h2 id="d2-suite-t">Continuer</h2>
            <div className="d2-suite-g">
              {suggestions.map((s, i) => (
                <a key={s.href} href={s.href} className={`d2-sug${i === 0 ? " d2-sug-vif" : ""}`}>
                  <span className="d2-sug-r">{s.rubrique}</span>
                  <span className="d2-sug-t">{s.titre}</span>
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
              ))}
            </div>
          </section>
        </main>

        {/* ── Colonne de droite ─────────────────────────────────────────── */}
        <aside className="d2-rail" aria-label="Autres pages">
          <Rail titre="Explorer le site" classe="d2-rail-explore">
            <a href="/economie">
              <span className="d2-rail-i"><Landmark size={16} aria-hidden="true" /></span>
              Globe économie
            </a>
            <a href="/demographie">
              <span className="d2-rail-i"><Users size={16} aria-hidden="true" /></span>
              Globe démographie
            </a>
            <a href="/analyses">
              <span className="d2-rail-i"><Sparkles size={16} aria-hidden="true" /></span>
              Analyses
            </a>
            <a href="/forum">
              <span className="d2-rail-i"><MessageCircle size={16} aria-hidden="true" /></span>
              Forum
            </a>
          </Rail>

          <Rail titre="À lire aussi">
            <ul>
              {suggestions.map((s) => (
                <li key={s.href}>
                  <a href={s.href}>
                    <span>{s.rubrique}</span>
                    {s.titre}
                  </a>
                </li>
              ))}
            </ul>
          </Rail>

          <Rail titre="Sources" ouvert={false} classe="d2-rail-src">
            <p>INSEE · Banque de France · Agence France Trésor · Eurostat</p>
            <a href="/methodologie-donnees">Notre méthode →</a>
          </Rail>
        </aside>
      </div>
    </div>
  );
}
