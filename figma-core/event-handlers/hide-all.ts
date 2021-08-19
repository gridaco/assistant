import { hideAllExcept, hideAllOnly } from "../tool-box/manipulate";
import { addEventHandler, singleFigmaNodeSelection } from "../code-thread";

function hideAllExceptFromCurrentSelection(
  selection: SceneNode,
  except: NodeType
) {
  if (selection.type != "FRAME") {
    figma.notify("hide-all tools can be used only for framenode");
  } else {
    hideAllExcept(selection, except);
  }
}

function hideAllOnlyFromCurrentSelection(selection: SceneNode, only: NodeType) {
  if (selection.type != "FRAME") {
    figma.notify("hide-all tools can be used only for framenode");
  } else {
    hideAllOnly(selection, only);
  }
}

export function __register__() {
  addEventHandler("hide-all-except", (msg) => {
    hideAllExceptFromCurrentSelection(
      singleFigmaNodeSelection,
      msg.data.except
    );
  });
  addEventHandler("hide-all-only", (msg) => {
    hideAllOnlyFromCurrentSelection(singleFigmaNodeSelection, msg.data.only);
  });
}
