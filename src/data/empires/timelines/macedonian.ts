import type { TimelineEntry } from "@/types";

export const MACEDONIAN_TIMELINE: TimelineEntry[] = [
  {
    year: -336,
    label: "Macédoine et Grèce",
    slug: "336bc",
    era: "Règne de Philippe II",
    description:
      "Alexandre III de Macédoine monte sur le trône à 20 ans après l'assassinat de son père Philippe II. Il hérite d'un royaume macédonien dominant la Grèce entière via la Ligue de Corinthe. Après avoir rapidement écrasé les révoltes grecques (rasant Thèbes), il se prépare à la grande campagne contre l'Empire achéménide de Perse — le projet de son père.",
    analysis:
      "La Macédoine de 336 av. J.-C. était déjà une puissance militaire révolutionnaire grâce aux réformes de Philippe II : la phalange macédonienne avec ses sarises (longues piques de 6 mètres), la cavalerie de compagnons (hétaires), et une logistique professionnelle. Alexandre hérita d'une armée testée, mais c'est son génie tactique personnel qui allait transformer cette machine en conquête mondiale.",
    geojsonFile: "/geojson/macedonian/336bc.json",
    stats: {
      areaSqKm: 300_000,
      populationEstimate: 5_000_000,
      capitalCity: "Pella",
      politicalSystem: "Monarchie macédonienne",
      keyFacts: [
        "Alexandre monte sur le trône à 20 ans (336 av. J.-C.)",
        "Hérite de la Macédoine, Thrace, Grèce via la Ligue de Corinthe",
        "Destruction de Thèbes pour l'exemple — hégémonie établie",
        "Armée de 40 000 fantassins et 6 000 cavaliers pour la campagne perse",
      ],
    },
  },
  {
    year: -333,
    label: "Anatolie et Levant",
    slug: "333bc",
    era: "Campagnes asiatiques",
    description:
      "La bataille d'Issos (333 av. J.-C.) est le tournant décisif. Alexandre défait Darius III en personne malgré une infériorité numérique écrasante. Cette victoire ouvre toute l'Anatolie (Turquie actuelle) et le Levant (Syrie, Liban, Israël/Palestine). Le siège de Tyr (7 mois, 332 av. J.-C.) puis la conquête de l'Égypte — où Alexandre est accueilli comme libérateur — complètent l'étape méditerranéenne.",
    analysis:
      "Issos révèle la tactique caractéristique d'Alexandre : une charge de cavalerie oblique vers le centre ennemi, personnellement menée, visant à tuer ou capturer le commandant adverse. Cette brutalité ciblée démoralisait les armées bien supérieures en nombre. La fuite de Darius III abandonnant sa famille sur le champ de bataille fut le symbole de la décomposition de l'autorité perse.",
    geojsonFile: "/geojson/macedonian/333bc.json",
    stats: {
      areaSqKm: 700_000,
      populationEstimate: 20_000_000,
      capitalCity: "Pella (Grèce) / Memphis (Égypte, non encore)",
      politicalSystem: "Monarchie macédonienne",
      keyFacts: [
        "Bataille d'Issos (333 av. J.-C.) — Darius III mis en fuite",
        "Siège de Tyr (7 mois) — seule ville à résister longtemps",
        "Fondation d'Alexandrie d'Égypte en 331 av. J.-C.",
        "Oracle d'Amon au Siwa — Alexandre reconnu fils de Zeus-Amon",
      ],
    },
  },
  {
    year: -330,
    label: "Perse conquise",
    slug: "330bc",
    era: "Fin de l'Empire achéménide",
    description:
      "La bataille de Gaugamèles (331 av. J.-C.) brise définitivement l'armée perse. Alexandre s'empare des trésors des capitales achéménides : Suse, Persépolis (brûlée), Ecbatane. Darius III est assassiné par son propre satrape Bessus en 330 av. J.-C. Alexandre se proclame vengeur de Darius et maître légitime de l'Empire perse. Le territoire s'étend désormais de la Grèce à l'Afghanistan.",
    analysis:
      "L'incendie de Persépolis reste l'un des actes les plus controversés d'Alexandre — délibéré ou accidentel, il signala aux élites perses qu'il n'était pas simplement un nouveau souverain achéménide mais un conquérant grec. Pourtant, Alexandre adopta ensuite la titulature et les coutumes perses (proskynèse), tentant une fusion gréco-perse que ses généraux macédoniens rejetèrent violemment.",
    geojsonFile: "/geojson/macedonian/330bc.json",
    stats: {
      areaSqKm: 3_000_000,
      populationEstimate: 50_000_000,
      capitalCity: "Pella / Alexandrie / Babylone",
      politicalSystem: "Monarchie macédonienne / Héritière perse",
      keyFacts: [
        "Bataille de Gaugamèles (331 av. J.-C.) — fin de l'armée perse",
        "Prise et incendie de Persépolis — fin symbolique de l'Empire achéménide",
        "Mort de Darius III (330 av. J.-C.) tué par Bessus",
        "Alexandre adopte les titres et coutumes perses",
      ],
    },
  },
  {
    year: -323,
    label: "Étendue maximale — mort d'Alexandre",
    slug: "323bc",
    era: "Mort d'Alexandre le Grand",
    description:
      "À sa mort à Babylone (10 juin 323 av. J.-C., à 32 ans), Alexandre contrôle un empire s'étendant de la Grèce à la rivière Beas dans le Punjab indien — 5,2 millions de km². Ses armées ont parcouru plus de 30 000 kilomètres en 13 ans. Il a fondé plus de 70 villes portant son nom, dont Alexandrie d'Égypte (future capitale intellectuelle du monde antique). Sa mort sans héritier désigné provoquera les Guerres des Diadoques.",
    analysis:
      "Alexandre mourut sans avoir désigné de successeur — sa réponse supposée à 'qui héritera ?' fut 'le plus fort'. Ce vide précipita 40 ans de guerres entre ses généraux (les Diadoques). L'empire fut finalement divisé en royaumes hellénistiques : les Ptolémées en Égypte (300 ans), les Séleucides en Perse/Syrie, les Antigonides en Macédoine. Sa véritable conquête fut la diffusion de la langue et culture grecques en Orient — l'hellénisation — qui dura des siècles.",
    geojsonFile: "/geojson/macedonian/323bc.json",
    stats: {
      areaSqKm: 5_200_000,
      populationEstimate: 70_000_000,
      capitalCity: "Babylone (à sa mort)",
      politicalSystem: "Monarchie macédonienne",
      keyFacts: [
        "Alexandre meurt à Babylone le 10 juin 323 av. J.-C., à 32 ans",
        "Armée refuse d'aller plus loin au-delà de la rivière Beas (Inde, 326 av. J.-C.)",
        "70+ villes 'Alexandrie' fondées, diffusant la culture grecque",
        "Guerre des Diadoques (323–281 av. J.-C.) divise l'empire",
      ],
    },
  },
];
