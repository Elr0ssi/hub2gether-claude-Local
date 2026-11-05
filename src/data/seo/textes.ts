import { avec, cap, deNom, fmtHab, fmtHabCourt, fmtMd, fmtMdCourt, nf, rangTexte } from "./francais";
import type { FichePays, Mesure } from "./pays";

/* Tous les textes sont tirés de la fiche : chaque phrase cite sa source et son année,
   et une grandeur absente ne produit aucune phrase. */

export interface QR {
  q: string;
  r: string;
}

const SRC_ECO = "Banque mondiale (WDI), FMI";
const SRC_DEMO = "Nations Unies (World Population Prospects 2024)";

const an = (m: Mesure) => m.annee;

/** Une ligne par indicateur comparable : le libellé, la valeur lisible et la valeur brute. */
export interface Ligne {
  id: string;
  label: string;
  fmt: (v: number) => string;
  get: (f: FichePays) => Mesure | undefined;
  /** « plus » = valeur élevée ; sert à écrire « le plus peuplé », « la plus grande ». */
  qui: string;
  source: string;
  /** Une valeur plus élevée est-elle un fait neutre (population) ou notable ? Sert aux phrases. */
  ratioOk: boolean;
}
export const LIGNES: Ligne[] = [
  { id: "population", label: "Population", fmt: fmtHabCourt, get: (f) => f.population, qui: "le plus peuplé", source: SRC_DEMO, ratioOk: true },
  { id: "pib", label: "PIB", fmt: fmtMdCourt, get: (f) => f.pib, qui: "la plus grande économie", source: SRC_ECO, ratioOk: true },
  { id: "pibHab", label: "PIB par habitant", fmt: (v) => `${nf(v)} $`, get: (f) => f.pibHab, qui: "le plus riche par habitant", source: SRC_ECO, ratioOk: true },
  { id: "superficie", label: "Superficie", fmt: (v) => `${nf(v)} km²`, get: (f) => (f.superficie ? { v: f.superficie, annee: 0 } : undefined), qui: "le plus étendu", source: "Fond de carte Natural Earth (valeur approchée)", ratioOk: true },
  { id: "densite", label: "Densité", fmt: (v) => `${nf(v, v < 10 ? 1 : 0)} hab./km²`, get: (f) => (f.densite ? { v: f.densite, annee: 0 } : undefined), qui: "le plus dense", source: "Calcul : population / superficie", ratioOk: true },
  { id: "dette", label: "Dette publique / PIB", fmt: (v) => `${nf(v, 1)} %`, get: (f) => f.dette, qui: "le plus endetté", source: SRC_ECO, ratioOk: false },
  { id: "inflation", label: "Inflation", fmt: (v) => `${nf(v, 1)} %`, get: (f) => f.inflation, qui: "celui où l'inflation est la plus forte", source: SRC_ECO, ratioOk: false },
  { id: "chomage", label: "Chômage", fmt: (v) => `${nf(v, 1)} %`, get: (f) => f.chomage, qui: "celui où le chômage est le plus élevé", source: SRC_ECO, ratioOk: false },
  { id: "natalite", label: "Natalité", fmt: (v) => `${nf(v, 1)} pour 1 000`, get: (f) => f.natalite, qui: "celui où la natalité est la plus forte", source: SRC_DEMO, ratioOk: false },
  { id: "mortalite", label: "Mortalité", fmt: (v) => `${nf(v, 1)} pour 1 000`, get: (f) => f.mortalite, qui: "celui où la mortalité est la plus forte", source: SRC_DEMO, ratioOk: false },
  { id: "balance", label: "Balance commerciale", fmt: fmtMdCourt, get: (f) => f.balance, qui: "le plus excédentaire", source: SRC_ECO, ratioOk: false },
];

const sup = (n: number | undefined) => (n ? nf(n) : "");

/* ═══════════════════════════════════════════════════════════════════════════
   UN PAYS
   ═══════════════════════════════════════════════════════════════════════════ */

