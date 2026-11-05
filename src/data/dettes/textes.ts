import { avec, cap, deNom, nf } from "@/data/seo/francais";
import type { Dossier } from "./dossiers";

/* Les phrases d'un dossier. `m` met en forme un montant en milliards d'euros d'une année,
   `u` un montant par habitant : côté serveur ce sont des euros, côté navigateur la monnaie du lecteur. */
export interface Fmt {
  m: (v: number, annee: number) => string;
  u: (v: number, annee: number) => string;
}

export const inflationTexte = (v: number) =>
  v >= 1e9 ? `${nf(v / 1e9, 1)} milliards de %` : v >= 1e6 ? `${nf(v / 1e6, 1)} millions de %` : `${nf(v, 1)} %`;

export function titreDossier(d: Dossier): string {
  return `Dette publique ${deNom(d.fr)} : montant, % du PIB, évolution depuis 2000 | Visualize`;
}
export function descriptionDossier(d: Dossier, f: Fmt): string {
  return `Dette publique ${deNom(d.fr)} : ${f.m(d.d2024, 2024)} en 2024, soit ${nf(d.p2024, 1)} % du PIB (${nf(d.p2000, 1)} % en 2000). Évolution depuis 2000, principaux créanciers, inflation et comparaison avec les autres pays.`;
}

export function introDossier(d: Dossier, f: Fmt): string {
  const L = cap(avec(d.fr));
  const evo = d.p2024 - d.p2000;
  const sens = Math.abs(evo) < 3 ? "reste proche de son niveau de 2000" : evo > 0 ? `a progressé de ${nf(evo, 1)} points depuis 2000` : `a reculé de ${nf(-evo, 1)} points depuis 2000`;
  return `${L} devait environ ${f.m(d.d2024, 2024)} à ses créanciers en 2024, soit ${nf(d.p2024, 1)} % de son produit intérieur brut. Rapportée à la richesse produite, cette dette ${sens} (${nf(d.p2000, 1)} % en 2000, ${nf(d.p2014, 1)} % en 2014). En montant, elle a été multipliée par ${nf(d.d2024 / d.d2000, d.d2024 / d.d2000 >= 10 ? 0 : 1)} en vingt-quatre ans.`;
}

export interface QR {
  q: string;
  r: string;
}

export function faqDossier(d: Dossier, f: Fmt): QR[] {
  const de = deNom(d.fr);
  const q: QR[] = [
    {
      q: `Quel est le montant de la dette publique ${de} ?`,
      r: `Environ ${f.m(d.d2024, 2024)} en 2024, soit ${nf(d.p2024, 1)} % du PIB. C'est le ${d.rangMontant === 1 ? "premier" : `${d.rangMontant}e`} montant parmi les ${d.total} pays de notre base de dette.`,
    },
    {
      q: `La dette ${de} est-elle élevée ?`,
      r: `Avec ${nf(d.p2024, 1)} % du PIB, ${avec(d.fr)} se place au ${d.rangRatio === 1 ? "premier" : `${d.rangRatio}e`} rang sur ${d.total} pays pour le poids de la dette dans la richesse produite. Les pays les plus endettés dépassent 150 % du PIB ; la plupart des économies avancées se situent entre 60 et 120 %.`,
    },
    {
      q: `Comment la dette ${de} a-t-elle évolué depuis 2000 ?`,
      r: `De ${f.m(d.d2000, 2000)} en 2000 (${nf(d.p2000, 1)} % du PIB) à ${f.m(d.d2014, 2014)} en 2014 (${nf(d.p2014, 1)} %), puis ${f.m(d.d2024, 2024)} en 2024 (${nf(d.p2024, 1)} %). Le montant a progressé de ${nf(d.croissance)} % sur la période.`,
    },
  ];
  if (d.pop2024)
    q.push({
      q: `À combien s'élève la dette ${de} par habitant ?`,
      r: `En 2024, la dette représente environ ${f.u((d.d2024 * 1e9) / d.pop2024, 2024)} par habitant, pour ${nf(d.pop2024 / 1e6, 1)} millions d'habitants.`,
    });
  if (d.creanciers.length)
    q.push({
      q: `Qui détient la dette publique ${de} ?`,
      r: `D'après notre base, la répartition indicative des créanciers est : ${d.creancierTexte}. Ces proportions sont approximatives et varient d'une année à l'autre.`,
    });
  q.push({
    q: `Quelle est l'inflation ${de} ?`,
    r: `L'inflation ${de} est de ${nf(d.inflation2024, 1)} % en 2024. Son plus haut historique dans notre base est de ${inflationTexte(d.inflationPic)} (${d.inflationPicDate}).`,
  });
  q.push({
    q: `Peut-on afficher les montants dans une autre monnaie ?`,
    r: `Oui. Les montants sont publiés en euros ; vous pouvez les afficher en dollars américains ou en renminbis. Chaque montant est converti au taux de change moyen de son année (Banque centrale européenne, Banque des règlements internationaux).`,
  });
  return q;
}
