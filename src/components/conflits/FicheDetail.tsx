"use client";

import { useMemo, useState, useId } from "react";
import {
  CalendarClock, CalendarDays, ChartColumn, ChevronDown, Coins, Crosshair, ExternalLink, FileText, Footprints, MapPin, Rocket, Ship, Target, TrendingDown, Users, Wheat, type LucideIcon,
} from "lucide-react";
import { COULEUR, type Conflit } from "@/data/conflits";
import { analyserZone } from "@/data/conflits/pays";
import { dateCourte, periodeTexte, titreCourt, type ChiffreCle, type DossierConflit, type Theme } from "@/data/conflits/chiffres";
import { dateIso, type Evenement } from "@/data/conflits/evenements";

/* ═══════════════════════════════════════════════════════════════════════════
   LA FICHE D'UN CONFLIT

   Une seule fiche pour toutes les crises : titre court, catégorie, période, lieu, trois indicateurs, un résumé, puis cinq rubriques
   dépliables (causes, acteurs, chronologie, conséquences, sources). Rien n'est rempli quand la donnée manque : une rubrique sans
   contenu n'est pas affichée. Les contenus viennent de src/data/conflits (dossiers, points, inventaire), jamais d'ici.
   ═══════════════════════════════════════════════════════════════════════════ */

const ICONE_NATURE: Record<string, LucideIcon> = {
  morts: Users,
  deplaces: Footprints,
  economie: TrendingDown,
  navires: Ship,
  faim: Wheat,
  frappes: Rocket,
};

const THEMES: { id: Theme; titre: string }[] = [
  { id: "humaines", titre: "Humaines" },
  { id: "economiques", titre: "Économiques" },
  { id: "geopolitiques", titre: "Géopolitiques" },
  { id: "territoriales", titre: "Territoriales" },
  { id: "militaires", titre: "Militaires" },
];

const TYPES_CAUSE = { structurelle: "Cause de fond", declencheur: "Déclencheur", aggravant: "Facteur aggravant" } as const;

type RubriqueId = "causes" | "acteurs" | "chronologie" | "consequences" | "sources";

interface Props {
  c: Conflit;
  parId: Map<string, Conflit>;
  nomPays: (n: string) => string;
  dossier?: DossierConflit;
  evts: Evenement[];
  onEvt: (e: Evenement) => void;
  onFiche: (c: Conflit) => void;
  onPays: (p: string) => void;
  /** Le titre est un h3 dans le panneau, un h4 dans la liste. */
  titre?: boolean;
  /** La rubrique ouverte, quand le parent la garde (elle survit au passage par la carte). */
  ouverte?: string | null;
  onOuvrir?: (r: string | null) => void;
}

/* ── Les indicateurs ─────────────────────────────────────────────────────── */

function Indicateur({ i }: { i: ChiffreCle }) {
  const Icone = ICONE_NATURE[i.nature ?? ""] ?? ChartColumn;
  return (
    <div className="cf-ind">
      <span className="cf-ind-i"><Icone size={18} aria-hidden="true" /></span>
      <b>{i.valeur}</b>
      <span className="cf-ind-l">{i.libelle}</span>
      <small title={i.detail}>{i.portee ? `${i.portee[0].toUpperCase()}${i.portee.slice(1)} · ` : ""}{i.detail}</small>
      <span className="cf-ind-p">
        <em className={`cf-fiab cf-fiab-${i.fiabilite.slice(0, 3)}`}>{i.fiabilite}</em>
        <a href={i.source_url} target="_blank" rel="noopener noreferrer" aria-label={`Source : ${i.source}`}>{i.source} <ExternalLink size={10} aria-hidden="true" /></a>
      </span>
    </div>
  );
}

/* ── Une rubrique dépliable ──────────────────────────────────────────────── */

function Rubrique({ id, titre, Icone, ouverte, onBascule, children }: { id: string; titre: string; Icone: LucideIcon; ouverte: boolean; onBascule: () => void; children: React.ReactNode }) {
  const uid = useId();
  return (
    <div className={`cf-rub${ouverte ? " cf-rub-on" : ""}`}>
      <button type="button" className="cf-rub-t" aria-expanded={ouverte} aria-controls={`${uid}-${id}`} id={`${uid}-${id}-t`} onClick={onBascule}>
        <span className="cf-rub-i"><Icone size={20} aria-hidden="true" /></span>
        <b>{titre}</b>
        <ChevronDown size={18} aria-hidden="true" className="cf-rub-f" />
      </button>
      <div className="cf-rub-p" id={`${uid}-${id}`} role="region" aria-labelledby={`${uid}-${id}-t`}>
        <div className="cf-rub-c">{children}</div>
      </div>
    </div>
  );
}

