import { IStorage } from "./istorage";

/**
 * storage on figma platform using `figma.clientStorage`
 */
export class FigmaStorage<T> implements IStorage<T> {
  async getItem(key: string): Promise<T> {
    return (await figma.clientStorage.getAsync(key)) as T;
  }

  async setItem<T>(key: string, value: T) {
    await figma.clientStorage.setAsync(key, value);
  }
}
