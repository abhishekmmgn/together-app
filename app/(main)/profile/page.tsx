import Link from "next/link";
import ProfileCard from "@/components/profile/profile-card";
import { Separator } from "@/components/ui/separator";
import TableRow from "@/components/table-row";
import UserPosts from "@/components/profile/user-posts";
import PostSkeleton from "@/components/post/post-skeleton";
import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getUserIdFromCookies } from "@/lib/getDataFromToken";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const metadata: Metadata = {
	title: "Profile",
};

export default async function ProfilePage() {
	const userId = await getUserIdFromCookies();
	if (!userId) redirect("/auth/login");

	const [user] = await db
		.select({
			id: users.id,
			name: users.name,
			username: users.username,
			email: users.email,
			profilePhoto: users.profilePhoto,
			bio: users.bio,
		})
		.from(users)
		.where(eq(users.id, userId));

	if (!user) redirect("/auth/login");

	return (
		<div className="py-4 lg:pb-8 lg:px-5">
			<ProfileCard
				_id={user.id}
				name={user.name}
				username={user.username || ""}
				profilePhoto={user.profilePhoto || ""}
				bio={user.bio || ""}
			/>
			<Separator />
			<Link href="/profile/friends">
				<TableRow title="Friends" />
			</Link>
			<div className="pt-6 px-5 lg:px-0">
				<h2 className="font-medium text-2xl">Activity</h2>
				<Suspense
					fallback={
						<div className="py-5">
							<PostSkeleton />
						</div>
					}
				>
					<UserPosts userId={userId} />
				</Suspense>
			</div>
		</div>
	);
}
