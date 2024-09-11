import "./globals.css";
import { ThemeProvider } from "@/components/settings/theme-provider";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import TanstackProvider from "@/lib/tanstack-provider";

const roboto = Roboto({
	weight: ["100", "300", "400", "500", "700"],
	style: ["normal", "italic"],
	subsets: ["latin"],
	display: "swap",
});

export const metadata: Metadata = {
	title: {
		default: "Together App",
		template: "%s - Together App",
	},
	openGraph: {
		title: "Together App",
		description: "Together App",
		url: "https://together-app.vercel.app/",
		siteName: "Together App",
	},
	description: "A social app with privacy in mind.",
	manifest: "/manifest.json",
	icons: [{ rel: "icon", url: "/android-chrome-192x192.png" }],
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={roboto.className}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<TanstackProvider>{children}</TanstackProvider>
				</ThemeProvider>
				{/* <Analytics /> */}
			</body>
		</html>
	);
}
