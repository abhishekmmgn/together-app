"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IoArrowUpCircle } from "react-icons/io5";
import { useState, useTransition } from "react";
import { Comment } from "./comment";
import type { CommentsType } from "@/types";
import { checkLoggedIn } from "@/lib/checkLoggedIn";
import { useRouter } from "next/navigation";
import { Label } from "../ui/label";

export default function Comments({
	postId,
	comments,
	currentUserId,
}: {
	postId: string;
	comments?: CommentsType[];
	currentUserId?: string;
}) {
	const [message, setMessage] = useState<string>("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { replace } = useRouter();
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (!message.trim()) return;

		if (!(await checkLoggedIn())) {
			replace("/auth/login");
			return;
		}

		const commentText = message;
		setMessage("");
		setIsSubmitting(true);

		try {
			const res = await fetch(`/api/post/${postId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ message: commentText }),
			});
			if (!res.ok) throw new Error("Failed to post comment");
			startTransition(() => router.refresh());
		} catch (err: any) {
			console.log("Error: ", err.message);
		} finally {
			setIsSubmitting(false);
		}
	}

	const disabled = isSubmitting || isPending;

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
						disabled={disabled}
					/>
					<Button
						size="icon"
						variant="ghost"
						disabled={message.length === 0 || disabled}
						className="hover:bg-transparent"
					>
						<IoArrowUpCircle className="size-7 text-primary" />
					</Button>
				</div>
			</form>
			<div className="space-y-3">
				{comments?.map((comment: CommentsType, index: number) => (
					<Comment
						type={
							comment.createdBy?._id === currentUserId ? "sent" : "recieved"
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
