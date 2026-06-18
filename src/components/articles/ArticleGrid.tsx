"use client";

import { motion } from "framer-motion";
import { ArticleCard } from "./ArticleCard";
import type { Article } from "@/types";

interface ArticleGridProps {
  articles: Article[];
  title?: string;
  subtitle?: string;
}

export function ArticleGrid({
  articles,
  title = "Dernières analyses",
  subtitle,
}: ArticleGridProps) {
  if (articles.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-10">
        <p className="section-title mb-2">Éditorial</p>
        <h2 className="text-heading-1" style={{ color: "var(--ink)" }}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-body mt-2" style={{ maxWidth: "480px" }}>
            {subtitle}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {articles.map((article, i) => (
          <motion.div
            key={article.slug}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.45, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <ArticleCard article={article} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
