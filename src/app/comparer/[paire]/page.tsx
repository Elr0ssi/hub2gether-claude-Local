import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { EnTete, Pied } from "@/components/concept/pieces";
import { Faq, Fil, JsonLd, schemaFaq, schemaFil } from "@/components/seo/Elements";
import { drapeau } from "@/lib/drapeau";
import { paireParSlug, pairesVedettes, paysVedettes, slugPaire } from "@/data/seo/pays";
import { descriptionDuel, faqDuel, fois, introDuel, LIGNES, titreDuel } from "@/data/seo/textes";
import { avec, cap, deNom, nf } from "@/data/seo/francais";
import { SITE_URL, urlAbs } from "@/lib/site";
import "@/components/concept/concept.css";
import "@/components/seo/seo.css";

/* Les comparaisons des pays les plus recherchés sont construites à la compilation ;
   toute autre paire — Burkina Faso et Congo, France et Irlande — se construit à la première visite. */
export const revalidate = 2592000;
export const dynamicParams = true;

export function generateStaticParams() {
  return pairesVedettes(14).map(([a, b]) => ({ paire: slugPaire(a, b) }));
}

export async function generateMetadata({ params }: { params: Promise<{ paire: string }> }): Promise<Metadata> {
  const { paire } = await params;
  const p = paireParSlug(paire);
  if (!p) return {};
  const url = urlAbs(`/comparer/${p.canonique}`);
  return {
    title: { absolute: titreDuel(p.a, p.b) },
    description: descriptionDuel(p.a, p.b),
    alternates: { canonical: `/comparer/${p.canonique}` },
    openGraph: { type: "article", url, title: `${p.a.fr} ou ${p.b.fr} : la comparaison`, description: descriptionDuel(p.a, p.b), siteName: "Visualize", locale: "fr_FR" },
    twitter: { card: "summary_large_image", title: `${p.a.fr} ou ${p.b.fr}`, description: descriptionDuel(p.a, p.b) },
  };
}

