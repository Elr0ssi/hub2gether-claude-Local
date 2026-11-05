/* ═══════════════════════════════════════════════════════════════════════════
   LIRE LES SOURCES EXISTANTES

   Une partie de la base vit encore dans des fichiers TypeScript écrits à la
   main. Ce module les lit sans les modifier : il isole le littéral déclaré
   après `export const X =` et l'évalue tel quel. Les séparateurs de milliers
   (1_000) et les clés non guillemetées sont du JavaScript valide — il n'y a
   donc rien à réécrire, et aucune valeur ne passe par une conversion.
   ═══════════════════════════════════════════════════════════════════════════ */

import fs from "node:fs";

/** Le littéral qui suit `export const <nom>` — accolades et crochets appariés. */
export function litteral(fichier, nom) {
  const src = fs.readFileSync(fichier, "utf8");
  const m = new RegExp(`(?:export )?const ${nom}\\b[^=]*=\\s*`).exec(src);
  if (!m) throw new Error(`${nom} introuvable dans ${fichier}`);
  let i = m.index + m[0].length;
  const ouvre = src[i];
  const ferme = ouvre === "[" ? "]" : "}";
  if (ouvre !== "[" && ouvre !== "{") throw new Error(`${nom} : littéral attendu, trouvé « ${ouvre} »`);
  let n = 0;
  let chaine = null;
  let debut = i;
  for (; i < src.length; i++) {
    const c = src[i];
    if (chaine) {
      if (c === "\\") i++;
      else if (c === chaine) chaine = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") { chaine = c; continue; }
    if (c === "/" && src[i + 1] === "/") { while (i < src.length && src[i] !== "\n") i++; continue; }
    if (c === "/" && src[i + 1] === "*") { i = src.indexOf("*/", i) + 1; continue; }
    if (c === ouvre) n++;
    else if (c === ferme) { n--; if (n === 0) { i++; break; } }
  }
  const texte = src.slice(debut, i);
  return new Function(`return (${texte});`)();
}

/** Le référentiel ISO3 → { iso2, nom } et le pont nom de carte → ISO3. */
export function referentiels(racine) {
  const ref = JSON.parse(fs.readFileSync(`${racine}/data/referentiel-pays.json`, "utf8"));
  const { pont } = JSON.parse(fs.readFileSync(`${racine}/data/pont-geographies.json`, "utf8"));
  /* Les fichiers écrits à la main emploient parfois un nom que le fond de
     carte n'utilise pas. On les nomme ici plutôt que de les perdre en
     silence : un nom non résolu fait échouer la migration. */
  const alias = {
    "Czech Republic": "CZE",
    "Ivory Coast": "CIV",
    "Dominican Republic": "DOM",
    "Republic of Korea": "KOR",
    "Russian Federation": "RUS",
    "Slovak Republic": "SVK",
    "Viet Nam": "VNM",
    "Egypt, Arab Rep.": "EGY",
    "Iran, Islamic Rep.": "IRN",
    "Venezuela, RB": "VEN",
    "Hong Kong SAR, China": "HKG",
    "Bosnia and Herzegovina": "BIH",
    "United Arab Emirates": "ARE",
    "Trinidad and Tobago": "TTO",
    "Papua New Guinea": "PNG",
    "Equatorial Guinea": "GNQ",
    "Democratic Republic of the Congo": "COD",
    "Republic of the Congo": "COG",
    "Central African Republic": "CAF",
    "Solomon Islands": "SLB",
    "Marshall Islands": "MHL",
    "Cape Verde": "CPV",
    "East Timor": "TLS",
    "Swaziland": "SWZ",
    "Macedonia": "MKD",
    "Burma": "MMR",
    UAE: "ARE",
    Taiwan: "TWN",
  };
  const iso = (nom) => pont[nom] ?? alias[nom] ?? null;
  return { ref, pont, alias, iso };
}
