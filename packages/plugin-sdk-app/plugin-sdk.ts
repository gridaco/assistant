import {
  BasePluginEvent,
  PLUGIN_SDK_EK_UI_ALIAS,
  PLUGIN_SDK_NS_UI_API,
  PLUGIN_SDK_EK_DRAG_AND_DROPPED,
  PLUGIN_SDK_EK_REQUEST_FETCH_NODE_MAIN_COMPONENT_LAYER_META,
  PLUGIN_SDK_EK_REQUEST_FETCH_NODE_MAIN_COMPONENT_META,
  PLUGIN_SDK_EK_REQUEST_FETCH_NODE_META,
  PLUGIN_SDK_EK_REQUEST_FETCH_ROOT_META,
  PLUGIN_SDK_EK_SIMPLE_NOTIFY,
  PLUGIN_SDK_NS_APP_REQUEST_CUSTOM_ALL,
  PLUGIN_SDK_NS_DRAG_AND_DROP,
  PLUGIN_SDK_NS_META_API,
  PLUGIN_SDK_NS_NOTIFY_API,
  PUGIN_SDK_EK_REQUEST_UPDATE_MAIN_COMPONENT_META,
  PUGIN_SDK_EK_REQUEST_UPDATE_NODE_META,
  PLUGIN_SDK_NS_STORAGE,
  PLUGIN_SDK_EK_STORAGE_ALIAS,
  TransportPluginEvent,
  reqid,
  BatchMetaFetchRequest,
  NodeMetaFetchRequest,
  NodeMetaUpdateRequest,
  StorageSetItemRequest,
  StorageGetItemRequest,
  StorageGetItemResponse,
  NotifyRequest,
  DragAndDropOnCanvasRequest,
  PLUGIN_SDK_NS_FOCUS_API,
  PLUGIN_SDK_EK_SIMPLE_FOCUS,
  FocusRequest,
  PLUGIN_SDK_NS_BROWSER_API,
  PLUGIN_SDK_EK_BROWSER_OPEN_URI,
  PLUGIN_SDK_NS_EXPORT_AS_IMAGE,
  PLUGIN_SDK_EK_REQUEST_EXPORT_AS_IMAGE,
  ImageExportRequest,
  ImageExportResponse,
  target_platform,
  TargetPlatform,
  UIControlRequest,
} from "@plugin-sdk/core";
import type { ReflectSceneNode } from "@design-sdk/figma-node";
import { ASSISTANT_PLUGIN_NAMESPACE__NOCHANGE } from "@core/constant";

import { _SharedStorageCache } from "./_shared-storage-cache";
import { NodeApi } from "./node-api";

const __main_plugin_sdk_instance_storage_cache = new _SharedStorageCache(
  "co.grida.assistant"
);

export class PluginSdk {
  private static _window: Window;
  static get window(): Window {
    return this._window;
  }
  static initializeWindow(window: Window) {
    this._window = window;
  }

  static resizeHost(size: { width: number; height: number }) {
    // figma.ui.resize()
    this.request({
      namespace: PLUGIN_SDK_NS_UI_API,
      key: PLUGIN_SDK_EK_UI_ALIAS.resize,
      data: <UIControlRequest>{
        type: "resize",
        size,
      },
    });
  }

  /**
   * this only sets TARGET_PLATFORM on ui thread.
   * @param platform
   */
  static async initializeTargetPlatform(platform: TargetPlatform) {
    if (!!target_platform.get()) {
      throw "cannot overwrite target platform on runtime.";
    }

    target_platform.set(platform);
    if (platform == TargetPlatform.webdev) {
      return true;
    }

    // sync this to code side.
    await PluginSdk.request({
      namespace: "__INTERNAL__",
      key: "sync-target-platform",
      data: platform,
    });
    // console.info(`thread#ui: target platform set as ${platform}`);
  }

  // region general canvas api
  static get selectedNodeIds(): readonly string[] {
    throw "not implemented";
    return [];
  }

  static get selectedNodes(): readonly ReflectSceneNode[] {
    throw "not implemented";
    return [];
  }

  static get selectedNodeId(): string {
    // TODO
    throw "not implemented";
    return undefined;
  }

  static get selectedNode(): ReflectSceneNode {
    // TODO
    throw "not implemented";
    return undefined;
  }

  static async getNode(id: string) {
    return new NodeApi(id).get();
  }

