import nodemailer from "nodemailer";
import env from "../../config/env";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.email_user.trim(),
    pass: env.email_password.trim(),
  },
});

export async function sendEmail({ to, subject, html }: { to?: string; subject?: string; html?: string; }) {
  try {
    // Verify SMTP connection
    console.log("Password Length:", env.email_password?.length);

    await transporter.verify();
    console.log("SMTP connection successful");

    // Send email
    const info = await transporter.sendMail({
      from: `"Incident Monitor" <${env.email_user.trim()}>`,
      to : "khan.abdullah9753@gmail.com",
      subject,
      html,
    });

    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
}