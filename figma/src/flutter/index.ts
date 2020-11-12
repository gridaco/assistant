import {
  ReflectEllipseNode,
  ReflectFrameNode,
  ReflectRectangleNode,
  ReflectGroupNode,
  ReflectTextNode,
  ReflectSceneNode,
  ReflectLineNode
} from "@bridged.xyz/design-sdk/lib/nodes";
import { TextBuilder, WidgetBuilder } from "./builders";
import { mostFrequent } from "../utils/array-utils";
import { MainAxisSize, CrossAxisAlignment, Column, Row, SizedBox, Widget, Stack } from "@bridged.xyz/flutter-builder/lib"
import { roundNumber } from "@reflect.bridged.xyz/uiutils/lib/pixels";
import { makeSafelyAsList, makeSafelyAsStackList } from "./utils/make-as-safe-list";
import { makeDivider } from "./make/divider.make";
import { detectIfButton } from "@reflect.bridged.xyz/detection/lib/button.detection";
import { makeButton } from "./make/button.make";


let parentId = "";
const DEFAULT_COMPONENT_NAME = "Component";


interface AppBuildResult {
  widget: Widget,
  scrollable: boolean
}

let targetId: string;
let scrollable: boolean
export function buildApp(sceneNode: ReflectSceneNode): AppBuildResult {
  scrollable = true // init to true.
  targetId = sceneNode.id
  return {
    widget: generateWidget(sceneNode),
    scrollable: scrollable
  }
}

export function generateWidget(sceneNode: ReflectSceneNode,
  parentIdSrc: string = ""): Widget {
  parentId = parentIdSrc;

  let result = flutterWidgetGenerator(sceneNode);

  if (Array.isArray(result)) {
    throw "result cannot be in array form."
  }

  return result
}


function flutterWidgetGenerator(sceneNode: ReadonlyArray<ReflectSceneNode> | ReflectSceneNode): Array<Widget> | Widget {
  if (Array.isArray(sceneNode)) {
    let widgets: Array<Widget> = [];

    // console.log("flutterWidgetGenerator:: targetting list of nodes")
    sceneNode = sceneNode as ReadonlyArray<ReflectSceneNode>
    const sceneLen = sceneNode.length;

    sceneNode.forEach((node, index) => {
      widgets.push(
        handleNode(node)
      )

      // if the parent is an AutoLayout, and itemSpacing is set, add a SizedBox between items.
      widgets.push(
        addSpacingIfNeeded(node, index, sceneLen)
      );
    });

    // filter undefined widgets
    widgets = widgets.filter((w) => w != undefined)
    if (widgets.length == 1) {
      // console.log("flutterWidgetGenerator complete", widgets[0])
      return widgets[0]
    }
    // console.log("flutterWidgetGenerator complete", widgets)
    return widgets

  } else {

    // console.log("flutterWidgetGenerator:: targetting single node")
    // console.log(sceneNode)
    sceneNode = sceneNode as ReflectSceneNode
    return handleNode(sceneNode)

  }


  function handleNode(node: ReflectSceneNode): Widget {

    const buttonDetectionResult = detectIfButton(node)
    if (buttonDetectionResult.result) {
      console.log('this node is detected as button.', node.name)
      return makeButton(buttonDetectionResult.data)
    }

    // console.log(`starting handling node of ${node.name} type of ${node.type}`)
    if (node instanceof ReflectRectangleNode || node instanceof ReflectEllipseNode) {
      return flutterContainer(node, undefined)
    }
    else if (node instanceof ReflectLineNode) {
      console.warn('handling line node')
      return makeDivider(node)
    }
    else if (node instanceof ReflectGroupNode) {
      return flutterGroup(node)
    } else if (node instanceof ReflectFrameNode) {
      return flutterFrame(node)
    } else if (node instanceof ReflectTextNode) {
      return flutterText(node)
    }
  }
}

function flutterGroup(node: ReflectGroupNode): Widget {
  return flutterContainer(
    node,
    new Stack({
      children: makeSafelyAsStackList(
        flutterWidgetGenerator(node.children)
      )
    })
  );
}

