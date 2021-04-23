import {
  BasePluginEvent,
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
  TransportPluginEvent,
} from "../events";
import {
  BatchMetaFetchRequest,
  NodeMetaFetchRequest,
  NodeMetaUpdateRequest,
} from "../interfaces/meta/meta.requests";
import { NotifyRequest } from "../interfaces/notify/notify.requests";
import { DragAndDropOnCanvasRequest } from "../interfaces/dragdrop/dragdrop.requests";
import type { ReflectSceneNode } from "@bridged.xyz/design-sdk/lib/nodes";
import { reqid } from "../_id";
import { ASSISTANT_PLUGIN_NAMESPACE } from "../../../constants";

export class PluginSdk {
  static window: Window;
  static initializeWindow(window: Window) {
    this.window = window;
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

  // enderegion general canvas api

  // region network api
  static get(params: any) {
    throw "not implmtd";
  }

  static post(params: any) {
    throw "not implmtd";
  }

  // endregion networ api

  // region metadata
  static updateMetadata(request: NodeMetaUpdateRequest) {
    return this.request({
      namespace: PLUGIN_SDK_NS_META_API,
      key: PUGIN_SDK_EK_REQUEST_UPDATE_NODE_META,
      data: request,
    });
  }

  /**
   * fetches the metadata with bridged default namespace provided.
   */
  static async fetchMetadata_bridged<T = any>(
    on: string,
    key: string
  ): Promise<T> {
    return this.fetchMetadata<T>({
      id: on,
      key: key,
      namespace: ASSISTANT_PLUGIN_NAMESPACE,
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
      key: key,
    };
    return this.request({
      namespace: PLUGIN_SDK_NS_META_API,
      key: PLUGIN_SDK_EK_REQUEST_FETCH_ROOT_META,
      data: data,
    });
  }

  // endregion metadata

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
