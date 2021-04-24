import { normalizedName } from "@bridged.xyz/design-sdk/lib/features/key-annotations";
import { Figma } from "@bridged.xyz/design-sdk/lib/figma";
import { mapGrandchildren } from "@bridged.xyz/design-sdk/lib/utils/children";
import {
  buildVariantName_Figma,
  swapVariant,
} from "@bridged.xyz/design-sdk/lib/utils/variant";
import { PluginSdk } from "../../../utils/plugin-provider/plugin-app-sdk";
import { extractDataFromDataSourceNode } from "./data-source-node";
import { onService, _Event_DataMapper_GoodUserInputTransfer } from "./events";
import {
  //   ExampleDataMapperMockDataSource,
  __ExampleComponentProps,
} from "./example-data-source";

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
  console.log("onService", "data", data);

  targets.forEach((target) => {
    if ("children" in target) {
      mapDataToSelection(target as Figma.ChildrenMixin, data);
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

type DataSchema = object;

interface MappedData {}

function mapDataToSelection(selection: Figma.ChildrenMixin, data: DataSchema) {
  const grandchilds = mapGrandchildren<Figma.ChildrenMixin, Figma.SceneNode>(
    selection
  );

  grandchilds.forEach((c) => {
    for (const k of Object.keys(data)) {
      const propertyName = k;
      const propertyValue = data[k];

      console.log(
        "propertyName",
        propertyName,
        "normalizedName(c.name)",
        normalizedName(c.name),
        c.name
      );

      // check loosen name checking
      if (propertyName == normalizedName(c.name)) {
        if (c.type == "TEXT") {
          mapText(c, propertyValue);
        } else if (c.type == "INSTANCE") {
          console.error("TODO");
          // check if variant compat
          // mapVariant(c, propertyValue);
        } else {
          console.warn(
            `the type ${c.type} from "${c.name}", child of "${c.parent.name}" cannot be handled from data mapper`
          );
        }
      }
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
  console.log("finalString", finalString);

  // finally apply fully formed string
  console.log("text node", text);
  figma.loadFontAsync(text.fontName as FontName).then(() => {
    text.characters = finalString;
    console.log("text updated");
  });
  //   (figma.getNodeById(text.id) as TextNode).characters = finalString;

  return text;
}

function mapComponent(instance: Figma.InstanceNode, data: any) {
  // loop
}

const dummyVariantTypes = ["ellipse", "rectangle", "triangle", "poligon"];

function mapVariant(instance: Figma.InstanceNode, data: any) {
  // demo
  const type =
    dummyVariantTypes[Math.floor(Math.random() * dummyVariantTypes.length)];

  const name = buildVariantName_Figma(new Map([["type", type]]));
  // const
  swapVariant(instance, name);
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
