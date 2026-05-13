"use client";

import { motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const pageVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen" style={{ background: "#FAFAFA" }}>
      {/* Ambient background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute -top-48 -right-48 w-[600px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(57,255,136,0.06) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute bottom-0 left-[20%] w-[400px] h-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(0,229,255,0.04) 0%, transparent 65%)",
          }}
        />
      </div>

      <Sidebar />
      <Navbar />

      <main
        className="relative z-10"
        style={{
          marginLeft: "240px",
          paddingTop: "64px",
        }}
      >
        <motion.div
          variants={pageVariants}
          initial="hidden"
          animate="visible"
          className="p-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
