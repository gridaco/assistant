import { NS_FILE_ROOT_METADATA } from "@core/constant/ns.constant";

import {
  PLUGIN_SDK_EK_BATCH_META_UPDATE,
  PLUGIN_SDK_EK_DRAG_AND_DROPPED,
  PLUGIN_SDK_NS_UI_API,
  PLUGIN_SDK_EK_UI_RESIZE,
  PLUGIN_SDK_EK_UI_SHOW,
  PLUGIN_SDK_EK_UI_HIDE,
  PLUGIN_SDK_EK_UI_CLOSE,
  PLUGIN_SDK_EK_REQUEST_FETCH_NODE_MAIN_COMPONENT_META,
  PLUGIN_SDK_EK_REQUEST_FETCH_NODE_META,
  PLUGIN_SDK_EK_REQUEST_FETCH_ROOT_META,
  PLUGIN_SDK_EK_SIMPLE_NOTIFY,
  __PLUGIN_SDK_NAMESPACE_BASE_TOKEN,
  PLUGIN_SDK_NS_APP_REQUEST_CUSTOM_ALL,
  PLUGIN_SDK_NS_DRAG_AND_DROP,
  PLUGIN_SDK_NS_META_API,
  PLUGIN_SDK_NS_NOTIFY_API,
  PLUGIN_SDK_NS_REMOTE_API,
  PLUGIN_SDK_NS_RESPONSE_ALL,
  PLUGIN_SDK_NS_STORAGE,
  PLUGIN_SDK_NS_FOCUS_API,
  PUGIN_SDK_EK_REQUEST_UPDATE_MAIN_COMPONENT_META,
  PUGIN_SDK_EK_REQUEST_UPDATE_NODE_META,
  TransportPluginEvent,
  DragAndDropHandlerCallback,
  DragAndDropOnCanvasRequest,
  BatchMetaFetchRequest,
  BatchMetaUpdateRequest,
  NodeMetaFetchRequest,
  NodeMetaUpdateRequest,
  NotifyRequest,
  FocusRequest,
  PLUGIN_SDK_EK_SIMPLE_FOCUS,
  PLUGIN_SDK_NS_BROWSER_API,
  PLUGIN_SDK_EK_BROWSER_OPEN_URI,
  PLUGIN_SDK_EK_REQUEST_EXPORT_AS_IMAGE,
  PLUGIN_SDK_NS_EXPORT_AS_IMAGE,
  ImageExportResponse,
  _ImageExportOption_to_FigmaCompat,
  ImageExportRequest,
  PLUGIN_SDK_EK_REQUEST_GET_NODE_BY_ID,
  PLUGIN_SDK_NS_GET_NODE,
  TargetPlatform,
  target_platform,
  MetaRequest,
  makeExportSetting,
  UIControlRequest,
} from "@plugin-sdk/core";

import {
  WebStorage,
  FigmaStorage,
  IStorage,
  LayerMetadataStorage,
} from "./storage";

// TODO - make it universal
import { plugin as figma } from "@design-sdk/figma";
import type { SceneNode } from "@design-sdk/figma";

import {
  StorageGetItemResponse,
  StorageRequest,
} from "../plugin-sdk-core/interfaces/storage";
interface HanderProps<T = any> {
  id: string;
  key: string;
  data: T;
}

figma?.on("selectionchange", () => {
  PluginSdkService.onSelectionChange();
});

export class PluginSdkService {
  private static _appRequestHandlers: Map<string, (data) => void> = new Map();

  // Todo - rename as invokeOnSelectionChange for no confusion
  static onSelectionChange() {
    const selection = figma.currentPage.selection;
    if (selection.length == 0) {
      // sync({
      //   namespace: PLUGIN_SDK_NS_SYNC,
      //   key:
      // });
      // deselect
    } else if (selection.length == 1) {
      // select single
      // sync();
    } else if (selection.length >= 2) {
      // selections
      // sync();
    }
  }

  private static dragAndDropHandlers = new Map<
    string,
    DragAndDropHandlerCallback
  >();

  static registerDragAndDropHandler(
    key: string,
    handler: DragAndDropHandlerCallback
  ) {
    this.dragAndDropHandlers.set(key, handler);
  }

  static handleDragAndDropEvent(key: string, data: any, position: { x; y }) {
    if (!PluginSdkService.dragAndDropHandlers.has(key)) {
      throw `no handler found for event ${key} on drag and drop handler`;
    }

    PluginSdkService.dragAndDropHandlers.get(key)(data, position);
  }

