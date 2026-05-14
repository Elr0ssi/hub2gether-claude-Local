import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const SPORTS = [
  { id: "football", label: "Football", emoji: "⚽" },
  { id: "tennis", label: "Tennis", emoji: "🎾" },
  { id: "padel", label: "Padel", emoji: "🏓" },
  { id: "basketball", label: "Basketball", emoji: "🏀" },
  { id: "running", label: "Running", emoji: "🏃" },
  { id: "cycling", label: "Cycling", emoji: "🚴" },
  { id: "swimming", label: "Swimming", emoji: "🏊" },
  { id: "yoga", label: "Yoga", emoji: "🧘" },
  { id: "volleyball", label: "Volleyball", emoji: "🏐" },
  { id: "badminton", label: "Badminton", emoji: "🏸" },
] as const;

export const LEVELS = ["Beginner", "Intermediate", "Advanced", "Pro"] as const;
export const MINDSETS = ["Competitive", "Casual", "Social", "Training"] as const;
