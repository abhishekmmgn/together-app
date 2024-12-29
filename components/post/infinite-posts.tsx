"use client";

import Post from "./post";
import type { PostType } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useRef } from "react";
import PostSkeleton from "./post-skeleton";

async function fetchPosts(pageParam: number): Promise<PostType[]> {
	const response = await fetch(`/api/posts?page=${pageParam}`);
	const { data } = await response.json();
	return data;
}

export default function InfinitePosts({
	prerenderedPosts,
}: { prerenderedPosts: PostType[] }) {
	const { data, error, fetchNextPage, hasNextPage, isFetching, isPending } =
		useInfiniteQuery({
			queryKey: ["infinite-posts"],
			queryFn: ({ pageParam }) => fetchPosts(pageParam),
			initialPageParam: 2,
			getNextPageParam: (lastPage, allPages) => {
				return lastPage.length ? allPages.length + 2 : undefined;
			},
		});

	const observer = useRef<IntersectionObserver>();

	const lastElementRef = useCallback(
		(node: HTMLDivElement) => {
			if (isPending) return;

			if (observer.current) observer.current.disconnect();

			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasNextPage && !isFetching) {
					fetchNextPage();
				}
			});

			if (node) observer.current.observe(node);
		},
		[fetchNextPage, hasNextPage, isFetching, isPending],
	);

	const posts = useMemo(() => {
		return data?.pages.reduce((acc, page) => {
			acc.push(...page);
			return acc;
		}, []);
	}, [data]);

	if (error) return <p className="text-destructive">Error on fetch data...</p>;
	return (
		<>
			{prerenderedPosts.map((post: PostType) => (
				<div key={post._id}>
					<Post post={post} />
				</div>
			))}
			{posts?.map((post: PostType) => (
				<div ref={lastElementRef} key={post._id}>
					<Post post={post} />
				</div>
			))}
			{isFetching && (
				<div className="space-y-4 p-5 lg:px-0">
					<PostSkeleton />
				</div>
			)}
		</>
	);
}
