import express from 'express';
import {createWebhook} from "../controllers/webhook.ts";

const Webhookrouter = express.Router()

Webhookrouter.post("/webhook",createWebhook)

export default Webhookrouter;
