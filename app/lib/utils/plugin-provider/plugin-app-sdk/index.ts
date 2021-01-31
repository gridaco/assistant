import {
  BasePluginEvent,
  PLUGIN_SDK_EK_REQUEST_FETCH_NODE_META,
  PLUGIN_SDK_EK_REQUEST_FETCH_ROOT_META,
  PLUGIN_SDK_EK_SIMPLE_NOTIFY,
  PLUGIN_SDK_NS_META_API,
  PLUGIN_SDK_NS_NOTIFY_API,
  TransportPluginEvent,
} from "../events";
import {
  BatchMetaFetchRequest,
  NodeMetaFetchRequest,
} from "../interfaces/meta/meta.requests";
import { NotifyRequest } from "../interfaces/notify/notify.requests";
import { nanoid } from "nanoid";

export class PluginSdk {
  static window: Window;
  static initializeWindow(window: Window) {
    this.window = window;
  }

  // region network api
  static get(params: any) {
    throw "not implmtd";
  }

  static post(params: any) {
    throw "not implmtd";
  }

  // endregion networ api

  // region metadata
  static setMetadata(
    nodeId: string,
    namespace: string | undefined = undefined,
    key: string,
    value: string
  ) {}

  static async fetchMetadata(request: NodeMetaFetchRequest): Promise<any> {
    return this.request({
      namespace: PLUGIN_SDK_NS_META_API,
      key: PLUGIN_SDK_EK_REQUEST_FETCH_NODE_META,
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
    const requestId = this.makeRequetsId();

    // register to event / response que

    this.postMessage({
      type: "request",
      origin: "app",
      ...event,
      id: requestId,
    });

    return new Promise<T>((resolve, reject) => {
      this.registerToEventQue(requestId, resolve, reject);
    });
  }

  private static makeRequetsId(): string {
    return nanoid();
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
    if (event.error) {
      promise.reject(event.error);
    } else {
      promise.resolve(event.data);
    }

    // remove resolved promise from que
    this.removeFromEventQue(event.id);
  }
}
