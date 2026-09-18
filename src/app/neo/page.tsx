import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { NeoConsole } from "@/components/neo/NeoConsole";
import { agregatsParAnnee, classementsParAnnee } from "@/data/neo/agregats";
import { ARTICLES } from "@/data/articles";
import { THEMES } from "@/data/themes";
import { FILS } from "@/data/community/fils";

export const metadata: Metadata = {
  title: "La base, en direct · The Essential Data",
  description:
    "Soixante-six ans de PIB, d'inflation et de balances commerciales. Un curseur d'année pilote la courbe, les compteurs et le classement en même temps.",
  alternates: { canonical: "/neo" },
};

/**
 * La console.
 *
 * Page serveur : elle lit le socle, en tire les agrégats de chaque année et
 * le top 8 de chaque année, et n'envoie que cela au navigateur. Les 283 Ko
 * de la base restent côté serveur. L'accueil actuel n'est pas touché.
 */
export default function NeoPage() {
  const agregats = agregatsParAnnee();
  const rangs = classementsParAnnee(8);

  /* Un article par rubrique d'abord : sinon la première du catalogue occupe
     toute la colonne. */
  const parTheme = new Map<string, typeof ARTICLES>();
  for (const a of ARTICLES) {
    if (a.theme === "empires") continue;
    const l = parTheme.get(a.theme) ?? [];
    l.push(a);
    parTheme.set(a.theme, l);
  }
  const articles: { slug: string; titre: string; theme: string }[] = [];
  for (let rang = 0; articles.length < 4 && rang < 4; rang++) {
    for (const l of parTheme.values()) {
      if (l[rang] && articles.length < 4) {
        articles.push({
          slug: l[rang].slug,
          titre: l[rang].title,
          theme: THEMES.find((t) => t.id === l[rang].theme)?.label ?? l[rang].theme,
        });
      }
    }
  }

  /* La une : le premier article du tour de rubriques, puis les suivants. */
  const tous = [...parTheme.values()].flatMap((l) => l.slice(0, 2));
  const vedette = tous[0] ?? ARTICLES[0];
  const une = {
    slug: vedette.slug,
    titre: vedette.title,
    theme: THEMES.find((t) => t.id === vedette.theme)?.label ?? vedette.theme,
    chapo: vedette.excerpt,
    minutes: vedette.readingTime,
  };
  const secondaires = tous
    .filter((a) => a.slug !== vedette.slug)
    .slice(0, 4)
    .map((a) => ({
      slug: a.slug,
      titre: a.title,
      theme: THEMES.find((t) => t.id === a.theme)?.label ?? a.theme,
      minutes: a.readingTime,
    }));

  const LIGNES: Record<string, string> = {
    economy: "PIB, dette, inflation et balances, depuis 1960.",
    politics: "Régimes, transitions et libertés publiques.",
    epidemics: "Diffusion, létalité et réponses comparées.",
    military: "Budgets, effectifs et arsenaux en regard.",
    empires: "Ce que les cartes anciennes disent d'aujourd'hui.",
    conflicts: "Zones actives et différends territoriaux.",
  };

  return (
    <div style={{ background: "#06070A", minHeight: "100vh" }}>
      <Navbar />
      <main style={{ paddingTop: "var(--navbar-height)" }}>
        <NeoConsole
          agregats={agregats}
          rangs={rangs}
          articles={articles}
          une={une}
          secondaires={secondaires}
          fils={FILS.slice(0, 4).map((f) => ({
            id: f.id,
            titre: f.titre,
            ancre: f.ancre.valeur,
            libelle: f.ancre.libelle,
            theme: f.themeLabel,
          }))}
          terrains={THEMES.map((t) => ({
            slug: t.slug,
            label: t.label,
            ligne: LIGNES[t.id] ?? "",
            ouverte: t.id === "economy",
          }))}
        />
      </main>
    </div>
  );
}
