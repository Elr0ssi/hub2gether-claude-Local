"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import {
  Users,
  TrendingUp,
  Activity,
  Award,
  ArrowUpRight,
  Zap,
  Heart,
  Download,
  RefreshCw,
  ChevronRight,
  Building2,
  Calendar,
  Target,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { cn } from "@/lib/utils";

/* ── DATA ─────────────────────────────────────── */

const monthlyParticipation = [
  { month: "Jan", active: 62, matches: 24, target: 70 },
  { month: "Feb", active: 68, matches: 31, target: 75 },
  { month: "Mar", active: 74, matches: 38, target: 78 },
  { month: "Apr", active: 81, matches: 52, target: 80 },
  { month: "May", active: 89, matches: 67, target: 85 },
];

const wellbeingData = [
  { week: "W1", stress: 62, energy: 74, happiness: 78 },
  { week: "W2", stress: 58, energy: 79, happiness: 82 },
  { week: "W3", stress: 55, energy: 83, happiness: 85 },
  { week: "W4", stress: 51, energy: 87, happiness: 89 },
  { week: "W5", stress: 48, energy: 91, happiness: 88 },
  { week: "W6", stress: 45, energy: 88, happiness: 91 },
];

const sportDistribution = [
  { name: "Padel", value: 32, color: "#3B82F6" },
  { name: "Football", value: 27, color: "#F59E0B" },
  { name: "Running", value: 21, color: "#10B981" },
  { name: "Tennis", value: 13, color: "#8B5CF6" },
  { name: "Other", value: 7, color: "#E8E8E8" },
];

const weeklyHeatmap = [
  { day: "Mon", "6am": 2, "12pm": 8, "6pm": 4, "8pm": 3 },
  { day: "Tue", "6am": 3, "12pm": 12, "6pm": 7, "8pm": 5 },
  { day: "Wed", "6am": 4, "12pm": 9, "6pm": 6, "8pm": 4 },
  { day: "Thu", "6am": 2, "12pm": 15, "6pm": 11, "8pm": 8 },
  { day: "Fri", "6am": 5, "12pm": 18, "6pm": 14, "8pm": 10 },
  { day: "Sat", "6am": 8, "12pm": 22, "6pm": 19, "8pm": 12 },
  { day: "Sun", "6am": 6, "12pm": 14, "6pm": 10, "8pm": 7 },
];

const TOP_EMPLOYEES = [
  { initials: "TM", name: "Thomas M.", dept: "Product", color: "#3B82F6", xp: 4820, matches: 52, score: 98 },
  { initials: "SB", name: "Sophie B.", dept: "Finance", color: "#8B5CF6", xp: 3940, matches: 41, score: 94 },
  { initials: "VE", name: "Valentine E.", dept: "Marketing", color: "#39FF88", colorText: "#000", xp: 2980, matches: 31, score: 87 },
  { initials: "AC", name: "Alexandre C.", dept: "Sales", color: "#0EA5E9", xp: 2740, matches: 29, score: 82 },
  { initials: "JD", name: "Julien D.", dept: "Data", color: "#F59E0B", xp: 2540, matches: 27, score: 78 },
];

const DEPT_PARTICIPATION = [
  { dept: "Product", pct: 91, count: 11, color: "#3B82F6" },
  { dept: "Marketing", pct: 85, count: 8, color: "#39FF88" },
  { dept: "Engineering", pct: 78, count: 18, color: "#8B5CF6" },
  { dept: "Finance", pct: 72, count: 9, color: "#F59E0B" },
  { dept: "HR", pct: 68, count: 6, color: "#EC4899" },
  { dept: "Sales", pct: 61, count: 14, color: "#0EA5E9" },
];

