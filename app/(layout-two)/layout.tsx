import "../globals.css";
import { ThemeProvider } from "@/components/settings/theme-provider";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Header from "@/components/header";
import { Toaster } from "react-hot-toast";

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
          <Toaster />
          <Header />
          <div className="container w-full px-5 mt-14 pb-5 h-screen flex flex-col items-center justify-start sm:py-5 sm:justify-center">
            <div className="mx-auto flex w-full flex-col justify-center max-w-md">
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
