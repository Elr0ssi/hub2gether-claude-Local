import Link from "next/link";
import { jsonLdString } from "@/lib/schema";
import type { QR } from "@/data/seo/textes";

/** Un bloc de données structurées, lisible par les moteurs. */
export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(Array.isArray(data) ? { "@context": "https://schema.org", "@graph": data } : data) }} />;
}

export function Fil({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="sg-fil" aria-label="Fil d'Ariane">
      <ol>
        {items.map((it, i) => (
          <li key={i}>{it.href ? <Link href={it.href}>{it.label}</Link> : <span aria-current="page">{it.label}</span>}</li>
        ))}
      </ol>
    </nav>
  );
}

export function Faq({ titre = "Questions fréquentes", questions }: { titre?: string; questions: QR[] }) {
  if (questions.length === 0) return null;
  return (
    <section className="sg-sec" aria-labelledby="sg-faq">
      <h2 id="sg-faq" className="sg-h2">{titre}</h2>
      <div className="sg-faq">
        {questions.map((x, i) => (
          <details key={i}>
            <summary>{x.q}</summary>
            <p>{x.r}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export const schemaFaq = (questions: QR[]) => ({
  "@type": "FAQPage",
  mainEntity: questions.map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.r } })),
});

export const schemaFil = (items: { label: string; url: string }[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.label, item: it.url })),
});

/** Une courbe toute simple, dessinée côté serveur : lisible sans JavaScript. */
export function Mini({ points, couleur = "#8b5cff", label }: { points: { annee: number; v: number }[]; couleur?: string; label: string }) {
  if (points.length < 2) return null;
  const W = 520;
  const H = 120;
  const min = Math.min(...points.map((p) => p.v));
  const max = Math.max(...points.map((p) => p.v));
  const x = (a: number) => ((a - points[0].annee) / (points[points.length - 1].annee - points[0].annee)) * W;
  const y = (v: number) => H - 8 - ((v - min) / (max - min || 1)) * (H - 16);
  const d = points.map((p, i) => `${i ? "L" : "M"}${x(p.annee).toFixed(1)} ${y(p.v).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="sg-mini" role="img" aria-label={label}>
      <path d={`${d} L${W} ${H} L0 ${H} Z`} fill={couleur} opacity="0.14" />
      <path d={d} fill="none" stroke={couleur} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
