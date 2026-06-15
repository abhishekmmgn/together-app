import { Suspense } from "react";
import Messages from "@/components/messages/messages";
import type { Metadata } from "next";
import type { ConversationType } from "@/types";
import { getUserIdFromCookies } from "@/lib/getDataFromToken";
import { db } from "@/lib/db";
import { users, conversationMembers, messages } from "@/lib/db/schema";
import { eq, and, ne, desc, gt, count, sql } from "drizzle-orm";

export const metadata: Metadata = {
	title: "Messages",
};

export default async function ConversationsPage() {
	const userId = await getUserIdFromCookies();
	const conversations = userId ? await getConversations(userId) : [];
	return (
		<Suspense>
			<Messages
				initialConversations={conversations}
				currentUserId={userId ?? ""}
			/>
		</Suspense>
	);
}

async function getConversations(userId: string): Promise<ConversationType[]> {
	const memberships = await db
		.select({
			conversationId: conversationMembers.conversationId,
			lastReadAt: conversationMembers.lastReadAt,
		})
		.from(conversationMembers)
		.where(eq(conversationMembers.userId, userId));

	if (memberships.length === 0) return [];

	const results = await Promise.all(
		memberships.map(async (membership) => {
			const convId = membership.conversationId;
			const lastReadAt = membership.lastReadAt;

			const [otherMember] = await db
				.select({ userId: conversationMembers.userId })
				.from(conversationMembers)
				.where(
					and(
						eq(conversationMembers.conversationId, convId),
						ne(conversationMembers.userId, userId),
					),
				);

			if (!otherMember) return null;

			const [otherUser] = await db
				.select({
					id: users.id,
					name: users.name,
					username: users.username,
					profilePhoto: users.profilePhoto,
				})
				.from(users)
				.where(eq(users.id, otherMember.userId));

			const [lastMessage] = await db
				.select({ content: messages.content, createdAt: messages.createdAt })
				.from(messages)
				.where(eq(messages.conversationId, convId))
				.orderBy(desc(messages.createdAt))
				.limit(1);

			const [{ unreadCount }] = await db
				.select({ unreadCount: count() })
				.from(messages)
				.where(
					and(
						eq(messages.conversationId, convId),
						ne(messages.senderId, userId),
						lastReadAt ? gt(messages.createdAt, lastReadAt) : sql`true`,
					),
				);

			return {
				conversationId: convId,
				lastMessage: lastMessage
					? {
							time: lastMessage.createdAt?.toISOString() ?? "",
							message: lastMessage.content,
						}
					: { time: "", message: "" },
				user: {
					_id: otherUser?.id ?? "",
					name: otherUser?.name ?? "",
					username: otherUser?.username ?? "",
					profilePhoto: otherUser?.profilePhoto ?? "",
				},
				unreadCount,
			} satisfies ConversationType;
		}),
	);

	return results.filter((r): r is ConversationType => r !== null);
}
