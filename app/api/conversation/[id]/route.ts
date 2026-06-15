import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
	users,
	conversations,
	conversationMembers,
	messages,
} from "@/lib/db/schema";
import { eq, and, ne, desc, lt } from "drizzle-orm";
import { getDataFromToken } from "@/lib/getDataFromToken";

type Params = {
	params: Promise<{ id: string }>;
};

const PAGE_SIZE = 25;

function resolveLimit(searchParams: URLSearchParams): number {
	const raw = Number(searchParams.get("limit"));
	if (Number.isFinite(raw) && raw > 0) return Math.min(raw, 100);
	return PAGE_SIZE;
}

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

		// Load a window of the most recent messages, oldest first for display.
		// `before` (ISO timestamp) pages backwards through history.
		const { searchParams } = new URL(request.url);
		const before = searchParams.get("before");
		const limit = resolveLimit(searchParams);

		// Fetch one extra row to cheaply detect whether older messages remain.
		const rows = await db
			.select({
				id: messages.id,
				senderId: messages.senderId,
				content: messages.content,
				createdAt: messages.createdAt,
			})
			.from(messages)
			.where(
				before
					? and(
							eq(messages.conversationId, conversationId),
							lt(messages.createdAt, new Date(before)),
						)
					: eq(messages.conversationId, conversationId),
			)
			.orderBy(desc(messages.createdAt))
			.limit(limit + 1);

		const hasMore = rows.length > limit;
		const convMessages = (hasMore ? rows.slice(0, limit) : rows).reverse();

		const data = [
			{
				_id: otherUser.id,
				name: otherUser.name,
				username: otherUser.username,
				profilePhoto: otherUser.profilePhoto,
			},
			convMessages,
			conversationId,
			hasMore,
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

export async function PATCH(request: NextRequest, props: Params) {
	const params = await props.params;
	try {
		const userId = await getDataFromToken(request);
		const conversationId = params.id;

		await db
			.update(conversationMembers)
			.set({ lastReadAt: new Date() })
			.where(
				and(
					eq(conversationMembers.conversationId, conversationId),
					eq(conversationMembers.userId, userId),
				),
			);

		return NextResponse.json({ message: "Marked as read" });
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
