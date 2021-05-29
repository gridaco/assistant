/**
 * storage on figma platform using `figma.clientStorage`
 */
export class FigmaStorage {
  static async getItem<T>(key: string): Promise<T> {
    return (await figma.clientStorage.getAsync(key)) as T;
  }

  static async setItem<T>(key: string, value: T) {
    await figma.clientStorage.setAsync(key, value);
  }
}
