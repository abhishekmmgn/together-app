import { NextResponse } from "next/server";
import {
	S3Client,
	PutObjectCommand,
	DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { verifySession } from "@/lib/sessions";

const s3Client = new S3Client({
	region: process.env.S3_BUCKET_REGION ?? "ap-south-1",
	credentials:
		process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
			? {
					accessKeyId: process.env.AWS_ACCESS_KEY_ID,
					secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
				}
			: undefined, // falls back to ambient credentials (SST/Lambda role)
});

const MAX_IMAGE_SIZE = 3 * 1024 * 1024; // 3 MB
const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20 MB

/** POST /api/upload-url — returns a presigned PUT URL + public file URL */
export async function POST(request: Request) {
	try {
		const { userId } = await verifySession();
		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { contentType, fileName, fileSize } = body;

		// Validate content type — only images and videos allowed
		const isImage = contentType?.startsWith("image/");
		const isVideo = contentType?.startsWith("video/");

		if (!contentType || (!isImage && !isVideo)) {
			return NextResponse.json(
				{ error: "Only image or video files are allowed" },
				{ status: 400 },
			);
		}

		// Validate file size server-side
		if (isImage && fileSize > MAX_IMAGE_SIZE) {
			return NextResponse.json(
				{ error: `Image must be smaller than 3 MB` },
				{ status: 400 },
			);
		}
		if (isVideo && fileSize > MAX_VIDEO_SIZE) {
			return NextResponse.json(
				{ error: `Video must be smaller than 20 MB` },
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

		// Generate a unique key for the file
		const ext = fileName?.split(".").pop() ?? (isVideo ? "mp4" : "jpg");
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

		// Construct the public URL for the uploaded file
		const region = process.env.S3_BUCKET_REGION ?? "ap-south-1";
		const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

		return NextResponse.json({ uploadUrl, fileUrl, key });
	} catch (error: any) {
		console.error("Error generating presigned URL:", error);
		return NextResponse.json(
			{ error: error.message ?? "Failed to generate upload URL" },
			{ status: 500 },
		);
	}
}

/** DELETE /api/upload-url — deletes an S3 object by key (cleanup on abandon) */
export async function DELETE(request: Request) {
	try {
		const { userId } = await verifySession();
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
	} catch (error: any) {
		console.error("Error deleting S3 object:", error);
		return NextResponse.json(
			{ error: error.message ?? "Failed to delete file" },
			{ status: 500 },
		);
	}
}