export function titrePays(f: FichePays): string {
  const a = f.pib?.annee ?? f.population?.annee ?? 2025;
  return `${f.fr} : population, PIB, dette, inflation (${a}) | Visualize`;
}

export function descriptionPays(f: FichePays): string {
  const b: string[] = [];
  if (f.population) b.push(`${fmtHab(f.population.v)} (${an(f.population)})`);
  if (f.pib) b.push(`PIB de ${fmtMdCourt(f.pib.v)}`);
  if (f.pibHab) b.push(`${nf(f.pibHab.v)} $ par habitant`);
  if (f.dette) b.push(`dette de ${nf(f.dette.v, 1)} % du PIB`);
  return `${f.fr} en chiffres : ${b.join(", ")}. Évolution depuis 1960, classements mondiaux et comparaisons avec d'autres pays. Sources : Banque mondiale, FMI, Nations Unies.`;
}

export function introPays(f: FichePays): string {
  const l = cap(avec(f.fr));
  const p: string[] = [];
  if (f.population) p.push(`${l} compte environ ${fmtHab(f.population.v)} (${an(f.population)}).${f.rangs.population ? ` Rang mondial : ${rangTexte(f.rangs.population.r)} sur ${f.rangs.population.n}.` : ""}`);
  if (f.pib) p.push(`Son produit intérieur brut atteint ${fmtMd(f.pib.v)} en ${an(f.pib)}${f.rangs.pib ? ` (${rangTexte(f.rangs.pib.r)} rang mondial)` : ""}${f.pibHab ? `, et ${nf(f.pibHab.v)} dollars par habitant` : ""}.`);
  if (f.pib && f.pib1960 && f.pib1960.annee < an(f.pib)) {
    const x = f.pib.v / f.pib1960.v;
    if (x > 1.2 || x < 0.8) p.push(`Depuis ${f.pib1960.annee}, ce PIB a été multiplié par ${nf(x, x >= 10 ? 0 : 1)} en dollars courants.`);
  }
  return p.join(" ");
}

export function faqPays(f: FichePays): QR[] {
  const l = cap(avec(f.fr));
  const de = deNom(f.fr);
  const q: QR[] = [];
  if (f.population)
    q.push({
      q: `Quelle est la population ${de} ?`,
      r: `${l} compte environ ${fmtHab(f.population.v)} en ${an(f.population)} (${SRC_DEMO}).${f.rangs.population ? ` Rang mondial : ${rangTexte(f.rangs.population.r)} sur ${f.rangs.population.n}.` : ""}`,
    });
  if (f.pib)
    q.push({
      q: `Quel est le PIB ${de} ?`,
      r: `Le PIB ${de} s'élève à environ ${fmtMd(f.pib.v)} en ${an(f.pib)} (${SRC_ECO}).${f.rangs.pib ? ` C'est la ${rangTexte(f.rangs.pib.r)} économie du monde sur ${f.rangs.pib.n} pays.` : ""}`,
    });
  if (f.pibHab)
    q.push({
      q: `Quel est le PIB par habitant ${de} ?`,
      r: `Le PIB par habitant ${de} est d'environ ${nf(f.pibHab.v)} dollars en ${an(f.pibHab)}${f.rangs.pibHab ? ` (${rangTexte(f.rangs.pibHab.r)} rang mondial)` : ""} (${SRC_ECO}).`,
    });
  if (f.dette)
    q.push({ q: `Quelle est la dette publique ${de} ?`, r: `La dette publique ${de} représente environ ${nf(f.dette.v, 1)} % de son PIB en ${an(f.dette)} (${SRC_ECO}).` });
  if (f.inflation)
    q.push({ q: `Quelle est l'inflation ${de} ?`, r: `L'inflation ${de} est de ${nf(f.inflation.v, 1)} % en ${an(f.inflation)} (${SRC_ECO}).` });
  if (f.chomage)
    q.push({ q: `Quel est le taux de chômage ${de} ?`, r: `Le taux de chômage ${de} est de ${nf(f.chomage.v, 1)} % de la population active en ${an(f.chomage)} (${SRC_ECO}).` });
  if (f.superficie)
    q.push({
      q: `Quelle est la superficie ${de} ?`,
      r: `La superficie ${de} est d'environ ${nf(f.superficie)} km²${f.densite ? `, soit une densité d'environ ${nf(f.densite, f.densite < 10 ? 1 : 0)} habitants par km²` : ""} (valeur approchée, fond de carte Natural Earth).`,
    });
  if (f.natalite && f.mortalite)
    q.push({
      q: `Quel est le taux de natalité et de mortalité ${de} ?`,
      r: `En ${an(f.natalite)}, la natalité ${de} est de ${nf(f.natalite.v, 1)} naissances pour 1 000 habitants et la mortalité de ${nf(f.mortalite.v, 1)} décès pour 1 000 (${SRC_DEMO}).`,
    });
  q.push({
    q: `Comment comparer ${avec(f.fr)} avec un autre pays ?`,
    r: `Visualize propose un comparateur gratuit : choisissez ${avec(f.fr)} et jusqu'à trois autres pays, puis comparez la population, le PIB, la dette, l'inflation ou le chômage, année par année depuis 1960.`,
  });
  return q;
}

