export * as store from "./store";
import * as store from "./store";
import {
  parseFileId,
  analyze,
  FigmaFileOrNodeIdType,
  FigmaUrlType,
} from "@design-sdk/figma-url";

export function saveUserInput(input: string): boolean {
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

/**
 * global function for getting current file's trusted id.
 * return trusted value of file id. if non existing, throws.
 */
export function getFileId(): string {
  const stored = store.getFileKey_trusted();
  if (stored) {
    return stored;
  }
  throw "no trusted file id provided. (file id might be provided by user, but did not passed checksum - or did not run checksum)";
}
