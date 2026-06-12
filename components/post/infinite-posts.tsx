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
			initialPageParam: 1,
			getNextPageParam: (lastPage, allPages) => {
				return lastPage?.length ? allPages.length + 1 : undefined;
			},
			initialData: {
				pages: [prerenderedPosts],
				pageParams: [1],
			},
		});

	const observer = useRef<IntersectionObserver | null>(null);

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
		const all = data?.pages.flatMap((page) => page || []) || [];
		const seen = new Set();
		return all.filter((post) => {
			if (!post || !post._id) return false;
			if (seen.has(post._id)) return false;
			seen.add(post._id);
			return true;
		});
	}, [data]);

	if (error) return <p className="text-destructive">Error on fetch data...</p>;
	return (
		<>
			{posts.map((post: PostType, index: number) => (
				<div ref={index === posts.length - 1 ? lastElementRef : undefined} key={post._id}>
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
