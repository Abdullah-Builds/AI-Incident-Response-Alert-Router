import env from "../config/env";

const connection = {
  host: env.host,
  port: Number(env.port),
  username: env.username,
  password: env.password,
  tries : env.maxRetriesPerRequest
};

export default connection;