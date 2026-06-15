import { randomUUID } from "node:crypto";
import type { APIGatewayProxyWebsocketHandlerV2 } from "aws-lambda";
import {
	ApiGatewayManagementApiClient,
	PostToConnectionCommand,
	GoneException,
} from "@aws-sdk/client-apigatewaymanagementapi";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, inArray } from "drizzle-orm";
import {
	messages,
	conversations,
	conversationMembers,
	wsConnections,
} from "../lib/db/schema";

export const handler: APIGatewayProxyWebsocketHandlerV2 = async (event) => {
	if (!event.body) return { statusCode: 400, body: "Missing body" };

	let conversationId: string;
	let content: string;
	try {
		({ conversationId, content } = JSON.parse(event.body));
	} catch {
		return { statusCode: 400, body: "Invalid JSON" };
	}

	const trimmed = content?.trim();
	if (!conversationId || !trimmed) {
		return { statusCode: 400, body: "Missing conversationId or content" };
	}

	const senderConnectionId = event.requestContext.connectionId;
	const sql = neon(process.env.DATABASE_URL!);
	const db = drizzle(sql);

	// Resolve the sender and the conversation's members in parallel (independent
	// reads). Membership is checked against conversation_members directly, so it
	// doesn't depend on who currently has a live connection.
	const [[conn], memberRows] = await Promise.all([
		db
			.select({ userId: wsConnections.userId })
			.from(wsConnections)
			.where(eq(wsConnections.connectionId, senderConnectionId)),
		db
			.select({ userId: conversationMembers.userId })
			.from(conversationMembers)
			.where(eq(conversationMembers.conversationId, conversationId)),
	]);

	if (!conn) return { statusCode: 401, body: "Unknown connection" };
	const senderId = conn.userId;

	const memberIds = memberRows.map((m) => m.userId);
	if (!memberIds.includes(senderId)) {
		return { statusCode: 403, body: "Not a member" };
	}

	// One query for every member's live connections (was a serial per-member loop).
	const allMemberConns = memberIds.length
		? await db
				.select({ connectionId: wsConnections.connectionId })
				.from(wsConnections)
				.where(inArray(wsConnections.userId, memberIds))
		: [];

	// Generate the id/timestamp up front so we can broadcast without waiting on
	// the DB write. The columns default to the same values, so passing them
	// explicitly is equivalent — it just lets the recipient see the real id now.
	const id = randomUUID();
	const createdAt = new Date();

	const { domainName, stage } = event.requestContext as any;
	const apigw = new ApiGatewayManagementApiClient({
		endpoint: `https://${domainName}/${stage}`,
	});

	const payload = JSON.stringify({
		type: "message",
		id,
		conversationId,
		senderId,
		content: trimmed,
		createdAt,
	});

	const broadcast = Promise.all(
		allMemberConns.map(async ({ connectionId }) => {
			try {
				await apigw.send(
					new PostToConnectionCommand({
						ConnectionId: connectionId,
						Data: Buffer.from(payload),
					}),
				);
			} catch (err) {
				if (err instanceof GoneException) {
					await db
						.delete(wsConnections)
						.where(eq(wsConnections.connectionId, connectionId));
				} else {
					console.error("[WS] PostToConnection failed for", connectionId, err);
				}
			}
		}),
	);

	// Persist concurrently with the broadcast. We still await before returning —
	// a Lambda freezes after the handler returns, so a truly un-awaited write
	// would be dropped. This way the recipient isn't gated behind the insert, but
	// the message is still guaranteed durable.
	const persist = Promise.all([
		db.insert(messages).values({ id, conversationId, senderId, content: trimmed, createdAt }),
		db
			.update(conversations)
			.set({ updatedAt: createdAt })
			.where(eq(conversations.id, conversationId)),
	]);

	await Promise.all([broadcast, persist]);

	return { statusCode: 200, body: "OK" };
};
