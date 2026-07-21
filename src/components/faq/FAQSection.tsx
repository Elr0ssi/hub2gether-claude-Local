"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { jsonLdString } from "@/lib/schema";
import type { FAQItem } from "@/types";

interface FAQSectionProps {
  items: FAQItem[];
  title?: string;
}

export function FAQSection({
  items,
  title = "Questions fréquentes",
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(schema) }}
      />

      <div className="mb-10 text-center">
        <p className="section-title mb-2">FAQ</p>
        <h2 className="text-heading-1" style={{ color: "var(--ink)" }}>
          {title}
        </h2>
      </div>

      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start"
      >
        {items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <motion.div
              layout
              key={i}
              className="card overflow-hidden cursor-pointer"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              style={{
                borderColor: isOpen ? "rgba(57,255,136,0.3)" : undefined,
                transition: "border-color 0.2s",
                gridColumn: isOpen ? "1 / -1" : "auto",
              }}
              role="listitem"
            >
              <div className="px-5 py-4 flex items-start justify-between gap-4 hover:bg-[var(--surface-2)] transition-colors">
                <span
                  className="text-sm font-medium leading-snug"
                  style={{ color: "var(--ink)" }}
                >
                  {item.question}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{
                    background: isOpen ? "var(--accent-dim)" : "var(--surface-2)",
                    border: isOpen
                      ? "1px solid var(--accent-border)"
                      : "1px solid var(--border)",
                  }}
                >
                  <Plus size={11} style={{ color: isOpen ? "#0D7A40" : "var(--ink-3)" }} />
                </motion.span>
              </div>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    <div
                      className="px-5 pb-5 text-body leading-relaxed"
                      style={{ borderTop: "1px solid var(--border)" }}
                    >
                      <div className="pt-4">{item.answer}</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
