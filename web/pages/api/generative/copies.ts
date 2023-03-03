import { NextApiRequest, NextApiResponse } from "next";
import openai from "service/providers/openai";

const __n = 3;
const __top_p = 1;
const __max_tokens = 512;
const __temperature = 0.7;

class ChatSession {
  constructor(readonly id: string) {}

  async start() {}

  async prompt() {}
}

async function chatcompletion({ prompt }: { prompt: string }) {
  const model = "gpt-3.5-turbo";
  try {
    const { data } = await openai.createChatCompletion({
      model: model,
      messages: [
        {
          role: "system",
          content:
            "You are a Design Assistant created by [Grida](https://grida.co). You are creating a design content.",
        },
        {
          role: "system",
          content: "Respond to the user's promt without a conversational tone.",
        },
        {
          role: "system",
          content:
            "You can Design resources like Icons Images and you can also generate a new image with user's prompt.",
        },
        {
          role: "system",
          content: `You also provide other utilities listed below.
- Create Noise (/design noise)
- Create Gradient (/design gradient)
- Create Color Palette (/design palette)
- Lint Design (/design lint)
- Translate Design to Code (/code @selection)
`,
        },
        {
          role: "system",
          content:
            "If user asks for help, you may respond with your capabilities.",
        },
        {
          role: "user",
          name: "Designer",
          content: prompt,
        },
      ],
      max_tokens: __max_tokens,
      top_p: __top_p,
      n: __n,
      temperature: __temperature,
      user: "<user-id-here>",
    });

    const { choices } = data;

    const texts = choices.map((c) => c.message.content.trim());

    return {
      model,
      texts,
    };
  } catch (e) {
    console.error(e);

    return {
      model,
      texts: [e.message],
    };
  }
}

async function completion({ prompt }: { prompt: string }) {
  const model = "text-davinci-003";

  // TODO: add support for stream.
  const { data } = await openai.createCompletion({
    prompt: prompt,
    model: model,
    temperature: __temperature,
    max_tokens: __max_tokens,
    top_p: __top_p,
    n: __n,
  });

  const { choices } = data;

  const texts = choices.map((c) => c.text.trim());

  return {
    model,
    texts,
  };
}

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
