import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import formatAvatarName from "@/lib/formatAvatarName";
import type { ActiveConversationType, ConversationType } from "@/types";
import formatDate from "@/lib/formatDate";
import { useState } from "react";
import {
	deleteConversation,
	markConversationAsRead,
} from "@/lib/conversation-helpers";
import { useQueryClient } from "@tanstack/react-query";

export default function Conversation({
	conversationId,
	lastMessage,
	user,
	unreadCount,
	setActiveConversation,
}: ConversationType & {
	setActiveConversation: React.Dispatch<
		React.SetStateAction<ActiveConversationType>
	>;
}) {
	const [deleted, setDeleted] = useState(false);
	const queryClient = useQueryClient();
	const formattedTime = formatDate(lastMessage.time);

	async function handleMarkAsRead(e: React.MouseEvent<HTMLElement>) {
		e.stopPropagation();
		await markConversationAsRead(conversationId);
		queryClient.invalidateQueries({ queryKey: ["conversations"] });
	}

	async function handleDeleteConversation(e: React.MouseEvent<HTMLElement>) {
		e.stopPropagation();
		await deleteConversation(conversationId, user._id);
		setDeleted(true);
	}

	if (deleted) return <></>;

	return (
		<div
			className="cursor-pointer py-1 px-5 lg:px-0"
			onClick={() =>
				setActiveConversation({ conversationId, otherUserId: user._id })
			}
		>
			<ContextMenu>
				<ContextMenuTrigger>
					<div className="w-full h-17 flex items-center p-2 gap-4 rounded-xl hover:bg-muted/50">
						<Avatar className="w-14 h-14">
							<AvatarImage src={user.profilePhoto} alt={user.name} />
							<AvatarFallback>{formatAvatarName(user.name)}</AvatarFallback>
						</Avatar>
						<div className="w-full flex flex-col justify-center items-start">
							<div className="w-full flex items-center justify-between gap-5">
								<p className="w-[70%] line-clamp-1 text-lg font-medium">
									{user.name}
								</p>
								<p className="w-[30%] text-right text-sm line-clamp-1 text-muted-foreground">
									{formattedTime}
								</p>
							</div>
							<div className="w-[calc(100%-32px)] flex items-center justify-between gap-5">
								<p className="w-full line-clamp-1 text-secondary-foreground/80">
									{lastMessage.message}
								</p>
								{unreadCount > 0 && (
									<div className="min-w-5 h-5 px-1 rounded-full text-xs bg-primary text-white flex items-center justify-center shrink-0">
										{unreadCount > 10 ? "10+" : unreadCount}
									</div>
								)}
							</div>
						</div>
					</div>
				</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem onClick={handleMarkAsRead}>
						Mark as Read
					</ContextMenuItem>
					<ContextMenuItem
						className="text-destructive"
						onClick={handleDeleteConversation}
					>
						Delete
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>
		</div>
	);
}
