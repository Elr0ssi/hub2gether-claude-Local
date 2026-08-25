"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Globe, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { THEMES } from "@/data/themes";

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
    router.push("/soutenance-2");
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
          <Link
            href="/preview"
            className={cn(
              "relative px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150",
              pathname === "/preview"
                ? "bg-[rgba(57,255,136,0.12)] text-[#0D7A40]"
                : "text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)]"
            )}
          >
            Présentation
            {pathname === "/preview" && (
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                style={{ background: "var(--accent)" }}
              />
            )}
          </Link>
          <Link
            href="/soutenance-2"
            className={cn(
              "relative px-2.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-150",
              pathname === "/soutenance-2"
                ? "bg-[rgba(57,255,136,0.12)] text-[#0D7A40]"
                : "text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)]"
            )}
          >
            Soutenance 2
            {pathname === "/soutenance-2" && (
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
          <Link
            href="/presentation"
            className={cn(
              // The navbar already runs past the viewport below ~1100px with
              // seven tabs; an eighth would push "Comparer" further off. The
              // deck is an internal tool, so its tab only appears where there
              // is room — below lg the navbar is exactly as it was.
              "relative hidden xl:inline-block px-2.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-150",
              pathname === "/presentation"
                ? "bg-[rgba(57,255,136,0.12)] text-[#0D7A40]"
                : "text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)]"
            )}
          >
            Soutenance
            {pathname === "/presentation" && (
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                style={{ background: "var(--accent)" }}
              />
            )}
          </Link>
          {THEMES.map((theme) => {
            const isActive =
              pathname === `/map/${theme.slug}` ||
              pathname.startsWith(`/map/${theme.slug}/`);

            if (!theme.available) {
              return (
                <div
                  key={theme.id}
                  className="relative px-2.5 py-1.5 rounded-lg text-sm font-medium cursor-not-allowed opacity-50 flex items-center gap-1.5"
                  style={{ color: "var(--ink-4)" }}
                  title={`${theme.label}, Bientôt disponible ${theme.comingSoonLabel ?? ""}`}
                >
                  {theme.label}
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-md font-semibold"
                    style={{
                      background: "var(--surface-2)",
                      color: "var(--ink-4)",
                      fontSize: "0.65rem",
                    }}
                  >
                    Bientôt
                  </span>
                </div>
              );
            }

            return (
              <Link
                key={theme.id}
                href={`/map/${theme.slug}`}
                className={cn(
                  "relative px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-[rgba(57,255,136,0.12)] text-[#0D7A40]"
                    : "text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)]"
                )}
              >
                {theme.label}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                    style={{ background: "var(--accent)" }}
                  />
                )}
              </Link>
            );
          })}
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

          <Link href="/comparaison" className="btn-primary text-sm hidden sm:inline-flex">
            Comparer
          </Link>
        </div>
      </div>
    </header>
  );
}
