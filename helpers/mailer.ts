import nodemailer from "nodemailer";
import User from "@/models/users";
import bcryptjs from "bcryptjs";

type propsType = {
  email: string;
  emailType: string;
  userId: any;
};
export const sendEmail = async (props: propsType) => {
  try {
    // create a hased token
    const hashedToken = await bcryptjs.hash(props.userId.toString(), 10);

    if (props.emailType === "VERIFY") {
      await User.findByIdAndUpdate(props.userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (props.emailType === "RESET") {
      await User.findByIdAndUpdate(props.userId, {
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
      to: props.email,
      subject:
        props.emailType === "VERIFY"
          ? "Verify your email to join Together app"
          : "Reset your password",
      html: `<p>Click <a href="${process.env.NEXT_PUBLIC_DOMAIN}/auth/${
        props.emailType === "VERIFY" ? "verify-mail" : "reset-password"
      }?token=${hashedToken}">here</a> to ${
        props.emailType === "VERIFY"
          ? "Verify your email to join Together app"
          : "Reset your password"
      }
            or copy and paste the link below in your browser.
            <br>
            <br>
            Thanks,
            Together app Team</p>`,
    };

    const mailresponse = await transport.sendMail(mailOptions);
    return mailresponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
