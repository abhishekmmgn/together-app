import { NextResponse } from "next/server";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 as s3Client } from "@/lib/s3";

import { getUserIdFromCookies } from "@/lib/getDataFromToken";
import { MAX_IMAGE_SIZE, MAX_VIDEO_SIZE } from "@/lib/constants";
import { formatBytes } from "@/lib/utils";

const REGION = process.env.S3_BUCKET_REGION ?? "ap-south-1";

const ALLOWED_TYPES: Record<string, string> = {
	"image/jpeg": "jpg",
	"image/png": "png",
	"image/webp": "webp",
	"image/gif": "gif",
	"video/mp4": "mp4",
	"video/webm": "webm",
	"video/quicktime": "mov",
};

/** POST /api/upload-url — returns a presigned PUT URL + public file URL */
export async function POST(request: Request) {
	try {
		const userId = await getUserIdFromCookies();
		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { contentType, fileSize } = body;

		// Validate content type against the allowlist
		if (!contentType || !ALLOWED_TYPES[contentType]) {
			return NextResponse.json(
				{ error: "Only image or video files are allowed" },
				{ status: 400 },
			);
		}
		const isVideo = contentType.startsWith("video/");
		const isImage = !isVideo;

		// Validate file size server-side
		if (isImage && fileSize > MAX_IMAGE_SIZE) {
			return NextResponse.json(
				{
					error: `Image must be smaller than ${formatBytes(MAX_IMAGE_SIZE, 0)}`,
				},
				{ status: 400 },
			);
		}
		if (isVideo && fileSize > MAX_VIDEO_SIZE) {
			return NextResponse.json(
				{
					error: `Video must be smaller than ${formatBytes(MAX_VIDEO_SIZE, 0)}`,
				},
				{ status: 400 },
			);
		}

		const bucketName = process.env.S3_BUCKET_NAME;
		if (!bucketName) {
			return NextResponse.json(
				{ error: "S3 bucket not configured" },
				{ status: 500 },
			);
		}

		// Generate a unique key for the file (extension derived from the
		// validated content type, never from the client-supplied file name)
		const ext = ALLOWED_TYPES[contentType];
		const folder = isVideo ? "videos" : "images";
		const key = `uploads/${folder}/${userId}/${crypto.randomUUID()}.${ext}`;

		const command = new PutObjectCommand({
			Bucket: bucketName,
			Key: key,
			ContentType: contentType,
		});

		const uploadUrl = await getSignedUrl(s3Client, command, {
			expiresIn: 60 * 10, // 10 minutes
		});

		const fileUrl = `https://${bucketName}.s3.${REGION}.amazonaws.com/${key}`;

		return NextResponse.json({ uploadUrl, fileUrl, key });
	} catch (error) {
		console.error("Error generating presigned URL:", error);
		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: "Failed to generate upload URL",
			},
			{ status: 500 },
		);
	}
}

/** DELETE /api/upload-url — deletes an S3 object by key (cleanup on abandon) */
export async function DELETE(request: Request) {
	try {
		const userId = await getUserIdFromCookies();
		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { key } = await request.json();
		if (!key) {
			return NextResponse.json({ error: "Key is required" }, { status: 400 });
		}

		// Security: only allow deleting keys that belong to this user
		if (!key.includes(`/${userId}/`)) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const bucketName = process.env.S3_BUCKET_NAME;
		if (!bucketName) {
			return NextResponse.json(
				{ error: "S3 bucket not configured" },
				{ status: 500 },
			);
		}

		await s3Client.send(
			new DeleteObjectCommand({ Bucket: bucketName, Key: key }),
		);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error deleting S3 object:", error);
		return NextResponse.json(
			{
				error: error instanceof Error ? error.message : "Failed to delete file",
			},
			{ status: 500 },
		);
	}
}
