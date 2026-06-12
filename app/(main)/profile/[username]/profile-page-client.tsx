"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Post from "@/components/post/post";
import type { PostType } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import PostSkeleton from "@/components/post/post-skeleton";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import formatAvatarName from "@/lib/formatAvatarName";
import { checkLoggedIn } from "@/lib/checkLoggedIn";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import ErrorInfo from "@/components/error-info";
import { useState, use, useEffect } from "react";

export default function ExternalProfile({ id }: { id: string }) {
	const [isFriend, setIsFriend] = useState(false);
	const [isDisabled, setIsDisabled] = useState(false);

	const { isPending, error, data, isError } = useQuery({
		queryKey: ["profile", id],
		queryFn: async () => {
			const res = await fetch(`/api/user/${id}`);
			console.log(res);
			if (res.status === 404) throw new Error("Not found");

			if (res.ok) {
				const data = await res.json();
				setIsFriend(data.data.isFriend);
				return data.data;
			}
		},
		retry: (failureCount, error) => {
			// Disable retry if error is a 404
			if (error.message === "Not found") return false;

			return failureCount < 3;
		},
	});
	const { replace } = useRouter();

	useEffect(() => {
		if (data?.isOwnProfile) replace("/profile");
	}, [data?.isOwnProfile, replace]);

	if (data?.isOwnProfile) return null;

	async function changeFriendList(action: "add" | "remove") {
		setIsDisabled(true);
		if (!(await checkLoggedIn())) {
			replace("/auth/login");
		}
		try {
			const res = await fetch(`/api/user/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					action,
					_id: data?._id,
				}),
			});
			if (res.ok) setIsFriend(!isFriend);
			else console.log(res.statusText);
		} catch (err: any) {
			console.log("Error: ", err.message);
		} finally {
			setIsDisabled(false);
		}
	}

	const handleShare = async () => {
		let shareUrl = "";
		const domain = process.env.NEXT_PUBLIC_DOMAIN;
		if (domain) {
			const protocol = /^https?:\/\//i.test(domain)
				? ""
				: `${window.location.protocol}//`;
			const base = `${protocol}${domain}`.replace(/\/+$/, "");
			shareUrl = `${base}/profile/${id}`;
		} else {
			shareUrl = `${window.location.origin}/profile/${id}`;
		}

		const shareData = {
			title: "Together",
			text: `Check out ${data?.name}'s profile on Together`,
			url: shareUrl,
		};

		if (navigator.share) {
			try {
				await navigator.share(shareData);
			} catch (error) {
				if (error instanceof Error && error.name !== "AbortError") {
					console.error("Error sharing:", error);
				}
			}
		}
	};

	if (isPending) {
		return (
			<div className="p-5">
				<div className="grid gap-4 pb-4">
					<Skeleton className="w-28 lg:w-32 aspect-square rounded-lg" />
					<div>
						<Skeleton className="mb-1 h-5 w-24" />
						<Skeleton className="mb-1 h-4 w-48" />
					</div>
					<div className="flex flex-col gap-3">
						<Skeleton className="h-10 w-full max-w-md mx-auto" />
						<Skeleton className="h-10 w-full max-w-md mx-auto" />
					</div>
				</div>
				<Separator />
				<div className="py-6 space-y-4">
					<div className="space-y-2">
						<Skeleton className="h-5 w-32" />
						<PostSkeleton />
					</div>
				</div>
			</div>
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
		<div className="p-5">
			<div className="grid gap-4 pb-4">
				<Avatar className="w-28 h-28 lg:h-32 lg:w-32 aspect-square bg-secondary shadow-sm rounded-xl">
					<AvatarImage src={data.profilePhoto} alt="Your Profile photo" />
					<AvatarFallback className="text-primary text-4xl lg:text-5xl">
						{formatAvatarName(data.name)}
					</AvatarFallback>
				</Avatar>
				<div>
					<h1 className="-mt-1 capitalize font-medium text-2xl md:text-3xl">
						{data?.name}
					</h1>
					<p className="-mt-1 mb-1 text-tertiary-foreground">{data.bio}</p>
				</div>
				<div className="flex flex-col gap-3">
					{isFriend ? (
						<Button
							variant="secondary"
							disabled={isDisabled}
							className="max-w-md mx-auto w-full text-destructive"
							onClick={() => changeFriendList("remove")}
						>
							Remove as friend
						</Button>
					) : (
						<Button
							disabled={isDisabled}
							className="w-full max-w-md mx-auto"
							onClick={() => changeFriendList("add")}
						>
							Add as Friend
						</Button>
					)}
					<Button
						variant="secondary"
						className="max-w-md w-full mx-auto"
						onClick={handleShare}
					>
						Share Profile
					</Button>
				</div>
			</div>
			<Separator />
			<div className="py-6 space-y-4">
				<div className="space-y-2">
					<h1 className="font-medium text-2xl">Activity</h1>
					{data.posts.length ? (
						data.posts.map((post: PostType) => (
							<Post
								paddingX={true}
								key={post._id}
								post={{
									...post,
									creator: {
										_id: data._id,
										name: data.name,
										username: data.username,
										profilePhoto: data.profilePhoto,
									},
								}}
							/>
						))
					) : (
						<p>No posts created by the user</p>
					)}
				</div>
			</div>
		</div>
	);
}
