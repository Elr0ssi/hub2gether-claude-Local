"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { COMPTES_ACTIFS } from "@/lib/supabase/config";
import { clientNavigateur } from "@/lib/supabase/navigateur";

/* ═══════════════════════════════════════════════════════════════════════════
   LE STOCKAGE DU FORUM

   Les messages vivent maintenant dans la base, et non plus dans le
   navigateur de celui qui les écrit : deux lecteurs se voient.

   Les droits ne sont pas vérifiés ici. Ils le sont dans la base, règle par
   règle : tout le monde lit, seul un compte écrit, et personne n'écrit au
   nom d'un autre. Ce fichier peut donc rester naïf — ce qu'il demanderait
   de trop serait refusé.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface Message {
  id: string;
  fil: string;
  /** L'identifiant du message auquel celui-ci répond, ou null à la racine. */
  parent: string | null;
  auteur: string;
  auteurId: string;
  texte: string;
  source: string | null;
  cree: number;
  votes: number;
}

export interface Compte {
  id: string;
  pseudo: string;
}

interface Etat {
  messages: Message[];
  /** Le vote du lecteur, par cible : +1, -1. */
  votes: Record<string, 1 | -1>;
  /** Le total des voix, par cible. */
  scores: Record<string, number>;
  compte: Compte | null;
}

const VIDE: Etat = { messages: [], votes: {}, scores: {}, compte: null };

/** La ligne telle que la base la rend, avant mise en forme. */
interface Ligne {
  id: string;
  cible_id: string;
  parent_id: string | null;
  auteur: string;
  texte: string;
  source_url: string | null;
  cree_le: string;
  profils: { pseudo: string } | { pseudo: string }[] | null;
}

function pseudoDe(l: Ligne): string {
  const p = Array.isArray(l.profils) ? l.profils[0] : l.profils;
  return p?.pseudo ?? "compte supprimé";
}

function enMessage(l: Ligne, scores: Record<string, number>): Message {
  return {
    id: l.id,
    fil: l.cible_id,
    parent: l.parent_id,
    auteur: pseudoDe(l),
    auteurId: l.auteur,
    texte: l.texte,
    source: l.source_url,
    cree: new Date(l.cree_le).getTime(),
    votes: scores[`msg:${l.id}`] ?? 0,
  };
}

function messageDErreur(brut: string): string {
  const m = brut.toLowerCase();
  if (m.includes("failed to fetch") || m.includes("networkerror") || m.includes("load failed")) {
    return "Le forum est injoignable. Vérifiez votre connexion, puis réessayez.";
  }
  if (m.includes("trop de messages")) return "Trop de messages en peu de temps. Réessayez dans une minute.";
  if (m.includes("limite horaire")) return "Limite horaire atteinte. Réessayez plus tard.";
  if (m.includes("row-level security") || m.includes("violates row-level")) {
    return "Il faut être connecté pour faire cela.";
  }
  if (m.includes("check constraint") && m.includes("source_url")) {
    return "La source doit être une adresse commençant par http.";
  }
  if (m.includes("check constraint")) return "Message vide ou trop long (4 000 caractères au plus).";
  return brut;
}

