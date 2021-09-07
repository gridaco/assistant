import { mapGrandchildren } from "@design-sdk/core/utils";
import { getTextStyleById } from "@design-sdk/figma";
import { Minimatch } from "minimatch";
import {
  MdxParsedResponse,
  onService,
  ParseMdxRequest,
  Requests,
} from "./event";
import * as make from "./make";

///
/// register
onService(main_cb);
/// register
///

function main_cb(data: Requests) {
  switch (data.type) {
    case "request-parse-mdx-from-frame": {
      const frame = figma.getNodeById(data.frame);
      const res = frameToMdx(frame as FrameNode);
      if (res) {
        figma.ui.postMessage({
          type: "parse-mdx-from-frame-result", // TODO: make this constant shared key
          data: res,
        });
      } else {
        console.log(
          `tried to make mdx from frame ${frame}, but failed. no parsable content.`
        );
      }
      break;
    }
  }
}

function frameToMdx(frame: FrameNode): MdxParsedResponse | false {
  if (!isMdxFrame(frame)) {
    return false;
  }

  // currently we only loop trhough 1 depth under frame. TODO: this needs to be fixed.
  const lines = Array.from(frame.children)
    .sort(sort_by_x)
    .map((child) => {
      switch (child.type) {
        case "TEXT": {
          const text = child as TextNode;
          if (isTextMixed(text)) {
            // TODO: additional mixed style handling is required.
            return text.characters;
          } else {
            // since no style is mixed, we can return the value as is.
            const mdx_textstyle = isMdxTextStyle(
              getTextStyleById(text.textStyleId as string).name
            );
            switch (mdx_textstyle) {
              case false:
                return make.paragraph(text.characters);
              case "h1":
                return make.h1(text.characters);
              case "h2":
                return make.h2(text.characters);
              case "h3":
                return make.h3(text.characters);
              case "h4":
                return make.h4(text.characters);
              case "h5":
                return make.h5(text.characters);
              case "h6":
                return make.h6(text.characters);
            }
            return make.unknown(text.characters);
          }
          break;
        }
      }
    });

  return {
    mdx: lines.join("\n"),
  };
}

const sort_by_x = (a: { x: number }, b: { x: number }) => {
  return a.x - b.x;
};

/**
 * returns if text contains mixed content. e.g.
 *
 * ```mdx
 * this is a __mixed__ content example. also with **bold** texts.
 * ```
 * @returns
 */
function isTextMixed(text: TextNode): boolean {
  if (
    text.textStyleId === figma.mixed ||
    text.fontName === figma.mixed ||
    text.fontSize === figma.mixed ||
    text.fills === figma.mixed
    // add more validation here
  ) {
    return true;
  }
  return false;
}

/**
 * returns all text style that is included under target frame. (including grandchilds)
 * @param frame
 * @returns
 */
function readTextStyles(frame: FrameNode): string[] {
  const all_text: TextNode[] = mapGrandchildren(frame, null, undefined, (d) => {
    return d.type == "TEXT";
  });
  return [...new Set(all_text.map((t) => t.textStyleId))].map((id) => {
    return figma.getLocalTextStyles().find((ts) => ts.id === id).name;
  });
}

/**
 * validates if acceptable mdx textsyle by its name
 * @param textstyle
 */
function isMdxTextStyle(
  textstyle: string
): "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | false {
  const heading_pattern = `**/!(mdx-*, *-mdx, mdx)/heading[1-6]`;
  const mm = new Minimatch(heading_pattern);
  if (mm.match(textstyle)) {
    // assuming heading textstyle always ends with `heading[1-6]` based on above pattern.
    const level = textstyle.match(/[1-6]/g).pop();
    return (`h` + level) as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  }
  return false;
}

function isMdxFrame(frame: FrameNode): boolean {
  // 1. must be frame
  if (frame.type == "FRAME") {
    // must match path
    const glob_pattern = `(+(document|doc|docs|mdx|md|content))*/**/*.+(md|mdx)`;
    const mm = new Minimatch(glob_pattern);
    if (mm.match(frame.name)) {
      return true;
    }
  }
  return false;
}
