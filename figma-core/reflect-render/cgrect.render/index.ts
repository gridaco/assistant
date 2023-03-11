import {
  reflectColorToFigmaRGBA,
  reflectColorToFigmaRGB,
} from "@design-sdk/figma-node-conversion";
import { Color } from "@reflect-ui/core";

// his should be repplaced by reflect's `CGRectManifest` when fully constructed
interface FigmaRenderRectManifest {
  width: number;
  height: number;
  borderRadius: number;
  color?: Color;
  gradient?: {
    colors: Color[];
  };
  border?: Paint;
  shadow?: Effect;
}

export function renderCgRect(
  rectManifest: FigmaRenderRectManifest
): RectangleNode {
  const rect = figma.createRectangle();
  rect.resize(rectManifest.width, rectManifest.height);
  rect.cornerRadius = rectManifest.borderRadius;

  if (rectManifest.color) {
    rect.fills = [
      {
        type: "SOLID",
        color: reflectColorToFigmaRGB(rectManifest.color),
        opacity: 1,
      },
    ];
  } else {
    rect.fills = [];
  }

  if (rectManifest.gradient) {
    const gradient = rectManifest.gradient;
    const startColor = gradient.colors[0];
    const endColor = gradient.colors[1];

    rect.fills = [
      {
        type: "GRADIENT_LINEAR",
        gradientTransform: [
          [1, 1, 0],
          [1, 1, 1],
        ],
        gradientStops: [
          {
            color: reflectColorToFigmaRGBA(startColor),
            position: 0,
          },
          {
            color: reflectColorToFigmaRGBA(endColor),
            position: 1,
          },
        ],
      },
    ];
  }

  if (rectManifest.border) {
    rect.strokes = [rectManifest.border];
  }

  if (rectManifest.shadow) {
    rect.effects = [rectManifest.shadow];
  }

  return rect;
}
