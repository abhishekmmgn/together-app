/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	swcMinify: true,
	compiler: {
		removeConsole: process.env.NODE_ENV !== "development",
	},
	images: {
		unoptimized: true,
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
	dest: "public", // Destination directory for the PWA files
	disable: process.env.NODE_ENV === "development", // Disable PWA in development mode
	register: true, // Register the PWA service worker
	skipWaiting: true, // Skip waiting for service worker activation
});

module.exports = withPWA({
	...nextConfig,
});
