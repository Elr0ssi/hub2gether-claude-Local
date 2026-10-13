import type { NextConfig } from "next";

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
    ],
  },
  /* L'ancien site est retiré : son accueil, la page d'essai d'article et les
     anciennes cartes. Leurs adresses ne tombent pas pour autant en erreur —
     chacune mène vers ce qui l'a remplacée, de façon permanente, pour que
     les liens déjà partagés et l'autorité acquise suivent. */
  async redirects() {
    return [
      { source: "/analyses", destination: "/", permanent: true },
      /* Les anciennes pages « France » et l'ancien article sur la dette : tout est sur la fiche du pays. */
      { source: "/france", destination: "/pays/france", permanent: true },
      { source: "/france/economie", destination: "/pays/france", permanent: true },
      { source: "/france/economie/dette-publique", destination: "/pays/france/dette-publique", permanent: true },
      { source: "/france/economie/dette-publique-v2", destination: "/pays/france/dette-publique", permanent: true },
      { source: "/articles/dette-publique-france-2025-enjeux", destination: "/pays/france/dette-publique", permanent: true },
      { source: "/comparaison", destination: "/comparer", permanent: true },
      { source: "/soutenance-:n", destination: "/", permanent: true },
      { source: "/presentation", destination: "/", permanent: true },
      { source: "/preview", destination: "/", permanent: true },
      { source: "/v2-eco", destination: "/economie", permanent: true },
      { source: "/concept-globe", destination: "/", permanent: true },
      { source: "/concept-globe/economie", destination: "/economie", permanent: true },
      { source: "/accueil-v1", destination: "/", permanent: true },
      { source: "/test-article", destination: "/", permanent: true },
      { source: "/map/economy/:chemin*", destination: "/economie", permanent: true },
      { source: "/map/:chemin*", destination: "/", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
