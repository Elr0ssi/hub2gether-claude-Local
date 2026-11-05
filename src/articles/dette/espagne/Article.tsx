"use client";

import { Banknote, Clock, Globe, Percent, Scale, TrendingUp } from "lucide-react";
import {
  ArticleLong, BarresParDate, Camembert, Chapitre, ChapitrePresse, ChiffresCles, ChiffresGrille,
  Compteur, Etapes, Figure, ListeQuestions, Repartition, montant, enLettres, nf,
  type ChapitreDef, type Suggestion,
} from "@/articles/dette/cadre";
import { poserMonnaieArticle, valeurConvertie } from "@/lib/montant";
import { useMonnaieArticle } from "@/components/concept/Monnaie";
import { Deficit } from "./Deficit";
import { Comparaison } from "./figures/Europe";
import { Regions } from "./figures/Regions";
import { Administrations } from "./figures/Administrations";
import {
  BCE, CATEGORIES_DETENTEURS, CREANCIERS_EXTERIEURS, CREANCIERS_RESIDENTS, DEFICIT_2025, DEFICIT_PCT_PIB,
  DETTE, DETTE_ANNUELLE, DETTE_JUILLET, DETTE_T1, EN_EUROS, HAUSSE_TRIMESTRE, INTERETS_2025, INTERETS_PCT_PIB,
  INTERETS_PCT_RECETTES, NOTATIONS, PAR_INSTRUMENT, PART_EXTERIEURS, PRESSE, PROGRAMME_2026, RATIO, RATIO_JUILLET,
  RECETTES_2025, DEPENSES_2025, REGLES, REPERES, SOURCES, TITRES_PAR_ECHEANCE, creerFAQ,
} from "./donnees";
import "@/articles/dette/france/figures/figures.css";

/** Même sommaire et même ordre que la France et l'Allemagne ; uniquement les chapitres dont les données sont vérifiées. */
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
  { id: "specificites", court: "Spécificités" },
  { id: "presse", court: "Dans la presse" },
  { id: "questions", court: "Questions" },
];

