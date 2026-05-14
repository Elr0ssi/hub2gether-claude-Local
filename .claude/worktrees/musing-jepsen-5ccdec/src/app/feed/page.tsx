"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Share2,
  Zap,
  Award,
  MapPin,
  Clock,
  MoreHorizontal,
  Bookmark,
  Trophy,
  Flame,
  TrendingUp,
  Users,
  Plus,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { cn } from "@/lib/utils";

/* ── DATA ─────────────────────────────────────── */

const POSTS = [
  {
    id: 1,
    type: "match_result",
    user: "Thomas M.",
    role: "Product Manager",
    initials: "TM",
    color: "#3B82F6",
    time: "5 minutes ago",
    sport: "🏓",
    content: "Just finished a padel match with Sophie — what a game! 6-3, 7-5 in the second set. Shoutout to Valentine for a great challenge! 🏓",
    stats: { result: "Won", score: "6-3, 7-5", duration: "1h 20m", xp: "+45 XP" },
    likes: 12,
    comments: 4,
    liked: false,
    tags: ["Padel", "Win"],
    isChallenge: false,
  },
  {
    id: 2,
    type: "achievement",
    user: "Sarah B.",
    role: "Finance Analyst",
    initials: "SB",
    color: "#8B5CF6",
    time: "22 minutes ago",
    sport: "🏃",
    content: "New personal best! Ran 10km in 42:18 this morning along the Rhône. 6 months ago I couldn't run 2km without stopping. The progress is real 🙌",
    badge: { name: "Speed Demon", emoji: "⚡", description: "10K under 45 minutes" },
    likes: 28,
    comments: 11,
    liked: true,
    tags: ["Running", "PB", "Progress"],
    isChallenge: false,
  },
  {
    id: 3,
    type: "challenge",
    user: "Romain C.",
    role: "Tech Lead",
    initials: "RC",
    color: "#EC4899",
    time: "1 hour ago",
    sport: "🎾",
    content: "Challenging Valentine to a tennis match this Friday morning! Are you ready to defend your title? 😏⚡",
    challenge: {
      to: "Valentine E.",
      toInitials: "VE",
      sport: "Tennis",
      date: "Friday, May 16 · 7:00 AM",
      location: "Tennis Club Part-Dieu",
      status: "pending",
    },
    likes: 8,
    comments: 3,
    liked: false,
    tags: ["Tennis", "Challenge"],
    isChallenge: true,
  },
  {
    id: 4,
    type: "event_created",
    user: "Marie L.",
    role: "HR Manager",
    initials: "ML",
    color: "#EC4899",
    time: "2 hours ago",
    sport: "🧘",
    content: "Organizing a yoga session open to everyone! Wednesday 8:00 AM at the main terrace. No experience needed, just bring a mat and good vibes 🧘‍♀️",
    event: {
      title: "Morning Yoga Session",
      date: "Wednesday, May 14",
      time: "8:00 AM",
      location: "emlyon Terrace",
      spots: 8,
      filledSpots: 5,
    },
    likes: 15,
    comments: 6,
    liked: false,
    tags: ["Yoga", "Wellness", "Free"],
    isChallenge: false,
  },
  {
    id: 5,
    type: "milestone",
    user: "Julien D.",
    role: "Data Scientist",
    initials: "JD",
    color: "#F59E0B",
    time: "3 hours ago",
    sport: "⚽",
    content: "50 matches played on HUB2gether! Started as a complete football beginner and now I can actually keep up with the intermediate group. 50 games later and I'm hooked 🎉",
    milestone: { count: 50, label: "Matches Played", emoji: "🎯" },
    likes: 34,
    comments: 16,
    liked: false,
    tags: ["Football", "Milestone"],
    isChallenge: false,
  },
];

const TRENDING = [
  { sport: "⚽", name: "5-a-side Football", trend: "+40%", hot: true },
  { sport: "🏓", name: "Padel Club", trend: "+28%", hot: true },
  { sport: "🏃", name: "Morning Run", trend: "+18%", hot: false },
];

const SUGGESTED_PLAYERS = [
  { initials: "AC", name: "Alexandre C.", role: "Sales Director", color: "#0EA5E9", mutual: 4 },
  { initials: "CM", name: "Claire M.", role: "Product Designer", color: "#F97316", mutual: 6 },
  { initials: "PL", name: "Pierre L.", role: "Engineer", color: "#14B8A6", mutual: 3 },
];

/* ── POST CARD ─────────────────────────────────── */

