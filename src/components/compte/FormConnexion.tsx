"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { connecter, inscrire, type Retour } from "@/app/compte/actions";
import { IDENTIFIANT_MOTIF } from "@/lib/supabase/identifiant";

const DEPART: Retour = {};

export function FormConnexion({ mode }: { mode: "connexion" | "inscription" }) {
  const [onglet, setOnglet] = useState<"connexion" | "inscription">(mode);
  const [etatC, actionC, enCoursC] = useActionState(connecter, DEPART);
  const [etatI, actionI, enCoursI] = useActionState(inscrire, DEPART);

  const inscription = onglet === "inscription";
  const etat = inscription ? etatI : etatC;
  const enCours = inscription ? enCoursI : enCoursC;

  return (
    <div className="cp-carte">
      <div className="cp-onglets" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={!inscription}
          className={!inscription ? "on" : ""}
          onClick={() => setOnglet("connexion")}
        >
          Se connecter
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={inscription}
          className={inscription ? "on" : ""}
          onClick={() => setOnglet("inscription")}
        >
          Créer un compte
        </button>
      </div>

      <form action={inscription ? actionI : actionC} className="cp-form" key={onglet}>
        <label className="cp-champ">
          <span>Identifiant</span>
          <input
            name="identifiant"
            type="text"
            required
            minLength={3}
            maxLength={24}
            pattern={IDENTIFIANT_MOTIF}
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            placeholder={inscription ? "celui qui s'affichera sur vos messages" : "votre identifiant"}
          />
          {inscription && (
            <em>
              Lettres, chiffres, tiret et souligné, de 3 à 24 caractères. Aucune adresse
              électronique n&apos;est demandée : gardez ce mot-là, il ne pourra pas vous être
              renvoyé.
            </em>
          )}
        </label>

        <label className="cp-champ">
          <span>Mot de passe</span>
          <input
            name="motDePasse"
            type="password"
            required
            minLength={8}
            autoComplete={inscription ? "new-password" : "current-password"}
            placeholder="8 caractères au minimum"
          />
        </label>

        {etat.erreur && <p className="cp-erreur">{etat.erreur}</p>}
        {etat.message && <p className="cp-ok">{etat.message}</p>}

        <button type="submit" className="cp-envoi" disabled={enCours}>
          {enCours ? "Un instant…" : inscription ? "Créer mon compte" : "Se connecter"}
        </button>
      </form>

      <p className="cp-legal">
        En créant un compte, vous acceptez que vos messages soient publics et rattachés à votre
        pseudo. Vous pouvez les effacer et fermer votre compte à tout moment.{" "}
        <Link href="/community">Retour au forum</Link>
      </p>
    </div>
  );
}
