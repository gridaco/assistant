// TODO: use coli expression when ready
type IProperty = any;
// import { schema } from "coli";

/**
 * Storable object. this is stored to layer's metadata. do not modify this.
 */
export interface ISingleLayerPropertyMapping {
  /** the record is unique by (layerId + accessor) */
  id?: string;
  /** the id of the layer */
  layer: {
    id?: string;
    location?: LocateMode;
    /**
     * target property on layer.
     * for example if this is a text layer's property,
     * it can be mapped to text#characters or also text#fills[0].
     * but only once at a time.
     */
    propertyType?: PropertyAccessors;
  };
  schema: IProperty;
}

type LocateMode =
  | "auto"
  | {
      type: "xpath";
      xpath: string;
    };

export type PropertyAccessors =
  // text chars
  | "text.text"
  // single fill color
  | "text.color"
  // single fill image-like node image fill
  | "image.src"
  // single fill for vector (e.g. icon content vector)
  | "vector.color"
  // primary color when single color fill.
  | "color"

  //
  // region global properties
  | "event.click"
  | "event.double-click"
  | "enabled"
  | "opacity"
  // region global properties
  //
  | "any";
