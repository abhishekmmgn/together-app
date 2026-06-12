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
    const mailTrapUser = new sst.Secret("MailTrapUser");
    const mailTrapPassword = new sst.Secret("MailTrapPassword");
    const senderEmail = new sst.Secret("SenderEmail");

    // S3 bucket for user-uploaded media (images)
    const mediaBucket = new sst.aws.Bucket("MediaBucket", {
      public: true,
    });

    const site = new sst.aws.Nextjs("Together", {
      link: [mediaBucket],
      environment: {
        DATABASE_URL: databaseUrl.value,
        TOKEN_SECRET: tokenSecret.value,
        MAIL_TRAP_USER: mailTrapUser.value,
        MAIL_TRAP_PASSWORD: mailTrapPassword.value,
        SENDER_EMAIL: senderEmail.value,
        // Public site origin. Until a custom domain is attached this is the
        // CloudFront URL, which isn't known until the first deploy — set it
        // as a secret after deploy #1, or wire up `site.url` with a domain.
        NEXT_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN ?? "",
        S3_BUCKET_NAME: mediaBucket.name,
        S3_BUCKET_REGION: "ap-south-1",
      },
    });

    return {
      url: site.url,
    };
  },
});