export function useForum() {
  const [etat, setEtat] = useState<Etat>(VIDE);
  const [pret, setPret] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const sb = useRef(clientNavigateur()).current;

  /* ── La lecture ─────────────────────────────────────────────────────────
     Trois requêtes : les messages avec le pseudo de leur auteur, les totaux
     de voix, et les voix du lecteur. Les deux dernières sont minuscules. */
  const lire = useCallback(async () => {
    if (!sb) return;
    const [{ data: lignes, error }, { data: scoresBruts }, { data: moi }] = await Promise.all([
      sb
        .from("messages")
        .select("id, cible_id, parent_id, auteur, texte, source_url, cree_le, profils(pseudo)")
        .eq("cible_type", "fil")
        .order("cree_le", { ascending: true })
        .limit(2000),
      sb.from("scores").select("cible, score"),
      sb.auth.getUser(),
    ]);


    const scores: Record<string, number> = {};
    for (const s of (scoresBruts ?? []) as { cible: string; score: number }[]) {
      scores[s.cible] = s.score;
    }

    let compte: Compte | null = null;
    const votes: Record<string, 1 | -1> = {};
    if (moi?.user) {
      const [{ data: profil }, { data: mesVoix }] = await Promise.all([
        sb.from("profils").select("id, pseudo").eq("id", moi.user.id).single(),
        sb.from("votes").select("cible, sens"),
      ]);
      if (profil) compte = profil as Compte;
      for (const v of (mesVoix ?? []) as { cible: string; sens: 1 | -1 }[]) votes[v.cible] = v.sens;
    }

    setEtat({
      messages: ((lignes ?? []) as unknown as Ligne[]).map((l) => enMessage(l, scores)),
      votes,
      scores,
      compte,
    });
    setPret(true);
    /* Posée en dernier, jamais avant : un `setErreur` en tête de fonction
       serait effacé par celui-ci quelques lignes plus bas. */
    setErreur(error ? messageDErreur(error.message) : null);
  }, [sb]);

  const charger = useCallback(async () => {
    if (!sb) {
      setPret(true);
      return;
    }
    try {
      await lire();
    } catch {
      /* Base injoignable : on le dit, au lieu de tourner indéfiniment. */
      setErreur("Le forum est momentanément injoignable. Réessayez dans un instant.");
      setPret(true);
    }
  }, [sb, lire]);

  useEffect(() => {
    void charger();
    if (!sb) return;

    /* Une connexion ou une déconnexion change ce qu'on a le droit de faire :
       on relit tout plutôt que de deviner. */
    const { data: ecoute } = sb.auth.onAuthStateChange((evenement: string) => {
      if (evenement === "SIGNED_IN" || evenement === "SIGNED_OUT" || evenement === "USER_UPDATED") {
        void charger();
      }
    });

    /* Le direct : un message posté par quelqu'un d'autre apparaît sans
       rechargement. Le canal ne transporte que le signal « ça a bougé » ;
       la relecture passe par les mêmes règles que le premier chargement. */
    const canal = sb
      .channel("forum")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () => {
        void charger();
      })
      .subscribe();

    return () => {
      ecoute.subscription.unsubscribe();
      void sb.removeChannel(canal);
    };
  }, [sb, charger]);

  /* ── L'écriture ─────────────────────────────────────────────────────── */

  const poster = useCallback(
    async (fil: string, texte: string, parent: string | null, source?: string | null) => {
      const propre = texte.trim();
      if (!sb || !propre) return null;
      const { data: moi } = await sb.auth.getUser();
      if (!moi.user) return "Il faut être connecté pour publier.";

      const { error } = await sb.from("messages").insert({
        cible_type: "fil",
        cible_id: fil,
        parent_id: parent,
        auteur: moi.user.id,
        texte: propre.slice(0, 4000),
        source_url: source?.trim() || null,
      });
      if (error) return messageDErreur(error.message);
      await charger();
      return null;
    },
    [sb, charger]
  );

  const supprimer = useCallback(
    async (id: string) => {
      if (!sb) return null;
      /* Les réponses partent avec : la base porte la cascade, il n'y a pas
         de fil orphelin à nettoyer ici. */
      const { error } = await sb.from("messages").delete().eq("id", id);
      if (error) return messageDErreur(error.message);
      await charger();
      return null;
    },
    [sb, charger]
  );

  const voter = useCallback(
    async (cible: string, sens: 1 | -1) => {
      if (!sb) return null;
      const { data: moi } = await sb.auth.getUser();
      if (!moi.user) return "Il faut être connecté pour voter.";

      const actuel = etat.votes[cible];
      const { error } =
        actuel === sens
          ? await sb.from("votes").delete().eq("cible", cible).eq("auteur", moi.user.id)
          : await sb
              .from("votes")
              .upsert({ cible, auteur: moi.user.id, sens }, { onConflict: "cible,auteur" });
      if (error) return messageDErreur(error.message);
      await charger();
      return null;
    },
    [sb, charger, etat.votes]
  );

  const signaler = useCallback(
    async (messageId: string, motif: string, detail: string) => {
      if (!sb) return null;
      const { data: moi } = await sb.auth.getUser();
      if (!moi.user) return "Il faut être connecté pour signaler un message.";

      const { error } = await sb.from("signalements").insert({
        message_id: messageId,
        auteur: moi.user.id,
        motif,
        detail: detail.trim() || null,
      });
      if (error) {
        if (error.code === "23505") return "Vous avez déjà signalé ce message.";
        return messageDErreur(error.message);
      }
      return null;
    },
    [sb]
  );

  return {
    etat,
    pret,
    erreur,
    actif: COMPTES_ACTIFS,
    compte: etat.compte,
    poster,
    supprimer,
    voter,
    signaler,
    recharger: charger,
  };
}

/** Le score d'un fil : ses voix propres, plus celles de ses messages. */
export function scoreFil(etat: { messages: Message[]; scores: Record<string, number> }, fil: string) {
  const propre = etat.scores[`fil:${fil}`] ?? 0;
  return propre + etat.messages.filter((m) => m.fil === fil).reduce((n, m) => n + m.votes, 0);
}

export function ilYA(t: number): string {
  const s = Math.floor((Date.now() - t) / 1000);
  if (s < 60) return "à l'instant";
  if (s < 3600) return `il y a ${Math.floor(s / 60)} min`;
  if (s < 86400) return `il y a ${Math.floor(s / 3600)} h`;
  return `il y a ${Math.floor(s / 86400)} j`;
}
