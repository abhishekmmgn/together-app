import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore",
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="w-full h-full">{children}</section>;
}