/* ── La chronologie : jalons du dossier + points datés, dans l'ordre ──────── */

interface Etape {
  iso: string;
  quand: string;
  titre: string;
  texte: string;
  source?: string;
  url?: string;
  points: Evenement[];
}

function etapes(c: Conflit, d: DossierConflit | undefined, evts: Evenement[]): Etape[] {
  const parId = new Map(evts.map((e) => [e.id, e]));
  const out: Etape[] = [];
  const dansJalon = new Set<string>();
  for (const j of d?.chronologie ?? []) {
    const pts = (j.points ?? []).map((id) => parId.get(id)).filter(Boolean) as Evenement[];
    pts.forEach((e) => dansJalon.add(e.id));
    out.push({ iso: j.date, quand: dateCourte(j.date), titre: j.titre, texte: j.texte, source: j.source, url: j.source_url, points: pts });
  }
  for (const e of evts) {
    if (dansJalon.has(e.id)) continue;
    out.push({
      iso: dateIso(e.date),
      quand: e.date,
      titre: e.titre,
      texte: `${e.lieu}${e.chiffre ? ` · ${e.chiffre.valeur} ${e.chiffre.libelle}` : ""}`,
      source: e.source,
      url: e.source_url,
      points: [e],
    });
  }
  if (d?.periode) {
    const { debut, fin } = d.periode;
    if (!out.some((x) => x.iso.slice(0, 7) === debut.slice(0, 7) && x.points.length === 0 && x.titre.toLowerCase().includes("début")))
      out.push({ iso: debut, quand: dateCourte(debut), titre: "Début du conflit", texte: c.situation, points: [] });
    if (fin) out.push({ iso: fin, quand: dateCourte(fin), titre: "Fin du conflit", texte: "", points: [] });
  }
  return out.sort((a, b) => (a.iso < b.iso ? -1 : a.iso > b.iso ? 1 : 0));
}

/* ── Les sources, rattachées à ce qu'elles justifient ─────────────────────── */

function sourcesDe(c: Conflit, d: DossierConflit | undefined, evts: Evenement[]) {
  const m = new Map<string, { nom: string; url: string; concerne: string[] }>();
  const ajoute = (nom: string | undefined, url: string | undefined, concerne: string) => {
    if (!nom || !url) return;
    const s = m.get(url) ?? { nom, url, concerne: [] };
    if (!s.concerne.includes(concerne)) s.concerne.push(concerne);
    m.set(url, s);
  };
  ajoute(c.source, c.source_url, "Fiche de l’inventaire : catégorie, zone, acteurs");
  d?.chiffres.forEach((x) => ajoute(x.source, x.source_url, `Chiffre : ${x.valeur} ${x.libelle}`));
  d?.causes?.forEach((x) => ajoute(x.source, x.source_url, `Cause : ${x.titre}`));
  d?.chronologie?.forEach((x) => ajoute(x.source, x.source_url, `Jalon : ${x.titre}`));
  d?.consequences?.forEach((x) => ajoute(x.source, x.source_url, "Conséquence"));
  evts.forEach((e) => ajoute(e.source, e.source_url, `Point : ${e.lieu}`));
  return [...m.values()];
}

/* ── La fiche ────────────────────────────────────────────────────────────── */

