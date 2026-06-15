import type { APIGatewayProxyWebsocketHandlerV2 } from "aws-lambda";
import { jwtVerify } from "jose";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { wsConnections } from "../lib/db/schema";

export const handler: APIGatewayProxyWebsocketHandlerV2 = async (event) => {
	const token = event.queryStringParameters?.token;
	if (!token) return { statusCode: 401, body: "Unauthorized" };

	const secret = process.env.TOKEN_SECRET;
	if (!secret) return { statusCode: 500, body: "Server misconfiguration" };

	let userId: string;
	try {
		const { payload } = await jwtVerify(
			token,
			new TextEncoder().encode(secret),
		);
		if (typeof payload.id !== "string" || payload.purpose !== "ws") {
			return { statusCode: 401, body: "Invalid token" };
		}
		userId = payload.id;
	} catch {
		return { statusCode: 401, body: "Unauthorized" };
	}

	const connectionId = event.requestContext.connectionId;
	const sql = neon(process.env.DATABASE_URL!);
	const db = drizzle(sql);

	await db
		.insert(wsConnections)
		.values({ connectionId, userId })
		.onConflictDoNothing();

	return { statusCode: 200, body: "Connected" };
};
