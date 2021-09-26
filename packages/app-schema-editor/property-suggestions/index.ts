import {
  ReflectSceneNodeType,
  IReflectNodeReference,
  IReflectNodeRootShapeReference,
} from "@design-sdk/figma-node";
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

const global_properties = [
  "event.click",
  "event.double-click",
  "enabled",
  "opacity",
];

const default_type_map: { [key in PropertyAccessors]: string } = {
  "text.text": "string",
  "text.color": "string",
  color: "string",
  "image.src": "string",
  "vector.color": "string",
  //
  "event.click": "callback",
  "event.double-click": "callback",
  enabled: "boolean",
  opacity: "number",
  any: "any",
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
  console.log("get suggestion for", node.type, node);
  switch (node.type) {
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
      return get_frame_layer_property_suggestions(node);
    case ReflectSceneNodeType.line:
      return {
        type: "no-available-property",
        reason: "we do not support mapping data to line yet. use rect instead.",
      };
    case ReflectSceneNodeType.rectangle:
    case ReflectSceneNodeType.ellipse:
      return get_shape_layer_property_suggestions(
        node as IReflectNodeRootShapeReference
      );
    case ReflectSceneNodeType.vector:
      return get_vector_property_suggestions(node);

    case ReflectSceneNodeType.image: // handle this when conversion is properly implemented
      // Won't work.
      return get_single_image_fill_layer_property_suggestions(node);
    case ReflectSceneNodeType.constraint: // handle this when conversion is properly implemented
    case ReflectSceneNodeType.unknown:
      throw "unknown node type";

    case ReflectSceneNodeType.component:
    case ReflectSceneNodeType.variant_set:
      throw "logical error";
  }
  //
}

function get_frame_layer_property_suggestions(
  shape: IReflectNodeReference
): UserSuggestionReason[] {
  return [
    {
      type: "suggestion",
      to: "event.click",
      locate: "auto",
    },
    {
      type: "suggestion",
      to: "enabled",
      locate: "auto",
    },
  ];
}

function get_shape_layer_property_suggestions(
  shape: IReflectNodeRootShapeReference
): UserSuggestionReason[] {
  console.log("shape", shape);
  if (shape.fills?.length === 1) {
    switch (shape.fills[0].type) {
      case "IMAGE":
        return get_single_image_fill_layer_property_suggestions(shape);
      case "SOLID":
        return [
          {
            type: "suggestion",
            to: "color",
            locate: "auto",
          },
        ];
    }
  }

  return [];
}

function get_single_image_fill_layer_property_suggestions(
  image: IReflectNodeReference
): UserSuggestionReason[] {
  return [
    {
      type: "suggestion",
      to: "image.src",
      locate: "auto",
    },
  ];
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
