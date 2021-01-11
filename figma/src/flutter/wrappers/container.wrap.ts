import { convertToSize } from "../convert";
import {
  ReflectRectangleNode,
  ReflectEllipseNode,
  ReflectFrameNode,
  ReflectGroupNode
} from "@bridged.xyz/design-sdk/lib/nodes/types";
import { makeEdgeInsets } from "../make";
import { nearestValue } from "core/lib/utils/convert";
import { Container, Widget, EdgeInsetsGeometry, Padding, Alignment, AlignmentGeometry, Color, BoxDecoration, LinearGradient, Gradient, BoxShape, ImageProvider, DecorationImage, BoxFit, double, Size } from "@bridged.xyz/flutter-builder/lib"
import { roundNumber } from "@reflect.bridged.xyz/uiutils/lib/pixels";
import { makeBoxDecoration } from "../make/box-decoration.make";
import { roundDouble } from "../convert/double.convert";
import { notEmpty } from "@bridged.xyz/design-sdk/lib/utils";



export function wrapWithContainer(node: ReflectRectangleNode | ReflectEllipseNode | ReflectFrameNode | ReflectGroupNode, child?: Widget, options?: { size: Size }): Widget {
  // ignore the view when size is zero or less
  // while technically it shouldn't get less than 0, due to rounding errors,
  // it can get to values like: -0.000004196293048153166
  if (node.width <= 0 || node.height <= 0) {
    return child;
  }


  // ignore for Groups
  const propBoxDecoration = node instanceof ReflectGroupNode ? undefined : makeBoxDecoration(node);
  // if option passed, use option's value
  const propSize = notEmpty(options?.size) ? options.size : convertToSize(node);
  console.log('propSize', propSize)

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
        width: roundDouble(propSize.width),
        height: roundDouble(propSize.height),
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

