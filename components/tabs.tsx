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
		icon: <IoHomeOutline size={26} />,
	},
	{
		link: "/explore",
		name: "Explore",
		icon: <IoSearchOutline size={26} />,
	},
	{
		link: "/messages",
		name: "Messages",
		icon: <IoChatbubbleOutline size={26} />,
	},
	{
		link: "/notifications",
		name: "Notifications",
		icon: <IoNotificationsOutline size={26} />,
	},
	{
		link: "/profile",
		name: "Profile",
		icon: <IoPersonOutline size={26} />,
	},
	{
		link: "/settings",
		name: "Settings",
		icon: <IoSettingsOutline size={26} />,
	},
];
