import { type NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/lib/getDataFromToken";
import { getSuggestions } from "@/lib/get-suggestions";

export async function GET(request: NextRequest) {
	try {
		const curUserId = await getDataFromToken(request);

		const updatedUsers = await getSuggestions(curUserId);

		return NextResponse.json({
			message: "Users found",
			data: updatedUsers,
		});
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 400 });
	}
}
