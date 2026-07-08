import OpenAI from "openai";
import env from "../config/env";
import { prompt } from "../constants";
import prisma from "../db/prisma";

const client = new OpenAI({
  apiKey: env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export type Report = {
  title: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  summary: string;
  recommended_action: string[];
};

async function GenerateReport(data: unknown): Promise<string> {
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: prompt,
      },
      {
        role: "user",
        content: JSON.stringify(data),
      },
    ],
  });

  const rawContent = response.choices[0].message.content;

  if (!rawContent) {
    throw new Error("No response received from Groq.");
  }

  const report: Report = JSON.parse(rawContent);

  await SaveResponse(report);

  return rawContent;
}

export default GenerateReport;

async function SaveResponse(report: Report): Promise<void> {
  await prisma.incident.create({
    data: {
      title: report.title,
      severity: report.severity,
      summary: report.summary,
      status: "active",
      recommended_action: report.recommended_action,
    },
  });
}