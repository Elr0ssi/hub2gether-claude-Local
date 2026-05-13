"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Euro,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Users,
  Receipt,
  Wallet,
  ChevronRight,
  X,
  Check,
  CreditCard,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { cn } from "@/lib/utils";

/* ── DATA ─────────────────────────────────────── */

const SPLITS = [
  {
    id: 1,
    title: "Padel Court — May 11",
    sport: "🏓",
    total: 24,
    perPlayer: 6,
    players: [
      { initials: "TM", color: "#3B82F6", name: "Thomas M.", paid: true },
      { initials: "SB", color: "#8B5CF6", name: "Sophie B.", paid: true },
      { initials: "VE", color: "#39FF88", colorText: "#000", name: "Valentine E.", paid: true, isMe: true },
      { initials: "RC", color: "#EC4899", name: "Romain C.", paid: false },
    ],
    date: "May 11",
    status: "pending",
  },
  {
    id: 2,
    title: "Tennis Club — May 8",
    sport: "🎾",
    total: 24,
    perPlayer: 12,
    players: [
      { initials: "VE", color: "#39FF88", colorText: "#000", name: "Valentine E.", paid: true, isMe: true },
      { initials: "RC", color: "#EC4899", name: "Romain C.", paid: true },
    ],
    date: "May 8",
    status: "completed",
  },
  {
    id: 3,
    title: "Football — May 2",
    sport: "⚽",
    total: 40,
    perPlayer: 4,
    players: [
      { initials: "JD", color: "#F59E0B", name: "Julien D.", paid: true },
      { initials: "TM", color: "#3B82F6", name: "Thomas M.", paid: true },
      { initials: "VE", color: "#39FF88", colorText: "#000", name: "Valentine E.", paid: true, isMe: true },
      { initials: "ML", color: "#EC4899", name: "Marie L.", paid: false },
      { initials: "AC", color: "#0EA5E9", name: "Alexandre C.", paid: false },
      { initials: "PL", color: "#14B8A6", name: "Pierre L.", paid: false },
      { initials: "CM", color: "#F97316", name: "Claire M.", paid: true },
      { initials: "SB", color: "#8B5CF6", name: "Sophie B.", paid: true },
      { initials: "RC", color: "#EC4899", name: "Romain C.", paid: false },
      { initials: "IM", color: "#6366F1", name: "Isabelle M.", paid: true },
    ],
    date: "May 2",
    status: "pending",
  },
  {
    id: 4,
    title: "Basketball — Apr 27",
    sport: "🏀",
    total: 18,
    perPlayer: 3,
    players: [
      { initials: "JD", color: "#F59E0B", name: "Julien D.", paid: true },
      { initials: "VE", color: "#39FF88", colorText: "#000", name: "Valentine E.", paid: true, isMe: true },
      { initials: "AC", color: "#0EA5E9", name: "Alexandre C.", paid: true },
      { initials: "TM", color: "#3B82F6", name: "Thomas M.", paid: true },
      { initials: "PL", color: "#14B8A6", name: "Pierre L.", paid: true },
      { initials: "ML", color: "#EC4899", name: "Marie L.", paid: true },
    ],
    date: "Apr 27",
    status: "completed",
  },
];

const TRANSACTIONS = [
  { type: "in", desc: "Romain refunded padel", amount: 6, date: "May 11", status: "pending" },
  { type: "out", desc: "Paid tennis court", amount: 12, date: "May 8", status: "done" },
  { type: "in", desc: "Basketball split", amount: 3, date: "Apr 27", status: "done" },
  { type: "out", desc: "Paid padel court", amount: 6, date: "Apr 22", status: "done" },
];

/* ── SPLIT CARD ─────────────────────────────────── */

