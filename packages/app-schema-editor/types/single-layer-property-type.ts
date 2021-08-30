import { schema } from "coli";

/**
 * Storable object. this is stored to layer's metadata. do not modify this.
 */
export interface ISingleLayerProperty {
  schema: schema.IProperty;
  locateMode: string;
  /**
   * target property on layer.
   * for example if this is a text layer's property,
   * it can be mapped to text#characters or also text#fills[0].
   * but only once at a time.
   */
  targetProperty: TargetProperty;
}

type TargetProperty = TextNodeEditableProperty;

type TextNodeEditableProperty =
  | { key: "text" }
  | { key: "text-style" } // with design tool's saved text style
  //
  | { key: "text-align" }; //?
