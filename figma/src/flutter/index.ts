import {
  ReflectEllipseNode,
  ReflectFrameNode,
  ReflectRectangleNode,
  ReflectGroupNode,
  ReflectTextNode,
  ReflectSceneNode
} from "@bridged.xyz/design-sdk/lib/nodes/types";
import { TextBuilder, WidgetBuilder } from "./builders";
import { mostFrequent } from "../utils/array-utils";
import { MainAxisSize, CrossAxisAlignment, Column, Row, SizedBox, Widget, Stack } from "@bridged.xyz/flutter-builder"
import { roundNumber } from "../ui-utils/numbers.normalizer";


let parentId = "";
const DEFAULT_COMPONENT_NAME = "Component";
export function generateSource(sceneNode: ReflectSceneNode,
  parentIdSrc: string = ""): string {
  parentId = parentIdSrc;

  let result = flutterWidgetGenerator(sceneNode);

  if (Array.isArray(result)) {
    throw "result cannot be in array form."
  }

  return result.build().finalize();

  // return new SingleChildScrollView({
  //   child: result
  // }).build().finalize()
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
    // console.log(`starting handling node of ${node.name} type of ${node.type}`)
    if (node.type === "RECTANGLE" || node.type === "ELLIPSE") {
      const container = flutterContainer(node, undefined)
      // console.log("node.type was rectangle or elipse. due to that, returning container.", container)
      return container
    }

    else if (node.type === "GROUP") {
      return flutterGroup(node)
    } else if (node.type === "FRAME") {
      return flutterFrame(node)
    } else if (node.type === "TEXT") {
      return flutterText(node)
    }
  }
}

function flutterGroup(node: ReflectGroupNode): Widget {
  return flutterContainer(
    node,
    new Stack({
      children: flutterWidgetGenerator(node.children) as Array<Widget>
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
    return flutterContainer(
      node,
      new Stack({
        children: children as Array<Widget>
      })
    );
  }
}


type RowOrColumn = "Row" | "Column"
function makeRowColumn(node: ReflectFrameNode, children: Array<Widget>): Widget {
  // ROW or COLUMN
  const rowOrColumn: RowOrColumn = node.layoutMode === "HORIZONTAL" ? "Row" : "Column";

  const mostFreq = mostFrequent(node.children.map((d) => d.layoutAlign));

  const layoutAlign = mostFreq === "MIN" ? "start" : "center";

  const crossAxisColumn = rowOrColumn === "Column" ? CrossAxisAlignment[layoutAlign] : undefined

  const mainAxisSize: MainAxisSize = MainAxisSize.min

  switch (rowOrColumn) {
    case "Row":
      return new Row({
        children: children,
        mainAxisSize: mainAxisSize,
      })
    case "Column":
      return new Column({
        children: children,
        mainAxisSize: mainAxisSize,
        crossAxisAlignment: crossAxisColumn
      })
  }
}


function addSpacingIfNeeded(node: ReflectSceneNode,
  index: number,
  length: number): Widget {
  if (node.parent?.type === "FRAME" && node.parent.layoutMode !== "NONE") {
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
