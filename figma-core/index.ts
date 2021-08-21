// ==========
// init plugin
/* do not delete this line */ import "app/lib/utils/plugin-init"; // NO REMOVE
// ==========

// ==========
// init core handler
/* do not delete this line */ import "./code-thread/core-init"; // NO REMOVE
// ==========

// ==========
// init utility handler
/* do not delete this line */ import "./event-handlers"; // NO REMOVE
// ==========

import { onfigmaselectionchange } from "./code-thread/selection";
import { onfigmamessage } from "./code-thread/message-handler";
import { MainImageRepository } from "@design-sdk/core/assets-repository";
import { ImageRepositories } from "@design-sdk/figma/asset-repository";

figma.on("selectionchange", () => {
  onfigmaselectionchange();
});
figma.ui.onmessage = async (msg) => {
  onfigmamessage(msg);
};
figma.on("close", () => {
  console.log("close");
});
figma.on("currentpagechange", () => {
  console.log("currentpagechange");
});

/// ============================================================
// MAIN INITIALIZATION
import { showUI } from "./code-thread/show-ui";
import { provideFigma } from "@design-sdk/figma";
function main() {
  MainImageRepository.instance = new ImageRepositories();
  provideFigma(figma);
  showUI();
}

main();
// endregion
/// ============================================================
