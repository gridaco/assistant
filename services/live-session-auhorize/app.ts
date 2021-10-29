import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.post("/format", (req, res) => {});

export default app;
