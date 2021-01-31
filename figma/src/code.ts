import { convertIntoReflectNode } from "@bridged.xyz/design-sdk/lib/nodes/conversion";
import { buildApp } from "core/lib/flutter";
import { retrieveFlutterColors } from "core/lib/flutter/utils/fetch-colors";
import {
  hideAllExcept,
  hideAllOnly,
} from "./tool-box/manipulate/hide-all/hide-all";
import { runLints } from "core/lib/lint/lint";
import {
  EK_BATCH_META_UPDATE,
  EK_REQUEST_FETCH_ROOT_META,
  EK_COMPUTE_STARTED,
  EK_COPIED,
  EK_CREATE_ICON,
  EK_FOCUS_REQUEST,
  EK_GENERATED_CODE_PLAIN,
  EK_IMAGE_ASSET_REPOSITORY_MAP,
  EK_LINT_FEEDBACK,
  EK_PREVIEW_SOURCE,
  EK_REPLACE_FONT,
  EK_SET_APP_MODE,
  EK_VANILLA_TRANSPORT,
  EK_DRAG_AND_DROPPED,
  EK_ICON_DRAG_AND_DROPPED,
} from "app/lib/constants/ek.constant";
import { handleNotify } from "@bridged.xyz/design-sdk/lib/figma";
import { makeApp } from "core/lib/flutter/make/app.make";
import { ImageRepositories } from "core/lib/assets-repository";
import { IconPlacement, renderSvgIcon } from "./reflect-render/icons.render";
import { makeVanilla } from "core/lib/vanilla";
import { ReflectFrameNode } from "@bridged.xyz/design-sdk/lib/nodes";
import { replaceAllTextFontInFrame } from "./tool-box/manipulate/font-replacer";
import { drawButtons } from "./reflect-render";
import {
  BatchMetaFetchQuery,
  BatchMetaOperationQuery,
} from "app/lib/screens/tool-box/batch-meta-editor";
import { NS_FILE_ROOT_METADATA } from "app/lib/constants";
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

showUI();

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
  console.clear();
  console.warn("log cleared. optimized for new build");
  console.log("selection", figma.currentPage.selection);

  const selectionCount = figma.currentPage.selection.length;

  // ignore when nothing was selected
  if (selectionCount === 0) {
    figma.ui.postMessage({
      type: "empty",
    });
    return;
  }

  // force to single selection
  // return false or raise error if more than one node is selected.
  if (selectionCount >= 2) {
    figma.notify("only single selection is supported", {
      timeout: 1.5,
    });
    return false;
  }

  if (selectionCount === 1) {
    const target = figma.currentPage.selection[0];
    figma.ui.postMessage({
      type: "selectionchange",
      data: target,
    });

    runon(target);
    return;
  }
});

// todo pass data instead of relying in types
figma.ui.onmessage = async (msg) => {
  console.log("event received", msg);
  handleNotify(msg);

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
  } else if (type == EK_COPIED) {
    figma.notify("copied to clipboard", { timeout: 1 });
  } else if (type == "reflect-ui-generation/button-base") {
    draw100000Buttons();
  } else if (type == EK_BATCH_META_UPDATE) {
    const d = data as BatchMetaOperationQuery;
    figma.root.setSharedPluginData(NS_FILE_ROOT_METADATA, d.key, d.value);
    figma.notify("metadata updated", { timeout: 1 });
  } else if (type == EK_REQUEST_FETCH_ROOT_META) {
    const d = data as BatchMetaFetchQuery;
    const fetched = figma.root.getSharedPluginData(
      NS_FILE_ROOT_METADATA,
      d.key
    );
    console.log(`fetched root metadata for key ${d.key} is.`, fetched);
    figma.ui.postMessage({
      type: "__response__",
      data: fetched,
    });
  } else if (EK_DRAG_AND_DROPPED) {
    handleDragDrop(data);
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

function handleDragDrop(data) {
  console.log("handling drop event", data);
  const {
    dropPosition,
    windowSize,
    offset,
    itemSize,
    eventKey,
    customData,
  } = data;

  // Getting the position and size of the visible area of the canvas.
  const bounds = figma.viewport.bounds;

  // Getting the zoom level
  const zoom = figma.viewport.zoom;

  // There are two states of the Figma interface: With or without the UI (toolbar + left and right panes)
  // The calculations would be slightly different, depending on whether the UI is shown.
  // So to determine if the UI is shown, we'll be comparing the bounds to the window's width.
  // Math.round is used here because sometimes bounds.width * zoom may return a floating point number very close but not exactly the window width.
  const hasUI = Math.round(bounds.width * zoom) !== windowSize.width;

  // Since the left pane is resizable, we need to get its width by subtracting the right pane and the canvas width from the window width.
  const leftPaneWidth = windowSize.width - bounds.width * zoom - 240;

  // Getting the position of the cursor relative to the top-left corner of the canvas.
  const xFromCanvas = hasUI
    ? dropPosition.clientX - leftPaneWidth
    : dropPosition.clientX;
  const yFromCanvas = hasUI ? dropPosition.clientY - 40 : dropPosition.clientY;

  // The canvas position of the drop point can be calculated using the following:
  const x = bounds.x + xFromCanvas / zoom - offset.x;
  const y = bounds.y + yFromCanvas / zoom - offset.y;

  if (eventKey == EK_ICON_DRAG_AND_DROPPED) {
    createIcon(
      customData,
      {
        x: x,
        y: y,
      },
      false
    );
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

// content randomizer, work on progress..
async function randimizeText() {
  if (figma.currentPage.selection.length >= 2) {
    figma.notify("only single node randomize is supported");
    return;
  }

  const primarySelection = figma.currentPage.selection[0];
  if (primarySelection.type == "TEXT") {
    const text = primarySelection as TextNode;
    await figma.loadFontAsync(text.fontName as FontName);
    text.characters =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ultrices scelerisque leo nec consectetur. Sed porta metus molestie sollicitudin gravida. Nulla vitae metus sapien.";
  }
  if (
    primarySelection.type == "RECTANGLE" ||
    primarySelection.type == "ELLIPSE"
  ) {
    const box = primarySelection as RectangleNode;
  }
}
