import openai from "service/providers/openai";
import { detectLanguage } from "./detect";

const propmpt = (
  text: string
) => `Translate this text-to-image prompt to English for better results:
Prompt: ${text}
Output: `;

export async function translateForTextToImage(text: string) {
  const { lang } = await detectLanguage(text);

  if (lang === "en") {
    return text;
  } else {
    // translate text to english.
    const { data } = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: propmpt(text),
      n: 1,
    });

    const { choices } = data;

    return choices[0].text.trim();
  }
}