function SplitCard({ split, delay = 0 }: { split: typeof SPLITS[0]; delay?: number }) {
  const [expanded, setExpanded] = useState(false);
  const paidCount = split.players.filter((p) => p.paid).length;
  const collectedAmount = paidCount * split.perPlayer;
  const isComplete = paidCount === split.players.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-[#FAFAFA] transition-colors text-left"
      >
        {/* Sport icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ background: "#F5F5F5" }}
        >
          {split.sport}
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-bold text-ink truncate">{split.title}</p>
            <span
              className={cn(
                "shrink-0 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full",
                isComplete
                  ? "bg-[rgba(57,255,136,0.1)] text-[#0D7A40] border border-[rgba(57,255,136,0.2)]"
                  : "bg-amber-50 text-amber-700 border border-amber-100"
              )}
            >
              {isComplete ? (
                <><CheckCircle2 className="w-2.5 h-2.5" />Settled</>
              ) : (
                <><Clock className="w-2.5 h-2.5" />Pending</>
              )}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-ink-4">
            <span>{split.date}</span>
            <span>·</span>
            <span>{split.players.length} players</span>
            <span>·</span>
            <span>€{split.perPlayer}/player</span>
          </div>
        </div>

        {/* Amount */}
        <div className="text-right shrink-0">
          <p className="text-base font-black text-ink">€{split.total}</p>
          <p className="text-xs text-ink-4">total</p>
        </div>

        {/* Progress */}
        <div className="w-24 shrink-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-ink-4">{paidCount}/{split.players.length}</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden bg-surface-2">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${(paidCount / split.players.length) * 100}%`,
                background: isComplete ? "#39FF88" : "#F59E0B",
              }}
            />
          </div>
        </div>
      </button>

      {/* Expanded view */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-[#F5F5F5]">
              <div className="pt-4 mb-4 grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-xl bg-[#FAFAFA]">
                  <p className="text-lg font-bold text-ink">€{split.total}</p>
                  <p className="text-[11px] text-ink-4">Total cost</p>
                </div>
                <div className="text-center p-3 rounded-xl" style={{ background: "rgba(57,255,136,0.06)" }}>
                  <p className="text-lg font-bold" style={{ color: "#0D7A40" }}>€{collectedAmount}</p>
                  <p className="text-[11px] text-ink-4">Collected</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-amber-50">
                  <p className="text-lg font-bold text-amber-700">€{split.total - collectedAmount}</p>
                  <p className="text-[11px] text-ink-4">Outstanding</p>
                </div>
              </div>

              {/* Player list */}
              <div className="space-y-2">
                {split.players.map((player, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl",
                      player.isMe ? "bg-[rgba(57,255,136,0.04)] border border-[rgba(57,255,136,0.1)]" : "bg-[#FAFAFA]"
                    )}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{ background: player.color, color: player.colorText || "#FFF" }}
                    >
                      {player.initials}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-ink">
                        {player.name}
                        {player.isMe && <span className="text-ink-4 font-normal ml-1">(you)</span>}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-ink-2">€{split.perPlayer}</span>
                    <div className="w-24 flex justify-end">
                      {player.paid ? (
                        <span
                          className="flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg"
                          style={{ background: "rgba(57,255,136,0.1)", color: "#0D7A40" }}
                        >
                          <Check className="w-3 h-3" />
                          Paid
                        </span>
                      ) : (
                        <button
                          className="flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
                        >
                          <AlertCircle className="w-3 h-3" />
                          Remind
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── PAGE ─────────────────────────────────────── */

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<"splits" | "history">("splits");

  const totalOwed = SPLITS.filter(s => s.status === "pending").reduce((acc, s) => {
    const unpaid = s.players.filter(p => !p.paid && !p.isMe).length;
    return acc + unpaid * s.perPlayer;
  }, 0);

  return (
    <DashboardLayout>
      <div className="max-w-[900px] mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-heading-1 text-ink mb-2">Payments</h1>
          <p className="text-body">Split terrain costs, track reimbursements.</p>
        </motion.div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            {
              icon: Wallet,
              label: "Balance",
              value: `+€${totalOwed}`,
              desc: "to collect",
              color: "#39FF88",
              bg: "rgba(57,255,136,0.08)",
            },
            {
              icon: Clock,
              label: "Pending Splits",
              value: `${SPLITS.filter(s => s.status === "pending").length}`,
              desc: "awaiting payment",
              color: "#F59E0B",
              bg: "#FFFBEB",
            },
            {
              icon: CheckCircle2,
              label: "Completed",
              value: `${SPLITS.filter(s => s.status === "completed").length}`,
              desc: "all settled",
              color: "#3B82F6",
              bg: "#EFF6FF",
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -2 }}
              className="bg-white rounded-2xl border border-[#E8E8E8] p-5"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: card.bg }}
              >
                <card.icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
              <p className="text-2xl font-bold text-ink mb-0.5">{card.value}</p>
              <p className="text-xs text-ink-4">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Tab + action */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-1 p-1 bg-surface-2 rounded-xl w-fit">
            {(["splits", "history"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all duration-200",
                  activeTab === tab ? "bg-white text-ink shadow-sm" : "text-ink-4 hover:text-ink"
                )}
              >
                {tab === "splits" ? "💸 Splits" : "📋 History"}
              </button>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary text-sm"
            style={{ background: "#39FF88", color: "#000", boxShadow: "0 2px 12px rgba(57,255,136,0.2)" }}
          >
            <Plus className="w-4 h-4" strokeWidth={3} />
            New Split
          </motion.button>
        </div>

        {/* Splits tab */}
        {activeTab === "splits" && (
          <div className="space-y-3">
            {SPLITS.map((split, i) => (
              <SplitCard key={split.id} split={split} delay={0.1 + i * 0.07} />
            ))}
          </div>
        )}

        {/* History tab */}
        {activeTab === "history" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
          >
            <div className="px-5 py-4 border-b border-[#F0F0F0]">
              <h3 className="text-sm font-bold text-ink">Transaction History</h3>
            </div>
            {TRANSACTIONS.map((tx, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className={cn(
                  "flex items-center gap-4 px-5 py-4 hover:bg-[#FAFAFA] transition-colors",
                  i < TRANSACTIONS.length - 1 && "border-b border-[#F5F5F5]"
                )}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: tx.type === "in" ? "rgba(57,255,136,0.1)" : "#F5F5F5",
                  }}
                >
                  {tx.type === "in" ? (
                    <ArrowDownLeft className="w-4 h-4" style={{ color: "#39FF88" }} />
                  ) : (
                    <ArrowUpRight className="w-4 h-4 text-ink-3" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink">{tx.desc}</p>
                  <p className="text-xs text-ink-4">{tx.date}</p>
                </div>
                <div className="text-right">
                  <p
                    className="text-sm font-bold"
                    style={{ color: tx.type === "in" ? "#0D7A40" : "#0A0A0A" }}
                  >
                    {tx.type === "in" ? "+" : "-"}€{tx.amount}
                  </p>
                  <span
                    className={cn(
                      "text-[10px] font-semibold px-1.5 py-0.5 rounded",
                      tx.status === "done"
                        ? "bg-[rgba(57,255,136,0.1)] text-[#0D7A40]"
                        : "bg-amber-50 text-amber-700"
                    )}
                  >
                    {tx.status === "done" ? "✓ Done" : "⏳ Pending"}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
