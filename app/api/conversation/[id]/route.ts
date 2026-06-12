import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
	users,
	conversations,
	conversationMembers,
	messages,
} from "@/lib/db/schema";
import { eq, and, ne, asc } from "drizzle-orm";
import { getDataFromToken } from "@/lib/getDataFromToken";

type Params = {
	params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, props: Params) {
	const params = await props.params;
	try {
		const userId = await getDataFromToken(request);
		const conversationId = params.id;

		// find the other user in this conversation
		const [otherMember] = await db
			.select({ userId: conversationMembers.userId })
			.from(conversationMembers)
			.where(
				and(
					eq(conversationMembers.conversationId, conversationId),
					ne(conversationMembers.userId, userId),
				),
			);

		const [otherUser] = await db
			.select({
				id: users.id,
				name: users.name,
				username: users.username,
				profilePhoto: users.profilePhoto,
			})
			.from(users)
			.where(eq(users.id, otherMember.userId));

		// get all messages in the conversation
		const convMessages = await db
			.select({
				id: messages.id,
				senderId: messages.senderId,
				content: messages.content,
				createdAt: messages.createdAt,
			})
			.from(messages)
			.where(eq(messages.conversationId, conversationId))
			.orderBy(asc(messages.createdAt));

		// format messages to match existing API shape: [{senderId: message}, ...]
		const formattedMessages = convMessages.map((msg) => ({
			[msg.senderId]: msg.content,
		}));

		const data = [
			{
				_id: otherUser.id,
				name: otherUser.name,
				username: otherUser.username,
				profilePhoto: otherUser.profilePhoto,
			},
			formattedMessages,
		];

		return NextResponse.json({
			message: "Conversation found",
			data: data,
		});
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

export async function PUT(request: NextRequest, props: Params) {
	const params = await props.params;
	try {
		const { message } = await request.json();
		const _id = await getDataFromToken(request);
		const conversationId = params.id;

		// insert the new message
		await db.insert(messages).values({
			conversationId,
			senderId: _id,
			content: message,
		});

		// update conversation updatedAt
		await db
			.update(conversations)
			.set({ updatedAt: new Date() })
			.where(eq(conversations.id, conversationId));

		return NextResponse.json(
			{
				message: "Updated conversation",
			},
			{ status: 200 },
		);
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest, props: Params) {
	const params = await props.params;
	try {
		const conversationId = params.id;

		// cascade delete handles messages and conversation_members
		await db.delete(conversations).where(eq(conversations.id, conversationId));

		return NextResponse.json({
			message: "Conversation deleted",
		});
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
