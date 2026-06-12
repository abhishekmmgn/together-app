/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	turbopack: {},
	compiler: {
		removeConsole: process.env.NODE_ENV !== "development",
	},
	images: {
		unoptimized: true,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "*.s3.ap-south-1.amazonaws.com",
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
