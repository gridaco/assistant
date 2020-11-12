import { convertToSize } from "../convert";
import {
  ReflectRectangleNode,
  ReflectEllipseNode,
  ReflectFrameNode,
  ReflectGroupNode
} from "@bridged.xyz/design-sdk/lib/nodes/types";
import { makeEdgeInsets } from "../make";
import { nearestValue } from "../../utils/convert";
import { Container, Widget, EdgeInsetsGeometry, Padding, Alignment, AlignmentGeometry, Color, BoxDecoration, LinearGradient, Gradient, BoxShape, ImageProvider, DecorationImage, BoxFit } from "@bridged.xyz/flutter-builder/lib"
import { retrieveFill } from "../../figma-utils/retrieve-fill";
import { makeBorder, makeColorFromRGBO, makeBoxShadow, makeBorderRadius } from "../make";
import { roundNumber } from "@reflect.bridged.xyz/uiutils/lib/pixels";
import { interpretGradient } from "../interpreter/gradient.interpret";
import { interpretImageFills } from "../interpreter/image.interpret";



export function wrapWithContainer(node: ReflectRectangleNode | ReflectEllipseNode | ReflectFrameNode | ReflectGroupNode,
  child?: Widget): Widget {
  // ignore the view when size is zero or less
  // while technically it shouldn't get less than 0, due to rounding errors,
  // it can get to values like: -0.000004196293048153166
  if (node.width <= 0 || node.height <= 0) {
    return child;
  }

  // ignore for Groups
  const propBoxDecoration = node instanceof ReflectGroupNode ? undefined : makeBoxDecoration(node);
  const propSize = convertToSize(node);

  // todo Image, Gradient & multiple fills

  let propPadding: EdgeInsetsGeometry
  if (node instanceof ReflectFrameNode) {
    propPadding = makeEdgeInsets(node);
  }

  if (propSize || propBoxDecoration) {
    // Container is a container if [propSize] or [propBoxDecoration] are set.
    // console.log("wrapping with container. child - ", child)
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
    // console.log("wrapping with padding")
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

function makeBoxDecoration(node: ReflectRectangleNode | ReflectEllipseNode | ReflectFrameNode): BoxDecoration | Color {
  const decorationBackground = makeBoxDecorationFill(node.fills);
  const decorationBorder = makeBorder(node);
  const decorationBoxShadow = makeBoxShadow(node);
  const decorationBorderRadius = makeBorderRadius(node);

  // modify the circle's shape when type is ellipse
  const decorationShape: BoxShape = node instanceof ReflectEllipseNode ? BoxShape.circle : undefined;

  // generate the decoration, or just the backgroundColor when color is SOLID.
  const isNotSolid = decorationBorder || decorationShape || decorationBorder || decorationBorderRadius || decorationBackground

  return isNotSolid
    ? new BoxDecoration({
      borderRadius: decorationBorderRadius,
      shape: decorationShape,
      image: decorationBackground instanceof ImageProvider ? new DecorationImage({
        image: decorationBackground,
        fit: BoxFit.cover
      }) : undefined,
      border: decorationBorder,
      boxShadow: decorationBoxShadow,
      color: decorationBackground instanceof Color ? decorationBackground as Color : undefined,
      gradient: decorationBackground instanceof Gradient ? decorationBackground as Gradient : undefined
    })
    : decorationBackground instanceof Color ? decorationBackground as Color : undefined
}


export function makeBoxDecorationFill(fills: ReadonlyArray<Paint> | PluginAPI["mixed"]): Gradient | Color | ImageProvider {
  const fill = retrieveFill(fills);

  if (fill?.type === "SOLID") {
    const opacity = fill.opacity ?? 1.0;
    return makeColorFromRGBO(fill.color, opacity)
  } else if (fill?.type === "GRADIENT_LINEAR") {
    return interpretGradient(fill)
  } else if (fill?.type == "IMAGE") {
    return interpretImageFills(fill)
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

