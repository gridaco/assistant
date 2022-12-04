import { onService, _Lint_Event, _APP_EVENT_LINT_RESULT_EK } from "./events";
import { runLints } from "@designto/clean";
import { FigmaNodeCache } from "figma-core/node-cache";

onService(main_cb);

// main callback
function main_cb(evt: _Lint_Event) {
  // to logic

  switch (evt.type) {
    case "lint-request":
      _handle_lint_request();
      break;
  }
}

function _handle_lint_request() {
  //#region  run linter
  const rnode = FigmaNodeCache.getLastConverted();
  if (rnode) {
    try {
      const feedbacks = runLints(rnode);
      console.info("feedbacks:", feedbacks);
      figma.ui.postMessage({
        type: _APP_EVENT_LINT_RESULT_EK,
        data: feedbacks,
      });
    } catch (e) {
      console.error(e);
    }
  } else {
    console.warn("user requested linting, but non selected to run lint on.");
  }
  //#endregion
}
