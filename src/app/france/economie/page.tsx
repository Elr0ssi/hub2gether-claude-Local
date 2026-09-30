import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/layout/Layout";
import { jsonLdString } from "@/lib/schema";
import {
  deficit2025,
  detteDerniere,
  nonResidents,
  ratioDernier,
} from "@/data/articles/detteFrancaise";

/* ═══════════════════════════════════════════════════════════════════════════
   /france/economie — LA RUBRIQUE

   Le troisième niveau du fil d'Ariane de l'article dette. Elle rassemble ce
   qui touche aux finances publiques françaises et distingue d'emblée les
   quatre périmètres qu'on confond le plus souvent : c'est la première chose
   à savoir avant de lire un chiffre de dette.
   ═══════════════════════════════════════════════════════════════════════════ */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://theessentialdata.com";

const nb = (v: number, d = 1) =>
  v.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });

export const metadata: Metadata = {
  title: {
    absolute: "Économie et finances publiques françaises : dette, déficit, budget | Visualize",
  },
  description:
    "Dette publique, déficit, recettes et dépenses des administrations publiques françaises. Les quatre périmètres à ne pas confondre, chiffres sourcés INSEE, Banque de France, Agence France Trésor et Eurostat.",
  keywords: [
    "finances publiques France",
    "dette publique française",
    "déficit public France",
    "budget de l'État",
    "recettes de l'État",
    "dépenses publiques France",
    "dette de Maastricht",
    "dette négociable",
  ],
  alternates: { canonical: "/france/economie" },
  openGraph: {
    type: "website",
    url: `${siteUrl}/france/economie`,
    title: "Économie et finances publiques françaises",
    description:
      "Dette, déficit, recettes et dépenses des administrations publiques. Chaque chiffre porte son périmètre et sa source.",
  },
};

export default function Page() {
  const fil = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "France", item: `${siteUrl}/france` },
      { "@type": "ListItem", position: 3, name: "Économie", item: `${siteUrl}/france/economie` },
    ],
  };

  return (
    <Layout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(fil) }} />
      <div className="hub">
        <nav className="hub-fil" aria-label="Fil d'Ariane">
          <Link href="/">Accueil</Link>
          <span aria-hidden="true">›</span>
          <Link href="/france">France</Link>
          <span aria-hidden="true">›</span>
          <span>Économie</span>
        </nav>

        <h1 className="hub-h1">Économie et finances publiques françaises</h1>
        <p className="hub-chapo">
          Dette, déficit, recettes, dépenses. Ces quatre mots recouvrent des périmètres
          différents, et la plupart des désaccords publics sur « le chiffre de la dette »
          viennent de là : deux personnes citent deux mesures justes qui ne parlent pas de la
          même chose.
        </p>

        <h2 className="hub-h2">Les quatre périmètres à ne pas confondre</h2>
        <dl className="hub-def">
          <div>
            <dt>Les administrations publiques</dt>
            <dd>
              L&apos;État, la Sécurité sociale, les collectivités locales et les organismes
              divers. C&apos;est le périmètre de la dette au sens de Maastricht, celui qui donne{" "}
              {nb(detteDerniere.valeur)} milliards d&apos;euros et {nb(ratioDernier.valeur)} % du
              produit intérieur brut.
            </dd>
          </div>
          <div>
            <dt>Le budget de l&apos;État</dt>
            <dd>
              Les seules recettes et dépenses du budget général. Il ne couvre ni la Sécurité
              sociale ni les collectivités : c&apos;est une part du tout, pas le tout.
            </dd>
          </div>
          <div>
            <dt>La Sécurité sociale</dt>
            <dd>
              Ses comptes ont leurs propres recettes, leurs propres dépenses et leur propre
              dette, portée notamment par la Caisse d&apos;amortissement de la dette sociale.
            </dd>
          </div>
          <div>
            <dt>La dette négociable de l&apos;État</dt>
            <dd>
              Les titres émis et échangés sur les marchés, suivis par l&apos;Agence France Trésor.
              C&apos;est sur ce périmètre, en valeur de marché, qu&apos;on lit la part détenue
              par les non-résidents, à ne pas confondre avec la part de{" "}
              {nb(nonResidents.valeur)} % que publie la Banque de France sur un périmètre plus
              large.
            </dd>
          </div>
        </dl>

        <div className="hub-chiffres">
          <p>
            <b>{nb(detteDerniere.valeur)} Md€</b>
            <span>de dette publique au premier trimestre 2026</span>
            <em>INSEE</em>
          </p>
          <p>
            <b>{nb(ratioDernier.valeur)} %</b>
            <span>du produit intérieur brut</span>
            <em>INSEE</em>
          </p>
          <p>
            <b>{nb(deficit2025.valeur)} %</b>
            <span>de déficit public en 2025</span>
            <em>INSEE</em>
          </p>
        </div>

        <h2 className="hub-h2">À lire</h2>
        <ul className="hub-liste">
          <li>
            <Link href="/france/economie/dette-publique">
              <b>La dette publique française</b>
              <span>
                D&apos;où elle vient, qui la doit, qui la détient, ce qu&apos;elle coûte, comment
                elle se rembourse, et ce que son niveau change.
              </span>
            </Link>
          </li>
          <li>
            <Link href="/economie">
              <b>Le socle économique mondial</b>
              <span>
                Replacer la France parmi les autres : dix indicateurs, plus de deux cents pays,
                soixante-six années.
              </span>
            </Link>
          </li>
        </ul>

        <p className="hub-note">
          Méthodes de collecte et de contrôle :{" "}
          <Link href="/methodologie-donnees">la méthodologie de la base</Link>.
        </p>
      </div>
    </Layout>
  );
}
