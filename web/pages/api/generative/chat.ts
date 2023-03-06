import { NextApiRequest, NextApiResponse } from "next";
import { chatcompletion } from "service/completion";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // get json data from request body
  const { content, history } = req.body.data;

  if (!content) {
    res.status(400).json({
      error: "User content is required",
    });
    return;
  }

  const { texts, model } = await chatcompletion({
    prompt: content,
    history: history,
    n: 1,
  });

  switch (req.method) {
    case "POST": {
      res.json({
        q: content,
        response: texts[0],
        model: model,
      });
    }
  }
}
