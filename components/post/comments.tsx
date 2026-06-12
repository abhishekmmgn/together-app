"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IoArrowUpCircle } from "react-icons/io5";
import { useState } from "react";
import { Comment } from "./comment";
import type { CommentsType } from "@/types";
import { checkLoggedIn } from "@/lib/checkLoggedIn";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Label } from "../ui/label";

export default function Comments({
	postId,
	comments,
}: {
	postId: string;
	comments?: CommentsType[];
}) {
	const [message, setMessage] = useState<string>("");
	const { replace } = useRouter();
	const queryClient = useQueryClient();

	const { data: userProfile } = useQuery<{
		_id: string;
		name: string;
		profilePhoto: string;
		bio: string;
	}>({
		queryKey: ["user-profile"],
		queryFn: async () => {
			const res = await fetch("/api/user");
			if (res.ok) {
				const data = await res.json();
				return data.data;
			}
			return null;
		},
		staleTime: 1000 * 60 * 5,
	});

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (!message.trim()) return;

		// check if logged in
		if (!(await checkLoggedIn())) {
			replace("/auth/login");
			return;
		}

		const commentText = message;
		setMessage("");

		// Create optimistic comment
		const newComment: CommentsType = {
			_id: Math.random().toString(),
			createdBy: {
				_id: userProfile?._id || "",
				name: userProfile?.name || "You",
				profilePhoto: userProfile?.profilePhoto || "",
			},
			message: commentText,
			createdAt: new Date(),
		};

		// Optimistically update the post query data
		const previousPost = queryClient.getQueryData<any>(["post", postId]);
		if (previousPost) {
			queryClient.setQueryData(["post", postId], {
				...previousPost,
				comments: [...(previousPost.comments || []), newComment],
			});
		}

		try {
			const res = await fetch(`/api/post/${postId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					message: commentText,
				}),
			});
			if (!res.ok) {
				throw new Error("Failed to post comment");
			}
		} catch (err: any) {
			console.log("Error: ", err.message);
			// Rollback to previous state on failure
			if (previousPost) {
				queryClient.setQueryData(["post", postId], previousPost);
			}
		} finally {
			// Revalidate from server
			queryClient.invalidateQueries({ queryKey: ["post", postId] });
		}
	}

	return (
		<div className="space-y-8">
			<form className="space-y-2" onSubmit={handleSubmit}>
				<Label>Add a comment</Label>
				<div className="flex gap-3 items-center">
					<Input
						type="text"
						value={message}
						placeholder="Write a comment"
						onChange={(e) => setMessage(e.target.value)}
					/>
					<Button
						size="icon"
						variant="ghost"
						disabled={message.length === 0}
						className="mt-1 hover:bg-transparent"
					>
						<IoArrowUpCircle className="size-7 text-primary" />
					</Button>
				</div>
			</form>
			<div className="space-y-3">
				{comments?.map((comment: CommentsType, index) => (
					<Comment
						type={
							comment.createdBy?._id === userProfile?._id ? "sent" : "recieved"
						}
						comment={comment.message}
						createdBy={comment.createdBy}
						key={comment._id || index}
					/>
				))}
			</div>
		</div>
	);
}
