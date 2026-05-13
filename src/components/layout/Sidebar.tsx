"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Swords,
  Users,
  Rss,
  User,
  Trophy,
  CreditCard,
  BarChart3,
  Zap,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    group: "Main",
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
      { href: "/matchmaking", label: "Matchmaking", icon: Swords },
      { href: "/communities", label: "Communities", icon: Users },
      { href: "/feed", label: "Activity Feed", icon: Rss },
    ],
  },
  {
    group: "Personal",
    items: [
      { href: "/profile", label: "My Profile", icon: User },
      { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
      { href: "/payments", label: "Payments", icon: CreditCard },
    ],
  },
  {
    group: "Company",
    items: [
      { href: "/admin", label: "Analytics", icon: BarChart3 },
    ],
  },
];

const sidebarVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

const itemVariants = {
  hidden: { x: -8, opacity: 0 },
  visible: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: { delay: i * 0.04, duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function Sidebar() {
  const pathname = usePathname();

  let index = 0;

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      className="fixed left-0 top-0 h-screen w-[240px] z-40 flex flex-col"
      style={{
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderRight: "1px solid rgba(232,232,232,0.8)",
        boxShadow: "4px 0 24px rgba(0,0,0,0.04)",
      }}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-[#F2F2F2] shrink-0">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #39FF88 0%, #00E5FF 100%)",
              boxShadow: "0 0 12px rgba(57,255,136,0.3)",
            }}
          >
            <Zap className="w-4 h-4 text-black" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-ink tracking-tight leading-none">
              HUB2gether
            </span>
            <span className="text-[10px] text-ink-4 leading-none mt-0.5">
              emlyon business school
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {NAV_ITEMS.map((group) => (
          <div key={group.group}>
            <p className="section-title px-2 mb-1.5">{group.group}</p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const currentIndex = index++;
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <motion.li
                    key={item.href}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    custom={currentIndex}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group",
                        isActive
                          ? "text-ink"
                          : "text-ink-3 hover:text-ink hover:bg-surface-2"
                      )}
                      style={
                        isActive
                          ? {
                              background: "rgba(57,255,136,0.10)",
                              color: "#0A0A0A",
                            }
                          : {}
                      }
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 rounded-xl"
                          style={{
                            background: "rgba(57,255,136,0.10)",
                            border: "1px solid rgba(57,255,136,0.2)",
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                          }}
                        />
                      )}

                      <Icon
                        className={cn(
                          "w-4 h-4 shrink-0 transition-all duration-200 relative z-10",
                          isActive ? "text-[#39FF88]" : "text-ink-4 group-hover:text-ink-2"
                        )}
                        style={
                          isActive
                            ? { filter: "drop-shadow(0 0 6px rgba(57,255,136,0.5))" }
                            : {}
                        }
                      />

                      <span className="relative z-10 flex-1">{item.label}</span>

                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-1.5 h-1.5 rounded-full relative z-10"
                          style={{
                            background: "#39FF88",
                            boxShadow: "0 0 6px rgba(57,255,136,0.6)",
                          }}
                        />
                      )}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User card */}
      <div className="p-3 border-t border-[#F2F2F2] shrink-0">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-2 transition-all duration-200 group">
          <div className="relative">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold text-black"
              style={{
                background: "linear-gradient(135deg, #39FF88 0%, #00E5FF 100%)",
              }}
            >
              VE
            </div>
            <div
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white"
              style={{ background: "#39FF88" }}
            />
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-xs font-semibold text-ink truncate">Valentine E.</p>
            <p className="text-[11px] text-ink-4 truncate">Marketing Manager</p>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-ink-5 group-hover:text-ink-3 transition-colors" />
        </button>
      </div>
    </motion.aside>
  );
}
