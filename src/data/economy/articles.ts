import type { Article } from "@/types";

export const ECONOMY_ARTICLES: Article[] = [
  {
    slug: "pib-par-pays-2025-classement-complet",
    title: "Classement PIB par pays 2025 : les 20 premières économies mondiales",
    excerpt:
      "États-Unis (30 337 Md$), Chine (19 535 Md$), Allemagne (4 702 Md$)... Le classement complet des PIB nominaux 2025 selon les projections FMI d'avril, avec analyse des tendances.",
    theme: "economy",
    publishedAt: "2025-04-20",
    readingTime: 7,
    tags: ["PIB 2025", "Classement mondial", "FMI", "Économie mondiale", "Projections"],
    featured: true,
    heroImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Financial_district_Manhattan.jpg/1280px-Financial_district_Manhattan.jpg",
    heroCaption: "Manhattan, New York — cœur financier de la première économie mondiale.",
    body: [
      {
        type: "lead",
        content:
          "En 2025, l'économie mondiale atteint un PIB nominal de plus de 110 000 milliards de dollars selon les projections du FMI (World Economic Outlook, avril 2025). Si les États-Unis maintiennent solidement leur première place, la montée en puissance de l'Inde, l'ascension des économies du Sud-Est asiatique et le ralentissement relatif de l'Europe redessinentprofondément la hiérarchie économique mondiale.",
      },
      {
        type: "stats",
        items: [
          { value: "$30 337 Md", label: "PIB États-Unis", note: "#1 mondial" },
          { value: "$19 535 Md", label: "PIB Chine", note: "#2 mondial" },
          { value: "$4 187 Md", label: "PIB Inde", note: "+6,5% de croissance" },
          { value: "3,3%", label: "Croissance mondiale", note: "FMI prévision 2025" },
        ],
      },
      {
        type: "carousel",
        title: "Top 10 des économies mondiales en 2025",
        items: [
          { name: "États-Unis", emoji: "🇺🇸", detail: "$30 337 Mds — Rang #1", subdetail: "Portée par la tech (Apple, Microsoft, Nvidia) et une consommation intérieure robuste. Taux de chômage : 4,3%." },
          { name: "Chine", emoji: "🇨🇳", detail: "$19 535 Mds — Rang #2", subdetail: "Ralentissement de l'immobilier, mais exportations manufacturières toujours dominantes. Croissance : +4,6%." },
          { name: "Allemagne", emoji: "🇩🇪", detail: "$4 702 Mds — Rang #3", subdetail: "Première économie européenne. Après deux années de récession, reprise modérée portée par l'export industriel." },
          { name: "Japon", emoji: "🇯🇵", detail: "$4 389 Mds — Rang #4", subdetail: "Yen structurellement faible, exportateurs japonais avantagés. Dette publique : 254% du PIB." },
          { name: "Inde", emoji: "🇮🇳", detail: "$4 187 Mds — Rang #5", subdetail: "Plus forte croissance du G20 : +6,5%. Démographie favorable (1,4 Md hab.) et services numériques en plein essor." },
          { name: "Royaume-Uni", emoji: "🇬🇧", detail: "$3 587 Mds — Rang #6", subdetail: "Effets post-Brexit persistants sur les échanges avec l'UE. Reprise via la finance de la City et le secteur créatif." },
          { name: "France", emoji: "🇫🇷", detail: "$3 274 Mds — Rang #7", subdetail: "Croissance +1,1%. Dette à 113% du PIB. Luxe et aéronautique restent les moteurs d'export." },
          { name: "Italie", emoji: "🇮🇹", detail: "$2 356 Mds — Rang #8", subdetail: "Reprise post-COVID solide portée par le tourisme et le PNRR européen. Dette : 137% du PIB." },
          { name: "Brésil", emoji: "🇧🇷", detail: "$2 331 Mds — Rang #9", subdetail: "Première économie d'Amérique latine. Agri-business, pétrole (pré-sal) et commodités porteuses." },
          { name: "Canada", emoji: "🇨🇦", detail: "$2 277 Mds — Rang #10", subdetail: "Économie de ressources (énergie, mines) fortement intégrée aux États-Unis via l'ACEUM." },
        ],
      },
      {
        type: "text",
        heading: "L'ascension irrésistible de l'Inde",
        content:
          "L'Inde est devenue le symbole des reconfigurations économiques du XXIe siècle. Avec une croissance projetée à +6,5% en 2025, elle est la seule grande économie à croître aussi vite parmi le G20. Sa population de 1,4 milliard d'habitants — dont une médiane d'âge de 28 ans — constitue un réservoir de main-d'œuvre et de consommateurs sans équivalent. Le secteur des services numériques (IT, BPO) représente désormais plus de 8% du PIB, faisant de Bangalore, Hyderabad et Mumbai des pôles tech mondiaux. L'Inde devrait dépasser le Japon d'ici 2026 et le Royaume-Uni en 2027 selon les projections FMI.",
      },
      {
        type: "image-text",
        heading: "La fracture économique Nord-Sud persiste",
        content:
          "Malgré les progrès des économies émergentes, la fracture Nord-Sud reste profonde. Les 10 premières économies mondiales concentrent 65% du PIB planétaire pour seulement 40% de la population mondiale. L'Afrique subsaharienne, avec 1,4 milliard d'habitants, ne représente que 2,8% du PIB mondial. Les inégalités de productivité, d'accès aux capitaux et d'infrastructure perpétuent ce déséquilibre malgré des taux de croissance élevés dans certains pays africains (Éthiopie, Rwanda, Côte d'Ivoire). Le PIB par habitant reste l'indicateur le plus révélateur : le Luxembourg ($135 000 / hab.) pèse 150 fois plus que le Burundi ($900 / hab.).",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/GDP_per_capita_worldmap.svg/1280px-GDP_per_capita_worldmap.svg.png",
        imageAlt: "Carte mondiale du PIB par habitant",
        flip: false,
      },
      {
        type: "text",
        heading: "Le poids croissant des économies non-occidentales",
        content:
          "En 2000, les pays du G7 représentaient 65% du PIB mondial. En 2025, ce chiffre est tombé à 43%. Les BRICS+ (Brésil, Russie, Inde, Chine, Afrique du Sud, plus les nouveaux membres Arabie saoudite, Iran, Émirats, Éthiopie, Égypte) représentent désormais environ 35% du PIB mondial nominal — et plus de 40% en parité de pouvoir d'achat. Cette multipolarité économique a des conséquences géopolitiques directes : contestation du dollar comme monnaie de réserve unique, forums de gouvernance alternatifs, et nouvelles routes commerciales contournant les hubs occidentaux.",
      },
      {
        type: "highlight",
        content:
          "D'ici 2030, l'Inde devrait dépasser le Japon et se hisser au 3e rang mondial selon les projections du FMI. Pour la première fois depuis le XVIIIe siècle, trois des cinq premières économies mondiales seront asiatiques.",
      },
      {
        type: "quote",
        text: "Le centre de gravité de l'économie mondiale s'est déplacé vers l'Est et le Sud de manière structurelle. Ce n'est pas un cycle, c'est un changement de paradigme.",
        source: "FMI, World Economic Outlook, avril 2025",
      },
    ],
  },
  {
    slug: "dette-publique-france-2025-enjeux",
    title: "La dette publique française à 113% du PIB en 2025 : faut-il s'inquiéter ?",
    excerpt:
      "La France affiche une dette de 113% de son PIB en 2025. Comparée au Japon (254%), à l'Italie (137%) ou à l'Allemagne (67%), cette situation est-elle soutenable ? Analyse comparative avec les données FMI.",
    theme: "economy",
    publishedAt: "2025-04-10",
    readingTime: 9,
    tags: ["Dette France 2025", "FMI", "Finances publiques", "Zone euro", "Comparaison"],
    featured: false,
    heroImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Bercy2.jpg/1280px-Bercy2.jpg",
    heroCaption: "Le ministère de l'Économie et des Finances, à Bercy, Paris.",
    body: [
      {
        type: "lead",
        content:
          "La dette publique de la France atteint 113% de son PIB en 2025. Un chiffre qui suscite régulièrement l'inquiétude des agences de notation et des investisseurs — mais qui doit être mis en perspective avec les autres grandes économies mondiales. Car si la règle de Maastricht fixe la limite à 60%, la réalité des grands États souverains est bien plus nuancée.",
      },
      {
        type: "stats",
        items: [
          { value: "113%", label: "Dette/PIB France", note: "Projections FMI 2025" },
          { value: "254%", label: "Dette/PIB Japon", note: "Le plus endetté du G7" },
          { value: "67%", label: "Dette/PIB Allemagne", note: "Quasi-conforme Maastricht" },
          { value: "3 700 Md€", label: "Montant dette FR", note: "En valeur absolue estimée" },
        ],
      },
      {
        type: "carousel",
        title: "Dette publique : comparaison G7 et grandes économies 2025",
        items: [
          { name: "Japon", emoji: "🇯🇵", detail: "254% du PIB", subdetail: "Détenue à 90% par des investisseurs japonais (BoJ, fonds de pension). Faible risque de crise de confiance malgré le niveau record." },
          { name: "Italie", emoji: "🇮🇹", detail: "137% du PIB", subdetail: "Sous surveillance des marchés, mais BCE et mécanisme européen de stabilité limitent les risques d'une crise à la grecque." },
          { name: "États-Unis", emoji: "🇺🇸", detail: "124% du PIB", subdetail: "Dette libellée en dollars, monnaie de réserve mondiale. Le 'privilège exorbitant' préserve la confiance des marchés." },
          { name: "France", emoji: "🇫🇷", detail: "113% du PIB", subdetail: "Dégradation progressive depuis 2007 (64%). Charge d'intérêts en hausse dans un contexte de taux plus élevés post-2022." },
          { name: "Canada", emoji: "🇨🇦", detail: "106% du PIB", subdetail: "Incluant les dettes fédérale et provinciales. Économie de ressources, notation AAA maintenue." },
          { name: "Espagne", emoji: "🇪🇸", detail: "104% du PIB", subdetail: "Forte réduction depuis le pic de 120% en 2020. Croissance vigoureuse (+3,1%) facilite la consolidation." },
          { name: "Allemagne", emoji: "🇩🇪", detail: "67% du PIB", subdetail: "Pays le plus rigoureux budgétairement du G7. Frein à l'endettement constitutionnel (Schuldenbremse)." },
          { name: "Australie", emoji: "🇦🇺", detail: "36% du PIB", subdetail: "Une des dettes les plus faibles parmi les pays développés. Ressources naturelles et orthodoxie budgétaire." },
        ],
      },
      {
        type: "text",
        heading: "Ce que le ratio dette/PIB ne dit pas",
        content:
          "Le ratio dette/PIB est un indicateur pratique, mais réducteur. Ce qui importe réellement pour la soutenabilité d'une dette souveraine, c'est la capacité à la refinancer (liquidité des marchés obligataires), la devise d'émission (la France emprunte en euros, monnaie qu'elle ne contrôle pas seule), la croissance économique (qui « dilue » mécaniquement la dette dans le temps) et la confiance des investisseurs. Le Japon en est l'exemple parfait : avec 254% de dette/PIB, il emprunte à des taux proches de zéro parce que sa dette est détenue massivement par des agents nationaux (Banque du Japon, fonds de pension) dans une culture d'épargne élevée.",
      },
      {
        type: "quote",
        text: "Ce n'est pas le niveau de dette qui déclenche les crises, c'est la perte de confiance. Et la confiance se gagne par la crédibilité institutionnelle et la capacité de croissance.",
        source: "Olivier Blanchard, ancien économiste en chef du FMI",
      },
    ],
  },
  {
    slug: "pib-mondial-geopolitique-puissance",
    title: "Le PIB comme outil de puissance géopolitique",
    excerpt:
      "La richesse économique n'est pas qu'un chiffre — c'est un vecteur de pouvoir diplomatique, militaire et culturel. Décryptage de la manière dont le PIB façonne l'ordre mondial.",
    theme: "economy",
    publishedAt: "2025-03-10",
    readingTime: 10,
    tags: ["PIB", "Géopolitique", "Puissance", "États-Unis", "Chine"],
    featured: true,
    body: [
      { type: "lead", content: "Le PIB est souvent réduit à une statistique économique abstraite. C'est pourtant l'un des instruments de mesure de puissance les plus utilisés dans les chancelleries et les états-majors. Un pays riche peut financer son armée, exercer une influence diplomatique, attirer les talents mondiaux et dicter les normes économiques planétaires." },
      { type: "stats", items: [
        { value: "3,5%", label: "Budget défense USA/PIB", note: "Plus grand budget militaire mondial" },
        { value: "$13 000 Md", label: "Échanges commerciaux Chine", note: "Premier exportateur mondial" },
        { value: "44%", label: "Part du dollar", note: "Dans les réserves mondiales" },
        { value: "80%", label: "Prix mondiaux libellés en $", note: "Pétrole, matières premières" },
      ]},
      { type: "text", heading: "La relation PIB-puissance militaire", content: "Il existe une corrélation forte entre PIB et budget militaire. Les États-Unis consacrent environ 3,5% de leur PIB à la défense — soit plus de 900 milliards de dollars en 2025, davantage que les dix pays suivants réunis. La Chine, avec un budget estimé à 225 milliards (1,2% du PIB), reste très loin mais rattrape rapidement. Cette asymétrie explique pourquoi Washington peut maintenir 750 bases militaires dans 80 pays : c'est une puissance économique convertie en projection globale." },
      { type: "highlight", content: "En 2000, la Chine représentait 12% du PIB américain. En 2025, ce chiffre dépasse 64%. Cette convergence est la principale variable de la géopolitique du XXIe siècle." },
    ],
  },
  {
    slug: "dette-publique-comparaison-internationale",
    title: "La dette publique mondiale : qui doit quoi, et à qui ?",
    excerpt:
      "Le Japon dépasse 260% de dette/PIB, l'Italie 140%, les États-Unis 123%. Pourtant tous empruntent encore. Comprendre pourquoi le ratio dette/PIB ne dit pas tout.",
    theme: "economy",
    publishedAt: "2025-03-03",
    readingTime: 9,
    tags: ["Dette publique", "FMI", "Obligations", "Crise financière", "Souveraineté"],
    featured: false,
    body: [
      { type: "lead", content: "La dette publique mondiale a explosé depuis 2008 et plus encore depuis 2020. Pourtant, les crises de la dette ne sont pas automatiques. Ce qui déclenche une crise, ce n'est pas un ratio, c'est une perte de confiance." },
      { type: "stats", items: [
        { value: "254%", label: "Japon", note: "Record G7" }, { value: "137%", label: "Italie", note: "Surveillance BCE" },
        { value: "124%", label: "États-Unis", note: "Monnaie réserve" }, { value: "67%", label: "Allemagne", note: "Discipline budgétaire" },
      ]},
    ],
  },
  {
    slug: "chomage-inegalites-marches-travail",
    title: "Chômage mondial : les grandes fractures du marché du travail",
    excerpt:
      "Afrique du Sud à 32%, Europe du Nord sous 3% : les disparités de chômage révèlent des structures économiques et sociales radicalement différentes.",
    theme: "economy",
    publishedAt: "2025-02-24",
    readingTime: 8,
    tags: ["Chômage", "Marché du travail", "Inégalités", "OCDE", "OIT"],
    featured: false,
    body: [
      { type: "lead", content: "Le taux de chômage est l'un des indicateurs économiques les plus politiquement sensibles. Il mesure la fracture entre ceux qui participent à l'économie formelle et ceux qui en sont exclus — avec toutes les nuances que les méthodologies nationales ne capturent pas." },
      { type: "stats", items: [
        { value: "32%", label: "Chômage Afrique du Sud", note: "Le plus élevé au monde" },
        { value: "2,8%", label: "Chômage Japon", note: "Plein emploi quasi-structurel" },
        { value: "7,4%", label: "Chômage France", note: "Données FMI 2025" },
        { value: "4,3%", label: "Chômage États-Unis", note: "Proche plein emploi" },
      ]},
    ],
  },
  {
    slug: "chine-usa-guerre-economique-decennie",
    title: "Chine vs États-Unis : la grande rivalité économique de notre siècle",
    excerpt:
      "En 2000, la Chine représentait 12% du PIB américain. En 2025, 64%. Cette ascension fulgurante a redessiné les alliances mondiales et déclenché une guerre technologique sans précédent.",
    theme: "economy",
    publishedAt: "2025-02-17",
    readingTime: 12,
    tags: ["Chine", "États-Unis", "Guerre économique", "Technologie", "Géopolitique"],
    featured: false,
    body: [
      { type: "lead", content: "Aucune rivalité géopolitique ne définit autant le XXIe siècle que celle entre Washington et Pékin. Ce n'est pas seulement une compétition économique : c'est une bataille pour les standards technologiques, les chaînes d'approvisionnement mondiales, les normes monétaires et l'influence sur les pays du Sud global." },
      { type: "stats", items: [
        { value: "12%", label: "PIB Chine / USA en 2000", note: "Rapport de force d'alors" },
        { value: "64%", label: "PIB Chine / USA en 2025", note: "Convergence spectaculaire" },
        { value: "$600 Md+", label: "Taxes et sanctions mutuelles", note: "Guerre commerciale 2018–2025" },
        { value: "2030", label: "Dépassement possible", note: "Si tendances maintenues (PPA)" },
      ]},
    ],
  },
  {
    slug: "entreprises-geants-economie-mondiale",
    title: "Les géants technologiques et leur poids sur l'économie mondiale",
    excerpt:
      "Apple, Microsoft, Amazon : les 10 plus grandes entreprises mondiales pèsent autant que le PIB de plusieurs continents réunis. Leur puissance redéfinit les règles du capitalisme.",
    theme: "economy",
    publishedAt: "2025-02-10",
    readingTime: 9,
    tags: ["Entreprises", "Big Tech", "Capitalisme", "Monopoles", "Régulation"],
    featured: false,
    body: [
      { type: "lead", content: "La capitalisation boursière d'Apple dépasse le PIB de l'Allemagne. Nvidia, en 2024–2025, a connu la plus forte création de valeur boursière de l'histoire humaine en deux ans. Ces chiffres illustrent un phénomène inédit : la concentration de valeur économique dans un nombre infime d'entreprises technologiques." },
      { type: "stats", items: [
        { value: "$3 500 Md", label: "Capitalisation Apple", note: "Plus grande capi mondiale" },
        { value: "$3 300 Md", label: "Capitalisation Nvidia", note: "IA / semi-conducteurs" },
        { value: "7", label: "Magnificent Seven USA", note: "Représentent 30% du S&P500" },
        { value: "21%", label: "Part BigTech dans PIB USA", note: "Valeur ajoutée estimée" },
      ]},
    ],
  },
  {
    slug: "covid-impact-economique-cartographie",
    title: "COVID-19 : cartographie de l'impact économique mondial en 2020",
    excerpt:
      "La contraction de -3,5% du PIB mondial en 2020 masque des réalités très hétérogènes : certains pays ont rebondi en quelques mois, d'autres s'en remettent encore.",
    theme: "economy",
    publishedAt: "2025-02-03",
    readingTime: 8,
    tags: ["COVID-19", "Récession", "PIB", "Politique économique", "Relance"],
    featured: false,
    body: [
      { type: "lead", content: "En 2020, le PIB mondial s'est contracté de 3,5% — la plus forte récession depuis la Seconde Guerre mondiale. Mais derrière ce chiffre global se cachent des trajectoires radicalement différentes : la Chine a terminé l'année en territoire positif (+2,3%), tandis que certaines économies ouvertes au tourisme ont vu leur PIB chuter de plus de 10%." },
      { type: "stats", items: [
        { value: "-3,5%", label: "Contraction PIB mondial", note: "Pire depuis 1945" },
        { value: "+2,3%", label: "Croissance Chine 2020", note: "Seul grand pays en positif" },
        { value: "-11%", label: "PIB Espagne 2020", note: "Tourisme détruit" },
        { value: "$16 000 Md", label: "Plans de relance mondiaux", note: "Gouvernements + banques centrales" },
      ]},
    ],
  },
];
