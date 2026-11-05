"use client";

import { useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   LE MONTANT EN TOUTES LETTRES

   Sous un compteur qui défile, une ligne qui dit la même valeur autrement —
   « 8,5 milliards d'habitants » plutôt que neuf chiffres à compter un par
   un. L'échelle se choisit seule, sur la valeur du moment : elle change avec
   le compteur, mais à son rythme à elle, une fois par seconde plutôt qu'à
   chaque image, puisqu'un texte n'a pas besoin de courir à soixante images
   par seconde pour donner l'impression de suivre le nombre.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Le mot qui suit un montant en dollars, selon la monnaie choisie. */
export const MOT_MONNAIE: Record<string, string> = { usd: "dollars", eur: "euros", cny: "renminbis" };

/* « Milliards » et « millions » appellent un « de » devant le nom qui suit
   (trois milliards D'habitants) ; « mille », employé comme un nombre, ne le
   prend pas (trois mille habitants, jamais trois mille d'habitants). */
const ECHELLES: [number, string, boolean][] = [
  [1e9, "milliards", true],
  [1e6, "millions", true],
  [1e3, "mille", false],
];
/* Le h muet se comporte comme une voyelle (d'hectares, d'habitants) ; rien
   ne distingue ici le h aspiré, trop rare dans ce lexique pour le compter. */
const VOYELLES = /^[aeiouyhàâäéèêëïîôöùûü]/i;

function avecDe(mot: string): string {
  return VOYELLES.test(mot) ? `d'${mot}` : `de ${mot}`;
}

export function enLettres(valeur: number, mot: string): string {
  const dit = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1, minimumFractionDigits: 0 });
  for (const [seuil, echelle, de] of ECHELLES) {
    if (Math.abs(valeur) >= seuil) {
      return `${dit.format(valeur / seuil)} ${echelle} ${de ? avecDe(mot) : mot}`;
    }
  }
  return `${dit.format(valeur)} ${mot}`;
}

/** Le texte en lettres suit le compteur sans repasser par React à chaque
    image : une puce à son propre rythme, plutôt qu'un second état React qui
    redessinerait la page soixante fois par seconde pour rien. */
export function Lettres({
  base,
  parSeconde,
  depuis,
  mot,
  className = "cg-tr-lettres",
}: {
  base: number;
  parSeconde: number;
  depuis: number;
  mot: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let brut = 0;
    const tic = () => {
      const v = base + parSeconde * ((performance.now() - depuis) / 1000);
      el.textContent = enLettres(v, mot);
      brut = window.setTimeout(tic, 1000);
    };
    tic();
    return () => window.clearTimeout(brut);
  }, [base, parSeconde, depuis, mot]);
  return <span className={className} ref={ref} />;
}
