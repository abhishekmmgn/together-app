"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { Separator } from "@/components/ui/separator";
import copyLink from "@/lib/copyLink";
import formatAvatarName from "@/lib/formatAvatarName";
import formatPostDate from "@/lib/formatDate";
import type { PostType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useOptimistic, useState, useTransition } from "react";
import {
	IoArrowRedoOutline,
	IoChatbubbleOutline,
	IoEllipsisHorizontal,
	IoHeart,
	IoHeartOutline,
} from "react-icons/io5";

import { checkLoggedIn } from "@/lib/checkLoggedIn";
import { useRouter } from "next/navigation";
import { ErrorBoundary } from "@/components/error-boundary";

function PostErrorFallback({
	post,
	paddingX,
	reset,
}: { post?: PostType; paddingX?: boolean; reset: () => void }) {
	return (
		<>
			<div className="pt-1 pb-3">
				<div
					className={`${
						!paddingX && "px-4"
					} py-2 flex items-center justify-between lg:px-0`}
				>
					<div className="w-full flex items-center gap-3">
						{post?.creator ? (
							<Avatar className="h-11 w-11">
								<AvatarImage
									src={post.creator.profilePhoto}
									alt={post.creator.name}
								/>
								<AvatarFallback>
									{formatAvatarName(post.creator.name)}
								</AvatarFallback>
							</Avatar>
						) : (
							<div className="h-11 w-11 rounded-full bg-secondary animate-pulse" />
						)}
						<div className="w-full flex flex-col gap-0.5">
							<h1 className="line-clamp-1 font-medium">
								{post?.creator?.name || "Unknown"}
							</h1>
							<p className="text-sm line-clamp-1 text-destructive">
								Error loading post
							</p>
						</div>
					</div>
				</div>
				<div
					className={`${
						!paddingX ? "mx-4 lg:mx-0" : ""
					} py-6 flex flex-col items-center justify-center space-y-3 bg-secondary/50 rounded-lg border border-border/50`}
				>
					<p className="text-sm text-muted-foreground">
						Something went wrong while displaying this post.
					</p>
					<Button variant="outline" size="sm" onClick={reset}>
						Try again
					</Button>
				</div>
			</div>
			<Separator />
		</>
	);
}

