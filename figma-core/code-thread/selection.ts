import { analyzeSelection, SelectionAnalysis } from "plugin-app/utils";
import { convert } from "@design-sdk/figma-node-conversion";
import type { ReflectSceneNode } from "@design-sdk/figma-node";
import { Logger } from "logger";
import { makeReference } from "@design-sdk/figma-node";
import { runon } from "./runon";
import { FigmaNodeCache } from "../node-cache";

export let singleFigmaNodeSelection: SceneNode;
export let targetNodeId: string;

export function onfigmaselectionchange() {
  // clear the console for better debugging
  // console.clear();
  // console.warn("log cleared. optimized for new build");
  const rawSelections = figma.currentPage.selection;
  if (process.env.NODE_ENV === "development") {
    console.log("selection", rawSelections);
  }

  const convert_allowed_only = (raw: SceneNode) => {
    // block large selection
    // size determined by px
    if (raw.width * raw.height > 20000000) {
      figma.notify("Selection too large. we can't operate with this design.");
      return;
    }

    // block the "too many remote compoents" - this is required since reading through all remote components is slow, could take up more than a minute. (thread freeze until then.)
    if ("children" in raw) {
      const t1 = new Date();
      let breakit = false;
      const timeout = 2 * 1000;
      // by reading through the remote components, we can preload the remote data wich will enalbe use to do the code gen in time.
      const remote_components = raw.findChildren((n) => {
        const t2 = new Date();
        if (t2.getTime() - t1.getTime() > timeout) {
          // if reading the components took more than 10 seconds, cancel the process.
          breakit = true;
          figma.notify("stopping. too many remote components. 😭");
        }
        if (breakit) {
          return false;
        }
        return n.type == "INSTANCE" && n.mainComponent.remote;
      });
      console.log(
        `${remote_components.length} remote components found ${
          breakit ? "with breaking" : ""
        }`
      );

      // double check on end.
      const t2 = new Date();
      if (t2.getTime() - t1.getTime() > timeout) {
        // if reading the components took more than 10 seconds, cancel the process.
        figma.notify("stopping. too many remote components. 😭");
        return;
      }
    }

    return convert.intoReflectNode(raw as any, raw.parent as any, "plugin");
  };

  const selectionType = analyzeSelection(rawSelections);
  /* unique and only selection setter */ FigmaNodeCache.select(
    ...rawSelections.map((s) => s.id)
  ); /* unique and only selection setter */
  switch (selectionType) {
    case SelectionAnalysis.empty:
      // ignore when nothing was selected
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
      let rnodes = rawSelections.map((s) => {
        return convert_allowed_only(s);
      });
      rnodes.filter((r) => r !== undefined);

      Logger.debug("reflect-converted-selections", rnodes);
      // region sync selection event (search "selectionchange" for references)
      if (rnodes.length >= 1) {
        figma.ui.postMessage({
          type: "selectionchange",
          data: rnodes.map((n) => makeReference(n)),
        });
      }
      // endregion
      return;

    case SelectionAnalysis.single:
      const target = figma.currentPage.selection[0];
      // check [ignoreStackParent] description
      singleFigmaNodeSelection = target;
      targetNodeId = singleFigmaNodeSelection.id;

      // TODO: this will not trigger unless user deselects and re select the same node. currently node cache does not have expiry control.
      let rnode: ReflectSceneNode;
      const _cached = FigmaNodeCache.getConverted(singleFigmaNodeSelection.id);
      if (_cached) {
        console.info("using cached", _cached.name);
        rnode = _cached;
      } else {
        rnode = convert_allowed_only(singleFigmaNodeSelection);
        if (!rnode) {
          return;
        }
      }

      // Logger.debug("reflect-converted-selection", rnode);

      // region sync selection event (search "selectionchange" for references)
      try {
        const data = makeReference(rnode);

        // support text node (characters) =========
        // FIXME: safely remove (migrate) this. (affected: @app/copywriter) - add a proper text support
        if (rnode.type == "TEXT") {
          if ("data" in rnode) {
            data["characters"] = rnode.data;
          }
        }
        // ========================================

        figma.ui.postMessage({
          type: "selectionchange",
          data: data,
        });
      } catch (_) {
        figma.notify(`Oops. we don't support "${target.type}" yet.`);
        console.error(_);
      }
      // endregion
      FigmaNodeCache.setConverted(rnode);
      runon(rnode);
      return;
    default:
      break;
  }
}
