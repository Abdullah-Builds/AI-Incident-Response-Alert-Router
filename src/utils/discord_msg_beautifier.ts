import {EmbedBuilder,WebhookClient,Colors,APIEmbedField,} from "discord.js";

export interface IncidentPayload {
  title: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  summary: string;
  recommended_action: string[];
}

const severityConfig = {
  Low: {
    color: Colors.Green,
    emoji: "🟢",
  },
  Medium: {
    color: Colors.Yellow,
    emoji: "🟡",
  },
  High: {
    color: Colors.Orange,
    emoji: "🟠",
  },
  Critical: {
    color: Colors.Red,
    emoji: "🔴",
  },
} as const;

export async function BeautifyDiscordMsg(payload: IncidentPayload): Promise<object> {
  const data: IncidentPayload = payload;

  const config = severityConfig[data.severity];

  const fields: APIEmbedField[] = [
    {
      name: "Severity",
      value: `${config.emoji} **${data.severity}**`,
      inline: true,
    },
    {
      name: "Detected",
      value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
      inline: true,
    },
    {
      name: "Summary",
      value: data.summary,
    },
    {
      name: "Recommended Actions",
      value:
        data.recommended_action.length > 0
          ? data.recommended_action.map(action => `• ${action}`).join("\n")
          : "No recommendation provided.",
    },
  ];

  const embed = new EmbedBuilder()
    .setColor(config.color)
    .setTitle(`${config.emoji} ${data.title}`)
    .setFields(fields)
    .setTimestamp()
    .setFooter({
      text: "Incident Monitoring System",
    });

  return {
    username: "Incident Bot",
    embeds: [embed],
    allowedMentions: {
      parse: [],
    },
  };
}