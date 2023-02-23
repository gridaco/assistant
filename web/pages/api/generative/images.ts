import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const OPENAI_API_SECRET_KEY = process.env.OPENAI_API_SECRET_KEY;
const configuration = new Configuration({
  apiKey: OPENAI_API_SECRET_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const q = req.query.q as string;
  const n = 4;

  const { data } = await openai.createImage({
    prompt: q,
    n: n,
    size: "1024x1024",
  });

  const images = data.data.map((image) => image.url);

  switch (req.method) {
    case "GET": {
      res.json({
        q,
        images: images,
        size: "1024x1024",
        n: n,
      });
    }
  }
}
