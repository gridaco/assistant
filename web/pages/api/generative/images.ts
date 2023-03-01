import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import { translateForTextToImage } from "service/translation/translate-for-text-to-image";

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
  const style = req.query.style as string;
  const n = 2;

  // get access key
  const { authorization } = req.headers;
  const key = authorization?.split(" ")[1];
  if (!key || !key.startsWith("GAEBAK")) {
    res.status(401).json({
      error: "authorization header is required.",
    });
    return;
  }

  let prompt = await translateForTextToImage(q);

  // add style
  if (style) {
    prompt += ` - in a ${style} style`;
  }

  const { data } = await openai.createImage({
    prompt: prompt,
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
