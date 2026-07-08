import dotenv from "dotenv";

dotenv.config();

const env = {
  PORT: Number(process.env.PORT) || 5000,
  DATABASE_URL: process.env.DATABASE_URL as string,
  GROQ_API_KEY:process.env.GROQ_API_KEY as string,
  discord_webhook : process.env.DISCORD_WEBHOOK_URL as string,
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
  email_user : process.env.EMAIL_USER as string,
  email_password: process.env.EMAIL_PASSWORD as string,
  resend : process.env.RESEND as string
};


if (!env.DATABASE_URL || !env.GROQ_API_KEY) {
  throw new Error(" Something is not defined in the .env file.");
}

export default env;