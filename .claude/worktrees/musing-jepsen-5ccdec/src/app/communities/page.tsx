"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Hash,
  Users,
  Bell,
  Pin,
  Send,
  Smile,
  Plus,
  Search,
  Trophy,
  Flame,
  ChevronRight,
  Settings,
  MessageCircle,
  Calendar,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { cn } from "@/lib/utils";

/* ── DATA ─────────────────────────────────────── */

const COMMUNITIES = [
  {
    id: 1,
    name: "Padel Club",
    emoji: "🏓",
    color: "#3B82F6",
    members: 24,
    online: 8,
    unread: 3,
    description: "The official emlyon padel community",
    channels: ["#general", "#matches", "#rankings", "#announcements"],
  },
  {
    id: 2,
    name: "Running Club",
    emoji: "🏃",
    color: "#10B981",
    members: 31,
    online: 12,
    unread: 0,
    description: "Weekly runs and challenges",
    channels: ["#general", "#routes", "#challenges", "#pb-wall"],
  },
  {
    id: 3,
    name: "Football League",
    emoji: "⚽",
    color: "#F59E0B",
    members: 48,
    online: 15,
    unread: 7,
    description: "5-a-side & 11-a-side leagues",
    channels: ["#general", "#matches", "#transfers", "#tactics"],
  },
  {
    id: 4,
    name: "Yoga & Wellness",
    emoji: "🧘",
    color: "#8B5CF6",
    members: 18,
    online: 5,
    unread: 0,
    description: "Mindfulness and wellbeing sessions",
    channels: ["#general", "#sessions", "#resources"],
  },
];

const MESSAGES = [
  {
    id: 1,
    user: "Thomas M.",
    avatar: "TM",
    color: "#3B82F6",
    text: "Anyone up for a match this Thursday evening? Courts are booked from 6 to 8pm 🏓",
    time: "10:24",
    reactions: [{ emoji: "🙌", count: 4 }, { emoji: "✅", count: 3 }],
  },
  {
    id: 2,
    user: "Sophie B.",
    avatar: "SB",
    color: "#8B5CF6",
    text: "I'm in! Will Rémi join too or are we looking for a 4th?",
    time: "10:26",
    reactions: [],
    reply: "Thomas M.",
  },
  {
    id: 3,
    user: "Valentine E.",
    avatar: "VE",
    color: "#39FF88",
    colorText: "#000",
    text: "Count me in! I'll bring Julien, he's been wanting to try padel forever 😄",
    time: "10:29",
    reactions: [{ emoji: "😄", count: 2 }],
    isMe: true,
  },
  {
    id: 4,
    user: "Thomas M.",
    avatar: "TM",
    color: "#3B82F6",
    text: "Perfect, match is set! Valentine you're with Julien, Sophie you're with me. First to 6 🎯",
    time: "10:31",
    reactions: [{ emoji: "🔥", count: 5 }, { emoji: "🏆", count: 2 }],
  },
  {
    id: 5,
    user: "Rémi C.",
    avatar: "RC",
    color: "#EC4899",
    text: "Wait, I'm in too! Can we do 2 courts? The sports center has availability",
    time: "10:35",
    reactions: [{ emoji: "👀", count: 3 }],
  },
];

const RANKINGS = [
  { rank: 1, user: "Thomas M.", initials: "TM", color: "#3B82F6", xp: 2840, matches: 34, winrate: 71 },
  { rank: 2, user: "Sophie B.", initials: "SB", color: "#8B5CF6", xp: 2310, matches: 28, winrate: 68 },
  { rank: 3, user: "Valentine E.", initials: "VE", color: "#39FF88", colorText: "#000", xp: 1980, matches: 23, winrate: 65 },
  { rank: 4, user: "Romain C.", initials: "RC", color: "#EC4899", xp: 1720, matches: 19, winrate: 58 },
  { rank: 5, user: "Julien D.", initials: "JD", color: "#F59E0B", xp: 1540, matches: 21, winrate: 52 },
];

