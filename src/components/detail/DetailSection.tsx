import Link from "next/link";
import { ArrowLeft, ArrowRight, MapPin, Users, Building, Calendar } from "lucide-react";
import { formatYear, formatNumber } from "@/lib/utils";
import { jsonLdString } from "@/lib/schema";
import type { TimelineEntry } from "@/types";

interface DetailSectionProps {
  entry: TimelineEntry;
  prev?: TimelineEntry;
  next?: TimelineEntry;
}

export function DetailSection({ entry, prev, next }: DetailSectionProps) {
  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `Roman Empire — ${formatYear(entry.year)}`,
    description: entry.description,
    keywords: ["Roman Empire", "Historical Map", "Ancient History", entry.era],
    temporalCoverage: String(entry.year),
    spatialCoverage: {
      "@type": "Place",
      name: "Mediterranean Basin",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Empires", item: "/map/empires" },
      { "@type": "ListItem", position: 3, name: `Roman Empire — ${formatYear(entry.year)}` },
    ],
  };

  return (
    <article className="max-w-4xl mx-auto px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(datasetSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbSchema) }}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-caption mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[var(--ink-2)] transition-colors">
          Accueil
        </Link>
        <span style={{ color: "var(--border)" }}>/</span>
        <Link href="/map/empires" className="hover:text-[var(--ink-2)] transition-colors">
          Empires
        </Link>
        <span style={{ color: "var(--border)" }}>/</span>
        <span style={{ color: "var(--ink-2)" }}>Empire romain</span>
        <span style={{ color: "var(--border)" }}>/</span>
        <span style={{ color: "var(--ink)" }}>{formatYear(entry.year)}</span>
      </nav>

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="accent-badge text-xs">{entry.era}</span>
        </div>

        <h1 className="text-heading-1 mb-3" style={{ color: "var(--ink)", fontSize: "2.25rem", letterSpacing: "-0.03em" }}>
          Empire romain — {entry.label}
          <br />
          <span style={{ color: "var(--accent)" }}>{formatYear(entry.year)}</span>
        </h1>

        <p className="text-body" style={{ maxWidth: "640px", fontSize: "1.0625rem" }}>
          {entry.description}
        </p>
      </header>

      {/* Stats grid */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 p-6 rounded-2xl border"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        {[
          { icon: MapPin, label: "Territoire", value: `${formatNumber(entry.stats.areaSqKm)} km²` },
          { icon: Users, label: "Population", value: formatNumber(entry.stats.populationEstimate) },
          { icon: Building, label: "Capitale", value: entry.stats.capitalCity },
          { icon: Calendar, label: "Système politique", value: entry.stats.politicalSystem },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <Icon size={13} style={{ color: "var(--ink-4)" }} />
              <span className="text-caption">{label}</span>
            </div>
            <span className="text-heading-3" style={{ color: "var(--ink)", fontSize: "1rem" }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Key facts */}
      <section className="mb-10">
        <h2 className="text-heading-2 mb-5" style={{ color: "var(--ink)" }}>
          Points clés
        </h2>
        <ul className="space-y-3">
          {entry.stats.keyFacts.map((fact, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="w-1.5 h-1.5 rounded-full mt-2.5 shrink-0"
                style={{ background: "var(--accent)" }}
              />
              <span className="text-body">{fact}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Analysis */}
      <section className="mb-12">
        <h2 className="text-heading-2 mb-5" style={{ color: "var(--ink)" }}>
          Analyse historique
        </h2>
        <div className="prose-like">
          <p className="text-body leading-relaxed" style={{ fontSize: "1.0625rem" }}>
            {entry.analysis}
          </p>
        </div>
      </section>

      {/* Source note */}
      <div
        className="p-4 rounded-xl mb-12"
        style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
      >
        <p className="text-small" style={{ color: "var(--ink-3)" }}>
          <strong style={{ color: "var(--ink-2)" }}>Sources :</strong> Frontières historiques issues de travaux académiques révisés par les pairs. Estimations démographiques d'après Scheidel &amp; Frier,{" "}
          <em>The size of the Roman economy</em>. Données territoriales issues de l'Ancient World
          Mapping Center (UNC Chapel Hill).
        </p>
      </div>

      {/* Prev / Next navigation */}
      <nav
        className="flex items-center justify-between gap-4 pt-8 border-t"
        style={{ borderColor: "var(--border)" }}
        aria-label="Period navigation"
      >
        {prev ? (
          <Link
            href={`/map/empires/roman-empire-${prev.slug}`}
            className="btn-secondary gap-2 text-sm"
          >
            <ArrowLeft size={14} />
            <span>
              <span className="block text-xs" style={{ color: "var(--ink-4)" }}>
                Précédent
              </span>
              {formatYear(prev.year)} — {prev.label}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {next ? (
          <Link
            href={`/map/empires/roman-empire-${next.slug}`}
            className="btn-secondary gap-2 text-sm text-right"
          >
            <span>
              <span className="block text-xs" style={{ color: "var(--ink-4)" }}>
                Suivant
              </span>
              {formatYear(next.year)} — {next.label}
            </span>
            <ArrowRight size={14} />
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </article>
  );
}
