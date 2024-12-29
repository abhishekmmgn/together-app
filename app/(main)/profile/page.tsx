import Link from "next/link";
import ProfileCard from "@/components/profile/profile-card";
import { Separator } from "@/components/ui/separator";
import TableRow from "@/components/table-row";
import UserPosts from "@/components/profile/user-posts";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Profile",
};

export default function ProfilePage() {
	return (
		<div className="py-4 lg:pb-8 lg:px-5">
			<ProfileCard />
			<Separator />
			<Link href="/profile/friends">
				<TableRow title="Friends" />
			</Link>
			<div className="pt-6 px-5 lg:px-0">
				<h2 className="font-medium text-2xl">Activity</h2>
				<UserPosts />
			</div>
		</div>
	);
}