export default async function Page({ params }: { params: Promise<{ paire: string }> }) {
  const { paire } = await params;
  const p = paireParSlug(paire);
  if (!p) notFound();
  /* Une comparaison n'a qu'une adresse : l'ordre inverse y renvoie. */
  if (p.canonique !== paire) permanentRedirect(`/comparer/${p.canonique}`);
  const { a, b } = p;

  const faq = faqDuel(a, b);
  const url = urlAbs(`/comparer/${p.canonique}`);
  const lignes = LIGNES.flatMap((l) => {
    const va = l.get(a);
    const vb = l.get(b);
    return va || vb ? [{ l, va, vb }] : [];
  });
  const autresA = paysVedettes(14).filter((x) => x.nom !== a.nom && x.nom !== b.nom).slice(0, 8);
  const croissance = (f: typeof a) => (f.pib && f.pib1960 && f.pib1960.annee < f.pib.annee ? { x: f.pib.v / f.pib1960.v, depuis: f.pib1960.annee } : null);
  const ca = croissance(a);
  const cb = croissance(b);

  const graphe = [
    schemaFil([{ label: "Accueil", url: SITE_URL }, { label: "Comparer", url: urlAbs("/comparer") }, { label: `${a.fr} ou ${b.fr}`, url }]),
    schemaFaq(faq),
    {
      "@type": "WebPage",
      "@id": url,
      url,
      name: titreDuel(a, b),
      description: descriptionDuel(a, b),
      inLanguage: "fr",
      isPartOf: { "@type": "WebSite", name: "Visualize", url: SITE_URL },
      about: [
        { "@type": "Country", name: a.fr },
        { "@type": "Country", name: b.fr },
      ],
    },
  ];

  return (
    <div className="cg sg">
      <EnTete actif="Comparer" />
      <JsonLd data={graphe} />
      <main className="sg-page">
        <Fil items={[{ label: "Accueil", href: "/" }, { label: "Comparer", href: "/comparer" }, { label: `${a.fr} ou ${b.fr}` }]} />
        <h1 className="sg-h1">{a.fr} <span>ou</span> {b.fr} : la comparaison</h1>
        <p className="sg-intro">{introDuel(a, b)}</p>

        <div className="sg-duel">
          {[a, b].map((f) => (
            <div key={f.slug}>
              <span className="sg-drap" aria-hidden="true">{drapeau(f.iso2)}</span>
              <h2><Link href={`/pays/${f.slug}`}>{f.fr}</Link></h2>
            </div>
          ))}
        </div>

        <div className="sg-cta">
          <Link href={`/comparer?pays=${encodeURIComponent(a.nom)},${encodeURIComponent(b.nom)}`} className="sg-bouton">Ouvrir dans le comparateur</Link>
          <Link href={`/pays/${a.slug}`} className="sg-bouton sg-bouton-2">Fiche {deNom(a.fr)}</Link>
          <Link href={`/pays/${b.slug}`} className="sg-bouton sg-bouton-2">Fiche {deNom(b.fr)}</Link>
        </div>

        <section className="sg-sec" aria-labelledby="sg-tab">
          <h2 id="sg-tab" className="sg-h2">{cap(a.fr)} et {b.fr}, indicateur par indicateur</h2>
          <table className="sg-tab">
            <caption className="sr-only">Comparaison chiffrée de {a.fr} et {b.fr}</caption>
            <thead>
              <tr>
                <th scope="col">Indicateur</th>
                <th scope="col">{a.fr}</th>
                <th scope="col">{b.fr}</th>
                <th scope="col">Écart</th>
              </tr>
            </thead>
            <tbody>
              {lignes.map(({ l, va, vb }) => {
                const ga = va && vb && va.v > vb.v;
                const gb = va && vb && vb.v > va.v;
                return (
                  <tr key={l.id}>
                    <th scope="row">{l.label}</th>
                    <td className={ga ? "sg-gagne" : undefined}>{va ? l.fmt(va.v) : "—"}{va?.annee ? <small>{va.annee}</small> : null}</td>
                    <td className={gb ? "sg-gagne" : undefined}>{vb ? l.fmt(vb.v) : "—"}{vb?.annee ? <small>{vb.annee}</small> : null}</td>
                    <td>{va && vb && va.v > 0 && vb.v > 0 ? `×${nf(Math.max(va.v, vb.v) / Math.min(va.v, vb.v), Math.max(va.v, vb.v) / Math.min(va.v, vb.v) >= 10 ? 0 : 1)}` : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        {(ca || cb) && (
          <section className="sg-sec" aria-labelledby="sg-evo">
            <h2 id="sg-evo" className="sg-h2">Depuis {ca?.depuis ?? cb?.depuis}</h2>
            <p className="sg-intro">
              {[
                ca && `Le PIB ${deNom(a.fr)} a été multiplié par ${nf(ca.x, ca.x >= 10 ? 0 : 1)} depuis ${ca.depuis}`,
                cb && `celui ${deNom(b.fr)} par ${nf(cb.x, cb.x >= 10 ? 0 : 1)} depuis ${cb.depuis}`,
              ]
                .filter(Boolean)
                .join(", ")}{" "}
              (dollars courants).
              {a.pib && b.pib && a.pib1960 && b.pib1960
                ? ` L'écart entre les deux économies est aujourd'hui de ${fois(a.pib.v, b.pib.v)}, contre ${fois(a.pib1960.v, b.pib1960.v)} au départ.`
                : ""}
            </p>
          </section>
        )}

        <Faq titre={`Questions sur ${avec(a.fr)} et ${avec(b.fr)}`} questions={faq} />

        <section className="sg-sec" aria-labelledby="sg-plus">
          <h2 id="sg-plus" className="sg-h2">Autres comparaisons</h2>
          <ul className="sg-liens">
            {autresA.map((x) => (
              <li key={`a-${x.slug}`}><Link href={`/comparer/${slugPaire(a, x)}`}>{cap(a.fr)} ou {x.fr}</Link></li>
            ))}
            {autresA.map((x) => (
              <li key={`b-${x.slug}`}><Link href={`/comparer/${slugPaire(b, x)}`}>{cap(b.fr)} ou {x.fr}</Link></li>
            ))}
          </ul>
        </section>

        <p className="sg-note">
          Sources : Banque mondiale (WDI), FMI, Nations Unies (World Population Prospects 2024). Chaque valeur est la dernière publiée, avec son année. Superficies approchées à partir du fond de carte du site.{" "}
          <Link href="/methodologie-donnees">Notre méthode</Link> · <Link href="/pays">Tous les pays</Link>
        </p>
      </main>
      <Pied />
    </div>
  );
}
