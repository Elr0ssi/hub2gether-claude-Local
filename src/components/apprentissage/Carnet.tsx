"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BookMarked, Eye, EyeOff, Languages, NotebookPen, RefreshCw, Repeat2, Trash2 } from "lucide-react";
import { aReviser, fusionner, lireLocal, majLocal, retirerLocal, reviser, surChangement, INTERVALLES, type ElementCarnet } from "@/lib/carnet";
import { envoyerAuCarnet, retirerDuCarnet } from "@/app/compte/carnet-actions";
import "./apprentissage.css";

/* ═══════════════════════════════════════════════════════════════════════════
   MON CARNET : LES TRADUCTIONS À RÉVISER ET LES ENREGISTREMENTS

   Traductions : des cartes, le français d'abord pour s'entraîner, l'anglais en basculant ; une révision espacée (« Je savais »
   fait revenir la carte plus tard, « À revoir » la ramène vite).
   Enregistrements : les articles gardés (avec un compte) et les passages mémorisés, qu'on peut masquer pour se les réciter.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface ArticleGarde { slug: string; titre: string; extrait: string; cree_le: string }

type Onglet = "traductions" | "enregistrements";
type SousOnglet = "articles" | "textes";
const date = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export function Carnet({ compte = [], articles, connecte, ongletInitial = "traductions" }: { compte?: ElementCarnet[]; articles?: ArticleGarde[]; connecte: boolean; ongletInitial?: Onglet }) {
  const [local, setLocal] = useState<ElementCarnet[]>([]);
  const [serveur, setServeur] = useState<ElementCarnet[]>(compte);
  const [onglet, setOnglet] = useState<Onglet>(ongletInitial);
  const [sous, setSous] = useState<SousOnglet>(articles ? "articles" : "textes");

  useEffect(() => {
    setLocal(lireLocal());
    return surChangement(() => setLocal(lireLocal()));
  }, []);

  /* Connecté : ce qui n'est encore que sur cet appareil part au compte. */
  useEffect(() => {
    if (!connecte) return;
    const ids = new Set(compte.map((e) => e.id));
    const a = lireLocal().filter((e) => !ids.has(e.id)).slice(0, 100);
    if (!a.length) return;
    (async () => {
      const envoyes: ElementCarnet[] = [];
      for (const e of a) if ((await envoyerAuCarnet(e).catch(() => ({ ok: false }))).ok) envoyes.push(e);
      if (envoyes.length) setServeur((s) => [...envoyes, ...s]);
    })();
  }, [connecte, compte]);

  const tout = useMemo(() => fusionner(local, serveur), [local, serveur]);
  const traductions = tout.filter((e) => e.type === "traduction");
  const passages = tout.filter((e) => e.type === "passage");

  const retirer = (e: ElementCarnet) => {
    retirerLocal(e.id);
    setServeur((s) => s.filter((x) => x.id !== e.id));
    if (connecte) retirerDuCarnet(e.id).catch(() => {});
  };
  const enregistrer = (e: ElementCarnet) => {
    majLocal(e);
    setServeur((s) => s.map((x) => (x.id === e.id ? e : x)));
    if (connecte) envoyerAuCarnet(e).catch(() => {});
  };

  return (
    <div className="ca">
      <div className="ca-onglets" role="tablist" aria-label="Mon carnet">
        <button type="button" role="tab" aria-selected={onglet === "traductions"} className={onglet === "traductions" ? "on" : ""} onClick={() => setOnglet("traductions")}>
          <Languages size={15} aria-hidden="true" /> Mes traductions <em>{traductions.length}</em>
        </button>
        <button type="button" role="tab" aria-selected={onglet === "enregistrements"} className={onglet === "enregistrements" ? "on" : ""} onClick={() => setOnglet("enregistrements")}>
          <BookMarked size={15} aria-hidden="true" /> Mes enregistrements <em>{passages.length + (articles?.length ?? 0)}</em>
        </button>
      </div>

      {onglet === "traductions" ? (
        <Traductions liste={traductions} onRetirer={retirer} onReviser={enregistrer} />
      ) : (
        <>
          <div className="ca-onglets" role="tablist" aria-label="Enregistrements">
            {articles && (
              <button type="button" role="tab" aria-selected={sous === "articles"} className={sous === "articles" ? "on" : ""} onClick={() => setSous("articles")}>
                Articles <em>{articles.length}</em>
              </button>
            )}
            <button type="button" role="tab" aria-selected={sous === "textes"} className={sous === "textes" ? "on" : ""} onClick={() => setSous("textes")}>
              <NotebookPen size={14} aria-hidden="true" /> Textes <em>{passages.length}</em>
            </button>
          </div>
          {sous === "articles" && articles ? (
            articles.length === 0 ? (
              <p className="ca-vide">Aucun article gardé pour le moment. Sur la page d’un article, « Enregistrer cet article » l’ajoute ici.</p>
            ) : (
              <ul className="ca-passages">
                {articles.map((a) => (
                  <li key={a.slug} className="ca-passage">
                    <Link href={`/lecture/${a.slug}`} className="ca-carte-t">{a.titre}</Link>
                    <span className="ca-note">{a.extrait}</span>
                    <span className="ca-note">Enregistré le {date(a.cree_le)}</span>
                  </li>
                ))}
              </ul>
            )
          ) : (
            <Passages liste={passages} onRetirer={retirer} />
          )}
        </>
      )}

      {!connecte && (
        <p className="ca-note">
          Ce carnet est gardé sur cet appareil. <a href="/compte/connexion">Connectez-vous</a> pour le retrouver dans votre espace, sur tous vos appareils.
        </p>
      )}
    </div>
  );
}

