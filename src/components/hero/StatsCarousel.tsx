"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

const ITEMS = [
  { value: "$105T", label: "PIB mondial 2025", color: "#10B981" },
  { value: "7,04M", label: "Décès COVID confirmés", color: "#EF4444" },
  { value: "195+", label: "Pays analysés", color: "#39FF88" },
  { value: "2 443 Mds€", label: "Dépenses militaires mondiales", color: "#F59E0B" },
  { value: "44,8 %", label: "Population en démocratie", color: "#8B5CF6" },
  { value: "1453 AD", label: "Chute de Constantinople", color: "#39FF88" },
  { value: "38,4M", label: "Personnes vivant avec le VIH", color: "#EF4444" },
  { value: "72 pays", label: "En recul démocratique", color: "#F59E0B" },
];

const ITEM_H = 52; // px per item
const SPEED = 48; // px/s

interface StatsCarouselProps {
  bgColor?: string;
}

export function StatsCarousel({ bgColor = "#080810" }: StatsCarouselProps) {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const frameRef = useRef<number>(0);
  const lastRef = useRef(0);

  useEffect(() => {
    if (reduced) return;
    const track = trackRef.current;
    if (!track) return;

    const total = ITEM_H * ITEMS.length;

    const tick = (now: number) => {
      const delta = lastRef.current ? now - lastRef.current : 16;
      lastRef.current = now;
      posRef.current += (SPEED * delta) / 1000;
      if (posRef.current >= total) posRef.current -= total;
      track.style.transform = `translateY(-${posRef.current.toFixed(2)}px)`;
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [reduced]);

  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div
      style={{
        height: `${ITEM_H * 2}px`,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        ref={trackRef}
        style={{ willChange: "transform" }}
        aria-hidden="true"
      >
        {doubled.map((item, i) => (
          <div
            key={i}
            style={{
              height: `${ITEM_H}px`,
              display: "flex",
              alignItems: "center",
              gap: "12px",
              paddingLeft: "2px",
            }}
          >
            <span
              style={{
                width: "3px",
                height: "20px",
                borderRadius: "2px",
                background: item.color,
                flexShrink: 0,
                boxShadow: `0 0 6px ${item.color}80`,
              }}
            />
            <span
              style={{
                fontWeight: 800,
                fontSize: "0.95rem",
                color: "#fff",
                letterSpacing: "-0.01em",
                flexShrink: 0,
              }}
            >
              {item.value}
            </span>
            <span
              style={{
                fontSize: "0.73rem",
                color: "rgba(255,255,255,0.42)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Fade masks */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "24px",
          background: `linear-gradient(to bottom, ${bgColor}, transparent)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "24px",
          background: `linear-gradient(to top, ${bgColor}, transparent)`,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
