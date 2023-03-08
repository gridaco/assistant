import type { ChatCompletionRequestMessage } from "openai";
import openai from "service/providers/openai";

const __top_p = 1;
const __max_tokens = 512;
const __temperature = 0.7;

class ChatSession {
  constructor(readonly id: string) {}

  async start() {}

  async prompt() {}
}

const __ESCAPE_TOKEN = "|ESCAPE|";

const supported_commands = [
  // { desc: "Create Noise", cmd: "/design noise" },
  // { desc: "Create Gradient", cmd: "/design gradient" },
  { desc: "Lint Design", cmd: "/design lint" },
  { desc: "Translate Design to Code", cmd: "/code @selection" },
] as const;

const supported_overrides = [
  // `If a graphical (non copy) idea request, tell user that you found some ideas, and start your response with \`{ "r": "GRAPHIC_IDEA", "q": <user prompt>, "d": <whatever you want to add> }\` as our system will generate the image and send to user with your response.`,
  `If a image-generation request, tell user that you can, and start your response with \`{ "r": "IMAGE_GEN", "q": <user prompt> }\` our system will generate the image and send to user with your response.`,
  `If a code-generation request, tell user that you can, and start your response with \`{ "r": "CODE_GEN", "f": <detected framework> }\` as our system will generate the code and send to user with your response.`,
  `If a drawing request, tell user that you can't and respond with "Drawing Assistant under development. learn more at https://grida.co/assistant/wip"`,
];

export async function assistCompletion({
  prompt,
  n = 1,
  history = [],
}: {
  prompt: string;
  n?: number;
  history?: ChatCompletionRequestMessage[];
}) {
  const model = "gpt-3.5-turbo";
  const { data } = await openai.createChatCompletion({
    model: model,
    messages: [
      {
        role: "system",
        content: `
You are a Design Assistant created by [Grida](https://grida.co). You are creating a design content on Figma, inside Grida Assistant plugin.
Try to respond to the user without a conversational tone.

`.trim(),
      },
      {
        role: "system",
        content: `
You can Design resources like Icons Images and you can also generate a new image with user's prompt.

You also provide other utilities listed below.
${supported_commands.map((c) => `- ${c.desc} (\`${c.cmd}\`)`).join("\n")}
`.trim(),
      },
      {
        role: "system",
        content:
          "If user asks for help, you may respond with your capabilities.",
      },
      // last 10 messages
      ...history.slice(-10),
      {
        role: "system",
        content: `
But You are NOT capable of
- Drawing layers (elements) on Figma. Tell user we're working on this update, users can follow for updates at https://grida.co/assistant/wip

Try to avoid
- Using tables
`.trim(),
      },
      {
        role: "system",
        content: `
Respond with metadata if user's prompt can be handled by our system.
${supported_overrides.map((c) => `- ${c}`).join("\n")}

Add your response after the metadata.

`.trim(),
      },
      {
        role: "system",
        content: `
Formats
- for color value, use rgba format.
- for gradient value, use css gradient format.
        `,
      },
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

  try {
    const { choices } = data;

    const texts = choices.map((c) => c.message.content);
    const response = texts[0];

    if (response.match(/\{.*\}/g)) {
      let r = response;
      let m: any = {};

      // find the embedded metadata
      const metadata = r.match(/\{.*\}/g);
      if (metadata) {
        r = r.replace(metadata[0], "");
        m = JSON.parse(metadata[0]);
      }

      return {
        model,
        meta: m,
        texts: [r],
      };
    }

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
