"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BarChart3, BookMarked, MessageSquare, UserRound } from "lucide-react";
import { deconnecter } from "@/app/compte/actions";
import { Pastille } from "./Pastille";
import { FormProfil } from "./FormProfil";
import { TableauWidgets, type PaysCompare } from "./TableauWidgets";
import "./espace.css";

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
            <TableauWidgets widgetsInitial={widgets} sommePib={sommePib} sommePopulation={sommePopulation} pays={pays} />
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
