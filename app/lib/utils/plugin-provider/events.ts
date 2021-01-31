export const PLUGIN_SDK_NAMESPACE_BASE_TOKEN = "bridged";
export const PLUGIN_SDK_NS_RESPONSE_ALL = "bridged/response/*";
export const PLC_REMOTE_API_REQ = "pugin-consumer/remote-api/request";
export const PLC_REMOTE_API_RES = "pugin-consumer/remote-api/response";
export const PLUGIN_SDK_NS_REMOTE_API = `${PLUGIN_SDK_NAMESPACE_BASE_TOKEN}/remote-api`;

// region sync
export const PLUGIN_SDK_NS_SYNC = `${PLUGIN_SDK_NAMESPACE_BASE_TOKEN}/sync`;
// endregion sync

// region meta
export const PLUGIN_SDK_NS_META_API = `${PLUGIN_SDK_NAMESPACE_BASE_TOKEN}/meta`;
export const PLUGIN_SDK_EK_BATCH_META_UPDATE =
  "assistant/tools/batch-meta-editor/update";
export const PLUGIN_SDK_EK_REQUEST_FETCH_ROOT_META =
  "assistant/tools/batch-meta-editor/fetch";
export const PLUGIN_SDK_EK_REQUEST_FETCH_NODE_META =
  "assistant/tools/node-meta-editor/fetch";
// endregion meta

// region notify
export const PLUGIN_SDK_NS_NOTIFY_API = `${PLUGIN_SDK_NAMESPACE_BASE_TOKEN}/notify`;
export const PLUGIN_SDK_EK_SIMPLE_NOTIFY = "notify";
export const PLUGIN_SDK_EK_NOTIFY_COPIED = "notify-copied";

// endregion notify

export interface BasePluginEvent<T = any> {
  /**
   * app stands for ui.ts
   * server stands for code.ts
   */
  namespace: string;
  key: string;
  data: T;
}

export interface TransportPluginEvent extends BasePluginEvent {
  origin: "app" | "server";
  type: "response" | "request";
  error?: Error;
  id: string;
}
