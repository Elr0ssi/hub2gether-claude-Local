#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════
   IMPORT DE L'ENRICHISSEMENT DES 68 FICHES → src/data/conflits/enrichi.json

   Usage : npm run conflits:importer -- [data/sources/conflits/Vizualize_Conflits_Enrichis_2026-10-31.json]
   - Idempotent : la même source donne exactement le même fichier (clés triées, aucune horloge dans la sortie).
   - Sans perte : les 68 identifiants VIZ-C-001…068 de l'inventaire sont obligatoires ; la source brute reste archivée (checksum dans
     le journal d'import). Réversible : supprimer enrichi.json rend le site à l'inventaire d'origine + dossiers locaux.
   - Aucune donnée locale n'est écrasée : la fusion avec les dossiers locaux (chiffres-2026-10-31.json) se fait à l'exécution, dans
     src/data/conflits/fusion.ts, et les dossiers locaux gardent la priorité.
   - Transformations : (1) acteurs en doublon fusionnés (même rôle et même source : on garde le nom le plus complet) ;
     (2) bornes de période d'un bilan (« Début de la période… », « Fin de la période… », « Point de situation… ») écartées de la
     chronologie : ce sont des fenêtres de mesure, déjà portées par les chiffres, pas des événements ; (3) pays rattachés à un code
     ISO3 ET à la géométrie Natural Earth quand elle existe ; (4) sources marquées « génériques » quand l'URL est un tableau de bord.
   ═══════════════════════════════════════════════════════════════════════════ */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const SOURCE = resolve(RACINE, process.argv.slice(2).find((a) => !a.startsWith("--")) ?? "data/sources/conflits/Vizualize_Conflits_Enrichis_2026-10-31.json");
const SORTIE = resolve(RACINE, "src/data/conflits/enrichi.json");
const NE = new Set(JSON.parse(readFileSync(resolve(RACINE, "public/geo/ne_50m_countries.simplified.geojson"), "utf8")).features.map((f) => f.properties.name));

/** Noms ISO 3166 (anglais) → nom Natural Earth, quand ils diffèrent. Le reste passe par l'égalité exacte. */
const ALIAS_ISO_NE = {
  "Brunei Darussalam": "Brunei", "Central African Republic": "Central African Rep.", "Congo, The Democratic Republic of the": "Dem. Rep. Congo",
  "Western Sahara": "W. Sahara", "Iran, Islamic Republic of": "Iran", "Korea, Republic of": "South Korea", "Korea, Democratic People's Republic of": "North Korea",
  "Palestine, State of": "Palestine", "Russian Federation": "Russia", "Syrian Arab Republic": "Syria", "Türkiye": "Turkey", "Taiwan, Province of China": "Taiwan",
  "United States": "United States of America", "Venezuela, Bolivarian Republic of": "Venezuela", "Viet Nam": "Vietnam", "Bolivia, Plurinational State of": "Bolivia",
  "Tanzania, United Republic of": "Tanzania", "Moldova, Republic of": "Moldova", "Czechia": "Czechia", "Eswatini": "eSwatini", "Bosnia and Herzegovina": "Bosnia and Herz.",
  "Dominican Republic": "Dominican Rep.", "Equatorial Guinea": "Eq. Guinea", "Lao People's Democratic Republic": "Laos", "Côte d'Ivoire": "Côte d'Ivoire",
  "Cabo Verde": "Cabo Verde", "South Sudan": "S. Sudan", "Congo": "Congo", "Micronesia, Federated States of": "Micronesia", "United Kingdom": "United Kingdom",
  "Falkland Islands (Malvinas)": "Falkland Is.", "Solomon Islands": "Solomon Is.", "Cayman Islands": "Cayman Is.", "Cook Islands": "Cook Is.", "Marshall Islands": "Marshall Is.",
  "Saint Kitts and Nevis": "St. Kitts and Nevis", "Saint Vincent and the Grenadines": "St. Vin. and Gren.", "Antigua and Barbuda": "Antigua and Barb.", "Sao Tome and Principe": "São Tomé and Principe",
  "Netherlands": "Netherlands", "Hong Kong": "Hong Kong",
};

