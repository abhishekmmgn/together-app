import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
	region: process.env.S3_BUCKET_REGION ?? "ap-south-1",
	credentials:
		process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
			? {
					accessKeyId: process.env.AWS_ACCESS_KEY_ID,
					secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
				}
			: undefined,
});
