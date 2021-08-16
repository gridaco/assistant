//
// where to get platform from ?

//
import { WebStorage } from "./web.storage";
const platform = "figma"; // this is static for now.

export async function setItem(key: string, value: any): Promise<void> {
  try {
    // TODO: support figma client storage
    new WebStorage().setItem(key, value);
  } catch (_) {
    //
  }
}

export async function getItem<T>(key: string): Promise<T> {
  try {
    // TODO: support figma client storage
    return new WebStorage<T>().getItem(key);
  } catch (_) {
    //
  }
}
