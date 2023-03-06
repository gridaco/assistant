import type { ChatCompletionRequestMessage } from "openai";
import openai from "service/providers/openai";

class ChatSession {
  constructor(readonly id: string) {}

  async start() {}

  async prompt() {}
}

const __n = 3;
const __top_p = 1;
const __max_tokens = 512;
const __temperature = 0.7;

export async function completion({ prompt }: { prompt: string }) {
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

export async function chatcompletion({
  prompt,
  n = __n,
  history = [],
}: {
  prompt: string;
  n?: number;
  history?: ChatCompletionRequestMessage[];
}) {
  const model = "gpt-3.5-turbo";
  try {
    const { data } = await openai.createChatCompletion({
      model: model,
      messages: [
        {
          role: "system",
          content:
            "You are a Design Assistant created by [Grida](https://grida.co). You are creating a design content on Figma, inside Grida Assistant plugin.",
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
        // last 10 messages
        ...history.slice(-10),
        // user prompt
        {
          role: "user",
          name: "Designer",
          content: prompt,
        },
      ],
      max_tokens: __max_tokens,
      top_p: __top_p,
      n: n,
      temperature: __temperature,
      user: "<user-id-here>",
    });

    const { choices } = data;

    const texts = choices.map((c) => c.message.content);

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