/* ═══════════════════════════════════════════════════════════════════════════
   UNE COMPARAISON
   ═══════════════════════════════════════════════════════════════════════════ */

/** Le rapport entre deux valeurs, écrit « 1,3 fois » ou « 12 fois ». */
export const fois = (a: number, b: number) => {
  const r = a >= b ? a / b : b / a;
  return `${nf(r, r >= 10 ? 0 : 1)} fois`;
};

export function titreDuel(a: FichePays, b: FichePays): string {
  return `${a.fr} ou ${b.fr} : comparaison population, PIB, superficie | Visualize`;
}

export function descriptionDuel(a: FichePays, b: FichePays): string {
  const l = LIGNES.filter((x) => ["population", "pib", "pibHab"].includes(x.id)).flatMap((x) => {
    const va = x.get(a);
    const vb = x.get(b);
    return va && vb ? [`${x.label.toLowerCase()} : ${x.fmt(va.v)} contre ${x.fmt(vb.v)}`] : [];
  });
  return `${a.fr} et ${b.fr} face à face${l.length ? ` — ${l.join(" ; ")}` : ""}. Superficie, dette, inflation, chômage et évolution depuis 1960. Données Banque mondiale, FMI, ONU.`;
}

export function introDuel(a: FichePays, b: FichePays): string {
  const p: string[] = [];
  const pa = a.population;
  const pb = b.population;
  if (pa && pb) {
    const [g, pt] = pa.v >= pb.v ? [a, b] : [b, a];
    p.push(`${cap(avec(g.fr))} compte plus d'habitants que ${avec(pt.fr)} : ${fmtHab(Math.max(pa.v, pb.v))} contre ${fmtHab(Math.min(pa.v, pb.v))}, soit ${fois(pa.v, pb.v)} plus.`);
  }
  if (a.pib && b.pib) {
    const [g, pt] = a.pib.v >= b.pib.v ? [a, b] : [b, a];
    p.push(`L'économie ${deNom(g.fr)} pèse ${fmtMdCourt(Math.max(a.pib.v, b.pib.v))} contre ${fmtMdCourt(Math.min(a.pib.v, b.pib.v))} pour ${avec(pt.fr)}.`);
  }
  if (a.superficie && b.superficie) {
    const [g, pt] = a.superficie >= b.superficie ? [a, b] : [b, a];
    p.push(`Côté superficie, ${avec(g.fr)} couvre environ ${nf(g.superficie ?? 0)} km², ${fois(a.superficie, b.superficie)} la taille ${deNom(pt.fr)}.`);
  }
  return p.join(" ");
}

