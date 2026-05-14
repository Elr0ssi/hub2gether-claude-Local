"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  Flame,
  TrendingUp,
  Users,
  Calendar,
  MapPin,
  Clock,
  ChevronRight,
  Zap,
  Star,
  Activity,
  ArrowUpRight,
  Award,
  Target,
  Plus,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { cn } from "@/lib/utils";

/* ── DATA ─────────────────────────────────────── */

const participationData = [
  { month: "Jan", value: 24 },
  { month: "Feb", value: 31 },
  { month: "Mar", value: 28 },
  { month: "Apr", value: 42 },
  { month: "May", value: 38 },
  { month: "Jun", value: 55 },
  { month: "Jul", value: 61 },
  { month: "Aug", value: 49 },
  { month: "Sep", value: 68 },
  { month: "Oct", value: 74 },
  { month: "Nov", value: 82 },
  { month: "Dec", value: 91 },
];

const radarData = [
  { subject: "Football", A: 80 },
  { subject: "Tennis", A: 65 },
  { subject: "Padel", A: 90 },
  { subject: "Running", A: 45 },
  { subject: "Yoga", A: 30 },
  { subject: "Cycling", A: 55 },
];

const weeklyData = [
  { day: "Mon", matches: 3 },
  { day: "Tue", matches: 5 },
  { day: "Wed", matches: 2 },
  { day: "Thu", matches: 8 },
  { day: "Fri", matches: 12 },
  { day: "Sat", matches: 15 },
  { day: "Sun", matches: 9 },
];

const UPCOMING_MATCHES = [
  {
    id: 1,
    sport: "🏓",
    name: "Padel — Doubles",
    time: "Today, 12:30",
    location: "emlyon sports center",
    players: ["VE", "TM", "SB", "AC"],
    spots: 0,
    level: "Intermediate",
  },
  {
    id: 2,
    sport: "⚽",
    name: "5-a-side Football",
    time: "Thu, 19:00",
    location: "Gerland stadium",
    players: ["JD", "PL", "MA"],
    spots: 2,
    level: "Casual",
  },
  {
    id: 3,
    sport: "🎾",
    name: "Tennis — Singles",
    time: "Fri, 07:00",
    location: "Tennis Club Part-Dieu",
    players: ["VE", "RC"],
    spots: 0,
    level: "Intermediate",
  },
];

const ACTIVITY_FEED = [
  {
    id: 1,
    user: "Thomas M.",
    avatar: "TM",
    color: "#3B82F6",
    action: "Won a padel match",
    detail: "6-3, 7-5 against Sophie & Rémi",
    time: "5 min ago",
    emoji: "🏆",
  },
  {
    id: 2,
    user: "Sarah B.",
    avatar: "SB",
    color: "#8B5CF6",
    action: "Completed a 10k run",
    detail: "42:18 — Personal best!",
    time: "22 min ago",
    emoji: "🏃",
  },
  {
    id: 3,
    user: "Alexandre C.",
    avatar: "AC",
    color: "#F59E0B",
    action: "Joined Running Club",
    detail: "Welcome to the community!",
    time: "1h ago",
    emoji: "👋",
  },
  {
    id: 4,
    user: "Marie L.",
    avatar: "ML",
    color: "#EC4899",
    action: "Created a yoga session",
    detail: "Wednesday 8:00 — All levels",
    time: "2h ago",
    emoji: "🧘",
  },
  {
    id: 5,
    user: "Romain C.",
    avatar: "RC",
    color: "#10B981",
    action: "Challenged you to tennis",
    detail: "Friday morning — Accept?",
    time: "3h ago",
    emoji: "⚡",
  },
];

const COMMUNITIES = [
  { name: "Padel Club", emoji: "🏓", members: 24, active: true, color: "#3B82F6" },
  { name: "Running Club", emoji: "🏃", members: 31, active: false, color: "#10B981" },
  { name: "Football League", emoji: "⚽", members: 48, active: true, color: "#F59E0B" },
  { name: "Yoga & Wellness", emoji: "🧘", members: 18, active: false, color: "#8B5CF6" },
];

/* ── ANIMATED COUNTER ──────────────────────────── */

