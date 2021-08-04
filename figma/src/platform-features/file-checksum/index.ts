export * as store from "./store";
import * as store from "./store";
import { parseFileId, analyze } from "@design-sdk/figma-url";

function saveUserInput(input: string) {
  parseFileId(input);
  // check if url
  // if not url, check if filekey (prevalidation with maxlength) // before, decode url param if encoded value.
  // parse input
  store.saveFileKey_userprovided("");
}
