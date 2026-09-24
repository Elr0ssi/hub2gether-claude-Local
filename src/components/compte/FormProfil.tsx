"use client";

import { useActionState } from "react";
import { majProfil, type Retour } from "@/app/compte/actions";

const DEPART: Retour = {};

export function FormProfil({ pseudo, bio }: { pseudo: string; bio: string | null }) {
  const [etat, action, enCours] = useActionState(majProfil, DEPART);

  return (
    <form action={action} className="cp-form">
      <label className="cp-champ">
        <span>Nom affiché</span>
        <input
          name="pseudo"
          type="text"
          defaultValue={pseudo}
          required
          minLength={3}
          maxLength={24}
          pattern="[A-Za-z0-9_\-]{3,24}"
        />
        {/* Le nom affiché et l'identifiant de connexion sont deux choses :
            changer le premier ne change pas celui qu'on saisit pour entrer. */}
        <em>C&apos;est le nom sur vos messages. Votre identifiant de connexion ne change pas.</em>
      </label>

      <label className="cp-champ">
        <span>Présentation</span>
        <textarea
          name="bio"
          rows={3}
          maxLength={280}
          defaultValue={bio ?? ""}
          placeholder="Deux lignes sur ce que vous suivez. Facultatif."
        />
      </label>

      {etat.erreur && <p className="cp-erreur">{etat.erreur}</p>}
      {etat.message && <p className="cp-ok">{etat.message}</p>}

      <button type="submit" className="cp-envoi" disabled={enCours}>
        {enCours ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}
