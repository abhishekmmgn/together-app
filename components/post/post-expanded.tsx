import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { IoChatbubbleOutline } from "react-icons/io5";
import Post from "./post";
import { Comment } from "./comment";
import CreateComment from "./comments";
import type { PostType } from "@/types";
import { useEffect, useState } from "react";

async function getPost(postId: string) {
	const res = await fetch(`api/post/${postId}`, {
		cache: "no-cache",
	});
	const data = await res.json();
	return data.data;
}

export default function PostExpanded(props: { postId: string }) {
	const [post, setPost] = useState<PostType>();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const res = getPost(props.postId);
		console.log(res);

		setLoading(false);
	}, [props.postId]);
	return (
		<ResponsiveDialog
			trigger={
				<button className="outline-none flex items-center justify-center">
					<IoChatbubbleOutline className="text-xl text-muted-foreground cursor-pointer" />
				</button>
			}
			title="Comments"
		>
			<div className="flex flex-col overflow-y-auto max-h-[70vh]">
				{loading && <></>}
				{!loading && (
					<>
						<Post post={post!} />
						<div className="p-5">
							<div className="mt-3 space-y-3">
								{true && (
									<>
										<Comment
											createdBy={{
												name: "",
												_id: "",
												profilePhoto: "",
											}}
											type="sent"
											comment="This is a comment."
										/>
									</>
								)}
							</div>
						</div>
					</>
				)}
			</div>
		</ResponsiveDialog>
	);
}
