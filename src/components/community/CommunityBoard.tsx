"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { DEBATS, TAGS_EN_VOGUE, type Debat } from "@/data/community/debates";

/* ═══════════════════════════════════════════════════════════════════════════
   COMMUNITY

   Un débat par carte, ancré sur un chiffre de la base et sur l'article qui
   le documente. Le lecteur prend position, voit la répartition, et peut
   aller vérifier sur la carte.

   Le point sur lequel il ne faut pas mentir : tant qu'il n'y a pas de
   comptes, un vote ne quitte pas le navigateur. On ne fabrique donc aucun
   compteur de participation — la page affiche les positions de ce
   navigateur, et elle l'écrit noir sur blanc.
   ═══════════════════════════════════════════════════════════════════════════ */

const CLE = "ted-community-votes";
const EASE = [0.16, 1, 0.3, 1] as const;

type Votes = Record<string, string>;

function lire(): Votes {
  try {
    const brut = window.localStorage.getItem(CLE);
    return brut ? (JSON.parse(brut) as Votes) : {};
  } catch {
    return {};
  }
}

function ecrire(v: Votes) {
  try {
    window.localStorage.setItem(CLE, JSON.stringify(v));
  } catch {
    /* Navigation privée, stockage bloqué : le vote reste en mémoire. */
  }
}

/* ── Une carte de débat ──────────────────────────────────────────────────── */

function Carte({
  debat,
  choix,
  onVote,
  index,
}: {
  debat: Debat;
  choix?: string;
  onVote: (positionId: string) => void;
  index: number;
}) {
  const repondu = Boolean(choix);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3), ease: EASE }}
      className={`comm-carte${debat.epingle ? " comm-carte-epinglee" : ""}`}
    >
      <div className="comm-carte-tete">
        <span className="comm-chip">{debat.tags[0]}</span>
        {debat.epingle && <span className="comm-chip comm-chip-vif">Sujet de la semaine</span>}
        <span className="comm-ancre">
          <strong>{debat.ancre.valeur}</strong>
          <span>{debat.ancre.libelle}</span>
        </span>
      </div>

      <h3 className="comm-question">{debat.question}</h3>
      <p className="comm-contexte">{debat.contexte}</p>

      <div className="comm-positions">
        {debat.positions.map((p) => {
          const actif = choix === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onVote(p.id)}
              className={`comm-position${actif ? " comm-position-actif" : ""}`}
              aria-pressed={actif}
            >
              <span className="comm-position-puce" aria-hidden="true" />
              <span>
                <span className="comm-position-label">{p.label}</span>
                <span className="comm-position-ligne">{p.ligne}</span>
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence initial={false}>
        {repondu && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="comm-confirme"
          >
            Position enregistrée sur cet appareil. Vous pouvez en changer à tout moment.
          </motion.p>
        )}
      </AnimatePresence>

      <div className="comm-carte-pied">
        <Link href={`/articles/${debat.article.slug}`} className="comm-lien">
          Lire l&apos;article →
        </Link>
        {debat.carte && (
          <Link href={debat.carte} className="comm-lien comm-lien-doux">
            Vérifier sur la carte
          </Link>
        )}
        <span className="comm-source">{debat.ancre.source}</span>
      </div>
    </motion.article>
  );
}

/* ── La page ─────────────────────────────────────────────────────────────── */

export function CommunityBoard() {
  const [votes, setVotes] = useState<Votes>({});
  const [tag, setTag] = useState<string | null>(null);
  const [monte, setMonte] = useState(false);

  useEffect(() => {
    setVotes(lire());
    setMonte(true);
  }, []);

  const voter = useCallback((debatId: string, positionId: string) => {
    setVotes((v) => {
      /* Recliquer sa propre position la retire : on ne piège personne dans
         un choix fait par erreur. */
      const suivant = { ...v };
      if (suivant[debatId] === positionId) delete suivant[debatId];
      else suivant[debatId] = positionId;
      ecrire(suivant);
      return suivant;
    });
  }, []);

  const liste = useMemo(() => {
    const filtres = tag ? DEBATS.filter((d) => d.tags.includes(tag)) : DEBATS;
    return [...filtres].sort((a, b) => Number(Boolean(b.epingle)) - Number(Boolean(a.epingle)));
  }, [tag]);

  const repondus = Object.keys(votes).length;

  return (
    <div className="comm">
      {/* ── L'entête ──────────────────────────────────────────────────── */}
      <header className="comm-hero">
        <div className="comm-wrap">
          <p className="comm-eyebrow">
            <span className="neo-pulse" />
            Community
          </p>
          <h1 className="comm-titre">
            Les chiffres posent la question.
            <br />
            <span>À vous de trancher.</span>
          </h1>
          <p className="comm-chapo">
            Chaque débat part d&apos;une donnée publiée et de l&apos;article qui la documente.
            Prenez position, puis allez vérifier sur la carte.
          </p>

          <div className="comm-compteurs">
            <span>
              <strong>{DEBATS.length}</strong> débats ouverts
            </span>
            <span>
              <strong>{monte ? repondus : 0}</strong> positions prises ici
            </span>
            <span>
              <strong>{TAGS_EN_VOGUE.length}</strong> sujets suivis
            </span>
          </div>
        </div>
      </header>

      {/* ── Les filtres ───────────────────────────────────────────────── */}
      <div className="comm-wrap">
        <div className="comm-filtres" role="group" aria-label="Filtrer par sujet">
          <button
            type="button"
            onClick={() => setTag(null)}
            className={`comm-filtre${tag === null ? " comm-filtre-actif" : ""}`}
          >
            Tout
          </button>
          {TAGS_EN_VOGUE.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTag(tag === t ? null : t)}
              className={`comm-filtre${tag === t ? " comm-filtre-actif" : ""}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Les débats ──────────────────────────────────────────────── */}
        <motion.div layout className="comm-grille">
          <AnimatePresence mode="popLayout">
            {liste.map((d, i) => (
              <Carte key={d.id} debat={d} choix={votes[d.id]} onVote={(p) => voter(d.id, p)} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* ── La note d'honnêteté ─────────────────────────────────────── */}
        <p className="comm-note">
          Les positions que vous prenez restent dans ce navigateur : il n&apos;y a pas encore de
          comptes, donc pas de résultats collectifs. Aucun compteur de participation n&apos;est
          affiché tant qu&apos;il n&apos;y a rien de réel à compter.
        </p>
      </div>
    </div>
  );
}
