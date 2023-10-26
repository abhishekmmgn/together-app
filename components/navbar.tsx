"use client";

import { IoHomeOutline, IoChatbubbleOutline, IoNotificationsOutline, IoSearchOutline,IoPersonOutline } from "react-icons/io5";
import { useSelectedLayoutSegment } from "next/navigation";
import Link from "next/link";

const tabs = [
  {
    link: "/",
    icon: <IoHomeOutline className="w-6 h-6" />,
  },
  {
    link: "/messages",
    icon: <IoChatbubbleOutline className="w-6 h-6" />,
  },
  {
    link: "/notifications",
    icon: <IoNotificationsOutline className="w-6 h-6" />,
  },
  {
    link: "/profile",
    icon: <IoPersonOutline className="w-6 h-6" />,
  },
  {
    link: "/explore",
    icon: <IoSearchOutline className="w-6 h-6" />,
  },
];

export default function Navbar() {
  const routeSegment = useSelectedLayoutSegment();
  const segment = `/${routeSegment || ""}`;
  return (
    <div className="fixed w-full z-50 top-0 inset-x-0 bg-background backdrop-filter bg-white backdrop-blur-xl bg-opacity-80 border-b border-border dark:bg-background">
      <div className="h-14 flex items-center justify-between px-5 sm:px-6 gap-1">
        <p className="font-medium text-xl capitalize">
          {routeSegment || "Together"}
        </p>
      </div>

      <div className="h-10 flex items-start justify-evenly px-5 pt-1 gap-1 sm:hidden">
        {tabs.map((tab, index) => (
          <Link
            href={tab.link}
            className={`w-1/5 flex items-center justify-center ${
              segment === tab.link || segment.startsWith(`${tab.link}/`)
                ? "text-primary"
                : "hover:text-primary"
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
// home, msg, notf, profile, explore
