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
  MessageCircle,
  Percent,
  Scale,
  TrendingUp,
} from "lucide-react";
import {
  deficit2025,
  detteDerniere,
  FAQ,
  nonResidents,
  ratioDernier,
  variationTrimestre,
} from "@/data/articles/detteFrancaise";
import {
  ACTEURS_2025,
  CHARGE_DETTE_PROGRAMME,
  DEFICIT_2025,
  DEPENSES_2025,
  DEPENSES_PCT_PIB_2025,
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
import { EnTete } from "@/components/concept/pieces";
import { Compteur, Leve, Source } from "@/components/dette/pieces";
import {
  BruteNette,
  CompositionDette,
  Etiquette,
  OuVaLArgent,
  Porteurs,
  Waterfall,
} from "@/components/dette/finances";
import { Comparaison, Courbe, Detenteurs } from "@/components/dette/scenes";
import "@/components/concept/concept.css";
import "@/components/dette/dette.css";
import "./dette2.css";

/* ═══════════════════════════════════════════════════════════════════════════
   DETTE PUBLIQUE FRANÇAISE — VERSION DOSSIER

   Même matière que l'article d'origine, autre construction : le montant
   d'abord, une idée par chapitre, et aucun retour en arrière. Chaque chapitre
   s'ouvre sur ses chiffres ; l'explication vient après, et seulement ce qui
   n'est pas déjà dit par le chiffre.

   Les visuels que l'article d'origine réussissait — qui crée le déficit, où
   va l'argent, par émetteur et par instrument, qui détient — sont repris tels
   quels. Ce qui change : l'ordre, la mise en page, et une colonne de
   lecture entourée d'un sommaire à gauche et de suggestions à droite.
   ═══════════════════════════════════════════════════════════════════════════ */

const nf = (v: number, d = 1) =>
  v.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });
const md = (v: number, d = 1) => `${nf(Math.abs(v), d)} Md€`;

export interface Suggestion {
  href: string;
  titre: string;
  rubrique: string;
  duree?: string;
}

const CHAPITRES = [
  { id: "essentiel", court: "L'essentiel", n: "01" },
  { id: "recettes-depenses", court: "Recettes et dépenses", n: "02" },
  { id: "deficit", court: "Qui crée le déficit", n: "03" },
  { id: "accumulation", court: "Accumulation", n: "04" },
  { id: "qui-doit", court: "Qui doit", n: "05" },
  { id: "qui-detient", court: "Qui détient", n: "06" },
  { id: "cout", court: "Ce que ça coûte", n: "07" },
  { id: "remboursement", court: "Remboursement", n: "08" },
  { id: "europe", court: "En Europe", n: "09" },
  { id: "questions", court: "Questions", n: "10" },
] as const;

