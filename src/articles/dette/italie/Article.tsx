"use client";

import { Banknote, Clock, Globe, Percent, Scale, TrendingDown } from "lucide-react";
import {
  ArticleLong, BarresParDate, Camembert, Chapitre, ChapitrePresse, ChiffresCles, ChiffresGrille,
  Compteur, Etapes, Figure, ListeQuestions, Repartition, montant, enLettres, nf,
  type ChapitreDef, type Suggestion,
} from "@/articles/dette/cadre";
import { poserMonnaieArticle, valeurConvertie } from "@/lib/montant";
import { useMonnaieArticle } from "@/components/concept/Monnaie";
import { Deficit } from "./Deficit";
import { Comparaison } from "./figures/Europe";
import {
  BANCA_ITALIA, CATEGORIES_DETENTEURS, DEFICIT_2025, DEFICIT_PCT_PIB, DEPENSES_2025, DETENTEURS, DETTE, DETTE_2025,
  DETTE_ANNUELLE, DETTE_JUILLET, DETTE_MENSUELLE, DUREE_MOYENNE, ECART_STOCK_FLUX, EMISSIONS_NETTES_AOUT, EN_EUROS,
  HAUSSE_2025, INTERETS_2025, INTERETS_PCT_PIB, INTERETS_PCT_RECETTES, LOCALES, NON_RESIDENTS, NON_RESIDENTS_SERIE,
  PAR_ADMINISTRATION, PAR_ECHEANCE, PAR_INSTRUMENT, PART_NON_RESIDENTS, PRESSE, RATIO_2025, RECETTES_2025, REGLES,
  SOLDE_PRIMAIRE, SOURCES, TRESORERIE, VARIATION_MOIS, creerFAQ,
} from "./donnees";
import "@/articles/dette/france/figures/figures.css";

/** Même sommaire et même ordre que la France, l'Allemagne et l'Espagne ; uniquement les chapitres dont les données sont vérifiées. */
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

