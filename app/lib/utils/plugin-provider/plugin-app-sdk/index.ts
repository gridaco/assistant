import {
  BasePluginEvent,
  PLUGIN_SDK_EK_REQUEST_FETCH_ROOT_META,
  PLUGIN_SDK_EK_SIMPLE_NOTIFY,
  PLUGIN_SDK_NS_META_API,
  PLUGIN_SDK_NS_NOTIFY_API,
  TransportPluginEvent,
} from "../events";
import { BatchMetaFetchRequest } from "../interfaces/meta/meta.requests";
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

  static fetchMetadata(
    nodeId: string,
    namespace: string | undefined = undefined,
    key: string
  ) {}

  static fetchRootMetadata(key: string) {
    const data: BatchMetaFetchRequest = {
      key: key,
    };
    this.request({
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

  static request(event: BasePluginEvent) {
    // make id
    const requestId = this.makeRequetsId();

    // register to event / response que
    // TODO

    this.postMessage({
      type: "request",
      origin: "app",
      ...event,
      id: requestId,
    });
  }

  private static makeRequetsId(): string {
    return nanoid();
  }
}
