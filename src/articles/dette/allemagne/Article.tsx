"use client";

import { Banknote, Building2, Globe, Percent, Scale, TrendingUp } from 'lucide-react';
import {
  ArticleLong, BarresParDate, Chapitre, ChiffresCles, ChiffresGrille,
  Compteur, Etapes, Figure, ListeQuestions, montant, enLettres, nf,
  type ChapitreDef, type Suggestion,
} from '@/articles/dette/cadre';
import { poserMonnaieArticle, valeurConvertie } from '@/lib/montant';
import { useMonnaieArticle } from '@/components/concept/Monnaie';
import { Comparaison } from './figures/Europe';
import { Deficit } from './Deficit';
import {
  DETTE, RATIO, HAUSSE_DETTE, DEFICIT_2025, DEFICIT_RATIO_2025,
  DEPENSES_2025, RECETTES_2025, DEFICIT_S1_2026, RATIO_DEFICIT_S1_2026,
  INTERETS_APU_S1_2026, INTERETS_APU_S1_2025, VARIATION_INTERETS_S1_2026, PART_TITRES_2026_T1, PART_PRETS_2026_T1, PART_DEPOTS_2026_T1,
  VARIATION_BUND, VARIATION_LANDER, VARIATION_COMMUNES, DETTE_PAR_ANNEE,
  FONDS_INFRASTRUCTURE, DETTE_SECU_2025, MARGE_LANDER, EUROPE_2026_T1, creerFAQ, SOURCES,
} from './donnees';
/* Réemploi STRICT des styles graphiques français : aucun changement de cadre/, de polices ou d'animations. */
import '@/articles/dette/france/figures/figures.css';

/** Même sommaire et même ordre que la France ; uniquement les chapitres vérifiables.
 * Le frein à l'endettement est un chapitre spécifique à l'Allemagne.
 * Pas de fausse section presse remplie de citations introuvables. */
const CHAPITRES: ChapitreDef[] = [
  { id: 'essentiel', court: "L'essentiel" },
  { id: 'deficit', court: 'Déficit public' },
  { id: 'evolution', court: 'Évolution' },
  { id: 'qui-doit', court: 'Qui doit' },
  { id: 'qui-detient', court: 'Qui détient' },
  { id: 'interets', court: 'Intérêts' },
  { id: 'budget', court: 'Qui vote le budget' },
  { id: 'refinancement', court: 'Refinancement' },
  { id: 'europe', court: 'En Europe' },
  { id: 'frein', court: "Frein à l'endettement" },
  { id: 'questions', court: 'Questions' },
];

