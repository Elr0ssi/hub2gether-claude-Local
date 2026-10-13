"use client";

import { useState } from "react";
import { Banknote, ChevronDown, Clock, Globe, Percent, Scale, TrendingUp } from "lucide-react";
import {
  ArticleLong,
  BarresParDate,
  Chapitre,
  ChapitrePresse,
  ChiffresCles,
  ChiffresGrille,
  Compteur,
  Etapes,
  Figure,
  ListeQuestions,
  montant,
  montantAbs,
  nf,
  type ChapitreDef,
  type PointDate,
  type Suggestion,
} from "@/articles/dette/cadre";
import { poserMonnaieArticle, valeurConvertie } from "@/lib/montant";
import { useMonnaieArticle } from "@/components/concept/Monnaie";
import type { Sujet } from "@/data/concept/sujets";
import { PRESSE_DETTE } from "@/data/concept/presse";
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
} from "./donnees/detteFrancaise";
import {
  ACTEURS_2025,
  CHARGE_DETTE_PROGRAMME,
  DEFICIT_2025,
  DEPENSES_2025,
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
  TAUX_MOYEN_2026,
} from "./donnees/financesPubliques";
import { Deficit } from "./Deficit";
import { BruteNette, CompositionDette } from "./figures/Composition";
import { Detenteurs, Porteurs } from "./figures/Detenteurs";
import { Comparaison } from "./figures/Europe";
import "./figures/figures.css";

/* ═══════════════════════════════════════════════════════════════════════════
   DETTE PUBLIQUE DE LA FRANCE — L'ARTICLE LONG

   Le montant d'abord, une idée par chapitre, aucun retour en arrière.
   Chaque graphique est une <Figure> : une légende qui dit ce qu'on y voit avec
   les mots qu'on cherche, la source exacte, une adresse qu'on peut copier et
   des renvois vers les chapitres voisins.

   COMMENT LIRE CE FICHIER
     1. CHAPITRES    : la liste du sommaire. L'ordre ici est l'ordre de la page.
     2. GrapheRatio  : un graphique propre à la France (le ratio dette/PIB, date par date).
     3. ArticleFrance: le squelette <ArticleLong> et, dedans, un <Chapitre> par entrée de CHAPITRES.

   Les chiffres viennent de `./donnees/` ; les briques (Chapitre, Figure…) de
   `@/articles/dette/cadre`. Pour écrire l'article d'un autre pays, voir
   `src/articles/LISEZ-MOI.md` et le modèle `../_modele/`.
   ═══════════════════════════════════════════════════════════════════════════ */

/** La liste du sommaire : un chapitre par entrée, dans l'ordre de la page. */
const CHAPITRES: ChapitreDef[] = [
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
];

/* ── Le ratio dette/PIB, date après date ─────────────────────────────────── */

/* La base du dépôt ne porte que sept dates repères pour le ratio : on les
   montre telles quelles, sans tracer de courbe entre elles qui ferait croire
   à une série annuelle. Pour fin 2025 et le premier trimestre 2026, c'est la
   valeur INSEE qui remplace le relevé manuel de 2025 (113 %), qui la
   contredisait. */
function GrapheRatio() {
  const base: PointDate[] = serieRatio()
    .filter((p) => p.pctPib !== null && p.annee <= 2023)
    .map((p) => ({
      cle: String(p.annee),
      etiquette: String(p.annee),
      valeur: p.pctPib as number,
      repere: REPERES.find((r) => r.annee === p.annee)?.nom,
    }));
  const insee: PointDate[] = DETTE_TRIMESTRES.map((t) => ({
    cle: t.periode,
    etiquette: t.periode.replace("-T", " T"),
    valeur: t.pctPib,
    montantMd: t.md,
  }));
  return <BarresParDate points={[...base, ...insee]} unite="% du PIB" enteteValeur="Dette / PIB" />;
}

/* ═══════════════════════════════════════════════════════════════════════════
   L'ARTICLE
   ═══════════════════════════════════════════════════════════════════════════ */

