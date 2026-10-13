import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EnTete, Pied } from "@/components/concept/pieces";
import { Faq, Fil, JsonLd, Mini, schemaFaq, schemaFil } from "@/components/seo/Elements";
import { drapeau } from "@/lib/drapeau";
import { paysParSlug, paysVedettes, serieDe, slugPaire, tousLesPays, voisinsEco, paysParNom } from "@/data/seo/pays";
import { tousLesDossiers } from "@/data/dettes/dossiers";
import { descriptionPays, faqPays, introPays, LIGNES, titrePays } from "@/data/seo/textes";
import { avec, cap, deNom, fmtHabCourt, fmtMdCourt, nf, rangTexte } from "@/data/seo/francais";
import { SITE_URL, urlAbs } from "@/lib/site";
import "@/components/concept/concept.css";
import "@/components/seo/seo.css";
import { adresseDette } from "@/articles/dette/catalogue";

/* Chaque pays a sa page, construite à la compilation ; une page nouvelle se construit à la première visite. */
export const revalidate = 2592000;

export function generateStaticParams() {
  return tousLesPays().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const f = paysParSlug(slug);
  if (!f) return {};
  const url = urlAbs(`/pays/${f.slug}`);
  return {
    title: { absolute: titrePays(f) },
    description: descriptionPays(f),
    alternates: { canonical: `/pays/${f.slug}` },
    openGraph: { type: "article", url, title: `${f.fr} en chiffres : population, PIB, dette`, description: descriptionPays(f), siteName: "Visualize", locale: "fr_FR" },
    twitter: { card: "summary_large_image", title: `${f.fr} en chiffres`, description: descriptionPays(f) },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const f = paysParSlug(slug);
  if (!f) notFound();

  const faq = faqPays(f);
  const voisins = voisinsEco(f, 6);
  const autres = paysVedettes(14).filter((p) => p.nom !== f.nom).slice(0, 12);
  const pib = serieDe(f, "pib");
  const pop = serieDe(f, "population");
  const url = urlAbs(`/pays/${f.slug}`);
  const dossierDette = tousLesDossiers().find((x) => x.nom === f.nom);

  const cartes = LIGNES.flatMap((l, i) => {
    const m = l.get(f);
    if (!m) return [];
    const rang = l.id === "population" ? f.rangs.population : l.id === "pib" ? f.rangs.pib : l.id === "pibHab" ? f.rangs.pibHab : undefined;
    return [{ l, m, rang, vif: i === 0 }];
  });

  const graphe = [
    schemaFil([{ label: "Accueil", url: SITE_URL }, { label: "Pays", url: urlAbs("/pays") }, { label: f.fr, url }]),
    schemaFaq(faq),
    {
      "@type": "WebPage",
      "@id": url,
      url,
      name: titrePays(f),
      description: descriptionPays(f),
      inLanguage: "fr",
      isPartOf: { "@type": "WebSite", name: "Visualize", url: SITE_URL },
      about: { "@type": "Country", name: f.fr, ...(f.iso2 ? { identifier: f.iso2 } : {}) },
    },
    {
      "@type": "Dataset",
      name: `${f.fr} : indicateurs économiques et démographiques`,
      description: descriptionPays(f),
      url,
      creator: { "@type": "Organization", name: "Visualize" },
      license: "https://creativecommons.org/licenses/by/4.0/",
      isBasedOn: ["Banque mondiale, World Development Indicators", "Nations Unies, World Population Prospects 2024"],
      variableMeasured: cartes.map((c) => c.l.label),
      spatialCoverage: f.fr,
      temporalCoverage: "1960/2025",
    },
  ];

  return (
    <div className="cg sg">
      <EnTete />
      <JsonLd data={graphe} />
      <main className="sg-page">
        <Fil items={[{ label: "Accueil", href: "/" }, { label: "Pays", href: "/pays" }, { label: f.fr }]} />
        <h1 className="sg-h1">
          <span className="sg-drap" aria-hidden="true">{drapeau(f.iso2)}</span>
          {f.fr} : <span>chiffres clés</span>
        </h1>
        <p className="sg-intro">{introPays(f)}</p>
        <div className="sg-cta">
          <Link href={`/comparer?pays=${encodeURIComponent(f.nom)},${encodeURIComponent(autres[0]?.nom ?? "France")}`} className="sg-bouton">Comparer {avec(f.fr)}</Link>
          <Link href="/economie" className="sg-bouton sg-bouton-2">Voir sur le globe</Link>
        </div>

        <section className="sg-sec" aria-labelledby="sg-cles">
          <h2 id="sg-cles" className="sg-h2">{f.fr} en chiffres</h2>
          <div className="sg-grille">
            {cartes.map(({ l, m, rang, vif }) => (
              <article key={l.id} className={`sg-carte${vif ? " sg-carte-vif" : ""}`}>
                <h3>{l.label}</h3>
                <strong>{l.fmt(m.v)}</strong>
                <p>
                  {m.annee ? `En ${m.annee}` : "Valeur approchée"}
                  {rang ? ` · ${rangTexte(rang.r)} sur ${rang.n}` : ""}
                </p>
              </article>
            ))}
          </div>
        </section>

        {(pib.length > 1 || pop.length > 1) && (
          <section className="sg-sec" aria-labelledby="sg-evo">
            <h2 id="sg-evo" className="sg-h2">Évolution depuis {pib[0]?.annee ?? pop[0]?.annee}</h2>
            <div className="sg-courbes">
              {pib.length > 1 && (
                <div className="sg-courbe">
                  <h3>PIB {deNom(f.fr)}</h3>
                  <Mini points={pib} label={`Évolution du PIB ${deNom(f.fr)} depuis ${pib[0].annee}`} />
                  <p>{pib[0].annee} : {fmtMdCourt(pib[0].v)} → {pib[pib.length - 1].annee} : {fmtMdCourt(pib[pib.length - 1].v)} (dollars courants)</p>
                </div>
              )}
              {pop.length > 1 && (
                <div className="sg-courbe">
                  <h3>Population {deNom(f.fr)}</h3>
                  <Mini points={pop} couleur="#ff6fa5" label={`Évolution de la population ${deNom(f.fr)} depuis ${pop[0].annee}`} />
                  <p>{pop[0].annee} : {fmtHabCourt(pop[0].v)} → {pop[pop.length - 1].annee} : {fmtHabCourt(pop[pop.length - 1].v)}</p>
                </div>
              )}
            </div>
          </section>
        )}

        <Faq titre={`Questions sur ${avec(f.fr)}`} questions={faq} />

        <section className="sg-sec" aria-labelledby="sg-vs">
          <h2 id="sg-vs" className="sg-h2">Comparer {avec(f.fr)} avec…</h2>
          <ul className="sg-liens">
            {autres.map((p) => (
              <li key={p.slug}>
                <Link href={`/comparer/${slugPaire(f, p)}`}>{cap(f.fr)} ou {p.fr}</Link>
              </li>
            ))}
          </ul>
        </section>

        {dossierDette && (
          <section className="sg-sec" aria-labelledby="sg-dette">
            <h2 id="sg-dette" className="sg-h2">Dette publique</h2>
            <p className="sg-intro" style={{ marginTop: 0 }}>
              {cap(avec(f.fr))} : dette de {nf(dossierDette.p2024, 1)} % du PIB en 2024 ({nf(dossierDette.p2000, 1)} % en 2000).{" "}
              <Link href={adresseDette(dossierDette.slug)}>Lire le dossier : montant, créanciers, inflation →</Link>
            </p>
          </section>
        )}

        {voisins.length > 0 && (
          <section className="sg-sec" aria-labelledby="sg-voisins">
            <h2 id="sg-voisins" className="sg-h2">Des économies de taille comparable</h2>
            <ul className="sg-liens">
              {voisins.map((p) => (
                <li key={p.slug}><Link href={`/pays/${p.slug}`}>{drapeau(p.iso2)} {p.fr}</Link></li>
              ))}
            </ul>
          </section>
        )}

        <p className="sg-note">
          Sources : Banque mondiale (World Development Indicators), FMI, Nations Unies (World Population Prospects 2024). Chaque valeur porte l&apos;année de sa dernière publication ; une grandeur absente des sources n&apos;est pas affichée.
          La superficie est approchée à partir du fond de carte du site. <Link href="/methodologie-donnees">Notre méthode</Link> · <Link href="/pays">Tous les pays</Link>
        </p>
      </main>
      <Pied />
    </div>
  );
}