function PostCard({ post, delay = 0 }: { post: typeof POSTS[0]; delay?: number }) {
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);
  const [saved, setSaved] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)" }}
    >
      {/* Post header */}
      <div className="flex items-start justify-between px-5 pt-5 pb-4">
        <div className="flex items-start gap-3">
          <div className="relative">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
              style={{
                background: post.color,
                color: post.initials === "VE" ? "#000" : "#FFF",
              }}
            >
              {post.initials}
            </div>
            <span className="absolute -bottom-1 -right-1 text-base leading-none">{post.sport}</span>
          </div>
          <div>
            <p className="text-sm font-bold text-ink">{post.user}</p>
            <p className="text-xs text-ink-4">{post.role} · {post.time}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSaved(!saved)}
            className={cn(
              "w-8 h-8 flex items-center justify-center rounded-lg transition-all",
              saved ? "text-[#39FF88]" : "text-ink-5 hover:text-ink-3 hover:bg-surface-2"
            )}
          >
            <Bookmark className={cn("w-4 h-4", saved && "fill-current")} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-ink-5 hover:text-ink-3 hover:bg-surface-2 transition-all">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-4">
        <p className="text-sm text-ink-2 leading-relaxed">{post.content}</p>
      </div>

      {/* Match result card */}
      {post.type === "match_result" && post.stats && (
        <div
          className="mx-5 mb-4 p-4 rounded-xl"
          style={{ background: "#FAFAFA", border: "1px solid #F0F0F0" }}
        >
          <div className="grid grid-cols-4 gap-3">
            {Object.entries(post.stats).map(([key, val]) => (
              <div key={key} className="text-center">
                <p
                  className="text-sm font-bold mb-0.5"
                  style={{ color: key === "xp" ? "#39FF88" : "#0A0A0A" }}
                >
                  {val}
                </p>
                <p className="text-[10px] text-ink-4 capitalize">{key}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievement badge */}
      {post.type === "achievement" && post.badge && (
        <div
          className="mx-5 mb-4 flex items-center gap-3 p-4 rounded-xl"
          style={{
            background: "linear-gradient(135deg, rgba(57,255,136,0.08) 0%, rgba(0,229,255,0.06) 100%)",
            border: "1px solid rgba(57,255,136,0.2)",
          }}
        >
          <span className="text-3xl">{post.badge.emoji}</span>
          <div>
            <p className="text-sm font-bold text-ink">🏅 Badge Unlocked: {post.badge.name}</p>
            <p className="text-xs text-ink-4 mt-0.5">{post.badge.description}</p>
          </div>
        </div>
      )}

      {/* Challenge card */}
      {post.type === "challenge" && post.challenge && (
        <div
          className="mx-5 mb-4 p-4 rounded-xl"
          style={{
            background: "linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#EC4899] flex items-center justify-center text-xs font-bold text-white">
                RC
              </div>
              <Zap className="w-4 h-4 text-[#39FF88]" />
              <div className="w-8 h-8 rounded-lg bg-[#39FF88] flex items-center justify-center text-xs font-bold text-black">
                VE
              </div>
            </div>
            <span className="text-xs font-bold text-[#39FF88]">⚡ CHALLENGE</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <p className="text-white/40 mb-0.5">Sport</p>
              <p className="text-white font-semibold">{post.challenge.sport}</p>
            </div>
            <div>
              <p className="text-white/40 mb-0.5">When</p>
              <p className="text-white font-semibold text-[11px]">{post.challenge.date}</p>
            </div>
            <div>
              <p className="text-white/40 mb-0.5">Where</p>
              <p className="text-white font-semibold text-[11px]">{post.challenge.location}</p>
            </div>
          </div>
          {post.challenge.to === "Valentine E." && (
            <div className="flex gap-2 mt-3">
              <button
                className="flex-1 h-8 rounded-lg text-xs font-bold text-black"
                style={{ background: "#39FF88" }}
              >
                Accept Challenge
              </button>
              <button className="flex-1 h-8 rounded-lg text-xs font-semibold text-white/60 border border-white/10">
                Decline
              </button>
            </div>
          )}
        </div>
      )}

      {/* Event card */}
      {post.type === "event_created" && post.event && (
        <div
          className="mx-5 mb-4 p-4 rounded-xl border border-[#F0F0F0]"
          style={{ background: "#FAFAFA" }}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm font-bold text-ink">{post.event.title}</p>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-ink-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.event.date} · {post.event.time}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {post.event.location}
                </span>
              </div>
            </div>
          </div>
          <div className="mb-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-ink-4">{post.event.filledSpots}/{post.event.spots} joined</span>
              <span style={{ color: "#39FF88" }} className="font-semibold">
                {post.event.spots - post.event.filledSpots} spots left
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden bg-surface-2">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(post.event.filledSpots / post.event.spots) * 100}%`,
                  background: "#39FF88",
                }}
              />
            </div>
          </div>
          <button
            className="w-full h-8 rounded-lg text-xs font-bold text-black"
            style={{ background: "#39FF88" }}
          >
            Join Event
          </button>
        </div>
      )}

      {/* Milestone */}
      {post.type === "milestone" && post.milestone && (
        <div
          className="mx-5 mb-4 flex items-center gap-4 p-4 rounded-xl"
          style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}
        >
          <span className="text-4xl">{post.milestone.emoji}</span>
          <div>
            <p
              className="text-3xl font-black tracking-tighter"
              style={{ color: "#D97706" }}
            >
              {post.milestone.count}
            </p>
            <p className="text-xs text-amber-700 font-semibold">{post.milestone.label}</p>
          </div>
        </div>
      )}

      {/* Tags */}
      <div className="flex items-center gap-1.5 px-5 pb-4 flex-wrap">
        {post.tags.map((tag) => (
          <span key={tag} className="tag">#{tag}</span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-5 pb-4 pt-2 border-t border-[#F5F5F5]">
        <div className="flex items-center gap-1">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={toggleLike}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200",
              liked ? "bg-red-50 text-red-500" : "text-ink-4 hover:bg-surface-2 hover:text-ink-2"
            )}
          >
            <Heart className={cn("w-3.5 h-3.5", liked && "fill-current")} />
            {likes}
          </motion.button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-ink-4 hover:bg-surface-2 hover:text-ink-2 transition-all">
            <MessageCircle className="w-3.5 h-3.5" />
            {post.comments}
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-ink-4 hover:bg-surface-2 hover:text-ink-2 transition-all">
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
        </div>
        {post.isChallenge && (
          <span
            className="text-[11px] font-bold px-2 py-1 rounded-lg"
            style={{ background: "rgba(57,255,136,0.1)", color: "#0D7A40" }}
          >
            ⚡ Challenge
          </span>
        )}
      </div>
    </motion.div>
  );
}

/* ── PAGE ─────────────────────────────────────── */

export default function FeedPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = ["All", "Matches", "Achievements", "Challenges", "Events"];

  return (
    <DashboardLayout>
      <div className="max-w-[1200px] mx-auto">
        <div className="flex gap-7">

          {/* ── FEED ── */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h1 className="text-heading-1 text-ink mb-2">Activity Feed</h1>
              <p className="text-body">What your colleagues are up to, right now.</p>
            </motion.div>

            {/* Compose */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-[#E8E8E8] p-4 mb-5"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-black shrink-0"
                  style={{ background: "#39FF88" }}
                >
                  VE
                </div>
                <div
                  className="flex-1 flex items-center px-4 h-9 rounded-xl border text-sm text-ink-4 cursor-text"
                  style={{ background: "#FAFAFA", borderColor: "#F0F0F0" }}
                >
                  Share a match result, challenge someone…
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 pl-12">
                {[
                  { icon: Zap, label: "Match", color: "#39FF88" },
                  { icon: Trophy, label: "Result", color: "#F59E0B" },
                  { icon: Users, label: "Challenge", color: "#8B5CF6" },
                  { icon: ImageIcon, label: "Photo", color: "#3B82F6" },
                ].map(({ icon: Icon, label, color }, i) => (
                  <button
                    key={label}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-ink-4 hover:bg-surface-2 hover:text-ink transition-all"
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color }} />
                    {label}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex items-center gap-1.5 mb-5"
            >
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200",
                    activeFilter === f
                      ? "bg-ink text-white"
                      : "bg-white border border-[#E8E8E8] text-ink-4 hover:text-ink"
                  )}
                >
                  {f}
                </button>
              ))}
            </motion.div>

            {/* Posts */}
            <div className="space-y-4">
              {POSTS.map((post, i) => (
                <PostCard key={post.id} post={post} delay={0.2 + i * 0.08} />
              ))}
            </div>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="w-72 shrink-0 space-y-4">

            {/* Trending */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-[#E8E8E8] p-5"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4" style={{ color: "#39FF88" }} />
                <h3 className="text-sm font-bold text-ink">Trending This Week</h3>
              </div>
              <div className="space-y-3">
                {TRENDING.map((t, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xl">{t.sport}</span>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-ink">{t.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span style={{ color: "#39FF88" }} className="text-[11px] font-bold">{t.trend}</span>
                        {t.hot && (
                          <span className="flex items-center gap-0.5 text-[10px] text-amber-600 font-bold">
                            <Flame className="w-2.5 h-2.5" />
                            HOT
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-ink-5" />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Suggested Players */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-2xl border border-[#E8E8E8] p-5"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
            >
              <h3 className="text-sm font-bold text-ink mb-4">Suggested Players</h3>
              <div className="space-y-3">
                {SUGGESTED_PLAYERS.map((p, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: p.color }}
                    >
                      {p.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-ink truncate">{p.name}</p>
                      <p className="text-[11px] text-ink-4">{p.mutual} mutual sports</p>
                    </div>
                    <button
                      className="text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all"
                      style={{ background: "#FAFAFA", border: "1px solid #E8E8E8", color: "#3A3A3A" }}
                    >
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick challenge */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl p-5 overflow-hidden relative"
              style={{
                background: "linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)",
              }}
            >
              <div
                className="absolute -top-12 -right-12 w-40 h-40 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(57,255,136,0.15) 0%, transparent 70%)" }}
              />
              <Zap className="w-5 h-5 mb-3" style={{ color: "#39FF88" }} />
              <h3 className="text-sm font-bold text-white mb-1">Send a Challenge</h3>
              <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
                Challenge a colleague to any sport
              </p>
              <button
                className="w-full h-8 rounded-xl text-xs font-bold text-black"
                style={{ background: "#39FF88" }}
              >
                Challenge Someone ⚡
              </button>
            </motion.div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
