import { MailtrapClient } from "mailtrap";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcryptjs from "bcryptjs";

// ---------------------------------------------------------------------------
// Mailtrap client — switches between Sandbox (dev/test) and Production
// via MAILTRAP_USE_SANDBOX env var.
// ---------------------------------------------------------------------------
const isSandbox = process.env.MAILTRAP_USE_SANDBOX === "true";
const inboxId = isSandbox ? Number(process.env.MAILTRAP_INBOX_ID) : undefined;

const mailtrap = new MailtrapClient({
	token: process.env.MAILTRAP_API_TOKEN!,
	sandbox: isSandbox,
	testInboxId: inboxId,
});

const SENDER = {
	email: process.env.SENDER_EMAIL ?? "noreply@together.app",
	name: "Together App",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function buildVerifyHtml(link: string): string {
	return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0f0f0f;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:16px;overflow:hidden;max-width:560px;">
        <tr><td style="background:linear-gradient(135deg,#7c3aed,#3b82f6);padding:32px 40px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">Together</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.75);font-size:14px;">Connect. Share. Belong.</p>
        </td></tr>
        <tr><td style="padding:40px;">
          <h2 style="margin:0 0 16px;color:#f5f5f5;font-size:22px;font-weight:600;">Verify your email address</h2>
          <p style="margin:0 0 24px;color:#a3a3a3;font-size:15px;line-height:1.6;">
            Welcome! You're almost ready to join Together. Click the button below to verify your email address and activate your account.
          </p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${link}" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#3b82f6);color:#fff;text-decoration:none;padding:14px 32px;border-radius:10px;font-size:16px;font-weight:600;letter-spacing:0.3px;">
              Verify Email Address
            </a>
          </div>
          <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.5;">
            Or copy and paste this link in your browser:<br>
            <a href="${link}" style="color:#7c3aed;word-break:break-all;">${link}</a>
          </p>
          <p style="margin:24px 0 0;color:#6b7280;font-size:13px;">
            This link expires in <strong>1 hour</strong>. If you didn't sign up for Together, you can safely ignore this email.
          </p>
        </td></tr>
        <tr><td style="background:#111;padding:20px 40px;text-align:center;">
          <p style="margin:0;color:#4b5563;font-size:12px;">© ${new Date().getFullYear()} Together App. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
  `.trim();
}

function buildResetHtml(link: string): string {
	return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0f0f0f;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:16px;overflow:hidden;max-width:560px;">
        <tr><td style="background:linear-gradient(135deg,#dc2626,#7c3aed);padding:32px 40px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">Together</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.75);font-size:14px;">Password Reset Request</p>
        </td></tr>
        <tr><td style="padding:40px;">
          <h2 style="margin:0 0 16px;color:#f5f5f5;font-size:22px;font-weight:600;">Reset your password</h2>
          <p style="margin:0 0 24px;color:#a3a3a3;font-size:15px;line-height:1.6;">
            We received a request to reset your Together account password. Click the button below to choose a new password.
          </p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${link}" style="display:inline-block;background:linear-gradient(135deg,#dc2626,#7c3aed);color:#fff;text-decoration:none;padding:14px 32px;border-radius:10px;font-size:16px;font-weight:600;letter-spacing:0.3px;">
              Reset Password
            </a>
          </div>
          <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.5;">
            Or copy and paste this link in your browser:<br>
            <a href="${link}" style="color:#dc2626;word-break:break-all;">${link}</a>
          </p>
          <p style="margin:24px 0 0;color:#6b7280;font-size:13px;">
            This link expires in <strong>1 hour</strong>. If you didn't request a password reset, you can safely ignore this email — your password will not change.
          </p>
        </td></tr>
        <tr><td style="background:#111;padding:20px 40px;text-align:center;">
          <p style="margin:0;color:#4b5563;font-size:12px;">© ${new Date().getFullYear()} Together App. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
  `.trim();
}

// ---------------------------------------------------------------------------
// sendEmail — main export used by register & forgot-password routes
// ---------------------------------------------------------------------------
export const sendEmail = async (
	email: string,
	emailType: "VERIFY" | "RESET",
	userId: string | number,
) => {
	// 1. Write token to DB
	const hashedToken = await bcryptjs.hash(userId.toString(), 10);

	if (emailType === "VERIFY") {
		await db
			.update(users)
			.set({
				verifyToken: hashedToken,
				verifyTokenExpiry: new Date(Date.now() + 3600000),
			})
			.where(eq(users.id, userId as any));
	} else {
		await db
			.update(users)
			.set({
				forgotPasswordToken: hashedToken,
				forgotPasswordTokenExpiry: new Date(Date.now() + 3600000),
			})
			.where(eq(users.id, userId as any));
	}

	// 2. Build action link
	const domain = process.env.NEXT_PUBLIC_DOMAIN ?? "localhost:3000";
	const protocol = domain.startsWith("localhost") ? "http" : "https";
	const path =
		emailType === "VERIFY"
			? `${protocol}://${domain}/auth/verify-mail?token=${hashedToken}`
			: `${protocol}://${domain}/auth/reset-password?token=${hashedToken}`;

	// 3. Send via Mailtrap SDK
	const response = await mailtrap.send({
		from: SENDER,
		to: [{ email }],
		subject:
			emailType === "VERIFY"
				? "Verify your email to join Together"
				: "Reset your Together password",
		html:
			emailType === "VERIFY" ? buildVerifyHtml(path) : buildResetHtml(path),
		category: emailType === "VERIFY" ? "Account Verification" : "Password Reset",
	});

	return response;
};
