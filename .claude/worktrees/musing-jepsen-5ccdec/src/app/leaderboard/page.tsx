"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Trophy,
  Zap,
  Flame,
  TrendingUp,
  Award,
  ChevronRight,
  Star,
  Crown,
  ArrowUp,
  ArrowDown,
  Minus,
  Target,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { cn } from "@/lib/utils";

/* ── DATA ─────────────────────────────────────── */

const TOP3 = [
  {
    rank: 1,
    name: "Thomas M.",
    role: "Product Manager",
    initials: "TM",
    color: "#3B82F6",
    xp: 4820,
    matches: 52,
    winrate: 71,
    streak: 14,
    trend: "up",
    badges: ["🏆", "⚡", "🔥", "🎯"],
  },
  {
    rank: 2,
    name: "Sophie B.",
    role: "Finance Analyst",
    initials: "SB",
    color: "#8B5CF6",
    xp: 3940,
    matches: 41,
    winrate: 68,
    streak: 9,
    trend: "up",
    badges: ["⚡", "🔥", "🎯"],
  },
  {
    rank: 3,
    name: "Valentine E.",
    role: "Marketing Manager",
    initials: "VE",
    color: "#39FF88",
    colorText: "#000",
    xp: 2980,
    matches: 31,
    winrate: 65,
    streak: 8,
    trend: "up",
    isMe: true,
    badges: ["⚡", "🔥"],
  },
];

const RANKINGS = [
  { rank: 4, name: "Romain C.", role: "Tech Lead", initials: "RC", color: "#EC4899", xp: 2740, matches: 29, winrate: 58, trend: "up", delta: 2 },
  { rank: 5, name: "Julien D.", role: "Data Scientist", initials: "JD", color: "#F59E0B", xp: 2540, matches: 27, winrate: 52, trend: "down", delta: 1 },
  { rank: 6, name: "Marie L.", role: "HR Manager", initials: "ML", color: "#EC4899", xp: 2280, matches: 25, winrate: 56, trend: "same", delta: 0 },
  { rank: 7, name: "Alexandre C.", role: "Sales Director", initials: "AC", color: "#0EA5E9", xp: 2100, matches: 22, winrate: 50, trend: "up", delta: 3 },
  { rank: 8, name: "Claire M.", role: "Product Designer", initials: "CM", color: "#F97316", xp: 1960, matches: 19, winrate: 47, trend: "down", delta: 1 },
  { rank: 9, name: "Pierre L.", role: "Engineer", initials: "PL", color: "#14B8A6", xp: 1720, matches: 17, winrate: 53, trend: "same", delta: 0 },
  { rank: 10, name: "Isabelle M.", role: "Operations", initials: "IM", color: "#6366F1", xp: 1580, matches: 15, winrate: 45, trend: "up", delta: 2 },
];

const SPORTS_LEADERBOARD: Record<string, Array<{name: string; initials: string; color: string; score: number; unit: string}>> = {
  Padel: [
    { name: "Thomas M.", initials: "TM", color: "#3B82F6", score: 92, unit: "rating" },
    { name: "Sophie B.", initials: "SB", color: "#8B5CF6", score: 87, unit: "rating" },
    { name: "Valentine E.", initials: "VE", color: "#39FF88", score: 82, unit: "rating" },
  ],
  Running: [
    { name: "Sarah B.", initials: "SB", color: "#10B981", score: 42.18, unit: "10k PB" },
    { name: "Alexandre C.", initials: "AC", color: "#0EA5E9", score: 43.52, unit: "10k PB" },
    { name: "Marie L.", initials: "ML", color: "#EC4899", score: 45.10, unit: "10k PB" },
  ],
  Football: [
    { name: "Julien D.", initials: "JD", color: "#F59E0B", score: 18, unit: "goals" },
    { name: "Romain C.", initials: "RC", color: "#EC4899", score: 14, unit: "goals" },
    { name: "Pierre L.", initials: "PL", color: "#14B8A6", score: 11, unit: "goals" },
  ],
};

const monthlyXP = [
  { name: "TM", xp: 4820, color: "#3B82F6" },
  { name: "SB", xp: 3940, color: "#8B5CF6" },
  { name: "VE", xp: 2980, color: "#39FF88" },
  { name: "RC", xp: 2740, color: "#EC4899" },
  { name: "JD", xp: 2540, color: "#F59E0B" },
  { name: "ML", xp: 2280, color: "#EC4899" },
  { name: "AC", xp: 2100, color: "#0EA5E9" },
];

