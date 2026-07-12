import nodemailer from "nodemailer";
import env from "../../config/env";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.email_user,
    pass: env.email_password,
  },
});

export async function sendEmail({ to, subject, html }: { to?: string; subject: string; html: string; }) {
  try {

    await transporter.verify();    
    const info = await transporter.sendMail({
      from: `"Incident Monitor" <${env.email_user}>`,
      to : "khan.abdullah9753@gmail.com",
      subject,
      html,
    });
    return info;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
}