/* ── La barre de progression et le sommaire ──────────────────────────────── */

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
          {CHAPITRES.map((c) => (
            <li key={c.id}>
              <a href={`#${c.id}`} className={actif === c.id ? "d2-som-on" : undefined}>
                <span>{c.n}</span>
                {c.court}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

/* ── Une ouverture de chapitre : le chiffre, puis rien d'autre ───────────── */

function Chapitre({
  id,
  n,
  titre,
  chiffre,
  children,
}: {
  id: string;
  n: string;
  titre: React.ReactNode;
  /** La phrase-réponse : le montant, l'unité, le périmètre. */
  chiffre?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="d2-chap">
      <header className="d2-chap-t">
        <span className="d2-chap-n">{n}</span>
        <h2>{titre}</h2>
        {chiffre && <p className="d2-chap-r">{chiffre}</p>}
      </header>
      {children}
    </section>
  );
}

/** Une pastille de lien vers une autre page du site. */
function Pour({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a className="d2-pour" href={href}>
      {children}
      <ArrowUpRight size={14} aria-hidden="true" />
    </a>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LA PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

export function Dette2Page({ suggestions }: { suggestions: Suggestion[] }) {
  const recTotal = RECETTES_2025.valeur;
  const depTotal = DEPENSES_2025.valeur;
  const solde = Math.abs(DEFICIT_2025.valeur);
  const etatDeficit = Math.abs(ACTEURS_2025[0].lignes?.[0].md ?? 0);

  /* Les segments des recettes : le poste négatif vient en déduction, il ne se
     dessine pas comme une part. */
  const segments = RECETTES_DETAIL.filter((p) => p.md > 0);
  const sommeSeg = segments.reduce((s, p) => s + p.md, 0);

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

        <p className="d2-puce">
          <span className="d2-point" aria-hidden="true" />
          Dossier · T1 2026 · 6 min de lecture
        </p>

        <h1 className="d2-h1">
          <span className="d2-h1-s">Dette publique de la France</span>
          <span className="d2-h1-v">
            <Compteur valeur={detteDerniere.valeur} decimales={1} duree={1500} />
            <small>Md€</small>
          </span>
        </h1>

        <p className="d2-chapo">
          Soit <b>{nf(ratioDernier.valeur)} % du PIB</b>, à la fin du premier trimestre 2026.
          Voici d&apos;où elle vient, qui la détient et ce qu&apos;elle coûte, montants à
          l&apos;appui.
        </p>
        <Source c={detteDerniere} className="d2-src" />

        {/* Des raccourcis plutôt qu'une injonction à défiler : trois questions,
            trois chapitres. */}
        <ul className="d2-puces" aria-label="Aller directement à">
          <li>
            <a href="#recettes-depenses" className="d2-flotte d2-flotte-a">
              <Scale size={16} aria-hidden="true" />
              Recettes ou dépenses ?
            </a>
          </li>
          <li>
            <a href="#qui-detient" className="d2-flotte d2-flotte-b">
              <Globe size={16} aria-hidden="true" />
              Qui détient la dette ?
            </a>
          </li>
          <li>
            <a href="#cout" className="d2-flotte d2-flotte-c">
              <Banknote size={16} aria-hidden="true" />
              Combien ça coûte ?
            </a>
          </li>
        </ul>
      </header>

      {/* ── Le corps : sommaire, texte, suggestions ──────────────────────── */}
      <div className="d2-grille">
        <Sommaire />
        <main className="d2-col">
          {/* ── 01 · L'essentiel ──────────────────────────────────────────── */}
          <Chapitre
            id="essentiel"
            n="01"
            titre="L'essentiel, en six chiffres"
            chiffre={
              <>
                La dette est un <b>stock</b>. Le déficit est ce qui l&apos;alimente. Les intérêts
                sont ce qu&apos;elle coûte chaque année.
              </>
            }
          >
            <div className="d2-bento">
              <Leve tag="figure" className="d2-carte d2-carte-vif d2-c-a">
                <Percent size={20} className="d2-ico" aria-hidden="true" />
                <p className="d2-carte-v">{nf(ratioDernier.valeur)} %</p>
                <p className="d2-carte-l">de dette rapportée au PIB</p>
                <p className="d2-carte-t">
                  Environ {nf(ratioDernier.valeur / 100, 2)}{" "}année de richesse produite. Ce n&apos;est
                  pas une facture à régler d&apos;un coup.
                </p>
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
                <p className="d2-carte-t">
                  {nf(deficit2025.valeur)} % du PIB, dont {nf(etatDeficit)}{" "}Md€ pour l&apos;État.
                </p>
              </Leve>

              <Leve tag="figure" className="d2-carte d2-c-d" delai={70}>
                <Banknote size={20} className="d2-ico" aria-hidden="true" />
                <p className="d2-carte-v">{nf(INTERETS_APU_2025.valeur)} Md€</p>
                <p className="d2-carte-l">d&apos;intérêts payés en 2025</p>
                <p className="d2-carte-t">Par l&apos;ensemble des administrations publiques.</p>
              </Leve>

              <Leve tag="figure" className="d2-carte d2-c-e" delai={140}>
                <Globe size={20} className="d2-ico" aria-hidden="true" />
                <p className="d2-carte-v">{nf(PORTEURS_MESURE.valeur)} %</p>
                <p className="d2-carte-l">détenus par des non-résidents</p>
                <p className="d2-carte-t">Part de la dette négociable de l&apos;État, T1 2026.</p>
              </Leve>

              <Leve tag="figure" className="d2-carte d2-c-f" delai={210}>
                <Clock size={20} className="d2-ico" aria-hidden="true" />
                <p className="d2-carte-v">{nf(DUREE_VIE.valeur)} ans</p>
                <p className="d2-carte-l">de durée de vie moyenne</p>
                <p className="d2-carte-t">Soit {DUREE_VIE.texte}, pour la dette négociable de l&apos;État.</p>
              </Leve>
            </div>
            <p className="d2-notule">
              Sources : INSEE (dette de Maastricht, comptes nationaux), Agence France Trésor.{" "}
              <a href="/sources">Toutes les sources</a>
            </p>
          </Chapitre>

          {/* ── 02 · Recettes et dépenses ─────────────────────────────────── */}
          <Chapitre
            id="recettes-depenses"
            n="02"
            titre={
              <>
                {nf(recTotal, 0)} Md€ encaissés, {nf(depTotal, 0)} Md€ dépensés
              </>
            }
            chiffre={
              <>
                Les administrations publiques ont dépensé <b>{nf(DEPENSES_PCT_PIB_2025.valeur)} %</b>{" "}
                du PIB en 2025, et reçu {nf(solde)}{" "}Md€ de moins que ce qu&apos;elles ont dépensé.
              </>
            }
          >
            <Leve className="d2-equa">
              <div className="d2-equa-c d2-equa-rec">
                <p className="d2-equa-l">Recettes</p>
                <p className="d2-equa-v">{nf(recTotal, 0)} Md€</p>
                <span className="d2-equa-b" style={{ "--p": `${(recTotal / depTotal) * 100}%` } as React.CSSProperties} />
              </div>
              <span className="d2-equa-s" aria-hidden="true">−</span>
              <div className="d2-equa-c d2-equa-dep">
                <p className="d2-equa-l">Dépenses</p>
                <p className="d2-equa-v">{nf(depTotal, 0)} Md€</p>
                <span className="d2-equa-b" style={{ "--p": "100%" } as React.CSSProperties} />
              </div>
              <span className="d2-equa-s" aria-hidden="true">=</span>
              <div className="d2-equa-c d2-equa-def">
                <p className="d2-equa-l">Déficit</p>
                <p className="d2-equa-v">−{nf(solde)} Md€</p>
                <span className="d2-equa-b" style={{ "--p": `${(solde / depTotal) * 100 * 4}%` } as React.CSSProperties} />
              </div>
            </Leve>
            <Etiquette perimetre="GENERAL_GOVERNMENT" base="NATIONAL_ACCOUNTS" periode="2025" />

            <h3 className="d2-h3">
              D&apos;où viennent les {nf(recTotal, 0)} Md€
            </h3>
            <Leve className="d2-pile">
              <div className="d2-pile-b" role="img" aria-label="Répartition des recettes publiques 2025">
                {segments.map((p, i) => (
                  <span
                    key={p.nom}
                    style={{ flexGrow: p.md, "--i": i } as React.CSSProperties}
                    title={`${p.nom} · ${md(p.md)}`}
                  />
                ))}
              </div>
              <ul className="d2-pile-l">
                {RECETTES_DETAIL.map((p, i) => (
                  <li key={p.nom} className={p.md < 0 ? "d2-pile-neg" : undefined}>
                    <i style={{ "--i": i } as React.CSSProperties} aria-hidden="true" />
                    <span>{p.nom}</span>
                    <b>
                      {p.md < 0 ? "−" : ""}
                      {nf(Math.abs(p.md))} Md€
                    </b>
                    <em>{p.md > 0 ? `${nf((p.md / sommeSeg) * 100)} %` : "en déduction"}</em>
                  </li>
                ))}
              </ul>
            </Leve>

            <h3 className="d2-h3">Où partent les {nf(depTotal, 0)} Md€</h3>
            <div className="d2-reuse dp d2-reuse-dp">
              <OuVaLArgent />
            </div>

            <div className="d2-pours">
              <Pour href="/economie">Comparer les PIB par pays</Pour>
              <Pour href="/france/economie">Toute l&apos;économie de la France</Pour>
            </div>
          </Chapitre>

          {/* ── 03 · Qui crée le déficit ──────────────────────────────────── */}
          <Chapitre
            id="deficit"
            n="03"
            titre={
              <>
                Le déficit : {nf(etatDeficit)} Md€ sur {nf(solde)}{" "}Md€ viennent de l&apos;État
              </>
            }
            chiffre={
              <>
                Soit environ <b>{nf((etatDeficit / solde) * 100, 0)} %</b> du besoin de financement
                public de 2025. Les collectivités et la Sécurité sociale pèsent bien moins.
              </>
            }
          >
            <div className="d2-reuse dp d2-reuse-dp">
              <Waterfall />
            </div>

            <div className="d2-table-c">
              <table className="d2-table">
                <caption>Chaque niveau d&apos;administration, 2025</caption>
                <thead>
                  <tr>
                    <th scope="col">Administration</th>
                    <th scope="col">Dépenses</th>
                    <th scope="col">Recettes</th>
                    <th scope="col">Solde</th>
                  </tr>
                </thead>
                <tbody>
                  {ACTEURS_2025.map((a) => (
                    <tr key={a.nom}>
                      <th scope="row">{a.nom}</th>
                      <td>{md(a.depenses)}</td>
                      <td>{md(a.recettes)}</td>
                      <td className="d2-neg">−{md(a.solde)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Chapitre>

          {/* ── 04 · L'accumulation ───────────────────────────────────────── */}
          <Chapitre
            id="accumulation"
            n="04"
            titre="Une année de déficit ne fait pas la dette : des décennies, si"
            chiffre={
              <>
                Le stock de <b>{nf(detteDerniere.valeur)} Md€</b>{" "}est la somme de besoins de
                financement répétés, pas le résultat d&apos;un seul exercice. Il peut aussi monter
                sans déficit record, et baisser en pourcentage du PIB quand l&apos;économie
                progresse plus vite.
              </>
            }
          >
            <div className="d2-reuse dp d2-reuse-dp">
              <Courbe />
            </div>
          </Chapitre>

          {/* ── 05 · Qui doit ─────────────────────────────────────────────── */}
          <Chapitre
            id="qui-doit"
            n="05"
            titre={
              <>
                L&apos;État porte {nf(DETTE_PAR_EMETTEUR[0].md, 0)} Md€ de la dette
              </>
            }
            chiffre={
              <>
                <b>{nf(DETTE_PAR_EMETTEUR[0].pct)} %</b> du total. La Sécurité sociale en doit{" "}
                {nf(DETTE_PAR_EMETTEUR[1].md, 0)} Md€, les collectivités{" "}
                {nf(DETTE_PAR_EMETTEUR[2].md, 0)} Md€.
              </>
            }
          >
            <div className="d2-reuse dp d2-reuse-dp">
              <CompositionDette />
              <BruteNette />
            </div>
          </Chapitre>

          {/* ── 06 · Qui détient ──────────────────────────────────────────── */}
          <Chapitre
            id="qui-detient"
            n="06"
            titre={
              <>
                {nf(PORTEURS_MESURE.valeur)}{" "}% de la dette de l&apos;État est détenue hors de France
              </>
            }
            chiffre={
              <>
                Au 31 mars 2026, sur la dette négociable de l&apos;État, en valeur de marché. Ce
                pourcentage ne s&apos;applique pas tel quel aux {nf(detteDerniere.valeur, 0)}{" "}Md€ de
                Maastricht ; sur les titres de long terme de l&apos;ensemble des administrations, la
                Banque de France compte {nf(nonResidents.valeur)} %.
              </>
            }
          >
            <div className="d2-reuse dp d2-reuse-dp">
              <Porteurs />
              <h3 className="d2-h3 d2-h3-r">Qui sont ces investisseurs</h3>
              <Detenteurs />
            </div>
            <div className="d2-pours">
              <Pour href="/articles/dette-publique-comparaison-internationale">
                Qui doit quoi, et à qui, dans le monde
              </Pour>
            </div>
          </Chapitre>

          {/* ── 07 · Ce que ça coûte ──────────────────────────────────────── */}
          <Chapitre
            id="cout"
            n="07"
            titre={<>{nf(INTERETS_APU_2025.valeur)}{" "}Md€ d&apos;intérêts en 2025</>}
            chiffre={
              <>
                Pour l&apos;ensemble des administrations publiques, en hausse de 11,2 %. Le coût
                varie selon ce qu&apos;on compte : ces quatre montants sont exacts en même temps.
              </>
            }
          >
            <div className="d2-couts">
              <Leve className="d2-cout d2-cout-g">
                <b>{nf(INTERETS_APU_2025.valeur)} Md€</b>
                <span>toutes administrations publiques</span>
                <em>comptabilité nationale</em>
              </Leve>
              <Leve className="d2-cout" delai={60}>
                <b>{nf(INTERETS_ETAT_2025.valeur)} Md€</b>
                <span>dont l&apos;État</span>
                <em>comptabilité nationale</em>
              </Leve>
              <Leve className="d2-cout" delai={120}>
                <b>{nf(CHARGE_DETTE_PROGRAMME.valeur)} Md€</b>
                <span>« Charge de la dette » du budget</span>
                <em>comptabilité budgétaire</em>
              </Leve>
              <Leve className="d2-cout" delai={180}>
                <b>{nf(ENGAGEMENTS_FINANCIERS.valeur)} Md€</b>
                <span>mission « Engagements financiers »</span>
                <em>comptabilité budgétaire</em>
              </Leve>
            </div>

            <ul className="d2-liste">
              <li>
                <b>{nf(ENCOURS_NEGOCIABLE.valeur)} Md€</b>
                <span>de dette négociable de l&apos;État en circulation</span>
              </li>
              <li>
                <b>{nf(TAUX_MOYEN_2026.valeur, 2)} %</b>
                <span>de taux moyen sur les OAT émises en 2026</span>
              </li>
            </ul>
            <p className="d2-notule">
              Source : INSEE, comptes nationaux 2025 ; Agence France Trésor, bulletin mensuel. Une hausse des taux se diffuse lentement : seuls les titres refinancés en profitent ou en pâtissent.
            </p>
          </Chapitre>

          {/* ── 08 · Remboursement ────────────────────────────────────────── */}
          <Chapitre
            id="remboursement"
            n="08"
            titre="On ne rembourse pas en une fois : on refinance"
            chiffre={
              <>
                Chaque titre a son échéance. À l&apos;arrivée, l&apos;État rembourse le capital et
                émet de nouveaux titres : les émissions brutes ne sont donc pas de la dette nouvelle.
              </>
            }
          >
            <ol className="d2-flux">
              <Leve tag="li" className="d2-flux-e">
                <span>1</span>
                <b>Un titre arrive à échéance</b>
                <em>Chaque obligation a sa date. Il n&apos;y a pas de jour unique où tout serait dû.</em>
              </Leve>
              <Leve tag="li" className="d2-flux-e" delai={80}>
                <span>2</span>
                <b>L&apos;État rembourse le capital</b>
                <em>Il paie avec ses ressources, et surtout avec de nouveaux emprunts.</em>
              </Leve>
              <Leve tag="li" className="d2-flux-e" delai={160}>
                <span>3</span>
                <b>Un nouveau titre est émis</b>
                <em>
                  Durée de vie moyenne de la dette négociable : <strong>{DUREE_VIE.texte}</strong>.
                  Le stock se renouvelle sans cesse.
                </em>
              </Leve>
            </ol>
            <p className="d2-notule">
              Source : Agence France Trésor, bulletin mensuel. La dette nette nouvelle n&apos;est pas
              l&apos;émission brute : une grande part des émissions remplace des titres échus.
            </p>
          </Chapitre>

          {/* ── 09 · Europe ───────────────────────────────────────────────── */}
          <Chapitre
            id="europe"
            n="09"
            titre={<>{nf(115.6)}{" "}% du PIB : un des cinq pays de l&apos;UE au-dessus de 100 %</>}
            chiffre={
              <>
                Fin 2025, avec la Grèce, l&apos;Italie, la Belgique et l&apos;Espagne. Même
                période pour tous, pour une comparaison juste.
              </>
            }
          >
            <div className="d2-reuse dp d2-reuse-dp">
              <Comparaison />
            </div>
            <div className="d2-pours">
              <Pour href="/economie">Dette par pays sur le globe</Pour>
              <Pour href="/demographie">Démographie du monde</Pour>
            </div>
          </Chapitre>

          {/* ── 10 · Questions ────────────────────────────────────────────── */}
          <Chapitre id="questions" n="10" titre="Questions fréquentes">
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
              Sources : INSEE (dette trimestrielle de Maastricht, comptes nationaux), Banque de
              France (émission et détention de titres français), Agence France Trésor (dette
              négociable), Eurostat (comparaison européenne).
            </p>
          </Chapitre>

          {/* ── La suite ──────────────────────────────────────────────────── */}
          <section className="d2-suite" aria-labelledby="d2-suite-t">
            <h2 id="d2-suite-t">Continuer la lecture</h2>
            <div className="d2-suite-g">
              {suggestions.slice(0, 3).map((s, i) => (
                <a key={s.href} href={s.href} className={`d2-sug${i === 0 ? " d2-sug-vif" : ""}`}>
                  <span className="d2-sug-r">
                    {s.rubrique}
                    {s.duree ? ` · ${s.duree}` : ""}
                  </span>
                  <span className="d2-sug-t">{s.titre}</span>
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
              ))}
              <a href="/forum" className="d2-sug d2-sug-forum">
                <MessageCircle size={20} aria-hidden="true" />
                <span className="d2-sug-t">Débattre de la dette sur le forum</span>
                <ArrowRight size={18} aria-hidden="true" />
              </a>
            </div>
          </section>
        </main>

        {/* ── Colonne de droite : suggestions et repères ─────────────────── */}
        <aside className="d2-rail" aria-label="À lire aussi">
          <div className="d2-rail-c">
            <p className="d2-rail-t">À lire aussi</p>
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
          </div>

          <div className="d2-rail-c d2-rail-explore">
            <p className="d2-rail-t">Explorer le site</p>
            <a href="/economie">
              <Landmark size={16} aria-hidden="true" /> Globe économie
            </a>
            <a href="/demographie">
              <Globe size={16} aria-hidden="true" /> Globe démographie
            </a>
            <a href="/forum">
              <MessageCircle size={16} aria-hidden="true" /> Forum
            </a>
            <a href="/france/economie/dette-publique">
              <ArrowUpRight size={16} aria-hidden="true" /> Version d&apos;origine de l&apos;article
            </a>
          </div>

          <div className="d2-rail-c d2-rail-src">
            <p className="d2-rail-t">Sources</p>
            <p>INSEE · Banque de France · Agence France Trésor · Eurostat</p>
            <a href="/methodologie-donnees">Notre méthode →</a>
          </div>
        </aside>
      </div>
    </div>
  );
}
