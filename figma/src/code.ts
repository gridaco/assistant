import { PluginSdkService } from "app/lib/utils/plugin-provider/plugin-service";
import { convertIntoReflectNode } from "@bridged.xyz/design-sdk/lib/nodes/conversion";
import { buildApp } from "core/lib/flutter";
import { retrieveFlutterColors } from "core/lib/flutter/utils/fetch-colors";
import {
  analyzeSelection,
  SelectionAnalysis,
} from "app/lib/utils/plugin-provider/pugin-app/utils";
import {
  hideAllExcept,
  hideAllOnly,
  randimizeText,
} from "./tool-box/manipulate";
import { runLints } from "core/lib/lint/lint";
import {
  EK_COMPUTE_STARTED,
  EK_CREATE_ICON,
  EK_FOCUS_REQUEST,
  EK_GENERATED_CODE_PLAIN,
  EK_IMAGE_ASSET_REPOSITORY_MAP,
  EK_LINT_FEEDBACK,
  EK_PREVIEW_SOURCE,
  EK_REPLACE_FONT,
  EK_SET_APP_MODE,
  EK_VANILLA_TRANSPORT,
  EK_ICON_DRAG_AND_DROPPED,
} from "app/lib/constants/ek.constant";
import { makeApp } from "core/lib/flutter/make/app.make";
import { ImageRepositories } from "core/lib/assets-repository";
import { IconPlacement, renderSvgIcon } from "./reflect-render/icons.render";
import { makeVanilla } from "core/lib/vanilla";
import { ReflectFrameNode } from "@bridged.xyz/design-sdk/lib/nodes";
import { replaceAllTextFontInFrame } from "./tool-box/manipulate/font-replacer";
import { drawButtons } from "./reflect-render";
import { IconConfig } from "@reflect.bridged.xyz/core/lib/icon/icon.config";

let appMode: string = "code";
export let selection: SceneNode;
export let targetNodeId: string;

