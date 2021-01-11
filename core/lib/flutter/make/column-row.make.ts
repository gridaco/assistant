import { ReflectFrameNode } from "@bridged.xyz/design-sdk/lib/nodes";
import { Column, MainAxisSize, Row, Widget } from "@bridged.xyz/flutter-builder/lib";
import { Axis as ReflectAxis } from "@reflect.bridged.xyz/core/lib";
import { interpretCrossAxisAlignment } from "../interpreter/cross-axis-alignment.interpret";
import { interpretMainAxisAlignment } from "../interpreter/main-axis-alignment.interpreter";
import { interpretMainAxisSize } from "../interpreter/main-axis-size.interpret";
import { makeSafelyAsList } from "../utils/make-as-safe-list";

export type RowOrColumn = "Row" | "Column"
export function makeRowColumn(node: ReflectFrameNode, children: Array<Widget>): Widget {
    // ROW or COLUMN
    const rowOrColumn: RowOrColumn = node.layoutMode === ReflectAxis.horizontal ? "Row" : "Column";

    const mainAxisAlignment = interpretMainAxisAlignment(node.mainAxisAlignment)
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
            const crossAxisAlignment = interpretCrossAxisAlignment(node.crossAxisAlignment)
            return new Column({
                children: children,
                mainAxisSize: mainAxisSize,
                mainAxisAlignment: mainAxisAlignment,
                crossAxisAlignment: crossAxisAlignment
            })
    }
}