export function ArticleItalie({ suggestions }: { suggestions: Suggestion[] }) {
  const [devise] = useMonnaieArticle();
  poserMonnaieArticle(devise);
  const hero = valeurConvertie(DETTE.valeur, "eur", 2026, devise);

  const points = [
    ...DETTE_ANNUELLE.map((p) => ({ cle: String(p.annee), etiquette: String(p.annee), valeur: p.md, ratio: p.ratio })),
    ...DETTE_MENSUELLE.map((p) => ({ cle: p.cle, etiquette: p.etiquette, court: p.court, valeur: p.md, ratio: null as number | null, repere: "estimation provisoire" })),
  ];
  const pointsNonResidents = NON_RESIDENTS_SERIE.map((p) => ({ cle: p.cle, etiquette: p.etiquette, court: p.court, valeur: p.md, ratio: p.ratio ?? null }));

  return (
    <ArticleLong
      fil={[
        { label: "Accueil", href: "/" },
        { label: "Pays", href: "/pays" },
        { label: "Italie", href: "/pays/italie" },
        { label: "Dette publique" },
      ]}
      surtitre="Dette publique de l'Italie"
      chiffre={<><Compteur valeur={hero.v} decimales={3} duree={1500} /><small>{hero.suffixe.replace(/Md[\s ]([€$])/, "Md$1")}</small></>}
      chapo={<>
        Fin août 2026, dette Maastricht de toutes les administrations. Fin 2025, elle représentait <b>{nf(RATIO_2025.valeur)} % du PIB</b>.{" "}
        <Source href={SOURCES.BDI}>Banca d'Italia</Source>
      </>}
      chapitres={CHAPITRES}
      suggestions={suggestions}
      sources="Banca d'Italia · ISTAT · Ministère de l'Économie et des Finances · Eurostat · Gazzetta Ufficiale"
    >
      <Chapitre id="essentiel" titre="Dette publique de l'Italie : les chiffres clés"
        reponse={<>La dette est un <b>stock</b>, le déficit est un <b>flux</b> qui l'alimente, les intérêts sont ce qu'elle coûte chaque année.</>}>
        <ChiffresCles cartes={[
          { icone: Percent, valeur: `${nf(RATIO_2025.valeur)} %`, libelle: "de dette rapportée au PIB", texte: `Fin 2025 : ${montant(DETTE_2025.valeur, 1, 2025)} pour un PIB de ${montant(2265.003, 1, 2025)}.` },
          { icone: TrendingDown, valeur: `−${montant(-VARIATION_MOIS, 1, 2026)}`, libelle: "en un mois", texte: `De ${montant(DETTE_JUILLET, 1, 2026)} fin juillet à ${montant(DETTE.valeur, 1, 2026)} fin août 2026.`, negatif: true },
          { icone: Scale, valeur: `−${montant(DEFICIT_2025.valeur, 1)}`, libelle: "de déficit public en 2025", texte: `${nf(DEFICIT_PCT_PIB)} % du PIB, toutes administrations.`, negatif: true },
          { icone: Banknote, valeur: montant(INTERETS_2025.valeur, 1), libelle: "d'intérêts en 2025", texte: `${nf(INTERETS_PCT_PIB)} % du PIB, toutes administrations.` },
          { icone: Globe, valeur: `${nf(PART_NON_RESIDENTS)} %`, libelle: "détenus hors d'Italie", texte: "Dette Maastricht, selon la résidence du créancier, fin juillet 2026." },
          { icone: Clock, valeur: `${nf(DUREE_MOYENNE)} ans`, libelle: "de durée résiduelle moyenne", texte: "De l'ensemble de la dette publique, fin août 2026." },
        ]} />
        <p className="dos-notule">Sources : <Source href={SOURCES.BDI}>Banca d'Italia, finances publiques d'août 2026</Source> ·{" "}
          <Source href={SOURCES.ISTAT}>ISTAT, comptes économiques nationaux</Source>.
        </p>
      </Chapitre>

      <Chapitre id="deficit" titre="Déficit public de l'Italie"
        reponse={<>
          En 2025, les administrations italiennes ont enregistré {montant(RECETTES_2025.valeur, 1)} de recettes et {montant(DEPENSES_2025.valeur, 1)} de dépenses :{" "}
          <b>{montant(DEFICIT_2025.valeur, 1)} de déficit, soit {nf(DEFICIT_PCT_PIB)} % du PIB</b>.
        </>}>
        <Deficit />
      </Chapitre>

      <Chapitre id="evolution" titre="Évolution de la dette publique italienne"
        reponse={<>
          La dette est passée de <b>{montant(DETTE_ANNUELLE[0].md, 0, 2022)} fin 2022</b> à <b>{montant(DETTE.valeur, 0, 2026)} fin août 2026</b>. En 2025, elle a augmenté de {montant(HAUSSE_2025, 1, 2025)}.
        </>}>
        <Figure id="evolution-dette-pib" titre="Dette publique italienne, de fin 2022 à fin août 2026"
          legende="Le stock de dette Maastricht de toutes les administrations au 31 décembre de 2022 à 2025, puis les deux derniers stocks mensuels provisoires. Chaque barre se lit en cliquant dessus ; le ratio dette/PIB est donné pour les années où il est publié dans la même édition."
          source={{ source: "Banca d'Italia, finances publiques, édition du 15 octobre 2026", url: SOURCES.BDI }}
          voir={[{ href: "#qui-doit", label: "Qui doit cette dette" }]}>
          <BarresParDate mode="montant" points={points} unite="Md€" enteteValeur="Dette" />
          <p className="dos-notule">Les deux derniers points sont des stocks de fin de mois : ils ne se comparent pas aux stocks de fin d'année.</p>
        </Figure>
        <Figure id="stock-flux" titre="Le stock augmente plus que le déficit"
          legende="En 2025, la dette a progressé de plus que le déficit de l'année : l'écart vient d'opérations de trésorerie et d'ajustements financiers, qu'aucun chiffre ne détaille ici."
          source={{ source: "Banca d'Italia, tableau 1 ; ISTAT, comptes révisés", url: SOURCES.BDI }}>
          <ChiffresGrille items={[
            { valeur: `+${montant(HAUSSE_2025, 1, 2025)}`, libelle: "de hausse du stock de dette entre fin 2024 et fin 2025" },
            { valeur: montant(DEFICIT_2025.valeur, 1, 2025), libelle: "de déficit public en 2025" },
            { valeur: montant(ECART_STOCK_FLUX, 1, 2025), libelle: "d'écart entre les deux" },
          ]} />
        </Figure>
      </Chapitre>

      <Chapitre id="qui-doit" titre="Qui doit la dette publique italienne ?"
        reponse={<>
          L'<b>État et les administrations centrales</b> portent {montant(PAR_ADMINISTRATION.centrales, 1, 2026)}, soit près de 98 % de la dette Maastricht de {montant(DETTE.valeur, 1, 2026)} ; les régions et les communes ne portent que {montant(PAR_ADMINISTRATION.locales, 1, 2026)}.
        </>}>
        <Figure id="dette-par-administration" titre="La dette italienne par administration, après consolidation"
          legende="La dette Maastricht fin août 2026 selon l'administration débitrice, après élimination des dettes que les administrations se doivent entre elles. Cliquez sur « Administrations locales » pour voir leur composition."
          source={{ source: "Banca d'Italia, tableau 6, 15 octobre 2026", url: SOURCES.BDI }}
          voir={[{ href: "#qui-detient", label: "Qui détient cette dette" }]}>
          <Repartition
            nom="Dette publique italienne par administration, fin août 2026" idBase="administrations" annee={2026}
            lignes={[
              { nom: "Administrations centrales", md: PAR_ADMINISTRATION.centrales },
              { nom: "Administrations locales", md: PAR_ADMINISTRATION.locales },
              { nom: "Sécurité sociale", md: PAR_ADMINISTRATION.securite },
            ]}
            details={{
              "Administrations centrales": {
                texte: `L'État et les autres organismes centraux. Avant consolidation, leur dette est de [[${PAR_ADMINISTRATION.centralesAvant}]] ; il faut en retirer [[${PAR_ADMINISTRATION.centralesInternes}]] de créances détenues par d'autres administrations.`,
                source: { nom: "Banca d'Italia, tableau 6", url: SOURCES.BDI },
              },
              "Administrations locales": {
                texte: `Les régions, les communes, les provinces et les autres organismes locaux. Avant consolidation, leur dette est de [[${PAR_ADMINISTRATION.localesAvant}]] ; [[${PAR_ADMINISTRATION.localesInternes}]] sont dus à d'autres administrations et disparaissent du total. C'est de la dette, pas le budget annuel des collectivités.`,
                vues: [{ parts: LOCALES, total: PAR_ADMINISTRATION.locales }],
                source: { nom: "Banca d'Italia, tableau 6", url: SOURCES.BDI },
              },
              "Sécurité sociale": {
                texte: "Les organismes de sécurité sociale, après consolidation. Cette dette presque nulle ne dit rien des engagements futurs de retraite, qui ne sont pas de la dette Maastricht.",
                source: { nom: "Banca d'Italia, tableau 6", url: SOURCES.BDI },
              },
            }}
          />
        </Figure>
        <Figure id="dette-par-instrument" titre="Sous quelle forme l'Italie est-elle endettée ?"
          legende="La dette Maastricht par instrument à la fin d'août 2026 : surtout des titres à moyen et long terme (dont les BTP), puis des dépôts, des titres à court terme, des prêts et d'autres instruments."
          source={{ source: "Banca d'Italia, tableau 4, 15 octobre 2026", url: SOURCES.BDI }}>
          <Repartition
            nom="Dette publique italienne par instrument, fin août 2026" idBase="instruments" annee={2026}
            lignes={[
              { nom: "Titres à moyen et long terme", md: PAR_INSTRUMENT.titresLongs },
              { nom: "Monnaie et dépôts", md: PAR_INSTRUMENT.depots },
              { nom: "Titres à court terme", md: PAR_INSTRUMENT.titresCourts },
              { nom: "Prêts d'institutions européennes", md: PAR_INSTRUMENT.pretsEuropeens },
              { nom: "Prêts d'établissements financiers", md: PAR_INSTRUMENT.pretsBanques },
              { nom: "Autres instruments", md: PAR_INSTRUMENT.autres },
            ]}
            details={{
              "Titres à moyen et long terme": { texte: "Les titres négociables au nominal, dont les BTP. Cette ligne ne se réduit pas aux seuls BTP classiques : elle comprend d'autres titres de même durée.", source: { nom: "Banca d'Italia, tableau 4", url: SOURCES.BDI } },
              "Monnaie et dépôts": {
                texte: "Les dépôts et les instruments de dépôt comptés comme dette publique, dont l'épargne postale.",
                vues: [{ parts: [{ nom: "Épargne postale", md: PAR_INSTRUMENT.epargnePostale }], total: PAR_INSTRUMENT.depots, resteNom: "Autres dépôts" }],
                source: { nom: "Banca d'Italia, tableau 4", url: SOURCES.BDI },
              },
              "Titres à court terme": { texte: "Les titres à court terme selon la classification de la Banca d'Italia, en particulier les BOT.", source: { nom: "Banca d'Italia, tableau 4", url: SOURCES.BDI } },
              "Prêts d'institutions européennes": { texte: "Les prêts accordés par des institutions européennes. Cette ligne ne se réduit pas au plan de relance PNRR : elle peut couvrir d'autres dispositifs européens.", source: { nom: "Banca d'Italia, tableau 4", url: SOURCES.BDI } },
              "Prêts d'établissements financiers": { texte: "Les crédits contractés auprès de banques et d'autres établissements financiers monétaires.", source: { nom: "Banca d'Italia, tableau 4", url: SOURCES.BDI } },
              "Autres instruments": { texte: "Les autres instruments de dette retenus par la définition de Maastricht dans le tableau de la Banca d'Italia.", source: { nom: "Banca d'Italia, tableau 4", url: SOURCES.BDI } },
            }}
          />
          <p className="dos-notule">La somme des six catégories dépasse de 1 million d'euros le total publié ({montant(DETTE.valeur, 3, 2026)}) : un écart d'arrondi.</p>
        </Figure>
        <Figure id="dette-par-echeance" titre="Dans combien de temps la dette arrive-t-elle à échéance ?"
          legende="La dette Maastricht fin août 2026 selon la durée qui reste à courir. Ce n'est pas le calendrier des remboursements année par année."
          source={{ source: "Banca d'Italia, tableau 7, 15 octobre 2026", url: SOURCES.BDI }}>
          <Repartition
            nom="Dette publique italienne par durée résiduelle, fin août 2026" idBase="echeance" annee={2026}
            lignes={[
              { nom: "Plus de 5 ans", md: PAR_ECHEANCE.plusCinq },
              { nom: "De 1 à 5 ans", md: PAR_ECHEANCE.uneACinq },
              { nom: "Un an ou moins", md: PAR_ECHEANCE.unAn },
            ]}
          />
          <ChiffresGrille items={[
            { valeur: `${nf(DUREE_MOYENNE)} ans`, libelle: "de durée résiduelle moyenne de la dette publique" },
            { valeur: `${nf(EN_EUROS.partEuros, 3)} %`, libelle: "de la dette est libellée en euros" },
            { valeur: montant(EN_EUROS.devises, 3, 2026), libelle: "seulement en devises étrangères" },
            { valeur: montant(TRESORERIE, 1, 2026), libelle: "de disponibilités liquides du Trésor, fin août 2026" },
          ]} />
        </Figure>
      </Chapitre>

      <Chapitre id="qui-detient" titre="Qui détient la dette italienne ?"
        reponse={<>
          Fin juillet 2026, <b>{nf(PART_NON_RESIDENTS)} %</b> de la dette Maastricht est détenue par des créanciers situés hors d'Italie : {montant(NON_RESIDENTS.valeur, 1, 2026)}. La Banca d'Italia en détient {montant(BANCA_ITALIA.aout2026, 1, 2026)} fin août.
        </>}>
        <Figure id="detenteurs-dette" titre="Créanciers de la dette publique italienne, fin juillet 2026"
          legende="La dette Maastricht de toutes les administrations selon le type de créancier, à la fin de juillet 2026 : la dernière répartition complète. « Non-résident » désigne un créancier domicilié hors d'Italie, quelle que soit sa nationalité."
          source={{ source: "Banca d'Italia, tableau 5, 15 octobre 2026", url: SOURCES.BDI }}
          voir={[{ href: "#interets", label: "Ce que ça coûte" }]}>
          <Camembert annee={2026} vue={{ parts: DETENTEURS, total: DETTE_JUILLET }} />
        </Figure>
        <Figure id="non-residents" titre="Les créanciers non-résidents, de septembre 2024 à juillet 2026"
          legende="Le montant de dette Maastricht détenu par des non-résidents, de septembre 2024 à juillet 2026. Ce n'est pas la dette extérieure globale du pays."
          source={{ source: "Banca d'Italia, tableau 5, 15 octobre 2026", url: SOURCES.BDI }}>
          <BarresParDate mode="montant" points={pointsNonResidents} unite="Md€" enteteValeur="Non-résidents" ratioLibelle="de la dette" enteteRatio="Part de la dette" />
        </Figure>
        <Figure id="banca-italia" titre="Les titres détenus par la Banca d'Italia"
          legende="La dette Maastricht détenue par la banque centrale baisse à mesure que les titres achetés dans le cadre de la politique monétaire arrivent à échéance."
          source={{ source: "Banca d'Italia, tableau 5, 15 octobre 2026", url: SOURCES.BDI }}>
          <ChiffresGrille items={[
            { valeur: montant(BANCA_ITALIA.fin2024, 1, 2024), libelle: "fin 2024" },
            { valeur: montant(BANCA_ITALIA.fin2025, 1, 2025), libelle: "fin 2025" },
            { valeur: montant(BANCA_ITALIA.aout2026, 1, 2026), libelle: `fin août 2026, soit ${nf(BANCA_ITALIA.partAout, 3)} % de la dette` },
            { valeur: `−${montant(BANCA_ITALIA.fin2024 - BANCA_ITALIA.aout2026, 1, 2026)}`, libelle: "depuis fin 2024" },
          ]} />
        </Figure>
        <Figure id="categories-detenteurs" titre="Qui sont les détenteurs de dette publique"
          legende="Les grandes catégories d'investisseurs en titres souverains et ce qui les motive. Seules les catégories de la statistique officielle sont chiffrées plus haut."
          source={{ source: "Banca d'Italia, tableau 5", url: SOURCES.BDI }}>
          <Etapes nom="categories-de-detenteurs" etapes={CATEGORIES_DETENTEURS.map((c) => ({ titre: c.titre, texte: c.texte }))} />
        </Figure>
      </Chapitre>

      <Chapitre id="interets" titre="Combien l'Italie paie-t-elle d'intérêts ?"
        reponse={<>
          Les administrations italiennes ont payé <b>{montant(INTERETS_2025.valeur, 1)} d'intérêts en 2025</b>, soit {nf(INTERETS_PCT_PIB)} % du PIB. C'est le coût annuel de la dette, à ne pas confondre avec son montant ni avec le remboursement du capital.
        </>}>
        <Figure id="interets-dette" titre="Charge des intérêts de la dette publique italienne"
          legende="La charge d'intérêts de toutes les administrations publiques en 2025, en comptabilité nationale (SEC 2010), rapportée au PIB et aux recettes publiques. Sans ces intérêts, les comptes publics seraient en excédent."
          source={INTERETS_2025} voir={[{ href: "#refinancement", label: "Comment la dette se refinance" }]}>
          <ChiffresGrille items={[
            { valeur: montant(INTERETS_2025.valeur, 1), libelle: "d'intérêts en 2025, toutes administrations" },
            { valeur: `${nf(INTERETS_PCT_PIB)} %`, libelle: "du PIB" },
            { valeur: `${nf(INTERETS_PCT_RECETTES)} %`, libelle: "des recettes publiques" },
            { valeur: `+${montant(SOLDE_PRIMAIRE, 1)}`, libelle: "de solde primaire : l'excédent avant les intérêts" },
          ]} />
        </Figure>
      </Chapitre>

      <Chapitre id="budget" titre="Qui vote le budget de l'Italie ?"
        reponse="Le Parlement, en deux chambres. Le gouvernement prépare le projet de loi de finances, la Chambre des députés et le Sénat le votent, puis le ministère de l'Économie l'exécute et la Cour des comptes contrôle."
      >
        <Etapes nom="budget-it" etapes={[
          { titre: "Le gouvernement cadre", texte: "Le ministère de l'Économie et des Finances et la Ragioneria generale dello Stato fixent les hypothèses économiques et la trajectoire pluriannuelle, au printemps et à l'automne.", chiffre: "Constitution, art. 81 et 97" },
          { titre: "Le Conseil des ministres propose", texte: "Il adopte et présente le projet de loi de finances, en principe en octobre." },
          { titre: "La Chambre et le Sénat votent", texte: "Les deux chambres examinent, amendent et adoptent la loi de finances, d'octobre à décembre, avant la fin de l'année.", chiffre: "bicamérisme" },
          { titre: "Les administrations exécutent", texte: "Le ministère de l'Économie, les autres ministères et les administrations publiques engagent et paient les dépenses, de janvier à décembre ; les régions et les communes ont leurs propres budgets." },
          { titre: "La Cour des comptes contrôle", texte: "Elle contrôle la gestion publique et les comptes, pendant l'exercice et après." },
          { titre: "L'UPB évalue", texte: "Le Bureau parlementaire du budget évalue les prévisions macroéconomiques, les règles et la soutenabilité des finances publiques." },
        ]} />
        <Figure id="regles-budgetaires" titre="Les règles budgétaires de l'Italie"
          legende="Les repères européens qui encadrent le déficit et la dette, et la prévision du gouvernement pour 2026. Une prévision n'est pas un résultat."
          source={{ source: "Traités européens ; document de politique budgétaire du 8 octobre 2026", url: SOURCES.OPENBDAP }}>
          <ChiffresGrille items={[
            { valeur: `${REGLES.deficitUE} %`, libelle: "du PIB : référence européenne de déficit" },
            { valeur: `${REGLES.detteUE} %`, libelle: "du PIB : référence européenne de dette" },
            { valeur: `−${nf(REGLES.deficitPrevu2026)} %`, libelle: "du PIB : déficit prévu par le gouvernement pour 2026" },
          ]} />
          <p className="dos-notule">Depuis la réforme de 2024, ces repères coexistent avec une trajectoire pluriannuelle de dépenses primaires nettes. Prévoir un déficit inférieur à 3 % ne ferme pas à lui seul la procédure européenne pour déficit excessif : <Source href={SOURCES.COMMISSION_GOUVERNANCE}>la décision relève du Conseil et de la Commission</Source>.</p>
        </Figure>
      </Chapitre>

      <Chapitre id="refinancement" titre="Comment l'Italie refinance-t-elle sa dette ?"
        reponse={<>
          Le ministère de l'Économie et des Finances émet des BOT, des BTP et d'autres titres. Près d'un cinquième de la dette arrive à échéance dans l'année : <b>{montant(PAR_ECHEANCE.unAn, 1, 2026)}</b> fin août 2026.
        </>}>
        <Figure id="emissions-nettes" titre="Les émissions nettes de titres d'État en 2026"
          legende="Le cumul des émissions de titres d'État, déduction faite des remboursements déjà effectués, du début de l'année au 7 août 2026, tel que cité dans un décret d'adjudication. Ce n'est pas un total annuel."
          source={{ source: "Gazzetta Ufficiale, décret publié le 21 août 2026", url: SOURCES.GAZZETTA }}
          voir={[{ href: "#europe", label: "L'Italie face à ses voisins" }]}>
          <ChiffresGrille items={[
            { valeur: montant(EMISSIONS_NETTES_AOUT, 1, 2026), libelle: "d'émissions nettes, du 1er janvier au 7 août 2026" },
            { valeur: montant(PAR_ECHEANCE.unAn, 1, 2026), libelle: "de dette à échéance d'un an ou moins, fin août" },
          ]} />
        </Figure>
        <Etapes nom="refinancement-it" etapes={[
          { titre: "Le Trésor émet", chiffre: "MEF · Direction de la dette publique", texte: "Le Dipartimento del Tesoro émet de nouveaux titres, rouvre des lignes existantes, procède à des syndications et à des opérations d'échange ou de rachat selon sa stratégie annuelle. Une partie des ressources rembourse le principal arrivé à échéance : l'émission brute est donc très supérieure à la dette nouvelle." },
          { titre: "Les BOT", chiffre: "court terme", texte: "Des bons du Trésor à court terme, généralement sans coupon, à 6 ou 12 mois, vendus aux enchères." },
          { titre: "Les BTP", chiffre: "moyen et long terme", texte: "Des obligations à coupon fixe, de plusieurs maturités, vendues par adjudication ou par syndication. Ce sont les titres emblématiques du financement italien." },
          { titre: "Les titres indexés", chiffre: "BTP Italia · BTP€i", texte: "Le BTP Italia est indexé sur l'inflation italienne, le BTP€i sur l'inflation de la zone euro. Ce sont des familles de BTP : on ne les additionne pas aux BTP classiques." },
          { titre: "Les CCTeu", chiffre: "taux variable", texte: "Des certificats du Trésor dont le coupon varie avec l'Euribor." },
          { titre: "Les titres pour particuliers", chiffre: "BTP Valore · BTP Futura", texte: "Des titres placés directement auprès des épargnants, selon des modalités fixées à chaque émission. Les BTP verts, destinés à financer des projets écologiques, forment une autre famille." },
        ]} />
        <p className="dos-notule">Sources : <Source href={SOURCES.MEF_TESORO}>Dipartimento del Tesoro</Source> · <Source href={SOURCES.GAZZETTA}>Gazzetta Ufficiale</Source>.</p>
      </Chapitre>

      <Chapitre id="europe" titre="Dette publique en Europe : l'Italie face à ses voisins"
        reponse={<>
          Fin 2025, l'Italie affiche <b>137,1 % du PIB</b> de dette Maastricht : au-dessus de la France (115,6 %), de l'Espagne (100,7 %) et de la zone euro (87,8 %), et seulement derrière la Grèce (146,1 %).
        </>}>
        <Figure id="dette-europe" titre="Dette publique en pourcentage du PIB, fin 2025"
          legende="Comparaison de la dette publique de l'Italie avec celle de ses voisins, de la zone euro et de l'Union européenne, à la même date et dans la même publication d'Eurostat d'avril 2026. La Banca d'Italia a révisé le ratio italien à 136,7 % en octobre : il n'entre pas dans ce tableau."
          source={{ source: "Eurostat · notification du 22 avril 2026, dette Maastricht fin 2025", url: SOURCES.EUROSTAT }}
          voir={[{ href: "#evolution", label: "Évolution en Italie" }]} reprise>
          <Comparaison />
        </Figure>
      </Chapitre>

      <Chapitre id="specificites" titre="Ce qui distingue la dette de l'Italie"
        reponse="Une dette concentrée dans l'administration centrale, financée surtout par des BTP, détenue pour plus d'un tiers par l'étranger et presque entièrement libellée en euros."
      >
        <Etapes nom="specificites-it" etapes={[
          { titre: "Concentrée au centre", chiffre: `${nf(PAR_ADMINISTRATION.centrales / DETTE.valeur * 100, 1)} % de la dette`, texte: "Les administrations centrales portent presque toute la dette. Une dette de sécurité sociale quasi nulle après consolidation ne signifie pas l'absence d'engagements de retraite." },
          { titre: "Le marché des BTP", chiffre: `${nf(PAR_INSTRUMENT.titresLongs / DETTE.valeur * 100, 1)} % en titres longs`, texte: "Les titres à moyen et long terme forment l'essentiel du stock. Cette ligne est plus large que les seuls BTP classiques." },
          { titre: "Un tiers à l'étranger", chiffre: `${nf(PART_NON_RESIDENTS)} %`, texte: "Les non-résidents détiennent plus d'un tiers de la dette publique. C'est la dette publique détenue à l'étranger, pas la dette extérieure globale du pays, qui inclut aussi les banques et les entreprises." },
          { titre: "Presque tout en euros", chiffre: `${nf(EN_EUROS.partEuros, 3)} %`, texte: "En zone euro, l'Italie emprunte presque entièrement dans sa monnaie : le risque de change est limité, mais l'exposition aux taux d'intérêt et au refinancement demeure." },
          { titre: "L'effet des crédits d'impôt", texte: "Les crédits d'impôt pour la rénovation immobilière ont soulevé des questions de classification et de date d'enregistrement dans le déficit. Leur effet sur la dette n'est pas chiffré ici." },
          { titre: "Les prêts européens", chiffre: montant(PAR_INSTRUMENT.pretsEuropeens, 1, 2026), texte: "L'Italie reçoit des financements européens sous forme de prêts et de subventions. Seuls les prêts sont de la dette, et cette ligne ne se limite pas au plan de relance." },
        ]} />
        <Figure id="dette-locale" titre="La dette des régions et des communes"
          legende="Les montants de dette territoriale Maastricht fin août 2026, après consolidation. Ils s'additionnent entre eux, mais pas au total national, qui les contient déjà."
          source={{ source: "Banca d'Italia, tableau 6, 15 octobre 2026", url: SOURCES.BDI }}>
          <Camembert annee={2026} vue={{ parts: LOCALES, total: PAR_ADMINISTRATION.locales }} />
        </Figure>
      </Chapitre>

      <ChapitrePresse titre="La dette italienne dans la presse" intro="Des articles de la presse sur la dette italienne, pour aller plus loin. Les chiffres de cette page viennent des publications officielles citées sous chaque graphique, pas de ces articles." citations={PRESSE} />

      <Chapitre id="questions" titre="Questions fréquentes sur la dette publique italienne">
        <ListeQuestions questions={creerFAQ((v, d, a) => enLettres(v, d, a))} />
        <p className="dos-notule">Sources principales : <Source href={SOURCES.BDI}>Banca d'Italia</Source> · <Source href={SOURCES.ISTAT}>ISTAT</Source> · <Source href={SOURCES.MEF_TESORO}>Dipartimento del Tesoro</Source> · <Source href={SOURCES.EUROSTAT}>Eurostat</Source>. <a href="/methodologie-donnees">Notre méthode</a></p>
      </Chapitre>
    </ArticleLong>
  );
}
