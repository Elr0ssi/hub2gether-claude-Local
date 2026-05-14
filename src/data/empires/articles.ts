import type { Article } from "@/types";

export const EMPIRES_ARTICLES: Article[] = [
  {
    slug: "roman-empire-peak-117-ad",
    title: "Why the Roman Empire Reached Its Maximum Extent in 117 AD",
    excerpt:
      "Under Emperor Trajan, Rome controlled 5 million km² — from Scotland to Mesopotamia. What drove this extraordinary expansion, and why did it immediately reverse?",
    theme: "empires",
    publishedAt: "2025-01-15",
    readingTime: 8,
    tags: ["Roman Empire", "Trajan", "Expansion", "Military"],
    featured: true,
    heroImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Trajan_Empire.svg/1280px-Trajan_Empire.svg.png",
    heroCaption: "The Roman Empire at its maximum extent under Trajan, 117 AD.",
    body: [
      {
        type: "lead",
        content:
          "In 117 AD, the Roman Empire stood at its greatest territorial extent. Under Emperor Marcus Ulpius Traianus — Trajan — Rome's borders stretched from Hadrian's Wall in northern Britain to the shores of the Persian Gulf in modern Iraq. Five million square kilometres. Seventy million subjects. The culmination of eight centuries of relentless expansion from a small Latin city-state on the banks of the Tiber.",
      },
      {
        type: "stats",
        items: [
          { value: "5M km²", label: "Territorial extent", note: "Largest in Roman history" },
          { value: "70M", label: "Population estimate", note: "25% of the world's total" },
          { value: "400,000+", label: "Km of Roman roads", note: "Backbone of the empire" },
          { value: "117 AD", label: "Peak under Trajan", note: "Immediately reversed by Hadrian" },
        ],
      },
      {
        type: "carousel",
        title: "Key regions of the Roman Empire at 117 AD",
        items: [
          { name: "Italia", emoji: "🏛️", detail: "Heartland of the empire", subdetail: "Rome (population ~1 million) was the largest city in the ancient world. Administrative and cultural centre of 50+ million subjects." },
          { name: "Britannia", emoji: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", detail: "Northwestern frontier", subdetail: "Conquered by Claudius in 43 AD. Northern limit: the future Hadrian's Wall. Rich in tin, silver, and wool." },
          { name: "Dacia", emoji: "🗡️", detail: "Conquered by Trajan (106 AD)", subdetail: "Modern Romania. Rich in gold and silver — the conquest funded Trajan's Forum and Column in Rome." },
          { name: "Mesopotamia", emoji: "⚔️", detail: "Briefly held (114–117 AD)", subdetail: "Trajan's greatest conquest. Abandoned by Hadrian as indefensible. Modern Iraq." },
          { name: "Aegyptus", emoji: "🌊", detail: "Breadbasket of Rome", subdetail: "Egypt supplied 1/3 of Rome's grain. Alexandria was the empire's second city, centre of scholarship and trade." },
          { name: "Africa Proconsularis", emoji: "🌿", detail: "Olive oil and grain", subdetail: "Modern Tunisia and Libya. Supplied 1/2 of the olive oil consumed in Rome. Carthage rebuilt as a major Roman city." },
          { name: "Hispania", emoji: "🏺", detail: "Silver, gold, and grain", subdetail: "Rome's most Romanised province outside Italy. Home of Trajan, Hadrian, and Marcus Aurelius themselves." },
          { name: "Asia Minor", emoji: "🔱", detail: "Wealthiest province", subdetail: "Modern Turkey. Largest concentration of Greek-speaking cities. Ephesus, Pergamon, Smyrna — centres of culture and commerce." },
        ],
      },
      {
        type: "text",
        heading: "Trajan's strategy: the last great expansion",
        content:
          "Trajan's campaigns in Dacia (101–102 AD and 105–106 AD) and Parthia (113–117 AD) were the last truly offensive campaigns in Roman history. His successors understood what Trajan did not — or would not: the empire had reached the limits of its administrative and military capacity. The Rhine-Danube line was a natural frontier. The Euphrates was another. Beyond lay either unconquerable terrain or unconquerable enemies. Trajan's Column in Rome, erected to commemorate the Dacian wars, depicts 2,500 figures in 155 scenes — the most detailed surviving record of Roman military operations. It tells the story of an empire at the very peak of its power.",
      },
      {
        type: "image-text",
        heading: "Why Hadrian immediately abandoned Mesopotamia",
        content:
          "When Hadrian succeeded Trajan in 117 AD, one of his first acts was to withdraw from Mesopotamia, Armenia, and Assyria — territories his predecessor had just conquered at enormous cost. This was not weakness; it was strategic lucidity. The newly conquered eastern territories were logistically impossible to hold: too far from the supply chains of Italy, surrounded by the Parthian empire, and populated by people with no tradition of Roman submission. Hadrian recognised that an empire's strength lay not in its maximum extent, but in the defensibility of its borders. He would spend his reign building walls — literally.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Hadrian%27s_Wall_view_near_Greenhead.jpg/1280px-Hadrian%27s_Wall_view_near_Greenhead.jpg",
        imageAlt: "Hadrian's Wall in northern England — the most famous border of the Roman Empire",
        flip: true,
      },
      {
        type: "timeline",
        title: "The rise and fall of Roman territorial power",
        items: [
          { date: "500 BC", title: "City-state of Latium", description: "Rome controls a small territory around the Tiber. Population ~30,000. The Republic is just beginning to emerge from the struggles between patricians and plebeians." },
          { date: "264 BC", title: "Master of the Italian peninsula", description: "After the Samnite Wars and the defeat of Tarentum, Rome controls all of Italy south of the Po. Population ~4 million." },
          { date: "44 BC", title: "Caesar's Rome", description: "The Mediterranean is a Roman lake. Britain, Gaul, Spain, North Africa, Greece, and the Near East are under Roman control or influence. The Republic is dying." },
          { date: "117 AD", title: "Maximum extent under Trajan", description: "5 million km². From Scotland to Mesopotamia, from Morocco to the Caucasus. The empire at its peak." },
          { date: "395 AD", title: "Division of the empire", description: "Theodosius I splits the empire between his two sons. The West will fall in 80 years; the East will survive 1,000 more." },
          { date: "476 AD", title: "Fall of the Western Empire", description: "Romulus Augustulus is deposed by Odoacer. The symbolic end of ancient Rome — though the Eastern Empire continues as Byzantium." },
          { date: "1453 AD", title: "Fall of Constantinople", description: "Mehmed II's Ottoman forces breach the Theodosian Walls. The last remnant of the Roman Empire falls after 2,200 years of continuous existence in one form or another." },
        ],
      },
      {
        type: "quote",
        text: "They make a desert and they call it peace.",
        source: "Calgacus, a Caledonian chieftain, on Roman expansion — as reported by Tacitus, Agricola, 98 AD",
      },
    ],
  },
  {
    slug: "how-rome-built-pan-mediterranean-economy",
    title: "How Rome Built the First Pan-Mediterranean Economy",
    excerpt:
      "The Roman Empire was not just a military phenomenon — it was the ancient world's most sophisticated economic system, connecting 70 million people across three continents.",
    theme: "empires",
    publishedAt: "2025-01-08",
    readingTime: 10,
    tags: ["Roman Empire", "Economy", "Trade", "Infrastructure"],
    featured: true,
    heroImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Ostia_Antica_-_Mosaico_-_Navicularii_et_Negotiantes_Karalitani.jpg/1280px-Ostia_Antica_-_Mosaico_-_Navicularii_et_Negotiantes_Karalitani.jpg",
    heroCaption: "Mosaic from Ostia Antica showing merchants from Caralit (Sardinia) — the commercial heart of the Roman Empire.",
    body: [
      { type: "lead", content: "When we think of the Roman Empire, we think of legions. But it was trade that made Rome truly extraordinary. The Pax Romana — roughly 200 years of relative peace from Augustus to Marcus Aurelius — created the conditions for the most integrated economic system the ancient world had ever seen. Grain from Egypt, wine from Gaul, olive oil from Africa, marble from Greece, silk from China via the Silk Road: Rome was the clearing house of the world." },
      { type: "stats", items: [
        { value: "400,000 km", label: "Roman road network", note: "Fastest land transport until the 19th century" },
        { value: "70M", label: "People in the economy", note: "Across three continents" },
        { value: "1/3", label: "World grain from Egypt", note: "Roman Egypt supplied Rome annually" },
        { value: "25%", label: "Share of world GDP", note: "Modern estimates for peak Roman era" },
      ]},
      { type: "carousel", title: "Key trade goods of the Roman Empire", items: [
        { name: "Egyptian Grain", emoji: "🌾", detail: "Foundation of Roman food security", subdetail: "The Nile Delta fed the city of Rome. Monthly grain dole (annona) kept 200,000 Romans fed and pacified." },
        { name: "Gallic Wine", emoji: "🍷", detail: "From amphora to table", subdetail: "Millions of amphoras of wine moved annually across the empire. Wine was status, nutrition, and currency." },
        { name: "African Olive Oil", emoji: "🫒", detail: "Tunisia and Libya", subdetail: "Half of Rome's olive oil came from North Africa. Used for cooking, lighting, hygiene, and religious ceremony." },
        { name: "Spanish Silver", emoji: "⛏️", detail: "Las Médulas and other mines", subdetail: "Iberian silver mines employed tens of thousands (mostly slaves). Silver coinage unified the economy." },
        { name: "British Tin", emoji: "🪨", detail: "Cornwall and Wales", subdetail: "Essential for bronze production. Known to Mediterranean traders centuries before the Roman conquest." },
        { name: "Eastern Silk", emoji: "🧵", detail: "Via the Silk Road", subdetail: "Rome's persistent trade deficit with China and India drained silver eastward — a worry to Roman senators." },
      ]},
    ],
  },
  {
    slug: "why-did-rome-fall",
    title: "Why Did Rome Fall? The Five Competing Theories",
    excerpt:
      "Gibbon blamed Christianity. Economists point to debasement. Climate scientists cite pandemics. The fall of Rome remains the most debated collapse in history.",
    theme: "empires",
    publishedAt: "2024-12-20",
    readingTime: 12,
    tags: ["Roman Empire", "Decline", "History", "Analysis"],
    featured: false,
    body: [
      { type: "lead", content: "Edward Gibbon, writing in the 1770s, laid the blame squarely on Christianity and the barbarians. Modern historians are less certain. The 'fall' of Rome — really the gradual transformation of the Western Empire between roughly 376 and 476 AD — has attracted every analytical framework the humanities and sciences can offer. Climate change, pandemic disease, economic collapse, military overstretch, political dysfunction: they all played a role. The question is which was cause and which was symptom." },
      { type: "stats", items: [
        { value: "476 AD", label: "Traditional 'fall' date", note: "Deposition of Romulus Augustulus" },
        { value: "50+", label: "Emperors in 50 years", note: "The Crisis of the 3rd Century" },
        { value: "96%", label: "Silver debasement 200→300 AD", note: "Denarius silver content collapse" },
        { value: "1,000 years", label: "Eastern Empire survived", note: "Until 1453 — the Byzantine Empire" },
      ]},
    ],
  },
  {
    slug: "logistics-trajans-army",
    title: "The Logistics of Trajan's Army: Feeding an Empire",
    excerpt:
      "Moving 100,000 soldiers across the Danube required a supply chain that modern militaries would recognise. How Rome solved the most complex logistics problem of the ancient world.",
    theme: "empires",
    publishedAt: "2024-12-10",
    readingTime: 7,
    tags: ["Roman Empire", "Military", "Logistics", "Trajan"],
    featured: false,
    body: [
      { type: "lead", content: "Trajan's two Dacian campaigns (101–102 and 105–106 AD) required moving an army of 100,000–150,000 men across the Danube, through the Carpathian passes, and into the Dacian highlands. Each soldier required 3,000 calories per day. Each horse needed 10kg of grain. The army's total daily caloric requirement exceeded 1 billion calories. This was the most complex logistical operation in the ancient world." },
      { type: "stats", items: [
        { value: "100,000+", label: "Soldiers in Dacian campaigns", note: "Plus auxiliaries and support" },
        { value: "3,000 kcal", label: "Per soldier per day", note: "Minimum operational requirement" },
        { value: "1km+", label: "Length of Trajan's Bridge", note: "Drobeta — longest bridge ever built" },
        { value: "2 years", label: "Duration of first campaign", note: "101–102 AD" },
      ]},
    ],
  },
  {
    slug: "byzantine-empire-survival",
    title: "How Byzantium Survived for 1,000 Years After Rome's Fall",
    excerpt:
      "When the Western Empire collapsed in 476 AD, its Eastern half endured for another millennium. The secret was a combination of geography, diplomacy, and relentless administrative efficiency.",
    theme: "empires",
    publishedAt: "2024-11-28",
    readingTime: 9,
    tags: ["Byzantine Empire", "Constantinople", "Survival", "Medieval"],
    featured: false,
    body: [
      { type: "lead", content: "How does an empire survive for a thousand years? The Eastern Roman Empire — which we call Byzantium — managed it from 395 to 1453 AD, outlasting the fall of the West by nearly a millennium. Its survival was not accidental. Constantinople, built on a peninsula at the meeting of Europe and Asia, was one of the most defensible positions in the ancient world — protected by water on three sides and by the Theodosian Walls on the fourth." },
      { type: "stats", items: [
        { value: "1,058 years", label: "Duration of Byzantine Empire", note: "395–1453 AD" },
        { value: "330 AD", label: "Constantinople founded", note: "By Constantine I" },
        { value: "7km", label: "Theodosian Walls length", note: "Breached only twice in 1,000 years" },
        { value: "1453", label: "Fall to Ottomans", note: "29 May — Mehmed II" },
      ]},
    ],
  },
  {
    slug: "fall-of-constantinople-1453",
    title: "The Fall of Constantinople: The Day the Ancient World Ended",
    excerpt:
      "On 29 May 1453, Ottoman cannons breached the walls that had held for a thousand years. The event that ended antiquity and launched the early modern world.",
    theme: "empires",
    publishedAt: "2024-11-15",
    readingTime: 11,
    tags: ["Constantinople", "Ottoman Empire", "Byzantine", "1453"],
    featured: false,
    body: [
      { type: "lead", content: "On the night of 28–29 May 1453, the last Byzantine Emperor, Constantine XI Palaiologos, reportedly tore off his imperial insignia and charged into the breach in the Theodosian Walls, never to be seen again. The city of Constantinople — Roman capital, Christian capital, the largest city in Christendom — fell to the 21-year-old Sultan Mehmed II after a 53-day siege. The ancient world ended that morning." },
      { type: "stats", items: [
        { value: "53 days", label: "Duration of the siege", note: "April–May 1453" },
        { value: "7,000", label: "Byzantine defenders", note: "vs 80,000 Ottoman troops" },
        { value: "62 tonnes", label: "Largest Ottoman cannon", note: "\"Basilica\" — fired 1,200 lb stones" },
        { value: "1,500 years", label: "Life of the empire", note: "From 27 BC to 1453 AD" },
      ]},
    ],
  },
];