function Source({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noopener noreferrer">{children} ↗</a>;
}

export function ArticleEspagne({ suggestions }: { suggestions: Suggestion[] }) {
  const [devise] = useMonnaieArticle();
  poserMonnaieArticle(devise);
  const hero = valeurConvertie(DETTE.valeur, "eur", 2026, devise);

  const points = [
    ...DETTE_ANNUELLE.map((p) => ({ cle: String(p.annee), etiquette: String(p.annee), valeur: p.md, ratio: p.ratio ?? null, repere: REPERES[p.annee] })),
    { cle: "2026-T2", etiquette: "T2 2026", valeur: DETTE.valeur, ratio: RATIO.valeur, repere: "fin du trimestre" },
  ];

  return (
    <ArticleLong
      fil={[
        { label: "Accueil", href: "/" },
        { label: "Pays", href: "/pays" },
        { label: "Espagne", href: "/pays/espagne" },
        { label: "Dette publique" },
      ]}
      surtitre="Dette publique de l'Espagne"
      chiffre={<><Compteur valeur={hero.v} decimales={3} duree={1500} /><small>{hero.suffixe.replace(/Md[\s ]([€$])/, "Md$1")}</small></>}
      chapo={<>
        <b>{nf(RATIO.valeur)} % du PIB</b> à la fin du deuxième trimestre 2026 (dette Maastricht de toutes les administrations).{" "}
        <Source href={SOURCES.BDE_T2}>Banco de España</Source>
      </>}
      chapitres={CHAPITRES}
      suggestions={suggestions}
      sources="Banco de España · INE · Agencia Tributaria · Tesoro Público · Eurostat · BCE"
    >
      <Chapitre id="essentiel" titre="Dette publique de l'Espagne : les chiffres clés"
        reponse={<>La dette est un <b>stock</b>, le déficit est un <b>flux</b> qui l'alimente, les intérêts sont ce qu'elle coûte chaque année.</>}>
        <ChiffresCles cartes={[
          { icone: Percent, valeur: `${nf(RATIO.valeur)} %`, libelle: "de dette rapportée au PIB", texte: "Fin du deuxième trimestre 2026, toutes administrations." },
          { icone: TrendingUp, valeur: `+${montant(HAUSSE_TRIMESTRE.valeur, 1, 2026)}`, libelle: "en un trimestre", texte: `Entre la fin du premier trimestre (${montant(DETTE_T1, 1, 2026)}) et la fin juin 2026.` },
          { icone: Scale, valeur: `−${montant(DEFICIT_2025.valeur, 1)}`, libelle: "de déficit public en 2025", texte: `${nf(DEFICIT_PCT_PIB)} % du PIB, toutes administrations.`, negatif: true },
          { icone: Banknote, valeur: montant(INTERETS_2025.valeur, 1), libelle: "d'intérêts en 2025", texte: `${nf(INTERETS_PCT_PIB)} % du PIB, toutes administrations.` },
          { icone: Globe, valeur: `${nf(PART_EXTERIEURS)} %`, libelle: "détenus hors d'Espagne", texte: "Dette Maastricht, selon la résidence du créancier, fin juin 2026." },
          { icone: Clock, valeur: `${nf(RATIO_JUILLET.valeur)} %`, libelle: "du PIB en juillet 2026", texte: `Avance mensuelle provisoire : ${montant(DETTE_JUILLET.valeur, 0, 2026)}.` },
        ]} />
        <p className="dos-notule">Sources : <Source href={SOURCES.BDE_T2}>Banco de España, dette du 2e trimestre 2026</Source> ·{" "}
          <Source href={SOURCES.BDE_JUILLET}>Banco de España, avance de juillet</Source> ·{" "}
          <Source href={SOURCES.INE}>INE, comptes des administrations publiques</Source>.
        </p>
      </Chapitre>

      <Chapitre id="deficit" titre="Déficit public de l'Espagne"
        reponse={<>
          En 2025, les administrations espagnoles ont enregistré {montant(RECETTES_2025.valeur, 1)} de recettes et {montant(DEPENSES_2025.valeur, 1)} de dépenses :{" "}
          <b>{montant(DEFICIT_2025.valeur, 1)} de déficit, soit {nf(DEFICIT_PCT_PIB)} % du PIB</b>.
        </>}>
        <Deficit />
      </Chapitre>

      <Chapitre id="evolution" titre="Évolution de la dette publique espagnole"
        reponse={<>
          La dette est passée de <b>{montant(DETTE_ANNUELLE[0].md, 0, 2000)} fin 2000</b> à <b>{montant(DETTE.valeur, 0, 2026)} fin juin 2026</b>, avec des paliers à la crise financière de 2008, à la crise bancaire de 2012 et au Covid-19.
        </>}>
        <Figure id="evolution-dette-pib" titre="Dette publique espagnole, de 2000 à fin juin 2026"
          legende="Le stock de dette Maastricht de toutes les administrations à la fin de chaque année de 2000 à 2025, puis à la fin du deuxième trimestre 2026. Chaque barre se lit en cliquant dessus ; le ratio dette/PIB est donné pour les dates où il est publié dans une même édition."
          source={{ source: "Banco de España, série annuelle et trimestrielle ; Eurostat pour les ratios 2022-2025", url: SOURCES.BDE_ANNUEL }}
          voir={[{ href: "#qui-doit", label: "Qui doit cette dette" }]}>
          <BarresParDate mode="montant" points={points} unite="Md€" enteteValeur="Dette" />
          <p className="dos-notule">Le dernier point est le 2e trimestre 2026, un chiffre infra-annuel : ce n'est pas un bilan annuel.</p>
        </Figure>
      </Chapitre>

      <Chapitre id="qui-doit" titre="Qui doit la dette publique espagnole ?"
        reponse={<>
          L'<b>État</b> porte {montant(1602, 0, 2026)}, les <b>communautés autonomes</b> {montant(355, 0, 2026)}, la <b>sécurité sociale</b> {montant(136, 0, 2026)} et les collectivités locales {montant(21, 0, 2026)} : après élimination des dettes que les administrations se doivent entre elles, il reste <b>{montant(DETTE.valeur, 1, 2026)}</b>.
        </>}>
        <Figure id="dette-par-administration" titre="La dette espagnole par administration, avant consolidation"
          legende="Les montants de chaque administration avant consolidation, et les dettes croisées (en rose) qui disparaissent pour obtenir la dette Maastricht consolidée."
          source={{ source: "Banco de España, dette des administrations publiques, 2e trimestre 2026", url: SOURCES.BDE_T2 }}
          voir={[{ href: "#qui-detient", label: "Qui détient cette dette" }]}>
          <Administrations />
          <p className="dos-notule">Montants du Banco de España arrondis au milliard : la somme des lignes (1 762) et le total publié ({montant(DETTE.valeur, 3, 2026)}) diffèrent de moins d'un milliard.</p>
        </Figure>
        <Figure id="dette-par-instrument" titre="Sous quelle forme l'Espagne est-elle endettée ?"
          legende="La dette Maastricht par instrument à la fin du deuxième trimestre 2026 : des titres de dette, des prêts, du numéraire et des dépôts. Cliquez sur « Titres de dette » pour voir ce qui arrive à échéance dans l'année."
          source={{ source: "INE / Banco de España, données de dette selon les normes du FMI", url: SOURCES.INE }}>
          <Repartition
            nom="Dette publique espagnole par instrument, fin du 2e trimestre 2026" idBase="instruments" annee={2026}
            lignes={[
              { nom: "Titres de dette", md: PAR_INSTRUMENT.titres },
              { nom: "Prêts", md: PAR_INSTRUMENT.prets },
              { nom: "Numéraire et dépôts", md: PAR_INSTRUMENT.depots },
            ]}
            details={{
              "Titres de dette": {
                texte: "Les Letras, Bonos et Obligaciones du Tesoro et les titres des autres administrations. L'échéance est celle qui reste à courir, pas la durée initiale du titre.",
                vues: [{ parts: [{ nom: "Échéance d'un an ou moins", md: TITRES_PAR_ECHEANCE.unAnOuMoins }, { nom: "Échéance de plus d'un an", md: TITRES_PAR_ECHEANCE.plusUnAn }], total: PAR_INSTRUMENT.titres }],
                source: { nom: "INE / Banco de España", url: SOURCES.INE },
              },
              Prêts: { texte: "Les crédits contractés par les administrations, en particulier les communautés autonomes et la sécurité sociale.", source: { nom: "INE / Banco de España", url: SOURCES.INE } },
              "Numéraire et dépôts": { texte: "Les dépôts et le numéraire comptés comme dette publique.", source: { nom: "INE / Banco de España", url: SOURCES.INE } },
            }}
          />
          <ChiffresGrille items={[
            { valeur: `${nf(EN_EUROS.partEuros, 2)} %`, libelle: "de la dette est libellée en euros" },
            { valeur: montant(EN_EUROS.devises, 3, 2026), libelle: "seulement en devises étrangères" },
          ]} />
        </Figure>
      </Chapitre>

      <Chapitre id="qui-detient" titre="Qui détient la dette espagnole ?"
        reponse={<>
          Fin juin 2026, <b>{nf(PART_EXTERIEURS)} %</b> de la dette Maastricht est détenue par des créanciers situés hors d'Espagne : {montant(CREANCIERS_EXTERIEURS.valeur, 1, 2026)}, contre {montant(CREANCIERS_RESIDENTS.valeur, 1, 2026)} pour les résidents.
        </>}>
        <Figure id="detenteurs-dette" titre="Créanciers de la dette publique espagnole, résidents et non-résidents"
          legende="Répartition de la dette Maastricht de toutes les administrations selon la résidence du créancier, à la fin du deuxième trimestre 2026. « Non-résident » désigne un créancier domicilié hors d'Espagne, quelle que soit sa nationalité."
          source={{ source: "INE / Banco de España, dette selon la résidence du créancier", url: SOURCES.INE }}
          voir={[{ href: "#interets", label: "Ce que ça coûte" }]}>
          <Camembert annee={2026} vue={{
            parts: [
              { nom: "Créanciers extérieurs", md: CREANCIERS_EXTERIEURS.valeur, note: "non-résidents" },
              { nom: "Créanciers résidents en Espagne", md: CREANCIERS_RESIDENTS.valeur },
            ],
            total: DETTE.valeur,
          }} />
        </Figure>
        <Figure id="bce-dette" titre="Les titres espagnols achetés par la BCE"
          legende="Achats nets cumulés de titres publics espagnols dans les programmes de politique monétaire de la BCE (PSPP et PEPP) à la fin de septembre 2026. Ces titres font déjà partie de la dette : ils ne s'y ajoutent pas, et ce n'est pas leur valeur nominale Maastricht."
          source={{ source: "Banque centrale européenne, programmes APP/PSPP et PEPP", url: SOURCES.BCE_APP }}>
          <ChiffresGrille items={[
            { valeur: montant(BCE.pspp.valeur, 1, 2026), libelle: "dans le programme PSPP" },
            { valeur: montant(BCE.pepp.valeur, 1, 2026), libelle: "dans le programme PEPP" },
            { valeur: montant(BCE.pspp.valeur + BCE.pepp.valeur, 1, 2026), libelle: "au total, achats nets cumulés" },
            { valeur: `${nf(BCE.dureePspp, 2)} ans`, libelle: "de durée résiduelle du portefeuille PSPP" },
          ]} />
          <p className="dos-notule">Les réinvestissements des deux programmes ont pris fin : leurs portefeuilles diminuent à mesure que les titres arrivent à échéance.</p>
        </Figure>
        <Figure id="categories-detenteurs" titre="Qui sont les détenteurs de dette publique"
          legende="Les grandes catégories d'investisseurs en titres souverains et ce qui les motive. Le dossier officiel ne les chiffre pas toutes pour la dette espagnole : seules la résidence du créancier et la part de la BCE sont montrées en chiffres."
          source={{ source: "Tesoro Público, statistiques mensuelles", url: SOURCES.TESORO_STATS }}>
          <Etapes nom="categories-de-detenteurs" etapes={CATEGORIES_DETENTEURS.map((c) => ({ titre: c.titre, texte: c.texte }))} />
        </Figure>
      </Chapitre>

      <Chapitre id="interets" titre="Combien l'Espagne paie-t-elle d'intérêts ?"
        reponse={<>
          Les administrations espagnoles ont payé <b>{montant(INTERETS_2025.valeur, 1)} d'intérêts en 2025</b>, soit {nf(INTERETS_PCT_PIB)} % du PIB. C'est le coût annuel de la dette, à ne pas confondre avec son montant ni avec le remboursement du capital.
        </>}>
        <Figure id="interets-dette" titre="Charge des intérêts de la dette publique espagnole"
          legende="La dépense d'intérêts de toutes les administrations publiques en 2025, en comptabilité nationale (SEC 2010), rapportée au PIB révisé et aux recettes publiques."
          source={INTERETS_2025} voir={[{ href: "#refinancement", label: "Comment la dette se refinance" }]}>
          <ChiffresGrille items={[
            { valeur: montant(INTERETS_2025.valeur, 1), libelle: "d'intérêts en 2025, toutes administrations" },
            { valeur: `${nf(INTERETS_PCT_PIB)} %`, libelle: "du PIB" },
            { valeur: `${nf(INTERETS_PCT_RECETTES)} %`, libelle: "des recettes publiques" },
          ]} />
        </Figure>
        <Figure id="notations" titre="Les notations de la dette souveraine espagnole"
          legende="La note à long terme et la perspective de chaque agence, avec la date de l'action affichée par le Tesoro. Cette date n'est pas forcément celle de la dernière confirmation de l'agence."
          source={{ source: "Tesoro Público, notations de crédit", url: SOURCES.TESORO_NOTES }}>
          <ChiffresGrille items={NOTATIONS.map((n) => ({ valeur: n.note, libelle: `${n.agence} · perspective ${n.perspective} · ${n.date}` }))} />
        </Figure>
      </Chapitre>

      <Chapitre id="budget" titre="Qui vote le budget de l'Espagne ?"
        reponse="Les Cortes Generales. Le gouvernement prépare et dépose le projet de budget, le Congreso et le Sénat l'examinent et le votent, puis l'exécutif exécute et la Cour des comptes contrôle."
      >
        <Etapes nom="budget-es" etapes={[
          { titre: "Le gouvernement prépare", texte: "Le ministère des Finances prépare les objectifs et le projet de budget général de l'État (PGE), à partir du printemps." },
          { titre: "Le Conseil des ministres dépose", texte: "Il approuve le projet puis le transmet aux Cortes, normalement avant octobre.", chiffre: "article 134 de la Constitution" },
          { titre: "Le Congreso et le Sénat votent", texte: "Les députés et les sénateurs débattent, amendent et approuvent le budget entre octobre et décembre ; le Congrès a le dernier mot selon les règles constitutionnelles." },
          { titre: "L'État exécute", texte: "Le gouvernement et les administrations perçoivent les recettes et paient les dépenses dans les crédits ouverts, de janvier à décembre." },
          { titre: "L'IGAE et la Cour des comptes contrôlent", texte: "Le contrôle interne revient à l'IGAE, le contrôle externe au Tribunal de Cuentas, pendant et après l'exercice." },
          { titre: "L'AIReF évalue", texte: "Une institution indépendante analyse les prévisions, les règles budgétaires et la soutenabilité des finances publiques." },
        ]} />
        <Figure id="regles-budgetaires" titre="Les règles budgétaires de l'Espagne"
          legende="Les repères européens et nationaux qui encadrent le déficit, la dette et les dépenses, et la trajectoire des dépenses nettes pour 2026."
          source={{ source: "Loi organique 2/2012 ; AIReF, rapport du 15 juillet 2026", url: SOURCES.AIREF }}>
          <ChiffresGrille items={[
            { valeur: `${REGLES.deficitUE} %`, libelle: "du PIB : référence européenne de déficit" },
            { valeur: `${REGLES.detteUE} %`, libelle: "du PIB : référence européenne et nationale de dette" },
            { valeur: REGLES.repartition, libelle: "du PIB : références nationales de dette pour l'État, les communautés autonomes et les collectivités locales" },
            { valeur: `${nf(REGLES.depensesNettes2026)} %`, libelle: "de croissance des dépenses nettes : trajectoire officielle 2026" },
            { valeur: `${nf(REGLES.depensesNettesAirefPrevision2026)} %`, libelle: "prévision indépendante de l'AIReF pour 2026" },
          ]} />
          <p className="dos-notule">Quand aucun nouveau budget n'est voté, l'article 134.4 de la Constitution proroge automatiquement le précédent. <Source href={SOURCES.DECRET_LOI}>Un décret-loi de juin 2026</Source> a ajusté le financement territorial dans ce cadre.</p>
        </Figure>
      </Chapitre>

      <Chapitre id="refinancement" titre="Comment l'Espagne refinance-t-elle sa dette ?"
        reponse={<>
          Le Tesoro Público prévoit en 2026 <b>{montant(PROGRAMME_2026.brutes, 1, 2026)} d'émissions brutes</b>, dont {montant(PROGRAMME_2026.brutes - PROGRAMME_2026.nettes, 1, 2026)} pour rembourser les titres arrivant à échéance : l'émission <b>nette</b> n'est que de {montant(PROGRAMME_2026.nettes, 1, 2026)}.
        </>}>
        <Figure id="programme-emission" titre="Le programme d'émission du Tesoro pour 2026"
          legende="Les émissions brutes prévues (moyen et long terme, et Letras à court terme), les remboursements prévus et l'émission nette qui en résulte. Prévisions officielles de la stratégie de financement 2026 ; ce n'est pas le déficit de toutes les administrations."
          source={{ source: "Tesoro Público, stratégie de financement 2026", url: SOURCES.TESORO_STRATEGIE }}
          voir={[{ href: "#europe", label: "L'Espagne face à ses voisins" }]}>
          <ChiffresGrille items={[
            { valeur: montant(PROGRAMME_2026.brutes, 1, 2026), libelle: "d'émissions brutes prévues" },
            { valeur: montant(PROGRAMME_2026.remboursements, 1, 2026), libelle: "de remboursements prévus" },
            { valeur: montant(PROGRAMME_2026.nettes, 1, 2026), libelle: "d'émissions nettes" },
          ]} />
          <Repartition
            nom="Émissions brutes prévues du Tesoro en 2026" idBase="emissions" annee={2026}
            lignes={[
              { nom: "Moyen et long terme (Bonos et Obligaciones)", md: PROGRAMME_2026.brutesMlt },
              { nom: "Court terme (Letras)", md: PROGRAMME_2026.brutesLetras },
            ]}
          />
        </Figure>
        <Etapes nom="refinancement-es" etapes={[
          { titre: "Le besoin à financer", chiffre: `${montant(PROGRAMME_2026.nettes, 1, 2026)} d'émission nette`, texte: "Le Tesoro émet pour rembourser les titres qui arrivent à échéance et pour financer le besoin de financement de l'État : l'émission brute est donc très supérieure à la dette nouvelle." },
          { titre: "Les Letras", chiffre: "court terme", texte: "Des titres à trois, six, neuf ou douze mois selon les offres, vendus aux enchères." },
          { titre: "Les Bonos et les Obligaciones", chiffre: "moyen et long terme", texte: "Des titres à moyen et long terme, vendus par adjudication ou par syndication, dont des obligations vertes déjà comptées parmi les Obligaciones." },
          { titre: "Un calendrier annoncé", texte: "Les adjudications suivent un calendrier publié à l'avance par le Tesoro." },
        ]} />
        <p className="dos-notule">Sources : <Source href={SOURCES.TESORO_STRATEGIE}>Tesoro, stratégie de financement 2026</Source> · <Source href={SOURCES.TESORO_CALENDRIER}>calendrier des adjudications</Source>.</p>
      </Chapitre>

      <Chapitre id="europe" titre="Dette publique en Europe : l'Espagne face à ses voisins"
        reponse={<>
          Fin 2025, l'Espagne affiche <b>100,7 % du PIB</b> de dette Maastricht : au-dessus de la moyenne de la zone euro (87,8 %), mais au-dessous de la France (115,6 %), de l'Italie (137,1 %) et de la Grèce (146,1 %).
        </>}>
        <Figure id="dette-europe" titre="Dette publique en pourcentage du PIB, fin 2025"
          legende="Comparaison de la dette publique de l'Espagne avec celle de ses voisins, de la zone euro et de l'Union européenne, à la même date et dans la même publication d'Eurostat."
          source={{ source: "Eurostat · notification du 22 avril 2026, dette Maastricht fin 2025", url: SOURCES.EUROSTAT }}
          voir={[{ href: "#evolution", label: "Évolution en Espagne" }]} reprise>
          <Comparaison />
        </Figure>
      </Chapitre>

      <Chapitre id="specificites" titre="Ce qui distingue la dette de l'Espagne"
        reponse="Un État très décentralisé : les communautés autonomes portent à elles seules 355 milliards d'euros de dette, et chaque région a son propre poids relatif."
      >
        <Figure id="dette-regions" titre="Dette des communautés autonomes rapportée au PIB de leur région"
          legende="Neuf communautés autonomes, à la fin du deuxième trimestre 2026. Chaque ratio utilise le PIB de la région, pas celui du pays."
          source={{ source: "Banco de España, dette des administrations publiques, 2e trimestre 2026", url: SOURCES.BDE_T2 }} reprise>
          <Regions />
        </Figure>
        <Etapes nom="specificites-es" etapes={[
          { titre: "Dix-sept communautés autonomes", chiffre: `${montant(355, 0, 2026)} de dette`, texte: "L'Espagne est un État décentralisé, pas juridiquement une fédération : les communautés autonomes ont des compétences importantes et leurs propres dettes." },
          { titre: "Une dette consolidée", chiffre: `−${montant(363, 0, 2026)} de dettes croisées`, texte: "Des administrations se prêtent entre elles : ces dettes disparaissent de la dette Maastricht, qui ne garde que ce qui est dû à des créanciers extérieurs au secteur public." },
          { titre: "Presque tout en euros", chiffre: `${nf(EN_EUROS.partEuros, 2)} %`, texte: "La dette est quasi intégralement libellée en euros, la monnaie nationale." },
          { titre: "Les programmes de la BCE", chiffre: montant(BCE.pspp.valeur + BCE.pepp.valeur, 0, 2026), texte: "L'Eurosystème a acheté des titres espagnols dans les programmes PSPP et PEPP ; cette mesure est distincte de la dette nominale." },
          { titre: "L'héritage de la crise bancaire de 2012", texte: "L'Espagne a bénéficié d'un programme européen de recapitalisation bancaire ; le ministère de l'Économie indiquait une sortie de la surveillance post-programme en décembre 2025, après remboursement de 75 % du prêt du Mécanisme européen de stabilité." },
          { titre: "Des budgets prorogés", texte: "Faute de nouveau budget, la Constitution proroge le précédent : la succession de prorogations est un trait récent des finances publiques espagnoles." },
        ]} />
      </Chapitre>

      <ChapitrePresse titre="La dette espagnole dans la presse" intro="Des articles de la presse espagnole sur la dette, pour aller plus loin. Les chiffres de cette page viennent des publications officielles citées sous chaque graphique, pas de ces articles." citations={PRESSE} />

      <Chapitre id="questions" titre="Questions fréquentes sur la dette publique espagnole">
        <ListeQuestions questions={creerFAQ((v, d, a) => enLettres(v, d, a))} />
        <p className="dos-notule">Sources principales : <Source href={SOURCES.BDE_T2}>Banco de España</Source> · <Source href={SOURCES.INE}>INE</Source> · <Source href={SOURCES.TESORO}>Tesoro Público</Source> · <Source href={SOURCES.EUROSTAT}>Eurostat</Source>. <a href="/methodologie-donnees">Notre méthode</a></p>
      </Chapitre>
    </ArticleLong>
  );
}
