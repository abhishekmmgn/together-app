import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
	users,
	conversations,
	conversationMembers,
	messages,
} from "@/lib/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { getDataFromToken } from "@/lib/getDataFromToken";

type Params = {
	params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, props: Params) {
	const params = await props.params;
	try {
		const userId = await getDataFromToken(request);
		const otherUserId = params.id;

		// find a conversation where both users are members
		const myConversations = await db
			.select({ conversationId: conversationMembers.conversationId })
			.from(conversationMembers)
			.where(eq(conversationMembers.userId, userId));

		let foundMessages: any[] = [];
		for (const conv of myConversations) {
			const [otherMember] = await db
				.select()
				.from(conversationMembers)
				.where(
					and(
						eq(conversationMembers.conversationId, conv.conversationId),
						eq(conversationMembers.userId, otherUserId),
					),
				);

			if (otherMember) {
				const convMessages = await db
					.select({
						senderId: messages.senderId,
						content: messages.content,
						createdAt: messages.createdAt,
					})
					.from(messages)
					.where(eq(messages.conversationId, conv.conversationId))
					.orderBy(asc(messages.createdAt));

				foundMessages = convMessages.map((msg) => ({
					[msg.senderId]: msg.content,
				}));
				break;
			}
		}

		const [otherUser] = await db
			.select({
				id: users.id,
				name: users.name,
				profilePhoto: users.profilePhoto,
			})
			.from(users)
			.where(eq(users.id, otherUserId));

		return NextResponse.json({
			message: "Success.",
			data: [
				{
					_id: otherUser?.id,
					name: otherUser?.name,
					profilePhoto: otherUser?.profilePhoto,
				},
				foundMessages,
				"0",
			],
		});
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

export async function POST(request: NextRequest, props: Params) {
	const params = await props.params;
	try {
		const currentUserId = await getDataFromToken(request);
		const { message } = await request.json();
		const otherUserId = params.id;

		// create conversation
		const [conversation] = await db
			.insert(conversations)
			.values({})
			.returning();

		// add both members
		await db.insert(conversationMembers).values([
			{ conversationId: conversation.id, userId: currentUserId },
			{ conversationId: conversation.id, userId: otherUserId },
		]);

		// add the first message
		await db.insert(messages).values({
			conversationId: conversation.id,
			senderId: currentUserId,
			content: message,
		});

		console.log("Works.");
		return NextResponse.json(
			{
				message: "Conversation created.",
			},
			{
				status: 200,
			},
		);
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
