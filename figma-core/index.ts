// ==========
// init plugin
/* do not delete this line */ import "app/__plugin__init__"; // NO REMOVE
// ==========

// ==========
// init core handler
/* do not delete this line */ import "./code-thread/core-init"; // NO REMOVE
// ==========

// ==========
// init utility handler
/* do not delete this line */ import "./event-handlers"; // NO REMOVE
// ==========

// ==========
// init relaunch-data trigger
/* do not delete this line */ import "./relaunch-data"; // NO REMOVE
// ==========

import { onfigmaselectionchange } from "./code-thread/selection";
import { onfigmamessage } from "./code-thread/message-handler";
import { MainImageRepository } from "@design-sdk/asset-repository";
import { ImageRepositories } from "@design-sdk/figma/dist/asset-repository";

figma.on("selectionchange", () => {
  onfigmaselectionchange();
});
figma.ui.onmessage = async (msg) => {
  // region root level custom handler
  if (msg.type == "trigger-selectionchange") {
    onfigmaselectionchange();
    return;
  }
  // endregion root level custom handler
  onfigmamessage(msg);
};
figma.on("close", () => {
  console.log("close");
});
figma.on("currentpagechange", () => {
  console.log("currentpagechange");
});

// codegen
figma.codegen.on("generate", async (event) => {
  return [
    {
      title: "Hello",
      code: "code should appear here",
      language: "TYPESCRIPT",
    },
  ];
});

figma.codegen.on("preferenceschange", async (event) => {
  return;
});

/// ============================================================
// MAIN INITIALIZATION
import { showUI } from "./code-thread/show-ui";
import { provideFigma } from "@design-sdk/figma";

async function main() {
  // provide figma editor type
  await figma.clientStorage.setAsync("figma.editorType", figma.editorType);

  switch (figma.editorType) {
    case "figma": {
      MainImageRepository.instance = new ImageRepositories();
      provideFigma(figma);
      showUI();
      break;
    }
    case "figjam": {
      break;
    }
    case "dev": {
      MainImageRepository.instance = new ImageRepositories();
      provideFigma(figma);
      figma.notify("dev mode");
      showUI();
      break;
    }
    default: {
      throw "unsupported editor type" + figma.editorType;
    }
  }

  // disabled on staging ----
  // create primary visual store
  // import { createPrimaryVisualStorePageIfNonExists } from "./physical-visual-store/page-manager/craete-page-if-non-exist";
  // createPrimaryVisualStorePageIfNonExists();
  // ------------------------
}

main();
// endregion
/// ============================================================
