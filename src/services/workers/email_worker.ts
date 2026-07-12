import { Worker } from "bullmq";
import { sendEmail } from "../../services/notifications/email.ts";
import connection from "../../db/redis.ts";
import { BeautifyEmailContent } from "../../utils/email_msg_beautifier.ts";
import {markNotificationFailed,markNotificationSent,} from "../notifications/notification.ts";
import {Parser,IncidentPayload} from "../../utils/parser.ts";

type ParserResult = {
  payload : IncidentPayload,
  notification : any
}

const Emailworker = new Worker(
  "emailqueue",
  async (job) => {

    try{
     
    const {payload,notification} : ParserResult = await Parser(job.data.notificationId)
    const msg: any = BeautifyEmailContent(payload);
    await sendEmail({html : msg, subject : notification.incident.title});
    await markNotificationSent(notification.id);
    }catch(error){
      await markNotificationFailed(job.data.notificationId);
      console.log(error)
    }
  },
  {
    connection,
  },
);

export default Emailworker;
