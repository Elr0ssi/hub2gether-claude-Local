import Link from "next/link";
import { Globe } from "lucide-react";
import { THEMES } from "@/data/themes";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t mt-20"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: "var(--accent)" }}
              >
                <Globe size={14} color="#000" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-sm" style={{ color: "var(--ink)" }}>
                The Essential Data
              </span>
            </div>
            <p className="text-small max-w-xs leading-relaxed">
              Premium geopolitical data journalism. Explore history and power through
              interactive maps, data visualisation and editorial analysis.
            </p>
          </div>

          {/* Themes */}
          <div>
            <p className="section-title mb-4">Themes</p>
            <ul className="space-y-2">
              {THEMES.map((theme) => (
                <li key={theme.id}>
                  {theme.available ? (
                    <Link
                      href={`/map/${theme.slug}`}
                      className="text-small hover:text-[var(--ink)] transition-colors"
                    >
                      {theme.label}
                    </Link>
                  ) : (
                    <span className="text-small opacity-50 cursor-not-allowed">
                      {theme.label}{" "}
                      <span style={{ fontSize: "0.7rem" }}>
                        — {theme.comingSoonLabel ?? "Soon"}
                      </span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <p className="section-title mb-4">About</p>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/methodology"
                  className="text-small hover:text-[var(--ink)] transition-colors"
                >
                  Data Methodology
                </Link>
              </li>
              <li>
                <Link
                  href="/sources"
                  className="text-small hover:text-[var(--ink)] transition-colors"
                >
                  Data Sources
                </Link>
              </li>
              <li>
                <Link
                  href="/articles"
                  className="text-small hover:text-[var(--ink)] transition-colors"
                >
                  All Articles
                </Link>
              </li>
              <li>
                <a
                  href="https://awmc.unc.edu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-small hover:text-[var(--ink)] transition-colors"
                >
                  AWMC — Map Sources
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <p className="text-caption">
            © {year} The Essential Data. Historical boundaries are approximate and for
            editorial purposes.
          </p>
          <p className="text-caption flex items-center gap-1">
            Built with verified historical sources ·
            <a
              href="https://awmc.unc.edu"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-[var(--ink-2)] transition-colors"
            >
              AWMC
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
