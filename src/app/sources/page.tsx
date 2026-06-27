import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/layout/Layout";
import { ArrowLeft, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Sources de données — The Essential Data",
  description:
    "Toutes les sources de données utilisées par The Essential Data : FMI, Banque mondiale, OMS, SIPRI, AWMC et médias internationaux de référence.",
};

type SourceCategory = {
  id: string;
  title: string;
  description: string;
  sources: {
    name: string;
    fullName: string;
    url: string;
    usage: string;
    license?: string;
  }[];
};

const SOURCE_CATEGORIES: SourceCategory[] = [
  {
    id: "economy",
    title: "Économie mondiale",
    description: "Données macroéconomiques, PIB, dette publique, taux de chômage.",
    sources: [
      {
        name: "FMI — WEO",
        fullName: "Fonds Monétaire International — World Economic Outlook",
        url: "https://www.imf.org/en/Publications/WEO",
        usage: "PIB nominal par pays, dette/PIB, taux de chômage. Millésime 2024.",
        license: "Données librement consultables",
      },
      {
        name: "Banque mondiale",
        fullName: "World Bank Open Data",
        url: "https://data.worldbank.org",
        usage: "Indicateurs de développement mondial, PIB PPA, données historiques.",
        license: "CC BY 4.0",
      },
      {
        name: "OCDE",
        fullName: "Organisation de Coopération et de Développement Économiques",
        url: "https://stats.oecd.org",
        usage: "Statistiques économiques pays membres, comparaisons structurelles.",
        license: "Données librement consultables",
      },
      {
        name: "Fortune Global 500",
        fullName: "Fortune Magazine — Global 500 ranking",
        url: "https://fortune.com/global500/",
        usage: "Classement des plus grandes entreprises mondiales par chiffre d'affaires.",
      },
    ],
  },
  {
    id: "epidemics",
    title: "Épidémies et santé mondiale",
    description: "Données épidémiologiques, mortalité, prévalence par pays.",
    sources: [
      {
        name: "OMS / WHO",
        fullName: "Organisation Mondiale de la Santé — World Health Organization",
        url: "https://www.who.int/data",
        usage: "Données COVID-19, VIH/SIDA, maladies infectieuses, mortalité mondiale.",
        license: "Données librement consultables",
      },
      {
        name: "CDC",
        fullName: "Centers for Disease Control and Prevention (États-Unis)",
        url: "https://www.cdc.gov/data-statistics/",
        usage: "Épidémiologie des maladies émergentes, statistiques sur le Hantavirus et HMPV.",
        license: "Domaine public",
      },
      {
        name: "ECDC",
        fullName: "European Centre for Disease Prevention and Control",
        url: "https://www.ecdc.europa.eu/en/surveillance-and-disease-data",
        usage: "Surveillance épidémiologique européenne, données COVID et maladies infectieuses.",
        license: "Données librement consultables",
      },
      {
        name: "UNAIDS",
        fullName: "Programme commun des Nations Unies sur le VIH/SIDA",
        url: "https://www.unaids.org/en/resources/documents/2024",
        usage: "Prévalence VIH par pays, données de traitement ARV, mortalité.",
        license: "Données librement consultables",
      },
      {
        name: "Our World in Data",
        fullName: "Our World in Data — University of Oxford",
        url: "https://ourworldindata.org/health",
        usage: "Séries temporelles historiques des épidémies, visualisations vérifiées.",
        license: "CC BY 4.0",
      },
    ],
  },
  {
    id: "military",
    title: "Dépenses militaires et conflits",
    description: "Budgets de défense, effectifs militaires, données sur les conflits armés.",
    sources: [
      {
        name: "SIPRI",
        fullName: "Stockholm International Peace Research Institute",
        url: "https://www.sipri.org/databases/milex",
        usage: "Dépenses militaires mondiales par pays (% PIB et valeur absolue). Base MILEX.",
        license: "Données librement consultables à usage non-commercial",
      },
      {
        name: "IISS",
        fullName: "International Institute for Strategic Studies — The Military Balance",
        url: "https://www.iiss.org/publications/the-military-balance",
        usage: "Effectifs militaires, équipements, capacités opérationnelles par pays.",
      },
      {
        name: "ACLED",
        fullName: "Armed Conflict Location & Event Data Project",
        url: "https://acleddata.com",
        usage: "Géolocalisation des conflits armés et incidents violents.",
        license: "Accès chercheurs et médias",
      },
    ],
  },
  {
    id: "empires",
    title: "Empires historiques et cartographie ancienne",
    description: "Sources historiographiques pour les cartes d'empires et données historiques.",
    sources: [
      {
        name: "AWMC",
        fullName: "Ancient World Mapping Center — UNC Chapel Hill",
        url: "https://awmc.unc.edu",
        usage: "Référence cartographique principale pour les frontières des empires antiques.",
        license: "CC BY 4.0",
      },
      {
        name: "Barrington Atlas",
        fullName: "Barrington Atlas of the Greek and Roman World (Princeton University Press)",
        url: "https://press.princeton.edu/books/hardcover/9780691031699/the-barrington-atlas-of-the-greek-and-roman-world",
        usage: "Cartographie de référence pour la Rome antique et le monde grec.",
      },
      {
        name: "Encyclopedia Iranica",
        fullName: "Encyclopaedia Iranica — Columbia University",
        url: "https://www.iranicaonline.org",
        usage: "Sources sur l'Empire perse achéménide, sassanide et parthe.",
        license: "Accès libre en ligne",
      },
      {
        name: "Cambridge World History",
        fullName: "The Cambridge World History (Cambridge University Press)",
        url: "https://www.cambridge.org/core/books/cambridge-world-history",
        usage: "Chronologies et données démographiques pour les grands empires.",
      },
    ],
  },
  {
    id: "geodata",
    title: "Données géographiques et cartographiques",
    description: "Frontières politiques, données topographiques et projections cartographiques.",
    sources: [
      {
        name: "Natural Earth",
        fullName: "Natural Earth — Free Vector and Raster Map Data",
        url: "https://www.naturalearthdata.com",
        usage: "Frontières politiques actuelles, pays, océans, projections. Échelle 1:10m et 1:50m.",
        license: "Domaine public",
      },
      {
        name: "GeoJSON.io / ISO 3166",
        fullName: "ISO 3166-1 Country Codes",
        url: "https://www.iso.org/iso-3166-country-codes.html",
        usage: "Codes ISO alpha-2 et alpha-3 pour la jointure des données pays.",
        license: "Standard ISO",
      },
    ],
  },
  {
    id: "press",
    title: "Médias et presse internationale",
    description: "Sources journalistiques et éditoriales utilisées pour les synthèses d'articles.",
    sources: [
      {
        name: "Reuters",
        fullName: "Reuters News Agency",
        url: "https://www.reuters.com",
        usage: "Dépêches d'actualité internationale, données économiques et géopolitiques.",
      },
      {
        name: "AFP",
        fullName: "Agence France-Presse",
        url: "https://www.afp.com",
        usage: "Couverture actualité mondiale francophone et internationale.",
      },
      {
        name: "BBC News",
        fullName: "British Broadcasting Corporation — News",
        url: "https://www.bbc.com/news",
        usage: "Analyses et reportages sur les conflits, épidémies et économie mondiale.",
      },
      {
        name: "Financial Times",
        fullName: "Financial Times",
        url: "https://www.ft.com",
        usage: "Analyses économiques mondiales, marchés, géopolitique financière.",
      },
      {
        name: "Le Monde",
        fullName: "Le Monde",
        url: "https://www.lemonde.fr",
        usage: "Analyses géopolitiques et investigations journalistiques.",
      },
      {
        name: "The Economist",
        fullName: "The Economist",
        url: "https://www.economist.com",
        usage: "Analyses économiques comparatives, indices (démocratie, corruption).",
      },
      {
        name: "Al Jazeera English",
        fullName: "Al Jazeera Media Network",
        url: "https://www.aljazeera.com",
        usage: "Couverture des conflits, Moyen-Orient, Afrique, Asie.",
      },
      {
        name: "South China Morning Post",
        fullName: "South China Morning Post",
        url: "https://www.scmp.com",
        usage: "Perspectives asiatiques sur l'économie et la géopolitique.",
      },
    ],
  },
];

