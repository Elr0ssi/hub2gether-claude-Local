"use client";

import { useRouter } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Crown, TrendingUp, Swords, Shield, Activity, Lock } from "lucide-react";
import { THEMES } from "@/data/themes";
import type { ThemeId } from "@/types";

const ICONS: Record<string, React.ElementType> = {
  Crown,
  TrendingUp,
  Swords,
  Shield,
  Activity,
};

interface ThemeDropdownProps {
  currentTheme: ThemeId;
}

export function ThemeDropdown({ currentTheme }: ThemeDropdownProps) {
  const router = useRouter();
  const current = THEMES.find((t) => t.id === currentTheme);
  const CurrentIcon = ICONS[current?.icon ?? "Crown"];

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--ink)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <CurrentIcon size={15} />
          {current?.label ?? "Theme"}
          <ChevronDown size={13} style={{ color: "var(--ink-3)" }} />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={6}
          className="z-50 min-w-[200px] rounded-xl overflow-hidden"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-float)",
          }}
        >
          {THEMES.map((theme) => {
            const Icon = ICONS[theme.icon] ?? Crown;
            const isActive = theme.id === currentTheme;

            if (!theme.available) {
              return (
                <DropdownMenu.Item
                  key={theme.id}
                  disabled
                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm cursor-not-allowed opacity-50"
                  style={{ color: "var(--ink-4)", outline: "none" }}
                >
                  <Icon size={14} />
                  <span>{theme.label}</span>
                  <span className="ml-auto flex items-center gap-1 text-xs" style={{ color: "var(--ink-5)" }}>
                    <Lock size={10} />
                    {theme.comingSoonLabel ?? "Soon"}
                  </span>
                </DropdownMenu.Item>
              );
            }

            return (
              <DropdownMenu.Item
                key={theme.id}
                onSelect={() => router.push(`/map/${theme.slug}`)}
                className="flex items-center gap-2.5 px-3 py-2.5 text-sm cursor-pointer transition-colors focus:outline-none"
                style={{
                  color: isActive ? "#0D7A40" : "var(--ink-2)",
                  background: isActive ? "var(--accent-dim)" : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = "var(--surface-2)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }
                }}
              >
                <Icon size={14} />
                <span className="font-medium">{theme.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />
                )}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
