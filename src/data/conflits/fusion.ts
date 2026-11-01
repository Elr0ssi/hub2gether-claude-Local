import enrichi from "./enrichi.json";
import { dossiersDuFichier, type Acteur, type Cause, type ChiffreCle, type Consequence, type DossierConflit, type Fiabilite, type Jalon, type Theme, type Verification } from "./chiffres";

/* ═══════════════════════════════════════════════════════════════════════════
   LES CONFLITS : FUSION DES DOSSIERS LOCAUX ET DE L'ENRICHISSEMENT IMPORTÉ

   Deux couches sans écrasement :
   - le dossier LOCAL (chiffres-2026-10-31.json), rédigé et sourcé ligne à ligne, garde la priorité ;
   - l'enrichissement IMPORTÉ (enrichi.json, produit par scripts/conflits/importer-enrichissement.mjs) complète : il n'ajoute un élément que
     s'il n'existe pas déjà (même date et même titre, même texte, même chiffre).
   Les contenus importés gardent leur état de vérification (« documenté » ou « à vérifier ») : rien n'est promu en « vérifié » ici.
   ═══════════════════════════════════════════════════════════════════════════ */

interface SourceImportee { id: string; titre: string; url: string; date_publication: string | null; date_consultation: string | null; nature: string; verification_lien: string; generique: boolean }
interface FicheImportee {
  nom_court: string;
  resume: { texte: string; verification: string; limite: string | null; source_ids: string[] };
  causes: { type: Cause["type"]; texte: string; verification: string; source_ids: string[] }[];
  acteurs: { nom: string; alias: string[]; role: string | null; verification: string; source_id: string }[];
  chronologie: { date: string; fin: string | null; precision: string; titre: string; description: string | null; source_id: string; fiabilite: string }[];
  consequences: { theme: Theme; texte: string; source_ids: string[] }[];
  chiffres: {
    id: string; type: string; valeur: number | null; min: number | null; max: number | null; unite: string; periode_debut: string | null; periode_fin: string | null;
    date_donnee: string | null; source_id: string; fiabilite: string; portee_geographique: string; cible: string; precision: string;
  }[];
  liens: { id: string; type: string; justification: string | null; validation: string | null }[];
  pays: { iso3: string; role: string; verification: string; ne: string | null }[];
  points: unknown[];
  relations: unknown[];
  sources: string[];
  manque: string[];
  validation: { niveau: string; derniere_verification: string | null } | null;
}

const E = enrichi as unknown as { sources: Record<string, SourceImportee>; conflits: Record<string, FicheImportee>; version: string; date_arret: string; statut: string };

export const SOURCES: Record<string, SourceImportee> = E.sources;
export const VERSION_ENRICHISSEMENT = { version: E.version, date_arret: E.date_arret, statut: E.statut };
export const ficheImportee = (id: string) => E.conflits[id] ?? null;

const verif = (v: string | undefined): Verification => (v === "documenté_sur_source_consultee" || v === "vérifié" ? "documente" : "a_verifier");
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
const fiab = (f: string): Fiabilite => (["vérifié", "estimé", "revendiqué", "contesté"].includes(f) ? (f as Fiabilite) : "estimé");

const MOIS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
const jour = (iso: string) => { const [a, m, j] = iso.split("-"); return j ? `${Number(j)} ${MOIS[Number(m) - 1]} ${a}` : m ? `${MOIS[Number(m) - 1]} ${a}` : a; };

const TYPES_CHIFFRE: Record<string, { libelle: string; nature: string; theme: Theme }> = {
  civils_tues: { libelle: "civils tués", nature: "morts", theme: "humaines" },
  civils_blesses: { libelle: "civils blessés", nature: "blesses", theme: "humaines" },
  personnes_tuees: { libelle: "personnes tuées", nature: "morts", theme: "humaines" },
  personnes_blessees: { libelle: "personnes blessées", nature: "blesses", theme: "humaines" },
  personnes_deplacees_internes: { libelle: "déplacés internes", nature: "deplaces", theme: "humaines" },
  personnes_deplacees_forcees: { libelle: "déplacés de force (internes et réfugiés)", nature: "deplaces", theme: "humaines" },
};

function enChiffre(k: FicheImportee["chiffres"][number]): ChiffreCle {
  const t = TYPES_CHIFFRE[k.type] ?? { libelle: k.type.replace(/_/g, " "), nature: "autre", theme: "humaines" as Theme };
  const src = SOURCES[k.source_id];
  const periode = k.periode_debut && k.periode_fin ? `${jour(k.periode_debut)} → ${jour(k.periode_fin)}` : k.periode_fin ? `au ${jour(k.periode_fin)}` : "période non précisée";
  const jours = k.periode_debut && k.periode_fin ? (Date.parse(k.periode_fin) - Date.parse(k.periode_debut)) / 864e5 : null;
  const valeur = k.valeur === null ? (k.min !== null && k.max !== null ? `${k.min.toLocaleString("fr-FR")}–${k.max.toLocaleString("fr-FR")}` : "—") : k.valeur.toLocaleString("fr-FR");
  return {
    valeur,
    libelle: t.libelle,
    detail: `${k.portee_geographique} · ${periode} · ${k.precision}`,
    perimetre: k.portee_geographique,
    fiabilite: fiab(k.fiabilite),
    nature: t.nature,
    theme: t.theme,
    portee: t.nature === "deplaces" ? "cumulé" : jours !== null && jours > 366 ? "cumulé" : jours === null ? "ponctuel" : "récent",
    source: src?.titre ?? k.source_id,
    source_url: src?.url ?? "",
    min: k.min,
    max: k.max,
    date_donnee: k.date_donnee,
  };
}

