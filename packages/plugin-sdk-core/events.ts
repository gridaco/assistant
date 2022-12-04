export const __PLUGIN_SDK_NAMESPACE_BASE_TOKEN = "grida";
export const PLUGIN_SDK_NS_RESPONSE_ALL = "grida/response/*";
export const PLUGIN_SDK_NS_APP_REQUEST_CUSTOM_ALL = "grida/app/request/*";
export const PLC_REMOTE_API_REQ = "pugin-consumer/remote-api/request";
export const PLC_REMOTE_API_RES = "pugin-consumer/remote-api/response";
export const PLUGIN_SDK_NS_REMOTE_API = `${__PLUGIN_SDK_NAMESPACE_BASE_TOKEN}/remote-api`;
export const PLUGIN_SDK_NS_GENERAL_STATE_DATA = `${__PLUGIN_SDK_NAMESPACE_BASE_TOKEN}/general-state-data`;

// region sync
export const PLUGIN_SDK_NS_SYNC = `${__PLUGIN_SDK_NAMESPACE_BASE_TOKEN}/sync`;
// endregion sync

// region meta
export const PLUGIN_SDK_NS_META_API = `${__PLUGIN_SDK_NAMESPACE_BASE_TOKEN}/meta`;
export const PLUGIN_SDK_EK_BATCH_META_UPDATE =
  "assistant/tools/batch-meta-editor/update";
export const PLUGIN_SDK_EK_REQUEST_FETCH_ROOT_META =
  "assistant/tools/batch-meta-editor/fetch";
export const PLUGIN_SDK_EK_REQUEST_FETCH_NODE_META =
  "assistant/tools/node-meta-editor/fetch";
export const PLUGIN_SDK_EK_REQUEST_FETCH_NODE_MAIN_COMPONENT_META =
  "assistant/tools/node-meta-editor/fetch/main-component";
export const PLUGIN_SDK_EK_REQUEST_FETCH_NODE_MAIN_COMPONENT_LAYER_META =
  "assistant/tools/node-meta-editor/fetch/main-component/layer";
export const PUGIN_SDK_EK_REQUEST_UPDATE_NODE_META =
  "assistant/tools/node-meta-editor/update";
export const PUGIN_SDK_EK_REQUEST_UPDATE_MAIN_COMPONENT_META =
  "assistant/tools/node-meta-editor/update/main-component";
// endregion meta

// region export (image)
export const PLUGIN_SDK_NS_EXPORT_AS_IMAGE = `${__PLUGIN_SDK_NAMESPACE_BASE_TOKEN}/export`;
export const PLUGIN_SDK_EK_REQUEST_EXPORT_AS_IMAGE =
  "assistant/export-node-as-image";
// endregion export (image)

// region node read
export const PLUGIN_SDK_NS_GET_NODE = `${__PLUGIN_SDK_NAMESPACE_BASE_TOKEN}/get-node`;
export const PLUGIN_SDK_EK_REQUEST_GET_NODE_BY_ID = "assistant/node/get/by-id";
// endregion node read

// region node access
export const PLUGIN_SDK_NS_NODE = `${__PLUGIN_SDK_NAMESPACE_BASE_TOKEN}/node`;
export const PLUGIN_SDK_EK_REQUEST_RESCALE_NODE_BY_ID =
  "assistant/node/rescale/by-id";
export const PLUGIN_SDK_EK_REQUEST_RESIZE_NODE_BY_ID =
  "assistant/node/resize/by-id";
export const PLUGIN_SDK_EK_REQUEST_REMOVE_NODE_BY_ID =
  "assistant/node/remove/by-id";
// endregion node access

// region storage
export const PLUGIN_SDK_NS_STORAGE = `${__PLUGIN_SDK_NAMESPACE_BASE_TOKEN}/storage`;
export const PLUGIN_SDK_EK_REQUEST_STORAGE_SET_ITEM =
  "assistant/storage/set-item";
export const PLUGIN_SDK_EK_REQUEST_STORAGE_GET_ITEM =
  "assistant/storage/get-item";
export const PLUGIN_SDK_EK_REQUEST_STORAGE_REMOVE_ITEM =
  "assistant/storage/remove-item";
export const PLUGIN_SDK_EK_REQUEST_STORAGE_CLEAR = "assistant/storage/clear";
export const PLUGIN_SDK_EK_STORAGE_ALIAS = {
  set: PLUGIN_SDK_EK_REQUEST_STORAGE_SET_ITEM,
  get: PLUGIN_SDK_EK_REQUEST_STORAGE_GET_ITEM,
  remove: PLUGIN_SDK_EK_REQUEST_STORAGE_REMOVE_ITEM,
  clear: PLUGIN_SDK_EK_REQUEST_STORAGE_CLEAR,
};
// endregion storage

// region browser api override
export const PLUGIN_SDK_NS_BROWSER_API = `${__PLUGIN_SDK_NAMESPACE_BASE_TOKEN}/browser-api`;
export const PLUGIN_SDK_EK_BROWSER_OPEN_URI = "assistant/browser-api/open-uri";
// endregion browser api override

// region notify
export const PLUGIN_SDK_NS_NOTIFY_API = `${__PLUGIN_SDK_NAMESPACE_BASE_TOKEN}/notify`;
export const PLUGIN_SDK_EK_SIMPLE_NOTIFY = "notify";
export const PLUGIN_SDK_EK_NOTIFY_COPIED = "notify-copied";
// endregion notify

// region ui
export const PLUGIN_SDK_NS_UI_API = `${__PLUGIN_SDK_NAMESPACE_BASE_TOKEN}/ui`;
export const PLUGIN_SDK_EK_UI_RESIZE = "resize";
export const PLUGIN_SDK_EK_UI_CLOSE = "close";
export const PLUGIN_SDK_EK_UI_SHOW = "show";
export const PLUGIN_SDK_EK_UI_HIDE = "hide";
export const PLUGIN_SDK_EK_UI_ALIAS = {
  close: PLUGIN_SDK_EK_UI_CLOSE,
  resize: PLUGIN_SDK_EK_UI_RESIZE,
  show: PLUGIN_SDK_EK_UI_SHOW,
  hide: PLUGIN_SDK_EK_UI_HIDE,
};
// endregion notify

// region focus
export const PLUGIN_SDK_NS_FOCUS_API = `${__PLUGIN_SDK_NAMESPACE_BASE_TOKEN}/focus`;
export const PLUGIN_SDK_EK_SIMPLE_FOCUS = "focus";
// endregion focus

// region canvas
export const PLUGIN_SDK_NS_DRAG_AND_DROP = `${__PLUGIN_SDK_NAMESPACE_BASE_TOKEN}/drag-and-drop`;
export const PLUGIN_SDK_EK_DRAG_AND_DROPPED = `dropped on canvas`;
// endregion canvas

export interface BasePluginEvent<T = any> {
  /**
   * app stands for ui.ts
   * server stands for code.ts
   */
  namespace: string;
  key: string;
  data: T;
}

/**
 * An Event object interface to pass Plugin events from / to PluginService and PluginApp
 */
export interface TransportPluginEvent extends BasePluginEvent {
  origin: "app" | "server";
  type: "response" | "request";
  error?: Error;
  id: string;
}
