"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BarChart3, BookMarked, Globe2, MessageSquare, UserRound, ArrowUpRight } from "lucide-react";
import { deconnecter } from "@/app/compte/actions";
import { Pastille } from "./Pastille";
import { FormProfil } from "./FormProfil";
import { TableauDeBord } from "./TableauDeBord";
import "./espace.css";

export interface PaysCompare {
  fr: string;
  pib: number | null;
  pibHab: number | null;
  population: number | null;
}

interface Message { id: string; cible_id: string; texte: string; cree_le: string; titre: string }
interface Favori { slug: string; titre: string; extrait: string; cree_le: string }

const ONGLETS = [
  { id: "dashboard", label: "Mon dashboard", icone: BarChart3 },
  { id: "discussions", label: "Mes discussions", icone: MessageSquare },
  { id: "articles", label: "Mes articles", icone: BookMarked },
  { id: "profil", label: "Profil", icone: UserRound },
] as const;
type Onglet = (typeof ONGLETS)[number]["id"];

const date = (iso: string, long = false) =>
  new Date(iso).toLocaleDateString("fr-FR", long ? { day: "numeric", month: "long", year: "numeric" } : { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });

function fmtPib(v: number) {
  return v >= 1000 ? `${(v / 1000).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} T$` : `${Math.round(v).toLocaleString("fr-FR")} Md$`;
}

const INDIC = [
  { id: "pib", label: "PIB", f: fmtPib },
  { id: "pibHab", label: "PIB par habitant", f: (v: number) => `${Math.round(v).toLocaleString("fr-FR")} $` },
  { id: "population", label: "Population", f: (v: number) => `${v.toLocaleString("fr-FR", { maximumFractionDigits: v >= 100 ? 0 : 1 })} M` },
] as const;

