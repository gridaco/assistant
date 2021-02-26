import { NS_FILE_ROOT_METADATA } from "../../../constants/ns.constant";
import {
  PLUGIN_SDK_EK_BATCH_META_UPDATE,
  PLUGIN_SDK_EK_DRAG_AND_DROPPED,
  PLUGIN_SDK_EK_REQUEST_FETCH_NODE_MAIN_COMPONENT_META,
  PLUGIN_SDK_EK_REQUEST_FETCH_NODE_META,
  PLUGIN_SDK_EK_REQUEST_FETCH_ROOT_META,
  PLUGIN_SDK_EK_SIMPLE_NOTIFY,
  PLUGIN_SDK_NAMESPACE_BASE_TOKEN,
  PLUGIN_SDK_NS_DRAG_AND_DROP,
  PLUGIN_SDK_NS_META_API,
  PLUGIN_SDK_NS_NOTIFY_API,
  PLUGIN_SDK_NS_REMOTE_API,
  PLUGIN_SDK_NS_RESPONSE_ALL,
  PUGIN_SDK_EK_REQUEST_UPDATE_MAIN_COMPONENT_META,
  PUGIN_SDK_EK_REQUEST_UPDATE_NODE_META,
  TransportPluginEvent,
} from "../events";
import {
  DragAndDropHandlerCallback,
  DragAndDropOnCanvasRequest,
} from "../interfaces/dragdrop/dragdrop.requests";
import {
  BatchMetaFetchRequest,
  BatchMetaUpdateRequest,
  NodeMetaFetchRequest,
  NodeMetaUpdateRequest,
} from "../interfaces/meta/meta.requests";
import { NotifyRequest } from "../interfaces/notify/notify.requests";

interface HanderProps<T = any> {
  id: string;
  key: string;
  data: T;
}

figma.on("selectionchange", () => {
  PluginSdkService.onSelectionChange();
});

export class PluginSdkService {
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
    console.info(
      `start handling event from PluginSdkServer with event - `,
      event
    );

    // validate the givven event
    if (!event.namespace) {
      return;
    }
    if (!event.namespace.includes(PLUGIN_SDK_NAMESPACE_BASE_TOKEN)) {
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

    // drag & drop
    else if (PLUGIN_SDK_NS_DRAG_AND_DROP) {
      if (PLUGIN_SDK_EK_DRAG_AND_DROPPED) {
        handleDragDropped(handerProps);
      }
    }

    return true;
  }
}

function handleMetaEvent(props: HanderProps) {
  if (props.key == PLUGIN_SDK_EK_BATCH_META_UPDATE) {
    const d = props.data as BatchMetaUpdateRequest;
    figma.root.setSharedPluginData(NS_FILE_ROOT_METADATA, d.key, d.value);
    figma.notify("metadata updated", { timeout: 1 });
  } else if (props.key == PLUGIN_SDK_EK_REQUEST_FETCH_ROOT_META) {
    const d = props.data as BatchMetaFetchRequest;
    const fetched = figma.root.getSharedPluginData(
      NS_FILE_ROOT_METADATA,
      d.key
    );
    console.log(`fetched root metadata for key ${d.key} is.`, fetched);
    response(props.id, fetched);
  } else if (props.key == PLUGIN_SDK_EK_REQUEST_FETCH_NODE_META) {
    const request: NodeMetaFetchRequest = props.data;
    if (!request.id) {
      throw `node id is required in order to perform meta fetch`;
    }
    const data = figma
      .getNodeById(request.id)
      .getSharedPluginData(request.namespace, request.key);
    const normData = normalizeMetadata(data);
    return response(props.id, normData);
  } else if (
    props.key == PLUGIN_SDK_EK_REQUEST_FETCH_NODE_MAIN_COMPONENT_META
  ) {
    const request: NodeMetaFetchRequest = props.data;
    const node = figma.getNodeById(request.id);
    let targetNode: SceneNode = getMaincomponentLike(node?.id);
    const data = targetNode.getSharedPluginData(request.namespace, request.key);
    const normData = normalizeMetadata(data);
    return response(props.id, normData);
  } else if (props.key == PUGIN_SDK_EK_REQUEST_UPDATE_MAIN_COMPONENT_META) {
    const request: NodeMetaUpdateRequest = props.data;
    const node = figma.getNodeById(request.id);
    let targetNode: SceneNode = getMaincomponentLike(node?.id);
    targetNode.setSharedPluginData(
      request.namespace,
      request.key,
      normalizeSavingMetadata(request.value)
    );
    return response(props.id, true);
    //
  } else if (props.key == PUGIN_SDK_EK_REQUEST_UPDATE_NODE_META) {
    const request: NodeMetaUpdateRequest = props.data;
    figma
      .getNodeById(request.id)
      .setSharedPluginData(
        request.namespace,
        request.key,
        normalizeSavingMetadata(request.value)
      );
    return response(props.id, true);
  }
}

function normalizeSavingMetadata(data: string | object) {
  return typeof data == "object" ? JSON.stringify(data) : data;
}

function normalizeMetadata(data: string): object | string {
  if (data == undefined || data.length == 0) {
    return undefined;
  }

  try {
    const json = JSON.parse(data);
    return json;
  } catch (_) {
    return data;
  }
}

function getMaincomponentLike(nodeID: string): SceneNode {
  if (!nodeID) {
    throw `node id is required in order to perform meta fetch`;
  }
  const node = figma.getNodeById(nodeID);
  let targetNode: SceneNode;
  if (node.type == "INSTANCE") {
    targetNode = node.mainComponent;
  } else if (node.type == "COMPONENT") {
    targetNode = node;
  } else if (node.type == "COMPONENT_SET") {
    targetNode = node;
  } else {
    throw `node ${node.id} of type ${node.type} is not supported for component meta manipulation.`;
  }
  return targetNode;
}

function handleRemoteApiEvent(props: HanderProps) {}

export function handleNotify(props: HanderProps<NotifyRequest>) {
  if (props.key == PLUGIN_SDK_EK_SIMPLE_NOTIFY) {
    figma.notify(props.data.message, {
      timeout: props.data.duration ?? 1,
    });
  }
  response(props.id, true);
}

function response<T = any>(
  requestId: string,
  data: T,
  error: Error | undefined = undefined
): boolean {
  console.info(
    `responding to request ${requestId} with data ${data} and error ${error}`
  );

  figma.ui.postMessage(<TransportPluginEvent>{
    id: requestId,
    namespace: PLUGIN_SDK_NS_RESPONSE_ALL,
    type: "response",
    error: error,
    data: data,
  });

  return true;
}

/**
 * this is for syncing data with PluginApp's general data such as currently selected node.
 * @param withEvent
 */
function sync(withEvent: TransportPluginEvent) {}

function handleDragDropped(props: HanderProps<DragAndDropOnCanvasRequest>) {
  console.log("handling drop event", props.data);
  const {
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
