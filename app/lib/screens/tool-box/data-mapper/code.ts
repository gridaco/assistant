import { Figma } from "@bridged.xyz/design-sdk/lib/figma";
import { mapGrandchildren } from "@bridged.xyz/design-sdk/lib/utils/children";
import { PluginSdk } from "../../../utils/plugin-provider/plugin-app-sdk";
import { PluginSdkService } from "../../../utils/plugin-provider/plugin-service";
import {
  //   ExampleDataMapperMockDataSource,
  __ExampleComponentProps,
} from "./example-data-source";

export const DATA_SOURCE_NODE_PATTERN = "@//data-source/*";

PluginSdkService.onAppReqquest("custom-test", (data: any) => {
  console.log("data", data);
  const selection = Figma.figma.currentPage.selection;
  selection.forEach((s) => {
    if ("children" in s) {
      mapDataToSelection(s, data); //mockData.getSingleRandom()
    } else {
      PluginSdk.notify(
        "ignoring since one of the selection is not a type of frame or group"
      );
    }
  });
});

// PluginSdk.on(){

// }

// input
{
}

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

type DataSchema = __ExampleComponentProps;

interface MappedData {}

function mapDataToSelection(selection: Figma.ChildrenMixin, data: DataSchema) {
  console.log("start:: mapDataToSelection");
  console.log("selection", selection);
  const grandchilds = mapGrandchildren<Figma.ChildrenMixin, Figma.SceneNode>(
    selection
  );

  console.log("grandchilds", grandchilds);

  grandchilds.forEach((c) => {
    if (c.name == "title") {
      mapText(c as Figma.TextNode, data.title);
    } else if (c.name == "description") {
      mapText(c as Figma.TextNode, data.description);
    } else if (c.name == "email") {
      mapText(c as Figma.TextNode, data.email);
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