const THEME_CAUSE = { structurelles: "structurelle", declencheurs: "declencheur", facteurs_aggravants: "aggravant", enjeux: "enjeu" };
const THEME_CONSEQUENCE = { humaines: "humaines", economiques: "economiques", territoriales: "territoriales", diplomatiques: "geopolitiques" };
const norm = (s) => (s ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
const trie = (o) => (Array.isArray(o) ? o.map(trie) : o && typeof o === "object" ? Object.fromEntries(Object.keys(o).sort().map((k) => [k, trie(o[k])])) : o);

const brut = readFileSync(SOURCE);
const J = JSON.parse(brut.toString("utf8"));
const journal = { source: SOURCE.replace(RACINE + "/", ""), sha256: createHash("sha256").update(brut).digest("hex"), version: J.meta.version, date_arret: J.meta.date_arret_inventaire, avertissements: [], ecartes: [] };

/* ── Sources ─────────────────────────────────────────────────────────────── */
const generique = (url) => /global-conflict-tracker\/dashboard\/?$/.test(url) || /\/dashboard\/?$/.test(url);
const sources = {};
for (const s of J.sources) {
  sources[s.id] = {
    id: s.id, titre: s.titre, url: s.url, date_publication: s.date_publication ?? null, date_consultation: s.date_consultation ?? null,
    nature: s.nature, verification_lien: s.verification_lien, generique: generique(s.url),
  };
}
const cles = new Set(Object.keys(sources));

/* ── Pays ISO3 → Natural Earth ───────────────────────────────────────────── */
const iso = {};
for (const p of J.pays) {
  const ne = ALIAS_ISO_NE[p.nom_iso] ?? p.nom_iso;
  iso[p.iso3] = { nom: p.nom_iso, ne: NE.has(ne) ? ne : null, statut: p.statut };
}

/* ── Conflits ────────────────────────────────────────────────────────────── */
const conflits = {};
for (const c of J.conflits) {
  const refSrc = (ids) => (ids ?? []).filter((id) => { if (cles.has(id)) return true; journal.avertissements.push(`${c.id} : source inconnue ${id}`); return false; });

  /* Acteurs : on fusionne les doublons (même rôle, même source), nom le plus complet conservé ; sans rôle, par nom normalisé. */
  const groupes = new Map();
  for (const a of c.acteurs) {
    const k = a.role ? `${norm(a.role)}|${a.source_id}` : `n|${norm(a.nom)}`;
    const g = groupes.get(k);
    if (!g) groupes.set(k, { ...a, alias: [] });
    else {
      const [garde, autre] = a.nom.length > g.nom.length ? [a, g] : [g, a];
      groupes.set(k, { ...garde, alias: [...new Set([...(g.alias ?? []), autre.nom])] });
      journal.ecartes.push(`${c.id} : acteur « ${autre.nom} » fusionné avec « ${garde.nom} »`);
    }
  }
  const acteurs = [...groupes.values()].map((a) => ({ nom: a.nom, alias: a.alias, type: a.type, role: a.role, objectifs: a.objectifs, pays_iso3: a.pays_iso3, source_id: a.source_id, verification: a.verification }));

  const causes = [];
  for (const [g, type] of Object.entries(THEME_CAUSE)) for (const it of c.causes?.[g] ?? []) causes.push({ type, texte: it.texte, verification: it.verification, source_ids: refSrc(it.source_ids) });

  const chronologie = [];
  for (const e of c.chronologie) {
    if (/^(Début|Fin) de la période|^Point de situation/.test(e.titre)) {
      journal.ecartes.push(`${c.id} : « ${e.titre} » écarté de la chronologie (fenêtre de mesure d'un bilan, pas un événement)`);
      continue;
    }
    chronologie.push({ date: e.date, fin: e.fin, precision: e.precision ?? (e.date.length === 10 ? "jour" : e.date.length === 7 ? "mois" : "annee"), titre: e.titre, description: e.description, source_id: e.source_id, fiabilite: e.fiabilite });
  }

  const consequences = [];
  for (const [g, theme] of Object.entries(THEME_CONSEQUENCE)) for (const it of c.consequences?.[g] ?? []) consequences.push({ theme, texte: it.texte ?? String(it), source_ids: refSrc(it.source_ids) });

  conflits[c.id] = trie({
    nom_court: c.nom_court,
    categorie: c.categorie,
    resume: { texte: c.resume.texte, verification: c.resume.verification, limite: c.resume.limite ?? null, source_ids: refSrc(c.resume.source_ids) },
    causes, acteurs, chronologie, consequences,
    chiffres: c.chiffres_cles.map((k) => ({ id: k.id, type: k.type, valeur: k.valeur, min: k.min, max: k.max, unite: k.unite, periode_debut: k.periode_debut, periode_fin: k.periode_fin, date_donnee: k.date_donnee, source_id: k.source_id, fiabilite: k.fiabilite, portee_geographique: k.portee_geographique, cible: k.cible, precision: k.precision })),
    liens: (c.liens_crises ?? []).map((l) => ({ id: l.id, type: l.type, justification: l.justification, validation: l.validation })),
    pays: c.pays.map((p) => ({ iso3: p.iso3, role: p.role, verification: p.verification, ne: iso[p.iso3]?.ne ?? null })),
    points: c.donnees_carte?.points_precis ?? [],
    relations: c.diplomatie?.relations_directement_associees ?? [],
    sources: refSrc(c.sources),
    manque: c.manque ?? [],
    validation: c.validation ?? null,
    statut_operationnel_verifie: c.statut_operationnel_verifie ?? null,
    intensite_verifiee: c.intensite_verifiee ?? null,
    date_debut_precise: c.date_debut_precise ?? null,
    date_fin_precise: c.date_fin_precise ?? null,
  });
}
for (const [id, v] of Object.entries(conflits)) for (const p of v.pays) if (!iso[p.iso3]) journal.avertissements.push(`${id} : code pays inconnu ${p.iso3}`);

const sortie = trie({
  schema: 1,
  version: J.meta.version,
  date_arret: J.meta.date_arret_inventaire,
  statut: J.meta.statut,
  sources, conflits,
  avertissements_source: J.regles ?? null,
  journal,
});
mkdirSync(dirname(SORTIE), { recursive: true });
writeFileSync(SORTIE, JSON.stringify(sortie));
/* L'index des 250 entités et la liste des jeux massifs ne servent pas au navigateur : fichier à part. */
writeFileSync(resolve(dirname(SORTIE), "pays-iso.json"), JSON.stringify(trie({ pays: iso, sources_pour_imports_massifs: J.sources_pour_imports_massifs ?? [] })));
console.log(`${Object.keys(conflits).length} fiches, ${Object.keys(sources).length} sources, ${Object.keys(iso).length} entités ISO ; ${journal.ecartes.length} éléments écartés ou fusionnés, ${journal.avertissements.length} avertissements`);
for (const a of journal.avertissements) console.warn("  ! " + a);
