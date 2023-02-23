import type { ReflectSceneNode } from "@design-sdk/figma-node";

export function getPrimarySelectedNode(selection: readonly ReflectSceneNode[]) {
  // if (){
  // }
}

export enum SelectionAnalysis {
  empty = "empty",
  single = "single",
  multi = "multi",
}

export function analyzeSelection(selection: readonly any[]): SelectionAnalysis {
  if (selection.length == 0) {
    return SelectionAnalysis.empty;
  } else if (selection.length == 1) {
    return SelectionAnalysis.single;
  } else {
    return SelectionAnalysis.multi;
  }
}