function flutterContainer(node: ReflectFrameNode | ReflectGroupNode | ReflectRectangleNode | ReflectEllipseNode,
  child?: Widget): Widget {
  const builder = new WidgetBuilder({ child: child, node: node });

  builder
    .wrapWithContainer()
    .blendWithAttributes()
    .positionInParent(parentId);
  return builder.child;
}

function flutterText(node: ReflectTextNode): Widget {
  const builder = new TextBuilder({
    child: undefined,
    node: node
  });

  builder
    .createText()
    .blendWithAttributes()
    .positionInParent(parentId);

  return builder.child;
}

function flutterFrame(node: ReflectFrameNode): Widget {
  const children = flutterWidgetGenerator(node.children);

  if (node.children.length === 1) {
    // if there is only one child, there is no need for Container or Row. Padding works indepdently of them.
    return flutterContainer(node, children as Widget);
  } else if (node.layoutMode !== "NONE") {
    const rowColumn = makeRowColumn(node, children as Array<Widget>);
    return flutterContainer(node, rowColumn);
  } else {
    // node.layoutMode === "NONE" && node.children.length > 1
    // children needs to be absolute

    // region
    // if currently handled node is root node, and it's outcome is stack, then make it not scrollable. (singlechildscrollview with stack usage is not resolved, remaining as issue.)
    if (node.id == targetId) {
      scrollable = false
    }
    // endregion

    return flutterContainer(
      node,
      new Stack({
        children: makeSafelyAsStackList(children)
      })
    );
  }
}


type RowOrColumn = "Row" | "Column"
function makeRowColumn(node: ReflectFrameNode, children: Array<Widget>): Widget {
  // ROW or COLUMN
  const rowOrColumn: RowOrColumn = node.layoutMode === "HORIZONTAL" ? "Row" : "Column";


  const mainAxisSize: MainAxisSize = MainAxisSize.min

  // safely make childeren as list type
  children = makeSafelyAsList<Widget>(children)

  switch (rowOrColumn) {
    case "Row":
      return new Row({
        children: children,
        mainAxisSize: mainAxisSize,
      })
    case "Column":
      // get the most frequent layoutAlign of children, and prioritize it by accepting 'MIN' first.
      // why? -> converting two MIN nodes to autolayout converts longer node as a MIN. and cannot be changed by figma's userinterface.
      const mostFreq = mostFrequent(node.children.map((d) => d.layoutAlign), ['MIN', 'MAX', 'STRETCH', 'CENTER']);
      // console.log(`mostFreq lyaout of children under ${node.name}`, mostFreq)

      // FIXME - this is not working with auto layout.
      // E.g. autolayout to left, the layoutAlign of the child text will be set to CENTER, Not MIN. wich is not a bug, but need extra logics for handling them.

      const crossAxisAlignment = makeCrossAxisAlignment(mostFreq)
      return new Column({
        children: children,
        mainAxisSize: mainAxisSize,
        crossAxisAlignment: crossAxisAlignment
      })
  }
}

/**
 * returns CrossAxisAlignment by layoutAlign
 * @param layoutAlign 
 */
function makeCrossAxisAlignment(layoutAlign: string): CrossAxisAlignment {
  switch (layoutAlign) {
    case "MIN":
      return CrossAxisAlignment.start
    case "MAX":
      return CrossAxisAlignment.end
    case "STRETCH":
      return CrossAxisAlignment.stretch
    case "CENTER":
      return CrossAxisAlignment.center
    default:
      return CrossAxisAlignment.center
  }
}


function addSpacingIfNeeded(node: ReflectSceneNode,
  index: number,
  length: number): Widget {
  if (node.parent instanceof ReflectFrameNode && node.parent.layoutMode !== "NONE") {
    // check if itemSpacing is set and if it isn't the last value.
    // Don't add the SizedBox at last value. In Figma, itemSpacing CAN be negative; here it can't.
    if (node.parent.itemSpacing > 0 && index < length - 1) {
      if (node.parent.layoutMode === "HORIZONTAL") {
        return new SizedBox({
          width: roundNumber(node.parent.itemSpacing)
        })
      } else {
        // node.parent.layoutMode === "VERTICAL"
        return new SizedBox({
          height: roundNumber(node.parent.itemSpacing)
        })
      }
    }
  }
  return undefined;
}
