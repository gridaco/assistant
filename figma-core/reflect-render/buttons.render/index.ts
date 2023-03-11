import { Color } from "@reflect-ui/core";
import { reflectColorToFigmaRGB } from "@design-sdk/figma-node-conversion";
import { ButtonColorScheme } from "@reflect-ui/core/dist/theme/color-schemes";
import { BUTTON_COLOR_SCHEMES_SET } from "@reflect.bridged.xyz/ui-generator/lib/seeds/color-schemes/button.color-scheme.seed";
import { BUTTON_TEXTS_SET_EN } from "@reflect.bridged.xyz/ui-generator/lib/seeds";
import { BUTTON_BASE_GRADIENTS_SET } from "@reflect.bridged.xyz/ui-generator/lib/seeds/gradients/button-base.gradients.seed";
import { MATERIAL_ICONS_SVG_DATA_SET } from "@reflect.bridged.xyz/ui-generator/lib/seeds/icons/material-icons.svg.seed";
import { renderText } from "../text.render";
import { renderCgRect } from "../cgrect.render";
import { renderSvgIcon } from "../icons.render";

export async function drawButtons(
  seq: number,
  col: number = 50,
  row: number = 50
) {
  const newPageForRenderer = figma.createPage();
  newPageForRenderer.name = `buttons (generated) ${seq}`;
  // focus to created page
  figma.currentPage = newPageForRenderer;

  await prewarmFonts();
  // horizontal margin between two generated buttons.
  const marginBetweenGeneratedElements = 50;
  let xPos = 0;
  let yPos = 0;
  let i = 0;
  const randomizeTextSize = (): number => {
    return getRandomInt(12, 24);
  };

  for (let c: number = 0; c < 50; c++) {
    yPos += 200;
    xPos = 0;

    for (let r: number = 0; r < 50; r++) {
      i++;

      const fillIsGradient = chanceBy(0.2);
      const hasIcon = chanceBy(0.2);

      const fontName = generateRandomFont();

      const buttonFrame = figma.createFrame();

      buttonFrame.name = `relfect-buttons/with-text-${i}`;

      const colorScheme = generateRandomButonColorSceme();
      const textColor: Color = fillIsGradient ? "#FFFFFF" : colorScheme.text;
      const textContent = generateRandomButtonTextContent();
      const text = await renderText({
        name: "slot:text",
        text: textContent,
        fontName: fontName,
        fontSize: randomizeTextSize(),
        color: textColor,
      });

      const textWidth = text.width;
      const textHegith = text.height;
      const minDefaultPadding = 4;
      const minRelativePadding = minDefaultPadding * 2 + textHegith / 2;
      const minHeight = textHegith + minRelativePadding;
      const maxHeight = 56;
      const minWidth = textWidth + minRelativePadding;
      const maxWidth = 375;
      const width = getRandomInt(minWidth, maxWidth);
      const height = getRandomInt(minHeight, maxHeight);

      // position text
      const textWidthAfterContentFilled = text.width;
      const textHeightAfterContentFilled = text.height;

      let icon: FrameNode;
      let iconWidthAfterContentFilled = 0;
      const iconMarginToText = 8;
      if (hasIcon) {
        icon = generateRandomIcon(textColor);

        // make it same size as text
        icon.rescale(textHegith / icon.height);
        iconWidthAfterContentFilled = icon.width;
        icon.x =
          width / 2 -
          textWidthAfterContentFilled / 2 -
          iconWidthAfterContentFilled / 2 -
          iconMarginToText;
        icon.y = height / 2 - icon.height / 2;
      }

      // center horizontally
      text.x =
        width / 2 -
        textWidthAfterContentFilled / 2 +
        iconWidthAfterContentFilled / 2;
      // center vertically
      text.y = height / 2 - textHeightAfterContentFilled / 2;

      // resize the frame
      const finalWidth =
        width +
        (!iconWidthAfterContentFilled
          ? iconWidthAfterContentFilled + iconMarginToText
          : 0);
      buttonFrame.resize(finalWidth, height);

      // remove all fills
      buttonFrame.fills = [];

      // disable clip content
      buttonFrame.clipsContent = false;

      // align with others
      buttonFrame.x = xPos;
      buttonFrame.y = yPos;
      xPos += width + marginBetweenGeneratedElements;

      const minWH = Math.min(width, height);
      const borderRadius = generateRandomBorderRadius(minWH);
      const border = generateRandomBorder(colorScheme.border);
      const base = renderCgRect({
        width: width,
        height: height,
        borderRadius: borderRadius,
        border: border,
        shadow: generateRandomShadow(),
        color: colorScheme.base,
        gradient: fillIsGradient ? generateRandomGradient() : undefined,
      });
      // base to downer
      buttonFrame.insertChild(0, base);

      // text to upper
      buttonFrame.insertChild(1, text);

      if (icon) {
        buttonFrame.insertChild(2, icon);
      }

      // TODO - add constraints
    }
  }
}

