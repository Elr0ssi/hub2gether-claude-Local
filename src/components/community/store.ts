"use client";

import { useCallback, useEffect, useState } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   LE STOCKAGE DU FORUM

   Tant qu'il n'y a pas de comptes, un message ne quitte pas le navigateur.
   Ce module l'assume : il persiste dans `localStorage`, il prévient les
   autres onglets ouverts, et il ne fabrique rien.

   Le jour où une base arrive, seule l'implémentation de ces quatre
   fonctions change ; l'interface au-dessus reste la même.
   ═══════════════════════════════════════════════════════════════════════════ */

const CLE = "ted-forum-v1";

export interface Message {
  id: string;
  fil: string;
  /** L'identifiant du message auquel celui-ci répond, ou null à la racine. */
  parent: string | null;
  auteur: string;
  texte: string;
  cree: number;
  votes: number;
}

interface Etat {
  messages: Message[];
  /** Le vote du lecteur, par cible : +1, -1. */
  votes: Record<string, 1 | -1>;
  pseudo: string;
}

const VIDE: Etat = { messages: [], votes: {}, pseudo: "" };

function lire(): Etat {
  try {
    const brut = window.localStorage.getItem(CLE);
    if (!brut) return VIDE;
    const e = JSON.parse(brut) as Partial<Etat>;
    return { messages: e.messages ?? [], votes: e.votes ?? {}, pseudo: e.pseudo ?? "" };
  } catch {
    return VIDE;
  }
}

function ecrire(e: Etat) {
  try {
    window.localStorage.setItem(CLE, JSON.stringify(e));
  } catch {
    /* Navigation privée ou stockage plein : on garde l'état en mémoire. */
  }
}

export function useForum() {
  const [etat, setEtat] = useState<Etat>(VIDE);
  const [pret, setPret] = useState(false);

  useEffect(() => {
    setEtat(lire());
    setPret(true);
    /* Deux onglets ouverts sur le forum restent d'accord entre eux. */
    const sync = (e: StorageEvent) => {
      if (e.key === CLE) setEtat(lire());
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const maj = useCallback((f: (e: Etat) => Etat) => {
    setEtat((e) => {
      const suivant = f(e);
      ecrire(suivant);
      return suivant;
    });
  }, []);

  const poster = useCallback(
    (fil: string, texte: string, parent: string | null, auteur: string) => {
      const propre = texte.trim();
      if (!propre) return;
      maj((e) => ({
        ...e,
        pseudo: auteur || e.pseudo,
        messages: [
          ...e.messages,
          {
            id: `m${Date.now()}${Math.random().toString(36).slice(2, 7)}`,
            fil,
            parent,
            auteur: (auteur || e.pseudo || "Anonyme").slice(0, 40),
            texte: propre.slice(0, 4000),
            cree: Date.now(),
            votes: 0,
          },
        ],
      }));
    },
    [maj]
  );

  const supprimer = useCallback(
    (id: string) => {
      /* On retire le message et tout ce qui lui répond : pas de fil orphelin. */
      maj((e) => {
        const aRetirer = new Set([id]);
        let bouge = true;
        while (bouge) {
          bouge = false;
          for (const m of e.messages) {
            if (m.parent && aRetirer.has(m.parent) && !aRetirer.has(m.id)) {
              aRetirer.add(m.id);
              bouge = true;
            }
          }
        }
        return { ...e, messages: e.messages.filter((m) => !aRetirer.has(m.id)) };
      });
    },
    [maj]
  );

  const voter = useCallback(
    (cible: string, sens: 1 | -1) => {
      maj((e) => {
        const actuel = e.votes[cible];
        const votes = { ...e.votes };
        let delta: number = sens;
        if (actuel === sens) {
          delete votes[cible];
          delta = -sens;
        } else {
          votes[cible] = sens;
          if (actuel) delta = sens * 2;
        }
        return {
          ...e,
          votes,
          messages: e.messages.map((m) => (m.id === cible ? { ...m, votes: m.votes + delta } : m)),
        };
      });
    },
    [maj]
  );

  const setPseudo = useCallback((p: string) => maj((e) => ({ ...e, pseudo: p.slice(0, 40) })), [maj]);

  return { etat, pret, poster, supprimer, voter, setPseudo };
}

/** Le score d'un fil : ses votes propres, plus ceux de ses messages. */
export function scoreFil(etat: { messages: Message[]; votes: Record<string, 1 | -1> }, fil: string) {
  const propre: number = etat.votes[`fil:${fil}`] ?? 0;
  return propre + etat.messages.filter((m) => m.fil === fil).reduce((n, m) => n + m.votes, 0);
}

export function ilYA(t: number): string {
  const s = Math.floor((Date.now() - t) / 1000);
  if (s < 60) return "à l'instant";
  if (s < 3600) return `il y a ${Math.floor(s / 60)} min`;
  if (s < 86400) return `il y a ${Math.floor(s / 3600)} h`;
  return `il y a ${Math.floor(s / 86400)} j`;
}
