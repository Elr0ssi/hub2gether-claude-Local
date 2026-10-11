/* Le français des pages par pays : article, « de », majuscule. Les pays
   féminins au singulier sont la règle ; on ne liste que les exceptions. */

const MASC = new Set([
  "Afghanistan", "Angola", "Azerbaïdjan", "Bangladesh", "Belize", "Bhoutan", "Botswana", "Brésil", "Burkina Faso", "Burundi", "Bénin",
  "Cambodge", "Cameroun", "Canada", "Cap-Vert", "Chili", "Congo", "Costa Rica", "Danemark", "Eswatini", "Gabon", "Ghana", "Groenland",
  "Guatemala", "Guyana", "Honduras", "Irak", "Iran", "Japon", "Kazakhstan", "Kenya", "Kirghizistan", "Kosovo", "Koweït", "Laos", "Lesotho",
  "Liban", "Liberia", "Liechtenstein", "Luxembourg", "Malawi", "Mali", "Maroc", "Mexique", "Monténégro", "Mozambique", "Népal", "Nicaragua",
  "Niger", "Nigeria", "Ouzbékistan", "Pakistan", "Panama", "Paraguay", "Pérou", "Portugal", "Qatar", "Royaume-Uni", "Rwanda", "Salvador",
  "Soudan", "Soudan du Sud", "Sri Lanka", "Suriname", "Sénégal", "Tadjikistan", "Tchad", "Timor oriental", "Togo", "Turkménistan",
  "Uruguay", "Venezuela", "Viêt Nam", "Yémen", "Zimbabwe",
]);
const PLUR = new Set([
  "États-Unis", "Pays-Bas", "Philippines", "Émirats arabes unis", "Bahamas", "Comores", "Seychelles", "Fidji", "Palaos", "Bermudes",
  "Îles Caïmans", "Îles Féroé", "Îles Marshall", "Îles Salomon", "Îles Mariannes du Nord", "Îles Turques-et-Caïques",
  "Îles Vierges des États-Unis", "Samoa américaines",
]);
const SANS = new Set([
  "Cuba", "Israël", "Haïti", "Chypre", "Singapour", "Madagascar", "Malte", "Hong Kong", "Porto Rico", "Aruba", "Curaçao", "Guam", "Maurice",
  "Djibouti", "Oman", "Tonga", "Samoa", "Vanuatu", "Kiribati", "Sao Tomé-et-Principe", "Antigua-et-Barbuda", "Saint-Marin", "Sainte-Lucie",
  "Saint-Martin", "Saint-Christophe-et-Niévès", "Saint-Vincent-et-les-Grenadines", "Bahreïn", "Brunei", "Andorre", "Monaco",
]);
const VOYELLE = /^[AEIOUYÀÂÄÉÈÊËÎÏÔÖÙÛÜ]/i;

export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** « la France », « le Japon », « les États-Unis », « Cuba », « l'Allemagne ». */
export function avec(nom: string): string {
  if (SANS.has(nom)) return nom;
  if (PLUR.has(nom)) return `les ${nom}`;
  if (VOYELLE.test(nom)) return `l'${nom}`;
  return MASC.has(nom) ? `le ${nom}` : `la ${nom}`;
}
/** « de la France », « du Japon », « des États-Unis », « de Cuba », « d'Allemagne ». */
export function deNom(nom: string): string {
  if (SANS.has(nom)) return VOYELLE.test(nom) ? `d'${nom}` : `de ${nom}`;
  if (PLUR.has(nom)) return `des ${nom}`;
  if (VOYELLE.test(nom)) return MASC.has(nom) ? `de l'${nom}` : `de l'${nom}`;
  return MASC.has(nom) ? `du ${nom}` : `de la ${nom}`;
}

export function slugDe(texte: string): string {
  return texte
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const nf = (v: number, d = 0) => v.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });
export const rangTexte = (n: number) => (n === 1 ? "1er" : `${n}e`);

export const fmtMd = (v: number) => (Math.abs(v) >= 1000 ? `${nf(v / 1000, 1)} billions de dollars` : `${nf(v, v >= 100 ? 0 : 1)} milliards de dollars`);
export const fmtMdCourt = (v: number) => (Math.abs(v) >= 1000 ? `${nf(v / 1000, 1)} T$` : Math.abs(v) < 1 ? `${nf(v, 2)} Md$` : `${nf(v, Math.abs(v) >= 100 ? 0 : 1)} Md$`);
export const fmtHab = (v: number) => {
  if (v >= 1e9) return `${nf(v / 1e9, 2)} milliard${v >= 2e9 ? "s" : ""} d'habitants`;
  if (v >= 1e6) return `${nf(v / 1e6, v >= 1e8 ? 0 : 1)} millions d'habitants`;
  if (v >= 1e3) return `${nf(v / 1e3, 0)} mille habitants`;
  return `${nf(v)} habitants`;
};
export const fmtHabCourt = (v: number) => (v >= 1e9 ? `${nf(v / 1e9, 2)} Md` : v >= 1e6 ? `${nf(v / 1e6, v >= 1e8 ? 0 : 1)} M` : v >= 1e3 ? `${nf(v / 1e3, 0)} k` : nf(v));
