"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BookmarkPlus, Check, Languages, Loader2, NotebookPen, Volume2, X } from "lucide-react";
import { ajouterLocal, creer, majLocal, type ElementCarnet } from "@/lib/carnet";
import { envoyerAuCarnet } from "@/app/compte/carnet-actions";
import "./apprentissage.css";

/* ═══════════════════════════════════════════════════════════════════════════
   APPRENDRE EN LISANT : LA BARRE DE SÉLECTION

   Partout sur le site, sélectionner un mot, une phrase ou un passage fait apparaître une petite barre :
   - « Traduire » donne la version dans la langue choisie (l'anglais pour commencer) ;
   - « Garder la traduction » l'ajoute aux cartes de révision (le français d'abord, l'anglais en basculant) ;
   - « Mémoriser le passage » garde le texte, avec sa source, dans les enregistrements.
   Tout est d'abord gardé dans ce navigateur, puis envoyé au compte quand on est connecté.
   ═══════════════════════════════════════════════════════════════════════════ */

const LANGUES = [
  { id: "en", label: "Anglais", court: "EN", actif: true },
  { id: "es", label: "Espagnol", court: "ES", actif: false },
  { id: "de", label: "Allemand", court: "DE", actif: false },
];
const MAX_TRADUCTION = 500;
const MAX_PASSAGE = 2000;

interface Choix {
  texte: string;
  x: number;
  y: number;
  dessous: boolean;
}

function selectionValable(): Choix | null {
  const s = window.getSelection();
  if (!s || s.isCollapsed || s.rangeCount === 0) return null;
  const texte = s.toString().replace(/\s+/g, " ").trim();
  if (texte.length < 2) return null;
  const n = s.anchorNode instanceof Element ? s.anchorNode : s.anchorNode?.parentElement;
  /* Pas dans un champ de saisie, ni dans la barre elle-même, ni là où une page l'a refusé. */
  if (!n || n.closest("input, textarea, select, [contenteditable=''], [contenteditable='true'], .ap-barre, [data-sans-traduction]")) return null;
  const r = s.getRangeAt(0).getBoundingClientRect();
  if (!r.width && !r.height) return null;
  const dessous = r.top < 150;
  return { texte, x: r.left + r.width / 2, y: dessous ? r.bottom + 10 : r.top - 10, dessous };
}

