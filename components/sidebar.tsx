"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import Link from "next/link";
import { tabs } from '@/components/tabs';

export function Sidebar() {
  const routeSegment = useSelectedLayoutSegment();
  const segment = `/${routeSegment || ""}`;

  return (
    <div className="hidden fixed left-0 top-0 mt-14 pb-12 border-r border-border h-[calc(100vh-56px)] sm:w-[210px] md:w-[232px] xl:w-[248px] sm:block">
      <div className="px-3 py-4 space-y-1">
        {tabs.map((tab, index) => (
          <Link
            href={tab.link}
            className={`h-10 flex justify-start items-center gap-3 px-3 py-1 rounded-lg ${
              segment === tab.link || segment.startsWith(`${tab.link}/`)
                ? "bg-tertiary text-primary"
                : "text-tertiary-foreground hover:bg-secondary"
            }`}
            key={index}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
