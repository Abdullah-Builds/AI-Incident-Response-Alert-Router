import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../db/prisma.ts';
import sendEmail from "../utils/email_msg_beautifier.ts";
import sendTo_Discord from '../utils/discord_msg_beautifier.ts';
import emailQueue from "../services/jobs/email_queue.ts";
import DiscordQueue from '../services/jobs/discord_queue.ts';

type status = "active" | "not_active"

interface ApiRequest extends Request {
    body: WebhookPayload;
}
interface WebhookPayload {
    source: string;
    payload: Prisma.JsonValue;
    status : status
}

export const createWebhook = async (req: ApiRequest, res: Response) => {

    try{
        const { source, payload, status }: WebhookPayload = req.body;
    
        if (!source || !payload || !status) {
            return res.status(401).json({ message: "Invlaid Input " });
        }
        if (typeof source !== 'string' || typeof status !=='string' || typeof payload !== 'object') {
            return res.status(401).json({ message: "Invlaid Input Type" });
        }
    
        await prisma.event.create({
            data: {
              source,
              payload,
              status
            }
        });

// adding to email queue
        emailQueue.add("SendEmail", {
            message: {
                source : source,
                payload : payload,
            }
        });
        
//adding to discord queue
        DiscordQueue.add("SendToDiscord",{
             message: {
                source : source,
                payload : payload,
             }
        })        
      
        return res.status(200).json({ message: "OK" });
    } 
    catch(error){
       if (error instanceof Error){
         return res.status(401).json({message : error.message})
       }
       return res.status(401).json({message : "Unknown Error"})
    }
};