function Boite({ n }: { n: number }) {
  return (
    <span className="ca-boite" title={`Boîte ${n + 1} sur ${INTERVALLES.length}`} aria-label={`Boîte ${n + 1} sur ${INTERVALLES.length}`}>
      {INTERVALLES.map((_, i) => <i key={i} className={i <= n ? "on" : undefined} />)}
    </span>
  );
}

function Traductions({ liste, onRetirer, onReviser }: { liste: ElementCarnet[]; onRetirer: (e: ElementCarnet) => void; onReviser: (e: ElementCarnet) => void }) {
  /* Le sens d'entraînement : le français d'abord (on cherche l'anglais), ou l'inverse. */
  const [sens, setSens] = useState<"fr" | "en">("fr");
  const [retournees, setRetournees] = useState<Set<string>>(new Set());
  const [revision, setRevision] = useState<ElementCarnet[] | null>(null);
  const [vue, setVue] = useState(false);
  const dues = liste.filter((e) => aReviser(e));

  if (!liste.length) {
    return (
      <p className="ca-vide">
        Aucune traduction gardée. Sélectionnez un mot ou une phrase dans un article ou une page, choisissez « Traduire », puis « Garder la traduction » : elle arrive ici, en français, pour vous entraîner.
      </p>
    );
  }

  if (revision) {
    const c = revision[0];
    if (!c) {
      return (
        <div className="ca-rev">
          <span className="ca-rev-k">Révision terminée</span>
          <p className="ca-rev-t">Les cartes reviendront au bon moment : plus vous les savez, plus elles s’espacent.</p>
          <button type="button" onClick={() => setRevision(null)}>Retour aux cartes</button>
        </div>
      );
    }
    const recto = sens === "fr" ? c.texte : c.traduction ?? "";
    const verso = sens === "fr" ? c.traduction ?? "Pas de traduction gardée" : c.texte;
    const repondre = (su: boolean) => {
      onReviser(reviser(c, su));
      setVue(false);
      setRevision((r) => (r ? (su ? r.slice(1) : [...r.slice(1), reviser(c, false)]) : r));
    };
    return (
      <div className="ca-rev" aria-live="polite">
        <span className="ca-rev-k">{sens === "fr" ? "Comment le dire en anglais ?" : "Que veut dire, en français ?"} · {revision.length} restante{revision.length > 1 ? "s" : ""}</span>
        <p className="ca-rev-t" lang={sens === "fr" ? "fr" : "en"}>{recto}</p>
        {vue ? (
          <>
            <p className="ca-rev-r" lang={sens === "fr" ? "en" : "fr"}>{verso}</p>
            <div className="ca-ligne">
              <button type="button" onClick={() => repondre(false)}>À revoir</button>
              <button type="button" className="ca-su" onClick={() => repondre(true)}>Je savais</button>
            </div>
          </>
        ) : (
          <button type="button" className="ca-su" onClick={() => setVue(true)}>Voir la réponse</button>
        )}
        <button type="button" onClick={() => { setRevision(null); setVue(false); }}>Arrêter</button>
      </div>
    );
  }

  return (
    <>
      <div className="ca-barre">
        <span className="ca-sens" role="group" aria-label="Langue montrée en premier">
          <button type="button" className={sens === "fr" ? "on" : ""} onClick={() => { setSens("fr"); setRetournees(new Set()); }}>Français d’abord</button>
          <button type="button" className={sens === "en" ? "on" : ""} onClick={() => { setSens("en"); setRetournees(new Set()); }}>Anglais d’abord</button>
        </span>
        <button type="button" className="ca-btn" disabled={!dues.length} onClick={() => setRevision([...dues].sort(() => Math.random() - 0.5))}>
          <Repeat2 size={15} aria-hidden="true" /> Réviser {dues.length ? `(${dues.length})` : ""}
        </button>
        <button type="button" className="ca-btn ca-btn-2" onClick={() => setRevision([...liste].sort(() => Math.random() - 0.5))}>
          <RefreshCw size={14} aria-hidden="true" /> Tout réviser
        </button>
        <span className="ca-n">{liste.length} traduction{liste.length > 1 ? "s" : ""} · {dues.length} à revoir aujourd’hui</span>
      </div>
      <div className="ca-cartes">
        {liste.map((e) => {
          const r = retournees.has(e.id);
          const montreFr = (sens === "fr") !== r;
          return (
            <div key={e.id} className="ca-carte">
              <span className="ca-carte-k">{montreFr ? "Français" : "English"}</span>
              <span className={`ca-carte-t${montreFr ? "" : " ca-carte-en"}`} lang={montreFr ? "fr" : "en"}>{montreFr ? e.texte : e.traduction ?? "Pas de traduction gardée"}</span>
              <button
                type="button"
                className="ca-retourner"
                onClick={() => setRetournees((s) => { const n = new Set(s); if (n.has(e.id)) n.delete(e.id); else n.add(e.id); return n; })}
              >
                <Languages size={13} aria-hidden="true" /> {montreFr ? "Voir en anglais" : "Voir en français"}
              </button>
              <span className="ca-carte-pied">
                <Boite n={e.niveau} />
                {e.source_url && <a href={e.source_url}>{e.source_titre ?? "Source"}</a>}
                <button type="button" className="ca-retirer" onClick={() => onRetirer(e)} aria-label="Retirer cette traduction"><Trash2 size={14} /></button>
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}

function Passages({ liste, onRetirer }: { liste: ElementCarnet[]; onRetirer: (e: ElementCarnet) => void }) {
  /* Le mode mémorisation masque les passages : on se les récite, puis on clique pour vérifier. */
  const [masque, setMasque] = useState(false);
  const [vus, setVus] = useState<Set<string>>(new Set());
  if (!liste.length) {
    return <p className="ca-vide">Aucun passage mémorisé. Sélectionnez une phrase ou un paragraphe sur le site, puis « Mémoriser » : il arrive ici, avec sa source.</p>;
  }
  return (
    <>
      <div className="ca-barre">
        <button type="button" className="ca-btn ca-btn-2" onClick={() => { setMasque((m) => !m); setVus(new Set()); }}>
          {masque ? <Eye size={14} aria-hidden="true" /> : <EyeOff size={14} aria-hidden="true" />} {masque ? "Tout afficher" : "Mode mémorisation"}
        </button>
        <span className="ca-n">{liste.length} passage{liste.length > 1 ? "s" : ""}</span>
      </div>
      <ul className="ca-passages">
        {liste.map((e) => {
          const cache = masque && !vus.has(e.id);
          return (
            <li key={e.id} className="ca-passage">
              <blockquote
                className={cache ? "ca-cache" : undefined}
                onClick={() => cache && setVus((s) => new Set(s).add(e.id))}
                title={cache ? "Cliquez pour vérifier" : undefined}
              >
                {e.texte}
              </blockquote>
              {e.traduction && !cache && <span className="ca-note" lang={e.langue}>{e.traduction}</span>}
              <span className="ca-carte-pied">
                {e.source_url && <a href={e.source_url}>{e.source_titre ?? "Source"}</a>}
                <span>· {date(e.cree_le)}</span>
                <button type="button" className="ca-retirer" onClick={() => onRetirer(e)} aria-label="Retirer ce passage"><Trash2 size={14} /></button>
              </span>
            </li>
          );
        })}
      </ul>
    </>
  );
}