export default function SourcesPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="btn-ghost px-0 mb-8 inline-flex gap-1.5 text-sm"
          style={{ color: "var(--ink-3)" }}
        >
          <ArrowLeft size={15} />
          Retour à l'accueil
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-widest"
              style={{ background: "var(--accent)", color: "#000" }}
            >
              Transparence
            </span>
          </div>
          <h1
            className="font-black mb-4"
            style={{ color: "var(--ink)", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.025em" }}
          >
            Sources de données
          </h1>
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--ink-2)", fontSize: "1.0625rem" }}>
            L'ensemble des sources primaires utilisées pour alimenter les visualisations interactives
            et les synthèses éditoriales de The Essential Data.
          </p>
          <p className="text-sm" style={{ color: "var(--ink-3)" }}>
            Conformément à nos engagements de transparence et aux exigences de l'EU AI Act, chaque source
            est documentée ci-dessous.{" "}
            <Link href="/methodology" className="underline underline-offset-2" style={{ color: "var(--ink-2)" }}>
              Voir notre méthodologie →
            </Link>
          </p>
        </header>

        {/* Quick navigation */}
        <nav
          className="flex flex-wrap gap-2 mb-10"
          aria-label="Navigation par catégorie"
        >
          {SOURCE_CATEGORIES.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
              style={{
                background: "var(--surface-2)",
                color: "var(--ink-2)",
                border: "1px solid var(--border)",
              }}
            >
              {cat.title}
            </a>
          ))}
        </nav>

        <div className="space-y-12">
          {SOURCE_CATEGORIES.map((category) => (
            <section key={category.id} id={category.id}>
              <h2
                className="font-bold mb-1"
                style={{ color: "var(--ink)", fontSize: "1.1rem", letterSpacing: "-0.015em" }}
              >
                {category.title}
              </h2>
              <p className="text-sm mb-5" style={{ color: "var(--ink-3)" }}>
                {category.description}
              </p>
              <div className="space-y-3">
                {category.sources.map((source) => (
                  <div
                    key={source.name}
                    className="p-4 rounded-xl"
                    style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <div>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-sm inline-flex items-center gap-1.5 hover:underline"
                          style={{ color: "var(--ink)" }}
                        >
                          {source.name}
                          <ExternalLink size={11} style={{ color: "var(--ink-4)" }} />
                        </a>
                        <p className="text-xs" style={{ color: "var(--ink-4)" }}>
                          {source.fullName}
                        </p>
                      </div>
                      {source.license && (
                        <span
                          className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full"
                          style={{ background: "rgba(57,255,136,0.1)", color: "#0D7A40", border: "1px solid rgba(57,255,136,0.25)" }}
                        >
                          {source.license}
                        </span>
                      )}
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--ink-3)" }}>
                      {source.usage}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div
          className="mt-12 pt-8"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <p className="text-xs" style={{ color: "var(--ink-4)" }}>
            Dernière mise à jour : juin 2025 · The Essential Data ·{" "}
            <Link href="/methodology" className="underline underline-offset-2" style={{ color: "var(--ink-3)" }}>
              Méthodologie →
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