  static node(id: string): NodeApi {
    return new NodeApi(id);
  }

  static async getNodeImage(
    req: ImageExportRequest
  ): Promise<ImageExportResponse> {
    return await this.request<ImageExportResponse>({
      namespace: PLUGIN_SDK_NS_EXPORT_AS_IMAGE,
      key: PLUGIN_SDK_EK_REQUEST_EXPORT_AS_IMAGE,
      data: req,
    });
  }

  // enderegion general canvas api

  // region network api
  static get(params: any) {
    throw "not implmtd";
  }

  static post(params: any) {
    throw "not implmtd";
  }

  // endregion network api

  //
  // region storage api
  static setItem<T = string>(key: string, value: T) {
    __main_plugin_sdk_instance_storage_cache.setCache(
      key,
      value
    ); /* 1. set cache */

    /* 2. send set request */
    this.request({
      namespace: PLUGIN_SDK_NS_STORAGE,
      key: PLUGIN_SDK_EK_STORAGE_ALIAS.set,
      data: <StorageSetItemRequest<T>>{
        type: "set-item",
        key: key,
        value: value,
      },
    }).finally(() => {
      __main_plugin_sdk_instance_storage_cache.removeCache(
        key
      ); /* 3. remove cache after saving complete */
    });
  }

  static async getItem<T = string>(key: string): Promise<T> {
    const _has_cached = __main_plugin_sdk_instance_storage_cache.hasCache(key);
    if (_has_cached) {
      return __main_plugin_sdk_instance_storage_cache.getCache<T>(key);
    } else {
      const _resp = await this.request<StorageGetItemResponse<T>>({
        namespace: PLUGIN_SDK_NS_STORAGE,
        key: PLUGIN_SDK_EK_STORAGE_ALIAS.get,
        data: <StorageGetItemRequest<T>>{
          type: "get-item",
          key: key,
        },
      });
      return _resp.value;
    }
  }

  // endregion storage api
  //

  //
  // region metadata
  static updateMetadata(request: NodeMetaUpdateRequest) {
    return this.request({
      namespace: PLUGIN_SDK_NS_META_API,
      key: PUGIN_SDK_EK_REQUEST_UPDATE_NODE_META,
      data: request,
    });
  }

  /**
   * fetches the metadata with grida default namespace provided.
   */
  static async fetchMetadata_grida<T = any>(
    on: string,
    key: string
  ): Promise<T> {
    return this.fetchMetadata<T>({
      type: "node-meta-fetch-request",
      id: on,
      key: key,
      namespace: ASSISTANT_PLUGIN_NAMESPACE__NOCHANGE,
    });
  }

  static async fetchMetadata<T = any>(
    request: NodeMetaFetchRequest
  ): Promise<T> {
    return this.request<T>({
      namespace: PLUGIN_SDK_NS_META_API,
      key: PLUGIN_SDK_EK_REQUEST_FETCH_NODE_META,
      data: request,
    });
  }

  /**
   * fetches the master component metadata no matter the input id (node id) was id of master component or a instance.
   * when instance id was givven it will automatically locate master component to set the metadata
   * @param request
   * @returns
   * @deprecated - use plain meta update instead.
   */
  static async fetchMainComponentMetadata(request: NodeMetaFetchRequest) {
    return this.request({
      namespace: PLUGIN_SDK_NS_META_API,
      key: PLUGIN_SDK_EK_REQUEST_FETCH_NODE_MAIN_COMPONENT_META,
      data: request,
    });
  }

  /**
   * fetches the master component's layer corresponding to givven id. works similar like "fetchMainComponentMetadata"
   * @deprecated - use plain meta update instead.
   */
  static async fetchMainComponentLayerMetadata(request: NodeMetaFetchRequest) {
    throw "not implemented on handler side";
    return this.request({
      namespace: PLUGIN_SDK_NS_META_API,
      key: PLUGIN_SDK_EK_REQUEST_FETCH_NODE_MAIN_COMPONENT_LAYER_META,
      data: request,
    });
  }

  /**
   * updates the main component's meta data.
   * (this also works for a variant compat component,
   * but it does't save on variant set's meta,
   * intead saves on master component of single variant.
   *  - so you'll need to prevent using this on some case to prevent future confusion)
   * @param request
   * @returns
   * @deprecated - use plain meta update instead.
   */
  static async updateMainComponentMetadata(request: NodeMetaUpdateRequest) {
    return this.request({
      namespace: PLUGIN_SDK_NS_META_API,
      key: PUGIN_SDK_EK_REQUEST_UPDATE_MAIN_COMPONENT_META,
      data: request,
    });
  }

