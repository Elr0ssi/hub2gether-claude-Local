"use client";

import { ArrowRight, ArrowUpRight, MessageCircle, TrendingUp } from "lucide-react";
import type { FicheArticle } from "@/data/concept/conceptGeo";
import "./neo.css";

/* ═══════════════════════════════════════════════════════════════════════════
   LES ANALYSES — UN DEUXIÈME ESSAI, EN NÉO-MÉDIA

   Même matière que « Sujets à la une », autre langage : des cartes très
   arrondies, un violet qui tient la une, de gros chiffres posés d'emblée et
   des pastilles qui flottent. L'idée vient des néo-banques : on montre le
   montant avant d'expliquer quoi que ce soit.

   Les nombres viennent de la base d'articles et du socle ; rien n'est écrit
   à la main ici, sauf les libellés.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface DetteResume {
  montant: number;
  ratio: number;
  deficit: number;
  /** Le ratio dette/PIB, année après année, pour dessiner la courbe. */
  points: number[];
}

const nf = (v: number, d = 1) =>
  v.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });

/** Une courbe sans axes : sa forme dit la trajectoire, le chiffre dit le reste. */
function Courbette({ points }: { points: number[] }) {
  if (points.length < 2) return null;
  const bas = Math.min(...points);
  const haut = Math.max(...points);
  const ampl = haut - bas || 1;
  const W = 320;
  const H = 96;
  const xy = points.map((p, i) => [
    (i / (points.length - 1)) * W,
    H - 8 - ((p - bas) / ampl) * (H - 20),
  ]);
  const d = xy.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const [fx, fy] = xy[xy.length - 1];
  return (
    <svg className="nx-courbe" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="nx-aire" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L${W} ${H} L0 ${H} Z`} fill="url(#nx-aire)" />
      <path d={d} fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <circle cx={fx} cy={fy} r="4.5" fill="#fff" />
    </svg>
  );
}

export function AnalysesNeo({ articles, dette }: { articles: FicheArticle[]; dette: DetteResume }) {
  return (
    <section className="cg-section nx" id="analyses" aria-labelledby="nx-t">
      <div className="cg-wrap">
        <header className="nx-tete">
          <p className="nx-puce">
            <span aria-hidden="true" />
            Analyses
          </p>
          <h2 id="nx-t" className="nx-h2">
            Un chiffre, puis tout ce qu&apos;il y a derrière.
          </h2>
          <p className="nx-sous">
            Des dossiers qui posent le montant d&apos;abord, et n&apos;expliquent que ce que le
            chiffre ne dit pas.
          </p>
        </header>

        <div className="nx-bento">
          {/* ── La une : la dette, en grand ──────────────────────────────── */}
          <a href="/france/economie/dette-publique-v2" className="nx-carte nx-une">
            <span className="nx-etiq">Dossier · Économie · France</span>
            <h3 className="nx-une-t">Dette publique de la France</h3>
            <p className="nx-une-v">
              {nf(dette.montant)}
              <small>Md€</small>
            </p>
            <p className="nx-une-s">fin du premier trimestre 2026, d&apos;où elle vient, qui la détient, ce qu&apos;elle coûte.</p>
            <Courbette points={dette.points} />

            <span className="nx-flotte nx-flotte-a">
              <TrendingUp size={15} aria-hidden="true" />
              {nf(dette.ratio)} % du PIB
            </span>
            <span className="nx-flotte nx-flotte-b">−{nf(dette.deficit)} Md€ de déficit en 2025</span>

            <span className="nx-cta">
              Lire le dossier <ArrowRight size={17} aria-hidden="true" />
            </span>
          </a>

          {/* ── Même sujet, lecture longue ───────────────────────────────── */}
          <a href="/france/economie/dette-publique" className="nx-carte nx-longue">
            <span className="nx-etiq">Lecture longue</span>
            <h3 className="nx-t">Le même sujet, pas à pas</h3>
            <p className="nx-p">L&apos;article complet : mécanismes, schémas, quiz et questions fréquentes.</p>
            <ArrowUpRight className="nx-fl" size={22} aria-hidden="true" />
          </a>

          {/* ── Le forum ─────────────────────────────────────────────────── */}
          <a href="/forum" className="nx-carte nx-forum">
            <MessageCircle size={22} aria-hidden="true" className="nx-ico" />
            <h3 className="nx-t">Une question ? Venez en discuter.</h3>
            <p className="nx-p">Le forum de Visualize, autour des chiffres du jour.</p>
            <ArrowUpRight className="nx-fl" size={22} aria-hidden="true" />
          </a>

          {/* ── Les autres analyses ──────────────────────────────────────── */}
          {articles.slice(0, 4).map((a, i) => (
            <a key={a.slug} href={`/articles/${a.slug}`} className="nx-carte nx-petite">
              <span className="nx-etiq">
                {a.rubrique} · {a.duree}
              </span>
              <h3 className="nx-t">{a.titre}</h3>
              <span className="nx-num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <ArrowUpRight className="nx-fl" size={20} aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