/** Les chiffres à mettre en avant : un par nature d'abord (le plus marquant), puis le reste. Les chiffres qui se recouvrent restent tous
 *  disponibles dans « Conséquences », avec leur date : on ne force pas un chiffre unique. */
const RANG_NATURE = (c: ChiffreCle) => (c.nature === "morts" ? (c.portee === "cumulé" ? 0 : 2) : c.nature === "deplaces" ? 1 : c.nature === "faim" ? 3 : c.nature === "economie" || c.nature === "navires" ? 3 : c.nature === "blesses" ? 4 : 5);
function ordonner(l: ChiffreCle[]): ChiffreCle[] {
  const tri = [...l].sort((a, b) => RANG_NATURE(a) - RANG_NATURE(b) || (b.date_donnee ?? "").localeCompare(a.date_donnee ?? "") || Number(a.fiabilite !== "vérifié") - Number(b.fiabilite !== "vérifié"));
  const vus = new Set<string>();
  const premiers: ChiffreCle[] = [];
  const reste: ChiffreCle[] = [];
  for (const c of tri) {
    const k = c.nature ?? "autre";
    if (!vus.has(k)) { vus.add(k); premiers.push(c); } else reste.push(c);
  }
  return [...premiers.sort((a, b) => RANG_NATURE(a) - RANG_NATURE(b)), ...reste];
}

let cache: Map<string, DossierConflit> | null = null;

/** Le dossier d'une fiche : local + importé, sans doublon. Undefined quand ni l'un ni l'autre n'a de contenu utile. */
export function dossierFusionne(id: string): DossierConflit | undefined {
  if (!cache) cache = construire();
  return cache.get(id);
}

function construire(): Map<string, DossierConflit> {
  const local = dossiersDuFichier();
  const out = new Map<string, DossierConflit>();
  const ids = new Set([...local.keys(), ...Object.keys(E.conflits)]);
  for (const id of ids) {
    const l = local.get(id);
    const i = E.conflits[id];
    const d: DossierConflit = { ...(l ?? { chiffres: [] }), chiffres: [...(l?.chiffres ?? [])] };

    if (i) {
      /* Titre court et résumé : le local d'abord ; sinon l'importé, avec son état de vérification. */
      d.titre_court = l?.titre_court ?? i.nom_court;
      if (!l?.resume) {
        d.resume = i.resume.texte;
        d.resumeVerification = verif(i.resume.verification);
        d.resumeLimite = i.resume.limite;
      } else d.resumeVerification = "documente";

      const causes: Cause[] = [...(l?.causes ?? [])];
      for (const c of i.causes) {
        if (causes.some((x) => norm(x.texte).slice(0, 60) === norm(c.texte).slice(0, 60))) continue;
        const s = SOURCES[c.source_ids[0]];
        causes.push({ type: c.type, titre: "", texte: c.texte, verification: verif(c.verification), source: s?.titre, source_url: s?.url });
      }
      if (causes.length) d.causes = causes;

      const acteurs: Acteur[] = [...(l?.acteurs ?? [])];
      for (const a of i.acteurs) {
        if (acteurs.some((x) => norm(x.nom) === norm(a.nom) || a.alias.some((al) => norm(al) === norm(x.nom)))) continue;
        acteurs.push({ nom: a.nom, role: a.role ?? "", verification: verif(a.verification) });
      }
      if (acteurs.length) d.acteurs = acteurs;

      const jalons: Jalon[] = [...(l?.chronologie ?? [])];
      for (const e of i.chronologie) {
        if (jalons.some((x) => x.date === e.date && norm(x.titre).slice(0, 25) === norm(e.titre).slice(0, 25))) continue;
        const s = SOURCES[e.source_id];
        jalons.push({ date: e.date, titre: e.titre, texte: e.description ?? "", source: s?.titre, source_url: s?.url, precision: e.precision, fiabilite: fiab(e.fiabilite) });
      }
      if (jalons.length) d.chronologie = jalons;

      const cons: Consequence[] = [...(l?.consequences ?? [])];
      for (const c of i.consequences) {
        const s = SOURCES[c.source_ids[0]];
        cons.push({ theme: c.theme, texte: c.texte, source: s?.titre, source_url: s?.url });
      }
      if (cons.length) d.consequences = cons;

      for (const k of i.chiffres) {
        const c = enChiffre(k);
        if (d.chiffres.some((x) => x.libelle === c.libelle && x.valeur === c.valeur)) continue;
        d.chiffres.push(c);
      }

      d.liens = i.liens;
      d.sourceIds = i.sources;
      d.etat = { niveau: i.validation?.niveau ?? "inconnu", derniere_verification: i.validation?.derniere_verification ?? null, manque: i.manque };
    }
    d.chiffres = ordonner(d.chiffres);
    out.set(id, d);
  }
  return out;
}

export const ETATS_FICHE: Record<string, { libelle: string; ton: "ok" | "partiel" | "brouillon" }> = {
  fiche_enrichie_partiellement_validee: { libelle: "Partiellement validée", ton: "partiel" },
  fiche_editoriale_a_verifier: { libelle: "Éditoriale, à vérifier", ton: "brouillon" },
};
