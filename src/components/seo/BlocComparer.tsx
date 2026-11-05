import Link from "next/link";
import { Faq, JsonLd, schemaFaq } from "./Elements";
import { paysVedettes, slugPaire } from "@/data/seo/pays";
import { cap } from "@/data/seo/francais";
import type { QR } from "@/data/seo/textes";
import "./seo.css";

export const FAQ_COMPARER: QR[] = [
  {
    q: "Comment comparer deux pays sur Visualize ?",
    r: "Choisissez jusqu'à quatre pays, puis un indicateur : PIB, PIB par habitant, population, dette publique, inflation, chômage, natalité, mortalité… Les barres montrent l'année choisie, la courbe montre l'évolution depuis 1960, et un curseur permet de remonter le temps.",
  },
  {
    q: "Quels indicateurs peut-on comparer ?",
    r: "Côté économie : PIB, PIB par habitant, balance commerciale, inflation, dette publique rapportée au PIB et chômage. Côté démographie : population, natalité, mortalité, accroissement naturel, solde migratoire, naissances et décès. D'autres catégories, comme les ressources, arriveront.",
  },
  {
    q: "D'où viennent les données ?",
    r: "Elles viennent de sources publiques : la Banque mondiale (World Development Indicators), le FMI et les Nations Unies (World Population Prospects 2024). Chaque valeur garde son année, et une donnée absente reste absente : elle n'est jamais comptée pour zéro.",
  },
  {
    q: "Que signifie « base 100 » sur la courbe ?",
    r: "En base 100, chaque pays part de 100 à la première année : une courbe à 300 a triplé. Cela permet de comparer la vitesse de croissance de pays de tailles très différentes.",
  },
  {
    q: "Pourquoi utiliser une échelle logarithmique ?",
    r: "Sur une échelle logarithmique, chaque graduation multiplie la valeur par dix. Les petits pays restent lisibles à côté des géants, et une pente plus raide signifie une croissance plus rapide.",
  },
  {
    q: "Peut-on partager une comparaison ?",
    r: "Oui. Le bouton Partager copie une adresse qui contient les pays, l'indicateur et l'année : la personne qui l'ouvre voit exactement la même comparaison.",
  },
];

/** Sous le comparateur : les comparaisons les plus cherchées et les questions fréquentes. */
export function BlocComparer() {
  const v = paysVedettes(10);
  const paires: [typeof v[number], typeof v[number]][] = [];
  for (let i = 0; i < v.length && paires.length < 18; i++) for (let j = i + 1; j < v.length && paires.length < 18; j++) paires.push([v[i], v[j]]);
  return (
    <div className="sg">
      <JsonLd data={[schemaFaq(FAQ_COMPARER)]} />
      <div className="sg-page" style={{ paddingTop: 0 }}>
        <section className="sg-sec" aria-labelledby="sg-pop">
          <h2 id="sg-pop" className="sg-h2">Comparaisons populaires</h2>
          <ul className="sg-liens">
            {paires.map(([a, b]) => (
              <li key={`${a.slug}-${b.slug}`}>
                <Link href={`/comparer/${slugPaire(a, b)}`}>{cap(a.fr)} ou {b.fr}</Link>
              </li>
            ))}
          </ul>
          <p className="sg-note" style={{ marginTop: 18 }}>
            Une page existe pour chaque paire de pays : <Link href="/pays">parcourez tous les pays</Link>.
          </p>
        </section>
        <Faq titre="Questions sur la comparaison" questions={FAQ_COMPARER} />
      </div>
    </div>
  );
}
