import type { Article } from "@/types";

export const MILITARY_ARTICLES: Article[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // 1. La nouvelle course aux armements 2025
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "course-armements-2025",
    theme: "military",
    title: "La nouvelle course aux armements : qui dépense le plus en 2025 ?",
    excerpt:
      "Les dépenses militaires mondiales ont atteint 2 443 Mds€ en 2024, un record absolu. USA, Chine et Europe augmentent leurs budgets à un rythme sans précédent depuis la Guerre Froide.",
    readingTime: 9,
    tags: ["budget défense", "OTAN", "réarmement", "USA", "Chine"],
    publishedAt: "2025-03-15",
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/US_Navy_050510-N-0000X-001_An_aerial_photo_of_USS_Ronald_Reagan_%28CVN_76%29.jpg/1280px-US_Navy_050510-N-0000X-001_An_aerial_photo_of_USS_Ronald_Reagan_%28CVN_76%29.jpg",
    heroCaption: "Porte-avions USS Ronald Reagan — symbole de la puissance militaire américaine.",
    body: [
      {
        type: "lead",
        content:
          "Jamais depuis la fin de la Guerre Froide les États n'avaient dépensé autant pour leur défense. Le total mondial des dépenses militaires a dépassé 2 443 milliards d'euros en 2024, selon le SIPRI. Une neuvième année consécutive de hausse, portée par les tensions en Europe, en Asie-Pacifique et au Moyen-Orient.",
      },
      {
        type: "stats",
        items: [
          { value: "2 443 Mds€", label: "Dépenses militaires mondiales 2024", note: "Record historique absolu — SIPRI" },
          { value: "886 Mds€", label: "Budget américain 2024", note: "36% du total mondial à lui seul" },
          { value: "+9%", label: "Hausse des pays européens de l'OTAN", note: "Réponse directe à la guerre en Ukraine" },
          { value: "+6,8%", label: "Hausse mondiale en termes réels", note: "La plus forte depuis 2009" },
        ],
      },
      {
        type: "text",
        heading: "Le triptyque USA-Chine-Russie concentre la puissance",
        content:
          "Les trois premières puissances militaires absorbent 55 % des dépenses mondiales. Les États-Unis maintiennent un avantage structurel colossal : leur budget représente trois fois celui de la Chine et huit fois celui de la Russie. Mais c'est la dynamique de rattrapage qui inquiète les stratèges occidentaux : Pékin a multiplié son budget par dix en vingt ans.",
      },
      {
        type: "chart",
        title: "Dépenses militaires mondiales — Top 10 (2024)",
        subtitle: "Source : SIPRI Military Expenditure Database 2024",
        unit: "Mds€",
        bars: [
          { label: "États-Unis", flag: "us", value: 886, color: "#1A5276", note: "36% du total mondial" },
          { label: "Chine", flag: "cn", value: 296, color: "#C0392B", note: "+7% en un an" },
          { label: "Russie", flag: "ru", value: 109, color: "#7D3C98", note: "6,7% du PIB russe" },
          { label: "Inde", flag: "in", value: 83, color: "#D35400", note: "3e budget mondial" },
          { label: "Arabie Saoudite", flag: "sa", value: 75, color: "#148F77", note: "Conflit au Yémen" },
          { label: "Royaume-Uni", flag: "gb", value: 73, color: "#1A5276" },
          { label: "Allemagne", flag: "de", value: 66, color: "#1A5276", note: "Fonds spécial de 100 Mds€" },
          { label: "France", flag: "fr", value: 61, color: "#1A5276" },
          { label: "Japon", flag: "jp", value: 50, color: "#922B21", note: "Doublement en 5 ans" },
          { label: "Corée du Sud", flag: "kr", value: 48, color: "#117A65" },
        ],
      },
      {
        type: "text",
        heading: "L'Europe sort de trente ans de « dividende de la paix »",
        content:
          "De 1991 à 2022, les démocraties européennes ont réduit leurs armées, fermé des bases, désinvesti dans l'industrie de défense. La guerre en Ukraine a tout changé : en 2024, 23 des 32 membres de l'OTAN atteignent ou dépassent l'objectif de 2 % du PIB, contre seulement 7 en 2021. L'Allemagne, longtemps réticente, a créé un fonds spécial de 100 milliards d'euros. La Pologne consacre déjà 4 % de son PIB à la défense.",
      },
      {
        type: "map-highlight",
        title: "Alliances militaires et zones de tension (2025)",
        subtitle: "Membres OTAN, alliés russes et puissances non alignées",
        countries: {
          US: { color: "#1A5276", label: "OTAN" },
          CA: { color: "#1A5276", label: "OTAN" },
          GB: { color: "#1A5276", label: "OTAN" },
          FR: { color: "#1A5276", label: "OTAN" },
          DE: { color: "#1A5276", label: "OTAN" },
          IT: { color: "#1A5276", label: "OTAN" },
          ES: { color: "#1A5276", label: "OTAN" },
          PL: { color: "#1A5276", label: "OTAN" },
          TR: { color: "#1A5276", label: "OTAN" },
          NL: { color: "#1A5276", label: "OTAN" },
          BE: { color: "#1A5276", label: "OTAN" },
          NO: { color: "#1A5276", label: "OTAN" },
          RU: { color: "#C0392B", label: "Russie" },
          BY: { color: "#C0392B", label: "Allié Russie" },
          CN: { color: "#E74C3C", label: "Chine" },
          IN: { color: "#7D6608", label: "Non-aligné" },
          BR: { color: "#7D6608", label: "Non-aligné" },
        },
        legend: [
          { color: "#1A5276", label: "Membres OTAN" },
          { color: "#C0392B", label: "Russie & alliés" },
          { color: "#E74C3C", label: "Chine" },
          { color: "#7D6608", label: "Non-alignés" },
        ],
      },
      {
        type: "timeline",
        title: "Chronologie du réarmement mondial (2014–2025)",
        items: [
          { date: "2014", title: "Annexion de la Crimée", description: "Premier signal d'alarme pour l'OTAN. Décision du sommet de Newport : 2 % du PIB pour tous." },
          { date: "2017", title: "Seulement 5 pays OTAN à 2 %", description: "USA, Grèce, Estonie, Royaume-Uni et Pologne. La cible est ignorée par la plupart." },
          { date: "2022", title: "Invasion totale de l'Ukraine", description: "Choc stratégique. L'Allemagne annonce le Zeitenwende (tournant historique) et 100 Mds€." },
          { date: "2023", title: "23 pays OTAN au-dessus de 2 %", description: "Rattrapage massif. Les industries de défense européennes saturent leurs capacités de production." },
          { date: "2024", title: "Record mondial 2 443 Mds€", description: "SIPRI confirme le plus haut niveau depuis la fin de la Guerre Froide." },
          { date: "2025", title: "L'OTAN envisage 3 % du PIB", description: "Pression de Trump et de la Pologne pour relever le seuil face à la menace russe persistante." },
        ],
      },
      {
        type: "highlight",
        content:
          "L'industrie de défense européenne tourne à pleine capacité pour la première fois depuis 1991. Les délais de livraison de munitions 155 mm atteignent 36 mois. Le réarmement n'est plus seulement budgétaire — il est industriel.",
      },
      {
        type: "carousel",
        title: "Les programmes d'armement les plus coûteux au monde",
        items: [
          { name: "F-35 Lightning II", emoji: "✈️", detail: "1 700 Mds$ sur cycle de vie complet", subdetail: "Programme le plus cher de l'histoire militaire américaine" },
          { name: "Ford-class carriers", emoji: "⚓", detail: "13 Mds$ par porte-avions", subdetail: "USS Gerald R. Ford : 5 ans de retard, 2,4 Mds$ de dépassement" },
          { name: "Columbia SSBN", emoji: "🚢", detail: "132 Mds$ pour 12 sous-marins", subdetail: "Successeurs des Ohio, premier service prévu 2031" },
          { name: "Eurofighter Typhoon", emoji: "🛩️", detail: "90 Mds€ programme total", subdetail: "4 nations, 623 appareils livrés à ce jour" },
          { name: "MGCS franco-allemand", emoji: "🔫", detail: "Char de combat futur 2040", subdetail: "Successeur du Leclerc et du Leopard 2, budget estimé 100 Mds€" },
        ],
      },
      {
        type: "quote",
        text: "Si vous voulez la paix, préparez la guerre. L'Europe a oublié cette leçon pendant trente ans. Elle la redécouvre douloureusement.",
        source: "Général Christophe Gomart, ancien directeur du renseignement militaire français (DRM)",
      },
      {
        type: "list",
        heading: "Les facteurs structurels du réarmement mondial",
        style: "check",
        items: [
          { text: "Guerre en Ukraine : premier conflit de haute intensité en Europe depuis 1945", note: "Consommation de munitions multipliée par 10 par rapport aux estimations OTAN" },
          { text: "Rivalité sino-américaine en Indo-Pacifique", note: "Taiwan, mer de Chine méridionale, îles Senkaku" },
          { text: "Programmes balistiques nord-coréen et iranien", note: "Déstabilisation régionale au Moyen-Orient et en Asie du Nord-Est" },
          { text: "Terrorisme et conflits sub-étatiques persistants", note: "Sahel, Somalie, Yémen, Afghanistan" },
          { text: "Cybersécurité et guerre informationnelle", note: "Nouveaux domaines de conflit exigeant des budgets dédiés" },
          { text: "Course aux technologies de rupture", note: "IA militaire, hypersoniques, drones, guerre dans l'espace" },
        ],
      },
      {
        type: "text",
        heading: "Vers une économie de guerre permanente ?",
        content:
          "La question n'est plus de savoir si le réarmement est nécessaire, mais de savoir si les économies démocratiques peuvent le soutenir dans la durée. Les États-Unis consacrent déjà 3,4 % de leur PIB à la défense. La Russie y engloutit 6,7 % — un effort de guerre total qui pèse sur sa population. La Chine avance de manière opaque, mais son budget officiel augmente d'environ 7 % par an depuis quinze ans. La grande question du XXIe siècle militaire sera peut-être celle de l'endurance économique.",
      },
    ],
    sources: [
        { title: "SIPRI Military Expenditure Database 2024", outlet: "SIPRI", year: "2024", url: "https://www.sipri.org/databases/milex" },
        { title: "SIPRI Yearbook 2024: Armaments, Disarmament and International Security", outlet: "SIPRI", year: "2024" },
        { title: "NATO Defence Expenditure — 2024 Data", outlet: "OTAN / NATO", year: "2024", url: "https://www.nato.int/cps/en/natohq/topics_49198.htm" },
        { title: "The Military Balance 2024", outlet: "IISS", year: "2024" },
        { title: "Global military spending hits record high", outlet: "Reuters", year: "2024" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 2. La bataille des chars en Ukraine
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "chars-guerre-ukraine",
    theme: "military",
    title: "La bataille des chars en Ukraine : Leopard, Abrams et T-90 face à face",
    excerpt:
      "Pour la première fois depuis 1945, des chars occidentaux de dernière génération s'affrontent aux blindés russes sur un champ de bataille européen. Bilan des performances et des pertes.",
    readingTime: 11,
    tags: ["Ukraine", "chars", "Leopard 2", "T-90", "guerre terrestre"],
    publishedAt: "2025-01-20",
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Leopard_2_A5_Bundeswehr.jpg/1280px-Leopard_2_A5_Bundeswehr.jpg",
    heroCaption: "Leopard 2 A5 de la Bundeswehr — l'un des chars les plus exportés d'Europe.",
    body: [
      {
        type: "lead",
        content:
          "La guerre en Ukraine est devenue le plus grand laboratoire d'affrontements blindés depuis la Seconde Guerre mondiale. Pour la première fois, des Leopard 2, des M1A1 Abrams et des Challenger 2 britanniques ont été engagés face aux T-72, T-80 et T-90 russes. Les conclusions dérangent autant qu'elles éclairent.",
      },
      {
        type: "stats",
        items: [
          { value: "80+", label: "Leopard 2 livrés à l'Ukraine", note: "Allemagne, Pologne, Espagne, Portugal, Norvège, Finlande" },
          { value: "31", label: "M1A1 Abrams engagés", note: "Retirés en octobre 2024 après pertes dues aux drones FPV" },
          { value: "14", label: "Challenger 2 livrés", note: "Aucun détruit par tir frontal direct jusqu'en 2024" },
          { value: "6 800+", label: "Blindés russes perdus (2022–2025)", note: "Source : Oryx / Mediazona" },
        ],
      },
      {
        type: "comparison-table",
        title: "Comparatif technique : chars principaux engagés en Ukraine",
        headers: ["Poids (t)", "Canon", "Blindage", "Équipage", "Prix unitaire"],
        rows: [
          { label: "Leopard 2 A6", flag: "de", cells: ["62,5", "120 mm Rh L/55", "Composite + ERA", "4", "~6,5 M€"] },
          { label: "M1A2 Abrams", flag: "us", cells: ["63,1", "120 mm M256", "Composite Chobham", "4", "~8,9 M€"] },
          { label: "Challenger 2", flag: "gb", cells: ["62,5", "120 mm L30A1 rayé", "Dorchester 2", "4", "~5,5 M€"] },
          { label: "T-90M Proryv", flag: "ru", cells: ["46,5", "125 mm 2A46M-4", "ERA Relikt", "3", "~4,5 M€"] },
          { label: "T-72B3", flag: "ru", cells: ["41,5", "125 mm 2A46M-5", "ERA Kontakt-5", "3", "~2,0 M€"] },
        ],
      },
      {
        type: "gallery",
        title: "Les principaux chars engagés en Ukraine",
        images: [
          {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Leopard_2_A5_Bundeswehr.jpg/800px-Leopard_2_A5_Bundeswehr.jpg",
            caption: "Leopard 2 A5 — version la plus répandue en service ukrainien",
            credit: "Bundeswehr / Wikimedia Commons",
          },
          {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/M1A1_Abrams_in_Iraq.jpg/800px-M1A1_Abrams_in_Iraq.jpg",
            caption: "M1A1 Abrams — le char principal de l'armée américaine",
            credit: "US Army / Wikimedia Commons",
          },
          {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/T-90A_2010_Alabino.jpg/800px-T-90A_2010_Alabino.jpg",
            caption: "T-90A — la version russe la plus avancée avant le T-90M",
            credit: "Vitaly V. Kuzmin / Wikimedia Commons",
          },
          {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Challenger_2_Bovington.jpg/800px-Challenger_2_Bovington.jpg",
            caption: "Challenger 2 britannique — blindage Dorchester réputé inviolable de face",
            credit: "Wikimedia Commons",
          },
        ],
      },
      {
        type: "text",
        heading: "Le Leopard 2 : star déçue ou outil mal employé ?",
        content:
          "Les attentes étaient immenses. La contre-offensive ukrainienne de juin 2023 devait démontrer la supériorité des blindés occidentaux. Résultat mitigé : plusieurs Leopard 2 A4 ont été perdus, notamment dans les champs de mines de Zaporijjia. Mais les analystes nuancent : les pertes sont survenues dans des conditions d'emploi dégradées, sans couverture aérienne et face à des champs de mines d'une densité inédite. Les Leopard 2 A6 — version plus récente avec blindage amélioré — ont affiché un bien meilleur bilan.",
      },
      {
        type: "image-text",
        heading: "Le T-90M Proryv : le meilleur char russe enfin engagé",
        content:
          "La Russie a progressivement engagé ses T-90M, sa version la plus moderne, après avoir épuisé une grande partie de ses T-72 et T-80. Avec le système de protection active Shtora et l'ERA Relikt, il offre une protection supérieure aux versions précédentes. Mais les équipages ukrainiens ont découvert ses failles : le toit de la tourelle reste vulnérable aux drones FPV équipés de charges creuses.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/T-90A_2010_Alabino.jpg/640px-T-90A_2010_Alabino.jpg",
        imageAlt: "T-90A lors d'exercices militaires russes",
        flip: true,
      },
      {
        type: "timeline",
        title: "Chronologie de la guerre blindée en Ukraine",
        items: [
          { date: "Fév. 2022", title: "Invasion et débâcle de Kiev", description: "La colonne blindée russe de 60 km s'enlise. Les ATGMs Javelin ukrainiens détruisent des centaines de T-72 et BTR." },
          { date: "Avr. 2022", title: "Bataille du Donbass", description: "Guerre d'artillerie et de positions. Les blindés jouent un rôle d'appui-feu plutôt que de percée." },
          { date: "Nov. 2022", title: "Libération de Kherson", description: "Retrait russe. L'Ukraine capture d'importants stocks de matériels, dont des T-90A en état de marche." },
          { date: "Jan. 2023", title: "Décision OTAN sur les chars", description: "Allemagne débloque les Leopard 2. USA annoncent 31 M1A1. Royaume-Uni avait déjà promis les Challenger 2." },
          { date: "Juin 2023", title: "Contre-offensive — résultats décevants", description: "L'Ukraine perd plusieurs Leopard 2 dans des champs de mines. La percée attendue n'a pas lieu." },
          { date: "Oct. 2024", title: "Retrait des Abrams", description: "Les USA conseillent de retirer les M1A1 après pertes par drones FPV. Leur signature thermique facilite le ciblage." },
        ],
      },
      {
        type: "highlight",
        content:
          "La leçon centrale d'Ukraine : aucun char n'est invulnérable face aux drones FPV à 500 euros équipés d'une charge creuse. La supériorité blindée du XXe siècle est conditionnée, au XXIe, par la supériorité dans le domaine des drones.",
      },
      {
        type: "list",
        heading: "Les enseignements tactiques de la guerre blindée en Ukraine",
        style: "number",
        items: [
          { text: "La combinaison chars + drones + artillerie est indispensable", note: "Les chars seuls sans couverture sont des cibles" },
          { text: "Les champs de mines hyper-denses neutralisent les percées blindées", note: "Densités russes : jusqu'à 2000 mines/km²" },
          { text: "Le toit des tourelles est le talon d'Achille de tous les chars", note: "Blindage le plus mince, visé par les drones top-attack" },
          { text: "La guerre électronique protège autant que l'acier", note: "Les brouilleurs anti-drone deviennent équipement standard" },
          { text: "La logistique détermine le rythme de la guerre blindée", note: "Un Leopard 2 consomme 500 L de carburant pour 100 km" },
          { text: "La formation des équipages est irremplaçable", note: "6 mois minimum pour être opérationnel sur Leopard 2" },
        ],
      },
      {
        type: "quote",
        text: "Les chars ne sont pas obsolètes. Mais ils doivent évoluer. La protection du dessus de la tourelle est maintenant aussi importante que le blindage frontal.",
        source: "Général Ben Hodges, ancien commandant des forces américaines en Europe (USAREUR)",
      },
      {
        type: "text",
        heading: "Vers les chars de 6e génération : intelligence artificielle et autonomie",
        content:
          "La leçon ukrainienne accélère le développement des prochaines générations de blindés. Le MGCS franco-allemand (Main Ground Combat System), le Leopard 3 en développement, et le programme T-14 Armata russe (dont la production reste confidentielle) intègreront tous des systèmes de protection active, des drones embarqués et des assistants IA pour la gestion du champ de bataille. L'ère du « char seul roi » est révolue ; celle du système de combat terrestre connecté commence.",
      },
    ],
    sources: [
        { title: "The Military Balance 2024 — Ground Forces", outlet: "IISS", year: "2024" },
        { title: "Russia-Ukraine War — Tank losses assessment", outlet: "Oryx Open Source Intelligence", year: "2024", url: "https://www.oryxspioenkop.com" },
        { title: "NATO Tanks to Ukraine — Tracking deliveries", outlet: "Kiel Institute for the World Economy", year: "2024" },
        { title: "Armoured warfare in Ukraine: lessons", outlet: "Royal United Services Institute (RUSI)", year: "2024" },
        { title: "SIPRI — Arms transfers database", outlet: "SIPRI", year: "2024", url: "https://www.sipri.org/databases/armstransfers" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 3. La révolution des drones
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "drones-revolution-militaire",
    theme: "military",
    title: "La révolution des drones : du Bayraktar au Shahed, la guerre change de visage",
    excerpt:
      "Le drone Bayraktar TB2 turc a démontré en 2020 au Karabakh qu'un drone low-cost peut neutraliser un arsenal conventionnel. Une révolution qui rebat les cartes de la puissance militaire.",
    readingTime: 10,
    tags: ["drones", "Bayraktar", "Shahed", "guerre asymétrique", "Ukraine"],
    publishedAt: "2024-11-05",
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Bayraktar_TB2_2.jpg/1280px-Bayraktar_TB2_2.jpg",
    heroCaption: "Bayraktar TB2 en vol — le drone qui a révolutionné la guerre moderne.",
    body: [
      {
        type: "lead",
        content:
          "Un drone de combat à 5 millions d'euros capable de détruire un char à 4 millions ou une batterie de missiles sol-air à 400 millions. Les guerres du Karabakh (2020) et d'Ukraine (depuis 2022) ont définitivement consacré l'ère des drones comme armes de guerre décisives — à tous les niveaux de coût et de sophistication.",
      },
      {
        type: "stats",
        items: [
          { value: "30+", label: "Pays opérateurs du TB2", note: "Turquie, Ukraine, Maroc, Albanie, Somalie, Éthiopie…" },
          { value: "3 500+", label: "Drones Shahed-136 tirés par la Russie", note: "Contre infrastructure civile ukrainienne" },
          { value: "1 M+", label: "Drones FPV utilisés en Ukraine (2024)", note: "Des deux côtés, coût unitaire : 300–800 €" },
          { value: "5 M€", label: "Coût Bayraktar TB2", note: "Contre 400 M€ pour une batterie Pantsir détruite" },
        ],
      },
      {
        type: "comparison-table",
        title: "Comparatif des drones militaires clés",
        headers: ["Portée", "Endurance", "Charge utile", "Coût unitaire", "Pays d'origine"],
        rows: [
          { label: "Bayraktar TB2", flag: "tr", cells: ["300 km", "27 h", "150 kg", "5 M€", "Turquie"] },
          { label: "Shahed-136", flag: "ir", cells: ["2 000 km", "Kamikaze", "50 kg", "~20 k€", "Iran / Russie"] },
          { label: "Lancet-3", flag: "ru", cells: ["40 km", "40 min", "3 kg", "~35 k€", "Russie"] },
          { label: "MQ-9 Reaper", flag: "us", cells: ["1 900 km", "27 h", "1 700 kg", "30 M€", "États-Unis"] },
          { label: "Harop", flag: "il", cells: ["1 000 km", "9 h", "23 kg", "~1 M€", "Israël"] },
          { label: "DJI Mavic FPV", flag: "cn", cells: ["5 km", "20 min", "Grenade RPG", "~500 €", "Chine (civil)"] },
        ],
      },
      {
        type: "text",
        heading: "Le Bayraktar TB2 : David contre Goliath",
        content:
          "Le conflit du Haut-Karabakh en septembre-octobre 2020 a stupéfait les analystes militaires. L'Azerbaïdjan, équipé de TB2 turcs, a détruit en six semaines l'essentiel de l'armement lourd arménien : chars T-72, artillerie, systèmes anti-aériens Osa et S-300. Images à l'appui — les Azéris diffusaient en temps réel les frappes sur YouTube. La puissance aérienne déléguée à un drone de 6 tonnes pour 5 millions d'euros venait de battre des systèmes sol-air coûtant dix à cent fois plus cher.",
      },
      {
        type: "gallery",
        title: "Les drones qui transforment la guerre",
        images: [
          {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Bayraktar_TB2_2.jpg/800px-Bayraktar_TB2_2.jpg",
            caption: "Bayraktar TB2 — drone turc qui a changé la donne au Karabakh et en Ukraine",
            credit: "Baykar / Wikimedia Commons",
          },
          {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/MQ-9_Reaper_UAV.jpg/800px-MQ-9_Reaper_UAV.jpg",
            caption: "MQ-9 Reaper américain — le drone de chasse longue portée de référence",
            credit: "US Air Force / Wikimedia Commons",
          },
          {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Shahed-136_wreckage.jpg/800px-Shahed-136_wreckage.jpg",
            caption: "Épave d'un drone Shahed-136 abattu en Ukraine",
            credit: "Wikimedia Commons",
          },
        ],
      },
      {
        type: "image-text",
        heading: "Le Shahed-136 : la munition rôdeuse low-cost de la Russie",
        content:
          "Depuis septembre 2022, la Russie utilise massivement le drone iranien Shahed-136 (rebaptisé Geran-2) contre les infrastructures électriques et civiles ukrainiennes. Coût : environ 20 000 euros l'unité. Il vole à basse altitude, échappe aux radars et sature les défenses antiaériennes. L'Ukraine a abattu plus de 3 000 de ces drones, mais chaque interception par un missile sol-air coûte 100 à 500 fois plus cher que la cible.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Shahed-136_wreckage.jpg/640px-Shahed-136_wreckage.jpg",
        imageAlt: "Épave d'un drone Shahed-136 abattu en Ukraine",
      },
      {
        type: "timeline",
        title: "L'ascension des drones militaires (2001–2025)",
        items: [
          { date: "2001", title: "Premier kill du Predator en Afghanistan", description: "Les USA utilisent pour la première fois un drone armé au combat. Le Predator/Reaper devient l'outil de la guerre contre-terroriste." },
          { date: "2015–2016", title: "Drones dans la guerre de Syrie", description: "Les acteurs non-étatiques (ISIS) utilisent des drones commerciaux modifiés. Les grandes puissances observent et tirent les leçons." },
          { date: "2020", title: "Karabakh — révolution TB2", description: "L'Azerbaïdjan détruit 90 chars et 180 véhicules blindés arméniens en 6 semaines. Le monde prend note." },
          { date: "2022", title: "Ukraine — drones omniprésents", description: "TB2, Shahed-136, Lancet, drones FPV civils modifiés : toutes les dimensions de la guerre de drones en même temps." },
          { date: "2024", title: "Drones de portée stratégique", description: "L'Ukraine frappe des raffineries russes à 1 500 km avec des drones biplans maison. La frontière drone/missile s'efface." },
          { date: "2025", title: "IA et essaims autonomes", description: "Les armées développent des essaims de drones autonomes coordonnés par IA. L'OTAN doctrinalise le « Multi-Domain Operations » incluant les drones." },
        ],
      },
      {
        type: "highlight",
        content:
          "La guerre en Ukraine consomme environ 10 000 drones par mois dans chaque camp. L'industrie mondiale de drones militaires ne peut pas suivre ce rythme. Les fabricants civils (DJI, Autel) fournissent involontairement les composants des armes les plus utilisées du conflit.",
      },
      {
        type: "list",
        heading: "Les nouvelles doctrines d'emploi des drones",
        style: "bullet",
        items: [
          { text: "Drones FPV (First Person View) : l'infanterie comme artillerie précise", note: "Portée 5–10 km, charge RPG, coût 300–800 €" },
          { text: "Munitions rôdeuses (loitering munitions) : missile + drone hybride", note: "Shahed, Lancet, Harop — attendent et frappent au moment optimal" },
          { text: "Essaim coordonné : saturer les défenses antiaériennes par le nombre" },
          { text: "Drone de reconnaissance + artillerie : la boucle de ciblage passe de 72h à 5 minutes" },
          { text: "Drones sous-marins : nouvelle menace pour les câbles et navires", note: "Ukraine a coulé plusieurs navires russes avec des drones navals" },
          { text: "Guerre électronique anti-drone : brouillage GPS, lasers, dôme de fer miniature" },
        ],
      },
      {
        type: "chart",
        title: "Drones militaires : budgets d'acquisition par pays (2024)",
        subtitle: "Estimations combinées IISS / SIPRI — milliards d'euros",
        unit: "Mds€",
        bars: [
          { label: "États-Unis", flag: "us", value: 14.2, color: "#1A5276" },
          { label: "Chine", flag: "cn", value: 8.5, color: "#C0392B" },
          { label: "Turquie", flag: "tr", value: 2.1, color: "#117A65" },
          { label: "Israël", flag: "il", value: 1.8, color: "#7D6608" },
          { label: "Russie", flag: "ru", value: 1.5, color: "#7D3C98" },
          { label: "Iran", flag: "ir", value: 0.9, color: "#D35400" },
          { label: "Inde", flag: "in", value: 0.8, color: "#148F77" },
          { label: "France", flag: "fr", value: 0.7, color: "#1F618D" },
        ],
      },
      {
        type: "quote",
        text: "Les drones ont fait en dix ans ce que l'aviation a fait en cinquante ans : démocratiser la puissance de frappe aérienne de précision. Mais contrairement à l'avion de chasse, le drone ne coûte pas la vie d'un pilote.",
        source: "Dr. T.X. Hammes, expert en stratégie militaire, National Defense University (Washington)",
      },
    ],
    sources: [
        { title: "SIPRI — Uncrewed aerial vehicles in military operations", outlet: "SIPRI", year: "2024" },
        { title: "The Military Balance 2024 — Emerging technologies", outlet: "IISS", year: "2024" },
        { title: "Lethal Autonomous Weapons: Policy Brief", outlet: "Human Rights Watch", year: "2023" },
        { title: "AI in Military Applications", outlet: "RAND Corporation", year: "2023", url: "https://www.rand.org" },
        { title: "Drone warfare in Ukraine — Bureau of Investigative Journalism", outlet: "Bureau of Investigative Journalism", year: "2024" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 4. La Chine et sa marine
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "marine-guerre-mer-chine",
    theme: "military",
    title: "La Chine et sa marine : 727 navires pour contrôler la mer de Chine",
    excerpt:
      "La marine chinoise est désormais la plus grande du monde en nombre de navires. Ses 3 porte-avions, 8 destroyers Type 055 et 60+ sous-marins transforment l'équilibre indo-pacifique.",
    readingTime: 12,
    tags: ["Chine", "marine", "Taiwan", "Indo-Pacifique", "porte-avions"],
    publishedAt: "2024-08-12",
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/China_aircraft_carrier_Liaoning_CV-16.jpg/1280px-China_aircraft_carrier_Liaoning_CV-16.jpg",
    heroCaption: "Porte-avions Liaoning (CV-16) — le premier porte-avions chinois, entré en service en 2012.",
    body: [
      {
        type: "lead",
        content:
          "En deux décennies, la Chine a accompli ce que les États-Unis ont mis un siècle à bâtir : une marine de haute mer capable de projeter la puissance à des milliers de kilomètres. Avec 727 navires et 3 porte-avions, la PLAN (People's Liberation Army Navy) est la plus grande flotte du monde en tonnage. Elle défie ouvertement la suprématie américaine dans l'Indo-Pacifique.",
      },
      {
        type: "stats",
        items: [
          { value: "727", label: "Navires de la PLAN (2024)", note: "Plus que les USA (291) et la Russie (600) réunis" },
          { value: "3", label: "Porte-avions en service", note: "Liaoning, Shandong, Fujian — 4e en construction" },
          { value: "8", label: "Destroyers Type 055", note: "Les plus puissants hors USA — 12 500 tonnes" },
          { value: "66+", label: "Sous-marins dont 12 nucléaires", note: "La 3e flotte sous-marine mondiale" },
        ],
      },
      {
        type: "comparison-table",
        title: "Comparatif des flottes majeures en Indo-Pacifique (2024)",
        headers: ["Navires total", "Porte-avions", "Destroyers", "Sous-marins", "Budget naval"],
        rows: [
          { label: "Chine (PLAN)", flag: "cn", cells: ["727", "3 (+ 1 en const.)", "50+", "66", "~80 Mds€"] },
          { label: "États-Unis (USN)", flag: "us", cells: ["291", "11 (+1 réserve)", "22", "68", "~210 Mds€"] },
          { label: "Japon (JMSDF)", flag: "jp", cells: ["154", "2 porte-hélicos", "37", "22", "~18 Mds€"] },
          { label: "Australie (RAN)", flag: "au", cells: ["45", "0", "9", "6", "~6 Mds€"] },
          { label: "Inde (IN)", flag: "in", cells: ["140", "2", "14", "22", "~12 Mds€"] },
        ],
      },
      {
        type: "text",
        heading: "Le Fujian : le porte-avions qui change tout",
        content:
          "Le Fujian (CV-18), lancé en juin 2022 et en phase de tests en 2024, est le premier porte-avions non américain équipé de catapultes électromagnétiques EMALS. Cette technologie, que seul le USS Gerald R. Ford possède au monde, permet de lancer des appareils plus lourds, plus fréquemment, avec moins d'usure mécanique. Le Fujian peut opérer des chasseurs J-15T en configuration pleine charge, des drones de combat et potentiellement des appareils de surveillance à longue portée. Pékin a franchi un saut technologique que beaucoup d'analystes pensaient impossible avant 2030.",
      },
      {
        type: "gallery",
        title: "La flotte porte-avions de la Chine",
        images: [
          {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/China_aircraft_carrier_Liaoning_CV-16.jpg/800px-China_aircraft_carrier_Liaoning_CV-16.jpg",
            caption: "Liaoning (CV-16) — racheté à l'Ukraine soviétique, refait à neuf en 12 ans",
            credit: "PLA Navy / Wikimedia Commons",
          },
          {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/PLA_Navy_Type_055_destroyer.jpg/800px-PLA_Navy_Type_055_destroyer.jpg",
            caption: "Destroyer Type 055 — le plus puissant destroyer hors US Navy",
            credit: "PLA Navy / Wikimedia Commons",
          },
        ],
      },
      {
        type: "map-highlight",
        title: "Zones de contrôle et de contestation en mer de Chine (2025)",
        subtitle: "La ligne des neuf tirets et les îles artificielles militarisées",
        countries: {
          CN: { color: "#C0392B", label: "Chine — revendications maximales" },
          TW: { color: "#E74C3C", label: "Taiwan (contesté)" },
          PH: { color: "#1A5276", label: "Philippines (allié USA)" },
          VN: { color: "#7D6608", label: "Vietnam (dispute SCS)" },
          MY: { color: "#7D6608", label: "Malaisie (dispute SCS)" },
          JP: { color: "#1A5276", label: "Japon (allié USA)" },
          AU: { color: "#1A5276", label: "Australie (AUKUS)" },
          US: { color: "#1A5276", label: "États-Unis" },
          KR: { color: "#1A5276", label: "Corée du Sud (allié USA)" },
        },
        legend: [
          { color: "#C0392B", label: "Revendications chinoises" },
          { color: "#E74C3C", label: "Zone contestée" },
          { color: "#1A5276", label: "Alliés et partenaires USA" },
          { color: "#7D6608", label: "États disputants non-alignés" },
        ],
      },
      {
        type: "text",
        heading: "Les îles artificielles : des porte-avions insubmersibles",
        content:
          "Entre 2013 et 2016, la Chine a drainé et aménagé sept récifs dans les îles Spratleys, créant de toutes pièces 3 200 hectares de terres artificielles. Elle y a construit des pistes d'atterrissage capables d'accueillir des Su-30 et J-11, des hangars pour drones et missiles HQ-9, des ports pour frégates et sous-marins. Ces « îles-bases » permettent à la PLAN de projeter la puissance à 1 500 km des côtes chinoises, englobant les routes maritimes du détroit de Malacca qui transportent 30 % du commerce mondial.",
      },
      {
        type: "timeline",
        title: "La montée en puissance de la marine chinoise (2000–2025)",
        items: [
          { date: "2000", title: "PLAN : flotte côtière", description: "La marine chinoise reste une force de défense littorale. Aucun porte-avions, sous-marins vieillissants." },
          { date: "2012", title: "Liaoning en service", description: "Premier porte-avions chinois. Symbole politique autant que militaire — capacité réelle encore limitée." },
          { date: "2015–2016", title: "Militarisation des Spratleys", description: "Construction d'îles artificielles, installation de missiles et radars. Les USA protestent sans agir." },
          { date: "2019", title: "Shandong (CV-17) en service", description: "Deuxième porte-avions, entièrement chinois, améliorations du tremplin." },
          { date: "2022", title: "Fujian (CV-18) lancé", description: "Révolution : catapultes EMALS, déplacement de 80 000 tonnes. Parité technologique avec la Marine américaine." },
          { date: "2024", title: "PLAN : 727 navires", description: "La PLAN dépasse toutes les marines mondiales en nombre. Le 4e porte-avions (CV-19) est en construction." },
        ],
      },
      {
        type: "highlight",
        content:
          "Chaque semaine, la marine chinoise lance en moyenne un destroyer ou une frégate. À ce rythme, la PLAN disposera de 400 navires de combat en 2035, contre 355 prévus pour la US Navy selon les projections actuelles du Congressional Budget Office.",
      },
      {
        type: "list",
        heading: "Les capacités de déni d'accès (A2/AD) de la Chine",
        style: "check",
        items: [
          { text: "Missiles balistiques anti-navires DF-21D et DF-26", note: "Surnommés « tueurs de porte-avions », portée 1 500–4 000 km" },
          { text: "Sous-marins nucléaires Jin-class (Type 094) armés de missiles JL-2", note: "Dissuasion maritime à portée intercontinentale" },
          { text: "Îles artificielles militarisées aux Spratleys et Paracel", note: "Portée des missiles HQ-9 : 200 km — couvre tout le SCS" },
          { text: "Guerre électronique et cyberattaques navales", note: "Centre d'excellence cyber PLA Strategic Support Force" },
          { text: "Drones navals et sous-marins autonomes", note: "Essaims de drones navals testés en mer de Chine méridionale" },
          { text: "Milice maritime : flotte de pêche armée", note: "200–400 navires opérant en zone grise — harcèlement sans conflit" },
        ],
      },
      {
        type: "quote",
        text: "L'ambition navale de la Chine n'est pas défensive. Elle vise à établir la suprématie dans la « première chaîne d'îles » d'ici 2027 et dans la « deuxième chaîne » d'ici 2049.",
        source: "Amiral Philip Davidson, ancien commandant de l'INDOPACOM, témoignage au Sénat américain (2021)",
      },
    ],
    sources: [
        { title: "The Military Balance 2024 — Naval Forces Asia-Pacific", outlet: "IISS", year: "2024" },
        { title: "SIPRI — Naval armaments Asia 2024", outlet: "SIPRI", year: "2024" },
        { title: "China's Naval Expansion and the Indo-Pacific", outlet: "US Congressional Research Service", year: "2024" },
        { title: "Taiwan Strait tensions — risk assessment", outlet: "RAND Corporation", year: "2024" },
        { title: "South China Sea — CSIS Asia Maritime Transparency Initiative", outlet: "CSIS", year: "2024", url: "https://amti.csis.org" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 5. L'Europe se réarme
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "europe-rearmement-otan",
    theme: "military",
    title: "L'Europe se réarme : 2% du PIB et la fin du dividende de la paix",
    excerpt:
      "La guerre en Ukraine a mis fin aux illusions d'une Europe sans menace. Allemagne, Pologne, Suède et France augmentent drastiquement leurs budgets. L'OTAN exige 2% du PIB, certains vont bien plus loin.",
    readingTime: 9,
    tags: ["OTAN", "Europe", "réarmement", "Allemagne", "Pologne"],
    publishedAt: "2025-02-18",
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Bundeswehr_Logo.svg/800px-Bundeswehr_Logo.svg.png",
    heroCaption: "Logo de la Bundeswehr — les forces armées allemandes en pleine modernisation.",
    body: [
      {
        type: "lead",
        content:
          "La Pologne consacre déjà 4 % de son PIB à la défense — le plus haut taux de l'OTAN. L'Allemagne a alloué 100 milliards d'euros pour moderniser sa Bundeswehr. La Suède et la Finlande ont rejoint l'Alliance. L'Europe guerrière est de retour, trente ans après la chute du Mur. Ce n'est pas un réarmement : c'est une refondation stratégique.",
      },
      {
        type: "stats",
        items: [
          { value: "4%", label: "Pologne — % PIB défense 2024", note: "Record absolu dans l'OTAN — 31 Mds€" },
          { value: "100 Mds€", label: "Fonds spécial Bundeswehr", note: "Annoncé par Scholz le 27 fév. 2022 — Zeitenwende" },
          { value: "23/32", label: "Pays OTAN au-dessus de 2 % du PIB", note: "Contre 7 en 2021 et 5 en 2014" },
          { value: "2 membres", label: "Nouveaux membres OTAN (2023–2024)", note: "Finlande (avr. 2023) et Suède (mars 2024)" },
        ],
      },
      {
        type: "chart",
        title: "Dépenses de défense européennes membres de l'OTAN — % du PIB (2024)",
        subtitle: "Source : OTAN, rapport annuel 2024",
        unit: "% PIB",
        bars: [
          { label: "Pologne", flag: "pl", value: 4.0, color: "#C0392B", note: "1er de l'OTAN" },
          { label: "Estonie", flag: "ee", value: 3.4, color: "#C0392B" },
          { label: "Lettonie", flag: "lv", value: 3.2, color: "#C0392B" },
          { label: "Lituanie", flag: "lt", value: 2.9, color: "#E74C3C" },
          { label: "Finlande", flag: "fi", value: 2.4, color: "#E74C3C" },
          { label: "Grèce", flag: "gr", value: 2.9, color: "#E74C3C" },
          { label: "Royaume-Uni", flag: "gb", value: 2.3, color: "#1A5276" },
          { label: "Allemagne", flag: "de", value: 2.1, color: "#1A5276", note: "Atteint 2% pour la 1re fois" },
          { label: "France", flag: "fr", value: 2.0, color: "#1A5276" },
          { label: "Italie", flag: "it", value: 1.5, color: "#7D6608", note: "Sous l'objectif" },
          { label: "Espagne", flag: "es", value: 1.3, color: "#922B21", note: "Sous l'objectif" },
        ],
      },
      {
        type: "text",
        heading: "L'Allemagne : le Zeitenwende (tournant historique)",
        content:
          "Le 27 février 2022, trois jours après l'invasion de l'Ukraine, le chancelier Olaf Scholz a prononcé un discours historique au Bundestag. L'Allemagne allait créer un fonds spécial de 100 milliards d'euros pour la Bundeswehr — hors budget ordinaire — et s'engager à dépasser 2 % du PIB pour la défense. Ce « Zeitenwende » (tournant des temps) a rompu avec 77 ans de retenue militaire allemande fondée sur la culpabilité post-nazie. La Bundeswehr, qui n'avait plus que 183 chars opérationnels en 2022, commande 105 Leopard 2 A8, 20 chars de déminage et d'importantes quantités de munitions.",
      },
      {
        type: "image-text",
        heading: "La Pologne : le pays qui prend la menace russe au sérieux",
        content:
          "Avec 1 300 km de frontière avec la Russie (via Kaliningrad) et la Biélorussie alliée de Moscou, la Pologne ne fait aucun pari sur la stabilité. Son armée passe de 120 000 à 300 000 soldats d'ici 2035. Elle commande 1 000 chars sud-coréens K2, 672 obusiers K9, 48 chasseurs F-35 et un bouclier antimissile SHORAD intégré. Son budget de défense — 4 % du PIB — dépasse celui de la France en valeur absolue.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/K2_Black_Panther_in_exercises_2023.jpg/640px-K2_Black_Panther_in_exercises_2023.jpg",
        imageAlt: "Char K2 Black Panther de l'armée polonaise lors d'exercices 2023",
        flip: false,
      },
      {
        type: "map-highlight",
        title: "L'élargissement de l'OTAN — état 2025",
        subtitle: "Finlande et Suède ont rejoint l'Alliance en 2023 et 2024",
        countries: {
          US: { color: "#1A5276", label: "OTAN fondateur" },
          CA: { color: "#1A5276", label: "OTAN fondateur" },
          GB: { color: "#1A5276", label: "OTAN fondateur" },
          FR: { color: "#1A5276", label: "OTAN fondateur" },
          DE: { color: "#1A5276", label: "OTAN 1955" },
          IT: { color: "#1A5276", label: "OTAN fondateur" },
          ES: { color: "#1A5276", label: "OTAN 1982" },
          PL: { color: "#2980B9", label: "OTAN 1999" },
          CZ: { color: "#2980B9", label: "OTAN 1999" },
          HU: { color: "#2980B9", label: "OTAN 1999" },
          EE: { color: "#2980B9", label: "OTAN 2004" },
          LV: { color: "#2980B9", label: "OTAN 2004" },
          LT: { color: "#2980B9", label: "OTAN 2004" },
          FI: { color: "#1ABC9C", label: "OTAN 2023 — nouveau" },
          SE: { color: "#1ABC9C", label: "OTAN 2024 — nouveau" },
          RU: { color: "#C0392B", label: "Russie" },
          BY: { color: "#C0392B", label: "Allié Russie" },
          UA: { color: "#7D6608", label: "Ukraine — candidat OTAN" },
        },
        legend: [
          { color: "#1A5276", label: "OTAN fondateurs / historiques" },
          { color: "#2980B9", label: "OTAN élargissement Est (1999–2004)" },
          { color: "#1ABC9C", label: "Nouveaux membres 2023–2024" },
          { color: "#C0392B", label: "Russie & Biélorussie" },
          { color: "#7D6608", label: "Ukraine (candidat)" },
        ],
      },
      {
        type: "timeline",
        title: "Le réarmement européen en dix dates (2014–2025)",
        items: [
          { date: "2014", title: "Sommet de Newport — décision 2 %", description: "L'annexion de la Crimée oblige l'OTAN à fixer un objectif de dépenses. Peu y croient à l'époque." },
          { date: "2017", title: "Seulement 5 pays à 2 %", description: "USA, Grèce, Estonie, Royaume-Uni, Pologne. La plupart des membres font de la résistance passive." },
          { date: "Fév. 2022", title: "Invasion de l'Ukraine — tournant", description: "La guerre en Europe revient. Scholz prononce le Zeitenwende. Les budgets sont débloqués d'urgence." },
          { date: "Avr. 2023", title: "Finlande rejoint l'OTAN", description: "1 340 km de frontière supplémentaire avec la Russie. Fin de 75 ans de neutralité." },
          { date: "Mars 2024", title: "Suède rejoint l'OTAN", description: "Fin de 200 ans de neutralité suédoise. Le flanc nord de l'OTAN est sécurisé — la mer Baltique devient presque un lac OTAN." },
          { date: "2025", title: "23/32 pays à 2 % ou plus", description: "L'objectif autrefois jugé irréaliste est devenu la norme. Certains poussent pour 3 %." },
        ],
      },
      {
        type: "highlight",
        content:
          "La Suède et la Finlande ont rejoint l'OTAN en 14 et 18 mois respectivement — un processus qui prend habituellement des années. C'est la mesure de l'urgence ressentie en Europe du Nord face à la Russie.",
      },
      {
        type: "list",
        heading: "Les grands programmes d'armement européens en cours",
        style: "number",
        items: [
          { text: "MGCS (Main Ground Combat System) — char franco-allemand 2040", note: "Successeur du Leclerc et Leopard 2 — budget estimé 100 Mds€" },
          { text: "SCAF (Système de Combat Aérien du Futur) — avion de 6e génération", note: "France, Allemagne, Espagne — premier vol prévu 2040" },
          { text: "EURODRONE — drone MALE européen", note: "Successeur du Reaper — disponibilité opérationnelle 2030" },
          { text: "Frégate FDI (Frégate de Défense et d'Intervention) française", note: "5 unités commandées, 1ère livrée en 2024" },
          { text: "Char K2 polonais (co-production avec Hyundai Rotem)", note: "1 000 unités — la plus grande commande de chars en Europe depuis 1990" },
          { text: "Missile hypersonique ASN4G français", note: "Successeur de l'ASMP-A, vitesse Mach 8, livraison 2035" },
        ],
      },
      {
        type: "quote",
        text: "Nous avons vendu nos casernes, réduit nos effectifs, arrêté de produire des obus. Maintenant nous redécouvrons que l'Europe a des frontières et que les frontières ont besoin d'être défendues.",
        source: "Thierry Breton, ancien Commissaire européen au Marché intérieur, sur le réarmement européen (2024)",
      },
    ],
    sources: [
        { title: "NATO Defence Expenditure 2024 — Member State Compliance", outlet: "OTAN / NATO", year: "2024", url: "https://www.nato.int" },
        { title: "SIPRI European military spending 2024", outlet: "SIPRI", year: "2024", url: "https://www.sipri.org/databases/milex" },
        { title: "EU Defence: rearmament and the European Defence Fund", outlet: "Commission européenne", year: "2024" },
        { title: "Germany's Zeitenwende: a year of rearmament", outlet: "Financial Times", year: "2023" },
        { title: "Eastern Europe military build-up since 2022", outlet: "Reuters", year: "2024" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 6. Armes nucléaires — les 9 puissances
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "nucleaire-puissances",
    theme: "military",
    title: "Armes nucléaires : les 9 puissances, 12 500 ogives et l'équilibre de la terreur",
    excerpt:
      "Russie et USA possèdent 90% des armes nucléaires mondiales. Mais c'est la Chine qui modernise le plus vite son arsenal, tandis que la Corée du Nord miniaturise ses têtes. L'équilibre de la terreur évolue.",
    readingTime: 13,
    tags: ["nucléaire", "dissuasion", "Russie", "USA", "Chine", "Corée du Nord"],
    publishedAt: "2024-09-30",
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Trinity_explosion_test.jpg/1280px-Trinity_explosion_test.jpg",
    heroCaption: "Test Trinity, 16 juillet 1945 — la première détonation d'une arme nucléaire dans l'histoire.",
    body: [
      {
        type: "lead",
        content:
          "Le Traité de Non-Prolifération (TNP) avait ambitionné un désarmement progressif des puissances nucléaires. Résultat 55 ans plus tard : 12 500 ogives nucléaires dans le monde, 9 États refusent de désarmer, et la Chine a doublé son arsenal en cinq ans. Loin de disparaître, la bombe atomique est revenue au cœur de la stratégie internationale.",
      },
      {
        type: "stats",
        items: [
          { value: "12 500", label: "Ogives nucléaires mondiales (2024)", note: "Source : SIPRI Yearbook 2024" },
          { value: "90 %", label: "Détenues par Russie + États-Unis", note: "Le duopole nucléaire persiste" },
          { value: "500+", label: "Ogives chinoises estimées", note: "Doublé depuis 2019 — en route vers 1 500 d'ici 2035" },
          { value: "40–50", label: "Ogives nord-coréennes estimées", note: "Miniaturisation confirmée en 2023" },
        ],
      },
      {
        type: "comparison-table",
        title: "Arsenal nucléaire mondial — les 9 puissances (2024)",
        headers: ["Ogives total", "Déployées", "En réserve"],
        rows: [
          { label: "Russie", flag: "ru", cells: ["5 580", "1 674", "3 906"] },
          { label: "États-Unis", flag: "us", cells: ["5 044", "1 770", "3 274"] },
          { label: "Chine", flag: "cn", cells: ["500+", "~350", "~150"] },
          { label: "France", flag: "fr", cells: ["290", "280", "10"] },
          { label: "Royaume-Uni", flag: "gb", cells: ["225", "120", "105"] },
          { label: "Pakistan", flag: "pk", cells: ["170", "Non déclaré", "Non déclaré"] },
          { label: "Inde", flag: "in", cells: ["164", "Non déclaré", "Non déclaré"] },
          { label: "Israël", flag: "il", cells: ["~90", "Non déclaré", "Non déclaré"] },
          { label: "Corée du Nord", flag: "kp", cells: ["40–50", "Inconnues", "Inconnues"] },
        ],
      },
      {
        type: "text",
        heading: "La triade nucléaire : terre, mer, air",
        content:
          "La crédibilité de la dissuasion repose sur la capacité à répliquer après une première frappe. C'est pourquoi les grandes puissances nucléaires maintiennent une « triade » : missiles balistiques intercontinentaux terrestres (ICBM), sous-marins lanceurs d'engins (SNLE) et bombes aéroportées. Les SNLE sont considérés comme la composante la plus invulnérable : immergés en permanence, ils constituent la garantie d'une frappe de représailles certaine. La France et le Royaume-Uni n'ont plus que des triades partielles (mer + air), ce qui les rend plus vulnérables théoriquement.",
      },
      {
        type: "carousel",
        title: "Les vecteurs nucléaires les plus dangereux au monde",
        items: [
          {
            name: "RS-28 Sarmat (Russie)",
            emoji: "🚀",
            detail: "ICBM — portée illimitée (orbite polaire), 10 à 15 MIRV",
            subdetail: "Surnommé « Satan 2 » en Occident — capable de détruire une zone grande comme la France",
          },
          {
            name: "Minuteman III (USA)",
            emoji: "🚀",
            detail: "ICBM — 450 silos au Wyoming, Montana et Dakota du Nord",
            subdetail: "Entré en service en 1970, maintenu en service jusqu'au LGM-35 Sentinel (2030)",
          },
          {
            name: "DF-41 (Chine)",
            emoji: "🚀",
            detail: "ICBM — portée 14 000 km, 10 MIRV, Mobile sur TEL",
            subdetail: "La réponse chinoise au Minuteman — invulnérable car mobile",
          },
          {
            name: "SNLE Triomphant (France)",
            emoji: "⚓",
            detail: "4 SNLE, 1 en patrouille permanente, missiles M51.3",
            subdetail: "La composante la plus sûre de la dissuasion française",
          },
          {
            name: "Hwasong-17 (Corée du Nord)",
            emoji: "🚀",
            detail: "ICBM — portée estimée 15 000 km, frappe les USA",
            subdetail: "Testé en 2022 — capacité à atteindre Washington D.C. potentiellement confirmée",
          },
        ],
      },
      {
        type: "gallery",
        title: "L'atome militaire en images",
        images: [
          {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Trinity_explosion_test.jpg/800px-Trinity_explosion_test.jpg",
            caption: "Explosion Trinity — New Mexico, 16 juillet 1945",
            credit: "US Department of Energy / Wikimedia Commons",
          },
          {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Minuteman_III_missile_2.jpg/800px-Minuteman_III_missile_2.jpg",
            caption: "Missile Minuteman III en silo — socle de la dissuasion américaine depuis 1970",
            credit: "US Air Force / Wikimedia Commons",
          },
          {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/SSBN_USS_Ohio.jpg/800px-SSBN_USS_Ohio.jpg",
            caption: "SNLE USS Ohio — l'un des 14 sous-marins de la triade navale américaine",
            credit: "US Navy / Wikimedia Commons",
          },
        ],
      },
      {
        type: "text",
        heading: "La Chine : la grande course secrète vers 1 500 ogives",
        content:
          "En 2019, les estimations attribuaient à la Chine 290 ogives. En 2024, le SIPRI en compte 500. Des images satellites révèlent la construction de plus de 300 silos ICBM dans les déserts du Gansu et du Xinjiang — une capacité de « launch-under-attack » jusque-là réservée aux USA et à la Russie. Le Pentagone projette que la Chine pourrait atteindre 1 500 ogives d'ici 2035. Si confirmé, le triangle nucléaire USA-Russie-Chine rendra les traités bilatéraux de désarmement obsolètes.",
      },
      {
        type: "map-highlight",
        title: "Les 9 puissances nucléaires dans le monde (2024)",
        subtitle: "Seuls les membres permanents du CS de l'ONU sont reconnus par le TNP",
        countries: {
          US: { color: "#1A5276", label: "USA — 5 044 ogives" },
          RU: { color: "#C0392B", label: "Russie — 5 580 ogives" },
          CN: { color: "#E74C3C", label: "Chine — 500+ ogives" },
          FR: { color: "#1A5276", label: "France — 290 ogives" },
          GB: { color: "#1A5276", label: "Royaume-Uni — 225 ogives" },
          PK: { color: "#D35400", label: "Pakistan — 170 ogives" },
          IN: { color: "#D35400", label: "Inde — 164 ogives" },
          IL: { color: "#7D6608", label: "Israël — ~90 ogives (non déclaré)" },
          KP: { color: "#922B21", label: "Corée du Nord — 40–50 ogives" },
        },
        legend: [
          { color: "#1A5276", label: "P5 occidentaux (TNP)" },
          { color: "#C0392B", label: "Russie (TNP)" },
          { color: "#E74C3C", label: "Chine (TNP)" },
          { color: "#D35400", label: "Puissances hors TNP (Inde, Pakistan)" },
          { color: "#922B21", label: "Paria nucléaire (Corée du Nord)" },
          { color: "#7D6608", label: "Puissance non déclarée (Israël)" },
        ],
      },
      {
        type: "timeline",
        title: "L'histoire de l'arme nucléaire et du désarmement manqué",
        items: [
          { date: "1945", title: "Hiroshima et Nagasaki", description: "Les deux premières (et seules) utilisations de l'arme nucléaire en guerre. 200 000 morts. L'ère nucléaire commence." },
          { date: "1949", title: "Premier test soviétique", description: "L'URSS teste sa première bombe. La course aux armements nucléaires commence officiellement." },
          { date: "1968", title: "Traité de Non-Prolifération (TNP)", description: "Promesse des P5 de désarmer progressivement. 191 signataires. Israel, Inde et Pakistan refusent." },
          { date: "1991", title: "START I — le grand désarmement", description: "USA et URSS/Russie réduisent leurs arsenaux de 70 %. De 70 000 ogives à environ 12 000." },
          { date: "2010", title: "New START — dernier traité", description: "Limite à 1 550 ogives déployées de chaque côté. La Russie suspend sa participation en 2023." },
          { date: "2023", title: "La Russie suspend New START", description: "Réponse à la guerre en Ukraine. Plus aucun traité bilatéral de désarmement n'est en vigueur." },
          { date: "2024", title: "La Chine à 500 ogives", description: "Doublement en 5 ans. La tripolarité nucléaire rend les négociations bilatérales insuffisantes." },
        ],
      },
      {
        type: "highlight",
        content:
          "Pour la première fois depuis 1945, aucun traité de contrôle des armements nucléaires entre les grandes puissances n'est en vigueur. New START est suspendu par la Russie, l'INF a été abandonné par Trump en 2019. L'humanité navigue à vue.",
      },
      {
        type: "list",
        heading: "Les scénarios de risque nucléaire identifiés par les experts (2024–2030)",
        style: "bullet",
        items: [
          { text: "Escalade en Ukraine : la Russie emploie une arme tactique en cas de défaite majeure", note: "Probabilité estimée 5–10% par RAND Corporation (2024)" },
          { text: "Crise de Taiwan : les USA s'interrogent sur les red lines nucléaires chinoises", note: "La Chine n'a pas de doctrine de « no first use » crédible vérifiable" },
          { text: "Conflit Pakistan-Inde : le seul cas de deux États nucléaires en guerre active possible", note: "Cachemire comme point d'inflammation — crises de 1999, 2019" },
          { text: "Corée du Nord : Pyongyang frappe-t-il si le régime est menacé ?", note: "Doctrine officielle de Kim : arme nucléaire = survie du régime" },
          { text: "Terrorisme nucléaire : acquisition de matière fissile par des acteurs non étatiques", note: "Risque limité mais non nul — le risque le plus difficile à dissuader" },
          { text: "Erreur de calcul : fausse alerte conduisant à une frappe préventive", note: "Déjà arrivé en 1983 (officier soviétique Petrov évite une frappe de représailles)" },
        ],
      },
      {
        type: "quote",
        text: "J'ignore comment la Troisième Guerre mondiale sera combattue, mais la Quatrième le sera avec des bâtons et des pierres.",
        source: "Albert Einstein, 1949",
      },
    ],
    sources: [
        { title: "SIPRI Yearbook 2024 — Nuclear Forces Data", outlet: "SIPRI", year: "2024", url: "https://www.sipri.org/yearbook" },
        { title: "Nuclear Weapons: Who Has What at a Glance", outlet: "Arms Control Association", year: "2024", url: "https://www.armscontrol.org/factsheets/Nuclearweaponswhohaswhat" },
        { title: "The Military Balance 2024 — Nuclear Postures", outlet: "IISS", year: "2024" },
        { title: "Doomsday Clock Statement 2024", outlet: "Bulletin of the Atomic Scientists", year: "2024", url: "https://thebulletin.org/doomsday-clock/" },
        { title: "New START Treaty — Status and Suspension (Russia)", outlet: "Arms Control Association", year: "2023" },
    ],
  },
];
