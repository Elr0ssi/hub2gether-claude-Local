import { EnTete, Pied } from "@/components/concept/pieces";
import "@/components/concept/concept.css";
import "./legal.css";

/* Une page de texte juridique, dans l'habillage du site : un titre, une date,
   des sections numérotées. Le texte reste du HTML ordinaire, lisible sans
   JavaScript. */
export function PageLegale({
  titre,
  maj,
  sections,
}: {
  titre: string;
  maj: string;
  sections: { titre: string; paragraphes: string[] }[];
}) {
  return (
    <div className="cg lg">
      <EnTete />
      <main className="lg-col">
        <p className="lg-maj">Dernière mise à jour : {maj}</p>
        <h1 className="lg-h1">{titre}</h1>
        {sections.map((s, i) => (
          <section key={s.titre} className="lg-sec">
            <h2>
              <span>{String(i + 1).padStart(2, "0")}</span>
              {s.titre}
            </h2>
            {s.paragraphes.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>
        ))}
      </main>
      <Pied />
    </div>
  );
}
