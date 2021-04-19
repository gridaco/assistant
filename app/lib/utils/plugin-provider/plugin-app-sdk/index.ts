import {
  BasePluginEvent,
  PLUGIN_KEYS,
  PLUGIN_NS,
  TransportPluginEvent,
} from "../events";
import {
  BatchMetaFetchRequest,
  NodeMetaFetchRequest,
  NodeMetaUpdateRequest,
} from "../interfaces/meta/meta.requests";
import { NotifyRequest } from "../interfaces/notify/notify.requests";
import { nanoid } from "nanoid";
import { DragAndDropOnCanvasRequest } from "../interfaces/dragdrop/dragdrop.requests";
import { ReflectSceneNode } from "@bridged.xyz/design-sdk/lib/nodes";

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
      namespace: PLUGIN_NS.PLUGIN_SDK_NS_META_API,
      key: PLUGIN_KEYS.PUGIN_SDK_EK_REQUEST_UPDATE_NODE_META,
      data: request,
    });
  }

  static async fetchMetadata(request: NodeMetaFetchRequest): Promise<any> {
    return this.request({
      namespace: PLUGIN_NS.PLUGIN_SDK_NS_META_API,
      key: PLUGIN_KEYS.PLUGIN_SDK_EK_REQUEST_FETCH_NODE_META,
      data: request,
    });
  }

  static async fetchMainComponentMetadata(request: NodeMetaFetchRequest) {
    return this.request({
      namespace: PLUGIN_NS.PLUGIN_SDK_NS_META_API,
      key: PLUGIN_KEYS.PLUGIN_SDK_EK_REQUEST_FETCH_NODE_MAIN_COMPONENT_META,
      data: request,
    });
  }

  static async updateMainComponentMetadata(request: NodeMetaUpdateRequest) {
    return this.request({
      namespace: PLUGIN_NS.PLUGIN_SDK_NS_META_API,
      key: PLUGIN_KEYS.PUGIN_SDK_EK_REQUEST_UPDATE_MAIN_COMPONENT_META,
      data: request,
    });
  }

  static fetchRootMetadata(key: string): Promise<any> {
    const data: BatchMetaFetchRequest = {
      key: key,
    };
    return this.request({
      namespace: PLUGIN_NS.PLUGIN_SDK_NS_META_API,
      key: PLUGIN_KEYS.PLUGIN_SDK_EK_REQUEST_FETCH_ROOT_META,
      data: data,
    });
  }

  // endregion metadata

  // region user feedbacks
  static notify(message: string, duration?: number) {
    this.request({
      namespace: PLUGIN_NS.PLUGIN_SDK_NS_NOTIFY_API,
      key: PLUGIN_KEYS.PLUGIN_SDK_EK_SIMPLE_NOTIFY,
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
      namespace: PLUGIN_NS.PLUGIN_SDK_NS_DRAG_AND_DROP,
      key: PLUGIN_KEYS.PLUGIN_SDK_EK_DRAG_AND_DROPPED,
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
    return `${key}-${nanoid()}`;
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
}
