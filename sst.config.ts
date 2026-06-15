/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
	app(input) {
		return {
			name: "together-app",
			// production resources are retained on `sst remove`; dev is disposable
			removal: input?.stage === "production" ? "retain" : "remove",
			protect: ["production"].includes(input?.stage),
			home: "aws",
			providers: {
				aws: {
					region: "ap-south-1",
					// Local dev uses the named `sst` profile; CI (GitHub Actions)
					// gets ambient credentials via OIDC, so no profile there.
					profile: process.env.CI ? undefined : "sst",
				},
			},
		};
	},
	async run() {
		// Secrets — set per stage with: npx sst secret set <Name> <value>
		const databaseUrl = new sst.Secret("DatabaseUrl");
		const tokenSecret = new sst.Secret("TokenSecret");
		const mailtrapApiToken = new sst.Secret("MailtrapApiToken");
		const senderEmail = new sst.Secret("SenderEmail");

		// S3 bucket for user-uploaded media (images)
		const mediaBucket = new sst.aws.Bucket("MediaBucket", {
			public: true,
		});

		// WebSocket API for real-time messaging
		const wsApi = new sst.aws.ApiGatewayWebSocket("WsApi");

		wsApi.route("$connect", {
			handler: "functions/ws-connect.handler",
			link: [databaseUrl, tokenSecret],
			environment: {
				DATABASE_URL: databaseUrl.value,
				TOKEN_SECRET: tokenSecret.value,
			},
		});

		wsApi.route("$disconnect", {
			handler: "functions/ws-disconnect.handler",
			link: [databaseUrl],
			environment: {
				DATABASE_URL: databaseUrl.value,
			},
		});

		wsApi.route("sendMessage", {
			handler: "functions/ws-send-message.handler",
			link: [databaseUrl],
			environment: {
				DATABASE_URL: databaseUrl.value,
			},
			permissions: [
				{
					actions: ["execute-api:ManageConnections"],
					resources: ["*"],
				},
			],
		});

		const site = new sst.aws.Nextjs("Together", {
			link: [mediaBucket, wsApi],
			environment: {
				DATABASE_URL: databaseUrl.value,
				TOKEN_SECRET: tokenSecret.value,
				MAILTRAP_API_TOKEN: mailtrapApiToken.value,
				SENDER_EMAIL: senderEmail.value,
				// Public site origin. Until a custom domain is attached this is the
				// CloudFront URL, which isn't known until the first deploy — set it
				// as a secret after deploy #1, or wire up `site.url` with a domain.
				NEXT_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN ?? "",
				S3_BUCKET_NAME: mediaBucket.name,
				S3_BUCKET_REGION: "ap-south-1",
				NEXT_PUBLIC_WS_URL: wsApi.url,
			},
		});

		return {
			url: site.url,
			wsUrl: wsApi.url,
		};
	},
});
