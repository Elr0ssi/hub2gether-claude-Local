import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { NeoConsole } from "@/components/neo/NeoConsole";
import { agregatsParAnnee, classementsParAnnee } from "@/data/neo/agregats";
import { ARTICLES } from "@/data/articles";
import { THEMES } from "@/data/themes";

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

  return (
    <div style={{ background: "#06070A", minHeight: "100vh" }}>
      <Navbar />
      <main style={{ paddingTop: "var(--navbar-height)" }}>
        <NeoConsole agregats={agregats} rangs={rangs} articles={articles} />
      </main>
    </div>
  );
}
