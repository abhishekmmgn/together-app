"use client";

import { useEffect, useRef } from "react";
import ProfileCard from "./profile-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Post from "../post/post";
import ProfileCardSkeleton from "./profile-card-skeleton";
import PostSkeleton from "../post/post-skeleton";
import type { PersonProfileType, PostType } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";

function useInfiniteScrollTrigger(
	fetchNextPage: () => void,
	hasNextPage: boolean,
	isFetchingNextPage: boolean,
) {
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const obs = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
				fetchNextPage();
			}
		});
		obs.observe(el);
		return () => obs.disconnect();
	}, [fetchNextPage, hasNextPage, isFetchingNextPage]);
	return ref;
}

export default function SearchResults(props: { query: string }) {
	const postsQuery = useInfiniteQuery({
		queryKey: ["search-posts", props.query],
		queryFn: async ({ pageParam = 1 }) => {
			const res = await fetch(
				`/api/search-results?query=${encodeURIComponent(props.query)}&type=posts&page=${pageParam}`,
			);
			const json = await res.json();
			return { ...json.data, nextPage: (pageParam as number) + 1 };
		},
		getNextPageParam: (last) => (last.hasMore ? last.nextPage : undefined),
		initialPageParam: 1,
		enabled: !!props.query,
	});

	const usersQuery = useInfiniteQuery({
		queryKey: ["search-users", props.query],
		queryFn: async ({ pageParam = 1 }) => {
			const res = await fetch(
				`/api/search-results?query=${encodeURIComponent(props.query)}&type=users&page=${pageParam}`,
			);
			const json = await res.json();
			return { ...json.data, nextPage: (pageParam as number) + 1 };
		},
		getNextPageParam: (last) => (last.hasMore ? last.nextPage : undefined),
		initialPageParam: 1,
		enabled: !!props.query,
	});

	const allPosts = postsQuery.data?.pages.flatMap((p) => p.posts) ?? [];
	const allUsers = usersQuery.data?.pages.flatMap((p) => p.users) ?? [];

	const postsSentinelRef = useInfiniteScrollTrigger(
		postsQuery.fetchNextPage,
		!!postsQuery.hasNextPage,
		postsQuery.isFetchingNextPage,
	);
	const usersSentinelRef = useInfiniteScrollTrigger(
		usersQuery.fetchNextPage,
		!!usersQuery.hasNextPage,
		usersQuery.isFetchingNextPage,
	);

	return (
		<div className="pt-1 px-5 lg:px-0 overflow-y-auto flex-1">
			<Tabs defaultValue="posts">
				<TabsList>
					<TabsTrigger value="posts">Posts</TabsTrigger>
					<TabsTrigger value="person">Person</TabsTrigger>
				</TabsList>

				<TabsContent value="posts">
					<div className="py-4">
						{postsQuery.isPending ? (
							Array(5)
								.fill(null)
								.map((_, i) => <PostSkeleton key={i} />)
						) : allPosts.length ? (
							<>
								{allPosts.map((post: PostType) => (
									<Post key={post._id} post={post} paddingX={true} />
								))}
								{postsQuery.isFetchingNextPage && <PostSkeleton />}
								<div ref={postsSentinelRef} className="h-1" />
							</>
						) : (
							<div className="text-muted-foreground">No results found</div>
						)}
					</div>
				</TabsContent>

				<TabsContent value="person">
					<div className="py-4">
						{usersQuery.isPending ? (
							Array(5)
								.fill(null)
								.map((_, i) => <ProfileCardSkeleton key={i} />)
						) : allUsers.length ? (
							<>
								{allUsers.map((person: PersonProfileType) => (
									<ProfileCard
										key={person._id}
										_id={person._id}
										name={person.name}
										username={person.username}
										bio={person.bio}
										profilePhoto={person.profilePhoto}
									/>
								))}
								{usersQuery.isFetchingNextPage && <ProfileCardSkeleton />}
								<div ref={usersSentinelRef} className="h-1" />
							</>
						) : (
							<div className="text-muted-foreground">No results found</div>
						)}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