function PostContent(props: {
	post: PostType;
	paddingX?: boolean;
	canDelete?: boolean;
	hideDropdown?: boolean;
}) {
	const [likesState, setLikesState] = useState({
		liked: props.post.liked,
		likes: props.post?.likes || 0,
	});
	const [isDeleted, setIsDeleted] = useState(false);

	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const [_, startTransition] = useTransition();
	const [optimisticLikes, setOptimisticLikes] = useOptimistic(
		likesState,
		(state, nextLiked: boolean) => ({
			liked: nextLiked,
			likes: state.likes + (nextLiked ? 1 : -1),
		}),
	);

	useEffect(() => {
		setLikesState({
			liked: props.post.liked,
			likes: props.post?.likes || 0,
		});
	}, [props.post.liked, props.post?.likes]);

	const { replace } = useRouter();

	const formattedDate = formatPostDate(props.post?.createdAt);

	async function changeLike() {
		const nextLiked = !likesState.liked;

		startTransition(async () => {
			setOptimisticLikes(nextLiked);

			try {
				const isLoggedIn = await checkLoggedIn();
				if (!isLoggedIn) {
					replace("/auth/login");
					return;
				}

				const res = await fetch(`/api/post/${props.post._id}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ like: true }),
				});

				if (res.ok) {
					setLikesState({
						liked: nextLiked,
						likes: likesState.likes + (nextLiked ? 1 : -1),
					});
				} else {
					if (res.status === 404 || res.status === 401) {
						replace("/auth/login");
					}
				}
			} catch (error) {
				console.error("Error toggling like:", error);
			}
		});
	}

	async function deletePost() {
		setIsDeleting(true);
		try {
			const res = await fetch(`/api/post/${props.post._id}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ postId: props.post._id }),
			});
			if (res.ok) {
				setIsDeleted(true);
				setIsDeleteDialogOpen(false);
			}
		} catch (error) {
			console.error("Failed to delete post:", error);
		} finally {
			setIsDeleting(false);
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
			shareUrl = `${base}/post/${props.post?._id}`;
		} else {
			shareUrl = `${window.location.origin}/post/${props.post?._id}`;
		}

		const shareData = {
			title: "Together",
			text: props.post?.thread || "",
			url: shareUrl,
		};

		console.log("[Share Debug] shareData:", shareData);

		if (navigator.share) {
			try {
				await navigator.share(shareData);
			} catch (error) {
				if (error instanceof Error && error.name !== "AbortError") {
					console.error("Error sharing:", error);
					copyLink(`/post/${props.post?._id}`);
				}
			}
		} else {
			copyLink(`/post/${props.post?._id}`);
		}
	};

	if (isDeleted) return <></>;
	return (
		<>
			<div className="pt-1 pb-3">
				<div
					className={`${
						!props.paddingX && "px-4"
					} py-2 flex items-center justify-between lg:px-0`}
				>
					<div className="w-full flex items-center gap-3">
						<Link href={`/profile/${props.post.creator._id}`}>
							<Avatar className="h-11 w-11">
								<AvatarImage
									src={props.post.creator.profilePhoto}
									alt={props.post.creator.name}
								/>
								<AvatarFallback>
									{formatAvatarName(props.post.creator.name)}
								</AvatarFallback>
							</Avatar>
						</Link>
						<div className="w-full flex flex-col gap-0.5">
							<h1 className="line-clamp-1 font-medium">
								{props.post?.creator.name}
							</h1>
							<p className="text-sm line-clamp-1 text-muted-foreground">
								{formattedDate}
							</p>
						</div>
						{!props.hideDropdown && (
							<DropdownMenu>
								<DropdownMenuTrigger
									className="outline-none"
									render={
										<Button
											variant="ghost"
											size="icon"
											className="h-9 w-9 rounded-full"
										>
											<IoEllipsisHorizontal className="text-2xl" />
										</Button>
									}
								/>
								<DropdownMenuContent className="border-border" align="end">
									<Link href={`/post/${props.post?._id}`}>
										<DropdownMenuItem>Go to post</DropdownMenuItem>
									</Link>
									{props.canDelete && (
										<>
											<DropdownMenuSeparator />
											<DropdownMenuItem
												variant="destructive"
												onClick={() => {
													setIsDeleteDialogOpen(true);
												}}
											>
												Delete post
											</DropdownMenuItem>
										</>
									)}
								</DropdownMenuContent>
							</DropdownMenu>
						)}
						{props.canDelete && (
							<ResponsiveDialog
								open={isDeleteDialogOpen}
								onOpenChange={setIsDeleteDialogOpen}
								title="Delete Post"
								description="Are you sure you want to delete this post? This action cannot be undone."
								trigger={<span className="hidden" />}
								isTriggerChild={false}
							>
								<Button
									variant="destructive"
									className="w-full mt-4"
									onClick={deletePost}
									loading={isDeleting}
									loadingText="Deleting Post"
								>
									Delete Post
								</Button>
							</ResponsiveDialog>
						)}
					</div>
				</div>
				<p
					className={`${
						!props.paddingX && "px-4"
					} mb-2 text-sm+ lg:text-base line-clamp-3 md:mb-3 md:mt-1 lg:px-0`}
				>
					{props.post?.thread}
				</p>
				{props.post?.image && (
					<Image
						src={props.post?.image}
						alt="Post Photo"
						width={480}
						height={360}
						className="object-cover w-full aspect-3/2 bg-secondary shadow-sm"
					/>
				)}
				<div
					className={`${
						!props.paddingX && "px-4 lg:px-0"
					} h-11 w-full flex gap-4 items-center`}
				>
					{optimisticLikes.liked ? (
						<IoHeart
							className="text-2xl text-primary cursor-pointer"
							onClick={() => changeLike()}
						/>
					) : (
						<IoHeartOutline
							className="text-2xl text-muted-foreground cursor-pointer"
							onClick={() => changeLike()}
						/>
					)}
					<Link href={`/post/${props.post?._id}`}>
						<IoChatbubbleOutline className="text-xl text-muted-foreground cursor-pointer" />
					</Link>
					<IoArrowRedoOutline
						className="text-2xl text-muted-foreground cursor-pointer"
						onClick={handleShare}
					/>
				</div>
				<div
					className={`${
						!props.paddingX && "px-4 lg:px-0"
					} h-8 w-full flex gap-4 items-start text-muted-foreground text-xs`}
				>
					<p>{optimisticLikes.likes} Likes</p>
					<p>{props.post.commentsLength} Comments</p>
				</div>
			</div>
			<Separator />
		</>
	);
}

export default function Post(props: {
	post: PostType;
	paddingX?: boolean;
	canDelete?: boolean;
	hideDropdown?: boolean;
}) {
	return (
		<ErrorBoundary
			fallback={(error, reset) => (
				<PostErrorFallback
					post={props.post}
					paddingX={props.paddingX}
					reset={reset}
				/>
			)}
		>
			<PostContent {...props} />
		</ErrorBoundary>
	);
}
