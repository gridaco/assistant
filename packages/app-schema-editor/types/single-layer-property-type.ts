import { schema } from "coli";

/**
 * Storable object. this is stored to layer's metadata. do not modify this.
 */
export interface ISingleLayerPropertyMapping {
  /** the record is unique by (layerId + accessor) */
  id?: string;
  /** the id of the layer */
  layer: {
    id?: string;
    location: LocateMode;
    /**
     * target property on layer.
     * for example if this is a text layer's property,
     * it can be mapped to text#characters or also text#fills[0].
     * but only once at a time.
     */
    propertyType: TargetPropertyType;
  };
  schema: schema.IProperty;
}

type LocateMode =
  | "auto"
  | {
      type: "xpath";
      xpath: string;
    };

type TargetPropertyType = TextNodeEditableProperty;

type TextNodeEditableProperty =
  | { key: "text" }
  | { key: "text-style" } // with design tool's saved text style
  //
  | { key: "text-align" }; //?