  static fetchRootMetadata(key: string): Promise<any> {
    const data: BatchMetaFetchRequest = {
      type: "batch-meta-fetch-request",
      key: key,
    };
    return this.request({
      namespace: PLUGIN_SDK_NS_META_API,
      key: PLUGIN_SDK_EK_REQUEST_FETCH_ROOT_META,
      data: data,
    });
  }

  // endregion metadata

  /**
   * inner iframe blocked js functions
   * this is designed to be used inside iframe that has no popup permission, so that calling open() in inner iframe won't work.
   * But we can simply allow popups for inner iframe, so we don't have to use this function.
   * this function does not check if this is being called inside a popup-blocked iframe.
   *
   * @deprecated use allow-popup & open instead.
   **/
  static openUri(uri: string) {
    if (process.env.HOSTED ?? process.env.NEXT_PUBLIC_HOSTED) {
      this.request({
        namespace: PLUGIN_SDK_NS_BROWSER_API,
        key: PLUGIN_SDK_EK_BROWSER_OPEN_URI,
        data: {
          uri: uri,
        },
      });
    } else {
      open(uri);
    }
  }

  // region user feedbacks
  static notify(message: string, duration?: number) {
    this.request({
      namespace: PLUGIN_SDK_NS_NOTIFY_API,
      key: PLUGIN_SDK_EK_SIMPLE_NOTIFY,
      data: <NotifyRequest>{
        message: message,
        duration: duration,
      },
    });
  }

  static notifyCopied() {
    this.notify("Copied to clipboard", 1);
  }

  static focus(target: string, zoom?: number) {
    this.request({
      namespace: PLUGIN_SDK_NS_FOCUS_API,
      key: PLUGIN_SDK_EK_SIMPLE_FOCUS,
      data: <FocusRequest>{
        target: target,
        zoom: zoom,
      },
    });
  }

  // endregion user feedbacks

  // region canvas
  static async dropOnCanvas(data: DragAndDropOnCanvasRequest) {
    return await this.request({
      namespace: PLUGIN_SDK_NS_DRAG_AND_DROP,
      key: PLUGIN_SDK_EK_DRAG_AND_DROPPED,
      data: data,
    });
  }
  // endregion canvas

  static postMessage(event: TransportPluginEvent) {
    // console.log("::plugin-sdk post message", event);
    PluginSdk.window.postMessage(
      {
        pluginMessage: event,
      },
      "*"
    );
  }

  static promises: Map<string, { resolve; reject }> = new Map();

  static request<T = any>(event: BasePluginEvent): Promise<T> {
    // make id
    const requestId = this.makeRequetsId(event.key);

    return new Promise<T>((resolve, reject) => {
      // register to event / response que
      this.registerToEventQue(requestId, resolve, reject);

      // post message after registration is complete.
      this.postMessage({
        type: "request",
        origin: "app",
        ...event,
        id: requestId,
      });
    });
  }

  private static makeRequetsId(key: string): string {
    return `${key}-${reqid()}`;
  }

  private static registerToEventQue(requestId: string, resolve, reject) {
    this.promises.set(requestId, {
      resolve: resolve,
      reject: reject,
    });
  }

  private static removeFromEventQue(requestId: string) {
    this.promises.delete(requestId);
  }

  static handle(event: TransportPluginEvent) {
    if (event.type == "response") {
      this.handleResponse(event);
    }
  }

  private static handleResponse(event: TransportPluginEvent) {
    const promise = this.promises.get(event.id);
    if (!promise) {
      throw `no promise found to handle from event que with id ${
        event.id
      } current promises are.. ${[...this.promises.keys()]}`;
    }

    if (event.error) {
      promise.reject(event.error);
    } else {
      promise.resolve(event.data);
    }

    // remove resolved promise from que
    this.removeFromEventQue(event.id);
  }

  /**
   * raises custom app event/request
   * see PluginSdkService#onAppRequest for more detail
   */
  static appEvent(key: string, data: any) {
    this.request({
      namespace: PLUGIN_SDK_NS_APP_REQUEST_CUSTOM_ALL,
      key: key,
      data: data,
    });
  }
}
