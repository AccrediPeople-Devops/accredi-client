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
        hostname: "placehold.co",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "via.placeholder.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "148.135.137.229",
        port: "3000",
      },
      {
        protocol: "http",
        hostname: "148.135.137.229",
        port: "3000",
      },
      {
        protocol: "https",
        hostname: "accredipeoplecertifications.com",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "accredipeoplecertifications.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "api.accredipeoplecertifications.com",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "api.accredipeoplecertifications.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "goldstandardcertifications.com",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "goldstandardcertifications.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "courses.daylink.in",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "courses.daylink.in",
        pathname: "**",
      },

    ],
  },
};

export default nextConfig;
