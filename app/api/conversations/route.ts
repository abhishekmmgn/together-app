import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, conversationMembers, messages } from "@/lib/db/schema";
import { eq, desc, and, ne, gt, count, sql } from "drizzle-orm";
import { getDataFromToken } from "@/lib/getDataFromToken";

export async function GET(request: NextRequest) {
	try {
		const _id = await getDataFromToken(request);

		const memberships = await db
			.select({
				conversationId: conversationMembers.conversationId,
				lastReadAt: conversationMembers.lastReadAt,
			})
			.from(conversationMembers)
			.where(eq(conversationMembers.userId, _id));

		if (memberships.length === 0) {
			return NextResponse.json({
				message: "No conversations found.",
				data: [],
			});
		}

		const updatedConversations = await Promise.all(
			memberships.map(async (membership) => {
				const convId = membership.conversationId;
				const lastReadAt = membership.lastReadAt;

				const [otherMember] = await db
					.select({ userId: conversationMembers.userId })
					.from(conversationMembers)
					.where(
						and(
							eq(conversationMembers.conversationId, convId),
							ne(conversationMembers.userId, _id),
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
					.select({
						content: messages.content,
						createdAt: messages.createdAt,
					})
					.from(messages)
					.where(eq(messages.conversationId, convId))
					.orderBy(desc(messages.createdAt))
					.limit(1);

				// Count messages from the other person that arrived after lastReadAt.
				// If lastReadAt is null the user has never opened this conversation, so all their messages are unread.
				const [{ unreadCount }] = await db
					.select({ unreadCount: count() })
					.from(messages)
					.where(
						and(
							eq(messages.conversationId, convId),
							ne(messages.senderId, _id),
							lastReadAt ? gt(messages.createdAt, lastReadAt) : sql`true`,
						),
					);

				return {
					conversationId: convId,
					lastMessage: lastMessage
						? { time: lastMessage.createdAt, message: lastMessage.content }
						: { time: null, message: "" },
					user: {
						_id: otherUser?.id,
						name: otherUser?.name,
						username: otherUser?.username,
						profilePhoto: otherUser?.profilePhoto,
					},
					unreadCount,
				};
			}),
		);

		const filteredConversations = updatedConversations.filter(
			(c): c is NonNullable<typeof c> => c !== null,
		);

		filteredConversations.sort((a, b) => {
			const timeA = a.lastMessage?.time
				? new Date(a.lastMessage.time).getTime()
				: 0;
			const timeB = b.lastMessage?.time
				? new Date(b.lastMessage.time).getTime()
				: 0;
			return timeB - timeA;
		});

		return NextResponse.json({
			message: "Conversations found",
			data: filteredConversations,
		});
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
