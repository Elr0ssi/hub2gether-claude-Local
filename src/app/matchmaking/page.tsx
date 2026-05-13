"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Clock,
  Users,
  Euro,
  Filter,
  Search,
  SlidersHorizontal,
  ChevronRight,
  Zap,
  Star,
  Plus,
  X,
  Check,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { cn } from "@/lib/utils";

/* ── DATA ─────────────────────────────────────── */

const SPORTS_FILTERS = ["All", "⚽ Football", "🏓 Padel", "🎾 Tennis", "🏃 Running", "🏀 Basketball", "🏐 Volleyball", "🚴 Cycling"];
const LEVELS = ["All levels", "Beginner", "Intermediate", "Advanced", "Pro"];
const MINDSETS = ["All", "Competitive", "Casual", "Social", "Training"];

const MATCHES = [
  {
    id: 1,
    sport: "🏓",
    sportName: "Padel",
    title: "Padel Doubles — Mixed",
    organizer: "Thomas M.",
    organizerInitials: "TM",
    organizerColor: "#3B82F6",
    date: "Today",
    time: "12:30",
    duration: "90 min",
    location: "emlyon Sports Center",
    distance: "0.3 km",
    level: "Intermediate",
    mindset: "Social",
    totalSpots: 4,
    filledSpots: 3,
    pricePerPlayer: 6,
    rating: 4.8,
    reviews: 24,
    featured: true,
    tags: ["Mixed", "Doubles"],
  },
  {
    id: 2,
    sport: "⚽",
    sportName: "Football",
    title: "5-a-side Football League",
    organizer: "Romain C.",
    organizerInitials: "RC",
    organizerColor: "#10B981",
    date: "Thu, May 15",
    time: "19:00",
    duration: "60 min",
    location: "Gerland Municipal Stadium",
    distance: "2.1 km",
    level: "Casual",
    mindset: "Competitive",
    totalSpots: 10,
    filledSpots: 7,
    pricePerPlayer: 4,
    rating: 4.6,
    reviews: 31,
    featured: false,
    tags: ["League", "Evening"],
  },
  {
    id: 3,
    sport: "🎾",
    sportName: "Tennis",
    title: "Morning Tennis Singles",
    organizer: "Sophie B.",
    organizerInitials: "SB",
    organizerColor: "#8B5CF6",
    date: "Fri, May 16",
    time: "07:00",
    duration: "60 min",
    location: "Tennis Club Part-Dieu",
    distance: "3.4 km",
    level: "Advanced",
    mindset: "Competitive",
    totalSpots: 2,
    filledSpots: 1,
    pricePerPlayer: 12,
    rating: 4.9,
    reviews: 18,
    featured: true,
    tags: ["Singles", "Morning"],
  },
  {
    id: 4,
    sport: "🏃",
    sportName: "Running",
    title: "Lunch Run — Riverside",
    organizer: "Marie L.",
    organizerInitials: "ML",
    organizerColor: "#EC4899",
    date: "Wed, May 14",
    time: "12:00",
    duration: "45 min",
    location: "Berges du Rhône",
    distance: "0.8 km",
    level: "Beginner",
    mindset: "Social",
    totalSpots: 12,
    filledSpots: 6,
    pricePerPlayer: 0,
    rating: 4.7,
    reviews: 42,
    featured: false,
    tags: ["Free", "Outdoor"],
  },
  {
    id: 5,
    sport: "🏀",
    sportName: "Basketball",
    title: "3x3 Basketball Pickup",
    organizer: "Julien D.",
    organizerInitials: "JD",
    organizerColor: "#F59E0B",
    date: "Sat, May 17",
    time: "14:00",
    duration: "90 min",
    location: "emlyon Main Court",
    distance: "0.1 km",
    level: "Intermediate",
    mindset: "Casual",
    totalSpots: 6,
    filledSpots: 4,
    pricePerPlayer: 3,
    rating: 4.5,
    reviews: 15,
    featured: false,
    tags: ["3x3", "Weekend"],
  },
  {
    id: 6,
    sport: "🏐",
    sportName: "Volleyball",
    title: "Beach Volleyball Social",
    organizer: "Claire M.",
    organizerInitials: "CM",
    organizerColor: "#0EA5E9",
    date: "Sat, May 17",
    time: "16:00",
    duration: "120 min",
    location: "Parc de la Tête d'Or",
    distance: "4.2 km",
    level: "Beginner",
    mindset: "Social",
    totalSpots: 12,
    filledSpots: 8,
    pricePerPlayer: 0,
    rating: 4.8,
    reviews: 29,
    featured: false,
    tags: ["Free", "Outdoor", "Beach"],
  },
];