async function prewarmFonts() {
  await figma.loadFontAsync({
    family: "Roboto",
    style: "Bold",
  });
  await figma.loadFontAsync({
    family: "Roboto",
    style: "Medium",
  });
  await figma.loadFontAsync({
    family: "Roboto",
    style: "Regular",
  });
}

function generateRandomIcon(color: Color): FrameNode {
  const keys = Object.keys(MATERIAL_ICONS_SVG_DATA_SET);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  const svgData = MATERIAL_ICONS_SVG_DATA_SET[randomKey];
  const iconFrame = renderSvgIcon(randomKey, svgData, color);
  return iconFrame;
}

function generateRandomFont(): FontName {
  const styles = ["Regular", "Medium", "Bold"];
  return {
    family: "Roboto",
    style: styles[Math.floor(Math.random() * styles.length)],
  };
}

function generateRandomBorder(color: Color | undefined): Paint | undefined {
  if (!color) {
    return {
      type: "SOLID",
      color: {
        r: 0,
        g: 0,
        b: 0,
      },
      visible: false,
    };
  }

  return {
    type: "SOLID",
    color: reflectColorToFigmaRGB(color),
    visible: chanceBy(0.5),
  };
}

/**
 * returns false / true chance by givven number 0 ~ 1 (e.g. 0.1 gives you true by chance of 10%)
 * @param chance
 */
function chanceBy(chance: number = 0.5): boolean {
  return Math.random() <= chance;
}

function generateRandomButtonTextContent(): string {
  // replace this set with ui-dataset. https://github.com/bridgedxyz/ui-dataset
  const item =
    BUTTON_TEXTS_SET_EN[Math.floor(Math.random() * BUTTON_TEXTS_SET_EN.length)];
  return item;
}

/**
 * @param minWH smaller value between width and height
 */
function generateRandomBorderRadius(minWH: number): number {
  // TODO add damping logic
  return getRandomInt(0, minWH);
}

function generateRandomShadow(): Effect {
  // randomize visibility by chance of 50:50
  const visible = Math.random() >= 0.5;

  const randimizeShadowBlur = (): number => {
    return getRandomInt(0, 16);
  };
  const randomizeOffset = (): { x: number; y: number } => {
    return {
      x: 0,
      y: getRandomInt(0, 16),
    };
  };

  return {
    type: "DROP_SHADOW",
    color: {
      r: 0,
      g: 0,
      b: 0,
      a: getRandomFloat(0, 0.25),
    },
    radius: randimizeShadowBlur(),
    offset: randomizeOffset(),
    visible: visible,
    blendMode: "NORMAL",
  };
}

/**
 * generates random button color scheme. the set of colors containing background, and foreground color values.
 * default by active color scheme.
 */
function generateRandomButonColorSceme(): ButtonColorScheme {
  // const colors = ['#A58EFF', '#FF8E8E', '#7435C3',]

  return BUTTON_COLOR_SCHEMES_SET[
    Math.floor(Math.random() * BUTTON_COLOR_SCHEMES_SET.length)
  ];
}

interface LiearGradient {
  colors: Color[];
}

function generateRandomGradient(): LiearGradient {
  return BUTTON_BASE_GRADIENTS_SET[
    Math.floor(Math.random() * BUTTON_BASE_GRADIENTS_SET.length)
  ];
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max): number {
  return Math.random() * (max - min) + min;
}
