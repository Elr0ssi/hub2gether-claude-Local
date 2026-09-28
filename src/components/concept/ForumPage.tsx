"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FILS, TAGS, type Fil } from "@/data/community/fils";
import { ilYA, scoreFil, useForum, type Compte, type Message } from "@/components/community/store";
import { Dessin, Jetons } from "./Jetons";
import { EnTete, Pied, TitreSection } from "./pieces";
import { Loupe } from "./Loupe";
import { Titre, usePret, useProgression, useVu } from "./ouverture";
import "./concept.css";

/* ═══════════════════════════════════════════════════════════════════════════
   LE FORUM DU PROTOTYPE

   Même moteur que /community — les mêmes fils, les mêmes comptes, le même
   vote, la même modération — seulement rhabillé dans la direction
   artistique d'Économie et de Démographie : hero à tuiles, fiches sombres,
   enseignes. Rien n'est réécrit côté données ; seule la présentation
   change.
   ═══════════════════════════════════════════════════════════════════════════ */

const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Les flèches de vote ─────────────────────────────────────────────────── */

function Votes({
  score,
  mien,
  onVote,
  compact,
}: {
  score: number;
  mien?: 1 | -1;
  onVote: (s: 1 | -1) => void;
  compact?: boolean;
}) {
  return (
    <div className={`cg-fo-votes${compact ? " cg-fo-votes-c" : ""}`}>
      <button
        type="button"
        onClick={() => onVote(1)}
        className={`cg-fo-fleche${mien === 1 ? " cg-fo-fleche-on" : ""}`}
        aria-label="D'accord"
      >
        <svg width="13" height="11" viewBox="0 0 13 11" aria-hidden="true">
          <path d="M6.5 0 L13 11 L0 11 Z" fill="currentColor" />
        </svg>
      </button>
      <span className={`cg-fo-score${mien === 1 ? " cg-fo-score-up" : mien === -1 ? " cg-fo-score-down" : ""}`}>{score}</span>
      <button
        type="button"
        onClick={() => onVote(-1)}
        className={`cg-fo-fleche cg-fo-fleche-bas${mien === -1 ? " cg-fo-fleche-on-bas" : ""}`}
        aria-label="Pas d'accord"
      >
        <svg width="13" height="11" viewBox="0 0 13 11" aria-hidden="true">
          <path d="M6.5 11 L0 0 L13 0 Z" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
}

/* ── Le champ de réponse ─────────────────────────────────────────────────── */

function Repondre({
  compte,
  onEnvoyer,
  onAnnuler,
  placeholder,
  auto,
}: {
  compte: Compte | null;
  onEnvoyer: (texte: string, source: string) => Promise<string | null>;
  onAnnuler?: () => void;
  placeholder: string;
  auto?: boolean;
}) {
  const [texte, setTexte] = useState("");
  const [source, setSource] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  if (!compte) {
    return (
      <div className="cg-fo-invite">
        <p className="cg-fo-invite-t">Pour écrire ici, il faut un compte.</p>
        <p className="cg-fo-invite-p">
          Un pseudo, une adresse, et c&apos;est tout. Vos messages restent attachés à ce pseudo, pas à votre nom.
        </p>
        <div className="cg-fo-invite-actions">
          <Link href="/compte/connexion" className="cg-fo-btn-plein">
            Se connecter
          </Link>
          <Link href="/compte/connexion?mode=inscription" className="cg-fo-btn-fantome">
            Créer un compte
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      className="cg-fo-repondre"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!texte.trim() || envoi) return;
        setEnvoi(true);
        setErreur(null);
        const souci = await onEnvoyer(texte, source);
        setEnvoi(false);
        if (souci) {
          setErreur(souci);
          return;
        }
        setTexte("");
        setSource("");
        onAnnuler?.();
      }}
    >
      <textarea
        className="cg-fo-texte"
        value={texte}
        onChange={(e) => setTexte(e.target.value)}
        placeholder={placeholder}
        rows={3}
        autoFocus={auto}
        maxLength={4000}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") e.currentTarget.form?.requestSubmit();
        }}
      />
      <input
        type="url"
        className="cg-filtre"
        value={source}
        onChange={(e) => setSource(e.target.value)}
        placeholder="Une source à l'appui (facultatif) : insee.fr, banque-france.fr…"
        aria-label="Une source à l'appui"
      />
      {erreur && <p className="cg-fo-erreur">{erreur}</p>}
      <div className="cg-fo-repondre-pied">
        <span className="cg-fo-signe">
          Vous publiez en tant que <strong>{compte.pseudo}</strong>
        </span>
        <span className="cg-fo-astuce">⌘ + entrée</span>
        {onAnnuler && (
          <button type="button" className="cg-fo-btn-fantome" onClick={onAnnuler}>
            Annuler
          </button>
        )}
        <button type="submit" className="cg-fo-btn-plein" disabled={!texte.trim() || envoi}>
          {envoi ? "Envoi…" : "Publier"}
        </button>
      </div>
    </form>
  );
}

