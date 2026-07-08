import express from "express";
import Webhookrouter from "../src/routes/webhook";
const app = express();

app.use(express.json());
app.use("/",Webhookrouter)

app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});