import { Worker } from "bullmq";
import connection from "../../db/redis.ts";
import sendDiscordMessage from "../notifications/discord.ts";
import { BeautifyDiscordMsg, IncidentPayload } from "../../utils/discord_msg_beautifier.ts";
import {markNotificationFailed,markNotificationSent,} from "../notifications/notification.ts";
import {Parser} from "../../utils/parser.ts";

type ParserResult = {
  payload : IncidentPayload,
  notification : any
}
const Discordworker = new Worker(
  "discordqueue",
  async (job) => {
    try {
      const {payload,notification} : ParserResult = await Parser(job.data.notificationId)
      const msg: any = await BeautifyDiscordMsg(payload);
      await sendDiscordMessage(msg);
      await markNotificationSent(notification.id);
    } catch (error) {
      console.error(error)
      await markNotificationFailed(job.data.notificationId);
      throw error
    }
  },
  {
    connection,
  },
);

export default Discordworker;
