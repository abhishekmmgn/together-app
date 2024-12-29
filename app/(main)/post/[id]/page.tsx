"use client";

import Post from "@/components/post/post";
import Comments from "@/components/post/comments";
import { notFound } from "next/navigation";
import PostSkeleton from "@/components/post/post-skeleton";
import { useQuery } from "@tanstack/react-query";
import ErrorInfo from "@/components/error-info";

type Props = {
	params: { id: string };
};

export default function Home({ params }: Props) {
	const { isPending, error, data, isError } = useQuery({
		queryKey: ["post", params.id],
		queryFn: async () => {
			const res = await fetch(`/api/post/${params.id}`);
			if (res.status === 404) {
				throw new Error("Not found");
			}
			if (res.ok) {
				const data = await res.json();
				return data.data;
			}
		},
		staleTime: 1000 * 60,
	});

	if (isPending) {
		return (
			<main className="p-5">
				<PostSkeleton />
			</main>
		);
	}

	if (isError && error.message === "Not found") {
		notFound();
	}

	if (isError) {
		console.log(error, error.message, error.name);
		return <ErrorInfo />;
	}

	return (
		<>
			<Post post={data} />
			<div className="p-5 lg:px-0">
				<Comments postId={params.id} comments={data.comments} />
			</div>
		</>
	);
}
