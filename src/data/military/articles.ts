import type { Article } from "@/types";

export const MILITARY_ARTICLES: Article[] = [
  {
    slug: "course-armements-2025",
    theme: "military",
    title: "La nouvelle course aux armements : qui dépense le plus en 2025 ?",
    excerpt: "Les dépenses militaires mondiales ont atteint 2 443 Mds€ en 2024, un record absolu. USA, Chine et Europe augmentent leurs budgets à un rythme sans précédent depuis la Guerre Froide.",
    readingTime: 7,
    tags: ["budget défense", "OTAN", "réarmement", "USA", "Chine"],
    publishedAt: "2025-03-15",
    body: [
      { type: "lead", content: "Jamais depuis la fin de la Guerre Froide les États n'avaient dépensé autant pour leur défense. Le total mondial des dépenses militaires a dépassé 2 443 milliards d'euros en 2024." },
      { type: "stats", items: [
        { value: "2 443 Mds€", label: "Dépenses mondiales 2024", note: "Record historique absolu" },
        { value: "815 Mds€", label: "Budget US 2024", note: "37% du total mondial" },
        { value: "+9%", label: "Hausse Europe OTAN", note: "Réponse à la guerre en Ukraine" },
      ]},
      { type: "text", heading: "Le triptyque USA-Chine-Russie", content: "Les trois premières puissances militaires concentrent 55% des dépenses mondiales. Les États-Unis maintiennent un avantage structurel colossal : leur budget représente 4 fois celui de la Chine." },
    ],
  },
  {
    slug: "chars-guerre-ukraine",
    theme: "military",
    title: "La bataille des chars en Ukraine : Leopard, Abrams et T-90 face à face",
    excerpt: "Pour la première fois depuis 1945, des chars occidentaux de dernière génération s'affrontent aux blindés russes sur un champ de bataille européen. Bilan des performances et des pertes.",
    readingTime: 9,
    tags: ["Ukraine", "chars", "Leopard 2", "T-90", "guerre terrestre"],
    publishedAt: "2025-01-20",
    body: [
      { type: "lead", content: "La guerre en Ukraine est devenue le plus grand théâtre d'affrontements blindés depuis la Seconde Guerre mondiale. Leopard 2, Abrams et Challenger 2 y sont testés pour la première fois au combat." },
      { type: "stats", items: [
        { value: "80+", label: "Leopard 2 livrés à l'Ukraine" },
        { value: "31", label: "M1A1 Abrams engagés", note: "Puis retirés après pertes" },
        { value: "6 000+", label: "Blindés russes perdus (2022-2024)" },
      ]},
    ],
  },
  {
    slug: "drones-revolution-militaire",
    theme: "military",
    title: "La révolution des drones : du Bayraktar au Shahed, la guerre change de visage",
    excerpt: "Le drone Bayraktar TB2 turc a démontré en 2020 au Karabakh qu'un drone low-cost peut neutraliser un arsenal conventionnel. Une révolution qui rebat les cartes de la puissance militaire.",
    readingTime: 8,
    tags: ["drones", "Bayraktar", "Shahed", "guerre asymétrique", "Ukraine"],
    publishedAt: "2024-11-05",
    body: [
      { type: "lead", content: "Un drone de combat à 5 millions d'euros capable de détruire un char à 4 millions ou une batterie de missiles à 400 millions. La guerre en Ukraine et au Nagorno-Karabakh a consacré l'ère des drones." },
      { type: "stats", items: [
        { value: "30+", label: "Pays acheteurs du TB2", note: "Turquie, Ukraine, Maroc, Albanie…" },
        { value: "3 000+", label: "Drones Shahed utilisés par la Russie", note: "Contre infrastructure civile" },
        { value: "5 M€", label: "Coût TB2 vs 4 M€ char", note: "Asymétrie coût-efficacité" },
      ]},
    ],
  },
  {
    slug: "marine-guerre-mer-chine",
    theme: "military",
    title: "La Chine et sa marine : 727 navires pour contrôler la mer de Chine",
    excerpt: "La marine chinoise est désormais la plus grande du monde en nombre de navires. Ses 3 porte-avions, 8 destroyers Type 055 et 60+ sous-marins transforment l'équilibre indo-pacifique.",
    readingTime: 10,
    tags: ["Chine", "marine", "Taiwan", "Indo-Pacifique", "porte-avions"],
    publishedAt: "2024-08-12",
    body: [
      { type: "lead", content: "En deux décennies, la Chine a construit la flotte la plus nombreuse du monde. Avec 3 porte-avions dont le Fujian à catapulte EMALS, Pékin défie la supériorité navale américaine en Asie." },
    ],
  },
  {
    slug: "europe-rearmement-otan",
    theme: "military",
    title: "L'Europe se réarme : 2% du PIB et la fin du dividende de la paix",
    excerpt: "La guerre en Ukraine a mis fin aux illusions d'une Europe sans menace. Allemagne, Pologne, Suède et France augmentent drastiquement leurs budgets. L'OTAN exige 2% du PIB, certains vont bien plus loin.",
    readingTime: 7,
    tags: ["OTAN", "Europe", "réarmement", "Allemagne", "Pologne"],
    publishedAt: "2025-02-18",
    body: [
      { type: "lead", content: "La Pologne consacre déjà 4% de son PIB à la défense — le plus haut taux de l'OTAN. L'Allemagne a alloué 100 Mds€ pour moderniser sa Bundeswehr. L'Europe guerrière est de retour." },
      { type: "stats", items: [
        { value: "4%", label: "Pologne — % PIB défense", note: "Record absolu dans l'OTAN" },
        { value: "100 Mds€", label: "Fonds spécial Bundeswehr", note: "Annoncé par Scholz en 2022" },
        { value: "23/32", label: "Pays OTAN au-dessus de 2% PIB", note: "Contre 7 en 2021" },
      ]},
    ],
  },
  {
    slug: "nucleaire-puissances",
    theme: "military",
    title: "Armes nucléaires : les 9 puissances, 12 500 ogives et l'équilibre de la terreur",
    excerpt: "Russie et USA possèdent 90% des armes nucléaires mondiales. Mais c'est la Chine qui modernise le plus vite son arsenal, tandis que la Corée du Nord miniaturise ses têtes. L'équilibre de la terreur évolue.",
    readingTime: 11,
    tags: ["nucléaire", "dissuasion", "Russie", "USA", "Chine", "Corée du Nord"],
    publishedAt: "2024-09-30",
    body: [
      { type: "lead", content: "Le Traité NPT avait ambitionné un désarmement progressif. Résultat 55 ans plus tard : 12 500 ogives nucléaires opérationnelles, et 9 États refusent de désarmer. Le monde est plus nucléarisé que jamais." },
      { type: "stats", items: [
        { value: "5 580", label: "Ogives russes (actives + réserve)" },
        { value: "5 044", label: "Ogives américaines" },
        { value: "500+", label: "Ogives chinoises (estimation 2024)", note: "+200 en 5 ans" },
        { value: "40-50", label: "Ogives nord-coréennes estimées" },
      ]},
    ],
  },
];
