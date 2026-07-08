import {Worker} from "bullmq"
import {sendEmail} from "../../services/notifications/email.ts";
import GenerateReport from "../groq";
import connection from "../../db/redis.ts";
import {BeautifyEmailContent} from "../../utils/email_msg_beautifier.ts"
import { title } from "node:process";

const Emailworker = new Worker("emailqueue",
     async (job)=>{
        const response : any = await GenerateReport(job.data)
        if (response instanceof Error) {
           sendEmail({ html: response.message, subject:"Error" });
            return;
        }
        if(!response){
           sendEmail({ html: "Email Service is Down", subject:"Error"});
        }
       
        const toJSON = JSON.parse(response)
        const msg : string =   BeautifyEmailContent(toJSON)
        await sendEmail({ html: msg, subject : toJSON.title });

    },{
        connection
    }
)

export default Emailworker;