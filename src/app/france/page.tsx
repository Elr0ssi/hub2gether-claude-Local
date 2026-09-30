import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/layout/Layout";
import { jsonLdString } from "@/lib/schema";
import { detteDerniere, ratioDernier, deficit2025 } from "@/data/articles/detteFrancaise";

/* ═══════════════════════════════════════════════════════════════════════════
   /france — LA TÊTE DE RUBRIQUE

   Elle existait déjà dans le fil d'Ariane de l'article dette, mais pas dans
   le site : le fil pointait vers une page absente. Elle existe maintenant, et
   elle a un rôle propre — dire ce que la rubrique couvre et conduire aux
   pages qui la composent, pas répéter leur contenu.
   ═══════════════════════════════════════════════════════════════════════════ */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://theessentialdata.com";

const nb = (v: number, d = 1) =>
  v.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });

export const metadata: Metadata = {
  title: { absolute: "France : données publiques, économie et finances | Visualize" },
  description:
    "Les données publiques françaises expliquées et sourcées : dette publique, déficit, recettes et dépenses de l'État, comparaison européenne. Sources INSEE, Banque de France, Agence France Trésor, Eurostat.",
  keywords: [
    "données France",
    "économie française",
    "finances publiques France",
    "dette publique française",
    "déficit public France",
    "chiffres clés France",
  ],
  alternates: { canonical: "/france" },
  openGraph: {
    type: "website",
    url: `${siteUrl}/france`,
    title: "France : données publiques, économie et finances",
    description:
      "Dette publique, déficit, recettes et dépenses de l'État, comparaison européenne. Chaque chiffre porte son périmètre et sa source.",
  },
};

export default function Page() {
  const fil = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "France", item: `${siteUrl}/france` },
    ],
  };

  return (
    <Layout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(fil) }} />
      <div className="hub">
        <nav className="hub-fil" aria-label="Fil d'Ariane">
          <Link href="/">Accueil</Link>
          <span aria-hidden="true">›</span>
          <span>France</span>
        </nav>

        <h1 className="hub-h1">France</h1>
        <p className="hub-chapo">
          Les données publiques françaises, expliquées et sourcées. Chaque chiffre porte son
          périmètre, sa période et l&apos;institution qui le publie, parce qu&apos;un montant de
          dette ne veut rien dire tant qu&apos;on ne sait pas de quelle dette on parle.
        </p>

        <div className="hub-chiffres">
          <p>
            <b>{nb(detteDerniere.valeur)} Md€</b>
            <span>de dette publique, au sens de Maastricht, au premier trimestre 2026</span>
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

        <h2 className="hub-h2">Les rubriques</h2>
        <ul className="hub-liste">
          <li>
            <Link href="/france/economie">
              <b>Économie et finances publiques</b>
              <span>
                Dette, déficit, recettes et dépenses des administrations publiques françaises.
              </span>
            </Link>
          </li>
        </ul>

        <h2 className="hub-h2">À lire</h2>
        <ul className="hub-liste">
          <li>
            <Link href="/france/economie/dette-publique">
              <b>La dette publique française</b>
              <span>
                Montant, évolution, dette sur PIB, déficit, détenteurs, intérêts, remboursement et
                comparaison européenne.
              </span>
            </Link>
          </li>
        </ul>

        <p className="hub-note">
          Les méthodes de collecte, de contrôle et de publication sont décrites dans la{" "}
          <Link href="/methodologie-donnees">méthodologie de la base</Link>. Les sources sont
          listées page par page et indicateur par indicateur.
        </p>
      </div>
    </Layout>
  );
}
