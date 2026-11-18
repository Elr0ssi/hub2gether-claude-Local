import { COUNTRY_FR } from "@/data/countryNamesFr";

/* ═══════════════════════════════════════════════════════════════════════════
   LES ZONES → LES PAYS

   L'inventaire donne des noms de zones (« Ukraine; Russie », « Mer Rouge; Bab el-Mandeb », « Tigré; nord de l'Éthiopie »),
   pas des coordonnées. On les rapproche des géométries du site (Natural Earth, clé : le nom anglais du pays) :
     - un nom de pays, ou son nom français usuel, est reconnu tel quel ;
     - « Frontière A-B » donne A et B ;
     - « nord de l'Éthiopie », « sud de la Syrie » donnent le pays nommé ;
     - tout le reste (mers, golfes, provinces, régions) n'est PAS positionné : il reste dans la fiche, en texte.
   Aucune coordonnée n'est inventée.
   ═══════════════════════════════════════════════════════════════════════════ */

export const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/\s+/g, " ")
    .trim();

/* Des noms que la table des noms français ne porte pas, ou qu'elle écrit autrement. */
const ALIAS: Record<string, string> = {
  rdc: "Dem. Rep. Congo",
  "etats-unis": "United States of America",
  "republique centrafricaine": "Central African Rep.",
  "soudan du sud": "S. Sudan",
  "sahara occidental": "W. Sahara",
  "bande de gaza": "Palestine",
  cisjordanie: "Palestine",
  palestine: "Palestine",
  salvador: "El Salvador",
  equateur: "Ecuador",
  georgie: "Georgia",
  abkhazie: "Georgia",
  "ossetie du sud": "Georgia",
  essequibo: "Guyana",
  "papouasie indonesienne": "Indonesia",
  "extreme-nord du cameroun": "Cameroon",
  "nord-est syrien": "Syria",
  "ouest du tchad": "Chad",
  "peninsule coreenne": "North Korea|South Korea",
  "coree du nord": "North Korea",
  "coree du sud": "South Korea",
  "republique democratique du congo": "Dem. Rep. Congo",
  /* Des régions dont le pays ne fait aucun doute (la région est dans le pays, pas ailleurs). */
  mindanao: "Philippines",
  bangsamoro: "Philippines",
};

let TABLE: Map<string, string> | null = null;
function table() {
  if (TABLE) return TABLE;
  TABLE = new Map();
  for (const [en, fr] of Object.entries(COUNTRY_FR)) {
    TABLE.set(norm(en), en);
    TABLE.set(norm(fr), en);
  }
  for (const [k, v] of Object.entries(ALIAS)) TABLE.set(k, v);
  return TABLE;
}

function pays(token: string): string[] | null {
  const v = table().get(norm(token));
  return v ? v.split("|") : null;
}

/** Les pays reconnus dans une zone, et ce qui reste (non positionné). */
export function analyserZone(zone: string): { pays: string[]; reste: string[] } {
  const trouves: string[] = [];
  const reste: string[] = [];
  for (const brut of zone.split(";")) {
    const t = brut.trim();
    if (!t) continue;
    const direct = pays(t);
    if (direct) {
      trouves.push(...direct);
      continue;
    }
    const n = norm(t);
    /* « Frontière Afghanistan-Pakistan », « frontière Israël-Liban ». */
    if (n.startsWith("frontiere ")) {
      const morceaux = t.slice(10).split("-").map((m) => m.trim());
      const lus = morceaux.map(pays);
      if (lus.length >= 2 && lus.every(Boolean)) {
        lus.forEach((l) => trouves.push(...(l as string[])));
        continue;
      }
    }
    /* « nord de l'Éthiopie », « sud de la Syrie », « nord du Togo » : le pays nommé à la fin. */
    const m = n.match(/^(?:extreme-)?(?:nord|sud|est|ouest|centre)(?:-(?:nord|sud|est|ouest))? (?:de la |de l'|du |des |d'|de )(.+)$/);
    if (m) {
      const p = pays(m[1]);
      if (p) {
        trouves.push(...p);
        continue;
      }
    }
    reste.push(t);
  }
  return { pays: [...new Set(trouves)], reste };
}
