import { Queue } from "bullmq";
import connection from "../../db/redis.ts";

const DiscordQueue = new Queue("discordqueue", {
  connection,
   defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: 100,
    removeOnFail: 100,
  },
}
);

export default DiscordQueue