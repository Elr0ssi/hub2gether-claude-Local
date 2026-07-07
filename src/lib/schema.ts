const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://theessentialdata.com";

export function jsonLdString(value: object): string {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}

export const DATASET_SCHEMAS: Record<string, object> = {
  economy: {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Données économiques mondiales 2000–2025",
    description:
      "PIB nominal, dette publique (% PIB), taux de chômage et nombre d'entreprises pour 70+ pays de 2000 à 2025. Source : FMI WEO avril 2025, Banque mondiale.",
    url: `${siteUrl}/map/economy`,
    keywords: ["PIB", "dette publique", "chômage", "économie mondiale", "FMI", "Banque mondiale"],
    creator: { "@type": "Organization", name: "The Essential Data", url: siteUrl },
    temporalCoverage: "2000/2025",
    spatialCoverage: "World",
    license: "https://creativecommons.org/licenses/by/4.0/",
  },
  epidemics: {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Données épidémies mondiales — COVID-19, VIH, Peste Noire, Hantavirus, HMPV",
    description:
      "Cas confirmés et décès pour 5 grandes épidémies par pays : Peste Noire (1347–1353), COVID-19 (2020–2024), VIH/SIDA, Hantavirus, HMPV 2025. Sources : OMS, ONUSIDA, CDC.",
    url: `${siteUrl}/map/epidemics`,
    keywords: ["COVID-19", "VIH", "épidémies", "pandémie", "mortalité", "santé mondiale"],
    creator: { "@type": "Organization", name: "The Essential Data", url: siteUrl },
    spatialCoverage: "World",
    license: "https://creativecommons.org/licenses/by/4.0/",
  },
  empires: {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Empire romain — données géographiques et historiques 500 BC – 1453 AD",
    description:
      "Extension territoriale de l'Empire romain en 7 périodes clés de 500 av. J.-C. à 1453 ap. J.-C. Données démographiques et géographiques issues de la recherche académique.",
    url: `${siteUrl}/map/empires`,
    keywords: ["Empire romain", "Rome", "antiquité", "histoire", "géographie historique"],
    creator: { "@type": "Organization", name: "The Essential Data", url: siteUrl },
    temporalCoverage: "-500/1453",
    spatialCoverage: "Mediterranean",
    license: "https://creativecommons.org/licenses/by/4.0/",
  },
  politics: {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Régimes politiques mondiaux 1900–2025",
    description:
      "Orientations politiques et régimes gouvernementaux de 20+ pays de 1900 à 2025 : démocraties, dictatures, régimes totalitaires. Données historiographiques et politologiques.",
    url: `${siteUrl}/map/politics`,
    keywords: ["régimes politiques", "orientation politique", "démocratie", "dictature", "histoire politique"],
    creator: { "@type": "Organization", name: "The Essential Data", url: siteUrl },
    temporalCoverage: "1900/2025",
    spatialCoverage: "World",
    license: "https://creativecommons.org/licenses/by/4.0/",
  },
  military: {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Dépenses militaires et forces armées mondiales 2000–2024",
    description:
      "Budgets de défense, effectifs militaires, équipements (chars, navires, avions) pour 30 pays de 2000 à 2024. Source : SIPRI MILEX, IISS Military Balance.",
    url: `${siteUrl}/map/military`,
    keywords: ["budget militaire", "forces armées", "SIPRI", "défense", "dépenses militaires"],
    creator: { "@type": "Organization", name: "The Essential Data", url: siteUrl },
    temporalCoverage: "2000/2024",
    spatialCoverage: "World",
    license: "https://creativecommons.org/licenses/by/4.0/",
  },
};
