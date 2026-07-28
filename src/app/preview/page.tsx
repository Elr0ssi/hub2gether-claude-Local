import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { HeroGlobePreview } from "@/components/hero/HeroGlobePreview";
import { ThemeStorySections } from "@/components/home/ThemeStorySections";
import { FAQSection } from "@/components/faq/FAQSection";
import { FAQS_EMPIRES } from "@/data/faqs";

export const metadata: Metadata = {
  title: "Aperçu — The Essential Data",
  robots: { index: false, follow: false },
};

export default function PreviewPage() {
  return (
    <Layout>
      <HeroGlobePreview />
      <ThemeStorySections />
      <FAQSection items={FAQS_EMPIRES} />
    </Layout>
  );
}
