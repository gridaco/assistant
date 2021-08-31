import { PluginSdk } from "./plugin-sdk";
import {
  PLUGIN_SDK_NS_GET_NODE,
  PLUGIN_SDK_EK_REQUEST_GET_NODE_BY_ID,
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