function AnimatedCounter({
  value,
  suffix = "",
  duration = 1500,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(eased * value));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

/* ── KPI CARD ──────────────────────────────────── */

function KpiCard({
  title,
  value,
  suffix,
  change,
  icon: Icon,
  accentColor,
  delay = 0,
}: {
  title: string;
  value: number;
  suffix?: string;
  change: string;
  icon: React.ElementType;
  accentColor?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="card p-5 group cursor-default"
      style={{ transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
      whileHover={{ y: -3, boxShadow: "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)" }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          style={{ background: accentColor ? `${accentColor}15` : "var(--surface-2)" }}
        >
          <Icon
            className="w-5 h-5"
            style={{ color: accentColor || "var(--ink-3)" }}
          />
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
          <ArrowUpRight className="w-3 h-3" />
          {change}
        </div>
      </div>
      <div
        className="text-3xl font-bold tracking-tight mb-1"
        style={{ color: accentColor === "#39FF88" ? "#39FF88" : "var(--ink)" }}
      >
        <AnimatedCounter value={value} suffix={suffix || ""} />
      </div>
      <p className="text-xs text-ink-4 font-medium">{title}</p>
    </motion.div>
  );
}

/* ── CUSTOM TOOLTIP ──────────────────────────────── */

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-xl px-3 py-2.5 text-sm shadow-lg"
        style={{
          background: "#FFFFFF",
          border: "1px solid #E8E8E8",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        }}
      >
        <p className="text-xs text-ink-4 mb-0.5">{label}</p>
        <p className="font-bold text-ink">{payload[0].value} matches</p>
      </div>
    );
  }
  return null;
};

/* ── MAIN COMPONENT ──────────────────────────────── */

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto space-y-8">

        {/* ── HERO SECTION ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl p-8"
          style={{
            background: "linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #0D1F15 100%)",
          }}
        >
          {/* Ambient glow */}
          <div
            className="absolute -top-24 -right-24 w-64 h-64 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(57,255,136,0.2) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(0,229,255,0.1) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10 flex items-center justify-between flex-wrap gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(57,255,136,0.2)", border: "1px solid rgba(57,255,136,0.3)" }}
                >
                  <Zap className="w-3 h-3" style={{ color: "#39FF88" }} />
                </div>
                <span className="text-xs font-semibold" style={{ color: "rgba(57,255,136,0.8)" }}>
                  Tuesday, May 13
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                Good morning, Valentine 👋
              </h1>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                You have 2 matches this week and 1 pending challenge.
                <span className="ml-1" style={{ color: "#39FF88" }}>Keep the momentum.</span>
              </p>
            </div>

            {/* Engagement Score */}
            <div className="text-right">
              <div className="flex flex-col items-end gap-2">
                <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Engagement Score
                </span>
                <div className="flex items-baseline gap-1">
                  <span
                    className="text-6xl font-black tracking-tighter"
                    style={{
                      color: "#39FF88",
                      textShadow: "0 0 40px rgba(57,255,136,0.5)",
                    }}
                  >
                    <AnimatedCounter value={87} duration={2000} />
                  </span>
                  <span className="text-2xl font-bold" style={{ color: "rgba(57,255,136,0.5)" }}>
                    /100
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-32 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "87%" }}
                      transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full"
                      style={{
                        background: "linear-gradient(90deg, #39FF88, #00E5FF)",
                        boxShadow: "0 0 8px rgba(57,255,136,0.5)",
                      }}
                    />
                  </div>
                  <span className="text-xs font-semibold" style={{ color: "#39FF88" }}>
                    ↑ 12 pts
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick stats row */}
          <div className="relative z-10 mt-6 pt-6 border-t border-white/10 grid grid-cols-4 gap-6">
            {[
              { label: "Matches played", value: "23", icon: "⚡" },
              { label: "Active streak", value: "8d", icon: "🔥" },
              { label: "Communities", value: "4", icon: "👥" },
              { label: "Company rank", value: "#3", icon: "🏆" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="text-center"
              >
                <div className="text-lg mb-1">{stat.icon}</div>
                <div className="text-xl font-bold text-white tracking-tight">{stat.value}</div>
                <div className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── KPI ROW ── */}
        <div className="grid grid-cols-4 gap-4">
          <KpiCard title="Active Employees" value={248} change="+12%" icon={Users} accentColor="#3B82F6" delay={0.1} />
          <KpiCard title="Matches This Month" value={94} change="+24%" icon={Activity} accentColor="#39FF88" suffix="" delay={0.15} />
          <KpiCard title="Total XP Earned" value={12840} suffix=" XP" change="+8%" icon={Zap} accentColor="#F59E0B" delay={0.2} />
          <KpiCard title="Wellness Score" value={78} suffix="%" change="+5%" icon={TrendingUp} accentColor="#8B5CF6" delay={0.25} />
        </div>

        {/* ── MAIN GRID ── */}
        <div className="grid grid-cols-12 gap-6">

          {/* Participation Chart — 8 col */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="col-span-8 card p-6"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-heading-3 text-ink">Participation Growth</h2>
                <p className="text-small mt-1">Monthly match activity across all sports</p>
              </div>
              <div className="flex items-center gap-1">
                {["1W", "1M", "3M", "1Y"].map((t, i) => (
                  <button
                    key={t}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all",
                      i === 3
                        ? "bg-ink text-white"
                        : "text-ink-4 hover:bg-surface-2"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={participationData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#39FF88" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#39FF88" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9B9B9B" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9B9B9B" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#39FF88"
                  strokeWidth={2.5}
                  fill="url(#grad1)"
                  dot={false}
                  activeDot={{ r: 5, fill: "#39FF88", strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Sports radar — 4 col */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="col-span-4 card p-6"
          >
            <h2 className="text-heading-3 text-ink mb-1">My Sports</h2>
            <p className="text-small mb-4">Activity distribution</p>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart cx="50%" cy="50%" outerRadius={70} data={radarData}>
                <PolarGrid stroke="#E8E8E8" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#9B9B9B" }} />
                <Radar
                  name="me"
                  dataKey="A"
                  stroke="#39FF88"
                  fill="#39FF88"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Upcoming matches — 5 col */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="col-span-5 card p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-heading-3 text-ink">Upcoming Matches</h2>
              <button className="btn-ghost text-xs gap-1">
                See all <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-3">
              {UPCOMING_MATCHES.map((match, i) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-surface-2 transition-all duration-200 cursor-pointer group"
                >
                  <span className="text-2xl">{match.sport}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-ink truncate">{match.name}</p>
                      <span className={cn(
                        "level-badge shrink-0",
                        match.level === "Intermediate" ? "level-intermediate" : "level-beginner"
                      )}>
                        {match.level}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-ink-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {match.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {match.location}
                      </span>
                    </div>
                  </div>
                  <div className="flex -space-x-2 items-center">
                    {match.players.slice(0, 3).map((p, j) => (
                      <div
                        key={j}
                        className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white"
                        style={{ background: ["#3B82F6", "#8B5CF6", "#F59E0B", "#EC4899"][j % 4] }}
                      >
                        {p}
                      </div>
                    ))}
                    {match.spots > 0 && (
                      <div
                        className="w-7 h-7 rounded-full border-2 border-dashed flex items-center justify-center text-[10px] font-bold"
                        style={{ borderColor: "#39FF88", color: "#39FF88", background: "rgba(57,255,136,0.08)" }}
                      >
                        +{match.spots}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Weekly activity bar chart — 3 col */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="col-span-3 card p-6"
          >
            <h2 className="text-heading-3 text-ink mb-1">This Week</h2>
            <p className="text-small mb-4">Matches per day</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={weeklyData} barCategoryGap="30%">
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9B9B9B" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.03)", radius: 8 }} />
                <Bar dataKey="matches" radius={[6, 6, 0, 0]}>
                  {weeklyData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.day === "Fri" || entry.day === "Sat" ? "#39FF88" : "#F0F0F0"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Activity Feed — 4 col */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="col-span-4 card p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-heading-3 text-ink">Live Activity</h2>
              <span
                className="flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-lg"
                style={{ background: "rgba(57,255,136,0.1)", color: "#0D7A40" }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "#39FF88", boxShadow: "0 0 4px rgba(57,255,136,0.6)" }}
                />
                Live
              </span>
            </div>
            <div className="space-y-3 overflow-y-auto max-h-[320px]">
              {ACTIVITY_FEED.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.07 }}
                  className="flex items-start gap-3 group cursor-pointer"
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: item.color }}
                  >
                    {item.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-ink">{item.user}</span>
                      <span className="text-base leading-none">{item.emoji}</span>
                    </div>
                    <p className="text-xs text-ink-3 font-medium">{item.action}</p>
                    <p className="text-xs text-ink-4 mt-0.5">{item.detail}</p>
                  </div>
                  <span className="text-[11px] text-ink-5 shrink-0">{item.time}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Communities — 8 col */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="col-span-8 card p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-heading-3 text-ink">My Communities</h2>
              <button className="btn-primary text-xs h-8 px-3 gap-1.5">
                <Plus className="w-3 h-3" strokeWidth={3} />
                Join community
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {COMMUNITIES.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.55 + i * 0.07 }}
                  whileHover={{ y: -2 }}
                  className="flex items-center gap-3 p-4 rounded-2xl cursor-pointer group transition-all duration-200"
                  style={{
                    background: "#FAFAFA",
                    border: "1px solid #F0F0F0",
                  }}
                >
                  <span className="text-3xl">{c.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink mb-1">{c.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-ink-4">
                        {c.members} members
                      </span>
                      {c.active && (
                        <span
                          className="flex items-center gap-1 text-[11px] font-semibold"
                          style={{ color: "#0D7A40" }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: "#39FF88" }}
                          />
                          Active now
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-ink-5 group-hover:text-ink-3 transition-colors" />
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* ── QUICK ACTIONS ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-4 gap-4"
        >
          {[
            { icon: "⚡", label: "Create Match", desc: "Organize a game", color: "#39FF88", href: "/matchmaking" },
            { icon: "🏆", label: "View Leaderboard", desc: "See company rankings", color: "#F59E0B", href: "/leaderboard" },
            { icon: "👥", label: "Challenge Someone", desc: "Send a sports challenge", color: "#8B5CF6", href: "/feed" },
            { icon: "📊", label: "My Stats", desc: "View performance data", color: "#3B82F6", href: "/profile" },
          ].map((action, i) => (
            <motion.a
              key={i}
              href={action.href}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.07 }}
              whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
              className="card p-5 flex items-center gap-4 cursor-pointer"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 transition-transform duration-300"
                style={{ background: `${action.color}15` }}
              >
                {action.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">{action.label}</p>
                <p className="text-xs text-ink-4 mt-0.5">{action.desc}</p>
              </div>
            </motion.a>
          ))}
        </motion.div>

      </div>
    </DashboardLayout>
  );
}
