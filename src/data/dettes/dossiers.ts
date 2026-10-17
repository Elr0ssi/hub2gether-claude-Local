import "server-only";
import { DEBT_DATA, type DebtEntry } from "@/data/economy/debtData";
import { paysParNom, serieDe, type FichePays } from "@/data/seo/pays";
import { slugDe } from "@/data/seo/francais";

/* ═══════════════════════════════════════════════════════════════════════════
   LES DOSSIERS « DETTE PUBLIQUE » PAR PAYS

   Un dossier par pays de la table de dette du site : la dette en 2000, 2014 et
   2024 (en milliards d'euros), son poids dans le PIB, ses principaux
   créanciers, l'inflation. Rien d'autre n'est ajouté : pas de projection, pas
   de taux d'intérêt que la table ne contient pas.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface Segment {
  label: string;
  pct: number;
}

export interface Dossier {
  nom: string;
  fr: string;
  slug: string;
  iso2: string;
  flag: string;
  /** Milliards d'euros, fin d'année. */
  d2000: number;
  d2014: number;
  d2024: number;
  p2000: number;
  p2014: number;
  p2024: number;
  creanciers: Segment[];
  creancierTexte: string;
  inflation2024: number;
  inflationPic: number;
  inflationPicDate: string;
  croissance: number;
  /** Rang parmi les pays du dossier : 1 = le plus endetté (en % du PIB, ou en montant). */
  rangRatio: number;
  rangMontant: number;
  total: number;
  /** PIB implicite : dette divisée par son ratio. */
  pib2024: number;
  /** Habitants en 2024, quand la base les publie. */
  pop2024?: number;
  fichePays?: { slug: string };
  voisins: { fr: string; slug: string; p2024: number; flag: string }[];
}

function segments(texte: string): Segment[] {
  const sortie: Segment[] = [];
  const re = /([^(),]+?)\s*\((\d+(?:[.,]\d+)?)\s*%\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(texte))) sortie.push({ label: m[1].trim().replace(/^(et|ou)\s+/i, ""), pct: parseFloat(m[2].replace(",", ".")) });
  const somme = sortie.reduce((s, x) => s + x.pct, 0);
  if (sortie.length && somme < 98) sortie.push({ label: "Autres créanciers", pct: Math.round((100 - somme) * 10) / 10 });
  return sortie;
}

let cache: Dossier[] | null = null;

export function tousLesDossiers(): Dossier[] {
  if (cache) return cache;
  const parRatio = [...DEBT_DATA].sort((a: DebtEntry, b: DebtEntry) => b.debt_2024_pct - a.debt_2024_pct);
  const parMontant = [...DEBT_DATA].sort((a, b) => b.debt_2024_bn - a.debt_2024_bn);
  const liste: Dossier[] = DEBT_DATA.map((d) => {
    const f: FichePays | undefined = paysParNom(d.name);
    const pop = f ? serieDe(f, "population").find((x) => x.annee === 2024)?.v : undefined;
    return {
      nom: d.name,
      fr: d.name_fr,
      slug: slugDe(d.name_fr),
      iso2: d.code,
      flag: d.flag,
      d2000: d.debt_2000_bn,
      d2014: d.debt_2014_bn,
      d2024: d.debt_2024_bn,
      p2000: d.debt_2000_pct,
      p2014: d.debt_2014_pct,
      p2024: d.debt_2024_pct,
      creanciers: segments(d.creditor),
      creancierTexte: d.creditor,
      inflation2024: d.inflation_2024,
      inflationPic: d.inflation_peak_pct,
      inflationPicDate: d.inflation_peak_date,
      croissance: d.debt_growth_ratio_pct,
      rangRatio: parRatio.findIndex((x) => x.code === d.code) + 1,
      rangMontant: parMontant.findIndex((x) => x.code === d.code) + 1,
      total: DEBT_DATA.length,
      pib2024: d.debt_2024_bn / (d.debt_2024_pct / 100),
      pop2024: pop,
      fichePays: f ? { slug: f.slug } : undefined,
      voisins: [],
    };
  });
  for (const d of liste) {
    d.voisins = liste
      .filter((x) => x.nom !== d.nom)
      .sort((a, b) => Math.abs(a.p2024 - d.p2024) - Math.abs(b.p2024 - d.p2024))
      .slice(0, 5)
      .map((x) => ({ fr: x.fr, slug: x.slug, p2024: x.p2024, flag: x.flag }));
  }
  cache = liste;
  return liste;
}

export const dossierParSlug = (slug: string) => tousLesDossiers().find((d) => d.slug === slug);
