import {
	IoHomeOutline,
	IoNotificationsOutline,
	IoSearchOutline,
	IoPersonOutline,
	IoSettingsOutline,
	IoChatbubbleOutline,
} from "react-icons/io5";

export const tabs = [
	{
		link: "/",
		name: "Home",
		icon: <IoHomeOutline className="w-6 h-6 sm:w-5 sm:h-5" />,
	},
	{
		link: "/explore",
		name: "Explore",
		icon: <IoSearchOutline className="w-6 h-6 sm:w-5 sm:h-5" />,
	},
	{
		link: "/messages",
		name: "Messages",
		icon: <IoChatbubbleOutline className="w-6 h-6 sm:w-5 sm:h-5" />,
	},
	{
		link: "/notifications",
		name: "Notifications",
		icon: <IoNotificationsOutline className="w-6 h-6 sm:w-5 sm:h-5" />,
	},
	{
		link: "/profile",
		name: "Profile",
		icon: <IoPersonOutline className="w-6 h-6 sm:w-5 sm:h-5" />,
	},
	{
		link: "/settings",
		name: "Settings",
		icon: <IoSettingsOutline className="w-6 h-6 sm:w-5 sm:h-5" />,
	},
];
