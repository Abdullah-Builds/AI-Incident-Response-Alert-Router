import { Queue } from "bullmq";
import connection from "../../db/redis.ts";

const emailQueue = new Queue("emailqueue", {
  connection
});

export default emailQueue