export function ArticleFrance({ suggestions, sujet }: { suggestions: Suggestion[]; sujet?: Sujet }) {
  /* Les montants suivent la monnaie du menu ; l'euro, monnaie d'origine, tant que rien n'est choisi. */
  const [devise] = useMonnaieArticle();
  poserMonnaieArticle(devise);
  const hero = valeurConvertie(detteDerniere.valeur, "eur", 2025, devise);
  const solde = Math.abs(DEFICIT_2025.valeur);
  const etat = Math.abs(ACTEURS_2025[0].lignes?.[0].md ?? 0);
  const [autres, setAutres] = useState(false);

  return (
    <ArticleLong
      fil={[
        { label: "Accueil", href: "/" },
        { label: "Pays", href: "/pays" },
        { label: "France", href: "/pays/france" },
        { label: "Dette publique" },
      ]}
      surtitre="Dette publique de la France"
      chiffre={
        <>
          <Compteur valeur={hero.v} decimales={1} duree={1500} />
          <small>{hero.suffixe.replace(/Md[\s\u00a0]([€$])/, "Md$1")}</small>
        </>
      }
      chapo={
        <>
          <b>{nf(ratioDernier.valeur)} % du PIB</b> à la fin du premier trimestre 2026.{" "}
          <a href={detteDerniere.url} target="_blank" rel="noopener noreferrer">
            INSEE ↗
          </a>
        </>
      }
      chapitres={CHAPITRES}
      suggestions={suggestions}
      sujet={sujet}
      sources="INSEE · Banque de France · Agence France Trésor · Eurostat"
    >
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
        <ChiffresCles
          cartes={[
            {
              icone: Percent,
              valeur: `${nf(ratioDernier.valeur)} %`,
              libelle: "de dette rapportée au PIB",
              texte: `Environ ${nf(ratioDernier.valeur / 100, 2)} année de richesse produite. Ce n'est pas une facture à régler d'un coup.`,
            },
            {
              icone: TrendingUp,
              valeur: `+${montant(variationTrimestre.valeur)}`,
              libelle: "en un trimestre",
              texte: "Entre fin 2025 et fin mars 2026.",
            },
            {
              icone: Scale,
              valeur: `−${montant(solde)}`,
              libelle: "de déficit public en 2025",
              texte: `${nf(deficit2025.valeur)} % du PIB, dont ${montant(etat)} pour l'État.`,
              negatif: true,
            },
            {
              icone: Banknote,
              valeur: montant(INTERETS_APU_2025.valeur),
              libelle: "d'intérêts en 2025",
              texte: "Toutes administrations publiques.",
            },
            {
              icone: Globe,
              valeur: `${nf(PORTEURS_MESURE.valeur)} %`,
              libelle: "détenus hors de France",
              texte: "Dette négociable de l'État, T1 2026.",
            },
            {
              icone: Clock,
              valeur: `${nf(DUREE_VIE.valeur)} ans`,
              libelle: "de durée de vie moyenne",
              texte: `Soit ${DUREE_VIE.texte}.`,
            },
          ]}
        />
        <p className="dos-notule">
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
            {`En 2025, les administrations publiques ont dépensé ${montant(DEPENSES_2025.valeur, 0)} pour ${montant(RECETTES_2025.valeur, 0)} de recettes : `}
            <b>{`${montant(solde)} de déficit, soit ${nf(deficit2025.valeur)} % du PIB`}</b>
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
            <b>{`${montant(DETTE_PAR_EMETTEUR[0].md, 0)}`}</b>
            {` (${nf(DETTE_PAR_EMETTEUR[0].pct)} %), la Sécurité sociale ${montant(DETTE_PAR_EMETTEUR[1].md, 0)}, les collectivités ${montant(DETTE_PAR_EMETTEUR[2].md, 0)} et les organismes centraux ${montant(DETTE_PAR_EMETTEUR[3].md, 0)}.`}
          </>
        }
      >
        <p className="dos-total">
          <span>Total</span>
          {`${montantAbs(DETTE_PAR_EMETTEUR.reduce((s, e) => s + e.md, 0))} ≈ ${montantAbs(DETTE_BRUTE.valeur)} : la dette brute de Maastricht, celle du chiffre en tête de page. La dette nette est plus basse (${montantAbs(DETTE_NETTE.valeur)}) car on en retire la trésorerie et certains actifs financiers.`}
        </p>
        <Figure
          id="dette-par-emetteur"
          titre="Dette publique par émetteur et par instrument"
          legende="Qui doit l'argent : l'État, la Sécurité sociale, les collectivités locales et les organismes centraux ; et sous quelle forme : titres négociables, crédits, dépôts."
          source={DETTE_BRUTE}
          voir={[{ href: "#qui-detient", label: "Qui détient ces titres" }]}
          reprise
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
            {` de la dette négociable de l'État est détenue par des non-résidents (T1 2026, valeur de marché). Ce taux ne s'applique pas tel quel aux ${montant(detteDerniere.valeur, 0)} de Maastricht ; sur les titres de long terme de l'ensemble des administrations, la Banque de France compte ${nf(nonResidents.valeur)} %.`}
          </>
        }
      >
        <Figure
          id="detenteurs-dette"
          titre="Détenteurs de la dette de l'État"
          legende="Répartition de la dette négociable de l'État entre non-résidents, banques, assureurs, fonds et autres détenteurs français, et son évolution depuis 2022."
          source={PORTEURS_MESURE}
          voir={[{ href: "#interets", label: "Ce que ça coûte" }]}
          reprise
        >
          <Porteurs />
          <h3 className="dos-h3">Qui sont ces investisseurs</h3>
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
            <b>{`${montant(INTERETS_APU_2025.valeur)} d'intérêts en 2025`}</b>
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
          <ChiffresGrille
            items={[
              { valeur: montant(INTERETS_APU_2025.valeur), libelle: "d'intérêts par an, toutes administrations publiques" },
              { valeur: montant(INTERETS_ETAT_2025.valeur), libelle: "dont l'État" },
              { valeur: `${nf(TAUX_MOYEN_2026.valeur, 2)} %`, libelle: "taux moyen des OAT émises en 2026" },
              { valeur: montant(ENCOURS_NEGOCIABLE.valeur), libelle: "de dette négociable de l'État en circulation" },
            ]}
          />

          <button type="button" className="dos-plus" aria-expanded={autres} onClick={() => setAutres(!autres)}>
            D&apos;autres montants circulent : pourquoi ?
            <ChevronDown size={16} aria-hidden="true" className={autres ? "dos-rail-ouv" : undefined} />
          </button>
          <div hidden={!autres} className="dos-plus-c">
            <p>
              Le budget de l&apos;État est présenté de deux façons. En comptabilité budgétaire, la
              ligne « Charge de la dette et trésorerie de l&apos;État » vaut{" "}
              <b>{montant(CHARGE_DETTE_PROGRAMME.valeur)}</b>, et la mission « Engagements
              financiers de l&apos;État », plus large, <b>{montant(ENGAGEMENTS_FINANCIERS.valeur)}</b>. En
              comptabilité nationale, les intérêts de l&apos;État sont de{" "}
              <b>{montant(INTERETS_ETAT_2025.valeur)}</b>. Ces montants sont tous exacts : ils ne
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
        <p className="dos-notule">
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
              chiffre: `${montant(solde)} de déficit en 2025`,
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
        <p className="dos-notule">
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
          reprise
        >
          <Comparaison />
        </Figure>
      </Chapitre>

      {/* ── 10 · Presse ───────────────────────────────────────────────── */}
      <ChapitrePresse
        titre="La dette française dans la presse"
        intro="Les articles des grands médias qui traitent du sujet, pour aller plus loin et vérifier les sources."
        citations={PRESSE_DETTE}
      />

      {/* ── 11 · Questions ────────────────────────────────────────────── */}
      <Chapitre id="questions" titre="Questions fréquentes sur la dette publique">
        <ListeQuestions questions={FAQ} />
        <p className="dos-notule">
          Sources : INSEE, Banque de France, Agence France Trésor, Eurostat.{" "}
          <a href="/methodologie-donnees">Notre méthode</a>
        </p>
      </Chapitre>

    </ArticleLong>
  );
}
