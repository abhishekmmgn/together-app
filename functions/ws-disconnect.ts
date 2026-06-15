import type { APIGatewayProxyWebsocketHandlerV2 } from "aws-lambda";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { wsConnections } from "../lib/db/schema";

export const handler: APIGatewayProxyWebsocketHandlerV2 = async (event) => {
	const connectionId = event.requestContext.connectionId;
	const sql = neon(process.env.DATABASE_URL!);
	const db = drizzle(sql);

	await db
		.delete(wsConnections)
		.where(eq(wsConnections.connectionId, connectionId));

	return { statusCode: 200, body: "Disconnected" };
};