  static handle(event: TransportPluginEvent): boolean {
    // logging
    // console.info(
    //   `start handling event from PluginSdkServer with event - `,
    //   event
    // );

    // validate the givven event
    if (!event.namespace) {
      return;
    }

    if (event.namespace == "__INTERNAL__") {
      // console.log(
      //   'handling internal ivent with event ns - "__INTERNAL__"',
      //   event
      // );
      return handleInternalEvent(event);
    }

    if (!event.namespace.includes(__PLUGIN_SDK_NAMESPACE_BASE_TOKEN)) {
      console.warn(
        `the event is passed to PluginSdkServer, but the namespace or structure does not meet the standard interface. the givven event was - `,
        event
      );
      return false;
    }

    const handerProps: HanderProps = {
      id: event.id,
      key: event.key,
      data: event.data,
    };
    // meta
    if (event.namespace == PLUGIN_SDK_NS_META_API) {
      handleMetaEvent(handerProps);
      return true;
    }

    // image export
    else if (event.namespace == PLUGIN_SDK_NS_EXPORT_AS_IMAGE) {
      handleExportEvent(handerProps);
    }

    // get node
    else if (event.namespace == PLUGIN_SDK_NS_GET_NODE) {
      handleGetNodeEvent(handerProps);
    }

    // storage
    else if (event.namespace == PLUGIN_SDK_NS_STORAGE) {
      handleStorageEvent(handerProps);
      return true;
    }

    // browser api
    else if (event.namespace == PLUGIN_SDK_NS_BROWSER_API) {
      handleBrowserApiEvent(event);
      return true;
    }
    //

    // remote api call
    else if (event.namespace == PLUGIN_SDK_NS_REMOTE_API) {
      handleRemoteApiEvent(handerProps);
      return true;
    }

    // notify
    else if (event.namespace == PLUGIN_SDK_NS_NOTIFY_API) {
      handleNotify(handerProps);
      return true;
    }
    // ui api
    else if (event.namespace == PLUGIN_SDK_NS_UI_API) {
      handleUiApiEvent(event);
      return true;
    }

    // focus to target layer
    else if (event.namespace == PLUGIN_SDK_NS_FOCUS_API) {
      handleFocus(handerProps);
      return true;
    }

    // drag & drop
    else if (event.namespace == PLUGIN_SDK_NS_DRAG_AND_DROP) {
      if (PLUGIN_SDK_EK_DRAG_AND_DROPPED) {
        handleDragDropped(handerProps);
      }
    } else if (event.namespace == PLUGIN_SDK_NS_APP_REQUEST_CUSTOM_ALL) {
      this.invokeAppRequestHandler(event.key, event.data);
    }

    return true;
  }

  ////#region custom app request handling
  /**
   * this is a callback register method for code side thread.
   * when custom event or request raised from app side (via PluginSdk).
   * this listens to that event and transports to callback so custom handler can be registered easily.
   * this shall be called once on warmup, do not use this on runtime via logic gate since it has no unregister method. (intended this way)
   * @param key - a event key (namespace is not required)
   * @param callback
   */
  static onAppReqquest<T>(key: string, callback: (data: T) => void) {
    console.log(`registering custom app event handler for key: ${key}.`);
    this._appRequestHandlers.set(key, callback);
  }

  private static invokeAppRequestHandler(key: string, data: any) {
    const handler = this._appRequestHandlers.get(key);
    if (handler) {
      handler(data);
    } else {
      console.warn(
        `custom app request with key ${key} was raised, but no handler was found. please add handler for ${key} with "PluginSdkService.onAppReqquest(${key}, callback)" or remove unused event`
      );
    }
  }
  ////#endregion custom app request handling
}

function handleInternalEvent(event: HanderProps) {
  if (event.key == "sync-target-platform") {
    return response(event.id, __syncTargetPlatformForCodeThread(event.data));
  }
  return response(event.id, true);
}

