import {
  ReflectEllipseNode,
  ReflectFrameNode,
  ReflectRectangleNode,
  ReflectGroupNode,
  ReflectTextNode,
  ReflectSceneNode,
  ReflectLineNode,
} from "@bridged.xyz/design-sdk/lib/nodes";
import { TextBuilder, WidgetBuilder } from "./builders";
import {
  SizedBox,
  Widget,
  Stack,
  Size,
  MediaQuery,
} from "@bridged.xyz/flutter-builder/lib";
import { roundNumber } from "@reflect.bridged.xyz/uiutils/lib/pixels";
import { makeSafelyAsStackList } from "./utils/make-as-safe-list";
import { makeDivider } from "./make/divider.make";
import { detectIfButton } from "@reflect.bridged.xyz/detection/lib/button.detection";
import { makeButton } from "./make/button.make";
import { detectIfIcon } from "@reflect.bridged.xyz/detection/lib/icon.detection";
import { makeDynamicIcon } from "./make/icon.make";
import { detectIfIllust } from "@reflect.bridged.xyz/detection/lib/illust.detection";
import { makeIllustImage } from "./make/image.make";
import { notEmpty } from "@bridged.xyz/design-sdk/lib/utils";
import { makeRowColumn } from "./make/column-row.make";
import { makeStack } from "./make/stack.make";
import { Axis as ReflectAxis } from "@reflect.bridged.xyz/core/lib";
import { detectIfChip } from "@reflect.bridged.xyz/detection/lib/chip.detection";
import { makeChip } from "./make/chip.make";

let parentId = "";
const DEFAULT_COMPONENT_NAME = "Component";
export let currentBuildingNodeId: string;

interface AppBuildResult {
  widget: Widget;
  scrollable: boolean;
}

// the target root widget tree
let targetId: string;
let scrollable: boolean;
export function buildApp(sceneNode: ReflectSceneNode): AppBuildResult {
  scrollable = true; // init to true.
  targetId = sceneNode.id;
  return {
    widget: generateWidget(sceneNode),
    scrollable: scrollable,
  };
}

export function generateWidget(
  sceneNode: ReflectSceneNode,
  parentIdSrc: string = ""
): Widget {
  parentId = parentIdSrc;
  setCurrentNode(sceneNode);

  let result = flutterWidgetGenerator(sceneNode);

  if (Array.isArray(result)) {
    throw "result cannot be in array form.";
  }

  return result;
}

function flutterWidgetGenerator(
  sceneNode: ReadonlyArray<ReflectSceneNode> | ReflectSceneNode
): Array<Widget> | Widget {
  if (Array.isArray(sceneNode) && sceneNode.length > 0) {
    // explicit type casting
    sceneNode = sceneNode as ReadonlyArray<ReflectSceneNode>;

    // count of input nodes
    const sceneLen = sceneNode.length;

    // initialize output widgets array
    let widgets: Array<Widget> = [];

    console.log(
      `widget generator:: targetting list of nodes children of ${sceneNode[0].parent?.toString()}. total count of ${sceneLen}`
    );

    sceneNode.forEach((node, index) => {
      setCurrentNode(node);
      widgets.push(handleNode(node));

      // if the parent is an AutoLayout, and itemSpacing is set, add a SizedBox between items.
      widgets.push(addSpacingIfNeeded(node, index, sceneLen));
    });

    // filter empty widgets
    widgets = widgets.filter((w) => notEmpty(w));
    if (widgets.length == 1) {
      // console.log("flutterWidgetGenerator complete", widgets[0])
      return widgets[0];
    }
    // console.log("flutterWidgetGenerator complete", widgets)
    return widgets;
  } else {
    // explicit type casting
    sceneNode = sceneNode as ReflectSceneNode;
    console.log(
      `widget generator:: targetting single node ${sceneNode.toString()} child of ${sceneNode.parent?.toString()}`
    );

    return handleNode(sceneNode);
  }

  function handleNode(node: ReflectSceneNode): Widget {
    setCurrentNode(node);
    console.log(
      `starting handling node ${node.toString()} type of ${node.type}`
    );

    const chipDetectionResult = detectIfChip(node);
    if (chipDetectionResult.result) {
      console.log("this node is detected as Chip", node.name);
      return makeChip(chipDetectionResult.data);
    }

    const buttonDetectionResult = detectIfButton(node);
    if (buttonDetectionResult.result) {
      console.log("this node is detected as button.", node.name);
      return makeButton(buttonDetectionResult.data);
    }

    const iconDetectionResult = detectIfIcon(node);
    if (iconDetectionResult.result) {
      console.log("this node is detected as an icon.", node.name);
      return makeDynamicIcon(node);
    }

    const illustDetectionResult = detectIfIllust(node);
    if (illustDetectionResult.result) {
      console.log("this node is detected as an illust.", node.name);
      return makeIllustImage(node);
    }

    if (
      node instanceof ReflectRectangleNode ||
      node instanceof ReflectEllipseNode
    ) {
      console.log(
        `this node ${node.toString()} is a rect || ellipse. making it as a empty container`
      );
      return flutterContainer(node, undefined);
    } else if (node instanceof ReflectLineNode) {
      console.log(
        `this node ${node.toString()} is a line. making it as a divider`
      );
      return makeDivider(node);
    } else if (node instanceof ReflectGroupNode) {
      console.log(
        `this node ${node.toString()} is a group. handling with group handler`
      );
      return flutterGroupHandler(node);
    } else if (node instanceof ReflectFrameNode) {
      return flutterFrame(node);
    } else if (node instanceof ReflectTextNode) {
      return flutterText(node);
    }
  }
}

