import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/layout/Layout";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Méthodologie — The Essential Data",
  description:
    "Découvrez comment The Essential Data collecte, synthétise et vérifie ses données. Transparence totale sur nos sources, notre approche éditoriale et notre conformité EU AI Act.",
  alternates: {
    canonical: "/methodology",
  },
};

const sections = [
  {
    id: "approche",
    title: "Notre approche éditoriale",
    content: [
      "The Essential Data est un média de data-journalisme géopolitique. Chaque article publié est une synthèse éditoriale construite à partir de sources primaires et secondaires vérifiées : rapports d'institutions internationales, presse mondiale de référence, recherches académiques et bases de données ouvertes.",
      "Notre objectif est d'offrir une vision impartiale et multi-perspectives sur des sujets géopolitiques complexes (économie mondiale, épidémies, empires historiques, conflits militaires). Nous agrégeons délibérément des points de vue issus de médias et institutions de différentes zones géographiques et culturelles pour éviter les biais régionaux.",
    ],
  },
  {
    id: "ia",
    title: "Rôle de l'intelligence artificielle",
    content: [
      "Conformément au règlement européen sur l'intelligence artificielle (EU AI Act, Règlement (UE) 2024/1689), nous déclarons explicitement que certains de nos contenus sont rédigés ou synthétisés avec l'assistance d'outils d'intelligence artificielle.",
      "L'IA intervient dans notre processus éditorial à plusieurs étapes : agrégation et résumé de sources multiples, structuration des données chiffrées, traduction et harmonisation terminologique entre sources de langues différentes. Chaque contenu IA-assisté est clairement identifié par le badge « Synthèse IA » visible sur chaque article.",
      "Les données chiffrées présentées dans les visualisations interactives proviennent directement de sources institutionnelles (FMI, Banque mondiale, OMS, SIPRI, etc.) et ne sont pas générées par IA.",
    ],
  },
  {
    id: "sources",
    title: "Sélection et vérification des sources",
    content: [
      "Toutes les sources utilisées sont citées en bas de chaque article. Nous appliquons les critères suivants pour la sélection des sources :",
    ],
    list: [
      "Institutions internationales reconnues : FMI, Banque mondiale, OMS, SIPRI, Nations Unies, OCDE",
      "Médias de référence avec charte éditoriale vérifiable : Reuters, AP, AFP, BBC, Le Monde, Financial Times, etc.",
      "Publications académiques à comité de lecture",
      "Bases de données gouvernementales et statistiques nationales",
      "Sources historiographiques et archives pour les données historiques (AWMC pour la cartographie ancienne)",
    ],
  },
  {
    id: "donnees",
    title: "Données cartographiques et chiffrées",
    content: [
      "Les cartes interactives sont alimentées par des données structurées issues des sources suivantes :",
    ],
    list: [
      "PIB et données économiques : Fonds Monétaire International (FMI), Perspectives de l'économie mondiale (WEO), millésime 2024",
      "Épidémies : Organisation Mondiale de la Santé (OMS/WHO), CDC (Centers for Disease Control and Prevention), ECDC",
      "Données militaires et conflits : SIPRI (Stockholm International Peace Research Institute), IISS",
      "Empires historiques : Ancient World Mapping Center (AWMC, UNC Chapel Hill), Barrington Atlas of the Greek and Roman World",
      "Frontières politiques actuelles : Natural Earth (domaine public), GeoJSON ISO 3166-1",
    ],
  },
  {
    id: "limites",
    title: "Limites et avertissements",
    content: [
      "Les frontières historiques représentées sur les cartes sont des approximations éditoriales. Les empires et entités politiques historiques n'avaient pas de frontières précises au sens moderne du terme ; les délimitations présentées reflètent les travaux historiographiques les plus récents mais restent sujettes à débat académique.",
      "Les données économiques et épidémiologiques sont mises à jour périodiquement ; les chiffres affichés correspondent au millésime indiqué sur chaque visualisation. Des révisions ultérieures des données sources peuvent entraîner des écarts.",
      "Cet outil est destiné à des fins éducatives et journalistiques. Il ne constitue pas un avis professionnel (médical, financier, juridique ou autre).",
    ],
  },
  {
    id: "contact",
    title: "Contact et corrections",
    content: [
      "Si vous identifiez une erreur factuelle, une source mal citée ou un problème méthodologique, nous vous encourageons à nous le signaler. Notre équipe éditoriale s'engage à corriger toute inexactitude dans les meilleurs délais.",
    ],
  },
];

export default function MethodologyPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-12">
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
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ background: "rgba(57,255,136,0.12)", color: "#0D7A40", border: "1px solid rgba(57,255,136,0.3)" }}
            >
              EU AI Act — Conformité
            </span>
          </div>
          <h1
            className="font-black mb-4"
            style={{ color: "var(--ink)", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.025em" }}
          >
            Méthodologie
          </h1>
          <p className="text-base leading-relaxed" style={{ color: "var(--ink-2)", fontSize: "1.0625rem" }}>
            Transparence totale sur nos sources, notre processus éditorial et le rôle de
            l'intelligence artificielle dans la production de nos contenus.
          </p>
        </header>

        {/* Table of contents */}
        <nav
          className="p-5 rounded-2xl mb-10"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
          aria-label="Table des matières"
        >
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--ink-3)" }}>
            Sommaire
          </p>
          <ol className="space-y-1.5">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-sm hover:underline"
                  style={{ color: "var(--ink-2)" }}
                >
                  {i + 1}. {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Sections */}
        <div className="space-y-12">
          {sections.map((section, i) => (
            <section key={section.id} id={section.id}>
              <h2
                className="font-bold mb-4"
                style={{ color: "var(--ink)", fontSize: "1.15rem", letterSpacing: "-0.015em" }}
              >
                <span style={{ color: "var(--ink-4)", marginRight: "0.5rem" }}>{i + 1}.</span>
                {section.title}
              </h2>
              <div className="space-y-3">
                {section.content.map((para, j) => (
                  <p key={j} className="text-sm leading-relaxed" style={{ color: "var(--ink-2)", lineHeight: "1.75" }}>
                    {para}
                  </p>
                ))}
                {section.list && (
                  <ul className="mt-3 space-y-2 pl-4">
                    {section.list.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm" style={{ color: "var(--ink-2)" }}>
                        <span
                          className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full"
                          style={{ background: "var(--accent)" }}
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
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
            <Link href="/sources" className="underline underline-offset-2" style={{ color: "var(--ink-3)" }}>
              Voir toutes les sources de données →
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
