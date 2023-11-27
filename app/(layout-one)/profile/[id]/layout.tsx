import { Metadata } from "next";

type Params = {
  params: {
    id: string;
  };
};

export function generateMetadata({ params: { id } }: Params): Metadata {
  return { title: id };
}

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="w-full h-full">{children}</section>;
}
