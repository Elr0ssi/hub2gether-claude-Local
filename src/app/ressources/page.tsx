import type { Metadata } from "next";
import { RessourcesPage } from "@/components/ressources/RessourcesPage";
import { jsonLdString } from "@/lib/schema";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://theessentialdata.com";
const chemin = "/ressources";

export const metadata: Metadata = {
  title: { absolute: "Ressources : production mondiale par pays, de 1961 à 2024 | Visualize" },
  description:
    "Où sont produites les ressources agricoles du monde ? Production, surface récoltée et rendement par pays sur un globe interactif, classements et courbes de 1961 à 2024. Données FAOSTAT.",
  keywords: ["production mondiale de blé", "FAOSTAT", "ressources agricoles", "production par pays", "rendement agricole", "surface récoltée"],
  alternates: { canonical: chemin },
  openGraph: {
    type: "website",
    url: `${siteUrl}${chemin}`,
    title: "Ressources : la production mondiale sur un globe interactif",
    description: "Production, surface et rendement par pays, de 1961 à 2024, avec la fiabilité de chaque valeur.",
  },
};

export default function Page() {
  const jeu = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Production, surface récoltée et rendement agricoles par pays (FAOSTAT)",
    description: "Séries annuelles 1961-2024 de production (t), de surface récoltée (ha) et de rendement (kg/ha) par pays, avec le statut de chaque valeur (officielle, estimée, imputée, externe, manquante).",
    url: `${siteUrl}${chemin}`,
    inLanguage: "fr-FR",
    creator: { "@type": "Organization", name: "Visualize", url: siteUrl },
    isBasedOn: { "@type": "Dataset", name: "FAOSTAT — Crops and livestock products (QCL)", url: "https://www.fao.org/faostat/en/#data/QCL" },
  };
  const fil = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Ressources", item: `${siteUrl}${chemin}` },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jeu) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(fil) }} />
      <p className="sr-only">
        Cette page présente la production, la surface récoltée et le rendement des ressources agricoles par pays, de 1961 à 2024, d’après FAOSTAT. Les totaux mondiaux
        sont recalculés à partir des entités du fichier, les entités historiques ne sont pas rattachées aux frontières actuelles, et les valeurs estimées ou manquantes sont signalées.
      </p>
      <RessourcesPage />
    </>
  );
}
