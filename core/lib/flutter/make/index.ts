import { makeBorderRadius } from "./border-radius.make";
import { makeBorder } from "./border.make";
import { makeBoxShadow } from "./box-shadow.make";
import { makeColor, makeColorFromRGBO } from "./color.make";
import { makeEdgeInsets } from "./edge-insets.make";
import { makeShape } from "./shape.make";
import { makeTextStyle } from "./text-style.make";
import { makeText } from "./text.make";
import { makeBoxDecoration, makeBoxDecorationBg } from "./box-decoration.make"

export {
    makeBorderRadius,
    makeBorder,
    makeBoxShadow,
    makeBoxDecoration,
    makeBoxDecorationBg as makeBoxDecorationFill,
    makeColor,
    makeColorFromRGBO,
    makeEdgeInsets,
    makeShape,
    makeTextStyle,
    makeText,
}