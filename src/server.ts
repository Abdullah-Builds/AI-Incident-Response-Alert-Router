import express from "express";
import Webhookrouter from "../src/routes/webhook";
import EventsRouter from "./routes/events";
import cors from "cors";
import env from "./config/env";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE"],
    credentials: false,
  })
);

app.use("/",Webhookrouter)
app.use("/",EventsRouter);

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});