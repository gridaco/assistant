import { reflectColorToFigmaColor } from "@design-sdk/figma-node-conversion";
import { Color } from "@reflect-ui/core/lib/color";

// FIXME - this should be repplaced by reflect's `TextManifest` when fully constructed
interface FigmaRenderTextManifest {
  name?: string;
  text: string;
  fontName: FontName;
  fontSize: number;
  color: Color;
}

export function renderText(textManifest: FigmaRenderTextManifest): TextNode {
  const text = figma.createText();

  text.fontName = textManifest.fontName;
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
