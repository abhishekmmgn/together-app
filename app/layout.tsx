import "./globals.css";
import { ThemeProvider } from "@/components/settings/theme-provider";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import DbFull from "@/components/db-full";

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
    <html lang="en">
      <body className={roboto.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <DbFull />
          {/* {children} */}
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
