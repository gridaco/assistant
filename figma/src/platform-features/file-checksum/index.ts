export * as store from "./store";
import * as store from "./store";
import {
  parseFileId,
  analyze,
  FigmaFileOrNodeIdType,
  FigmaUrlType,
} from "@design-sdk/figma-url";

function saveUserInput(input: string): boolean {
  let fileid;
  try {
    const res = analyze(input);
    switch (res) {
      //
      case FigmaFileOrNodeIdType.fileid:
      case FigmaFileOrNodeIdType.maybe_fileid:
        fileid = input;
        break;
      case FigmaUrlType.node: // node is fileid + nodeid, CAN be used.
      case FigmaUrlType.file:
        fileid = parseFileId(input);
        break;
      //
      case FigmaFileOrNodeIdType.nodeid:
      case FigmaFileOrNodeIdType.maybe_nodeid:
      case FigmaUrlType.embed:
      case FigmaUrlType.empty:
        // these are not value that can be saved.
        return false;
    }

    if (fileid) {
      store.saveFileKey_userprovided(fileid);
    } else {
      return false;
    }
  } catch (_) {
    return false;
  }
}
