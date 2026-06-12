import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
	users,
	conversations,
	conversationMembers,
	messages,
} from "@/lib/db/schema";
import { eq, desc, and, ne, sql } from "drizzle-orm";
import { getDataFromToken } from "@/lib/getDataFromToken";

export async function GET(request: NextRequest) {
	try {
		const _id = await getDataFromToken(request);

		// find all conversations the user is a member of
		const memberships = await db
			.select({ conversationId: conversationMembers.conversationId })
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

				// get the other user in this conversation
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

				// get other user's details
				const [otherUser] = await db
					.select({
						id: users.id,
						name: users.name,
						profilePhoto: users.profilePhoto,
					})
					.from(users)
					.where(eq(users.id, otherMember.userId));

				// get the last message
				const [lastMessage] = await db
					.select({
						content: messages.content,
						createdAt: messages.createdAt,
					})
					.from(messages)
					.where(eq(messages.conversationId, convId))
					.orderBy(desc(messages.createdAt))
					.limit(1);

				return {
					conversationId: convId,
					lastMessage: lastMessage
						? {
								time: lastMessage.createdAt,
								message: lastMessage.content,
							}
						: { time: null, message: "" },
					user: {
						_id: otherUser?.id,
						name: otherUser?.name,
						profilePhoto: otherUser?.profilePhoto,
					},
				};
			}),
		);

		return NextResponse.json({
			message: "Conversations found",
			data: updatedConversations.filter(Boolean),
		});
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
