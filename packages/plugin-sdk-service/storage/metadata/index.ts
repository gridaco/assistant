import { plugin as figma } from "@design-sdk/figma";
import { IStorage } from "../istorage";
import { decode, encode } from "../payload-handle";

export class LayerMetadataStorage<T = string> implements IStorage<T> {
  constructor(readonly id: string, readonly namespace: string) {}

  getItem(key: string): Promise<T> {
    return decode(
      figma.getNodeById(this.id).getSharedPluginData(this.namespace, key)
    );
  }

  setItem(key: string, value: T) {
    figma
      .getNodeById(this.id)
      .setSharedPluginData(this.namespace, key, encode(value));
  }
}

// function getMaincomponentLike(nodeID: string): Figma.SceneNode {
//   if (!nodeID) {
//     throw `node id is required in order to perform meta fetch`;
//   }
//   const node = figma?.getNodeById(nodeID);
//   let targetNode: Figma.SceneNode;
//   if (node.type == "INSTANCE") {
//     targetNode = node.mainComponent;
//   } else if (node.type == "COMPONENT") {
//     targetNode = node;
//   } else if (node.type == "COMPONENT_SET") {
//     targetNode = node;
//   } else {
//     throw `node ${node.id} of type ${node.type} is not supported for component meta manipulation.`;
//   }
//   return targetNode;
// }
