import { Queue } from "bullmq";
import connection from "../../db/redis.ts";

const DiscordQueue = new Queue("discordqueue", {
  connection
});

export default DiscordQueue