function handleMetaEvent(props: HanderProps<MetaRequest>) {
  if (
    props.key == PLUGIN_SDK_EK_BATCH_META_UPDATE ||
    props.key == PLUGIN_SDK_EK_REQUEST_FETCH_ROOT_META ||
    props.key == PLUGIN_SDK_EK_REQUEST_FETCH_NODE_META ||
    props.key == PUGIN_SDK_EK_REQUEST_UPDATE_NODE_META
  ) {
    const d = props.data;
    switch (d.type) {
      case "batch-meta-update-request": {
        new LayerMetadataStorage(figma.root.id, NS_FILE_ROOT_METADATA).setItem(
          d.key,
          d.value
        );
        figma.notify("metadata updated", { timeout: 1 });
        return response(props.id, true);
      }
      case "batch-meta-fetch-request": {
        const fetched = new LayerMetadataStorage(
          figma.root.id,
          NS_FILE_ROOT_METADATA
        ).getItem(d.key);

        return response(props.id, fetched);
      }
      case "node-meta-fetch-request": {
        if (!d.id) {
          throw `node id is required in order to perform meta fetch`;
        }
        const fetched = new LayerMetadataStorage(
          figma.root.id,
          d.namespace
        ).getItem(d.key);
        return response(props.id, fetched);
      }
      case "node-meta-update-request": {
        new LayerMetadataStorage(figma.root.id, d.namespace).setItem(
          d.key,
          d.value
        );
        return response(props.id, true);
      }
    }
  }

  // if (props.key == PLUGIN_SDK_EK_REQUEST_FETCH_NODE_MAIN_COMPONENT_META) {
  //   const request: NodeMetaFetchRequest = props.data;
  //   let targetNode: Figma.SceneNode = getMaincomponentLike(request.id);
  //   const data = targetNode.getSharedPluginData(request.namespace, request.key);
  //   const normData = decode(data);
  //   return response(props.id, normData);
  // } else if (props.key == PUGIN_SDK_EK_REQUEST_UPDATE_MAIN_COMPONENT_META) {
  //   const request: NodeMetaUpdateRequest = props.data;
  //   let targetNode: Figma.SceneNode = getMaincomponentLike(request?.id);
  //   targetNode.setSharedPluginData(
  //     request.namespace,
  //     request.key,
  //     encode(request.value)
  //   );
  //   return response(props.id, true);
  //   //
  // }
}

function handleRemoteApiEvent(props: HanderProps) {
  throw "not implemented";
}

function handleNotify(props: HanderProps<NotifyRequest>) {
  if (props.key == PLUGIN_SDK_EK_SIMPLE_NOTIFY) {
    switch (target_platform.get()) {
      case TargetPlatform.webdev: {
        alert(props.data.message);
      }
      case TargetPlatform.figma: {
        figma?.notify(props.data.message, {
          timeout: props.data.duration ?? 1,
        });
      }
    }
  }
  response(props.id, true);
}

function handleUiApiEvent(props: HanderProps<UIControlRequest>) {
  switch (target_platform.get()) {
    case TargetPlatform.webdev: {
      break;
      // not handled
    }

    case TargetPlatform.figma: {
      switch (props.data.type) {
        case PLUGIN_SDK_EK_UI_CLOSE: {
          figma?.ui.close();
          break;
        }
        case PLUGIN_SDK_EK_UI_SHOW: {
          figma?.ui.show();
          break;
        }
        case PLUGIN_SDK_EK_UI_HIDE: {
          figma?.ui.hide();
          break;
        }
        case PLUGIN_SDK_EK_UI_RESIZE: {
          figma?.ui.resize(props.data.size.width, props.data.size.height);
          break;
        }
      }
    }
  }
  response(props.id, true);
}

function handleGetNodeEvent(props: HanderProps<{ id: string }>) {
  if (props.key == PLUGIN_SDK_EK_REQUEST_GET_NODE_BY_ID) {
    switch (target_platform.get()) {
      case TargetPlatform.webdev: {
      }
      case TargetPlatform.figma: {
        const node = figma?.getNodeById(props.data.id) as SceneNode;
        response(props.id, {
          id: node?.id,
          name: node?.name,
          x: node?.x,
          y: node?.y,
          width: node?.width,
          height: node?.height,
          ...node,
        });
      }
    }
  }
}

function handleFocus(props: HanderProps<FocusRequest>) {
  if (props.key == PLUGIN_SDK_EK_SIMPLE_FOCUS) {
    switch (target_platform.get()) {
      case TargetPlatform.webdev: {
        // none
        console.log("mock focus event from webdev", props);
      }
      case TargetPlatform.figma: {
        const target = figma.getNodeById(props.data.target) as SceneNode;
        //@ts-ignore TODO: remove ts-ignore
        figma.currentPage.selection = [target];
        // TODO: add zoom usage
        //@ts-ignore
        figma.viewport.scrollAndZoomIntoView([target]);
      }
    }
  }
}

