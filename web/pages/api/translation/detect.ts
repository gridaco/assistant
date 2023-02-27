import { NextApiRequest, NextApiResponse } from "next";

import { detectLanguage } from "service/translation";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const q = req.query.q as string;

  const { lang, confidence } = await detectLanguage(q);

  switch (req.method) {
    case "GET":
      res.status(200).json({
        q: q,
        lang: lang,
        confidence: confidence,
      });
      break;
  }
}
