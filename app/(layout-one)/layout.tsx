import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Sidebar } from "@/components/sidebar";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Together App",
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
          <Sidebar />
          <div className="w-full h-[calc(100vh-56px)] mt-[90px] sm:mt-14 sm:ml-[210px] md:ml-[232px] xl:ml-[248px] sm:w-[calc(100%-210px)] md:w-[calc(100%-232px)] md:max-w-2xl">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
