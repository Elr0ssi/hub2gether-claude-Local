"use client";

/* ═══════════════════════════════════════════════════════════════════════════
   LE CARNET D'APPRENTISSAGE (côté navigateur)

   Deux sortes d'éléments : une TRADUCTION (un mot, une phrase, sa version anglaise), qu'on révise en carte (le français d'abord,
   l'anglais en basculant), et un PASSAGE gardé pour la mémorisation (un texte, avec sa source).
   Tout est d'abord écrit dans ce navigateur : le carnet marche sans compte. Avec un compte, chaque élément est aussi envoyé au
   compte (table « carnet ») et l'espace personnel réunit les deux, sans doublon (même identifiant).

   La révision suit des boîtes espacées : « Je savais » fait monter d'une boîte (l'élément revient plus tard), « À revoir » le
   renvoie à la première. C'est ce qui ancre la mémoire dans le temps.
   ═══════════════════════════════════════════════════════════════════════════ */

export type TypeCarnet = "traduction" | "passage";

export interface ElementCarnet {
  id: string;
  type: TypeCarnet;
  texte: string;
  traduction: string | null;
  langue: string;
  source_titre: string | null;
  source_url: string | null;
  niveau: number;
  prochaine_revision: string;
  cree_le: string;
}

const CLE = "datlas-carnet-v1";
const EVT = "datlas-carnet";
/** Jours avant la prochaine révision, selon la boîte atteinte. */
export const INTERVALLES = [0, 1, 3, 7, 14, 30, 60];

export function lireLocal(): ElementCarnet[] {
  try {
    const brut = JSON.parse(localStorage.getItem(CLE) ?? "[]");
    return Array.isArray(brut) ? (brut as ElementCarnet[]) : [];
  } catch {
    return [];
  }
}

function ecrire(l: ElementCarnet[]) {
  try {
    localStorage.setItem(CLE, JSON.stringify(l));
  } catch {
    /* Stockage fermé (navigation privée stricte) : rien à faire. */
  }
  window.dispatchEvent(new Event(EVT));
}

export function surChangement(f: () => void): () => void {
  const g = (e: StorageEvent | Event) => {
    if (!("key" in e) || (e as StorageEvent).key === null || (e as StorageEvent).key === CLE) f();
  };
  window.addEventListener(EVT, g);
  window.addEventListener("storage", g);
  return () => {
    window.removeEventListener(EVT, g);
    window.removeEventListener("storage", g);
  };
}

const nouvelId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : "xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx".replace(/x/g, () => ((Math.random() * 16) | 0).toString(16));

export function creer(p: Pick<ElementCarnet, "type" | "texte" | "traduction" | "langue" | "source_titre" | "source_url">): ElementCarnet {
  const maintenant = new Date().toISOString();
  return { id: nouvelId(), niveau: 0, prochaine_revision: maintenant, cree_le: maintenant, ...p };
}

/** Ajoute un élément ; un même texte du même type n'est gardé qu'une fois (on renvoie l'existant). */
export function ajouterLocal(e: ElementCarnet): ElementCarnet {
  const l = lireLocal();
  const deja = l.find((x) => x.type === e.type && x.texte.trim().toLowerCase() === e.texte.trim().toLowerCase());
  if (deja) {
    if (e.traduction && !deja.traduction) {
      deja.traduction = e.traduction;
      ecrire(l);
    }
    return deja;
  }
  ecrire([e, ...l]);
  return e;
}

export function retirerLocal(id: string) {
  ecrire(lireLocal().filter((x) => x.id !== id));
}

export function majLocal(e: ElementCarnet) {
  const l = lireLocal();
  const i = l.findIndex((x) => x.id === e.id);
  if (i >= 0) l[i] = e;
  else l.unshift(e);
  ecrire(l);
}

/** Le résultat d'une révision : la boîte suivante (ou la première), et la date où l'élément revient. */
export function reviser(e: ElementCarnet, su: boolean): ElementCarnet {
  const niveau = su ? Math.min(INTERVALLES.length - 1, e.niveau + 1) : 0;
  const d = new Date();
  d.setDate(d.getDate() + INTERVALLES[niveau]);
  if (!su) d.setMinutes(d.getMinutes() + 10);
  return { ...e, niveau, prochaine_revision: d.toISOString() };
}

export const aReviser = (e: ElementCarnet, maintenant = Date.now()) => new Date(e.prochaine_revision).getTime() <= maintenant;

/** Réunit le carnet du navigateur et celui du compte : un même identifiant n'apparaît qu'une fois (le plus avancé gagne). */
export function fusionner(local: ElementCarnet[], compte: ElementCarnet[]): ElementCarnet[] {
  const m = new Map<string, ElementCarnet>();
  for (const e of [...compte, ...local]) {
    const x = m.get(e.id);
    if (!x || new Date(e.prochaine_revision) > new Date(x.prochaine_revision)) m.set(e.id, e);
  }
  return [...m.values()].sort((a, b) => b.cree_le.localeCompare(a.cree_le));
}
