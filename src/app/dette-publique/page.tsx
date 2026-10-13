import type { Metadata } from "next";
import Link from "next/link";
import { EnTete, Pied } from "@/components/concept/pieces";
import { Faq, Fil, JsonLd, schemaFaq, schemaFil } from "@/components/seo/Elements";
import { ClassementDette } from "@/components/dettes/ClassementDette";
import { ANALYSES } from "@/data/dettes/analyses";
import { tousLesDossiers } from "@/data/dettes/dossiers";
import type { QR } from "@/data/dettes/textes";
import { nf } from "@/data/seo/francais";
import { SITE_URL, urlAbs } from "@/lib/site";
import "@/components/concept/concept.css";
import "@/components/seo/seo.css";
import "@/components/dettes/dette-dossier.css";

export const metadata: Metadata = {
  title: { absolute: "Dette publique dans le monde : classement des pays par % du PIB | Visualize" },
  description:
    "Quels pays sont les plus endettés ? Classement de la dette publique de près de 90 pays : montant, poids dans le PIB et évolution depuis 2000, avec une page dédiée à chacun.",
  alternates: { canonical: "/dette-publique" },
  openGraph: { type: "website", url: urlAbs("/dette-publique"), title: "Dette publique dans le monde : le classement", description: "Montant, % du PIB et évolution depuis 2000 pour près de 90 pays." },
};

const FAQ: QR[] = [
  {
    q: "Qu'est-ce que la dette publique ?",
    r: "La dette publique est l'ensemble des emprunts contractés par les administrations publiques d'un pays (État, collectivités locales, organismes de sécurité sociale) et qui n'ont pas encore été remboursés. On l'exprime en montant et, surtout, en pourcentage du produit intérieur brut (PIB).",
  },
  {
    q: "Pourquoi mesure-t-on la dette en pourcentage du PIB ?",
    r: "Parce qu'un montant seul ne dit rien de la capacité à rembourser : 1 000 milliards n'ont pas le même poids pour une économie de 2 000 milliards que pour une économie de 20 000. Le ratio dette/PIB compare la dette à la richesse produite chaque année.",
  },
  {
    q: "Quel pays est le plus endetté du monde ?",
    r: "Dans notre base, c'est le pays dont la dette rapportée au PIB est la plus haute en 2024 : consultez le classement ci-dessus. En montant absolu, ce sont les plus grandes économies (États-Unis, Japon, Chine…) qui portent les dettes les plus lourdes.",
  },
  {
    q: "Une dette élevée est-elle forcément dangereuse ?",
    r: "Pas nécessairement. Le Japon, par exemple, a une dette très élevée mais détenue en grande majorité par des créanciers du pays, ce qui change le risque. Ce qui compte : qui détient la dette, dans quelle monnaie elle est libellée, à quel taux, et à quel rythme l'économie croît.",
  },
  {
    q: "D'où viennent ces données ?",
    r: "Elles viennent de la base de dette de Visualize (dette en 2000, 2014 et 2024, en milliards d'euros). Chaque dossier de pays précise les périodes couvertes. Les montants peuvent être affichés en euros, en dollars ou en renminbis, au taux moyen de chaque année.",
  },
  {
    q: "La dette publique de la France est-elle à part ?",
    r: "La France a un dossier complet et détaillé, mis à jour avec les chiffres de l'INSEE, de la Banque de France et de l'Agence France Trésor : montant, déficit, intérêts, détenteurs de la dette et calendrier de refinancement.",
  },
];

export default function Page() {
  const dossiers = tousLesDossiers();
  const plus = [...dossiers].sort((a, b) => b.p2024 - a.p2024)[0];
  const url = urlAbs("/dette-publique");
  return (
    <div className="cg sg">
      <EnTete />
      <JsonLd
        data={[
          schemaFil([{ label: "Accueil", url: SITE_URL }, { label: "Dette publique", url }]),
          schemaFaq(FAQ),
          {
            "@type": "Article",
            headline: "Dette publique dans le monde : le classement des pays",
            description: metadata.description,
            url,
            inLanguage: "fr",
            author: { "@type": "Organization", name: "Visualize" },
            publisher: { "@type": "Organization", name: "Visualize", url: SITE_URL },
            datePublished: "2026-10-12",
            dateModified: "2026-10-12",
          },
        ]}
      />
      <main className="sg-page">
        <Fil items={[{ label: "Accueil", href: "/" }, { label: "Dette publique" }]} />
        <h1 className="sg-h1">Dette publique <span>dans le monde</span></h1>
        <p className="sg-intro">
          {dossiers.length} pays classés selon le poids de leur dette dans la richesse produite en 2024. En tête : {plus.flag} {plus.fr}, à {nf(plus.p2024, 1)} % du PIB. Chaque pays a son dossier : montant, évolution depuis 2000, créanciers, inflation et comparaisons.
        </p>
        <div className="sg-cta">
          <Link href="/pays/france/dette-publique" className="sg-bouton">Le dossier sur la France</Link>
          <Link href="/comparer" className="sg-bouton sg-bouton-2">Comparer des pays</Link>
        </div>

        <section className="dd-sec" aria-labelledby="dd-cl">
          <h2 id="dd-cl" className="sg-h2">Le classement</h2>
          <ClassementDette dossiers={dossiers} />
        </section>

        <section className="dd-sec" aria-labelledby="dd-an">
          <h2 id="dd-an" className="sg-h2">Les analyses</h2>
          <div className="dd-analyses">
            {ANALYSES.map((a) => (
              <Link key={a.slug} href={`/dette-publique/analyses/${a.slug}`} className="dd-analyse">
                <small>{a.famille === "region" ? "Par région" : "Classement"}</small>
                <strong>{a.h1[0]} {a.h1[1]}</strong>
                <span>{a.accroche}</span>
              </Link>
            ))}
          </div>
        </section>

        <Faq titre="Comprendre la dette publique" questions={FAQ} />

        <p className="sg-note">
          Sources : base de dette de Visualize (2000, 2014, 2024, en milliards d&apos;euros). <Link href="/methodologie-donnees">Notre méthode</Link> · <Link href="/pays">Tous les pays</Link>
        </p>
      </main>
      <Pied />
    </div>
  );
}