async function showUI() {
  // load plugin with confugured w/h
  const rawWidth = await figma.clientStorage.getAsync("width");
  const rawHeight = await figma.clientStorage.getAsync("height");
  let width = 375;
  if (rawWidth) {
    width = parseInt(rawWidth);
  }
  let height = 812;
  if (rawHeight) {
    height = parseInt(rawHeight);
  }
  figma.showUI(__html__, { width: width, height: height });
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runon(node: SceneNode) {
  // check [ignoreStackParent] description
  selection = node;
  targetNodeId = selection.id;

  // region
  // notify ui that the computing process has been started.
  // use this for when displaying loading indicator etc.. for general purpose.
  figma.ui.postMessage({
    type: EK_COMPUTE_STARTED,
    data: {
      mode: appMode,
    },
  });
  // endregion

  try {
    console.log(
      "constraints",
      (figma.currentPage.selection[0] as any).constraints,
      (figma.currentPage.selection[0] as any).layoutAlign
    );
  } catch (e) {}

  // FIXME
  const safeParent = selection.parent as any;
  const convertedSelection = convertIntoReflectNode(selection, safeParent);

  // if converted node returned nothing
  if (!convertedSelection) {
    figma.notify(
      'not a valid selection. this node is ignored with name : "//@ignore"'
    );
    return;
  }

  //#region  run linter
  if (appMode == "lint") {
    const feedbacks = runLints(convertedSelection);
    console.warn(feedbacks);
    figma.ui.postMessage({
      type: EK_LINT_FEEDBACK,
      data: feedbacks,
    });
  }
  //#endregion

  // region make vanilla
  if (appMode == "g11n") {
    const globalizatoinScreen = makeVanilla(
      convertedSelection as ReflectFrameNode
    );
    const vanillaTransportableImageRepository = await globalizatoinScreen.repository.makeTransportable();
    figma.ui.postMessage({
      type: EK_IMAGE_ASSET_REPOSITORY_MAP,
      data: vanillaTransportableImageRepository,
    });
    figma.ui.postMessage({
      type: EK_VANILLA_TRANSPORT,
      data: globalizatoinScreen,
    });
  }
  // endregion

  if (appMode == "code") {
    const buildResult = buildApp(convertedSelection);

    // host images
    const transportableImageAssetRepository = await ImageRepositories.current.makeTransportable();
    figma.ui.postMessage({
      type: EK_IMAGE_ASSET_REPOSITORY_MAP,
      data: transportableImageAssetRepository,
    });

    const widget = buildResult.widget;
    const app = makeApp({
      widget: widget,
      scrollable: buildResult.scrollable,
    });

    figma.ui.postMessage({
      type: EK_GENERATED_CODE_PLAIN,
      data: {
        code: widget.build().finalize(),
        app: app.build().finalize(),
      },
    });
  }

  // send preview image
  selection
    .exportAsync({
      format: "PNG",
      contentsOnly: true,
      constraint: {
        type: "HEIGHT",
        value: 250,
      },
    })
    .then((d) => {
      figma.ui.postMessage({
        type: EK_PREVIEW_SOURCE,
        data: {
          source: d,
          name: selection.name,
        },
      });
    });

  figma.ui.postMessage({
    type: "colors",
    data: retrieveFlutterColors([convertedSelection]),
  });
}
figma.on("selectionchange", () => {
  // clear the console for better debugging
  console.clear();
  console.warn("log cleared. optimized for new build");
  console.log("selection", figma.currentPage.selection);

  const selectionType = analyzeSelection(figma.currentPage.selection);
  switch (selectionType) {
    case SelectionAnalysis.empty:
      // ignore when nothing was selected
      figma.ui.postMessage({
        type: "empty",
      });
      return;
    case SelectionAnalysis.multi:
      // force to single selection
      // return false or raise error if more than one node is selected.
      figma.notify("only single selection is supported", {
        timeout: 1.5,
      });
      return false;
    case SelectionAnalysis.single:
      const target = figma.currentPage.selection[0];
      figma.ui.postMessage({
        type: "selectionchange",
        data: target,
      });
      runon(target);
      return;
  }
});

PluginSdkService.registerDragAndDropHandler(
  EK_ICON_DRAG_AND_DROPPED,
  (data, pos): Promise<any> => {
    createIcon(
      data,
      {
        x: pos.x,
        y: pos.y,
      },
      false
    );
    return;
  }
);

// todo pass data instead of relying in types
figma.ui.onmessage = async (msg) => {
  console.log("[event] figma plugin data received", msg);

  const generalHandlingResult = PluginSdkService.handle(msg);
  // if event is handled by general event handler, no additional handling is required.
  if (generalHandlingResult) {
    return;
  }

  const type = msg.type;
  const data = msg.data;

  if (type == EK_SET_APP_MODE) {
    appMode = msg.data;
    console.log(`app mode set event recieved, now setting as ${appMode}`);
  } else if (type == EK_FOCUS_REQUEST) {
    const target = figma.getNodeById(msg.data.id) as SceneNode;
    figma.currentPage.selection = [target];
    figma.viewport.scrollAndZoomIntoView([target]);
  } else if (type == EK_CREATE_ICON) {
    createIcon(data);
  } else if (type == EK_REPLACE_FONT) {
    if (selection.type == "FRAME") {
      const font = "Roboto";
      await replaceAllTextFontInFrame(selection, font);
      figma.notify(`successfuly changed font to ${font}`);
    } else {
      figma.notify("cannot replace font of non-frame node");
    }
  } else if (type == "randomize-selection") {
    randimizeText();
  } else if (type == "hide-all-except") {
    hideAllExceptFromCurrentSelection(msg.data.except);
  } else if (type == "hide-all-only") {
    hideAllOnlyFromCurrentSelection(msg.data.only);
  } else if (type == "reflect-ui-generation/button-base") {
    draw100000Buttons();
  }
};

function createIcon(
  data: { key: string; svg: string; config: IconConfig },
  placement: IconPlacement = "center",
  zoom: boolean = true
) {
  console.log("creating icon with data", data);
  const icon_key = data.key;
  const svgData = data.svg;
  const inserted = renderSvgIcon(
    icon_key,
    svgData,
    "#000000",
    placement,
    data.config
  );
  if (zoom) {
    figma.viewport.scrollAndZoomIntoView([inserted]);
  }
}

async function draw100000Buttons() {
  for (let i = 0; i < 1; i++) {
    await drawButtons(i);
  }
}

function hideAllExceptFromCurrentSelection(except: NodeType) {
  if (selection.type != "FRAME") {
    figma.notify("hide-all tools can be used only for framenode");
  } else {
    hideAllExcept(selection, except);
  }
}

function hideAllOnlyFromCurrentSelection(only: NodeType) {
  if (selection.type != "FRAME") {
    figma.notify("hide-all tools can be used only for framenode");
  } else {
    hideAllOnly(selection, only);
  }
}

function main() {
  showUI();
}

main();