/** Trois pays côte à côte : le choix reste dans ce navigateur. */
function Comparateur({ pays }: { pays: PaysCompare[] }) {
  const [noms, setNoms] = useState<string[]>(["France", "États-Unis", "Chine"]);
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem("visualize-compare") ?? "null");
      if (Array.isArray(s) && s.length === 3) setNoms(s);
    } catch {}
  }, []);
  const change = (i: number, v: string) => {
    const n = noms.map((x, k) => (k === i ? v : x));
    setNoms(n);
    try {
      localStorage.setItem("visualize-compare", JSON.stringify(n));
    } catch {}
  };
  const choisis = noms.map((n) => pays.find((p) => p.fr === n));
  return (
    <div className="es-carte">
      <h3 className="es-h3">Comparer des pays</h3>
      <div className="es-choix">
        {noms.map((n, i) => (
          <select key={i} value={n} onChange={(e) => change(i, e.target.value)} aria-label={`Pays ${i + 1}`}>
            {pays.map((p) => (
              <option key={p.fr} value={p.fr}>{p.fr}</option>
            ))}
          </select>
        ))}
      </div>
      <div className="es-barres">
        {INDIC.map((ind) => {
          const vals = choisis.map((p) => (p ? p[ind.id] : null));
          const max = Math.max(1, ...vals.map((v) => v ?? 0));
          return (
            <div key={ind.id} className="es-ligne">
              <span className="es-ligne-t">{ind.label}</span>
              {vals.map((v, i) => (
                <div key={i} className="es-barre" style={{ "--c": i } as React.CSSProperties}>
                  <i style={{ width: v ? `${Math.max(4, (v / max) * 100)}%` : "0%" }} />
                  <b>{noms[i]}</b>
                  <em>{v ? ind.f(v) : "—"}</em>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function EspaceCompte({
  pseudo,
  email,
  bio,
  role,
  inscritLe,
  widgets,
  sommePib,
  sommePopulation,
  messages,
  favoris,
  pays,
}: {
  pseudo: string;
  email: string;
  bio: string | null;
  role: string;
  inscritLe: string;
  widgets: string[];
  sommePib: number;
  sommePopulation: number;
  messages: Message[];
  favoris: Favori[];
  pays: PaysCompare[];
}) {
  const [onglet, setOnglet] = useState<Onglet>("dashboard");
  useEffect(() => {
    const h = window.location.hash.slice(1) as Onglet;
    if (ONGLETS.some((o) => o.id === h)) setOnglet(h);
  }, []);
  const va = (id: Onglet) => {
    setOnglet(id);
    history.replaceState(null, "", `#${id}`);
  };
  const compte = useMemo(() => ({ messages: messages.length, favoris: favoris.length }), [messages.length, favoris.length]);

  return (
    <div className="es">
      <header className="es-banniere">
        <span className="es-b-lueur" aria-hidden="true" />
        <Pastille pseudo={pseudo} taille={64} />
        <div className="es-b-id">
          <h1>{pseudo}</h1>
          <p>
            {email} · inscrit le {date(inscritLe, true)}
            {role !== "lecteur" && <span className="es-role">{role}</span>}
          </p>
        </div>
        <div className="es-b-stats">
          <span><strong>{compte.messages}</strong> messages</span>
          <span><strong>{compte.favoris}</strong> articles</span>
        </div>
        <form action={deconnecter}>
          <button type="submit" className="es-sortie">Se déconnecter</button>
        </form>
      </header>

      <div className="es-corps">
        <nav className="es-onglets" role="tablist" aria-label="Mon espace">
          {ONGLETS.map((o) => {
            const Ic = o.icone;
            return (
              <button key={o.id} type="button" role="tab" aria-selected={onglet === o.id} className={onglet === o.id ? "on" : ""} onClick={() => va(o.id)}>
                <Ic size={17} aria-hidden="true" />
                {o.label}
              </button>
            );
          })}
        </nav>

        <section className="es-panneau" key={onglet} role="tabpanel">
          {onglet === "dashboard" && (
            <>
              <div className="es-carte es-carte-vif">
                <h3 className="es-h3">Mes compteurs en direct</h3>
                <TableauDeBord widgetsInitial={widgets} sommePib={sommePib} sommePopulation={sommePopulation} />
              </div>
              <Comparateur pays={pays} />
              <div className="es-carte es-globe">
                <span className="es-sph" aria-hidden="true"><i /><b /></span>
                <h3 className="es-h3">Mes globes</h3>
                <p>Retrouvez en un clic les deux globes du site.</p>
                <div className="es-liens">
                  <Link href="/economie"><Globe2 size={16} aria-hidden="true" /> Économie <ArrowUpRight size={14} aria-hidden="true" /></Link>
                  <Link href="/demographie"><Globe2 size={16} aria-hidden="true" /> Démographie <ArrowUpRight size={14} aria-hidden="true" /></Link>
                </div>
              </div>
            </>
          )}

          {onglet === "discussions" && (
            <div className="es-carte">
              <h3 className="es-h3">Mes discussions sur le forum</h3>
              {messages.length === 0 ? (
                <p className="es-vide">Vous n&apos;avez encore rien écrit. <Link href="/forum">Ouvrir le forum</Link></p>
              ) : (
                <ul className="es-liste">
                  {messages.map((m) => (
                    <li key={m.id}>
                      <Link href={`/forum#${m.cible_id}`} className="es-li-t">{m.titre}</Link>
                      <p>{m.texte}</p>
                      <span>{date(m.cree_le)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {onglet === "articles" && (
            <div className="es-carte">
              <h3 className="es-h3">Mes articles enregistrés</h3>
              {favoris.length === 0 ? (
                <p className="es-vide">Rien d&apos;enregistré pour le moment. Les articles que vous gardez apparaîtront ici.</p>
              ) : (
                <ul className="es-liste">
                  {favoris.map((f) => (
                    <li key={f.slug}>
                      <Link href={`/lecture/${f.slug}`} className="es-li-t">{f.titre}</Link>
                      <p>{f.extrait}</p>
                      <span>Enregistré le {date(f.cree_le, true)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {onglet === "profil" && (
            <div className="es-carte es-profil">
              <h3 className="es-h3">Mon profil</h3>
              <FormProfil pseudo={pseudo} bio={bio} />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