export function FicheDetail({ c, parId, nomPays, dossier, evts, onEvt, onFiche, onPays, titre, ouverte, onOuvrir }: Props) {
  const [local, setLocal] = useState<string | null>(null);
  const ouv = ouverte !== undefined ? ouverte : local;
  const bascule = (r: RubriqueId) => {
    const v = ouv === r ? null : r;
    if (onOuvrir) onOuvrir(v);
    else setLocal(v);
  };
  const Titre = titre ? "h3" : "h4";
  const ind = dossier?.chiffres.slice(0, 3) ?? [];
  const resume = dossier?.resume ?? c.description;
  const parent = c.parent ? parId.get(c.parent) : null;
  const enfants = c.enfants.map((e) => parId.get(e)).filter(Boolean) as Conflit[];

  const chrono = useMemo(() => etapes(c, dossier, evts), [c, dossier, evts]);
  const sources = useMemo(() => sourcesDe(c, dossier, evts), [c, dossier, evts]);
  const acteurs = useMemo(() => {
    if (dossier?.acteurs?.length) return dossier.acteurs;
    return c.acteurs.split(";").map((n) => n.trim()).filter(Boolean).map((nom) => ({ nom, role: "", pays: analyserZone(nom).pays[0] }));
  }, [c, dossier]);
  const consequences = useMemo(() => {
    const out: { theme: Theme; titre: string; chiffres: ChiffreCle[]; textes: { texte: string; source?: string; url?: string }[] }[] = [];
    for (const t of THEMES) {
      const chiffres = (dossier?.chiffres ?? []).filter((x) => x.theme === t.id);
      const textes = (dossier?.consequences ?? []).filter((x) => x.theme === t.id).map((x) => ({ texte: x.texte, source: x.source, url: x.source_url }));
      if (chiffres.length || textes.length) out.push({ theme: t.id, titre: t.titre, chiffres, textes });
    }
    return out;
  }, [dossier]);

  const bilan = (p: string) => {
    const sur = evts.filter((e) => e.pays === p).length;
    const menes = evts.filter((e) => e.auteurPays === p && e.pays !== p).length;
    return [sur ? `${sur} point${sur > 1 ? "s" : ""} sur son sol` : "", menes ? `${menes} mené${menes > 1 ? "s" : ""} depuis` : ""].filter(Boolean).join(" · ");
  };
  const paysChips = [...new Set([...c.pays, ...evts.flatMap((e) => (e.auteurPays && !c.pays.includes(e.auteurPays) ? [e.auteurPays] : []))])];

  return (
    <div className="cf-fiche cf-fd">
      <div className="cf-fd-tete">
        <div>
          <span className="cf-fd-cat"><i className="cf-pt" style={{ background: COULEUR[c.categorie] }} aria-hidden="true" />{c.categorie}</span>
          <Titre className="cf-fd-titre">{titreCourt(c.nom, dossier)}</Titre>
        </div>
        {dossier?.intensite && (
          <a className="cf-fd-int" href={dossier.intensite.source_url} target="_blank" rel="noopener noreferrer">
            <small>Intensité</small><b>{dossier.intensite.niveau}</b>
          </a>
        )}
      </div>
      <p className="cf-fd-meta">
        {dossier && <span><CalendarDays size={14} aria-hidden="true" />{periodeTexte(dossier.periode)}</span>}
        <span><MapPin size={14} aria-hidden="true" />{c.zone.split(";").map((z) => z.trim()).join(" · ")}</span>
      </p>
      {dossier?.periode.statut && <p className="cf-statut">{dossier.periode.statut}</p>}

      <div className={`cf-inds cf-inds-${Math.max(1, ind.length)}`}>
        {ind.length ? ind.map((i) => <Indicateur key={i.libelle} i={i} />) : <div className="cf-ind cf-ind-vide"><b>—</b><span className="cf-ind-l">Donnée indisponible</span><small>Aucun chiffre sourcé pour cette fiche.</small></div>}
      </div>

      <section className="cf-resume">
        <h4>Résumé</h4>
        <p>{resume}</p>
      </section>

      <div className="cf-rubs">
        {dossier?.causes?.length ? (
          <Rubrique id="causes" titre="Causes" Icone={Target} ouverte={ouv === "causes"} onBascule={() => bascule("causes")}>
            <ul className="cf-causes">
              {dossier.causes.map((x) => (
                <li key={x.titre}>
                  <em>{TYPES_CAUSE[x.type]}</em>
                  <b>{x.titre}</b>
                  <p>{x.texte}</p>
                  {x.source_url && <a href={x.source_url} target="_blank" rel="noopener noreferrer">{x.source} <ExternalLink size={10} aria-hidden="true" /></a>}
                </li>
              ))}
            </ul>
          </Rubrique>
        ) : null}

        {acteurs.length > 0 && (
          <Rubrique id="acteurs" titre="Acteurs" Icone={Users} ouverte={ouv === "acteurs"} onBascule={() => bascule("acteurs")}>
            <ul className="cf-acteurs">
              {acteurs.map((a) => (
                <li key={a.nom}>
                  {a.pays ? <button type="button" onClick={() => onPays(a.pays as string)}>{a.nom}</button> : <b>{a.nom}</b>}
                  {a.role && <p>{a.role}</p>}
                  {"objectifs" in a && a.objectifs && <p className="cf-acteur-o">{a.objectifs}</p>}
                </li>
              ))}
            </ul>
            {paysChips.length > 0 && evts.length > 0 && (
              <div className="cf-pays-l">
                {paysChips.map((p) => (
                  <button key={p} type="button" onClick={() => onPays(p)}>
                    <b>{nomPays(p)}</b>
                    {bilan(p) && <small>{bilan(p)}</small>}
                  </button>
                ))}
              </div>
            )}
            {(parent || enfants.length > 0) && (
              <div className="cf-lies">
                <small>Fiches liées, non additionnées</small>
                {parent && <button type="button" onClick={() => onFiche(parent)}>↑ {parent.nom}</button>}
                {enfants.map((e) => <button key={e.id} type="button" onClick={() => onFiche(e)}>↳ {e.nom}</button>)}
              </div>
            )}
          </Rubrique>
        )}

        {chrono.length > 0 && (
          <Rubrique id="chronologie" titre="Chronologie" Icone={CalendarClock} ouverte={ouv === "chronologie"} onBascule={() => bascule("chronologie")}>
            <ol className="cf-frise">
              {chrono.map((e) => {
                const carte = e.points.length > 0;
                const corps = (
                  <>
                    <time>{e.quand}</time>
                    <b>{e.titre}</b>
                    {e.texte && <p>{e.texte}</p>}
                  </>
                );
                return (
                  <li key={`${e.iso}-${e.titre}`} className={carte ? "cf-frise-c" : ""}>
                    {carte ? (
                      <button type="button" onClick={() => onEvt(e.points[0])} aria-label={`${e.titre} : voir sur la carte`}>
                        {corps}
                        <span className="cf-frise-m"><Crosshair size={12} aria-hidden="true" />Voir sur la carte</span>
                      </button>
                    ) : (
                      <div>{corps}</div>
                    )}
                    {e.url && <a href={e.url} target="_blank" rel="noopener noreferrer">{e.source} <ExternalLink size={10} aria-hidden="true" /></a>}
                  </li>
                );
              })}
            </ol>
          </Rubrique>
        )}

        {consequences.length > 0 && (
          <Rubrique id="consequences" titre="Conséquences" Icone={ChartColumn} ouverte={ouv === "consequences"} onBascule={() => bascule("consequences")}>
            {consequences.map((g) => (
              <div key={g.theme} className="cf-cons">
                <h5>{g.titre}</h5>
                {g.chiffres.length > 0 && (
                  <div className="cf-cons-n">
                    {g.chiffres.map((x) => {
                      const Icone = ICONE_NATURE[x.nature ?? ""] ?? Coins;
                      return (
                        <div key={x.libelle} className="cf-mini">
                          <Icone size={14} aria-hidden="true" />
                          <b>{x.valeur}</b>
                          <span>{x.libelle}</span>
                          <small>{x.detail} · <a href={x.source_url} target="_blank" rel="noopener noreferrer">{x.source}</a></small>
                        </div>
                      );
                    })}
                  </div>
                )}
                {g.textes.map((t) => (
                  <p key={t.texte} className="cf-cons-t">{t.texte}{t.url && <> <a href={t.url} target="_blank" rel="noopener noreferrer">{t.source}</a></>}</p>
                ))}
              </div>
            ))}
          </Rubrique>
        )}

        <Rubrique id="sources" titre="Sources" Icone={FileText} ouverte={ouv === "sources"} onBascule={() => bascule("sources")}>
          <ul className="cf-srcs">
            {sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer"><b>{s.nom}</b> <ExternalLink size={11} aria-hidden="true" /></a>
                <small>{s.concerne.join(" · ")}</small>
              </li>
            ))}
          </ul>
          <p className="cf-srcs-n">{c.verification} · inventaire du {new Date(c.date_inventaire + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} · {c.id}</p>
        </Rubrique>
      </div>
    </div>
  );
}
