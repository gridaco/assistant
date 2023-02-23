import { utils } from "@design-sdk/core";
import { variant } from "@design-sdk/figma/features";
import { Figma } from "@design-sdk/figma";
import { PluginSdk } from "@plugin-sdk/app";
import { extractDataFromDataSourceNode } from "../data-source-node";
import { onService, _Event_DataMapper_GoodUserInputTransfer } from "./events";

export const TEMPLATE_NODE_PATTERN = "@//template-for-manipulation/*";

// register callback
onService(main_cb);

// main callback
function main_cb(evt: _Event_DataMapper_GoodUserInputTransfer) {
  const datasourceNode = Figma.figma.getNodeById(
    evt.sourceNodeId
  ) as Figma.SceneNode;
  const targets = evt.targetNodesId.map((id) => Figma.figma.getNodeById(id));
  const data = extractDataFromDataSourceNode(datasourceNode);

  targets.forEach((target) => {
    if ("children" in target) {
      mapDataToSelection(target as Figma.SceneNode, data);
    } else {
      PluginSdk.notify(
        "ignoring since one of the selection is not a type of frame or group"
      );
    }
  });
}

// input

// schema

// mapping schema

// generated mapping

// apply

enum LocatingMethod {
  tree,
  id,
  name,
  tree_and_name,
}

interface TreeLocation {}

type LocationData =
  | { type: LocatingMethod.id; id: string }
  | { type: LocatingMethod.name; name: string }
  | { type: LocatingMethod.tree; treeLocation: TreeLocation }
  | {
      type: LocatingMethod.tree_and_name;
      name: string;
      treeLocation: TreeLocation;
    };

interface MappingSchema {
  name: string;
  properties: {
    name: string;
    loaction: LocationData;
    type: DataSchema;
  }[];
}

type DataSchema = Map<string, Object>;

interface MappedData {}

function mapDataToSelection(selection: Figma.SceneNode, data: DataSchema) {
  // handle root selection's instance swap if possible and requested
  // this is because figma's variant is actually same as property and input data will have same level with this variant setting.
  // this can cause some untracked bugs, but this is the right way to be.
  if (selection.type == "INSTANCE") {
    const replaced = mapVariant_try(selection, data);
    if (replaced) {
      selection = replaced;
    }
  }

  const grandchilds = utils.mapGrandchildren<
    Figma.ChildrenMixin,
    Figma.SceneNode
  >(
    // this is fine. it's casted on this function's caller
    // if this is changed, fix this statement
    selection as Figma.ChildrenMixin
  );

  grandchilds.forEach((c) => {
    // handle componentized layers
    if (c.type == "INSTANCE") {
      mapVariant_try(c, data);
    }

    for (const k of Object.keys(data)) {
      const propertyName = k;
      const propertyValue = data[k];

      // handle non componentized layers
      // check loosen name checking
      // FIXME: temporarilly disabled.
      // if (propertyName == assert - plus.utils.normalizedName(c.name)) {
      //   if (c.type == "TEXT") {
      //     mapText(c, propertyValue);
      //   } else {
      //     console.warn(
      //       `the type ${c.type} from "${c.name}", child of "${c.parent.name}" cannot be handled from data mapper`
      //     );
      //   }
      // }
    }
  });
}

type TextNodeDataEntryValue = string | number;
function mapText(
  text: Figma.TextNode,
  data: TextNodeDataEntryValue
): Figma.TextNode {
  const stringfyRaw = (v: TextNodeDataEntryValue): string => {
    if (typeof v == "string") {
      // return string input as is
      return v;
    } else if (typeof v == "number") {
      // convert number to string
      // todo - add number formatter
      return v.toString();
    }
  };

  const stringfyFull = (
    raw: string,
    formatting?: {
      prefix?: string;
      suffix?: string;
      transform?: {
        regex: RegExp;
        apply: "before" | "after";
      };
    }
  ) => {
    return `${raw}`;
  };

  const finalString = stringfyFull(stringfyRaw(data) /** options here */);

  // finally apply fully formed string
  figma.loadFontAsync(text.fontName as FontName).then(() => {
    text.characters = finalString;
  });
  //   (figma.getNodeById(text.id) as TextNode).characters = finalString;

  return text;
}

function mapComponent(instance: Figma.InstanceNode, data: any) {
  // loop
}

/**
 * this is a safe-to-use function for "mapDataToSelection" the logics are complex so everything is handled here, which non variant component can also be put as input - which will be safely ignored.
 * this also means it requires caution for use
 * @param instance
 * @param data
 */
function mapVariant_try(
  instance: Figma.InstanceNode,
  data: DataSchema
): Figma.InstanceNode {
  let replaced: Figma.InstanceNode;
  // 1. lookup master variant set
  // 2. check if variant compat
  if (instance.mainComponent.parent.type == "COMPONENT_SET") {
    const thisVariantName = instance.mainComponent.name;

    // 3. get property maps and check if value is assignable to variant
    const variantset = instance.mainComponent.parent as Figma.ComponentSetNode;
    const _names = variant.getVariantNamesSetFromRawNode_Figma(variantset);
    const set = variant.extractTypeFromVariantNames_Figma(_names);

    for (const s of set) {
      const value = data[s.key];
      const _isCompat =
        value && typeof s.type == "symbol"
          ? s.type == value
          : (s.type as variant.FigmaEnum).values.includes(value);

      if (_isCompat) {
        // 4. map the variant

        const swappingName = variant.buildVariantNameIncluding_Figma({
          including: {
            swapPropertyName: s.key,
            swapPropertyValue: value,
            thisOriginName: thisVariantName,
          },
          existing: { names: _names },
        });

        // check if this already set like the input data and do not require swapping
        if (swappingName == thisVariantName) {
          return;
        }

        replaced = variant.swapVariant(instance, swappingName);
        break;
      }
    }
  }

  return replaced;
}

type ImageCompatNode = Figma.RectangleNode | Figma.EllipseNode;
function mapImage(image: ImageCompatNode): ImageCompatNode {
  const imageData = undefined;
  const newFigmaImage = Figma.figma.createImage(imageData);

  image.fills[0] = <Figma.ImagePaint>{
    imageHash: newFigmaImage.hash,
    scaleMode: "CROP",
  };

  return image;
}

// finds layer with tree location, not id or other
function findLayerWithWithTreeLocation() {}
