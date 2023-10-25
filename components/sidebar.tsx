"use client";

import { HiOutlineHome } from "react-icons/hi";
import { BiMessageRounded } from "react-icons/bi";
import { BsPersonCircle, BsSearch } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { IoIosNotificationsOutline } from "react-icons/io";
import { useSelectedLayoutSegment } from "next/navigation";
import Link from "next/link";

const tabs = [
  {
    link: "/",
    name: "Home",
    icon: <HiOutlineHome className="w-5 h-5 xl:w-6 xl:h-6" />,
  },
  {
    link: "/explore",
    name: "Explore",
    icon: <BsSearch className="w-4 h-4 xl:w-5 xl:h-5" />,
  },
  {
    link: "/messages",
    name: "Messages",
    icon: <BiMessageRounded className="w-5 h-5 xl:w-6 xl:h-6" />,
  },
  {
    link: "/notifications",
    name: "Notifications",
    icon: <IoIosNotificationsOutline className="w-5 h-5 xl:w-6 xl:h-6" />,
  },
  {
    link: "/profile",
    name: "Profile",
    icon: <BsPersonCircle className="w-4 h-4 xl:w-5 xl:h-5" />,
  },
  {
    link: "/settings",
    name: "Settings",
    icon: <IoSettingsOutline className="w-4 h-4 xl:w-5 xl:h-5" />,
  },
];

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
                ? "bg-secondary text-secondary-foreground"
                : "hover:bg-secondary"
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
