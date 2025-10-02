import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Handle canvas and other Node.js modules for PixiJS
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Handle .mjs files for PixiJS
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    });

    return config;
  },
  // Enable experimental features for better PixiJS support
  experimental: {
    esmExternals: "loose",
  },
};

export default nextConfig;
