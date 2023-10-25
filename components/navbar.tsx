"use client";

import { HiOutlineHome } from "react-icons/hi";
import { BiMessageRounded } from "react-icons/bi";
import { BsPersonCircle, BsSearch } from "react-icons/bs";
import { IoIosNotificationsOutline } from "react-icons/io";
import { useSelectedLayoutSegment } from "next/navigation";
import Link from "next/link";

const tabs = [
  {
    link: "/",
    icon: <HiOutlineHome className="w-7 h-7" />,
  },
  {
    link: "/messages",
    icon: <BiMessageRounded className="w-7 h-7" />,
  },
  {
    link: "/notifications",
    icon: <IoIosNotificationsOutline className="w-7 h-7" />,
  },
  {
    link: "/profile",
    icon: <BsPersonCircle className="w-6 h-6" />,
  },
  {
    link: "/explore",
    icon: <BsSearch className="w-6 h-6" />,
  },
];

export default function Navbar() {
  const routeSegment = useSelectedLayoutSegment();
  const segment = `/${routeSegment || ""}`;

  const isActive = false;
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
