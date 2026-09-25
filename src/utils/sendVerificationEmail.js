import "dotenv/config";
import { messenger } from "../config/email.js";

export const sendVerificationEmail = async (email, name, otp) => {
  await messenger.sendMail({
    from: process.env["EMAIL_USER"],
    to: email,
    subject: "Verify Your Email",
    text: `Hello ${name},

Your email verification code is:

${otp}

This code will expire in 10 minutes.

If you did not create an account, you can ignore this email.

Regards,
Photography & Cinematography Team`,
  });
};
