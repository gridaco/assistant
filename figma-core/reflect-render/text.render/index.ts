import { reflectColorToFigmaColor } from "@design-sdk/figma-node-conversion";
import { Color } from "@reflect-ui/core";

// FIXME - this should be repplaced by reflect's `TextManifest` when fully constructed
interface FigmaRenderTextManifest {
  name?: string;
  text: string;
  fontName?: FontName;
  fontSize: number;
  color: Color;
}

export async function renderText(
  textManifest: FigmaRenderTextManifest
): Promise<TextNode> {
  const text = figma.createText();

  if (textManifest.fontName) {
    text.fontName = textManifest.fontName;
  } else {
    // resolve fonts (required for changing text characters)
    await resolvefonts(text);
  }
  text.characters = textManifest.text;

  text.name = textManifest.name ?? "text";

  // randomize font size
  text.fontSize = textManifest.fontSize;

  const textColor = reflectColorToFigmaColor(textManifest.color);

  text.fills = [
    {
      type: "SOLID",
      color: textColor,
    },
  ];

  return text;
}

async function resolvefonts(text: TextNode) {
  await Promise.all(
    text
      .getRangeAllFontNames(0, text.characters.length)
      .map(figma.loadFontAsync)
  );
}

export async function replaceTextCharacters(
  text: TextNode,
  {
    characters,
    name,
  }: {
    name?: string;
    characters: string;
  }
) {
  // resolve fonts (required for changing text characters)
  await resolvefonts(text);

  text.characters = characters;

  if (name) {
    text.name = name;
  }

  return text;
}