const UPCOMING_EVENTS = [
  { emoji: "🏆", title: "Monthly Padel Tournament", date: "May 22", participants: 16 },
  { emoji: "🎯", title: "Beginner Workshop", date: "May 18", participants: 8 },
  { emoji: "🍕", title: "Post-match Social Dinner", date: "May 23", participants: 12 },
];

/* ── COMPONENTS ─────────────────────────────────── */

function MessageBubble({ msg, delay = 0 }: { msg: typeof MESSAGES[0]; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className={cn("flex items-start gap-3 group", msg.isMe && "flex-row-reverse")}
    >
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
        style={{
          background: msg.color,
          color: msg.colorText || "#FFF",
          boxShadow: msg.isMe ? "0 0 8px rgba(57,255,136,0.3)" : "none",
        }}
      >
        {msg.avatar}
      </div>

      <div className={cn("flex-1 max-w-[75%]", msg.isMe && "flex flex-col items-end")}>
        {/* Name + time */}
        {!msg.isMe && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-ink">{msg.user}</span>
            <span className="text-[11px] text-ink-5">{msg.time}</span>
          </div>
        )}

        {/* Reply indicator */}
        {msg.reply && (
          <div
            className="flex items-center gap-1.5 text-xs text-ink-4 mb-1.5 pl-2"
            style={{ borderLeft: "2px solid #E8E8E8" }}
          >
            <span>Replying to <span className="font-medium">{msg.reply}</span></span>
          </div>
        )}

        {/* Bubble */}
        <div
          className="px-4 py-2.5 rounded-2xl text-sm leading-snug"
          style={
            msg.isMe
              ? {
                  background: "linear-gradient(135deg, #0A0A0A, #1A1A1A)",
                  color: "#FFFFFF",
                  borderBottomRightRadius: "6px",
                }
              : {
                  background: "#F5F5F5",
                  color: "#0A0A0A",
                  borderBottomLeftRadius: "6px",
                }
          }
        >
          {msg.text}
        </div>

        {/* Reactions */}
        {msg.reactions.length > 0 && (
          <div className="flex items-center gap-1.5 mt-1.5">
            {msg.reactions.map((r) => (
              <button
                key={r.emoji}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border hover:bg-surface-2 transition-colors"
                style={{ background: "#FAFAFA", borderColor: "#F0F0F0" }}
              >
                {r.emoji} {r.count}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ── PAGE ─────────────────────────────────────── */

export default function CommunitiesPage() {
  const [activeCommunity, setActiveCommunity] = useState(COMMUNITIES[0]);
  const [activeChannel, setActiveChannel] = useState("#general");
  const [activeTab, setActiveTab] = useState<"feed" | "rankings" | "events">("feed");
  const [message, setMessage] = useState("");

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-heading-1 text-ink mb-1">Communities</h1>
          <p className="text-body">Your sports tribes inside emlyon.</p>
        </motion.div>

        <div className="flex gap-5 h-[calc(100vh-200px)] min-h-[600px]">

          {/* ── LEFT: Community list ── */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="w-64 shrink-0 flex flex-col gap-2"
          >
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-4" />
              <input
                type="text"
                placeholder="Search communities…"
                className="w-full h-9 pl-9 pr-3 rounded-xl border border-[#E8E8E8] bg-white text-xs text-ink placeholder:text-ink-4 outline-none focus:border-[#39FF88] transition-colors"
              />
            </div>

            <p className="section-title px-1">My Communities</p>

            {COMMUNITIES.map((c) => {
              const isActive = activeCommunity.id === c.id;
              return (
                <motion.button
                  key={c.id}
                  whileHover={{ x: 2 }}
                  onClick={() => setActiveCommunity(c)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 relative",
                    isActive ? "bg-white shadow-card" : "hover:bg-white/60"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCommunity"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                      style={{ background: "#39FF88" }}
                    />
                  )}
                  <span className="text-xl">{c.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-semibold truncate", isActive ? "text-ink" : "text-ink-3")}>
                      {c.name}
                    </p>
                    <p className="text-[11px] text-ink-5">{c.members} members</p>
                  </div>
                  {c.unread > 0 && (
                    <span
                      className="w-5 h-5 rounded-full text-[10px] font-bold text-black flex items-center justify-center shrink-0"
                      style={{ background: "#39FF88" }}
                    >
                      {c.unread}
                    </span>
                  )}
                </motion.button>
              );
            })}

            <button className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-ink-4 hover:text-ink hover:bg-white/60 transition-all text-sm font-medium mt-1">
              <Plus className="w-4 h-4" />
              Discover communities
            </button>
          </motion.div>

          {/* ── MIDDLE: Chat ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex-1 bg-white rounded-2xl border border-[#E8E8E8] flex flex-col overflow-hidden"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)" }}
          >
            {/* Community header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F0F0]">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: `${activeCommunity.color}15` }}
                >
                  {activeCommunity.emoji}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-ink">{activeCommunity.name}</h2>
                  <div className="flex items-center gap-2 text-xs text-ink-4">
                    <span className="flex items-center gap-1">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "#39FF88" }}
                      />
                      {activeCommunity.online} online
                    </span>
                    <span>·</span>
                    <span>{activeCommunity.members} members</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-2 transition-colors">
                  <Bell className="w-4 h-4 text-ink-4" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-2 transition-colors">
                  <Settings className="w-4 h-4 text-ink-4" />
                </button>
              </div>
            </div>

            {/* Channels */}
            <div className="flex items-center gap-0.5 px-4 py-2 border-b border-[#F5F5F5] overflow-x-auto">
              {activeCommunity.channels.map((channel) => (
                <button
                  key={channel}
                  onClick={() => setActiveChannel(channel)}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
                    activeChannel === channel
                      ? "bg-ink text-white"
                      : "text-ink-4 hover:text-ink hover:bg-surface-2"
                  )}
                >
                  <Hash className="w-3 h-3" />
                  {channel.slice(1)}
                </button>
              ))}
            </div>

            {/* Pinned announcement */}
            <div
              className="flex items-start gap-3 px-4 py-3 mx-4 my-3 rounded-xl"
              style={{ background: "rgba(57,255,136,0.06)", border: "1px solid rgba(57,255,136,0.15)" }}
            >
              <Pin className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "#39FF88" }} />
              <div>
                <p className="text-xs font-semibold text-ink mb-0.5">📢 Monthly tournament — May 22nd</p>
                <p className="text-xs text-ink-4">Registration open until May 20. 16 spots available. Sign up in #announcements.</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
              {MESSAGES.map((msg, i) => (
                <MessageBubble key={msg.id} msg={msg} delay={i * 0.06} />
              ))}
            </div>

            {/* Input */}
            <div className="px-4 pb-4 pt-2">
              <div
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all"
                style={{ borderColor: "#E8E8E8", background: "#FAFAFA" }}
              >
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Message ${activeChannel}`}
                  className="flex-1 bg-transparent outline-none text-sm text-ink placeholder:text-ink-4"
                  onFocus={(e) => {
                    (e.target.parentElement as HTMLElement).style.borderColor = "rgba(57,255,136,0.4)";
                    (e.target.parentElement as HTMLElement).style.boxShadow = "0 0 0 3px rgba(57,255,136,0.08)";
                  }}
                  onBlur={(e) => {
                    (e.target.parentElement as HTMLElement).style.borderColor = "#E8E8E8";
                    (e.target.parentElement as HTMLElement).style.boxShadow = "none";
                  }}
                />
                <button className="w-7 h-7 flex items-center justify-center text-ink-4 hover:text-ink-2 transition-colors">
                  <Smile className="w-4 h-4" />
                </button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                  style={{
                    background: message ? "#39FF88" : "#F0F0F0",
                    color: message ? "#000" : "#9B9B9B",
                  }}
                >
                  <Send className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT: Sidebar ── */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-72 shrink-0 flex flex-col gap-4"
          >
            {/* Tab nav */}
            <div className="flex items-center gap-1 p-1 bg-surface-2 rounded-xl">
              {(["feed", "rankings", "events"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-200",
                    activeTab === tab ? "bg-white text-ink shadow-sm" : "text-ink-4 hover:text-ink"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Rankings */}
            {activeTab === "rankings" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-[#E8E8E8] p-4"
                style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4" style={{ color: "#F59E0B" }} />
                    <h3 className="text-sm font-bold text-ink">Community Rankings</h3>
                  </div>
                  <span className="text-xs text-ink-4">May 2025</span>
                </div>
                <div className="space-y-2">
                  {RANKINGS.map((r, i) => (
                    <motion.div
                      key={r.rank}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className={cn(
                        "flex items-center gap-3 p-2.5 rounded-xl transition-all",
                        r.user === "Valentine E." ? "bg-[rgba(57,255,136,0.06)] border border-[rgba(57,255,136,0.15)]" : "hover:bg-surface-2"
                      )}
                    >
                      <span
                        className={cn(
                          "w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black",
                          r.rank === 1 ? "rank-1" : r.rank === 2 ? "rank-2" : r.rank === 3 ? "rank-3" : "bg-surface-2 text-ink-4"
                        )}
                      >
                        {r.rank}
                      </span>
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                        style={{ background: r.color, color: r.colorText || "#FFF" }}
                      >
                        {r.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-ink truncate">{r.user}</p>
                        <p className="text-[11px] text-ink-4">{r.matches} matches</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-ink">{r.xp.toLocaleString()}</p>
                        <p className="text-[10px] text-ink-4">XP</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Events */}
            {activeTab === "events" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-[#E8E8E8] p-4"
                style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-ink-3" />
                    <h3 className="text-sm font-bold text-ink">Upcoming Events</h3>
                  </div>
                  <button className="text-xs text-[#39FF88] font-semibold">+ Add</button>
                </div>
                <div className="space-y-3">
                  {UPCOMING_EVENTS.map((e, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-2 transition-all cursor-pointer group"
                    >
                      <span className="text-2xl">{e.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-ink truncate">{e.title}</p>
                        <p className="text-[11px] text-ink-4">{e.date} · {e.participants} participants</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-ink-5 group-hover:text-ink-3 transition-colors" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Activity feed */}
            {activeTab === "feed" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-[#E8E8E8] p-4 flex-1 overflow-y-auto"
                style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Flame className="w-4 h-4" style={{ color: "#F59E0B" }} />
                  <h3 className="text-sm font-bold text-ink">Recent Activity</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { emoji: "🏆", text: "Thomas won a match vs Romain", time: "Just now" },
                    { emoji: "🏃", text: "Sarah set a new 5K PR: 22:10", time: "1h ago" },
                    { emoji: "👥", text: "3 members joined this week", time: "2h ago" },
                    { emoji: "⚡", text: "New tournament announced", time: "3h ago" },
                    { emoji: "🎯", text: "Marie completed all challenges", time: "5h ago" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-base leading-none mt-0.5">{item.emoji}</span>
                      <div>
                        <p className="text-xs text-ink-2">{item.text}</p>
                        <p className="text-[11px] text-ink-5 mt-0.5">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Members online */}
            <div
              className="bg-white rounded-2xl border border-[#E8E8E8] p-4"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-ink-3" />
                  <h3 className="text-sm font-bold text-ink">Online</h3>
                  <span
                    className="text-[11px] font-bold px-1.5 py-0.5 rounded-md"
                    style={{ background: "rgba(57,255,136,0.1)", color: "#0D7A40" }}
                  >
                    {activeCommunity.online}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["TM", "SB", "ML", "RC", "VE", "JD", "AC"].map((initials, i) => (
                  <div key={i} className="relative">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: ["#3B82F6", "#8B5CF6", "#EC4899", "#10B981", "#39FF88", "#F59E0B", "#0EA5E9"][i] }}
                    >
                      {initials === "VE" ? <span style={{ color: "#000" }}>{initials}</span> : initials}
                    </div>
                    <div
                      className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white"
                      style={{ background: "#39FF88" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </DashboardLayout>
  );
}
