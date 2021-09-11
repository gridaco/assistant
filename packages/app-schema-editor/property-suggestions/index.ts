import type { IReflectNodeReference } from "@design-sdk/core/nodes/lignt";
import { ReflectSceneNodeType } from "@design-sdk/core/nodes";
import { PropertyAccessors } from "../types/single-layer-property-type";

type ConfigurableLayerContext =
  /**
   * frame with auto layout
   */
  | "frame-layouted"
  /**
   *
   */
  | "text"
  | "text-with-link"
  /**
   *
   */
  | "vector-with-color"
  /**
   *
   */
  | "shape-with-image";

const global_properties = ["on click", "on double click", "enabled", "opacity"];

const default_type_map: { [key in PropertyAccessors]: string } = {
  "text.text": "string",
  "text.color": "string",
  "image.src": "string",
  "vector.color": "string",
};

export interface NoSuggestionReason {
  type: "no-suggestions";
  reason: string;
}

export interface NoAvailablePropertyReason {
  type: "no-available-property";
  reason: string;
}

export interface Suggestion {
  type: "suggestion";
  locate: "auto" | "xpath" | "id" | "name";
  to: PropertyAccessors;
}

export type UserSuggestionReason =
  | NoSuggestionReason
  | NoAvailablePropertyReason
  | Suggestion;

export function get_suggestions(
  node: IReflectNodeReference
): UserSuggestionReason | UserSuggestionReason[] {
  switch (node.origin) {
    case ReflectSceneNodeType.group:
      return {
        type: "no-available-property",
        reason: "group is not configurable for components. use frame instead.",
      };

    case ReflectSceneNodeType.instance:
      return;
    case ReflectSceneNodeType.text:
      return get_text_property_suggestions(node);
    case ReflectSceneNodeType.frame:
      return;
    case ReflectSceneNodeType.line:
      return {
        type: "no-available-property",
        reason: "we do not support mapping data to line yet. use rect instead.",
      };
    case ReflectSceneNodeType.vector:
      return get_vector_property_suggestions(node);

    case ReflectSceneNodeType.image: // handle this when conversion is properly implemented
    case ReflectSceneNodeType.constraint: // handle this when conversion is properly implemented
    case ReflectSceneNodeType.unknown:
      throw "unknown node type";

    case ReflectSceneNodeType.component:
    case ReflectSceneNodeType.variant_set:
      throw "logical error";
  }
  //
}

function get_text_property_suggestions(
  text: IReflectNodeReference
): UserSuggestionReason[] {
  return [
    {
      type: "suggestion",
      to: "text.text",
      locate: "auto",
    },
    {
      type: "suggestion",
      to: "text.color",
      locate: "auto",
    },
  ];
}

function get_vector_property_suggestions(
  vector: IReflectNodeReference
): UserSuggestionReason[] {
  return [
    {
      type: "suggestion",
      to: "vector.color",
      locate: "auto",
    },
  ];
}