function Source({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noopener noreferrer">{children} ↗</a>;
}

export function ArticleAllemagne({ suggestions }: { suggestions: Suggestion[] }) {
  const [devise] = useMonnaieArticle();
  poserMonnaieArticle(devise);
  const hero = valeurConvertie(DETTE.valeur, 'eur', 2026, devise);
  const franceEurope = EUROPE_2026_T1.find(e => e.pays === 'France')!;
  return (
    <ArticleLong
      fil={[
        { label: 'Accueil', href: '/' },
        { label: 'Pays', href: '/pays' },
        { label: 'Allemagne', href: '/pays/allemagne' },
        { label: 'Dette publique' },
      ]}
      surtitre="Dette publique de l'Allemagne"
      chiffre={<><Compteur valeur={hero.v} decimales={3} duree={1500} /><small>{hero.suffixe.replace(/Md[\s\u00a0]([€$])/, 'Md$1')}</small></>}
      chapo={<>
        <b>{nf(RATIO.valeur)} % du PIB</b> au 31 mars 2026, dette brute consolidée de Maastricht (données provisoires).{' '}
        <Source href={RATIO.url}>Eurostat, 21 juillet 2026</Source>
      </>}
      chapitres={CHAPITRES}
      suggestions={suggestions}
      sources="Deutsche Bundesbank · Destatis · Deutsche Finanzagentur · Eurostat · Deutscher Bundestag"
    >
      <Chapitre id="essentiel" titre="Dette publique de l'Allemagne : les chiffres clés"
        reponse={<>
          La dette est un <b>stock</b> ; le déficit est un <b>flux</b> qui participe à sa variation ; les intérêts représentent le <b>coût du financement</b> pendant une période.
        </>}>
        <ChiffresCles cartes={[
          { icone: Percent, valeur: `${nf(RATIO.valeur)} %`, libelle: 'de dette rapportée au PIB', texte: 'Au 31 mars 2026, administrations publiques, chiffres provisoires.' },
          { icone: TrendingUp, valeur: `+${montant(HAUSSE_DETTE.valeur, 0)}`, libelle: 'de dette en plus en 2025', texte: 'Variation du stock entre décembre 2024 et décembre 2025.' },
          { icone: Scale, valeur: `−${montant(DEFICIT_2025.valeur)}`, libelle: 'de déficit public en 2025', texte: `${nf(DEFICIT_RATIO_2025.valeur)} % du PIB, toutes administrations, comptes nationaux.` , negatif: true},
          { icone: Banknote, valeur: montant(INTERETS_APU_S1_2026.valeur,1,2026), libelle: "d'intérêts au 1er semestre 2026", texte: 'Toutes administrations ; six mois seulement.' },
          { icone: Building2, valeur: montant(FONDS_INFRASTRUCTURE.valeur, 0), libelle: "d'autorisation d'investissement", texte: 'Fonds spécial 2025 ; plafond autorisé, pas dette déjà émise.' },
          { icone: Globe, valeur: montant(DEFICIT_S1_2026.valeur, 1, 2026), libelle: 'de déficit au premier semestre 2026', texte: 'Six premiers mois uniquement ; comptabilité nationale.' },
        ]} />
        <p className="dos-notule">Sources : <Source href={SOURCES.BB}>Bundesbank, évolution annuelle 2019–2025</Source> ·{' '}
          <Source href={DEFICIT_2025.url}>Destatis, comptes 2025</Source> ·{' '}
          <Source href={INTERETS_APU_S1_2026.url}>Destatis, premier semestre 2026</Source> ·{' '}
          <Source href={FONDS_INFRASTRUCTURE.url}>Bundestag, réforme 2025</Source> ·{' '}
          <Source href={RATIO.url}>Eurostat, dette au premier trimestre 2026</Source>.
        </p>
      </Chapitre>

      <Chapitre id="deficit" titre="Déficit public de l'Allemagne"
        reponse={<>
          En 2025, les administrations allemandes ont enregistré {montant(RECETTES_2025.valeur)} de recettes et {montant(DEPENSES_2025.valeur)} de dépenses :{' '}
          <b>{montant(DEFICIT_2025.valeur)} de déficit, soit {nf(DEFICIT_RATIO_2025.valeur)} % du PIB</b>.
        </>}>
        <Deficit />
        <p className="dos-notule">Mise à jour distincte : au premier semestre 2026, le déficit SEC 2010 atteint{' '}
          <b>{montant(DEFICIT_S1_2026.valeur,1,2026)} ({nf(RATIO_DEFICIT_S1_2026.valeur)} % du PIB du semestre)</b>.{' '}
          Il ne s'agit ni d'un chiffre annuel ni d'une projection.{' '}
          <Source href={DEFICIT_S1_2026.url}>Destatis, 25 août 2026</Source>.
        </p>
      </Chapitre>

      <Chapitre id="evolution" titre="Évolution de la dette publique allemande"
        reponse={<>
          Le ratio dette/PIB est passé de <b>{nf(DETTE_PAR_ANNEE[0].valeur)} % en 2019</b> à{' '}
          <b>{nf(RATIO.valeur)} % au premier trimestre 2026</b>. La hausse de 2020 et l'évolution des années suivantes ressortent des relevés officiels.
        </>}>
        <Figure id="evolution-dette-pib" titre="Dette allemande rapportée au PIB, de 2019 au premier trimestre 2026"
          legende="Chaque barre donne le ratio dette/PIB de l'Allemagne aux périodes publiées de 2019 à mars 2026. Les données 2019–2025 proviennent de la Bundesbank ; le point provisoire 2026-T1 vient d'Eurostat. Aucun point intermédiaire n'est interpolé."
          source={{ source: 'Bundesbank (2019–2025), Eurostat (2026-T1)', url: SOURCES.EUROSTAT }} voir={[{ href: '#qui-doit', label: 'Qui porte cette dette ?' }]}>
          <BarresParDate points={DETTE_PAR_ANNEE.map(p => ({
            cle: String(p.annee), etiquette: String(p.annee), valeur: p.valeur, montantMd: p.md,
            repere: 'repere' in p ? p.repere : undefined,
          }))} unite="% du PIB" enteteValeur="Dette / PIB" />
          <p className="dos-notule">Sources détaillées : <Source href={SOURCES.BB}>Bundesbank, historique 2019–2025</Source> · <Source href={SOURCES.EUROSTAT}>Eurostat, premier trimestre 2026</Source>.</p>
        </Figure>
      </Chapitre>

      <Chapitre id="qui-doit" titre="Qui doit la dette publique allemande ?"
        reponse={<>
          Le <b>Bund</b>, les <b>Länder</b>, les <b>communes</b> et les administrations de sécurité sociale portent la dette publique. Les prêts entre administrations sont retirés du total consolidé de Maastricht.
        </>}>
        <Figure id="dette-par-emetteur" titre="Qui a augmenté son endettement en 2025 ?"
          legende="Ces chiffres sont des variations annuelles des dettes par sous-secteur, et non les stocks respectifs des administrations. Ils ne s'additionnent pas pour reconstituer le stock consolidé, notamment à cause des opérations entre administrations."
          source={{ source: 'Deutsche Bundesbank, variations 2025', url: SOURCES.BB }} voir={[{ href: '#qui-detient', label: 'Qui détient les titres ?' }]}>
          <ChiffresGrille items={[
            { valeur: `+${montant(VARIATION_BUND.valeur, 0)}`, libelle: 'Bund et organismes rattachés : variation en 2025' },
            { valeur: `+${montant(VARIATION_LANDER.valeur, 0)}`, libelle: 'Länder : variation en 2025' },
            { valeur: `+${montant(VARIATION_COMMUNES.valeur, 0)}`, libelle: 'Communes : variation en 2025' },
          ]} />
          <p className="dos-notule">La Bundesbank signale aussi une dette des assurances sociales de {montant(DETTE_SECU_2025.valeur, 0)}, largement constituée de prêts venant du Bund, donc éliminés à la consolidation. Le montant affiché ici est celui cité par la Bundesbank pour 2025. <Source href={SOURCES.BB}>Voir le détail officiel</Source>.</p>
        </Figure>
        <Figure id="dette-par-instrument" titre="Sous quelle forme l'Allemagne est-elle endettée ?"
          legende="À la fin du premier trimestre 2026, Eurostat distingue les titres de dette, les prêts, et le numéraire ou les dépôts. Ces trois pourcentages sont rapportés au PIB, non à la dette totale : leur somme donne le ratio Maastricht."
          source={PART_TITRES_2026_T1}>
          <ChiffresGrille items={[
            { valeur: `${nf(PART_TITRES_2026_T1.valeur)} %`, libelle: 'du PIB en titres de dette' },
            { valeur: `${nf(PART_PRETS_2026_T1.valeur)} %`, libelle: 'du PIB en prêts' },
            { valeur: `${nf(PART_DEPOTS_2026_T1.valeur)} %`, libelle: 'du PIB en numéraire et dépôts' },
          ]} />
          <p className="dos-notule">Les valeurs ne sont pas des parts de la dette : le dénominateur de chacune est le PIB. <Source href={SOURCES.EUROSTAT}>Eurostat, composantes de la dette, T1 2026</Source>.</p>
        </Figure>
      </Chapitre>

      <Chapitre id="qui-detient" titre="Qui détient les obligations de l'État allemand ?"
        reponse={<>
          Les titres du <b>Bund</b> circulent entre banques, assureurs, fonds, banques centrales et investisseurs internationaux. Leur détenteur individuel n'est pas enregistré en continu : la répartition publiée par la Finanzagentur repose sur une méthode de reconstitution des transactions.
        </>}>
        <Figure id="detenteurs-dette" titre="Qui sont les investisseurs en titres fédéraux ?"
          legende="Catégories décrites par l'agence allemande de la dette. Sans chiffre exhaustif et homogène pour tous les détenteurs de l'ensemble de la dette Maastricht, aucun camembert artificiel n'est dessiné."
          source={{ source: 'Deutsche Finanzagentur, structure des investisseurs, juin 2026', url: SOURCES.INVEST }}
          voir={[{ href: '#interets', label: 'Le coût des intérêts' }]}>
          <Etapes nom="detenteurs-de" etapes={[
            { titre: 'Banques et intermédiaires', texte: 'Les banques et les courtiers peuvent conserver des titres fédéraux et contribuer à leur échange sur le marché secondaire.' },
            { titre: 'Gestionnaires, fonds et assureurs', texte: 'Les investisseurs institutionnels détiennent des Bunds selon leurs objectifs de placement et de liquidité.' },
            { titre: 'Banques centrales', texte: 'Les banques centrales peuvent détenir des titres fédéraux, notamment dans leurs portefeuilles de réserves ou liés aux opérations monétaires.' },
            { titre: 'Investisseurs internationaux', texte: 'L’agence distingue des zones géographiques, mais précise que les pourcentages de ses tableaux relèvent d’une estimation de détention, non d’un registre exhaustif.' },
          ]} />
          <p className="dos-notule">Périmètre : titres négociables du Bund ; ne pas extrapoler cette structure à toute la dette brute des administrations publiques. <Source href={SOURCES.INVEST}>Méthodologie de la Finanzagentur</Source>.</p>
        </Figure>
      </Chapitre>

      <Chapitre id="interets" titre="Combien l'Allemagne paie-t-elle d'intérêts ?"
        reponse={<>
          Toutes les administrations allemandes ont comptabilisé <b>{montant(INTERETS_APU_S1_2026.valeur,1,2026)} d'intérêts au premier semestre 2026</b>. Ce flux semestriel n'est pas le stock de dette et ne doit pas être confondu avec les intérêts du seul Bund.
        </>}>
        <Figure id="interets-dette" titre="Coût de la dette allemande, premiers semestres 2025 et 2026"
          legende="Intérêts publics en comptabilité nationale SEC 2010 sur deux périodes identiques de six mois. L'augmentation du flux d'intérêts ne correspond ni au montant du stock ni au coût de la seule dette fédérale."
          source={INTERETS_APU_S1_2026}
          voir={[{ href: '#refinancement', label: 'Comment les titres sont refinancés' }]}>
          <ChiffresGrille items={[
            { valeur: montant(INTERETS_APU_S1_2026.valeur,1,2026), libelle: 'Intérêts toutes administrations, janvier–juin 2026' },
            { valeur: montant(INTERETS_APU_S1_2025.valeur,1,2025), libelle: 'Intérêts toutes administrations, janvier–juin 2025' },
            { valeur: `+${nf(VARIATION_INTERETS_S1_2026.valeur)} %`, libelle: 'Variation semestrielle sur un an, selon Destatis' },
          ]} />
          <p className="dos-notule">Sources : <Source href={SOURCES.DESTATIS_S1}>Destatis, premier semestre 2026</Source> et <Source href={SOURCES.DESTATIS_S1_2025}>Destatis, premier semestre 2025</Source>. La Finanzagentur publie séparément les intérêts des titres fédéraux : il s'agit d'un autre périmètre et d'une autre méthode. <Source href={SOURCES.FINANZ}>Finanzagentur, méthodes de comptabilisation</Source>.</p>
        </Figure>
      </Chapitre>

      <Chapitre id="budget" titre="Qui vote le budget de l'État allemand ?"
        reponse="Le Bundestag adopte le budget fédéral par une loi. Le Bundesrat participe à la procédure législative ; la Cour fédérale des comptes contrôle l'exécution des comptes.">
        <Etapes nom="budget-de" etapes={[
          { titre: 'Le gouvernement prépare', texte: 'Le gouvernement fédéral soumet un projet de loi de finances (Haushaltsgesetz) et les crédits demandés par les ministères.' },
          { titre: 'Le Bundestag adopte', texte: 'Les députés débattent, amendent et votent les crédits et recettes du budget fédéral. Ce vote est distinct du vote des budgets des Länder.' },
          { titre: 'Le Bundesrat intervient', texte: 'La chambre représentant les Länder participe à la procédure législative et peut demander une médiation selon les conditions prévues par le droit allemand.' },
          { titre: 'La Cour fédérale contrôle', texte: 'Le Bundesrechnungshof examine les recettes, les dépenses et la gestion budgétaire ; le Bundestag exerce ensuite son contrôle parlementaire.' },
        ]} />
        <p className="dos-notule">Source : <Source href="https://www.bundestag.de/en/parliament/adoption-245712">Bundestag, Adoption of the federal budget</Source>.</p>
      </Chapitre>

      <Chapitre id="refinancement" titre="Comment l'Allemagne refinance-t-elle sa dette ?"
        reponse="Chaque titre de dette a une échéance. Le Bund refinance les titres arrivant à terme et couvre ses besoins de financement au moyen de nouvelles émissions, selon un calendrier de marché."
      >
        <Etapes nom="refinancement-de" etapes={[
          { titre: 'Le besoin à financer', chiffre: `${montant(DEFICIT_2025.valeur)} de déficit public en 2025`, texte: "Ce déficit concerne toutes les administrations, pas seulement le Bund. Le besoin de financement fédéral dépend de son propre budget, des remboursements arrivant à terme et des opérations de trésorerie." },
          { titre: 'Émission à court terme', chiffre: 'Bubills', texte: 'La Finanzagentur émet des Treasury Discount Paper à échéance généralement proche de douze mois. Le rendement provient de la différence entre prix payé et remboursement au nominal.' },
          { titre: 'Émission à moyen terme', chiffre: 'Schatz et Bobl', texte: 'Le Bund utilise les Schatz à deux ans et les Bobl à cinq ans pour répartir ses échéances.' },
          { titre: 'Émission à long terme', chiffre: 'Bunds', texte: 'Les obligations fédérales s’échelonnent notamment sur sept, dix, quinze, vingt et trente ans. Chaque souche est remboursée à son échéance, indépendamment des autres.' },
        ]} />
        <p className="dos-notule">Source : <Source href={SOURCES.EMISSIONS}>Finanzagentur, présentation des titres fédéraux</Source>.</p>
      </Chapitre>

      <Chapitre id="europe" titre="Dette publique en Europe : l'Allemagne face à ses voisins"
        reponse={<>
          Selon Eurostat, au premier trimestre 2026, l'Allemagne affiche <b>{nf(RATIO.valeur)} % du PIB</b> de dette Maastricht, contre <b>{nf(franceEurope.pct)} % en France</b>, sur le même périmètre et à la même date.
        </>}>
        <Figure id="dette-europe" titre="Dette publique rapportée au PIB, premier trimestre 2026"
          legende="Dette publique brute consolidée / PIB au premier trimestre 2026. Tous les pays et l'agrégat de l'Union européenne utilisent la même publication Eurostat du 21 juillet 2026. Données provisoires."
          source={{ source: 'Eurostat, dette Maastricht, premier trimestre 2026, 21 juillet 2026', url: SOURCES.EUROSTAT }}
          voir={[{ href: '#evolution', label: "Revoir l'évolution allemande" }]} reprise>
          <Comparaison />
        </Figure>
      </Chapitre>

      <Chapitre id="frein" titre="Comment fonctionne le frein à l'endettement allemand ?"
        reponse={<>
          La Loi fondamentale limite l'emprunt structurel. En mars 2025, une réforme a créé des dérogations pour certaines dépenses de sécurité et une autorisation de <b>{montant(FONDS_INFRASTRUCTURE.valeur, 0)}</b> pour un fonds d'infrastructures.
        </>}>
        <Figure id="frein-endettement" titre="Ce qu'a changé la réforme allemande de 2025"
          legende="La réforme constitutionnelle distingue les dépenses du budget ordinaire, certaines dépenses de défense et de sécurité, les investissements du fonds spécial et une marge structurelle nouvelle accordée aux Länder. Une autorisation n'est pas un décaissement."
          source={{ source: 'Bundestag, réforme des articles 109, 115 et 143h (18 mars 2025)', url: SOURCES.BUNDESTAG }}>
          <Etapes nom="frein-de" etapes={[
            { titre: 'Règle budgétaire', texte: 'Le frein à l’endettement reste inscrit dans la Loi fondamentale ; il porte sur le financement structurel, avec des paramètres et exceptions fixés par le droit.' },
            { titre: 'Défense et sécurité', texte: 'La réforme exclut certaines dépenses de défense et de sécurité de la limite de crédit à partir du seuil défini par le texte constitutionnel.' },
            { titre: 'Fonds spécial', chiffre: montant(FONDS_INFRASTRUCTURE.valeur, 0), texte: 'Une enveloppe d’autorisation pour des investissements supplémentaires dans les infrastructures et la neutralité climatique. Elle ne signifie pas que le montant intégral a déjà été emprunté.' },
            { titre: 'Länder', chiffre: `${nf(MARGE_LANDER.valeur,2)} % du PIB`, texte: 'La réforme introduit une marge d’emprunt structurel commune aux Länder, distincte de celle du Bund.' },
          ]} />
        </Figure>
      </Chapitre>

      <Chapitre id="questions" titre="Questions fréquentes sur la dette publique allemande"
        reponse="Montant, ratio dette/PIB, détenteurs, déficit et remboursement : les réponses ci-dessous reprennent les périmètres et les périodes de chaque source officielle.">
        <ListeQuestions questions={creerFAQ((v,d,a)=>enLettres(v,d,a))} />
        <p className="dos-notule">La FAQ et les données structurées partagent les mêmes réponses dans la devise de référence (€) ; l’affichage suit ensuite la devise choisie. Sources principales : <Source href={SOURCES.BB}>Bundesbank</Source> · <Source href={SOURCES.DESTATIS}>Destatis</Source> · <Source href={SOURCES.INVEST}>Finanzagentur</Source> · <Source href={SOURCES.EUROSTAT}>Eurostat</Source> · <Source href={SOURCES.BUNDESTAG}>Bundestag</Source>.</p>
      </Chapitre>
    </ArticleLong>
  );
}