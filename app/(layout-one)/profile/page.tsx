"use client";

import Link from "next/link";
import ProfileCard from "@/components/profile/profile-card";
import { Separator } from "@/components/ui/separator";
import TableRow from "@/components/table-row";
import LoadingSkeleton from "@/components/loading-skeleton";
import Post from "@/components/post/post";
import type { BasicPostInterface } from "@/types";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import PostSkeleton from "@/components/post/post-skeleton";
import ErrorInfo from "@/components/error-info";

export default function ProfilePage() {
	const { isLoading, error, data, isError } = useQuery({
		queryKey: ["userProfile"],
		queryFn: async () => {
			const res = await fetch("/api/user/");
			if (res.ok) {
				const data = await res.json();
				return data.data;
			}
		},
	});
	if (isLoading) {
		return (
			<div className="p-5 space-y-4 ">
				<LoadingSkeleton />
				<Separator />
				<PostSkeleton />
			</div>
		);
	}

	if (isError) {
		console.log(error);
		return <ErrorInfo />;
	}

	return (
		<div className="py-4 lg:pb-8 lg:px-5">
			<ProfileCard
				photo={data.profilePhoto}
				name={data.name}
				bio={data.bio}
				last={true}
			/>
			<Separator />
			<Link href="/profile/friends">
				<TableRow title="Friends" textColor={false} />
			</Link>
			<div className="pt-6 px-5 lg:px-0">
				<div className="flex justify-between items-center">
					<h2 className="font-medium text-2xl">Activity</h2>
					<Link
						href="/"
						className={cn(
							buttonVariants({
								size: "sm",
								variant: "link",
							}),
						)}
					>
						New Post
					</Link>
				</div>
				{data.posts?.map.length ? (
					<>
						{data.posts.map((post: BasicPostInterface) => (
							<Post
								key={post._id}
								post={{
									...post,
									creator: {
										_id: data._id,
										name: data.name,
										profilePhoto: data.profilePhoto,
									},
								}}
								paddingX={true}
								canDelete={true}
							/>
						))}
					</>
				) : (
					<div className="py-10 grid place-items-center space-y-2">
						<h3 className="text-center font-medium text-xl">
							You don&apos;t have any posts yet.
						</h3>
						<Link
							href="/"
							className={cn(
								buttonVariants({
									size: "sm",
									variant: "link",
								}),
							)}
						>
							New Post
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}
