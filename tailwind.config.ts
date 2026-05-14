import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAFAFA",
        surface: "#FFFFFF",
        "surface-2": "#F5F5F5",
        border: "#E8E8E8",
        "border-light": "#F0F0F0",
        ink: "#0A0A0A",
        "ink-2": "#3A3A3A",
        "ink-3": "#6B6B6B",
        "ink-4": "#9B9B9B",
        accent: "#39FF88",
        "accent-dim": "rgba(57,255,136,0.15)",
        "accent-glow": "rgba(57,255,136,0.25)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
        "4xl": "24px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 8px rgba(0,0,0,0.06), 0 12px 32px rgba(0,0,0,0.08)",
        glow: "0 0 20px rgba(57,255,136,0.3), 0 0 40px rgba(57,255,136,0.15)",
        "glow-sm": "0 0 10px rgba(57,255,136,0.25)",
        float: "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
        navbar: "0 1px 0 rgba(0,0,0,0.06)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-accent": "linear-gradient(135deg, #39FF88 0%, #00E5FF 100%)",
        "gradient-surface": "linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease forwards",
        "slide-up": "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-in-right": "slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "scale-in": "scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        shimmer: "shimmer 2s linear infinite",
        "bounce-gentle": "bounceGentle 1.5s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          from: { opacity: "0", transform: "translateX(16px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(57,255,136,0.2)" },
          "50%": { boxShadow: "0 0 20px rgba(57,255,136,0.4), 0 0 40px rgba(57,255,136,0.2)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.16, 1, 0.3, 1)",
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
