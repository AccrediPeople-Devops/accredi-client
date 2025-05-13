/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["placehold.co","via.placeholder.com", "courses.daylink.in", "148.135.137.229"],
  },
  server: {
    port: 8080
  }
};

module.exports = nextConfig;
