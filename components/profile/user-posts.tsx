"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Post from "@/components/post/post";
import Link from "next/link";
import { ShortErrorInfo } from "../error-info";
import { useQuery } from "@tanstack/react-query";
import PostSkeleton from "../post/post-skeleton";
import { PostType } from "@/types";

export default function UserPosts() {
	const { isPending, error, data, isError } = useQuery<{
		_id: string;
		name: string;
		profilePhoto: string;
		posts: PostType[];
	}>({
		queryKey: ["user-posts"],
		queryFn: async () => {
			const res = await fetch(`/api/user/posts`);
			if (res.ok) {
				const data = await res.json();
				return data.data;
			}
		},
		staleTime: 1000 * 60 * 5,
	});
	if (isPending) {
		return (
			<div className="py-5">
				<PostSkeleton />
			</div>
		);
	}

	if (isError) {
		console.log(error);
		return <ShortErrorInfo />;
	}
	return (
		<>
			{data.posts.length ? (
				<>
					{data.posts.map((post) => (
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
				<div className="py-10">
					<h3 className="text-center font-medium text-xl">
						You don&apos;t have any posts yet.
					</h3>
					<Link
						href="/"
						className={cn(
							buttonVariants({
								variant: "link",
							}),
						)}
					>
						New Post
					</Link>
				</div>
			)}
		</>
	);
}
