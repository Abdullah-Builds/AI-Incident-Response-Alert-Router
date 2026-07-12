import OpenAI from "openai";
import env from "../config/env";
import { prompt } from "../constants";

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

async function GenerateReport(data: unknown): Promise<Report> {
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
  return JSON.parse(rawContent) as Report
}

export default GenerateReport;
