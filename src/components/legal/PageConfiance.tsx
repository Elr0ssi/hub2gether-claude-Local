import { EnTete, Pied } from "@/components/concept/pieces";
import "@/components/concept/concept.css";
import "./legal.css";

/* Les pages de confiance (à propos, méthode, sources) dans l'habillage du site :
   même en-tête, même pied, mêmes couleurs que le reste. Le contenu garde les
   classes `hub-*` ; legal.css les relie aux couleurs du site. */
export function PageConfiance({ children }: { children: React.ReactNode }) {
  return (
    <div className="cg lg lg-conf">
      <EnTete />
      <main className="lg-conf-col">{children}</main>
      <Pied />
    </div>
  );
}

/* Les lectures plus anciennes : leur mise en page est faite pour un fond clair.
   Elles se posent sur une feuille claire, dans l'en-tête et le pied du site. */
export function PageLecture({ children }: { children: React.ReactNode }) {
  return (
    <div className="cg lg">
      <EnTete />
      <main className="lg-conf-col lg-conf-large">
        <div className="lg-papier">{children}</div>
      </main>
      <Pied />
    </div>
  );
}
