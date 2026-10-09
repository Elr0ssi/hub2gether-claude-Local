"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Globe, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { LienCompte } from "@/components/compte/LienCompte";

/* Le menu ne montre plus qu'Économie parmi les anciens thèmes : les autres
   (Empires, Politique, Conflits, Militaire, Épidémies) ne sont pas repris
   dans le concept, et Économie reste comme base au cas où on la retravaille. */

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const present = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // Le navigateur peut refuser ; la soutenance s'ouvre quand même.
    }
    router.push("/soutenance-4");
  };

  return (
    <header
      className="site-nav fixed top-0 left-0 right-0 z-50 h-16 glass"
      style={{ boxShadow: "var(--shadow-navbar)" }}
    >
      <div className="site-nav-row max-w-7xl mx-auto px-6 h-full flex items-center justify-between gap-8">
        {/* Wordmark */}
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0 group"
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "var(--accent)", boxShadow: "var(--shadow-glow-sm)" }}
          >
            <Globe size={14} color="#000" strokeWidth={2.5} />
          </div>
          <span
            className="font-bold text-sm tracking-tight"
            style={{ color: "var(--ink)", letterSpacing: "-0.02em" }}
          >
            The Essential Data
          </span>
        </Link>

        {/* Theme navigation */}
        {/* nowrap keeps the row a single line once the eighth tab appears at xl */}
        <nav className="hidden md:flex items-center gap-0.5 whitespace-nowrap">
          {/* Les entrees « neo ». Elles s'ajoutent, elles ne remplacent rien :
              l'accueil actuel reste sur / et les anciennes pages sont
              inchangees. */}
          {/* Le prototype de direction artistique. La page reste autonome —
              elle n'affiche pas cette barre — mais il faut pouvoir y entrer
              depuis le site. */}
          <Link
            href="/concept-globe"
            className={cn(
              "relative px-2.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-150",
              pathname === "/concept-globe"
                ? "bg-[rgba(57,255,136,0.12)] text-[#0D7A40]"
                : "text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)]"
            )}
          >
            Concept
            {pathname === "/concept-globe" && (
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                style={{ background: "var(--accent)" }}
              />
            )}
          </Link>
          <Link
            href="/test-article"
            className={cn(
              "relative px-2.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-150",
              pathname.startsWith("/test-article")
                ? "bg-[rgba(57,255,136,0.12)] text-[#0D7A40]"
                : "text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)]"
            )}
          >
            Test Article
            {pathname.startsWith("/test-article") && (
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                style={{ background: "var(--accent)" }}
              />
            )}
          </Link>
          {/* Le seul ancien thème encore dans le menu : une base à
              retravailler si besoin, pas une rubrique active. Les autres
              (Empires, Politique, Conflits, Militaire, Épidémies) ne sont
              plus dans le concept. */}
          <Link
            href="/map/economy"
            className={cn(
              "relative px-2.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-150",
              pathname === "/map/economy" || pathname.startsWith("/map/economy/")
                ? "bg-[rgba(57,255,136,0.12)] text-[#0D7A40]"
                : "text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)]"
            )}
          >
            Économie
            {(pathname === "/map/economy" || pathname.startsWith("/map/economy/")) && (
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                style={{ background: "var(--accent)" }}
              />
            )}
          </Link>
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          {/* Présenter — passe l'onglet en plein écran, puis ouvre la soutenance.
              La demande de plein écran part du clic lui-même, et la navigation
              qui suit reste dans le même document : le mode tient jusqu'à la
              fin de la présentation. Demandé après coup, sur une page déjà
              chargée, le navigateur refuse faute de geste utilisateur. */}
          <button
            type="button"
            onClick={present}
            title="Présenter la soutenance en plein écran"
            aria-label="Présenter la soutenance en plein écran"
            className="hidden sm:inline-flex items-center justify-center rounded-lg transition-colors"
            style={{
              width: 32,
              height: 32,
              border: "1px solid var(--border)",
              color: "var(--ink-3)",
              background: "var(--surface)",
            }}
          >
            <Maximize2 size={14} />
          </button>

          <LienCompte className="hidden sm:inline-flex items-center px-2.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)] transition-all duration-150" />

          <Link href="/comparaison" className="btn-primary text-sm hidden sm:inline-flex">
            Comparer
          </Link>
        </div>
      </div>
    </header>
  );
}
