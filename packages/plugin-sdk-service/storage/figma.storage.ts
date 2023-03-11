import { IStorage } from "./istorage";
import { encode, decode } from "./payload-handle";
import { plugin } from "@design-sdk/figma";
/**
 * storage on figma platform using `figma.clientStorage`
 */
export class FigmaStorage<T> implements IStorage<T> {
  async setItem<T>(key: string, value: T) {
    const _payload = encode(value);
    await plugin.clientStorage.setAsync(key, _payload);
  }

  async getItem(key: string): Promise<T> {
    const _payload = await plugin.clientStorage.getAsync(key);
    return decode<T>(_payload);
  }
}
