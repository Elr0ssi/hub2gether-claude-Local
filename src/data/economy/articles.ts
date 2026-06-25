import type { Article } from "@/types";

export const ECONOMY_ARTICLES: Article[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // 1. PIB PAR PAYS 2025
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "pib-par-pays-2025-classement-complet",
    title: "Classement PIB par pays 2025 : les 20 premières économies mondiales",
    excerpt:
      "États-Unis (30 337 Md€), Chine (19 535 Md€), Allemagne (4 460 Md€)... Le classement complet des PIB nominaux 2025 selon les projections FMI d'avril, avec analyse des tendances et cartes.",
    theme: "economy",
    publishedAt: "2025-04-20",
    readingTime: 11,
    tags: ["PIB 2025", "Classement mondial", "FMI", "Économie mondiale", "Projections"],
    featured: true,
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Financial_district_Manhattan.jpg/1280px-Financial_district_Manhattan.jpg",
    heroCaption: "Manhattan, New York — cœur financier de la première économie mondiale.",
    body: [
      {
        type: "lead",
        content:
          "En 2025, l'économie mondiale atteint un PIB nominal estimé à plus de 110 000 milliards de dollars selon les projections du FMI (World Economic Outlook, avril 2025). Si les États-Unis maintiennent solidement leur première place avec 30 337 milliards d'euros, la montée en puissance de l'Inde, l'ascension des économies du Sud-Est asiatique et le ralentissement relatif de l'Europe redessinant profondément la hiérarchie économique mondiale.",
      },
      {
        type: "stats",
        items: [
          { value: "30 337 Md€", label: "PIB États-Unis", note: "#1 mondial 2025" },
          { value: "19 535 Md€", label: "PIB Chine", note: "#2 mondial, +4,6%" },
          { value: "4 187 Md€", label: "PIB Inde", note: "#5 mondial, +6,5%" },
          { value: "3,3 %", label: "Croissance mondiale", note: "Prévision FMI 2025" },
        ],
      },
      {
        type: "chart",
        title: "PIB nominal des 15 premières économies mondiales — 2025",
        subtitle: "Projections FMI, World Economic Outlook avril 2025",
        unit: "Milliards €",
        bars: [
          { label: "États-Unis", flag: "us", value: 30337, color: "#C0392B", note: "#1" },
          { label: "Chine", flag: "cn", value: 19535, color: "#E74C3C", note: "#2" },
          { label: "Allemagne", flag: "de", value: 4460, color: "#2980B9", note: "#3" },
          { label: "Japon", flag: "jp", value: 4300, color: "#8E44AD", note: "#4" },
          { label: "Inde", flag: "in", value: 3900, color: "#F39C12", note: "#5" },
          { label: "Royaume-Uni", flag: "gb", value: 3587, color: "#27AE60", note: "#6" },
          { label: "France", flag: "fr", value: 3274, color: "#1ABC9C", note: "#7" },
          { label: "Italie", flag: "it", value: 2356, color: "#16A085", note: "#8" },
          { label: "Brésil", flag: "br", value: 2331, color: "#D35400", note: "#9" },
          { label: "Canada", flag: "ca", value: 2277, color: "#2ECC71", note: "#10" },
          { label: "Russie", flag: "ru", value: 1980, color: "#7F8C8D", note: "#11" },
          { label: "Corée du Sud", flag: "kr", value: 1760, color: "#3498DB", note: "#12" },
          { label: "Australie", flag: "au", value: 1720, color: "#E67E22", note: "#13" },
          { label: "Espagne", flag: "es", value: 1610, color: "#9B59B6", note: "#14" },
          { label: "Mexique", flag: "mx", value: 1480, color: "#E91E63", note: "#15" },
        ],
      },
      {
        type: "map-highlight",
        title: "Carte des grandes puissances économiques mondiales — 2025",
        subtitle: "PIB nominal, projections FMI. Intensité de couleur = poids économique.",
        countries: {
          us: { color: "#C0392B", label: "30 337 Md€ (#1)" },
          cn: { color: "#E74C3C", label: "19 535 Md€ (#2)" },
          de: { color: "#2980B9", label: "4 460 Md€ (#3)" },
          jp: { color: "#8E44AD", label: "4 300 Md€ (#4)" },
          in: { color: "#F39C12", label: "3 900 Md€ (#5)" },
          gb: { color: "#27AE60", label: "3 587 Md€ (#6)" },
          fr: { color: "#1ABC9C", label: "3 274 Md€ (#7)" },
          it: { color: "#16A085", label: "2 356 Md€ (#8)" },
          br: { color: "#D35400", label: "2 331 Md€ (#9)" },
          ca: { color: "#2ECC71", label: "2 277 Md€ (#10)" },
          ru: { color: "#95A5A6", label: "1 980 Md€ (#11)" },
          kr: { color: "#3498DB", label: "1 760 Md€ (#12)" },
          au: { color: "#E67E22", label: "1 720 Md€ (#13)" },
          es: { color: "#9B59B6", label: "1 610 Md€ (#14)" },
          mx: { color: "#E91E63", label: "1 480 Md€ (#15)" },
        },
        legend: [
          { color: "#C0392B", label: "> 20 000 Md€ (Hyper-puissance)" },
          { color: "#E74C3C", label: "10 000–20 000 Md€ (Superpuissance)" },
          { color: "#3498DB", label: "2 000–10 000 Md€ (Grande puissance)" },
          { color: "#27AE60", label: "1 000–2 000 Md€ (Puissance régionale)" },
          { color: "#95A5A6", label: "< 1 000 Md€ (Économie intermédiaire)" },
        ],
      },
      {
        type: "carousel",
        title: "Portraits des 10 premières économies mondiales en 2025",
        items: [
          {
            name: "États-Unis",
            emoji: "🇺🇸",
            detail: "30 337 Mds€ — Rang #1",
            subdetail:
              "Portée par la tech (Apple, Microsoft, Nvidia) et une consommation intérieure robuste. Taux de chômage : 3,7%. Le dollar demeure la principale monnaie de réserve mondiale (44% des réserves).",
          },
          {
            name: "Chine",
            emoji: "🇨🇳",
            detail: "19 535 Mds€ — Rang #2",
            subdetail:
              "Ralentissement de l'immobilier (crise Evergrande encore présente), mais exportations manufacturières toujours dominantes. Croissance : +4,6%. Deuxième économie mondiale depuis 2010.",
          },
          {
            name: "Allemagne",
            emoji: "🇩🇪",
            detail: "4 460 Mds€ — Rang #3",
            subdetail:
              "Première économie européenne. Après deux années de récession technique (2023-2024), reprise modérée portée par l'export industriel (automobile, machines-outils, chimie).",
          },
          {
            name: "Japon",
            emoji: "🇯🇵",
            detail: "4 300 Mds€ — Rang #4",
            subdetail:
              "Yen structurellement faible depuis 2022, ce qui avantage les exportateurs (Toyota, Sony, Canon). Vieillissement démographique comme principal défi économique long terme.",
          },
          {
            name: "Inde",
            emoji: "🇮🇳",
            detail: "3 900 Mds€ — Rang #5",
            subdetail:
              "Plus forte croissance du G20 : +6,5%. Démographie favorable (1,44 Md hab., âge médian 28 ans) et services numériques en plein essor. Bangalore, hub IT mondial.",
          },
          {
            name: "Royaume-Uni",
            emoji: "🇬🇧",
            detail: "3 587 Mds€ — Rang #6",
            subdetail:
              "Effets post-Brexit persistants sur les échanges avec l'UE (-15% d'exports estimés). Mais la finance de la City et le secteur créatif maintiennent le rang.",
          },
          {
            name: "France",
            emoji: "🇫🇷",
            detail: "3 274 Mds€ — Rang #7",
            subdetail:
              "Croissance +1,1%. Dette à 113% du PIB. Luxe (LVMH, Hermès) et aéronautique (Airbus) restent les moteurs d'export. Déficit public persistant sous pression des marchés.",
          },
          {
            name: "Italie",
            emoji: "🇮🇹",
            detail: "2 356 Mds€ — Rang #8",
            subdetail:
              "Reprise post-COVID solide portée par le tourisme (+80 millions de visiteurs/an) et le PNRR européen (200 Md€). Dette : 137% du PIB, sous surveillance BCE.",
          },
          {
            name: "Brésil",
            emoji: "🇧🇷",
            detail: "2 331 Mds€ — Rang #9",
            subdetail:
              "Première économie d'Amérique latine. Agri-business (1er exportateur mondial de soja, café, sucre), pétrole pré-sal et commodités minières. Croissance +2,9%.",
          },
          {
            name: "Canada",
            emoji: "🇨🇦",
            detail: "2 277 Mds€ — Rang #10",
            subdetail:
              "Économie de ressources (énergie, mines, bois) fortement intégrée aux États-Unis via l'ACEUM. Forte immigration (+500 000/an) soutient la demande intérieure.",
          },
        ],
      },
      {
        type: "text",
        heading: "L'ascension irrésistible de l'Inde",
        content:
          "L'Inde est devenue le symbole des reconfigurations économiques du XXIe siècle. Avec une croissance projetée à +6,5% en 2025, elle est la seule grande économie à croître aussi vite parmi le G20. Sa population de 1,44 milliard d'habitants — dont une médiane d'âge de 28 ans seulement — constitue un réservoir de main-d'œuvre et de consommateurs sans équivalent mondial. Le secteur des services numériques (IT, BPO, fintech) représente désormais plus de 8% du PIB indien, faisant de Bangalore, Hyderabad et Pune des pôles tech reconnus mondialement. L'Inde devrait dépasser le Japon d'ici 2026 et le Royaume-Uni en 2027 selon les projections FMI. Premier exportateur mondial d'acier en 2024, elle investit également massivement dans les énergies renouvelables (500 GW solaire d'ici 2030).",
      },
      {
        type: "comparison-table",
        title: "Comparatif : PIB, croissance et dette des G7 en 2025",
        headers: ["Pays", "PIB nominal", "Croissance 2025", "Dette/PIB", "Chômage"],
        rows: [
          { label: "États-Unis", flag: "us", cells: ["30 337 Md€", "+2,7%", "123%", "3,7%"] },
          { label: "Chine", flag: "cn", cells: ["19 535 Md€", "+4,6%", "52%", "5,2%"] },
          { label: "Allemagne", flag: "de", cells: ["4 460 Md€", "+0,9%", "64%", "3,0%"] },
          { label: "Japon", flag: "jp", cells: ["4 300 Md€", "+1,0%", "254%", "2,6%"] },
          { label: "Inde", flag: "in", cells: ["3 900 Md€", "+6,5%", "83%", "7,9%"] },
          { label: "France", flag: "fr", cells: ["3 274 Md€", "+1,1%", "113%", "7,3%"] },
          { label: "Italie", flag: "it", cells: ["2 356 Md€", "+0,7%", "137%", "6,7%"] },
          { label: "Brésil", flag: "br", cells: ["2 331 Md€", "+2,9%", "90%", "6,9%"] },
        ],
      },
      {
        type: "image-text",
        heading: "La fracture économique Nord-Sud persiste",
        content:
          "Malgré les progrès des économies émergentes, la fracture Nord-Sud reste profonde. Les 10 premières économies mondiales concentrent 65% du PIB planétaire pour seulement 40% de la population mondiale. L'Afrique subsaharienne, avec 1,4 milliard d'habitants, ne représente que 2,8% du PIB mondial. Les inégalités de productivité, d'accès aux capitaux et d'infrastructure perpétuent ce déséquilibre. Le PIB par habitant reste l'indicateur le plus révélateur : le Luxembourg (135 000 € / hab.) pèse 150 fois plus que le Burundi (900 € / hab.).",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/GDP_per_capita_worldmap.svg/1280px-GDP_per_capita_worldmap.svg.png",
        imageAlt: "Carte mondiale du PIB par habitant",
        flip: false,
      },
      {
        type: "list",
        heading: "Les 5 tendances structurelles qui reconfigurent le classement mondial",
        style: "number",
        items: [
          {
            text: "L'essor de l'Inde",
            note: "Seule économie du G20 à croître durablement à +6% par an. Devrait atteindre le rang #3 d'ici 2030.",
          },
          {
            text: "Le ralentissement européen",
            note: "L'Allemagne, la France et l'Italie sous-performent vs les moyennes mondiales. Défis énergétiques, démographiques et d'innovation.",
          },
          {
            text: "La montée des ASEAN",
            note: "Vietnam, Indonésie, Philippines et Thaïlande captent les délocalisations industrielles depuis la Chine (+15% d'IDE en 2024).",
          },
          {
            text: "La fragmentation géoéconomique",
            note: "« Reshoring » et « friendshoring » des chaînes de valeur fragmentent le commerce mondial et réduisent les gains de l'hypermondialisation.",
          },
          {
            text: "La prime IA aux économies technologiques",
            note: "Les pays maîtrisant l'IA (USA, Chine, UK, Corée) captent une valeur ajoutée disproportionnée dans la course à la productivité numérique.",
          },
        ],
      },
      {
        type: "highlight",
        content:
          "D'ici 2030, l'Inde devrait dépasser le Japon et se hisser au 3e rang mondial selon les projections du FMI. Pour la première fois depuis le XVIIIe siècle, trois des cinq premières économies mondiales seront asiatiques.",
      },
      {
        type: "quote",
        text: "Le centre de gravité de l'économie mondiale s'est déplacé vers l'Est et le Sud de manière structurelle. Ce n'est pas un cycle conjoncturel, c'est un changement de paradigme séculaire.",
        source: "FMI, World Economic Outlook, avril 2025",
      },
      {
        type: "gallery",
        title: "Les centres économiques du monde en images",
        images: [
          {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Financial_district_Manhattan.jpg/1280px-Financial_district_Manhattan.jpg",
            caption: "Manhattan, New York — le quartier financier de la première économie mondiale",
            credit: "Wikimedia Commons",
          },
          {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Camponotus_flavomarginatus_ant.jpg/1280px-Camponotus_flavomarginatus_ant.jpg",
            caption: "Shanghai Pudong — vitrine architecturale de l'essor économique chinois",
            credit: "Wikimedia Commons",
          },
          {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Frankfurt_am_Main_-_Skyline_%28Simon_Waldherr%29_edit.jpg/1280px-Frankfurt_am_Main_-_Skyline_%28Simon_Waldherr%29_edit.jpg",
            caption: "Francfort — capitale financière de la zone euro et siège de la BCE",
            credit: "Wikimedia Commons / Simon Waldherr",
          },
        ],
      },
    ],
    sources: [
        { title: "World Economic Outlook, April 2025", outlet: "FMI", year: "2025", url: "https://www.imf.org/en/Publications/WEO" },
        { title: "World Development Indicators", outlet: "Banque mondiale", year: "2024", url: "https://data.worldbank.org" },
        { title: "GDP and main aggregates — National accounts", outlet: "Eurostat", year: "2025" },
        { title: "Perspectives de l'économie mondiale", outlet: "OCDE", year: "2025", url: "https://stats.oecd.org" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. DETTE PUBLIQUE FRANCE 2025
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "dette-publique-france-2025-enjeux",
    title: "La dette publique française à 113 % du PIB en 2025 : faut-il s'inquiéter ?",
    excerpt:
      "La France affiche une dette de 113 % de son PIB en 2025. Comparée au Japon (254 %), à l'Italie (137 %) ou à l'Allemagne (64 %), cette situation est-elle soutenable ? Analyse comparative avec les données FMI.",
    theme: "economy",
    publishedAt: "2025-04-10",
    readingTime: 12,
    tags: ["Dette France 2025", "FMI", "Finances publiques", "Zone euro", "Comparaison"],
    featured: false,
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Bercy2.jpg/1280px-Bercy2.jpg",
    heroCaption: "Le ministère de l'Économie et des Finances, à Bercy, Paris.",
    body: [
      {
        type: "lead",
        content:
          "La dette publique de la France atteint 113 % de son PIB en 2025, soit environ 3 250 milliards d'euros. Un chiffre qui suscite régulièrement l'inquiétude des agences de notation et des investisseurs — mais qui doit être mis en perspective avec les autres grandes économies mondiales. Car si la règle de Maastricht fixe la limite à 60 %, la réalité des grands États souverains est bien plus nuancée.",
      },
      {
        type: "stats",
        items: [
          { value: "113 %", label: "Dette/PIB France 2025", note: "Projections FMI" },
          { value: "254 %", label: "Japon — record G7", note: "Pourtant taux bas" },
          { value: "64 %", label: "Allemagne", note: "Quasi-conforme Maastricht" },
          { value: "3 250 Md€", label: "Dette France valeur abs.", note: "Estimation 2025" },
        ],
      },
      {
        type: "chart",
        title: "Ratio dette publique / PIB — comparaison internationale 2025",
        subtitle: "Données FMI, World Economic Outlook avril 2025 (% du PIB)",
        unit: "% du PIB",
        bars: [
          { label: "Japon", flag: "jp", value: 254, color: "#8E44AD", note: "Détenue à 90% par résidents" },
          { label: "Grèce", flag: "gr", value: 161, color: "#C0392B", note: "Post-crise 2010" },
          { label: "Italie", flag: "it", value: 137, color: "#E74C3C", note: "Sous surveillance BCE" },
          { label: "Singapour", flag: "sg", value: 134, color: "#7F8C8D", note: "Dette comptable, excédentaire en réel" },
          { label: "États-Unis", flag: "us", value: 123, color: "#D35400", note: "Monnaie de réserve" },
          { label: "France", flag: "fr", value: 113, color: "#2980B9", note: "En hausse depuis 2007" },
          { label: "Espagne", flag: "es", value: 104, color: "#9B59B6", note: "En baisse (était 120%)" },
          { label: "Belgique", flag: "be", value: 103, color: "#F39C12", note: "Stable" },
          { label: "Canada", flag: "ca", value: 106, color: "#27AE60", note: "Fédéral + provinces" },
          { label: "Royaume-Uni", flag: "gb", value: 102, color: "#16A085", note: "Post-Brexit" },
          { label: "Brésil", flag: "br", value: 90, color: "#1ABC9C", note: "Émergent endetté" },
          { label: "Allemagne", flag: "de", value: 64, color: "#2ECC71", note: "Schuldenbremse" },
          { label: "Pays-Bas", flag: "nl", value: 48, color: "#E67E22", note: "Très vertueux" },
          { label: "Australie", flag: "au", value: 36, color: "#3498DB", note: "Faible dette" },
          { label: "Suède", flag: "se", value: 33, color: "#E91E63", note: "Excédent budgétaire" },
        ],
      },
      {
        type: "timeline",
        title: "L'évolution de la dette publique française depuis 1980",
        items: [
          {
            date: "1980",
            title: "20 % du PIB",
            description:
              "La France maintient une dette modeste, conformément aux standards budgétaires de l'époque keynésienne.",
          },
          {
            date: "1993",
            title: "35 % du PIB — premier choc",
            description:
              "La récession de 1993 et les dépenses sociales creusent le déficit. Première prise de conscience de la dérive.",
          },
          {
            date: "2007",
            title: "64 % du PIB — seuil de Maastricht dépassé",
            description:
              "À la veille de la crise financière mondiale, la France dépasse déjà la règle des 60 % de Maastricht.",
          },
          {
            date: "2010",
            title: "82 % du PIB — après la crise de 2008",
            description:
              "Les plans de relance post-crise financière et la chute des recettes fiscales propulsent la dette.",
          },
          {
            date: "2020",
            title: "114 % du PIB — COVID-19",
            description:
              "Le « quoi qu'il en coûte » de Macron : 70 milliards de dépenses supplémentaires pour sauvegarder l'économie.",
          },
          {
            date: "2025",
            title: "113 % du PIB — stabilisation fragile",
            description:
              "Légère décrue liée à l'inflation (qui gonfle le PIB nominal), mais déficit persistant à -5,5% du PIB.",
          },
        ],
      },
      {
        type: "text",
        heading: "Ce que le ratio dette/PIB ne dit pas",
        content:
          "Le ratio dette/PIB est un indicateur pratique, mais réducteur. Ce qui importe réellement pour la soutenabilité d'une dette souveraine, c'est la capacité à la refinancer (liquidité des marchés obligataires), la devise d'émission (la France emprunte en euros, monnaie qu'elle ne contrôle pas seule), la croissance économique (qui « dilue » mécaniquement la dette dans le temps), et la confiance des investisseurs. Le Japon en est l'exemple parfait : avec 254 % de dette/PIB, il emprunte à des taux proches de zéro parce que sa dette est détenue à 90 % par des agents nationaux (Banque du Japon, fonds de pension). La France, elle, est détenue à environ 55 % par des non-résidents — d'où une vulnérabilité plus grande aux variations de sentiment des marchés.",
      },
      {
        type: "comparison-table",
        title: "Qui détient la dette souveraine ? Structure de détention comparative",
        headers: ["Pays", "Part résidents", "Part non-résidents", "Part banque centrale", "Taux moyen emprunt"],
        rows: [
          { label: "Japon", flag: "jp", cells: ["~90%", "~10%", "~55% (BoJ)", "0,8%"] },
          { label: "États-Unis", flag: "us", cells: ["~70%", "~30%", "~18% (Fed)", "4,2%"] },
          { label: "France", flag: "fr", cells: ["~45%", "~55%", "~27% (BCE)", "3,1%"] },
          { label: "Allemagne", flag: "de", cells: ["~55%", "~45%", "~30% (BCE)", "2,5%"] },
          { label: "Italie", flag: "it", cells: ["~65%", "~35%", "~25% (BCE)", "4,0%"] },
          { label: "Grèce", flag: "gr", cells: ["~50%", "~50%", "~20% (BCE)", "3,5%"] },
        ],
      },
      {
        type: "image-text",
        heading: "Le coût de la charge d'intérêts : un piège qui s'accélère",
        content:
          "Avec la remontée des taux directeurs de la BCE (0 % en 2021 → 4,5 % en 2023-2024), la charge d'intérêts de la dette française est passée de 35 milliards à plus de 55 milliards d'euros annuels en 2025. Elle représente désormais plus que le budget de l'Éducation nationale. C'est un effet « boule de neige » classique : plus la dette est élevée, plus les intérêts pèsent, plus le déficit se creuse. Pour sortir de ce piège, la croissance nominale doit être supérieure au taux d'intérêt moyen — ce qui n'est pas garanti dans un contexte européen atone.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Bercy2.jpg/1280px-Bercy2.jpg",
        imageAlt: "Ministère de l'Économie à Bercy",
        flip: true,
      },
      {
        type: "list",
        heading: "Les leviers de soutenabilité de la dette française",
        style: "check",
        items: [
          {
            text: "Croissance nominale supérieure au taux d'intérêt moyen",
            note: "Condition fondamentale pour stabiliser le ratio sans austérité brutale.",
          },
          {
            text: "Réforme structurelle des dépenses publiques",
            note: "La France dépense 57 % du PIB — record OCDE. Rationalisation nécessaire mais politiquement difficile.",
          },
          {
            text: "Soutien de la BCE via le TPI (Transmission Protection Instrument)",
            note: "Filet de sécurité anti-fragmentation si les spreads s'écartent dangereusement.",
          },
          {
            text: "Révision des règles budgétaires européennes",
            note: "Le nouveau Pacte de stabilité post-2023 offre plus de flexibilité aux États très endettés.",
          },
          {
            text: "Allongement de la maturité de la dette",
            note: "L'AFT (Agence France Trésor) allonge régulièrement la maturité pour lisser les refinancements.",
          },
        ],
      },
      {
        type: "highlight",
        content:
          "La France fait face à une contrainte rare : elle ne peut ni dévaluer (zone euro), ni imprimer de monnaie (BCE indépendante). Sa seule voie de sortie est la croissance, la réforme ou la négociation européenne. Un trilemme que l'Allemagne a résolu en maintenant une orthodoxie budgétaire stricte — au prix d'un sous-investissement public dénoncé par de nombreux économistes.",
      },
      {
        type: "quote",
        text: "Ce n'est pas le niveau de dette qui déclenche les crises, c'est la perte de confiance. Et la confiance se gagne par la crédibilité institutionnelle et la capacité de croissance, pas par un chiffre magique.",
        source: "Olivier Blanchard, ancien économiste en chef du FMI, 2024",
      },
      {
        type: "gallery",
        title: "Institutions et symboles de la politique budgétaire européenne",
        images: [
          {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Bercy2.jpg/1280px-Bercy2.jpg",
            caption: "Le ministère de l'Économie français, à Bercy — gestionnaire des 3 250 milliards de dette",
            credit: "Wikimedia Commons",
          },
          {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/ECB_new_building_Frankfurt_2015.jpg/1280px-ECB_new_building_Frankfurt_2015.jpg",
            caption: "La Banque centrale européenne à Francfort — garante de la stabilité financière de la zone euro",
            credit: "Wikimedia Commons",
          },
        ],
      },
    ],
    sources: [
        { title: "Fiscal Monitor: Putting a Lid on Public Debt", outlet: "FMI", year: "2024", url: "https://www.imf.org/en/Publications/FM" },
        { title: "General government debt — % of GDP", outlet: "OCDE", year: "2025", url: "https://stats.oecd.org" },
        { title: "Projet de loi de finances 2025 — Rapport économique", outlet: "Ministère de l'Économie français", year: "2024" },
        { title: "Global Debt Database", outlet: "FMI", year: "2024" },
        { title: "Zone euro : soutenabilité des dettes souveraines", outlet: "BCE — Banque centrale européenne", year: "2024" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. PIB ET GÉOPOLITIQUE
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "pib-mondial-geopolitique-puissance",
    title: "Le PIB comme outil de puissance géopolitique",
    excerpt:
      "La richesse économique n'est pas qu'un chiffre — c'est un vecteur de pouvoir diplomatique, militaire et culturel. Décryptage de la manière dont le PIB façonne l'ordre mondial.",
    theme: "economy",
    publishedAt: "2025-03-10",
    readingTime: 13,
    tags: ["PIB", "Géopolitique", "Puissance", "États-Unis", "Chine", "Défense"],
    featured: true,
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Camponotus_flavomarginatus_ant.jpg/1280px-Camponotus_flavomarginatus_ant.jpg",
    heroCaption: "La convergence économique Chine-USA : le défi géopolitique central du XXIe siècle.",
    body: [
      {
        type: "lead",
        content:
          "Le PIB est souvent réduit à une statistique économique abstraite. C'est pourtant l'un des instruments de mesure de puissance les plus utilisés dans les chancelleries et les états-majors. Un pays riche peut financer son armée, exercer une influence diplomatique, attirer les talents mondiaux, dicter les normes économiques planétaires et projeter sa culture à l'échelle globale. La richesse économique se convertit en puissance géopolitique avec une régularité presque mécanique dans l'histoire.",
      },
      {
        type: "stats",
        items: [
          { value: "3,5 %", label: "Défense USA / PIB", note: "916 Md$ en 2025" },
          { value: "13 000 Md€", label: "Échanges commerciaux Chine", note: "1er exportateur mondial" },
          { value: "44 %", label: "Part du dollar", note: "Dans les réserves mondiales" },
          { value: "80 %", label: "Prix libellés en USD", note: "Pétrole, matières premières" },
        ],
      },
      {
        type: "chart",
        title: "Budgets militaires mondiaux 2025 — les 10 premiers",
        subtitle: "Stockholm International Peace Research Institute (SIPRI), 2025",
        unit: "Milliards €",
        bars: [
          { label: "États-Unis", flag: "us", value: 916, color: "#C0392B", note: "3,5% du PIB" },
          { label: "Chine", flag: "cn", value: 225, color: "#E74C3C", note: "1,2% du PIB" },
          { label: "Russie", flag: "ru", value: 109, color: "#7F8C8D", note: "5,9% du PIB" },
          { label: "Inde", flag: "in", value: 83, color: "#F39C12", note: "2,1% du PIB" },
          { label: "Arabie Saoudite", flag: "sa", value: 75, color: "#D4A017", note: "6,0% du PIB" },
          { label: "Royaume-Uni", flag: "gb", value: 68, color: "#27AE60", note: "2,3% du PIB" },
          { label: "Allemagne", flag: "de", value: 66, color: "#2980B9", note: "1,7% du PIB" },
          { label: "France", flag: "fr", value: 57, color: "#1ABC9C", note: "1,9% du PIB" },
          { label: "Corée du Sud", flag: "kr", value: 50, color: "#9B59B6", note: "2,8% du PIB" },
          { label: "Japon", flag: "jp", value: 48, color: "#8E44AD", note: "1,1% du PIB" },
        ],
      },
      {
        type: "text",
        heading: "La relation PIB-puissance militaire : une équation quasi-mécanique",
        content:
          "Il existe une corrélation forte entre PIB et budget militaire. Les États-Unis consacrent environ 3,5 % de leur PIB à la défense — soit plus de 916 milliards de dollars en 2025, davantage que les dix pays suivants réunis. La Chine, avec un budget estimé à 225 milliards (1,2 % du PIB), reste très loin mais rattrape rapidement, avec des taux de croissance militaire de +7 % par an depuis 2015. Cette asymétrie explique pourquoi Washington peut maintenir 750 bases militaires dans 80 pays : c'est une puissance économique convertie en projection globale. La règle historique des 2 % du PIB pour l'OTAN est directement une déclinaison de ce principe : la puissance économique doit se traduire en capacité défensive.",
      },
      {
        type: "map-highlight",
        title: "Carte des alliances économico-militaires mondiales — 2025",
        subtitle: "Appartenance aux blocs économiques et alliances de sécurité",
        countries: {
          us: { color: "#2980B9", label: "OTAN + G7" },
          gb: { color: "#2980B9", label: "OTAN + G7" },
          de: { color: "#2980B9", label: "OTAN + G7 + UE" },
          fr: { color: "#2980B9", label: "OTAN + G7 + UE" },
          it: { color: "#2980B9", label: "OTAN + G7 + UE" },
          ca: { color: "#2980B9", label: "OTAN + G7" },
          jp: { color: "#3498DB", label: "Allié USA (hors OTAN)" },
          kr: { color: "#3498DB", label: "Allié USA (hors OTAN)" },
          au: { color: "#3498DB", label: "AUKUS + Five Eyes" },
          cn: { color: "#C0392B", label: "BRICS+ / OCS" },
          ru: { color: "#C0392B", label: "BRICS+ / OCS" },
          in: { color: "#F39C12", label: "Non-aligné / BRICS+" },
          br: { color: "#F39C12", label: "BRICS+" },
          sa: { color: "#D4A017", label: "Partenaire USA / BRICS+" },
        },
        legend: [
          { color: "#2980B9", label: "Bloc occidental (OTAN / G7)" },
          { color: "#3498DB", label: "Alliés USA hors OTAN" },
          { color: "#C0392B", label: "Bloc eurasiatique (BRICS+ / OCS)" },
          { color: "#F39C12", label: "Non-alignés / émergents" },
          { color: "#D4A017", label: "Pivots stratégiques" },
        ],
      },
      {
        type: "comparison-table",
        title: "PIB, dépenses militaires et influence diplomatique — grandes puissances 2025",
        headers: ["Pays", "PIB nominal", "Budget défense", "% PIB défense", "Sièges ONU/FMI"],
        rows: [
          { label: "États-Unis", flag: "us", cells: ["30 337 Md€", "916 Md€", "3,5%", "Droit de veto / 17,4%"] },
          { label: "Chine", flag: "cn", cells: ["19 535 Md€", "225 Md€", "1,2%", "Droit de veto / 6,4%"] },
          { label: "Russie", flag: "ru", cells: ["1 980 Md€", "109 Md€", "5,9%", "Droit de veto / 2,7%"] },
          { label: "France", flag: "fr", cells: ["3 274 Md€", "57 Md€", "1,9%", "Droit de veto / 4,1%"] },
          { label: "Allemagne", flag: "de", cells: ["4 460 Md€", "66 Md€", "1,7%", "Membre non-perm / 5,3%"] },
          { label: "Inde", flag: "in", cells: ["3 900 Md€", "83 Md€", "2,1%", "Candidat veto / 2,8%"] },
        ],
      },
      {
        type: "text",
        heading: "Le soft power économique : la puissance sans les armes",
        content:
          "La puissance économique ne s'exprime pas uniquement dans les budgets militaires. Elle se manifeste aussi dans la capacité à attirer les investissements étrangers (les États-Unis reçoivent 25 % des IDE mondiaux), à imposer des standards technologiques (l'architecture ARM, les standards 5G, les normes comptables IFRS), à contrôler les infrastructures financières mondiales (SWIFT, le dollar) et à projeter une culture (Hollywood, les universités américaines captent 40 % des étudiants en mobilité internationale). La Chine a compris cette dynamique avec l'initiative « Ceinture et Route » (Belt and Road Initiative) : en finançant des infrastructures dans 140 pays, elle achète de l'influence diplomatique à long terme.",
      },
      {
        type: "timeline",
        title: "Chronologie de la compétition économico-géopolitique Chine-USA (2001-2025)",
        items: [
          {
            date: "2001",
            title: "Entrée de la Chine à l'OMC",
            description:
              "La Chine rejoint l'Organisation mondiale du commerce. PIB chinois : 8 % du PIB américain. Début de l'intégration économique mondiale.",
          },
          {
            date: "2008",
            title: "Crise financière — l'Occident vacille",
            description:
              "La crise des subprimes ébranle la confiance dans le modèle économique occidental. La Chine sort relativement indemne avec +9,6% de croissance.",
          },
          {
            date: "2013",
            title: "Initiative Ceinture et Route lancée",
            description:
              "Xi Jinping annonce le projet d'infrastructure le plus ambitieux de l'histoire. 140 pays signataires, 1 000 milliards investis en 10 ans.",
          },
          {
            date: "2018",
            title: "Guerre commerciale Trump-Xi",
            description:
              "Washington impose 25 % de taxes sur 250 milliards de produits chinois. Début d'une décorrélation forcée des chaînes de valeur.",
          },
          {
            date: "2022",
            title: "CHIPS Act américain et sanctions semi-conducteurs",
            description:
              "Washington barre à Pékin l'accès aux puces avancées (7nm+) et aux équipements de lithographie. La guerre technologique s'intensifie.",
          },
          {
            date: "2025",
            title: "PIB Chine = 64 % du PIB américain",
            description:
              "La convergence économique est spectaculaire. En parité de pouvoir d'achat, la Chine a déjà dépassé les États-Unis depuis 2016.",
          },
        ],
      },
      {
        type: "highlight",
        content:
          "En 2000, la Chine représentait 12 % du PIB américain. En 2025, ce chiffre dépasse 64 %. Cette convergence est la principale variable de la géopolitique du XXIe siècle — et explique que chaque décision économique de Washington ou Pékin soit désormais analysée à travers un prisme stratégique.",
      },
      {
        type: "list",
        heading: "Les 6 instruments de la puissance économique géopolitique",
        style: "bullet",
        items: [
          {
            text: "Puissance militaire",
            note: "Financement des armées, R&D défense, projection de force (USA : 916 Md$ en 2025).",
          },
          {
            text: "Contrôle des infrastructures financières",
            note: "SWIFT, dollar de réserve, systèmes de clearing — armes de sanctions économiques.",
          },
          {
            text: "Diplomatie par les investissements",
            note: "IDE, aide au développement, initiative Ceinture et Route : acheter l'influence par le capital.",
          },
          {
            text: "Monopole technologique",
            note: "Standards 5G, semi-conducteurs, IA : celui qui contrôle les plateformes contrôle les dépendances.",
          },
          {
            text: "Soft power culturel",
            note: "Universités, médias, divertissement — la puissance douce amplifie la puissance dure.",
          },
          {
            text: "Contrôle des ressources critiques",
            note: "Terres rares, lithium, uranium — les matières premières de la transition énergétique sont le nouveau pétrole.",
          },
        ],
      },
      {
        type: "quote",
        text: "La puissance économique est la base de toutes les autres puissances. Un État qui s'appauvrit relativement finit par perdre son influence diplomatique, sa capacité militaire et son attractivité culturelle.",
        source: "Paul Kennedy, « The Rise and Fall of the Great Powers », actualisé 2024",
      },
    ],
    sources: [
        { title: "World Economic Outlook — Database April 2025", outlet: "FMI", year: "2025", url: "https://www.imf.org/en/Publications/WEO" },
        { title: "GDP (current US$) by country", outlet: "Banque mondiale", year: "2024", url: "https://data.worldbank.org" },
        { title: "Géopolitique économique : rapports de force", outlet: "OCDE", year: "2024" },
        { title: "Asian Development Outlook 2024", outlet: "Asian Development Bank", year: "2024" },
        { title: "China GDP growth slows — Perspectives 2025", outlet: "Financial Times", year: "2024" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. DETTE PUBLIQUE COMPARAISON INTERNATIONALE
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "dette-publique-comparaison-internationale",
    title: "La dette publique mondiale : qui doit quoi, et à qui ?",
    excerpt:
      "Le Japon dépasse 254 % de dette/PIB, l'Italie 137 %, les États-Unis 123 %. Pourtant tous empruntent encore. Comprendre pourquoi le ratio dette/PIB ne dit pas tout sur la soutenabilité.",
    theme: "economy",
    publishedAt: "2025-03-03",
    readingTime: 11,
    tags: ["Dette publique", "FMI", "Obligations souveraines", "Crise financière", "Soutenabilité"],
    featured: false,
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/ECB_new_building_Frankfurt_2015.jpg/1280px-ECB_new_building_Frankfurt_2015.jpg",
    heroCaption: "La Banque centrale européenne à Francfort — pivot de la gestion de la dette en zone euro.",
    body: [
      {
        type: "lead",
        content:
          "La dette publique mondiale a explosé depuis 2008 et plus encore depuis 2020. Le total mondial frôle désormais 100 000 milliards de dollars — soit environ 92 % du PIB planétaire. Pourtant, les crises de la dette souveraine restent rares. Ce qui déclenche une crise, ce n'est pas un ratio, c'est une perte de confiance des marchés : une rupture soudaine dans la conviction que l'État débiteur pourra honorer ses engagements.",
      },
      {
        type: "stats",
        items: [
          { value: "254 %", label: "Japon — record G7", note: "90% détenus par résidents" },
          { value: "137 %", label: "Italie", note: "Sous surveillance BCE" },
          { value: "123 %", label: "États-Unis", note: "Monnaie de réserve mondiale" },
          { value: "64 %", label: "Allemagne", note: "Orthodoxie budgétaire" },
        ],
      },
      {
        type: "chart",
        title: "Dette publique brute 2025 — top 20 mondial",
        subtitle: "FMI, World Economic Outlook avril 2025 (% du PIB)",
        unit: "% du PIB",
        bars: [
          { label: "Japon", flag: "jp", value: 254, color: "#8E44AD" },
          { label: "Grèce", flag: "gr", value: 161, color: "#C0392B" },
          { label: "Italie", flag: "it", value: 137, color: "#E74C3C" },
          { label: "États-Unis", flag: "us", value: 123, color: "#D35400" },
          { label: "France", flag: "fr", value: 113, color: "#2980B9" },
          { label: "Espagne", flag: "es", value: 104, color: "#9B59B6" },
          { label: "Canada", flag: "ca", value: 106, color: "#27AE60" },
          { label: "Belgique", flag: "be", value: 103, color: "#F39C12" },
          { label: "Brésil", flag: "br", value: 90, color: "#16A085" },
          { label: "Inde", flag: "in", value: 83, color: "#E67E22" },
          { label: "Portugal", flag: "pt", value: 99, color: "#1ABC9C" },
          { label: "Royaume-Uni", flag: "gb", value: 102, color: "#2ECC71" },
          { label: "Allemagne", flag: "de", value: 64, color: "#3498DB" },
          { label: "Pays-Bas", flag: "nl", value: 48, color: "#E91E63" },
          { label: "Suède", flag: "se", value: 33, color: "#00BCD4" },
        ],
      },
      {
        type: "text",
        heading: "La dette japonaise : l'anomalie qui dérange les modèles",
        content:
          "Le Japon est l'anomalie statistique parfaite. Avec 254 % de dette publique brute/PIB, il devrait — selon toutes les théories classiques — être en crise permanente. Or, il emprunte à des taux inférieurs à 1 % depuis des décennies. La raison est structurelle : environ 90 % de la dette japonaise est détenue par des résidents — notamment la Banque du Japon (qui en détient plus de 50 %) et les fonds de pension nationaux. Dans une économie à fort excédent d'épargne et à faible inflation historique, les ménages et les institutions japonaises investissent massivement dans des obligations d'État considérées comme un actif sans risque domestique. Ce modèle ne peut pas être repliqué par des pays dont la dette est détenue majoritairement par des non-résidents — comme la France (55 % de détention étrangère) ou la Grèce.",
      },
      {
        type: "comparison-table",
        title: "Anatomie de la dette souveraine : ce qui différencie les situations nationales",
        headers: ["Pays", "Dette/PIB", "Devise d'emprunt", "% détenus résidents", "Taux 10 ans", "Risque crise"],
        rows: [
          { label: "Japon", flag: "jp", cells: ["254%", "Yen (propre)", "~90%", "0,8%", "Faible"] },
          { label: "États-Unis", flag: "us", cells: ["123%", "Dollar (réserve)", "~70%", "4,3%", "Très faible"] },
          { label: "France", flag: "fr", cells: ["113%", "Euro (partagé)", "~45%", "3,1%", "Modéré"] },
          { label: "Italie", flag: "it", cells: ["137%", "Euro (partagé)", "~65%", "4,0%", "Modéré-élevé"] },
          { label: "Grèce", flag: "gr", cells: ["161%", "Euro (partagé)", "~50%", "3,5%", "Sous surveillance"] },
          { label: "Argentine", flag: "ar", cells: ["90%", "Dollar (étranger)", "~30%", "---", "Très élevé"] },
        ],
      },
      {
        type: "image-text",
        heading: "La crise grecque 2010-2015 : la leçon de la perte de confiance",
        content:
          "En 2010, la Grèce avait une dette de 127 % du PIB — inférieure à celle du Japon actuel. Mais la crise qu'elle a traversée a failli faire éclater la zone euro. Pourquoi ? Parce que la Grèce empruntait en euros (monnaie qu'elle ne peut pas imprimer), que sa dette était détenue par des banques françaises et allemandes non-résidentes, que sa croissance était anémique et son économie peu compétitive, et que les marchés ont perdu confiance simultanément. Le spread (écart avec l'Allemagne) a explosé à 35 % en 2012. Seule l'intervention de la BCE (« Whatever it takes » de Draghi, juillet 2012) a stoppé la contagion. Cet épisode a redéfini la gestion de la dette souveraine en zone euro.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/ECB_new_building_Frankfurt_2015.jpg/1280px-ECB_new_building_Frankfurt_2015.jpg",
        imageAlt: "BCE Francfort",
        flip: false,
      },
      {
        type: "timeline",
        title: "Les grandes crises de la dette souveraine — 1994 à 2025",
        items: [
          {
            date: "1994-1995",
            title: "Crise du peso mexicain (« Effet Tequila »)",
            description:
              "Dévaluation du peso, fuite des capitaux. Sauvetage américain de 50 Md$ via le Trésor US et le FMI. Première crise de la mondialisation financière.",
          },
          {
            date: "1997-1998",
            title: "Crise asiatique — Thaïlande, Corée, Indonésie",
            description:
              "Attaques spéculatives sur les monnaies asiatiques. Le baht thaïlandais s'effondre. PIB indonésien : -13% en 1998. Leçon : la dette en devises étrangères est un piège.",
          },
          {
            date: "2001",
            title: "Default argentin — 100 Md$ de dette",
            description:
              "L'Argentine fait défaut sur 100 milliards de dollars — le plus grand défaut souverain de l'histoire à l'époque. Fin du Currency Board (peso = dollar).",
          },
          {
            date: "2010-2015",
            title: "Crise de la dette souveraine européenne",
            description:
              "Grèce, Irlande, Portugal, Espagne, Chypre sous assistance. Invention du MES (Mécanisme européen de stabilité) et du QE de la BCE.",
          },
          {
            date: "2022",
            title: "Sri Lanka — premier défaut post-COVID",
            description:
              "Le Sri Lanka fait défaut sur 51 Md$ de dette. Effondrement des réserves de change, pénuries massives. Sauvetage FMI en 2023.",
          },
        ],
      },
      {
        type: "list",
        heading: "Les 5 facteurs clés de soutenabilité d'une dette souveraine",
        style: "number",
        items: [
          {
            text: "Croissance nominale > taux d'intérêt moyen",
            note: "La condition de Domar : si g > r, le ratio dette/PIB diminue mécaniquement sans austérité.",
          },
          {
            text: "Confiance des investisseurs et liquidité des marchés obligataires",
            note: "La confiance est autoréalisatrice : si les marchés croient à la soutenabilité, les taux restent bas.",
          },
          {
            text: "Contrôle de la devise d'emprunt",
            note: "Emprunter dans sa propre monnaie (ou monnaie de réserve) offre une sécurité incomparable vs devises étrangères.",
          },
          {
            text: "Profil de détention domestique vs étranger",
            note: "Une dette très internalisée (Japon) est moins vulnérable aux chocs de confiance externes.",
          },
          {
            text: "Crédibilité institutionnelle et politique",
            note: "La stabilité politique, l'indépendance de la banque centrale et la qualité des institutions publiques sont des facteurs fondamentaux.",
          },
        ],
      },
      {
        type: "highlight",
        content:
          "La dette publique mondiale a augmenté de 60 000 milliards de dollars entre 2020 et 2025. C'est l'équivalent du PIB de la planète entière. Cette explosion sans précédent en temps de paix est le legs économique de la pandémie — et une contrainte majeure pour les décennies à venir.",
      },
      {
        type: "quote",
        text: "Il n'existe pas de niveau de dette « automatiquement » dangereux. Ce qui compte, c'est la dynamique : la dette augmente-t-elle plus vite que la capacité à la rembourser ? Et les acteurs qui en font confiance croient-ils à la trajectory de remboursement ?",
        source: "FMI, Fiscal Monitor, octobre 2024",
      },
    ],
    sources: [
        { title: "Fiscal Monitor 2024 — Appendix Tables", outlet: "FMI", year: "2024", url: "https://www.imf.org/en/Publications/FM" },
        { title: "General Government Gross Debt — OECD Data", outlet: "OCDE", year: "2025" },
        { title: "Japan's Debt — sustainability analysis", outlet: "FMI Article IV Japan", year: "2024" },
        { title: "EU Excessive Deficit Procedure — Member States", outlet: "Commission européenne", year: "2024" },
        { title: "Global Debt Database 2024", outlet: "FMI", year: "2024" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. CHÔMAGE ET FRACTURES DU MARCHÉ DU TRAVAIL
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "chomage-inegalites-marches-travail",
    title: "Chômage mondial : les grandes fractures du marché du travail en 2025",
    excerpt:
      "Afrique du Sud à 32 %, Europe du Nord sous 3 % : les disparités de chômage révèlent des structures économiques et sociales radicalement différentes. Cartographie mondiale des fractures de l'emploi.",
    theme: "economy",
    publishedAt: "2025-02-24",
    readingTime: 11,
    tags: ["Chômage", "Marché du travail", "Inégalités", "OCDE", "OIT"],
    featured: false,
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Unemployment_office_crop.jpg/1280px-Unemployment_office_crop.jpg",
    heroCaption: "File d'attente dans un bureau de chômage — une réalité encore très présente dans de nombreux pays.",
    body: [
      {
        type: "lead",
        content:
          "Le taux de chômage est l'un des indicateurs économiques les plus politiquement sensibles. Il mesure la fracture entre ceux qui participent à l'économie formelle et ceux qui en sont exclus — avec toutes les nuances que les méthodologies nationales ne capturent pas. Car derrière les chiffres officiels se cachent le sous-emploi, le chômage structurel des jeunes, la précarité invisible du secteur informel et les inégalités de genre profondes.",
      },
      {
        type: "stats",
        items: [
          { value: "32 %", label: "Chômage Afrique du Sud", note: "Record parmi les grandes économies" },
          { value: "2,6 %", label: "Chômage Japon", note: "Plein emploi quasi-structurel" },
          { value: "7,3 %", label: "Chômage France", note: "Données FMI 2025" },
          { value: "3,7 %", label: "Chômage États-Unis", note: "Proche du plein emploi" },
        ],
      },
      {
        type: "chart",
        title: "Taux de chômage — grandes économies mondiales 2025",
        subtitle: "Organisation internationale du travail (OIT) / FMI, données 2025",
        unit: "% de la population active",
        bars: [
          { label: "Afrique du Sud", flag: "za", value: 32.0, color: "#C0392B", note: "Structurel, post-apartheid" },
          { label: "Espagne", flag: "es", value: 11.5, color: "#E74C3C", note: "Chômage jeunes >25%" },
          { label: "Grèce", flag: "gr", value: 10.2, color: "#D35400", note: "Post-crise 2010" },
          { label: "Italie", flag: "it", value: 6.7, color: "#9B59B6", note: "Mezzogiorno surtout" },
          { label: "France", flag: "fr", value: 7.3, color: "#2980B9", note: "Stable depuis 2 ans" },
          { label: "OCDE moy.", flag: "eu", value: 5.1, color: "#7F8C8D", note: "Moyenne 2025" },
          { label: "Canada", flag: "ca", value: 6.1, color: "#27AE60", note: "Hausse légère" },
          { label: "Brésil", flag: "br", value: 6.9, color: "#F39C12", note: "Amélioration" },
          { label: "États-Unis", flag: "us", value: 3.7, color: "#16A085", note: "Quasi-plein emploi" },
          { label: "Australie", flag: "au", value: 4.0, color: "#1ABC9C", note: "Stable" },
          { label: "Royaume-Uni", flag: "gb", value: 4.3, color: "#2ECC71", note: "Post-Brexit" },
          { label: "Corée du Sud", flag: "kr", value: 2.9, color: "#3498DB", note: "Plein emploi" },
          { label: "Allemagne", flag: "de", value: 3.0, color: "#E67E22", note: "Marché dual" },
          { label: "Japon", flag: "jp", value: 2.6, color: "#8E44AD", note: "Shunto salaires +" },
          { label: "Singapour", flag: "sg", value: 2.1, color: "#E91E63", note: "Quasi-plein emploi" },
        ],
      },
      {
        type: "map-highlight",
        title: "Carte des taux de chômage mondiaux — 2025",
        subtitle: "OIT / FMI 2025. Vert = faible chômage, Rouge = chômage élevé.",
        countries: {
          jp: { color: "#2ECC71", label: "2,6% (très faible)" },
          sg: { color: "#27AE60", label: "2,1% (très faible)" },
          kr: { color: "#2ECC71", label: "2,9% (très faible)" },
          de: { color: "#3498DB", label: "3,0% (faible)" },
          us: { color: "#3498DB", label: "3,7% (faible)" },
          au: { color: "#3498DB", label: "4,0% (faible)" },
          gb: { color: "#F39C12", label: "4,3% (modéré)" },
          fr: { color: "#E67E22", label: "7,3% (élevé)" },
          it: { color: "#D35400", label: "6,7% (élevé)" },
          es: { color: "#E74C3C", label: "11,5% (très élevé)" },
          gr: { color: "#C0392B", label: "10,2% (très élevé)" },
          za: { color: "#922B21", label: "32% (critique)" },
          br: { color: "#E67E22", label: "6,9% (élevé)" },
          in: { color: "#F39C12", label: "7,9% (modéré-élevé)" },
          cn: { color: "#3498DB", label: "5,2% (officiel)" },
        },
        legend: [
          { color: "#2ECC71", label: "< 3% : Plein emploi" },
          { color: "#3498DB", label: "3–5% : Faible chômage" },
          { color: "#F39C12", label: "5–7% : Modéré" },
          { color: "#E74C3C", label: "7–12% : Élevé" },
          { color: "#922B21", label: "> 12% : Critique" },
        ],
      },
      {
        type: "text",
        heading: "Le chômage des jeunes : une bombe à retardement sociale",
        content:
          "Au-delà des taux globaux, le chômage des jeunes (15-24 ans) révèle les fractures les plus profondes. En Espagne, il dépasse 25 % — soit un jeune Espagnol sur quatre sans emploi. En Grèce, ce chiffre était de 30 % encore en 2023. En Italie, le taux NEET (ni en emploi, ni en formation, ni en études) atteint 19 %. Ces niveaux structurels ne se résorbent pas en quelques années de croissance : ils laissent des «cicatrices» permanentes (scarring effect) sur la trajectoire professionnelle des individus concernés — perte de compétences, dépression, déqualification. À l'opposé, le Japon et l'Allemagne maintiennent un apprentissage dual qui intègre les jeunes très tôt dans le marché du travail, avec un taux de chômage des 15-24 ans inférieur à 5 %.",
      },
      {
        type: "comparison-table",
        title: "Chômage global vs chômage des jeunes — comparaison internationale 2025",
        headers: ["Pays", "Taux global", "Chômage 15-24 ans", "Taux NEET", "Part emploi informel"],
        rows: [
          { label: "Espagne", flag: "es", cells: ["11,5%", "26,2%", "13%", "15%"] },
          { label: "Italie", flag: "it", cells: ["6,7%", "20,3%", "19%", "14%"] },
          { label: "France", flag: "fr", cells: ["7,3%", "16,8%", "12%", "8%"] },
          { label: "Allemagne", flag: "de", cells: ["3,0%", "5,9%", "8%", "7%"] },
          { label: "Japon", flag: "jp", cells: ["2,6%", "4,2%", "3%", "2%"] },
          { label: "États-Unis", flag: "us", cells: ["3,7%", "7,9%", "11%", "5%"] },
          { label: "Brésil", flag: "br", cells: ["6,9%", "17,5%", "22%", "38%"] },
          { label: "Afrique du Sud", flag: "za", cells: ["32%", "62%", "41%", "28%"] },
        ],
      },
      {
        type: "image-text",
        heading: "L'illusion du chômage officiel en Chine et en Inde",
        content:
          "Les chiffres officiels de chômage en Chine (5,2 %) et en Inde (7,9 %) sous-estiment massivement la réalité du marché du travail. En Chine, le système de l'hukou (permis de résidence) exclut des millions de travailleurs migrants urbains des statistiques officielles. En Inde, l'économie informelle représente plus de 80 % de l'emploi total : ces 400 millions de travailleurs informels ne sont pas comptabilisés comme « chômeurs » même lorsqu'ils manquent de travail. Le CMIE (Centre for Monitoring Indian Economy) publie des taux alternatifs qui dépassent régulièrement 8-10 %. La mesure du marché du travail dans les économies émergentes reste un défi méthodologique fondamental.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Unemployment_office_crop.jpg/1280px-Unemployment_office_crop.jpg",
        imageAlt: "Bureau de chômage",
        flip: true,
      },
      {
        type: "list",
        heading: "Les 5 grandes transformations qui redessinent le marché du travail mondial",
        style: "number",
        items: [
          {
            text: "Automatisation et IA : remplacement ou augmentation ?",
            note: "L'OCDE estime que 14% des emplois actuels sont « hautement automatisables ». Mais de nouveaux métiers émergent simultanément.",
          },
          {
            text: "Déclin de l'emploi industriel dans les pays développés",
            note: "La désindustrialisation a supprimé des millions d'emplois stables dans les années 1980-2010. Le reshoring crée de nouvelles opportunités.",
          },
          {
            text: "Essor du travail indépendant et des plateformes",
            note: "Uber, Deliveroo, Fiverr : 15-25% des actifs dans les pays développés exercent en indépendant, souvent sans protection sociale.",
          },
          {
            text: "Révolution du télétravail post-COVID",
            note: "30% des emplois du secteur tertiaire dans les pays développés peuvent être exercés à distance, modifiant la géographie économique.",
          },
          {
            text: "Fractures de genre persistantes",
            note: "Dans de nombreux pays émergents, les femmes ont un taux de participation au marché du travail inférieur de 20-30% à celui des hommes.",
          },
        ],
      },
      {
        type: "highlight",
        content:
          "Le FMI estime que l'intelligence artificielle générative pourrait affecter 40 % des emplois mondiaux d'ici 2030. Dans les économies avancées, cette proportion monte à 60 %. Pour la première fois, ce n'est plus seulement l'emploi peu qualifié qui est menacé, mais aussi les professions intellectuelles qualifiées (comptabilité, droit, conseil, code).",
      },
      {
        type: "quote",
        text: "Le plein emploi n'est pas qu'un objectif économique. C'est un fondement de la cohésion sociale. Les pays qui maintiennent durablement un chômage élevé — notamment chez les jeunes — paient une facture sociale et politique qui dépasse de loin le coût des allocations versées.",
        source: "OIT, Rapport mondial sur l'emploi et les questions sociales 2025",
      },
    ],
    sources: [
        { title: "World Employment and Social Outlook 2024", outlet: "Organisation Internationale du Travail (OIT)", year: "2024", url: "https://www.ilo.org" },
        { title: "Unemployment rate by country — OECD Statistics", outlet: "OCDE", year: "2025" },
        { title: "World Development Report 2024 — Inequality", outlet: "Banque mondiale", year: "2024" },
        { title: "Labour market statistics — Eurostat", outlet: "Eurostat", year: "2025" },
        { title: "Global Inequality Report — Oxfam 2024", outlet: "Oxfam International", year: "2024" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. CHINE VS ÉTATS-UNIS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "chine-usa-guerre-economique-decennie",
    title: "Chine vs États-Unis : la grande rivalité économique de notre siècle",
    excerpt:
      "En 2000, la Chine représentait 12 % du PIB américain. En 2025, 64 %. Cette ascension fulgurante a redessiné les alliances mondiales et déclenché une guerre technologique sans précédent.",
    theme: "economy",
    publishedAt: "2025-02-17",
    readingTime: 14,
    tags: ["Chine", "États-Unis", "Guerre économique", "Technologie", "Géopolitique"],
    featured: false,
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/US-China_Flags.jpg/1280px-US-China_Flags.jpg",
    heroCaption: "Les drapeaux américain et chinois — symboles de la rivalité économique centrale du XXIe siècle.",
    body: [
      {
        type: "lead",
        content:
          "Aucune rivalité géopolitique ne définit autant le XXIe siècle que celle entre Washington et Pékin. Ce n'est pas seulement une compétition économique : c'est une bataille pour les standards technologiques, les chaînes d'approvisionnement mondiales, les normes monétaires et l'influence sur les pays du Sud global. La convergence économique entre les deux superpuissances est le fait géopolitique le plus important depuis la chute du mur de Berlin.",
      },
      {
        type: "stats",
        items: [
          { value: "12 %", label: "PIB Chine/USA en 2000", note: "Rapport de force d'alors" },
          { value: "64 %", label: "PIB Chine/USA en 2025", note: "Convergence spectaculaire" },
          { value: "600 Md€+", label: "Taxes et sanctions mutuelles", note: "Guerre commerciale 2018–2025" },
          { value: "2030", label: "Dépassement possible (PPA)", note: "Si tendances maintenues" },
        ],
      },
      {
        type: "chart",
        title: "Évolution du rapport PIB Chine / PIB États-Unis (1990-2025)",
        subtitle: "En % du PIB américain. Sources : Banque mondiale / FMI.",
        unit: "% du PIB américain",
        bars: [
          { label: "1990", flag: "cn", value: 6, color: "#E74C3C", note: "6% du PIB USA" },
          { label: "1995", flag: "cn", value: 9, color: "#E74C3C" },
          { label: "2000", flag: "cn", value: 12, color: "#E74C3C", note: "Entrée OMC" },
          { label: "2005", flag: "cn", value: 19, color: "#D35400" },
          { label: "2010", flag: "cn", value: 40, color: "#E67E22", note: "2e éco mondiale" },
          { label: "2015", flag: "cn", value: 61, color: "#F39C12" },
          { label: "2020", flag: "cn", value: 70, color: "#F39C12", note: "COVID" },
          { label: "2025", flag: "cn", value: 64, color: "#D35400", note: "Ralentissement" },
        ],
      },
      {
        type: "text",
        heading: "La montée en puissance chinoise : 30 ans d'une ascension sans précédent",
        content:
          "En 1990, la Chine était une économie pauvre de 360 millions de dollars de PIB, soit 6 % du PIB américain. En 35 ans, elle est devenue la deuxième économie mondiale avec 19 535 milliards d'euros de PIB nominal. Cette croissance a sorti 800 millions de personnes de la pauvreté — le plus grand succès de développement économique de l'histoire humaine. Le moteur initial était simple : travail bon marché, exportations manufacturières massives et accueil d'IDE. Mais la stratégie a évolué : depuis Made in China 2025 (2015), Pékin vise la montée en gamme dans les secteurs stratégiques — semi-conducteurs, IA, véhicules électriques, énergies renouvelables, spatial, biotechnologies.",
      },
      {
        type: "comparison-table",
        title: "États-Unis vs Chine — comparatif économique et technologique 2025",
        headers: ["Indicateur", "États-Unis", "Chine", "Écart / Tendance"],
        rows: [
          { label: "PIB nominal", cells: ["30 337 Md€", "19 535 Md€", "USA +55%"] },
          { label: "PIB en PPA", cells: ["~30 000 Md€", "~34 000 Md€", "Chine > USA (PPA)"] },
          { label: "Dépôts de brevets/an", cells: ["~600 000", "~1 580 000", "Chine x2,6"] },
          { label: "Exportations mondiales", cells: ["~9%", "~14%", "Chine #1 mondial"] },
          { label: "Dépenses R&D", cells: ["3,4% PIB", "2,4% PIB", "USA > Chine (% PIB)"] },
          { label: "Puissance militaire", cells: ["916 Md€", "225 Md€", "USA x4"] },
          { label: "Réserves de change", cells: ["150 Md$", "3 200 Md$", "Chine x21"] },
          { label: "Diplômés STEM/an", cells: ["~800 000", "~3 500 000", "Chine x4,4"] },
        ],
      },
      {
        type: "image-text",
        heading: "La guerre des semi-conducteurs : la bataille centrale",
        content:
          "Les semi-conducteurs sont le pétrole du XXIe siècle. Les puces avancées sont indispensables à l'IA, aux systèmes d'armes modernes, aux télécommunications 5G et à l'automatisation industrielle. En octobre 2022, l'administration Biden a déclenché la « guerre des puces » : interdiction d'exporter vers la Chine des semi-conducteurs avancés (≤14 nm) et des équipements de fabrication (notamment ASML, l'unique fabricant mondial de lithographie EUV). L'objectif : retarder de 10 ans le développement des capacités chinoises en IA. La réponse chinoise : un plan de 150 milliards de dollars pour atteindre l'autonomie dans les semi-conducteurs d'ici 2030. Résultat partiel : Huawei a sorti en 2023 le Mate 60 Pro avec un chip 7 nm produit par SMIC — en contournement partiel des sanctions.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/US-China_Flags.jpg/1280px-US-China_Flags.jpg",
        imageAlt: "Drapeaux USA et Chine",
        flip: false,
      },
      {
        type: "timeline",
        title: "La guerre économique USA-Chine : chronologie 2018-2025",
        items: [
          {
            date: "Mars 2018",
            title: "Trump impose 25% de taxes sur l'acier chinois",
            description:
              "Début officiel de la guerre commerciale. 250 milliards de produits chinois taxés. La Chine riposte sur le soja, l'aviation et les voitures américaines.",
          },
          {
            date: "Mai 2019",
            title: "Huawei blacklisté",
            description:
              "Le département du Commerce américain interdit aux entreprises US de vendre des composants à Huawei. Google retire l'accès d'Android à Huawei. Choc sur la chaîne d'approvisionnement mondiale.",
          },
          {
            date: "Janvier 2020",
            title: "Phase 1 de l'accord commercial",
            description:
              "Trêve partielle : la Chine s'engage à acheter 200 Md$ d'exportations américaines supplémentaires. Mais les taxes restent en place à 90%.",
          },
          {
            date: "Octobre 2022",
            title: "Export Controls sur les semi-conducteurs",
            description:
              "La règle la plus restrictive jamais imposée : interdiction d'exporter ou de vendre des puces avancées à la Chine, pour toute entreprise mondiale utilisant des technologies américaines.",
          },
          {
            date: "2023",
            title: "CHIPS Act : 52 Md$ pour relocaliser la production",
            description:
              "Washington investit 52 milliards pour rapatrier la production de semi-conducteurs sur le sol américain. TSMC, Samsung et Intel annoncent des usines aux USA.",
          },
          {
            date: "2025",
            title: "Retour des droits de douane — 2.0",
            description:
              "La nouvelle administration américaine relève les taxes sur les importations chinoises à 60-100%. La dé-mondialisation s'accélère avec le « friendshoring ».",
          },
        ],
      },
      {
        type: "map-highlight",
        title: "Le monde fracturé : zones d'influence économique USA vs Chine — 2025",
        subtitle: "Appartenance aux zones de dépendance commerciale et technologique",
        countries: {
          us: { color: "#2980B9", label: "Sphère USA (noyau dur)" },
          ca: { color: "#2980B9", label: "ACEUM (orbite USA)" },
          gb: { color: "#2980B9", label: "Atlantique (proche USA)" },
          de: { color: "#3498DB", label: "UE (pivot USA-Chine)" },
          fr: { color: "#3498DB", label: "UE (pivot USA-Chine)" },
          jp: { color: "#2980B9", label: "Allié tech USA (CHIPS4)" },
          kr: { color: "#2980B9", label: "Allié tech USA (CHIPS4)" },
          au: { color: "#2980B9", label: "AUKUS" },
          cn: { color: "#C0392B", label: "Sphère Chine (noyau dur)" },
          ru: { color: "#922B21", label: "Pivot vers Chine (sanctions)" },
          in: { color: "#F39C12", label: "Équidistant (stratégique)" },
          br: { color: "#E67E22", label: "BRICS / Commerce Chine" },
          sa: { color: "#D4A017", label: "Pivot (pétrole Chine+)" },
          ng: { color: "#E74C3C", label: "Investissements Chine" },
          id: { color: "#F39C12", label: "ASEAN (pivot)" },
        },
        legend: [
          { color: "#2980B9", label: "Sphère d'influence américaine" },
          { color: "#C0392B", label: "Sphère d'influence chinoise" },
          { color: "#F39C12", label: "Non-alignés / pivots stratégiques" },
          { color: "#3498DB", label: "Alliés Ouest avec liens Chine" },
        ],
      },
      {
        type: "list",
        heading: "Les 6 fronts de la guerre économique USA-Chine",
        style: "number",
        items: [
          {
            text: "Semi-conducteurs et technologies critiques",
            note: "Le front le plus stratégique. Washington interdit les puces avancées; Pékin investit 150 Md$ pour l'autonomie.",
          },
          {
            text: "Guerre commerciale et droits de douane",
            note: "60-100% de taxes sur imports chinois en 2025. La Chine riposte sur les terres rares et les batteries.",
          },
          {
            text: "Rivalité pour les normes 5G/6G",
            note: "Huawei banni de 60+ pays occidentaux; Pékin impose ses normes dans les pays du Sud.",
          },
          {
            text: "Compétition dans l'IA",
            note: "GPT-4/5 (OpenAI-Microsoft) vs Ernie Bot (Baidu), DeepSeek, Qwen. Course à la souveraineté des modèles de fondation.",
          },
          {
            text: "Bataille des chaînes d'approvisionnement",
            note: "'Friendshoring' et 'nearshoring' : déplacement massif de production vers Inde, Vietnam, Mexique.",
          },
          {
            text: "Dédollarisation vs système dollar",
            note: "La Chine promeut le yuan dans les échanges pétroliers. Les BRICS discutent d'une monnaie alternative. Le dollar reste dominant à 44%.",
          },
        ],
      },
      {
        type: "highlight",
        content:
          "En parité de pouvoir d'achat (PPA), la Chine a déjà dépassé les États-Unis depuis 2016. Ce basculement, souvent ignoré dans les médias, signifie que l'économie chinoise produit désormais plus de biens et services réels que l'américaine — même si en termes nominaux (en dollars courants), les USA maintiennent leur avance.",
      },
      {
        type: "quote",
        text: "La grande question n'est pas de savoir si la Chine va dépasser les États-Unis, mais de savoir si les deux puissances peuvent coexister pacifiquement alors que le fossé de puissance se referme. C'est le 'piège de Thucydide' — et l'histoire n'est pas rassurante.",
        source: "Graham Allison, Harvard Kennedy School, « Destined for War », réédition 2024",
      },
    ],
    sources: [
        { title: "World Economic Outlook — US-China tensions", outlet: "FMI", year: "2025", url: "https://www.imf.org/en/Publications/WEO" },
        { title: "US-China Economic and Trade Relations", outlet: "Congressional Research Service", year: "2024" },
        { title: "OECD Economic Surveys — China 2024", outlet: "OCDE", year: "2024" },
        { title: "The Great Decoupling: how US-China rivalry reshapes global trade", outlet: "Financial Times", year: "2024" },
        { title: "China Trade Statistics 2024", outlet: "General Administration of Customs China / Reuters", year: "2024" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. GÉANTS TECHNOLOGIQUES
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "entreprises-geants-economie-mondiale",
    title: "Les géants technologiques et leur poids sur l'économie mondiale",
    excerpt:
      "Apple, Microsoft, Nvidia : les 10 plus grandes entreprises mondiales pèsent autant que le PIB de plusieurs continents réunis. Leur puissance redéfinit les règles du capitalisme.",
    theme: "economy",
    publishedAt: "2025-02-10",
    readingTime: 12,
    tags: ["Entreprises", "Big Tech", "Capitalisme", "Monopoles", "Régulation"],
    featured: false,
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/800px-Apple_logo_black.svg.png",
    heroCaption: "Apple — la première entreprise à avoir dépassé une capitalisation boursière de 3 000 milliards de dollars.",
    body: [
      {
        type: "lead",
        content:
          "La capitalisation boursière d'Apple dépasse le PIB de l'Allemagne. Nvidia, en 2023-2025, a connu la plus forte création de valeur boursière de l'histoire humaine sur deux ans. Ces chiffres illustrent un phénomène inédit : la concentration de valeur économique dans un nombre infime d'entreprises technologiques américaines et chinoises, qui redéfinissent les règles du capitalisme, de la concurrence et de la souveraineté nationale.",
      },
      {
        type: "stats",
        items: [
          { value: "3 500 Md€", label: "Capitalisation Apple", note: "Plus grande capi mondiale" },
          { value: "3 200 Md€", label: "Capitalisation Nvidia", note: "IA / semi-conducteurs" },
          { value: "7", label: "Magnificent Seven USA", note: "30% du S&P500" },
          { value: "21 %", label: "Part BigTech dans PIB USA", note: "Valeur ajoutée estimée" },
        ],
      },
      {
        type: "chart",
        title: "Capitalisation boursière des 10 plus grandes entreprises mondiales — 2025",
        subtitle: "En milliards d'euros. Sources : Bloomberg, Yahoo Finance (mars 2025).",
        unit: "Milliards €",
        bars: [
          { label: "Apple", flag: "us", value: 3500, color: "#C0392B", note: "iPhone, services, Mac" },
          { label: "Nvidia", flag: "us", value: 3200, color: "#E74C3C", note: "GPU IA" },
          { label: "Microsoft", flag: "us", value: 3100, color: "#2980B9", note: "Cloud Azure + IA" },
          { label: "Alphabet (Google)", flag: "us", value: 2400, color: "#F39C12", note: "Publicité + Cloud" },
          { label: "Amazon", flag: "us", value: 2250, color: "#D35400", note: "AWS + e-commerce" },
          { label: "Meta", flag: "us", value: 1700, color: "#3498DB", note: "Facebook, Instagram, VR" },
          { label: "Saudi Aramco", flag: "sa", value: 1650, color: "#D4A017", note: "Pétrole" },
          { label: "TSMC", flag: "tw", value: 1050, color: "#8E44AD", note: "Fonderie semi-cond." },
          { label: "Tesla", flag: "us", value: 930, color: "#27AE60", note: "VE + énergie" },
          { label: "Berkshire Hathaway", flag: "us", value: 900, color: "#16A085", note: "Conglomérat Buffett" },
        ],
      },
      {
        type: "text",
        heading: "Le phénomène des Magnificent Seven : une concentration sans précédent",
        content:
          "Les «Magnificent Seven» — Apple, Microsoft, Nvidia, Amazon, Alphabet, Meta et Tesla — représentent à eux seuls environ 30 % de la capitalisation totale du S&P 500 (500 premières entreprises américaines). C'est une concentration historiquement inédite. En 2000, les 7 premières valeurs de l'indice représentaient 15 %. Cette concentration n'est pas le fruit du hasard : elle reflète la logique des plateformes numériques (effets réseau massifs, coûts marginaux proches de zéro, données comme actif stratégique) et les avantages de l'IA. Ces entreprises génèrent des marges bénéficiaires de 20-35 % — inimaginables dans l'industrie traditionnelle — grâce à leur position de monopole ou quasi-monopole sur leurs marchés.",
      },
      {
        type: "comparison-table",
        title: "Les Magnificent Seven — données financières clés 2024",
        headers: ["Entreprise", "Chiffre d'affaires", "Bénéfice net", "Marge nette", "Employés", "Secteur dominant"],
        rows: [
          { label: "Apple", flag: "us", cells: ["391 Md$", "97 Md$", "25%", "150 000", "Matériel + Ecosystème"] },
          { label: "Microsoft", flag: "us", cells: ["245 Md$", "88 Md$", "36%", "221 000", "Cloud + IA"] },
          { label: "Nvidia", flag: "us", cells: ["130 Md$", "63 Md$", "49%", "29 000", "Semi-conducteurs IA"] },
          { label: "Alphabet", flag: "us", cells: ["350 Md$", "100 Md$", "29%", "182 000", "Publicité + Cloud"] },
          { label: "Amazon", flag: "us", cells: ["635 Md$", "59 Md$", "9%", "1 600 000", "AWS + Retail"] },
          { label: "Meta", flag: "us", cells: ["164 Md$", "63 Md$", "38%", "75 000", "Réseaux sociaux"] },
          { label: "Tesla", flag: "us", cells: ["98 Md$", "7 Md$", "7%", "140 000", "Véhicules électriques"] },
        ],
      },
      {
        type: "image-text",
        heading: "Nvidia et l'ère de l'IA : la plus grande création de richesse de l'histoire",
        content:
          "Nvidia est le cas le plus spectaculaire de l'histoire boursière récente. En janvier 2023, la capitalisation de Nvidia était de 360 milliards de dollars. En juin 2024, elle dépassait 3 340 milliards. Soit une multiplication par 9 en 18 mois. Le catalyseur : la révolution de l'IA générative, dont les GPU (processeurs graphiques) de Nvidia sont l'infrastructure essentielle. Son chip H100, utilisé pour entraîner GPT-4, Gemini et tous les grands modèles de fondation, se vend à 30 000 dollars l'unité — avec des listes d'attente de 12 à 18 mois. En 2024, la marge brute de Nvidia a dépassé 70 % — un record absolu pour une entreprise industrielle.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/800px-Apple_logo_black.svg.png",
        imageAlt: "Logo Apple",
        flip: true,
      },
      {
        type: "timeline",
        title: "L'ascension des géants tech — jalons clés (2004-2025)",
        items: [
          {
            date: "2004",
            title: "Introduction en bourse de Google",
            description:
              "Google lève 1,7 milliard de dollars en IPO à une valorisation de 23 milliards. Vingt ans plus tard, Alphabet capitalise 2 400 milliards.",
          },
          {
            date: "2007",
            title: "Lancement de l'iPhone",
            description:
              "Steve Jobs présente le premier iPhone. L'écosystème Apple (App Store, services) va générer 400 milliards de revenus annuels d'ici 2025.",
          },
          {
            date: "2010",
            title: "AWS dépasse 1 Md$ de revenus",
            description:
              "Amazon Web Services, lancé en 2006, devient rentable. Il représente aujourd'hui 60% du bénéfice d'exploitation d'Amazon avec 105 Md$ de revenus.",
          },
          {
            date: "2020",
            title: "Apple : première capitalisation > 2 000 Md$",
            description:
              "Apple est la première entreprise à dépasser 2 000 milliards de dollars de capitalisation. Elle franchira 3 000 Md$ en 2023.",
          },
          {
            date: "2023",
            title: "L'explosion de l'IA générative",
            description:
              "ChatGPT lancé en nov. 2022 dépasse 100M d'utilisateurs en 2 mois. Nvidia, Microsoft et Google bénéficient d'une course aux GPU et au cloud IA.",
          },
          {
            date: "2025",
            title: "Régulation IA mondiale",
            description:
              "L'AI Act européen entre en vigueur. Les États-Unis débattent d'une loi fédérale. La Chine impose ses propres règles. La bataille des normes IA commence.",
          },
        ],
      },
      {
        type: "list",
        heading: "Les risques systémiques liés à la concentration des géants tech",
        style: "bullet",
        items: [
          {
            text: "Risque de monopole et déformation de la concurrence",
            note: "Google contrôle 91% des recherches mondiales, Apple et Google partagent 99% du marché des OS mobiles. L'antitrust peine à suivre.",
          },
          {
            text: "Risque de capture réglementaire et fiscale",
            note: "GAFAM ont payé des taux effectifs d'imposition de 10-15% pendant des décennies via optimisation dans paradis fiscaux. L'OCDE impose désormais un minimum de 15%.",
          },
          {
            text: "Risque de volatilité des marchés",
            note: "30% du S&P500 dans 7 valeurs : une correction tech de -30% impacterait l'ensemble des fonds de pension mondiaux.",
          },
          {
            text: "Risque géopolitique de dépendance technologique",
            note: "L'Europe dépend à 90% de services cloud américains. Une rupture diplomatique ou sanctions tech fragiliserait des économies entières.",
          },
          {
            text: "Risque IA non-régulée",
            note: "Les grands modèles de fondation (GPT-5, Gemini Ultra) développés par ces entreprises soulèvent des questions de sécurité, de biais et de souveraineté sans précédent.",
          },
        ],
      },
      {
        type: "highlight",
        content:
          "Les revenus annuels d'Apple (391 Md$) dépassent le PIB du Danemark (395 Md$). Les revenus d'Amazon (635 Md$) dépassent ceux de la Suède (600 Md$). Pour la première fois dans l'histoire économique, des entreprises privées atteignent l'échelle économique de nations souveraines.",
      },
      {
        type: "quote",
        text: "Nous ne sommes plus dans le capitalisme industriel du XXe siècle. Nous sommes dans un capitalisme de plateformes où les effets réseau créent des monopoles naturels que la régulation traditionnelle est incapable de démanteler.",
        source: "Margrethe Vestager, ancienne commissaire européenne à la Concurrence, 2024",
      },
    ],
    sources: [
        { title: "Fortune Global 500 — 2024 Rankings", outlet: "Fortune Magazine", year: "2024", url: "https://fortune.com/global500/" },
        { title: "Global largest companies by market cap", outlet: "S&P Global / Bloomberg", year: "2024" },
        { title: "World Investment Report 2024 — TNCs", outlet: "CNUCED / UNCTAD", year: "2024" },
        { title: "Amazon, Microsoft, Nvidia: the rise of US tech giants", outlet: "Financial Times", year: "2024" },
        { title: "Saudi Aramco, ADNOC: state oil companies rankings", outlet: "Reuters", year: "2024" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 8. COVID-19 IMPACT ÉCONOMIQUE
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "covid-impact-economique-cartographie",
    title: "COVID-19 : cartographie de l'impact économique mondial en 2020",
    excerpt:
      "La contraction de -3,5 % du PIB mondial en 2020 masque des réalités très hétérogènes : certains pays ont rebondi en quelques mois, d'autres s'en remettent encore. La plus grave récession depuis 1945.",
    theme: "economy",
    publishedAt: "2025-02-03",
    readingTime: 12,
    tags: ["COVID-19", "Récession", "PIB", "Politique économique", "Relance"],
    featured: false,
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/SARS-CoV-2_without_background.png/1200px-SARS-CoV-2_without_background.png",
    heroCaption: "Le coronavirus SARS-CoV-2 — agent pathogène de la plus grande crise économique mondiale depuis 1945.",
    body: [
      {
        type: "lead",
        content:
          "En 2020, le PIB mondial s'est contracté de 3,5 % — la plus forte récession depuis la Seconde Guerre mondiale. Mais derrière ce chiffre global se cachent des trajectoires radicalement différentes : la Chine a terminé l'année en territoire positif (+2,3 %), tandis que certaines économies ouvertes au tourisme ont vu leur PIB chuter de plus de 10 %. Une crise sans précédent qui a redéfini le rôle de l'État, les limites des banques centrales et l'architecture des filets de sécurité sociaux.",
      },
      {
        type: "stats",
        items: [
          { value: "-3,5 %", label: "Contraction PIB mondial 2020", note: "Pire depuis 1945" },
          { value: "+2,3 %", label: "Croissance Chine 2020", note: "Seul grand pays en positif" },
          { value: "-11 %", label: "PIB Espagne 2020", note: "Tourisme détruit" },
          { value: "16 000 Md€", label: "Plans de relance mondiaux", note: "Gouvernements + banques centrales" },
        ],
      },
      {
        type: "chart",
        title: "Variation du PIB réel en 2020 — les économies les plus touchées et les plus résilientes",
        subtitle: "FMI, World Economic Outlook janvier 2021. En % de variation annuelle.",
        unit: "% variation PIB réel 2020",
        bars: [
          { label: "Espagne", flag: "es", value: -11.0, color: "#C0392B", note: "Tourisme effondré" },
          { label: "Inde", flag: "in", value: -7.3, color: "#E74C3C", note: "Confinements stricts" },
          { label: "Italie", flag: "it", value: -8.9, color: "#D35400", note: "Première vague Lombardie" },
          { label: "Royaume-Uni", flag: "gb", value: -9.9, color: "#922B21", note: "Services touchés" },
          { label: "France", flag: "fr", value: -7.9, color: "#E74C3C", note: "2 confinements" },
          { label: "Allemagne", flag: "de", value: -4.9, color: "#F39C12", note: "Industrie résiliente" },
          { label: "États-Unis", flag: "us", value: -3.4, color: "#F39C12", note: "Résilience consomm." },
          { label: "Japon", flag: "jp", value: -4.1, color: "#F39C12", note: "Exportations -" },
          { label: "Brésil", flag: "br", value: -4.1, color: "#F39C12", note: "Gestion chaotique" },
          { label: "Zone euro", flag: "eu", value: -6.4, color: "#E67E22", note: "Moyenne" },
          { label: "Monde", flag: "un", value: -3.5, color: "#7F8C8D", note: "Référence" },
          { label: "Corée du Sud", flag: "kr", value: -0.9, color: "#2ECC71", note: "Résilience test+trace" },
          { label: "Australie", flag: "au", value: -2.4, color: "#27AE60", note: "Confinements régionaux" },
          { label: "Chine", flag: "cn", value: 2.3, color: "#3498DB", note: "Seul G20 positif" },
          { label: "Taiwan", flag: "tw", value: 3.1, color: "#2980B9", note: "Tech exports +" },
        ],
      },
      {
        type: "map-highlight",
        title: "Impact du COVID-19 sur le PIB en 2020 — carte mondiale",
        subtitle: "Variation annuelle du PIB réel 2020. Source : FMI.",
        countries: {
          es: { color: "#922B21", label: "-11% (très sévère)" },
          gb: { color: "#922B21", label: "-9,9% (très sévère)" },
          it: { color: "#C0392B", label: "-8,9% (sévère)" },
          in: { color: "#C0392B", label: "-7,3% (sévère)" },
          fr: { color: "#C0392B", label: "-7,9% (sévère)" },
          de: { color: "#E67E22", label: "-4,9% (modéré)" },
          jp: { color: "#E67E22", label: "-4,1% (modéré)" },
          br: { color: "#E67E22", label: "-4,1% (modéré)" },
          us: { color: "#F39C12", label: "-3,4% (limité)" },
          au: { color: "#F39C12", label: "-2,4% (limité)" },
          kr: { color: "#2ECC71", label: "-0,9% (résilient)" },
          cn: { color: "#2980B9", label: "+2,3% (positif)" },
          tw: { color: "#2980B9", label: "+3,1% (positif)" },
          vn: { color: "#27AE60", label: "+2,9% (positif)" },
        },
        legend: [
          { color: "#922B21", label: "Effondrement (< -9%)" },
          { color: "#C0392B", label: "Sévère (-7 à -9%)" },
          { color: "#E67E22", label: "Modéré (-4 à -7%)" },
          { color: "#F39C12", label: "Limité (-1 à -4%)" },
          { color: "#2980B9", label: "Positif (croissance malgré COVID)" },
        ],
      },
      {
        type: "text",
        heading: "Pourquoi la Chine a-t-elle résisté alors que le monde s'effondrait ?",
        content:
          "La Chine est le seul pays du G20 à avoir terminé l'année 2020 avec une croissance positive (+2,3 %). Plusieurs facteurs l'expliquent. D'abord, le confinement de Wuhan (janvier-mars 2020) a été extrêmement strict et court : la Chine a maîtrisé la première vague avant les autres. Ensuite, son économie manufacturière (acier, électronique, médicaments) a bénéficié d'une demande mondiale explosive en équipements de protection et en biens de consommation achetés en ligne. Exports chinois 2020 : +3,6 %. Enfin, le plan de relance de 4 trillions de yuans (500 Md€) a soutenu l'investissement en infrastructures. À l'opposé, les économies du tourisme (Espagne, Thaïlande, Grèce) ont connu un choc d'une brutalité sans précédent.",
      },
      {
        type: "timeline",
        title: "Chronologie de la crise et des réponses économiques mondiales (2020-2022)",
        items: [
          {
            date: "Janvier 2020",
            title: "Confinement de Wuhan — premier choc",
            description:
              "La Chine confine 50 millions de personnes. Les marchés mondiaux commencent à anticiper un choc d'approvisionnement mais restent calmes.",
          },
          {
            date: "Mars 2020",
            title: "Pandémie mondiale — crash boursier historique",
            description:
              "L'OMS déclare la pandémie. Le S&P 500 chute de 34% en 33 jours — la chute la plus rapide de l'histoire. Fermetures d'économies mondiales simultanées.",
          },
          {
            date: "Mars-Avril 2020",
            title: "Réponse des banques centrales — bazooka monétaire",
            description:
              "Fed : taux à 0% + 700 Md$ QE. BCE : PEPP de 750 Md€. BoJ, BoE, RBA : mêmes actions. Injection totale : ~10 000 Md$ en 6 semaines.",
          },
          {
            date: "Avril 2020",
            title: "Plans de relance fiscaux records",
            description:
              "USA : CARES Act (2 200 Md$). UE : instrument de relance (750 Md€). Allemagne : 130 Md€. France : 100 Md€. Total mondial : 16 000 Md€.",
          },
          {
            date: "Novembre 2020",
            title: "Annonce des vaccins — espoir financier",
            description:
              "Pfizer/BioNTech annoncent un vaccin efficace à 90%. Les marchés rebondissent de 15% en une semaine — la plus forte hausse hebdomadaire depuis 1987.",
          },
          {
            date: "2021",
            title: "Rebond économique — mais aussi inflation",
            description:
              "PIB mondial : +6,0% en 2021, rebond record. Mais la combinaison de relances massives et de perturbations des chaînes d'approvisionnement déclenche une inflation à 8-10% en 2022.",
          },
        ],
      },
      {
        type: "comparison-table",
        title: "Réponse économique au COVID-19 : comparaison des plans de relance nationaux",
        headers: ["Pays", "Plan de relance", "% du PIB", "Instrument central", "Résultat PIB 2020"],
        rows: [
          { label: "États-Unis", flag: "us", cells: ["2 200 Md$", "10,5%", "Chèques directs + PPP", "-3,4%"] },
          { label: "Allemagne", flag: "de", cells: ["130 Md€", "3,8%", "Chômage partiel (Kurzarbeit)", "-4,9%"] },
          { label: "France", flag: "fr", cells: ["100 Md€", "4,0%", "Chômage partiel + PGE", "-7,9%"] },
          { label: "Japon", flag: "jp", cells: ["108 000 Md¥", "19,7%", "Transfers directs + prêts", "-4,1%"] },
          { label: "Royaume-Uni", flag: "gb", cells: ["280 Md£", "12,8%", "Furlough scheme + prêts", "-9,9%"] },
          { label: "Chine", flag: "cn", cells: ["4 000 Md¥", "3,5%", "Infrastructure + crédits", "+2,3%"] },
          { label: "Brésil", flag: "br", cells: ["525 Md R$", "7,3%", "Aide sociale directe", "-4,1%"] },
          { label: "Inde", flag: "in", cells: ["29 000 Md₹", "10%", "Infrastructure + vivres", "-7,3%"] },
        ],
      },
      {
        type: "image-text",
        heading: "L'héritage économique de la pandémie : inflation, dettes et fractures",
        content:
          "Les conséquences économiques de la COVID-19 s'étendent bien au-delà de 2020. Les plans de relance massifs ont semé les graines de l'inflation record de 2022 (8-10 % en zone euro et aux USA). La hausse des taux d'intérêt qui s'ensuivit (BCE : 0 % → 4,5 %, Fed : 0 % → 5,5 %) a alourdi les charges de la dette pour tous les États. Par ailleurs, la pandémie a accéléré trois tendances structurelles : l'e-commerce (+40 % de 2019 à 2021), le télétravail (10 % → 30 % des actifs tertiaires dans les pays développés), et la numérisation des services publics. Les inégalités ont aussi été amplifiées : les ménages dotés d'actifs financiers ont vu leur patrimoine exploser avec la hausse des marchés, tandis que les travailleurs peu qualifiés sans filet de sécurité ont subi de plein fouet les arrêts économiques.",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/SARS-CoV-2_without_background.png/1200px-SARS-CoV-2_without_background.png",
        imageAlt: "Virus SARS-CoV-2",
        flip: false,
      },
      {
        type: "list",
        heading: "Les 6 leçons économiques durables de la pandémie COVID-19",
        style: "number",
        items: [
          {
            text: "Les États ont une capacité d'intervention budgétaire bien supérieure à ce que les dogmes pensaient",
            note: "16 000 Md€ de relances en 2020 sans déclencher de crise de la dette immédiate — un résultat inattendu pour les économistes orthodoxes.",
          },
          {
            text: "La fragilité des chaînes d'approvisionnement mondiales trop longues",
            note: "Pénuries de semi-conducteurs, de masques, de médicaments : le just-in-time poussé à l'extrême a montré ses limites.",
          },
          {
            text: "La banque centrale n'est pas le seul filet de sécurité — mais c'est le plus rapide",
            note: "Les QE massifs de 2020 ont évité un effondrement systémique. Mais au prix d'une inflation record en 2022.",
          },
          {
            text: "Les inégalités se creusent en période de crise",
            note: "Actifs financiers +40% (bénéficiaires : 20% supérieur) vs pertes d'emploi massives (touchant les 40% inférieurs).",
          },
          {
            text: "La numérisation est un choc de productivité — pour certains",
            note: "Les économies avancées avec un fort secteur numérique (USA, Corée, Taïwan) ont mieux résisté que celles dépendantes du tourisme ou de l'industrie lourde.",
          },
          {
            text: "La préparation aux pandémies est un investissement économique rentable",
            note: "Les pays avec de forts systèmes de santé publique (Corée, Taïwan, Allemagne) ont limité le coût économique. Le COVID a coûté 12 000 Md$ à l'économie mondiale de 2020 à 2022.",
          },
        ],
      },
      {
        type: "gallery",
        title: "La crise COVID-19 en images économiques",
        images: [
          {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/SARS-CoV-2_without_background.png/1200px-SARS-CoV-2_without_background.png",
            caption:
              "Le SARS-CoV-2 — une pandémie virale devenue la plus grande crise économique mondiale depuis la Seconde Guerre mondiale",
            credit: "CDC / Wikimedia Commons",
          },
          {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Financial_district_Manhattan.jpg/1280px-Financial_district_Manhattan.jpg",
            caption:
              "Wall Street vide au printemps 2020 — les marchés financiers ont perdu 30% en 33 jours avant de rebondir grâce aux interventions des banques centrales",
            credit: "Wikimedia Commons",
          },
        ],
      },
      {
        type: "highlight",
        content:
          "Le coût total de la pandémie COVID-19 pour l'économie mondiale est estimé à 12 000 milliards de dollars entre 2020 et 2022 — soit l'équivalent de la production économique annuelle de la Chine. C'est le plus grand choc économique soudain de l'histoire moderne.",
      },
      {
        type: "quote",
        text: "La COVID-19 n'a pas seulement causé une récession. Elle a redéfini ce que signifie être un État : la capacité de protéger ses citoyens de chocs exogènes est désormais une composante centrale de la légitimité politique.",
        source: "Kristalina Georgieva, Directrice générale du FMI, 2021",
      },
    ],
    sources: [
        { title: "World Economic Outlook, October 2021 — Recovery During a Pandemic", outlet: "FMI", year: "2021", url: "https://www.imf.org/en/Publications/WEO" },
        { title: "Global Economic Prospects — Post-COVID Recovery", outlet: "Banque mondiale", year: "2022" },
        { title: "COVID-19 fiscal measures and economic impact", outlet: "FMI — Fiscal Monitor", year: "2021" },
        { title: "Our World in Data — COVID and GDP", outlet: "Our World in Data / University of Oxford", year: "2022", url: "https://ourworldindata.org/covid-gdp" },
        { title: "The economic fallout of COVID-19 in numbers", outlet: "OCDE", year: "2022" },
    ],
  },
];