async function handleExportEvent(event: HanderProps<ImageExportRequest>) {
  if (event.key === PLUGIN_SDK_EK_REQUEST_EXPORT_AS_IMAGE) {
    switch (target_platform.get()) {
      case TargetPlatform.webdev: {
        console.log(
          "webdev cannot perform image export request. ignoring this."
        );
        return undefined;
      }
      case TargetPlatform.figma: {
        const r = await (
          figma.getNodeById(event.data.id) as SceneNode
        ).exportAsync({
          ...makeExportSetting(event.data.opt),
        });

        return response<ImageExportResponse>(event.id, {
          id: event.data.id,
          data: r,
          opt: event.data.opt,
        });
      }
    }
  }
}

async function handleStorageEvent(props: HanderProps<StorageRequest>) {
  const _get_dedicated_storage = (): IStorage => {
    switch (target_platform.get()) {
      case TargetPlatform.webdev: {
        return new WebStorage();
      }
      case TargetPlatform.figma: {
        return new FigmaStorage();
      }
    }
  };

  const _storage = _get_dedicated_storage();
  switch (props.data.type) {
    case "get-item":
      const d = await _storage.getItem(props.data.key);
      response<StorageGetItemResponse>(props.id, { value: d });
      break;
    case "set-item":
      await _storage.setItem(props.data.key, props.data.value);
      response(props.id, true); // setting data to storage does not require response data payload (using `true`.).
      break;
  }
}

async function handleBrowserApiEvent(props: TransportPluginEvent) {
  if (props.key == PLUGIN_SDK_EK_BROWSER_OPEN_URI) {
    requestToHost(props);
  }
}

function handleDragDropped(props: HanderProps<DragAndDropOnCanvasRequest>) {
  console.log("handling drop event", props.data);
  const {
    //
    dropPosition,
    windowSize,
    offset,
    itemSize,
    eventKey,
    customData,
  } = props.data;

  // Getting the position and size of the visible area of the canvas.
  const bounds = figma.viewport.bounds;

  // Getting the zoom level
  const zoom = figma.viewport.zoom;

  // There are two states of the Figma interface: With or without the UI (toolbar + left and right panes)
  // The calculations would be slightly different, depending on whether the UI is shown.
  // So to determine if the UI is shown, we'll be comparing the bounds to the window's width.
  // Math.round is used here because sometimes bounds.width * zoom may return a floating point number very close but not exactly the window width.
  // This also applies when chrome developer tool is open on thr right side (not floating). currently, we cannot handle this issue. (PLEASE NOTE THAT YOU'LL NEED TO USE FLOATING DEVELOPER TOOLS WHEN DEVELOPING DnD!)
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

  PluginSdkService.handleDragAndDropEvent(eventKey, customData, { x: x, y: y });
}

///
/// -------------------------- footer response section ----------------------------
///

function response<T = any>(
  requestId: string,
  data: T,
  error: Error | undefined = undefined
): boolean {
  if (process.env.NODE_ENV == "development" && process.env.VERBOSE) {
    console.info(
      `${target_platform.get()}>> responding to request ${requestId} with data ${JSON.stringify(
        data
      )} and ${error ? "" + error : "no error"}`
    );
  }

  const msg = <TransportPluginEvent>{
    id: requestId,
    namespace: PLUGIN_SDK_NS_RESPONSE_ALL,
    type: "response",
    error: error,
    data: data,
  };
  switch (target_platform.get()) {
    case TargetPlatform.webdev: {
      window.postMessage({ pluginMessage: msg }, undefined);
      break;
    }
    case TargetPlatform.figma: {
      figma.ui.postMessage(msg);
      break;
    }
  }

  return true;
}

/** this is used to proxy a request from inner iframe to host iframe. */
function requestToHost(req) {
  console.log("requesting host to handle requests from hosted app.", req);
  switch (target_platform.get()) {
    case TargetPlatform.webdev: {
      window.postMessage(
        { pluginMessage: { __proxy_request_from_hosted_plugin: true, ...req } },
        undefined
      );
      break;
    }
    case TargetPlatform.figma: {
      figma.ui.postMessage({
        __proxy_request_from_hosted_plugin: true,
        ...req,
      });
      break;
    }
  }
}

export function __syncTargetPlatformForCodeThread(
  platform: TargetPlatform
): boolean {
  // console.info(`thread#code: syncing target platform to ${platform}`);
  target_platform.set(platform);
  return true;
}

/**
 * this is for syncing data with PluginApp's general data such as currently selected node.
 * @param withEvent
 */
function sync(withEvent: TransportPluginEvent) {}
