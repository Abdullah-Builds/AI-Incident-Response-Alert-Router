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
  webhook_secret : process.env.WEBHOOK_SECRET
};

const required = [
  "DATABASE_URL",
  "GROQ_API_KEY",
  "DISCORD_WEBHOOK_URL",
  "REDIS_HOST",
  "REDIS_PORT",
  "REDIS_USERNAME",
  "REDIS_PASSWORD",
  "EMAIL_USER",
  "EMAIL_PASSWORD",
  "WEBHOOK_SECRET"
];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
}

export default env;