import { NextApiRequest, NextApiResponse } from "next";
import { completion, chatcompletion } from "service/completion";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const q = req.query.q as string;
  const t = req.query.t as string;

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

  // const { texts, model } = await completion({ prompt });
  const { texts, model } = await chatcompletion({ prompt });

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
