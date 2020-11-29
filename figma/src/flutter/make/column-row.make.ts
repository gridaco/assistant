import { ReflectFrameNode } from "@bridged.xyz/design-sdk/lib/nodes";
import { Column, MainAxisSize, Row, Widget } from "@bridged.xyz/flutter-builder/lib";
import { mostFrequent } from "general-utils/lib/array.utils";
import { interpretCrossAxisAlignment } from "../interpreter/cross-axis-alignment.interpret";
import { interpretMainAxisAlignment } from "../interpreter/main-axis-alignment.interpreter";
import { interpretMainAxisSize } from "../interpreter/main-axis-size.interpret";
import { makeSafelyAsList } from "../utils/make-as-safe-list";

export type RowOrColumn = "Row" | "Column"
export function makeRowColumn(node: ReflectFrameNode, children: Array<Widget>): Widget {
    // ROW or COLUMN
    const rowOrColumn: RowOrColumn = node.layoutMode === "HORIZONTAL" ? "Row" : "Column";

    const mainAxisAlignment = interpretMainAxisAlignment(node.primaryAxisAlignItems)
    const mainAxisSize: MainAxisSize = interpretMainAxisSize(node)

    // safely make childeren as list type
    children = makeSafelyAsList<Widget>(children)

    switch (rowOrColumn) {
        case "Row":
            return new Row({
                children: children,
                mainAxisSize: mainAxisSize,
                mainAxisAlignment: mainAxisAlignment
            })
        case "Column":
            const crossAxisAlignment = interpretCrossAxisAlignment(node.counterAxisAlignItems)
            return new Column({
                children: children,
                mainAxisSize: mainAxisSize,
                mainAxisAlignment: mainAxisAlignment,
                crossAxisAlignment: crossAxisAlignment
            })
    }
}



/**
 *
  const crossAxisAlignment = `crossAxisAlignment: CrossAxisAlignment.${crossAlignType}, `;

  let mainAlignType;
  switch (node.primaryAxisAlignItems) {
    case "MIN":
      mainAlignType = "start";
      break;
    case "CENTER":
      mainAlignType = "center";
      break;
    case "MAX":
      mainAlignType = "end";
      break;
    case "SPACE_BETWEEN":
      mainAlignType = "spaceBetween";
      break;
  }
  const mainAxisAlignment = `mainAxisAlignment: MainAxisAlignment.${mainAlignType}, `;

  let mainAxisSize;
  if (node.layoutGrow === 1) {
    mainAxisSize = "mainAxisSize: MainAxisSize.max, ";
  } else {
    mainAxisSize = "mainAxisSize: MainAxisSize.min, ";
  }
 */