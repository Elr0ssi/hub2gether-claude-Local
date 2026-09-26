import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Decouvrir } from "@/components/decouvrir/Decouvrir";
import { agregatsParAnnee, classement } from "@/data/neo/agregats";
import { ARTICLES } from "@/data/articles";
import { FILS } from "@/data/community/fils";
import { THEMES } from "@/data/themes";

export const metadata: Metadata = {
  title: "Découvrir · The Essential Data",
  description:
    "Une base ouverte de soixante-six ans, des cartes qui répondent, des articles qui citent leurs sources et un forum pour en découdre.",
  alternates: { canonical: "/decouvrir" },
};

export default function DecouvrirPage() {
  const agregats = agregatsParAnnee();
  const derniere = agregats[agregats.length - 1];
  const tete = classement(derniere.annee, 10).map((r) => ({ nom: r.nom, pib: r.pib }));

  /* Le nombre de valeurs réellement portées par la base : on compte, on ne
     l'arrondit pas à un chiffre rond qui ferait mieux. */
  const valeurs = agregats.reduce((n, a) => n + a.pays + a.paysBalance, 0);

  const parTheme = new Map<string, typeof ARTICLES>();
  for (const a of ARTICLES) {
    if (a.theme === "empires") continue;
    const l = parTheme.get(a.theme) ?? [];
    l.push(a);
    parTheme.set(a.theme, l);
  }
  const articles: { slug: string; titre: string; theme: string; minutes: number }[] = [];
  for (let rang = 0; articles.length < 6 && rang < 4; rang++) {
    for (const l of parTheme.values()) {
      if (l[rang] && articles.length < 6) {
        articles.push({
          slug: l[rang].slug,
          titre: l[rang].title,
          theme: THEMES.find((t) => t.id === l[rang].theme)?.label ?? l[rang].theme,
          minutes: l[rang].readingTime,
        });
      }
    }
  }

  return (
    <div style={{ background: "#06070A", minHeight: "100vh" }}>
      <Navbar />
      <main style={{ paddingTop: "var(--navbar-height)" }}>
        <Decouvrir
          chiffres={{
            annees: agregats.length,
            pays: derniere.pays,
            indicateurs: 4,
            valeurs,
            articles: ARTICLES.length,
            fils: FILS.length,
          }}
          tete={tete}
          articles={articles}
          fils={FILS.slice(0, 4).map((f) => ({
            id: f.id,
            titre: f.titre,
            ancre: f.ancre.valeur,
            theme: f.themeLabel,
          }))}
          serie={agregats.map((a) => ({ annee: a.annee, pib: a.pib }))}
        />
      </main>
      <Footer />
    </div>
  );
}
