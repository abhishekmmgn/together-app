import { type NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/lib/getDataFromToken";
import { getPosts } from "@/lib/get-posts";

export async function GET(request: NextRequest) {
	try {
		const curUserId = await getDataFromToken(request);

		// Get the page number from the query parameters
		const page = Number(request.nextUrl.searchParams.get("page")) || 1;

		const postsData = await getPosts(page, curUserId);

		return NextResponse.json({
			message: "Posts found",
			data: postsData,
		});
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
