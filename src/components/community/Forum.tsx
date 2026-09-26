"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FILS, TAGS, type Fil } from "@/data/community/fils";
import { ilYA, scoreFil, useForum, type Compte, type Message } from "./store";

/* ═══════════════════════════════════════════════════════════════════════════
   LE FORUM

   Une liste de fils à gauche, le fil ouvert à droite. On vote, on répond, on
   répond à une réponse. Rien ne recharge la page.
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
    <div className={`fo-votes${compact ? " fo-votes-c" : ""}`}>
      <button
        type="button"
        onClick={() => onVote(1)}
        className={`fo-fleche${mien === 1 ? " fo-fleche-on" : ""}`}
        aria-label="D'accord"
      >
        <svg width="13" height="11" viewBox="0 0 13 11" aria-hidden="true">
          <path d="M6.5 0 L13 11 L0 11 Z" fill="currentColor" />
        </svg>
      </button>
      <span className={`fo-score${mien === 1 ? " fo-score-up" : mien === -1 ? " fo-score-down" : ""}`}>{score}</span>
      <button
        type="button"
        onClick={() => onVote(-1)}
        className={`fo-fleche fo-fleche-bas${mien === -1 ? " fo-fleche-on-bas" : ""}`}
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

  /* Sans compte, on ne montre pas un champ qui refusera : on montre la
     porte d'entrée. */
  if (!compte) {
    return (
      <div className="fo-invite">
        <p className="fo-invite-t">Pour écrire ici, il faut un compte.</p>
        <p className="fo-invite-p">
          Un pseudo, une adresse, et c&apos;est tout. Vos messages restent attachés à ce pseudo,
          pas à votre nom.
        </p>
        <div className="fo-invite-actions">
          <Link href="/compte/connexion" className="fo-btn fo-btn-plein">
            Se connecter
          </Link>
          <Link href="/compte/connexion?mode=inscription" className="fo-btn fo-btn-fantome">
            Créer un compte
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      className="fo-repondre"
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
        className="fo-source"
        value={source}
        onChange={(e) => setSource(e.target.value)}
        placeholder="Une source à l'appui (facultatif) : insee.fr, banque-france.fr…"
        aria-label="Une source à l'appui"
      />
      {erreur && <p className="fo-erreur">{erreur}</p>}
      <div className="fo-repondre-pied">
        <span className="fo-signe">
          Vous publiez en tant que <strong>{compte.pseudo}</strong>
        </span>
        <span className="fo-astuce">⌘ + entrée</span>
        {onAnnuler && (
          <button type="button" className="fo-btn fo-btn-fantome" onClick={onAnnuler}>
            Annuler
          </button>
        )}
        <button type="submit" className="fo-btn fo-btn-plein" disabled={!texte.trim() || envoi}>
          {envoi ? "Envoi…" : "Publier"}
        </button>
      </div>
    </form>
  );
}