export function faqDuel(a: FichePays, b: FichePays): QR[] {
  const q: QR[] = [];
  const A = avec(a.fr);
  const B = avec(b.fr);
  const duel = (id: string, question: string, phrase: (g: FichePays, pt: FichePays, vg: Mesure, vp: Mesure, l: (typeof LIGNES)[number]) => string) => {
    const l = LIGNES.find((x) => x.id === id);
    if (!l) return;
    const va = l.get(a);
    const vb = l.get(b);
    if (!va || !vb || va.v === vb.v) return;
    const [g, pt, vg, vp] = va.v > vb.v ? [a, b, va, vb] : [b, a, vb, va];
    q.push({ q: question, r: phrase(g, pt, vg, vp, l) });
  };
  duel("population", `Quel pays a le plus d'habitants : ${a.fr} ou ${b.fr} ?`, (g, pt, vg, vp, l) =>
    `${cap(avec(g.fr))}, avec ${fmtHab(vg.v)} contre ${fmtHab(vp.v)} pour ${avec(pt.fr)} (${l.source}) : ${fois(vg.v, vp.v)} plus d'habitants.`);
  duel("pib", `Quelle économie est la plus grande : ${a.fr} ou ${b.fr} ?`, (g, pt, vg, vp, l) =>
    `L'économie ${deNom(g.fr)} est la plus grande : ${fmtMd(vg.v)} (${an(vg)}) contre ${fmtMd(vp.v)} pour ${avec(pt.fr)} (${l.source}), soit ${fois(vg.v, vp.v)}.`);
  duel("pibHab", `Qui est le plus riche par habitant : ${a.fr} ou ${b.fr} ?`, (g, pt, vg, vp, l) =>
    `${cap(avec(g.fr))} : ${nf(vg.v)} dollars par habitant contre ${nf(vp.v)} pour ${avec(pt.fr)} (${l.source}).`);
  duel("superficie", `Quelle est la différence de taille entre ${A} et ${B} ?`, (g, pt, vg, vp) =>
    `La superficie ${deNom(g.fr)} est ${fois(vg.v, vp.v)} supérieure à celle ${deNom(pt.fr)} : environ ${nf(vg.v)} km² contre ${nf(vp.v)} km² (valeurs approchées, fond de carte Natural Earth).`);
  duel("densite", `Quel pays est le plus densément peuplé : ${a.fr} ou ${b.fr} ?`, (g, pt, vg, vp) =>
    `${cap(avec(g.fr))}, avec environ ${nf(vg.v, vg.v < 10 ? 1 : 0)} habitants par km² contre ${nf(vp.v, vp.v < 10 ? 1 : 0)} pour ${avec(pt.fr)}.`);
  duel("dette", `Quel pays est le plus endetté : ${a.fr} ou ${b.fr} ?`, (g, pt, vg, vp, l) =>
    `${cap(avec(g.fr))} : dette publique de ${nf(vg.v, 1)} % du PIB (${an(vg)}) contre ${nf(vp.v, 1)} % pour ${avec(pt.fr)} (${an(vp)}) (${l.source}).`);
  duel("inflation", `Où l'inflation est-elle la plus forte : ${a.fr} ou ${b.fr} ?`, (g, pt, vg, vp, l) =>
    `${cap(avec(g.fr))} : ${nf(vg.v, 1)} % (${an(vg)}) contre ${nf(vp.v, 1)} % pour ${avec(pt.fr)} (${an(vp)}) (${l.source}).`);
  duel("chomage", `Où le chômage est-il le plus élevé : ${a.fr} ou ${b.fr} ?`, (g, pt, vg, vp, l) =>
    `${cap(avec(g.fr))} : ${nf(vg.v, 1)} % de la population active (${an(vg)}) contre ${nf(vp.v, 1)} % pour ${avec(pt.fr)} (${an(vp)}) (${l.source}).`);
  q.push({
    q: `Comment comparer ${A} et ${B} année par année ?`,
    r: `Le comparateur de Visualize trace l'évolution de la population, du PIB, de la dette ou de l'inflation de ${A} et de ${B} depuis 1960, avec un curseur d'année et la possibilité d'ajouter jusqu'à deux autres pays.`,
  });
  return q;
}

export { sup };
