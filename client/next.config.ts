import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  compiler: {
    relay: {
      src: "./",
      language: "typescript",
      eagerEsModules: true,
    },
  },
};

export default nextConfig;
