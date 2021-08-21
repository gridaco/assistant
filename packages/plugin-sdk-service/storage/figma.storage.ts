import { IStorage } from "./istorage";
import { encode, decode } from "./payload-handle";
import { figma } from "@design-sdk/figma";
/**
 * storage on figma platform using `figma.clientStorage`
 */
export class FigmaStorage<T> implements IStorage<T> {
  async setItem<T>(key: string, value: T) {
    const _payload = encode(value);
    await figma.clientStorage.setAsync(key, _payload);
  }

  async getItem(key: string): Promise<T> {
    const _payload = await figma.clientStorage.getAsync(key);
    return decode<T>(_payload);
  }
}
