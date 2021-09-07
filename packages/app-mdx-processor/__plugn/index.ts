import { mapGrandchildren } from "@design-sdk/core/utils";
import { Minimatch } from "minimatch";

function frameToMdx(
  frame: FrameNode
):
  | {
      mdx_raw: string;
    }
  | false {
  if (!isMdxFrame(frame)) {
    return false;
  }
  //
  return {
    mdx_raw: "",
  };
}

/**
 * returns if text contains mixed content. e.g.
 *
 * ```mdx
 * this is a __mixed__ content example. also with **bold** texts.
 * ```
 * @returns
 */
function isTextMixed(): boolean {
  //
  throw " not implemented ";
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
