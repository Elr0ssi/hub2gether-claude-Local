"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";
import {
  MapPin,
  Trophy,
  Zap,
  Flame,
  Star,
  TrendingUp,
  Award,
  ChevronRight,
  Edit,
  Share2,
  Shield,
  Target,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { cn } from "@/lib/utils";

/* ── DATA ─────────────────────────────────────── */

const radarData = [
  { subject: "Football", A: 55 },
  { subject: "Tennis", A: 75 },
  { subject: "Padel", A: 85 },
  { subject: "Running", A: 45 },
  { subject: "Yoga", A: 30 },
  { subject: "Basketball", A: 50 },
];

const progressData = [
  { month: "Oct", xp: 800 },
  { month: "Nov", xp: 1200 },
  { month: "Dec", xp: 980 },
  { month: "Jan", xp: 1400 },
  { month: "Feb", xp: 1650 },
  { month: "Mar", xp: 1980 },
];

const MATCH_HISTORY = [
  {
    sport: "🏓",
    opponent: "Thomas M.",
    result: "Win",
    score: "6-3, 7-5",
    date: "May 11",
    xp: "+45",
  },
  {
    sport: "🎾",
    opponent: "Romain C.",
    result: "Loss",
    score: "4-6, 3-6",
    date: "May 8",
    xp: "+18",
  },
  {
    sport: "🏓",
    opponent: "Sophie B.",
    result: "Win",
    score: "6-1, 6-4",
    date: "May 5",
    xp: "+45",
  },
  {
    sport: "⚽",
    opponent: "Football Team A",
    result: "Win",
    score: "3-1",
    date: "May 2",
    xp: "+30",
  },
  {
    sport: "🎾",
    opponent: "Marie L.",
    result: "Win",
    score: "6-4, 6-3",
    date: "Apr 28",
    xp: "+45",
  },
];

const BADGES = [
  { emoji: "⚡", name: "Early Bird", desc: "Played 5 morning matches", rarity: "Common", earned: true },
  { emoji: "🏆", name: "Champion", desc: "Won a tournament", rarity: "Rare", earned: true },
  { emoji: "🔥", name: "On Fire", desc: "7-day activity streak", rarity: "Common", earned: true },
  { emoji: "🎯", name: "Consistent", desc: "Played 20 matches", rarity: "Common", earned: true },
  { emoji: "⭐", name: "All-Rounder", desc: "Play 5 different sports", rarity: "Rare", earned: false },
  { emoji: "👑", name: "Legend", desc: "Reach #1 in company ranking", rarity: "Legendary", earned: false },
];

const SPORTS_STATS = [
  { sport: "🏓", name: "Padel", matches: 14, wins: 10, level: "Advanced", color: "#3B82F6" },
  { sport: "🎾", name: "Tennis", matches: 9, wins: 6, level: "Intermediate", color: "#8B5CF6" },
  { sport: "⚽", name: "Football", matches: 8, wins: 4, level: "Casual", color: "#F59E0B" },
  { sport: "🏃", name: "Running", matches: 5, wins: 5, level: "Beginner", color: "#10B981" },
];

/* ── PAGE ─────────────────────────────────────── */

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"stats" | "history" | "badges">("stats");

  const winTotal = MATCH_HISTORY.filter(m => m.result === "Win").length;
  const winRate = Math.round((winTotal / MATCH_HISTORY.length) * 100);

  return (
    <DashboardLayout>
      <div className="max-w-[1200px] mx-auto space-y-6">

        {/* ── HERO ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0A0A0A 0%, #111827 50%, #0D1A14 100%)",
            minHeight: 220,
          }}
        >
          {/* Glow orb */}
          <div
            className="absolute -top-16 right-32 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(57,255,136,0.15) 0%, transparent 70%)" }}
          />

          {/* Content */}
          <div className="relative z-10 p-8 flex items-start gap-6">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="relative shrink-0"
            >
              <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-black text-black"
                style={{
                  background: "linear-gradient(135deg, #39FF88 0%, #00E5FF 100%)",
                  boxShadow: "0 0 32px rgba(57,255,136,0.4)",
                }}
              >
                VE
              </div>
              <div
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl flex items-center justify-center text-sm"
                style={{ background: "#0A0A0A", border: "2px solid rgba(57,255,136,0.5)" }}
              >
                🏓
              </div>
            </motion.div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-black text-white">Valentine Escalettes</h1>
                <div
                  className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold"
                  style={{ background: "rgba(57,255,136,0.15)", color: "#39FF88", border: "1px solid rgba(57,255,136,0.3)" }}
                >
                  <Shield className="w-3 h-3" />
                  Level 12
                </div>
              </div>
              <p className="text-sm mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>
                Marketing Manager · emlyon business school
              </p>
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center gap-1 text-xs font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
                  <MapPin className="w-3 h-3" />
                  Lyon, France
                </span>
                <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Member since Oct 2024
                </span>
              </div>

              {/* XP Bar */}
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 shrink-0" style={{ color: "#39FF88" }} />
                <div className="flex-1 max-w-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white">1,980 XP</span>
                    <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>Level 13 at 2,500 XP</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "79%" }}
                      transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, #39FF88, #00E5FF)", boxShadow: "0 0 8px rgba(57,255,136,0.5)" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-start gap-2 shrink-0">
              <button
                className="flex items-center gap-2 h-9 px-4 rounded-xl text-sm font-semibold text-black"
                style={{ background: "#39FF88" }}
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
              <button className="w-9 h-9 flex items-center justify-center rounded-xl text-white/50 hover:text-white transition-colors border border-white/10">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div className="relative z-10 px-8 pb-6 pt-2 border-t border-white/[0.08] grid grid-cols-6 gap-4">
            {[
              { label: "Matches", value: "23" },
              { label: "Win Rate", value: `${winRate}%` },
              { label: "Streak", value: "8🔥" },
              { label: "XP", value: "1,980" },
              { label: "Rank", value: "#3" },
              { label: "Badges", value: "4" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p
                  className="text-xl font-black"
                  style={{ color: i === 0 || i === 3 ? "#39FF88" : "#FFFFFF" }}
                >
                  {s.value}
                </p>
                <p className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── TABS ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-center gap-1 p-1 bg-white rounded-2xl border border-[#E8E8E8] w-fit"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
        >
          {(["stats", "history", "badges"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all duration-200",
                activeTab === tab
                  ? "bg-ink text-white shadow-sm"
                  : "text-ink-4 hover:text-ink"
              )}
            >
              {tab === "stats" ? "📊 Stats" : tab === "history" ? "🕒 History" : "🏅 Badges"}
            </button>
          ))}
        </motion.div>

        {/* ── STATS TAB ── */}
        {activeTab === "stats" && (
          <div className="grid grid-cols-12 gap-5">
            {/* Radar */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="col-span-4 bg-white rounded-2xl border border-[#E8E8E8] p-6"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
            >
              <h3 className="text-sm font-bold text-ink mb-4">Sports Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#E8E8E8" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#9B9B9B" }} />
                  <Radar name="me" dataKey="A" stroke="#39FF88" fill="#39FF88" fillOpacity={0.15} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Progress chart */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="col-span-8 bg-white rounded-2xl border border-[#E8E8E8] p-6"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-ink">XP Progress</h3>
                <span className="text-xs text-ink-4">Last 6 months</span>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={progressData}>
                  <defs>
                    <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#39FF88" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#39FF88" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9B9B9B" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9B9B9B" }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="xp" stroke="#39FF88" strokeWidth={2} fill="url(#xpGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Sport-by-sport breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="col-span-12 bg-white rounded-2xl border border-[#E8E8E8] p-6"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
            >
              <h3 className="text-sm font-bold text-ink mb-5">Sport Breakdown</h3>
              <div className="grid grid-cols-4 gap-4">
                {SPORTS_STATS.map((s, i) => {
                  const wr = Math.round((s.wins / s.matches) * 100);
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.07 }}
                      className="p-4 rounded-xl border border-[#F0F0F0] bg-[#FAFAFA]"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">{s.sport}</span>
                        <div>
                          <p className="text-sm font-bold text-ink">{s.name}</p>
                          <span
                            className={cn(
                              "level-badge text-[10px]",
                              s.level === "Beginner" ? "level-beginner" :
                              s.level === "Intermediate" ? "level-intermediate" :
                              s.level === "Advanced" ? "level-advanced" : "level-casual"
                            )}
                          >
                            {s.level}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div>
                          <p className="text-lg font-bold text-ink">{s.matches}</p>
                          <p className="text-[10px] text-ink-4">Played</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold" style={{ color: "#39FF88" }}>{wr}%</p>
                          <p className="text-[10px] text-ink-4">Win rate</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="h-1 rounded-full overflow-hidden bg-surface-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${wr}%` }}
                            transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                            className="h-full rounded-full"
                            style={{ background: s.color }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}

        {/* ── HISTORY TAB ── */}
        {activeTab === "history" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
          >
            <div className="px-6 py-4 border-b border-[#F0F0F0]">
              <h3 className="text-sm font-bold text-ink">Match History</h3>
            </div>
            <div>
              {MATCH_HISTORY.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className={cn(
                    "flex items-center gap-4 px-6 py-4 hover:bg-surface-2/50 transition-colors cursor-pointer",
                    i < MATCH_HISTORY.length - 1 && "border-b border-[#F5F5F5]"
                  )}
                >
                  <span className="text-2xl">{m.sport}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-ink">vs. {m.opponent}</p>
                    <p className="text-xs text-ink-4 mt-0.5">{m.date} · {m.score}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold mb-1",
                        m.result === "Win"
                          ? "bg-[rgba(57,255,136,0.1)] text-[#0D7A40] border border-[rgba(57,255,136,0.2)]"
                          : "bg-red-50 text-red-600 border border-red-100"
                      )}
                    >
                      {m.result === "Win" ? "✓ Win" : "✗ Loss"}
                    </span>
                    <p className="text-xs font-bold" style={{ color: "#39FF88" }}>{m.xp} XP</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── BADGES TAB ── */}
        {activeTab === "badges" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 gap-4"
          >
            {BADGES.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.07, type: "spring", stiffness: 200 }}
                className={cn(
                  "bg-white rounded-2xl border p-5 flex items-start gap-4",
                  b.earned ? "border-[#E8E8E8]" : "border-[#F0F0F0] opacity-50"
                )}
                style={{ boxShadow: b.earned ? "0 1px 3px rgba(0,0,0,0.04)" : "none" }}
              >
                <span className={cn("text-3xl", !b.earned && "grayscale opacity-40")}>
                  {b.emoji}
                </span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold text-ink">{b.name}</p>
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={{
                        background: b.rarity === "Legendary" ? "linear-gradient(135deg, #FFD700, #FFA500)"
                          : b.rarity === "Rare" ? "linear-gradient(135deg, #8B5CF6, #6D28D9)"
                          : "#F0F0F0",
                        color: b.rarity === "Common" ? "#6B6B6B" : "#FFF",
                      }}
                    >
                      {b.rarity}
                    </span>
                  </div>
                  <p className="text-xs text-ink-4">{b.desc}</p>
                  {!b.earned && (
                    <p className="text-[11px] text-ink-5 mt-1">Not earned yet</p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

      </div>
    </DashboardLayout>
  );
}
