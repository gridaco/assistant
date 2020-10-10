import { AltGroupNode } from "../../node-convert/mixin";
import { convertToSize } from "../convert";
import {
  AltRectangleNode,
  AltEllipseNode,
  AltFrameNode,
} from "../../node-convert/mixin";
import { makeEdgeInsets } from "../make";
import { gradientAngle } from "../../utils/color";
import { nearestValue } from "../../utils/convert";
import { Container, Widget, EdgeInsetsGeometry, Padding, Alignment, AlignmentGeometry, Color, BoxDecoration, LinearGradient, Gradient, BoxShape } from "@bridged.xyz/flutter-builder"
import { retrieveFill } from "../../figma-utils/retrieve-fill";
import { makeBorder, makeColorFromRGBO, makeBoxShadow, makeBorderRadius } from "../make";
import { roundNumber } from "../../ui-utils/numbers.normalizer";



export function wrapWithContainer(node: AltRectangleNode | AltEllipseNode | AltFrameNode | AltGroupNode,
  child?: Widget): Widget {
  // ignore the view when size is zero or less
  // while technically it shouldn't get less than 0, due to rounding errors,
  // it can get to values like: -0.000004196293048153166
  if (node.width <= 0 || node.height <= 0) {
    return child;
  }

  // ignore for Groups
  const propBoxDecoration = node.type === "GROUP" ? undefined : makeBoxDecoration(node);
  const propSize = convertToSize(node);

  // todo Image, Gradient & multiple fills

  let propPadding: EdgeInsetsGeometry
  if (node.type === "FRAME") {
    propPadding = makeEdgeInsets(node);
  }

  if (propSize || propBoxDecoration) {
    // Container is a container if [propSize] or [propBoxDecoration] are set.
    console.log("wrapping with container. child - ", child)
    return new Container(
      {
        width: roundNumber(propSize.w),
        height: roundNumber(propSize.h),
        child: child,
        padding: propPadding,
        decoration: propBoxDecoration instanceof BoxDecoration ? propBoxDecoration : undefined,
        color: propBoxDecoration instanceof Color ? propBoxDecoration : undefined
      }
    )
  } else if (propPadding) {
    console.log("wrapping with padding")
    return new Padding(
      {
        padding: propPadding,
        child: child
      }
    )
    // if there is just a padding, add Padding
  } else {
    return child;
  }
}

function makeBoxDecoration(node: AltRectangleNode | AltEllipseNode | AltFrameNode): BoxDecoration | Color {
  const propBackgroundColor = makeBoxDecorationColor(node.fills);
  const propBorder = makeBorder(node);
  const propBoxShadow = makeBoxShadow(node);
  const propBorderRadius = makeBorderRadius(node);

  // modify the circle's shape when type is ellipse
  const propShape: BoxShape = node.type === "ELLIPSE" ? BoxShape.circle : undefined;

  // generate the decoration, or just the backgroundColor when color is SOLID.
  const isNotSolid = propBorder || propShape || propBorder || propBorderRadius || propBackgroundColor

  return isNotSolid
    ? new BoxDecoration({
      borderRadius: propBorderRadius,
      shape: propShape,
      border: propBorder,
      boxShadow: propBoxShadow,
      color: propBackgroundColor instanceof Color ? propBackgroundColor as Color : undefined,
      gradient: propBackgroundColor instanceof Gradient ? propBackgroundColor as Gradient : undefined
    })
    : propBackgroundColor instanceof Color ? propBackgroundColor as Color : undefined
}


export function makeBoxDecorationColor(fills: ReadonlyArray<Paint> | PluginAPI["mixed"]): Gradient | Color {
  const fill = retrieveFill(fills);

  if (fill?.type === "SOLID") {
    const opacity = fill.opacity ?? 1.0;
    return makeColorFromRGBO(fill.color, opacity)
  } else if (fill?.type === "GRADIENT_LINEAR") {
    const direction = gradientDirection(gradientAngle(fill));

    const colors: Array<Color> = fill.gradientStops
      .map((d) => {
        return makeColorFromRGBO(d.color, d.color.a);
      })

    // ${direction},
    return new LinearGradient({
      begin: direction.begin,
      end: direction.end,
      colors: colors
    })
  }

  return undefined;
}


type GradientDirection = {
  begin: AlignmentGeometry
  end: AlignmentGeometry
}

export function gradientDirection(angle: number): GradientDirection {
  switch (nearestValue(angle, [-180, -135, -90, -45, 0, 45, 90, 135, 180])) {
    case 0:
      return { begin: Alignment.centerLeft, end: Alignment.centerRight }
    case 45:
      return { begin: Alignment.topLeft, end: Alignment.bottomRight }
    case 90:
      return { begin: Alignment.topCenter, end: Alignment.bottomCenter }
    case 135:
      return { begin: Alignment.topRight, end: Alignment.bottomLeft }
    case -45:
      return { begin: Alignment.bottomLeft, end: Alignment.topRight }
    case -90:
      return { begin: Alignment.bottomCenter, end: Alignment.topCenter }
    case -135:
      return { begin: Alignment.bottomRight, end: Alignment.topLeft }
    default:
      // when 180 or -180
      return { begin: Alignment.centerRight, end: Alignment.centerLeft }
  }
}

