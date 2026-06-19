import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Layout } from "@/components/layout/Layout";
import { MapViewLoader } from "@/components/map/MapViewLoader";
import { EpidemicsMapViewLoader } from "@/components/map/EpidemicsMapViewLoader";
import { EconomyMapViewLoader } from "@/components/map/EconomyMapViewLoader";
import { PoliticsMapViewLoader } from "@/components/map/PoliticsMapViewLoader";
import { MilitaryMapViewLoader } from "@/components/map/MilitaryMapViewLoader";
import { ArticleGrid } from "@/components/articles/ArticleGrid";
import { FAQSection } from "@/components/faq/FAQSection";
import { getThemeById } from "@/data/themes";
import { getArticlesByTheme } from "@/data/articles";
import { getFaqsByTheme } from "@/data/faqs";
import { Skeleton } from "@/components/ui/Skeleton";
import type { ThemeId } from "@/types";

interface PageProps {
  params: Promise<{ theme: string }>;
  searchParams: Promise<{ year?: string }>;
}

export async function generateStaticParams() {
  return [{ theme: "empires" }, { theme: "epidemics" }, { theme: "economy" }, { theme: "politics" }, { theme: "military" }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { theme } = await params;
  const themeData = getThemeById(theme);

  if (!themeData) {
    return { title: "Theme not found" };
  }

  if (theme === "empires") {
    return {
      title: "Carte empire romain interactif — Expansion territoriale 500 BC à 1453 AD",
      description:
        "Carte interactive de l'Empire romain de 500 av. J.-C. à 1453 ap. J.-C. Suivez l'expansion territoriale, les périodes clés et le contexte historique de la plus grande puissance de l'Antiquité.",
      keywords: [
        "carte empire romain",
        "empire romain carte interactive",
        "Roman Empire map",
        "expansion empire romain",
        "carte empire romain 117 ap JC",
        "empire romain territoire",
        "chute empire romain",
        "empire byzantin carte",
        "Rome antique géographie",
        "interactive historical map",
      ],
      alternates: { canonical: "/map/empires" },
      openGraph: {
        title: "Carte empire romain interactif — The Essential Data",
        description:
          "De la cité latine (500 av. J.-C.) à la chute de Constantinople (1453). Explorez l'empire romain en 7 étapes clés avec données historiques.",
        type: "website",
      },
    };
  }

  if (theme === "epidemics") {
    return {
      title: "Carte épidémies mondiales — COVID-19, VIH, Peste Noire, Hantavirus, HMPV 2025",
      description:
        "Carte interactive des grandes épidémies mondiales : COVID-19, VIH/SIDA, Peste Noire (1347), Hantavirus et HMPV 2025. Cas confirmés, décès et taux de létalité par pays.",
      keywords: [
        "carte épidémies mondiales",
        "carte COVID-19 par pays",
        "carte VIH monde",
        "carte peste noire",
        "hantavirus carte mondiale",
        "HMPV 2025 carte",
        "taux mortalité épidémies",
        "world epidemics map",
        "COVID deaths by country",
        "épidémies données OMS",
        "maladies infectieuses carte",
        "pandemic data visualization",
      ],
      alternates: { canonical: "/map/epidemics" },
      openGraph: {
        title: "Carte épidémies mondiales — COVID, VIH, Peste Noire | The Essential Data",
        description:
          "Visualisez l'impact de 5 épidémies majeures par pays : Peste Noire (1347), COVID-19, VIH/SIDA, Hantavirus, HMPV 2025. Données OMS et CDC.",
        type: "website",
      },
    };
  }

  if (theme === "economy") {
    return {
      title: "Carte PIB par pays 2025 — Dette publique, Chômage, Économie mondiale",
      description:
        "Carte interactive du PIB par pays en 2025 (projections FMI). Comparez la dette publique, le taux de chômage et les grandes entreprises de 70+ pays de 2000 à 2025. Données FMI et Banque mondiale.",
      keywords: [
        "carte PIB par pays 2025",
        "PIB monde 2025 carte",
        "dette publique par pays 2025",
        "carte chômage monde 2025",
        "comparaison PIB pays",
        "world GDP map 2025",
        "GDP by country 2025",
        "economic data world map",
        "FMI projections 2025",
        "données économiques mondiales",
        "classement PIB pays 2025",
        "carte économie mondiale interactive",
      ],
      alternates: { canonical: "/map/economy" },
      openGraph: {
        title: "Carte PIB par pays 2025 — Économie mondiale | The Essential Data",
        description:
          "PIB, dette publique, chômage et entreprises pour 70+ pays de 2000 à 2025. Projections FMI avril 2025 — vue YTD en temps réel.",
        type: "website",
      },
    };
  }

  if (theme === "politics") {
    return {
      title: "Carte politique mondiale — Régimes et orientations politiques 1900–2025",
      description:
        "Explorez les régimes politiques et les orientations idéologiques de 20+ pays depuis 1900. Démocraties, dictatures, totalitarismes — naviguez sur une frise chronologique interactive.",
      keywords: [
        "carte politique mondiale",
        "régimes politiques par pays",
        "orientation politique monde",
        "démocratie dictature carte",
        "histoire politique mondiale",
        "extrême droite gauche carte",
        "frise chronologique politique",
      ],
      alternates: { canonical: "/map/politics" },
      openGraph: {
        title: "Carte politique mondiale 1900–2025 — The Essential Data",
        description:
          "Régimes et orientations politiques de 20+ pays depuis 1900. Frise chronologique interactive.",
        type: "website",
      },
    };
  }

  return {
    title: `${themeData.label} — Carte interactive`,
    description: themeData.description,
    alternates: { canonical: `/map/${theme}` },
  };
}

const DATASET_SCHEMAS: Record<string, object> = {
  economy: {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Données économiques mondiales 2000–2025",
    description:
      "PIB nominal, dette publique (% PIB), taux de chômage et nombre d'entreprises pour 70+ pays de 2000 à 2025. Source : FMI WEO avril 2025, Banque mondiale.",
    url: "https://theessentialdata.com/map/economy",
    keywords: ["PIB", "dette publique", "chômage", "économie mondiale", "FMI", "Banque mondiale"],
    creator: { "@type": "Organization", name: "The Essential Data" },
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
    url: "https://theessentialdata.com/map/epidemics",
    keywords: ["COVID-19", "VIH", "épidémies", "pandémie", "mortalité", "santé mondiale"],
    creator: { "@type": "Organization", name: "The Essential Data" },
    spatialCoverage: "World",
    license: "https://creativecommons.org/licenses/by/4.0/",
  },
  empires: {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Empire romain — données géographiques et historiques 500 BC – 1453 AD",
    description:
      "Extension territoriale de l'Empire romain en 7 périodes clés de 500 av. J.-C. à 1453 ap. J.-C. Données démographiques et géographiques issues de la recherche académique.",
    url: "https://theessentialdata.com/map/empires",
    keywords: ["Empire romain", "Rome", "antiquité", "histoire", "géographie historique"],
    creator: { "@type": "Organization", name: "The Essential Data" },
    temporalCoverage: "-500/1453",
    spatialCoverage: "Mediterranean",
    license: "https://creativecommons.org/licenses/by/4.0/",
  },
};

export default async function MapPage({ params, searchParams }: PageProps) {
  const { theme } = await params;
  const { year } = await searchParams;
  const themeData = getThemeById(theme);

  if (!themeData) {
    notFound();
  }

  const articles = getArticlesByTheme(theme);
  const faqs = getFaqsByTheme(theme);
  const initialYear = year ? parseInt(year) : 117;

  const isEpidemics = theme === "epidemics";
  const isEconomy = theme === "economy";
  const isPolitics = theme === "politics";
  const isMilitary = theme === "military";
  const datasetSchema = DATASET_SCHEMAS[theme];

  return (
    <Layout>
      {datasetSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
        />
      )}
      {/* Page header */}
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-6">
        <div className="mb-2">
          <span className="accent-badge text-xs capitalize">{themeData.label}</span>
        </div>
        <h1 className="text-heading-1 mb-2" style={{ color: "var(--ink)" }}>
          {isEpidemics
            ? "Épidémies mondiales"
            : isEconomy
            ? "Économie mondiale"
            : isPolitics
            ? "Politique mondiale"
            : isMilitary
            ? "Puissances militaires mondiales"
            : theme === "empires"
            ? "Empire romain"
            : themeData.label}
        </h1>
        <p className="text-body" style={{ maxWidth: "600px" }}>
          {isEpidemics
            ? "Visualisez l'impact de cinq grandes épidémies — Peste Noire, COVID-19, VIH/SIDA, Hantavirus et HMPV 2025 — pays par pays. Cas confirmés, décès et taux de létalité. Vue YTD disponible pour les maladies actives."
            : isEconomy
            ? "Comparez le PIB, la dette publique, le chômage et les entreprises de 70+ pays de 2000 à 2025. Projections FMI avril 2025 — vue en temps réel (YTD) disponible pour l'année en cours."
            : isPolitics
            ? "Explorez les régimes politiques et les orientations idéologiques de 20+ pays depuis 1900. Naviguez sur la frise chronologique pour voir comment le monde politique a évolué d'une décennie à l'autre."
            : isMilitary
            ? "Comparez les budgets de défense, effectifs, chars, navires et avions militaires de 30 pays de 2000 à 2024. Cliquez sur un pays pour voir ses équipements majeurs."
            : theme === "empires"
            ? "Retracez l'ascension et la chute de l'Empire romain en sept périodes clés, de la cité latine fondatrice à la chute de Constantinople."
            : themeData.description}
        </p>
      </div>

      {/* Interactive map */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <Suspense
          fallback={
            <div
              className="rounded-2xl border overflow-hidden"
              style={{ border: "1px solid var(--border)", height: "600px" }}
            >
              <Skeleton className="w-full h-full" />
            </div>
          }
        >
          {isEpidemics ? (
            <EpidemicsMapViewLoader />
          ) : isEconomy ? (
            <EconomyMapViewLoader />
          ) : isPolitics ? (
            <PoliticsMapViewLoader />
          ) : isMilitary ? (
            <MilitaryMapViewLoader />
          ) : (
            <MapViewLoader theme={themeData.id as ThemeId} initialYear={initialYear} />
          )}
        </Suspense>
      </div>

      {/* Articles */}
      {articles.length > 0 && (
        <ArticleGrid
          articles={articles.slice(0, 3)}
          title="Analyses éditoriales"
          subtitle={
            isEpidemics
              ? "Analyses approfondies sur les grandes pandémies, leur géographie et leur impact géopolitique."
              : isEconomy
              ? "Décryptages économiques : PIB par pays 2025, dette publique mondiale, chômage et rivalités géopolitiques."
              : isPolitics
              ? "Analyses sur les grands basculements politiques du XXe et XXIe siècle — populismes, transitions démocratiques et autoritarismes."
              : isMilitary
              ? "Analyses sur les grandes puissances militaires, la course aux armements et les nouveaux conflits armés."
              : "Décryptages éditoriaux sur l'Empire romain — son expansion, son administration, son déclin et son héritage."
          }
        />
      )}

      {/* FAQ */}
      {faqs.length > 0 && <FAQSection items={faqs} />}
    </Layout>
  );
}