/* ── Le signalement ──────────────────────────────────────────────────────── */

function Signaler({
  onSignaler,
  onFermer,
}: {
  onSignaler: (motif: string, detail: string) => Promise<string | null>;
  onFermer: () => void;
}) {
  const [motif, setMotif] = useState("illicite");
  const [detail, setDetail] = useState("");
  const [etat, setEtat] = useState<"saisie" | "envoi" | "fait">("saisie");
  const [erreur, setErreur] = useState<string | null>(null);

  if (etat === "fait") {
    return <p className="cg-fo-signal-fait">Signalement transmis. Merci.</p>;
  }

  return (
    <form
      className="cg-fo-signal"
      onSubmit={async (e) => {
        e.preventDefault();
        setEtat("envoi");
        const souci = await onSignaler(motif, detail);
        if (souci) {
          setErreur(souci);
          setEtat("saisie");
          return;
        }
        setEtat("fait");
      }}
    >
      <select value={motif} onChange={(e) => setMotif(e.target.value)} aria-label="Motif">
        <option value="illicite">Contenu illicite</option>
        <option value="haine">Propos haineux</option>
        <option value="spam">Spam ou publicité</option>
        <option value="faux">Chiffre faux ou trompeur</option>
        <option value="autre">Autre</option>
      </select>
      <input
        type="text"
        className="cg-filtre"
        value={detail}
        onChange={(e) => setDetail(e.target.value)}
        placeholder="Précisez (facultatif)"
        maxLength={500}
        aria-label="Précision"
      />
      {erreur && <span className="cg-fo-erreur">{erreur}</span>}
      <button type="submit" className="cg-fo-btn-plein" disabled={etat === "envoi"}>
        Envoyer
      </button>
      <button type="button" className="cg-fo-btn-fantome" onClick={onFermer}>
        Annuler
      </button>
    </form>
  );
}

/* ── Un message et ses réponses ──────────────────────────────────────────── */

