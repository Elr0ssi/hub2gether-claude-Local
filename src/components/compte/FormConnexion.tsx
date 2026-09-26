"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { connecter, inscrire, type Retour } from "@/app/compte/actions";
import { clientNavigateur } from "@/lib/supabase/navigateur";

const DEPART: Retour = {};

export function FormConnexion({ mode }: { mode: "connexion" | "inscription" }) {
  const [onglet, setOnglet] = useState<"connexion" | "inscription">(mode);
  const [etatC, actionC, enCoursC] = useActionState(connecter, DEPART);
  const [etatI, actionI, enCoursI] = useActionState(inscrire, DEPART);
  const [google, setGoogle] = useState(false);

  const inscription = onglet === "inscription";
  const etat = inscription ? etatI : etatC;
  const enCours = inscription ? enCoursI : enCoursC;

  /* La bascule vers Google se fait entièrement dans le navigateur : c'est
     lui qui doit atterrir sur l'écran de Google, une action serveur ne peut
     pas rediriger un onglet ailleurs que sur ce site. */
  async function continuerAvecGoogle() {
    const sb = clientNavigateur();
    if (!sb) return;
    setGoogle(true);
    const { error } = await sb.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/compte/callback` },
    });
    if (error) setGoogle(false);
  }

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

      <div className="cp-separateur" role="separator">
        <span>ou</span>
      </div>

      <button type="button" className="cp-google" onClick={continuerAvecGoogle} disabled={google}>
        <svg viewBox="0 0 18 18" aria-hidden="true" width="18" height="18">
          <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.56 2.7-3.87 2.7-6.62Z" />
          <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.81.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.95v2.33A9 9 0 0 0 9 18Z" />
          <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.95A9 9 0 0 0 0 9c0 1.45.35 2.83.95 4.03l3-2.33Z" />
          <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .95 4.97l3 2.33C4.66 5.17 6.65 3.58 9 3.58Z" />
        </svg>
        {google ? "Redirection…" : "Continuer avec Google"}
      </button>

      <p className="cp-legal">
        En créant un compte, vous acceptez que vos messages soient publics et rattachés à votre
        pseudo. Vous pouvez les effacer et fermer votre compte à tout moment.{" "}
        <Link href="/community">Retour au forum</Link>
      </p>
    </div>
  );
}