export function SelectionApprentissage() {
  const [choix, setChoix] = useState<Choix | null>(null);
  const [langue, setLangue] = useState("en");
  const [trad, setTrad] = useState<{ texte: string; pour: string } | null>(null);
  const [etat, setEtat] = useState<"repos" | "traduction" | "erreur">("repos");
  const [garde, setGarde] = useState<{ type: "traduction" | "passage"; compte: boolean } | null>(null);
  const barre = useRef<HTMLDivElement>(null);
  const dans = useRef(false);

  const fermer = useCallback(() => {
    setChoix(null);
    setTrad(null);
    setEtat("repos");
    setGarde(null);
  }, []);

  useEffect(() => {
    const lire = () =>
      window.setTimeout(() => {
        if (dans.current) return;
        const c = selectionValable();
        if (!c) return;
        setChoix((p) => {
          if (p?.texte !== c.texte) {
            setTrad(null);
            setEtat("repos");
            setGarde(null);
          }
          return c;
        });
      }, 10);
    const relache = (e: PointerEvent) => {
      if (barre.current?.contains(e.target as Node)) return;
      lire();
    };
    const clavier = (e: KeyboardEvent) => {
      if (e.key === "Escape") fermer();
      else if (e.shiftKey || e.key.startsWith("Arrow")) lire();
    };
    const change = () => {
      if (dans.current) return;
      const s = window.getSelection();
      if (!s || s.isCollapsed) fermer();
    };
    document.addEventListener("pointerup", relache);
    document.addEventListener("keyup", clavier);
    document.addEventListener("selectionchange", change);
    window.addEventListener("scroll", fermer, { passive: true });
    return () => {
      document.removeEventListener("pointerup", relache);
      document.removeEventListener("keyup", clavier);
      document.removeEventListener("selectionchange", change);
      window.removeEventListener("scroll", fermer);
    };
  }, [fermer]);

  const traduire = async () => {
    if (!choix) return;
    if (choix.texte.length > MAX_TRADUCTION) {
      setEtat("erreur");
      return;
    }
    setEtat("traduction");
    try {
      const r = await fetch(`/api/translate?text=${encodeURIComponent(choix.texte)}&langpair=${encodeURIComponent(`fr|${langue}`)}`);
      const d = await r.json();
      if (!r.ok || !d.translation) throw new Error();
      setTrad({ texte: d.translation as string, pour: choix.texte });
      setEtat("repos");
    } catch {
      setEtat("erreur");
    }
  };

  const garder = async (type: "traduction" | "passage") => {
    if (!choix) return;
    const titre = document.title.replace(/\s*[|·]\s*Datlas\s*$/i, "").trim() || null;
    let e: ElementCarnet = creer({
      type,
      texte: choix.texte.slice(0, MAX_PASSAGE),
      traduction: trad?.pour === choix.texte ? trad.texte : null,
      langue,
      source_titre: titre,
      source_url: window.location.pathname + window.location.search,
    });
    e = ajouterLocal(e);
    setGarde({ type, compte: false });
    const r = await envoyerAuCarnet(e).catch(() => ({ ok: false }));
    if (r.ok) {
      majLocal(e);
      setGarde({ type, compte: true });
    }
  };

  const ecouter = () => {
    if (!trad || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(trad.texte);
    u.lang = langue === "en" ? "en-GB" : langue;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  if (!choix) return null;
  const x = Math.max(170, Math.min(window.innerWidth - 170, choix.x));
  const trop = choix.texte.length > MAX_TRADUCTION;

  return (
    <div
      ref={barre}
      className={`ap-barre${choix.dessous ? " ap-barre-d" : ""}`}
      style={{ left: x, top: choix.y }}
      role="dialog"
      aria-label="Apprendre avec la sélection"
      onPointerEnter={() => { dans.current = true; }}
      onPointerLeave={() => { dans.current = false; }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <div className="ap-ligne">
        <span className="ap-langues">
          FR <span aria-hidden="true">→</span>
          {LANGUES.map((l) => (
            <button
              key={l.id}
              type="button"
              className={`ap-l${langue === l.id ? " ap-l-on" : ""}`}
              disabled={!l.actif}
              title={l.actif ? l.label : `${l.label} : bientôt`}
              aria-pressed={langue === l.id}
              onClick={() => { setLangue(l.id); setTrad(null); }}
            >
              {l.court}
            </button>
          ))}
        </span>
        {!trad && (
          <button type="button" className="ap-b ap-b-vif" onClick={traduire} disabled={etat === "traduction" || trop}>
            {etat === "traduction" ? <Loader2 size={14} className="ap-tourne" aria-hidden="true" /> : <Languages size={14} aria-hidden="true" />}
            Traduire
          </button>
        )}
        <button type="button" className="ap-b" onClick={() => garder("passage")} disabled={garde?.type === "passage"}>
          {garde?.type === "passage" ? <Check size={14} aria-hidden="true" /> : <NotebookPen size={14} aria-hidden="true" />}
          {garde?.type === "passage" ? "Mémorisé" : "Mémoriser"}
        </button>
        <button type="button" className="ap-x" onClick={fermer} aria-label="Fermer"><X size={14} /></button>
      </div>

      {trad && (
        <div className="ap-trad">
          <p lang={langue}>{trad.texte}</p>
          <div className="ap-ligne">
            <button type="button" className="ap-b" onClick={ecouter} aria-label="Écouter la traduction"><Volume2 size={14} aria-hidden="true" /> Écouter</button>
            <button type="button" className="ap-b ap-b-vif" onClick={() => garder("traduction")} disabled={garde?.type === "traduction"}>
              {garde?.type === "traduction" ? <Check size={14} aria-hidden="true" /> : <BookmarkPlus size={14} aria-hidden="true" />}
              {garde?.type === "traduction" ? "Dans mes traductions" : "Garder la traduction"}
            </button>
          </div>
        </div>
      )}

      {etat === "erreur" && (
        <p className="ap-msg">{trop ? `Sélection trop longue pour la traduction (${MAX_TRADUCTION} caractères au plus).` : "Traduction indisponible pour le moment."}</p>
      )}
      {trop && etat !== "erreur" && <p className="ap-msg">Plus de {MAX_TRADUCTION} caractères : à mémoriser, pas à traduire d’un bloc.</p>}
      {garde && (
        <p className="ap-msg ap-ok">
          {garde.compte ? "Gardé dans votre espace." : "Gardé sur cet appareil."} <a href="/carnet">Voir mon carnet</a>
        </p>
      )}
    </div>
  );
}
