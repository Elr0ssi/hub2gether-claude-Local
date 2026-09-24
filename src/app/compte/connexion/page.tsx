import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FormConnexion } from "@/components/compte/FormConnexion";
import { COMPTES_ACTIFS } from "@/lib/supabase/config";
import { lireCompte } from "@/lib/supabase/serveur";

export const metadata: Metadata = {
  title: "Se connecter · The Essential Data",
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
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Navbar />
      <main style={{ paddingTop: "var(--navbar-height)" }}>
        <div className="cp cp-etroit">
          <h1 className="cp-h1">Votre espace</h1>
          <p className="cp-chapo">
            Un compte sert à une chose : parler sous un nom stable, pour que vos messages puissent
            être suivis, contestés et corrigés. Rien de plus ne vous est demandé.
          </p>
          {erreur === "google" && (
            <p className="cp-erreur" style={{ marginBottom: 16 }}>
              La connexion avec Google n&apos;a pas abouti. Réessayez, ou utilisez votre adresse et
              votre mot de passe.
            </p>
          )}
          {COMPTES_ACTIFS ? (
            <FormConnexion mode={mode === "inscription" ? "inscription" : "connexion"} />
          ) : (
            <p className="cp-erreur">
              Les comptes ne sont pas branchés sur cette copie du site.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
