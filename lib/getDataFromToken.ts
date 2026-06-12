import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest) => {
	try {
		const token = request.cookies.get("token")?.value || "";
		const tokenSecret = process.env.TOKEN_SECRET;
		if (token && tokenSecret) {
			const decodedToken: any = jwt.verify(token, tokenSecret);
			return decodedToken.id;
		}
		return null;
	} catch (error: any) {
		return null;
	}
};

/** Same as getDataFromToken, but for server components / handlers without a NextRequest. */
export const getUserIdFromCookies = async (): Promise<string | null> => {
	try {
		const token = (await cookies()).get("token")?.value || "";
		const tokenSecret = process.env.TOKEN_SECRET;
		if (token && tokenSecret) {
			const decodedToken: any = jwt.verify(token, tokenSecret);
			return decodedToken.id;
		}
		return null;
	} catch {
		return null;
	}
};
