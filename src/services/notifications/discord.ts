import env from "../../config/env.ts";

const webhookUrl = env.discord_webhook;

async function sendDiscordMessage(message: string) {
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });

  if (!response.ok) {
    throw new Error(`Failed to send webhook: ${response.status}`);
  }
}

export default sendDiscordMessage;