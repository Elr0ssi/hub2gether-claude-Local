import type { Metadata } from "next";
import { EnTete, Pied } from "@/components/concept/pieces";
import { Carnet } from "@/components/apprentissage/Carnet";
import { lireCarnetCompte } from "@/app/compte/carnet-actions";
import { lireCompte } from "@/lib/supabase/serveur";
import "@/components/concept/concept.css";

export const metadata: Metadata = {
  title: "Mon carnet",
  description: "Vos traductions à réviser et vos passages mémorisés.",
  alternates: { canonical: "/carnet" },
  robots: { index: false, follow: false },
};

/* La page dépend de la session (le carnet du compte) : elle n'est pas figée à la construction. */
export const dynamic = "force-dynamic";

export default async function Page() {
  const compte = await lireCompte().catch(() => null);
  const elements = compte ? await lireCarnetCompte() : [];
  return (
    <div className="cg">
      <EnTete />
      <main className="ca-page">
        <h1 className="ca-h1">Mon carnet</h1>
        <p className="ca-intro">
          Sélectionnez un mot, une phrase ou un passage n’importe où sur Datlas : traduisez-le en anglais et gardez la traduction pour
          la réviser, ou mémorisez le passage. Les cartes reviennent de plus en plus espacées à mesure que vous les savez.
        </p>
        <Carnet compte={elements} connecte={Boolean(compte)} />
      </main>
      <Pied />
    </div>
  );
}