const ACHIEVEMENTS = [
  { emoji: "🏆", title: "Most Active Player", desc: "52 matches this season", player: "Thomas M." },
  { emoji: "⚡", title: "Highest Win Rate", desc: "71% — Thomas M.", player: "Thomas M." },
  { emoji: "🔥", title: "Longest Streak", desc: "14 days active", player: "Thomas M." },
  { emoji: "🆕", title: "Most Improved", desc: "+40% XP this month", player: "Alexandre C." },
];

/* ── PODIUM ─────────────────────────────────────── */

function Podium() {
  const order = [TOP3[1], TOP3[0], TOP3[2]]; // 2nd, 1st, 3rd for visual centering

  const heights = [160, 200, 130];
  const marginTops = [40, 0, 70];

  return (
    <div className="flex items-end justify-center gap-4 pt-8 pb-6">
      {order.map((player, i) => {
        const isMid = i === 1;
        return (
          <motion.div
            key={player.rank}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
            style={{ marginTop: marginTops[i] }}
          >
            {/* Player avatar */}
            <div className="flex flex-col items-center mb-4">
              {player.rank === 1 && (
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="mb-2"
                >
                  <Crown className="w-6 h-6" style={{ color: "#FFD700" }} />
                </motion.div>
              )}
              <div className="relative">
                <div
                  className="rounded-2xl flex items-center justify-center font-black text-lg"
                  style={{
                    width: isMid ? 64 : 52,
                    height: isMid ? 64 : 52,
                    background: player.color,
                    color: player.colorText || "#FFF",
                    boxShadow: isMid ? `0 0 24px ${player.color}60` : `0 4px 12px ${player.color}40`,
                  }}
                >
                  {player.initials}
                </div>
                {player.isMe && (
                  <div
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white text-[8px] flex items-center justify-center font-bold"
                    style={{ background: "#39FF88", color: "#000" }}
                  >
                    ★
                  </div>
                )}
              </div>
              <p className={cn("font-bold text-ink mt-2", isMid ? "text-base" : "text-sm")}>{player.name.split(" ")[0]}</p>
              <p className="text-[11px] text-ink-4">{player.xp.toLocaleString()} XP</p>
            </div>

            {/* Podium block */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: heights[i] }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-28 rounded-t-2xl flex items-start justify-center pt-3 overflow-hidden"
              style={{
                background: player.rank === 1
                  ? "linear-gradient(180deg, #FFD700 0%, #FFA500 100%)"
                  : player.rank === 2
                  ? "linear-gradient(180deg, #C8C8C8 0%, #A8A8A8 100%)"
                  : "linear-gradient(180deg, #CD7F32 0%, #A0522D 100%)",
                boxShadow: isMid ? "0 -4px 20px rgba(255,215,0,0.3)" : "none",
              }}
            >
              <span className="text-2xl font-black text-white">
                {player.rank === 1 ? "🥇" : player.rank === 2 ? "🥈" : "🥉"}
              </span>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ── RANK ROW ─────────────────────────────────── */

function RankRow({ player, delay = 0 }: { player: typeof RANKINGS[0]; delay?: number }) {
  const isMe = player.name === "Valentine E.";
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className={cn(
        "flex items-center gap-4 px-5 py-3.5 hover:bg-[#FAFAFA] transition-all cursor-pointer group",
        isMe && "bg-[rgba(57,255,136,0.04)]"
      )}
    >
      {/* Rank */}
      <div className="w-8 text-center">
        <span className="text-sm font-bold text-ink-3">{player.rank}</span>
      </div>

      {/* Trend */}
      <div className="w-5 flex items-center justify-center">
        {player.trend === "up" ? (
          <ArrowUp className="w-3.5 h-3.5 text-emerald-500" />
        ) : player.trend === "down" ? (
          <ArrowDown className="w-3.5 h-3.5 text-red-400" />
        ) : (
          <Minus className="w-3.5 h-3.5 text-ink-5" />
        )}
      </div>

      {/* Avatar */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
        style={{
          background: player.color,
          color: player.initials === "VE" ? "#000" : "#FFF",
          boxShadow: isMe ? "0 0 8px rgba(57,255,136,0.3)" : "none",
        }}
      >
        {player.initials}
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={cn("text-sm font-semibold truncate", isMe ? "text-ink" : "text-ink-2")}>
            {player.name}
          </p>
          {isMe && (
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded"
              style={{ background: "rgba(57,255,136,0.1)", color: "#0D7A40" }}
            >
              You
            </span>
          )}
        </div>
        <p className="text-xs text-ink-4">{player.role}</p>
      </div>

      {/* Stats */}
      <div className="hidden md:flex items-center gap-6 text-xs text-ink-4">
        <span><span className="font-semibold text-ink">{player.matches}</span> matches</span>
        <span><span className="font-semibold text-ink">{player.winrate}%</span> winrate</span>
      </div>

      {/* XP */}
      <div className="text-right">
        <p className="text-sm font-bold text-ink">{player.xp.toLocaleString()}</p>
        <p className="text-[10px] text-ink-4">XP</p>
      </div>
    </motion.div>
  );
}

/* ── PAGE ─────────────────────────────────────── */

export default function LeaderboardPage() {
  const [activeSport, setActiveSport] = useState("Padel");
  const [period, setPeriod] = useState("Season");

  return (
    <DashboardLayout>
      <div className="max-w-[1300px] mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between mb-8"
        >
          <div>
            <h1 className="text-heading-1 text-ink mb-2">Leaderboard</h1>
            <p className="text-body">Company-wide sports rankings and achievements.</p>
          </div>
          <div className="flex items-center gap-1 p-1 bg-surface-2 rounded-xl">
            {["Week", "Month", "Season"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  period === p ? "bg-white text-ink shadow-sm" : "text-ink-4 hover:text-ink"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-12 gap-6">

          {/* ── LEFT: Podium + Rankings ── */}
          <div className="col-span-8 space-y-5">

            {/* Podium */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl border border-[#E8E8E8] overflow-hidden"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)" }}
            >
              <div className="px-6 pt-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" style={{ color: "#FFD700" }} />
                  <h2 className="text-heading-3 text-ink">Top Players</h2>
                </div>
                <span className="text-xs text-ink-4">{period}</span>
              </div>
              <Podium />
            </motion.div>

            {/* Rankings table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F0F0]">
                <h2 className="text-sm font-bold text-ink">Full Rankings</h2>
                <div className="flex items-center gap-3 text-xs text-ink-5">
                  <span className="w-8 text-center">#</span>
                  <span className="w-5" />
                  <span className="w-9" />
                  <span className="flex-1 min-w-[120px]">Player</span>
                  <span className="hidden md:block w-40" />
                  <span className="w-16 text-right">XP</span>
                </div>
              </div>
              <div>
                {RANKINGS.map((player, i) => (
                  <div
                    key={player.rank}
                    className={cn(i < RANKINGS.length - 1 && "border-b border-[#F5F5F5]")}
                  >
                    <RankRow player={player} delay={0.25 + i * 0.05} />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT: Sidepanel ── */}
          <div className="col-span-4 space-y-5">

            {/* XP Chart */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl border border-[#E8E8E8] p-5"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
            >
              <h3 className="text-sm font-bold text-ink mb-4">XP Distribution</h3>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={monthlyXP} barCategoryGap="30%">
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9B9B9B" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white border border-[#E8E8E8] rounded-xl px-3 py-2 shadow-lg text-xs">
                            <p className="font-bold text-ink">{payload[0].value?.toLocaleString()} XP</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="xp" radius={[6, 6, 0, 0]}>
                    {monthlyXP.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={entry.name === "VE" ? "#39FF88" : "#F0F0F0"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Sport Rankings */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-[#E8E8E8] p-5"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
            >
              <h3 className="text-sm font-bold text-ink mb-3">Sport Rankings</h3>
              <div className="flex gap-1 mb-4">
                {Object.keys(SPORTS_LEADERBOARD).map((sport) => (
                  <button
                    key={sport}
                    onClick={() => setActiveSport(sport)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all",
                      activeSport === sport
                        ? "bg-ink text-white"
                        : "text-ink-4 hover:bg-surface-2 hover:text-ink"
                    )}
                  >
                    {sport}
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                {SPORTS_LEADERBOARD[activeSport].map((p, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-2 transition-all"
                  >
                    <span className={cn(
                      "w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black",
                      i === 0 ? "rank-1" : i === 1 ? "rank-2" : "rank-3"
                    )}>
                      {i + 1}
                    </span>
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{ background: p.color, color: p.initials === "VE" ? "#000" : "#FFF" }}
                    >
                      {p.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-ink truncate">{p.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold" style={{ color: "#39FF88" }}>{p.score}</p>
                      <p className="text-[10px] text-ink-4">{p.unit}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-2xl border border-[#E8E8E8] p-5"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
            >
              <h3 className="text-sm font-bold text-ink mb-4">🏅 Season Highlights</h3>
              <div className="space-y-3">
                {ACHIEVEMENTS.map((a, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xl">{a.emoji}</span>
                    <div>
                      <p className="text-xs font-bold text-ink">{a.title}</p>
                      <p className="text-[11px] text-ink-4">{a.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
