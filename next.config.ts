import type { NextConfig } from "next";

const securityHeaders = [
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
