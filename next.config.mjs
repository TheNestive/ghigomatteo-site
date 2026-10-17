// Keep this configuration in JavaScript so Hostinger can load it without
// compiling TypeScript with a native SWC binary unavailable on its build OS.
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // qualité par défaut (75) + hautes qualités pour les visuels du portfolio
    // (95 = images du zoom-parallax, très agrandies)
    qualities: [75, 90, 95],
  },
};

export default nextConfig;
