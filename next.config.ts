import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "148.135.137.229",
        port: "3000",
      },
    ],
  },
};

export default nextConfig;
