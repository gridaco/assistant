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
  const model = "text-davinci-003";

  const prompt = `
Create headline for my design content:
prompt: ${q}
output:
`;

  const { data } = await openai.createCompletion({
    prompt: prompt,
    model: model,
    n: 3,
  });

  const { choices } = data;

  const texts = choices.map((c) => c.text);

  switch (req.method) {
    case "GET": {
      res.json({
        q: q,
        texts: texts,
        model: model,
      });
    }
  }
}
