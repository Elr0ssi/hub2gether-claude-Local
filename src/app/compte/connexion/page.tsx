import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { EnTete } from "@/components/concept/pieces";
import { FormConnexion } from "@/components/compte/FormConnexion";
import { COMPTES_ACTIFS } from "@/lib/supabase/config";
import { lireCompte } from "@/lib/supabase/serveur";
import "@/components/concept/concept.css";
import "@/components/compte/connexion.css";

export const metadata: Metadata = {
  title: "Se connecter · Visualize",
  description: "Créez un compte pour écrire dans le forum et répondre aux articles.",
  alternates: { canonical: "/compte/connexion" },
  /* Une page de formulaire n'a rien à faire dans un index. */
  robots: { index: false, follow: true },
};

export default async function ConnexionPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; erreur?: string }>;
}) {
  const { mode, erreur } = await searchParams;
  const compte = COMPTES_ACTIFS ? await lireCompte() : null;
  if (compte) redirect("/compte");

  return (
    <div className="cg cx">
      <EnTete />
      <main className="cx-page">
        <aside className="cx-visuel" aria-hidden="true">
          <span className="cx-lueur" />
          <span className="cx-sph"><i /><b /></span>
          <p className="cx-marque">Visualize</p>
          <h2 className="cx-accroche">
            Les chiffres du monde,
            <br />
            et votre voix.
          </h2>
          <div className="cx-puce cx-puce-1">
            <small>Compteurs</small>
            <strong>En direct</strong>
          </div>
          <div className="cx-puce cx-puce-2">
            <small>Pays suivis</small>
            <strong>200+</strong>
          </div>
          <div className="cx-puce cx-puce-3">
            <small>Historique</small>
            <strong>1960 → 2025</strong>
          </div>
        </aside>

        <section className="cx-droite">
          <div className="cx-bloc">
            <h1 className="cx-h1">Votre espace</h1>
            <p className="cx-chapo">Un pseudo stable pour écrire dans le forum. Rien de plus ne vous est demandé.</p>
            {erreur === "google" && (
              <p className="cp-erreur" style={{ marginBottom: 12 }}>
                La connexion avec Google n&apos;a pas abouti. Réessayez, ou utilisez votre adresse et
                votre mot de passe.
              </p>
            )}
            {COMPTES_ACTIFS ? (
              <FormConnexion mode={mode === "inscription" ? "inscription" : "connexion"} />
            ) : (
              <p className="cp-erreur">Les comptes ne sont pas branchés sur cette copie du site.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
