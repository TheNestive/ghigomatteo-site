import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // qualité par défaut (75) + hautes qualités pour les visuels du portfolio
    // (95 = images du zoom-parallax, très agrandies)
    qualities: [75, 90, 95],
  },
};

export default nextConfig;
