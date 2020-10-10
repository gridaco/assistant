import { ReflectSceneNode } from "../../node-convert/mixin";
import { Align, Alignment, Positioned, Widget } from "@bridged.xyz/flutter-builder";
import { parentCoordinates } from "../../figma-utils/parent-coordinates";
import { commonPosition } from "../../figma-utils/common-position";
import { roundNumber } from "../../ui-utils/numbers.normalizer";

export function wrapWithPositioned(node: ReflectSceneNode,
  child: Widget,
  parentId: string = ""): Widget {
  // avoid adding Positioned() when parent is not a Stack(), which can happen at the beggining
  if (!node.parent || parentId === node.parent.id || !child) {
    return child;
  }

  // check if view is in a stack. Group and Frames must have more than 1 element
  if (node.parent.isRelative === true) {
    const pos = retrieveAbsolutePos(node, child);
    if (pos !== "Absolute") {
      return pos;
    } else {
      // this is necessary because Group have absolute position, while Frame is relative.
      // output is always going to be relative to the parent.
      const [parentX, parentY] = parentCoordinates(node.parent);

      const diffX = (node.x - parentX);
      const diffY = (node.y - parentY);
      return new Positioned(
        {
          left: roundNumber(diffX),
          top: roundNumber(diffY),
          child: child
        }
      )
    }
  }

  return child;
}


type Absolute = "Absolute"
function retrieveAbsolutePos(node: ReflectSceneNode, child: Widget): Widget | Absolute {
  const positionedAlign = (align: string): Positioned => {
    return Positioned.fill({
      child: new Align({
        alignment: Alignment[align]
      })
    })
  }

  switch (commonPosition(node)) {
    case "":
      return child;
    case "Absolute":
      return "Absolute";
    case "TopStart":
      return positionedAlign("topLeft");
    case "TopCenter":
      return positionedAlign("topCenter");
    case "TopEnd":
      return positionedAlign("topRight");
    case "CenterStart":
      return positionedAlign("centerLeft");
    case "Center":
      return positionedAlign("center");
    case "CenterEnd":
      return positionedAlign("centerRight");
    case "BottomStart":
      return positionedAlign("bottomLeft");
    case "BottomCenter":
      return positionedAlign("bottomCenter");
    case "BottomEnd":
      return positionedAlign("bottomRight");
  }
}
