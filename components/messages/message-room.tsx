"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type {
	ActiveConversationType,
	ConversationData,
	Message,
} from "@/types";
import { useConversationMessages } from "@/hooks/useConversationMessages";
import {
	createConversation,
	markConversationAsRead,
} from "@/lib/conversation-helpers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IoArrowUpCircle } from "react-icons/io5";
import { IoChevronBack } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import formatAvatarName from "@/lib/formatAvatarName";
import { motion, AnimatePresence } from "framer-motion";
import formatDate from "@/lib/formatDate";

type RoomPropsType = {
	activeConversation: ActiveConversationType;
	setActiveConversation: React.Dispatch<
		React.SetStateAction<ActiveConversationType>
	>;
	currentUserId: string;
	send: (data: Record<string, unknown>) => boolean;
};

export default function MessageRoom(props: RoomPropsType) {
	const queryClient = useQueryClient();
	const messagesContainerRef = useRef<HTMLDivElement | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const [hasInput, setHasInput] = useState(false);

	const conversationKey = [
		"conversation",
		props.activeConversation.conversationId ||
			props.activeConversation.otherUserId,
	];

	const { data, isLoading, isError, hasMore, isLoadingOlder, loadOlder } =
		useConversationMessages(props.activeConversation);

	// A stale or forbidden ?c=<id> (e.g. from a shared/bookmarked URL) can't be
	// loaded — fall back to the conversation list instead of erroring out.
	useEffect(() => {
		if (isError) {
			props.setActiveConversation({ conversationId: "", otherUserId: "" });
		}
	}, [isError]);

	// Once we resolve the conversation ID from a user-based lookup, sync it up
	useEffect(() => {
		if (
			data?.conversationId &&
			data.conversationId !== props.activeConversation.conversationId &&
			data.conversationId.length > 1
		) {
			props.setActiveConversation({
				conversationId: data.conversationId,
				otherUserId: data.otherUser._id,
			});
		}
	}, [data?.conversationId]);

	// Mark conversation as read when opened
	useEffect(() => {
		const convId =
			data?.conversationId ?? props.activeConversation.conversationId;
		if (!convId || convId.length <= 1) return;
		markConversationAsRead(convId).then(() => {
			queryClient.invalidateQueries({ queryKey: ["conversations"] });
		});
	}, [data?.conversationId, props.activeConversation.conversationId]);

	const messages = data?.messages ?? [];
	const otherUser = data?.otherUser;
	const firstMessageId = messages[0]?.id;
	const lastMessageId = messages[messages.length - 1]?.id;

	// Preserve scroll position when older messages are prepended at the top, so
	// the view doesn't jump (firstMessageId only changes on a prepend).
	const pendingPrependRef = useRef<{ height: number; top: number } | null>(
		null,
	);
	useLayoutEffect(() => {
		const container = messagesContainerRef.current;
		if (container && pendingPrependRef.current) {
			const { height, top } = pendingPrependRef.current;
			container.scrollTop = container.scrollHeight - (height - top);
			pendingPrependRef.current = null;
		}
	}, [firstMessageId]);

	// Stick to the bottom on initial load and whenever a new message arrives
	// (lastMessageId is unchanged by a prepend, so history loads don't scroll).
	useEffect(() => {
		const container = messagesContainerRef.current;
		if (container) container.scrollTop = container.scrollHeight;
	}, [lastMessageId]);

	async function handleLoadOlder() {
		const container = messagesContainerRef.current;
		if (!container || !hasMore || isLoadingOlder) return;
		pendingPrependRef.current = {
			height: container.scrollHeight,
			top: container.scrollTop,
		};
		const didLoad = await loadOlder();
		if (!didLoad) pendingPrependRef.current = null;
	}

	function handleScroll() {
		const container = messagesContainerRef.current;
		if (!container) return;
		if (container.scrollTop < 80 && hasMore && !isLoadingOlder) {
			handleLoadOlder();
		}
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const input = inputRef.current;
		if (!input?.value.trim()) return;
		const content = input.value.trim();
		input.value = "";
		setHasInput(false);

		const conversationId =
			data?.conversationId ?? props.activeConversation.conversationId;

		if (conversationId && conversationId.length > 1) {
			// Optimistically add the message so it animates in immediately
			queryClient.setQueryData<ConversationData>(
				conversationKey,
				(prev: ConversationData | undefined) => {
					if (!prev) return prev;
					return {
						...prev,
						messages: [
							...prev.messages,
							{
								id: `opt-${Date.now()}`,
								senderId: props.currentUserId,
								content,
								createdAt: new Date().toISOString(),
							},
						],
					};
				},
			);

			const sent = props.send({
				action: "sendMessage",
				conversationId,
				content,
			});
			if (!sent) {
				await fetch(`/api/conversation/${conversationId}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ message: content }),
				});
				queryClient.invalidateQueries({ queryKey: ["conversations"] });
			}
		} else if (data?.otherUser._id) {
			await createConversation(content, data.otherUser._id);
			queryClient.invalidateQueries({ queryKey: conversationKey });
			queryClient.invalidateQueries({ queryKey: ["conversations"] });
		}
	}

	return (
		<div className="h-screen bg-background space-y-2">
			<div className="w-full fixed z-50 top-0 inset-x-0 bg-background pt-4 backdrop-filter backdrop-blur-xl bg-opacity-90 sm:top-14 sm:w-[calc(100%-210px)] md:w-[calc(100%-232px)] md:max-w-2xl sm:inset-x-auto">
				<div
					onClick={() =>
						props.setActiveConversation({
							conversationId: "",
							otherUserId: "",
						})
					}
				>
					<IoChevronBack className="w-6 h-6 text-muted-foreground absolute left-2 top-10 cursor-pointer sm:top-8" />
				</div>

				<div className="w-full flex flex-col gap-1 items-center justify-center">
					<Avatar className="w-11 h-11">
						<AvatarImage
							src={otherUser?.profilePhoto ?? ""}
							alt={otherUser?.name ?? ""}
						/>
						<AvatarFallback>
							{formatAvatarName(otherUser?.name ?? "")}
						</AvatarFallback>
					</Avatar>
					<h1 className="line-clamp-1 text-sm font-medium">
						{isLoading ? "…" : otherUser?.name}
					</h1>
				</div>
			</div>

			<div
				className="fixed top-24 bottom-16 inset-x-0 px-3 py-2 space-y-3 overflow-y-scroll sm:inset-x-auto sm:w-[calc(100%-210px)] md:w-[calc(100%-232px)] md:max-w-2xl sm:top-36 no-scrollbar"
				ref={messagesContainerRef}
				onScroll={handleScroll}
			>
				{isLoadingOlder && (
					<div className="w-full flex justify-center py-2">
						<div className="size-5 rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground animate-spin" />
					</div>
				)}
				<AnimatePresence initial={false}>
					{messages.map((msg: Message) =>
						msg.senderId === otherUser?._id ? (
							<MessageBubble
								message={msg.content}
								time={msg.createdAt}
								type="received"
								key={msg.id}
							/>
						) : (
							<MessageBubble
								message={msg.content}
								time={msg.createdAt}
								type="sent"
								key={msg.id}
							/>
						),
					)}
				</AnimatePresence>
			</div>

			<div className="fixed bottom-0 inset-x-0 p-3 bg-background sm:w-[calc(100%-210px)] md:w-[calc(100%-232px)] md:max-w-2xl sm:inset-x-auto sm:mx-auto lg:px-0">
				<form className="flex gap-3 items-center" onSubmit={handleSubmit}>
					<Input
						type="text"
						ref={inputRef}
						placeholder="Write a message"
						onChange={(e) => setHasInput(e.target.value.trim().length > 0)}
					/>
					<Button
						size="icon"
						variant="ghost"
						disabled={!hasInput}
						className="hover:bg-transparent"
					>
						<IoArrowUpCircle className="size-7 text-primary" />
					</Button>
				</form>
			</div>
		</div>
	);
}

function MessageBubble({
	message,
	time,
	type,
}: {
	message: string;
	time: string;
	type: "sent" | "received";
}) {
	const formattedTime = formatDate(time);

	return (
		<motion.div
			className={`w-full flex flex-col ${
				type === "sent" ? "items-end" : "items-start"
			}`}
			initial={{ opacity: 0, scale: 0.7, y: 24 }}
			animate={{ opacity: 1, scale: 1, y: 0 }}
			style={{
				transformOrigin: type === "sent" ? "bottom right" : "bottom left",
			}}
			transition={{
				type: "spring",
				stiffness: 480,
				damping: 30,
				mass: 0.8,
			}}
		>
			<div
				className={`relative z-0 w-fit max-w-[75%] py-2 px-4 ${
					type === "sent"
						? "bg-primary text-white rounded-2xl rounded-br-[4px] before:absolute before:w-5 before:h-5 before:bg-primary before:bottom-0 before:-right-[8px] before:rounded-bl-[16px] before:-z-10 after:absolute after:w-2.5 after:h-5 after:bg-background after:bottom-0 after:-right-[10px] after:rounded-bl-[10px] after:-z-10"
						: "bg-secondary text-secondary-foreground rounded-2xl rounded-bl-[4px] before:absolute before:w-5 before:h-5 before:bg-secondary before:bottom-0 before:-left-[8px] before:rounded-br-[16px] before:-z-10 after:absolute after:w-2.5 after:h-5 after:bg-background after:bottom-0 after:-left-[10px] after:rounded-br-[10px] after:-z-10"
				}`}
			>
				{message}
			</div>
			<span className="text-xs text-muted-foreground mt-1 px-1">
				{formattedTime}
			</span>
		</motion.div>
	);
}
