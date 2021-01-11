import { convertToSize } from "../convert/size.convert";
import {
  ReflectRectangleNode,
  ReflectEllipseNode,
  ReflectFrameNode,
  ReflectSceneNode,
  mixed
} from "@bridged.xyz/design-sdk/lib/nodes/types";
import { converters } from "@reflect.bridged.xyz/core/lib"
import { BorderRadiusGeometry, ShapeBorder, Colors, Color, Container, Widget } from "@bridged.xyz/flutter-builder/lib";
import { makeColor } from "../make/color.make";
import { makeShape as makeShape } from "../make/shape.make";
import { makeBorderRadius } from "../make/border-radius.make";
import { wrapWithPadding } from "./padding.wrap";

// https://api.flutter.dev/flutter/material/Material-class.html
export function wrapWithMaterial(node: ReflectRectangleNode | ReflectEllipseNode | ReflectFrameNode,
  child: Widget): Widget {
  // ignore the view when size is zero or less
  // while technically it shouldn't get less than 0, due to rounding errors,
  // it can get to values like: -0.000004196293048153166
  if (node.width <= 0 || node.height <= 0) {
    return child;
  }

  const color = materialColor(node);
  const shape = materialShape(node);
  const clip = getClipping(node);
  const [elevation, shadowColor] = flutterElevationAndShadowColor(node);
  const padChild = child ? `child: ${wrapWithPadding(node, child)}` : "";

  const materialAttr = color + elevation + shadowColor + shape + clip + padChild;

  const material: Widget = Widget.prebuilt(`Material(${materialAttr})`);

  const containerAttr = convertToSize(node);

  if (containerAttr) {
    // return `Container(${containerAttr}child: ${material}), `;
    return new Container({
      child: material,
      color: color,

    })
  }

  return material;
}

function materialColor(node: ReflectRectangleNode | ReflectEllipseNode | ReflectFrameNode): Color {
  const color = makeColor(node.fills);
  if (!color) {
    return Colors.transparent;
  }
  return color;
}

function materialShape(node: ReflectRectangleNode | ReflectEllipseNode | ReflectFrameNode): ShapeBorder | BorderRadiusGeometry {
  if (node.type === "ELLIPSE" || node.strokes?.length > 0) {
    return makeShape(node);
  } else {
    return makeBorderRadius(node);
  }
}

function getClipping(node: ReflectSceneNode): string {
  let clip = false;
  if (node instanceof ReflectFrameNode) {
    if (node.cornerRadius != mixed && node.cornerRadius !== 0) {
      clip = node.clipsContent;
    }
  }

  return clip ? "clipBehavior: Clip.antiAlias, " : "";
}



function flutterElevationAndShadowColor(node: ReflectSceneNode): [string, string] {
  let elevation = "";
  let shadowColor = "";

  if (node.effects?.length > 0) {
    const dropShadow: Array<ShadowEffect> = node.effects.filter(
      (d): d is ShadowEffect => d.type === "DROP_SHADOW" && d.visible !== false
    );

    if (dropShadow.length > 0 && dropShadow[0].type === "DROP_SHADOW") {
      shadowColor = `color: Color(0x${converters.color.rgbTo8hex(
        dropShadow[0].color,
        dropShadow[0].color.a
      )}), `;
      elevation = `elevation: ${(dropShadow[0].radius)}, `;
    }
  }

  return [elevation, shadowColor];
}
