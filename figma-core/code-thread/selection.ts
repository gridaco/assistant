import { analyzeSelection, SelectionAnalysis } from "plugin-app/utils";
import { convert } from "@design-sdk/figma";
import { Logger } from "app/lib/utils";
import { light } from "@design-sdk/core/nodes";
import { runon } from "./runon";
import { FigmaNodeCache } from "../node-cache";

export let singleFigmaNodeSelection: SceneNode;
export let targetNodeId: string;

export function onfigmaselectionchange() {
  // clear the console for better debugging
  console.clear();
  console.warn("log cleared. optimized for new build");
  const rawSelections = figma.currentPage.selection;
  console.log("selection", rawSelections);
  const selectionType = analyzeSelection(rawSelections);
  /* unique and only selection setter */ FigmaNodeCache.select(
    ...rawSelections.map((s) => s.id)
  ); /* unique and only selection setter */
  switch (selectionType) {
    case SelectionAnalysis.empty:
      // ignore when nothing was selected
      console.log("deselection");
      figma.ui.postMessage({
        type: "empty",
      });
      return;
    case SelectionAnalysis.multi:
      // force to <5 selection
      // return false or raise error if more than 5 nodes are selected.
      if (rawSelections.length > 5) {
        figma.notify("only less than 5 selection is supported", {
          timeout: 1.5,
        });
        return false;
      }

      // todo - add memoization
      const rnodes = rawSelections.map((s) => {
        return convert.intoReflectNode(s as any, s.parent as any);
      });
      Logger.debug("reflect-converted-selections", rnodes);

      // region sync selection event (search "selectionchange" for references)
      figma.ui.postMessage({
        type: "selectionchange",
        data: rnodes.map((n) => light.makeReference(n)),
      });
    // endregion

    case SelectionAnalysis.single:
      const target = figma.currentPage.selection[0];
      // check [ignoreStackParent] description
      singleFigmaNodeSelection = target;
      targetNodeId = singleFigmaNodeSelection.id;

      // TODO: this will not trigger unless user deselects and re select the same node. currently node cache does not have expiry control.
      let rnode;
      const _cached = FigmaNodeCache.getLastConverted();
      if (_cached) {
        rnode = _cached;
      } else {
        rnode = convert.intoReflectNode(
          singleFigmaNodeSelection as any,
          singleFigmaNodeSelection.parent as any
        );
      }

      Logger.debug("reflect-converted-selection", rnode);

      // region sync selection event (search "selectionchange" for references)
      figma.ui.postMessage({
        type: "selectionchange",
        data: light.makeReference(rnode),
      });
      // endregion
      FigmaNodeCache.setConverted(rnode);
      runon(rnode);
      return;
    default:
      break;
  }
}
