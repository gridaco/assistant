import { IStorage } from "./istorage";
import { encode, decode } from "./payload-handle";
import { figma } from "@design-sdk/figma";
/**
 * storage on figma platform using `figma.clientStorage`
 */
export class FigmaStorage<T> implements IStorage<T> {
  async setItem<T>(key: string, value: T) {
    await figma.clientStorage.setAsync(key, encode(value));
  }

  async getItem(key: string): Promise<T> {
    return decode<T>(await figma.clientStorage.getAsync(key));
  }
}
