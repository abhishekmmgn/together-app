import type { NextRequest } from "next/server";
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
