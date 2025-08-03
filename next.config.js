/** @type {import('next').NextConfig} */
const nextConfig = {
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
      // Payment method domains
      {
        protocol: "https",
        hostname: "www.paypalobjects.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "www.aexp-static.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "www.mastercard.co.in",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "logos-world.net",
        pathname: "**",
      },
      // CloudFront domain for client logos
      {
        protocol: "https",
        hostname: "d2o2utebsixu4k.cloudfront.net",
        pathname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
