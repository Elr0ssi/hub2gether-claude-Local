import type { Metadata } from "next";
import Link from "next/link";
import { EnTete, Pied } from "@/components/concept/pieces";
import { Fil, JsonLd, schemaFil } from "@/components/seo/Elements";
import { drapeau } from "@/lib/drapeau";
import { tousLesPays, paysVedettes } from "@/data/seo/pays";
import { SITE_URL, urlAbs } from "@/lib/site";
import "@/components/concept/concept.css";
import "@/components/seo/seo.css";

export const metadata: Metadata = {
  title: { absolute: "Tous les pays du monde : population, PIB, dette, inflation | Visualize" },
  description:
    "La fiche de plus de 200 pays : population, PIB, PIB par habitant, dette, inflation, chômage, superficie. Évolution depuis 1960 et comparaisons.",
  alternates: { canonical: "/pays" },
  openGraph: { type: "website", url: urlAbs("/pays"), title: "Tous les pays du monde en chiffres", description: "Population, PIB, dette, inflation : la fiche de chaque pays." },
};

export default function Page() {
  const pays = [...tousLesPays()].sort((a, b) => a.fr.localeCompare(b.fr, "fr"));
  const groupes = new Map<string, typeof pays>();
  for (const p of pays) {
    const l = p.fr.charAt(0).normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase();
    groupes.set(l, [...(groupes.get(l) ?? []), p]);
  }
  const vedettes = paysVedettes(16);
  return (
    <div className="cg sg">
      <EnTete />
      <JsonLd data={[schemaFil([{ label: "Accueil", url: SITE_URL }, { label: "Pays", url: urlAbs("/pays") }])]} />
      <main className="sg-page">
        <Fil items={[{ label: "Accueil", href: "/" }, { label: "Pays" }]} />
        <h1 className="sg-h1">Tous les pays <span>en chiffres</span></h1>
        <p className="sg-intro">
          {pays.length} pays et territoires : population, PIB, PIB par habitant, dette publique, inflation, chômage et superficie, avec leur évolution depuis 1960. Choisissez un pays pour sa fiche, ou comparez-en deux.
        </p>
        <div className="sg-cta">
          <Link href="/comparer" className="sg-bouton">Comparer des pays</Link>
          <Link href="/economie" className="sg-bouton sg-bouton-2">Voir le globe</Link>
        </div>

        <section className="sg-sec" aria-labelledby="sg-v">
          <h2 id="sg-v" className="sg-h2">Les plus consultés</h2>
          <ul className="sg-liens">
            {vedettes.map((p) => (
              <li key={p.slug}><Link href={`/pays/${p.slug}`}>{drapeau(p.iso2)} {p.fr}</Link></li>
            ))}
          </ul>
        </section>

        <section className="sg-sec" aria-labelledby="sg-a">
          <h2 id="sg-a" className="sg-h2">Par ordre alphabétique</h2>
          {[...groupes.entries()].map(([l, liste]) => (
            <div key={l}>
              <h3 className="sg-lettre">{l}</h3>
              <ul className="sg-index">
                {liste.map((p) => (
                  <li key={p.slug}><Link href={`/pays/${p.slug}`}>{drapeau(p.iso2)} {p.fr}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </main>
      <Pied />
    </div>
  );
}
