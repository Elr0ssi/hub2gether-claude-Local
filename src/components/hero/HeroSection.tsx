"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden" style={{ minHeight: "90vh" }}>
      {/* Neon orb decorations */}
      <div
        className="neon-orb"
        style={{
          width: "600px",
          height: "600px",
          top: "-100px",
          right: "-100px",
          opacity: 0.6,
        }}
      />
      <div
        className="neon-orb"
        style={{
          width: "400px",
          height: "400px",
          bottom: "0px",
          left: "-80px",
          opacity: 0.4,
        }}
      />

      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(var(--border-light) 1px, transparent 1px), linear-gradient(90deg, var(--border-light) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          opacity: 0.5,
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 pt-28 pb-20 flex flex-col items-center text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="accent-badge text-xs mb-6 inline-flex">
            <span className="accent-dot mr-1.5" />
            Geopolitical Intelligence
          </span>
        </motion.div>

        {/* H1 */}
        <motion.h1
          className="text-display text-center mb-6"
          style={{ color: "var(--ink)", maxWidth: "800px" }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Explore the world
          <br />
          <span style={{ color: "var(--accent)", textShadow: "0 0 40px rgba(57,255,136,0.3)" }}>
            through data
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-body text-center mb-10"
          style={{ maxWidth: "560px", color: "var(--ink-3)", fontSize: "1.0625rem" }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Economy, conflicts, empires, epidemics and power dynamics —
          mapped through time.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link href="/map/empires" className="btn-primary gap-2">
            Start exploring
            <ArrowRight size={16} />
          </Link>
          <Link href="/articles/roman-empire-peak-117-ad" className="btn-secondary gap-2">
            <BookOpen size={15} />
            Read latest analysis
          </Link>
        </motion.div>

        {/* Map preview hint */}
        <motion.div
          className="mt-16 w-full max-w-3xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="rounded-2xl border overflow-hidden"
            style={{
              borderColor: "var(--border)",
              boxShadow: "var(--shadow-float)",
              background: "var(--surface)",
            }}
          >
            {/* Mock map preview header */}
            <div
              className="px-5 py-3 border-b flex items-center justify-between"
              style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}
            >
              <div className="flex items-center gap-3">
                <span className="accent-badge text-xs">Empires</span>
                <span className="text-small font-medium" style={{ color: "var(--ink-2)" }}>
                  Roman Empire — 117 AD
                </span>
              </div>
              <span className="text-caption">Maximum extent under Trajan</span>
            </div>

            {/* Map placeholder with gradient */}
            <div
              className="relative flex items-center justify-center"
              style={{ height: "280px", background: "var(--surface)" }}
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 45% 55%, rgba(57,255,136,0.08) 0%, transparent 60%)`,
                }}
              />

              {/* SVG world outline placeholder */}
              <svg
                viewBox="0 0 800 400"
                className="w-full h-full opacity-20"
                style={{ position: "absolute", inset: 0 }}
              >
                {/* Simplified world outline lines */}
                <path
                  d="M50,200 Q200,150 400,180 Q600,210 750,170"
                  stroke="var(--border)"
                  strokeWidth="1"
                  fill="none"
                />
                <path
                  d="M50,220 Q200,190 400,200 Q600,215 750,195"
                  stroke="var(--border)"
                  strokeWidth="1"
                  fill="none"
                />
                <ellipse cx="400" cy="200" rx="300" ry="140" stroke="var(--border)" strokeWidth="1" fill="none" />
              </svg>

              <div className="relative text-center">
                <p className="text-small font-medium mb-1" style={{ color: "var(--ink-3)" }}>
                  Interactive historical map
                </p>
                <p className="text-caption">
                  7 time periods · 5 themes · Click to explore
                </p>
                <Link
                  href="/map/empires"
                  className="btn-primary mt-4 text-xs inline-flex"
                >
                  Open the map
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
