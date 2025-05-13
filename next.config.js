/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "placehold.co",
      "via.placeholder.com",
      "courses.daylink.in",
      "api.accredipeoplecertifications.com",
    ],
  },
  server: {
    port: 8080,
  },
};

module.exports = nextConfig;
