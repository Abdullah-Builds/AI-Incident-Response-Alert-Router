import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import prisma from "../db/prisma.ts";
import emailQueue from "../services/jobs/email_queue.ts";
import DiscordQueue from "../services/jobs/discord_queue.ts";
import GenerateReport from "../services/groq.ts";
import { createNotification } from "../services/notifications/notification.ts";
import env from "../config/env.ts"

type status = "active" | "not_active";

interface ApiRequest extends Request {
  body: WebhookPayload;
}
interface WebhookPayload {
  source: string;
  payload: Prisma.JsonValue;
  status: status;
}

export const createWebhook = async (req: ApiRequest, res: Response) => {
  try {
    const secret = req.headers["x-webhook-secret"];

    if (secret !== env.webhook_secret) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { source, payload, status }: WebhookPayload = req.body;

    if (!source || !payload || !status) {
      return res.status(401).json({ message: "Invlaid Input " });
    }
    if (
      typeof source !== "string" ||
      typeof status !== "string" ||
      typeof payload !== "object"
    ) {
      return res.status(401).json({ message: "Invlaid Input Type" });
    }

    await prisma.event.create({
      data: {
        source,
        payload,
        status,
      },
    });

    const report = await GenerateReport({ source, payload });
    const incident = await prisma.incident.create({
      data: {
        title: report.title,
        severity: report.severity,
        summary: report.summary,
        status: "active",
        recommended_action: report.recommended_action,
      },
    });

    const emailNotification = await createNotification("EMAIL", incident.id);
    console.log(emailNotification);
    const discordNotification = await createNotification(
      "DISCORD",
      incident.id,
    );

    // adding to email queue
    emailQueue.add("SendEmail", {
      notificationId: emailNotification,
    });

    //adding to discord queue
    DiscordQueue.add("SendToDiscord", {
      notificationId: discordNotification,
    });

    return res.status(200).json({ message: "OK" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(401).json({ message: error.message });
    }
    return res.status(401).json({ message: "Unknown Error" });
  }
};
