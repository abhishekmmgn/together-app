import nodemailer from "nodemailer";
import User from "@/models/users";
import bcryptjs from "bcryptjs";

export const sendEmail = async (
  email: string,
  emailType: string,
  userId: any
) => {
  try {
    // create a hased token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }
    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAIL_TRAP_USER,
        pass: process.env.MAIL_TRAP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject:
        emailType === "VERIFY"
          ? "Verify your email to join Together app"
          : "Reset your password",
      html: `<p>Click <a href=${process.env.NEXT_PUBLIC_DOMAIN}/auth/${
        emailType === "VERIFY" ? "verify-mail" : "reset-password"
      }?token=${hashedToken}>here</a> to ${
        emailType === "VERIFY"
          ? "Verify your email to join Together app"
          : "Reset your password"
      }
            or copy and paste the link below in your browser.
            <br>
            <br>
            Thanks,<br>
            Together app Team</p>`,
    };

    const mailresponse = await transport.sendMail(mailOptions);
    return mailresponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