function Fil1Message({
  m,
  enfants,
  niveau,
  votes,
  onVote,
  onRepondre,
  onSupprimer,
  onSignaler,
  repondA,
  setRepondA,
  compte,
  poster,
  filId,
}: {
  m: Message;
  enfants: Map<string | null, Message[]>;
  niveau: number;
  votes: Record<string, 1 | -1>;
  onVote: (cible: string, s: 1 | -1) => void;
  onRepondre: (id: string) => void;
  onSupprimer: (id: string) => void;
  onSignaler: (id: string, motif: string, detail: string) => Promise<string | null>;
  repondA: string | null;
  setRepondA: (id: string | null) => void;
  compte: Compte | null;
  poster: (fil: string, texte: string, parent: string | null, source: string) => Promise<string | null>;
  filId: string;
}) {
  const fils = enfants.get(m.id) ?? [];
  const [signale, setSignale] = useState(false);
  const mien = compte?.id === m.auteurId;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="cg-fo-msg"
      style={{ marginLeft: niveau ? 22 : 0 }}
    >
      <div className="cg-fo-msg-corps">
        <Votes score={m.votes} mien={votes[`msg:${m.id}`]} onVote={(s) => onVote(`msg:${m.id}`, s)} compact />
        <div style={{ minWidth: 0, flex: 1 }}>
          <p className="cg-fo-msg-tete">
            <strong>{m.auteur}</strong>
            {mien && <span className="cg-fo-moi">vous</span>}
            <span>·</span>
            <span>{ilYA(m.cree)}</span>
          </p>
          <p className="cg-fo-msg-texte">{m.texte}</p>
          {m.source && (
            <p className="cg-fo-msg-source">
              <a href={m.source} target="_blank" rel="ugc nofollow noopener noreferrer">
                {(() => {
                  try {
                    return new URL(m.source).hostname.replace(/^www\./, "");
                  } catch {
                    return m.source;
                  }
                })()}
              </a>
            </p>
          )}
          <div className="cg-fo-msg-actions">
            <button type="button" onClick={() => onRepondre(m.id)}>
              Répondre
            </button>
            {mien && (
              <button type="button" onClick={() => onSupprimer(m.id)}>
                Supprimer
              </button>
            )}
            {compte && !mien && (
              <button type="button" onClick={() => setSignale((v) => !v)}>
                Signaler
              </button>
            )}
          </div>
          {signale && <Signaler onSignaler={(motif, detail) => onSignaler(m.id, motif, detail)} onFermer={() => setSignale(false)} />}
        </div>
      </div>

      <AnimatePresence>
        {repondA === m.id && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            <Repondre
              auto
              compte={compte}
              placeholder={`Répondre à ${m.auteur}…`}
              onEnvoyer={(t, src) => poster(filId, t, m.id, src)}
              onAnnuler={() => setRepondA(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {fils.map((f) => (
        <Fil1Message
          key={f.id}
          m={f}
          enfants={enfants}
          niveau={Math.min(niveau + 1, 2)}
          votes={votes}
          onVote={onVote}
          onRepondre={onRepondre}
          onSupprimer={onSupprimer}
          onSignaler={onSignaler}
          repondA={repondA}
          setRepondA={setRepondA}
          compte={compte}
          poster={poster}
          filId={filId}
        />
      ))}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LA PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

export function ForumPage() {
  const { etat, pret, erreur, actif, compte, poster, supprimer, voter, signaler } = useForum();
  const [ouvert, setOuvert] = useState<string>(FILS[0].id);
  const [tri, setTri] = useState<"actifs" | "recents">("actifs");
  const [tag, setTag] = useState<string | null>(null);
  const [repondA, setRepondA] = useState<string | null>(null);

  const haut = useVu(260);
  const ouverture = useProgression();
  const prete = usePret();

  const nbMessages = useMemo(() => {
    const c = new Map<string, number>();
    for (const m of etat.messages) c.set(m.fil, (c.get(m.fil) ?? 0) + 1);
    return c;
  }, [etat.messages]);

  const liste = useMemo(() => {
    const base = tag ? FILS.filter((f) => f.tags.includes(tag)) : FILS;
    const trie = [...base].sort((a, b) => {
      if (a.epingle !== b.epingle) return a.epingle ? -1 : 1;
      if (tri === "recents") return b.ouvertLe.localeCompare(a.ouvertLe);
      const da = (nbMessages.get(a.id) ?? 0) * 3 + scoreFil(etat, a.id);
      const db = (nbMessages.get(b.id) ?? 0) * 3 + scoreFil(etat, b.id);
      return db - da;
    });
    return trie;
  }, [tag, tri, nbMessages, etat]);

  const fil: Fil = FILS.find((f) => f.id === ouvert) ?? FILS[0];
  const messages = useMemo(() => etat.messages.filter((m) => m.fil === fil.id), [etat.messages, fil.id]);

  const enfants = useMemo(() => {
    const map = new Map<string | null, Message[]>();
    for (const m of messages) {
      const l = map.get(m.parent) ?? [];
      l.push(m);
      map.set(m.parent, l);
    }
    for (const l of map.values()) l.sort((a, b) => b.votes - a.votes || a.cree - b.cree);
    return map;
  }, [messages]);

  const racines = enfants.get(null) ?? [];

  return (
    <div className="cg cg-eco">
      <EnTete actif="Forum" />
      <Loupe />

      <section
        ref={ouverture as React.RefObject<HTMLElement>}
        className="cg-section cg-eco-haut"
        data-vu={haut.vu ? "1" : "0"}
        data-pret={prete ? "1" : "0"}
      >
        <div className="cg-eco-lueur" aria-hidden="true" />
        <Jetons theme="forum" />
        <div className="cg-wrap">
          <div className="cg-eco-ouv">
            <span className="cg-sceau" aria-hidden="true">
              <span className="cg-sceau-i">
                <Dessin f="bulle" />
              </span>
            </span>
            <h1 className="cg-eco-titre">
              <Titre texte="Forum" />
            </h1>
            <p className="cg-chapo cg-eco-ouv-c">
              {FILS.length} fils ouverts sur des chiffres publiés, {TAGS.length} sujets. On discute, on conteste, on
              apporte une source.
            </p>
          </div>
        </div>
        <div className="cg-arc" aria-hidden="true">
          <span className="cg-arc-corps" />
          <span className="cg-arc-trait" />
          <span className="cg-arc-nappe" />
          <span className="cg-arc-point" />
        </div>
      </section>

      <div ref={haut.ref as React.RefObject<HTMLDivElement>} className="cg-temoin" aria-hidden="true" />

      {(!actif || erreur) && (
        <section className="cg-section" style={{ paddingTop: 0 }}>
          <div className="cg-wrap">
            {!actif && (
              <p className="cg-fo-alerte">
                Les comptes ne sont pas branchés sur cette copie du site : le forum est en lecture seule.
              </p>
            )}
            {erreur && <p className="cg-fo-alerte">{erreur}</p>}
          </div>
        </section>
      )}

      <section className="cg-section cg-eco-globe">
        <div className="cg-wrap">
          <TitreSection
            titre="Les fils du moment"
            sous={
              compte ? (
                <>
                  Connecté comme {compte.pseudo} · <a href="/compte">Mon espace</a>
                </>
              ) : (
                <>
                  <a href="/compte/connexion">Se connecter</a> pour écrire et voter
                </>
              )
            }
          />

          <div className="cg-fo-barre">
            <div className="ge-metriques" role="tablist" aria-label="Tri">
              <button type="button" className={`ge-metrique${tri === "actifs" ? " ge-metrique-on" : ""}`} onClick={() => setTri("actifs")}>
                Actifs
              </button>
              <button type="button" className={`ge-metrique${tri === "recents" ? " ge-metrique-on" : ""}`} onClick={() => setTri("recents")}>
                Récents
              </button>
            </div>
            <div className="cg-fo-tags">
              <button type="button" className={`ge-metrique${tag === null ? " ge-metrique-on" : ""}`} onClick={() => setTag(null)}>
                Tout
              </button>
              {TAGS.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`ge-metrique${tag === t ? " ge-metrique-on" : ""}`}
                  onClick={() => setTag(tag === t ? null : t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="cg-fo-corps">
            <aside className="cg-fo-liste">
              <motion.ul layout className="cg-fo-fils">
                {liste.map((f) => (
                  <motion.li key={f.id} layout transition={{ type: "spring", stiffness: 420, damping: 38 }}>
                    <button
                      type="button"
                      onClick={() => {
                        setOuvert(f.id);
                        setRepondA(null);
                      }}
                      className={`cg-fo-fil${f.id === ouvert ? " cg-fo-fil-on" : ""}`}
                    >
                      <span className="cg-fo-fil-tete">
                        <span className="cg-fo-fil-theme">{f.themeLabel}</span>
                        {f.epingle && <span className="cg-fo-fil-epingle">épinglé</span>}
                        <span className="cg-fo-fil-ancre">{f.ancre.valeur}</span>
                      </span>
                      <span className="cg-fo-fil-titre">{f.titre}</span>
                      <span className="cg-fo-fil-pied">
                        {nbMessages.get(f.id) ?? 0} message{(nbMessages.get(f.id) ?? 0) > 1 ? "s" : ""}
                        <span> · {f.tags[0]}</span>
                      </span>
                    </button>
                  </motion.li>
                ))}
              </motion.ul>
            </aside>

            <div className="cg-fo-panneau">
              <AnimatePresence mode="wait">
                <motion.div
                  key={fil.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, ease: EASE }}
                >
                  <article className="cg-fo-ouverture">
                    <div className="cg-fo-ouverture-tete">
                      <Votes score={scoreFil(etat, fil.id)} mien={etat.votes[`fil:${fil.id}`]} onVote={(s) => void voter(`fil:${fil.id}`, s)} />
                      <div style={{ minWidth: 0 }}>
                        <p className="cg-fo-meta">
                          <span className="cg-fo-fil-theme">{fil.themeLabel}</span>
                          <span>ouvert par la rédaction</span>
                          <span>·</span>
                          <span>{new Date(fil.ouvertLe).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}</span>
                        </p>
                        <h2 className="cg-fo-ouverture-titre">{fil.titre}</h2>
                      </div>
                    </div>

                    <div className="cg-fo-ancre">
                      <strong>{fil.ancre.valeur}</strong>
                      <span>{fil.ancre.libelle}</span>
                      <em>{fil.ancre.source}</em>
                    </div>

                    {fil.corps.map((p) => (
                      <p key={p} className="cg-fo-para">
                        {p}
                      </p>
                    ))}

                    <div className="cg-fo-angles">
                      <p className="cg-fo-angles-t">Trois angles pour démarrer</p>
                      <ul>
                        {fil.angles.map((a) => (
                          <li key={a}>{a}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="cg-fo-liens">
                      <Link href={`/articles/${fil.article.slug}`} className="cg-lien-fleche">
                        Lire l&apos;article <span aria-hidden="true">→</span>
                      </Link>
                      {fil.carte && (
                        <Link href={fil.carte} className="cg-fo-lien-doux">
                          Vérifier sur les données
                        </Link>
                      )}
                    </div>
                  </article>

                  <Repondre
                    compte={compte}
                    placeholder="Votre message. Une source, un contre-exemple, une objection…"
                    onEnvoyer={(t, src) => poster(fil.id, t, null, src)}
                  />

                  <div className="cg-fo-messages">
                    <p className="cg-fo-messages-t">
                      {racines.length === 0 ? "Aucun message pour l'instant. Ouvrez le fil." : `${messages.length} message${messages.length > 1 ? "s" : ""}`}
                    </p>
                    {racines.map((m) => (
                      <Fil1Message
                        key={m.id}
                        m={m}
                        enfants={enfants}
                        niveau={0}
                        votes={etat.votes}
                        onVote={(cible, sens) => void voter(cible, sens)}
                        onRepondre={(id) => setRepondA(repondA === id ? null : id)}
                        onSupprimer={(id) => void supprimer(id)}
                        onSignaler={signaler}
                        repondA={repondA}
                        setRepondA={setRepondA}
                        compte={compte}
                        poster={poster}
                        filId={fil.id}
                      />
                    ))}
                  </div>

                  <p className="cg-fo-note">
                    Les messages sont publics et rattachés à un pseudo. Vous pouvez effacer les vôtres à tout moment,
                    et signaler ceux des autres. Les fils ne sont pas relus avant publication : ils le sont après, sur
                    signalement.
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <p className="cg-fo-total">
            {pret ? etat.messages.length : 0} message{(pret ? etat.messages.length : 0) > 1 ? "s" : ""} au total sur
            les {FILS.length} fils.
          </p>
        </div>
      </section>

      <Pied />
    </div>
  );
}
