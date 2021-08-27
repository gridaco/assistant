import { ASSISTANT_PLUGIN_NAMESPACE__NOCHANGE } from "@core/constant";
import { checksum } from "./api";
/**
 * root node's id is always 0:0 on plugin api. [learn more](https://github.com/figma/plugin-typings/issues/13)
 */
const FIGMA_ROOT_NODE_ID_AS_ON_PLUGIN = "0:0";
const __ROOT_KEY = FIGMA_ROOT_NODE_ID_AS_ON_PLUGIN; // short hand of `FIGMA_ROOT_NODE_ID_AS_ON_PLUGIN` nothing special other than shortening

const __VALUE_KEY_userprovided = "figma-file-checksum-user-provided-filekey";
const __VALUE_KEY_trusted = "figma-filekey";
/**
 * save user provided file key - this cannot be trusted, needs to be checked.
 */
export async function saveFileKey_userprovided(filekey: string) {
  // save key to figma store
  await __save_on_both(__VALUE_KEY_trusted, filekey);
}

export function getFileKey_userprovided() {
  return __get_on_root(__VALUE_KEY_userprovided);
  //
}

/**
 * save checksum passed trusted file key. this is trusted and checked via backend.
 */
export async function saveFileKey_trusted(filekey: string) {
  // save key to figma store
  await __save_on_both(__VALUE_KEY_trusted, filekey);
}

/**
 * this may also return `undefined` if non set.
 */
export function getFileKey_trusted(): string | undefined {
  return __get_on_root(__VALUE_KEY_trusted);
}

export function hasFileKey_trusted(): boolean {
  if (getFileKey_trusted() !== undefined) {
    return true;
  }
  return false;
}

type ChecksumResult =
  /* checked and saved*/
  "checked" | "notmatch" | "retry";

export async function doChecksumAndSave(
  local: string
): Promise<ChecksumResult> {
  // do checksum and save the key if passed.

  try {
    const fileidnotrust = getFileKey_userprovided();
    const checked = await checksum(fileidnotrust); // TODO: call remote api for cheking the checksum

    if (checked) {
      saveFileKey_trusted(local);
      return "checked";
    } else {
      return "notmatch";
      //
    }
  } catch (_) {
    // server error
    return "retry";
  }
}

// ---- store utilities ----
async function __save_on_both(key: string, value: string, target?: string) {
  const _target = target || __ROOT_KEY;

  // todo: this may need explicit checking of if the data is set and synced. since plugin data is also accessible via rest api and goes trhough figma be server.
  // we currently have no efficient way to ensure if the data is saved and also accessible by api at the same period.
  // save on node's plugin data
  figma
    .getNodeById(_target)
    .setSharedPluginData(ASSISTANT_PLUGIN_NAMESPACE__NOCHANGE, key, value);

  // save on client storage with same k:v
  await figma.clientStorage.setAsync(key, value);
  //
}

function __get_on_root(key: string): string | undefined {
  try {
    return figma
      .getNodeById(__ROOT_KEY)
      .getSharedPluginData(ASSISTANT_PLUGIN_NAMESPACE__NOCHANGE, key);
  } catch (_) {
    return undefined;
  }
}

// ---- store utilities ----
