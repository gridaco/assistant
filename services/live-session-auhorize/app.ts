import express from "express";
import cors from "cors";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID as string,
  key: process.env.PUSHER_APP_KEY as string,
  secret: process.env.PUSHER_APP_SECRET as string,
  cluster: process.env.PUSHER_APP_CLUSTER as string,
  useTLS: true,
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.json({ msg: "service is running" });
});

app.post("/pusher/auth", (req, res) => {
  try {
    const socketId = req.body.socket_id;
    const channel = req.body.channel_name;
    const auth = pusher.authenticate(socketId, channel);
    res.send(auth);
  } catch (_) {
    console.error(_);
    res.status(400).json({
      error: true,
      msg: "Cannot authorize connection outside of pusher interface",
    });
  }
});

export default app;
