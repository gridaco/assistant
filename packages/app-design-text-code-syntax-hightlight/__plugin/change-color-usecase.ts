import { highlightAuto } from "highlight.js";
import * as colorSchema from "../color-schema";
import { SchemaAndLanguage } from "../models/schema-and-language";
import xpath from "xpath";
const dom = require("xmldom").DOMParser;

function* walkTree(node) {
  yield node;
  let children = node.childNodes;
  if (children) {
    for (let i = 0; i < children.length; i++) {
      yield* walkTree(children[i]);
    }
  }
}

function countLength(node): number {
  let lng: number = 0;

  if (node.childNodes) {
    /* ElementNode */
    for (let i = 0; i < node.childNodes.length; i++) {
      lng = lng + countLength(node.childNodes[i]);
    }
  } else {
    /* TextNode */
    lng = lng + node.length;
  }

  return lng;
}

const changeColorUsecase = (
  selections: ReadonlyArray<SceneNode>,
  schemaAndLanguage: SchemaAndLanguage
) => {
  selections.map((item) => {
    if (item.type == "TEXT") {
      let itm: TextNode = item;

      const result = highlightAuto(itm.characters, [
        schemaAndLanguage.language,
      ]);
      const str: string = `<div>${result.value}</div>`;
      // const str = "";
      const doc = new dom().parseFromString(str);

      let nodes: Node = xpath.select("//div", doc)[0] as Node;
      let results = [];
      let length: number = 0;

      for (let i = 0; i < nodes.childNodes.length; i++) {
        let walker = walkTree(nodes.childNodes[i]);
        let res;

        while (!(res = walker.next()).done) {
          let node = res.value;

          if (node.data) {
            length = length + node.length;
          } else {
            results.push({
              length: countLength(node),
              lengthStart: length,
              lengthEnd: length + countLength(node),
              className: node.attributes[0].nodeValue,
            });
          }
        }
      }
      itm.setRangeFills(0, itm.characters.length, [
        <Paint>colorSchema[schemaAndLanguage.colorSchema]["hljs"],
      ]);

      results.map((res) => {
        let color = colorSchema[schemaAndLanguage.colorSchema][res.className];
        color = color
          ? color
          : <Paint>colorSchema[schemaAndLanguage.colorSchema]["hljs"];

        itm.setRangeFills(res.lengthStart, res.lengthEnd, [color]);
      });
      figma.notify("Completed.", { timeout: 1 });
    } else {
      figma.notify("Please select Textbox before running.");
    }
  });

  if (selections.length == 0) {
    figma.notify("Please select Textbox before running.");
  }
};

export default changeColorUsecase;
