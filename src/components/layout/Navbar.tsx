"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { THEMES } from "@/data/themes";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-16 glass"
      style={{ boxShadow: "var(--shadow-navbar)" }}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between gap-8">
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
        <nav className="hidden md:flex items-center gap-1">
          {THEMES.map((theme) => {
            const isActive =
              pathname === `/map/${theme.slug}` ||
              pathname.startsWith(`/map/${theme.slug}/`);

            if (!theme.available) {
              return (
                <div
                  key={theme.id}
                  className="relative px-3 py-1.5 rounded-lg text-sm font-medium cursor-not-allowed opacity-50 flex items-center gap-1.5"
                  style={{ color: "var(--ink-4)" }}
                  title={`${theme.label} — Coming ${theme.comingSoonLabel ?? "Soon"}`}
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
                    Soon
                  </span>
                </div>
              );
            }

            return (
              <Link
                key={theme.id}
                href={`/map/${theme.slug}`}
                className={cn(
                  "relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150",
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

        {/* CTA */}
        <Link href="/map/empires" className="btn-primary text-sm hidden sm:inline-flex">
          Explore Map
        </Link>
      </div>
    </header>
  );
}
