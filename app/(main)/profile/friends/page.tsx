import Back from "@/components/back";
import ProfileCard from "@/components/explore/profile-card";
import type { PersonProfileType } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { getUserIdFromCookies } from "@/lib/getDataFromToken";
import { db } from "@/lib/db";
import { users, friends } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function FriendsPage() {
	const userId = await getUserIdFromCookies();
	if (!userId) redirect("/auth/login");

	const friendships = await db
		.select({ friendId: friends.friendId })
		.from(friends)
		.where(eq(friends.userId, userId));

	const friendIds = friendships.map((f) => f.friendId);

	const friendsData: PersonProfileType[] =
		friendIds.length > 0
			? await Promise.all(
					friendIds.map(async (friendId) => {
						const [friend] = await db
							.select({
								id: users.id,
								name: users.name,
								username: users.username,
								bio: users.bio,
								profilePhoto: users.profilePhoto,
							})
							.from(users)
							.where(eq(users.id, friendId));
						return {
							_id: friend.id,
							name: friend.name,
							username: friend.username || "",
							bio: friend.bio || "",
							profilePhoto: friend.profilePhoto || "",
						};
					}),
				)
			: [];

	return (
		<div className="w-full h-full px-5 lg:px-0">
			<Back />
			{friendsData.length ? (
				<>
					{friendsData.map((user) => (
						<ProfileCard
							key={user._id}
							_id={user._id}
							name={user.name}
							username={user.username}
							profilePhoto={user.profilePhoto}
							bio={user.bio}
						/>
					))}
				</>
			) : (
				<div className="mt-10 w-full grid place-items-center md:mt-40">
					<h1 className="text-3xl font-medium text-clip">
						You don&apos;t have any friends yet.
					</h1>
					<Button
						variant="link"
						className="w-fit max-w-fit"
						render={
							<Link href="/explore" className="w-full flex justify-center" />
						}
					>
						Search new friends
					</Button>
				</div>
			)}
		</div>
	);
}
