import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Forum } from "@/components/community/Forum";

export const metadata: Metadata = {
  title: "Community · The Essential Data",
  description:
    "Le forum de la donnée : des fils ouverts sur des chiffres publiés, à discuter, contester et vérifier sur la carte.",
  alternates: { canonical: "/community" },
};

export default function CommunityPage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Navbar />
      <main style={{ paddingTop: "var(--navbar-height)" }}>
        <Forum />
      </main>
      <Footer />
    </div>
  );
}
