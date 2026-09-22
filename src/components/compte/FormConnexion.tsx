"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { connecter, inscrire, type Retour } from "@/app/compte/actions";

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
        {inscription && (
          <label className="cp-champ">
            <span>Pseudo</span>
            <input
              name="pseudo"
              type="text"
              required
              minLength={3}
              maxLength={24}
              pattern="[A-Za-z0-9_\-]{3,24}"
              autoComplete="username"
              placeholder="celui qui s'affichera sur vos messages"
            />
            <em>Lettres, chiffres, tiret et souligné. Votre nom réel n&apos;est jamais demandé.</em>
          </label>
        )}

        <label className="cp-champ">
          <span>Adresse électronique</span>
          <input name="email" type="email" required autoComplete="email" placeholder="vous@exemple.fr" />
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
