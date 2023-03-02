import { NextApiRequest, NextApiResponse } from "next";
import openai from "service/providers/openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const q = req.query.q as string;
  const t = req.query.t as string;
  const model = "text-davinci-003";

  if (!q) {
    res.status(400).json({
      error: "query parameter q is required.",
    });
    return;
  }

  let prompt = q;
  switch (t) {
    case "headline": {
      prompt = `
Create headline for my design content:
prompt: ${q}
output:
`;
      break;
    }
    case "paragraph": {
      prompt = `
Create paragraph for my design content:
prompt: ${q}
output:
`;
    }
    case undefined:
    case "free": {
      prompt = q;
    }
    default: {
    }
  }

  // TODO: add support for stream.

  const { data } = await openai.createCompletion({
    prompt: prompt,
    model: model,
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    n: 3,
  });

  const { choices } = data;

  const texts = choices.map((c) => c.text.trim());

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
