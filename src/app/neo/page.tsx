import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { NeoDashboard } from "@/components/neo/NeoDashboard";
import { classement, compteurs, serieMondiale } from "@/data/neo/agregats";
import { ARTICLES } from "@/data/articles";
import { THEMES } from "@/data/themes";

export const metadata: Metadata = {
  title: "The Essential Data · La base, en direct",
  description:
    "Soixante-six ans de PIB, d'inflation et de balances commerciales, pays par pays. Parcourez la base, comparez, débattez.",
  alternates: { canonical: "/neo" },
};

/* Les paliers du classement. Le curseur balaie toute la courbe ; le
   classement, lui, n'est calculé que sur ces années — dix rangs par palier
   plutôt que dix rangs par an, et la page reste légère. */
const PALIERS = [1960, 1970, 1980, 1990, 2000, 2010, 2015, 2020, 2023, 2024, 2025];

const LIGNES: Record<string, string> = {
  economy: "PIB, dette, inflation et balances, de 1960 à aujourd'hui.",
  politics: "Régimes, transitions et libertés publiques, pays par pays.",
  epidemics: "Diffusion, létalité et réponses sanitaires comparées.",
  military: "Budgets, effectifs et arsenaux mis en regard.",
  empires: "Ce que les cartes anciennes disent des équilibres actuels.",
  conflicts: "Zones actives, conflits gelés, différends territoriaux.",
};

/**
 * L'accueil « neo ».
 *
 * Page serveur : elle lit le socle, en tire quelques dizaines de nombres et
 * ne transmet qu'eux au navigateur. Les 283 Ko de la base restent côté
 * serveur. L'accueil actuel n'est pas touché — il reste sur `/`.
 */
export default function NeoPage() {
  const points = serieMondiale();
  const derniere = points[points.length - 1].annee;
  const c = compteurs(derniere);

  const classements: Record<number, ReturnType<typeof classement>> = {};
  for (const a of PALIERS) {
    const rangs = classement(a, 10);
    if (rangs.length) classements[a] = rangs;
  }

  /* Un article par rubrique d'abord, puis on complete : sinon la premiere
     rubrique du catalogue occupe toute la rangee. */
  const parTheme = new Map<string, typeof ARTICLES>();
  for (const a of ARTICLES) {
    if (a.theme === "empires") continue;
    const l = parTheme.get(a.theme) ?? [];
    l.push(a);
    parTheme.set(a.theme, l);
  }
  const tournant: typeof ARTICLES = [];
  for (let rang = 0; tournant.length < 8 && rang < 6; rang++) {
    for (const l of parTheme.values()) if (l[rang]) tournant.push(l[rang]);
  }

  const articles = tournant
    .slice(0, 8)
    .map((a) => ({
      slug: a.slug,
      titre: a.title,
      theme: THEMES.find((t) => t.id === a.theme)?.label ?? a.theme,
      minutes: a.readingTime,
      extrait: a.excerpt,
    }));

  const rubriques = THEMES.map((t) => ({
    slug: t.slug,
    label: t.label,
    ligne: LIGNES[t.id] ?? "",
    ouverte: t.id === "economy",
  }));

  if (!c) return null;

  return (
    <div style={{ background: "#07080A", minHeight: "100vh" }}>
      <Navbar />
      <main style={{ paddingTop: "var(--navbar-height)" }}>
        <NeoDashboard
          points={points}
          compteurs={c}
          classements={classements}
          articles={articles}
          rubriques={rubriques}
        />
      </main>
    </div>
  );
}
