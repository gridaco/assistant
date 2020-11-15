import { ReflectFrameNode } from "@bridged.xyz/design-sdk/lib/nodes";
import { Column, MainAxisSize, Row, Widget } from "@bridged.xyz/flutter-builder/lib";
import { mostFrequent } from "../../utils/array-utils";
import { makeCrossAxisAlignment } from "../interpreter/cross-axis-alignment.interpret";
import { makeSafelyAsList } from "../utils/make-as-safe-list";

export type RowOrColumn = "Row" | "Column"
export function makeRowColumn(node: ReflectFrameNode, children: Array<Widget>): Widget {
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