/* ── HELPERS ─────────────────────────────────── */

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  change,
  color,
  delay = 0,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  change: string;
  color: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl border border-[#E8E8E8] p-5"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)" }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}15` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div
          className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg"
        >
          <ArrowUpRight className="w-3 h-3" />
          {change}
        </div>
      </div>
      <p className="text-2xl font-bold text-ink mb-0.5">{value}</p>
      {sub && <p className="text-xs text-ink-4 mb-1">{sub}</p>}
      <p className="text-xs font-medium text-ink-4">{label}</p>
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-xl px-3 py-2.5 shadow-lg"
        style={{ background: "#FFF", border: "1px solid #E8E8E8", fontSize: 12 }}
      >
        <p className="text-ink-4 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="font-semibold" style={{ color: p.color }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/* ── PAGE ─────────────────────────────────────── */

export default function AdminPage() {
  const [period, setPeriod] = useState("May 2025");

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between mb-8"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-5 h-5 text-ink-4" />
              <span className="text-xs font-semibold text-ink-4 uppercase tracking-widest">
                Company Analytics
              </span>
            </div>
            <h1 className="text-heading-1 text-ink">emlyon Analytics Dashboard</h1>
            <p className="text-body mt-1">Employee engagement, wellness, and sports activity overview.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary text-sm h-9">
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
            <button
              className="btn-primary text-sm h-9"
              style={{ background: "#39FF88", color: "#000" }}
            >
              <Download className="w-3.5 h-3.5" />
              Export Report
            </button>
          </div>
        </motion.div>

        {/* KPI Row */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <KpiCard icon={Users} label="Active Employees" value="248" sub="out of 312 total" change="+12%" color="#3B82F6" delay={0.05} />
          <KpiCard icon={Activity} label="Matches This Month" value="94" sub="across 6 sports" change="+24%" color="#39FF88" delay={0.1} />
          <KpiCard icon={Heart} label="Wellness Score" value="82" sub="out of 100" change="+5pts" color="#EC4899" delay={0.15} />
          <KpiCard icon={Zap} label="Total XP Generated" value="284k" sub="company-wide" change="+18%" color="#F59E0B" delay={0.2} />
          <KpiCard icon={TrendingUp} label="Engagement Rate" value="79.5%" sub="+8% vs last month" change="+8%" color="#8B5CF6" delay={0.25} />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6">

          {/* Participation Trend — 8 col */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="col-span-8 bg-white rounded-2xl border border-[#E8E8E8] p-6"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-heading-3 text-ink">Participation Trend</h2>
                <p className="text-small mt-0.5">Active employees vs. matches played vs. target</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                {[
                  { color: "#39FF88", label: "Active %" },
                  { color: "#3B82F6", label: "Matches" },
                  { color: "#E8E8E8", dashed: true, label: "Target" },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <div className="w-4 h-0.5 rounded-full" style={{ background: l.color }} />
                    <span className="text-ink-4">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyParticipation} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#39FF88" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#39FF88" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="bGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9B9B9B" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9B9B9B" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="active" name="Active %" stroke="#39FF88" strokeWidth={2.5} fill="url(#aGrad)" dot={false} />
                <Area type="monotone" dataKey="matches" name="Matches" stroke="#3B82F6" strokeWidth={2} fill="url(#bGrad)" dot={false} />
                <Line type="monotone" dataKey="target" stroke="#E8E8E8" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Sport Distribution Pie — 4 col */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="col-span-4 bg-white rounded-2xl border border-[#E8E8E8] p-6"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
          >
            <h2 className="text-heading-3 text-ink mb-1">Sports Popularity</h2>
            <p className="text-small mb-4">Distribution this month</p>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={sportDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {sportDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {sportDistribution.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                  <span className="text-xs text-ink-3 flex-1">{s.name}</span>
                  <span className="text-xs font-bold text-ink">{s.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Wellbeing — 6 col */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="col-span-6 bg-white rounded-2xl border border-[#E8E8E8] p-6"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-heading-3 text-ink">Employee Wellbeing</h2>
                <p className="text-small mt-0.5">Weekly indicators — self-reported</p>
              </div>
              <div className="flex items-center gap-1 p-1 bg-surface-2 rounded-lg">
                {["6W", "3M", "1Y"].map((t) => (
                  <button key={t} className={cn("px-2 py-1 rounded text-xs font-semibold transition-all",
                    t === "6W" ? "bg-white text-ink shadow-sm" : "text-ink-4")}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={wellbeingData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#9B9B9B" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9B9B9B" }} axisLine={false} tickLine={false} domain={[40, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="energy" name="Energy" stroke="#39FF88" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="happiness" name="Happiness" stroke="#3B82F6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="stress" name="Stress" stroke="#EF4444" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-5 mt-3">
              {[
                { color: "#39FF88", label: "Energy", value: "91" },
                { color: "#3B82F6", label: "Happiness", value: "91" },
                { color: "#EF4444", label: "Stress (lower=better)", value: "45" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 rounded" style={{ background: l.color }} />
                  <span className="text-xs text-ink-4">{l.label}</span>
                  <span className="text-xs font-bold text-ink">{l.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Department Participation — 6 col */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="col-span-6 bg-white rounded-2xl border border-[#E8E8E8] p-6"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
          >
            <h2 className="text-heading-3 text-ink mb-5">Department Participation</h2>
            <div className="space-y-3">
              {DEPT_PARTICIPATION.map((d, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.06 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-xs font-semibold text-ink-3 w-20 shrink-0">{d.dept}</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden bg-surface-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${d.pct}%` }}
                      transition={{ delay: 0.6 + i * 0.07, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full"
                      style={{ background: d.color }}
                    />
                  </div>
                  <span className="text-xs font-bold text-ink w-10 text-right shrink-0">{d.pct}%</span>
                  <span className="text-xs text-ink-4 w-16 shrink-0">{d.count} active</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Top Employees — 5 col */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="col-span-5 bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F0F0]">
              <h2 className="text-heading-3 text-ink">Top Employees</h2>
              <span className="text-xs text-ink-4">by engagement score</span>
            </div>
            {TOP_EMPLOYEES.map((emp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.07 }}
                className={cn(
                  "flex items-center gap-3 px-5 py-3.5 hover:bg-[#FAFAFA] transition-colors",
                  i < TOP_EMPLOYEES.length - 1 && "border-b border-[#F5F5F5]"
                )}
              >
                <span className={cn(
                  "w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0",
                  i === 0 ? "rank-1" : i === 1 ? "rank-2" : i === 2 ? "rank-3" : "bg-surface-2 text-ink-4"
                )}>
                  {i + 1}
                </span>
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold"
                  style={{ background: emp.color, color: emp.colorText || "#FFF" }}
                >
                  {emp.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">{emp.name}</p>
                  <p className="text-xs text-ink-4">{emp.dept} · {emp.matches} matches</p>
                </div>
                <div className="text-right shrink-0">
                  <p
                    className="text-sm font-black"
                    style={{ color: i === 0 ? "#39FF88" : "#0A0A0A" }}
                  >
                    {emp.score}
                  </p>
                  <p className="text-[10px] text-ink-4">score</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Heatmap — 7 col */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="col-span-7 bg-white rounded-2xl border border-[#E8E8E8] p-6"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-heading-3 text-ink">Activity Heatmap</h2>
                <p className="text-small mt-0.5">When employees are most active</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-5 gap-2 text-xs text-ink-5 pl-8">
                {["6 AM", "12 PM", "6 PM", "8 PM"].map((t) => (
                  <div key={t} className="text-center">{t}</div>
                ))}
              </div>
              {weeklyHeatmap.map((row, i) => (
                <motion.div
                  key={row.day}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 + i * 0.05 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-xs text-ink-4 w-8 shrink-0">{row.day}</span>
                  <div className="flex-1 grid grid-cols-4 gap-2">
                    {(["6am", "12pm", "6pm", "8pm"] as const).map((time) => {
                      const val = row[time];
                      const intensity = val / 25;
                      return (
                        <motion.div
                          key={time}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.6 + i * 0.05 + (["6am","12pm","6pm","8pm"].indexOf(time)) * 0.03 }}
                          className="h-8 rounded-lg flex items-center justify-center text-[11px] font-bold"
                          style={{
                            background: `rgba(57,255,136,${intensity * 0.7})`,
                            color: intensity > 0.5 ? "#0D4A28" : "#9B9B9B",
                            border: "1px solid rgba(57,255,136,0.1)",
                          }}
                        >
                          {val}
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#F5F5F5]">
              <span className="text-xs text-ink-4">Low activity</span>
              <div className="flex gap-1">
                {[0.1, 0.2, 0.4, 0.6, 0.9].map((op, i) => (
                  <div
                    key={i}
                    className="w-6 h-3 rounded"
                    style={{ background: `rgba(57,255,136,${op * 0.7})` }}
                  />
                ))}
              </div>
              <span className="text-xs text-ink-4">High activity</span>
            </div>
          </motion.div>

        </div>
      </div>
    </DashboardLayout>
  );
}
