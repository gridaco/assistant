import { nodes } from "@design-sdk/core";

export type ComponentLikeType =
  // componennt with/without variant compat (can be used for both, but use it only for non variant component)
  | "master-component"
  // instance of simple or varianted component
  | "instance-component"
  // base master component that is used as a constraint for variant set variants masters.
  | "base-master-component"
  // component set frame
  | "master-variant-set"
  // the single master variant of variant set
  | "master-variant-compoent"
  // the single instance variant
  | "master-variant-instance";

export type SchemaDefinitionLike =
  | ComponentLikeType
  // single layer - no matter where it lives under a componennt or a raw group, etc.
  | "single-layer-property"
  | "invalid-target";

export function analyzeNode(node): SchemaDefinitionLike {
  if (
    node?.origin != nodes.ReflectSceneNodeType.component &&
    node?.origin != nodes.ReflectSceneNodeType.variant_set &&
    node?.origin != nodes.ReflectSceneNodeType.instance
  ) {
    return "single-layer-property";
  } else if (node?.origin == nodes.ReflectSceneNodeType.component) {
    return "master-component";
  } else if (node?.origin == nodes.ReflectSceneNodeType.variant_set) {
    return "master-variant-set";
  } else if (node?.origin == nodes.ReflectSceneNodeType.instance) {
    return "instance-component";
  }
}
