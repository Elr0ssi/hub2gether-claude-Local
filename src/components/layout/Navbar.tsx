"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Plus, Settings, ChevronDown } from "lucide-react";

const NOTIFICATIONS = [
  {
    id: 1,
    type: "match",
    text: "Thomas invited you to a padel match",
    time: "2m ago",
    unread: true,
    emoji: "🏓",
  },
  {
    id: 2,
    type: "achievement",
    text: "You earned the «Early Bird» badge",
    time: "1h ago",
    unread: true,
    emoji: "🏆",
  },
  {
    id: 3,
    type: "community",
    text: "Running Club posted a new event",
    time: "3h ago",
    unread: false,
    emoji: "🏃",
  },
  {
    id: 4,
    type: "challenge",
    text: "Sophie challenged you to a step challenge",
    time: "5h ago",
    unread: false,
    emoji: "⚡",
  },
];

export function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <header
      className="fixed top-0 left-[240px] right-0 h-16 z-30 flex items-center gap-4 px-6"
      style={{
        background: "rgba(250,250,250,0.92)",
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        borderBottom: "1px solid rgba(232,232,232,0.7)",
      }}
    >
      {/* Search */}
      <motion.div
        className="flex-1 max-w-md relative"
        animate={{ width: searchFocused ? "100%" : "auto" }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      >
        <div
          className="flex items-center gap-2.5 px-3.5 h-9 rounded-xl border transition-all duration-200"
          style={{
            background: searchFocused ? "#FFFFFF" : "#F5F5F5",
            borderColor: searchFocused ? "rgba(57,255,136,0.4)" : "transparent",
            boxShadow: searchFocused
              ? "0 0 0 3px rgba(57,255,136,0.10)"
              : "none",
          }}
        >
          <Search className="w-3.5 h-3.5 text-ink-4 shrink-0" />
          <input
            type="text"
            placeholder="Search matches, players, communities…"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="bg-transparent border-none outline-none text-sm text-ink placeholder:text-ink-4 w-full min-w-[200px]"
          />
          {!searchFocused && (
            <kbd className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium text-ink-4 border border-[#E8E8E8] bg-white">
              ⌘K
            </kbd>
          )}
        </div>
      </motion.div>

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Create button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="btn-primary h-9 px-4 text-xs font-bold"
          style={{
            background: "linear-gradient(135deg, #39FF88 0%, #2DE878 100%)",
            boxShadow: "0 2px 12px rgba(57,255,136,0.25)",
          }}
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={3} />
          Create Match
        </motion.button>

        {/* Notifications */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-2 transition-colors"
          >
            <Bell className="w-4 h-4 text-ink-3" />
            {unreadCount > 0 && (
              <span
                className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full text-[9px] font-bold text-black flex items-center justify-center"
                style={{
                  background: "#39FF88",
                  boxShadow: "0 0 6px rgba(57,255,136,0.5)",
                }}
              >
                {unreadCount}
              </span>
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 top-12 w-80 rounded-2xl z-50 overflow-hidden"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #E8E8E8",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
                  }}
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[#F2F2F2]">
                    <span className="text-sm font-semibold text-ink">Notifications</span>
                    <button className="text-xs text-[#39FF88] font-semibold hover:opacity-70 transition-opacity">
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {NOTIFICATIONS.map((n, i) => (
                      <motion.div
                        key={n.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`flex items-start gap-3 px-4 py-3 hover:bg-[#FAFAFA] transition-colors cursor-pointer ${
                          i < NOTIFICATIONS.length - 1 ? "border-b border-[#F5F5F5]" : ""
                        }`}
                      >
                        <span className="text-xl leading-none mt-0.5">{n.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs leading-snug ${n.unread ? "text-ink font-medium" : "text-ink-3"}`}>
                            {n.text}
                          </p>
                          <p className="text-[11px] text-ink-4 mt-1">{n.time}</p>
                        </div>
                        {n.unread && (
                          <div
                            className="w-2 h-2 rounded-full shrink-0 mt-1.5"
                            style={{ background: "#39FF88", boxShadow: "0 0 4px rgba(57,255,136,0.5)" }}
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Settings */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-2 transition-colors"
        >
          <Settings className="w-4 h-4 text-ink-3" />
        </motion.button>

        {/* Profile */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-surface-2 transition-colors"
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-black"
            style={{
              background: "linear-gradient(135deg, #39FF88 0%, #00E5FF 100%)",
            }}
          >
            VE
          </div>
          <span className="text-sm font-medium text-ink">Valentine</span>
          <ChevronDown className="w-3 h-3 text-ink-4" />
        </motion.button>
      </div>
    </header>
  );
}
