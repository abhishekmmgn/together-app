"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import Link from "next/link";
import { tabs } from "@/components/tabs";
import NewPost from "@/components/post/new-post";

export default function Navbar() {
  const routeSegment = useSelectedLayoutSegment();
  const segment = `/${routeSegment || ""}`;
  return (
    <div className="fixed w-full z-50 top-0 inset-x-0 bg-background backdrop-filter backdrop-blur-xl bg-opacity-80 border-b border-border dark:bg-background">
      <div className="h-14 flex items-center justify-between px-5 sm:px-6 gap-1">
        <p className="font-medium text-xl capitalize">
          {segment.split("/")[1] || "Together"}
        </p>
        <NewPost />
      </div>

      <div className="h-10 flex items-start justify-evenly px-5 pt-1 gap-1 sm:hidden">
        {tabs.map((tab, index) => (
          <Link
            href={tab.link}
            className={`w-1/6 flex items-center justify-center ${
              segment === tab.link || segment.startsWith(`${tab.link}/`)
                ? "text-primary"
                : "text-tertiary-foreground hover:text-primary"
            }`}
            key={index}
          >
            {tab.icon}
          </Link>
        ))}
      </div>
    </div>
  );
}
