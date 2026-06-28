import type { Article } from "@/types";

export const POLITICS_ARTICLES: Article[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // 1. DÉMOCRATIES EN RECUL
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "democratie-en-recul-2025",
    title: "La démocratie en recul mondial : 20 ans de régression politique",
    excerpt:
      "Pour la 18e année consécutive, l'Indice mondial de la démocratie recule. En 2025, moins de 45 % de la population mondiale vit dans une démocratie. Analyse des causes, des régions les plus touchées et des perspectives.",
    theme: "politics",
    publishedAt: "2025-03-15",
    readingTime: 13,
    tags: ["Démocratie", "Autoritarisme", "Indice EIU", "Droits civiques", "Liberté politique"],
    featured: true,
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Flag_of_the_United_Nations.svg/1280px-Flag_of_the_United_Nations.svg.png",
    heroCaption: "Le drapeau des Nations Unies — symbole d'un ordre international libéral aujourd'hui sous pression.",
    body: [
      {
        type: "lead",
        content:
          "En 2006, Francis Fukuyama pensait que l'histoire avait atteint sa conclusion : la démocratie libérale avait triomphé. Moins de deux décennies plus tard, son propre camp intellectuel se retrouve à documenter sa lente agonie. L'Economist Intelligence Unit, dans son rapport 2024, identifie pour la 18e année consécutive un recul des libertés démocratiques. Moins de 45 % de la population mondiale vit aujourd'hui dans une démocratie — même imparfaite. Ce n'est pas une crise. C'est une transformation structurelle du paysage politique mondial.",
      },
      {
        type: "stats",
        items: [
          { value: "44,8 %", label: "Population en démocratie", note: "EIU Democracy Index 2024" },
          { value: "18", label: "Années de recul consécutif", note: "Depuis 2006 (EIU)" },
          { value: "72", label: "Pays en recul démocratique", note: "Sur 167 évalués (2024)" },
          { value: "21", label: "Démocraties complètes", note: "Seulement 21 sur 167 pays" },
        ],
      },
      {
        type: "map-highlight",
        title: "Carte mondiale des régimes politiques — 2025",
        subtitle: "Classification EIU Democracy Index 2024 — score sur 10",
        countries: {
          NO: { color: "#1ABC9C", label: "Norvège 9,81 — #1 mondial" },
          NZ: { color: "#1ABC9C", label: "Nouvelle-Zélande 9,61" },
          SE: { color: "#1ABC9C", label: "Suède 9,39" },
          FI: { color: "#1ABC9C", label: "Finlande 9,30" },
          DK: { color: "#1ABC9C", label: "Danemark 9,28" },
          IS: { color: "#1ABC9C", label: "Islande 9,45" },
          IE: { color: "#1ABC9C", label: "Irlande 9,19" },
          NL: { color: "#1ABC9C", label: "Pays-Bas 9,00" },
          AU: { color: "#2ECC71", label: "Australie 8,86" },
          CA: { color: "#2ECC71", label: "Canada 8,69" },
          DE: { color: "#2ECC71", label: "Allemagne 8,80" },
          GB: { color: "#2ECC71", label: "Royaume-Uni 8,34" },
          FR: { color: "#2ECC71", label: "France 7,99" },
          US: { color: "#F39C12", label: "USA 7,85 — démocratie défaillante" },
          BR: { color: "#F39C12", label: "Brésil 6,86 — démocratie imparfaite" },
          IN: { color: "#F39C12", label: "Inde 7,18 — démocratie imparfaite" },
          TR: { color: "#E74C3C", label: "Turquie 4,35 — régime hybride" },
          RU: { color: "#C0392B", label: "Russie 2,22 — régime autoritaire" },
          CN: { color: "#C0392B", label: "Chine 1,94 — régime autoritaire" },
          SA: { color: "#C0392B", label: "Arabie Saoudite 1,95" },
          AF: { color: "#C0392B", label: "Afghanistan 0,32 — dernier rang" },
          HU: { color: "#E74C3C", label: "Hongrie 6,64 — régime hybride" },
          VE: { color: "#C0392B", label: "Venezuela 2,14" },
          BY: { color: "#C0392B", label: "Biélorussie 2,27" },
        },
        legend: [
          { color: "#1ABC9C", label: "Démocratie complète (8–10)" },
          { color: "#2ECC71", label: "Démocratie avancée (7–8)" },
          { color: "#F39C12", label: "Démocratie imparfaite (6–7)" },
          { color: "#E74C3C", label: "Régime hybride (4–6)" },
          { color: "#C0392B", label: "Régime autoritaire (0–4)" },
        ],
      },
      {
        type: "chart",
        title: "Scores de démocratie par grande région — EIU 2024",
        subtitle: "Moyenne régionale sur 10 — plus c'est élevé, plus la région est démocratique",
        unit: "/ 10",
        bars: [
          { label: "Europe occidentale", value: 8.42, color: "#1ABC9C", note: "Meilleure région" },
          { label: "Amérique du Nord", value: 8.27, color: "#2ECC71" },
          { label: "Amérique latine", value: 5.88, color: "#F39C12" },
          { label: "Europe de l'Est", value: 5.31, color: "#F39C12" },
          { label: "Asie & Pacifique", value: 5.46, color: "#F39C12" },
          { label: "Afrique sub-saharienne", value: 4.34, color: "#E74C3C" },
          { label: "Moyen-Orient Afrique N.", value: 3.38, color: "#C0392B", note: "Région la moins démocratique" },
        ],
      },
      {
        type: "timeline",
        title: "Chronologie du recul démocratique mondial (2000–2025)",
        items: [
          { date: "2001", title: "Post-11 septembre : sécurité vs libertés", description: "Le Patriot Act américain et ses équivalents européens créent un précédent : les gouvernements démocratiques suspendent des droits fondamentaux au nom de la sécurité nationale." },
          { date: "2008", title: "Crise financière : la démocratie perd sa légitimité économique", description: "La crise de 2008 alimente la défiance envers les élites politiques et économiques. La 'démocratie de marché' est perçue comme favorisant les banques contre le peuple." },
          { date: "2014", title: "Crimée : la démocratie ne protège plus les frontières", description: "L'annexion de la Crimée par la Russie démontre que l'ordre international libéral post-1991 ne peut être garanti sans volonté militaire." },
          { date: "2016", title: "Brexit & Trump : le populisme anti-establishment arrive au pouvoir", description: "Les élections de 2016 marquent un basculement : des partis populistes de droite nationale remportent pour la première fois des élections dans les plus grandes démocraties occidentales." },
          { date: "2019", title: "Recul du multilatéralisme", description: "Retrait américain de l'Accord de Paris, de l'UNESCO, de l'OMS. L'unilatéralisme remplace la coopération multilatérale comme mode opératoire des grandes puissances." },
          { date: "2022", title: "Invasion de l'Ukraine : choc du modèle démocratique", description: "La Russie envahit l'Ukraine. Pour les régimes autoritaires, cela démontre que la force militaire reste l'arbitre ultime des conflits, au-delà du droit international." },
          { date: "2024", title: "Annus horribilis : 4 milliards d'électeurs, résultats inquiétants", description: "L'année la plus électorale de l'histoire. Dans de nombreux pays (Bangladesh, Pakistan, Inde, Mexique, USA), les résultats alimentent les théories du complot ou sont contestés par des acteurs institutionnels." },
        ],
      },
      {
        type: "image-text",
        heading: "Les démocraties illibérales : le modèle Orbán",
        content:
          "La Hongrie de Viktor Orbán illustre une nouvelle catégorie politique : la 'démocratie illibérale'. Élu démocratiquement en 2010, Orbán a modifié la Constitution, reconfiguré la Cour constitutionnelle, mis sous contrôle les médias et l'université. Le résultat : un pays qui organise des élections régulières mais où la compétition est structurellement biaisée. Ce modèle a été copié en Pologne (partiellement corrigé en 2023), en Turquie, en Serbie. En 2025, 18 pays sont classés 'régimes hybrides' par l'EIU, contre 6 en 2000.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Viktor_Orb%C3%A1n_2018.jpg/800px-Viktor_Orb%C3%A1n_2018.jpg",
        imageAlt: "Viktor Orbán, Premier ministre hongrois — architecte du modèle de démocratie illibérale",
        flip: false,
      },
      {
        type: "comparison-table",
        title: "Comparatif : démocraties complètes vs régimes autoritaires — indicateurs clés",
        headers: ["Score démo.", "Liberté presse (RSF)", "Corruption (IPC)", "Espér. de vie"],
        rows: [
          { label: "Norvège", flag: "no", cells: ["9,81 / 10", "#2", "87 / 100", "83,2 ans"] },
          { label: "Danemark", flag: "dk", cells: ["9,28 / 10", "#1", "90 / 100", "81,4 ans"] },
          { label: "France", flag: "fr", cells: ["7,99 / 10", "#21", "71 / 100", "82,3 ans"] },
          { label: "USA", flag: "us", cells: ["7,85 / 10", "#55", "69 / 100", "76,4 ans"] },
          { label: "Turquie", flag: "tr", cells: ["4,35 / 10", "#158", "34 / 100", "76,1 ans"] },
          { label: "Russie", flag: "ru", cells: ["2,22 / 10", "#164", "26 / 100", "68,4 ans"] },
          { label: "Chine", flag: "cn", cells: ["1,94 / 10", "#172", "45 / 100", "77,1 ans"] },
          { label: "Corée du Nord", flag: "kp", cells: ["1,08 / 10", "#177", "8 / 100", "72,6 ans"] },
        ],
      },
      {
        type: "highlight",
        content:
          "Pour la première fois depuis 1945, le nombre de démocraties dans le monde recule sur trois décennies consécutives. Ce n'est pas une crise passagère : c'est une transformation structurelle. L'autorisation façon Orbán est plus dangereuse que la dictature classique — elle conserve la forme démocratique tout en vidant le fond de sa substance.",
      },
      {
        type: "list",
        heading: "Les 7 facteurs structurels du recul démocratique",
        style: "number",
        items: [
          { text: "Crise de confiance envers les élites", note: "Corruption perçue, scandales financiers, distance entre gouvernants et gouvernés" },
          { text: "Polarisation médiatique et réseaux sociaux", note: "Les algorithmes amplifient les contenus extrêmes — fragmentation du débat public" },
          { text: "Inégalités économiques croissantes", note: "Les classes moyennes appauvries se tournent vers des offres politiques protestataires" },
          { text: "Crise migratoire et identitaire", note: "La peur de l'autre devient un carburant électoral pour les partis nationalistes" },
          { text: "Affaiblissement du multilatéralisme", note: "ONU, UE, WTO : les institutions internationales perdent leur capacité d'arbitrage" },
          { text: "Désinformation et manipulation de l'espace informationnel", note: "Les campagnes de désinformation étatiques (Russie, Chine, Iran) ciblent les élections des démocraties" },
          { text: "Modèle chinois : la preuve que l'autoritarisme peut être efficace", note: "La croissance économique de la Chine invalide le postulat 'démocratie = prospérité'" },
        ],
      },
      {
        type: "quote",
        text: "La plus grande menace pour la démocratie ne vient pas des dictateurs — elle vient des démagogues que les gens élisent démocratiquement.",
        source: "Yascha Mounk, politologue, auteur de 'The People vs. Democracy', Harvard University, 2018",
      },
      {
        type: "carousel",
        title: "Les 6 pays où la démocratie a le plus reculé depuis 2010",
        items: [
          { name: "Turquie", emoji: "🇹🇷", detail: "4,35/10 en 2024", subdetail: "Score: 5,73 en 2010 → 4,35 en 2024. Purges post-coup 2016: 150 000 arrestations. 90% des médias sous contrôle gouvernemental." },
          { name: "Hongrie", emoji: "🇭🇺", detail: "6,64/10 en 2024", subdetail: "Démocratie complète en 2006 → régime hybride en 2019. Orbán contrôle 90% des médias locaux. Université CEU chassée de Budapest." },
          { name: "Inde", emoji: "🇮🇳", detail: "7,18/10 → 7,04", subdetail: "La plus grande démocratie du monde sous pression. Loi CAA discriminatoire, détention de journalistes, attaques contre les minorités." },
          { name: "Brésil", emoji: "🇧🇷", detail: "Crise 2022–2023", subdetail: "Bolsonaristes assaillent le Congrès en janvier 2023. 4 000 arrestations. Institution judiciaire résiste — démocratie sauvée de justesse." },
          { name: "Pologne", emoji: "🇵🇱", detail: "Partiellement corrigé", subdetail: "PiS (2015-2023) réforme la Cour suprême, prend le contrôle des médias. Coalition Tusk gagne 2023 et tente de restaurer l'État de droit." },
          { name: "Israël", emoji: "🇮🇱", detail: "Réforme judiciaire", subdetail: "En 2023, Netanyahou tente de retirer le contrôle de constitutionnalité à la Cour suprême. Grèves massives. Réforme suspendue puis abandonnée." },
        ],
      },
      {
        type: "text",
        heading: "Ce que les données nous disent : la démocratie est un état instable",
        content:
          "Contrairement à ce que pensait Fukuyama, la démocratie libérale n'est pas l'état naturel et stable vers lequel toutes les sociétés convergent. C'est un équilibre fragile qui demande un entretien actif : médias libres et financièrement indépendants, justice indépendante du pouvoir exécutif, partis politiques compétitifs, société civile dynamique, culture de la tolérance et du compromis. Quand l'un de ces piliers s'érode — souvent par érosion graduelle plutôt que rupture brutale — c'est l'ensemble du système qui se fragilise. La bonne nouvelle : certains pays ont su corriger le cap (Pologne 2023, Corée du Sud 2024). La démocratie peut se régénérer — mais elle ne le fait jamais automatiquement.",
      },
      {
        type: "highlight",
        content: "La démocratie ne meurt plus sous les tanks. Elle meurt en peignoir, par petites touches, via des réformes judiciaires, des lois sur les médias et des modifications constitutionnelles — légitimes en apparence, mortelles dans leurs effets.",
      },
      {
        type: "quote",
        text: "How democracies die? Not with a bang, but with a whimper — and the applause of their citizens.",
        source: "Steven Levitsky & Daniel Ziblatt, 'Comment les démocraties meurent', Harvard University Press, 2018",
      },
    ],
    sources: [
      { title: "Democracy Index 2024", outlet: "Economist Intelligence Unit (EIU)", year: "2025", url: "https://www.eiu.com/n/campaigns/democracy-index-2024/" },
      { title: "Freedom in the World 2024", outlet: "Freedom House", year: "2024", url: "https://freedomhouse.org/report/freedom-world/2024/mounting-damage-flawed-elections-and-armed-conflict" },
      { title: "How Democracies Die", outlet: "Steven Levitsky & Daniel Ziblatt, Harvard University Press", year: "2018" },
      { title: "The People vs. Democracy", outlet: "Yascha Mounk, Harvard University Press", year: "2018" },
      { title: "V-Dem Democracy Report 2024", outlet: "Varieties of Democracy Institute, University of Gothenburg", year: "2024", url: "https://v-dem.net/democracy_reports.html" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. POPULISME MONDIAL
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "populisme-montee-droite-nationaliste",
    title: "Populisme : de Trump à Meloni, l'ascension mondiale de la droite nationaliste",
    excerpt:
      "En 2024, les partis populistes de droite gouvernent ou co-gouvernent dans 30 pays. Comment un mouvement politique marginal il y a 20 ans est-il devenu la force politique dominante du 21e siècle ?",
    theme: "politics",
    publishedAt: "2025-02-20",
    readingTime: 12,
    tags: ["Populisme", "Droite nationaliste", "Trump", "Meloni", "Extrême droite"],
    featured: true,
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/CPAC_2011_Coulter.jpg/1280px-CPAC_2011_Coulter.jpg",
    heroCaption: "Rassemblement politique conservateur aux États-Unis — le populisme de droite est devenu un phénomène global.",
    body: [
      {
        type: "lead",
        content:
          "Il y a vingt ans, le Front National de Jean-Marie Le Pen était une curiosité électorale française. Aujourd'hui, sa fille préside le premier parti de France. En 2016, Donald Trump était un candidat folklorique. Il a gouverné 4 ans et revient au pouvoir en 2025. Giorgia Meloni, militante néo-fasciste dans les années 1990, est présidente du Conseil italien. Viktor Orbán rédige le manuel de la démocratie illibérale que des dizaines de gouvernements copient. Ce n'est pas une conjoncture. C'est la politique du 21e siècle.",
      },
      {
        type: "stats",
        items: [
          { value: "30+", label: "Pays gouvernés par des populistes", note: "Gouvernement ou co-gouvernement — 2024" },
          { value: "54 %", label: "Américains décrivent Trump comme 'populiste'", note: "Gallup, 2024" },
          { value: "46 %", label: "Votes RN aux législatives 2024", note: "Premier tour — France" },
          { value: "28 %", label: "Sièges extrême droite au PE", note: "Élections européennes juin 2024" },
        ],
      },
      {
        type: "map-highlight",
        title: "Gouvernements populistes de droite dans le monde — 2025",
        subtitle: "Partis populistes nationalistes au pouvoir ou co-gouvernant",
        countries: {
          US: { color: "#C0392B", label: "USA — Trump (retour 2025)" },
          IT: { color: "#C0392B", label: "Italie — Meloni (FdI) depuis 2022" },
          HU: { color: "#C0392B", label: "Hongrie — Orbán (Fidesz) depuis 2010" },
          AR: { color: "#E74C3C", label: "Argentine — Milei depuis 2023" },
          IN: { color: "#E74C3C", label: "Inde — Modi (BJP) depuis 2014" },
          TR: { color: "#E74C3C", label: "Turquie — Erdogan (AKP) depuis 2003" },
          RS: { color: "#E74C3C", label: "Serbie — Vucic (SNS) depuis 2012" },
          PH: { color: "#E74C3C", label: "Philippines — Marcos Jr. depuis 2022" },
          EL: { color: "#E74C3C", label: "El Salvador — Bukele depuis 2019" },
          SK: { color: "#E74C3C", label: "Slovaquie — Fico depuis 2023" },
          NL: { color: "#E67E22", label: "Pays-Bas — Wilders (coalition) 2024" },
          AT: { color: "#E67E22", label: "Autriche — FPÖ (coalition) 2024" },
          CH: { color: "#F39C12", label: "Suisse — UDC (premier parti)" },
          SE: { color: "#F39C12", label: "Suède — Démocrates Suédois (soutien gouvernement)" },
          FI: { color: "#F39C12", label: "Finlande — Vrais Finlandais (coalition)" },
        },
        legend: [
          { color: "#C0392B", label: "Populiste au pouvoir (exécutif)" },
          { color: "#E74C3C", label: "Populiste dominant (forte majorité)" },
          { color: "#E67E22", label: "Populiste en coalition" },
          { color: "#F39C12", label: "Populiste en soutien extérieur" },
        ],
      },
      {
        type: "chart",
        title: "Score électoral des partis populistes de droite — Élections européennes 2024",
        subtitle: "% des votes au premier tour — élections au Parlement européen, juin 2024",
        unit: "%",
        bars: [
          { label: "France (RN)", flag: "fr", value: 31.4, color: "#C0392B", note: "Marine Le Pen" },
          { label: "Italie (FdI+Lega)", flag: "it", value: 33.8, color: "#C0392B", note: "Meloni" },
          { label: "Autriche (FPÖ)", flag: "at", value: 25.4, color: "#E74C3C", note: "Kickl" },
          { label: "Pays-Bas (PVV+BBB)", flag: "nl", value: 17.0, color: "#E74C3C", note: "Wilders" },
          { label: "Belgique (VB+NVA)", flag: "be", value: 22.1, color: "#E67E22" },
          { label: "Hongrie (Fidesz)", flag: "hu", value: 44.8, color: "#C0392B", note: "Orbán" },
          { label: "Allemagne (AfD)", flag: "de", value: 15.9, color: "#E67E22" },
          { label: "Espagne (VOX+PP)", flag: "es", value: 15.2, color: "#F39C12" },
          { label: "Pologne (PiS+Conf.)", flag: "pl", value: 39.0, color: "#E74C3C" },
          { label: "Suède (SD)", flag: "se", value: 13.2, color: "#F39C12" },
        ],
      },
      {
        type: "carousel",
        title: "Les 6 figures du populisme mondial en 2025",
        items: [
          { name: "Donald Trump", emoji: "🇺🇸", detail: "47e Président des USA", subdetail: "Rhétorique anti-élite, protectionnisme, 'America First'. Élu 2016 et 2024. Mobilise un socle de 70M d'électeurs fidèles. Redéfinit le parti républicain à son image." },
          { name: "Giorgia Meloni", emoji: "🇮🇹", detail: "Présidente du Conseil italien", subdetail: "Fondatrice de Fratelli d'Italia (héritier du MSI néo-fasciste). Au pouvoir depuis oct. 2022. Rhétorique 'Dieu, Patrie, Famille'. Gère l'équilibre Europe/souverainisme." },
          { name: "Viktor Orbán", emoji: "🇭🇺", detail: "PM hongrois depuis 2010", subdetail: "Modèle de la démocratie illibérale. Contrôle 90% des médias. 4 mandats consécutifs. Principal opposant à l'intégration européenne depuis l'intérieur de l'UE." },
          { name: "Javier Milei", emoji: "🇦🇷", detail: "Président argentin depuis 2023", subdetail: "Anarcho-capitaliste libertarien. 'La tronçonneuse de l'État'. Suppression du Ministère de l'Éducation. Dollarisation de l'économie. Rhétorique anti-'caste politique'." },
          { name: "Narendra Modi", emoji: "🇮🇳", detail: "PM indien depuis 2014", subdetail: "Populisme nationaliste hindou. BJP + RSS. 3e mandat en 2024. Rhétorique identitaire contre les minorités musulmanes. Centralisation du pouvoir." },
          { name: "Marine Le Pen", emoji: "🇫🇷", detail: "Leader RN — 1er parti de France", subdetail: "A 'dédiabolisé' le Front National en 46% aux législatives 2024. Condamnée en 2025 mais en appel. RN = premier groupe de l'Assemblée nationale." },
        ],
      },
      {
        type: "image-text",
        heading: "Le laboratoire hongrois : comment Orbán a exporté son modèle",
        content:
          "En 14 ans au pouvoir, Viktor Orbán a transformé la Hongrie en laboratoire de la démocratie illibérale. Son playbook, désormais copié dans des dizaines de pays : modifier la Constitution avec une majorité des deux tiers; réformer la justice pour nommer des juges partisans; concentrer les médias dans les mains d'alliés oligarchiques; utiliser les fonds européens pour récompenser les soutiens; construire une rhétorique identitaire autour de l'immigration, du genre et du christianisme. Le résultat : une élection formellement libre où 90% des médias locaux soutiennent le gouvernement sortant. En 2024, des think tanks comme le CPAC (Conservative Political Action Conference) américain ont explicitement adopté le 'modèle Orbán' comme référence pour les droites mondiales.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Viktor_Orb%C3%A1n_2018_%28cropped%29.jpg/800px-Viktor_Orb%C3%A1n_2018_%28cropped%29.jpg",
        imageAlt: "Viktor Orbán — l'architecte du modèle de démocratie illibérale européenne",
        flip: true,
      },
      {
        type: "text",
        heading: "Pourquoi le populisme gagne : les causes profondes",
        content:
          "Le populisme n'est pas irrationnel — il est la réponse rationnelle de catégories sociales qui ont le sentiment d'avoir perdu. Perdu économiquement (désindustrialisation, précarisation), culturellement (transformations des modes de vie, des normes sociales) et politiquement (sentiment que les partis traditionnels ne les représentent plus). Les enquêtes d'opinion montrent que les électeurs populistes ne sont pas majoritairement pauvres ou peu éduqués : ce sont souvent des classes moyennes déclassées ou menacées de déclassement. La mondialisation leur a retiré la stabilité et les partis mainstream n'ont pas su proposer une réponse convaincante. Le vide a été comblé.",
      },
      {
        type: "highlight",
        content:
          "Le populisme n'est pas une maladie de la démocratie. C'est son thermomètre. Quand une large partie du corps social se sent trahie, ignorée ou méprisée par ses représentants, elle cherche des porte-voix non-conventionnels. La question n'est pas comment vaincre les populistes — c'est comment résoudre les problèmes réels qui les font émerger.",
      },
      {
        type: "quote",
        text: "Les populistes ne mentent pas toujours. Ils disent souvent des vérités partielles que les partis mainstream refusent d'énoncer — et c'est précisément leur force.",
        source: "Jan-Werner Müller, politologue, Princeton University, 'Qu'est-ce que le populisme ?', 2016",
      },
    ],
    sources: [
      { title: "Democracy Index 2024 — Populism chapter", outlet: "Economist Intelligence Unit", year: "2024" },
      { title: "What Is Populism?", outlet: "Jan-Werner Müller, Princeton University Press", year: "2016" },
      { title: "How Democracies Die", outlet: "Levitsky & Ziblatt, Harvard University Press", year: "2018" },
      { title: "Résultats élections européennes juin 2024", outlet: "Parlement européen", year: "2024", url: "https://results.elections.europa.eu" },
      { title: "Global Populism Database", outlet: "Team Populism / Brigham Young University", year: "2024" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. CHINE & RUSSIE — RÉGIMES AUTORITAIRES
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "chine-russie-regimes-autoritaires-21e-siecle",
    title: "Chine, Russie, Iran : l'axe autoritaire qui remodèle l'ordre mondial",
    excerpt:
      "La Chine de Xi Jinping, la Russie de Poutine et l'Iran des Mollahs forment un triangle d'influence qui défie l'ordre libéral occidental. Leurs modèles divergent, mais leurs intérêts convergent contre l'hégémonie américaine.",
    theme: "politics",
    publishedAt: "2025-01-10",
    readingTime: 14,
    tags: ["Chine", "Russie", "Iran", "Autoritarisme", "Géopolitique", "BRICS"],
    featured: false,
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_the_People%27s_Republic_of_China.svg/1280px-Flag_of_the_People%27s_Republic_of_China.svg.png",
    heroCaption: "Le drapeau de la République populaire de Chine — la plus grande puissance autoritaire mondiale.",
    body: [
      {
        type: "lead",
        content:
          "En 2021, Xi Jinping et Vladimir Poutine proclamaient un partenariat 'sans limites'. En 2023, la Chine, la Russie, l'Iran et leurs alliés contrôlent directement ou indirectement les ressources énergétiques, les routes commerciales et les infrastructures critiques de la moitié de la planète. Ce n'est pas un accident. C'est la construction délibérée d'un contre-ordre mondial qui rivalise avec le système libéral bâti après 1945. Ces régimes ne partagent pas les mêmes idéologies — la Chine est capitaliste d'État, la Russie est un État kleptocratique, l'Iran est une théocratie — mais ils partagent un ennemi commun : la démocratie libérale occidentale.",
      },
      {
        type: "stats",
        items: [
          { value: "1,4 Md", label: "Habitants sous régime Xi Jinping", note: "Chine — 18% de la population mondiale" },
          { value: "2,22/10", label: "Score démocratique Russie", note: "EIU 2024 — Régime autoritaire" },
          { value: "1,94/10", label: "Score démocratique Chine", note: "EIU 2024 — 2e pire région" },
          { value: "10 M+", label: "Prisonniers politiques estimés", note: "Xinjiang + Iran + Corée du Nord (HRW 2024)" },
        ],
      },
      {
        type: "map-highlight",
        title: "L'axe autoritaire et ses alliés — influence géopolitique 2025",
        subtitle: "Pays proches de la Chine/Russie ou membres des structures alternatives (BRICS, OCS, CSTO)",
        countries: {
          CN: { color: "#C0392B", label: "Chine — cœur de l'axe" },
          RU: { color: "#C0392B", label: "Russie — cœur de l'axe" },
          IR: { color: "#C0392B", label: "Iran — partenaire stratégique" },
          KP: { color: "#C0392B", label: "Corée du Nord — allié Russie" },
          BY: { color: "#E74C3C", label: "Biélorussie — État satellite russe" },
          VE: { color: "#E74C3C", label: "Venezuela — BRICS candidat" },
          CU: { color: "#E74C3C", label: "Cuba — allié historique" },
          SY: { color: "#E74C3C", label: "Syrie — sphère d'influence russe" },
          MM: { color: "#E74C3C", label: "Myanmar — juntes soutenues par Chine" },
          KZ: { color: "#E67E22", label: "Kazakhstan — OCS, neutralité relative" },
          IN: { color: "#F39C12", label: "Inde — BRICS, position ambiguë" },
          SA: { color: "#F39C12", label: "Arabie Saoudite — partenaire BRICS" },
          ZA: { color: "#F39C12", label: "Afrique du Sud — BRICS" },
          BR: { color: "#F39C12", label: "Brésil — BRICS, Lula pro-dialogue" },
          EG: { color: "#F39C12", label: "Égypte — BRICS candidat" },
          ET: { color: "#F39C12", label: "Éthiopie — BRICS nouveau membre" },
        },
        legend: [
          { color: "#C0392B", label: "Axe autoritaire central" },
          { color: "#E74C3C", label: "Alliés proches / satellites" },
          { color: "#E67E22", label: "Partenaires ambigus" },
          { color: "#F39C12", label: "BRICS — entre deux camps" },
        ],
      },
      {
        type: "comparison-table",
        title: "Portrait comparatif : Chine, Russie, Iran — 2025",
        headers: ["PIB (Mds $)", "Dépenses milit.", "Score démocratique", "Prisonniers polit."],
        rows: [
          { label: "Chine (Xi)", flag: "cn", cells: ["18 500", "296 Mds $", "1,94 / 10", "1M+ (Xinjiang)"] },
          { label: "Russie (Poutine)", flag: "ru", cells: ["2 000", "109 Mds $", "2,22 / 10", "100 000+ (guerre)"] },
          { label: "Iran (Khamenei)", flag: "ir", cells: ["380", "10 Mds $", "1,95 / 10", "50 000+ (RSF)"] },
          { label: "Corée du Nord", flag: "kp", cells: ["28 (est.)", "3,5 Mds $", "1,08 / 10", "100 000+ (camps)"] },
          { label: "Venezuela", flag: "ve", cells: ["112", "0,5 Mds $", "2,14 / 10", "10 000+ (HRW)"] },
        ],
      },
      {
        type: "timeline",
        title: "La consolidation de l'autoritarisme chinois sous Xi Jinping (2012–2025)",
        items: [
          { date: "2012", title: "Xi Jinping accède au pouvoir — rupture avec le consensus de Deng", description: "Xi met fin à la direction collective du Parti. Il cumule la présidence, la direction du PCC et la tête de la Commission militaire centrale. Début de la campagne anti-corruption (qui sert aussi à éliminer les rivaux)." },
          { date: "2015", title: "Initiative des Nouvelles Routes de la Soie (Belt & Road)", description: "Xi annonce 1 000 Mds $ d'investissements en infrastructures mondiales. Objectif réel : créer des dépendances économiques envers la Chine sur 70+ pays." },
          { date: "2017", title: "Camps de 'rééducation' au Xinjiang", description: "1 million de Ouïghours et autres minorités musulmanes sont internés. Xi l'appelle 'lutte contre le terrorisme'. Le monde l'appelle génocide culturel." },
          { date: "2018", title: "Suppression de la limite de mandats présidentiels", description: "L'Assemblée nationale populaire vote la modification constitutionnelle permettant à Xi de gouverner à vie. Xi Jinping = président à vie de facto." },
          { date: "2021", title: "'Partenariat sans limites' avec Poutine", description: "Déclaration commune sino-russe. Xi et Poutine officialise leur alliance contre l'ordre libéral occidental. 3 semaines plus tard, la Russie envahit l'Ukraine." },
          { date: "2022", title: "Hong Kong : fin du principe 'un pays, deux systèmes'", description: "Après les manifestations de 2019-2020, la Loi sur la sécurité nationale transforme Hong Kong en ville ordinaire chinoise. Tous les leaders pro-démocratie sont arrêtés ou exilés." },
          { date: "2024", title: "3e mandat et consolidation du pouvoir absolu", description: "Xi entame un 3e mandat sans précédent. L'armée, les entreprises, les universités et les médias sont directement sous la direction du Parti communiste et de Xi personnellement." },
        ],
      },
      {
        type: "image-text",
        heading: "Le modèle chinois : un autoritarisme 2.0 technologique",
        content:
          "La Chine de Xi Jinping est une forme inédite d'autoritarisme — non pas fondé sur la terreur de masse comme l'URSS de Staline, mais sur la surveillance totale rendue possible par la technologie. Système de crédit social, reconnaissance faciale dans toutes les villes, contrôle des réseaux sociaux, algorithmes qui identifient les dissidents avant qu'ils ne s'organisent : la Chine a construit le premier État de surveillance du 21e siècle. Ce modèle est exporté : Huawei vend ses systèmes de surveillance à 50+ pays africains et asiatiques, créant des 'petites Chines' numériques à travers le monde.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Tiananmen_Square_%285485219673%29.jpg/1280px-Tiananmen_Square_%285485219673%29.jpg",
        imageAlt: "La place Tiananmen, Pékin — symbole du pouvoir du Parti communiste chinois",
        flip: false,
      },
      {
        type: "highlight",
        content:
          "La grande différence entre l'autoritarisme du 20e siècle et celui du 21e siècle : la surveillance remplace la terreur. Il n'est plus nécessaire d'emprisonner tous les dissidents si on peut prédire et prévenir la dissidence avant qu'elle ne s'organise.",
      },
      {
        type: "list",
        heading: "Les outils de l'autoritarisme numérique chinois",
        style: "check",
        items: [
          { text: "700 millions de caméras de surveillance avec reconnaissance faciale — dont 600M équipées d'IA" },
          { text: "Le 'Great Firewall' bloque 2 800+ sites étrangers (Google, Facebook, Wikipedia, NYT...)" },
          { text: "WeChat : 1,3 Md d'utilisateurs — toutes les conversations sont monitorées" },
          { text: "Système de crédit social : les 'mauvais' citoyens perdent l'accès aux billets d'avion, de train, aux écoles privées" },
          { text: "50+ pays ont acheté le système de surveillance Huawei Safe City" },
          { text: "200+ journalistes et blogueurs emprisonnés en 2024 — 2e pire du monde (RSF)" },
        ],
      },
      {
        type: "quote",
        text: "La Chine n'exporte pas seulement des produits — elle exporte un modèle politique : la preuve qu'on peut être riche, stable et autoritaire simultanément. C'est son véritable défi à l'Occident.",
        source: "Minxin Pei, politologue, Claremont McKenna College, 'China's Crony Capitalism', 2016",
      },
    ],
    sources: [
      { title: "Freedom in the World 2024 — China, Russia, Iran", outlet: "Freedom House", year: "2024" },
      { title: "World Report 2024 — China", outlet: "Human Rights Watch", year: "2024", url: "https://www.hrw.org/world-report/2024/country-chapters/china" },
      { title: "Press Freedom Index 2024", outlet: "Reporters Sans Frontières (RSF)", year: "2024", url: "https://rsf.org/en/index" },
      { title: "Democracy Index 2024", outlet: "Economist Intelligence Unit", year: "2024" },
      { title: "China's Surveillance State — Analysis", outlet: "Carnegie Endowment for International Peace", year: "2024", url: "https://carnegieendowment.org" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. ÉLECTIONS 2024 — ANNÉE RECORD
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "elections-2024-annee-record-democratie",
    title: "2024 : l'année la plus électorale de l'histoire — 4 milliards de votants",
    excerpt:
      "En 2024, plus de 60 pays ont organisé des élections nationales, représentant 4 milliards d'électeurs potentiels. Une année record qui a testé les institutions démocratiques mondiales comme jamais auparavant.",
    theme: "politics",
    publishedAt: "2025-01-05",
    readingTime: 11,
    tags: ["Élections 2024", "Démocratie", "USA", "Inde", "Union européenne", "Géopolitique"],
    featured: false,
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Votation_2021_01.jpg/1280px-Votation_2021_01.jpg",
    heroCaption: "Bureau de vote en Suisse — la démocratie par l'urne, exercée par 4 milliards de personnes en 2024.",
    body: [
      {
        type: "lead",
        content:
          "Jamais autant d'êtres humains n'avaient voté la même année. En 2024, plus de 60 pays ont organisé des scrutins nationaux — présidentielles, législatives, référendums — représentant collectivement 4 milliards d'électeurs éligibles. De la plus grande démocratie du monde (Inde, 970 millions de votants) à la superpuissance américaine, en passant par les 27 pays de l'Union européenne, 2024 a mis les institutions démocratiques à l'épreuve d'une manière inédite. Et le verdict est complexe : ni triomphe, ni catastrophe — mais un signal d'alarme.",
      },
      {
        type: "stats",
        items: [
          { value: "60+", label: "Pays en élections nationales", note: "Dont USA, Inde, UE, Indonésie, Mexique, Russie" },
          { value: "4 Mds", label: "Électeurs éligibles", note: "50% de la population mondiale" },
          { value: "970 M", label: "Votants en Inde", note: "La plus grande élection de l'histoire" },
          { value: "7", label: "Leaders du G7 réélus ou en cours", note: "Instabilité au sommet des démocraties" },
        ],
      },
      {
        type: "carousel",
        title: "Les 6 élections les plus importantes de 2024",
        items: [
          { name: "USA — Novembre", emoji: "🇺🇸", detail: "Trump élu 47e président", subdetail: "Trump bat Harris 312 vs 226 grands électeurs. 77M votes Trump. Contrôle républicain du Sénat et de la Chambre. 2e mandat plus radical annoncé." },
          { name: "Inde — Avril/Mai", emoji: "🇮🇳", detail: "Modi réélu (3e mandat)", subdetail: "970M d'électeurs éligibles. Modi/BJP obtient 240 sièges — moins que prévu, dépendant de coalitions. Signal de mécontentement malgré la victoire." },
          { name: "UE — Juin", emoji: "🇪🇺", detail: "Droite renforcée, extrêmes en hausse", subdetail: "Parlement européen: PPE reste 1er parti. Droite nationale (CRE+ID) gagne 25% des sièges. Von der Leyen reconduite — pivot droite requis." },
          { name: "Mexique — Juin", emoji: "🇲🇽", detail: "Claudia Sheinbaum élue", subdetail: "1ère femme présidente de l'histoire mexicaine. Héritière de AMLO/Morena. Super-majorité au Congrès. Réforme judiciaire controversée adoptée." },
          { name: "Russie — Mars", emoji: "🇷🇺", detail: "Poutine réélu à 87%", subdetail: "Scrutin non compétitif. Navalny mort en prison 2 semaines avant. Opposition bannie. 3 candidats 'de confort' autorisés à se présenter. Fraude documentée." },
          { name: "Indonésie — Fév.", emoji: "🇮🇩", detail: "Prabowo Subianto élu", subdetail: "4e plus grande démocratie du monde. 205M d'électeurs. Ex-général controversé pour violations des droits humains. 58% des voix au 1er tour." },
        ],
      },
      {
        type: "chart",
        title: "Résultats électoraux 2024 : orientation politique des gagnants",
        subtitle: "Classification des partis victorieux dans les 10 plus grands pays en élections",
        unit: "% votes",
        bars: [
          { label: "Trump (USA)", flag: "us", value: 49.8, color: "#C0392B", note: "Droite populiste" },
          { label: "Modi (Inde)", flag: "in", value: 36.6, color: "#E67E22", note: "Natio-hindou" },
          { label: "Sheinbaum (Mexique)", flag: "mx", value: 59.4, color: "#E74C3C", note: "Gauche populiste" },
          { label: "Poutine (Russie)", flag: "ru", value: 87.3, color: "#7F8C8D", note: "Autoritaire" },
          { label: "Prabowo (Indonésie)", flag: "id", value: 58.6, color: "#E67E22", note: "Conservateur" },
          { label: "PPE (UE)", flag: "eu", value: 26.1, color: "#3498DB", note: "Centre-droit" },
          { label: "Khan rejeté (Pakistan)", flag: "pk", value: 0, color: "#BDC3C7", note: "Résultat contesté" },
          { label: "BD — Sheikh Hasina fuit", flag: "bd", value: 0, color: "#BDC3C7", note: "Coup de force" },
        ],
      },
      {
        type: "map-highlight",
        title: "Carte des grandes élections 2024 — orientation politique des résultats",
        subtitle: "Couleur politique du gouvernement élu ou reconduit en 2024",
        countries: {
          US: { color: "#C0392B", label: "USA — Trump réélu (Droite pop.)" },
          IN: { color: "#E67E22", label: "Inde — Modi 3e mandat (BJP)" },
          MX: { color: "#E74C3C", label: "Mexique — Sheinbaum (Morena)" },
          RU: { color: "#7F8C8D", label: "Russie — Poutine 87% (non-compétitif)" },
          ID: { color: "#E67E22", label: "Indonésie — Prabowo élu" },
          GB: { color: "#2980B9", label: "UK — Labour (Starmer) -juillet" },
          ZA: { color: "#E74C3C", label: "Afrique du Sud — ANC perd majorité" },
          TW: { color: "#3498DB", label: "Taïwan — DPP anti-Chine réélu" },
          IR: { color: "#7F8C8D", label: "Iran — Pezeshkian élu (modéré)" },
          VE: { color: "#C0392B", label: "Venezuela — Maduro contesté" },
          PK: { color: "#7F8C8D", label: "Pakistan — résultat contesté" },
          AT: { color: "#C0392B", label: "Autriche — FPÖ vainqueur" },
          BE: { color: "#3498DB", label: "Belgique — droite libérale" },
          LT: { color: "#2980B9", label: "Lituanie — social-démocrates" },
        },
        legend: [
          { color: "#C0392B", label: "Droite nationaliste / populiste" },
          { color: "#E67E22", label: "Conservateur / centre-droit" },
          { color: "#E74C3C", label: "Gauche populiste" },
          { color: "#2980B9", label: "Centre-gauche / libéral" },
          { color: "#7F8C8D", label: "Résultat contesté / autoritaire" },
        ],
      },
      {
        type: "image-text",
        heading: "L'élection américaine de 2024 : un séisme géopolitique mondial",
        content:
          "Le retour de Donald Trump à la Maison Blanche en janvier 2025 n'est pas qu'un événement américain. C'est un séisme géopolitique mondial. Les conséquences immédiates : remise en question du soutien américain à l'Ukraine, pression sur l'OTAN pour que les membres européens assument 3-4% du PIB en dépenses militaires, tarifs douaniers de 25-60% sur les importations de Chine et d'Europe, retrait annoncé de l'Accord de Paris sur le climat. L'Europe — Germany en particulier — se trouve face à une réalité brutale : elle ne peut plus compter sur le parapluie sécuritaire américain et doit accélérer son autonomie stratégique.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Donald_Trump_official_portrait.jpg/800px-Donald_Trump_official_portrait.jpg",
        imageAlt: "Donald Trump, 47e président des États-Unis — son retour au pouvoir redessine l'ordre géopolitique mondial",
        flip: false,
      },
      {
        type: "highlight",
        content:
          "2024 a démontré que les démocraties fonctionnent encore — elles organisent des élections, transfèrent le pouvoir (même difficilement). Mais elles produisent de plus en plus de résultats qui inquiètent leurs propres défenseurs. Ce n'est pas la fin de la démocratie : c'est sa mutation.",
      },
      {
        type: "quote",
        text: "2024 n'est pas l'année où la démocratie est morte. C'est l'année où elle s'est regardée dans le miroir et n'a pas aimé ce qu'elle y a vu.",
        source: "Anna Grzymala-Busse, politologue, Stanford University, janvier 2025",
      },
    ],
    sources: [
      { title: "Global Elections 2024 — Special Report", outlet: "Council on Foreign Relations", year: "2024", url: "https://www.cfr.org/backgrounder/what-know-about-2024-elections" },
      { title: "Elections de 2024 — Bilan mondial", outlet: "Institut National des Études Démographiques (INED)", year: "2025" },
      { title: "US Presidential Election Results 2024", outlet: "Associated Press / Reuters", year: "2024" },
      { title: "European Parliament Election Results 2024", outlet: "Parlement européen", year: "2024", url: "https://results.elections.europa.eu" },
      { title: "Indian General Election 2024 — Analysis", outlet: "The Hindu / Reuters", year: "2024" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. LIBERTÉ DE LA PRESSE
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "liberte-presse-recul-mondial-rsf-2025",
    title: "Liberté de la presse 2025 : 160 journalistes emprisonnés, 45 tués",
    excerpt:
      "L'Indice mondial de la liberté de la presse de RSF classe 180 pays. En 2025, seulement 8 % de la population mondiale vit dans des pays où la presse est libre. Gaza, Russie, Chine, Corée du Nord : les zones noires du journalisme mondial.",
    theme: "politics",
    publishedAt: "2025-05-03",
    readingTime: 10,
    tags: ["Liberté presse", "RSF", "Journalisme", "Censure", "Droits fondamentaux"],
    featured: false,
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Journalist_Award_2011.jpg/1280px-Journalist_Award_2011.jpg",
    heroCaption: "Journaliste en reportage — un métier de plus en plus dangereux dans de nombreuses régions du monde.",
    body: [
      {
        type: "lead",
        content:
          "Le 3 mai, c'est la Journée mondiale de la liberté de la presse, instituée par les Nations Unies. En 2025, il n'y a pas grand-chose à célébrer. Reporters Sans Frontières documente 45 journalistes tués dans l'exercice de leur métier, 160 emprisonnés, 50 pris en otage. La Palestine (Gaza) est désormais l'endroit le plus meurtrier pour les journalistes du monde. La Corée du Nord, la Chine et l'Érythrée ferment le trio des pires nations. Et dans les démocraties elles-mêmes — y compris la France, les États-Unis, la Hongrie — la liberté de la presse recule.",
      },
      {
        type: "stats",
        items: [
          { value: "45", label: "Journalistes tués en 2024", note: "RSF — Reporters Sans Frontières" },
          { value: "160+", label: "Journalistes emprisonnés", note: "Global Press Freedom, 2024" },
          { value: "8 %", label: "Population mondiale en presse libre", note: "RSF Index 2024 — score favorable" },
          { value: "180", label: "Pays classés par RSF", note: "Indice mondial liberté presse 2024" },
        ],
      },
      {
        type: "map-highlight",
        title: "Liberté de la presse dans le monde — Indice RSF 2024",
        subtitle: "Score RSF de 0 (pire) à 100 (meilleure liberté de presse) — Classement sur 180 pays",
        countries: {
          NO: { color: "#1ABC9C", label: "Norvège #1 — 94,84/100" },
          DK: { color: "#1ABC9C", label: "Danemark #2 — 89,23/100" },
          SE: { color: "#1ABC9C", label: "Suède #3 — 88,33/100" },
          FI: { color: "#1ABC9C", label: "Finlande #5 — 85,65/100" },
          NL: { color: "#1ABC9C", label: "Pays-Bas #7 — 78,47/100" },
          DE: { color: "#2ECC71", label: "Allemagne #10 — 77,66/100" },
          NZ: { color: "#2ECC71", label: "Nouvelle-Zélande #13" },
          FR: { color: "#F39C12", label: "France #21 — 68,07/100" },
          GB: { color: "#F39C12", label: "Royaume-Uni #23 — 67,36/100" },
          US: { color: "#F39C12", label: "USA #55 — 66,59/100" },
          UA: { color: "#E67E22", label: "Ukraine #61 (guerre)" },
          BR: { color: "#E67E22", label: "Brésil #82 — recul" },
          IN: { color: "#E74C3C", label: "Inde #159 — très dégradé" },
          TR: { color: "#E74C3C", label: "Turquie #158 — 2e pire UE" },
          HU: { color: "#E74C3C", label: "Hongrie #67 — recul démocratique" },
          RU: { color: "#C0392B", label: "Russie #164 — zone très grave" },
          CN: { color: "#C0392B", label: "Chine #172 — zone très grave" },
          IR: { color: "#C0392B", label: "Iran #176" },
          KP: { color: "#C0392B", label: "Corée du Nord #177" },
          ER: { color: "#C0392B", label: "Érythrée #180 — dernier rang" },
        },
        legend: [
          { color: "#1ABC9C", label: "Bonne situation (75–100)" },
          { color: "#2ECC71", label: "Situation satisfaisante (55–75)" },
          { color: "#F39C12", label: "Problèmes notables (40–55)" },
          { color: "#E67E22", label: "Situation difficile (25–40)" },
          { color: "#E74C3C", label: "Situation très grave (15–25)" },
          { color: "#C0392B", label: "Situation très grave (<15)" },
        ],
      },
      {
        type: "chart",
        title: "Journalistes emprisonnés par pays — Top 10 — 2024",
        subtitle: "Source : RSF & Committee to Protect Journalists (CPJ) — Données 2024",
        unit: "journalistes",
        bars: [
          { label: "Chine", flag: "cn", value: 44, color: "#C0392B", note: "#1 mondial geôlier" },
          { label: "Myanmar", flag: "mm", value: 35, color: "#C0392B" },
          { label: "Russie", flag: "ru", value: 28, color: "#C0392B" },
          { label: "Biélorussie", flag: "by", value: 28, color: "#C0392B" },
          { label: "Israël / Gaza", flag: "il", value: 20, color: "#E74C3C", note: "Contexte guerre Gaza" },
          { label: "Arabie Saoudite", flag: "sa", value: 15, color: "#E74C3C" },
          { label: "Iran", flag: "ir", value: 19, color: "#C0392B" },
          { label: "Vietnam", flag: "vn", value: 19, color: "#C0392B" },
          { label: "Azerbaïdjan", flag: "az", value: 14, color: "#E74C3C" },
          { label: "Égypte", flag: "eg", value: 13, color: "#E67E22" },
        ],
      },
      {
        type: "image-text",
        heading: "Gaza 2024 : zone la plus meurtrière pour les journalistes",
        content:
          "Entre octobre 2023 et la fin 2024, plus de 130 journalistes palestiniens ont été tués à Gaza selon RSF — un record absolu. Jamais autant de journalistes n'avaient été tués dans un seul conflit sur une période aussi courte. Le Comité de Protection des Journalistes (CPJ) a recensé des dizaines de cas où des journalistes clairement identifiés (avec press ou media inscrits sur leurs équipements) ont été frappés. Israël maintient que ces frappes ciblaient des terroristes. RSF a demandé l'ouverture d'enquêtes devant la Cour pénale internationale.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Gaza_2014_airstrike_rubble.jpg/1280px-Gaza_2014_airstrike_rubble.jpg",
        imageAlt: "Ruines à Gaza — la zone la plus meurtrière au monde pour les journalistes en 2024",
        flip: false,
      },
      {
        type: "timeline",
        title: "Les cas emblématiques de journalistes menacés (2018–2025)",
        items: [
          { date: "2018", title: "Jamal Khashoggi assassiné à Istanbul", description: "Le journaliste saoudien du Washington Post est tué par des agents saoudiens dans le consulat de Turquie. La CIA identifie MBS comme commanditaire. Pas de poursuites en Arabie Saoudite." },
          { date: "2021", title: "Pegasus : espionnage de 180+ journalistes", description: "Le logiciel espion israélien Pegasus est utilisé contre 180+ journalistes dans 45 pays, commandité par des gouvernements autoritaires mais aussi des démocraties (Maroc, Inde, Mexique)." },
          { date: "2022", title: "Shireen Abu Akleh tuée en Cisjordanie", description: "La journaliste d'Al Jazeera, citoyenne américaine, est tuée par des soldats israéliens en Cisjordanie. Les USA demandent une enquête — sans poursuites." },
          { date: "2023", title: "Evan Gershkovich emprisonné en Russie", description: "Le reporter du Wall Street Journal est arrêté à Moscou, accusé d'espionnage. Il sera libéré en août 2024 dans un échange de prisonniers." },
          { date: "2024", title: "Gaza : 130+ journalistes tués en 12 mois", description: "Record absolu de l'histoire du journalisme de guerre. RSF saisit la CPI." },
        ],
      },
      {
        type: "highlight",
        content:
          "Quand la presse meurt, la démocratie meurt en silence. Pas par un décret — par l'autocensure progressive, la précarisation économique des médias indépendants, et la noyade informationnelle dans un océan de désinformation sponsorisée par des États.",
      },
      {
        type: "quote",
        text: "Un journaliste mort n'est pas une erreur de calcul. C'est un message envoyé à tous les autres : ne cherchez pas la vérité, car c'est dangereux.",
        source: "Christophe Deloire, Secrétaire général de RSF — 2023",
      },
    ],
    sources: [
      { title: "Indice mondial de la liberté de la presse 2024", outlet: "Reporters Sans Frontières (RSF)", year: "2024", url: "https://rsf.org/en/index" },
      { title: "Prison Census 2024 — Imprisoned Journalists", outlet: "Committee to Protect Journalists (CPJ)", year: "2024", url: "https://cpj.org/data/" },
      { title: "Journalist Fatalities 2024", outlet: "IFJ — International Federation of Journalists", year: "2024", url: "https://www.ifj.org/safety/killed" },
      { title: "Pegasus: the New Arms Race — Investigation", outlet: "Forbidden Stories / Le Monde / Guardian", year: "2021" },
      { title: "Gaza Media Coverage — RSF Special Report", outlet: "Reporters Sans Frontières", year: "2024" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. MONTÉE DE L'EXTRÊME DROITE EN EUROPE
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "extreme-droite-europe-montee-2025",
    title: "L'extrême droite en Europe : de la marginalité au pouvoir (1980–2025)",
    excerpt:
      "En 2024, les partis d'extrême droite ont obtenu leur meilleur résultat historique aux élections européennes. En Italie, Autriche, Hongrie et Pays-Bas, ils gouvernent. En France, Allemagne, Espagne, ils menacent. Retour sur 40 ans de montée irrésistible.",
    theme: "politics",
    publishedAt: "2025-04-01",
    readingTime: 12,
    tags: ["Extrême droite", "Europe", "Nationalisme", "Immigration", "Partis politiques"],
    featured: true,
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Demonstration_for_far-right_politics_in_Germany.jpg/1280px-Demonstration_for_far-right_politics_in_Germany.jpg",
    heroCaption: "Manifestation nationaliste en Allemagne — l'AfD est devenu le 2e parti du pays en 2024.",
    body: [
      {
        type: "lead",
        content:
          "En 1984, Jean-Marie Le Pen réussit le 'coup' électoral du siècle en obtenant 11% aux élections européennes. Les médias parlaient d'électrochoc passager. Quarante ans plus tard, sa fille Marine Le Pen dirige le premier parti de France avec 30-35% d'intentions de vote. L'AfD est le deuxième parti allemand. Giorgia Meloni gouverne l'Italie. Le FPÖ autrichien remporte les législatives de 2024. Les Vrais Finlandais participent au gouvernement. En 2025, l'extrême droite n'est plus à la marge de la démocratie européenne : elle est dans son centre de gravité.",
      },
      {
        type: "stats",
        items: [
          { value: "28 %", label: "Sièges extrême droite au PE", note: "Élections européennes juin 2024" },
          { value: "30-35 %", label: "RN dans les sondages France", note: "Intentions de vote 2025" },
          { value: "19 %", label: "Score AfD en Allemagne", note: "Élections fédérales 2025 (1ère ronde)" },
          { value: "4", label: "Pays UE gouvernés par l'extrême droite", note: "IT, HU, NL, AT — 2025" },
        ],
      },
      {
        type: "chart",
        title: "Score électoral des partis d'extrême droite en Europe — Progression historique",
        subtitle: "% des votes aux élections nationales les plus récentes — Top 10 pays",
        unit: "%",
        bars: [
          { label: "Hongrie (Fidesz)", flag: "hu", value: 54, color: "#C0392B", note: "Au pouvoir" },
          { label: "Italie (FdI+Lega+FI)", flag: "it", value: 44, color: "#C0392B", note: "Au pouvoir — Meloni" },
          { label: "Autriche (FPÖ)", flag: "at", value: 29, color: "#C0392B", note: "Vainqueur 2024" },
          { label: "France (RN)", flag: "fr", value: 33, color: "#C0392B", note: "1er parti de France" },
          { label: "Pays-Bas (PVV+BBB)", flag: "nl", value: 24, color: "#E74C3C", note: "En coalition" },
          { label: "Pologne (PiS+Conf.)", flag: "pl", value: 39, color: "#E74C3C", note: "Opposition principale" },
          { label: "Suède (SD)", flag: "se", value: 21, color: "#E67E22", note: "Soutien gouvernement" },
          { label: "Allemagne (AfD)", flag: "de", value: 19, color: "#E74C3C", note: "+10% depuis 2021" },
          { label: "Espagne (Vox)", flag: "es", value: 12, color: "#F39C12", note: "Opposition" },
          { label: "Belgique (VB)", flag: "be", value: 22, color: "#E74C3C", note: "Opposition principale" },
        ],
      },
      {
        type: "map-highlight",
        title: "Présence de l'extrême droite dans les gouvernements européens — 2025",
        subtitle: "Partis classés extrême droite ou droite nationaliste radicale selon le CHES (Chapel Hill Expert Survey)",
        countries: {
          IT: { color: "#C0392B", label: "Italie — Meloni (FdI) au pouvoir" },
          HU: { color: "#C0392B", label: "Hongrie — Orbán (Fidesz) au pouvoir" },
          NL: { color: "#C0392B", label: "Pays-Bas — PVV en coalition" },
          AT: { color: "#C0392B", label: "Autriche — FPÖ vainqueur 2024" },
          SK: { color: "#E74C3C", label: "Slovaquie — Fico (extrême droite) PM" },
          RS: { color: "#E74C3C", label: "Serbie — SNS de Vucic" },
          SE: { color: "#E67E22", label: "Suède — SD soutient le gouvernement" },
          FI: { color: "#E67E22", label: "Finlande — Vrais Finlandais en coalition" },
          FR: { color: "#E67E22", label: "France — RN 1er parti — hors gouvernement" },
          DE: { color: "#F39C12", label: "Allemagne — AfD 2e parti — cordons sanitaires" },
          ES: { color: "#F39C12", label: "Espagne — Vox opposition principale" },
          BE: { color: "#F39C12", label: "Belgique — VB principal parti flamand" },
          PL: { color: "#E67E22", label: "Pologne — PiS opposition principale" },
          GR: { color: "#E67E22", label: "Grèce — Aube Dorée bannies, KKE, ND" },
        },
        legend: [
          { color: "#C0392B", label: "Au pouvoir (premier ministre ou coalition)" },
          { color: "#E74C3C", label: "Gouvernement ou forte influence" },
          { color: "#E67E22", label: "Premier parti sans gouverner" },
          { color: "#F39C12", label: "Opposition significative (10-25%)" },
        ],
      },
      {
        type: "timeline",
        title: "40 ans de montée de l'extrême droite européenne (1984–2025)",
        items: [
          { date: "1984", title: "Le Pen choc : 11% aux Européennes", description: "Jean-Marie Le Pen obtient 10 sièges au PE. Les commentateurs parlent d'électrochoc passager. 40 ans plus tard, le RN a 31,4%." },
          { date: "1994", title: "Berlusconi et Fini : la droite radicale entre en coalition", description: "Berlusconi fait alliance avec l'Alliance nationale post-fasciste de Fini. 1er gouvernement européen avec des néo-fascistes depuis 1945. L'Europe est choquée — puis s'habituera." },
          { date: "2002", title: "Le Pen au 2e tour — La France tremble", description: "Jean-Marie Le Pen devance Jospin pour affronter Chirac. La France se mobilise massivement contre le FN. 18 ans plus tard, les Français votent pour sa fille sans même se mobiliser." },
          { date: "2010", title: "Orbán au pouvoir : le laboratoire hongrois", description: "Fidesz remporte les élections avec 67% des sièges. Viktor Orbán commence à remodeler les institutions hongroises selon son modèle illibéral." },
          { date: "2017-2022", title: "Vague italienne : Lega, puis FdI au pouvoir", description: "Salvini (Lega) entre en coalition en 2018. Meloni (FdI) prend le pouvoir en 2022 — première femme PM d'Italie, héritière du néo-fascisme." },
          { date: "2024", title: "Record historique au Parlement européen", description: "CRE (Meloni) et ID (Le Pen) obtiennent 25% des sièges au total. Von der Leyen doit pivoter à droite pour obtenir une majorité." },
        ],
      },
      {
        type: "image-text",
        heading: "Le 'cordon sanitaire' : tenir ou rompre ?",
        content:
          "Face à la montée de l'extrême droite, les partis mainstream ont longtemps adopté une stratégie de 'cordon sanitaire' : refuser toute alliance avec les partis d'extrême droite pour les marginaliser. En Belgique, ce cordon tient depuis 1991. En Allemagne, les partis refusent de gouverner avec l'AfD. Mais en Autriche, en Italie, aux Pays-Bas, en Finlande, en Suède — le cordon a rompu. L'argument : si on ne les associe pas au pouvoir, on ne peut pas les tenir responsables. La réalité : dans tous les pays où l'extrême droite a participé au gouvernement, ses scores ont ensuite augmenté. Le cordon a une efficacité relative — mais l'alternative est pire.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Palazzo_Chigi%2C_Roma.jpg/1280px-Palazzo_Chigi%2C_Roma.jpg",
        imageAlt: "Le Palazzo Chigi, siège du gouvernement italien — dirigé par Giorgia Meloni depuis octobre 2022",
        flip: true,
      },
      {
        type: "list",
        heading: "Les 5 facteurs qui expliquent la montée de l'extrême droite européenne",
        style: "number",
        items: [
          { text: "La crise migratoire comme carburant électoral", note: "2015 : 1 million de réfugiés en Europe. Les partis nationalistes captent la peur et proposent une réponse simple à un problème complexe." },
          { text: "L'échec des partis traditionnels à tenir leurs promesses", note: "Après la crise de 2008, l'austérité imposée par des gouvernements de gauche comme de droite a fait écrouler la confiance institutionnelle." },
          { text: "Les réseaux sociaux comme amplificateurs", note: "TikTok, YouTube, X (Twitter) : les algorithmes favorisent le contenu émotionnel et extrême. L'extrême droite a été la première à maîtriser ces codes." },
          { text: "La 'normalisation' culturelle progressive", note: "Les termes, les cadres et les thèmes de l'extrême droite (invasion migratoire, grand remplacement, wokisme) ont envahi le débat mainstream en moins de 10 ans." },
          { text: "Le modèle Orbán comme preuve de faisabilité", note: "Orbán a prouvé qu'on peut gouverner un pays de l'UE de façon illibérale pendant plus d'une décennie sans être exclu. Cela a ouvert une voie que d'autres suivent." },
        ],
      },
      {
        type: "highlight",
        content:
          "L'extrême droite ne monte pas parce que les gens sont devenus racistes ou fascistes. Elle monte parce que les institutions ont failli, que les élites ont menti, et que personne d'autre n'a proposé de réponse crédible aux peurs réelles des gens. C'est une crise de représentation avant d'être une crise idéologique.",
      },
      {
        type: "quote",
        text: "Les gens ne votent pas pour l'extrême droite par idéologie — ils votent contre un système qu'ils estiment avoir été trahis par ce système. L'extrême droite n'est que le symptôme le plus visible d'une crise de confiance profonde envers les institutions démocratiques.",
        source: "Nonna Mayer, directrice de recherche CNRS, Sciences Po Paris, 2024",
      },
    ],
    sources: [
      { title: "European Parliament Elections 2024 — Results", outlet: "Parlement européen", year: "2024", url: "https://results.elections.europa.eu" },
      { title: "Chapel Hill Expert Survey (CHES) — Party Positions", outlet: "University of North Carolina", year: "2024", url: "https://www.chesdata.eu" },
      { title: "The Radical Right in Western Europe", outlet: "Piero Ignazi, Oxford University Press", year: "2006" },
      { title: "Le Front National de l'intérieur", outlet: "Nonna Mayer & Pascal Perrineau, FNSP", year: "2023" },
      { title: "Baromètre politique — Intentions de vote Europe 2025", outlet: "Kantar Public / Politico Europe", year: "2025", url: "https://www.politico.eu/europe-poll-of-polls/" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. BRICS ET ORDRE MONDIAL MULTIPOLAIRE
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "brics-ordre-mondial-multipolaire-2025",
    title: "BRICS+ et multipolarité : le monde d'après l'hégémonie américaine",
    excerpt:
      "En 2024, les BRICS ont accueilli 5 nouveaux membres et représentent 45% du PIB mondial en PPA. Chine, Russie, Inde, Brésil, Afrique du Sud et leurs alliés construisent un contre-ordre face au G7. Est-ce viable ?",
    theme: "politics",
    publishedAt: "2025-03-01",
    readingTime: 11,
    tags: ["BRICS", "Géopolitique", "Multipolarité", "Chine", "G7", "Dollar", "ONU"],
    featured: false,
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/BRICS_summit_2023_in_Johannesburg_01.jpg/1280px-BRICS_summit_2023_in_Johannesburg_01.jpg",
    heroCaption: "Sommet des BRICS 2023 à Johannesburg — l'expansion à 10 membres marque un tournant géopolitique.",
    body: [
      {
        type: "lead",
        content:
          "Le mot 'BRIC' a été inventé par Jim O'Neill de Goldman Sachs en 2001 pour désigner quatre économies émergentes prometteuses. Vingt-quatre ans plus tard, les BRICS sont devenus une organisation politique qui défie ouvertement l'ordre libéral occidental. En 2024, ils ont accueilli 5 nouveaux membres — Iran, Émirats arabes unis, Arabie saoudite, Éthiopie, Égypte — pour devenir BRICS+. Ensemble, ils représentent désormais 45% du PIB mondial en parité de pouvoir d'achat, 42% de la population mondiale et 60% des réserves de pétrole mondiales. Ce n'est plus un club de marchés émergents. C'est un contre-G7.",
      },
      {
        type: "stats",
        items: [
          { value: "45 %", label: "PIB mondial (PPA) des BRICS+", note: "2024 — contre 30% pour le G7" },
          { value: "42 %", label: "Population mondiale", note: "3,5 milliards d'habitants" },
          { value: "10", label: "Membres après l'expansion 2024", note: "Dont 5 nouveaux (Jan. 2024)" },
          { value: "60 %", label: "Réserves pétrolières mondiales", note: "OPEP+ intégré de facto" },
        ],
      },
      {
        type: "map-highlight",
        title: "BRICS+ et pays candidats ou sympathisants — 2025",
        subtitle: "Membres, candidats officiels et pays alignés avec le bloc BRICS dans les votes à l'ONU",
        countries: {
          CN: { color: "#C0392B", label: "Chine — puissance dominante du bloc" },
          RU: { color: "#C0392B", label: "Russie — co-fondatrice" },
          IN: { color: "#E74C3C", label: "Inde — membre ambigu (alliée USA aussi)" },
          BR: { color: "#E74C3C", label: "Brésil — Lula pro-dialogue Nord-Sud" },
          ZA: { color: "#E74C3C", label: "Afrique du Sud — membre fondateur" },
          IR: { color: "#C0392B", label: "Iran — nouveau membre 2024" },
          SA: { color: "#E67E22", label: "Arabie Saoudite — membre 2024 (ambigu)" },
          AE: { color: "#E67E22", label: "Émirats Arabes — membre 2024" },
          EG: { color: "#E74C3C", label: "Égypte — nouveau membre 2024" },
          ET: { color: "#E74C3C", label: "Éthiopie — nouveau membre 2024" },
          NG: { color: "#F39C12", label: "Nigeria — candidat observateur" },
          ID: { color: "#F39C12", label: "Indonésie — candidat 2024" },
          TR: { color: "#F39C12", label: "Turquie — candidat formel 2024" },
          VE: { color: "#E74C3C", label: "Venezuela — aligné BRICS" },
          CU: { color: "#E74C3C", label: "Cuba — aligné historique" },
          BY: { color: "#C0392B", label: "Biélorussie — candidat 2023" },
          PK: { color: "#F39C12", label: "Pakistan — observateur" },
        },
        legend: [
          { color: "#C0392B", label: "Membres fondateurs ou piliers" },
          { color: "#E74C3C", label: "Membres actifs BRICS+" },
          { color: "#E67E22", label: "Membres ambigus (entre deux blocs)" },
          { color: "#F39C12", label: "Candidats / observateurs" },
        ],
      },
      {
        type: "comparison-table",
        title: "BRICS+ vs G7 — Comparaison des blocs géopolitiques — 2024",
        headers: ["PIB total (PPA)", "Population", "Pétrole (Mbd)", "Membres OCS/OTAN"],
        rows: [
          { label: "BRICS+ (10)", cells: ["58 000 Mds $", "3,5 Mds", "35 Mbd", "OCS majoritaire"] },
          { label: "G7 (7)", cells: ["48 000 Mds $", "0,77 Md", "8 Mbd", "OTAN membres"] },
          { label: "G20 total", cells: ["100 000 Mds $", "4,9 Mds", "≈60 Mbd", "Chevauchement"] },
          { label: "USA seuls", cells: ["27 000 Mds $", "0,34 Md", "13 Mbd", "Leader OTAN"] },
          { label: "Chine seule", cells: ["34 000 Mds $", "1,4 Md", "5 Mbd", "Leader OCS"] },
        ],
      },
      {
        type: "timeline",
        title: "L'évolution des BRICS : du concept financier à l'organisation géopolitique",
        items: [
          { date: "2001", title: "Jim O'Neill invente l'acronyme BRIC", description: "Rapport Goldman Sachs 'Building Better Global Economic BRICs'. Vision purement économique : 4 marchés émergents prometteurs — Brésil, Russie, Inde, Chine." },
          { date: "2009", title: "1er sommet officiel des BRIC à Yekaterinburg", description: "Les 4 pays se réunissent formellement. La Chine propose la création d'une monnaie de réserve alternative au dollar. L'idée est trop audacieuse pour l'époque." },
          { date: "2010", title: "L'Afrique du Sud rejoint le bloc → BRICS", description: "Ajout politique : l'Afrique du Sud apporte une légitimité africaine. Symbole de l'ambition du Sud Global à s'unifier." },
          { date: "2014", title: "Banque de développement des BRICS (NDB) créée", description: "Alternative à la Banque mondiale — 100 Mds $ de capital. Siège à Shanghai. Ambition : financer les infrastructures du Sud Global sans conditionnalités occidentales." },
          { date: "2023", title: "Sommet historique de Johannesburg : expansion annoncée", description: "6 nouveaux pays invités. 40 pays avaient exprimé un intérêt à rejoindre. Signal fort : le Sud Global ne veut plus être exclu des décisions mondiales." },
          { date: "2024", title: "BRICS+ à 10 : l'Iran et les monarchies du Golfe rejoignent", description: "Paradoxe : l'Iran sanctionné et l'Arabie Saoudite alliée des USA sont dans le même bloc. Signe que les BRICS sont un club anti-hégémonie, pas un club idéologique." },
        ],
      },
      {
        type: "text",
        heading: "Le défi du dollar : la dédollarisation peut-elle réussir ?",
        content:
          "L'objectif central des BRICS est de réduire la dépendance au dollar américain dans les échanges internationaux. En 2024, 58% des échanges commerciaux entre membres BRICS se font déjà en monnaies locales (dont le yuan chinois). La Russie, exclue du système SWIFT, fait 90% de ses échanges avec la Chine en roubles et yuans. Cependant, créer une 'monnaie BRICS' — l'idée phare de Poutine — se heurte à une réalité : aucun des membres ne fait confiance aux autres suffisamment pour adopter une monnaie commune. L'Inde refuse de laisser la Chine dominer le système. Le dollar reste invincible à court terme — mais la tendance de long terme est à la fragmentation du système monétaire mondial.",
      },
      {
        type: "highlight",
        content:
          "Les BRICS ne sont pas anti-mondialisation. Ils sont anti-hégémonie américaine. Ils veulent une mondialisation sans 'règles' unilatéralement définies par Washington. Ce n'est pas la fin de la mondialisation — c'est sa fragmentation en plusieurs blocs avec des règles différentes.",
      },
      {
        type: "quote",
        text: "Le monde n'est pas en train de devenir moins interconnecté. Il est en train de se réorganiser autour de plusieurs centres — et l'Occident n'en sera plus qu'un parmi d'autres.",
        source: "Fareed Zakaria, journaliste et essayiste, 'The Post-American World', 2008 — préface 2024",
      },
    ],
    sources: [
      { title: "BRICS Summit 2023 — Johannesburg Declaration", outlet: "BRICS South Africa Presidency", year: "2023" },
      { title: "World Economic Outlook — Emerging Markets", outlet: "FMI", year: "2024", url: "https://www.imf.org/en/Publications/WEO" },
      { title: "The New Development Bank — Annual Report 2023", outlet: "NDB (BRICS Bank)", year: "2023", url: "https://www.ndb.int" },
      { title: "BRICS Expansion: Geopolitical Implications", outlet: "Council on Foreign Relations", year: "2024", url: "https://www.cfr.org" },
      { title: "The Post-American World — 2024 edition", outlet: "Fareed Zakaria, W.W. Norton & Company", year: "2024" },
    ],
  },
];
