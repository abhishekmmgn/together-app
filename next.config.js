/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
      },
    ],
  },
};

const withPWA = require("next-pwa")({
  dest: "public",
});

module.exports = withPWA({
  ...nextConfig,
  images: {
    unoptimized: true,
  },
});