/* ── Le signalement ──────────────────────────────────────────────────────
   Un message publié doit pouvoir être contesté sans passer par nous : c'est
   ce que demande la loi à tout hébergeur de propos, et c'est de toute façon
   la seule façon de tenir un fil. */

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
    return <p className="fo-signal-fait">Signalement transmis. Merci.</p>;
  }

  return (
    <form
      className="fo-signal"
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
        value={detail}
        onChange={(e) => setDetail(e.target.value)}
        placeholder="Précisez (facultatif)"
        maxLength={500}
        aria-label="Précision"
      />
      {erreur && <span className="fo-erreur">{erreur}</span>}
      <button type="submit" className="fo-btn fo-btn-plein" disabled={etat === "envoi"}>
        Envoyer
      </button>
      <button type="button" className="fo-btn fo-btn-fantome" onClick={onFermer}>
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
      className="fo-msg"
      style={{ marginLeft: niveau ? 22 : 0 }}
    >
      <div className="fo-msg-corps">
        <Votes
          score={m.votes}
          mien={votes[`msg:${m.id}`]}
          onVote={(s) => onVote(`msg:${m.id}`, s)}
          compact
        />
        <div style={{ minWidth: 0, flex: 1 }}>
          <p className="fo-msg-tete">
            <strong>{m.auteur}</strong>
            {mien && <span className="fo-moi">vous</span>}
            <span>·</span>
            <span>{ilYA(m.cree)}</span>
          </p>
          <p className="fo-msg-texte">{m.texte}</p>
          {m.source && (
            <p className="fo-msg-source">
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
          <div className="fo-msg-actions">
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
          {signale && (
            <Signaler
              onSignaler={(motif, detail) => onSignaler(m.id, motif, detail)}
              onFermer={() => setSignale(false)}
            />
          )}
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

      {/* Deux niveaux d'indentation suffisent : au-delà, le fil devient une
          colonne d'un caractère de large. Les réponses profondes restent au
          même cran. */}
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

export function Forum() {
  const { etat, pret, erreur, actif, compte, poster, supprimer, voter, signaler } = useForum();
  const [ouvert, setOuvert] = useState<string>(FILS[0].id);
  const [tri, setTri] = useState<"actifs" | "recents">("actifs");
  const [tag, setTag] = useState<string | null>(null);
  const [repondA, setRepondA] = useState<string | null>(null);

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

  /* Les messages rangés par parent, triés par score puis par ancienneté. */
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
    <div className="fo">
      {/* ── L'entête ──────────────────────────────────────────────────────── */}
      <header className="fo-hero">
        <div className="fo-wrap">
          <p className="fo-eyebrow">
            <span className="fo-pulse" aria-hidden="true" />
            Community
          </p>
          <h1 className="fo-titre">
            Le forum de <span>la donnée</span>.
          </h1>
          <p className="fo-chapo">
            Des fils ouverts sur des chiffres publiés. On discute, on conteste, on apporte une
            source — et on peut aller vérifier sur la carte dans la seconde.
          </p>
          <p className="fo-compte">
            {compte ? (
              <>
                Connecté comme <strong>{compte.pseudo}</strong>.{" "}
                <Link href="/compte">Mon espace</Link>
              </>
            ) : (
              <>
                <Link href="/compte/connexion">Se connecter</Link> pour écrire et voter.
              </>
            )}
          </p>
          <div className="fo-stats">
            <span>
              <strong>{FILS.length}</strong> fils
            </span>
            <span>
              <strong>{pret ? etat.messages.length : 0}</strong> messages
            </span>
            <span>
              <strong>{TAGS.length}</strong> sujets
            </span>
          </div>
        </div>
      </header>

      {!actif && (
        <div className="fo-wrap">
          <p className="fo-alerte">
            Les comptes ne sont pas branchés sur cette copie du site : le forum est en lecture
            seule.
          </p>
        </div>
      )}
      {erreur && (
        <div className="fo-wrap">
          <p className="fo-alerte">{erreur}</p>
        </div>
      )}

      <div className="fo-wrap fo-corps">
        {/* ── La colonne des fils ─────────────────────────────────────────── */}
        <aside className="fo-liste">
          <div className="fo-barre">
            <div className="fo-tri">
              <button type="button" className={tri === "actifs" ? "on" : ""} onClick={() => setTri("actifs")}>
                Actifs
              </button>
              <button type="button" className={tri === "recents" ? "on" : ""} onClick={() => setTri("recents")}>
                Récents
              </button>
            </div>
          </div>

          <div className="fo-tags">
            <button type="button" className={tag === null ? "on" : ""} onClick={() => setTag(null)}>
              Tout
            </button>
            {TAGS.map((t) => (
              <button key={t} type="button" className={tag === t ? "on" : ""} onClick={() => setTag(tag === t ? null : t)}>
                {t}
              </button>
            ))}
          </div>

          <motion.ul layout className="fo-fils">
            {liste.map((f) => (
              <motion.li key={f.id} layout transition={{ type: "spring", stiffness: 420, damping: 38 }}>
                <button
                  type="button"
                  onClick={() => {
                    setOuvert(f.id);
                    setRepondA(null);
                  }}
                  className={`fo-fil${f.id === ouvert ? " fo-fil-on" : ""}`}
                >
                  <span className="fo-fil-tete">
                    <span className="fo-fil-theme">{f.themeLabel}</span>
                    {f.epingle && <span className="fo-fil-epingle">épinglé</span>}
                    <span className="fo-fil-ancre">{f.ancre.valeur}</span>
                  </span>
                  <span className="fo-fil-titre">{f.titre}</span>
                  <span className="fo-fil-pied">
                    {nbMessages.get(f.id) ?? 0} message{(nbMessages.get(f.id) ?? 0) > 1 ? "s" : ""}
                    <span> · {f.tags[0]}</span>
                  </span>
                </button>
              </motion.li>
            ))}
          </motion.ul>
        </aside>

        {/* ── Le fil ouvert ───────────────────────────────────────────────── */}
        <main className="fo-panneau">
          <AnimatePresence mode="wait">
            <motion.div
              key={fil.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              <article className="fo-ouverture">
                <div className="fo-ouverture-tete">
                  <Votes
                    score={scoreFil(etat, fil.id)}
                    mien={etat.votes[`fil:${fil.id}`]}
                    onVote={(s) => void voter(`fil:${fil.id}`, s)}
                  />
                  <div style={{ minWidth: 0 }}>
                    <p className="fo-meta">
                      <span className="fo-fil-theme">{fil.themeLabel}</span>
                      <span>ouvert par la rédaction</span>
                      <span>·</span>
                      <span>{new Date(fil.ouvertLe).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}</span>
                    </p>
                    <h2 className="fo-ouverture-titre">{fil.titre}</h2>
                  </div>
                </div>

                <div className="fo-ancre">
                  <strong>{fil.ancre.valeur}</strong>
                  <span>{fil.ancre.libelle}</span>
                  <em>{fil.ancre.source}</em>
                </div>

                {fil.corps.map((p) => (
                  <p key={p} className="fo-para">
                    {p}
                  </p>
                ))}

                <div className="fo-angles">
                  <p className="fo-angles-t">Trois angles pour démarrer</p>
                  <ul>
                    {fil.angles.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </div>

                <div className="fo-liens">
                  <Link href={`/articles/${fil.article.slug}`} className="fo-lien">
                    Lire l&apos;article →
                  </Link>
                  {fil.carte && (
                    <Link href={fil.carte} className="fo-lien fo-lien-doux">
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

              <div className="fo-messages">
                <p className="fo-messages-t">
                  {racines.length === 0
                    ? "Aucun message pour l'instant. Ouvrez le fil."
                    : `${messages.length} message${messages.length > 1 ? "s" : ""}`}
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

              <p className="fo-note">
                Les messages sont publics et rattachés à un pseudo. Vous pouvez effacer les vôtres
                à tout moment, et signaler ceux des autres. Les fils ne sont pas relus avant
                publication : ils le sont après, sur signalement.
              </p>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
