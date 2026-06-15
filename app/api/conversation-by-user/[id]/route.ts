import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
	users,
	conversations,
	conversationMembers,
	messages,
} from "@/lib/db/schema";
import { eq, and, desc, lt } from "drizzle-orm";
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
		const otherUserId = params.id;

		const { searchParams } = new URL(request.url);
		const before = searchParams.get("before");
		const limit = resolveLimit(searchParams);

		// find a conversation where both users are members
		const myConversations = await db
			.select({ conversationId: conversationMembers.conversationId })
			.from(conversationMembers)
			.where(eq(conversationMembers.userId, userId));

		let conversationId: string | null = null;
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
				conversationId = conv.conversationId;
				break;
			}
		}

		// Load the most recent window of messages (oldest first), if a
		// conversation already exists. `before` pages backwards through history.
		let foundMessages: any[] = [];
		let hasMore = false;
		if (conversationId) {
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

			hasMore = rows.length > limit;
			foundMessages = (hasMore ? rows.slice(0, limit) : rows).reverse();
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
				// real id once a conversation exists; "0" sentinel for a brand-new chat
				conversationId ?? "0",
				hasMore,
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
