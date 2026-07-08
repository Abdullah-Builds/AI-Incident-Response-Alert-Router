import {Worker} from "bullmq"
import GenerateReport from "../groq";
import connection from "../../db/redis.ts";
import sendDiscordMessage from "../notifications/discord.ts";
import {BeautifyDiscordMsg} from "../../utils/discord_msg_beautifier.ts"

const Discordworker = new Worker("discordqueue",
     async (job)=>{
        const response : any = await GenerateReport(job.data)
        if (response instanceof Error) {
           sendDiscordMessage(response.message);
            return;
        }
        if(!response){
           sendDiscordMessage("Service is Down");
           return
        }
        const msg : any = await BeautifyDiscordMsg(response)
        sendDiscordMessage(msg);
    },{
        connection
    }
)

export  default Discordworker;