function setCurrentNode(node: { id: string }) {
  // TODO - move this to build process's instance
  currentBuildingNodeId = node.id;
}

function flutterGroupHandler(node: ReflectGroupNode): Widget {
  console.log(
    `group handler :: making ${node} as a stack with its children count of ${node.childrenCount}`
  );
  return flutterContainer(
    node,
    makeStack(flutterWidgetGenerator(node.children) as [])
  );
}

function flutterContainer(
  node:
    | ReflectFrameNode
    | ReflectGroupNode
    | ReflectRectangleNode
    | ReflectEllipseNode,
  child?: Widget
): Widget {
  const builder = new WidgetBuilder({ child: child, node: node });

  const isBuildRoot = targetId === node.id;
  const sizeOptions = isBuildRoot
    ? {
        size: new Size(MediaQuery.of().size.width, undefined).addComment(
          'container building for target root node. making the width with "MediaQuery.of().size.width"'
        ),
      }
    : undefined;

  builder
    .wrapWithContainer(sizeOptions)
    .blendWithAttributes()
    .positionInParent(parentId);
  return builder.child;
}

function flutterText(node: ReflectTextNode): Widget {
  const builder = new TextBuilder({
    child: undefined,
    node: node,
  });

  builder.createText().blendWithAttributes().positionInParent(parentId);

  return builder.child;
}

function flutterFrame(node: ReflectFrameNode): Widget {
  console.log(`start handling frame node ${node.toString()} and its children`);
  const children = flutterWidgetGenerator(node.children);

  if (node.children.length === 1) {
    // if there is only one child, there is no need for Container or Row. Padding works indepdently of them.
    return flutterContainer(node, children as Widget);
  } else if (node.layoutMode !== undefined) {
    const rowColumn = makeRowColumn(node, children as Array<Widget>);
    return flutterContainer(node, rowColumn);
  } else {
    // node.layoutMode === "NONE" && node.children.length > 1
    // children needs to be absolute

    // region
    // if currently handled node is root node, and it's outcome is stack, then make it not scrollable. (singlechildscrollview with stack usage is not resolved, remaining as issue.)
    if (node.id == targetId) {
      scrollable = false;
    }
    // endregion

    return flutterContainer(
      node,
      new Stack({
        children: makeSafelyAsStackList(children),
      })
    );
  }
}

function addSpacingIfNeeded(
  node: ReflectSceneNode,
  index: number,
  length: number
): Widget | undefined {
  if (
    node.parent instanceof ReflectFrameNode &&
    node.parent.layoutMode !== undefined
  ) {
    // check if itemSpacing is set and if it isn't the last value.
    // Don't add the SizedBox at last value. In Figma, itemSpacing CAN be negative; here it can't.
    if (node.parent.itemSpacing > 0 && index < length - 1) {
      if (node.parent.layoutMode === ReflectAxis.horizontal) {
        return new SizedBox({
          width: roundNumber(node.parent.itemSpacing),
        });
      } else {
        // node.parent.layoutMode === "VERTICAL"
        return new SizedBox({
          height: roundNumber(node.parent.itemSpacing),
        });
      }
    }
  }
  return undefined;
}
