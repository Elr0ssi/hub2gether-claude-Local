/* ═══════════════════════════════════════════════════════════════════════════
   LES TAUX DE CHANGE ANNUELS

   La base économique est en dollars américains courants : c'est l'unité de
   la Banque mondiale, dont viennent le produit intérieur brut, le PIB par
   habitant, la balance commerciale et le montant de la dette.

   Convertir un montant nominal ne se fait pas au taux du jour. Un PIB de
   1985 s'exprime au taux de 1985, sans quoi on compare une production de
   1985 à un taux de 2026, et le résultat ne veut rien dire. Chaque année a
   donc son taux.

   Conséquence qu'il faut avoir en tête : changer de monnaie ne change pas
   seulement l'étiquette, cela change la forme de la courbe. Le produit
   intérieur brut français a reculé en dollars entre 2008 et 2015 alors
   qu'il montait en euros, parce que le taux de change bougeait lui aussi.
   Les deux courbes sont justes ; elles ne répondent pas à la même question.
   ═══════════════════════════════════════════════════════════════════════════ */

export type Monnaie = "usd" | "eur" | "cny";

export interface FicheMonnaie {
  code: Monnaie;
  /** Ce qui suit un montant en milliards. */
  suffixe: string;
  /** Ce qui suit un montant unitaire, comme le PIB par habitant. */
  unitaire: string;
  libelle: string;
  /** La première année couverte, ou 0 quand c'est la monnaie de référence. */
  depuis: number;
  source: string;
}

export const MONNAIES: FicheMonnaie[] = [
  {
    code: "usd",
    suffixe: "Md $",
    unitaire: "$",
    libelle: "Dollar américain",
    depuis: 0,
    source: "Unité d'origine de la base : Banque mondiale, dollars courants.",
  },
  {
    code: "eur",
    suffixe: "Md €",
    unitaire: "€",
    libelle: "Euro",
    depuis: 1999,
    source:
      "Banque centrale européenne, série EXR.M.USD.EUR.SP00.E, relevés de fin de mois moyennés sur l'année.",
  },
  {
    code: "cny",
    suffixe: "Md CN¥",
    unitaire: "CN¥",
    libelle: "Renminbi chinois",
    depuis: 1957,
    source:
      "Banque des règlements internationaux, taux bilatéraux contre dollar, moyennes mensuelles moyennées sur l'année.",
  },
];

/* Dollars pour un euro. Une année absente reste absente : l'euro n'existe
   pas avant 1999, et aucune reconstruction n'est fabriquée ici. */
const USD_PAR_EUR: Record<number, number> = {
  1999: 1.058775, 2000: 0.91935, 2001: 0.891717, 2002: 0.951133, 2003: 1.1418, 2004: 1.24615,
  2005: 1.237983, 2006: 1.262992, 2007: 1.379717, 2008: 1.472592, 2009: 1.396308, 2010: 1.320675,
  2011: 1.400017, 2012: 1.293167, 2013: 1.330833, 2014: 1.321083, 2015: 1.10455, 2016: 1.103167,
  2017: 1.137033, 2018: 1.179317, 2019: 1.11945, 2020: 1.147, 2021: 1.181558, 2022: 1.049983,
  2023: 1.08285, 2024: 1.080775, 2025: 1.131383, 2026: 1.163037,
};

/* Renminbi pour un dollar. */
const CNY_PAR_USD: Record<number, number> = {
  1957: 2.461809, 1958: 2.461809, 1959: 2.461809, 1960: 2.461809, 1961: 2.461809, 1962: 2.461809,
  1963: 2.461809, 1964: 2.461809, 1965: 2.461809, 1966: 2.461809, 1967: 2.461809, 1968: 2.461809,
  1969: 2.461809, 1970: 2.461809, 1971: 2.461809, 1972: 2.245066, 1973: 1.989415, 1974: 1.961107,
  1975: 1.859823, 1976: 1.941415, 1977: 1.857824, 1978: 1.683589, 1979: 1.554939, 1980: 1.498386,
  1981: 1.70899, 1982: 1.8973, 1983: 1.980895, 1984: 2.33455, 1985: 2.944636, 1986: 3.461012,
  1987: 3.7314, 1988: 3.7314, 1989: 3.768995, 1990: 4.795484, 1991: 5.334813, 1992: 5.526606,
  1993: 5.776741, 1994: 8.640074, 1995: 8.370945, 1996: 8.33872, 1997: 8.319296, 1998: 8.300619,
  1999: 8.278273, 2000: 8.277084, 2001: 8.276999, 2002: 8.276999, 2003: 8.276998, 2004: 8.277682,
  2005: 8.193643, 2006: 7.972846, 2007: 7.606033, 2008: 6.949844, 2009: 6.831129, 2010: 6.769246,
  2011: 6.46358, 2012: 6.308615, 2013: 6.148582, 2014: 6.161489, 2015: 6.284464, 2016: 6.643863,
  2017: 6.75887, 2018: 6.615163, 2019: 6.909178, 2020: 6.902517, 2021: 6.449738, 2022: 6.73081,
  2023: 7.081735, 2024: 7.196647, 2025: 7.188287, 2026: 6.836737,
};

/**
 * Un montant en dollars courants, porté dans une autre monnaie, au taux de
 * son année.
 *
 * Renvoie `null` quand l'année n'a pas de taux. C'est la même règle que
 * partout ailleurs : une donnée qui n'existe pas ne devient pas un zéro.
 */
export function convertir(v: number | null, annee: number, m: Monnaie): number | null {
  if (v === null || !Number.isFinite(v)) return null;
  if (m === "usd") return v;
  if (m === "eur") {
    const t = USD_PAR_EUR[annee];
    return t ? v / t : null;
  }
  const t = CNY_PAR_USD[annee];
  return t ? v * t : null;
}

/** La fiche d'une monnaie, jamais indéfinie. */
export function fiche(m: Monnaie): FicheMonnaie {
  return MONNAIES.find((x) => x.code === m) ?? MONNAIES[0];
}