/* ── MATCH CARD ─────────────────────────────────── */

function MatchCard({ match, delay = 0 }: { match: typeof MATCHES[0]; delay?: number }) {
  const [joined, setJoined] = useState(false);
  const spotsLeft = match.totalSpots - match.filledSpots;
  const fillPct = (match.filledSpots / match.totalSpots) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,0.10)" }}
      className="bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden cursor-pointer group relative transition-all duration-300"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)" }}
    >
      {match.featured && (
        <div
          className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold"
          style={{
            background: "linear-gradient(135deg, #39FF88, #00E5FF)",
            color: "#000",
            boxShadow: "0 2px 8px rgba(57,255,136,0.3)",
          }}
        >
          <Zap className="w-2.5 h-2.5" />
          Featured
        </div>
      )}

      {/* Header */}
      <div
        className="relative h-20 flex items-end p-4 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${match.organizerColor}18 0%, ${match.organizerColor}08 100%)`,
        }}
      >
        <div
          className="absolute top-3 right-3 text-3xl transition-transform duration-300 group-hover:scale-110"
        >
          {match.sport}
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
            style={{ background: match.organizerColor }}
          >
            {match.organizerInitials}
          </div>
          <div>
            <p className="text-xs font-semibold text-ink">{match.organizer}</p>
            <p className="text-[10px] text-ink-4">Organizer</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-ink mb-1 group-hover:text-ink transition-colors">
              {match.title}
            </h3>
            <div className="flex items-center gap-1.5">
              <span className={cn(
                "level-badge text-[10px]",
                match.level === "Beginner" ? "level-beginner" :
                match.level === "Intermediate" ? "level-intermediate" :
                match.level === "Advanced" ? "level-advanced" : "level-pro"
              )}>
                {match.level}
              </span>
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                style={{ background: "#F5F5F5", color: "#6B6B6B" }}
              >
                {match.mindset}
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            {match.pricePerPlayer === 0 ? (
              <div className="text-sm font-bold" style={{ color: "#39FF88" }}>Free</div>
            ) : (
              <div className="text-sm font-bold text-ink">€{match.pricePerPlayer}</div>
            )}
            <div className="text-[10px] text-ink-4">per player</div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-ink-3">
            <Clock className="w-3 h-3 text-ink-5" />
            <span>{match.date} — {match.time}</span>
            <span className="text-ink-5">·</span>
            <span>{match.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-ink-3">
            <MapPin className="w-3 h-3 text-ink-5" />
            <span className="truncate">{match.location}</span>
            <span className="text-ink-5 shrink-0">· {match.distance}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-ink-3">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="font-semibold text-ink">{match.rating}</span>
            <span className="text-ink-5">({match.reviews} reviews)</span>
          </div>
        </div>

        {/* Spots bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-ink-4">
              {match.filledSpots}/{match.totalSpots} players
            </span>
            {spotsLeft > 0 ? (
              <span
                className="text-[11px] font-bold"
                style={{ color: spotsLeft <= 2 ? "#EF4444" : "#39FF88" }}
              >
                {spotsLeft} spot{spotsLeft > 1 ? "s" : ""} left
              </span>
            ) : (
              <span className="text-[11px] font-bold text-ink-4">Full</span>
            )}
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#F0F0F0" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${fillPct}%` }}
              transition={{ delay: delay + 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full"
              style={{
                background: fillPct >= 100
                  ? "#E8E8E8"
                  : fillPct >= 75
                  ? "linear-gradient(90deg, #F59E0B, #EF4444)"
                  : "linear-gradient(90deg, #39FF88, #00E5FF)",
              }}
            />
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-1.5 mb-4 flex-wrap">
          {match.tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>

        {/* CTA */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={(e) => {
            e.stopPropagation();
            setJoined(!joined);
          }}
          className={cn(
            "w-full h-9 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2",
            spotsLeft === 0 ? "bg-surface-2 text-ink-4 cursor-not-allowed" :
            joined ? "bg-surface-2 text-ink-2 border border-[#E8E8E8]" : "btn-primary"
          )}
          style={
            !joined && spotsLeft > 0
              ? {
                  background: "linear-gradient(135deg, #39FF88 0%, #2DE878 100%)",
                  boxShadow: "0 2px 12px rgba(57,255,136,0.2)",
                }
              : {}
          }
          disabled={spotsLeft === 0}
        >
          {spotsLeft === 0 ? (
            "Match Full"
          ) : joined ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Joined!
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" strokeWidth={3} />
              Join Match
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ── CREATE MATCH MODAL ─────────────────────────── */

function CreateMatchModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [selectedSport, setSelectedSport] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg rounded-3xl overflow-hidden"
        style={{
          background: "#FFFFFF",
          boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#F0F0F0]">
          <div>
            <h2 className="text-lg font-bold text-ink">Create a Match</h2>
            <p className="text-xs text-ink-4 mt-0.5">Step {step} of 3</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl hover:bg-surface-2 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-ink-3" />
          </button>
        </div>

        {/* Progress */}
        <div className="h-0.5 bg-surface-2 mx-6">
          <motion.div
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="h-full rounded-full"
            style={{ background: "#39FF88" }}
          />
        </div>

        {/* Body */}
        <div className="p-6">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
              <p className="text-sm font-semibold text-ink mb-4">Choose a sport</p>
              <div className="grid grid-cols-3 gap-2">
                {["⚽ Football", "🏓 Padel", "🎾 Tennis", "🏃 Running", "🏀 Basketball", "🏐 Volleyball"].map((s) => {
                  const [emoji, name] = s.split(" ");
                  const isSelected = selectedSport === name;
                  return (
                    <button
                      key={name}
                      onClick={() => setSelectedSport(name)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200",
                        isSelected
                          ? "border-[#39FF88] bg-[rgba(57,255,136,0.08)]"
                          : "border-[#F0F0F0] hover:border-[#E8E8E8] bg-[#FAFAFA]"
                      )}
                    >
                      <span className="text-2xl">{emoji}</span>
                      <span className="text-xs font-semibold text-ink">{name}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-ink-3 block mb-2">Date & Time</label>
                <div className="grid grid-cols-2 gap-3">
                  <input type="date" className="input" />
                  <input type="time" className="input" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-3 block mb-2">Location</label>
                <input type="text" placeholder="e.g. emlyon Sports Center" className="input" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-ink-3 block mb-2">Max Players</label>
                  <select className="input">
                    {[2,4,6,8,10,12].map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink-3 block mb-2">Price per player (€)</label>
                  <input type="number" placeholder="0" className="input" min="0" />
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-ink-3 block mb-2">Level</label>
                <div className="flex gap-2 flex-wrap">
                  {["Beginner", "Intermediate", "Advanced", "Pro"].map((l) => (
                    <button key={l} className="sport-pill">{l}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-3 block mb-2">Mindset</label>
                <div className="flex gap-2 flex-wrap">
                  {["Competitive", "Casual", "Social", "Training"].map((m) => (
                    <button key={m} className="sport-pill">{m}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-3 block mb-2">Description (optional)</label>
                <textarea
                  className="input resize-none"
                  rows={3}
                  placeholder="Describe your match, requirements, etc."
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 pb-6 gap-3">
          {step > 1 ? (
            <button onClick={() => setStep(s => s - 1)} className="btn-secondary">
              Back
            </button>
          ) : (
            <button onClick={onClose} className="btn-secondary">Cancel</button>
          )}
          <button
            onClick={() => step < 3 ? setStep(s => s + 1) : onClose()}
            className="btn-primary flex-1"
            style={{ background: "linear-gradient(135deg, #39FF88, #2DE878)", boxShadow: "0 2px 12px rgba(57,255,136,0.25)" }}
          >
            {step === 3 ? (
              <>
                <Zap className="w-4 h-4" />
                Publish Match
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── PAGE ─────────────────────────────────────── */

export default function MatchmakingPage() {
  const [activeSport, setActiveSport] = useState("All");
  const [activeLevel, setActiveLevel] = useState("All levels");
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = MATCHES.filter((m) => {
    const sportMatch = activeSport === "All" || m.sportName === activeSport.split(" ")[1];
    const levelMatch = activeLevel === "All levels" || m.level === activeLevel;
    const searchMatch = !searchQuery || m.title.toLowerCase().includes(searchQuery.toLowerCase());
    return sportMatch && levelMatch && searchMatch;
  });

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
            <h1 className="text-heading-1 text-ink mb-2">Matchmaking</h1>
            <p className="text-body">Find your next match or create one in seconds.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowModal(true)}
            className="btn-primary"
            style={{
              background: "linear-gradient(135deg, #39FF88 0%, #2DE878 100%)",
              boxShadow: "0 4px 20px rgba(57,255,136,0.3)",
              padding: "0.625rem 1.25rem",
              fontSize: "0.875rem",
              fontWeight: 700,
            }}
          >
            <Plus className="w-4 h-4" strokeWidth={3} />
            Create Match
          </motion.button>
        </motion.div>

        {/* Search + Filters */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3 mb-6"
        >
          <div
            className="flex-1 flex items-center gap-2.5 px-4 h-10 rounded-xl border bg-white"
            style={{ borderColor: "#E8E8E8", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
          >
            <Search className="w-4 h-4 text-ink-4" />
            <input
              type="text"
              placeholder="Search matches, locations, sports…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-ink placeholder:text-ink-4 flex-1"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 h-10 px-4 rounded-xl border text-sm font-semibold transition-all duration-200",
              showFilters
                ? "bg-ink text-white border-ink"
                : "bg-white border-[#E8E8E8] text-ink-3 hover:text-ink hover:border-[#C4C4C4]"
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </motion.div>

        {/* Sport filters */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-center gap-2 mb-6 overflow-x-auto pb-1"
        >
          {SPORTS_FILTERS.map((sport) => {
            const isActive = activeSport === sport;
            return (
              <button
                key={sport}
                onClick={() => setActiveSport(sport)}
                className={cn(
                  "shrink-0 px-3.5 py-1.5 rounded-xl text-sm font-semibold border transition-all duration-200 whitespace-nowrap",
                  isActive
                    ? "text-black border-transparent"
                    : "bg-white border-[#E8E8E8] text-ink-3 hover:text-ink"
                )}
                style={
                  isActive
                    ? {
                        background: "linear-gradient(135deg, #39FF88, #2DE878)",
                        boxShadow: "0 2px 8px rgba(57,255,136,0.25)",
                      }
                    : {}
                }
              >
                {sport}
              </button>
            );
          })}
        </motion.div>

        {/* Level filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-white rounded-2xl border border-[#E8E8E8] p-4 flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-ink-4">Level:</span>
                  <div className="flex gap-1.5">
                    {LEVELS.map((l) => (
                      <button
                        key={l}
                        onClick={() => setActiveLevel(l)}
                        className={cn(
                          "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all",
                          activeLevel === l
                            ? "bg-ink text-white"
                            : "bg-surface-2 text-ink-4 hover:text-ink"
                        )}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-ink-4">Mindset:</span>
                  <div className="flex gap-1.5">
                    {MINDSETS.map((m) => (
                      <button
                        key={m}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-surface-2 text-ink-4 hover:text-ink transition-all"
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-ink-3">
            <span className="font-semibold text-ink">{filtered.length}</span> matches available near you
          </p>
          <div className="flex items-center gap-2 text-xs text-ink-4">
            <span>Sort by:</span>
            <button className="font-semibold text-ink hover:text-[#39FF88] transition-colors">Distance</button>
          </div>
        </div>

        {/* Match grid */}
        <div className="grid grid-cols-3 gap-5">
          {filtered.map((match, i) => (
            <MatchCard key={match.id} match={match} delay={0.2 + i * 0.07} />
          ))}
        </div>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <span className="text-6xl mb-4">🔍</span>
            <h3 className="text-heading-3 text-ink mb-2">No matches found</h3>
            <p className="text-body mb-6">Try adjusting your filters or create a new match</p>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary"
              style={{ background: "#39FF88" }}
            >
              <Plus className="w-4 h-4" />
              Create Match
            </button>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && <CreateMatchModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </DashboardLayout>
  );
}
