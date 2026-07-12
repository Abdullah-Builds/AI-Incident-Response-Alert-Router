import { Queue } from "bullmq";
import connection from "../../db/redis.ts";

const emailQueue = new Queue("emailqueue", {
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
});

export default emailQueue