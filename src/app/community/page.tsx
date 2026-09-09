import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CommunityBoard } from "@/components/community/CommunityBoard";

export const metadata: Metadata = {
  title: "Community · The Essential Data",
  description:
    "Les débats du moment, ancrés sur des données publiées et sur les articles qui les documentent. Prenez position, vérifiez sur la carte.",
  alternates: { canonical: "/community" },
};

export default function CommunityPage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Navbar />
      <main style={{ paddingTop: "var(--navbar-height)" }}>
        <CommunityBoard />
      </main>
      <Footer />
    </div>
  );
}
