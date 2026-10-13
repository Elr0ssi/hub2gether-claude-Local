"use client";

import { Percent, Scale } from "lucide-react";
import {
  ArticleLong,
  BarresParDate,
  Chapitre,
  ChiffresCles,
  Compteur,
  Figure,
  ListeQuestions,
  Repartition,
  montant,
  nf,
  type ChapitreDef,
  type Suggestion,
} from "@/articles/dette/cadre";
import { useMonnaieArticle } from "@/components/concept/Monnaie";
import { poserMonnaieArticle, valeurConvertie } from "@/lib/montant";
import { DETTE, FAQ, PAR_EMETTEUR, RATIO, RATIO_PAR_DATE } from "./donnees";

/* ═══════════════════════════════════════════════════════════════════════════
   MODÈLE · L'ARTICLE LONG D'UN PAYS

   Un fichier, trois parties :
     1. CHAPITRES  : le sommaire. Un chapitre = une entrée ; l'ordre est celui de la page.
     2. Le composant : le squelette <ArticleLong>, puis un <Chapitre> par entrée du sommaire.
     3. Rien d'autre : les chiffres sont dans `donnees.ts`, la fiche (référencement) dans `fiche.tsx`.

   L'article se compose À LA MAIN. Un pays n'a pas les mêmes informations qu'un autre : on garde
   les chapitres dont on a les données, on en invente d'autres si le pays le demande
   (une dette indexée sur l'inflation, un régime fédéral, des garanties d'État…). Les briques du cadre
   (Chapitre, Figure, Repartition, BarresParDate, Etapes, ChiffresCles…) se combinent librement ;
   le guide `src/articles/LISEZ-MOI.md` en donne la liste et le mode d'emploi.

   RÈGLES
     - Tout montant passe par `montant(...)` : il se convertit alors dans la monnaie du menu.
     - Chaque <Figure> porte une `source` avec une adresse vérifiable.
     - Chaque chapitre a un `id` unique, présent dans CHAPITRES.
   ═══════════════════════════════════════════════════════════════════════════ */

const CHAPITRES: ChapitreDef[] = [
  { id: "essentiel", court: "L'essentiel" },
  { id: "evolution", court: "Évolution" },
  { id: "qui-doit", court: "Qui doit" },
  { id: "questions", court: "Questions" },
];

export function ArticleModele({ suggestions }: { suggestions: Suggestion[] }) {
  /* Ces deux lignes branchent l'article sur le sélecteur de monnaie du menu : à garder telles quelles. */
  const [devise] = useMonnaieArticle();
  poserMonnaieArticle(devise);
  const hero = valeurConvertie(DETTE.valeur, "eur", 2025, devise);

  return (
    <ArticleLong
      fil={[
        { label: "Accueil", href: "/" },
        { label: "Pays", href: "/pays" },
        { label: "Pays modèle", href: "/pays/pays-modele" },
        { label: "Dette publique" },
      ]}
      surtitre="Dette publique du Pays modèle"
      chiffre={
        <>
          <Compteur valeur={hero.v} decimales={0} duree={1500} />
          <small>{hero.suffixe.replace(/Md[\s ]([€$])/, "Md$1")}</small>
        </>
      }
      chapo={
        <>
          <b>{nf(RATIO.valeur, 0)} % du PIB</b> en {RATIO.periode}.
        </>
      }
      chapitres={CHAPITRES}
      suggestions={suggestions}
      sources={DETTE.source}
    >
      {/* ── 01 · L'essentiel : jusqu'à six chiffres clés ──────────────────── */}
      <Chapitre id="essentiel" titre="Dette du Pays modèle : les chiffres clés" reponse="La réponse, en une phrase.">
        <ChiffresCles
          cartes={[
            { icone: Percent, valeur: `${nf(RATIO.valeur, 0)} %`, libelle: "de dette rapportée au PIB", texte: "Une phrase qui aide à lire ce chiffre." },
            { icone: Scale, valeur: montant(DETTE.valeur, 0), libelle: "de dette brute", texte: `Fin ${DETTE.periode}.` },
          ]}
        />
      </Chapitre>

      {/* ── 02 · Évolution : des barres par date ──────────────────────────── */}
      <Chapitre id="evolution" titre="Évolution de la dette publique du Pays modèle">
        <Figure
          id="evolution-dette-pib"
          titre="Dette publique rapportée au PIB depuis 2000"
          legende="Ce qu'on y voit, avec les mots qu'on cherche. Chaque barre se lit en cliquant dessus."
          source={{ source: DETTE.source, url: DETTE.url }}
          voir={[{ href: "#qui-doit", label: "Qui doit cette dette" }]}
        >
          <BarresParDate
            points={RATIO_PAR_DATE.map((p) => ({ cle: String(p.annee), etiquette: String(p.annee), valeur: p.valeur, repere: p.repere }))}
          />
        </Figure>
      </Chapitre>

      {/* ── 03 · Qui doit : une répartition ───────────────────────────────── */}
      <Chapitre id="qui-doit" titre="Qui doit la dette publique du Pays modèle ?">
        <Figure
          id="dette-par-emetteur"
          titre="Dette publique par émetteur"
          legende="L'administration centrale, les collectivités et la sécurité sociale."
          source={{ source: DETTE.source, url: DETTE.url }}
        >
          <Repartition nom="Dette publique par émetteur" lignes={PAR_EMETTEUR} />
        </Figure>
      </Chapitre>

      {/* ── 04 · Questions ────────────────────────────────────────────────── */}
      <Chapitre id="questions" titre="Questions fréquentes sur la dette du Pays modèle">
        <ListeQuestions questions={FAQ} />
      </Chapitre>
    </ArticleLong>
  );
}
