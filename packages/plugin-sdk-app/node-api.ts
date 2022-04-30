import { PluginSdk } from "./plugin-sdk";
import {
  PLUGIN_SDK_NS_GET_NODE,
  PLUGIN_SDK_EK_REQUEST_GET_NODE_BY_ID,
  PLUGIN_SDK_EK_REQUEST_RENAME,
  PLUGIN_SDK_NS_NODE,
  PLUGIN_SDK_EK_REQUEST_NAME,
} from "@plugin-sdk/core";
export class NodeApi {
  constructor(private readonly id: string) {}

  async get(): Promise<{
    id: string;
    name: string;
    x: number;
    y: number;
    type: string;
    width: number;
    height: number;
  }> {
    return await PluginSdk.request({
      namespace: PLUGIN_SDK_NS_GET_NODE,
      key: PLUGIN_SDK_EK_REQUEST_GET_NODE_BY_ID,
      data: { id: this.id },
    });
  }

  async getName() {
    return (
      await PluginSdk.request<{ name: string }>({
        namespace: PLUGIN_SDK_NS_NODE,
        key: PLUGIN_SDK_EK_REQUEST_NAME,
        data: { id: this.id, name: name },
      })
    ).name;
  }

  async rename(name: string) {
    return await PluginSdk.request({
      namespace: PLUGIN_SDK_NS_NODE,
      key: PLUGIN_SDK_EK_REQUEST_RENAME,
      data: { id: this.id, name: name },
    });
  }

  async resize(p: {
    width: number;
    height: number;
    options?: {
      withoutConstraints: boolean;
    };
  }) {
    //
  }

  async rescale(p: { scale: number }) {
    //
  }

  async remove() {
    //
  }

  async getPluginData(p?: { shared?: boolean }) {
    //
    return "";
  }

  async setPluginData(p?: { shared?: boolean }) {
    //
  }

  A() {
    // (figma.getNodeById("") as SceneNode).
  }
}
