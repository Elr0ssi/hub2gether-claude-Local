import type { Metadata } from "next";
import { EnTete } from "@/components/concept/pieces";
import "@/components/concept/concept.css";
import "@/components/legal/legal.css";

export const metadata: Metadata = {
  title: { absolute: "Page introuvable | Visualize" },
  robots: { index: false, follow: true },
};

/* La page 404 : un message court et trois portes de sortie, plutôt qu'une
   impasse. */
export default function NotFound() {
  return (
    <div className="cg lg">
      <EnTete />
      <main className="lg-col lg-404">
        <p className="lg-404-n">404</p>
        <h1 className="lg-h1">Cette page n&apos;existe pas.</h1>
        <p className="lg-404-t">Le lien est peut-être ancien. Voici où aller :</p>
        <div className="lg-404-l">
          <a href="/economie">Économie</a>
          <a href="/demographie">Démographie</a>
          <a href="/">Accueil</a>
        </div>
      </main>
    </div>
  );
}
