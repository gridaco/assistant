import LanguageDetect from "languagedetect";
import openai from "service/providers/openai";
import assert from "assert";

const translate_prompt = (text: string) => `Detect the Inout language below.
Options are: en, ko, ja, fr

Input: ${text}
Output: `;

export async function detectLanguage(text: string) {
  const detector = new LanguageDetect();
  detector.setLanguageType("iso2");
  const languages = detector.detect(text, 1);

  if (languages.length == 0) {
    // https://github.com/FGRibreau/node-language-detect/issues
    // we need to use external api to detect language
    const model = "text-davinci-003";
    const { data } = await openai.createCompletion({
      prompt: translate_prompt(text),
      model: model,
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      n: 1,
    });

    const output = data.choices[0].text;
    const language = output.replace(/\s/g, "");

    try {
      assert(
        language == "ko" ||
          language == "en" ||
          language == "ja" ||
          language == "fr"
      );

      return {
        lang: language,
        confidence: 0.9, // fixed confidence
      };
    } catch (e) {
      throw new Error(`Invalid language detected: ${language}`);
    }
  } else {
    return {
      lang: languages[0][0],
      confidence: languages[0][1],
    };
  }
}
